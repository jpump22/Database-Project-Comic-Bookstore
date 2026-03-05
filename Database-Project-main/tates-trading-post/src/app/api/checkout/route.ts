import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, setPageContext } from '@/utilities/db'
import { CartItem } from '@/contexts/CartContext'
import {
  findCustomerByEmail,
  createCustomer,
  updateCustomer,
  createPurchaseHistory,
  updateInventoryAfterPurchase,
  findProductPopularity,
  updateProductPopularity,
  createProductPopularityRecord,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '@/queries/checkout'

interface CustomerData {
  firstName: string
  lastName: string
  email: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
}

interface CheckoutRequest {
  customer: CustomerData
  items: CartItem[]
  totalPrice: number
}

export async function POST(request: NextRequest) {
  setPageContext('CHECKOUT API')
  const db = getDatabase()

  try {
    const body: CheckoutRequest = await request.json()
    const { customer, items } = body

    // Validate required fields
    if (!customer.firstName || !customer.lastName || !customer.email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Begin transaction
    db.prepare(beginTransaction).run()

    try {
      // 1. Check if customer already exists by email
      const existingCustomer = db
        .prepare(findCustomerByEmail)
        .get(customer.email) as { id: number } | undefined

      let customerId: number

      if (existingCustomer) {
        // Update existing customer
        customerId = existingCustomer.id

        db.prepare(updateCustomer).run(
          customer.firstName,
          customer.lastName,
          customerId
        )
      } else {
        // Create new customer
        const result = db.prepare(createCustomer).run(
          customer.firstName,
          customer.lastName,
          customer.email
        )

        customerId = result.lastInsertRowid as number
      }

      // 2. Create purchase history records for each item
      const purchaseStmt = db.prepare(createPurchaseHistory)

      for (const item of items) {
        purchaseStmt.run(
          customerId,
          item.id,
          item.quantity,
          item.price
        )
      }

      // 3. Update inventory and product popularity (optional - won't fail if no inventory)
      // (This will be handled by the purchaseHistoryAfterChange hook automatically
      // when records are created via Payload, but since we're using raw SQL,
      // we need to do it manually here)

      const inventoryStmt = db.prepare(updateInventoryAfterPurchase)
      const getPopularityStmt = db.prepare(findProductPopularity)
      const updatePopularityStmt = db.prepare(updateProductPopularity)
      const createPopularityStmt = db.prepare(createProductPopularityRecord)

      for (const item of items) {
        // Update inventory if exists (won't fail if no inventory record)
        try {
          inventoryStmt.run(item.quantity, item.quantity, item.id)
        } catch (e) {
          // Ignore inventory errors for demo purposes
          console.log(`No inventory record for product ${item.id}, skipping inventory update`)
        }

        // Update or create product popularity
        const popularity = getPopularityStmt.get(item.id) as { id: number } | undefined

        if (popularity) {
          updatePopularityStmt.run(item.quantity, popularity.id)
        } else {
          createPopularityStmt.run(item.id, item.quantity)
        }
      }

      // Commit transaction
      db.prepare(commitTransaction).run()

      return NextResponse.json({
        success: true,
        customerId: customerId,
        message: 'Purchase completed successfully',
      })
    } catch (error) {
      // Rollback transaction on error
      db.prepare(rollbackTransaction).run()
      throw error
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred during checkout',
      },
      { status: 500 }
    )
  }
}

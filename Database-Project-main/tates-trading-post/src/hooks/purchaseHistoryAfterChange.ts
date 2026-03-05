import type { CollectionAfterChangeHook } from 'payload'
import Database from 'better-sqlite3'
import path from 'path'
import {
  getInventoryByProductId,
  decrementInventoryQuantity,
  getProductPopularity,
  incrementProductPurchases,
  createProductPopularity,
} from '@/queries/inventory'

export const purchaseHistoryAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Only run on create
  if (operation !== 'create') return doc

  const { product, quantity } = doc

  // Raw SQL approach - comment out Payload API
  const dbPath = path.join(process.cwd(), 'cms.db')
  const db = new Database(dbPath)

  try {
    // 1. Decrement inventory
    // const inventoryRecords = await req.payload.find({
    //   collection: 'inventory',
    //   where: {
    //     product: {
    //       equals: typeof product === 'string' ? product : product.id,
    //     },
    //   },
    // })
    const productId = typeof product === 'string' ? product : product.id

    const inventoryRecords = db.prepare(getInventoryByProductId).all(productId)

    if (inventoryRecords.length > 0) {
      // Find first available inventory with sufficient quantity
      // Note: isOnHold field doesn't exist in schema we saw, so removed that check
      const availableInventory = inventoryRecords.find(
        (inv: any) => inv.quantity >= quantity
      )

      if (availableInventory) {
        // await req.payload.update({
        //   collection: 'inventory',
        //   id: availableInventory.id,
        //   data: {
        //     quantity: availableInventory.quantity - quantity,
        //   },
        // })
        db.prepare(decrementInventoryQuantity).run(quantity, availableInventory.id)
      }
    }

    // 2. Update product popularity for all time windows
    const timeWindows = ['ALL_TIME', 'Y30D', 'Y7D']

    for (const timeWindow of timeWindows) {
      // const existingPopularity = await req.payload.find({
      //   collection: 'product-popularity',
      //   where: {
      //     and: [
      //       { product: { equals: productId } },
      //       { timeWindow: { equals: timeWindow } },
      //     ],
      //   },
      // })

      // Note: The schema doesn't have timeWindow field, so we'll just track overall popularity
      const existingPopularity = db.prepare(getProductPopularity).get(productId)

      if (existingPopularity) {
        // await req.payload.update({
        //   collection: 'product-popularity',
        //   id: record.id,
        //   data: {
        //     purchases: record.purchases + quantity,
        //     lastComputedAt: new Date().toISOString(),
        //   },
        // })
        db.prepare(incrementProductPurchases).run(quantity, existingPopularity.id)
      } else {
        // await req.payload.create({
        //   collection: 'product-popularity',
        //   data: {
        //     product: productId,
        //     timeWindow,
        //     views: 0,
        //     addToCarts: 0,
        //     purchases: quantity,
        //     lastComputedAt: new Date().toISOString(),
        //   },
        // })
        db.prepare(createProductPopularity).run(productId, quantity)
      }
    }
  } catch (error) {
    console.error('Error in purchaseHistoryAfterChange hook:', error)
    // req.payload.logger.error({
    //   err: error,
    //   msg: 'Error in purchaseHistoryAfterChange hook',
    // })
  } finally {
    db.close()
  }

  return doc
}

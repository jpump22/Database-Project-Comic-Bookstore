import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, setPageContext } from '@/utilities/db'

export async function POST(request: NextRequest) {
  try {
    const { productId, action } = await request.json()

    if (!productId || !action) {
      return NextResponse.json({ error: 'Missing productId or action' }, { status: 400 })
    }

    setPageContext(`TRACK API (${action.toUpperCase()})`)
    const db = getDatabase()

    // Check if popularity record exists
    const existing = db
      .prepare('SELECT id FROM a_product_popularity WHERE product_id = ?')
      .get(productId) as { id: number } | undefined

    if (action === 'view') {
      if (existing) {
        // Increment views
        db.prepare(`
          UPDATE a_product_popularity
          SET views = views + 1,
              updated_at = datetime('now')
          WHERE product_id = ?
        `).run(productId)
      } else {
        // Create new record with 1 view
        db.prepare(`
          INSERT INTO a_product_popularity (product_id, views, add_to_carts, purchases, created_at, updated_at)
          VALUES (?, 1, 0, 0, datetime('now'), datetime('now'))
        `).run(productId)
      }
    } else if (action === 'cart') {
      if (existing) {
        // Increment cart adds
        db.prepare(`
          UPDATE a_product_popularity
          SET add_to_carts = add_to_carts + 1,
              updated_at = datetime('now')
          WHERE product_id = ?
        `).run(productId)
      } else {
        // Create new record with 1 cart add
        db.prepare(`
          INSERT INTO a_product_popularity (product_id, views, add_to_carts, purchases, created_at, updated_at)
          VALUES (?, 0, 1, 0, datetime('now'), datetime('now'))
        `).run(productId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Failed to track action' }, { status: 500 })
  }
}

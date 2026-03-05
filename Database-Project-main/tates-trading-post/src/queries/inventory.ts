/**
 * Inventory & Purchase History SQL Queries
 *
 * This file contains all SQL queries related to:
 * - Inventory management
 * - Product popularity tracking
 * - Purchase history
 */

// ============================================
// INVENTORY QUERIES
// ============================================

/**
 * Get a_inventory records for a specific product
 * Used in: Purchase history hooks to check stock
 */
export const getInventoryByProductId = `
  SELECT * FROM a_inventory
  WHERE product_id = ?
`

/**
 * Update a_inventory quantity (decrement)
 * Used in: Purchase history hooks after a purchase
 * Parameters: quantity to subtract, a_inventory ID
 */
export const decrementInventoryQuantity = `
  UPDATE a_inventory
  SET quantity = quantity - ?,
      updated_at = datetime('now')
  WHERE id = ?
`

// ============================================
// PRODUCT POPULARITY QUERIES
// ============================================

/**
 * Get product popularity record by product ID
 * Tracks views, add-to-carts, and purchases
 */
export const getProductPopularity = `
  SELECT * FROM a_product_popularity
  WHERE product_id = ?
`

/**
 * Update product popularity (increment purchases)
 * Used in: Purchase history hooks
 * Parameters: quantity purchased, popularity record ID
 */
export const incrementProductPurchases = `
  UPDATE a_product_popularity
  SET purchases = purchases + ?,
      updated_at = datetime('now')
  WHERE id = ?
`

/**
 * Create new product popularity record
 * Used when a product is purchased for the first time
 * Parameters: product_id, initial purchase quantity
 */
export const createProductPopularity = `
  INSERT INTO a_product_popularity (product_id, views, add_to_carts, purchases, created_at, updated_at)
  VALUES (?, 0, 0, ?, datetime('now'), datetime('now'))
`

// ============================================
// INVENTORY ANALYTICS QUERIES
// ============================================

/**
 * Get low stock a_products
 * Demonstrates: Comparing fields (quantity vs reorderLevel)
 */
export const getLowStockProducts = `
  SELECT i.*, p.title as product_title
  FROM a_inventory i
  LEFT JOIN a_products p ON i.product_id = p.id
  WHERE i.quantity <= i.reorder_level AND i.status != 'discontinued'
  ORDER BY i.quantity ASC
`

/**
 * Get total a_inventory value by category
 * Demonstrates: JOIN, SUM, GROUP BY with calculations
 */
export const getInventoryValueByCategory = `
  SELECT p.category, SUM(p.price * i.quantity) as total_value, COUNT(i.id) as item_count
  FROM a_inventory i
  LEFT JOIN a_products p ON i.product_id = p.id
  GROUP BY p.category
  ORDER BY total_value DESC
`

/**
 * Get out of stock a_products
 * Demonstrates: Simple filtering
 */
export const getOutOfStockProducts = `
  SELECT i.*, p.title as product_title, p.price
  FROM a_inventory i
  LEFT JOIN a_products p ON i.product_id = p.id
  WHERE i.quantity = 0
  ORDER BY p.title ASC
`

/**
 * Get total a_inventory count
 * Demonstrates: SUM aggregate
 */
export const getTotalInventoryCount = `
  SELECT SUM(quantity) as total_items FROM a_inventory
`

// ============================================
// PURCHASE HISTORY QUERIES
// ============================================

/**
 * Get recent purchases
 * Demonstrates: ORDER BY date with LIMIT
 */
export const getRecentPurchases = `
  SELECT ph.*, p.title as product_title, c.first_name, c.last_name
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  LEFT JOIN a_customers c ON ph.customer_id = c.id
  ORDER BY ph.purchase_date DESC
  LIMIT 20
`

/**
 * Get purchases by customer
 * Demonstrates: Filtering by relationship
 */
export const getPurchasesByCustomer = `
  SELECT ph.*, p.title as product_title, p.price
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  WHERE ph.customer_id = ?
  ORDER BY ph.purchase_date DESC
`

/**
 * Get total sales by product
 * Demonstrates: SUM with GROUP BY
 */
export const getTotalSalesByProduct = `
  SELECT p.title, SUM(ph.total_price) as total_sales, SUM(ph.quantity) as units_sold
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  GROUP BY p.id, p.title
  ORDER BY total_sales DESC
`

// ============================================
// POPULARITY QUERIES
// ============================================

/**
 * Get most popular a_products (by purchases)
 * Demonstrates: ORDER BY aggregate field
 */
export const getMostPopularProducts = `
  SELECT
    p.*,
    pp.purchases,
    pp.views,
    pp.add_to_carts,
    pt.name as productType_name,
    pub.name as publisher_name
  FROM a_product_popularity pp
  LEFT JOIN a_products p ON pp.product_id = p.id
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  ORDER BY pp.purchases DESC
  LIMIT 20
`

/**
 * Checkout & Shopping Cart SQL Queries
 *
 * This file contains all SQL queries related to the shopping cart checkout process, including:
 * - Customer creation/update during checkout
 * - Purchase history creation
 * - Inventory updates after purchase
 * - Product popularity tracking after purchase
 *
 * These queries work together to complete a purchase transaction.
 */

// ============================================
// CUSTOMER CHECKOUT QUERIES
// ============================================

/**
 * Find existing customer by email
 * Used during checkout to check if customer already exists
 * Parameters: email
 */
export const findCustomerByEmail = `
  SELECT id FROM a_customers WHERE email = ?
`

/**
 * Create new customer during checkout
 * Used when a new customer makes a purchase
 * Parameters: firstName, lastName, email
 */
export const createCustomer = `
  INSERT INTO a_customers (
    first_name,
    last_name,
    email,
    is_active,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))
`

/**
 * Update existing customer information during checkout
 * Used when an existing customer makes a purchase
 * Parameters: firstName, lastName, customerId
 */
export const updateCustomer = `
  UPDATE a_customers
  SET first_name = ?,
      last_name = ?,
      updated_at = datetime('now')
  WHERE id = ?
`

// ============================================
// PURCHASE HISTORY QUERIES
// ============================================

/**
 * Create purchase history record
 * Used for each item in the shopping cart
 * Parameters: customerId, productId, quantity, unitPrice
 */
export const createPurchaseHistory = `
  INSERT INTO a_purchase_history (
    customer_id,
    product_id,
    quantity,
    unit_price,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
`

/**
 * Get purchase history for a customer
 * Used to display customer's order history
 * Parameters: customerId
 */
export const getPurchaseHistoryByCustomer = `
  SELECT
    ph.*,
    p.title as product_title,
    p.price as current_price
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  WHERE ph.customer_id = ?
  ORDER BY ph.created_at DESC
`

// ============================================
// INVENTORY UPDATE QUERIES
// ============================================

/**
 * Update a_inventory after purchase (decrement stock)
 * Uses CASE statement to prevent negative quantities
 * Parameters: quantityToSubtract, quantityToSubtract, productId
 */
export const updateInventoryAfterPurchase = `
  UPDATE a_inventory
  SET quantity = CASE
    WHEN quantity >= ? THEN quantity - ?
    ELSE 0
  END,
  updated_at = datetime('now')
  WHERE product_id = ?
`

/**
 * Check product a_inventory before purchase
 * Used to verify stock availability
 * Parameters: productId
 */
export const checkProductInventory = `
  SELECT quantity FROM a_inventory
  WHERE product_id = ?
`

// ============================================
// PRODUCT POPULARITY QUERIES
// ============================================

/**
 * Find product popularity record
 * Used to check if popularity tracking exists for a product
 * Parameters: productId
 */
export const findProductPopularity = `
  SELECT id FROM a_product_popularity WHERE product_id = ?
`

/**
 * Update product popularity after purchase (increment purchases)
 * Parameters: quantityPurchased, popularityId
 */
export const updateProductPopularity = `
  UPDATE a_product_popularity
  SET purchases = purchases + ?,
      updated_at = datetime('now')
  WHERE id = ?
`

/**
 * Create product popularity record
 * Used when a product is purchased for the first time
 * Parameters: productId, initialPurchaseQuantity
 */
export const createProductPopularityRecord = `
  INSERT INTO a_product_popularity (product_id, views, add_to_carts, purchases, created_at, updated_at)
  VALUES (?, 0, 0, ?, datetime('now'), datetime('now'))
`

// ============================================
// TRANSACTION MANAGEMENT
// ============================================

/**
 * Begin database transaction
 * Used at the start of checkout process to ensure atomicity
 */
export const beginTransaction = `BEGIN TRANSACTION`

/**
 * Commit database transaction
 * Used after successful checkout
 */
export const commitTransaction = `COMMIT`

/**
 * Rollback database transaction
 * Used when checkout fails to undo all changes
 */
export const rollbackTransaction = `ROLLBACK`

// ============================================
// CHECKOUT ANALYTICS
// ============================================

/**
 * Get total revenue from all purchases
 * Demonstrates: SUM with calculated field (quantity * unit_price)
 */
export const getTotalRevenue = `
  SELECT SUM(quantity * unit_price) as total_revenue
  FROM a_purchase_history
`

/**
 * Get revenue by date range
 * Parameters: startDate, endDate
 */
export const getRevenueByDateRange = `
  SELECT
    DATE(created_at) as purchase_date,
    SUM(quantity * unit_price) as daily_revenue,
    COUNT(DISTINCT customer_id) as unique_customers,
    COUNT(*) as total_purchases
  FROM a_purchase_history
  WHERE created_at BETWEEN ? AND ?
  GROUP BY DATE(created_at)
  ORDER BY purchase_date DESC
`

/**
 * Get best selling a_products
 * Shows a_products with highest purchase quantities
 */
export const getBestSellingProducts = `
  SELECT
    p.id,
    p.title,
    SUM(ph.quantity) as units_sold,
    SUM(ph.quantity * ph.unit_price) as total_revenue
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  GROUP BY p.id, p.title
  ORDER BY units_sold DESC
  LIMIT 10
`

/**
 * Get customer lifetime value
 * Parameters: customerId
 */
export const getCustomerLifetimeValue = `
  SELECT
    customer_id,
    SUM(quantity * unit_price) as lifetime_value,
    COUNT(*) as total_purchases,
    MIN(created_at) as first_purchase,
    MAX(created_at) as last_purchase
  FROM a_purchase_history
  WHERE customer_id = ?
  GROUP BY customer_id
`

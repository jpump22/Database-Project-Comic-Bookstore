/**
 * Customer SQL Queries
 *
 * This file contains all SQL queries related to a_customers, including:
 * - Customer management (CRUD operations)
 * - Customer analytics and statistics
 * - Customer purchase history and behavior
 * - Customer segmentation
 */

// ============================================
// BASIC CUSTOMER QUERIES
// ============================================

/**
 * Get all a_customers
 * Demonstrates: Basic SELECT with ordering
 */
export const getAllCustomers = `
  SELECT * FROM a_customers
  WHERE is_active = 1
  ORDER BY last_name ASC, first_name ASC
  LIMIT 100
`

/**
 * Get customer by ID
 * Demonstrates: Simple lookup query
 */
export const getCustomerById = `
  SELECT * FROM a_customers
  WHERE id = ?
`

/**
 * Get customer by email
 * Demonstrates: Unique field lookup
 */
export const getCustomerByEmail = `
  SELECT * FROM a_customers
  WHERE email = ?
`

/**
 * Search a_customers by name
 * Demonstrates: LIKE with multiple fields (OR condition)
 */
export const searchCustomersByName = `
  SELECT * FROM a_customers
  WHERE first_name LIKE ? OR last_name LIKE ?
  ORDER BY last_name ASC
  LIMIT 50
`

// ============================================
// CUSTOMER PURCHASE HISTORY
// ============================================

/**
 * Get customer's purchase history
 * Demonstrates: JOIN across three tables (a_customers, purchases, a_products)
 */
export const getCustomerPurchaseHistory = `
  SELECT
    ph.*,
    p.title as product_title,
    p.price as current_price,
    pt.name as a_product_type
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  WHERE ph.customer_id = ?
  ORDER BY ph.purchase_date DESC
`

/**
 * Get customer's total spending
 * Demonstrates: SUM aggregate for customer analytics
 */
export const getCustomerTotalSpending = `
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    COALESCE(SUM(ph.total_price), 0) as total_spent,
    COALESCE(COUNT(ph.id), 0) as total_purchases
  FROM a_customers c
  LEFT JOIN a_purchase_history ph ON c.id = ph.customer_id
  WHERE c.id = ?
  GROUP BY c.id, c.first_name, c.last_name, c.email
`

/**
 * Get customer's favorite product type
 * Demonstrates: Complex JOIN with GROUP BY and COUNT
 */
export const getCustomerFavoriteProductType = `
  SELECT
    pt.name as a_product_type,
    COUNT(ph.id) as purchase_count,
    SUM(ph.total_price) as total_spent
  FROM a_purchase_history ph
  LEFT JOIN a_products p ON ph.product_id = p.id
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  WHERE ph.customer_id = ?
  GROUP BY pt.id, pt.name
  ORDER BY purchase_count DESC
  LIMIT 1
`

// ============================================
// CUSTOMER ANALYTICS & SEGMENTATION
// ============================================

/**
 * Get top a_customers by spending
 * Demonstrates: JOIN, SUM, GROUP BY, ORDER BY with LIMIT
 */
export const getTopCustomersBySpending = `
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    SUM(ph.total_price) as total_spent,
    COUNT(ph.id) as purchase_count
  FROM a_customers c
  LEFT JOIN a_purchase_history ph ON c.id = ph.customer_id
  GROUP BY c.id, c.first_name, c.last_name, c.email
  HAVING total_spent > 0
  ORDER BY total_spent DESC
  LIMIT 10
`

/**
 * Get a_customers who purchased specific product
 * Demonstrates: Filtering by product in JOIN
 */
export const getCustomersWhoBoughtProduct = `
  SELECT DISTINCT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    ph.purchase_date
  FROM a_customers c
  INNER JOIN a_purchase_history ph ON c.id = ph.customer_id
  WHERE ph.product_id = ?
  ORDER BY ph.purchase_date DESC
`

/**
 * Get a_customers with no purchases
 * Demonstrates: LEFT JOIN with NULL check
 */
export const getCustomersWithNoPurchases = `
  SELECT c.*
  FROM a_customers c
  LEFT JOIN a_purchase_history ph ON c.id = ph.customer_id
  WHERE ph.id IS NULL AND c.is_active = 1
  ORDER BY c.created_at DESC
`

/**
 * Get customer count by state/region
 * Demonstrates: Nested JSON field access with GROUP BY
 */
export const getCustomerCountByState = `
  SELECT
    address_state as state,
    COUNT(*) as customer_count
  FROM a_customers
  WHERE address_state IS NOT NULL AND address_state != ''
  GROUP BY address_state
  ORDER BY customer_count DESC
`

/**
 * Get recent a_customers (last 30 days)
 * Demonstrates: Date filtering with datetime functions
 */
export const getRecentCustomers = `
  SELECT * FROM a_customers
  WHERE created_at >= datetime('now', '-30 days')
  ORDER BY created_at DESC
`

// ============================================
// CUSTOMER & SUBSCRIPTION QUERIES
// ============================================

/**
 * Get customer's subscription status
 * Demonstrates: JOIN to subscriptions table
 */
export const getCustomerSubscription = `
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    s.plan,
    s.status,
    s.start_date,
    s.end_date,
    s.auto_renew
  FROM a_customers c
  LEFT JOIN a_subscriptions s ON c.id = s.customer_id
  WHERE c.id = ?
  ORDER BY s.start_date DESC
  LIMIT 1
`

/**
 * Get active subscribers
 * Demonstrates: JOIN with status filtering
 */
export const getActiveSubscribers = `
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    s.plan,
    s.start_date
  FROM a_customers c
  INNER JOIN a_subscriptions s ON c.id = s.customer_id
  WHERE s.status = 'active'
  ORDER BY s.start_date DESC
`

// ============================================
// CUSTOMER PURCHASE PATTERNS
// ============================================

/**
 * Get customer's purchase frequency
 * Demonstrates: Date calculations and aggregates
 */
export const getCustomerPurchaseFrequency = `
  SELECT
    customer_id,
    COUNT(*) as total_purchases,
    MIN(purchase_date) as first_purchase,
    MAX(purchase_date) as last_purchase,
    CAST(julianday('now') - julianday(MAX(purchase_date)) AS INTEGER) as days_since_last_purchase
  FROM a_purchase_history
  WHERE customer_id = ?
  GROUP BY customer_id
`

/**
 * Get a_customers who bought comics AND collectibles
 * Demonstrates: Subquery with INTERSECT-like logic using HAVING
 */
export const getCustomersWhoBoughtBothCategories = `
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    COUNT(DISTINCT p.category) as category_count
  FROM a_customers c
  INNER JOIN a_purchase_history ph ON c.id = ph.customer_id
  INNER JOIN a_products p ON ph.product_id = p.id
  WHERE p.category IN ('comics', 'collectibles')
  GROUP BY c.id, c.first_name, c.last_name
  HAVING category_count = 2
  ORDER BY c.last_name ASC
`

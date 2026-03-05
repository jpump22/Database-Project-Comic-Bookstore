/**
 * Product SQL Queries
 *
 * This file contains all SQL queries related to a_products, including:
 * - Fetching a_products with relationships (product type, publisher, a_series)
 * - Fetching product images
 * - Filtering by category (comics, collectibles)
 */

// ============================================
// PRODUCT QUERIES
// ============================================

/**
 * Get a single product by ID with all relationships
 * Joins: a_product_type, a_publishers, a_series
 * Used in: Product detail page
 */
export const getProductById = `
  SELECT
    p.*,
    pt.name as productType_name,
    pt.description as productType_description,
    pub.name as publisher_name,
    pub.description as publisher_description
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.id = ?
`

/**
 * Get a_products by category with all relationships
 * Used in: Shop page (comics), Collectibles page
 * Parameters: category (e.g., 'comics', 'collectibles')
 */
export const getProductsByCategory = `
  SELECT
    p.*,
    pt.name as productType_name,
    pt.description as productType_description,
    pub.name as publisher_name,
    pub.description as publisher_description
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.category = ?
  ORDER BY p.created_at DESC
  LIMIT 100
`

/**
 * Get a_products by category with popularity data (for sorting by most popular)
 * Joins a_product_popularity to get purchase counts
 * Used in: Shop page with "Most Popular" sort
 */
export const getProductsByCategoryWithPopularity = `
  SELECT
    p.*,
    pt.name as productType_name,
    pt.description as productType_description,
    pub.name as publisher_name,
    pub.description as publisher_description,
    pp.purchases as popularity_purchases,
    pp.views as popularity_views,
    pp.add_to_carts as popularity_add_to_carts
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  LEFT JOIN a_product_popularity pp ON p.id = pp.product_id
  WHERE p.category = ?
  ORDER BY p.created_at DESC
  LIMIT 100
`

/**
 * Get a_products by category, sorted by price (for collectibles)
 * Used in: Collectibles page
 */
export const getProductsByCategorySortedByPrice = `
  SELECT
    p.*,
    pt.name as productType_name,
    pt.description as productType_description,
    pub.name as publisher_name,
    pub.description as publisher_description
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.category = ?
  ORDER BY p.price DESC
  LIMIT 100
`

/**
 * Get specific featured a_products by IDs (for bento grid)
 * Used in: Homepage bento grid
 * Note: Uses IN clause with dynamic IDs
 */
export const getFeaturedProductsByIds = `
  SELECT p.id, p.title, p.price, p.badge,
         pt.name as productType_name,
         pub.name as publisher_name
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.id IN (5, 13, 11) AND p.category = 'comics'
  ORDER BY CASE p.id
    WHEN 5 THEN 1
    WHEN 13 THEN 2
    WHEN 11 THEN 3
  END
`

/**
 * Get product for hero section (basic info with type and publisher)
 * Used in: Homepage hero section
 */
export const getProductForHero = `
  SELECT p.*, pt.name as productType_name, pub.name as publisher_name
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.id = ?
`

// ============================================
// PRODUCT IMAGE QUERIES
// ============================================

/**
 * Get all images for a product
 * Uses the products_images relationship table
 * Returns images in order (_order field)
 */
export const getProductImages = `
  SELECT
    pi._order,
    m.*
  FROM a_products_images pi
  LEFT JOIN media m ON pi.image_id = m.id
  WHERE pi._parent_id = ?
  ORDER BY pi._order
`

/**
 * Get images for multiple a_products (batch query)
 * Used when loading product lists
 * Note: Requires dynamic IN clause with product IDs
 */
export const getProductImagesBatch = `
  SELECT
    pi._parent_id as product_id,
    pi._order,
    m.*
  FROM a_products_images pi
  LEFT JOIN media m ON pi.image_id = m.id
  WHERE pi._parent_id IN (%IDS%)
  ORDER BY pi._parent_id, pi._order
`

// ============================================
// PRODUCT TYPE & PUBLISHER QUERIES
// ============================================

/**
 * Get all product types (categories)
 * Used in: Shop filters, Collectibles filters
 */
export const getAllProductTypes = `
  SELECT * FROM a_product_type
  ORDER BY name ASC
  LIMIT 100
`

/**
 * Get all a_publishers
 * Used in: Shop filters, Collectibles filters
 */
export const getAllPublishers = `
  SELECT * FROM a_publishers
  ORDER BY name ASC
  LIMIT 100
`

// ============================================
// SEARCH & FILTER QUERIES
// ============================================

/**
 * Search a_products by title (LIKE query)
 * Demonstrates: LIKE operator for text search
 */
export const searchProductsByTitle = `
  SELECT p.*, pt.name as productType_name, pub.name as publisher_name
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.title LIKE ?
  ORDER BY p.title ASC
  LIMIT 50
`

/**
 * Get a_products by price range
 * Demonstrates: BETWEEN operator for range queries
 */
export const getProductsByPriceRange = `
  SELECT p.*, pt.name as productType_name
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  WHERE p.price BETWEEN ? AND ?
  ORDER BY p.price ASC
`

/**
 * Get a_products by publisher
 * Demonstrates: Filtering by relationship
 */
export const getProductsByPublisher = `
  SELECT p.*, pub.name as publisher_name
  FROM a_products p
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  WHERE p.publisher_id = ?
  ORDER BY p.title ASC
`

// ============================================
// AGGREGATE & ANALYTICS QUERIES
// ============================================

/**
 * Get product count by category
 * Demonstrates: COUNT and GROUP BY
 */
export const getProductCountByCategory = `
  SELECT category, COUNT(*) as product_count
  FROM a_products
  GROUP BY category
`

/**
 * Get product count by publisher
 * Demonstrates: COUNT, JOIN, and GROUP BY
 */
export const getProductCountByPublisher = `
  SELECT pub.name as publisher_name, COUNT(p.id) as product_count
  FROM a_products p
  LEFT JOIN a_publishers pub ON p.publisher_id = pub.id
  GROUP BY pub.id, pub.name
  ORDER BY product_count DESC
`

/**
 * Get average price by category
 * Demonstrates: AVG aggregate function
 */
export const getAveragePriceByCategory = `
  SELECT category, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price
  FROM a_products
  GROUP BY category
`

/**
 * Get most expensive a_products
 * Demonstrates: ORDER BY with LIMIT for top-N queries
 */
export const getMostExpensiveProducts = `
  SELECT p.*, pt.name as productType_name
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  ORDER BY p.price DESC
  LIMIT 10
`

/**
 * Get a_products with badge (NEW, RARE, etc.)
 * Demonstrates: Filtering by specific field value
 */
export const getProductsByBadge = `
  SELECT p.*, pt.name as productType_name
  FROM a_products p
  LEFT JOIN a_product_type pt ON p.product_type_id = pt.id
  WHERE p.badge = ?
  ORDER BY p.created_at DESC
`

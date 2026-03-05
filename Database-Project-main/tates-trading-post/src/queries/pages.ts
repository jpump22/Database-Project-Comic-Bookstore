/**
 * Page SQL Queries
 *
 * This file contains all SQL queries related to Payload CMS pages, including:
 * - Fetching page data
 * - Fetching page blocks (bento grid, vintage section, events)
 * - Fetching hero media
 */

// ============================================
// PAGE QUERIES
// ============================================

/**
 * Get all published page slugs
 * Used in: generateStaticParams for static site generation
 */
export const getAllPageSlugs = `
  SELECT slug FROM pages
  WHERE _status = 'published'
  LIMIT 1000
`

/**
 * Get a single page by slug
 * Returns basic page data
 */
export const getPageBySlug = `
  SELECT * FROM pages
  WHERE slug = ?
  LIMIT 1
`

// ============================================
// HERO SECTION QUERIES
// ============================================

/**
 * Get hero media (image/video) by ID
 * Used when page has hero_media_id
 */
export const getHeroMedia = `
  SELECT * FROM media WHERE id = ?
`

// ============================================
// PAGE BLOCKS QUERIES
// ============================================

/**
 * Get bento grid blocks for a page
 * Returns all bento grid sections for the given page
 */
export const getBentoGridBlocks = `
  SELECT * FROM pages_blocks_bento_grid
  WHERE _parent_id = ?
  ORDER BY _order
`

/**
 * Get vintage section blocks for a page
 * Returns all vintage sections for the given page
 */
export const getVintageSectionBlocks = `
  SELECT * FROM pages_blocks_vintage_section
  WHERE _parent_id = ?
  ORDER BY _order
`

/**
 * Get events section blocks for a page
 * Returns all events sections for the given page
 */
export const getEventsSectionBlocks = `
  SELECT * FROM pages_blocks_events_section
  WHERE _parent_id = ?
  ORDER BY _order
`

import Database from 'better-sqlite3'
import path from 'path'

// Singleton database connection
let db: Database.Database | null = null

// Enable SQL query logging (set to false to disable)
const ENABLE_QUERY_LOGGING = true

// Track current page context for query logging
let currentPageContext: string = 'Unknown Page'
let lastPageContext: string = 'Unknown Page'

// Helper function to generate query description
function getQueryDescription(sql: string): string {
  const cleanSql = sql.trim().toLowerCase()

  // Detect query type
  if (cleanSql.startsWith('select')) {
    // Extract table name from SELECT query
    const fromMatch = sql.match(/from\s+([a-z_]+)/i)
    const joinMatch = sql.match(/join\s+([a-z_]+)/i)
    const whereMatch = sql.match(/where\s+[a-z_]+\s*=\s*\?/i)

    if (fromMatch) {
      const table = fromMatch[1]
      const hasJoins = joinMatch !== null
      const hasWhere = whereMatch !== null

      if (table === 'pages' && cleanSql.includes('slug')) {
        return 'Loading the page content and layout blocks'
      } else if (table === 'a_products' && cleanSql.includes('where p.id')) {
        return 'Getting detailed info for a single product (title, price, images, publisher, series)'
      } else if (table === 'a_products' && cleanSql.includes('category') && cleanSql.includes('a_product_popularity')) {
        return 'Loading all products in this category, sorted by popularity (most viewed/purchased first)'
      } else if (table === 'a_products' && cleanSql.includes('category') && hasJoins) {
        return 'Loading all products in this category with their publisher and type info'
      } else if (table === 'a_products' && cleanSql.includes('order by p.price')) {
        return 'Getting products sorted by price (low to high or high to low)'
      } else if (table === 'a_products' && cleanSql.includes('in (')) {
        return 'Loading featured products to display on the homepage hero section'
      } else if (table === 'a_product_type') {
        return 'Getting list of product categories (Comic, Graphic Novel, Action Figure, etc.)'
      } else if (table === 'a_publishers') {
        return 'Getting list of publishers (Marvel, DC, Image Comics, etc.)'
      } else if (table === 'products_images') {
        if (cleanSql.includes('_parent_id in')) {
          return 'Loading all product images for the products shown on this page'
        } else {
          return 'Loading images for this specific product'
        }
      } else if (table === 'a_customers' && cleanSql.includes('email')) {
        return 'Checking if this customer already has an account (by email address)'
      } else if (table === 'a_inventory') {
        return 'Checking how many of this item we have in stock'
      } else if (table === 'a_purchase_history') {
        return 'Looking up past purchases for analytics and reporting'
      } else if (table === 'a_product_popularity') {
        if (cleanSql.includes('select id from a_product_popularity where product_id')) {
          return 'Checking if we are already tracking popularity for this product'
        } else {
          return 'Getting popularity stats (how many views, cart adds, and purchases)'
        }
      } else {
        return `Reading data from ${table}${hasJoins ? ' and related tables' : ''}`
      }
    }
  } else if (cleanSql.startsWith('insert')) {
    const intoMatch = sql.match(/into\s+([a-z_]+)/i)
    if (intoMatch) {
      const table = intoMatch[1]
      if (table === 'a_customers') {
        return 'Saving new customer information (first-time buyer creating an account)'
      } else if (table === 'a_purchase_history') {
        return 'Recording this purchase in the order history (who bought what, when, how much)'
      } else if (table === 'a_product_popularity') {
        if (cleanSql.includes('values (?, 1, 0, 0')) {
          return 'Starting to track popularity for this product (first time someone viewed it)'
        } else if (cleanSql.includes('values (?, 0, 1, 0')) {
          return 'Starting to track popularity for this product (first time someone added to cart)'
        } else if (cleanSql.includes('values (?, 0, 0,')) {
          return 'Starting to track popularity for this product (first time someone purchased it)'
        } else {
          return 'Starting to track popularity metrics for this product'
        }
      } else {
        return `Saving new data to ${table}`
      }
    }
  } else if (cleanSql.startsWith('update')) {
    const tableMatch = sql.match(/update\s+([a-z_]+)/i)
    if (tableMatch) {
      const table = tableMatch[1]
      if (table === 'a_inventory') {
        return 'Reducing inventory count (customer just bought this item, so stock goes down)'
      } else if (table === 'a_customers') {
        return 'Updating customer account information (changed email, name, etc.)'
      } else if (table === 'a_product_popularity') {
        if (cleanSql.includes('views = views + 1')) {
          return 'Counting product view (someone just looked at this product page)'
        } else if (cleanSql.includes('add_to_carts = add_to_carts + 1')) {
          return 'Counting cart addition (someone just added this to their shopping cart)'
        } else if (cleanSql.includes('purchases = purchases +')) {
          return 'Counting purchase (someone just bought this product!)'
        } else {
          return 'Updating how popular this product is (views, cart adds, purchases)'
        }
      } else {
        return `Updating existing data in ${table}`
      }
    }
  } else if (cleanSql.startsWith('delete')) {
    const fromMatch = sql.match(/from\s+([a-z_]+)/i)
    if (fromMatch) {
      return `Deleting old data from ${fromMatch[1]}`
    }
  } else if (cleanSql.startsWith('begin')) {
    return '🔒 Starting a transaction (grouping multiple queries together so they all succeed or all fail)'
  } else if (cleanSql.startsWith('commit')) {
    return '✅ Transaction successful! (saving all the changes we just made)'
  } else if (cleanSql.startsWith('rollback')) {
    return '❌ Transaction failed! (undoing everything and reverting back)'
  }

  return 'Running a database query'
}

// Function to set the current page context
export function setPageContext(pageName: string): void {
  currentPageContext = pageName
}

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'cms.db')
    db = new Database(dbPath)

    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL')

    // Enable query optimization
    db.pragma('synchronous = NORMAL')
    db.pragma('cache_size = 10000')
    db.pragma('temp_store = MEMORY')

    console.log('[DB] Singleton database connection created')

    // Add query logging if enabled
    if (ENABLE_QUERY_LOGGING) {
      // Wrap the prepare method to log queries with actual parameter values
      const originalPrepare = db.prepare.bind(db)
      db.prepare = function(sql: string) {
        const stmt = originalPrepare(sql)
        const description = getQueryDescription(sql)

        // Wrap the statement methods to capture parameters
        const originalRun = stmt.run.bind(stmt)
        const originalGet = stmt.get.bind(stmt)
        const originalAll = stmt.all.bind(stmt)

        stmt.run = function(...params: any[]) {
          logQueryExecution(sql, params, description)
          return originalRun(...params)
        }

        stmt.get = function(...params: any[]) {
          logQueryExecution(sql, params, description)
          return originalGet(...params)
        }

        stmt.all = function(...params: any[]) {
          logQueryExecution(sql, params, description)
          return originalAll(...params)
        }

        return stmt
      }
      console.log('[DB] Query logging ENABLED - showing queries even when cached')
    }
  }

  return db
}

// Helper to log prepared query (before execution)
function logPreparedQuery(sql: string, description: string) {
  const cleanSql = sql.trim().toLowerCase()

  // Skip Payload CMS internal queries
  const payloadTables = [
    'users', 'pages', 'posts', 'events', 'media',
    'payload_locked_documents', 'payload_preferences', 'payload_migrations',
    'payload_jobs', 'redirects', 'forms', 'form_submissions', 'search',
    'pages_blocks', 'products_images', '_rels'
  ]

  const isPayloadQuery = payloadTables.some(table =>
    cleanSql.includes(`from ${table}`) ||
    cleanSql.includes(`into ${table}`) ||
    cleanSql.includes(`update ${table}`) ||
    cleanSql.includes(`join ${table}`)
  )

  if (isPayloadQuery) return

  console.log('\n🔵 [SQL QUERY - PREPARED]')
  console.log('📝 Description:', description)
  console.log('─'.repeat(60))
  console.log(sql.trim())
  console.log('─'.repeat(60))
}

// Helper to log query execution with actual parameter values
function logQueryExecution(sql: string, params: any[], description: string) {
  const cleanSql = sql.trim().toLowerCase()

  // Skip Payload CMS internal queries
  const payloadTables = [
    'users', 'pages', 'posts', 'events', 'media',
    'payload_locked_documents', 'payload_preferences', 'payload_migrations',
    'payload_jobs', 'redirects', 'forms', 'form_submissions', 'search',
    'pages_blocks', 'products_images', '_rels'
  ]

  const isPayloadQuery = payloadTables.some(table =>
    cleanSql.includes(`from ${table}`) ||
    cleanSql.includes(`into ${table}`) ||
    cleanSql.includes(`update ${table}`) ||
    cleanSql.includes(`join ${table}`)
  )

  if (isPayloadQuery) return

  // Only clear terminal when page context changes
  if (currentPageContext !== lastPageContext) {
    console.clear()
    lastPageContext = currentPageContext

    // Add massive whitespace and prominent page header for new page
    console.log('\n\n\n\n\n\n\n\n\n\n')
    console.log('╔' + '═'.repeat(78) + '╗')
    console.log('║' + ' '.repeat(78) + '║')
    console.log('║' + `              📄  VIEWING PAGE: ${currentPageContext}`.padEnd(78) + '║')
    console.log('║' + ' '.repeat(78) + '║')
    console.log('╚' + '═'.repeat(78) + '╝')
    console.log('\n')
    console.log('📌 All database queries for this page are shown below:')
    console.log('   (Each query explains what data is being loaded and why)')
    console.log('\n' + '─'.repeat(80) + '\n')
  }

  let finalSql = sql.trim()

  // Substitute each ? with the actual parameter value
  params.forEach((param) => {
    const value = typeof param === 'string' ? `'${param}'` : String(param)
    finalSql = finalSql.replace('?', value)
  })

  // Display query with feature label in a more human-friendly format
  console.log('┌─ WHAT THIS QUERY DOES:')
  console.log('│  ' + description)
  console.log('│')
  console.log('└─ TECHNICAL SQL QUERY:')
  console.log('   ' + finalSql.split('\n').join('\n   '))
  console.log('\n' + '─'.repeat(80) + '\n')
}

// Optionally close the database (for cleanup)
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    console.log('[DB] Database connection closed')
  }
}

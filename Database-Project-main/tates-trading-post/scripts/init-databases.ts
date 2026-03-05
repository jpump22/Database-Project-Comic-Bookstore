/**
 * Initialize both cms.db and business.db databases
 * Creates all necessary tables by accessing each collection
 * Run with: npx tsx scripts/init-databases.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root
const envPath = path.join(__dirname, '..', '.env')
dotenv.config({ path: envPath })

async function initDatabases() {
  console.log('🔧 Initializing PayloadCMS databases...\n')

  // Dynamic import AFTER env is loaded
  const { getPayload } = await import('payload')
  const configModule = await import('@/payload.config')
  const config = configModule.default

  console.log('📦 Connecting to PayloadCMS...')
  const payload = await getPayload({ config })

  console.log('✅ PayloadCMS initialized\n')

  // Access each collection to ensure tables are created
  console.log('📊 Initializing CMS Database (cms.db)...')

  const cmsCollections = ['users', 'pages', 'posts', 'events', 'media', 'categories']
  for (const collection of cmsCollections) {
    try {
      await payload.find({ collection, limit: 1 })
      console.log(`  ✓ ${collection}`)
    } catch (error) {
      console.log(`  ⚠️  ${collection} - ${error.message}`)
    }
  }

  console.log('\n📊 Initializing Business Database (business.db)...')

  const businessCollections = [
    'publishers',
    'product-type',
    'series',
    'products',
    'inventory',
    'product-popularity',
    'purchase-history',
    'customers',
  ]

  for (const collection of businessCollections) {
    try {
      await payload.find({ collection, limit: 1 })
      console.log(`  ✓ ${collection}`)
    } catch (error) {
      console.log(`  ⚠️  ${collection} - ${error.message}`)
    }
  }

  console.log('\n📊 Initializing Globals...')

  const globals = ['header', 'footer', 'site-settings']
  for (const globalSlug of globals) {
    try {
      await payload.findGlobal({ slug: globalSlug })
      console.log(`  ✓ ${globalSlug}`)
    } catch (error) {
      console.log(`  ⚠️  ${globalSlug} - ${error.message}`)
    }
  }

  // Check database files
  const dbDir = path.join(__dirname, '..')
  const cmsDbPath = path.join(dbDir, 'cms.db')
  const businessDbPath = path.join(dbDir, 'business.db')

  console.log('\n📁 Database Files:')
  if (fs.existsSync(cmsDbPath)) {
    const stats = fs.statSync(cmsDbPath)
    console.log(`  ✓ cms.db (${(stats.size / 1024).toFixed(0)} KB)`)
  } else {
    console.log('  ❌ cms.db not found')
  }

  if (fs.existsSync(businessDbPath)) {
    const stats = fs.statSync(businessDbPath)
    console.log(`  ✓ business.db (${(stats.size / 1024).toFixed(0)} KB)`)
  } else {
    console.log('  ❌ business.db not found')
  }

  console.log('\n✨ Database initialization complete!')
  console.log('\n📌 Next steps:')
  console.log('  1. Start dev server: npm run dev')
  console.log('  2. Open admin panel: http://localhost:3000/admin')
  console.log('  3. Add your business data to the business collections')

  process.exit(0)
}

initDatabases().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

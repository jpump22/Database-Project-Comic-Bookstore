import type { Config } from 'src/payload-types'

// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import Database from 'better-sqlite3'
import path from 'path'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, depth = 0) {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // const page = await payload.find({
  //   collection,
  //   depth,
  //   where: {
  //     slug: {
  //       equals: slug,
  //     },
  //   },
  // })

  // return page.docs[0]

  // Connect to SQLite database
  const dbPath = path.join(process.cwd(), 'cms.db')
  const db = new Database(dbPath, { readonly: true })

  // Map collection names to table names (handle kebab-case to snake_case)
  const tableMap: Record<string, string> = {
    'posts': 'posts',
    'pages': 'pages',
    'categories': 'categories',
    'events': 'events',
    'products': 'products',
    'product-type': 'product_type',
    'publishers': 'publishers',
    'series': 'series',
    'media': 'media',
    'customers': 'customers',
    'inventory': 'inventory',
    'purchase-history': 'purchase_history',
    'product-popularity': 'product_popularity',
    'users': 'users',
    'forms': 'forms',
    'form-submissions': 'form_submissions',
    'search': 'search',
    'redirects': 'redirects',
  }

  const tableName = tableMap[collection as string] || collection

  try {
    const result = db.prepare(`
      SELECT * FROM ${tableName}
      WHERE slug = ?
      LIMIT 1
    `).get(slug)

    db.close()
    return result
  } catch (error) {
    db.close()
    return null
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string) =>
  unstable_cache(async () => getDocument(collection, slug), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })

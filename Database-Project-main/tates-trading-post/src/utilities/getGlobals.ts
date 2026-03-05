import type { Config } from 'src/payload-types'

// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import Database from 'better-sqlite3'
import path from 'path'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // const global = await payload.findGlobal({
  //   slug,
  //   depth,
  // })

  // return global

  // Connect to SQLite database
  const dbPath = path.join(process.cwd(), 'cms.db')
  const db = new Database(dbPath, { readonly: true })

  // Map global slugs to table names
  const tableMap: Record<string, string> = {
    'header': 'header',
    'footer': 'footer',
    'site-settings': 'site_settings',
  }

  const tableName = tableMap[slug as string] || slug

  try {
    // Globals typically have a single row (no slug filter needed)
    const result = db.prepare(`
      SELECT * FROM ${tableName}
      LIMIT 1
    `).get()

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
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })

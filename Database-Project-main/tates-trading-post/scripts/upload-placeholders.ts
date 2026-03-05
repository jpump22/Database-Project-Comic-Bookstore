/**
 * Upload placeholder comic cover images to PayloadCMS Media collection
 * Run with: tsx scripts/upload-placeholders.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env BEFORE importing payload config
const envPath = path.join(__dirname, '..', '.env')
console.log('Loading .env from:', envPath)
console.log('.env exists:', fs.existsSync(envPath))

const result = dotenv.config({ path: envPath })
if (result.error) {
  console.error('Error loading .env:', result.error)
  process.exit(1)
}

console.log('Environment variables loaded')
console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? 'SET' : 'NOT SET')
console.log('DATABASE_URI_CMS:', process.env.DATABASE_URI_CMS ? 'SET' : 'NOT SET')

const placeholders = [
  { name: 'crimson-knight', title: 'Crimson Knight Comic Cover' },
  { name: 'astro-force', title: 'Astro Force Comic Cover' },
  { name: 'golden-age', title: 'Golden Age Comic Cover' },
  { name: 'spider-verse', title: 'Spider Verse Comic Cover' },
  { name: 'amazing-fantasy', title: 'Amazing Fantasy Comic Cover' },
  { name: 'detective-comics', title: 'Detective Comics Cover' },
  { name: 'x-men', title: 'X-Men Comic Cover' },
  { name: 'dark-phoenix', title: 'Dark Phoenix Comic Cover' },
  { name: 'infinity-gauntlet', title: 'Infinity Gauntlet Comic Cover' },
  { name: 'watchmen', title: 'Watchmen Comic Cover' },
]

async function uploadPlaceholders() {
  console.log('Initializing Payload...')

  // Dynamic import AFTER env is loaded
  const { getPayload } = await import('payload')
  const configModule = await import('@/payload.config')
  const config = configModule.default

  const payload = await getPayload({
    config,
    secret: process.env.PAYLOAD_SECRET || '',
  })

  console.log('\nUploading placeholder images...\n')

  const placeholdersDir = path.join(__dirname, '..', 'public', 'placeholders')

  for (const placeholder of placeholders) {
    const filename = `${placeholder.name}.svg`
    const filepath = path.join(placeholdersDir, filename)

    if (!fs.existsSync(filepath)) {
      console.log(`❌ File not found: ${filename}`)
      continue
    }

    try {
      // Read the SVG file
      const fileBuffer = fs.readFileSync(filepath)
      const fileData = {
        data: fileBuffer,
        mimetype: 'image/svg+xml',
        name: filename,
        size: fileBuffer.length,
      }

      // Check if already exists
      const existing = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: filename,
          },
        },
      })

      if (existing.docs.length > 0) {
        console.log(`⏭️  Skipping ${filename} (already exists with ID: ${existing.docs[0].id})`)
        continue
      }

      // Upload to PayloadCMS
      const result = await payload.create({
        collection: 'media',
        data: {
          alt: placeholder.title,
        },
        file: fileData,
      })

      console.log(`✅ Uploaded ${filename} (ID: ${result.id})`)
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error)
    }
  }

  console.log('\n✨ Upload complete!')
  process.exit(0)
}

uploadPlaceholders().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

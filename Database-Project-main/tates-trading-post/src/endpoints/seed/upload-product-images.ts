import type { Payload } from 'payload'
import path from 'path'
import fs from 'fs'
import https from 'https'
import http from 'http'

// Comic book cover image URLs from legitimate sources
const productImages: Record<number, string[]> = {
  1: ['https://m.media-amazon.com/images/I/91V5wfZ0GPL._SL1500_.jpg'], // Amazing Spider-Man
  2: ['https://m.media-amazon.com/images/I/91hKKR7c5VL._SL1500_.jpg'], // Amazing Spider-Man Vol 1: Coming Home
  3: ['https://m.media-amazon.com/images/I/81qTLoW7mBL._SL1500_.jpg'], // Batman: The Killing Joke
  4: ['https://m.media-amazon.com/images/I/71ROom19tgL._SL1200_.jpg'], // Batman: Year One
  5: ['https://m.media-amazon.com/images/I/91aw03Y8lbL._SL1500_.jpg'], // X-Men #1 (1991)
  6: ['https://m.media-amazon.com/images/I/91VqWJV7VUL._SL1500_.jpg'], // X-Men: Days of Future Past
  7: ['https://m.media-amazon.com/images/I/71cu+-eGfbL._SL1200_.jpg'], // The Walking Dead #1
  8: ['https://m.media-amazon.com/images/I/91u7YQC+oWL._SL1500_.jpg'], // The Walking Dead Compendium One
  9: ['https://m.media-amazon.com/images/I/91gGGR3vCmL._SL1500_.jpg'], // Saga #1
  10: ['https://m.media-amazon.com/images/I/91GF+prH+dL._SL1500_.jpg'], // Saga Vol 1
  11: ['https://m.media-amazon.com/images/I/71S93rfXoNL._SL1200_.jpg'], // Watchmen #1
  12: ['https://m.media-amazon.com/images/I/91dWLRbRe9L._SL1500_.jpg'], // Watchmen Absolute Edition
  13: ['https://m.media-amazon.com/images/I/91Vm3pgDKPL._SL1500_.jpg'], // Naruto Vol 1
  14: ['https://m.media-amazon.com/images/I/91Sx1Ky96QL._SL1500_.jpg'], // Naruto Box Set 1
  15: ['https://m.media-amazon.com/images/I/91rXOT-AqbL._SL1500_.jpg'], // Sin City: The Hard Goodbye
  16: ['https://m.media-amazon.com/images/I/91qXV3hJUHL._SL1500_.jpg'], // Invincible #1
  17: ['https://m.media-amazon.com/images/I/91u+wqAqwZL._SL1500_.jpg'], // Invincible Compendium Vol 1
  18: ['https://m.media-amazon.com/images/I/71Tqg6jYpXL._SL1200_.jpg'], // The Sandman #1
  19: ['https://m.media-amazon.com/images/I/91Mke0NdTiL._SL1500_.jpg'], // The Sandman Vol 1: Preludes & Nocturnes
  20: ['https://m.media-amazon.com/images/I/91SnYV3U8dL._SL1500_.jpg'], // The Sandman: Overture Deluxe
}

// Download image from URL
async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)

    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`))
          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {}) // Delete the file on error
        reject(err)
      })
  })
}

// Get file extension from URL
function getExtension(url: string): string {
  const match = url.match(/\.(jpg|jpeg|png|webp|gif)/)
  return match ? match[1] : 'jpg'
}

export async function uploadProductImages(payload: Payload): Promise<void> {
  console.log('🖼️  Starting product image upload...')

  const tempDir = path.join(process.cwd(), 'temp-images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  let successCount = 0
  let errorCount = 0

  for (const [productId, imageUrls] of Object.entries(productImages)) {
    try {
      console.log(`\n📦 Processing product ID ${productId}...`)

      const product = await payload.findByID({
        collection: 'products',
        id: Number(productId),
      })

      if (!product) {
        console.log(`⚠️  Product ${productId} not found, skipping`)
        errorCount++
        continue
      }

      console.log(`   Found: "${product.title}"`)

      // Process each image for this product
      const uploadedImages: { image: number }[] = []

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i]
        const ext = getExtension(imageUrl)
        const filename = `product-${productId}-${i + 1}.${ext}`
        const filepath = path.join(tempDir, filename)

        try {
          // Download image
          console.log(`   📥 Downloading image ${i + 1}...`)
          await downloadImage(imageUrl, filepath)

          // Upload to PayloadCMS
          console.log(`   📤 Uploading to PayloadCMS...`)
          const uploadedMedia = await payload.create({
            collection: 'media',
            data: {
              alt: `${product.title} cover image`,
            },
            filePath: filepath,
          })

          uploadedImages.push({ image: uploadedMedia.id })
          console.log(`   ✅ Image uploaded successfully (Media ID: ${uploadedMedia.id})`)

          // Clean up temp file
          fs.unlinkSync(filepath)
        } catch (imgError) {
          console.log(`   ❌ Failed to process image ${i + 1}:`, imgError)
          errorCount++
        }
      }

      // Update product with uploaded images
      if (uploadedImages.length > 0) {
        await payload.update({
          collection: 'products',
          id: Number(productId),
          data: {
            images: uploadedImages,
          },
        })
        console.log(`   ✅ Product updated with ${uploadedImages.length} image(s)`)
        successCount++
      }
    } catch (error) {
      console.log(`   ❌ Error processing product ${productId}:`, error)
      errorCount++
    }
  }

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir, { recursive: true })
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✨ Image upload complete!`)
  console.log(`   ✅ Success: ${successCount} products`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('='.repeat(50))
}

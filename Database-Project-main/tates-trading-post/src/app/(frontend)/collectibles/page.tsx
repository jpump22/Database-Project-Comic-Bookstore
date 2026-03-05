import type { Metadata } from 'next'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import { CollectiblesClient } from './page.client'
import { getDatabase, setPageContext } from '@/utilities/db'
import {
  getAllProductTypes,
  getAllPublishers,
  getProductsByCategorySortedByPrice,
  getProductImagesBatch,
} from '@/queries/products'

export const metadata: Metadata = {
  title: 'Toys & Collectibles | Tates Trading Post',
  description: 'Action figures, toys, rare collectibles, graded comics, and exclusive items',
}

export default async function CollectiblesPage() {
  setPageContext('COLLECTIBLES PAGE')
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // Use singleton database connection
  const db = getDatabase()

  // Fetch all product types for categories
  // const productTypes = await payload.find({
  //   collection: 'product-type',
  //   limit: 100,
  //   sort: 'name',
  // })
  const productTypesRaw = db.prepare(getAllProductTypes).all()

  // Fetch all publishers
  // const publishers = await payload.find({
  //   collection: 'publishers',
  //   limit: 100,
  //   sort: 'name',
  // })
  const publishersRaw = db.prepare(getAllPublishers).all()

  // Fetch products categorized as collectibles
  // const products = await payload.find({
  //   collection: 'products',
  //   limit: 100,
  //   sort: '-price', // Sort by price descending for collectibles
  //   depth: 2,
  //   where: {
  //     category: {
  //       equals: 'collectibles',
  //     },
  //   },
  // })
  const productsRaw = db.prepare(getProductsByCategorySortedByPrice).all('collectibles')

  // Fetch images for products
  const productIds = productsRaw.map((p: any) => p.id).join(',')
  const imagesRaw = productIds ? db.prepare(
    getProductImagesBatch.replace('%IDS%', productIds)
  ).all() : []

  // Transform products to include nested relationships and images
  const products = productsRaw.map((p: any) => {
    const productImages = imagesRaw.filter((img: any) => img.product_id === p.id)

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      badge: p.badge,
      grade: p.grade,
      release_date: p.release_date,
      updated_at: p.updated_at,
      created_at: p.created_at,
      productType: p.product_type_id ? {
        id: p.product_type_id,
        name: p.productType_name,
        description: p.productType_description
      } : null,
      publisher: p.publisher_id ? {
        id: p.publisher_id,
        name: p.publisher_name,
        description: p.publisher_description
      } : null,
      images: productImages.map((img: any) => ({
        image: {
          id: img.id,
          alt: img.alt,
          url: img.url || (img.filename ? `/media/${img.filename}` : null),
          filename: img.filename,
          mimeType: img.mime_type,
          width: img.width,
          height: img.height,
          sizes: {
            thumbnail: {
              url: img.sizes_thumbnail_url || (img.sizes_thumbnail_filename ? `/media/${img.sizes_thumbnail_filename}` : null),
              width: img.sizes_thumbnail_width,
              height: img.sizes_thumbnail_height
            },
            square: {
              url: img.sizes_square_url || (img.sizes_square_filename ? `/media/${img.sizes_square_filename}` : null),
              width: img.sizes_square_width,
              height: img.sizes_square_height
            },
            small: {
              url: img.sizes_small_url || (img.sizes_small_filename ? `/media/${img.sizes_small_filename}` : null),
              width: img.sizes_small_width,
              height: img.sizes_small_height
            },
            medium: {
              url: img.sizes_medium_url || (img.sizes_medium_filename ? `/media/${img.sizes_medium_filename}` : null),
              width: img.sizes_medium_width,
              height: img.sizes_medium_height
            }
          }
        }
      }))
    }
  })

  // No db.close() - singleton connection is reused

  return (
    <CollectiblesClient
      productTypes={productTypesRaw}
      publishers={publishersRaw}
      products={products}
    />
  )
}

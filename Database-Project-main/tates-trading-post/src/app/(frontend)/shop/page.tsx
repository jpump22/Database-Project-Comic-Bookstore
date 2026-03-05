import type { Metadata } from 'next'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import { ShopClient } from './page.client'
import { getDatabase, setPageContext } from '@/utilities/db'
import {
  getAllProductTypes,
  getAllPublishers,
  getProductsByCategoryWithPopularity,
  getProductImagesBatch,
} from '@/queries/products'

export const metadata: Metadata = {
  title: 'Shop | Tates Trading Post',
  description: 'Browse our collection of comics, graphic novels, and collectibles',
}

export default async function ShopPage() {
  setPageContext('SHOP PAGE')
  const db = getDatabase()

  // Fetch all product types for categories
  const productTypesRaw = db.prepare(getAllProductTypes).all()

  // Fetch all publishers
  const publishersRaw = db.prepare(getAllPublishers).all()

  // Fetch all comics with popularity data
  const productsRaw = db.prepare(getProductsByCategoryWithPopularity).all('comics')

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
      popularity_purchases: p.popularity_purchases || 0,
      popularity_views: p.popularity_views || 0,
      popularity_add_to_carts: p.popularity_add_to_carts || 0,
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
    <ShopClient
      productTypes={productTypesRaw}
      publishers={publishersRaw}
      products={products}
    />
  )
}

import type { Metadata } from 'next'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, Media } from '@/payload-types'
import { getDatabase, setPageContext } from '@/utilities/db'
import { getProductById, getProductImages } from '@/queries/products'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ViewTracker } from '@/components/ViewTracker'

export default async function ProductPage({ params }: { params: { id: string } }) {
  setPageContext(`PRODUCT PAGE (ID: ${params.id})`)
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // Use singleton database connection
  const db = getDatabase()

  // const product = await payload.findByID({
  //   collection: 'products',
  //   id: params.id,
  //   depth: 2,
  // })
  const productRaw = db.prepare(getProductById).get(params.id)

  if (!productRaw) {
    // No db.close() - singleton connection is reused
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Product Not Found</h1>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Back to Shop
        </Link>
      </div>
    )
  }

  // Fetch images for the product
  const imagesRaw = db.prepare(getProductImages).all(params.id)

  // No db.close() - singleton connection is reused

  // Transform product to include nested relationships and images
  const product: any = {
    id: productRaw.id,
    title: productRaw.title,
    description: productRaw.description,
    price: productRaw.price,
    category: productRaw.category,
    badge: productRaw.badge,
    grade: productRaw.grade,
    releaseDate: productRaw.release_date,
    updated_at: productRaw.updated_at,
    created_at: productRaw.created_at,
    productType: productRaw.product_type_id ? {
      id: productRaw.product_type_id,
      name: productRaw.productType_name,
      description: productRaw.productType_description
    } : null,
    publisher: productRaw.publisher_id ? {
      id: productRaw.publisher_id,
      name: productRaw.publisher_name,
      description: productRaw.publisher_description
    } : null,
    images: imagesRaw.map((img: any) => ({
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

  // Get first product image
  let productImageUrl: string | null = null
  if (product.images?.[0]) {
    const firstImage = product.images[0].image
    if (typeof firstImage === 'object' && firstImage !== null) {
      productImageUrl = (firstImage as Media).url || null
    }
  }

  // Get product type name
  const productTypeName =
    typeof product.productType === 'object' ? product.productType.name : 'Unknown'

  // Get publisher name
  const publisherName =
    product.publisher && typeof product.publisher === 'object'
      ? product.publisher.name
      : 'Unknown'

  return (
    <main className="product-detail-page">
      <ViewTracker productId={Number(params.id)} />
      <div className="product-detail-container">
        <Link href="/shop" className="back-link">
          ← Back to Comics
        </Link>

        <div className="product-detail-grid">
          {/* Product Image */}
          <div className="product-detail-image">
            {productImageUrl ? (
              <Image
                src={productImageUrl}
                alt={product.title}
                width={600}
                height={900}
                className="detail-image"
                priority
              />
            ) : (
              <div className="detail-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span>No Image Available</span>
              </div>
            )}
            {product.badge && (
              <span className={`detail-badge badge-${product.badge.toLowerCase()}`}>
                {product.badge}
              </span>
            )}
            {product.grade && <span className="detail-grade-badge">{product.grade}</span>}
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <div className="detail-meta">
              <span>{productTypeName}</span>
              <span className="meta-separator">•</span>
              <span>{publisherName}</span>
            </div>

            <h1 className="detail-title">{product.title}</h1>

            <div className="detail-price-section">
              <span className="detail-price">${Number(product.price).toFixed(2)}</span>
              {product.grade && <span className="grade-tag">{product.grade}</span>}
            </div>

            {product.description && (
              <div className="detail-description">
                <h2>Description</h2>
                <p>{product.description}</p>
              </div>
            )}

            {product.releaseDate && (
              <div className="detail-release">
                <strong>Release Date:</strong>{' '}
                {new Date(product.releaseDate).toLocaleDateString()}
              </div>
            )}

            <div className="detail-actions">
              <AddToCartButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: Number(product.price),
                  imageUrl: productImageUrl,
                }}
              />
              <Link href="/shop" className="btn-continue">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

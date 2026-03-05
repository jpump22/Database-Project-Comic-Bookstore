import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
// import configPromise from '@payload-config'
// import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Footer } from '@/Footer/Component'
import { getDatabase, setPageContext } from '@/utilities/db'
import {
  getAllPageSlugs,
  getPageBySlug,
  getHeroMedia,
  getBentoGridBlocks,
  getVintageSectionBlocks,
  getEventsSectionBlocks,
} from '@/queries/pages'
import {
  getProductForHero,
  getProductImages,
  getFeaturedProductsByIds,
  getProductImagesBatch,
} from '@/queries/products'

export async function generateStaticParams() {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })
  // const pages = await payload.find({
  //   collection: 'pages',
  //   draft: false,
  //   limit: 1000,
  //   overrideAccess: false,
  //   pagination: false,
  //   select: {
  //     slug: true,
  //   },
  // })

  // Use singleton database connection
  const db = getDatabase()

  const pages = db.prepare(getAllPageSlugs).all()

  // No db.close() - singleton connection is reused

  const params = pages
    ?.filter((doc: any) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }: any) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <main className="site-content">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  // Set page context based on slug
  if (slug === 'home') {
    setPageContext('HOME PAGE')
  } else {
    setPageContext(`PAGE: ${slug.toUpperCase()}`)
  }

  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // const result = await payload.find({
  //   collection: 'pages',
  //   draft,
  //   limit: 1,
  //   pagination: false,
  //   overrideAccess: draft,
  //   where: {
  //     slug: {
  //       equals: slug,
  //     },
  //   },
  // })

  // return result.docs?.[0] || null

  // Use singleton database connection
  const db = getDatabase()

  // Fetch page basic data
  const page: any = db.prepare(getPageBySlug).get(slug)

  if (!page) {
    // No db.close() - singleton connection is reused
    return null
  }

  // Fetch hero media if exists
  if (page.hero_media_id) {
    const heroMedia = db.prepare(getHeroMedia).get(page.hero_media_id)
    page.hero = {
      ...page.hero,
      media: heroMedia
    }
  }

  // Fetch hero featured product if exists
  let featuredProduct = null
  if (page.hero_featured_product_id) {
    const productRaw = db.prepare(getProductForHero).get(page.hero_featured_product_id)

    if (productRaw) {
      // Fetch images for the product
      const imagesRaw = db.prepare(getProductImages).all(page.hero_featured_product_id)

      featuredProduct = {
        id: productRaw.id,
        title: productRaw.title,
        price: productRaw.price,
        badge: productRaw.badge,
        productType: productRaw.product_type_id ? { name: productRaw.productType_name } : null,
        publisher: productRaw.publisher_id ? { name: productRaw.publisher_name } : null,
        images: imagesRaw.map((img: any) => ({
          image: {
            id: img.id,
            alt: img.alt,
            url: img.url || (img.filename ? `/media/${img.filename}` : null),
            filename: img.filename
          }
        }))
      }
    }
  }

  // Reconstruct layout blocks from database
  const layout: any[] = []

  // Fetch bento grid blocks
  const bentoBlocks = db.prepare(getBentoGridBlocks).all(page.id)

  // Fetch specific COMIC products for the bento grid (not collectibles)
  // Product IDs: 5 (X-Men #1), 13 (Naruto Vol. 1), 11 (Watchmen #1)
  const bentoProductsRaw = db.prepare(getFeaturedProductsByIds).all()

  // Fetch images for these products
  const bentoProductIds = bentoProductsRaw.map((p: any) => p.id).join(',')
  const bentoProductImagesRaw = bentoProductIds ? db.prepare(
    getProductImagesBatch.replace('%IDS%', bentoProductIds)
  ).all() : []

  // Transform products for bento grid
  const bentoProducts = bentoProductsRaw.map((p: any) => {
    const productImages = bentoProductImagesRaw.filter((img: any) => img.product_id === p.id)
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      badge: p.badge,
      productType: p.productType_name ? { name: p.productType_name } : null,
      publisher: p.publisher_name ? { name: p.publisher_name } : null,
      images: productImages.map((img: any) => ({
        image: {
          id: img.id,
          alt: img.alt,
          url: img.url || (img.filename ? `/media/${img.filename}` : null),
          filename: img.filename
        }
      }))
    }
  })

  for (const block of bentoBlocks) {
    layout.push({
      blockType: 'bentoGrid',
      id: block.id,
      blockName: block.block_name,
      _order: block._order,
      featuredTitle: block.featured_title,
      featuredDescription: block.featured_description,
      featuredLabel: block.featured_label,
      featuredLink: block.featured_link,
      featuredCtaText: block.featured_cta_text,
      products: bentoProducts
    })
  }

  // Fetch vintage section blocks
  const vintageBlocks = db.prepare(getVintageSectionBlocks).all(page.id)

  for (const block of vintageBlocks) {
    layout.push({
      blockType: 'vintageSection',
      id: block.id,
      blockName: block.block_name,
      _order: block._order,
      titleOutline: block.title_outline,
      titleSolid: block.title_solid,
      subtitle: block.subtitle,
      infoCardTitle: block.info_card_title,
      infoCardText: block.info_card_text,
      infoCardLink: block.info_card_link
    })
  }

  // Fetch events section blocks
  const eventsBlocks = db.prepare(getEventsSectionBlocks).all(page.id)

  for (const block of eventsBlocks) {
    layout.push({
      blockType: 'eventsSection',
      id: block.id,
      blockName: block.block_name,
      _order: block._order
    })
  }

  // Sort layout blocks by _order to maintain correct sequence
  layout.sort((a: any, b: any) => (a._order || 0) - (b._order || 0))

  page.layout = layout

  // Transform to expected format
  const result = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    hero: {
      type: page.hero_type,
      richText: page.hero_rich_text,
      media: page.hero_media_id,
      title: page.hero_title,
      subtitle: page.hero_subtitle,
      ctaText: page.hero_cta_text,
      ctaLink: page.hero_cta_link,
      featuredProduct: featuredProduct,
      accentLabel: page.hero_accent_label
    },
    layout: page.layout,
    meta: {
      title: page.meta_title,
      description: page.meta_description,
      image: page.meta_image_id
    },
    publishedAt: page.published_at
  }

  // No db.close() - singleton connection is reused
  return result
})

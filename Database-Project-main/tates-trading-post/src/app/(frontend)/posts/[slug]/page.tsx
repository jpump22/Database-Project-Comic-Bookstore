import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getDatabase } from '@/utilities/db'

export async function generateStaticParams() {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })
  // const posts = await payload.find({
  //   collection: 'posts',
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

  const posts = db.prepare(`
    SELECT slug FROM posts
    WHERE _status = 'published'
    LIMIT 1000
  `).all()

  // No db.close() - singleton connection is reused

  const params = posts.map(({ slug }: any) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // const result = await payload.find({
  //   collection: 'posts',
  //   draft,
  //   limit: 1,
  //   overrideAccess: draft,
  //   pagination: false,
  //   where: {
  //     slug: {
  //       equals: slug,
  //     },
  //   },
  // })

  // return result.docs?.[0] || null

  // Use singleton database connection
  const db = getDatabase()

  // Fetch post with relationships
  const post = db.prepare(`
    SELECT p.*, m.url as heroImage_url, m.alt as heroImage_alt
    FROM posts p
    LEFT JOIN media m ON p.hero_image_id = m.id
    WHERE p.slug = ?
    LIMIT 1
  `).get(slug)

  if (!post) {
    // No db.close() - singleton connection is reused
    return null
  }

  // Fetch related posts
  const relatedPosts = db.prepare(`
    SELECT rp.id, rp.title, rp.slug
    FROM posts_rels pr
    INNER JOIN posts rp ON pr.posts_id = rp.id
    WHERE pr.parent_id = ? AND pr.path = 'relatedPosts'
    ORDER BY pr."order"
  `).all(post.id)

  // Fetch categories
  const categories = db.prepare(`
    SELECT c.id, c.title, c.slug
    FROM posts_rels pr
    INNER JOIN categories c ON pr.categories_id = c.id
    WHERE pr.parent_id = ? AND pr.path = 'categories'
    ORDER BY pr."order"
  `).all(post.id)

  // Fetch authors
  const authors = db.prepare(`
    SELECT u.id, u.name
    FROM posts_rels pr
    INNER JOIN users u ON pr.users_id = u.id
    WHERE pr.parent_id = ? AND pr.path = 'authors'
    ORDER BY pr."order"
  `).all(post.id)

  // No db.close() - singleton connection is reused

  // Transform to expected format
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    slug: post.slug,
    publishedAt: post.published_at,
    heroImage: post.hero_image_id ? {
      id: post.hero_image_id,
      url: post.heroImage_url,
      alt: post.heroImage_alt
    } : null,
    relatedPosts: relatedPosts,
    categories: categories,
    authors: authors,
    meta: {
      title: post.meta_title,
      description: post.meta_description,
      image: post.meta_image_id
    }
  } as any
})

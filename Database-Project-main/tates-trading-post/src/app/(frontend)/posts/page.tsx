import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import Link from 'next/link'
import { getDatabase } from '@/utilities/db'

export const dynamic = 'force-dynamic'
export const revalidate = 600

type Props = {
  searchParams: Promise<{
    genre?: string
  }>
}

export default async function Page({ searchParams }: Props) {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })
  const params = await searchParams
  const selectedGenre = params.genre

  // Use singleton database connection
  const db = getDatabase()

  // Fetch all categories/genres
  // const categories = await payload.find({
  //   collection: 'categories',
  //   limit: 100,
  //   sort: 'title',
  // })
  const categoriesRaw = db.prepare(`
    SELECT * FROM categories
    ORDER BY title ASC
    LIMIT 100
  `).all()

  // Build the query with optional genre filter
  // const query: any = {
  //   collection: 'posts',
  //   depth: 1,
  //   limit: 12,
  //   overrideAccess: false,
  //   select: {
  //     title: true,
  //     slug: true,
  //     categories: true,
  //     meta: true,
  //   },
  // }

  // Add category filter if a genre is selected
  // if (selectedGenre) {
  //   query.where = {
  //     'categories.slug': {
  //       equals: selectedGenre,
  //     },
  //   }
  // }

  // const posts = await payload.find(query)

  const limit = 12
  const page = 1 // This page doesn't use page numbers in URL, always page 1

  // Build SQL query with optional genre filter
  let postsQuery = `
    SELECT DISTINCT p.id, p.title, p.slug, p.meta_title, p.meta_description, p.meta_image_id
    FROM posts p
  `
  let countQuery = `SELECT COUNT(DISTINCT p.id) as total FROM posts p`
  let whereClause = ''

  if (selectedGenre) {
    postsQuery += `
      INNER JOIN posts_rels pr ON p.id = pr.parent_id AND pr.path = 'categories'
      INNER JOIN categories c ON pr.categories_id = c.id
    `
    countQuery += `
      INNER JOIN posts_rels pr ON p.id = pr.parent_id AND pr.path = 'categories'
      INNER JOIN categories c ON pr.categories_id = c.id
    `
    whereClause = ` WHERE c.slug = ?`
  }

  postsQuery += whereClause + ` ORDER BY p.created_at DESC LIMIT ?`
  countQuery += whereClause

  const postsRaw = selectedGenre
    ? db.prepare(postsQuery).all(selectedGenre, limit)
    : db.prepare(postsQuery).all(limit)

  const totalResult: any = selectedGenre
    ? db.prepare(countQuery).get(selectedGenre)
    : db.prepare(countQuery).get()

  const totalDocs = totalResult.total
  const totalPages = Math.ceil(totalDocs / limit)

  // Fetch categories for each post
  const postIds = postsRaw.map((p: any) => p.id).join(',')
  const postCategoriesRaw = postIds ? db.prepare(`
    SELECT pr.parent_id as post_id, c.*
    FROM posts_rels pr
    INNER JOIN categories c ON pr.categories_id = c.id
    WHERE pr.parent_id IN (${postIds}) AND pr.path = 'categories'
    ORDER BY pr."order"
  `).all() : []

  // Fetch meta images
  const metaImageIds = postsRaw
    .map((p: any) => p.meta_image_id)
    .filter(Boolean)
    .join(',')
  const metaImagesRaw = metaImageIds ? db.prepare(`
    SELECT * FROM media WHERE id IN (${metaImageIds})
  `).all() : []

  // No db.close() - singleton connection is reused

  // Transform posts to include categories and meta
  const postsDocs = postsRaw.map((p: any) => {
    const postCategories = postCategoriesRaw.filter((pc: any) => pc.post_id === p.id)
    const metaImage = metaImagesRaw.find((img: any) => img.id === p.meta_image_id)

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      categories: postCategories.map((pc: any) => ({
        id: pc.id,
        title: pc.title,
        slug: pc.slug
      })),
      meta: {
        title: p.meta_title,
        description: p.meta_description,
        image: metaImage ? {
          id: metaImage.id,
          url: metaImage.url || (metaImage.filename ? `/media/${metaImage.filename}` : null),
          alt: metaImage.alt
        } : null
      }
    }
  })

  const posts = {
    docs: postsDocs,
    totalDocs,
    limit,
    totalPages,
    page,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: totalPages > 1,
    prevPage: null,
    nextPage: totalPages > 1 ? 2 : null
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-b border-border/50 mb-16">
        <div className="container py-16">
          <h1 className="section-heading text-5xl md:text-6xl mb-4">
            Comic Listings
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our collection of comics and collectibles. Filter by genre to find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="container mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/posts"
            className={`px-4 py-2 rounded-full border transition-all ${
              !selectedGenre
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary hover:bg-primary/10'
            }`}
          >
            All Genres
          </Link>
          {categoriesRaw.map((category: any) => (
            <Link
              key={category.id}
              href={`/posts?genre=${category.slug}`}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedGenre === category.slug
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary hover:bg-primary/10'
              }`}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="container mb-6">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Comic Listings - Tates Trading Post`,
  }
}

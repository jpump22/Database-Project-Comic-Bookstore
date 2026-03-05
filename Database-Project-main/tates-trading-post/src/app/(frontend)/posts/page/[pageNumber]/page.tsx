import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { getDatabase } from '@/utilities/db'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  // const posts = await payload.find({
  //   collection: 'posts',
  //   depth: 1,
  //   limit: 12,
  //   page: sanitizedPageNumber,
  //   overrideAccess: false,
  // })

  // Use singleton database connection
  const db = getDatabase()

  const limit = 12
  const offset = (sanitizedPageNumber - 1) * limit

  // Get total count
  const totalResult: any = db.prepare(`
    SELECT COUNT(*) as total FROM posts
  `).get()
  const totalDocs = totalResult.total
  const totalPages = Math.ceil(totalDocs / limit)

  // Fetch paginated posts
  const postsRaw = db.prepare(`
    SELECT id, title, slug, meta_title, meta_description, meta_image_id
    FROM posts
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset)

  // No db.close() - singleton connection is reused

  const posts = {
    docs: postsRaw,
    totalDocs,
    limit,
    totalPages,
    page: sanitizedPageNumber,
    pagingCounter: offset + 1,
    hasPrevPage: sanitizedPageNumber > 1,
    hasNextPage: sanitizedPageNumber < totalPages,
    prevPage: sanitizedPageNumber > 1 ? sanitizedPageNumber - 1 : null,
    nextPage: sanitizedPageNumber < totalPages ? sanitizedPageNumber + 1 : null
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })
  // const { totalDocs } = await payload.count({
  //   collection: 'posts',
  //   overrideAccess: false,
  // })

  // Use singleton database connection
  const db = getDatabase()

  const totalResult: any = db.prepare(`
    SELECT COUNT(*) as total FROM posts
  `).get()

  // No db.close() - singleton connection is reused

  const totalDocs = totalResult.total
  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}

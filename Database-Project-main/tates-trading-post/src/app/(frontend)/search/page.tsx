import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { getDatabase } from '@/utilities/db'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // Use singleton database connection
  const db = getDatabase()

  // const posts = await payload.find({
  //   collection: 'search',
  //   depth: 1,
  //   limit: 12,
  //   select: {
  //     title: true,
  //     slug: true,
  //     categories: true,
  //     meta: true,
  //   },
  //   // pagination: false reduces overhead if you don't need totalDocs
  //   pagination: false,
  //   ...(query
  //     ? {
  //         where: {
  //           or: [
  //             {
  //               title: {
  //                 like: query,
  //               },
  //             },
  //             {
  //               'meta.description': {
  //                 like: query,
  //               },
  //             },
  //             {
  //               'meta.title': {
  //                 like: query,
  //               },
  //             },
  //             {
  //               slug: {
  //                 like: query,
  //               },
  //             },
  //           ],
  //         },
  //       }
  //     : {}),
  // })

  let searchResults: any[] = []
  let totalDocs = 0

  if (query) {
    const searchPattern = `%${query}%`
    searchResults = db.prepare(`
      SELECT s.id, s.title, s.slug, s.meta_title, s.meta_description, s.meta_image_id
      FROM search s
      WHERE s.title LIKE ?
         OR s.meta_description LIKE ?
         OR s.meta_title LIKE ?
         OR s.slug LIKE ?
      LIMIT 12
    `).all(searchPattern, searchPattern, searchPattern, searchPattern)

    totalDocs = searchResults.length
  }

  // Fetch categories for each search result (if they exist in search_rels)
  const searchIds = searchResults.map((s: any) => s.id).join(',')
  const searchCategoriesRaw = searchIds ? db.prepare(`
    SELECT sr.parent_id as search_id, c.*
    FROM search_rels sr
    INNER JOIN categories c ON sr.categories_id = c.id
    WHERE sr.parent_id IN (${searchIds})
  `).all() : []

  // Fetch meta images
  const metaImageIds = searchResults
    .map((s: any) => s.meta_image_id)
    .filter(Boolean)
    .join(',')
  const metaImagesRaw = metaImageIds ? db.prepare(`
    SELECT * FROM media WHERE id IN (${metaImageIds})
  `).all() : []

  // No db.close() - singleton connection is reused

  // Transform search results to match expected format
  const postsDocs = searchResults.map((s: any) => {
    const searchCategories = searchCategoriesRaw.filter((sc: any) => sc.search_id === s.id)
    const metaImage = metaImagesRaw.find((img: any) => img.id === s.meta_image_id)

    return {
      id: s.id,
      title: s.title,
      slug: s.slug,
      categories: searchCategories.map((sc: any) => ({
        id: sc.id,
        title: sc.title,
        slug: sc.slug
      })),
      meta: {
        title: s.meta_title,
        description: s.meta_description,
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
    totalDocs
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-b border-border/50 mb-16">
        <div className="container py-16 text-center">
          <h1 className="section-heading text-5xl md:text-6xl mb-6">
            Search
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find exactly what you're looking for
          </p>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <>
          <div className="container mb-8">
            <p className="text-muted-foreground">
              Found <span className="font-semibold text-foreground">{posts.totalDocs}</span> {posts.totalDocs === 1 ? 'result' : 'results'} {query && <>for "<span className="font-semibold text-foreground">{query}</span>"</>}
            </p>
          </div>
          <CollectionArchive posts={posts.docs as CardPostData[]} />
        </>
      ) : (
        <div className="container">
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or browse our posts instead.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Search - Tates Trading Post`,
  }
}

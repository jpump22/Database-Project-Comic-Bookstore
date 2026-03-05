import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-12">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2 animate-fade-in">
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category
                const titleToUse = categoryTitle || 'Untitled category'

                return (
                  <span key={index} className="category-badge bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {titleToUse}
                  </span>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-8 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-white/90">
            {hasAuthors && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/70">Author</p>
                  <p className="font-medium">{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/70">Published</p>
                  <time className="font-medium" dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
    </div>
  )
}

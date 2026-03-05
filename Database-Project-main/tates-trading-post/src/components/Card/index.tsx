'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'product-card overflow-hidden hover:cursor-pointer group animate-fade-in',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full overflow-hidden bg-muted image-overlay">
        {!metaImage && (
          <div className="aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm font-medium">No image available</p>
            </div>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="transition-transform group-hover:scale-110 duration-500 ease-out">
            <Media resource={metaImage} size="33vw" />
          </div>
        )}
      </div>
      <div className="p-5">
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'

                return (
                  <span key={index} className="category-badge">
                    {categoryTitle}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}
        {titleToUse && (
          <h3 className="text-lg font-semibold mb-2 leading-snug tracking-tight">
            <Link
              className="text-foreground hover:text-primary transition-colors duration-200"
              href={href}
              ref={link.ref}
            >
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {sanitizedDescription}
          </p>
        )}
      </div>
    </article>
  )
}

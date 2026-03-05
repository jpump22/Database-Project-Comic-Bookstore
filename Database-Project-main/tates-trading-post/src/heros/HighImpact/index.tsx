'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[48rem] md:text-center glass-effect p-12 rounded-lg shadow-lg animate-fade-in">
          {richText && (
            <RichText
              className="mb-8 prose-headings:text-secondary prose-headings:font-bold prose-headings:tracking-tight"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4 flex-wrap">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink className="cta-button" {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <>
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/30 to-black/70"></div>
          </>
        )}
      </div>
    </div>
  )
}

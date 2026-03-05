import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16 animate-fade-in">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText className="prose-headings:section-heading prose-headings:text-3xl prose-headings:md:text-4xl" data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}

import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container my-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-lg p-8 md:p-12 shadow-lg">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div className="max-w-[48rem] flex items-center text-primary-foreground">
            {richText && <RichText className="mb-0 prose-headings:text-white prose-p:text-white/90" data={richText} enableGutter={false} />}
          </div>
          <div className="flex flex-col gap-4 md:flex-shrink-0">
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} size="lg" className="bg-white text-primary hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-200" {...link} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-20">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]} animate-fade-in`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {richText && <RichText className="prose-headings:section-heading" data={richText} enableGutter={false} />}

                {enableLink && <CMSLink className="mt-6 inline-flex cta-button" {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}

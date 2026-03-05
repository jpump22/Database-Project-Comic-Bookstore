import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('container my-8', className)}>
      <div
        className={cn('border-l-4 py-4 px-6 flex items-center rounded-md shadow-sm transition-all duration-200 hover:shadow-md', {
          'border-l-primary bg-primary/5 border border-primary/20': style === 'info',
          'border-l-destructive bg-destructive/5 border border-destructive/20': style === 'error',
          'border-l-accent bg-accent/5 border border-accent/20': style === 'success',
          'border-l-secondary bg-secondary/5 border border-secondary/20': style === 'warning',
        })}
      >
        <RichText className="prose-p:mb-0" data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}

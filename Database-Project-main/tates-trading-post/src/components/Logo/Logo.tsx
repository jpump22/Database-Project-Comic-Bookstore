import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        alt="Tates Trading Post"
        width="120"
        height="120"
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
        src="/tates-logo.png"
      />
    </div>
  )
}

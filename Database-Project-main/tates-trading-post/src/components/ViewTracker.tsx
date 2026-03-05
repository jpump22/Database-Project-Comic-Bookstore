'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  productId: number
}

export function ViewTracker({ productId }: ViewTrackerProps) {
  useEffect(() => {
    // Track product view
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, action: 'view' }),
    }).catch(err => console.error('Failed to track view:', err))
  }, [productId])

  return null // This component renders nothing
}

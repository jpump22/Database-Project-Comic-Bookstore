'use client'

import React, { useEffect } from 'react'

export const FooterControls: React.FC = () => {
  useEffect(() => {
    const perfToggle = document.getElementById('perfToggle')
    const fpsToggle = document.getElementById('fpsToggle')

    const handlePerfToggle = () => {
      const body = document.body
      const isLowPerf = body.classList.contains('low-performance')

      if (isLowPerf) {
        body.classList.remove('low-performance', 'manual-perf-mode')
        localStorage.setItem('performanceMode', 'high')
      } else {
        body.classList.add('low-performance', 'manual-perf-mode')
        localStorage.setItem('performanceMode', 'low')
      }
    }

    const handleFpsToggle = () => {
      const body = document.body
      const isVisible = body.classList.contains('fps-visible')

      if (isVisible) {
        body.classList.remove('fps-visible')
        localStorage.setItem('fpsVisible', 'false')
        if (fpsToggle) {
          const span = fpsToggle.querySelector('span')
          if (span) span.textContent = 'Show FPS'
        }
      } else {
        body.classList.add('fps-visible')
        localStorage.setItem('fpsVisible', 'true')
        if (fpsToggle) {
          const span = fpsToggle.querySelector('span')
          if (span) span.textContent = 'Hide FPS'
        }
      }
    }

    perfToggle?.addEventListener('click', handlePerfToggle)
    fpsToggle?.addEventListener('click', handleFpsToggle)

    // Update button text based on saved state
    const savedFpsVisible = localStorage.getItem('fpsVisible') === 'true'
    if (savedFpsVisible && fpsToggle) {
      const span = fpsToggle.querySelector('span')
      if (span) span.textContent = 'Hide FPS'
    }

    return () => {
      perfToggle?.removeEventListener('click', handlePerfToggle)
      fpsToggle?.removeEventListener('click', handleFpsToggle)
    }
  }, [])

  return null
}

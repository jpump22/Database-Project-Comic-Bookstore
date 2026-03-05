'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import type { Header, SiteSettings } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'
import { CartIcon } from '@/components/CartIcon'

interface HeaderClientProps {
  data: Header
  siteSettings?: SiteSettings
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <nav className="main-nav glass-morph" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="nav-container">
        {/* Logo - Tates Branding */}
        <Link href="/" className="nav-logo" aria-label={siteSettings?.storeName || 'Tates Trading Post'}>
          <Image
            src="/tates-logo.png"
            alt="Tates Trading Post Logo"
            width={50}
            height={50}
            className="logo-image"
            priority
          />
          <div className="logo-text-container">
            <span className="logo-text">TATES</span>
            <span className="logo-subtext">TRADING POST</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/shop">Comics</a></li>
          <li><a href="/collectibles">Collectibles</a></li>
          <li><a href="/events">Events</a></li>
        </ul>

        {/* Cart Icon */}
        <CartIcon />

        {/* Theme Toggle Button with Sun/Moon Icons */}
        <button id="themeToggle" className="theme-toggle" aria-label="Toggle dark mode">
          <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </nav>
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer, SiteSettings } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const siteSettings: SiteSettings = await getCachedGlobal('site-settings', 1)()

  const navItems = footerData?.navItems || []
  const storeName = siteSettings?.storeName || 'Tates Trading Post'
  const socialLinks = siteSettings?.socialLinks || []
  const contactInfo = siteSettings?.contact || {}

  return (
    <footer className="site-footer glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">TATES TRADING POST</span>
          <p className="footer-tagline">Your comic book universe since 2020</p>
        </div>
        <div className="footer-social">
          <h3 className="footer-section-title">Follow Us</h3>
          <div className="footer-social-links">
            <a href="https://instagram.com/tatestradingpost" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h3 className="footer-section-title">Quick Links</h3>
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/collectibles">Collectibles</a>
          <a href="/events">Events</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        <div className="footer-controls">
          <button
            id="perfToggle"
            className="perf-toggle-footer"
            aria-label="Toggle performance mode"
            title="Toggle performance mode (disables animations)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span>Performance Mode</span>
          </button>
          <button
            id="fpsToggle"
            className="fps-toggle-footer"
            aria-label="Toggle FPS monitor"
            title="Toggle FPS monitor visibility"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M3 9h18M9 3v18"></path>
            </svg>
            <span>Show FPS</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

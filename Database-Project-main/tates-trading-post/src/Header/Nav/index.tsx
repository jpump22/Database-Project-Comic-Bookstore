'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-1 items-center">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
          />
        )
      })}
      <div className="ml-2 h-5 w-px bg-border" />
      <Link
        href="/search"
        className="ml-2 p-2.5 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
        aria-label="Search"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4 h-4" />
      </Link>
      <div className="ml-2 h-5 w-px bg-border" />
      <div className="ml-2">
        <ThemeSelector />
      </div>
    </nav>
  )
}

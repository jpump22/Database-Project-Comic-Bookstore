'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, ProductType, Publisher, Media } from '@/payload-types'

interface CollectiblesClientProps {
  productTypes: ProductType[]
  publishers: Publisher[]
  products: Product[]
}

export const CollectiblesClient: React.FC<CollectiblesClientProps> = ({
  productTypes,
  publishers,
  products,
}) => {
  const [selectedPublisher, setSelectedPublisher] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'price-high' | 'price-low' | 'grade'>('price-high')

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Filter by publisher
      if (selectedPublisher !== null) {
        const publisherId =
          typeof product.publisher === 'object' ? product.publisher?.id : product.publisher
        if (publisherId !== selectedPublisher) return false
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return product.title.toLowerCase().includes(query)
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === 'price-high') {
        return Number(b.price) - Number(a.price)
      } else if (sortBy === 'price-low') {
        return Number(a.price) - Number(b.price)
      } else if (sortBy === 'grade') {
        // Sort by grade if available
        if (a.grade && b.grade) {
          return b.grade.localeCompare(a.grade)
        }
        return a.grade ? -1 : 1
      }
      return 0
    })

    return filtered
  }, [products, selectedPublisher, searchQuery, sortBy])

  // Get publisher name
  const getPublisherName = (pubId: number | Publisher | null | undefined) => {
    if (!pubId) return 'Unknown'
    if (typeof pubId === 'object') return pubId.name
    const pub = publishers.find((p) => p.id === pubId)
    return pub?.name || 'Unknown'
  }

  // Get first product image
  const getProductImage = (product: Product): string | null => {
    if (product.images?.[0]) {
      const firstImage = product.images[0].image
      if (typeof firstImage === 'object' && firstImage !== null) {
        return (firstImage as Media).url || null
      }
    }
    return null
  }

  // Get year from release date
  const getYear = (releaseDate: string | null | undefined): string => {
    if (!releaseDate) return ''
    return new Date(releaseDate).getFullYear().toString()
  }

  return (
    <main className="shop-page collectibles-page">
      {/* Hero Section */}
      <div className="collectibles-hero-unique">
        <div className="hero-texture-bg"></div>
        <div className="shop-hero-content">
          <div className="hero-eyebrow">Premium Collection</div>
          <h1 className="collectibles-hero-title-unique">
            <span className="title-word-1">Toys</span>
            <span className="title-word-2">&</span>
            <span className="title-word-3">Collectibles</span>
          </h1>
        </div>
      </div>

      <div className="shop-container">
        {/* Enhanced Filters */}
        <div className="shop-filters-wrapper">
          <div className="shop-filters">
            {/* Search Bar */}
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search collectibles..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-row">
              {/* Publisher Filter */}
              <div className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">Publishers</h3>
                  {selectedPublisher !== null && (
                    <button className="clear-filter" onClick={() => setSelectedPublisher(null)}>
                      Clear
                    </button>
                  )}
                </div>
                <div className="filter-chips">
                  {publishers.map((pub) => (
                    <button
                      key={pub.id}
                      className={`filter-chip ${selectedPublisher === pub.id ? 'active' : ''}`}
                      onClick={() => setSelectedPublisher(selectedPublisher === pub.id ? null : pub.id)}
                    >
                      {pub.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="filter-section">
                <h3 className="filter-title">Sort By</h3>
                <div className="filter-chips">
                  <button
                    className={`filter-chip ${sortBy === 'price-high' ? 'active' : ''}`}
                    onClick={() => setSortBy('price-high')}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`filter-chip ${sortBy === 'price-low' ? 'active' : ''}`}
                    onClick={() => setSortBy('price-low')}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`filter-chip ${sortBy === 'grade' ? 'active' : ''}`}
                    onClick={() => setSortBy('grade')}
                  >
                    By Grade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-container grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No collectibles found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const imageUrl = getProductImage(product)
              const productTypeId =
                typeof product.productType === 'object'
                  ? product.productType.id
                  : product.productType
              const publisherId =
                typeof product.publisher === 'object'
                  ? product.publisher?.id
                  : product.publisher
              const year = getYear(product.releaseDate)

              return (
                <div key={product.id} className="product-card collectible-card">
                  {/* Product Image */}
                  <div className="product-image-wrapper">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        width={400}
                        height={600}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                        </svg>
                        <span>No Image</span>
                      </div>
                    )}
                    {product.badge && (
                      <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                        {product.badge}
                      </span>
                    )}
                    {product.grade && (
                      <span className="grade-badge">{product.grade}</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="product-content">
                    <div className="product-header">
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-meta">
                        {publisherId && (
                          <span className="meta-publisher">{getPublisherName(publisherId)}</span>
                        )}
                        {year && (
                          <>
                            <span className="meta-separator">•</span>
                            <span className="meta-year">{year}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {product.description && (
                      <p className="product-description">
                        {product.description.substring(0, 120)}
                        {product.description.length > 120 ? '...' : ''}
                      </p>
                    )}

                    <div className="product-footer">
                      <div className="price-section">
                        <span className="product-price">${Number(product.price).toLocaleString()}</span>
                      </div>
                      <Link href={`/product/${product.id}`} className="view-product-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}

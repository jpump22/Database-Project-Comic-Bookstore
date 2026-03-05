import React from 'react'
import Image from 'next/image'
import type { Page, Product, Media } from '@/payload-types'

export const TatesHero: React.FC<Page['hero']> = (props) => {
  // Extract tatesHero-specific props with defaults
  const title = props.title || 'YOUR COMIC UNIVERSE'
  const subtitle = props.subtitle || 'Premium collectibles, rare finds, and epic stories await'
  const ctaText = props.ctaText || 'Explore Collection'
  const ctaLink = props.ctaLink || '#new'
  const accentLabel = props.accentLabel || 'This Week'

  // Handle featuredProduct (might be number ID or full Product object)
  const featuredProduct =
    props.featuredProduct && typeof props.featuredProduct === 'object'
      ? (props.featuredProduct as Product)
      : null

  // Extract first image URL if product has images
  let productImageUrl: string | null = null
  if (featuredProduct?.images?.[0]) {
    const firstImage = featuredProduct.images[0].image
    if (typeof firstImage === 'object' && firstImage !== null) {
      productImageUrl = (firstImage as Media).url || null
    }
  }

  // Split title into words for kinetic animation
  const titleWords = title.split(' ')

  return (
    <section className="hero-section">
      <div className="hero-grid">
        {/* Hero Main */}
        <div className="hero-main">
          <div className="benday-overlay"></div>
          <h1 className="kinetic-title">
            {titleWords.map((word, i) => (
              <span key={i} className="word" data-word={i + 1}>
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">{subtitle}</p>
          <div className="hero-cta">
            <a href="/shop" className="btn btn-primary">
              {ctaText}
            </a>
          </div>
        </div>

        {/* Hero Accent */}
        <div className="hero-accent glass-panel">
          <div className="accent-content">
            <span className="accent-label">{accentLabel}</span>
            {featuredProduct ? (
              <>
                <h3>{featuredProduct.title}</h3>
                <p className="accent-price">${featuredProduct.price.toFixed(2)}</p>
                {featuredProduct.badge && featuredProduct.badge !== '' && (
                  <div className="badge-hot">{featuredProduct.badge}</div>
                )}
              </>
            ) : (
              <>
                <h3>Spider-Verse #1</h3>
                <p className="accent-price">$49.99</p>
                <div className="badge-hot">HOT</div>
              </>
            )}
          </div>
          {productImageUrl && (
            <Image
              src={productImageUrl}
              alt={featuredProduct?.title || 'Featured Product'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          )}
          <div className="benday-overlay benday-red"></div>
        </div>
      </div>
    </section>
  )
}

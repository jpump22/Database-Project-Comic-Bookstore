import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BentoGridBlock, Product, Media, Publisher } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const BentoGridBlock: React.FC<BentoGridBlock> = async (props) => {
  // Extract props with defaults
  const featuredTitle = props.featuredTitle || 'Winter Collection 2025'
  const featuredDescription =
    props.featuredDescription ||
    'Exclusive variants and limited editions from Marvel, DC, and indie publishers'
  const featuredLabel = props.featuredLabel || 'Featured Drop'
  const featuredLink = props.featuredLink || '#'
  const featuredCtaText = props.featuredCtaText || 'View Collection →'

  // Extract products (up to 3)
  const products =
    props.products
      ?.filter((p): p is Product => typeof p === 'object' && p !== null)
      .slice(0, 3) || []

  // Fetch site settings for stats and testimonial
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  const stats = siteSettings?.stats
  const totalComics = stats?.totalComics || 5000
  const rareItems = stats?.rareItems || 500
  const testimonialQuote = stats?.testimonialQuote || 'Best comic shop in the city!'
  const testimonialAuthor = stats?.testimonialAuthor || 'Comic Book Resources'

  // Helper to get product image URL
  const getProductImageUrl = (product: Product): string | null => {
    if (!product.images?.[0]) return null
    const firstImage = product.images[0].image
    if (typeof firstImage === 'object' && firstImage !== null) {
      return (firstImage as Media).url || null
    }
    return null
  }

  // Helper to get publisher name
  const getPublisherName = (product: Product): string => {
    if (!product.publisher) return 'Unknown'
    if (typeof product.publisher === 'object') {
      return (product.publisher as Publisher).name || 'Unknown'
    }
    return 'Unknown'
  }

  // Color mapping for benday overlays
  const colors = ['red', 'blue', 'yellow', 'magenta', 'cyan']
  const bendayColors = ['benday-magenta', 'benday-cyan', 'benday-yellow']

  return (
    <section className="bento-grid" id="new">
      {/* Large Feature Card */}
      <article className="bento-item bento-large" data-tilt="true">
        <div className="benday-overlay benday-blue"></div>
        <div className="glass-morph panel-content">
          <span className="panel-label">{featuredLabel}</span>
          <h2 className="panel-title">{featuredTitle}</h2>
          <p className="panel-desc">{featuredDescription}</p>
          <a href={featuredLink} className="btn btn-glass">
            {featuredCtaText}
          </a>
        </div>
      </article>

      {/* Comic Card 1 (Tall) - First product */}
      {products[0] ? (
        <article className="bento-item bento-tall comic-card" data-tilt="true">
          <div className="card-cover" data-color={colors[0]}>
            {getProductImageUrl(products[0]) && (
              <Image
                src={getProductImageUrl(products[0])!}
                alt={products[0].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
            <div className={`benday-overlay ${bendayColors[0]}`}></div>
            {products[0].badge && products[0].badge !== '' && (
              <span className="issue-badge glass-panel">{products[0].badge}</span>
            )}
          </div>
          <div className="card-info glass-panel">
            <h3 className="card-title">{products[0].title}</h3>
            <p className="card-meta">
              {getPublisherName(products[0])} · {new Date().getFullYear()}
            </p>
            <div className="card-footer">
              <span className="price">${products[0].price.toFixed(2)}</span>
              <Link href={`/product/${products[0].id}`} className="btn-icon">
                +
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <article className="bento-item bento-tall comic-card" data-tilt="true">
          <div className="card-cover" data-color="red">
            <div className="benday-overlay benday-magenta"></div>
            <span className="issue-badge glass-panel">NEW</span>
          </div>
          <div className="card-info glass-panel">
            <h3 className="card-title">Crimson Knight #47</h3>
            <p className="card-meta">Marvel · 2025</p>
            <div className="card-footer">
              <span className="price">$4.99</span>
              <Link href="/shop" className="btn-icon">
                +
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Info Panel - Stats */}
      <article className="bento-item bento-medium info-panel">
        <div className="glass-panel panel-full">
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-number">{totalComics.toLocaleString()}+</span>
              <span className="stat-label">Comics</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{rareItems.toLocaleString()}+</span>
              <span className="stat-label">Rare Items</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comic Card 2 (Horizontal/Wide) - Second product */}
      {products[1] ? (
        <article className="bento-item bento-wide comic-card-horizontal" data-tilt="true">
          <div className="card-cover-small" data-color={colors[1]}>
            {getProductImageUrl(products[1]) && (
              <Image
                src={getProductImageUrl(products[1])!}
                alt={products[1].title}
                fill
                className="object-cover"
                sizes="200px"
              />
            )}
            <div className={`benday-overlay ${bendayColors[1]}`}></div>
          </div>
          <div className="card-info-inline glass-morph">
            <div>
              <h3 className="card-title-sm">{products[1].title}</h3>
              <p className="card-meta-sm">
                {getPublisherName(products[1])} · {new Date().getFullYear()}
              </p>
            </div>
            <div className="card-price-action">
              <span className="price-sm">${products[1].price.toFixed(2)}</span>
              <Link href={`/product/${products[1].id}`} className="btn-icon">
                +
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <article className="bento-item bento-wide comic-card-horizontal" data-tilt="true">
          <div className="card-cover-small" data-color="blue">
            <div className="benday-overlay benday-cyan"></div>
          </div>
          <div className="card-info-inline glass-morph">
            <div>
              <h3 className="card-title-sm">Astro Force #12</h3>
              <p className="card-meta-sm">DC Comics · 2025</p>
            </div>
            <div className="card-price-action">
              <span className="price-sm">$4.99</span>
              <Link href="/shop" className="btn-icon">
                +
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Comic Card 3 (Medium) - Third product */}
      {products[2] ? (
        <article className="bento-item bento-medium comic-card" data-tilt="true">
          <div className="card-cover" data-color={colors[2]}>
            {getProductImageUrl(products[2]) && (
              <Image
                src={getProductImageUrl(products[2])!}
                alt={products[2].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
            <div className={`benday-overlay ${bendayColors[2]}`}></div>
            {products[2].badge && products[2].badge !== '' && (
              <span className="issue-badge glass-panel">{products[2].badge}</span>
            )}
          </div>
          <div className="card-info glass-panel">
            <h3 className="card-title">{products[2].title}</h3>
            <p className="card-meta">
              {getPublisherName(products[2])} · {new Date().getFullYear()}
            </p>
            <div className="card-footer">
              <span className="price">${products[2].price.toFixed(2)}</span>
              <Link href={`/product/${products[2].id}`} className="btn-icon">
                +
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <article className="bento-item bento-medium comic-card" data-tilt="true">
          <div className="card-cover" data-color="yellow">
            <div className="benday-overlay benday-yellow"></div>
            <span className="issue-badge glass-panel">HOT</span>
          </div>
          <div className="card-info glass-panel">
            <h3 className="card-title">Golden Age #1</h3>
            <p className="card-meta">Image · 2025</p>
            <div className="card-footer">
              <span className="price">$5.99</span>
              <Link href="/shop" className="btn-icon">
                +
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Quote Panel - Testimonial */}
      <article className="bento-item bento-medium quote-panel">
        <div className="glass-panel panel-full">
          <p className="quote">"{testimonialQuote}"</p>
          <p className="quote-author">— {testimonialAuthor}</p>
        </div>
      </article>
    </section>
  )
}

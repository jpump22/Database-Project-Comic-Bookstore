import React from 'react'
import Image from 'next/image'
import type { VintageSectionBlock, Product, Media } from '@/payload-types'

export const VintageSectionBlock: React.FC<VintageSectionBlock> = (props) => {
  // Extract props with defaults
  const titleOutline = props.titleOutline || 'RARE'
  const titleSolid = props.titleSolid || 'COLLECTIBLES'
  const subtitle = props.subtitle || 'Investment-grade comics & vintage treasures'
  const infoCardTitle = props.infoCardTitle || 'CGC Certified'
  const infoCardText =
    props.infoCardText || 'All vintage items are professionally graded and authenticated'
  const infoCardLink = props.infoCardLink || '#'

  // Extract vintage products (up to 4)
  const vintageProducts =
    props.vintageProducts
      ?.filter((p): p is Product => typeof p === 'object' && p !== null)
      .slice(0, 4) || []

  // Helper to get product image URL
  const getProductImageUrl = (product: Product): string | null => {
    if (!product.images?.[0]) return null
    const firstImage = product.images[0].image
    if (typeof firstImage === 'object' && firstImage !== null) {
      return (firstImage as Media).url || null
    }
    return null
  }

  // Era mapping for data-era attribute
  const eras = ['golden', 'silver', 'bronze', 'modern']

  // Benday overlay colors for vintage cards
  const bendayColors = ['benday-aged', 'benday-vintage-blue', 'benday-vintage-red']

  // Card size classes - first card is large, second is medium, third is small
  const cardSizes = ['vintage-card-large', 'vintage-card-medium', 'vintage-card-small']

  // Extract release year from releaseDate string (YYYY-MM-DD)
  const getReleaseYear = (product: Product): string => {
    if (!product.releaseDate) return new Date().getFullYear().toString()
    return product.releaseDate.split('-')[0]
  }

  return (
    <section className="vintage-section" id="vintage">
      {/* Section Header */}
      <div className="section-header-broken">
        <h2 className="section-title-large">
          <span className="title-outline">{titleOutline}</span>
          <span className="title-solid">{titleSolid}</span>
        </h2>
        <p className="section-subtitle-offset">{subtitle}</p>
      </div>

      {/* Vintage Grid - 12 Column Layout */}
      <div className="vintage-grid">
        {/* Dynamic Vintage Cards (up to 3) */}
        {vintageProducts.slice(0, 3).map((product, index) => (
          <article
            key={product.id}
            className={`vintage-card ${cardSizes[index] || 'vintage-card-small'}`}
            data-tilt="true"
          >
            <div className="vintage-image" data-era={eras[index]}>
              {getProductImageUrl(product) && (
                <Image
                  src={getProductImageUrl(product)!}
                  alt={product.title}
                  width={600}
                  height={900}
                  className="vintage-product-image"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              )}
              <div className={`benday-overlay ${bendayColors[index] || 'benday-aged'}`}></div>
              {product.grade && <div className="glass-panel grade-badge">{product.grade}</div>}
            </div>
            <div className="vintage-info glass-panel">
              <h3 className="vintage-title">{product.title}</h3>
              <p className="vintage-year">{getReleaseYear(product)}</p>
              <p className="vintage-price">${product.price.toLocaleString()}</p>
              {index === 0 && <button className="btn btn-outline">Inquire</button>}
            </div>
          </article>
        ))}

        {/* Fallback cards if less than 3 products */}
        {vintageProducts.length === 0 && (
          <>
            <article className="vintage-card vintage-card-large" data-tilt="true">
              <div className="vintage-image" data-era="golden">
                <div className="benday-overlay benday-aged"></div>
                <div className="glass-panel grade-badge">CGC 9.2</div>
              </div>
              <div className="vintage-info glass-panel">
                <h3 className="vintage-title">Amazing Fantasy #15</h3>
                <p className="vintage-year">1962 · First Spider-Man</p>
                <p className="vintage-price">$45,000</p>
                <button className="btn btn-outline">Inquire</button>
              </div>
            </article>

            <article className="vintage-card vintage-card-medium" data-tilt="true">
              <div className="vintage-image" data-era="silver">
                <div className="benday-overlay benday-vintage-blue"></div>
                <div className="glass-panel grade-badge">CGC 8.5</div>
              </div>
              <div className="vintage-info glass-panel">
                <h3 className="vintage-title">Detective Comics #27</h3>
                <p className="vintage-year">1939 · First Batman</p>
                <p className="vintage-price">$125,000</p>
              </div>
            </article>

            <article className="vintage-card vintage-card-small" data-tilt="true">
              <div className="vintage-image" data-era="bronze">
                <div className="benday-overlay benday-vintage-red"></div>
                <div className="glass-panel grade-badge">CGC 9.6</div>
              </div>
              <div className="vintage-info glass-panel">
                <h3 className="vintage-title">X-Men #1</h3>
                <p className="vintage-year">1963</p>
                <p className="vintage-price">$32,500</p>
              </div>
            </article>
          </>
        )}

        {vintageProducts.length === 1 && (
          <>
            <article className="vintage-card vintage-card-medium" data-tilt="true">
              <div className="vintage-image" data-era="silver">
                <div className="benday-overlay benday-vintage-blue"></div>
                <div className="glass-panel grade-badge">CGC 8.5</div>
              </div>
              <div className="vintage-info glass-panel">
                <h3 className="vintage-title">Detective Comics #27</h3>
                <p className="vintage-year">1939 · First Batman</p>
                <p className="vintage-price">$125,000</p>
              </div>
            </article>

            <article className="vintage-card vintage-card-small" data-tilt="true">
              <div className="vintage-image" data-era="bronze">
                <div className="benday-overlay benday-vintage-red"></div>
                <div className="glass-panel grade-badge">CGC 9.6</div>
              </div>
              <div className="vintage-info glass-panel">
                <h3 className="vintage-title">X-Men #1</h3>
                <p className="vintage-year">1963</p>
                <p className="vintage-price">$32,500</p>
              </div>
            </article>
          </>
        )}

        {vintageProducts.length === 2 && (
          <article className="vintage-card vintage-card-small" data-tilt="true">
            <div className="vintage-image" data-era="bronze">
              <div className="benday-overlay benday-vintage-red"></div>
              <div className="glass-panel grade-badge">CGC 9.6</div>
            </div>
            <div className="vintage-info glass-panel">
              <h3 className="vintage-title">X-Men #1</h3>
              <p className="vintage-year">1963</p>
              <p className="vintage-price">$32,500</p>
            </div>
          </article>
        )}

        {/* Info Card */}
        <article className="vintage-card vintage-card-info">
          <div className="glass-panel panel-full">
            <h3 className="info-title">{infoCardTitle}</h3>
            <p className="info-text">{infoCardText}</p>
            <a href={infoCardLink} className="link-arrow">
              Learn More →
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}

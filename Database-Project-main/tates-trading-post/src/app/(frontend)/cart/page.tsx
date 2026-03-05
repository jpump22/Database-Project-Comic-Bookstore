'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="empty-cart-hero">
            <div className="empty-cart-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1>Your Cart is Empty</h1>
            <p className="empty-cart-subtitle">
              Looks like you haven't added any comics or collectibles yet.
              <br />
              Start exploring our collection!
            </p>
            <div className="empty-cart-actions">
              <Link href="/shop" className="btn-shop-comics">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Shop Comics
              </Link>
              <Link href="/collectibles" className="btn-shop-collectibles">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Shop Collectibles
              </Link>
            </div>
            <div className="empty-cart-features">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Authentic Products</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Fast Shipping</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="btn-clear-cart">
            Clear Cart
          </button>
        </div>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={100}
                    height={150}
                    className="item-image"
                  />
                ) : (
                  <div className="item-image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>

              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="btn-remove"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span className="summary-price">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span className="summary-price">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="cart-actions">
            <Link href="/shop" className="btn-continue">
              Continue Shopping
            </Link>
            <Link href="/checkout" className="btn-checkout">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

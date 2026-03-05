'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="checkout-success-page">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#C44536', '#4A7C8C', '#D4B53A', '#A04668'][Math.floor(Math.random() * 4)]
            }} />
          ))}
        </div>
      )}

      <div className="success-container">
        <div className="success-icon-wrapper">
          <div className="success-icon-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="success-checkmark">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="success-title">Order Successful!</h1>

        <p className="success-message">
          Thank you for your purchase! 🎉
          <br />
          Your order has been successfully placed and we're excited to get it to you.
        </p>

        {orderId && (
          <div className="order-details">
            <div className="order-id-card">
              <span className="order-label">Customer ID</span>
              <span className="order-number">#{orderId}</span>
            </div>
            <p className="order-note">
              You can use this ID to track your order status.
            </p>
          </div>
        )}

        <div className="success-features">
          <div className="success-feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p>Confirmation email sent</p>
          </div>
          <div className="success-feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>Order confirmed</p>
          </div>
          <div className="success-feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p>Fast shipping</p>
          </div>
        </div>

        <div className="success-actions">
          <Link href="/shop" className="btn-continue-shopping">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Continue Shopping
          </Link>
          <Link href="/" className="btn-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

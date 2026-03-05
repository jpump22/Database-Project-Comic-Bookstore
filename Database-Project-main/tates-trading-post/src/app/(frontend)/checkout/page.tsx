'use client'

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items: items,
          totalPrice: totalPrice,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/checkout/success?orderId=${data.customerId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="checkout-grid">
          {/* Customer Information Form */}
          <div className="checkout-form-section">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>Customer Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john.doe@example.com"
                />
              </div>

              <h3>Payment Information</h3>
              <p className="payment-note">This is a demo - no real payment will be processed</p>

              <div className="form-group">
                <label htmlFor="cardNumber">
                  Card Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">
                    Expiry Date <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardCvv">
                    CVV <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardCvv"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                    required
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="form-actions">
                <Link href="/cart" className="btn-secondary">
                  Back to Cart
                </Link>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing Payment...' : 'Complete Purchase'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={60}
                      height={90}
                      className="summary-item-image"
                    />
                  )}
                  <div className="summary-item-info">
                    <p className="summary-item-title">{item.title}</p>
                    <p className="summary-item-details">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="summary-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

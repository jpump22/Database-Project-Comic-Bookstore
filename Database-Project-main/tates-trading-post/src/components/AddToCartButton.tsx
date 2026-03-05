'use client'

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    price: number
    imageUrl?: string | null
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl || undefined,
    })

    // Track cart add with SQL
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: Number(product.id), action: 'cart' }),
    }).catch(err => console.error('Failed to track cart add:', err))

    // Show brief success feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <div className="add-to-cart-section">
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <div className="quantity-controls">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="quantity-btn"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="quantity-input"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="quantity-btn"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`btn-add-to-cart ${isAdding ? 'adding' : ''}`}
        disabled={isAdding}
      >
        {isAdding ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  )
}

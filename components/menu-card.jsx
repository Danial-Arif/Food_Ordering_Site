'use client'
import { useState, useCallback } from 'react'
import { BiStar, BiSolidStar, BiPlus, BiTimeFive } from 'react-icons/bi'
import { useCart } from './cart-provider'

export default function MenuCard({ item, onViewDetails }) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAdd = useCallback((e) => {
    e.stopPropagation()
    setIsAdding(true)
    addItem(item)
    setTimeout(() => setIsAdding(false), 600)
  }, [addItem, item])

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating)
          ? <BiSolidStar key={i} size={12} style={{ color: 'var(--accent)' }} />
          : <BiStar key={i} size={12} style={{ color: 'var(--text-muted)' }} />
      )
    }
    return stars
  }

  return (
    <div
      className="glass-card group cursor-pointer overflow-hidden"
      onClick={() => onViewDetails(item)}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4/3', background: 'var(--bg-primary)', flexShrink: 0 }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '3rem' }}>
            🍽️
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)' }}
        />

        {/* Category Badge */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <span className="badge">{item.category}</span>
        </div>

        {/* Add to Cart Button — appears on hover */}
        <div
          className="absolute transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ bottom: '1rem', right: '1rem' }}
        >
          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.7rem',
              gap: '0.35rem',
              transform: isAdding ? 'scale(0.9)' : 'scale(1)',
              background: isAdding ? '#4ade80' : undefined,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <BiPlus size={14} />
            {isAdding ? 'Added!' : 'Add to Cart'}
          </button>
        </div>

        {/* Price — floats bottom left on the image */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
          <span
            className="heading-display text-lg"
            style={{ color: 'var(--accent)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            Rs. {item.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {/* Name */}
        <h3
          className="heading-display group-hover:text-[var(--accent)] transition-colors duration-300"
          style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.3 }}
        >
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </p>
        )}

        {/* Bottom Row */}
        <div
          className="flex items-center justify-between"
          style={{
            marginTop: 'auto',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center" style={{ gap: '0.5rem' }}>
            <div className="flex items-center" style={{ gap: '2px' }}>
              {renderStars(item.averageRating || 0)}
            </div>
            <span className="label-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              ({item.reviewCount || 0})
            </span>
          </div>

          <div className="flex items-center" style={{ gap: '0.25rem' }}>
            <BiTimeFive size={12} style={{ color: 'var(--text-muted)' }} />
            <span className="label-mono" style={{ fontSize: '0.6rem' }}>20-30 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

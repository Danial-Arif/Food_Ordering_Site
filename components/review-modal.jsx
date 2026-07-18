'use client'
import { useState, useEffect, useCallback } from 'react'
import { BiX, BiStar, BiSolidStar, BiTimeFive, BiPlus } from 'react-icons/bi'
import { useCart } from './cart-provider'

export default function ReviewModal({ item, onClose }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?menuItemId=${item._id}`)
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [item._id])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('foodpanada-token')
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          menuItemId: item._id,
          rating,
          comment,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit review')
        return
      }

      setSuccess(true)
      setRating(0)
      setComment('')
      fetchReviews()
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAdd = () => {
    setIsAdding(true)
    addItem(item)
    setTimeout(() => setIsAdding(false), 600)
  }

  const renderInteractiveStars = () => {
    return (
      <div className="flex gap-2" style={{ marginTop: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              transition: 'transform 0.2s ease',
              transform: (hoverRating >= i || rating >= i) ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {(hoverRating >= i || (hoverRating === 0 && rating >= i)) ? (
              <BiSolidStar size={26} style={{ color: 'var(--accent)' }} />
            ) : (
              <BiStar size={26} style={{ color: 'var(--text-muted)' }} />
            )}
          </button>
        ))}
      </div>
    )
  }

  const renderStars = (r) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          i <= Math.round(r)
            ? <BiSolidStar key={i} size={13} style={{ color: 'var(--accent)' }} />
            : <BiStar key={i} size={13} style={{ color: 'var(--text-muted)' }} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="overlay" onClick={onClose} style={{ zIndex: 100 }} />
      <div className="modal p-0" style={{ zIndex: 101 }}>
        
        {/* Hero Image Block */}
        <div className="relative" style={{ aspectRatio: '16/9', background: 'var(--bg-primary)', overflow: 'hidden' }}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '4rem' }}>
              🍽️
            </div>
          )}

          {/* Semi-transparent dark overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.4) 0%, transparent 80%)' }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-icon absolute top-4 right-4"
            style={{ background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245,240,235,0.1)' }}
            aria-label="Close modal"
          >
            <BiX size={20} />
          </button>

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="badge">{item.category}</span>
          </div>
        </div>

        {/* Info Block (Flow Section - not absolute!) */}
        <div style={{ padding: '2rem 1.75rem 2.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Title and Pricing */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 className="heading-display" style={{ color: 'var(--text-primary)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                {item.name}
              </h2>
              
              {/* Rating and Preparation details */}
              <div className="flex items-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                <div className="flex items-center" style={{ gap: '0.35rem' }}>
                  {renderStars(item.averageRating || 0)}
                  <span className="label-mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {item.averageRating || 0} ({item.reviewCount || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: '0.25rem' }}>
                  <BiTimeFive size={14} style={{ color: 'var(--text-muted)' }} />
                  <span className="label-mono" style={{ fontSize: '0.65rem' }}>20-30 min</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="heading-display text-2xl" style={{ color: 'var(--accent)' }}>
                Rs. {item.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 300 }}>
              {item.description}
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="btn-primary w-full"
            style={{
              padding: '1rem 2rem',
              background: isAdding ? '#4ade80' : undefined,
              transition: 'all 0.3s ease',
            }}
          >
            <BiPlus size={16} />
            {isAdding ? 'Added to Cart!' : 'Add to Cart'}
          </button>

          <div className="divider" />

          {/* Reviews Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="flex items-center justify-between">
              <span className="label-mono" style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>[ Guest Reviews ]</span>
              <span className="label-mono" style={{ fontSize: '0.65rem' }}>
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Write Review Form */}
            <form 
              onSubmit={handleSubmit} 
              className="glass-card" 
              style={{ cursor: 'default', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span className="label-mono block" style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                Write a Review
              </span>

              {renderInteractiveStars()}

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your dining experience..."
                className="input-field"
                rows={3}
                style={{ resize: 'none' }}
              />

              {error && (
                <p style={{ color: 'var(--rose)', fontSize: '0.8rem' }}>{error}</p>
              )}
              {success && (
                <p style={{ color: '#4ade80', fontSize: '0.8rem' }}>Review submitted successfully!</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-secondary w-full"
                style={{ opacity: submitting ? 0.6 : 1, padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            {/* Reviews List */}
            {loading ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <span className="label-mono">Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No reviews yet. Be the first to share your review!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((review, i) => (
                  <div
                    key={review._id || i}
                    style={{ 
                      borderBottom: '1px solid var(--border)', 
                      paddingBottom: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center" style={{ gap: '0.5rem' }}>
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{
                            background: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {(review.userName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                          {review.userName || 'Anonymous'}
                        </span>
                      </div>
                      <span className="label-mono" style={{ fontSize: '0.6rem' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>

                    {review.comment && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 300 }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </>
  )
}

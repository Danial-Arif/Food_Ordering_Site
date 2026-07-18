'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import { useCart } from '@/components/cart-provider'
import { BiCheck, BiShoppingBag, BiLockAlt } from 'react-icons/bi'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('foodpanada-token')
    if (token) {
      setIsAuthenticated(true)
    }
    setAuthChecked(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!address.trim()) {
      setError('Delivery address is required')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('foodpanada-token')
      if (!token) {
        setError('Please login to place an order')
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          deliveryAddress: address,
          phone,
          notes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to place order')
        return
      }

      setOrderId(data.order._id)
      setOrderPlaced(true)
      clearCart()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="label-mono">Verifying authentication...</span>
      </div>
    )
  }

  // If NOT authenticated, show a beautifully styled sign-in required view
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <section
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '8rem 1.5rem 4rem' }}
        >
          <div className="glass-card animate-scale-in" style={{ padding: '3rem 2rem', maxWidth: '28rem', cursor: 'default' }}>
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
              style={{
                background: 'var(--accent-subtle)',
                border: '1px solid rgba(212, 168, 83, 0.2)',
                marginBottom: '1.5rem',
                color: 'var(--accent)',
              }}
            >
              <BiLockAlt size={28} />
            </div>

            <h1 className="heading-display text-2xl" style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Sign In Required
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              To ensure order accuracy and real-time package tracking, please sign in to your FoodPanada account before checking out.
            </p>

            <div className="flex flex-col gap-3">
              <a href="/login" className="btn-primary w-full text-center block">
                Sign In
              </a>
              <a href="/menu" className="btn-secondary w-full text-center block">
                Back to Menu
              </a>
            </div>
          </div>
        </section>
      </>
    )
  }

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <section
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '8rem 1.5rem 4rem' }}
        >
          <div className="animate-scale-in">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{
                background: 'rgba(74, 222, 128, 0.12)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                marginBottom: '1.75rem',
              }}
            >
              <BiCheck size={40} style={{ color: '#4ade80' }} />
            </div>

            <h1 className="heading-display heading-md" style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Order Placed!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '24rem', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Your order has been received and is being prepared with precision.
              We will notify you once it leaves the kitchen.
            </p>

            {orderId && (
              <div 
                className="form-card" 
                style={{ 
                  padding: '1rem 1.5rem', 
                  display: 'inline-block',
                  border: '1px solid var(--border)',
                  marginBottom: '2rem'
                }}
              >
                <span className="label-mono block" style={{ fontSize: '0.6rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Order ID</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {orderId}
                </span>
              </div>
            )}

            <div className="flex items-center justify-center" style={{ gap: '1rem' }}>
              <a href="/menu" className="btn-primary">
                Order More
              </a>
              <a href="/" className="btn-secondary">
                Back Home
              </a>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <section
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          paddingTop: '9rem',
          paddingBottom: '4rem',
        }}
      >
        <div className="content-container max-w-4xl mx-auto">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="label-mono" style={{ color: 'var(--accent)' }}>
              [ Checkout ]
            </span>
            <h1 className="heading-display heading-md" style={{ color: 'var(--text-primary)', marginTop: '0.75rem' }}>
              Complete Your Order
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: '2.5rem' }}>
            
            {/* Delivery Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="form-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="input-label" htmlFor="checkout-address">Delivery Address *</label>
                  <textarea
                    id="checkout-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Enter your full delivery address"
                    style={{ resize: 'none' }}
                    required
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="checkout-phone">Phone Number</label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="checkout-notes">Special Instructions</label>
                  <textarea
                    id="checkout-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                    rows={2}
                    placeholder="Any special requests or dietary notes..."
                    style={{ resize: 'none' }}
                  />
                </div>

                {error && (
                  <p style={{ color: 'var(--rose)', fontSize: '0.8rem' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="btn-primary w-full"
                  style={{ opacity: (loading || items.length === 0) ? 0.5 : 1, padding: '1rem 2rem' }}
                >
                  {loading ? 'Placing Order...' : `Place Order — Rs. ${totalPrice.toLocaleString()}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div 
                className="form-card sticky" 
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem',
                  top: '6.5rem',
                  border: '1px solid var(--border)' 
                }}
              >
                <div className="flex items-center gap-2">
                  <BiShoppingBag size={16} style={{ color: 'var(--accent)' }} />
                  <span className="label-mono" style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>Order Summary</span>
                </div>

                {items.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Your cart is empty.{' '}
                    <a href="/menu" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Browse Menu
                    </a>
                  </p>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      {items.map(item => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center"
                          style={{ 
                            borderBottom: '1px solid var(--border)', 
                            paddingBottom: '0.875rem' 
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </div>
                            <span className="label-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center" style={{ paddingTop: '0.5rem' }}>
                      <span className="label-mono" style={{ color: 'var(--text-secondary)' }}>Total</span>
                      <span className="heading-display text-xl" style={{ color: 'var(--accent)' }}>
                        Rs. {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

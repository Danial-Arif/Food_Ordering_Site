'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BiArrowBack, BiPackage } from 'react-icons/bi'

const AUTH_KEY = 'foodpanada-auth'
const statusOptions = ['pending', 'preparing', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    // Check auth on mount only
    const authData = localStorage.getItem(AUTH_KEY)

    if (!authData) {
      router.push('/login')
      return
    }

    try {
      const auth = JSON.parse(authData)
      const userData = auth.user

      if (!userData || userData.role !== 'admin') {
        router.push('/')
        return
      }

      setToken(auth.token)
      setIsAuthed(true)
      fetchOrders(auth.token)
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem(AUTH_KEY)
      router.push('/login')
    }
  }, [])

  const fetchOrders = async (authToken) => {
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchOrders(token)
    } catch (error) {
      console.error('Failed to update order:', error)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const getStatusClass = (status) => {
    const map = {
      pending: 'status-pending',
      preparing: 'status-preparing',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    }
    return map[status] || ''
  }

  if (!isAuthed) return null

  return (
    <section style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-4">
          <a href="/admin" className="btn-icon" style={{ textDecoration: 'none' }}>
            <BiArrowBack size={18} />
          </a>
          <span className="heading-display text-lg" style={{ color: 'var(--text-primary)' }}>
            Order Tracking
          </span>
        </div>
      </header>

      <div className="p-8">
        {/* Status Filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {['all', ...statusOptions].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`pill ${filter === s ? 'active' : ''}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== 'all' && (
                <span style={{ marginLeft: '0.25rem', opacity: 0.6 }}>
                  ({orders.filter(o => s === 'all' ? true : o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-20">
            <span className="label-mono">Loading orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BiPackage size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 className="heading-display text-xl" style={{ color: 'var(--text-primary)' }}>
              No orders found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {filter === 'all' ? 'No orders have been placed yet.' : `No ${filter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order._id} className="glass-card p-6" style={{ cursor: 'default' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {order.userName || 'Customer'}
                      </span>
                      <span className={`badge ${getStatusClass(order.status)}`} style={{ fontSize: '0.55rem' }}>
                        {order.status}
                      </span>
                    </div>
                    <span className="label-mono" style={{ fontSize: '0.55rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="heading-display text-xl" style={{ color: 'var(--accent)' }}>
                      Rs. {(order.totalPrice || 0).toLocaleString()}
                    </div>
                    <span className="label-mono" style={{ fontSize: '0.55rem' }}>
                      {order.items?.length || 0} items
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {(order.items || []).map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>

                {/* Address */}
                {order.deliveryAddress && (
                  <p className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    📍 {order.deliveryAddress}
                  </p>
                )}

                {/* Status Update */}
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="label-mono" style={{ fontSize: '0.6rem' }}>Update Status:</span>
                  {statusOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order._id, s)}
                      disabled={order.status === s || updating === order._id}
                      className={`pill ${order.status === s ? 'active' : ''}`}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.7rem',
                        opacity: order.status === s ? 0.5 : 1,
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

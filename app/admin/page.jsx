'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BiPackage, BiDish, BiDollar, BiLogOut, BiMenu, BiListCheck } from 'react-icons/bi'

const AUTH_KEY = 'foodpanada-auth'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isAuthed, setIsAuthed] = useState(false)
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalItems: 0, pendingOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only check auth on mount, not on router changes
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

      setUser(userData)
      setIsAuthed(true)
      fetchStats(auth.token)
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem(AUTH_KEY)
      router.push('/login')
    }
  }, [])

  const fetchStats = async (token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const [ordersRes, menuRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/menu'),
      ])

      const ordersData = await ordersRes.json()
      const menuData = await menuRes.json()

      const orders = ordersData.orders || []
      const items = menuData.items || []

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + (o.totalPrice || 0), 0),
        totalItems: items.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem('foodpanada-token')
    localStorage.removeItem('foodpanada-user')
    router.push('/')
  }

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <BiPackage size={20} />, color: 'var(--accent)' },
    { label: 'Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: <BiDollar size={20} />, color: '#4ade80' },
    { label: 'Menu Items', value: stats.totalItems, icon: <BiDish size={20} />, color: '#60a5fa' },
    { label: 'Pending', value: stats.pendingOrders, icon: <BiListCheck size={20} />, color: 'var(--rose)' },
  ]

  if (!isAuthed || !user) return null

  return (
    <section className="page-wrapper">
      <header
        style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="content-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="heading-display text-xl">
              <span style={{ color: 'var(--text-primary)' }}>dine with&nbsp;</span>
              <span style={{ color: 'var(--accent)' }}>dane</span>
            </span>
            <span className="badge" style={{ fontSize: '0.55rem' }}>Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {user.name}
            </span>
            <button onClick={handleLogout} className="btn-icon" aria-label="Logout">
              <BiLogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="content-container" style={{ paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="label-mono" style={{ color: 'var(--accent)' }}>[ Dashboard ]</span>
          <h1 className="heading-display heading-md mt-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user.name}
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card p-6 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, cursor: 'default' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="label-mono" style={{ fontSize: '0.6rem' }}>{stat.label}</span>
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div className="heading-display text-3xl" style={{ color: 'var(--text-primary)' }}>
                {loading ? '—' : stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 lg:mt-24 mb-6">
          <span className="label-mono" style={{ color: 'var(--text-secondary)' }}>[ Quick Actions ]</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/admin/menu"
            className="glass-card p-8 flex items-center gap-6 group"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
              style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              <BiMenu size={24} />
            </div>
            <div>
              <h3 className="heading-display text-lg group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                Manage Menu
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Add, edit, or remove dishes from your menu
              </p>
            </div>
          </a>

          <a
            href="/admin/orders"
            className="glass-card p-8 flex items-center gap-6 group"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
              style={{ background: 'var(--rose-subtle)', color: 'var(--rose)' }}
            >
              <BiPackage size={24} />
            </div>
            <div>
              <h3 className="heading-display text-lg group-hover:text-[var(--rose)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                Track Orders
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                View and update order statuses
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { BiPackage, BiDish, BiDollar, BiLogOut, BiMenu, BiListCheck } from 'react-icons/bi'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalItems: 0, pendingOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('dine-with-dane-user')
      
      if (!stored) {
        window.location.href = '/login'
        return
      }

      const u = JSON.parse(stored)
      
      if (u.role !== 'admin') {
        window.location.href = '/'
        return
      }

      setUser(u)
      setIsChecking(false)
      fetchStats()
    }

    checkAuth()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('dine-with-dane-token')
      const headers = { Authorization: `Bearer ${token}` }

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
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('dine-with-dane-token')
    localStorage.removeItem('dine-with-dane-user')
    window.location.href = '/'
  }

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <BiPackage size={20} />, color: 'var(--accent)' },
    { label: 'Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: <BiDollar size={20} />, color: '#4ade80' },
    { label: 'Menu Items', value: stats.totalItems, icon: <BiDish size={20} />, color: '#60a5fa' },
    { label: 'Pending', value: stats.pendingOrders, icon: <BiListCheck size={20} />, color: 'var(--rose)' },
  ]

  // Show nothing while checking authentication
  if (isChecking || !user) return null

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

'use client'
import { useState } from 'react'
import Navbar from '@/components/navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Store token and user data
      localStorage.setItem('foodpanada-token', data.token)
      localStorage.setItem('foodpanada-user', JSON.stringify(data.user))

      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/menu'
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <section
        className="flex items-center justify-center"
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          paddingTop: '6rem',
          paddingBottom: '4rem',
        }}
      >
        <div className="content-container w-full max-w-md">
          <div className="animate-fade-up text-center" style={{ paddingBottom: '5%' }}>
            <span className="label-mono" style={{ color: 'var(--accent)' }}>
              [ Welcome Back ]
            </span>
            <h1 className="heading-display heading-md mt-4" style={{ color: 'var(--text-primary)' }}>
              Sign In
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Continue your culinary journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 animate-fade-up" style={{ animationDelay: '200ms', cursor: 'default' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <label className="input-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p style={{ color: 'var(--rose)', fontSize: '0.8rem' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Don&apos;t have an account?{' '}
              <a href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                Create one
              </a>
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

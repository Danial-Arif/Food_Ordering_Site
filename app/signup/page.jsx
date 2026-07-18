'use client'
import { useState } from 'react'
import Navbar from '@/components/navbar'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Signup failed')
        return
      }

      localStorage.setItem('foodpanada-token', data.token)
      localStorage.setItem('foodpanada-user', JSON.stringify(data.user))

      // Redirect based on role
      window.location.href = data.user.role === 'admin' ? '/admin' : '/menu'
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
              [ Join Us ]
            </span>
            <h1 className="heading-display heading-md mt-4" style={{ color: 'var(--text-primary)' }}>
              Create Account
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Start your culinary journey with us
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card animate-fade-up"
            style={{ animationDelay: '200ms', cursor: 'default' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Role Selector */}
            <div>
              <span className="input-label">Account Type</span>
              <div
                className="flex"
                style={{
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                  padding: '0.375rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                {['user', 'admin'].map((r) => (
                  <label
                    key={r}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      borderRadius: 'calc(var(--radius-md) - 2px)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: role === r ? 'var(--accent)' : 'transparent',
                      color: role === r ? '#0a0a0a' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: role === r ? 700 : 400,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                      style={{ display: 'none' }}
                    />
                    {r === 'user' ? '👤 User' : '🛡 Admin'}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="input-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Danial Arif"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="input-label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="input-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="input-label" htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Repeat your password"
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
              {loading ? 'Creating account...' : `Create ${role === 'admin' ? 'Admin' : ''} Account`}
            </button>

            <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                Sign in
              </a>
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

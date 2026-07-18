'use client'
import { BiMenu, BiX, BiShoppingBag } from 'react-icons/bi'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './cart-provider'
import CartDrawer from './cart-drawer'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const { totalItems, setIsOpen: setCartOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div
          className="content-container flex justify-between items-center"
          style={{ padding: scrolled ? '0.75rem clamp(1.5rem, 5vw, 5rem)' : '1.25rem clamp(1.5rem, 5vw, 5rem)' }}
        >
          {/* Logo */}
          <a href="/" className="relative z-10 transition-opacity duration-300 hover:opacity-70">
            <span className="heading-display text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              dine with&nbsp;
            </span>
            <span className="heading-display text-xl tracking-tight" style={{ color: 'var(--accent)' }}>
              dane
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center" style={{ gap: '2.5rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative group"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s ease',
                  padding: '0.25rem 0',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-300 group-hover:w-full"
                  style={{ width: 0 }}
                />
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <button
              onClick={() => setCartOpen(true)}
              className="btn-icon relative"
              aria-label="Open cart"
            >
              <BiShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>

            <a
              href="/login"
              className="hidden md:flex btn-secondary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem' }}
            >
              Sign In
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-icon md:!hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <BiX size={20} /> : <BiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Overlay Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center md:!hidden animate-fade-in"
          style={{ background: 'var(--bg-primary)' }}
        >
          <nav className="flex flex-col items-center" style={{ gap: 'max(1rem, 3vh)' }}>
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="heading-display animate-fade-up"
                style={{
                  fontSize: 'clamp(1.5rem, 6vh, 3rem)',
                  color: 'var(--text-primary)',
                  animationDelay: `${i * 100 + 100}ms`,
                  transition: 'color 0.3s ease',
                  padding: '0.25rem 0',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                {link.label}
              </a>
            ))}
            <div className="divider" style={{ width: '4rem', margin: '0.5rem 0' }} />
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-primary animate-fade-up"
              style={{ animationDelay: '500ms' }}
            >
              Sign In
            </a>
          </nav>

          <div
            className="absolute label-mono animate-fade-up"
            style={{ bottom: '2.5rem', animationDelay: '600ms' }}
          >
            Where every meal becomes a memory
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  )
}
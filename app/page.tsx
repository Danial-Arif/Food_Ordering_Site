'use client'
import { useEffect, useRef } from 'react'
import Navbar from '@/components/navbar'
import Video from '@/components/video'
import About from '@/components/about'

const featuredDishes = [
  'Wagyu Tartare',
  'Truffle Risotto',
  'Lobster Thermidor',
  'Saffron Panna Cotta',
  'Charred Octopus',
  'Miso Glazed Cod',
  'Lamb Shank Tagine',
  'Dark Chocolate Fondant',
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrollY = window.scrollY
      const opacity = Math.max(0, 1 - scrollY / 600)
      const translateY = scrollY * 0.3
      heroRef.current.style.opacity = String(opacity)
      heroRef.current.style.transform = `translateY(${translateY}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          padding: '10rem 1.5rem 5rem',
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '70vw',
            height: '70vh',
            background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.04) 0%, transparent 70%)',
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 flex flex-col items-center"
          style={{ willChange: 'transform, opacity', gap: '1.5rem' }}
        >
          {/* Mono label */}
          <span className="label-mono animate-fade-up" style={{ color: 'var(--accent)', animationDelay: '100ms' }}>
            [ Est. 2024 — Lahore ]
          </span>

          {/* Main Heading */}
          <h1
            className="heading-display heading-xl animate-fade-up"
            style={{
              color: 'var(--text-primary)',
              maxWidth: '52rem',
              padding: '0 1rem',
              animationDelay: '200ms',
            }}
          >
            Where every{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>meal</em>
            <br />
            becomes a memory
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up"
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
              maxWidth: '28rem',
              lineHeight: 1.75,
              fontWeight: 300,
              padding: '0 1rem',
              marginTop: '0.5rem',
              animationDelay: '400ms',
            }}
          >
            Seasonal ingredients, open fire, honest cooking.
            Experience curated dining delivered to your door.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex items-center gap-4 animate-fade-up"
            style={{ marginTop: '1.5rem', animationDelay: '600ms' }}
          >

            <a href="/menu" className="btn-primary">
              View Menu
            </a>
            <a href="/#about" className="btn-secondary">
              Our Story
            </a>
          </div>
        </div>
      </section>

      {/* Featured Dishes Marquee */}
      <section
        className="overflow-hidden"
        style={{
          padding: '1.5rem 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-primary)',
        }}
      >
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...featuredDishes, ...featuredDishes].map((dish, i) => (
            <span key={`${dish}-${i}`} className="flex items-center gap-12">
              <span
                className="heading-display"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                  color: i % 2 === 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontStyle: i % 2 === 0 ? 'normal' : 'italic',
                }}
              >
                {dish}
              </span>
              <span style={{ color: 'var(--accent)', fontSize: '0.5rem' }}>◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
        <div className="content-container">
          <div className="flex justify-between items-end" style={{ marginBottom: '2.5rem' }}>
            <div>
              <span className="label-mono" style={{ color: 'var(--accent)' }}>[ Our Kitchen ]</span>
              <h2
                className="heading-display heading-md"
                style={{ color: 'var(--text-primary)', marginTop: '1rem' }}
              >
                Fire, flavor, finesse
              </h2>
            </div>
          </div>
          <Video />
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Footer */}
      <footer
        className="section-padding"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '3rem' }}>
            {/* Brand */}
            <div>
              <div className="heading-display text-2xl" style={{ marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-primary)' }}>food</span>
                <span style={{ color: 'var(--accent)' }}>panada</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '20rem' }}>
                Where every meal becomes a memory. Seasonal ingredients,
                open fire, honest cooking.
              </p>
            </div>

            {/* Links */}
            <div>
              <span className="label-mono block" style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Navigate
              </span>
              <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                {['Home', 'Menu', 'About', 'Contact'].map(link => (
                  <a
                    key={link}
                    href={link === 'Home' ? '/' : link === 'About' ? '/#about' : `/${link.toLowerCase()}`}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <span className="label-mono block" style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Contact
              </span>
              <div className="flex flex-col" style={{ gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>Lahore, Pakistan</span>
                <span>hello@foodpanada.com</span>
                <span>+92 300 1234567</span>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '3rem 0 2rem' }} />

          <div className="flex flex-col md:flex-row justify-between items-center" style={{ gap: '1rem' }}>
            <span className="label-mono" style={{ fontSize: '0.6rem' }}>
              © 2024 FoodPanada. All rights reserved.
            </span>
            <span className="label-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              Crafted with passion
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
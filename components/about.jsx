'use client'
import { useEffect, useRef } from 'react'

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              el.style.animationDelay = `${i * 120}ms`
              el.classList.add('animate-fade-up')
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: '2024', label: 'Established' },
    { value: '50+', label: 'Dishes Curated' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '4.9', label: 'Average Rating' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="content-container">

        {/* Label */}
        <div className="reveal-item" style={{ opacity: 0, marginBottom: '2rem' }}>
          <span className="label-mono" style={{ color: 'var(--accent)' }}>
            [ 01 — Our Story ]
          </span>
        </div>

        {/* Main Heading */}
        <div style={{ marginBottom: '4rem' }}>
          <h2
            className="heading-display heading-lg reveal-item"
            style={{ opacity: 0, color: 'var(--text-primary)', maxWidth: '48rem' }}
          >
            We believe in the{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>purity</em>{' '}
            of ingredients and the warmth of shared meals.
          </h2>
        </div>

        {/* Two Column Content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: 'clamp(2rem, 5vw, 4rem)', marginBottom: '5rem' }}
        >
          {/* Left — Image */}
          <div className="reveal-item" style={{ opacity: 0 }}>
            <div
              className="w-full overflow-hidden"
              style={{
                borderRadius: 'var(--radius-lg)',
                aspectRatio: '4/5',
              }}
            >
              <img
                src="/resturant.jpg"
                alt="FoodPanada restaurant interior"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Right — Story Text */}
          <div className="flex flex-col justify-center" style={{ gap: '1.75rem' }}>
            <p className="body-text reveal-item" style={{ opacity: 0 }}>
              Founded in 2024, FoodPanada was born from a singular vision: to deliver
              exceptional dining experiences without the pretense. We believe that true
              quality speaks for itself — through the careful sourcing of ingredients
              and the meticulous preparation of every dish.
            </p>
            <p className="body-text reveal-item" style={{ opacity: 0 }}>
              Our approach is deeply rooted in respect for the produce. By partnering
              directly with regional farmers and sustainable purveyors, we ensure that
              our menu reflects the seasons and supports our local ecosystem.
            </p>
            <p className="body-text reveal-item" style={{ opacity: 0 }}>
              Every dish that leaves our kitchen carries the story of its origin —
              the soil it grew in, the hands that harvested it, and the passion
              that transformed it into something extraordinary.
            </p>

            <div className="reveal-item" style={{ opacity: 0, marginTop: '0.5rem' }}>
              <a href="/menu" className="btn-primary" style={{ display: 'inline-flex' }}>
                Explore Our Menu
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider reveal-item" style={{ opacity: 0, marginBottom: '3rem' }} />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="reveal-item text-center md:text-left" style={{ opacity: 0 }}>
              <div
                className="heading-display"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  color: 'var(--accent)',
                  lineHeight: 1.1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <span className="label-mono block" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
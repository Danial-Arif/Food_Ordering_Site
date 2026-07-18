'use client'
import { useEffect, useRef } from 'react'

export default function Video() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollProgress = -rect.top / (rect.height + window.innerHeight)
      const parallaxOffset = scrollProgress * 80
      videoRef.current.style.transform = `translateY(${parallaxOffset}px) scale(1.05)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 30%),
            linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 40%)
          `,
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full object-cover object-center transition-transform duration-100"
        style={{
          height: '70vh',
          willChange: 'transform',
        }}
        src="/foodpanda.mp4"
      />

      {/* Bottom Text Overlay */}
      <div className="absolute bottom-8 left-8 z-20">
        <span className="label-mono" style={{ color: 'rgba(245,240,235,0.6)' }}>
          [ Our Kitchen ]
        </span>
      </div>
    </div>
  )
}
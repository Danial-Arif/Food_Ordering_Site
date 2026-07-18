'use client'
import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/navbar'
import MenuCard from '@/components/menu-card'
import MenuSearch from '@/components/menu-search'
import ReviewModal from '@/components/review-modal'

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (search) params.set('search', search)

      const res = await fetch(`/api/menu?${params.toString()}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [category, search])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])


  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center"
        style={{
          minHeight: '45vh',
          background: 'var(--bg-primary)',
          padding: '10rem 1.5rem 3rem',
        }}
      >
        <span className="label-mono animate-fade-up" style={{ color: 'var(--accent)', animationDelay: '100ms' }}>
          [ Our Menu ]
        </span>
        <h1
          className="heading-display heading-lg animate-fade-up"
          style={{ color: 'var(--text-primary)', animationDelay: '200ms', marginTop: '1.25rem' }}
        >
          Curated with <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>passion</em>
        </h1>
        <p
          className="animate-fade-up"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
            maxWidth: '30rem',
            lineHeight: 1.75,
            marginTop: '1rem',
            padding: '0 1rem',
            animationDelay: '400ms',
          }}
        >
          Every dish tells a story. Browse our seasonal selection,
          read reviews, and order your favorites.
        </p>
      </section>

      {/* Menu Content */}
      <section style={{ background: 'var(--bg-primary)', paddingTop: '1rem', paddingBottom: 'var(--section-padding)' }}>
        <div className="content-container">
          {/* Search & Filters */}
          <div style={{ marginBottom: '2.5rem' }}>
            <MenuSearch
              onSearch={setSearch}
              onCategoryChange={setCategory}
              activeCategory={category}
            />
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
            <span className="label-mono">
              {items.length} dish{items.length !== 1 ? 'es' : ''} found
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid-menu">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card overflow-hidden"
                  style={{ cursor: 'default' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div
                    style={{
                      aspectRatio: '4/3',
                      background: 'linear-gradient(110deg, var(--bg-card) 30%, var(--bg-elevated) 50%, var(--bg-card) 70%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="rounded" style={{ background: 'var(--bg-card)', width: '70%', height: '1.25rem' }} />
                    <div className="rounded" style={{ background: 'var(--bg-card)', width: '100%', height: '0.75rem' }} />
                    <div className="rounded" style={{ background: 'var(--bg-card)', width: '60%', height: '0.75rem' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
              <h3 className="heading-display text-xl" style={{ color: 'var(--text-primary)' }}>
                No dishes found
              </h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                {category !== 'all' || search
                  ? 'Try adjusting your search or category filter.'
                  : 'Menu is empty. Admin can add items via the dashboard or seed the DB.'}
              </p>
            </div>
          ) : (
            <div className="grid-menu">
              {items.map((item, i) => (
                <div
                  key={item._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <MenuCard
                    item={item}
                    onViewDetails={setSelectedItem}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      {selectedItem && (
        <ReviewModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Footer */}
      <footer
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '3rem 0' }}
      >
        <div className="content-container text-center">
          <span className="label-mono" style={{ fontSize: '0.6rem' }}>
            © 2024 FoodPanada. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  )
}

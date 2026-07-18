'use client'
import { BiSearch, BiX } from 'react-icons/bi'
import { useState, useEffect, useRef } from 'react'

const categories = ['all', 'starters', 'mains', 'desserts', 'drinks']

export default function MenuSearch({ onSearch, onCategoryChange, activeCategory }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query, onSearch])

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative max-w-lg">
        <BiSearch
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: focused ? 'var(--accent)' : 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search dishes..."
          className="input-field"
          style={{ paddingLeft: '2.75rem', paddingRight: query ? '2.75rem' : '1.25rem' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              display: 'flex',
            }}
            aria-label="Clear search"
          >
            <BiX size={18} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`pill ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

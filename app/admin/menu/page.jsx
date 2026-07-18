'use client'
import { useState, useEffect } from 'react'
import { BiPlus, BiEdit, BiTrash, BiX, BiArrowBack, BiCloudUpload, BiLoaderAlt } from 'react-icons/bi'

const categories = ['starters', 'mains', 'desserts', 'drinks']

export default function AdminMenuPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'starters', image: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('dine-with-dane-token') : ''

  useEffect(() => {
    // Check admin
    const stored = localStorage.getItem('dine-with-dane-user')
    if (stored) {
      const u = JSON.parse(stored)
      if (u.role !== 'admin') { window.location.href = '/'; return }
    } else {
      window.location.href = '/login'; return
    }
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setItems(data.items || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const openAdd = () => {
    setEditingItem(null)
    setForm({ name: '', description: '', price: '', category: 'starters', image: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category: item.category,
      image: item.image || '',
    })
    setError('')
    setShowModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setForm(prev => ({ ...prev, image: data.url }))
    } catch (err) {
      setError(err.message || 'Image upload failed. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required')
      return
    }
    setSaving(true)
    setError('')

    try {
      const url = editingItem ? `/api/menu/${editingItem._id}` : '/api/menu'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to save'); return }

      setShowModal(false)
      fetchItems()
    } catch {
      setError('Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchItems()
    } catch { /* ignore */ }
  }

  return (
    <section className="page-wrapper">
      {/* Header */}
      <header
        style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="content-container flex items-center justify-between">
          <div className="flex items-center gap-4">
          <a href="/admin" className="btn-icon" style={{ textDecoration: 'none', width: '2.5rem', height: '2.5rem' }}>
            <BiArrowBack size={18} />
          </a>
          <span className="heading-display text-lg" style={{ color: 'var(--text-primary)' }}>
            Menu Management
          </span>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.6rem 1.25rem' }}>
          <BiPlus size={16} /> Add Item
        </button>
        </div>
      </header>

      <div className="content-container pt-8 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <span className="label-mono">Loading menu items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <div style={{ fontSize: '3rem' }}>🍽️</div>
            <h3 className="heading-display text-xl" style={{ color: 'var(--text-primary)' }}>
              No menu items yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Start adding dishes to your menu
            </p>
            <button onClick={openAdd} className="btn-primary">
              <BiPlus size={16} /> Add First Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
              <thead>
                <tr>
                  {['Item', 'Category', 'Price', 'Rating', 'Actions'].map(h => (
                    <th key={h} className="label-mono text-left px-4 pb-2" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} className="table-row">
                    <td className="px-4 py-4 rounded-l-xl" style={{ background: 'var(--glass-bg)', borderLeft: '1px solid var(--glass-border)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-card)', fontSize: '1.25rem' }}>🍽️</div>
                        )}
                        <div>
                          <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4" style={{ background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                      <span className="badge" style={{ fontSize: '0.55rem' }}>{item.category}</span>
                    </td>
                    <td className="px-4 py-4" style={{ background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                      Rs. {item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-4" style={{ background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      ⭐ {item.averageRating || 0} ({item.reviewCount || 0})
                    </td>
                    <td className="px-4 py-4 rounded-r-xl" style={{ background: 'var(--glass-bg)', borderRight: '1px solid var(--glass-border)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="btn-icon" style={{ width: '2rem', height: '2rem' }} aria-label="Edit item">
                          <BiEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="btn-icon" style={{ width: '2rem', height: '2rem', color: 'var(--rose)' }} aria-label="Delete item">
                          <BiTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="overlay" onClick={() => setShowModal(false)} />
          <div className="modal" style={{ padding: '2.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
              <h2 className="heading-display text-xl" style={{ color: 'var(--text-primary)' }}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={() => setShowModal(false)} className="btn-icon" style={{ width: '2.25rem', height: '2.25rem' }} aria-label="Close modal">
                <BiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="input-label" htmlFor="menu-name">Name *</label>
                <input
                  id="menu-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Dish name"
                  required
                />
              </div>

              <div>
                <label className="input-label" htmlFor="menu-desc">Description</label>
                <textarea
                  id="menu-desc"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe the culinary creation..."
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="input-label" htmlFor="menu-price">Price (Rs.) *</label>
                  <input
                    id="menu-price"
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="input-field"
                    placeholder="1500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="menu-category">Category *</label>
                  <select
                    id="menu-category"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Block (Cloudinary) */}
              <div>
                <label className="input-label">Dish Image</label>
                <div
                  className="rounded-lg flex flex-col items-center justify-center text-center cursor-pointer relative"
                  style={{
                    border: '1px dashed var(--border)',
                    padding: '1.5rem',
                    background: 'var(--bg-card)',
                    minHeight: '8rem',
                    transition: 'border-color 0.2s ease',
                  }}
                  onDragOver={e => e.preventDefault()}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <BiLoaderAlt size={28} className="animate-spin" style={{ color: 'var(--accent)' }} />
                      <span className="label-mono" style={{ fontSize: '0.65rem' }}>Uploading to Cloudinary...</span>
                    </div>
                  ) : form.image ? (
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={form.image}
                        alt="Uploaded preview"
                        className="w-16 h-16 rounded object-cover border"
                        style={{ borderColor: 'var(--border)' }}
                      />
                      <div className="flex-1 text-left min-w-0">
                        <span className="label-mono block" style={{ fontSize: '0.55rem', color: 'var(--accent)' }}>Image Configured</span>
                        <span className="block truncate text-xs text-secondary" style={{ color: 'var(--text-secondary)' }}>{form.image}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="btn-icon"
                        style={{ width: '2rem', height: '2rem', color: 'var(--rose)' }}
                      >
                        <BiTrash size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer w-full h-full">
                      <BiCloudUpload size={32} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click to upload file</span>
                      <span className="label-mono" style={{ fontSize: '0.55rem' }}>PNG, JPG, WEBP</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {error && <p style={{ color: 'var(--rose)', fontSize: '0.8rem' }}>{error}</p>}

              <button type="submit" disabled={saving || uploadingImage} className="btn-primary w-full" style={{ opacity: (saving || uploadingImage) ? 0.6 : 1, padding: '1rem' }}>
                {saving ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  )
}

'use client'
import { useCart } from './cart-provider'
import { BiX, BiMinus, BiPlus, BiTrash } from 'react-icons/bi'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={() => setIsOpen(false)} style={{ zIndex: 100 }} />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] animate-slide-in-right"
        style={{ boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
      >
        <div 
          className="h-full flex flex-col"
          style={{
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h2 className="heading-display text-xl" style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Your Cart
              </h2>
              <span className="label-mono" style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} Selected
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-icon"
              style={{ width: '2.5rem', height: '2.5rem' }}
              aria-label="Close cart"
            >
              <BiX size={20} />
            </button>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ gap: '1.5rem' }}>
                <div style={{ fontSize: '3rem', animation: 'float 3s ease-in-out infinite' }}>🍽️</div>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Your cart is empty
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '16rem', margin: '0 auto' }}>
                    Add some exquisite delicacies from our curated menu.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.75rem 1.5rem' }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="glass-card"
                  style={{ 
                    cursor: 'default', 
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    border: '1px solid var(--border)'
                  }}
                >
                  {/* Item Image */}
                  <div 
                    className="rounded-lg overflow-hidden flex-shrink-0" 
                    style={{ width: '4.5rem', height: '4.5rem', background: 'var(--bg-primary)' }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '1.5rem' }}>
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div className="flex justify-between items-start gap-2">
                      <h3 
                        className="heading-display" 
                        style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--rose)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        aria-label="Remove item"
                      >
                        <BiTrash size={14} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center" style={{ marginTop: '0.25rem' }}>
                      <span className="label-mono" style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>
                        Rs. {item.price.toLocaleString()}
                      </span>
                      <span className="heading-display" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3" style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="btn-icon"
                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '4px' }}
                        aria-label="Decrease quantity"
                      >
                        <BiMinus size={12} />
                      </button>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, minWidth: '1.25rem', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="btn-icon"
                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '4px' }}
                        aria-label="Increase quantity"
                      >
                        <BiPlus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6" style={{ borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="flex justify-between items-center">
                <span className="label-mono" style={{ color: 'var(--text-secondary)' }}>Total Price</span>
                <span className="heading-display text-2xl" style={{ color: 'var(--accent)' }}>
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>
              <a
                href="/checkout"
                className="btn-primary w-full text-center block"
                onClick={() => setIsOpen(false)}
                style={{ padding: '1rem 2rem' }}
              >
                Proceed to Checkout
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

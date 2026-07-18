'use client'
import Navbar from '@/components/navbar'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate sending message
    setTimeout(() => {
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    }, 800)
  }

  return (
    <main className="page-wrapper">
      <Navbar />
      
      <div className="content-container section-padding" style={{ paddingTop: '8rem' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <span className="label-mono" style={{ color: 'var(--accent)' }}>[ Contact Us ]</span>
            <h1 className="heading-display heading-lg mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Get in Touch
            </h1>
            <p className="body-copy text-lg" style={{ color: 'var(--text-secondary)' }}>
              We'd love to hear from you. Reach out for reservations, private events, or general inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <div className="glass-card p-8">
                <h3 className="heading-display text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="label-mono mb-2" style={{ color: 'var(--accent)' }}>Address</h4>
                    <p className="body-copy">123 Culinary Boulevard<br />Flavor District, FD 90210</p>
                  </div>
                  
                  <div>
                    <h4 className="label-mono mb-2" style={{ color: 'var(--accent)' }}>Hours</h4>
                    <p className="body-copy">Tue - Sun: 5:00 PM - 11:00 PM<br />Monday: Closed</p>
                  </div>
                  
                  <div>
                    <h4 className="label-mono mb-2" style={{ color: 'var(--accent)' }}>Phone</h4>
                    <p className="body-copy">+1 (555) 123-4567</p>
                  </div>
                  
                  <div>
                    <h4 className="label-mono mb-2" style={{ color: 'var(--accent)' }}>Email</h4>
                    <p className="body-copy">reservations@foodpanada.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h3 className="heading-display text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Send a Message</h3>
              
              {sent ? (
                <div className="p-6 text-center" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <h4 className="heading-display text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Thank you!</h4>
                  <p className="body-copy text-sm" style={{ color: 'var(--text-secondary)' }}>Your message has been received. We will get back to you shortly.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary mt-6 w-full" style={{ padding: '0.75rem' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="input-label" htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="input-field" 
                      placeholder="Your name" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="input-label" htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="input-field" 
                      placeholder="your@email.com" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="input-label" htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      className="input-field" 
                      placeholder="How can we help you?" 
                      style={{ resize: 'none' }}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary w-full" style={{ padding: '1rem' }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

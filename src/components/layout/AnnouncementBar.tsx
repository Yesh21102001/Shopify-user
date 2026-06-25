'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const messages = [
  'Free Shipping on orders over $75',
  'Use code SAVE10 for 10% off your first order',
  'New arrivals every week — Shop Now',
  'Free returns within 30 days',
]

export default function AnnouncementBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement-dismissed')
    if (!dismissed) setShow(true)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('announcement-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  const repeated = [...messages, ...messages]

  return (
    <div
      style={{ height: '40px', background: '#da3f3f', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="m-marquee" style={{ gap: 0 }}>
          {repeated.map((msg, i) => (
            <span key={i} style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', paddingRight: '80px' }}>
              {msg}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={dismiss}
        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center' }}
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  )
}

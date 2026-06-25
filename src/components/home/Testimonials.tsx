'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Star } from 'lucide-react'

const testimonials = [
  { id: 1, name: 'Sarah Johnson', location: 'New York, USA', rating: 5, quote: 'Absolutely love my new dress! The quality exceeded my expectations and the shipping was incredibly fast. Will definitely order again!' },
  { id: 2, name: 'Michael Chen', location: 'Los Angeles, USA', rating: 5, quote: 'Great selection and amazing customer service. The size guide was spot on — my jacket fits perfectly.' },
  { id: 3, name: 'Emma Wilson', location: 'London, UK', rating: 4, quote: 'Love the minimalist aesthetic. The clothes are stylish yet comfortable. Highly recommend the summer collection.' },
  { id: 4, name: 'David Rodriguez', location: 'Miami, USA', rating: 5, quote: 'Fast shipping, beautiful packaging, and top-notch quality. This is now my go-to store for premium fashion.' },
  { id: 5, name: 'Aisha Patel', location: 'Chicago, USA', rating: 4, quote: 'The variety and quality are unmatched. I appreciate the eco-friendly packaging too. Will recommend to all my friends.' },
  { id: 6, name: 'James Kim', location: 'Seattle, USA', rating: 5, quote: 'Outstanding quality and style. The return process was smooth when I needed a different size. Great experience.' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={14} fill={n <= rating ? '#f4a523' : 'none'} color={n <= rating ? '#f4a523' : '#ddd'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="m-section" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
      <div className="m-container">
        <div className="m-section-heading m-section-heading--centered">
          <span className="m-section-heading__subtitle">Happy Customers</span>
          <h2 className="m-section-heading__title">What Our Customers Say</h2>
        </div>

        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            0:    { slidesPerView: 1 },
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: 40 }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '28px 24px', height: '100%' }}>
                <Stars rating={t.rating} />
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#666', flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{t.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

const brands = ['Gucci', 'Prada', 'Versace', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren', 'Armani', 'Zara', 'Nike', 'Adidas', "Levi's"]

export default function BrandLogos() {
  const repeated = [...brands, ...brands]

  return (
    <section style={{ padding: '32px 0', borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: 24 }}>
        Trusted by Top Brands
      </p>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="m-marquee">
          {repeated.map((brand, i) => (
            <span key={i} style={{ fontSize: 18, fontWeight: 700, color: '#d8d8d8', textTransform: 'uppercase', letterSpacing: '0.15em', paddingRight: 64, whiteSpace: 'nowrap' }}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) setProduct(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f2ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #c8a27b', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#f7f2ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#c8a27b' }}>Produit introuvable</p>
    </div>
  )

  const discounted = hasDiscount(product.discount_percentage)
  const salePrice = getSalePrice(product.original_price, product.discount_percentage)

  return (
    <div style={{ background: '#f7f2ec', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        padding: '18px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(247,242,236,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(200,162,123,0.1)',
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#2f2723' }}>
          ←
        </button>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, letterSpacing: '3px', color: '#2f2723' }}>
          LILOOK
        </span>
        <div style={{ width: '24px' }} />
      </nav>

      {/* MAIN IMAGE */}
      <div style={{ paddingTop: '70px' }}>
        <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', background: '#efe3d7', position: 'relative' }}>
          {product.images?.[activeImg] ? (
            <img
              src={product.images[activeImg]}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #efe3d7, #e8d5c4)' }} />
          )}
          {product.is_trending && (
            <div style={{
              position: 'absolute', top: '16px', left: '16px',
              background: 'rgba(47,39,35,0.85)', backdropFilter: 'blur(8px)',
              color: 'white', fontSize: '9px', letterSpacing: '2px',
              padding: '6px 14px', borderRadius: '999px', textTransform: 'uppercase'
            }}>Tendance</div>
          )}
          {discounted && (
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              background: '#c8a27b', color: 'white', fontSize: '11px',
              padding: '6px 14px', borderRadius: '999px'
            }}>-{product.discount_percentage}%</div>
          )}
        </div>

        {/* THUMBNAIL ROW */}
        {product.images?.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', padding: '12px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: '64px', height: '64px', flexShrink: 0,
                  borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                  border: i === activeImg ? '2px solid #c8a27b' : '2px solid transparent',
                  opacity: i === activeImg ? 1 : 0.6
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {/* INFO */}
        <div style={{ padding: '24px 24px 140px' }}>
          <p style={{ fontSize: '10px', color: '#c8a27b', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {product.category}
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', fontWeight: 500, color: '#2f2723', lineHeight: 1.1, marginBottom: '16px' }}>
            {product.title}
          </h1>

          {/* PRICE */}
          <div style={{ marginBottom: '20px' }}>
            {discounted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#c8a27b', fontWeight: 500 }}>
                  {formatPrice(salePrice)}
                </span>
                <span style={{ fontSize: '14px', color: '#bbb', textDecoration: 'line-through' }}>
                  {formatPrice(product.original_price)}
                </span>
              </div>
            ) : (
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2f2723', fontWeight: 500 }}>
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', lineHeight: 1.9, color: '#8e7f74' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* QUOTE */}
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic', color: '#c8a27b', textAlign: 'center', margin: '32px 0', lineHeight: 1.6 }}>
            "Le luxe devrait se sentir doux, pas fort."
          </p>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        padding: '16px 24px 32px',
        background: 'rgba(247,242,236,0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(200,162,123,0.1)'
      }}>
        
          <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          <button style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #2f2723, #1e1815)', color: 'white', border: 'none', borderRadius: '999px', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Commander via WhatsApp ↗
          </button>
        </a>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
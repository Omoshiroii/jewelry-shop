'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('tout')
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: 'tout', label: 'Tout' },
    { value: 'bagues', label: 'Bagues' },
    { value: 'colliers', label: 'Colliers' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'boucles', label: 'Boucles' },
    { value: 'traditionnel', label: 'Traditionnel' },
  ]

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const supabase = createClient()
      let query = supabase.from('products').select('*').order('created_at', { ascending: false })
      if (activeCategory !== 'tout') query = query.eq('category', activeCategory)
      const { data } = await query
      if (data) setProducts(data)
      setLoading(false)
    }
    fetch()
  }, [activeCategory])

  return (
    <div style={{ background: '#f7f2ec', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        padding: '18px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(247,242,236,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(200,162,123,0.1)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: '20px', color: '#2f2723' }}>←</Link>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, letterSpacing: '3px', color: '#2f2723' }}>
          LILOOK
        </span>
        <div style={{ width: '24px' }} />
      </nav>

      <div style={{ paddingTop: '80px', padding: '80px 24px 120px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#c8a27b', textTransform: 'uppercase' }}>nos pièces</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 500, lineHeight: 1, marginTop: '8px', color: '#2f2723' }}>
            Catalogue<br />Complet
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)} style={{
              whiteSpace: 'nowrap', padding: '8px 18px', borderRadius: '999px',
              border: '1px solid',
              borderColor: activeCategory === cat.value ? '#c8a27b' : 'rgba(200,162,123,0.3)',
              background: activeCategory === cat.value ? '#c8a27b' : 'rgba(255,255,255,0.6)',
              color: activeCategory === cat.value ? 'white' : '#8e7f74',
              fontSize: '11px', letterSpacing: '1px', cursor: 'pointer'
            }}>{cat.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #c8a27b', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#c8a27b' }}>Aucune pièce trouvée</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {products.map(product => {
              const discounted = hasDiscount(product.discount_percentage)
              const salePrice = getSalePrice(product.original_price, product.discount_percentage)
              return (
                <Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(14px)', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                    <div style={{ aspectRatio: '1', background: '#efe3d7', overflow: 'hidden', position: 'relative' }}>
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #efe3d7, #e8d5c4)' }} />
                      )}
                      {product.is_trending && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(47,39,35,0.85)', color: 'white', fontSize: '8px', letterSpacing: '1px', padding: '3px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>Tendance</div>
                      )}
                      {discounted && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#c8a27b', color: 'white', fontSize: '9px', padding: '3px 8px', borderRadius: '999px' }}>-{product.discount_percentage}%</div>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px 16px' }}>
                      <p style={{ fontSize: '9px', color: '#c8a27b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</p>
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: '#2f2723', fontWeight: 500, lineHeight: 1.2 }}>{product.title}</p>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {discounted ? (
                          <div>
                            <span style={{ fontSize: '13px', color: '#c8a27b', fontWeight: 600 }}>{formatPrice(salePrice)}</span>
                            <span style={{ fontSize: '10px', color: '#bbb', textDecoration: 'line-through', marginLeft: '6px' }}>{formatPrice(product.original_price)}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#2f2723', fontWeight: 500 }}>{formatPrice(product.original_price)}</span>
                        )}
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2f2723', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>↗</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } ::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}
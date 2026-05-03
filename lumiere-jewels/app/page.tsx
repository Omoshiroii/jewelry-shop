'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'

export default function HomePage() {
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
    fetchProducts()
  }, [activeCategory])

  async function fetchProducts() {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (activeCategory !== 'tout') query = query.eq('category', activeCategory)
    const { data } = await query
    if (data) setProducts(data)
    setLoading(false)
  }

  const trending = products.filter(p => p.is_trending)

  return (
    <div style={{ background: '#f7f2ec', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        padding: '18px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
      }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, letterSpacing: '3px', color: '#2f2723' }}>
          lumière
        </span>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', border: '1px solid rgba(200,162,123,0.2)'
          }}>
            ☰
          </div>
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', padding: '110px 24px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            display: 'inline-block', padding: '8px 16px',
            background: 'rgba(255,255,255,0.5)', borderRadius: '999px',
            backdropFilter: 'blur(12px)',
            fontSize: '10px', letterSpacing: '2px', color: '#8e7f74',
            marginBottom: '28px'
          }}>
            BIJOUX ARTISANAUX MAROCAINS
          </div>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3.2rem, 10vw, 6rem)',
            lineHeight: '0.93',
            fontWeight: 500,
            color: '#2f2723',
            marginBottom: '24px'
          }}>
            Bijoux qui<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>murmurent</em><br />
            l'élégance.
          </h1>

          <p style={{ fontSize: '14px', lineHeight: '1.9', color: '#8e7f74', maxWidth: '300px' }}>
            Pièces féminines inspirées de la chaleur marocaine, créées pour les femmes qui romanticisent chaque détail.
          </p>
        </div>

        {/* Floating gallery */}
        <div style={{ position: 'relative', height: '360px', marginTop: '48px' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: '58%', height: '260px',
            borderRadius: '28px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)', zIndex: 2
          }}>
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800"
              alt="jewelry"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            position: 'absolute', right: 0, top: '30px',
            width: '40%', height: '180px',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600"
              alt="jewelry"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            position: 'absolute', right: '16px', bottom: 0,
            width: '44%', height: '155px',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600"
              alt="jewelry"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Floating card */}
          <div style={{
            position: 'absolute', left: '12px', bottom: '12px',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px', zIndex: 5,
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: '#2f2723' }}>✦ Fait à la main au Maroc</p>
            <p style={{ fontSize: '10px', color: '#8e7f74', marginTop: '3px' }}>luxe doux & intemporel</p>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ textAlign: 'center', marginTop: '32px', color: '#c8a27b', fontSize: '11px', letterSpacing: '2px' }}>
          ↓ DÉCOUVRIR
        </div>
      </section>

      {/* TRENDING SECTION */}
      {trending.length > 0 && (
        <section style={{ padding: '20px 24px 60px' }}>
          <div style={{ marginBottom: '28px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#c8a27b', textTransform: 'uppercase' }}>
              sélection
            </span>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.8rem', fontWeight: 500,
              lineHeight: 1, marginTop: '8px', color: '#2f2723'
            }}>
              Pièces<br />Tendances
            </h2>
          </div>

          {/* Horizontal scroll */}
          <div style={{
            display: 'flex', gap: '16px',
            overflowX: 'auto', paddingBottom: '10px',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none', scrollbarWidth: 'none'
          }}>
            {trending.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* EDITORIAL BANNER */}
      <section style={{ padding: '0 20px 60px' }}>
        <div style={{
          background: 'linear-gradient(145deg, #2f2723, #1e1815)',
          borderRadius: '36px', padding: '40px 28px',
          color: 'white'
        }}>
          <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#c8a27b' }}>NOTRE HISTOIRE</span>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.8rem', fontWeight: 500,
            lineHeight: 1.05, margin: '12px 0 16px'
          }}>
            Créé avec<br />âme & élégance.
          </h2>
          <p style={{ fontSize: '13px', lineHeight: 1.9, opacity: 0.7, marginBottom: '24px' }}>
            Chaque pièce est conçue avec une douceur féminine et une identité marocaine. Inspirée de motifs zellige, de tons chauds et d'une beauté intemporelle.
          </p>
          <Link href="/catalogue" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 28px', border: 'none',
              background: '#e5c5a4', color: '#2f2723',
              borderRadius: '999px', fontWeight: 600,
              fontSize: '13px', cursor: 'pointer'
            }}>
              Explorer la Collection
            </button>
          </Link>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section style={{ padding: '0 20px 120px' }}>
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#c8a27b', textTransform: 'uppercase' }}>
            catalogue
          </span>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.8rem', fontWeight: 500,
            lineHeight: 1, marginTop: '8px', color: '#2f2723'
          }}>
            Toutes les<br />Pièces
          </h2>
        </div>

        {/* Category pills */}
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          paddingBottom: '16px', scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                whiteSpace: 'nowrap',
                padding: '8px 18px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeCategory === cat.value ? '#c8a27b' : 'rgba(200,162,123,0.3)',
                background: activeCategory === cat.value ? '#c8a27b' : 'rgba(255,255,255,0.6)',
                color: activeCategory === cat.value ? 'white' : '#8e7f74',
                fontSize: '11px', letterSpacing: '1px',
                cursor: 'pointer', backdropFilter: 'blur(10px)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#c8a27b' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              border: '2px solid #c8a27b', borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite', margin: '0 auto'
            }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#c8a27b' }}>
              Aucune pièce trouvée
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px'
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM NAV */}
      <div style={{
        position: 'fixed', bottom: '16px', left: '50%',
        transform: 'translateX(-50%)',
        width: '90%', maxWidth: '400px',
        padding: '12px 8px',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '999px',
        display: 'flex', justifyContent: 'space-around',
        zIndex: 200,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        {[
          { icon: '⌂', label: 'Accueil', href: '/' },
          { icon: '◎', label: 'Catalogue', href: '/catalogue' },
          { icon: '♡', label: 'Favoris', href: '/' },
          { icon: '◌', label: 'Contact', href: '/' },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span style={{ fontSize: '18px', color: '#8e7f74' }}>{item.icon}</span>
              <span style={{ fontSize: '9px', color: '#8e7f74', letterSpacing: '0.5px' }}>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const discounted = hasDiscount(product.discount_percentage)
  const salePrice = getSalePrice(product.original_price, product.discount_percentage)
  const imageUrl = product.images?.[0]

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(14px)',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        minWidth: '200px',
        scrollSnapAlign: 'start'
      }}>
        <div style={{ position: 'relative', aspectRatio: '1', background: '#efe3d7', overflow: 'hidden' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #efe3d7, #e8d5c4)' }} />
          )}
          {product.is_trending && (
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              background: 'rgba(47,39,35,0.85)',
              backdropFilter: 'blur(8px)',
              color: 'white', fontSize: '8px',
              letterSpacing: '1.5px', padding: '4px 10px',
              borderRadius: '999px', textTransform: 'uppercase'
            }}>
              Tendance
            </div>
          )}
          {discounted && (
            <div style={{
              position: 'absolute', top: '10px', right: '10px',
              background: '#c8a27b',
              color: 'white', fontSize: '9px',
              padding: '4px 10px', borderRadius: '999px'
            }}>
              -{product.discount_percentage}%
            </div>
          )}
        </div>

        <div style={{ padding: '12px 14px 16px' }}>
          <p style={{ fontSize: '9px', color: '#c8a27b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {product.category}
          </p>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '17px', color: '#2f2723', fontWeight: 500, lineHeight: 1.2
          }}>
            {product.title}
          </p>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {discounted ? (
                <div>
                  <span style={{ fontSize: '13px', color: '#c8a27b', fontWeight: 600 }}>
                    {formatPrice(salePrice)}
                  </span>
                  <span style={{ fontSize: '10px', color: '#bbb', textDecoration: 'line-through', marginLeft: '6px' }}>
                    {formatPrice(product.original_price)}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: '#2f2723', fontWeight: 500 }}>
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#2f2723', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px'
            }}>
              ↗
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
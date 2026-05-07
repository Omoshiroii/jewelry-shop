'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'
import ProductList from '@/components/admin/ProductList'

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [tab, setTab] = useState<'overview' | 'products'>('overview')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin')
  }

  async function fetchProducts() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce produit ?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
  }

  function handleEdit(product: Product) {
    setEditProduct(product)
    setShowForm(true)
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditProduct(undefined)
    fetchProducts()
  }

  const trending = products.filter(p => p.is_trending)
  const onSale = products.filter(p => p.discount_percentage > 0)

  return (
    <div style={{ background: '#f7f2ec', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(160deg, #2f2723 0%, #1a120e 100%)',
        padding: '52px 24px 28px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(200,162,123,0.08)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-block', padding: '5px 12px', background: 'rgba(200,162,123,0.2)', borderRadius: '999px', fontSize: '8px', letterSpacing: '2px', color: '#e5c5a4', border: '1px solid rgba(200,162,123,0.3)', marginBottom: '12px' }}>
              ✦ ESPACE PROPRIÉTAIRE
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: 'white', lineHeight: 1, letterSpacing: '2px' }}>LILOOK</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', letterSpacing: '1px' }}>Don't look back</p>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: '999px', padding: '8px 16px', fontSize: '11px', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Produits', value: products.length },
            { label: 'Tendances', value: trending.length },
            { label: 'En solde', value: onSale.length },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '14px 12px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 500, color: '#e5c5a4', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,162,123,0.15)', position: 'sticky', top: 0, zIndex: 50 }}>
        {([
          { key: 'overview', label: 'Vue générale' },
          { key: 'products', label: `Produits (${products.length})` },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '14px 8px',
            background: 'none', border: 'none',
            borderBottom: tab === t.key ? '2px solid #c8a27b' : '2px solid transparent',
            color: tab === t.key ? '#c8a27b' : '#8e7f74',
            fontSize: '12px', cursor: 'pointer'
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '20px 20px 120px' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            {/* Quick action */}
            <button
              onClick={() => { setEditProduct(undefined); setShowForm(true) }}
              style={{
                width: '100%', padding: '18px',
                background: 'linear-gradient(135deg, #2f2723, #1a120e)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontSize: '14px', letterSpacing: '1px', cursor: 'pointer',
                marginBottom: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              <span style={{ fontSize: '20px' }}>+</span> Ajouter un produit
            </button>

            {/* Category breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '9px', letterSpacing: '3px', color: '#c8a27b', textTransform: 'uppercase', marginBottom: '14px' }}>
                par catégorie
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['bagues', 'colliers', 'bracelets', 'boucles', 'traditionnel', 'pendentifs', 'ensembles', 'autres'].map(cat => {
                  const count = products.filter(p => p.category === cat).length
                  return (
                    <div key={cat} style={{
                      background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
                      borderRadius: '16px', padding: '14px 16px',
                      border: '1px solid rgba(200,162,123,0.15)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', color: '#2f2723', textTransform: 'capitalize' }}>{cat}</span>
                      <span style={{
                        fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem',
                        color: count > 0 ? '#c8a27b' : '#ddd', fontWeight: 500
                      }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent products — just 3 */}
            {products.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', letterSpacing: '3px', color: '#c8a27b', textTransform: 'uppercase', marginBottom: '14px' }}>
                  ajouts récents
                </p>
                <ProductList products={products.slice(0, 3)} onEdit={handleEdit} onDelete={handleDelete} />
                {products.length > 3 && (
                  <button onClick={() => setTab('products')} style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'none', border: '1px solid rgba(200,162,123,0.3)', borderRadius: '16px', color: '#c8a27b', fontSize: '12px', cursor: 'pointer' }}>
                    Voir tous les produits →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <button
              onClick={() => { setEditProduct(undefined); setShowForm(true) }}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #2f2723, #1a120e)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontSize: '13px', letterSpacing: '1px', cursor: 'pointer',
                marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>+</span> Ajouter un produit
            </button>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #c8a27b', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#c8a27b' }}>Aucun produit</p>
                <p style={{ fontSize: '12px', color: '#8e7f74', marginTop: '8px' }}>Commencez par ajouter votre première pièce</p>
              </div>
            ) : (
              <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditProduct(undefined) }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
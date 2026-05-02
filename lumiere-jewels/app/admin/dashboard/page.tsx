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
  const [tab, setTab] = useState<'dashboard' | 'products'>('dashboard')
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
    <main style={{ minHeight: '100vh', background: '#fdf5f5' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '48px 24px 16px', borderBottom: '1px solid #f0e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 300, letterSpacing: '2px', color: '#1a1a1a' }}>lumière</h1>
          <p style={{ fontSize: '9px', letterSpacing: '3px', color: '#C4787C', textTransform: 'uppercase', marginTop: '4px' }}>espace propriétaire</p>
        </div>
        <button onClick={handleLogout} style={{ fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>
          Déconnexion
        </button>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', display: 'flex', borderBottom: '1px solid #f0e8e8' }}>
        {(['dashboard', 'products'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px', fontSize: '12px', border: 'none', borderBottom: tab === t ? '2px solid #C4787C' : '2px solid transparent', color: tab === t ? '#C4787C' : '#aaa', background: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
            {t === 'dashboard' ? 'Dashboard' : `Produits (${products.length})`}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        {tab === 'dashboard' && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Total produits', value: products.length },
                { label: 'Tendances', value: trending.length },
                { label: 'En solde', value: onSale.length },
                { label: 'Catégories', value: 5 },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f0e8e8' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#1a1a1a', margin: 0 }}>{stat.value}</p>
                  <p style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#C4787C', marginTop: '4px' }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setEditProduct(undefined); setShowForm(true) }} style={{ width: '100%', background: '#C4787C', color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', marginBottom: '20px' }}>
              + Ajouter un nouveau produit
            </button>
            <p style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Produits récents</p>
            <ProductList products={products.slice(0, 5)} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        )}

        {tab === 'products' && (
          <>
            <button onClick={() => { setEditProduct(undefined); setShowForm(true) }} style={{ width: '100%', background: '#C4787C', color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', marginBottom: '16px' }}>
              + Ajouter un produit
            </button>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#C4787C' }}>Chargement...</div>
            ) : (
              <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditProduct(undefined) }}
        />
      )}
    </main>
  )
}
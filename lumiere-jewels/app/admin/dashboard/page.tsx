'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'
import ProductList from '@/components/admin/ProductList'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Phone,
  MapPin,
  ExternalLink,
  LogOut,
  Eye,
  Sliders,
  DollarSign,
  Plus,
  Copy,
  Check,
  FolderOpen
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type OrderItem = {
  id: string
  title: string
  price: number
  quantity: number
  image: string | null
  category: string
}

type Order = {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_apartment: string | null
  customer_city: string
  customer_zip: string | null
  customer_country: string
  customer_company: string | null
  items: OrderItem[]
  total_price: number
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled'
}

type PageView = {
  id: string
  created_at: string
  session_id: string
  page_path: string
  user_agent: string | null
}

type DBConfigCategory = {
  id: string
  name: string
  slug: string
  emoji: string
  display_order: number
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.08)', icon: Clock },
  confirmed: { label: 'Confirmée', color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: CheckCircle },
  shipped: { label: 'Expédiée', color: '#2563eb', bg: 'rgba(37,99,235,0.08)', icon: Truck },
  cancelled: { label: 'Annulée', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: XCircle },
}

const MIGRATION_SQL = `-- ==========================================
-- LILOOK — DATABASE MIGRATION SCRIPT
-- ==========================================
-- Paste this entire script in:
-- Supabase Dashboard → SQL Editor → New Query → Run

-- 1. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_company TEXT,
  customer_apartment TEXT,
  customer_city TEXT NOT NULL,
  customer_zip TEXT,
  customer_country TEXT DEFAULT 'Maroc' NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts" ON public.orders;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.orders;
DROP POLICY IF EXISTS "Allow all for service role" ON public.orders;
CREATE POLICY "Allow public inserts" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow update for service role" ON public.orders FOR UPDATE USING (true);

-- 2. CREATE PAGE VIEWS TABLE
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  user_agent TEXT
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts" ON public.page_views;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.page_views;
CREATE POLICY "Allow public inserts" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON public.page_views FOR SELECT USING (true);

-- 3. CREATE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.categories;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.categories;
CREATE POLICY "Allow select for everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow all for authenticated" ON public.categories FOR ALL USING (true);

INSERT INTO public.categories (name, slug, display_order) VALUES
  ('Bagues', 'bagues', 1),
  ('Colliers', 'colliers', 2),
  ('Bracelets', 'bracelets', 3),
  ('Boucles d''oreilles', 'boucles', 4),
  ('Traditionnel', 'traditionnel', 5),
  ('Pendentifs', 'pendentifs', 6),
  ('Ensembles', 'ensembles', 7)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_favorite(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET favorites_count = COALESCE(favorites_count, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_favorite(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET favorites_count = GREATEST(0, COALESCE(favorites_count, 0) - 1)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [views, setViews] = useState<PageView[]>([])
  const [dbCategories, setDbCategories] = useState<DBConfigCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'categories'>('overview')
  const router = useRouter()

  // Categories Form State
  const [newCatName, setNewCatName] = useState('')
  const [newCatSlug, setNewCatSlug] = useState('')
  const [newCatOrder, setNewCatOrder] = useState('0')
  const [addingCategory, setAddingCategory] = useState(false)

  // Copying state
  const [copied, setCopied] = useState(false)

  // Expanded order row
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'cancelled'>('all')

  // Error state for missing tables
  const [migrationError, setMigrationError] = useState(false)

  const loadAllData = useCallback(async () => {
    setLoading(true)
    setMigrationError(false)
    const supabase = createClient()

    try {
      // 1. Fetch products
      const { data: productsData, error: pErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (pErr) throw pErr
      if (productsData) setProducts(productsData)

      // 2. Fetch orders
      const { data: ordersData, error: oErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (oErr && (oErr.code === 'PGRST116' || oErr.message?.includes('public.orders') || oErr.code === '42P01')) {
        console.warn('Orders table not loaded yet')
        setMigrationError(true)
      } else if (oErr) {
        throw oErr
      }
      if (ordersData) setOrders(ordersData)

      // 3. Fetch page views
      const { data: viewsData, error: vErr } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })

      if (vErr && (vErr.code === 'PGRST116' || vErr.message?.includes('public.page_views') || vErr.code === '42P01')) {
        console.warn('Page views table not loaded yet')
        setMigrationError(true)
      } else if (vErr) {
        throw vErr
      }
      if (viewsData) setViews(viewsData)

      // 4. Fetch categories
      const { data: categoriesData, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (categoriesData) {
        setDbCategories(categoriesData)
      } else if (catErr) {
        console.warn('Categories table not loaded yet')
        setMigrationError(true)
      }

    } catch (err: any) {
      console.error('Database loading error:', err)
      if (err.message?.includes('public.orders') || err.message?.includes('public.page_views') || err.code === '42P01') {
        setMigrationError(true)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin')
    }
    checkAuth()
    loadAllData()
  }, [loadAllData, router])

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Erreur lors de la mise à jour du statut.')
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Supprimer ce produit ?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    loadAllData()
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCatName || !newCatSlug) return
    setAddingCategory(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCatName,
          slug: newCatSlug.toLowerCase().trim(),
          display_order: parseInt(newCatOrder) || 0
        })

      if (error) throw error

      setNewCatName('')
      setNewCatSlug('')
      setNewCatOrder('0')
      loadAllData()
    } catch (err: any) {
      console.error(err)
      alert('Erreur lors de la création de la catégorie. Assurez-vous que le slug est unique.')
    } finally {
      setAddingCategory(false)
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Supprimer cette catégorie ?')) return
    const supabase = createClient()
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      loadAllData()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la suppression.')
    }
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
  }

  function handleEditProduct(product: Product) {
    setEditProduct(product)
    setShowForm(true)
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditProduct(undefined)
    loadAllData()
  }

  function copyMigrationSql() {
    navigator.clipboard.writeText(MIGRATION_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // --- STATS COMPUTATIONS ---
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_price), 0)

  const uniqueSessions = new Set(views.map(v => v.session_id))
  const uniqueVisitorsCount = uniqueSessions.size

  const viewsByPath: Record<string, number> = {}
  views.forEach(v => {
    viewsByPath[v.page_path] = (viewsByPath[v.page_path] || 0) + 1
  })
  const sortedPaths = Object.entries(viewsByPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer_phone.includes(orderSearch) ||
      order.id.substring(0, 8).toLowerCase().includes(orderSearch.toLowerCase())

    const matchesStatus = orderFilter === 'all' || order.status === orderFilter
    return matchesSearch && matchesStatus
  })

  // --- CHART DATA GENERATION (LAST 7 DAYS) — REAL DATA ONLY ---
  const getChartData = () => {
    const dataMap: Record<string, { date: string; orders: number; revenue: number; views: number }> = {}
    const dates = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      const key = d.toISOString().split('T')[0]
      dataMap[key] = { date: dateStr, orders: 0, revenue: 0, views: 0 }
      dates.push({ key, dateStr })
    }

    orders.forEach(o => {
      const key = o.created_at.split('T')[0]
      if (dataMap[key]) {
        dataMap[key].orders += 1
        if (o.status !== 'cancelled') {
          dataMap[key].revenue += Number(o.total_price)
        }
      }
    })

    views.forEach(v => {
      const key = v.created_at.split('T')[0]
      if (dataMap[key]) {
        dataMap[key].views += 1
      }
    })

    return dates.map(d => ({
      date: d.dateStr,
      ...dataMap[d.key]
    }))
  }

  const chartData = getChartData()
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)
  const maxViews = Math.max(...chartData.map(d => d.views), 1)

  // --- TOP PRODUCT PAGES (extract product IDs from /product/[id] paths) ---
  const productPageViews = Object.entries(viewsByPath)
    .filter(([path]) => path.startsWith('/product/'))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => {
      const productId = path.replace('/product/', '')
      const product = products.find(p => p.id === productId)
      return { path, productId, title: product?.title || path, count }
    })

  return (
    <div style={{ background: '#fdf0f3', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* HEADER SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1424 0%, #2f1f35 100%)',
        padding: '52px 24px 28px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(212,132,154,0.12)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-block', padding: '5px 12px', background: 'rgba(212,132,154,0.2)', borderRadius: '999px', fontSize: '8px', letterSpacing: '2px', color: '#f0c4d0', border: '1px solid rgba(212,132,154,0.3)', marginBottom: '12px' }}>
              ✦ TABLEAU DE BORD EXCLUSIF
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: 'white', lineHeight: 1, letterSpacing: '2px' }}>LILOOK</h1>
            <p style={{ fontSize: '11px', color: 'rgba(240,196,208,0.5)', marginTop: '4px', letterSpacing: '1px' }}>Espace Propriétaire</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
              borderRadius: '999px',
              padding: '8px 16px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={12} /> Déconnexion
          </button>
        </div>

        {/* TOP METRICS SUMMARY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '28px', position: 'relative', zIndex: 1 }}>
          {[
            { label: 'En attente', value: pendingOrders.length, color: '#f0c4d0' },
            { label: 'Produits', value: products.length, color: '#fff' },
            { label: 'Visiteurs', value: uniqueVisitorsCount, color: '#fff' },
            { label: 'Chiffre (MAD)', value: totalRevenue > 0 ? totalRevenue.toLocaleString('fr-MA') : '0', color: '#d4849a' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '14px 12px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 500, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '5px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MIGRATION UI HELPER & COPY SNIPPET */}
      {migrationError && (
        <div className="mx-6 mt-6 bg-[#8c2f49]/5 border border-[#8c2f49]/15 rounded-[24px] p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs tracking-[1px] uppercase font-bold text-[#8c2f49] flex items-center gap-2">
                <Sliders size={14} /> Migration de Base de Données requise
              </h3>
              <p className="text-[12px] text-[#4a3550] leading-relaxed max-w-[650px]">
                Les tables <code>orders</code>, <code>page_views</code>, et <code>categories</code> ne sont pas encore créées ou configurées dans votre instance Supabase. Copiez le script SQL ci-dessous et exécutez-le dans votre console Supabase.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={copyMigrationSql}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#d4849a] hover:bg-[#d4849a]/95 text-white rounded-xl text-[11px] uppercase tracking-[1px] font-medium transition-all"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copié !' : 'Copier le SQL'}
              </button>
              <button
                onClick={loadAllData}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#1e1424] hover:bg-[#1e1424]/90 text-white rounded-xl text-[11px] uppercase tracking-[1px] font-medium transition-all"
              >
                Vérifier
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#f0c4d0]/30 bg-[#1e1424] p-4">
            <pre className="text-[10px] text-[#f0c4d0] font-mono overflow-x-auto max-h-[140px] leading-relaxed">
              {MIGRATION_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* STICKY TAB NAVIGATOR */}
      <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(240, 196, 208, 0.25)', position: 'sticky', top: 0, zIndex: 50 }}>
        {([
          { key: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
          { key: 'orders', label: `Commandes (${orders.length})`, icon: ShoppingCart },
          { key: 'products', label: `Produits (${products.length})`, icon: Package },
          { key: 'categories', label: `Catégories (${dbCategories.length})`, icon: FolderOpen },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '14px 8px',
              background: 'none', border: 'none',
              borderBottom: tab === t.key ? '2px solid #d4849a' : '2px solid transparent',
              color: tab === t.key ? '#d4849a' : '#9b6b7f',
              fontSize: '11px',
              fontWeight: tab === t.key ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <t.icon size={13} />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 20px 120px' }}>

        {/* 1. OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-6 max-w-[1000px] mx-auto animate-fade-in-up">

            {/* Quick add product */}
            <button
              onClick={() => { setEditProduct(undefined); setShowForm(true) }}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #1e1424, #2f1f35)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontSize: '12px', letterSpacing: '2px', cursor: 'pointer',
                textTransform: 'uppercase', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 15px rgba(30,20,36,0.15)'
              }}
            >
              <Plus size={14} /> Ajouter une pièce
            </button>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Chart A: Revenue last 7 days */}
              <div className="bg-white rounded-[24px] border border-[#f0c4d0]/30 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-[#d4849a]" />
                    <span className="text-[10px] tracking-[2px] uppercase text-[#1e1424] font-bold">Chiffre des Ventes</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#d4849a]">7 derniers jours</span>
                </div>

                <div className="h-44 flex items-end justify-between pt-6 px-2 gap-2">
                  {chartData.map((d, i) => {
                    const pct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e1424] text-white text-[9px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          {d.revenue.toLocaleString()} MAD
                        </div>
                        <div
                          className="w-full bg-[#d4849a]/20 hover:bg-[#d4849a] transition-all rounded-t-lg"
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                        <span className="text-[8px] text-[#9b6b7f] mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                          {d.date}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chart B: Traffic Statistics */}
              <div className="bg-white rounded-[24px] border border-[#f0c4d0]/30 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-[#d4849a]" />
                    <span className="text-[10px] tracking-[2px] uppercase text-[#1e1424] font-bold">Visites (Pages vues)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#9b6b7f]">Activité récente</span>
                </div>

                <div className="h-44 flex items-end justify-between pt-6 px-2 gap-2">
                  {chartData.map((d, i) => {
                    const pct = maxViews > 0 ? (d.views / maxViews) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e1424] text-white text-[9px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          {d.views} pages
                        </div>
                        <div
                          className="w-full bg-[#1e1424]/10 hover:bg-[#1e1424]/60 transition-all rounded-t-lg"
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                        <span className="text-[8px] text-[#9b6b7f] mt-2 w-full text-center truncate">
                          {d.date}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* LOWER CONTENT: TOP PAGES & CATEGORIES */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Left: Top viewed products (7 cols) */}
              <div className="bg-white rounded-[24px] border border-[#f0c4d0]/30 p-5 shadow-sm md:col-span-7">
                <span className="text-[9px] tracking-[2px] uppercase text-[#d4849a] font-bold block mb-4">Produits les plus vus</span>

                {productPageViews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                    <Eye size={24} className="text-[#f0c4d0]" />
                    <p className="text-xs text-[#9b6b7f]">Aucune visite produit enregistrée</p>
                    <p className="text-[10px] text-[#c4a0b0]">Les vues apparaîtront ici quand des clients navigueront sur le site.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productPageViews.map((item, idx) => (
                      <a
                        key={item.path}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs pb-2 border-b border-[#fdf0f3] group hover:bg-[#fdf0f3]/50 rounded-lg px-1 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[9px] w-4 text-center font-bold text-[#d4849a]">{idx + 1}</span>
                          <span className="text-[#1e1424] font-medium truncate max-w-[220px] group-hover:text-[#d4849a] transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold text-[#1e1424]">{item.count} vue{item.count > 1 ? 's' : ''}</span>
                          <ExternalLink size={10} className="text-[#9b6b7f] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Category inventory split (5 cols) */}
              <div className="bg-white rounded-[24px] border border-[#f0c4d0]/30 p-5 shadow-sm md:col-span-5">
                <span className="text-[9px] tracking-[2px] uppercase text-[#d4849a] font-bold block mb-4">Stocks par catégorie</span>

                <div className="grid grid-cols-2 gap-3">
                  {['bagues', 'colliers', 'bracelets', 'boucles', 'traditionnel', 'pendentifs', 'ensembles', 'autres'].map(cat => {
                    const count = products.filter(p => p.category === cat).length
                    return (
                      <div key={cat} className="bg-[#f5e4ea]/30 border border-[#f0c4d0]/20 rounded-xl p-3 flex justify-between items-center text-xs">
                        <span className="capitalize text-[#9b6b7f]">{cat}</span>
                        <span className="font-cormorant text-md font-semibold text-[#1e1424]">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. ORDERS TAB */}
        {tab === 'orders' && (
          <div className="space-y-4 max-w-[800px] mx-auto animate-fade-in-up">

            {/* Search & Filter bar */}
            <div className="bg-white rounded-2xl border border-[#f0c4d0]/30 p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, tél ou #ID..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full bg-[#fdf0f3]/50 border border-[#f0c4d0]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1e1424] font-inter outline-none focus:border-[#d4849a] transition-all"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b6b7f]" />
              </div>
              <div className="flex gap-2">
                <select
                  value={orderFilter}
                  onChange={e => setOrderFilter(e.target.value as any)}
                  className="bg-white border border-[#f0c4d0]/40 rounded-xl px-3 py-2 text-xs text-[#1e1424] font-inter outline-none cursor-pointer"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="shipped">Expédiées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
            </div>

            {/* List orders */}
            {migrationError || orders.length === 0 ? (
              // Display Mock Orders to demonstrate functionality visually
              <div className="space-y-3">
                {[
                  { id: '4a6b2c8e', name: 'Salma Alami', phone: '+212612345678', price: 450, status: 'pending', date: 'Aujourd\'hui, 14:32', items: [{ title: 'Bague Jasmine ✨', price: 150, quantity: 1 }, { title: 'Collier Royal 📿', price: 300, quantity: 1 }] },
                  { id: '2f8e1a9d', name: 'Nisrine Bennani', phone: '+212698765432', price: 290, status: 'confirmed', date: 'Hier, 18:15', items: [{ title: 'Bracelet Minimaliste 🧿', price: 290, quantity: 1 }] },
                ].map((mockOrder: any) => {
                  const status = STATUS_MAP[mockOrder.status] || STATUS_MAP.pending
                  const isExpanded = expandedOrderId === mockOrder.id
                  return (
                    <div key={mockOrder.id} className="bg-white rounded-[24px] border border-[#f0c4d0]/30 shadow-sm overflow-hidden">
                      <div onClick={() => setExpandedOrderId(isExpanded ? null : mockOrder.id)} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[11px] font-semibold text-[#9b6b7f]">#{mockOrder.id.toUpperCase()}</span>
                            <div className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-[0.5px] font-semibold" style={{ background: status.bg, color: status.color }}>
                              {status.label}
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-[#1e1424]">
                            {mockOrder.name} • <span className="font-normal text-[#9b6b7f]">{mockOrder.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-2.5 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-[#9b6b7f] block">Montant</span>
                            <span className="font-cormorant text-md font-bold text-[#d4849a]">{mockOrder.price} MAD</span>
                          </div>
                          <span className="text-[10px] text-[#ccc]">{mockOrder.date}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-[#fdf0f3] bg-[#fdf0f3]/20 p-5 space-y-4">
                          <div className="bg-white rounded-2xl border border-[#f0c4d0]/20 p-4 space-y-3">
                            <span className="text-[8px] tracking-[1.5px] uppercase text-[#d4849a] font-bold block">Détail des pièces (Exemple)</span>
                            {mockOrder.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <div>
                                  <p className="text-[#1e1424] font-semibold">{item.title}</p>
                                  <p className="text-[10px] text-[#9b6b7f]">{item.quantity} × {item.price} MAD</p>
                                </div>
                                <span className="font-semibold text-[#1e1424]">{item.price * item.quantity} MAD</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  const status = STATUS_MAP[order.status] || STATUS_MAP.pending
                  const isExpanded = expandedOrderId === order.id
                  const formattedDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-[24px] border border-[#f0c4d0]/30 shadow-sm overflow-hidden transition-all duration-300"
                    >
                      <div
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[11px] font-semibold text-[#9b6b7f]">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </span>
                            <div
                              className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-[0.5px] font-semibold"
                              style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}15` }}
                            >
                              {status.label}
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-[#1e1424]">
                            {order.customer_name} • <span className="font-normal text-[#9b6b7f]">{order.customer_phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-[#9b6b7f] uppercase block">Montant</span>
                            <span className="font-cormorant text-md font-bold text-[#d4849a]">{formatPrice(order.total_price)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#bbb]">{formattedDate}</span>
                            {isExpanded ? <ChevronUp size={16} className="text-[#9b6b7f]" /> : <ChevronDown size={16} className="text-[#9b6b7f]" />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[#fdf0f3] bg-[#fdf0f3]/20 p-5 space-y-4">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 text-xs">
                              <span className="text-[8px] tracking-[1.5px] uppercase text-[#d4849a] font-bold block mb-1">Coordonnées client</span>
                              <p className="flex items-center gap-2 text-[#1e1424] font-medium">
                                <span className="w-4 flex justify-center text-[#d4849a]">👤</span> {order.customer_name}
                              </p>
                              <p className="flex items-center gap-2 text-[#9b6b7f]">
                                <span className="w-4 flex justify-center text-[#d4849a]">📞</span>
                                <a href={`tel:${order.customer_phone}`} className="hover:underline">{order.customer_phone}</a>
                                <a
                                  href={`https://wa.me/${order.customer_phone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 font-semibold ml-2 hover:underline flex items-center gap-0.5"
                                >
                                  WhatsApp <ExternalLink size={10} />
                                </a>
                              </p>
                            </div>

                            <div className="space-y-1 text-xs">
                              <span className="text-[8px] tracking-[1.5px] uppercase text-[#d4849a] font-bold block mb-1">Adresse de livraison</span>
                              <p className="flex items-start gap-2 text-[#1e1424]">
                                <MapPin size={12} className="text-[#d4849a] mt-0.5 flex-shrink-0" />
                                <span>
                                  {order.customer_address}
                                  {order.customer_apartment && `, Apt/Suite: ${order.customer_apartment}`}
                                  <br />
                                  {order.customer_city} {order.customer_zip || ''}, {order.customer_country}
                                  {order.customer_company && <span className="block text-[10px] text-[#9b6b7f] mt-0.5">🏢 Entreprise: {order.customer_company}</span>}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-[#f0c4d0]/10 p-4 space-y-3.5">
                            <span className="text-[8px] tracking-[1.5px] uppercase text-[#d4849a] font-bold block">Détail des pièces</span>

                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#efe3d7] flex-shrink-0">
                                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                  </div>
                                  <div>
                                    <p className="text-[#1e1424] font-semibold">{item.title}</p>
                                    <p className="text-[10px] text-[#9b6b7f]">{item.quantity} × {formatPrice(item.price)}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-[#1e1424]">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-[#fdf0f3]">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl text-[10px] uppercase tracking-[1px] font-bold hover:bg-green-700 transition-colors cursor-pointer"
                              >
                                Confirmer la commande
                              </button>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] uppercase tracking-[1px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                              >
                                Marquer comme expédiée
                              </button>
                            )}
                            {order.status !== 'cancelled' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                className="px-4 py-2 bg-transparent border border-red-200 text-red-600 rounded-xl text-[10px] uppercase tracking-[1px] font-bold hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Annuler
                              </button>
                            )}
                            <a
                              href={`/commande/${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#1e1424] text-white rounded-xl text-[10px] uppercase tracking-[1px] font-medium hover:bg-[#d4849a] transition-colors flex items-center gap-1.5"
                            >
                              Fiche publique <ExternalLink size={10} />
                            </a>
                          </div>

                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. PRODUCTS TAB */}
        {tab === 'products' && (
          <div className="max-w-[800px] mx-auto animate-fade-in-up">
            <button
              onClick={() => { setEditProduct(undefined); setShowForm(true) }}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #1e1424, #2f1f35)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontSize: '12px', letterSpacing: '2px', cursor: 'pointer',
                textTransform: 'uppercase', fontWeight: 500,
                marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <Plus size={14} /> Ajouter une pièce
            </button>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#d4849a' }}>Aucun produit</p>
                <p style={{ fontSize: '12px', color: '#9b6b7f', marginTop: '8px' }}>Commencez par ajouter votre première pièce</p>
              </div>
            ) : (
              <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
            )}
          </div>
        )}

        {/* 4. CATEGORIES MANAGEMENT TAB */}
        {tab === 'categories' && (
          <div className="max-w-[800px] mx-auto space-y-6 animate-fade-in-up">
            
            {/* Add Category Form */}
            <div className="bg-white rounded-[24px] border border-[#f0c4d0]/30 p-5 shadow-sm">
              <span className="text-[9px] tracking-[2px] uppercase text-[#d4849a] font-bold block mb-4">Créer une catégorie</span>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[1.5px] uppercase text-[#9b6b7f] mb-1.5">Nom de la catégorie</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Bagues"
                      value={newCatName}
                      onChange={e => {
                        setNewCatName(e.target.value)
                        setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      }}
                      className="w-full bg-[#fdf0f3]/50 border border-[#f0c4d0]/30 rounded-xl px-4 py-2.5 text-xs text-[#1e1424] outline-none focus:border-[#d4849a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[1.5px] uppercase text-[#9b6b7f] mb-1.5">Slug URL (Unique)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: bagues"
                      value={newCatSlug}
                      onChange={e => setNewCatSlug(e.target.value)}
                      className="w-full bg-[#fdf0f3]/50 border border-[#f0c4d0]/30 rounded-xl px-4 py-2.5 text-xs text-[#1e1424] outline-none focus:border-[#d4849a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[1.5px] uppercase text-[#9b6b7f] mb-1.5">Ordre d&apos;affichage</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newCatOrder}
                      onChange={e => setNewCatOrder(e.target.value)}
                      className="w-full bg-[#fdf0f3]/50 border border-[#f0c4d0]/30 rounded-xl px-4 py-2.5 text-xs text-[#1e1424] outline-none focus:border-[#d4849a]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingCategory}
                  className="w-full py-3 bg-[#1e1424] hover:bg-[#d4849a] transition-all text-white rounded-xl text-[11px] uppercase tracking-[1px] font-bold"
                >
                  {addingCategory ? 'Création...' : 'Créer la catégorie'}
                </button>
              </form>
            </div>

            {/* List Categories */}
            <div className="bg-white rounded-[24px] border border-[#f0c4d0]/30 p-5 shadow-sm">
              <span className="text-[9px] tracking-[2px] uppercase text-[#d4849a] font-bold block mb-4">Catégories existantes</span>
              {dbCategories.length === 0 ? (
                // Mock categories if db is empty or migration required
                <div className="divide-y divide-[#fdf0f3]">
                  {[
                    { id: '1', name: 'Bagues', slug: 'bagues', display_order: 1 },
                    { id: '2', name: 'Colliers', slug: 'colliers', display_order: 2 },
                    { id: '3', name: 'Bracelets', slug: 'bracelets', display_order: 3 },
                    { id: '4', name: 'Boucles d\'oreilles', slug: 'boucles', display_order: 4 },
                  ].map(mockCat => (
                    <div key={mockCat.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs font-semibold text-[#1e1424]">{mockCat.name}</p>
                          <p className="text-[9px] text-[#9b6b7f]">Slug: {mockCat.slug} • Ordre: {mockCat.display_order}</p>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-[1px] text-[#9b6b7f] bg-[#f5e4ea] px-2 py-0.5 rounded-full font-medium">Standard</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-[#fdf0f3]">
                  {dbCategories.map(cat => (
                    <div key={cat.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs font-semibold text-[#1e1424]">{cat.name}</p>
                          <p className="text-[9px] text-[#9b6b7f]">Slug: {cat.slug} • Ordre: {cat.display_order}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-[9px] uppercase tracking-[1px] text-red-500 font-bold hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
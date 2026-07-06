'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'
import ProductList from '@/components/admin/ProductList'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  AlertCircle, 
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
  Loader2,
  Calendar,
  Eye,
  LogOut,
  TrendingUp,
  Sliders,
  DollarSign
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

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.08)', icon: Clock },
  confirmed: { label: 'Confirmée', color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: CheckCircle },
  shipped: { label: 'Expédiée', color: '#2563eb', bg: 'rgba(37,99,235,0.08)', icon: Truck },
  cancelled: { label: 'Annulée', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: XCircle },
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [views, setViews] = useState<PageView[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [tab, setTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const router = useRouter()

  // Expanded order row
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'cancelled'>('all')

  // Error state for missing tables
  const [migrationError, setMigrationError] = useState(false)

  useEffect(() => {
    checkAuth()
    loadAllData()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin')
  }

  async function loadAllData() {
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
      
      // If table doesn't exist, this will trigger the migration error visual helper
      if (oErr && oErr.code === 'PGRST116') {
        console.warn('Orders table not loaded')
      } else if (oErr) {
        throw oErr
      }
      if (ordersData) setOrders(ordersData)

      // 3. Fetch page views
      const { data: viewsData, error: vErr } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (vErr && vErr.code === 'PGRST116') {
        console.warn('Page views table not loaded')
      } else if (vErr) {
        throw vErr
      }
      if (viewsData) setViews(viewsData)

    } catch (err: any) {
      console.error('Database loading error:', err)
      // Check if the error is due to missing tables
      if (err.message?.includes('public.orders') || err.message?.includes('public.page_views') || err.code === '42P01') {
        setMigrationError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      
      if (error) throw error
      
      // Update local state instantly
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

  // --- STATS COMPUTATIONS ---
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const confirmedOrders = orders.filter(o => o.status === 'confirmed')
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_price), 0)

  // Unique Visitors
  const uniqueSessions = new Set(views.map(v => v.session_id))
  const uniqueVisitorsCount = uniqueSessions.size

  // Group views by path
  const viewsByPath: Record<string, number> = {}
  views.forEach(v => {
    viewsByPath[v.page_path] = (viewsByPath[v.page_path] || 0) + 1
  })
  const sortedPaths = Object.entries(viewsByPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Filtered Orders list
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer_phone.includes(orderSearch) ||
      order.id.substring(0, 8).toLowerCase().includes(orderSearch.toLowerCase())
    
    const matchesStatus = orderFilter === 'all' || order.status === orderFilter
    return matchesSearch && matchesStatus
  })

  // --- CHART DATA GENERATION (LAST 7 DAYS) ---
  const getChartData = () => {
    const dataMap: Record<string, { date: string; orders: number; revenue: number; views: number }> = {}
    const dates = []
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      const key = d.toISOString().split('T')[0]
      dataMap[key] = { date: dateStr, orders: 0, revenue: 0, views: 0 }
      dates.push({ key, dateStr })
    }

    // Populate orders & revenue
    orders.forEach(o => {
      const key = o.created_at.split('T')[0]
      if (dataMap[key]) {
        dataMap[key].orders += 1
        if (o.status !== 'cancelled') {
          dataMap[key].revenue += Number(o.total_price)
        }
      }
    })

    // Populate page views
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

  // Calculate max values for chart scaling
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000)
  const maxViews = Math.max(...chartData.map(d => d.views), 10)

  return (
    <div style={{ background: '#f7f2ec', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <div style={{
        background: 'linear-gradient(160deg, #2f2723 0%, #1a120e 100%)',
        padding: '52px 24px 28px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(200,162,123,0.08)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-block', padding: '5px 12px', background: 'rgba(200,162,123,0.2)', borderRadius: '999px', fontSize: '8px', letterSpacing: '2px', color: '#e5c5a4', border: '1px solid rgba(200,162,123,0.3)', marginBottom: '12px' }}>
              ✦ TABLEAU DE BORD EXCLUSIF
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: 'white', lineHeight: 1, letterSpacing: '2px' }}>LILOOK</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', letterSpacing: '1px' }}>Espace Propriétaire</p>
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
            { label: 'Attente', value: pendingOrders.length, color: '#e5c5a4' },
            { label: 'Produits', value: products.length, color: '#fff' },
            { label: 'Visiteurs', value: uniqueVisitorsCount, color: '#fff' },
            { label: 'Chiffre (MAD)', value: totalRevenue.toLocaleString('fr-MA'), color: '#c8a27b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '14px 12px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 500, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '5px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MIGRATION ASSISTANCE HELPER PANEL */}
      {migrationError && (
        <div className="mx-6 mt-6 bg-[#88292F]/5 border border-[#88292F]/15 rounded-[24px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs tracking-[1px] uppercase font-bold text-[#88292F] flex items-center gap-2">
              <AlertCircle size={14} /> Migration de Base de Données requise
            </h3>
            <p className="text-[12px] text-[#8e7f74] leading-relaxed max-w-[650px]">
              Les tables <code>orders</code> (commandes) et <code>page_views</code> (statistiques de visite) ne sont pas encore créées dans votre instance Supabase. Veuillez exécuter le contenu du fichier <code>supabase_migration.sql</code> dans l&apos;éditeur SQL de votre tableau de bord Supabase pour les activer.
            </p>
          </div>
          <button 
            onClick={loadAllData} 
            className="px-4 py-2 bg-[#88292F] text-white rounded-xl text-[11px] uppercase tracking-[1px] font-medium hover:bg-[#88292F]/95 transition-all self-stretch md:self-auto text-center"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* STICKY TAB NAVIGATOR */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,162,123,0.15)', position: 'sticky', top: 0, zIndex: 50 }}>
        {([
          { key: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
          { key: 'orders', label: `Commandes (${orders.length})`, icon: ShoppingCart },
          { key: 'products', label: `Produits (${products.length})`, icon: Package },
        ] as const).map(t => (
          <button 
            key={t.key} 
            onClick={() => setTab(t.key)} 
            style={{
              flex: 1, padding: '14px 8px',
              background: 'none', border: 'none',
              borderBottom: tab === t.key ? '2px solid #c8a27b' : '2px solid transparent',
              color: tab === t.key ? '#c8a27b' : '#8e7f74',
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
          <div className="space-y-6 max-w-[1000px] mx-auto">

            {/* Quick add product */}
            <button
              onClick={() => { setEditProduct(undefined); setShowForm(true) }}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #2f2723, #1a120e)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontSize: '12px', letterSpacing: '2px', cursor: 'pointer',
                textTransform: 'uppercase', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 15px rgba(47,39,35,0.1)'
              }}
            >
              <span>+</span> Ajouter une pièce
            </button>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart A: Revenue last 7 days */}
              <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-[#c8a27b]" />
                    <span className="text-[10px] tracking-[2px] uppercase text-[#2f2723] font-bold">Chiffre des Ventes</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#c8a27b]">7 derniers jours</span>
                </div>

                {/* SVG Visual Revenue bar chart */}
                <div className="h-44 flex items-end justify-between pt-6 px-2 gap-2">
                  {chartData.map((d, i) => {
                    const pct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Hover values tooltip */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2f2723] text-white text-[9px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          {d.revenue.toLocaleString()} MAD
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-full bg-[#c8a27b]/20 hover:bg-[#c8a27b] transition-all rounded-t-lg"
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                        {/* Day label */}
                        <span className="text-[8px] text-[#8e7f74] mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                          {d.date}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chart B: Traffic Statistics */}
              <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-[#c8a27b]" />
                    <span className="text-[10px] tracking-[2px] uppercase text-[#2f2723] font-bold">Visites (Pages vues)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8e7f74]">Activité récente</span>
                </div>

                {/* SVG line / area representation for page views */}
                <div className="h-44 flex items-end justify-between pt-6 px-2 gap-2">
                  {chartData.map((d, i) => {
                    const pct = maxViews > 0 ? (d.views / maxViews) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Hover values tooltip */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2f2723] text-white text-[9px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          {d.views} pages
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-full bg-[#8e7f74]/20 hover:bg-[#8e7f74] transition-all rounded-t-lg"
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                        {/* Day label */}
                        <span className="text-[8px] text-[#8e7f74] mt-2 w-full text-center truncate">
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
              
              {/* Left: Top visited pages (7 cols) */}
              <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-5 shadow-sm md:col-span-7">
                <span className="text-[9px] tracking-[2px] uppercase text-[#c8a27b] font-bold block mb-4">Pages les plus vues</span>
                
                {sortedPaths.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#8e7f74]">Aucune donnée de visite disponible</div>
                ) : (
                  <div className="space-y-3">
                    {sortedPaths.map(([path, count], idx) => (
                      <div key={path} className="flex items-center justify-between text-xs pb-2 border-b border-[#f7f2ec]">
                        <span className="font-mono text-[#8e7f74] truncate max-w-[240px]">
                          {idx + 1}. {path === '/' ? '/ (Accueil)' : path}
                        </span>
                        <span className="font-semibold text-[#2f2723]">{count} vue{count > 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Category inventory split (5 cols) */}
              <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-5 shadow-sm md:col-span-5">
                <span className="text-[9px] tracking-[2px] uppercase text-[#c8a27b] font-bold block mb-4">Stocks par catégorie</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {['bagues', 'colliers', 'bracelets', 'boucles', 'traditionnel', 'pendentifs', 'ensembles', 'autres'].map(cat => {
                    const count = products.filter(p => p.category === cat).length
                    return (
                      <div key={cat} className="bg-[#f7f2ec]/60 border border-[#e5c5a4]/10 rounded-xl p-3 flex justify-between items-center text-xs">
                        <span className="capitalize text-[#8e7f74]">{cat}</span>
                        <span className="font-cormorant text-md font-semibold text-[#2f2723]">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. ORDERS TAB (VÉRIFIER LES COMMANDES) */}
        {tab === 'orders' && (
          <div className="space-y-4 max-w-[800px] mx-auto">
            
            {/* Search & Filter bar */}
            <div className="bg-white rounded-2xl border border-[#e5c5a4]/15 p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="text"
                  placeholder="Rechercher par nom, tél ou #ID..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-all"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7f74]" />
              </div>
              <div className="flex gap-2">
                <select
                  value={orderFilter}
                  onChange={e => setOrderFilter(e.target.value as any)}
                  className="bg-white border border-[#e5c5a4]/30 rounded-xl px-3 py-2 text-xs text-[#2f2723] font-inter outline-none cursor-pointer"
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
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#e5c5a4]/10 flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart size={20} className="text-[#c8a27b]" />
                </div>
                <h3 className="font-cormorant text-xl text-[#2f2723] mb-1">Aucune commande</h3>
                <p className="text-xs text-[#8e7f74]">Aucune commande ne correspond à votre recherche ou filtre.</p>
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
                      className="bg-white rounded-[24px] border border-[#e5c5a4]/15 shadow-sm overflow-hidden transition-all duration-300"
                    >
                      {/* Top Header Row (always visible) */}
                      <div 
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[11px] font-semibold text-[#8e7f74]">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </span>
                            <div 
                              className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-[0.5px] font-semibold"
                              style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}15` }}
                            >
                              {status.label}
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-[#2f2723]">
                            {order.customer_name} • <span className="font-normal text-[#8e7f74]">{order.customer_phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-[#8e7f74] uppercase block">Montant</span>
                            <span className="font-cormorant text-md font-bold text-[#c8a27b]">{formatPrice(order.total_price)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#bbb]">{formattedDate}</span>
                            {isExpanded ? <ChevronUp size={16} className="text-[#8e7f74]" /> : <ChevronDown size={16} className="text-[#8e7f74]" />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details container */}
                      {isExpanded && (
                        <div className="border-t border-[#f7f2ec] bg-[#f7f2ec]/20 p-5 space-y-4">
                          
                          {/* Shipping coordinates */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 text-xs">
                              <span className="text-[8px] tracking-[1.5px] uppercase text-[#c8a27b] font-bold block mb-1">Coordonnées client</span>
                              <p className="flex items-center gap-2 text-[#2f2723] font-medium">
                                <span className="w-4 flex justify-center text-[#c8a27b]">👤</span> {order.customer_name}
                              </p>
                              <p className="flex items-center gap-2 text-[#8e7f74]">
                                <span className="w-4 flex justify-center text-[#c8a27b]">📞</span>
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
                              <span className="text-[8px] tracking-[1.5px] uppercase text-[#c8a27b] font-bold block mb-1">Adresse de livraison</span>
                              <p className="flex items-start gap-2 text-[#2f2723]">
                                <MapPin size={12} className="text-[#c8a27b] mt-0.5 flex-shrink-0" />
                                <span>
                                  {order.customer_address}
                                  {order.customer_apartment && `, Apt/Suite: ${order.customer_apartment}`}
                                  <br />
                                  {order.customer_city} {order.customer_zip || ''}, {order.customer_country}
                                  {order.customer_company && <span className="block text-[10px] text-[#8e7f74] mt-0.5">🏢 Entreprise: {order.customer_company}</span>}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Ordered items list */}
                          <div className="bg-white rounded-2xl border border-[#e5c5a4]/10 p-4 space-y-3.5">
                            <span className="text-[8px] tracking-[1.5px] uppercase text-[#c8a27b] font-bold block">Détail des pièces</span>
                            
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#efe3d7] flex-shrink-0">
                                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                  </div>
                                  <div>
                                    <p className="text-[#2f2723] font-semibold">{item.title}</p>
                                    <p className="text-[10px] text-[#8e7f74]">{item.quantity} × {formatPrice(item.price)}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-[#2f2723]">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-[#f7f2ec]">
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
                              className="px-4 py-2 bg-[#2f2723] text-white rounded-xl text-[10px] uppercase tracking-[1px] font-medium hover:bg-[#c8a27b] transition-colors flex items-center gap-1.5"
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
          <div className="max-w-[800px] mx-auto">
            <button
              onClick={() => { setEditProduct(undefined); setShowForm(true) }}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #2f2723, #1a120e)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontSize: '12px', letterSpacing: '2px', cursor: 'pointer',
                textTransform: 'uppercase', fontWeight: 500,
                marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <span>+</span> Ajouter une pièce
            </button>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#c8a27b' }}>Aucun produit</p>
                <p style={{ fontSize: '12px', color: '#8e7f74', marginTop: '8px' }}>Commencez par ajouter votre première pièce</p>
              </div>
            ) : (
              <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
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
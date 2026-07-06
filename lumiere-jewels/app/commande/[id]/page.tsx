'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Package, MapPin, Phone, User, Calendar, Hash } from 'lucide-react'
import { createClient } from '@/lib/supabase'
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
  status: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  confirmed: { label: 'Confirmée', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  shipped: { label: 'Expédiée', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  cancelled: { label: 'Annulée', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single()
        if (data) setOrder(data)
      } catch (err) {
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2ec] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c8a27b] animate-spin" />
        <p className="mt-4 text-xs text-[#8e7f74] tracking-[1px] uppercase">Chargement...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f2ec] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#e5c5a4]/10 flex items-center justify-center mb-4">
          <Package size={28} className="text-[#c8a27b]" />
        </div>
        <h1
          className="font-cormorant text-3xl font-medium text-[#2f2723] mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Commande introuvable
        </h1>
        <p className="text-xs text-[#8e7f74] mb-8 max-w-[280px]">
          Cette commande n&apos;existe pas ou a été supprimée.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-[#2f2723] text-white rounded-full text-[11px] tracking-[2px] uppercase hover:bg-[#c8a27b] transition-all"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    )
  }

  const status = STATUS_MAP[order.status] || STATUS_MAP.pending
  const orderDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="h-16" />

      <div className="max-w-[600px] mx-auto px-5 py-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[12px] text-[#8e7f74] hover:text-[#2f2723] transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Retour
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: status.bg, border: `1px solid ${status.color}20` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: status.color }} />
            <span className="text-[10px] tracking-[1px] uppercase font-semibold" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
          <h1
            className="font-cormorant text-[2.2rem] font-medium text-[#2f2723] leading-none mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Commande #{order.id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-[11px] text-[#8e7f74]">{orderDate}</p>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-5 mb-4 shadow-sm">
          <span className="text-[9px] tracking-[3px] text-[#c8a27b] uppercase block mb-4">Informations client</span>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={14} className="text-[#c8a27b] flex-shrink-0" />
              <span className="text-[13px] text-[#2f2723] font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-[#c8a27b] flex-shrink-0" />
              <span className="text-[13px] text-[#2f2723]">{order.customer_phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={14} className="text-[#c8a27b] flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#2f2723] leading-relaxed">
                <p>{order.customer_address}</p>
                {order.customer_apartment && <p>{order.customer_apartment}</p>}
                <p>{order.customer_city}{order.customer_zip ? `, ${order.customer_zip}` : ''}</p>
                <p>{order.customer_country}</p>
              </div>
            </div>
            {order.customer_company && (
              <div className="flex items-center gap-3">
                <Hash size={14} className="text-[#c8a27b] flex-shrink-0" />
                <span className="text-[13px] text-[#8e7f74]">{order.customer_company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-[24px] border border-[#e5c5a4]/15 p-5 mb-4 shadow-sm">
          <span className="text-[9px] tracking-[3px] text-[#c8a27b] uppercase block mb-4">Articles commandés</span>
          
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#efe3d7] flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] text-[#c8a27b] tracking-[1.5px] uppercase">{item.category}</p>
                  <p className="text-[13px] text-[#2f2723] font-medium truncate">{item.title}</p>
                  <p className="text-[11px] text-[#8e7f74]">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="text-[13px] text-[#2f2723] font-semibold whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-[#f0ebe5] mt-4 pt-4 flex justify-between items-center">
            <span className="text-[12px] text-[#2f2723] font-semibold uppercase tracking-[1px]">Total</span>
            <span className="font-cormorant text-2xl font-bold text-[#c8a27b]">{formatPrice(order.total_price)}</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#bbb] mt-6 leading-relaxed">
          Cette page est un récapitulatif de commande LILOOK.<br />
          Pour toute question, contactez-nous sur WhatsApp.
        </p>
      </div>

      <div className="h-24 md:h-0" />
    </div>
  )
}

'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Phone, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { WHATSAPP_NUMBER, SITE_URL } from '@/lib/constants'

type Order = {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_zip: string | null
  customer_country: string
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
    image: string | null
    category: string
  }>
  total_price: number
  status: string
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    async function fetchOrder() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (data) {
          setOrder(data)
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2ec] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c8a27b] animate-spin" />
        <p className="mt-4 font-inter text-xs tracking-[1px] text-[#8e7f74] uppercase">Chargement de votre commande...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f2ec] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-cormorant text-3xl font-medium text-[#2f2723] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Commande introuvable
        </h1>
        <p className="text-xs text-[#8e7f74] mb-8 font-inter max-w-[280px]">
          Nous n&apos;avons pas pu récupérer les informations de votre commande.
        </p>
        <button
          onClick={() => router.push('/catalogue')}
          className="px-6 py-3 bg-[#2f2723] text-white rounded-full text-[11px] tracking-[2px] uppercase hover:bg-[#c8a27b] transition-all"
        >
          Retour à la boutique
        </button>
      </div>
    )
  }

  // Format WhatsApp confirmation text
  const articleList = order.items
    .map(item => `  • ${item.quantity}x ${item.title} (${formatPrice(item.price)})`)
    .join('\n')
  
  const rawMsg = `Bonjour! Je viens de passer une commande sur votre site LILOOK.
Référence: #${order.id.substring(0, 8).toUpperCase()}
Nom complet: ${order.customer_name}
Téléphone: ${order.customer_phone}
Adresse: ${order.customer_address}, ${order.customer_city}
Articles:
${articleList}
Total: ${formatPrice(order.total_price)}

🔗 Suivi de ma commande: ${SITE_URL}/commande/${order.id}

Merci de confirmer ma commande.`

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(rawMsg)}`

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter pb-20">
      <div className="h-16" />

      <div className="max-w-[500px] mx-auto px-5 pt-8">
        
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <CheckCircle2 size={32} strokeWidth={1.5} />
          </div>
          <span className="text-[10px] tracking-[4px] text-[#c8a27b] uppercase block mb-1">merci pour votre confiance</span>
          <h1 className="font-cormorant text-[2.4rem] font-medium text-[#2f2723] leading-none mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Commande Reçue !
          </h1>
          <p className="text-[12px] text-[#8e7f74] max-w-[340px] mx-auto leading-relaxed">
            Votre commande a été enregistrée. Pour accélérer sa préparation, veuillez cliquer ci-dessous pour confirmer sur WhatsApp.
          </p>
        </div>

        {/* Action Button: WhatsApp */}
        <div className="mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-full text-[12px] tracking-[2px] uppercase font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Phone size={16} fill="white" className="stroke-none" />
            Confirmer sur WhatsApp
          </a>
        </div>

        {/* Order Details box */}
        <div className="bg-white rounded-[24px] border border-[#e5c5a4]/20 p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#f7f2ec] flex justify-between items-center">
            <span className="text-[11px] text-[#8e7f74] uppercase tracking-[1px]">Référence</span>
            <span className="text-xs text-[#2f2723] font-medium">#{order.id.substring(0, 8).toUpperCase()}</span>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <span className="text-[9px] tracking-[2px] uppercase text-[#c8a27b] block">Articles commandés</span>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#efe3d7] flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#2f2723] font-medium truncate">{item.title}</p>
                    <p className="text-[10px] text-[#8e7f74]">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                </div>
                <span className="text-[#2f2723] font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#f7f2ec] pt-4 flex justify-between items-center">
            <span className="text-xs font-semibold text-[#2f2723]">Total de la commande</span>
            <span className="font-cormorant text-xl font-bold text-[#c8a27b]">{formatPrice(order.total_price)}</span>
          </div>

          {/* Shipping Details */}
          <div className="border-t border-[#f7f2ec] pt-4 space-y-2">
            <span className="text-[9px] tracking-[2px] uppercase text-[#c8a27b] block">Adresse de livraison</span>
            <div className="text-xs text-[#8e7f74] leading-relaxed space-y-1">
              <p className="text-[#2f2723] font-medium">{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              <p>{order.customer_address}</p>
              <p>{order.customer_city}, {order.customer_zip || ''}</p>
              <p>{order.customer_country}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-[11px] text-[#8e7f74]">
            Un conseiller commercial de LILOOK vous contactera par téléphone ou message très prochainement pour valider les détails d&apos;expédition.
          </p>
          <button
            onClick={() => router.push('/catalogue')}
            className="inline-flex items-center gap-2 text-xs text-[#2f2723] hover:text-[#c8a27b] font-medium transition-colors pt-4"
          >
            <ArrowLeft size={14} /> Retour à la boutique
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c8a27b] animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}

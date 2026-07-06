'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronUp, ShoppingBag, Loader2, MapPin, User, Phone, Building2, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { COUNTRIES, WHATSAPP_NUMBER, SITE_URL } from '@/lib/constants'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, cartCount, clearCart, isReady } = useCart()
  const [summaryOpen, setSummaryOpen] = useState(false)

  // Form state
  const [country, setCountry] = useState('Maroc')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect to home if cart is empty
  useEffect(() => {
    if (isReady && cart.length === 0) {
      router.push('/')
    }
  }, [isReady, cart.length, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!firstName || !lastName || !phone || !address || !city) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const orderPayload = {
        customer_name: `${firstName} ${lastName}`,
        customer_phone: phone,
        customer_address: address,
        customer_apartment: apartment || null,
        customer_city: city,
        customer_zip: zipCode || null,
        customer_country: country,
        customer_company: company || null,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        total_price: cartTotal,
        status: 'pending'
      }

      const { data, error: insertError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .single()

      if (insertError) throw insertError

      // Build WhatsApp message with shareable link
      const orderId = data.id
      const orderRef = orderId.substring(0, 8).toUpperCase()
      const orderLink = `${SITE_URL}/commande/${orderId}`
      const articleList = cart
        .map(item => `  • ${item.quantity}x ${item.title} — ${formatPrice(item.price)}`)
        .join('\n')

      const waMessage = `🛍 *Nouvelle commande LILOOK*\n\n` +
        `📋 *Réf:* #${orderRef}\n` +
        `👤 *Client:* ${firstName} ${lastName}\n` +
        `📞 *Tél:* ${phone}\n` +
        `📍 *Adresse:* ${address}${apartment ? ', ' + apartment : ''}, ${city} ${zipCode || ''}, ${country}\n` +
        `${company ? '🏢 *Entreprise:* ' + company + '\n' : ''}` +
        `\n📦 *Articles:*\n${articleList}\n\n` +
        `💰 *Total:* ${formatPrice(cartTotal)}\n\n` +
        `🔗 *Détails:* ${orderLink}`

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`

      // Clear cart and redirect
      clearCart()
      
      // Open WhatsApp in new tab
      window.open(waUrl, '_blank')
      
      // Navigate to confirmation page
      router.push(`/commande-confirmee?id=${orderId}`)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#c8a27b] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Spacer for navbar */}
      <div className="h-16" />

      <div className="max-w-[960px] mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[12px] text-[#8e7f74] hover:text-[#2f2723] transition-colors mb-6 md:mb-10"
        >
          <ArrowLeft size={14} />
          Retour au panier
        </button>

        {/* Page title */}
        <div className="mb-8 md:mb-12">
          <span className="text-[9px] tracking-[4px] text-[#c8a27b] uppercase block mb-2">paiement à la livraison</span>
          <h1
            className="font-cormorant text-[2.2rem] md:text-[3rem] font-medium text-[#2f2723] leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Finaliser Votre<br />Commande
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

          {/* ===== LEFT: FORM ===== */}
          <form onSubmit={handleSubmit} className="flex-1 order-2 lg:order-1">

            {error && (
              <div className="mb-6 bg-[#88292F]/5 border border-[#88292F]/15 rounded-2xl px-4 py-3">
                <p className="text-xs text-[#88292F] text-center">{error}</p>
              </div>
            )}

            {/* ── Section: Livraison ── */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#c8a27b]/10 flex items-center justify-center">
                  <MapPin size={13} className="text-[#c8a27b]" />
                </div>
                <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase font-inter">Adresse de livraison</span>
              </div>

              {/* Country dropdown */}
              <div className="mb-3">
                <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                  Pays / Région *
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all cursor-pointer"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e7f74] pointer-events-none" />
                </div>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Sarah"
                    className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="El Alami"
                    className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                  />
                </div>
              </div>

              {/* Company (optional) */}
              <div className="mb-3">
                <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                  Entreprise <span className="normal-case tracking-normal text-[#bbb]">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Nom de votre entreprise"
                  className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                  Adresse *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Numéro et nom de rue"
                  className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                />
              </div>

              {/* Apartment (optional) */}
              <div className="mb-3">
                <input
                  type="text"
                  value={apartment}
                  onChange={e => setApartment(e.target.value)}
                  placeholder="Appartement, suite, etc. (optionnel)"
                  className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                />
              </div>

              {/* City / Zip row */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Casablanca"
                    className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                    placeholder="20000"
                    className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl px-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                  />
                </div>
              </div>
            </div>

            {/* ── Section: Contact ── */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#c8a27b]/10 flex items-center justify-center">
                  <Phone size={13} className="text-[#c8a27b]" />
                </div>
                <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase font-inter">Coordonnées</span>
              </div>

              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                  Téléphone *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[#8e7f74] border-r border-[#e5c5a4]/30 pr-3 font-inter">
                    +212
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="6 12 34 56 78"
                    className="w-full bg-white border border-[#e5c5a4]/30 rounded-xl pl-[4.5rem] pr-4 py-3 text-[13px] text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] focus:ring-1 focus:ring-[#c8a27b]/20 transition-all placeholder:text-[#ccc]"
                  />
                </div>
              </div>
            </div>

            {/* ── Info Banner ── */}
            <div className="bg-[#2f2723]/[0.03] border border-[#e5c5a4]/15 rounded-2xl p-4 mb-8 flex items-start gap-3">
              <Package size={16} className="text-[#c8a27b] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-[#2f2723] font-medium mb-0.5">Paiement à la livraison</p>
                <p className="text-[10px] text-[#8e7f74] leading-relaxed">
                  Livraison gratuite partout au Maroc. Vous payez uniquement à la réception de votre colis.
                </p>
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-gradient-to-r from-[#2f2723] to-[#1a120e] hover:from-[#c8a27b] hover:to-[#a88a5b] text-white py-4 rounded-full font-inter text-[12px] tracking-[2px] uppercase transition-all duration-500 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Validation en cours...
                </>
              ) : (
                <>
                  Finaliser la Commande
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>

            <p className="text-[10px] text-[#bbb] text-center mt-3">
              En confirmant, vous serez redirigé vers WhatsApp pour valider votre commande avec notre équipe.
            </p>
          </form>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <div className="lg:w-[380px] order-1 lg:order-2">
            {/* Mobile toggle */}
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="w-full flex items-center justify-between bg-white/70 backdrop-blur-sm border border-[#e5c5a4]/20 rounded-2xl px-5 py-4 lg:hidden mb-4"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-[#c8a27b]" />
                <span className="text-[12px] text-[#2f2723] font-medium">
                  {summaryOpen ? 'Masquer' : 'Afficher'} le récapitulatif ({cartCount} article{cartCount !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-cormorant text-lg font-bold text-[#c8a27b]">{formatPrice(cartTotal)}</span>
                {summaryOpen ? <ChevronUp size={16} className="text-[#8e7f74]" /> : <ChevronDown size={16} className="text-[#8e7f74]" />}
              </div>
            </button>

            {/* Summary content */}
            <div className={`bg-white/70 backdrop-blur-sm border border-[#e5c5a4]/15 rounded-[24px] overflow-hidden shadow-sm ${
              summaryOpen ? 'block' : 'hidden lg:block'
            }`}>
              {/* Header */}
              <div className="px-5 pt-5 pb-3 border-b border-[#f0ebe5]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-[#c8a27b]" />
                  <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase font-inter">Votre panier</span>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#efe3d7] flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
                      )}
                      {/* Quantity badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2f2723] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <span className="text-[8px] text-[#c8a27b] tracking-[1.5px] uppercase font-inter">{item.category}</span>
                      <p className="text-[12px] text-[#2f2723] font-medium truncate">{item.title}</p>
                    </div>
                    <span className="text-[12px] text-[#2f2723] font-medium self-center whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 pb-5 pt-3 border-t border-[#f0ebe5] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#8e7f74]">Sous-total</span>
                  <span className="text-[12px] text-[#2f2723] font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#8e7f74]">Livraison</span>
                  <span className="text-[11px] text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="border-t border-[#f0ebe5] pt-3 flex justify-between items-center">
                  <span className="text-[12px] text-[#2f2723] font-semibold uppercase tracking-[1px]">Total</span>
                  <span className="font-cormorant text-xl font-bold text-[#c8a27b]">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mt-4">
              {[
                { icon: '🔒', text: 'Paiement sécurisé' },
                { icon: '🚚', text: 'Livraison gratuite' },
                { icon: '📞', text: 'Support WhatsApp' },
                { icon: '✨', text: 'Qualité garantie' },
              ].map(badge => (
                <div key={badge.text} className="bg-white/50 border border-[#e5c5a4]/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <span className="text-sm">{badge.icon}</span>
                  <span className="text-[10px] text-[#8e7f74] font-inter">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-24 md:h-0" />
    </div>
  )
}

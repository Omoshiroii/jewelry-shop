'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, CreditCard, Phone, MapPin, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Maroc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!lastName || !firstName || !phone || !address || !city) {
      setError('Veuillez remplir tous les champs obligatoires (*)')
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
        customer_city: city,
        customer_zip: zipCode || null,
        customer_country: country,
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

      if (insertError) {
        throw insertError
      }

      // Success
      clearCart()
      onClose()
      router.push(`/commande-confirmee?id=${data.id}`)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError('Une erreur est survenue lors de la validation. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#2f2723]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-white/95 w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(47,39,35,0.25)] border border-[#e5c5a4]/30 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#f7f2ec] flex items-center justify-between">
          <div>
            <span className="text-[9px] tracking-[3px] text-[#c8a27b] uppercase font-inter block mb-1">finalisation</span>
            <h2 className="font-cormorant text-2xl font-medium text-[#2f2723]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Valider Votre Commande
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f7f2ec] hover:bg-[#c8a27b]/20 transition-colors"
          >
            <X size={16} className="text-[#2f2723]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCheckout} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
          
          {/* Order Summary banner */}
          <div className="bg-[#f7f2ec] rounded-2xl p-4 flex items-center justify-between border border-[#e5c5a4]/20">
            <span className="text-xs text-[#8e7f74] font-inter">Total à payer à la livraison</span>
            <span className="font-cormorant text-lg font-bold text-[#c8a27b]">
              {cartTotal.toLocaleString('fr-MA')} MAD
            </span>
          </div>

          {error && (
            <p className="text-xs text-[#88292F] text-center bg-[#88292F]/5 py-2 rounded-xl border border-[#88292F]/10">
              {error}
            </p>
          )}

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                Prénom *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Sarah"
                  className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl pl-4 pr-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
                />
              </div>
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
                placeholder="El alami"
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
              Téléphone *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#8e7f74] border-r border-[#e5c5a4]/30 pr-2">
                +212
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="6 12 34 56 78"
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl pl-16 pr-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
              Adresse complète *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Numéro, Rue, Quartier, Appartement..."
              className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors resize-none"
            />
          </div>

          {/* City / Zip */}
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                Code Postal
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                placeholder="20000"
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
              Pays
            </label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="Maroc"
              className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full mt-4 bg-gradient-to-r from-[#2f2723] to-[#1a120e] hover:from-[#c8a27b] hover:to-[#a88a5b] text-white py-3.5 rounded-full font-inter text-xs tracking-[2px] uppercase transition-all duration-500 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Validation en cours...' : 'Confirmer ma Commande'}
          </button>
        </form>
      </div>
    </div>
  )
}

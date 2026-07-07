'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'El Jadida', 'Nador', 'Béni Mellal',
  'Mohammedia', 'Khouribga', 'Settat', 'Khémisset', 'Laâyoune', 'Berrechid',
  'Taza', 'Larache', 'Salé', 'Temara', 'Inezgane', 'Berkane', 'Guelmim',
  'Al Hoceïma', 'Dakhla', 'Ifrane', 'Essaouira', 'Ouarzazate', 'Errachidia',
]

const COUNTRY_CODES = [
  { code: '+212', country: 'MA', flag: '🇲🇦' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+213', country: 'DZ', flag: '🇩🇿' },
  { code: '+216', country: 'TN', flag: '🇹🇳' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
]

export default function CheckoutModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [countryCode, setCountryCode] = useState('+212')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [cityInput, setCityInput] = useState('')
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [country, setCountry] = useState('Maroc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCodePicker, setShowCodePicker] = useState(false)

  if (!isOpen) return null

  function handleCityInput(val: string) {
    setCityInput(val)
    setCity(val)
    if (val.length > 0) {
      const suggestions = MOROCCAN_CITIES.filter(c =>
        c.toLowerCase().startsWith(val.toLowerCase())
      ).slice(0, 5)
      setCitySuggestions(suggestions)
      setShowCitySuggestions(suggestions.length > 0)
    } else {
      setCitySuggestions([])
      setShowCitySuggestions(false)
    }
  }

  function selectCity(c: string) {
    setCity(c)
    setCityInput(c)
    setCitySuggestions([])
    setShowCitySuggestions(false)
  }

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
        customer_phone: `${countryCode} ${phone}`,
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
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Sarah"
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl pl-4 pr-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
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
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
              />
            </div>
          </div>

          {/* Phone with country code */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
              Téléphone *
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCodePicker(!showCodePicker)}
                  className="flex items-center gap-1.5 bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-3 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors whitespace-nowrap"
                >
                  <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
                  <span>{countryCode}</span>
                  <ChevronDown size={12} className="text-[#8e7f74]" />
                </button>
                {showCodePicker && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#e5c5a4]/30 z-10 max-h-48 overflow-y-auto hide-scrollbar">
                    {COUNTRY_CODES.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setCountryCode(c.code); setShowCodePicker(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#2f2723] hover:bg-[#f7f2ec] transition-colors"
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                        <span className="text-[#8e7f74]">{c.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="6 12 34 56 78"
                className="flex-1 bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
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

          {/* City with autocomplete / Zip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-[10px] tracking-[2px] uppercase text-[#8e7f74] font-inter mb-1.5">
                Ville *
              </label>
              <input
                type="text"
                required
                value={cityInput}
                onChange={e => handleCityInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                onFocus={() => cityInput && setCitySuggestions(MOROCCAN_CITIES.filter(c => c.toLowerCase().startsWith(cityInput.toLowerCase())).slice(0, 5))}
                placeholder="Casablanca"
                autoComplete="off"
                className="w-full bg-[#f7f2ec]/50 border border-[#e5c5a4]/30 rounded-xl px-4 py-2.5 text-xs text-[#2f2723] font-inter outline-none focus:border-[#c8a27b] transition-colors"
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-[#e5c5a4]/30 z-10 overflow-hidden">
                  {citySuggestions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => selectCity(s)}
                      className="w-full text-left px-4 py-2 text-xs text-[#2f2723] hover:bg-[#f7f2ec] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
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

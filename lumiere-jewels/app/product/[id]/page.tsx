'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'
import { ArrowLeft, Heart, Share2, ShoppingBag, ChevronDown, ChevronUp, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import CartDrawer from '@/components/CartDrawer'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()

  // Accordion states
  const [openSection, setOpenSection] = useState<'details' | 'care' | 'shipping' | null>('details')

  useEffect(() => {
    async function fetchProductAndRecs() {
      setLoading(true)
      const supabase = createClient()
      
      // Fetch product details
      const { data: prodData } = await supabase.from('products').select('*').eq('id', id).single()
      if (prodData) {
        setProduct(prodData)
        setActiveImg(0)
        
        // Fetch recommendations from same category, excluding current product
        const { data: recData } = await supabase
          .from('products')
          .select('*')
          .eq('category', prodData.category)
          .neq('id', prodData.id)
          .limit(4)
          
        if (recData) {
          setRecommendations(recData)
        }
      }
      setLoading(false)
    }
    
    fetchProductAndRecs()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center">
      <p className="font-cormorant text-2xl text-[#c8a27b]">Produit introuvable</p>
    </div>
  )

  const discounted = hasDiscount(product.discount_percentage)
  const salePrice = getSalePrice(product.original_price, product.discount_percentage)
  const favorited = isFavorite(product.id)

  const toggleSection = (section: 'details' | 'care' | 'shipping') => {
    if (openSection === section) {
      setOpenSection(null)
    } else {
      setOpenSection(section)
    }
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `LILOOK - ${product.title}`,
          text: product.description || '',
          url: window.location.href,
        })
      } catch (err) {
        console.error(err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter pb-24 md:pb-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navbar Offset */}
      <div className="h-16" />

      {/* Main product display container */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6">
        
        {/* Navigation Bar/Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs text-[#8e7f74] hover:text-[#2f2723] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-[#e5c5a4]/30 backdrop-blur-sm transition-all duration-300 ${
                favorited ? 'bg-[#c8a27b]/10 border-[#c8a27b]' : 'bg-white/60 hover:bg-white'
              }`}
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={favorited ? 'text-[#c8a27b] fill-[#c8a27b]' : 'text-[#2f2723]'}
              />
            </button>
            <button 
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5c5a4]/30 bg-white/60 hover:bg-white transition-colors"
            >
              <Share2 size={15} strokeWidth={1.5} className="text-[#2f2723]" />
            </button>
          </div>
        </div>

        {/* Double-column grid for photos & content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: PHOTOS */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary active image showcase */}
            <div className="w-full aspect-square rounded-[32px] overflow-hidden bg-[#efe3d7] border border-[#e5c5a4]/20 shadow-sm relative group">
              {product.images?.[activeImg] ? (
                <img
                  src={product.images[activeImg]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
              )}

              {/* Status Badges */}
              {product.is_trending && (
                <div className="absolute top-4 left-4 bg-[#2f2723]/95 backdrop-blur-md text-white text-[9px] tracking-[2px] px-3.5 py-1.5 rounded-full uppercase font-medium">
                  Tendance
                </div>
              )}
              {discounted && (
                <div className="absolute top-4 right-4 bg-[#c8a27b] text-white text-[10px] tracking-[1px] px-3 py-1.5 rounded-full font-semibold">
                  -{product.discount_percentage}%
                </div>
              )}
            </div>

            {/* Thumbnail Row selector */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-[18px] overflow-hidden border transition-all duration-300 ${
                      i === activeImg ? 'border-[#c8a27b] ring-2 ring-[#c8a27b]/10' : 'border-[#e5c5a4]/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT META / ACCORDIONS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tagline / Category */}
            <div>
              <span className="text-[10px] text-[#c8a27b] tracking-[3px] uppercase font-inter block mb-1">
                {product.category}
              </span>
              <h1
                className="font-cormorant text-[2.5rem] leading-[1.1] font-light text-[#2f2723]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.title}
              </h1>
            </div>

            {/* Price display */}
            <div className="pb-4 border-b border-[#e5c5a4]/15">
              {discounted ? (
                <div className="flex items-baseline gap-3">
                  <span className="font-cormorant text-[2.2rem] text-[#c8a27b] font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {formatPrice(salePrice)}
                  </span>
                  <span className="text-[14px] text-[#bbb] line-through">
                    {formatPrice(product.original_price)}
                  </span>
                </div>
              ) : (
                <span className="font-cormorant text-[2.2rem] text-[#2f2723] font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Quick Benefits Row */}
            <div className="grid grid-cols-3 gap-2 py-1">
              {[
                { icon: ShieldCheck, text: 'Acier 316L' },
                { icon: Sparkles, text: 'Doré 18k' },
                { icon: Truck, text: 'Livraison gratuite' }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/40 border border-[#e5c5a4]/10 rounded-xl px-2.5 py-2">
                  <benefit.icon size={12} className="text-[#c8a27b] flex-shrink-0" />
                  <span className="text-[9px] text-[#8e7f74] font-medium leading-none">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Buy / Cart actions */}
            <div className="hidden lg:block pt-2">
              <button
                onClick={() => {
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: discounted ? salePrice : product.original_price,
                    image: product.images?.[0] || null,
                    category: product.category
                  })
                  setCartOpen(true)
                }}
                className="w-full bg-gradient-to-r from-[#2f2723] to-[#1a120e] hover:from-[#c8a27b] hover:to-[#a88a5b] text-white py-4 rounded-full font-inter text-[11px] tracking-[2px] uppercase transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                Ajouter au Panier
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[13px] leading-[1.8] text-[#8e7f74]">
                {product.description}
              </p>
            )}

            {/* Accordions */}
            <div className="border-t border-[#e5c5a4]/15 divide-y divide-[#e5c5a4]/15">
              
              {/* Accordion 1: Details & Materials */}
              <div className="py-3">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between text-left py-1"
                >
                  <span className="text-[11px] tracking-[1.5px] uppercase font-semibold text-[#2f2723]">Détails & Matériaux</span>
                  {openSection === 'details' ? <ChevronUp size={14} className="text-[#8e7f74]" /> : <ChevronDown size={14} className="text-[#8e7f74]" />}
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${openSection === 'details' ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <ul className="text-[12px] text-[#8e7f74] space-y-2 list-disc pl-4 leading-relaxed">
                    <li>Fabriqué en <strong>acier inoxydable 316L</strong> de qualité supérieure</li>
                    <li>Finition raffinée : dorure à l&apos;or fin 18 carats</li>
                    <li>Résistant à l&apos;eau douce : ne noircit pas, ne décolore pas</li>
                    <li>Hypoallergénique : sans nickel, sans plomb et sans cadmium</li>
                    <li>Taille idéale, finitions polies miroir</li>
                  </ul>
                </div>
              </div>

              {/* Accordion 2: Care advices */}
              <div className="py-3">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full flex items-center justify-between text-left py-1"
                >
                  <span className="text-[11px] tracking-[1.5px] uppercase font-semibold text-[#2f2723]">Conseils d&apos;Entretien</span>
                  {openSection === 'care' ? <ChevronUp size={14} className="text-[#8e7f74]" /> : <ChevronDown size={14} className="text-[#8e7f74]" />}
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${openSection === 'care' ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-[12px] text-[#8e7f74] leading-relaxed">
                    Bien que nos bijoux soient conçus pour résister aux agressions quotidiennes, nous vous conseillons d&apos;éviter le contact prolongé avec des parfums intenses, des cosmétiques gras ou des détergents acides afin de préserver l&apos;éclat de la dorure sur le très long terme.
                  </p>
                </div>
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between text-left py-1"
                >
                  <span className="text-[11px] tracking-[1.5px] uppercase font-semibold text-[#2f2723]">Livraison & Retours</span>
                  {openSection === 'shipping' ? <ChevronUp size={14} className="text-[#8e7f74]" /> : <ChevronDown size={14} className="text-[#8e7f74]" />}
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${openSection === 'shipping' ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <ul className="text-[12px] text-[#8e7f74] space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>Livraison gratuite</strong> partout au Maroc sous 24h à 72h</li>
                    <li>Paiement en espèces sécurisé à la livraison</li>
                    <li>Retours possibles sous 7 jours si le modèle ne vous plaît pas</li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION: SUGGESTIONS / RECOMMENDATIONS DOWN BELOW */}
        {recommendations.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#e5c5a4]/15">
            <div className="text-center mb-10">
              <span className="text-[9px] text-[#c8a27b] tracking-[3px] uppercase block mb-1">sélection suggérée</span>
              <h3 className="font-cormorant text-3xl font-light text-[#2f2723]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Vous Aimerez Aussi
              </h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="w-full">
                  <ProductCard product={rec} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MOBILE BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full px-5 py-4 pb-7 bg-[#f7f2ec]/90 backdrop-blur-xl border-t border-[#e5c5a4]/15 z-40">
        <button
          onClick={() => {
            addToCart({
              id: product.id,
              title: product.title,
              price: discounted ? salePrice : product.original_price,
              image: product.images?.[0] || null,
              category: product.category
            })
            setCartOpen(true)
          }}
          className="w-full bg-gradient-to-r from-[#2f2723] to-[#1a120e] text-white py-3.5 rounded-full font-inter text-[11px] tracking-[2px] uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          Ajouter au Panier
        </button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

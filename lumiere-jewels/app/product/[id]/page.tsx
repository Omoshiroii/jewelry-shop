'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import { ArrowLeft, Heart, Share2 } from 'lucide-react'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) setProduct(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin" />
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

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="h-16" />

      {/* Navigation Bar for Product Page */}
      <div className="fixed top-16 left-0 w-full z-40 px-5 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={1.5} className="text-[#2f2723]" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
              favorited ? 'bg-[#c8a27b]/20' : 'bg-white/70 hover:bg-white'
            }`}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={favorited ? 'text-[#c8a27b] fill-[#c8a27b]' : 'text-[#2f2723]'}
            />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors">
            <Share2 size={18} strokeWidth={1.5} className="text-[#2f2723]" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="pt-4">
        <div className="w-full aspect-square overflow-hidden bg-[#efe3d7] relative">
          {product.images?.[activeImg] ? (
            <img
              src={product.images[activeImg]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
          )}
          {product.is_trending && (
            <div className="absolute top-4 left-4 bg-[#2f2723]/85 backdrop-blur-sm text-white text-[9px] tracking-[2px] px-4 py-2 rounded-full uppercase">
              Tendance
            </div>
          )}
          {discounted && (
            <div className="absolute top-4 right-4 bg-[#c8a27b] text-white text-[11px] px-4 py-2 rounded-full">
              -{product.discount_percentage}%
            </div>
          )}
        </div>

        {/* Thumbnail Row */}
        {product.images?.length > 1 && (
          <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-16 flex-shrink-0 rounded-[14px] overflow-hidden transition-all duration-300 ${
                  i === activeImg ? 'ring-2 ring-[#c8a27b] opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="px-6 pt-4 pb-36">
          <p className="text-[10px] text-[#c8a27b] tracking-[3px] uppercase mb-2">
            {product.category}
          </p>
          <h1
            className="font-cormorant text-[2.4rem] font-medium text-[#2f2723] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.title}
          </h1>

          {/* Price */}
          <div className="mb-5">
            {discounted ? (
              <div className="flex items-center gap-3">
                <span className="font-cormorant text-[2rem] text-[#c8a27b] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatPrice(salePrice)}
                </span>
                <span className="text-[14px] text-[#bbb] line-through">
                  {formatPrice(product.original_price)}
                </span>
              </div>
            ) : (
              <span className="font-cormorant text-[2rem] text-[#2f2723] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-5 mb-6">
              <p className="text-[14px] leading-[1.9] text-[#8e7f74]">
                {product.description}
              </p>
            </div>
          )}

          {/* Quote */}
          <p className="font-cormorant text-[1.1rem] italic text-[#c8a27b] text-center my-8 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Le luxe devrait se sentir doux, pas fort."
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-4 pb-8 bg-[#f7f2ec]/90 backdrop-blur-xl border-t border-[rgba(200,162,123,0.1)] z-40">
        <a
          href={`https://wa.me/212600000000?text=Bonjour! Je suis intéressé(e) par: ${encodeURIComponent(product.title)} (${encodeURIComponent(formatPrice(discounted ? salePrice : product.original_price))})`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <button className="w-full py-4 bg-gradient-to-r from-[#2f2723] to-[#1e1815] text-white rounded-full text-[14px] tracking-[1px] font-medium hover:shadow-lg hover:shadow-[#2f2723]/20 transition-all duration-300 active:scale-[0.98]">
            Commander via WhatsApp ↗
          </button>
        </a>
      </div>
    </div>
  )
}

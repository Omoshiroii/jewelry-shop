'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'large' | 'horizontal'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const discounted = hasDiscount(product.discount_percentage)
  const salePrice = getSalePrice(product.original_price, product.discount_percentage)
  const imageUrl = product.images?.[0]
  const favorited = isFavorite(product.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/product/${product.id}`} className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#efe3d7]">
          {imageUrl ? (
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[9px] text-[#c8a27b] tracking-[2px] uppercase mb-1">{product.category}</p>
          <p className="font-cormorant text-[16px] text-[#2f2723] font-medium leading-tight">{product.title}</p>
          <div className="mt-2 flex items-center gap-2">
            {discounted ? (
              <>
                <span className="text-[13px] text-[#c8a27b] font-semibold">{formatPrice(salePrice)}</span>
                <span className="text-[10px] text-[#bbb] line-through">{formatPrice(product.original_price)}</span>
              </>
            ) : (
              <span className="text-[13px] text-[#2f2723] font-medium">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="self-center w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0ebe5] transition-colors"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={favorited ? 'text-[#c8a27b] fill-[#c8a27b]' : 'text-[#8e7f74]'}
          />
        </button>
      </Link>
    )
  }

  const isNew = new Date(product.created_at).getTime() > Date.now() - 14 * 24 * 60 * 60 * 1000 // 14 days
  const isCoupDeCoeur = (product.favorites_count || 0) >= 5

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white/70 backdrop-blur-sm rounded-[20px] overflow-hidden border border-[#e5c5a4]/10 shadow-[0_4px_20px_rgba(47,39,35,0.03)] hover:shadow-[0_12px_32px_rgba(47,39,35,0.08)] transition-all duration-500 hover:-translate-y-1">
        <div className="relative aspect-square bg-[#efe3d7] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm z-10"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={favorited ? 'text-[#c8a27b] fill-[#c8a27b]' : 'text-[#2f2723]'}
            />
          </button>

          {/* Badges Stack (Top-Left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isNew && (
              <span className="bg-[#c8a27b] text-white text-[8px] font-semibold tracking-[1px] px-2.5 py-1 rounded-md uppercase shadow-sm">
                Nouveau
              </span>
            )}
            {product.is_trending && (
              <span className="bg-[#2f2723]/90 text-white text-[8px] font-medium tracking-[1px] px-2.5 py-1 rounded-md uppercase shadow-sm">
                Tendance
              </span>
            )}
            {isCoupDeCoeur && (
              <span className="bg-[#88292F] text-white text-[8px] font-medium tracking-[1px] px-2.5 py-1 rounded-md uppercase shadow-sm">
                Favori
              </span>
            )}
          </div>

          {/* Discount Badge (Bottom-Left) */}
          {discounted && (
            <div className="absolute bottom-3 left-3 bg-[#c8a27b] text-white text-[8px] font-bold px-2 py-1 rounded-md shadow-sm">
              -{product.discount_percentage}%
            </div>
          )}
        </div>

        <div className="p-3.5">
          <span className="text-[8px] text-[#c8a27b] tracking-[1.5px] uppercase font-inter block mb-1">
            {product.category}
          </span>
          <h4 className="font-cormorant text-[15px] font-light text-[#2f2723] leading-tight truncate">
            {product.title}
          </h4>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              {discounted ? (
                <>
                  <span className="text-[13px] text-[#c8a27b] font-semibold">{formatPrice(salePrice)}</span>
                  <span className="text-[9px] text-[#bbb] line-through">{formatPrice(product.original_price)}</span>
                </>
              ) : (
                <span className="text-[13px] text-[#2f2723] font-medium">{formatPrice(product.original_price)}</span>
              )}
            </div>
            <div className="w-6 h-6 rounded-full bg-[#f7f2ec] text-[#2f2723] border border-[#e5c5a4]/20 flex items-center justify-center text-[10px] group-hover:bg-[#2f2723] group-hover:text-white group-hover:border-[#2f2723] transition-all duration-300">
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

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

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white/65 backdrop-blur-sm rounded-[28px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1">
        <div className="relative aspect-square bg-[#efe3d7] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm"
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              className={favorited ? 'text-[#c8a27b] fill-[#c8a27b]' : 'text-[#8e7f74]'}
            />
          </button>

          {/* Badges */}
          {product.is_trending && (
            <div className="absolute top-3 left-3 bg-[#2f2723]/85 backdrop-blur-sm text-white text-[8px] tracking-[1.5px] px-3 py-1.5 rounded-full uppercase">
              Tendance
            </div>
          )}
          {discounted && (
            <div className="absolute bottom-3 left-3 bg-[#c8a27b] text-white text-[9px] px-3 py-1.5 rounded-full">
              -{product.discount_percentage}%
            </div>
          )}
        </div>

        <div className="p-3 pb-4">
          <p className="text-[9px] text-[#c8a27b] tracking-[2px] uppercase mb-1">{product.category}</p>
          <p className="font-cormorant text-[17px] text-[#2f2723] font-medium leading-tight">{product.title}</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              {discounted ? (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#c8a27b] font-semibold">{formatPrice(salePrice)}</span>
                  <span className="text-[10px] text-[#bbb] line-through">{formatPrice(product.original_price)}</span>
                </div>
              ) : (
                <span className="text-[13px] text-[#2f2723] font-medium">{formatPrice(product.original_price)}</span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2f2723] text-white flex items-center justify-center text-[12px] group-hover:bg-[#c8a27b] transition-colors duration-300">
              ↗
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

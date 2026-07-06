'use client'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'large' | 'horizontal'
  index?: number
}

const CURRENT_TIME = Date.now()

export default function ProductCard({ product, variant = 'default', index = 0 }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()
  const discounted = hasDiscount(product.discount_percentage)
  const salePrice = getSalePrice(product.original_price, product.discount_percentage)
  const imageUrl = product.images?.[0]
  const favorited = isFavorite(product.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      title: product.title,
      price: salePrice,
      image: imageUrl || null,
      category: product.category
    })
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/product/${product.id}`} className="flex gap-4 bg-[#fff8fa] backdrop-blur-sm rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5e4ea]">
          {imageUrl ? (
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f5e4ea] to-[#f0c4d0]" />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[9px] text-[#d4849a] tracking-[2px] uppercase mb-1">{product.category}</p>
          <p className="font-cormorant text-[16px] text-[#1e1424] font-medium leading-tight">{product.title}</p>
          <div className="mt-2 flex items-center gap-2">
            {discounted ? (
              <>
                <span className="text-[13px] text-[#d4849a] font-semibold">{formatPrice(salePrice)}</span>
                <span className="text-[10px] text-[#bbb] line-through">{formatPrice(product.original_price)}</span>
              </>
            ) : (
              <span className="text-[13px] text-[#1e1424] font-medium">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="self-center w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5e4ea] transition-colors"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={favorited ? 'text-[#d4849a] fill-[#d4849a]' : 'text-[#9b6b7f]'}
          />
        </button>
      </Link>
    )
  }

  const isNew = new Date(product.created_at).getTime() > CURRENT_TIME - 14 * 24 * 60 * 60 * 1000
  const isCoupDeCoeur = (product.favorites_count || 0) >= 5
  const staggerClass = `stagger-${Math.min((index % 8) + 1, 8)}`

  return (
    <Link href={`/product/${product.id}`} className={`group block animate-fade-in-up ${staggerClass}`}>
      <div className="bg-[#fff8fa] rounded-[20px] overflow-hidden border border-[#f0c4d0]/30 shadow-[0_4px_20px_rgba(212,132,154,0.06)] hover:shadow-[0_16px_40px_rgba(212,132,154,0.18)] transition-all duration-500 hover:-translate-y-1.5">
        
        {/* Image */}
        <div className="relative aspect-square bg-[#f5e4ea] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f5e4ea] via-[#f0c4d0] to-[#e8b8c8] flex items-center justify-center">
              <span className="text-4xl opacity-30">💍</span>
            </div>
          )}

          {/* Hover overlay with "Voir" on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1424]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 hidden md:block" />

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm z-10"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={favorited ? 'text-[#d4849a] fill-[#d4849a]' : 'text-[#1e1424]'}
            />
          </button>

          {/* Badges (Top-Left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isNew && (
              <span className="animate-badge-pop bg-[#d4849a] text-white text-[8px] font-semibold tracking-[1px] px-2.5 py-1 rounded-md uppercase shadow-sm">
                Nouveau
              </span>
            )}
            {product.is_trending && (
              <span className="animate-badge-pop bg-[#1e1424]/90 text-white text-[8px] font-medium tracking-[1px] px-2.5 py-1 rounded-md uppercase shadow-sm" style={{ animationDelay: '0.1s' }}>
                Tendance
              </span>
            )}
            {isCoupDeCoeur && (
              <span className="animate-badge-pop bg-[#8c2f49] text-white text-[8px] font-medium tracking-[1px] px-2.5 py-1 rounded-md uppercase shadow-sm" style={{ animationDelay: '0.2s' }}>
                ♥ Favori
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {discounted && (
            <div className="absolute bottom-3 left-3 bg-[#d4849a] text-white text-[8px] font-bold px-2 py-1 rounded-md shadow-sm">
              -{product.discount_percentage}%
            </div>
          )}

          {/* Mobile Add to Cart — always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 md:hidden animate-slide-up">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-[#1e1424]/90 backdrop-blur-sm text-white text-[10px] font-medium tracking-[1.5px] uppercase flex items-center justify-center gap-2 hover:bg-[#d4849a] transition-colors duration-300"
            >
              <ShoppingCart size={12} strokeWidth={2} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Info Row */}
        <div className="p-3.5">
          <span className="text-[8px] text-[#d4849a] tracking-[1.5px] uppercase font-inter block mb-1">
            {product.category}
          </span>
          <h4 className="font-cormorant text-[15px] font-light text-[#1e1424] leading-tight truncate">
            {product.title}
          </h4>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              {discounted ? (
                <>
                  <span className="text-[13px] text-[#d4849a] font-semibold">{formatPrice(salePrice)}</span>
                  <span className="text-[9px] text-[#bbb] line-through">{formatPrice(product.original_price)}</span>
                </>
              ) : (
                <span className="text-[13px] text-[#1e1424] font-medium">{formatPrice(product.original_price)}</span>
              )}
            </div>
            {/* Desktop add-to-cart icon button */}
            <button
              onClick={handleAddToCart}
              className="hidden md:flex w-7 h-7 rounded-full bg-[#fdf0f3] border border-[#f0c4d0] items-center justify-center text-[#d4849a] hover:bg-[#1e1424] hover:text-white hover:border-[#1e1424] transition-all duration-300"
              aria-label="Ajouter au panier"
            >
              <ShoppingCart size={12} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

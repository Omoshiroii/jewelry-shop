'use client'
import Image from 'next/image'
import { Pencil, Trash2, TrendingUp } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, getSalePrice, hasDiscount } from '@/lib/utils'

type Props = {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductList({ products, onEdit, onDelete }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-cormorant text-xl text-gray-300">Aucun produit</p>
        <p className="text-xs text-gray-400 font-inter mt-1">Ajoutez votre premier bijou</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {products.map(product => {
        const discounted = hasDiscount(product.discount_percentage)
        const salePrice = getSalePrice(product.original_price, product.discount_percentage)
        const imageUrl = product.images?.[0]

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-rose-light p-3 flex items-center gap-3"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-rose-pale flex-shrink-0 relative">
              {imageUrl ? (
                <Image src={imageUrl} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-rose-pale" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-cormorant text-base text-ink truncate">{product.title}</p>
                {product.is_trending && (
                  <TrendingUp size={12} strokeWidth={1.5} className="text-rose-dusty flex-shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-rose-dusty tracking-wider uppercase font-inter">
                {product.category}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {discounted ? (
                  <>
                    <span className="text-xs text-rose-dusty font-inter">{formatPrice(salePrice)}</span>
                    <span className="text-[10px] text-gray-400 line-through font-inter">{formatPrice(product.original_price)}</span>
                    <span className="text-[9px] bg-rose-pale text-rose-dusty px-1.5 py-0.5 rounded-pill font-inter">-{product.discount_percentage}%</span>
                  </>
                ) : (
                  <span className="text-xs text-ink font-inter">{formatPrice(product.original_price)}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(product)}
                className="w-8 h-8 rounded-xl border border-rose-light flex items-center justify-center"
              >
                <Pencil size={13} strokeWidth={1.5} className="text-gray-400" />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="w-8 h-8 rounded-xl border border-rose-light flex items-center justify-center"
              >
                <Trash2 size={13} strokeWidth={1.5} className="text-gray-400" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
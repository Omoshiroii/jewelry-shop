import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { getSalePrice, formatPrice, hasDiscount } from '@/lib/utils'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const discounted = hasDiscount(product.discount_percentage)
  const salePrice = getSalePrice(product.original_price, product.discount_percentage)
  const imageUrl = product.images?.[0] ?? '/placeholder.jpg'

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-card border border-rose-light overflow-hidden group">
        <div className="relative aspect-square w-full overflow-hidden bg-rose-pale">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 480px) 50vw, 240px"
          />
          {product.is_trending && (
            <span className="absolute top-2 left-2 bg-ink text-white text-[9px] tracking-widest uppercase px-2 py-1 rounded-pill">
              Tendance
            </span>
          )}
          {discounted && (
            <span className="absolute top-2 right-2 bg-rose-dusty text-white text-[9px] px-2 py-1 rounded-pill">
              -{product.discount_percentage}%
            </span>
          )}
        </div>

        <div className="px-3 pt-2 pb-3">
          <p className="text-[9px] text-rose-dusty tracking-[2px] uppercase font-inter mb-1">
            {product.category}
          </p>
          <p className="font-cormorant text-[15px] text-ink leading-tight">
            {product.title}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {discounted ? (
              <>
                <span className="text-[11px] text-gray-400 line-through font-inter">
                  {formatPrice(product.original_price)}
                </span>
                <span className="text-[12px] text-rose-dusty font-inter font-medium">
                  {formatPrice(salePrice)}
                </span>
              </>
            ) : (
              <span className="text-[12px] text-ink font-inter">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
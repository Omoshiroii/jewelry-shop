'use client'
import { Product } from '@/types'
import Link from 'next/link'

interface MarqueeProps {
  products: Product[]
  label: string
}

export default function Marquee({ products, label }: MarqueeProps) {
  // Double the products for seamless loop
  const doubled = [...products, ...products]

  return (
    <section className="py-16 overflow-hidden">
      <div className="px-6 mb-8">
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
          {label}
        </span>
        <h2
          className="font-cormorant text-[2.4rem] font-medium leading-none text-[#2f2723]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          En ce moment
        </h2>
      </div>

      <div className="relative group">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#f7f2ec] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#f7f2ec] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused]">
          {doubled.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/product/${product.id}`}
              className="flex-shrink-0 w-[200px] group/item"
            >
              <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden mb-3 bg-[#efe3d7]">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
                )}
                {product.discount_percentage > 0 && (
                  <div className="absolute top-3 left-3 bg-[#88292F] text-white text-[9px] px-3 py-1.5 rounded-full">
                    -{product.discount_percentage}%
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#c8a27b] tracking-[2px] uppercase mb-1">
                {product.category}
              </p>
              <p className="font-cormorant text-[15px] text-[#2f2723] font-medium truncate">
                {product.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

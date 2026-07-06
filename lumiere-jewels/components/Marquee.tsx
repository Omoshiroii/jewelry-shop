'use client'
import Link from 'next/link'

export default function Marquee({ products, label }) {
  const doubled = [...products, ...products]
  return (
    <section className="py-16 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#EAE0CC] via-[#FCB9B2]/20 to-[#EAE0CC]" />
      <div className="relative px-6 mb-8">
        <span className="text-[10px] tracking-[3px] text-[#88292F] uppercase block mb-2">{label}</span>
        <h2 className="font-cormorant text-[2.4rem] font-medium leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>En ce moment</h2>
      </div>
      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#f7f2ec] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#f7f2ec] to-transparent z-10 pointer-events-none" />
        <div className="flex gap-5 animate-marquee group-hover:[animation-play-state:paused]">
          {doubled.map((product, i) => (
            <Link key={`${product.id}-${i}`} href={`/product/${product.id}`} className="flex-shrink-0 w-[220px] group/item">
              <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden mb-3 bg-[#efe3d7] shadow-lg">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
                )}
                {product.discount_percentage > 0 && (
                  <div className="absolute top-3 left-3 bg-[#88292F] text-white text-[9px] px-3 py-1.5 rounded-full">-{product.discount_percentage}%</div>
                )}
              </div>
              <p className="text-[10px] text-[#88292F] tracking-[2px] uppercase mb-1">{product.category}</p>
              <p className="font-cormorant text-[15px] text-[#2e1e0f] font-medium truncate">{product.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

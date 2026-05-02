'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import CategoryFilter from '@/components/CategoryFilter'
import ProductGrid from '@/components/ProductGrid'
import { useProducts } from '@/hooks/useProducts'

type Category = 'tout' | 'bagues' | 'colliers' | 'bracelets' | 'boucles' | 'traditionnel'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('tout')
  const { products, loading } = useProducts(activeCategory)

  const trending = products.filter(p => p.is_trending)
  const showTrending = activeCategory === 'tout' && trending.length > 0

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero strip */}
      <div className="bg-rose-pale px-4 py-5 text-center border-b border-rose-light">
        <p className="text-[9px] tracking-[4px] text-rose-dusty uppercase font-inter mb-1">
          nouvelle collection
        </p>
        <h1 className="font-cormorant text-3xl font-light text-ink">
          Bijoux d'Exception
        </h1>
      </div>

      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-rose-dusty border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {showTrending && (
            <section className="mb-2">
              <p className="px-4 pt-2 pb-3 text-[9px] tracking-[3px] text-rose-dusty uppercase font-inter">
                Tendances
              </p>
              <ProductGrid products={trending} />
            </section>
          )}

          {showTrending && (
            <p className="px-4 pt-2 pb-3 text-[9px] tracking-[3px] text-rose-dusty uppercase font-inter">
              Toute la Collection
            </p>
          )}

          <ProductGrid products={products} />
        </>
      )}

      <BottomNav />
    </main>
  )
}
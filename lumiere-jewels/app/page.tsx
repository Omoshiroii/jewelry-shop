'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'
import HeroCarousel from '@/components/HeroCarousel'
import CollectionGrid from '@/components/CollectionGrid'
import StorySection from '@/components/StorySection'
import ProductCard from '@/components/ProductCard'
import SkeletonCard from '@/components/SkeletonCard'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

const CATEGORIES = [
  { value: 'tout', label: 'Tout voir' }, { value: 'bagues', label: 'Bagues' },
  { value: 'colliers', label: 'Colliers' }, { value: 'bracelets', label: 'Bracelets' },
  { value: 'boucles', label: 'Boucles' }, { value: 'pendentifs', label: 'Pendentifs' },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('tout')

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data) setProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [])

  const filtered = activeCategory === 'tout' ? products : products.filter(product => product.category === activeCategory)
  const favorites = [...products].sort((a, b) => (b.favorites_count ?? 0) - (a.favorites_count ?? 0)).slice(0, 4)

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#21171d]">
      <HeroCarousel />
      <section className="border-b border-[#21171d]/10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 py-7 flex gap-7 md:gap-12 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map(category => (
            <button key={category.value} onClick={() => setActiveCategory(category.value)} className={`shrink-0 text-[10px] tracking-[0.18em] uppercase pb-1 border-b transition-colors ${activeCategory === category.value ? 'border-[#21171d] text-[#21171d]' : 'border-transparent text-[#21171d]/45 hover:text-[#21171d]'}`}>
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-12 py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <div><p className="text-[10px] tracking-[0.24em] uppercase text-[#a15f70] mb-3">La sélection</p><h2 className="font-cormorant text-4xl md:text-6xl font-light leading-none">{activeCategory === 'tout' ? 'Des pièces à vivre' : CATEGORIES.find(item => item.value === activeCategory)?.label}</h2></div>
          <Link href="/catalogue" className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase border-b border-[#21171d]/30 pb-1">Tout découvrir <ArrowUpRight size={13} /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-6">{[...Array(8)].map((_, index) => <SkeletonCard key={index} />)}</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9 md:gap-6">{filtered.slice(0, 8).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
        ) : <p className="py-16 text-center font-cormorant text-2xl text-[#21171d]/50">Cette sélection arrive bientôt.</p>}
      </section>

      <section className="grid md:grid-cols-2 min-h-[680px] md:min-h-[720px] bg-[#34272a] text-white">
        <div className="relative min-h-[440px] md:min-h-full overflow-hidden"><div className="absolute inset-0 bg-[url('/pink.jpg')] bg-cover bg-center transition-transform duration-[1800ms] hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-[#4b1f2e]/45 via-transparent to-transparent" /><span className="absolute left-6 bottom-6 text-[9px] tracking-[0.24em] uppercase text-white/65">LILOOK · En ce moment</span></div>
        <div className="px-7 py-16 md:px-16 lg:px-24 flex flex-col justify-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#e5b7c3] mb-6">Les tendances</p>
          <h2 className="font-cormorant text-5xl md:text-7xl font-light leading-[0.92]">A feminine touch,<br /><em className="text-[#e5b7c3]">revealed in every detail.</em></h2>
          <p className="mt-8 max-w-md text-[13px] md:text-[14px] leading-7 text-white/65">Des bijoux délicats, lumineux et faciles à associer — les pièces que l’on choisit le matin et que l’on ne quitte plus.</p>
          <Link href="/catalogue?filter=trending" className="mt-10 self-start inline-flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase border-b border-white/40 pb-2 hover:border-white transition-colors">Voir les pièces tendance <ArrowUpRight size={14} /></Link>
        </div>
      </section>

      {favorites.length > 0 && <section className="max-w-[1280px] mx-auto px-5 md:px-12 py-16 md:py-24"><div className="md:grid md:grid-cols-4 gap-6 items-end mb-12"><p className="text-[10px] tracking-[0.24em] uppercase text-[#a15f70] mb-3 md:mb-0">Vos favoris</p><h2 className="font-cormorant text-4xl md:text-6xl font-light md:col-span-3">Celles que vous aimez déjà.</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9 md:gap-6">{favorites.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div></section>}
      <CollectionGrid />
      <StorySection />
      <Newsletter />
      <Footer />
    </div>
  )
}

'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import HeroCarousel from '@/components/HeroCarousel'
import CollectionGrid from '@/components/CollectionGrid'
import StorySection from '@/components/StorySection'
import ProductCard from '@/components/ProductCard'
import SkeletonCard from '@/components/SkeletonCard'
import InstagramCollage from '@/components/InstagramCollage'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = any

const CATEGORIES = [
  { value: 'tout', label: 'Tout' },
  { value: 'bagues', label: 'Bagues' },
  { value: 'colliers', label: 'Colliers' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'boucles', label: 'Boucles' },
  { value: 'traditionnel', label: 'Traditionnel' },
  { value: 'pendentifs', label: 'Pendentifs' },
  { value: 'ensembles', label: 'Ensembles' },
]

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [mostLiked, setMostLiked] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('tout')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: allData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: likedData } = await supabase.from('products').select('*').order('favorites_count', { ascending: false }).limit(8)
    if (allData) setAllProducts(allData)
    if (likedData) setMostLiked(likedData)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filtered = activeCategory === 'tout'
    ? allProducts
    : allProducts.filter(p => p.category?.toLowerCase() === activeCategory)

  const newest = allProducts.slice(0, 8)
  const trending = allProducts.filter(p => p.is_trending).slice(0, 6)

  return (
    <div className="min-h-screen bg-[#fdf0f3]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* 1. Hero */}
      <HeroCarousel />

      {/* 2. Category Strip — Zag-inspired horizontal filter */}
      <CategoryStrip active={activeCategory} onSelect={setActiveCategory} />

      {/* 3. Products — visible right after hero + category strip */}
      <ProductsSection products={filtered} loading={loading} activeCategory={activeCategory} />

      {/* 4. Most liked / popular */}
      {mostLiked.length > 0 && <MostLikedSection products={mostLiked} />}

      {/* 5. Trending */}
      {trending.length > 0 && <TrendingSection products={trending} />}

      {/* 6. Nouveautés */}
      {newest.length > 0 && <NewestSection products={newest} />}

      {/* 7. Collections grid */}
      <CollectionGrid />

      {/* 8. Brand story */}
      <StorySection />

      {/* 9. Instagram / Newsletter / Map / Footer */}
      <InstagramCollage />
      <Newsletter />
      <MapSection />
      <Footer />
    </div>
  )
}

function CategoryStrip({ active, onSelect }: { active: string; onSelect: (v: string) => void }) {
  return (
    <div className="sticky top-[76px] z-40 bg-[#fdf0f3]/90 backdrop-blur-md border-b border-[#f0c4d0]/30 shadow-sm">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-inter tracking-[1px] transition-all duration-300 ${
              active === cat.value
                ? 'bg-[#1e1424] text-white shadow-md'
                : 'bg-white border border-[#f0c4d0]/50 text-[#4a3550] hover:border-[#d4849a] hover:text-[#d4849a]'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductsSection({ products, loading, activeCategory }: { products: Product[]; loading: boolean; activeCategory: string }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="px-4 pt-8 pb-16 max-w-[1200px] mx-auto">
      <div ref={ref} className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[9px] tracking-[3px] text-[#d4849a] uppercase block mb-1">catalogue</span>
        <h2 className="font-cormorant text-[2.4rem] font-light leading-none text-[#1e1424]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {activeCategory === 'tout' ? 'Toutes les Pièces' : CATEGORIES.find(c => c.value === activeCategory)?.label ?? 'Pièces'}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-cormorant text-2xl text-[#d4849a]">Aucune pièce dans cette catégorie</p>
          <p className="text-[12px] text-[#9b6b7f] mt-2">De nouvelles pièces arrivent bientôt...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product: Product, i: number) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

function MostLikedSection({ products }: { products: Product[] }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="py-16 bg-gradient-to-r from-[#f5e4ea] to-[#fdf0f3] border-y border-[#f0c4d0]/30 mb-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-[9px] tracking-[3px] text-[#d4849a] uppercase block mb-2">Coup de cœur</span>
          <h2 className="font-cormorant text-[2.6rem] font-light leading-none text-[#1e1424]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Les Plus Aimés
          </h2>
        </div>
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar">
          {products.slice(0, 4).map((p: Product, i: number) => (
            <div key={p.id} className="flex-shrink-0 w-[230px] md:w-auto">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrendingSection({ products }: { products: Product[] }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="px-4 py-14 max-w-[1200px] mx-auto">
      <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[9px] tracking-[3px] text-[#d4849a] uppercase block mb-2">Tendances</span>
        <h2 className="font-cormorant text-[2.6rem] font-light leading-none text-[#1e1424]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Pièces du Moment
        </h2>
      </div>
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar">
        {products.slice(0, 4).map((p: Product, i: number) => (
          <div key={p.id} className="flex-shrink-0 w-[230px] md:w-auto">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}

function NewestSection({ products }: { products: Product[] }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="px-4 py-14 bg-[#fff8fa] border-y border-[#f0c4d0]/20">
      <div className="max-w-[1200px] mx-auto">
        <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-[9px] tracking-[3px] text-[#d4849a] uppercase block mb-2">Nouveautés</span>
          <h2 className="font-cormorant text-[2.6rem] font-light leading-none text-[#1e1424]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Dernières Arrivées
          </h2>
        </div>
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar">
          {products.slice(0, 4).map((p: Product, i: number) => (
            <div key={p.id} className="flex-shrink-0 w-[230px] md:w-auto">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MapSection() {
  const { ref, isVisible } = useScrollReveal()
  const WHATSAPP_NUMBER = '212600000000'
  const STORE_ADDRESS = 'Casablanca, Maroc'
  const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.56000612377!2d-7.6693949!3d33.5731104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Maroc!5e0!3m2!1sfr!2sus!4v1715184000000!5m2!1sfr!2sus'

  return (
    <section className="px-4 pb-10 max-w-[1200px] mx-auto">
      <div ref={ref} className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[9px] tracking-[3px] text-[#d4849a] uppercase block mb-2">Notre boutique</span>
        <h2 className="font-cormorant text-[2.2rem] font-light leading-none text-[#1e1424]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Venez nous rendre visite
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        <div className="bg-[#fff8fa] rounded-[24px] p-6 border border-[#f0c4d0]/30 shadow-sm flex flex-col justify-between md:col-span-5">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#f5e4ea] flex items-center justify-center flex-shrink-0 text-xs text-[#d4849a]">
              <span>📍</span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#1e1424] mb-1">LILOOK Boutique</p>
              <p className="text-[13px] text-[#9b6b7f]">{STORE_ADDRESS}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour LILOOK ! Je souhaite prendre rendez-vous.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1e1424] text-white rounded-full text-[11px] tracking-[1.5px] font-medium hover:bg-[#d4849a] transition-colors duration-300"
          >
            Prendre rendez-vous
          </a>
        </div>
        <div className="rounded-[24px] overflow-hidden shadow-sm border border-[#f0c4d0]/20 md:col-span-7">
          <iframe src={MAP_EMBED_URL} width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Localisation LILOOK" className="w-full h-full min-h-[220px]" />
        </div>
      </div>
    </section>
  )
}

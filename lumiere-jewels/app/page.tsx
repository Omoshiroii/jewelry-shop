'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const [newest, setNewest] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const supabase = createClient()

    // Fetch newest (last 6)
    const { data: newestData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    // Fetch trending
    const { data: trendingData } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .limit(6)

    // Fetch all for the editorial grid
    const { data: allData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (newestData) setNewest(newestData)
    if (trendingData) setTrending(trendingData)
    if (allData) setAllProducts(allData)
    setLoading(false)
  }

  // Split products into pairs for editorial layout
  const productPairs = []
  for (let i = 0; i < allProducts.length; i += 2) {
    productPairs.push(allProducts.slice(i, i + 2))
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-[calc(100vh-4rem)] px-6 pt-8 pb-16 flex flex-col justify-between">
        <div>
          {/* Tag */}
          <div className="inline-block px-4 py-2 bg-white/50 rounded-full backdrop-blur-md text-[10px] tracking-[2px] text-[#8e7f74] mb-7">
            BIJOUX ARTISANAUX MAROCAINS EN ACIER INOXYDABLE
          </div>

          {/* Headline */}
          <h1
            className="font-cormorant text-[clamp(3.2rem,10vw,6rem)] leading-[0.93] font-medium text-[#2f2723] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Bijoux qui<br />
            <em className="italic font-light">murmurent</em><br />
            l'élégance.
          </h1>

          <p className="text-[14px] leading-[1.9] text-[#8e7f74] max-w-[300px]">
            Pièces féminines inspirées de la chaleur marocaine, créées pour les femmes qui romanticisent chaque détail.
          </p>
        </div>

        {/* Floating Gallery */}
        <div className="relative h-[360px] mt-12">
          <div className="absolute left-0 top-0 w-[58%] h-[260px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-10">
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800"
              alt="jewelry"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute right-0 top-[30px] w-[40%] h-[180px] rounded-[24px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600"
              alt="jewelry"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute right-4 bottom-0 w-[44%] h-[155px] rounded-[24px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600"
              alt="jewelry"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute left-3 bottom-3 px-4 py-3 bg-white/70 backdrop-blur-md rounded-[20px] z-20 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-medium text-[#2f2723]">✦ Don't look back ✦</p>
            <p className="text-[10px] text-[#8e7f74] mt-1">luxe doux & intemporel</p>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-8 text-[#c8a27b] text-[11px] tracking-[2px] animate-bounce">
          ↓ DÉCOUVRIR
        </div>
      </section>

      {/* ==================== NOUVEAUTÉS ==================== */}
      {newest.length > 0 && (
        <section className="px-6 py-16">
          <div className="mb-8">
            <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
              nouveautés
            </span>
            <h2
              className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2f2723]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Nouvelles<br />Arrivées
            </h2>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x mandatory hide-scrollbar">
            {newest.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[260px] scroll-snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== TENDANCES ==================== */}
      {trending.length > 0 && (
        <section className="px-6 py-16">
          <div className="mb-8">
            <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
              sélection
            </span>
            <h2
              className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2f2723]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Pièces<br />Tendances
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x mandatory hide-scrollbar">
            {trending.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[260px] scroll-snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== EDITORIAL BANNER ==================== */}
      <section className="px-5 pb-16">
        <div className="bg-gradient-to-br from-[#2f2723] to-[#1e1815] rounded-[36px] px-7 py-10 text-white">
          <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase">notre histoire</span>
          <h2
            className="font-cormorant text-[2.8rem] font-medium leading-[1.05] my-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Créé avec<br />âme & élégance.
          </h2>
          <p className="text-[13px] leading-[1.9] opacity-70 mb-6">
            Chaque pièce est conçue avec une douceur féminine et une identité marocaine. Inspirée de motifs zellige, de tons chauds et d'une beauté intemporelle.
          </p>
          <Link href="/catalogue">
            <button className="px-7 py-3.5 bg-[#e5c5a4] text-[#2f2723] rounded-full font-semibold text-[13px] hover:bg-[#d4b494] transition-colors duration-300">
              Explorer la Collection
            </button>
          </Link>
        </div>
      </section>

      {/* ==================== ALL PRODUCTS (EDITORIAL 2-COL) ==================== */}
      <section className="px-5 pb-32">
        <div className="mb-8">
          <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
            catalogue
          </span>
          <h2
            className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2f2723]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Toutes les<br />Pièces
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-cormorant text-2xl text-[#c8a27b]">Aucune pièce trouvée</p>
          </div>
        ) : (
          <div className="space-y-12">
            {productPairs.map((pair, pairIndex) => (
              <div
                key={pairIndex}
                className="grid grid-cols-2 gap-4"
              >
                {pair.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

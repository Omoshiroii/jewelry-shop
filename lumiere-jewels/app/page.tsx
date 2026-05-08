'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { MapPin, Navigation } from 'lucide-react'

const WHATSAPP_NUMBER = '212600000000'
const STORE_ADDRESS = 'Stand Lilook Bijoux - Socco Alto Mall en face de Paul, Tanger, Maroc'
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2958.6087065500765!2d-5.840486100000001!3d35.7810626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0c789bd618661d%3A0x87aff69d2a2c175f!2sSocco%20Alto!5e1!3m2!1sen!2sma!4v1778262462501!5m2!1sen!2sma" 

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

    const { data: newestData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    const { data: trendingData } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .limit(6)

    const { data: allData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (newestData) setNewest(newestData)
    if (trendingData) setTrending(trendingData)
    if (allData) setAllProducts(allData)
    setLoading(false)
  }

  const productPairs = []
  for (let i = 0; i < allProducts.length; i += 2) {
    productPairs.push(allProducts.slice(i, i + 2))
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="h-16" />

      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-[calc(100vh-4rem)] px-6 pt-8 pb-16 flex flex-col justify-between">
        <div>
          <div className="inline-block px-4 py-2 bg-white/50 rounded-full backdrop-blur-md text-[11px] tracking-[2px] text-[#8e7f74] mb-7">
          Élégance intemporelle en acier inoxydable
          </div>

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

          <div className="absolute left-3 bottom-3 px-4 py-3 bg-white/70 backdrop-blur-md rounded-[20px] z-20 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-medium text-[#2f2723]">✦ Don't look back</p>
            <p className="text-[10px] text-[#8e7f74] mt-1">luxe doux & intemporel</p>
          </div>
        </div>

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
Des accessoires parfaits pour ajouter une touche de raffinement à votre style, sans compromis sur la durabilité.

Résistants, chics, et facile à entretenir
          </p>
          <Link href="/catalogue">
            <button className="px-7 py-3.5 bg-[#e5c5a4] text-[#2f2723] rounded-full font-semibold text-[13px] hover:bg-[#d4b494] transition-colors duration-300">
              Explorer la Collection
            </button>
          </Link>
        </div>
      </section>

      {/* ==================== ALL PRODUCTS (EDITORIAL 2-COL) ==================== */}
      <section className="px-5 pb-20">
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
              <div key={pairIndex} className="grid grid-cols-2 gap-4">
                {pair.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================== MAP SECTION ==================== */}
      <section className="px-5 pb-8">
        <div className="mb-6">
          <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
            notre boutique
          </span>
          <h2
            className="font-cormorant text-[2.4rem] font-medium leading-none text-[#2f2723]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Venez nous<br />rendre visite
          </h2>
        </div>

        {/* Address Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-5 mb-4 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#c8a27b]/10 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} strokeWidth={1.5} className="text-[#c8a27b]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#2f2723] mb-1">LILOOK Boutique</p>
              <p className="text-[13px] text-[#8e7f74] leading-relaxed">
                {STORE_ADDRESS}
              </p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/place/Socco+Alto/@35.7810626,-5.843061,679m/data=!3m2!1e3!4b1!4m6!3m5!1s0xd0c789bd618661d:0x87aff69d2a2c175f!8m2!3d35.7810626!4d-5.8404861!16s%2Fg%2F11bxfg62s2?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#2f2723] text-white rounded-full text-[13px] tracking-[1px] hover:bg-[#c8a27b] transition-colors duration-300"
          >
            <Navigation size={14} strokeWidth={1.5} />
            Visitez nous
          </a>
        </div>

        {/* Map Embed */}
        <div className="rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e8e0d8]">
          <iframe
            src={MAP_EMBED_URL}
            width="100%"
            height="280"
            style={{ border: 0, filter: 'grayscale(0.3) sepia(0.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation LILOOK"
            className="w-full"
          />
        </div>

        <p className="text-[10px] text-[#8e7f74] text-center mt-3 tracking-[1px]">
        </p>
      </section>

      {/* ==================== FOOTER ==================== */}
      <Footer />
    </div>
  )
}

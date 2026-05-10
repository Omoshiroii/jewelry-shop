'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import HeroCarousel from '@/components/HeroCarousel'
import Marquee from '@/components/Marquee'
import CollectionGrid from '@/components/CollectionGrid'
import StorySection from '@/components/StorySection'
import ProductCard from '@/components/ProductCard'
import InstagramCollage from '@/components/InstagramCollage'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

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
      .limit(8)

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
      {/* ==================== HERO CAROUSEL ==================== */}
      <HeroCarousel />

      {/* ==================== MARQUEE NOUVEAUTÉS ==================== */}
      {newest.length > 0 && <Marquee products={newest} label="nouveautés" />}

      {/* ==================== COLLECTION GRID ==================== */}
      <CollectionGrid />

      {/* ==================== STORY SECTION ==================== */}
      <StorySection />

      {/* ==================== TENDANCES ==================== */}
      {trending.length > 0 && (
        <TrendingSection products={trending} />
      )}

      {/* ==================== ALL PRODUCTS ==================== */}
      <AllProductsSection 
        products={allProducts} 
        productPairs={productPairs} 
        loading={loading} 
      />

      {/* ==================== INSTAGRAM COLLAGE ==================== */}
      <InstagramCollage />

      {/* ==================== NEWSLETTER ==================== */}
      <Newsletter />

      {/* ==================== MAP SECTION ==================== */}
      <MapSection />

      {/* ==================== FOOTER ==================== */}
      <Footer />
    </div>
  )
}

function TrendingSection({ products }: { products: Product[] }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="px-6 py-16">
      <div 
        ref={ref}
        className={`mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
          sélection
        </span>
        <h2
          className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2e1e0f]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Pièces<br />Tendances
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x mandatory hide-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[260px] scroll-snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

function AllProductsSection({ 
  products, 
  productPairs, 
  loading 
}: { 
  products: Product[]; 
  productPairs: Product[][]; 
  loading: boolean 
}) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="px-5 pb-20">
      <div 
        ref={ref}
        className={`mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
          catalogue
        </span>
        <h2
          className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2e1e0f]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Toutes les<br />Pièces
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-6 h-6 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
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
  )
}

function MapSection() {
  const { ref, isVisible } = useScrollReveal()
  const WHATSAPP_NUMBER = '212600000000'
  const STORE_ADDRESS = 'Casablanca, Maroc'
  const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.56000612377!2d-7.6693949!3d33.5731104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Maroc!5e0!3m2!1sfr!2sus!4v1715184000000!5m2!1sfr!2sus'

  return (
    <section className="px-5 pb-8">
      <div 
        ref={ref}
        className={`mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">
          notre boutique
        </span>
        <h2
          className="font-cormorant text-[2.4rem] font-medium leading-none text-[#2e1e0f]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Venez nous<br />rendre visite
        </h2>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-5 mb-4 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#c8a27b]/10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a27b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#2e1e0f] mb-1">LILOOK Boutique</p>
            <p className="text-[13px] text-[#8e7f74] leading-relaxed">{STORE_ADDRESS}</p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour! Je souhaite prendre rendez-vous pour visiter votre boutique.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#2e1e0f] text-white rounded-full text-[13px] tracking-[1px] hover:bg-[#c8a27b] transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Prendre rendez-vous
        </a>
      </div>

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
    </section>
  )
}

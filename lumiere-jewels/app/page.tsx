'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import HeroCarousel from '@/components/HeroCarousel'
import EditorialBanner from '@/components/EditorialBanner'
import VideoSection from '@/components/VideoSection'
import LifestyleGrid from '@/components/LifestyleGrid'
import Marquee from '@/components/Marquee'
import CollectionGrid from '@/components/CollectionGrid'
import StorySection from '@/components/StorySection'
import ProductCard from '@/components/ProductCard'
import InstagramCollage from '@/components/InstagramCollage'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HomePage() {
  const [newest, setNewest] = useState([])
  const [trending, setTrending] = useState([])
  const [mostLiked, setMostLiked] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const supabase = createClient()
    const { data: newestData } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8)
    const { data: trendingData } = await supabase.from('products').select('*').eq('is_trending', true).limit(6)
    const { data: likedData } = await supabase.from('products').select('*').order('favorites_count', { ascending: false }).limit(6)
    const { data: allData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (newestData) setNewest(newestData)
    if (trendingData) setTrending(trendingData)
    if (likedData) setMostLiked(likedData)
    if (allData) setAllProducts(allData)
    setLoading(false)
  }

  const productPairs = []
  for (let i = 0; i < allProducts.length; i += 2) {
    productPairs.push(allProducts.slice(i, i + 2))
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      <HeroCarousel />
      <EditorialBanner />
      <VideoSection />
      <LifestyleGrid />
      {newest.length > 0 && <Marquee products={newest} label="nouveautés" />}
      <CollectionGrid />
      <StorySection />
      {trending.length > 0 && <TrendingSection products={trending} />}
      {mostLiked.length > 0 && <MostLikedSection products={mostLiked} />}
      <AllProductsSection products={allProducts} productPairs={productPairs} loading={loading} />
      <InstagramCollage />
      <Newsletter />
      <MapSection />
      <Footer />
    </div>
  )
}

function TrendingSection({ products }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="px-5 py-16 max-w-[1200px] mx-auto">
      <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">sélection</span>
        <h2 className="font-cormorant text-[2.8rem] font-light leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Pièces Tendances
        </h2>
      </div>
      
      {/* Mobile: scroll, Desktop: 4 columns grid */}
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-snap-x mandatory hide-scrollbar">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[240px] md:w-auto scroll-snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

function AllProductsSection({ products, loading }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="px-5 pb-20 max-w-[1200px] mx-auto">
      <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">catalogue</span>
        <h2 className="font-cormorant text-[2.8rem] font-light leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Toutes les Pièces
        </h2>
      </div>
      
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-cormorant text-2xl text-[#c8a27b]">Aucune pièce trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
    <section className="px-5 pb-8 max-w-[1200px] mx-auto">
      <div ref={ref} className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">notre boutique</span>
        <h2 className="font-cormorant text-[2.4rem] font-light leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Venez nous rendre visite
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-6 border border-[#e5c5a4]/15 shadow-sm flex flex-col justify-between md:col-span-5">
          <div className="flex items-start gap-4 mb-6 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-[#c8a27b]/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a27b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#2e1e0f] mb-1">LILOOK Boutique</p>
              <p className="text-[13px] text-[#8e7f74] leading-relaxed">{STORE_ADDRESS}</p>
            </div>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour! Je souhaite prendre rendez-vous pour visiter votre boutique.`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#2e1e0f] text-white rounded-full text-[12px] tracking-[1px] font-medium hover:bg-[#c8a27b] transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Prendre rendez-vous
          </a>
        </div>
        <div className="rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-[#e5c5a4]/15 md:col-span-7">
          <iframe src={MAP_EMBED_URL} width="100%" height="220" style={{ border: 0, filter: 'grayscale(0.2) sepia(0.05)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Localisation LILOOK" className="w-full h-full min-h-[220px]" />
        </div>
      </div>
    </section>
  )
}

function MostLikedSection({ products }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="py-16 bg-[#e5c5a4]/5 border-y border-[#e5c5a4]/10 mb-16">
      <div className="max-w-[1200px] mx-auto px-5">
        <div ref={ref} className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-2">Sélection populaire</span>
          <h2 className="font-cormorant text-[2.8rem] font-light leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Les Plus Aimés
          </h2>
        </div>
        
        {/* Mobile: scroll, Desktop: 4 columns grid */}
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-snap-x mandatory hide-scrollbar">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[240px] md:w-auto scroll-snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

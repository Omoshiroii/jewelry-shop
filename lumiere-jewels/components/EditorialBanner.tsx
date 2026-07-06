'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Link from 'next/link'

export default function EditorialBanner() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="relative w-full min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920" alt="Lifestyle" className="w-full h-full object-cover" style={{ filter: 'brightness(0.6) saturate(1.1)' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E1E0F]/80 via-[#2E1E0F]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f7f2ec] via-transparent to-transparent" style={{ top: '60%' }} />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#FCB9B2]/20 rounded-full blur-3xl animate-blob-morph" />

      <div className="relative z-10 flex flex-col justify-center h-full min-h-[80vh] px-6 md:px-16 max-w-2xl">
        <span className={`text-[10px] tracking-[4px] text-[#FCB9B2] uppercase mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          L'Essence LILOOK
        </span>
        <h2 className={`font-cormorant text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-medium text-white mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
          Chaque bijou<br /><em className="italic font-light text-[#FCB9B2]">raconte</em><br />une histoire.
        </h2>
        <p className={`text-[15px] leading-[1.9] text-white/80 max-w-[360px] mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Des créations uniques nées de la rencontre entre tradition marocaine et modernité audacieuse. Porter LILOOK, c'est porter une émotion.
        </p>
        <div className={`flex gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/catalogue">
            <button className="px-7 py-3.5 bg-[#88292F] text-white rounded-full text-[13px] tracking-[1px] hover:bg-[#8C2F39] transition-colors duration-300">
              Voir la Collection
            </button>
          </Link>
          <Link href="/catalogue?filter=trending">
            <button className="px-7 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full text-[13px] tracking-[1px] hover:bg-white/20 transition-colors duration-300">
              Tendances
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

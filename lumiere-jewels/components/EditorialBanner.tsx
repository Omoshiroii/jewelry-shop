'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Link from 'next/link'

export default function EditorialBanner() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="py-20 px-5 md:px-12 bg-white border-b border-[#e5c5a4]/15">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        
        {/* Asymmetrical Images */}
        <div className="w-full md:w-1/2 flex items-center gap-4 md:gap-6">
          {/* Image 1: Tall Vertical */}
          <div className="w-1/2 overflow-hidden rounded-[24px] border border-[#e5c5a4]/20 shadow-sm relative group">
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800" 
              alt="Luxury Diamond Detail" 
              className="w-full aspect-[3/4] object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out" 
            />
            <div className="absolute inset-0 bg-[#2f2723]/5 pointer-events-none" />
          </div>

          {/* Image 2: Offset Shorter Image */}
          <div className="w-1/2 overflow-hidden rounded-[24px] border border-[#e5c5a4]/20 shadow-sm relative mt-12 group">
            <img 
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800" 
              alt="Gold Necklaces Detail" 
              className="w-full aspect-square object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out" 
            />
            <div className="absolute inset-0 bg-[#2f2723]/5 pointer-events-none" />
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 space-y-6">
          <span className={`text-[10px] tracking-[4px] text-[#c8a27b] uppercase block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Le Savoir-Faire
          </span>
          
          <h2 
            className={`font-cormorant text-[2.6rem] md:text-[3.5rem] leading-[1.05] font-light text-[#2f2723] transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            L&apos;alliance de la<br />
            <em className="italic font-normal text-[#c8a27b]">finesse</em> et de la durabilité.
          </h2>

          <p className={`text-[13px] md:text-[14px] leading-[1.8] text-[#8e7f74] transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Chaque pièce LILOOK est méticuleusement sélectionnée et travaillée en acier inoxydable de haute qualité, plaquée à l&apos;or fin. Résistantes au parfum, au chlore et aux gestes du quotidien, elles vous accompagnent année après année sans perdre de leur éclat.
          </p>

          <div className={`pt-4 flex gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href="/catalogue">
              <span className="inline-block text-[11px] tracking-[2px] uppercase font-semibold text-[#2f2723] border-b border-[#2f2723] pb-1 hover:text-[#c8a27b] hover:border-[#c8a27b] transition-colors cursor-pointer">
                Explorer le catalogue
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}


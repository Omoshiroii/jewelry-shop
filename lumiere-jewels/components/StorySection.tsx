'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function StorySection() {
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal()
  const { ref: textRef, isVisible: textVisible } = useScrollReveal()

  return (
    <section className="py-20 px-5">
      <div className="max-w-md mx-auto">
        {/* Image */}
        <div
          ref={imageRef}
          className={`relative mb-10 transition-all duration-1000 ${
            imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="aspect-[4/5] rounded-[32px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"
              alt="Artisanat marocain"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Floating accent */}
          <div className="absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-[#c8a27b]/20 backdrop-blur-sm" />
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#EAE0CC]/60 backdrop-blur-sm" />
        </div>

        {/* Text */}
        <div
          ref={textRef}
          className={`transition-all duration-1000 delay-200 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-3">
            notre histoire
          </span>
          <h2
            className="font-cormorant text-[2.6rem] font-medium leading-[1.05] text-[#2e1e0f] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            L'art du bijou<br />
            <em className="italic font-light">marocain</em>
          </h2>

          <div className="space-y-4">
            <p className="text-[14px] leading-[1.9] text-[#8e7f74]">
              Chaque pièce LILOOK naît des mains d'artisans marocains passionnés, 
              dans un atelier où la tradition rencontre la modernité.
            </p>
            <p className="text-[14px] leading-[1.9] text-[#8e7f74]">
              Nous sélectionnons les matériaux les plus nobles — or, argent, pierres 
              précieuses — pour créer des bijoux qui racontent une histoire, 
              la vôtre.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-[#e8e0d8]">
            <div>
              <p className="font-cormorant text-[2rem] text-[#c8a27b] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                100%
              </p>
              <p className="text-[11px] text-[#8e7f74] tracking-wide">Fait main</p>
            </div>
            <div>
              <p className="font-cormorant text-[2rem] text-[#c8a27b] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                50+
              </p>
              <p className="text-[11px] text-[#8e7f74] tracking-wide">Pièces uniques</p>
            </div>
            <div>
              <p className="font-cormorant text-[2rem] text-[#c8a27b] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                5★
              </p>
              <p className="text-[11px] text-[#8e7f74] tracking-wide">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

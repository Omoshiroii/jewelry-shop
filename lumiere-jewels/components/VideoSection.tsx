'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Link from 'next/link'

const spotlightPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600',
    title: 'Les bagues',
    category: 'Élégance'
  },
  {
    src: 'https://images.unsplash.com/photo-1602751584552-8ba420552259?q=80&w=600',
    title: 'Les colliers',
    category: 'Raffinement'
  },
  {
    src: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600',
    title: 'Les bracelets',
    category: 'Modernité'
  }
]

export default function VideoSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="py-20 px-5 md:px-12 bg-[#f7f2ec] border-b border-[#e5c5a4]/15">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className={`text-[10px] tracking-[4px] text-[#c8a27b] uppercase block mb-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Inspirations
          </span>
          <h2 
            className={`font-cormorant text-[2.6rem] md:text-[3.5rem] leading-[1.1] font-light text-[#2f2723] transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Sublimer chaque instant
          </h2>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {spotlightPhotos.map((photo, index) => (
            <div 
              key={index} 
              className={`group flex flex-col items-center text-center transition-all duration-[1.2s] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Photo Container */}
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden border border-[#e5c5a4]/20 shadow-sm relative mb-4">
                <img 
                  src={photo.src} 
                  alt={photo.title} 
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-[#2f2723]/5 pointer-events-none" />
              </div>

              {/* Title & Info */}
              <span className="text-[9px] tracking-[2px] text-[#c8a27b] uppercase font-inter mb-1">
                {photo.category}
              </span>
              <h3 
                className="font-cormorant text-[1.4rem] font-light text-[#2f2723] group-hover:text-[#c8a27b] transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {photo.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


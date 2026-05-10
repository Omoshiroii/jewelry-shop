'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1920',
    alt: 'Bijoux artisanaux',
  },
  {
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1920',
    alt: 'Collection élégance',
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920',
    alt: 'Pièces uniques',
  },
  {
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1920',
    alt: 'Or et diamants',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.65) saturate(1.1)' }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-20" />

      {/* Content */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6">
        <div className="overflow-hidden mb-4">
          <span 
            className="inline-block text-[10px] tracking-[4px] text-[#c8a27b] uppercase animate-fade-in-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Bijoux Artisanaux Marocains
          </span>
        </div>

        <h1 
          className="font-cormorant text-[clamp(3rem,12vw,7rem)] leading-[0.9] font-medium text-white mb-6 animate-fade-in-up"
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            animationDelay: '0.4s',
            animationFillMode: 'both',
            textShadow: '0 4px 30px rgba(0,0,0,0.3)'
          }}
        >
          Bijoux qui<br />
          <em className="italic font-light">murmurent</em><br />
          l'élégance.
        </h1>

        <p 
          className="text-[14px] md:text-[16px] leading-[1.8] text-white/80 max-w-[380px] mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          Pièces féminines inspirées de la chaleur marocaine, créées pour les femmes qui romanticisent chaque détail.
        </p>

        <a 
          href="#collections"
          className="animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        >
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full text-[13px] tracking-[2px] uppercase hover:bg-white/20 hover:border-white/50 transition-all duration-500">
            Découvrir
          </button>
        </a>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Précédent"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Suivant"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === current 
                ? 'w-8 bg-white' 
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] tracking-[3px] text-white/60 uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  )
}

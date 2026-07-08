import Link from 'next/link'
import { Droplets, Sparkles, Truck } from 'lucide-react'
import { HERO_IMAGE_URL } from '@/lib/constants'

const particles = [
  { size: 6, top: '15%', left: '8%', duration: '7s', delay: '0s', opacity: 0.4 },
  { size: 4, top: '70%', left: '5%', duration: '9s', delay: '1s', opacity: 0.3 },
  { size: 8, top: '30%', left: '45%', duration: '6s', delay: '2s', opacity: 0.2 },
  { size: 5, top: '80%', left: '55%', duration: '11s', delay: '0.5s', opacity: 0.35 },
  { size: 3, top: '10%', left: '75%', duration: '8s', delay: '3s', opacity: 0.4 },
  { size: 7, top: '55%', left: '90%', duration: '10s', delay: '1.5s', opacity: 0.25 },
  { size: 4, top: '90%', left: '30%', duration: '7.5s', delay: '2.5s', opacity: 0.3 },
]

function HeroContent() {
  return (
    <div className="max-w-[460px] mx-auto w-full">
      <div className="inline-flex items-center gap-2 bg-[#f5e4ea] border border-[#f0c4d0] rounded-full px-4 py-1.5 mb-3 md:mb-6 animate-fade-in-up">
        <span className="text-[9px] tracking-[2px] text-[#d4849a] uppercase font-inter">
          Bijoux · Acier inoxydable · Waterproof
        </span>
      </div>

      <h1
        className="font-cormorant text-[2.4rem] md:text-[4.5rem] leading-[1] font-light text-[#1e1424] mb-3 md:mb-6 animate-fade-in-up"
        style={{ fontFamily: "'Cormorant Garamond', serif", animationDelay: '200ms', animationFillMode: 'both' }}
      >
        Des bijoux qui<br />
        <em className="italic font-normal text-[#d4849a]">subliment</em><br />
        votre quotidien.
      </h1>

      <p
        className="text-[12px] md:text-[14px] leading-[1.7] text-[#4a3550] mb-4 md:mb-8 font-inter animate-fade-in-up"
        style={{ animationDelay: '400ms', animationFillMode: 'both' }}
      >
        Bijoux en acier inoxydable — résistants à l&apos;eau, qui ne noircissent pas et restent parfaits toute la journée.
      </p>

      <div
        className="flex flex-col sm:flex-row gap-2 md:gap-3 animate-fade-in-up"
        style={{ animationDelay: '600ms', animationFillMode: 'both' }}
      >
        <Link href="/catalogue" className="flex-1 sm:flex-none">
          <button className="w-full sm:px-8 py-3 md:py-4 bg-[#1e1424] text-white rounded-full text-[11px] tracking-[2px] uppercase font-inter hover:bg-[#d4849a] hover:shadow-lg hover:shadow-[#d4849a]/30 transition-all duration-300">
            Découvrir la collection
          </button>
        </Link>
        <Link href="/catalogue?filter=trending" className="flex-1 sm:flex-none">
          <button className="w-full sm:px-8 py-3 md:py-4 bg-transparent border border-[#f0c4d0] text-[#1e1424] rounded-full text-[11px] tracking-[2px] uppercase font-inter hover:bg-[#d4849a] hover:text-white hover:border-[#d4849a] transition-all duration-300">
            Les tendances
          </button>
        </Link>
      </div>

      <div
        className="flex items-center gap-4 md:gap-6 mt-5 md:mt-10 pt-5 md:pt-8 border-t border-[#f0c4d0]/40 animate-fade-in-up"
        style={{ animationDelay: '800ms', animationFillMode: 'both' }}
      >
        {[
          { Icon: Droplets, label: 'Waterproof' },
          { Icon: Sparkles, label: 'Anti-ternissement' },
          { Icon: Truck, label: 'Livraison gratuite' },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Icon size={16} className="text-[#d4849a]" strokeWidth={1.5} />
            <span className="text-[8px] text-[#9b6b7f] tracking-[1px] uppercase text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeroCarousel() {
  return (
    <section className="relative w-full bg-[#fdf0f3] flex flex-col md:flex-row items-stretch overflow-hidden pt-[76px] md:pt-0 md:min-h-screen">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#d4849a] animate-particle pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            opacity: p.opacity,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Photo — separate from text */}
      <div className="relative w-full md:w-1/2 h-[44vh] min-h-[260px] md:h-auto md:min-h-0 overflow-hidden group">
        <img
          src={HERO_IMAGE_URL}
          alt="LILOOK Bijoux en acier inoxydable"
          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
          style={{ objectPosition: 'center 42%', filter: 'brightness(0.93) saturate(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1424]/30 via-transparent to-[#d4849a]/5 pointer-events-none" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-[9px] tracking-[3px] uppercase text-white/70">Acier inoxydable · Waterproof</p>
        </div>
      </div>

      {/* Text — below image on mobile, beside on desktop */}
      <div className="w-full md:w-1/2 flex-1 flex flex-col justify-center px-5 py-6 md:px-16 md:py-20 relative bg-[#fdf0f3]">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#d4849a]/8 rounded-full blur-3xl animate-float pointer-events-none hidden md:block" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#f0c4d0]/15 rounded-full blur-2xl animate-float-slow pointer-events-none hidden md:block" />
        <HeroContent />
      </div>
    </section>
  )
}

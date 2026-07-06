'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function VideoSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="relative w-full min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f2ec] via-transparent to-[#f7f2ec]" style={{ top: '-1px', bottom: '-1px' }} />
      <div className="absolute inset-0 bg-[#2E1E0F]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#88292F]/30 to-transparent" />
      <div className="absolute top-1/3 left-10 w-24 h-24 bg-[#FCB9B2]/30 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-[#c8a27b]/20 rounded-full blur-2xl animate-float-slow" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
        <span className={`text-[10px] tracking-[4px] text-[#FCB9B2] uppercase mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          L'Inspiration
        </span>
        <h2 className={`font-cormorant text-[clamp(2.5rem,10vw,6rem)] leading-[0.9] font-medium text-white mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: '0 4px 40px rgba(0,0,0,0.4)' }}>
          Libre comme<br /><em className="italic font-light text-[#FCB9B2]">l'océan</em>
        </h2>
        <p className={`text-[15px] md:text-[17px] leading-[1.9] text-white/85 max-w-[450px] mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Nos créations s'inspirent de la nature — du mouvement des vagues à la chaleur du sable doré. Chaque pièce est une invitation au voyage.
        </p>
        <div className={`flex items-center gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center"><p className="font-cormorant text-[2.5rem] text-[#FCB9B2] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>18K</p><p className="text-[10px] text-white/60 tracking-[2px] uppercase">Or</p></div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center"><p className="font-cormorant text-[2.5rem] text-[#FCB9B2] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>925</p><p className="text-[10px] text-white/60 tracking-[2px] uppercase">Argent</p></div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center"><p className="font-cormorant text-[2.5rem] text-[#FCB9B2] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>∞</p><p className="text-[10px] text-white/60 tracking-[2px] uppercase">Unique</p></div>
        </div>
      </div>
    </section>
  )
}

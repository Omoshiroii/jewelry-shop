'use client'
import Link from 'next/link'

export default function HeroCarousel() {
  return (
    <section className="relative w-full min-h-[92vh] md:min-h-screen bg-[#f7f2ec] flex flex-col md:flex-row items-stretch border-b border-[#e5c5a4]/15">
      {/* Left Column: Premium Fashion Photo */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-0 overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200" 
          alt="LILOOK Gold Jewelry Close-up" 
          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
          style={{ filter: 'brightness(0.95) saturate(1.05)' }}
        />
        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2f2723]/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Right Column: Editorial Typography & Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 md:px-16 md:py-20 relative bg-[#f7f2ec]">
        <div className="absolute top-10 right-10 w-24 h-24 bg-[#c8a27b]/5 rounded-full blur-2xl animate-float pointer-events-none" />
        
        <div className="max-w-[460px] mx-auto w-full">
          <span className="text-[10px] tracking-[4px] text-[#c8a27b] uppercase font-inter block mb-4 animate-fade-in-up">
            Collection Artisanale • 2026
          </span>
          
          <h1 
            className="font-cormorant text-[3.2rem] md:text-[4.5rem] leading-[1] font-light text-[#2f2723] mb-6 animate-fade-in-up" 
            style={{ fontFamily: "'Cormorant Garamond', serif", animationDelay: '200ms', animationFillMode: 'both' }}
          >
            Des bijoux qui<br />
            <em className="italic font-normal text-[#c8a27b]">subliment</em><br />
            votre quotidien.
          </h1>
          
          <p 
            className="text-[13px] md:text-[14px] leading-[1.8] text-[#8e7f74] mb-8 font-inter animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            Inspirées de la lumière marocaine et du raffinement parisien, nos pièces en acier inoxydable sont conçues pour résister à la vie, à l&apos;eau, et ne jamais ternir.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: '600ms', animationFillMode: 'both' }}
          >
            <Link href="/catalogue" className="flex-1 sm:flex-none">
              <button className="w-full sm:px-8 py-4 bg-[#2f2723] text-white rounded-full text-[11px] tracking-[2px] uppercase font-inter hover:bg-[#c8a27b] hover:shadow-md transition-all duration-300">
                Découvrir la collection
              </button>
            </Link>
            <Link href="/catalogue?filter=trending" className="flex-1 sm:flex-none">
              <button className="w-full sm:px-8 py-4 bg-transparent border border-[#e5c5a4] text-[#2f2723] rounded-full text-[11px] tracking-[2px] uppercase font-inter hover:bg-[#2f2723] hover:text-white hover:border-[#2f2723] transition-all duration-300">
                Les tendances
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


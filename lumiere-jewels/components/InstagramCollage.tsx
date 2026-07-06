'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ArrowUpRight } from 'lucide-react'

const images = [
  { src: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600', alt: 'Bijoux 1', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600', alt: 'Bijoux 2', size: 'wide' },
  { src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600', alt: 'Bijoux 3', size: 'square' },
  { src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600', alt: 'Bijoux 4', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600', alt: 'Bijoux 5', size: 'square' },
  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600', alt: 'Bijoux 6', size: 'wide' },
]

export default function InstagramCollage() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal()

  return (
    <section className="py-20 overflow-hidden">
      <div ref={titleRef} className={`px-6 mb-10 flex items-end justify-between transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div>
          <span className="text-[10px] tracking-[3px] text-[#88292F] uppercase block mb-2">suivez-nous</span>
          <h2 className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Instagram</h2>
        </div>
        <a href="https://instagram.com/lilook51/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] text-[#8e7f74] hover:text-[#88292F] transition-colors">
          @lilook51 <ArrowUpRight size={14} strokeWidth={1.5} />
        </a>
      </div>

      <div className="relative px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#EAE0CC]/40 -z-10" />
        <div className="absolute top-1/4 right-1/4 w-[150px] h-[150px] rounded-full bg-[#C9ADA1]/20 -z-10" />
        <div className="grid grid-cols-12 gap-2 md:gap-3 auto-rows-[120px] md:auto-rows-[150px]">
          {images.map((img, index) => (
            <CollageImage key={index} image={img} index={index} />
          ))}
          <div className="col-span-4 row-span-2 bg-[#2e1e0f] rounded-[20px] flex flex-col items-center justify-center p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8a27b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <p className="font-cormorant text-[18px] text-white font-medium mb-2 mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Rejoignez-nous</p>
            <p className="text-[11px] text-white/60 mb-4">@lilook51</p>
            <a href="https://instagram.com/lilook51/" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/10 border border-white/20 rounded-full text-[11px] text-white tracking-wide hover:bg-white/20 transition-colors">Suivre</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function CollageImage({ image, index }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })
  const gridClasses = { tall: 'col-span-3 row-span-2', wide: 'col-span-5 row-span-1', square: 'col-span-3 row-span-1' }
  return (
    <div ref={ref} className={`${gridClasses[image.size]} rounded-[16px] overflow-hidden group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${index * 80}ms` }}>
      <a href="https://instagram.com/lilook51/" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        <img src={image.src} alt={image.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </a>
    </div>
  )
}

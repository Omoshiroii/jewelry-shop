'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const lifestyleImages = [
  { src: 'https://images.unsplash.com/photo-1602751584552-8ba420552259?q=80&w=800', alt: 'Femme élégante', span: 'col-span-2 row-span-2', text: "L'Élégance", subtext: 'Au quotidien' },
  { src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600', alt: 'Détail bijou', span: 'col-span-1 row-span-1', text: '', subtext: '' },
  { src: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600', alt: 'Mains bijoux', span: 'col-span-1 row-span-1', text: '', subtext: '' },
  { src: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800', alt: 'Collier', span: 'col-span-2 row-span-1', text: 'La Collection', subtext: 'Printemps-Été' },
]

export default function LifestyleGrid() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal()

  return (
    <section className="py-20 px-5">
      <div ref={titleRef} className={`mb-10 transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] tracking-[3px] text-[#88292F] uppercase block mb-2">la vie LILOOK</span>
        <h2 className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Votre histoire,<br />votre style
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[220px]">
        {lifestyleImages.map((img, index) => (
          <LifestyleCard key={index} image={img} index={index} />
        ))}
      </div>
    </section>
  )
}

function LifestyleCard({ image, index }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })
  return (
    <div ref={ref} className={`${image.span} relative overflow-hidden rounded-[20px] group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 120}ms` }}>
      <img src={image.src} alt={image.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {image.text && (
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-cormorant text-[1.6rem] text-white font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{image.text}</p>
          <p className="text-[11px] text-white/70 tracking-wide">{image.subtext}</p>
        </div>
      )}
    </div>
  )
}

'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Link from 'next/link'

const collections = [
  { title: 'Bagues', subtitle: 'Élégance au bout des doigts', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800', href: '/catalogue?category=bagues', size: 'large', color: '#88292F' },
  { title: 'Colliers', subtitle: 'Autour du cou, avec âme', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', href: '/catalogue?category=colliers', size: 'small', color: '#A27E8E' },
  { title: 'Bracelets', subtitle: 'Des poignets sublimés', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800', href: '/catalogue?category=bracelets', size: 'small', color: '#A77464' },
  { title: 'Traditionnel', subtitle: "L'héritage marocain", image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', href: '/catalogue?category=traditionnel', size: 'large', color: '#4D6A6D' },
]

export default function CollectionGrid() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal()
  return (
    <section id="collections" className="px-5 py-20">
      <div ref={titleRef} className={`mb-12 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] tracking-[3px] text-[#88292F] uppercase block mb-2">nos collections</span>
        <h2 className="font-cormorant text-[2.8rem] font-medium leading-none text-[#2e1e0f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Explorer par<br />Catégorie</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {collections.map((col, index) => (
          <CollectionCard key={col.title} collection={col} index={index} />
        ))}
      </div>
    </section>
  )
}

function CollectionCard({ collection, index }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })
  const isLarge = collection.size === 'large'
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[24px] group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isLarge ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <Link href={collection.href} className="block w-full h-full">
        <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: collection.color }} />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-cormorant text-[1.8rem] text-white font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{collection.title}</h3>
          <p className="text-[12px] text-white/70 tracking-wide">{collection.subtitle}</p>
        </div>
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-[24px] transition-all duration-500" />
      </Link>
    </div>
  )
}

import Link from 'next/link'

export default function HeroCarousel() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#21171d]">
      <div className="absolute inset-0 bg-cover bg-center scale-[1.01]" style={{ backgroundImage: "url('/lilookheropic.jpeg')" }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,15,20,.78)_0%,rgba(25,15,20,.36)_50%,rgba(25,15,20,.08)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#21171d]/65 via-transparent to-[#21171d]/20" />
      <div className="relative z-10 min-h-[92svh] max-w-[1280px] mx-auto px-6 md:px-12 flex items-end md:items-center pb-16 pt-32 md:pb-0">
        <div className="max-w-[650px] text-white">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/65 mb-5">Tanger · Bijoux en acier inoxydable</p>
          <h1 className="font-cormorant text-[3.7rem] sm:text-[5rem] md:text-[7rem] leading-[0.84] font-light tracking-[-0.035em]">
            Le détail qui<span className="block italic text-[#efc8d2] ml-[12%]">change tout.</span>
          </h1>
          <p className="mt-7 max-w-md text-[13px] md:text-[15px] leading-7 text-white/75">Des pièces faciles à porter, choisies pour durer et pensées pour accompagner chaque version de vous.</p>
          <div className="mt-8 flex items-center gap-5">
            <Link href="/catalogue" className="bg-white text-[#21171d] px-7 py-3.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#efc8d2] transition-colors">Voir la collection</Link>
            <Link href="/catalogue?filter=trending" className="text-[10px] tracking-[0.2em] uppercase border-b border-white/50 pb-1 hover:border-white transition-colors">Les tendances</Link>
          </div>
        </div>
      </div>
      <div className="absolute right-6 md:right-12 bottom-7 text-[9px] tracking-[0.22em] uppercase text-white/45 [writing-mode:vertical-rl]">Acier · Waterproof · Tanger</div>
    </section>
  )
}

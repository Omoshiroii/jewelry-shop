'use client'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Newsletter() {
  const { ref, isVisible } = useScrollReveal()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => { setSubmitted(false); setEmail('') }, 3000)
    }
  }

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAE0CC]/50 via-[#FCB9B2]/10 to-[#FED0BB]/30 -z-10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCB9B2]/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c8a27b]/10 rounded-full blur-3xl -z-10" />

      <div ref={ref} className={`max-w-md mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <span className="text-[10px] tracking-[3px] text-[#88292F] uppercase block mb-3">newsletter</span>
        <h2 className="font-cormorant text-[2.4rem] font-medium leading-[1.05] text-[#2e1e0f] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Restez <em className="italic font-light text-[#88292F]">inspirée</em>
        </h2>
        <p className="text-[14px] leading-[1.8] text-[#8e7f74] mb-8">
          Recevez en avant-première nos nouvelles collections, nos offres exclusives et les histoires derrière chaque création.
        </p>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre adresse email" className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border border-[#e8e0d8] rounded-full text-[14px] text-[#2e1e0f] placeholder:text-[#b5a89e] outline-none focus:border-[#88292F] transition-colors duration-300 pr-14" required />
            <button type="submit" className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${submitted ? 'bg-[#4D6A6D] text-white' : 'bg-[#2e1e0f] text-white hover:bg-[#88292F]'}`}>
              {submitted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              )}
            </button>
          </div>
          {submitted && <p className="mt-3 text-[12px] text-[#4D6A6D] animate-fade-in">Merci ! Vous êtes inscrite à notre newsletter.</p>}
        </form>
        <p className="mt-4 text-[10px] text-[#b5a89e] tracking-wide">Pas de spam, que de l&apos;élégance. Désinscription à tout moment.</p>
      </div>
    </section>
  )
}

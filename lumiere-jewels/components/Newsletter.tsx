'use client'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Send, Check } from 'lucide-react'

export default function Newsletter() {
  const { ref, isVisible } = useScrollReveal()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <section className="py-20 px-6">
      <div
        ref={ref}
        className={`max-w-md mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase block mb-3">
          newsletter
        </span>
        <h2
          className="font-cormorant text-[2.4rem] font-medium leading-[1.05] text-[#2e1e0f] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Restez <em className="italic font-light">inspirée</em>
        </h2>
        <p className="text-[14px] leading-[1.8] text-[#8e7f74] mb-8">
          Recevez en avant-première nos nouvelles collections, nos offres exclusives 
          et les histoires derrière chaque création.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border border-[#e8e0d8] rounded-full text-[14px] text-[#2e1e0f] placeholder:text-[#b5a89e] outline-none focus:border-[#c8a27b] transition-colors duration-300 pr-14"
              required
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                submitted 
                  ? 'bg-[#4D6A6D] text-white' 
                  : 'bg-[#2e1e0f] text-white hover:bg-[#c8a27b]'
              }`}
            >
              {submitted ? <Check size={16} /> : <Send size={16} strokeWidth={1.5} />}
            </button>
          </div>

          {submitted && (
            <p className="mt-3 text-[12px] text-[#4D6A6D] animate-fade-in">
              Merci ! Vous êtes inscrite à notre newsletter.
            </p>
          )}
        </form>

        <p className="mt-4 text-[10px] text-[#b5a89e] tracking-wide">
          Pas de spam, que de l'élégance. Désinscription à tout moment.
        </p>
      </div>
    </section>
  )
}

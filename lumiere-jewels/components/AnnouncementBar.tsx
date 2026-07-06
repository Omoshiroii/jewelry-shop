'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

const INSTAGRAM_URL = 'https://www.instagram.com/lilook51/'

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin') || dismissed) {
    return null
  }

  return (
    <div className="w-full bg-[#1e1424] overflow-hidden" style={{ height: '32px' }}>
      <div className="h-full flex items-center justify-between px-3 relative">
        {/* Instagram icon — left */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#f0c4d0]/60 hover:text-[#d4849a] transition-colors duration-300 flex-shrink-0"
          aria-label="Instagram LILOOK"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </a>

        {/* Marquee — center */}
        <div className="flex-1 flex items-center overflow-hidden whitespace-nowrap mx-2">
          <div className="animate-marquee flex items-center gap-8">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-6 text-[9px] tracking-[2px] text-[#f0c4d0]/70 font-inter uppercase">
                <span>Bijoux en acier inoxydable</span>
                <span>•</span>
                <span>Waterproof &amp; anti-ternissement</span>
                <span>•</span>
                <span>Livraison gratuite au Maroc</span>
                <span>•</span>
                <span>Paiement à la livraison</span>
              </span>
            ))}
          </div>
        </div>

        {/* Close button — right */}
        <button
          onClick={() => setDismissed(true)}
          className="w-5 h-5 flex items-center justify-center text-[#f0c4d0]/40 hover:text-[#d4849a] transition-colors flex-shrink-0"
          aria-label="Fermer"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}

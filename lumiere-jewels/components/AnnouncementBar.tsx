'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  // Hide on admin pages
  if (pathname?.startsWith('/admin') || dismissed) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full z-[60] bg-[#2f2723] overflow-hidden" style={{ height: '32px' }}>
      <div className="h-full flex items-center justify-center relative">
        {/* Marquee */}
        <div className="flex items-center overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee flex items-center gap-8" style={{ animationDuration: '30s' }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 text-[10px] tracking-[2px] text-[#e5c5a4]/80 font-inter uppercase">
                <span>✦ Livraison gratuite partout au Maroc</span>
                <span>✦ Paiement à la livraison</span>
                <span>✦ Bijoux d&apos;exception faits main</span>
                <span>✦ Support WhatsApp 24/7</span>
              </span>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#e5c5a4]/40 hover:text-[#e5c5a4] transition-colors"
          aria-label="Fermer"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}

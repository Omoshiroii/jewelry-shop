'use client'
import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronRight, Phone } from 'lucide-react'

const menuCategories = [
  { value: 'tout', label: 'Tout' },
  { value: 'bagues', label: 'Bagues' },
  { value: 'colliers', label: 'Colliers' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'boucles', label: 'Boucles d\'oreilles' },
  { value: 'traditionnel', label: 'Traditionnel' },
  { value: 'pendentifs', label: 'Pendentifs' },
  { value: 'ensembles', label: 'Ensembles' },
]

const menuSections = [
  { label: 'NOUVEAUTÉS', href: '/catalogue?sort=newest', hasArrow: true },
  { label: 'TENDANCES', href: '/catalogue?filter=trending', hasArrow: true },
  { label: 'PROMOTIONS', href: '/catalogue?filter=promotions', hasArrow: true },
]

const WHATSAPP_NUMBER = '212600000000'
const INSTAGRAM_URL = 'https://www.instagram.com/lilook51/'

interface MenuDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#1e1424]/40 backdrop-blur-sm z-[998] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[360px] z-[999] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(160deg, #fdf0f3 0%, #fff8fa 60%, #fdf0f3 100%)',
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0c4d0]/30">
          <Link href="/" onClick={onClose}>
            <span className="font-cormorant text-[22px] font-semibold tracking-[4px] text-[#1e1424]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              LILOOK
            </span>
          </Link>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5e4ea] transition-colors duration-300"
            aria-label="Fermer le menu"
          >
            <X size={18} strokeWidth={1.5} className="text-[#1e1424]" />
          </button>
        </div>

        {/* Brand tagline */}
        <div className="px-6 py-3 bg-[#f5e4ea]/50">
          <p className="text-[9px] tracking-[2px] text-[#9b6b7f] uppercase">
            Acier inoxydable · Waterproof · Anti-ternissement
          </p>
        </div>

        {/* Menu Content */}
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-130px)]">
          {/* Main Sections */}
          <div className="mb-6">
            {menuSections.map((section) => (
              <Link
                key={section.label}
                href={section.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 border-b border-[#f0c4d0]/30 group"
                onMouseEnter={() => setHoveredItem(section.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className={`font-inter text-[12px] tracking-[2.5px] transition-all duration-300 ${
                  hoveredItem === section.label ? 'text-[#d4849a] translate-x-1' : 'text-[#1e1424]'
                }`}>
                  {section.label}
                </span>
                {section.hasArrow && (
                  <ChevronRight size={15} strokeWidth={1.5} className={`text-[#d4849a] transition-transform duration-300 ${hoveredItem === section.label ? 'translate-x-1' : ''}`} />
                )}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-10 h-px bg-[#d4849a] mb-6" />

          {/* Categories */}
          <div className="mb-6">
            <p className="font-inter text-[9px] tracking-[3px] text-[#9b6b7f] mb-4 uppercase">Collections</p>
            {menuCategories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === 'tout' ? '/catalogue' : `/catalogue?category=${cat.value}`}
                onClick={onClose}
                className="flex items-center justify-between py-3 border-b border-[#f0c4d0]/20 group"
                onMouseEnter={() => setHoveredItem(cat.value)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className={`font-inter text-[12px] tracking-[1.5px] transition-all duration-300 flex items-center gap-2 ${
                  hoveredItem === cat.value ? 'text-[#d4849a] translate-x-1' : 'text-[#4a3550]'
                }`}>
                  {cat.label}
                </span>
                <ChevronRight size={13} strokeWidth={1.5} className={`text-[#d4849a] opacity-0 transition-all duration-300 ${hoveredItem === cat.value ? 'opacity-100 translate-x-1' : ''}`} />
              </Link>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="pt-6 border-t border-[#f0c4d0]/30 space-y-4">
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 text-[#4a3550] hover:text-[#d4849a] transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="font-inter text-[12px] tracking-[1.5px]">@lilook51</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 text-[#4a3550] hover:text-[#d4849a] transition-colors duration-300"
            >
              <Phone size={14} strokeWidth={1.5} />
              <span className="font-inter text-[12px] tracking-[1.5px]">Nous Contacter</span>
            </a>

            {/* Admin Access */}
            <div className="pt-4 border-t border-[#f0c4d0]/20">
              <Link href="/admin" onClick={onClose} className="text-[#9b6b7f] hover:text-[#d4849a] transition-colors duration-300">
                <span className="font-inter text-[9px] tracking-[2px] uppercase">Accès Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronRight } from 'lucide-react'

const menuCategories = [
  { value: 'tout', label: 'Tout' },
  { value: 'bagues', label: 'Bagues' },
  { value: 'colliers', label: 'Colliers' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'boucles', label: 'Boucles' },
  { value: 'traditionnel', label: 'Traditionnel' },
  { value: 'pendentifs', label: 'Pendentifs' },
  { value: 'ensembles', label: 'Ensembles' },
  { value: 'autres', label: 'Autres' },
]

const menuSections = [
  { label: 'NOUVEAUTÉS', href: '/catalogue?sort=newest', hasArrow: true },
  { label: 'TENDANCES', href: '/catalogue?filter=trending', hasArrow: true },
  { label: 'PROMOTIONS', href: '/catalogue?filter=promotions', hasArrow: true },
]

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
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[998] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-[#faf8f5] z-[999] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6 pb-2">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0ebe5] transition-colors duration-300"
            aria-label="Fermer le menu"
          >
            <X size={20} strokeWidth={1.5} className="text-[#2f2723]" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="px-8 py-4 overflow-y-auto h-[calc(100%-80px)]">
          {/* Main Sections */}
          <div className="mb-8">
            {menuSections.map((section) => (
              <Link
                key={section.label}
                href={section.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 border-b border-[#e8e0d8] group"
                onMouseEnter={() => setHoveredItem(section.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span
                  className={`font-inter text-[13px] tracking-[2.5px] transition-all duration-300 ${
                    hoveredItem === section.label
                      ? 'text-[#c8a27b] translate-x-1'
                      : 'text-[#2f2723]'
                  }`}
                >
                  {section.label}
                </span>
                {section.hasArrow && (
                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className={`text-[#c8a27b] transition-transform duration-300 ${
                      hoveredItem === section.label ? 'translate-x-1' : ''
                    }`}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-[#c8a27b] mb-8" />

          {/* Categories */}
          <div className="mb-8">
            <p className="font-inter text-[10px] tracking-[3px] text-[#8e7f74] mb-4 uppercase">
              Collections
            </p>
            {menuCategories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === 'tout' ? '/catalogue' : `/catalogue?category=${cat.value}`}
                onClick={onClose}
                className="flex items-center justify-between py-3 border-b border-[#f0ebe5] group"
                onMouseEnter={() => setHoveredItem(cat.value)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span
                  className={`font-inter text-[12px] tracking-[2px] transition-all duration-300 ${
                    hoveredItem === cat.value
                      ? 'text-[#c8a27b] translate-x-1'
                      : 'text-[#5a4f47]'
                  }`}
                >
                  {cat.label.toUpperCase()}
                </span>
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  className={`text-[#c8a27b] opacity-0 transition-all duration-300 ${
                    hoveredItem === cat.value ? 'opacity-100 translate-x-1' : ''
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-auto pt-8 border-t border-[#e8e0d8]">
            <div className="space-y-4 mb-8">
              <Link
                href="/favoris"
                onClick={onClose}
                className="flex items-center gap-3 text-[#5a4f47] hover:text-[#c8a27b] transition-colors duration-300"
              >
                <span className="font-inter text-[12px] tracking-[1.5px]">Mes Favoris</span>
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center gap-3 text-[#5a4f47] hover:text-[#c8a27b] transition-colors duration-300"
              >
                <span className="font-inter text-[12px] tracking-[1.5px]">Nous Contacter</span>
              </Link>
            </div>

            {/* Admin Access */}
            <div className="pt-4 border-t border-[#f0ebe5]">
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-2 text-[#8e7f74] hover:text-[#c8a27b] transition-colors duration-300"
              >
                <span className="font-inter text-[10px] tracking-[2px] uppercase">Accès Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

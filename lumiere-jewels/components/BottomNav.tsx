'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2X2, Heart, Phone } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

const WHATSAPP_NUMBER = '+212 600-000000'

const links = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/catalogue', label: 'Catalogue', icon: Grid2X2 },
  { href: '/favoris', label: 'Favoris', icon: Heart },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { favoriteCount } = useFavorites()

  // Hide public navigation on admin paths
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/50 md:hidden py-2.5 px-2">
      <div className="flex justify-around items-center">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1"
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={active ? 'text-[#c8a27b]' : 'text-[#8e7f74]'}
                />
                {href === '/favoris' && favoriteCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#c8a27b] text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] tracking-wide uppercase font-inter ${active ? 'text-[#c8a27b]' : 'text-[#8e7f74]'
                  }`}
              >
                {label}
              </span>
            </Link>
          )
        })}

        {/* WhatsApp Contact Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex flex-col items-center gap-0.5 px-4 py-1"
        >
          <Phone
            size={20}
            strokeWidth={1.5}
            className="text-[#8e7f74]"
          />
          <span className="text-[9px] tracking-wide uppercase font-inter text-[#8e7f74]">
            Contact
          </span>
        </a>
      </div>
    </nav>
  )
}

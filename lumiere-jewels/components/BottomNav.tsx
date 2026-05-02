'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2X2, Heart, Phone } from 'lucide-react'

const links = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/catalogue', label: 'Catalogue', icon: Grid2X2 },
  { href: '/favoris', label: 'Favoris', icon: Heart },
  { href: '/contact', label: 'Contact', icon: Phone },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
<nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-rose-light md:hidden">      
      <div className="flex justify-around items-center py-2 pb-safe">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className={active ? 'text-rose-dusty' : 'text-gray-400'}
              />
              <span
                className={`text-[9px] tracking-wide uppercase font-inter ${
                  active ? 'text-rose-dusty' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Heart, ShoppingBag } from 'lucide-react'
import MenuDrawer from './MenuDrawer'
import SearchBar from './SearchBar'
import CartDrawer from './CartDrawer'
import AnnouncementBar from './AnnouncementBar'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { favoriteCount } = useFavorites()
  const { cartCount } = useCart()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
        {/* Announcement strip — stacked above nav */}
        <AnnouncementBar />

        {/* Main navigation */}
        <nav
          className="w-full px-5 py-3 flex items-center justify-between relative"
          style={{
            background: 'rgba(253, 240, 243, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(240, 196, 208, 0.25)',
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5e4ea] transition-colors duration-300"
              aria-label="Menu"
            >
              <Menu size={20} strokeWidth={1.5} className="text-[#1e1424]" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5e4ea] transition-colors duration-300"
              aria-label="Rechercher"
            >
              <Search size={17} strokeWidth={1.5} className="text-[#1e1424]" />
            </button>
          </div>

          {/* Center: Brand */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 group">
            <span
              className="font-cormorant text-[22px] font-semibold tracking-[5px] text-[#1e1424] group-hover:text-[#d4849a] transition-colors duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              LILOOK
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-1">
            <Link
              href="/favoris"
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5e4ea] transition-colors duration-300"
              aria-label="Favoris"
            >
              <Heart size={18} strokeWidth={1.5} className="text-[#1e1424]" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d4849a] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5e4ea] transition-colors duration-300"
              aria-label="Panier"
            >
              <ShoppingBag size={18} strokeWidth={1.5} className="text-[#1e1424]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d4849a] text-white text-[9px] font-medium rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

'use client'
import Link from 'next/link'
import { Search, Heart } from 'lucide-react'

export default function Navbar() {
  return (
<nav className="sticky top-0 z-50 bg-white border-b border-rose-light px-6 py-3 flex items-center justify-between max-w-7xl mx-auto w-full">      
      <Link href="/">
        <span className="font-cormorant text-2xl font-light tracking-[4px] text-ink">
          LILOOK
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <button aria-label="Rechercher">
          <Search size={18} strokeWidth={1.5} className="text-ink" />
        </button>
        <button aria-label="Favoris">
          <Heart size={18} strokeWidth={1.5} className="text-ink" />
        </button>
      </div>
    </nav>
  )
}
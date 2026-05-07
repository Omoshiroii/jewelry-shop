'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight } from 'lucide-react'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Popular search suggestions
  const popularSearches = ['Bague', 'Collier', 'Or', 'Diamant', 'Traditionnel', 'Bracelet']

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[996] transition-opacity duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Search Panel */}
      <div
        className={`fixed top-0 left-0 w-full bg-[#faf8f5] z-[997] shadow-lg transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          {/* Search Input */}
          <div className="flex items-center gap-4 mb-8">
            <Search size={20} strokeWidth={1.5} className="text-[#8e7f74] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher un bijou..."
              className="flex-1 bg-transparent font-inter text-[16px] text-[#2f2723] placeholder:text-[#b5a89e] outline-none tracking-wide"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0ebe5] transition-colors"
              >
                <X size={16} strokeWidth={1.5} className="text-[#8e7f74]" />
              </button>
            )}
            <button
              onClick={() => handleSearch(query)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2f2723] text-white hover:bg-[#c8a27b] transition-colors duration-300"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Popular Searches */}
          <div>
            <p className="font-inter text-[10px] tracking-[3px] text-[#8e7f74] mb-4 uppercase">
              Recherches populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 rounded-full border border-[#e8e0d8] font-inter text-[12px] text-[#5a4f47] tracking-[1px] hover:border-[#c8a27b] hover:text-[#c8a27b] hover:bg-[#faf6f1] transition-all duration-300"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'

const categories = [
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

function CatalogueContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('tout')
  const [showFilters, setShowFilters] = useState(false)

  const query = searchParams.get('q') || ''
  const sortParam = searchParams.get('sort') || ''
  const filterParam = searchParams.get('filter') || ''
  const categoryParam = searchParams.get('category') || ''

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam)
  }, [categoryParam])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const supabase = createClient()
    let queryBuilder = supabase.from('products').select('*')

    // Handle special filters
    if (filterParam === 'trending') {
      queryBuilder = queryBuilder.eq('is_trending', true)
    } else if (filterParam === 'promotions') {
      queryBuilder = queryBuilder.gt('discount_percentage', 0)
    }

    // Handle sorting
    if (sortParam === 'newest') {
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    const { data } = await queryBuilder
    if (data) {
      setProducts(data)
      applyFilters(data, activeCategory, query)
    }
    setLoading(false)
  }

  function applyFilters(data: Product[], category: string, searchQuery: string) {
    let result = [...data]

    // Category filter
    if (category !== 'tout') {
      result = result.filter(p => p.category === category)
    }

    // Search filter (title, description, category)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    }

    setFilteredProducts(result)
  }

  useEffect(() => {
    applyFilters(products, activeCategory, query)
  }, [activeCategory, query, products])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    // Update URL without reload
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'tout') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    router.replace(`/catalogue?${params.toString()}`, { scroll: false })
  }

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.replace(`/catalogue?${params.toString()}`, { scroll: false })
  }

  // Split into pairs for editorial layout
  const productPairs = []
  for (let i = 0; i < filteredProducts.length; i += 2) {
    productPairs.push(filteredProducts.slice(i, i + 2))
  }

  // Determine page title
  let pageTitle = 'Catalogue'
  let pageSubtitle = 'Toutes nos pièces'
  if (query) {
    pageTitle = `Résultats`
    pageSubtitle = `pour "${query}"`
  } else if (filterParam === 'trending') {
    pageTitle = 'Tendances'
    pageSubtitle = 'Nos pièces favorites'
  } else if (filterParam === 'promotions') {
    pageTitle = 'Promotions'
    pageSubtitle = 'Offres spéciales'
  } else if (sortParam === 'newest') {
    pageTitle = 'Nouveautés'
    pageSubtitle = 'Dernières arrivées'
  } else if (categoryParam && categoryParam !== 'tout') {
    const cat = categories.find(c => c.value === categoryParam)
    pageTitle = cat?.label || 'Catalogue'
    pageSubtitle = 'Collection'
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Header */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} className="text-[#2f2723]" />
          </button>
          <div>
            <span className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase">
              {pageSubtitle}
            </span>
            <h1
              className="font-cormorant text-[2.4rem] font-medium leading-none text-[#2f2723]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Search indicator */}
        {query && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[12px] text-[#8e7f74]">
              {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-[11px] text-[#c8a27b] hover:bg-white transition-colors"
            >
              Effacer <X size={12} />
            </button>
          </div>
        )}

        {/* Category Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 mb-4 text-[12px] tracking-[2px] text-[#8e7f74] uppercase"
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
          {showFilters ? 'Masquer filtres' : 'Filtrer'}
        </button>

        {/* Category Pills */}
        <div className={`flex gap-2 overflow-x-auto pb-4 scrollbar-hide transition-all duration-300 ${showFilters ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`flex-shrink-0 px-5 py-2 rounded-full border text-[11px] tracking-[1px] transition-all duration-300 ${
                activeCategory === cat.value
                  ? 'border-[#c8a27b] bg-[#c8a27b] text-white'
                  : 'border-[rgba(200,162,123,0.3)] bg-white/60 text-[#8e7f74] hover:border-[#c8a27b]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="px-5 pb-32">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-[#c8a27b] mb-4">Aucune pièce trouvée</p>
            <p className="text-[13px] text-[#8e7f74]">Essayez une autre recherche ou catégorie</p>
          </div>
        ) : (
          <div className="space-y-12">
            {productPairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="grid grid-cols-2 gap-4">
                {pair.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  )
}

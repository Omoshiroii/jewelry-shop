'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useFavorites } from '@/hooks/useFavorites'
import { ArrowLeft, Heart } from 'lucide-react'

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites, favoriteCount } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [favorites])

  async function fetchFavoriteProducts() {
    setLoading(true)
    const supabase = createClient()

    // Fetch all favorite products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', favorites)

    if (error) {
      console.error('Error fetching favorites:', error)
      setLoading(false)
      return
    }

    if (data) {
      // Maintain the order based on favorites array (newest first)
      const ordered = favorites
        .map(id => data.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined)
      setProducts(ordered)
    }
    setLoading(false)
  }

  const productPairs = []
  for (let i = 0; i < products.length; i += 2) {
    productPairs.push(products.slice(i, i + 2))
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="h-16" />

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
              {favoriteCount} article{favoriteCount !== 1 ? 's' : ''}
            </span>
            <h1
              className="font-cormorant text-[2.4rem] font-medium leading-none text-[#2f2723]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Mes Favoris
            </h1>
          </div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-[#c8a27b] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} strokeWidth={1} className="text-[#e8e0d8] mx-auto mb-4" />
            <p className="font-cormorant text-2xl text-[#c8a27b] mb-3">Aucun favori</p>
            <p className="text-[13px] text-[#8e7f74] mb-6 max-w-[260px] mx-auto">
              Cliquez sur le cœur sur les produits pour les ajouter à vos favoris
            </p>
            <button
              onClick={() => router.push('/catalogue')}
              className="px-6 py-3 bg-[#2f2723] text-white rounded-full text-[13px] tracking-[1px] hover:bg-[#c8a27b] transition-colors duration-300"
            >
              Explorer le Catalogue
            </button>
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

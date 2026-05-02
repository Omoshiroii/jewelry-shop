'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Product } from '@/types'

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProducts() {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'tout') {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (!error && data) setProducts(data)
      setLoading(false)
    }

    fetchProducts()

    // realtime — updates instantly when owner adds a product
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [category])

  return { products, loading }
}
'use client'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'lilook-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load favorites:', e)
    }
    setIsReady(true)
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }
  }, [favorites, isReady])

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      }
      return [...prev, productId]
    })
  }, [])

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId)
  }, [favorites])

  const favoriteCount = favorites.length

  return { favorites, toggleFavorite, isFavorite, favoriteCount, isReady }
}

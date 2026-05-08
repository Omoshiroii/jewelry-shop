'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'lilook-favorites'

// Module-level shared state (singleton)
let globalFavorites: string[] = []
let isInitialized = false
const listeners = new Set<(favs: string[]) => void>()

function loadFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    return []
  }
}

function saveToStorage(favs: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
}

function notifyListeners() {
  listeners.forEach(fn => fn([...globalFavorites]))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    // Initialize global state once
    if (!isInitialized) {
      globalFavorites = loadFromStorage()
      isInitialized = true
    }

    // Set local state from global
    if (isMounted.current) {
      setFavorites([...globalFavorites])
      setIsReady(true)
    }

    // Subscribe to changes
    const handleUpdate = (favs: string[]) => {
      if (isMounted.current) {
        setFavorites(favs)
      }
    }
    listeners.add(handleUpdate)

    return () => {
      isMounted.current = false
      listeners.delete(handleUpdate)
    }
  }, [])

  const toggleFavorite = useCallback((productId: string) => {
    if (globalFavorites.includes(productId)) {
      globalFavorites = globalFavorites.filter(id => id !== productId)
    } else {
      globalFavorites = [...globalFavorites, productId]
    }
    saveToStorage(globalFavorites)
    notifyListeners()
  }, [])

  const isFavorite = useCallback((productId: string) => {
    return globalFavorites.includes(productId)
  }, [])

  const removeFavorite = useCallback((productId: string) => {
    globalFavorites = globalFavorites.filter(id => id !== productId)
    saveToStorage(globalFavorites)
    notifyListeners()
  }, [])

  const favoriteCount = favorites.length

  return { favorites, toggleFavorite, isFavorite, removeFavorite, favoriteCount, isReady }
}

'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export type CartItem = {
  id: string
  title: string
  price: number
  quantity: number
  image: string | null
  category: string
}

const STORAGE_KEY = 'lilook-cart'

// Module-level shared state (singleton)
let globalCart: CartItem[] = []
let isInitialized = false
const listeners = new Set<(cart: CartItem[]) => void>()

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    return []
  }
}

function saveToStorage(cart: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

function notifyListeners() {
  listeners.forEach(fn => fn([...globalCart]))
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    // Initialize global state once
    if (!isInitialized) {
      globalCart = loadFromStorage()
      isInitialized = true
    }

    // Set local state from global
    if (isMounted.current) {
      setCart([...globalCart])
      setIsReady(true)
    }

    // Subscribe to changes
    const handleUpdate = (newCart: CartItem[]) => {
      if (isMounted.current) {
        setCart(newCart)
      }
    }
    listeners.add(handleUpdate)

    return () => {
      isMounted.current = false
      listeners.delete(handleUpdate)
    }
  }, [])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const existingIndex = globalCart.findIndex(i => i.id === item.id)
    if (existingIndex > -1) {
      globalCart[existingIndex].quantity += quantity
    } else {
      globalCart = [...globalCart, { ...item, quantity }]
    }
    saveToStorage(globalCart)
    notifyListeners()
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    globalCart = globalCart.filter(item => item.id !== productId)
    saveToStorage(globalCart)
    notifyListeners()
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      globalCart = globalCart.filter(item => item.id !== productId)
    } else {
      globalCart = globalCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    }
    saveToStorage(globalCart)
    notifyListeners()
  }, [])

  const clearCart = useCallback(() => {
    globalCart = []
    saveToStorage(globalCart)
    notifyListeners()
  }, [])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isReady
  }
}

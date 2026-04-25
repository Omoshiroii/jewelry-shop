export type Category = 'bagues' | 'colliers' | 'bracelets' | 'boucles' | 'traditionnel'

export type Product = {
  id: string
  title: string
  description: string | null
  original_price: number
  discount_percentage: number
  category: Category
  images: string[]
  is_trending: boolean
  created_at: string
}
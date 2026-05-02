import { Product } from '@/types'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="font-cormorant text-2xl text-gray-300 mb-2">Aucun bijou trouvé</p>
        <p className="text-xs text-gray-400 font-inter">Revenez bientôt pour de nouvelles pièces</p>
      </div>
    )
  }

  return (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 pb-24">
        {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
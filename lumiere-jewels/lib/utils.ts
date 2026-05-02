export function getSalePrice(originalPrice: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage === 0) return originalPrice
  return originalPrice * (1 - discountPercentage / 100)
}

export function formatPrice(price: number): string {
  return price.toLocaleString('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' MAD'
}

export function hasDiscount(discountPercentage: number): boolean {
  return discountPercentage > 0
}
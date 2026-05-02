'use client'

type Category = 'tout' | 'bagues' | 'colliers' | 'bracelets' | 'boucles' | 'traditionnel'

const categories: { value: Category; label: string }[] = [
  { value: 'tout', label: 'Tout' },
  { value: 'bagues', label: 'Bagues' },
  { value: 'colliers', label: 'Colliers' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'boucles', label: "Boucles d'Oreilles" },
  { value: 'traditionnel', label: 'Traditionnel' },
]

type Props = {
  active: Category
  onChange: (cat: Category) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`
            whitespace-nowrap px-4 py-1.5 rounded-pill text-[11px] tracking-wide font-inter border transition-all
            ${
              active === cat.value
                ? 'bg-rose-dusty text-white border-rose-dusty'
                : 'bg-white text-gray-500 border-rose-light hover:border-rose-dusty'
            }
          `}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
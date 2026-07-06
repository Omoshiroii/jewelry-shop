'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { X, Upload } from 'lucide-react'

type Props = {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

const categories: { value: Category; label: string }[] = [
  { value: 'bagues', label: 'Bagues' },
  { value: 'colliers', label: 'Colliers' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'boucles', label: "Boucles d'Oreilles" },
  { value: 'traditionnel', label: 'Traditionnel' },
]

export default function ProductForm({ product, onSuccess, onCancel }: Props) {
  const isEdit = !!product
  const [title, setTitle] = useState(product?.title ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.original_price?.toString() ?? '')
  const [discount, setDiscount] = useState(product?.discount_percentage?.toString() ?? '0')
  const [category, setCategory] = useState<Category>(product?.category ?? 'bagues')
  const [isTrending, setIsTrending] = useState(product?.is_trending ?? false)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, file)

      if (!uploadError) {
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename)
        newUrls.push(data.publicUrl)
      }
    }

    setImages(prev => [...prev, ...newUrls])
    setUploading(false)
  }

  function removeImage(url: string) {
    setImages(prev => prev.filter(img => img !== url))
  }

  async function handleSubmit() {
    if (!title || !price) {
      setError('Titre et prix sont obligatoires')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()

    const payload = {
      title,
      description,
      original_price: parseFloat(price),
      discount_percentage: parseFloat(discount) || 0,
      category,
      images,
      is_trending: isTrending,
    }

    const { error: saveError } = isEdit
      ? await supabase.from('products').update(payload).eq('id', product!.id)
      : await supabase.from('products').insert(payload)

    if (saveError) {
      setError('Erreur lors de la sauvegarde')
      setSaving(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white w-full max-w-[480px] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 pt-5 pb-3 border-b border-rose-light flex items-center justify-between">
          <h2 className="font-cormorant text-2xl font-light text-ink">
            {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button onClick={onCancel}>
            <X size={20} strokeWidth={1.5} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 font-inter mb-1.5">
              Titre *
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Bague Solitaire Diamant"
              className="w-full border border-rose-light rounded-xl px-4 py-3 text-sm font-inter outline-none focus:border-rose-dusty"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 font-inter mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Diamant brillant 1ct, or rose 18k..."
              rows={3}
              className="w-full border border-rose-light rounded-xl px-4 py-3 text-sm font-inter outline-none focus:border-rose-dusty resize-none"
            />
          </div>

          {/* Price + Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 font-inter mb-1.5">
                Prix (MAD) *
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="45000"
                className="w-full border border-rose-light rounded-xl px-4 py-3 text-sm font-inter outline-none focus:border-rose-dusty"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 font-inter mb-1.5">
                Réduction (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="0"
                min="0"
                max="90"
                className="w-full border border-rose-light rounded-xl px-4 py-3 text-sm font-inter outline-none focus:border-rose-dusty"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 font-inter mb-1.5">
              Catégorie
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full border border-rose-light rounded-xl px-4 py-3 text-sm font-inter outline-none focus:border-rose-dusty bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Trending toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-inter text-ink">Marquer comme Tendance</p>
              <p className="text-[10px] text-gray-400 font-inter">Apparaît en haut de la page</p>
            </div>
            <button
              onClick={() => setIsTrending(!isTrending)}
              className={`w-12 h-6 rounded-full transition-colors ${isTrending ? 'bg-rose-dusty' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${isTrending ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Discount preview */}
          {parseFloat(discount) > 0 && parseFloat(price) > 0 && (
            <div className="bg-rose-pale rounded-xl px-4 py-3 border border-rose-light">
              <p className="text-[10px] tracking-[2px] uppercase text-rose-dusty font-inter mb-1">
                Aperçu du prix
              </p>
              <p className="font-cormorant text-xl text-ink">
                {(parseFloat(price) * (1 - parseFloat(discount) / 100)).toLocaleString('fr-MA')} MAD
                <span className="text-sm text-gray-400 line-through ml-2">
                  {parseFloat(price).toLocaleString('fr-MA')} MAD
                </span>
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 font-inter mb-1.5">
              Photos
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-rose-light rounded-xl py-6 cursor-pointer hover:border-rose-dusty transition-colors">
              <Upload size={24} strokeWidth={1.5} className="text-rose-dusty mb-2" />
              <p className="text-xs text-gray-400 font-inter">
                {uploading ? 'Envoi en cours...' : 'Appuyer pour ajouter des photos'}
              </p>
              <p className="text-[10px] text-gray-300 font-inter mt-1">JPG, PNG jusqu&apos;à 5MB</p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>

            {/* Image previews */}
            {images.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
                {images.map((url, i) => (
                  <div key={i} className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-rose-light">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                    >
                      <X size={10} strokeWidth={2} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-rose-dusty font-inter text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="w-full bg-rose-dusty text-white py-4 rounded-xl font-inter text-sm tracking-wide disabled:opacity-60 mt-2"
          >
            {saving ? 'Sauvegarde...' : isEdit ? 'Enregistrer les modifications' : '+ Ajouter le produit'}
          </button>
        </div>
      </div>
    </div>
  )
}
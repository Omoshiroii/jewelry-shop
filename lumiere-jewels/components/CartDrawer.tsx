'use client'
import { useRouter } from 'next/navigation'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart()
  const router = useRouter()

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-[#2e1e0f]/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-50 bg-[#f7f2ec]/98 backdrop-blur-xl shadow-2xl border-l border-[#e5c5a4]/20 flex flex-col transition-transform duration-500 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e5c5a4]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#2f2723] stroke-[1.5]" />
            <div>
              <h2 className="font-cormorant text-2xl font-medium text-[#2f2723]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Mon Panier
              </h2>
              <p className="text-[10px] text-[#8e7f74] font-inter uppercase tracking-[1px]">
                {cartCount} article{cartCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white hover:shadow-sm transition-all duration-300"
          >
            <X size={18} className="text-[#2f2723]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#e5c5a4]/10 flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-[#c8a27b] stroke-[1.2]" />
              </div>
              <h3 className="font-cormorant text-xl font-medium text-[#2f2723] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Votre panier est vide
              </h3>
              <p className="text-[12px] text-[#8e7f74] max-w-[240px] leading-relaxed mb-6">
                Découvrez nos collections d&apos;exception et ajoutez vos bijoux favoris.
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-3 bg-[#2f2723] text-white rounded-full text-[11px] tracking-[2px] uppercase hover:bg-[#c8a27b] transition-colors duration-300"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/60 border border-[#e5c5a4]/10 rounded-2xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#efe3d7] flex-shrink-0 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#efe3d7] to-[#e8d5c4]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[9px] text-[#c8a27b] tracking-[1.5px] uppercase font-inter block mb-0.5">
                        {item.category}
                      </span>
                      <h4 className="font-cormorant text-[15px] font-medium text-[#2f2723] leading-tight truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#c8a27b] font-medium mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-[#f7f2ec] rounded-lg border border-[#e5c5a4]/15 px-1.5 py-0.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#8e7f74] hover:text-[#2f2723]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-inter text-[#2f2723] font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#8e7f74] hover:text-[#2f2723]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-between items-end">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#bbb] hover:text-[#88292F] p-1 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                    <span className="text-[13px] font-medium text-[#2f2723] font-inter">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 pb-24 md:pb-6 border-t border-[#e5c5a4]/15 bg-white/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[1px] uppercase text-[#8e7f74]">Total partiel</span>
              <span className="font-cormorant text-2xl font-bold text-[#2f2723]">
                {formatPrice(cartTotal)}
              </span>
            </div>
            
            <p className="text-[11px] text-[#8e7f74] text-center leading-relaxed">
              Frais de livraison gratuits dans tout le Maroc. Paiement à la livraison.
            </p>

            <button
              onClick={() => {
                onClose()
                router.push('/checkout')
              }}
              className="w-full bg-gradient-to-r from-[#2f2723] to-[#1a120e] hover:from-[#c8a27b] hover:to-[#a88a5b] text-white py-4 rounded-full font-inter text-xs tracking-[2px] uppercase transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Commander <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

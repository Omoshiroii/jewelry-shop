'use client'
import Link from 'next/link'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'

const WHATSAPP_NUMBER = '212600000000'

export default function Footer() {
  return (
    <footer className="bg-[#2e1e0f] text-white pt-16 pb-8 px-6">
      <div className="max-w-md mx-auto">
        {/* Brand */}
        <div className="text-center mb-10">
          <h3
            className="font-cormorant text-[28px] font-semibold tracking-[4px] text-white mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            LILOOK
          </h3>
          <p className="text-[12px] text-[#C9ADA1] tracking-[2px] uppercase">
            Bijoux qui murmurent l'élégance
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase mb-4">Collections</p>
            <div className="space-y-3">
              {['Bagues', 'Colliers', 'Bracelets', 'Boucles', 'Traditionnel'].map((item) => (
                <Link
                  key={item}
                  href={`/catalogue?category=${item.toLowerCase()}`}
                  className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase mb-4">LILOOK</p>
            <div className="space-y-3">
              <Link href="/catalogue" className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300">
                Notre Collection
              </Link>
              <Link href="/favoris" className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300">
                Mes Favoris
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#3d3028] pt-8 mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
            <span className="text-[13px] text-[#A0A083]">
              Casablanca, Maroc
            </span>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <Phone size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
            <span className="text-[13px] text-[#A0A083] group-hover:text-white transition-colors">
              +212 6 00 00 00 00
            </span>
          </a>
          <div className="flex items-center gap-3">
            <Mail size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
            <span className="text-[13px] text-[#A0A083]">
              contact@lilook.ma
            </span>
          </div>
        </div>

        {/* Social & Legal */}
        <div className="border-t border-[#3d3028] pt-6">
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://instagram.com/lilook51/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#3d3028] hover:border-[#c8a27b] hover:bg-[#c8a27b]/10 transition-all duration-300"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a27b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </a>
          </div>

          <p className="text-center text-[10px] text-[#5a5048] tracking-[1px]">
            © 2026 LILOOK. Tous droits réservés.
          </p>
          <p className="text-center text-[10px] text-[#5a5048] mt-2 flex items-center justify-center gap-1">
            Fait avec <Heart size={10} className="text-[#c8a27b] fill-[#c8a27b]" /> au Maroc
          </p>
        </div>
      </div>
    </footer>
  )
}

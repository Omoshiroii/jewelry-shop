'use client'
import Link from 'next/link'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'

const WHATSAPP_NUMBER = '212771893239'

export default function Footer() {
  return (
    <footer className="bg-[#2f2723] text-white pt-16 pb-8 px-6">
      <div className="max-w-md mx-auto">
        {/* Brand */}
        <div className="text-center mb-10">
          <h3
            className="font-cormorant text-[28px] font-semibold tracking-[4px] text-white mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            LILOOK
          </h3>
          <p className="text-[12px] text-[#a89a8e] tracking-[2px] uppercase">
            Don't look back
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
                  className="block text-[13px] text-[#c4b5a8] hover:text-white transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase mb-4">LILOOK</p>
            <div className="space-y-3">
              <Link href="/catalogue" className="block text-[13px] text-[#c4b5a8] hover:text-white transition-colors duration-300">
                Notre Collection
              </Link>
              <Link href="/favoris" className="block text-[13px] text-[#c4b5a8] hover:text-white transition-colors duration-300">
                Mes Favoris
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[#c4b5a8] hover:text-white transition-colors duration-300"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#3d3530] pt-8 mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
            <span className="text-[13px] text-[#a89a8e]">
                    Stand Lilook Bijoux - Socco Alto Mall en face de Paul, Tanger, Maroc

            </span>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <Phone size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
            <span className="text-[13px] text-[#a89a8e] group-hover:text-white transition-colors">
              +212 6 00 00 00 00
            </span>
          </a>
          <div className="flex items-center gap-3">
            <Mail size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
            <span className="text-[13px] text-[#a89a8e]">
              contact@lilook.ma
            </span>
          </div>
        </div>

        {/* Social & Legal */}
        <div className="border-t border-[#3d3530] pt-6">
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://www.instagram.com/lilook51/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#3d3530] hover:border-[#c8a27b] hover:bg-[#c8a27b]/10 transition-all duration-300"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
            </svg>            
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

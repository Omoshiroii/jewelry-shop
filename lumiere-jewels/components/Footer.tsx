'use client'
import Link from 'next/link'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'

const WHATSAPP_NUMBER = '212600000000'

export default function Footer() {
  return (
    <footer className="relative text-white">
      {/* Dripping wave SVG at top */}
      <div className="relative w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[80px] rotate-180">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#2e1e0f"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#2e1e0f"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#2e1e0f"></path>
        </svg>
      </div>

      <div className="bg-[#2e1e0f] pt-8 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-cormorant text-[28px] font-semibold tracking-[4px] text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>LILOOK</h3>
            <p className="text-[12px] text-[#C9ADA1] tracking-[2px] uppercase">Bijoux qui murmurent l&apos;élégance</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase mb-4">Collections</p>
              <div className="space-y-3">
                {['Bagues', 'Colliers', 'Bracelets', 'Boucles', 'Traditionnel'].map((item) => (
                  <Link key={item} href={`/catalogue?category=${item.toLowerCase()}`} className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300">{item}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[3px] text-[#c8a27b] uppercase mb-4">LILOOK</p>
              <div className="space-y-3">
                <Link href="/catalogue" className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300">Notre Collection</Link>
                <Link href="/favoris" className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300">Mes Favoris</Link>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="block text-[13px] text-[#C9ADA1] hover:text-white transition-colors duration-300">Nous Contacter</a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#3d3028] pt-8 mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
              <span className="text-[13px] text-[#A0A083]">Casablanca, Maroc</span>
            </div>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <Phone size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
              <span className="text-[13px] text-[#A0A083] group-hover:text-white transition-colors">+212 6 00 00 00 00</span>
            </a>
            <div className="flex items-center gap-3">
              <Mail size={16} strokeWidth={1.5} className="text-[#c8a27b] flex-shrink-0" />
              <span className="text-[13px] text-[#A0A083]">contact@lilook.ma</span>
            </div>
          </div>

          <div className="border-t border-[#3d3028] pt-6">
            <div className="flex justify-center gap-6 mb-6">
              <a href="https://instagram.com/lilook51/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#3d3028] hover:border-[#c8a27b] hover:bg-[#c8a27b]/10 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0A083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
            <p className="text-center text-[10px] text-[#5a5048] tracking-[1px]">© 2026 LILOOK. Tous droits réservés.</p>
            <p className="text-center text-[10px] text-[#5a5048] mt-2 flex items-center justify-center gap-1">
              Fait avec <Heart size={10} className="text-[#c8a27b] fill-[#c8a27b]" /> au Maroc
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

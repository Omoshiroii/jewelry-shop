'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SplashScreen() {
  const [phase, setPhase] = useState('entering')
  const pathname = usePathname()

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('holding'), 600)
    const exitTimer = setTimeout(() => setPhase('exiting'), 2100)
    const doneTimer = setTimeout(() => setPhase('done'), 2600)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (pathname?.startsWith('/admin') || phase === 'done') return null

  return (
    <div className={`fixed inset-0 z- flex items-center justify-center bg-[#f7f2ec] transition-opacity duration-700 ease-out ${
      phase === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className={`flex flex-col items-center transition-all duration-700 ease-out ${
        phase === 'entering' ? 'opacity-0 scale-90' : phase === 'exiting' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}>
        <div className="relative w-48 h-48 mb-6">
          <img src="/logo-lilook.png" alt="LILOOK" className="w-full h-full object-contain" />
        </div>
        <p className="font-cormorant text-[14px] tracking-[4px] text-[#8e7f74] uppercase animate-pulse">
          Don&apos;t Look Back
        </p>
        <div className="mt-6 w-16 h-px bg-[#c8a27b]" />
      </div>
    </div>
  )
}

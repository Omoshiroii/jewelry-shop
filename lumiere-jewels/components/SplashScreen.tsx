'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'entering' | 'holding' | 'exiting' | 'done'>('entering')

  useEffect(() => {
    // Phase 1: Logo fades in (0-600ms)
    const holdTimer = setTimeout(() => setPhase('holding'), 600)
    // Phase 2: Hold for 1.5s
    const exitTimer = setTimeout(() => setPhase('exiting'), 2100)
    // Phase 3: Exit animation (300ms)
    const doneTimer = setTimeout(() => setPhase('done'), 2600)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#f7f2ec] transition-opacity duration-700 ease-out ${
        phase === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out ${
          phase === 'entering'
            ? 'opacity-0 scale-90'
            : phase === 'exiting'
            ? 'opacity-0 scale-105'
            : 'opacity-100 scale-100'
        }`}
      >
        {/* Logo Image */}
        <div className="relative w-48 h-48 mb-6">
          <Image
            src="/LILOOK-logo.jpeg"
            alt="LILOOK"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="font-cormorant text-[14px] tracking-[4px] text-[#8e7f74] uppercase animate-pulse">
          Don't Look Back
        </p>

        {/* Decorative line */}
        <div className="mt-6 w-16 h-px bg-[#c8a27b]" />
      </div>
    </div>
  )
}

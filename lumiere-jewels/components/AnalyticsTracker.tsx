'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Do not track admin page visits
    if (!pathname || pathname.startsWith('/admin')) return

    // Generate or fetch session ID from session storage
    let sessionId = sessionStorage.getItem('lilook-session-id')
    if (!sessionId) {
      sessionId = Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 11)
      sessionStorage.setItem('lilook-session-id', sessionId)
    }

    async function logPageView() {
      try {
        const supabase = createClient()
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
        
        await supabase.from('page_views').insert({
          session_id: sessionId,
          page_path: pathname,
          user_agent: userAgent
        })
      } catch (err) {
        console.error('Analytics log failed:', err)
      }
    }

    logPageView()
  }, [pathname])

  return null
}

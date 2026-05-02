'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fdf5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, letterSpacing: '4px', color: '#1a1a1a' }}>lumière</h1>
          <p style={{ fontSize: '10px', letterSpacing: '3px', color: '#C4787C', textTransform: 'uppercase', marginTop: '8px' }}>espace propriétaire</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f0e8e8' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: '100%', border: '1px solid #f0e8e8', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', border: '1px solid #f0e8e8', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ color: '#C4787C', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', background: '#C4787C', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </main>
  )
}
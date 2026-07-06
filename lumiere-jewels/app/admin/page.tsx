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
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf0f3 0%, #f5e4ea 50%, #fdf0f3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', background: 'rgba(212,132,154,0.1)', animation: 'blobMorph 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '250px', height: '250px', borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', background: 'rgba(155,107,127,0.08)', animation: 'blobMorph 10s ease-in-out infinite reverse' }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        {/* Clickable Logo → back to homepage */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 500, letterSpacing: '6px', color: '#1e1424', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d4849a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1e1424')}
            >LILOOK</h1>
          </a>
          <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#d4849a', textTransform: 'uppercase', marginTop: '6px' }}>
            💍 Bijoux en acier ✨ inoxydable & waterproof 🫧
          </p>
          <p style={{ fontSize: '10px', letterSpacing: '1px', color: '#9b6b7f', marginTop: '6px' }}>
            ← <a href="/" style={{ color: '#9b6b7f', textDecoration: 'underline' }}>Retour au site</a>
          </p>
        </div>

        <div style={{ background: 'rgba(255,248,250,0.9)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(240,196,208,0.4)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(212,132,154,0.12)' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#9b6b7f', textAlign: 'center', marginBottom: '28px', fontWeight: 500 }}>
            Espace Administrateur
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9b6b7f', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="votre@email.com"
              style={{ width: '100%', border: '1.5px solid #f0c4d0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fdf0f3', color: '#1e1424', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#d4849a')}
              onBlur={e => (e.target.style.borderColor = '#f0c4d0')}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9b6b7f', marginBottom: '8px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={{ width: '100%', border: '1.5px solid #f0c4d0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fdf0f3', color: '#1e1424', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#d4849a')}
              onBlur={e => (e.target.style.borderColor = '#f0c4d0')}
            />
          </div>

          {error && <p style={{ color: '#8c2f49', fontSize: '12px', textAlign: 'center', marginBottom: '16px', background: 'rgba(140,47,73,0.07)', padding: '10px', borderRadius: '8px' }}>{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 28px',
              border: 'none',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #1e1424, #4a3550)',
              color: 'white',
              borderRadius: '999px',
              fontWeight: 600, fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '1.5px',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(30,20,36,0.25)'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </div>
      </div>
    </main>
  )
}
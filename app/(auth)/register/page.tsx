'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', general: '' })
  const router = useRouter()

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  function validate() {
    const newErrors = { email: '', password: '', general: '' }
    if (!email) newErrors.email = 'E-mail obrigatório'
    else if (!validateEmail(email)) newErrors.email = 'Digite um e-mail válido'
    if (!password) newErrors.password = 'Senha obrigatória'
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({ email: '', password: '', general: '' })

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setErrors(prev => ({
        ...prev,
        general: error.message.includes('User already registered')
          ? 'Este e-mail já está cadastrado. Faça login ou recupere sua senha.'
          : 'Erro ao criar conta. Tente novamente.'
      }))
      setLoading(false)
    } else {
      alert('Sua conta foi criada com sucesso!')
      router.push('/login')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .register-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .register-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .register-input.error-input {
          border-color: rgba(239,68,68,0.5);
          background: rgba(239,68,68,0.05);
        }
        .register-input::placeholder { color: rgba(255,255,255,0.2); }
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #6366f1;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #5558e8;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }
        .bg-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
          z-index: 0;
        }
        @media (max-width: 768px) {
          .right-panel { border-radius: 20px !important; }
          .container { width: 100% !important; max-width: 440px !important; }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '520px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>

        {/* Painel direito */}
        <div className="right-panel" style={{
          width: '100%',
          background: '#111118',
          borderRadius: '20px',
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Logo */}
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '40px',
            justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%', boxShadow: '0 0 12px rgba(99,102,241,0.8)', animation: 'pulse 2s infinite' }} />
            Agendei.app
          </div>

          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              Criar nova conta
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Preencha os dados abaixo para começar</p>
          </div>

          {errors.general && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#f87171' }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={`register-input${errors.email ? ' error-input' : ''}`}
              />
              {errors.email && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '5px' }}>{errors.email}</p>}
            </div>

            {/* Senha */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Senha (mínimo 6 caracteres)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`register-input${errors.password ? ' error-input' : ''}`}
                  style={{ paddingRight: '80px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}
                >
                  {showPassword ? 'ocultar' : 'mostrar'}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '5px' }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <div className="spinner" />
                  Criando conta...
                </>
              ) : 'Criar conta grátis →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0 8px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>já tem conta?</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
                Entrar na conta →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
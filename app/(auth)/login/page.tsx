'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
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
    if (!email) newErrors.email = 'E-mail obrigatorio'
    else if (!validateEmail(email)) newErrors.email = 'Digite um e-mail valido'
    if (!password) newErrors.password = 'Senha obrigatoria'
    else if (password.length < 6) newErrors.password = 'Minimo 6 caracteres'
    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({ email: '', password: '', general: '' })

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrors(prev => ({
        ...prev,
        general: error.message.includes('Invalid')
          ? 'E-mail ou senha incorretos'
          : 'Erro ao entrar. Tente novamente.'
      }))
      setLoading(false)
    } else {
      router.push('/dashboard')
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
        .login-input {
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
        .login-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .login-input.error-input {
          border-color: rgba(239,68,68,0.5);
          background: rgba(239,68,68,0.05);
        }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
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
          .left-panel { display: none !important; }
          .right-panel {
            border-radius: 20px !important;
            border-left: 1px solid rgba(255,255,255,0.06) !important;
          }
          .login-container { width: 100% !important; max-width: 440px !important; }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="login-container" style={{
        display: 'flex',
        width: '900px',
        minHeight: '560px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>

        {/* Painel esquerdo */}
        <div className="left-panel" style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #0a0a0f 100%)',
          borderRadius: '20px 0 0 20px',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRight: 'none',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#6366f1',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(99,102,241,0.8)',
              animation: 'pulse 2s infinite',
            }} />
            Agendei.app
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '32px',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.2,
              }}>
                Gerencie seu<br />
                salao <span style={{ color: '#6366f1' }}>sem stress</span>
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.7,
                marginTop: '12px',
                maxWidth: '280px',
              }}>
                Agendamentos automaticos, confirmacao por WhatsApp e painel completo.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '28px' }}>
              {[['2.4k+', 'Saloes ativos'], ['98%', 'Satisfacao'], ['R$0', 'Para comecar']].map(([num, label]) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#fff',
                  }}>{num}</div>
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}>
                "Reduzi 3 horas de WhatsApp por dia. Meus clientes amam o link de agendamento."
              </p>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.25)',
                marginTop: '10px',
              }}>
                — Ana Silva, Studio Ana • Sao Paulo
              </p>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)' }}>
            2026 Agendei.app
          </div>
        </div>

        {/* Painel direito */}
        <div className="right-panel" style={{
          width: '420px',
          background: '#111118',
          borderRadius: '0 20px 20px 0',
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: '1px solid rgba(99,102,241,0.1)',
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '6px',
            }}>
              Bem-vinda de volta
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              Entre na sua conta para continuar
            </p>
          </div>

          {errors.general && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#f87171',
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={'login-input' + (errors.email ? ' error-input' : '')}
              />
              {errors.email && (
                <p style={{ fontSize: '11px', color: '#f87171', marginTop: '5px' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={'login-input' + (errors.password ? ' error-input' : '')}
                  style={{ paddingRight: '80px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                  }}
                >
                  {showPassword ? 'ocultar' : 'mostrar'}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: '11px', color: '#f87171', marginTop: '5px' }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <Link href="/forgot-password" style={{
                fontSize: '12px',
                color: 'rgba(99,102,241,0.7)',
                textDecoration: 'none',
              }}>
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <div className="spinner" />
                  Entrando...
                </>
              ) : 'Entrar na conta'}
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '4px 0',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                nao tem conta?
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              <Link href="/register" style={{
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 500,
              }}>
                Criar conta gratis
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
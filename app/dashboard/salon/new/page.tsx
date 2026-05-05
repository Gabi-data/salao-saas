'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewSalonPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function toSlug(str: string) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('salons').insert({
      user_id: user.id,
      name,
      slug: toSlug(name),
      phone,
      address,
    })

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .form-input {
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
        .form-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .form-input::placeholder { color: rgba(255,255,255,0.2); }
        
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
        .bg-glow-left {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
          z-index: 0;
        }
        
        .label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        
        .link-preview {
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }
        
        .link-preview span {
          color: #a5b4fc;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .form-container {
            padding: 32px 24px !important;
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-left" />

      <div style={{
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>
        <div style={{
          background: '#111118',
          borderRadius: '20px',
          padding: '48px 44px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '24px',
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
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '24px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '8px',
            }}>
              Cadastrar meu salão
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              Preencha os dados para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="label">Nome do salão</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Studio Ana Silva"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="label">WhatsApp</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(85) 99999-9999"
                className="form-input"
              />
            </div>

            <div>
              <label className="label">Endereço</label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Rua, número, bairro"
                className="form-input"
              />
            </div>

            {name && (
              <div className="link-preview">
                Seu link será: <span>seuapp.com/{toSlug(name)}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Salvando...
                </>
              ) : 'Salvar salão'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
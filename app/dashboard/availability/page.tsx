'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DAYS = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

export default function AvailabilityPage() {
  const [salonId, setSalonId] = useState<string | null>(null)
  const [availability, setAvailability] = useState<any[]>([])
  const [day, setDay] = useState('1')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('18:00')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: salon } = await supabase
        .from('salons')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!salon) { router.push('/dashboard'); return }

      setSalonId(salon.id)

      const { data } = await supabase
        .from('availability')
        .select('*')
        .eq('salon_id', salon.id)
        .order('day_of_week')

      setAvailability(data || [])
      setPageLoading(false)
    }
    load()
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!salonId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('availability')
      .insert({
        salon_id: salonId,
        day_of_week: parseInt(day),
        start_time: start,
        end_time: end,
      })
      .select()
      .single()

    if (error) {
      alert('Erro ao adicionar: ' + error.message)
    } else {
      setAvailability(prev => [...prev, data])
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', id)

    if (!error) {
      setAvailability(prev => prev.filter(a => a.id !== id))
    }
  }

  if (pageLoading) return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
      <div className="spinner"></div>
      <p style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.6)' }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .availability-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .availability-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .availability-input::placeholder { color: rgba(255,255,255,0.2); }
        
        .availability-select {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          outline: none;
          cursor: pointer;
        }
        .availability-select:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .availability-select option {
          background: #111118;
        }
        
        .submit-btn {
          width: 100%;
          padding: 12px;
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
        
        .availability-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .availability-card:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.04);
          transform: translateY(-2px);
        }
        
        .btn-back {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 16px;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-back:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        
        .btn-delete {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-delete:hover {
          background: rgba(239,68,68,0.2);
          border-color: rgba(239,68,68,0.5);
          transform: translateY(-1px);
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
        
        @media (max-width: 768px) {
          .container-main {
            padding: 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-left" />

      <div className="container-main" style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
      }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '24px',
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
            Horários de atendimento
          </div>
          <Link href="/dashboard" className="btn-back">
            ← Voltar
          </Link>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          animation: 'fadeSlideUp 0.5s ease-out',
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '20px',
          }}>Adicionar horário</h2>
          
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
            }}>
              <div>
                <label className="label">Dia</label>
                <select
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="availability-select"
                >
                  {DAYS.map((d, i) => (
                    <option key={i} value={String(i)}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Início</label>
                <input
                  type="time"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  className="availability-input"
                />
              </div>

              <div>
                <label className="label">Fim</label>
                <input
                  type="time"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  className="availability-input"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Adicionando...
                </>
              ) : 'Adicionar horário'}
            </button>
          </form>
        </div>

        <div style={{ animation: 'fadeSlideUp 0.5s ease-out 0.1s forwards', opacity: 0, animationFillMode: 'forwards' }}>
          {availability.length === 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '48px 20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                Nenhum horário cadastrado ainda.
              </p>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {availability.map(a => (
              <div key={a.id} className="availability-card" style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#fff',
                    marginBottom: '4px',
                  }}>{DAYS[a.day_of_week]}</p>
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#a5b4fc',
                  }}>
                    {a.start_time.slice(0,5)} — {a.end_time.slice(0,5)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="btn-delete"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
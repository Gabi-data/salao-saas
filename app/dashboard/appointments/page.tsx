'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
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

      const { data } = await supabase
        .from('appointments')
        .select('*, services(name, price)')
        .eq('salon_id', salon.id)
        .order('scheduled_at', { ascending: false })

      setAppointments(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleCancel(apt: any) {
    const confirmCancel = confirm(
      'Cancelar o agendamento de ' + apt.client_name + '? Uma mensagem sera enviada no WhatsApp dele.'
    )
    if (!confirmCancel) return

    setCancelling(apt.id)

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', apt.id)

    if (error) {
      alert('Erro ao cancelar: ' + error.message)
      setCancelling(null)
      return
    }

    await fetch('/api/appointments/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: apt.id }),
    })

    setAppointments(prev =>
      prev.map(a => a.id === apt.id ? { ...a, status: 'cancelled' } : a)
    )
    setCancelling(null)
  }

  if (loading) return (
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
        
        .appointment-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .appointment-card:hover {
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
        
        .btn-cancel {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-cancel:hover:not(:disabled) {
          background: rgba(239,68,68,0.2);
          border-color: rgba(239,68,68,0.5);
          transform: translateY(-1px);
        }
        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .status-badge {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
          letter-spacing: 0.02em;
          display: inline-block;
        }
        .status-confirmed {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
        }
        .status-cancelled {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
        }
        .status-completed {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
        }
        
        @media (max-width: 768px) {
          .container-main {
            padding: 16px !important;
          }
          .appointment-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .card-right {
            align-self: flex-end !important;
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-left" />

      <div className="container-main" style={{
        maxWidth: '800px',
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
            Todos os agendamentos
          </div>
          <Link href="/dashboard" className="btn-back">
            ← Voltar
          </Link>
        </div>

        {appointments.length === 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '48px 20px',
            textAlign: 'center',
            animation: 'fadeSlideUp 0.5s ease-out',
          }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
              Nenhum agendamento ainda.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {appointments.map((apt, idx) => (
            <div 
              key={apt.id} 
              className="appointment-card" 
              style={{
                padding: '18px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                animation: `fadeSlideUp 0.5s ease-out ${idx * 0.03}s forwards`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              <div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '6px',
                }}>{apt.client_name}</p>
                <p style={{ fontSize: '13px', color: '#a5b4fc', marginBottom: '4px' }}>
                  {apt.services?.name}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(apt.scheduled_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                  {apt.client_phone}
                </p>
              </div>
              <div className="card-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span className={`status-badge ${
                  apt.status === 'confirmed' ? 'status-confirmed' :
                  apt.status === 'cancelled' ? 'status-cancelled' : 'status-completed'
                }`}>
                  {apt.status === 'confirmed' ? 'Confirmado' :
                   apt.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                </span>
                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(apt)}
                    disabled={cancelling === apt.id}
                    className="btn-cancel"
                  >
                    {cancelling === apt.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
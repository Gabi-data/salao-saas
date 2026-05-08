'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [salon, setSalon] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
  try {
    // Buscar dados do salão via API
    const salonRes = await fetch('/api/salons/me', {
      credentials: 'include'
    })
    
    if (!salonRes.ok) {
      if (salonRes.status === 401) {
        router.push('/login')
        return
      }
      setSalon(null)
      setLoading(false)
      return
    }
    
    const { salon: salonData } = await salonRes.json()
    setSalon(salonData)

    if (salonData) {
      const today = new Date().toISOString().split('T')[0]
      const appointmentsRes = await fetch(`/api/appointments?salon_id=${salonData.id}&date=${today}`, {
        credentials: 'include'
      })
      
      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json()
        setAppointments(appointmentsData)
      }
    }
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    setLoading(false)
  }
}
    load()
  }, [])

  async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  router.push('/login')
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
        @keyframes textGlow {
          0% { text-shadow: 0 0 5px rgba(99,102,241,0.3); }
          50% { text-shadow: 0 0 20px rgba(99,102,241,0.6), 0 0 5px rgba(99,102,241,0.8); }
          100% { text-shadow: 0 0 5px rgba(99,102,241,0.3); }
        }
        
        .dashboard-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .dashboard-card:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.04);
          transform: translateY(-2px);
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
        
        .btn-primary {
          background: #6366f1;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover {
          background: #5558e8;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
        }
        
        .btn-secondary {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 9px 19px;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        
        .btn-green {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
        }
        .btn-green:hover {
          background: rgba(34,197,94,0.25);
          border-color: rgba(34,197,94,0.5);
          box-shadow: 0 4px 12px rgba(34,197,94,0.2);
        }
        
        .appointment-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .appointment-item:hover {
          background: rgba(99,102,241,0.05);
          border-color: rgba(99,102,241,0.2);
        }
        
        .salon-name-glow {
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #6366f1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: textGlow 2s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px !important;
          }
          .cards-grid {
            gap: 12px !important;
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-left" />

      <header style={{
        background: 'rgba(17,17,24,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '20px',
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
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '22px',
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 30%, #818cf8 70%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'textGlow 2s ease-in-out infinite',
                letterSpacing: '-0.02em',
              }}>
                {salon ? salon.name : 'Meu Salão'}
              </span>
              <span style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}>
                — painel
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {salon && (
              <a
                href={'/' + salon.slug}
                target="_blank"
                className="btn-secondary btn-green"
                style={{ textDecoration: 'none' }}
              >
                Ver página pública
              </a>
            )}
            <button onClick={handleLogout} className="btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {!salon && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '48px 32px',
            textAlign: 'center',
            animation: 'fadeSlideUp 0.5s ease-out',
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}>🏠</div>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '24px',
            }}>
              Você ainda não cadastrou seu salão.
            </p>
            <Link
              href="/dashboard/salon/new"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              Cadastrar meu salão agora
            </Link>
          </div>
        )}

        {salon && (
          <div style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            <div className="cards-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}>
              <Link href="/dashboard/services" className="dashboard-card" style={{
                padding: '24px 20px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>✂️</div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '4px',
                }}>Serviços</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Gerencie seus serviços</p>
              </Link>

              <Link href="/dashboard/availability" className="dashboard-card" style={{
                padding: '24px 20px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🕐</div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '4px',
                }}>Horários</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Defina sua disponibilidade</p>
              </Link>

              <Link href="/dashboard/appointments" className="dashboard-card" style={{
                padding: '24px 20px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '4px',
                }}>Agendamentos</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Veja todos os agendamentos</p>
              </Link>

              <Link href="/dashboard/salon/edit" className="dashboard-card" style={{
                padding: '24px 20px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '4px',
                }}>Configurações</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Edite seu perfil</p>
              </Link>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '28px',
            }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>📅</span> Agendamentos de hoje
              </h2>
              {appointments.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                    Nenhum agendamento para hoje.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.map(apt => (
                    <div key={apt.id} className="appointment-item" style={{
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
                        }}>{apt.client_name}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                          {apt.services?.name}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#a5b4fc',
                          marginBottom: '4px',
                        }}>
                          {new Date(apt.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          {apt.client_phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
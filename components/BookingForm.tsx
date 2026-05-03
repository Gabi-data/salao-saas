'use client'
import { useState } from 'react'

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface Salon {
  id: string
  name: string
  slug: string
  phone?: string
  address?: string
  description?: string
}

interface BookingFormProps {
  salon: Salon
  services: Service[]
}

export default function BookingForm({ salon, services }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const selectedService = services.find(s => s.id === serviceId)

  const timeSlots = [
    '08:00','08:30','09:00','09:30','10:00','10:30',
    '11:00','11:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30',
  ]

  async function handleSubmit() {
    setLoading(true)
    const scheduled_at = new Date(date + 'T' + time + ':00').toISOString()

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salon_id: salon.id,
        service_id: serviceId,
        client_name: clientName,
        client_phone: clientPhone,
        scheduled_at,
      }),
    })

    if (res.ok) {
      setDone(true)
    } else {
      const data = await res.json()
      alert('Erro: ' + data.error)
    }
    setLoading(false)
  }

  if (done) return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes checkmark {
          from { transform: scale(0) rotate(-10deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
      <div style={{
        textAlign: 'center',
        animation: 'fadeSlideUp 0.6s ease-out forwards',
        maxWidth: '400px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '36px',
          animation: 'checkmark 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}>
          ✅
        </div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '28px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '12px',
        }}>
          Agendado com sucesso!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '8px' }}>
          Ate logo, {clientName}!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '32px' }}>
          Voce recebera uma confirmacao no WhatsApp em breve.
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '24px',
        }}>
          {[
            ['Salao', salon.name],
            ['Servico', selectedService?.name || ''],
            ['Data', date ? new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) : ''],
            ['Horario', time],
            ['Valor', 'R$' + Number(selectedService?.price).toFixed(2)],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: '13px',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
              <span style={{ color: '#fff', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setDone(false); setStep(1); setServiceId(''); setDate(''); setTime(''); setClientName(''); setClientPhone('') }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px 24px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Fazer outro agendamento
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
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
        .service-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .service-card:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-1px);
        }
        .service-card.selected {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3);
        }
        .time-slot {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
        }
        .time-slot:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.3);
          color: #fff;
        }
        .time-slot.selected {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.5);
          color: #a5b4fc;
          font-weight: 500;
        }
        .booking-input {
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
        .booking-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .booking-input::placeholder { color: rgba(255,255,255,0.2); }
        .btn-next {
          width: 100%;
          padding: 14px;
          background: #6366f1;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .btn-next:hover:not(:disabled) {
          background: #5558e8;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
        }
        .btn-next:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn-back {
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 20px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-back:hover {
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }
        .date-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          box-sizing: border-box;
          color-scheme: dark;
        }
        .date-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
      `}</style>

      <div className="bg-grid" />

      {/* Header do salão */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>
              ✂️
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                {salon.name}
              </div>
              {salon.address && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{salon.address}</div>
              )}
            </div>
          </div>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '50px',
            padding: '4px 12px',
            fontSize: '12px',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            Aberto
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,0.04)', height: '2px' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            { num: 1, label: 'Servico' },
            { num: 2, label: 'Horario' },
            { num: 3, label: 'Seus dados' },
          ].map(s => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= s.num ? '#6366f1' : 'rgba(255,255,255,0.06)',
                border: step >= s.num ? 'none' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: step >= s.num ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
                flexShrink: 0,
              }}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{
                fontSize: '12px',
                color: step >= s.num ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </span>
              {s.num < 3 && (
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: step > s.num ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)',
                  marginLeft: '6px',
                  transition: 'all 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Escolher servico */}
        {step === 1 && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out forwards' }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '8px',
            }}>
              Qual servico deseja?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
              Escolha um dos servicos disponiveis
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
              {services.map(s => (
                <div
                  key={s.id}
                  className={`service-card${serviceId === s.id ? ' selected' : ''}`}
                  onClick={() => setServiceId(s.id)}
                >
                  <div>
                    <div style={{ fontWeight: 500, color: '#fff', fontSize: '15px', marginBottom: '4px' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                      {s.duration} minutos
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '16px',
                      fontWeight: 700,
                      color: serviceId === s.id ? '#a5b4fc' : '#fff',
                    }}>
                      R${Number(s.price).toFixed(2)}
                    </div>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: serviceId === s.id ? 'none' : '2px solid rgba(255,255,255,0.2)',
                      background: serviceId === s.id ? '#6366f1' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      color: '#fff',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}>
                      {serviceId === s.id ? '✓' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-next"
              disabled={!serviceId}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
          </div>
        )}

        {/* STEP 2 — Escolher data e horario */}
        {step === 2 && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out forwards' }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '8px',
            }}>
              Quando voce quer vir?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
              Escolha a data e o horario
            </p>

            {/* Resumo do servico */}
            <div style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{selectedService?.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{selectedService?.duration} min</div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#a5b4fc', fontFamily: "'Syne', sans-serif" }}>
                R${Number(selectedService?.price).toFixed(2)}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>

            {date && (
              <div style={{ marginBottom: '32px', animation: 'fadeSlideUp 0.3s ease-out forwards' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Horario disponivel
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      className={`time-slot${time === slot ? ' selected' : ''}`}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-back" onClick={() => setStep(1)}>
                Voltar
              </button>
              <button
                className="btn-next"
                disabled={!date || !time}
                onClick={() => setStep(3)}
                style={{ flex: 1 }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Dados do cliente */}
        {step === 3 && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out forwards' }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '8px',
            }}>
              Seus dados
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
              Para confirmar seu agendamento
            </p>

            {/* Resumo completo */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Resumo
              </div>
              {[
                ['Servico', selectedService?.name || ''],
                ['Data', date ? new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) : ''],
                ['Horario', time],
                ['Duracao', selectedService?.duration + ' min'],
                ['Total', 'R$' + Number(selectedService?.price).toFixed(2)],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '7px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontSize: '13px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Seu nome
                </label>
                <input
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Nome completo"
                  className="booking-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  WhatsApp
                </label>
                <input
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="(85) 99999-9999"
                  className="booking-input"
                />
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '6px' }}>
                  A confirmacao sera enviada neste numero
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-back" onClick={() => setStep(2)}>
                Voltar
              </button>
              <button
                className="btn-next"
                disabled={!clientName || !clientPhone || loading}
                onClick={handleSubmit}
                style={{ flex: 1 }}
              >
                {loading ? 'Confirmando...' : 'Confirmar agendamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
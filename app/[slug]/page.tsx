import { supabaseAdmin } from '@/lib/supabase-admin'
import BookingForm from '@/components/BookingForm'
import { notFound } from 'next/navigation'

export default async function SalonPublicPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: salon } = await supabaseAdmin
    .from('salons')
    .select('*, services(*)')
    .eq('slug', slug)
    .single()

  if (!salon) notFound()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Sans', sans-serif",
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
        
        .salon-header {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          text-align: center;
          animation: fadeSlideUp 0.5s ease-out;
        }
        
        .salon-name {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #6366f1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .salon-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }
        
        .booking-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 24px;
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .booking-container {
            padding: 16px;
          }
          .salon-header {
            padding: 24px 20px;
          }
          .salon-name {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-left" />

      <div className="booking-container">
        <div className="salon-header">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}>
              ✂️
            </div>
          </div>
          <h1 className="salon-name">{salon.name}</h1>
          <p className="salon-subtitle">Agende seu horário online</p>
        </div>
        
        <BookingForm salon={salon} services={salon.services} />
      </div>
    </div>
  )
}
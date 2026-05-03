'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
          z-index: 0;
        }
        
        .nav-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }
        .nav-link:hover {
          color: #fff;
        }
        
        .btn-outline {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 10px 20px;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        
        .btn-primary {
          background: #6366f1;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
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
        
        .btn-large {
          padding: 14px 32px;
          font-size: 16px;
          border-radius: 12px;
        }
        
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99,102,241,0.2);
          background: rgba(255,255,255,0.04);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .badge {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 50px;
          display: inline-block;
          font-weight: 500;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .container-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .container-main {
            padding: 0 20px;
          }
          .hero-title {
            font-size: 36px !important;
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-left" />

      {/* HEADER */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 24px',
        position: 'relative',
        zIndex: 2,
        backdropFilter: 'blur(10px)',
        background: 'rgba(10,10,15,0.8)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
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
            Agendei.app
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/login" className="nav-link" style={{ padding: '8px 16px' }}>
              Entrar
            </Link>
            <Link href="/register" className="btn-primary">
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        padding: '80px 24px 60px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container-main" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.6s ease-out forwards' }}>
            <span className="badge">
              ✨ Para salões de beleza e barbearias
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '64px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '24px',
            animation: 'fadeSlideUp 0.6s ease-out 0.1s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            Chega de agendamentos
            <br />
            <span className="gradient-text">pelo WhatsApp</span>
          </h1>

          <ul style={{
            maxWidth: '480px',
            margin: '0 auto 40px',
            textAlign: 'left',
            animation: 'fadeSlideUp 0.6s ease-out 0.2s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            {[
              '✅ Seu cliente agenda sozinho pelo celular',
              '✅ Você recebe confirmação automática',
              '✅ Vê tudo organizado no painel sem perder tempo',
            ].map((item, idx) => (
              <li key={idx} style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.7)',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                {item}
              </li>
            ))}
          </ul>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeSlideUp 0.6s ease-out 0.3s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            <Link href="/register" className="btn-primary btn-large">
              Começar grátis por 14 dias
            </Link>
            <Link href="#como-funciona" className="btn-outline" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Quero entender
            </Link>
          </div>

         <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.25)',
            marginTop: '24px',
            animation: 'fadeSlideUp 0.6s ease-out 0.4s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            Sem cartão de crédito. Cancele quando quiser.
          </p>

          <div style={{
            marginTop: '16px',
            animation: 'fadeSlideUp 0.6s ease-out 0.5s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}>
            
              href="/pedro-barber"
              target="_blank"
              style={{
                fontSize: '13px',
                color: 'rgba(99,102,241,0.7)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(99,102,241,0.3)',
                paddingBottom: '2px',
                transition: 'all 0.2s',
              }}
            >
              Ver demo ao vivo — pagina de agendamento do cliente →
            </a>
          </div>
        </div>
      </section>

      {/* ANTES VS DEPOIS */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div className="container-main">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            <div style={{
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '20px',
              padding: '32px',
            }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#f87171',
                marginBottom: '20px',
              }}>Antes do Agendei</h3>
              <ul style={{ spaceBetween: '12px' }}>
                {[
                  'Horas respondendo WhatsApp todo dia',
                  'Clientes faltando sem avisar',
                  'Agenda anotada no caderninho',
                  'Horários esquecidos ou duplicados',
                  'Sem tempo para focar nos clientes',
                ].map(item => (
                  <li key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    borderBottom: '1px solid rgba(239,68,68,0.1)',
                  }}>
                    <span style={{ color: '#f87171', fontSize: '14px' }}>✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '20px',
              padding: '32px',
            }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#4ade80',
                marginBottom: '20px',
              }}>Com o Agendei</h3>
              <ul>
                {[
                  'Cliente agenda sozinho pelo link',
                  'Confirmação automática no WhatsApp',
                  'Agenda organizada no painel',
                  'Zero conflito de horários',
                  'Mais tempo para atender bem',
                ].map(item => (
                  <li key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    borderBottom: '1px solid rgba(34,197,94,0.1)',
                  }}>
                    <span style={{ color: '#4ade80', fontSize: '14px' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '40px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '12px',
            }}>Como funciona</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)' }}>Três passos e seu salão está no ar</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                step: '1',
                title: 'Cadastre seu salão',
                desc: 'Cadastre seu estabelecimento, adicione seus serviços e defina seus horários em minutos.',
                icon: '🏠',
              },
              {
                step: '2',
                title: 'Compartilhe o link',
                desc: 'Coloque o link no Instagram, WhatsApp e comece a receber agendamentos.',
                icon: '🔗',
              },
              {
                step: '3',
                title: 'Receba agendamentos',
                desc: 'Clientes agendam sozinhos e você só precisa atender.',
                icon: '✅',
              },
            ].map(item => (
              <div key={item.step} className="feature-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '36px' }}>{item.icon}</span>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    background: '#6366f1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#fff',
                  }}>{item.step}</span>
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '12px',
                }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇO */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '40px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '12px',
            }}>Preço simples e justo</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)' }}>Sem surpresas</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            <div style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '32px',
            }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '16px',
              }}>Grátis</h3>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '48px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '24px',
              }}>R$0</div>
              <ul style={{ marginBottom: '32px' }}>
                {['1 profissional', 'Até 30 agendamentos/mês', 'Página pública'].map(item => (
                  <li key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    <span style={{ color: '#4ade80' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-outline" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                Começar grátis
              </Link>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: '1px solid rgba(99,102,241,0.5)',
              borderRadius: '20px',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(99,102,241,0.2)',
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                background: '#fbbf24',
                color: '#111118',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '50px',
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '0.05em',
              }}>MAIS POPULAR</div>

              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '16px',
              }}>Pro</h3>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '48px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '24px',
              }}>R$59</div>
              <ul style={{ marginBottom: '32px' }}>
                {['Profissionais ilimitados', 'Agendamentos ilimitados', 'Confirmação WhatsApp', 'Lembretes automáticos'].map(item => (
                  <li key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    <span style={{ color: '#fbbf24' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{
                width: '100%',
                textAlign: 'center',
                padding: '12px',
                background: '#fff',
                color: '#6366f1',
                borderRadius: '10px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 600,
                fontFamily: "'Syne', sans-serif",
                fontSize: '14px',
                transition: 'all 0.2s',
              }}>
                Testar grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div className="container-main" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '40px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '16px',
          }}>Pronto para crescer?</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            Comece hoje e automatize seu salão
          </p>
          <Link href="/register" className="btn-primary btn-large">
            Criar minha conta grátis
          </Link>
        </div>
      </section>

      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container-main">
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            Agendei.app — Sistema de agendamento
          </p>
        </div>
      </footer>
    </div>
  )
}

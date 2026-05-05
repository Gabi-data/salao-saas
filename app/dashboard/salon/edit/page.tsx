'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditSalonPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [salonId, setSalonId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'perfil' | 'conta'>('perfil')
  const [currentEmail, setCurrentEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setCurrentEmail(user.email || '')
      const { data: salon } = await supabase
        .from('salons').select('*').eq('user_id', user.id).single()
      if (!salon) { router.push('/dashboard'); return }
      setSalonId(salon.id)
      setName(salon.name || '')
      setPhone(salon.phone || '')
      setAddress(salon.address || '')
      setSlug(salon.slug || '')
      setDescription(salon.description || '')
      setLoading(false)
    }
    load()
  }, [])

  async function handleSavePerfil(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const { error } = await supabase
      .from('salons').update({ name, phone, address, description }).eq('id', salonId)
    if (error) { alert('Erro ao salvar: ' + error.message) }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault()
    setSavingAccount(true)
    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) { alert('Erro ao atualizar senha: ' + error.message); setSavingAccount(false); return }
    }
    alert('Conta atualizada com sucesso!')
    setNewPassword('')
    setSavingAccount(false)
  }

  async function handleDeleteSalon() {
    const confirmDelete = confirm(
      'Tem certeza? Isso vai deletar o salao, todos os servicos e agendamentos. Essa acao nao pode ser desfeita.'
    )
    if (!confirmDelete) return
    const { error } = await supabase.from('salons').delete().eq('id', salonId)
    if (error) { alert('Erro ao deletar: ' + error.message) }
    else { alert('Salao deletado com sucesso.'); router.push('/dashboard') }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .bg-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
        .settings-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; transition: all 0.2s; outline: none; box-sizing: border-box; }
        .settings-input:focus { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.06); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .settings-input::placeholder { color: rgba(255,255,255,0.2); }
        .settings-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .settings-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; box-sizing: border-box; resize: none; transition: all 0.2s; }
        .settings-textarea:focus { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.06); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .settings-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .submit-btn { width: 100%; padding: 13px; background: #6366f1; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .submit-btn:hover:not(:disabled) { background: #5558e8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .danger-btn { width: 100%; padding: 12px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .danger-btn:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); }
        .settings-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 28px; margin-bottom: 24px; }
        .label { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="bg-grid" />

      {/* Header */}
      <div style={{ background: 'rgba(17,17,24,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%', boxShadow: '0 0 12px rgba(99,102,241,0.8)', animation: 'pulse 2s infinite' }} />
            Configuracoes
          </div>
          <Link href="/dashboard" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '10px', color: '#fff', fontSize: '13px', textDecoration: 'none' }}>
            Voltar ao painel
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '14px', width: 'fit-content' }}>
          {(['perfil', 'conta'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Syne', sans-serif",
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                background: tab === t ? '#6366f1' : 'transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              {t === 'perfil' ? 'Perfil do Salao' : 'Minha Conta'}
            </button>
          ))}
        </div>

        {/* Tab Perfil */}
        {tab === 'perfil' && (
          <form onSubmit={handleSavePerfil}>
            <div className="settings-card">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
                Informacoes do Salao
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Nome do salao</label>
                <input value={name} onChange={e => setName(e.target.value)} required className="settings-input" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Descricao</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Conte sobre seu salao..." className="settings-textarea" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">WhatsApp</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(85) 99999-9999" className="settings-input" />
              </div>
              <div>
                <label className="label">Endereco</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, numero, bairro" className="settings-input" />
              </div>
            </div>

            <div className="settings-card">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>Link publico</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>seusite.com/</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{slug}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Para alterar o link entre em contato com o suporte.</p>
            </div>

            {saved && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#4ade80', marginBottom: '16px' }}>
                Dados salvos com sucesso!
              </div>
            )}

            <button type="submit" disabled={saving} className="submit-btn">
              {saving ? <><div className="spinner" />Salvando...</> : 'Salvar alteracoes'}
            </button>
          </form>
        )}

        {/* Tab Conta */}
        {tab === 'conta' && (
          <form onSubmit={handleSaveAccount}>
            <div className="settings-card">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>
                Dados da conta
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">E-mail</label>
                <input value={currentEmail} disabled className="settings-input" />
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>O e-mail nao pode ser alterado.</p>
              </div>
              <div>
                <label className="label">Nova senha</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Digite para alterar a senha" minLength={6} className="settings-input" />
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>Minimo 6 caracteres. Deixe em branco para manter a senha atual.</p>
              </div>
            </div>

            {/* Zona de perigo — com os dois botões no lugar certo */}
            <div className="settings-card">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                Zona de perigo
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                Acoes irreversiveis para sua conta.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Tem certeza que deseja sair?')) {
                      await supabase.auth.signOut()
                      router.push('/login')
                    }
                  }}
                  className="danger-btn"
                >
                  Sair da conta
                </button>

                <button
                  type="button"
                  onClick={handleDeleteSalon}
                  className="danger-btn"
                  style={{ borderColor: 'rgba(239,68,68,0.6)', background: 'rgba(239,68,68,0.15)' }}
                >
                  Deletar salao permanentemente
                </button>
              </div>
            </div>

            <button type="submit" disabled={savingAccount} className="submit-btn">
              {savingAccount ? <><div className="spinner" />Salvando...</> : 'Salvar alteracoes'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
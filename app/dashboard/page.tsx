'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [salon, setSalon] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: salonData } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setSalon(salonData)

      if (salonData) {
        const today = new Date().toISOString().split('T')[0]
        const { data: appts } = await supabase
          .from('appointments')
          .select('*, services(name, price)')
          .eq('salon_id', salonData.id)
          .gte('scheduled_at', today + 'T00:00:00')
          .lte('scheduled_at', today + 'T23:59:59')
          .order('scheduled_at')
        setAppointments(appts || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <p className="text-zinc-400">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 border-b border-zinc-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          {salon ? salon.name : 'Meu Salao'} — Painel
        </h1>
        <div className="flex gap-3">
          {salon && (
            <a href={'/' + salon.slug} target="_blank" className="text-sm bg-green-700 hover:bg-green-600 px-3 py-1.5 rounded-lg">
              Ver pagina publica
            </a>
          )}
          <button onClick={handleLogout} className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded-lg">
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {!salon && (
          <div className="bg-zinc-800 rounded-xl p-6 text-center space-y-3">
            <p className="text-zinc-300">Voce ainda nao cadastrou seu salao.</p>
            <Link href="/dashboard/salon/new" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm">
              Cadastrar meu salao agora
            </Link>
          </div>
        )}

        {salon && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/dashboard/services" className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-center space-y-1">
                <p className="text-2xl">✂️</p>
                <p className="text-sm text-zinc-300">Servicos</p>
              </Link>
              <Link href="/dashboard/availability" className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-center space-y-1">
                <p className="text-2xl">🕐</p>
                <p className="text-sm text-zinc-300">Horarios</p>
              </Link>
              <Link href="/dashboard/appointments" className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-center space-y-1">
                <p className="text-2xl">📋</p>
                <p className="text-sm text-zinc-300">Agendamentos</p>
              </Link>
              <Link href="/dashboard/salon/edit" className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-center space-y-1">
                <p className="text-2xl">⚙️</p>
                <p className="text-sm text-zinc-300">Configuracoes</p>
              </Link>
            </div>

            <div className="bg-zinc-800 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Agendamentos de hoje</h2>
              {appointments.length === 0 ? (
                <p className="text-zinc-400 text-sm">Nenhum agendamento para hoje.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map(apt => (
                    <div key={apt.id} className="flex justify-between items-center bg-zinc-700 rounded-lg px-4 py-3">
                      <div>
                        <p className="font-medium">{apt.client_name}</p>
                        <p className="text-sm text-zinc-400">{apt.services?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(apt.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-zinc-400">{apt.client_phone}</p>
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

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: salon } = await supabase
        .from('salons').select('id').eq('user_id', user.id).single()
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

  async function handleCancel(id: string) {
    await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <p className="text-zinc-400">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Todos os agendamentos</h1>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            ← Voltar
          </Link>
        </div>

        {appointments.length === 0 && (
          <p className="text-zinc-500 text-center py-8">Nenhum agendamento ainda.</p>
        )}

        {appointments.map(apt => (
          <div key={apt.id} className="bg-zinc-800 rounded-xl px-5 py-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{apt.client_name}</p>
              <p className="text-sm text-zinc-400">{apt.services?.name}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {new Date(apt.scheduled_at).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                apt.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                apt.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                'bg-zinc-700 text-zinc-300'
              }`}>
                {apt.status === 'confirmed' ? 'Confirmado' :
                 apt.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
              </p>
              {apt.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(apt.id)}
                  className="block text-xs text-red-400 hover:text-red-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
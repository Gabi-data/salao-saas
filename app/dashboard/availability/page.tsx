'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DAYS = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado']

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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <p className="text-zinc-400">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Horarios de atendimento</h1>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            Voltar
          </Link>
        </div>

        <form onSubmit={handleAdd} className="bg-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-zinc-300">Adicionar horario</h2>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Dia</label>
              <select
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg px-3 py-2 text-sm"
              >
                {DAYS.map((d, i) => (
                  <option key={i} value={String(i)}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Inicio</label>
              <input
                type="time"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Fim</label>
              <input
                type="time"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Adicionando...' : 'Adicionar horario'}
          </button>
        </form>

        <div className="space-y-2">
          {availability.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-4">
              Nenhum horario cadastrado ainda.
            </p>
          )}
          {availability.map(a => (
            <div key={a.id} className="bg-zinc-800 rounded-xl px-5 py-4 flex justify-between items-center">
              <p className="font-medium">{DAYS[a.day_of_week]}</p>
              <p className="text-zinc-400 text-sm">
                {a.start_time.slice(0,5)} as {a.end_time.slice(0,5)}
              </p>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [salonId, setSalonId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('60')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: salon } = await supabase
        .from('salons').select('id').eq('user_id', user.id).single()
      if (!salon) { router.push('/dashboard'); return }

      setSalonId(salon.id)
      const { data } = await supabase
        .from('services').select('*').eq('salon_id', salon.id).order('name')
      setServices(data || [])
    }
    load()
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!salonId) return
    setLoading(true)

    const { data, error } = await supabase.from('services').insert({
      salon_id: salonId,
      name,
      duration: parseInt(duration),
      price: parseFloat(price),
    }).select().single()

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      setServices(prev => [...prev, data])
      setName('')
      setDuration('60')
      setPrice('')
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('services').delete().eq('id', id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Serviços</h1>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            ← Voltar
          </Link>
        </div>

        <form onSubmit={handleAdd} className="bg-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-zinc-300">Adicionar serviço</h2>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome (ex: Corte feminino)"
            required
            className="w-full bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Duração (minutos)</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                min="15"
                step="15"
                required
                className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Preço (R$)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Adicionando...' : 'Adicionar serviço'}
          </button>
        </form>

        <div className="space-y-2">
          {services.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-4">
              Nenhum serviço cadastrado ainda.
            </p>
          )}
          {services.map(s => (
            <div key={s.id} className="bg-zinc-800 rounded-xl px-5 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-zinc-400">
                  {s.duration} min · R$ {Number(s.price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
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
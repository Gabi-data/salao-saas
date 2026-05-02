'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewSalonPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function toSlug(str: string) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('salons').insert({
      user_id: user.id,
      name,
      slug: toSlug(name),
      phone,
      address,
    })

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-8 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-white">Cadastrar meu salão</h1>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Nome do salão</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Studio Ana Silva"
            required
            className="w-full bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">WhatsApp</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(85) 99999-9999"
            className="w-full bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Endereço</label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Rua, número, bairro"
            className="w-full bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {name && (
          <p className="text-xs text-zinc-500">
            Seu link será:{' '}
            <span className="text-blue-400">seuapp.com/{toSlug(name)}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar salão'}
        </button>
      </form>
    </div>
  )
}
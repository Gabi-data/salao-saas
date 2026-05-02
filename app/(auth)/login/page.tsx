'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form onSubmit={handleLogin} className="bg-zinc-800 p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-xl font-semibold text-white">Entrar no painel</h1>

        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-zinc-700 text-white placeholder-zinc-400 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-zinc-700 text-white placeholder-zinc-400 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Não tem conta?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  )
}
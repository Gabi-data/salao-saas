'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      alert('Sua conta foi criada com sucesso!')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form onSubmit={handleRegister} className="bg-zinc-800 p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-xl font-semibold text-white">Criar conta</h1>

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
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-zinc-700 text-white placeholder-zinc-400 border border-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Já tem conta?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
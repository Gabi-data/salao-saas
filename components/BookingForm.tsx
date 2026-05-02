'use client'
import { useState } from 'react'

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface Salon {
  id: string
  name: string
  slug: string
}

interface BookingFormProps {
  salon: Salon
  services: Service[]
}

export default function BookingForm({ salon, services }: BookingFormProps) {
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const scheduled_at = new Date(date + 'T' + time + ':00').toISOString()

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salon_id: salon.id,
        service_id: serviceId,
        client_name: clientName,
        client_phone: clientPhone,
        scheduled_at,
      }),
    })

    if (res.ok) {
      setDone(true)
    } else {
      const data = await res.json()
      alert('Erro: ' + data.error)
    }
    setLoading(false)
  }

  if (done) return (
    <div className="bg-white rounded-xl p-8 text-center space-y-2 shadow-sm">
      <p className="text-3xl">✅</p>
      <p className="font-semibold text-gray-800">Agendamento confirmado!</p>
      <p className="text-gray-500 text-sm">Ate logo, {clientName}!</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Servico</label>
        <select
          value={serviceId}
          onChange={e => setServiceId(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione...</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.duration}min — R${Number(s.price).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
        <input
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          required
          placeholder="Nome completo"
          className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
        <input
          value={clientPhone}
          onChange={e => setClientPhone(e.target.value)}
          required
          placeholder="(85) 99999-9999"
          className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Agendando...' : 'Confirmar agendamento'}
      </button>
    </form>
  )
}
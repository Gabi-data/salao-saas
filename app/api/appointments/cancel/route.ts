import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { appointment_id } = body

  if (!appointment_id) {
    return NextResponse.json({ error: 'appointment_id obrigatorio' }, { status: 400 })
  }

  // Busca os dados completos do agendamento
  const { data: apt, error } = await supabaseAdmin
    .from('appointments')
    .select('*, services(name, price), salons(name, phone)')
    .eq('id', appointment_id)
    .single()

  if (error || !apt) {
    return NextResponse.json({ error: 'Agendamento nao encontrado' }, { status: 404 })
  }

  // Formata a data para a mensagem
  const date = new Date(apt.scheduled_at)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Monta a mensagem de cancelamento
  const message = `❌ *Agendamento cancelado*

Ola, ${apt.client_name}. Infelizmente seu agendamento foi cancelado.

📍 *${apt.salons?.name}*
✂️ Servico: ${apt.services?.name}
📅 Data: ${formattedDate}
🕐 Horario: ${formattedTime}

Para remarcar, entre em contato: ${apt.salons?.phone}

Pedimos desculpas pelo inconveniente. 🙏`

  // Envia o WhatsApp
  await sendWhatsAppMessage(apt.client_phone, message)

  return NextResponse.json({ success: true })
}
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { salon_id, service_id, client_name, client_phone, scheduled_at } = body

  if (!salon_id || !service_id || !client_name || !client_phone || !scheduled_at) {
    return NextResponse.json(
      { error: 'Todos os campos sao obrigatorios' },
      { status: 400 }
    )
  }

  // Verifica se o horario ja esta ocupado
  const { data: conflict } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .eq('salon_id', salon_id)
    .eq('scheduled_at', scheduled_at)
    .eq('status', 'confirmed')
    .single()

  if (conflict) {
    return NextResponse.json(
      { error: 'Horario ja esta ocupado' },
      { status: 409 }
    )
  }

  // Busca dados do salao
  const { data: salon } = await supabaseAdmin
    .from('salons')
    .select('name, phone')
    .eq('id', salon_id)
    .single()

  // Busca dados do servico
  const { data: service } = await supabaseAdmin
    .from('services')
    .select('name, duration, price')
    .eq('id', service_id)
    .single()

  // Cria o agendamento
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert({
      salon_id,
      service_id,
      client_name,
      client_phone,
      scheduled_at,
      status: 'confirmed'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Formata a data para a mensagem
  const date = new Date(scheduled_at)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Monta a mensagem
  const message = `✅ *Agendamento confirmado!*

Ola, ${client_name}! Seu horario foi reservado.

📍 *${salon?.name}*
✂️ Servico: ${service?.name}
📅 Data: ${formattedDate}
🕐 Horario: ${formattedTime}
💰 Valor: R$ ${Number(service?.price).toFixed(2)}

Para cancelar, entre em contato: ${salon?.phone}

Ate logo! 👋`

  // Envia o WhatsApp
  await sendWhatsAppMessage(client_phone, message)

  return NextResponse.json(data, { status: 201 })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const salon_id = searchParams.get('salon_id')
  const date = searchParams.get('date')

  if (!salon_id) {
    return NextResponse.json({ error: 'salon_id obrigatorio' }, { status: 400 })
  }

  let query = supabaseAdmin
    .from('appointments')
    .select('*, services (name, duration, price)')
    .eq('salon_id', salon_id)
    .order('scheduled_at', { ascending: true })

  if (date) {
    query = query
      .gte('scheduled_at', date + 'T00:00:00')
      .lt('scheduled_at', date + 'T23:59:59')
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
// app/api/salons/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    // Tentar pegar o token do cookie (método correto)
    const supabase = await createServerSupabaseClient()
    
    // O createServerSupabaseClient já lê os cookies automaticamente!
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Auth error:', userError?.message)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Buscar o salão do usuário
    const { data: salon, error } = await supabase
      .from('salons')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Salon fetch error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    return NextResponse.json({ salon: salon || null })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
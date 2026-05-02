import { supabaseAdmin } from '@/lib/supabase-admin'
import BookingForm from '@/components/BookingForm'
import { notFound } from 'next/navigation'

export default async function SalonPublicPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: salon } = await supabaseAdmin
    .from('salons')
    .select('*, services(*)')
    .eq('slug', slug)
    .single()

  if (!salon) notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{salon.name}</h1>
          <p className="text-gray-500 mt-1">Agende seu horário online</p>
        </div>
        <BookingForm salon={salon} services={salon.services} />
      </div>
    </div>
  )
}
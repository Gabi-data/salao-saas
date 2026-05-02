export async function sendWhatsAppMessage(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '')
  
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone

  try {
    const response = await fetch(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE}/token/${process.env.ZAPI_TOKEN}/send-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': process.env.ZAPI_CLIENT_TOKEN!
        },
        body: JSON.stringify({
          phone: fullPhone,
          message: message,
        }),
      }
    )

    const data = await response.json()
    console.log('WhatsApp enviado:', data)
    return { success: true, data }

  } catch (error) {

    console.error('Erro WhatsApp:', error)
    return { success: false }
  }
}
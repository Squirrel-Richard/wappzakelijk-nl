import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { conversationId, messageId, inhoud } = await request.json()

    // Get conversation with contact and company
    const { data: conv } = await supabase
      .from('conversations')
      .select('*, contact:contacts(telefoon), company:companies(whatsapp_access_token, whatsapp_phone_number_id)')
      .eq('id', conversationId)
      .single()

    if (!conv || !conv.contact || !conv.company) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const { telefoon } = conv.contact as { telefoon: string }
    const { whatsapp_access_token, whatsapp_phone_number_id } = conv.company as {
      whatsapp_access_token: string
      whatsapp_phone_number_id: string
    }

    if (!whatsapp_access_token || !whatsapp_phone_number_id) {
      // Mark as sent even without WA credentials (demo mode)
      await supabase.from('messages').update({ status: 'verzonden' }).eq('id', messageId)
      return NextResponse.json({ status: 'demo_mode' })
    }

    // Send via Meta API
    const res = await fetch(`https://graph.facebook.com/v18.0/${whatsapp_phone_number_id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsapp_access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: telefoon,
        type: 'text',
        text: { body: inhoud },
      }),
    })

    const result = await res.json()

    if (result.messages?.[0]?.id) {
      await supabase.from('messages').update({
        status: 'verzonden',
        wa_message_id: result.messages[0].id,
      }).eq('id', messageId)
    }

    return NextResponse.json({ status: 'ok', waMessageId: result.messages?.[0]?.id })
  } catch (error) {
    console.error('Send error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

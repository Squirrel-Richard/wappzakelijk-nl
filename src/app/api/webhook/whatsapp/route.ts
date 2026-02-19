import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
)

// Meta webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified!')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract messages from Meta payload
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value?.messages) {
      return NextResponse.json({ status: 'ok' })
    }

    const phoneNumberId = value.metadata?.phone_number_id
    const messages = value.messages || []
    const contacts = value.contacts || []

    for (const msg of messages) {
      const from = msg.from // Phone number of sender
      const waMessageId = msg.id
      const timestamp = msg.timestamp
      const type = msg.type

      let inhoud: string | null = null
      let mediaUrl: string | null = null

      if (type === 'text') {
        inhoud = msg.text?.body || null
      } else if (type === 'image') {
        mediaUrl = msg.image?.url || null
        inhoud = msg.image?.caption || null
      } else if (type === 'document') {
        mediaUrl = msg.document?.url || null
        inhoud = msg.document?.filename || null
      }

      // Find company by phone_number_id
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('whatsapp_phone_number_id', phoneNumberId)
        .single()

      if (!company) continue

      // Find or create contact
      let { data: contact } = await supabase
        .from('contacts')
        .select('id')
        .eq('company_id', company.id)
        .eq('telefoon', from)
        .single()

      if (!contact) {
        const contactNaam = contacts.find((c: { wa_id: string }) => c.wa_id === from)?.profile?.name || null
        const { data: newContact } = await supabase
          .from('contacts')
          .insert({
            company_id: company.id,
            telefoon: from,
            naam: contactNaam,
          })
          .select('id')
          .single()
        contact = newContact
      }

      if (!contact) continue

      // Find or create conversation
      let { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('company_id', company.id)
        .eq('contact_id', contact.id)
        .eq('status', 'open')
        .single()

      if (!conversation) {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            company_id: company.id,
            contact_id: contact.id,
            status: 'open',
            last_message_at: new Date().toISOString(),
          })
          .select('id')
          .single()
        conversation = newConv
      }

      if (!conversation) continue

      // Save message
      await supabase.from('messages').insert({
        conversation_id: conversation.id,
        richting: 'inkomend',
        type,
        inhoud,
        media_url: mediaUrl,
        wa_message_id: waMessageId,
        status: 'afgeleverd',
      })

      // Update conversation last_message_at
      await supabase.from('conversations').update({
        last_message_at: new Date().toISOString(),
      }).eq('id', conversation.id)

      // Check automations
      await checkAutomations(company.id, conversation.id, inhoud, phoneNumberId)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function checkAutomations(
  companyId: string,
  conversationId: string,
  inhoud: string | null,
  phoneNumberId: string
) {
  const { data: company } = await supabase
    .from('companies')
    .select('whatsapp_access_token, whatsapp_phone_number_id')
    .eq('id', companyId)
    .single()

  if (!company) return

  const { data: automations } = await supabase
    .from('automations')
    .select('*')
    .eq('company_id', companyId)
    .eq('actief', true)

  if (!automations || automations.length === 0) return

  const now = new Date()
  const isKantooruren = now.getDay() >= 1 && now.getDay() <= 5 && now.getHours() >= 9 && now.getHours() < 18

  for (const automation of automations) {
    let shouldTrigger = false

    if (automation.trigger_type === 'buiten_kantooruren' && !isKantooruren) {
      shouldTrigger = true
    } else if (automation.trigger_type === 'eerste_contact') {
      // Check if this is the first message
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .eq('richting', 'inkomend')
      if (count === 1) shouldTrigger = true
    } else if (automation.trigger_type === 'keyword' && inhoud && automation.trigger_waarde) {
      if (inhoud.toLowerCase().includes(automation.trigger_waarde.toLowerCase())) {
        shouldTrigger = true
      }
    }

    if (shouldTrigger && automation.actie_bericht) {
      // Get contact phone from conversation
      const { data: conv } = await supabase
        .from('conversations')
        .select('contact:contacts(telefoon)')
        .eq('id', conversationId)
        .single()

      if (!conv?.contact) continue
      const telefoon = (conv.contact as unknown as { telefoon: string }).telefoon

      // Send via WhatsApp API
      await sendWhatsAppMessage(
        telefoon,
        automation.actie_bericht,
        company.whatsapp_access_token,
        company.whatsapp_phone_number_id
      )

      // Save outgoing automation message
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        richting: 'uitgaand',
        type: 'text',
        inhoud: automation.actie_bericht,
        status: 'verzonden',
      })
    }
  }
}

async function sendWhatsAppMessage(
  to: string,
  text: string,
  accessToken: string,
  phoneNumberId: string
) {
  try {
    await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    })
  } catch (err) {
    console.error('Failed to send WhatsApp message:', err)
  }
}

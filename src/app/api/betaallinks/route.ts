import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { bedrag, omschrijving, telefoon, companyId, contactId } = await request.json()

    if (!bedrag || bedrag < 0.01) {
      return NextResponse.json({ error: 'Ongeldig bedrag' }, { status: 400 })
    }

    // Create Stripe Payment Link with iDEAL
    const product = await stripe.products.create({
      name: omschrijving || 'Betaling WAppZakelijk',
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(bedrag * 100), // cents
      currency: 'eur',
    })

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      payment_method_types: ['ideal', 'card'],
      metadata: {
        bedrag: bedrag.toString(),
        omschrijving: omschrijving || '',
        telefoon: telefoon || '',
      },
      after_completion: {
        type: 'redirect',
        redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL}/betaald?success=true` },
      },
    })

    // Find or create contact if phone provided
    let resolvedContactId = contactId || null
    let resolvedCompanyId = companyId || null

    if (telefoon && !contactId) {
      const { data: contact } = await supabase
        .from('contacts')
        .select('id, company_id')
        .eq('telefoon', telefoon)
        .single()
      if (contact) {
        resolvedContactId = contact.id
        resolvedCompanyId = contact.company_id
      }
    }

    // Save payment link to DB
    const { data: savedLink } = await supabase.from('payment_links').insert({
      company_id: resolvedCompanyId,
      contact_id: resolvedContactId,
      bedrag,
      omschrijving,
      stripe_payment_link: paymentLink.url,
      status: 'open',
    }).select('*, contact:contacts(naam, telefoon)').single()

    return NextResponse.json({ paymentLink: savedLink, url: paymentLink.url })
  } catch (error) {
    console.error('Payment link error:', error)
    return NextResponse.json({ error: 'Kon betaallink niet aanmaken' }, { status: 500 })
  }
}

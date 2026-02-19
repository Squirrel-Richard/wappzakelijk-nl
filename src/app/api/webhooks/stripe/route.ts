import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const paymentLinkId = session.payment_link

        if (paymentLinkId) {
          // Find payment link by Stripe URL
          const { data: link } = await supabase
            .from('payment_links')
            .select('id, company_id, contact_id, bedrag, omschrijving')
            .ilike('stripe_payment_link', `%${paymentLinkId}%`)
            .single()

          if (link) {
            await supabase.from('payment_links').update({
              status: 'betaald',
              betaald_op: new Date().toISOString(),
            }).eq('id', link.id)

            // Optionally send confirmation via WhatsApp
            // This would use the send API
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find company by customer ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('company_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (sub) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subAny = subscription as any
          await supabase.from('subscriptions').update({
            geldig_tot: subAny.current_period_end
              ? new Date(subAny.current_period_end * 1000).toISOString()
              : null,
          }).eq('company_id', sub.company_id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabase.from('subscriptions').update({
          plan: 'gratis',
          geldig_tot: null,
        }).eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export interface Company {
  id: string
  user_id: string
  naam: string
  whatsapp_phone_number_id: string | null
  whatsapp_access_token: string | null
  meta_business_id: string | null
  created_at: string
}

export interface Contact {
  id: string
  company_id: string
  naam: string | null
  telefoon: string
  labels: string[]
  opt_in: boolean
  created_at: string
}

export interface Conversation {
  id: string
  company_id: string
  contact_id: string
  status: 'open' | 'gesloten' | 'in_behandeling'
  assigned_to: string | null
  labels: string[]
  last_message_at: string | null
  created_at: string
  contact?: Contact
  last_message?: Message
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  richting: 'inkomend' | 'uitgaand'
  type: 'text' | 'image' | 'document' | 'template'
  inhoud: string | null
  media_url: string | null
  wa_message_id: string | null
  status: 'verzonden' | 'afgeleverd' | 'gelezen' | 'mislukt'
  created_at: string
}

export interface Automation {
  id: string
  company_id: string
  naam: string
  trigger_type: 'buiten_kantooruren' | 'eerste_contact' | 'keyword'
  trigger_waarde: string | null
  actie_type: 'stuur_bericht' | 'stuur_template'
  actie_bericht: string | null
  actief: boolean
  created_at: string
}

export interface Broadcast {
  id: string
  company_id: string
  naam: string
  bericht: string
  status: 'concept' | 'gepland' | 'verzonden' | 'mislukt'
  verzonden_aan: number
  geplanned_op: string | null
  verzonden_op: string | null
  created_at: string
}

export interface PaymentLink {
  id: string
  company_id: string
  contact_id: string | null
  bedrag: number
  omschrijving: string | null
  stripe_payment_link: string | null
  status: 'open' | 'betaald' | 'verlopen'
  betaald_op: string | null
  created_at: string
  contact?: Contact
}

export interface Subscription {
  id: string
  company_id: string
  plan: 'gratis' | 'starter' | 'pro' | 'business'
  stripe_subscription_id: string | null
  geldig_tot: string | null
  created_at: string
}

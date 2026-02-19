-- WAppZakelijk NL — Supabase Schema
-- Run this in your Supabase SQL editor

-- Companies
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  naam text not null,
  whatsapp_phone_number_id text,
  whatsapp_access_token text,
  meta_business_id text,
  created_at timestamptz default now()
);

-- Contacts
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  naam text,
  telefoon text not null,
  labels text[] default '{}',
  opt_in boolean default false,
  created_at timestamptz default now()
);

-- Conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  status text default 'open' check (status in ('open', 'in_behandeling', 'gesloten')),
  assigned_to uuid references auth.users,
  labels text[] default '{}',
  last_message_at timestamptz,
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  richting text not null check (richting in ('inkomend', 'uitgaand')),
  type text default 'text' check (type in ('text', 'image', 'document', 'template')),
  inhoud text,
  media_url text,
  wa_message_id text unique,
  status text default 'verzonden' check (status in ('verzonden', 'afgeleverd', 'gelezen', 'mislukt')),
  created_at timestamptz default now()
);

-- Automations
create table if not exists automations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  naam text not null,
  trigger_type text not null check (trigger_type in ('buiten_kantooruren', 'eerste_contact', 'keyword')),
  trigger_waarde text,
  actie_type text not null check (actie_type in ('stuur_bericht', 'stuur_template')),
  actie_bericht text,
  actief boolean default true,
  created_at timestamptz default now()
);

-- Broadcasts
create table if not exists broadcasts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  naam text not null,
  bericht text not null,
  status text default 'concept' check (status in ('concept', 'gepland', 'verzonden', 'mislukt')),
  verzonden_aan int default 0,
  geplanned_op timestamptz,
  verzonden_op timestamptz,
  created_at timestamptz default now()
);

-- Payment links
create table if not exists payment_links (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  contact_id uuid references contacts(id),
  bedrag decimal(10,2) not null,
  omschrijving text,
  stripe_payment_link text,
  status text default 'open' check (status in ('open', 'betaald', 'verlopen')),
  betaald_op timestamptz,
  created_at timestamptz default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  plan text default 'gratis' check (plan in ('gratis', 'starter', 'pro', 'business')),
  stripe_subscription_id text,
  geldig_tot timestamptz,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_conversations_company_status on conversations(company_id, status);
create index if not exists idx_conversations_last_message on conversations(last_message_at desc);
create index if not exists idx_messages_conversation on messages(conversation_id, created_at);
create index if not exists idx_contacts_company on contacts(company_id);
create index if not exists idx_contacts_telefoon on contacts(telefoon);

-- Row Level Security
alter table companies enable row level security;
alter table contacts enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table automations enable row level security;
alter table broadcasts enable row level security;
alter table payment_links enable row level security;
alter table subscriptions enable row level security;

-- RLS Policies (basic: users can only see their company's data)
create policy "Users see own company" on companies
  for all using (auth.uid() = user_id);

create policy "Users see own contacts" on contacts
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users see own conversations" on conversations
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users see own messages" on messages
  for all using (
    conversation_id in (
      select id from conversations where company_id in (
        select id from companies where user_id = auth.uid()
      )
    )
  );

create policy "Users see own automations" on automations
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users see own broadcasts" on broadcasts
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users see own payment_links" on payment_links
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

create policy "Users see own subscriptions" on subscriptions
  for all using (
    company_id in (select id from companies where user_id = auth.uid())
  );

-- Enable realtime for live inbox
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table messages;

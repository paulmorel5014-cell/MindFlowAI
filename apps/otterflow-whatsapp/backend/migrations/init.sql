-- ============================================================
-- OtterFlow WhatsApp Ordering System - Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- RESTAURANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zelty_restaurant_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'FR',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT DEFAULT 'Europe/Paris',
  currency TEXT DEFAULT 'EUR',
  -- Operating hours stored as JSONB { "mon": ["11:00", "22:00"], ... }
  opening_hours JSONB DEFAULT '{}',
  -- Settings
  min_order_amount INTEGER DEFAULT 0, -- in cents
  delivery_fee INTEGER DEFAULT 0,     -- in cents
  delivery_radius_km DECIMAL(5,2) DEFAULT 5.0,
  -- WhatsApp
  whatsapp_number TEXT,
  twilio_phone_sid TEXT,
  -- Stripe
  stripe_account_id TEXT,
  -- Status
  is_active BOOLEAN DEFAULT true,
  accepts_orders BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whatsapp_number TEXT UNIQUE NOT NULL,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  -- Saved addresses
  default_address JSONB,
  addresses JSONB DEFAULT '[]',
  -- Preferences
  language TEXT DEFAULT 'fr',
  dietary_preferences TEXT[] DEFAULT '{}',
  -- Stats
  total_orders INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0, -- in cents
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONVERSATION SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  whatsapp_number TEXT NOT NULL,
  -- Current state in conversation flow
  state TEXT NOT NULL DEFAULT 'greeting',
  -- States: greeting | browsing_menu | selecting_item | customizing |
  --         reviewing_cart | providing_address | selecting_delivery |
  --         awaiting_payment | order_confirmed | order_cancelled
  context JSONB DEFAULT '{}',   -- temporary state data
  cart JSONB DEFAULT '[]',       -- current cart items
  -- Order type
  order_type TEXT, -- 'delivery' | 'takeaway' | 'dine_in'
  delivery_address JSONB,
  -- Timestamps
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '2 hours',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_whatsapp ON conversation_sessions(whatsapp_number);
CREATE INDEX idx_sessions_state ON conversation_sessions(state);
CREATE INDEX idx_sessions_expires ON conversation_sessions(expires_at);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_id UUID REFERENCES conversation_sessions(id) ON DELETE SET NULL,
  -- Order details
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending | confirmed | preparing | ready | delivering | delivered | cancelled
  order_type TEXT NOT NULL, -- 'delivery' | 'takeaway' | 'dine_in'
  items JSONB NOT NULL DEFAULT '[]',
  -- Pricing (in cents)
  subtotal INTEGER NOT NULL DEFAULT 0,
  delivery_fee INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  tax_amount INTEGER DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  -- Delivery info
  delivery_address JSONB,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  -- Zelty
  zelty_order_id TEXT,
  zelty_ticket_id TEXT,
  -- Payment
  payment_status TEXT DEFAULT 'pending', -- pending | paid | failed | refunded
  stripe_payment_intent_id TEXT,
  stripe_payment_link TEXT,
  paid_at TIMESTAMPTZ,
  -- Printing
  printed_at TIMESTAMPTZ,
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,
  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================================
-- ORDER STATUS HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by TEXT, -- 'system' | 'staff' | 'customer'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MENU CACHE (from Zelty)
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  zelty_menu_id TEXT,
  data JSONB NOT NULL,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour'
);

CREATE UNIQUE INDEX idx_menu_cache_restaurant ON menu_cache(restaurant_id);

-- ============================================================
-- WHATSAPP MESSAGES LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES conversation_sessions(id) ON DELETE SET NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  whatsapp_number TEXT NOT NULL,
  direction TEXT NOT NULL, -- 'inbound' | 'outbound'
  message_sid TEXT,        -- Twilio message SID
  message_type TEXT DEFAULT 'text', -- text | image | interactive | template
  body TEXT,
  media_url TEXT,
  -- For interactive messages
  interactive_type TEXT,
  interactive_data JSONB,
  -- Status
  status TEXT DEFAULT 'sent',
  error_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_session ON whatsapp_messages(session_id);
CREATE INDEX idx_messages_number ON whatsapp_messages(whatsapp_number);
CREATE INDEX idx_messages_created ON whatsapp_messages(created_at DESC);

-- ============================================================
-- TRIGGERS - updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCTION: Generate order number
-- ============================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
BEGIN
  SELECT 'ORD-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0')
  INTO order_num;
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS
CREATE POLICY "Service role full access - restaurants" ON restaurants
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - customers" ON customers
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - messages" ON whatsapp_messages
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- REALTIME - enable for dashboard
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_history;

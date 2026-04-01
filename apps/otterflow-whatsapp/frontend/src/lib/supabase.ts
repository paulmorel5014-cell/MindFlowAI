import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string;
  currency: string;
  delivery_fee: number;
  min_order_amount: number;
  accepts_orders: boolean;
  is_active: boolean;
  opening_hours: Record<string, string[]>;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  order_type: 'delivery' | 'takeaway' | 'dine_in';
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_link?: string;
  delivery_address?: Address;
  customer?: {
    id: string;
    whatsapp_number: string;
    display_name?: string;
  };
  customer_notes?: string;
  created_at: string;
  confirmed_at?: string;
  estimated_delivery_time?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  zeltyId: string;
  name: string;
  price: number;
  quantity: number;
  selectedModifiers?: SelectedModifier[];
  note?: string;
}

export interface SelectedModifier {
  modifierId: string;
  modifierName: string;
  selectedChoices: { id: string; name: string; price: number }[];
}

export interface Address {
  street: string;
  city: string;
  postal_code: string;
  floor?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

export interface MenuItem {
  id: string;
  zeltyId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  allergens: string[];
  tags: string[];
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  minChoices: number;
  maxChoices: number | null;
  choices: ModifierChoice[];
}

export interface ModifierChoice {
  id: string;
  name: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  categories: MenuCategory[];
}

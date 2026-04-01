const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: { persistSession: false },
    db: { schema: 'public' },
  }
);

// ─── Sessions ────────────────────────────────────────────────

async function getOrCreateSession(whatsappNumber, restaurantId) {
  // Try to find active session
  const { data: existing } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('whatsapp_number', whatsappNumber)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existing) return existing;

  // Create customer if not exists
  const customer = await getOrCreateCustomer(whatsappNumber);

  // Create new session
  const { data: session, error } = await supabase
    .from('conversation_sessions')
    .insert({
      customer_id: customer.id,
      restaurant_id: restaurantId,
      whatsapp_number: whatsappNumber,
      state: 'greeting',
      context: {},
      cart: [],
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create session: ${error.message}`);
  return session;
}

async function updateSession(sessionId, updates) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .update({ ...updates, last_message_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update session: ${error.message}`);
  return data;
}

async function extendSession(sessionId) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  return updateSession(sessionId, { expires_at: expiresAt });
}

// ─── Customers ───────────────────────────────────────────────

async function getOrCreateCustomer(whatsappNumber) {
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .eq('whatsapp_number', whatsappNumber)
    .single();

  if (existing) return existing;

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({ whatsapp_number: whatsappNumber })
    .select()
    .single();

  if (error) throw new Error(`Failed to create customer: ${error.message}`);
  return customer;
}

async function updateCustomer(customerId, updates) {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update customer: ${error.message}`);
  return data;
}

// ─── Orders ──────────────────────────────────────────────────

async function createOrder(orderData) {
  const { data: orderNum } = await supabase
    .rpc('generate_order_number');

  const { data: order, error } = await supabase
    .from('orders')
    .insert({ ...orderData, order_number: orderNum })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);

  await supabase.from('order_status_history').insert({
    order_id: order.id,
    to_status: order.status,
    changed_by: 'system',
  });

  return order;
}

async function getOrder(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurant:restaurants(id, name, address, phone),
      customer:customers(id, whatsapp_number, display_name, email)
    `)
    .eq('id', orderId)
    .single();

  if (error) throw new Error(`Order not found: ${error.message}`);
  return data;
}

async function updateOrderStatus(orderId, status, meta = {}) {
  const { data: current } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  const { data: order, error } = await supabase
    .from('orders')
    .update({ status, ...meta })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update order: ${error.message}`);

  await supabase.from('order_status_history').insert({
    order_id: orderId,
    from_status: current?.status,
    to_status: status,
    changed_by: meta.changed_by || 'system',
    notes: meta.notes,
  });

  return order;
}

async function getRestaurantOrders(restaurantId, filters = {}) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      customer:customers(id, whatsapp_number, display_name)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.date) query = query.gte('created_at', filters.date);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data;
}

// ─── Menu Cache ──────────────────────────────────────────────

async function getCachedMenu(restaurantId) {
  const { data } = await supabase
    .from('menu_cache')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .gt('expires_at', new Date().toISOString())
    .single();

  return data?.data || null;
}

async function setCachedMenu(restaurantId, menuData) {
  await supabase
    .from('menu_cache')
    .upsert(
      {
        restaurant_id: restaurantId,
        data: menuData,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      { onConflict: 'restaurant_id' }
    );
}

// ─── Messages Log ────────────────────────────────────────────

async function logMessage(messageData) {
  await supabase.from('whatsapp_messages').insert(messageData);
}

// ─── Restaurant ──────────────────────────────────────────────

async function getRestaurant(restaurantId) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (error) throw new Error(`Restaurant not found: ${error.message}`);
  return data;
}

async function getDefaultRestaurant() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error) throw new Error('No active restaurant found');
  return data;
}

module.exports = {
  supabase,
  getOrCreateSession,
  updateSession,
  extendSession,
  getOrCreateCustomer,
  updateCustomer,
  createOrder,
  getOrder,
  updateOrderStatus,
  getRestaurantOrders,
  getCachedMenu,
  setCachedMenu,
  logMessage,
  getRestaurant,
  getDefaultRestaurant,
};

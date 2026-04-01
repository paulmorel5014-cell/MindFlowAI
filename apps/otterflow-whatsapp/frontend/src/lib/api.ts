const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_KEY = process.env.RESTAURANT_API_KEY || '';

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Orders ──────────────────────────────────────────────────

export async function getOrders(params?: {
  status?: string;
  limit?: number;
}) {
  const query = new URLSearchParams(params as Record<string, string>);
  return fetchApi<{ orders: import('./supabase').Order[] }>(`/api/restaurant/orders?${query}`);
}

export async function getOrder(id: string) {
  return fetchApi<{ order: import('./supabase').Order }>(`/api/restaurant/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  return fetchApi<{ order: import('./supabase').Order }>(`/api/restaurant/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function cancelOrder(id: string, reason?: string, refund?: boolean) {
  return fetchApi<{ order: import('./supabase').Order }>(`/api/restaurant/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason, refund }),
  });
}

export async function printOrder(id: string) {
  return fetchApi<{ success: boolean }>(`/api/restaurant/orders/${id}/print`, {
    method: 'POST',
  });
}

// ─── Menu ─────────────────────────────────────────────────────

export async function getMenu() {
  return fetchApi<{ menu: import('./supabase').Menu }>('/api/restaurant/menu');
}

export async function refreshMenu() {
  return fetchApi<{ menu: import('./supabase').Menu; message: string }>(
    '/api/restaurant/menu/refresh',
    { method: 'POST' }
  );
}

// ─── Settings ─────────────────────────────────────────────────

export async function getSettings() {
  return fetchApi<{ restaurant: import('./supabase').Restaurant }>('/api/restaurant/settings');
}

export async function updateSettings(updates: Partial<import('./supabase').Restaurant>) {
  return fetchApi<{ restaurant: import('./supabase').Restaurant }>('/api/restaurant/settings', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// ─── Analytics ────────────────────────────────────────────────

export async function getAnalytics(period = '7d') {
  return fetchApi<{
    stats: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      byType: Record<string, number>;
    };
    period: string;
  }>(`/api/restaurant/analytics?period=${period}`);
}

// ─── Helpers ──────────────────────────────────────────────────

export function formatPrice(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

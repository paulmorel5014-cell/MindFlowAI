import { useEffect, useState, useCallback } from 'react';
import { supabase, Order } from '../lib/supabase';
import { getOrders } from '../lib/api';

export function useOrders(restaurantId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders({ limit: 100 });
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Realtime subscription
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          ...(restaurantId && { filter: `restaurant_id=eq.${restaurantId}` }),
        },
        payload => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev =>
              prev.map(o => (o.id === payload.new.id ? (payload.new as Order) : o))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, restaurantId]);

  const activeOrders = orders.filter(o =>
    ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)
  );

  const completedOrders = orders.filter(o =>
    ['delivered', 'cancelled'].includes(o.status)
  );

  return {
    orders,
    activeOrders,
    completedOrders,
    loading,
    error,
    refetch: fetchOrders,
  };
}

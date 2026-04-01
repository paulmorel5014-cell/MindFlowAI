'use client';

import { useState } from 'react';
import { Printer, ChevronDown, ChevronUp, Phone, MapPin, Clock } from 'lucide-react';
import { updateOrderStatus, cancelOrder, printOrder, formatPrice, formatDate } from '../../lib/api';
import type { Order, OrderStatus } from '../../lib/supabase';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Confirmée', color: 'text-blue-700', bg: 'bg-blue-100' },
  preparing: { label: 'En préparation', color: 'text-orange-700', bg: 'bg-orange-100' },
  ready: { label: 'Prête', color: 'text-green-700', bg: 'bg-green-100' },
  delivering: { label: 'En livraison', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Livrée', color: 'text-gray-700', bg: 'bg-gray-100' },
  cancelled: { label: 'Annulée', color: 'text-red-700', bg: 'bg-red-100' },
};

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: 'confirmed', label: 'Confirmer' },
  confirmed: { status: 'preparing', label: 'Préparer' },
  preparing: { status: 'ready', label: 'Prêt' },
  ready: { status: 'delivering', label: 'En livraison' },
  delivering: { status: 'delivered', label: 'Livré' },
};

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

export default function OrderCard({ order, showActions = false }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const config = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(order.created_at).getTime()) / 60000
  );

  const handleStatusUpdate = async (status: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, status);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Annuler cette commande ?')) return;
    setUpdating(true);
    try {
      await cancelOrder(order.id, 'Annulée par le restaurant', order.payment_status === 'paid');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = async () => {
    try {
      await printOrder(order.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{order.order_number}</span>
            <span className={`badge ${config.bg} ${config.color}`}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>{formatDate(order.created_at)}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {elapsedMinutes}min
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrint}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Imprimer"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Order type & total */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">
          {order.order_type === 'delivery' ? '🚚 Livraison' : order.order_type === 'takeaway' ? '🏃 À emporter' : '🍽️ Sur place'}
        </span>
        <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
      </div>

      {/* Customer */}
      {order.customer && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Phone className="w-3.5 h-3.5" />
          {order.customer.display_name || order.customer.whatsapp_number}
        </div>
      )}

      {/* Items preview */}
      <div className="text-sm text-gray-600 mb-3">
        {order.items.slice(0, 2).map((item, i) => (
          <div key={i}>{item.quantity}x {item.name}</div>
        ))}
        {order.items.length > 2 && (
          <div className="text-gray-400">+{order.items.length - 2} article(s)</div>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 pt-3 mt-3 space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Articles</h4>
            {order.items.map((item, i) => (
              <div key={i} className="text-sm mb-1">
                <span className="font-medium">{item.quantity}x {item.name}</span>
                <span className="text-gray-500 ml-2">{formatPrice(item.price * item.quantity)}</span>
                {item.selectedModifiers?.length > 0 && (
                  <div className="text-xs text-gray-400 ml-4">
                    {item.selectedModifiers.flatMap(m =>
                      m.selectedChoices.map(c =>
                        c.price > 0 ? `${c.name} (+${formatPrice(c.price)})` : c.name
                      )
                    ).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {order.delivery_address && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Adresse</h4>
              <div className="flex items-start gap-1.5 text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>
                  {order.delivery_address.street}, {order.delivery_address.postal_code} {order.delivery_address.city}
                  {order.delivery_address.floor && ` — ${order.delivery_address.floor}`}
                </span>
              </div>
            </div>
          )}

          {order.customer_notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
              📝 {order.customer_notes}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.delivery_fee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Livraison</span>
              <span>{formatPrice(order.delivery_fee)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm font-bold border-t border-gray-100 pt-2">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && !['delivered', 'cancelled'].includes(order.status) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          {next && (
            <button
              onClick={() => handleStatusUpdate(next.status)}
              disabled={updating}
              className="flex-1 btn-primary text-sm py-1.5 disabled:opacity-50"
            >
              {updating ? '...' : next.label}
            </button>
          )}
          <button
            onClick={handleCancel}
            disabled={updating}
            className="btn-danger text-sm py-1.5 px-3 disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}

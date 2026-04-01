'use client';

import { useOrders } from '../../../hooks/useOrders';
import { updateOrderStatus, printOrder, formatPrice, formatDate } from '../../../lib/api';
import { useState } from 'react';
import { Printer, ChefHat, CheckCircle, Clock, Truck } from 'lucide-react';
import type { Order } from '../../../lib/supabase';

const KITCHEN_COLUMNS: {
  status: string[];
  label: string;
  color: string;
  Icon: any;
  nextStatus?: string;
  nextLabel?: string;
}[] = [
  {
    status: ['pending', 'confirmed'],
    label: 'À préparer',
    color: 'border-yellow-400 bg-yellow-50',
    Icon: Clock,
    nextStatus: 'preparing',
    nextLabel: 'Démarrer',
  },
  {
    status: ['preparing'],
    label: 'En cours',
    color: 'border-blue-400 bg-blue-50',
    Icon: ChefHat,
    nextStatus: 'ready',
    nextLabel: 'Prêt',
  },
  {
    status: ['ready'],
    label: 'Prêt',
    color: 'border-green-400 bg-green-50',
    Icon: CheckCircle,
    nextStatus: 'delivering',
    nextLabel: 'En livraison',
  },
];

export default function KitchenPage() {
  const { orders, loading } = useOrders();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handlePrint = async (orderId: string) => {
    try {
      await printOrder(orderId);
    } catch (err) {
      console.error(err);
    }
  };

  const activeOrders = orders.filter(o =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Vue Cuisine</h1>
        <span className="badge bg-orange-100 text-orange-700">
          {activeOrders.length} en cours
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KITCHEN_COLUMNS.map(col => {
            const colOrders = activeOrders.filter(o => col.status.includes(o.status));
            return (
              <div key={col.label} className={`rounded-xl border-2 ${col.color} p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  <col.Icon className="w-5 h-5 text-gray-700" />
                  <h2 className="font-semibold text-gray-800">{col.label}</h2>
                  <span className="ml-auto badge bg-white text-gray-600">
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colOrders.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">Vide</p>
                  )}
                  {colOrders.map(order => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      nextStatus={col.nextStatus}
                      nextLabel={col.nextLabel}
                      onStatusUpdate={handleStatusUpdate}
                      onPrint={handlePrint}
                      updating={updating === order.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KitchenOrderCard({
  order,
  nextStatus,
  nextLabel,
  onStatusUpdate,
  onPrint,
  updating,
}: {
  order: Order;
  nextStatus?: string;
  nextLabel?: string;
  onStatusUpdate: (id: string, status: string) => void;
  onPrint: (id: string) => void;
  updating: boolean;
}) {
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(order.created_at).getTime()) / 60000
  );
  const isUrgent = elapsedMinutes > 20;

  return (
    <div className={`bg-white rounded-lg p-3 shadow-sm border ${isUrgent ? 'border-red-300' : 'border-transparent'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-900 text-sm">{order.order_number}</span>
        <span className={`text-xs font-medium ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
          <Clock className="w-3 h-3 inline mr-0.5" />
          {elapsedMinutes}min
        </span>
      </div>

      {/* Type */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-xs text-gray-500">
          {order.order_type === 'delivery' ? '🚚 Livraison' : order.order_type === 'takeaway' ? '🏃 À emporter' : '🍽️ Sur place'}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3">
        {order.items.map((item, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold">{item.quantity}x</span> {item.name}
            {item.selectedModifiers?.length > 0 && (
              <div className="text-xs text-gray-500 ml-4">
                {item.selectedModifiers.flatMap(m => m.selectedChoices.map(c => c.name)).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {order.customer_notes && (
        <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
          📝 {order.customer_notes}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onPrint(order.id)}
          className="flex-shrink-0 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          title="Imprimer"
        >
          <Printer className="w-4 h-4" />
        </button>
        {nextStatus && nextLabel && (
          <button
            onClick={() => onStatusUpdate(order.id, nextStatus)}
            disabled={updating}
            className="flex-1 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white py-1.5 rounded transition-colors disabled:opacity-50"
          >
            {updating ? '...' : nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

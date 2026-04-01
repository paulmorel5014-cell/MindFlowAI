'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { getOrder, formatPrice, formatDate } from '../../../lib/api';
import type { Order } from '../../../lib/supabase';

export default function PaymentResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.orderId as string;
  const isCancelled = typeof window !== 'undefined' && window.location.pathname.includes('/cancel');
  const isSuccess = typeof window !== 'undefined' && window.location.pathname.includes('/success');

  useEffect(() => {
    getOrder(orderId)
      .then(data => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card text-center p-8 max-w-sm w-full">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Commande introuvable</h2>
          <p className="text-gray-500">Cette commande n'existe pas ou a expiré.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 text-center">
        {order.payment_status === 'paid' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement confirmé !</h1>
            <p className="text-gray-500 mb-6">
              Votre commande est en cours de traitement.
            </p>
          </>
        ) : isCancelled ? (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement annulé</h1>
            <p className="text-gray-500 mb-6">
              Votre commande n'a pas été payée.
            </p>
          </>
        ) : (
          <>
            <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">En attente de paiement</h1>
            <p className="text-gray-500 mb-6">
              Votre commande attend la confirmation du paiement.
            </p>
          </>
        )}

        {/* Order summary */}
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Commande</span>
            <span className="font-semibold">{order.order_number}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm">{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Type</span>
            <span className="text-sm">
              {order.order_type === 'delivery' ? '🚚 Livraison' : order.order_type === 'takeaway' ? '🏃 À emporter' : '🍽️ Sur place'}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-green-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Retry payment */}
        {order.payment_status !== 'paid' && order.stripe_payment_link && !isCancelled && (
          <a
            href={order.stripe_payment_link}
            className="btn-primary w-full block mb-3 text-center py-3"
          >
            Payer maintenant
          </a>
        )}

        <p className="text-sm text-gray-500">
          <MessageCircle className="w-4 h-4 inline mr-1" />
          Vous recevrez les mises à jour sur WhatsApp.
        </p>
      </div>
    </div>
  );
}

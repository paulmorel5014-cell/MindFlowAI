'use client';

import Link from 'next/link';
import { MessageCircle, LayoutDashboard, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">OtterFlow</span>
          </div>
          <Link
            href="/dashboard"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <MessageCircle className="w-4 h-4" />
          Commandes WhatsApp pour restaurants
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Recevez des commandes<br />
          <span className="text-green-500">directement sur WhatsApp</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Chatbot intelligent, intégration Zelty, paiement Stripe, impression en cuisine.
          Le tout sans application mobile à télécharger.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/catalog" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            Voir le menu <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard resto
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="card hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.iconBg}`}>
                <f.Icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comment ça marche
          </h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        OtterFlow &copy; {new Date().getFullYear()} — Système de commande WhatsApp
      </footer>
    </main>
  );
}

const features = [
  {
    title: 'Chatbot WhatsApp Intelligent',
    description: 'Conversation naturelle avec Claude AI. Le client commande en envoyant un simple message.',
    Icon: MessageCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Dashboard Temps Réel',
    description: 'Gérez toutes vos commandes en direct. Notifications instantanées. Suivi complet.',
    Icon: LayoutDashboard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Intégration Zelty & Stripe',
    description: 'Synchronisation automatique du menu Zelty. Paiement sécurisé via Stripe Checkout.',
    Icon: CheckCircle,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

const steps = [
  { title: 'Le client envoie un message WhatsApp', desc: 'Il écrit "Bonjour" ou "Commander" sur votre numéro WhatsApp Business.' },
  { title: 'Le chatbot présente le menu', desc: 'Menu synchronisé depuis Zelty, avec categories, descriptions et prix.' },
  { title: 'Sélection et personnalisation', desc: 'Le client choisit ses plats et options (sauce, taille, extras...).' },
  { title: 'Paiement sécurisé', desc: 'Lien Stripe Checkout envoyé directement dans WhatsApp. Paiement en 30 secondes.' },
  { title: 'Impression automatique', desc: 'Le ticket s\'imprime automatiquement en cuisine sur imprimante Star Micronics.' },
  { title: 'Suivi en temps réel', desc: 'Le client reçoit des notifications WhatsApp à chaque étape de sa commande.' },
];

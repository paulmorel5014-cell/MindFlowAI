'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, MapPin, Phone, Clock, ChevronRight, Check, Users, BarChart2, Zap, Shield } from 'lucide-react'

/* ─── Mockup: Maison Varel (Restaurant) ─────────────────────────────── */
function MaisonVarelSite() {
  return (
    <div className="h-full overflow-y-auto bg-[#0D0A06] text-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-amber-900/30 bg-[#0D0A06]/90 backdrop-blur-sm">
        <div className="font-serif text-xl tracking-[0.2em] text-amber-400">MAISON VAREL</div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest text-amber-200/60 uppercase">
          {['La Carte', 'Le Chef', 'Réservation', 'Contact'].map((l) => (
            <span key={l} className="hover:text-amber-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <button className="text-[10px] tracking-widest px-4 py-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors">
          RÉSERVER
        </button>
      </nav>

      {/* Hero */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a1206 0%, #0D0A06 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, #d97706 0%, transparent 60%)' }} />
        <div className="text-center relative z-10">
          <div className="text-[10px] tracking-[0.4em] text-amber-500 uppercase mb-3">Paris 16e · Table Étoilée</div>
          <h1 className="font-serif text-4xl font-light text-amber-100 mb-2">L&apos;Art de la Table</h1>
          <div className="flex justify-center gap-1 mt-3">
            {[1,2,3].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-8 py-8">
        <div className="text-center mb-6">
          <div className="text-[10px] tracking-[0.3em] text-amber-600 uppercase mb-1">Menu Dégustation</div>
          <h2 className="font-serif text-2xl text-amber-100">Saison Printemps</h2>
          <div className="w-16 h-px bg-amber-700/50 mx-auto mt-3" />
        </div>

        <div className="space-y-4 max-w-lg mx-auto">
          {[
            { name: 'Langoustine Royale', desc: 'Émulsion de corail · Caviar Osciètre · Fenouil marin', price: '68€' },
            { name: 'Saint-Pierre Sauvage', desc: 'Vierge d\'agrumes · Asperges blanches de Pertuis · Beurre noisette', price: '72€' },
            { name: 'Suprême de Pigeon', desc: 'Jus corsé · Truffe noire du Périgord · Céleri fumé', price: '76€' },
            { name: 'Soufflé au Grand Marnier', desc: 'Crème anglaise à la vanille Bourbon · Tuile dorée', price: '28€' },
          ].map((item) => (
            <div key={item.name} className="flex justify-between items-start border-b border-amber-900/20 pb-4">
              <div>
                <div className="font-serif text-sm text-amber-200">{item.name}</div>
                <div className="text-[10px] text-amber-700/70 mt-0.5 italic">{item.desc}</div>
              </div>
              <div className="text-amber-500 text-sm font-light ml-4 flex-shrink-0">{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation */}
      <div className="mx-8 mb-8 p-6 border border-amber-800/30 bg-amber-950/20 rounded-sm">
        <div className="text-center mb-4">
          <div className="text-[10px] tracking-[0.3em] text-amber-600 uppercase mb-1">Réservation en ligne</div>
          <p className="text-xs text-amber-200/50">Disponibilités en temps réel · Confirmation immédiate</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['Lun 12', 'Mar 13', 'Mer 14'].map((d, i) => (
            <button key={d} className={`py-2 text-[10px] tracking-widest border transition-all ${i === 1 ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-amber-900/30 text-amber-700 hover:border-amber-700'}`}>
              {d}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((h, i) => (
            <button key={h} className={`py-1.5 text-[10px] border transition-all ${i === 2 ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-amber-900/30 text-amber-700/50'}`}>
              {h}
            </button>
          ))}
        </div>
        <button className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-amber-100 text-[10px] tracking-widest uppercase transition-colors">
          Confirmer · 2 couverts
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-amber-900/20 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[10px] text-amber-700/50">
          <MapPin className="w-3 h-3" /> 24 Avenue Victor Hugo, Paris 16e
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-amber-700/50">
          <Phone className="w-3 h-3" /> 01 42 00 00 00
        </div>
      </div>
    </div>
  )
}

/* ─── Mockup: Grand Hôtel Aldric ─────────────────────────────────────── */
function GrandHotelSite() {
  return (
    <div className="h-full overflow-y-auto bg-[#F8F6F1] text-[#1a2a3a] font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-sky-100">
        <div className="font-serif text-lg tracking-[0.15em] text-[#0c2340]">GRAND HÔTEL ALDRIC</div>
        <div className="hidden md:flex gap-6 text-[10px] tracking-widest text-slate-500 uppercase">
          {['Chambres', 'Spa & Bien-être', 'Restaurant', 'Événements'].map((l) => (
            <span key={l} className="hover:text-sky-600 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <button className="text-[10px] tracking-widest px-5 py-2 bg-[#0c2340] text-white hover:bg-sky-800 transition-colors">
          RÉSERVER
        </button>
      </nav>

      {/* Hero */}
      <div className="relative h-56 flex items-end pb-8 px-8"
        style={{ background: 'linear-gradient(135deg, #0c2340 0%, #1e4d7a 50%, #2d7dd2 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)' }} />
        <div className="relative z-10">
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
          </div>
          <h1 className="font-serif text-3xl font-light text-white mb-1">Côte d&apos;Azur · Palace</h1>
          <p className="text-sky-200 text-xs">Vue mer panoramique · 47 suites d&apos;exception</p>
        </div>
      </div>

      {/* Rooms */}
      <div className="px-8 py-8">
        <h2 className="font-serif text-xl text-[#0c2340] mb-6">Nos Suites</h2>
        <div className="space-y-3">
          {[
            { name: 'Chambre Méditerranée', size: '42m²', view: 'Vue jardin', price: '380', avail: true },
            { name: 'Suite Riviera', size: '68m²', view: 'Vue mer partielle', price: '680', avail: true },
            { name: 'Suite Prestige', size: '95m²', view: 'Vue mer panoramique', price: '1 240', avail: false },
            { name: 'Suite Présidentielle', size: '180m²', view: 'Terrasse privée · Vue mer', price: '2 800', avail: true },
          ].map((room) => (
            <div key={room.name} className="flex items-center justify-between p-4 bg-white border border-sky-100 hover:border-sky-300 hover:shadow-sm transition-all">
              <div>
                <div className="font-medium text-sm text-[#0c2340]">{room.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{room.size} · {room.view}</div>
              </div>
              <div className="text-right">
                <div className="text-sky-700 font-semibold text-sm">{room.price}€<span className="text-[10px] font-normal text-slate-400">/nuit</span></div>
                <div className={`text-[9px] mt-0.5 ${room.avail ? 'text-green-500' : 'text-red-400'}`}>
                  {room.avail ? '● Disponible' : '○ Complet'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking widget */}
      <div className="mx-8 mb-8 p-5 bg-[#0c2340] text-white">
        <div className="text-[10px] tracking-widest uppercase text-sky-400 mb-3">Vérifier les disponibilités</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 px-3 py-2">
            <div className="text-[9px] text-sky-400 mb-0.5">Arrivée</div>
            <div className="text-xs text-white">12 mars 2026</div>
          </div>
          <div className="bg-white/10 px-3 py-2">
            <div className="text-[9px] text-sky-400 mb-0.5">Départ</div>
            <div className="text-xs text-white">15 mars 2026</div>
          </div>
        </div>
        <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-[10px] tracking-widest uppercase transition-colors">
          Voir les disponibilités
        </button>
      </div>

      {/* Amenities */}
      <div className="px-8 pb-8 grid grid-cols-3 gap-3">
        {[
          { icon: '🏊', label: 'Piscine infinie' },
          { icon: '🧖', label: 'Spa 2 000m²' },
          { icon: '🍾', label: 'Gastronomie étoilée' },
          { icon: '🏖️', label: 'Plage privée' },
          { icon: '🚁', label: 'Hélipad' },
          { icon: '🎾', label: 'Tennis & Golf' },
        ].map((a) => (
          <div key={a.label} className="text-center p-3 bg-white border border-sky-50">
            <div className="text-xl mb-1">{a.icon}</div>
            <div className="text-[9px] text-slate-500">{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Mockup: Constructions Elaris (BTP) ─────────────────────────────── */
function EllarisSite() {
  return (
    <div className="h-full overflow-y-auto bg-[#111714] text-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-[#111714]/95 backdrop-blur-sm border-b border-emerald-900/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-emerald-500 rotate-45" />
          <span className="font-bold tracking-wider text-sm">ELARIS</span>
          <span className="text-[10px] text-emerald-600/70 tracking-widest">CONSTRUCTIONS</span>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] tracking-widest text-slate-400 uppercase">
          {['Réalisations', 'Services', 'À Propos', 'Contact'].map((l) => (
            <span key={l} className="hover:text-emerald-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <button className="text-[10px] tracking-widest px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-400 transition-colors">
          CONTACT
        </button>
      </nav>

      {/* Hero */}
      <div className="relative px-8 py-12"
        style={{ background: 'linear-gradient(135deg, #0a1f14 0%, #111714 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #10b981 0px, #10b981 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, #10b981 0px, #10b981 1px, transparent 1px, transparent 30px)' }} />
        <div className="relative z-10 max-w-md">
          <div className="text-[10px] tracking-[0.3em] text-emerald-500 uppercase mb-3">Promotion Immobilière Haut de Gamme</div>
          <h1 className="font-bold text-3xl leading-tight mb-3">
            L&apos;excellence<br /><span className="text-emerald-400">architecturale</span><br />au service<br />de votre patrimoine.
          </h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Des résidences d&apos;exception conçues pour les investisseurs exigeants. Matériaux premium, emplacements stratégiques, rendements garantis.
          </p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-emerald-500 text-white text-[10px] tracking-widest hover:bg-emerald-400 transition-colors">
              NOS PROGRAMMES
            </button>
            <button className="px-5 py-2.5 border border-emerald-800 text-emerald-400 text-[10px] tracking-widest hover:border-emerald-500 transition-colors">
              INVESTIR
            </button>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="px-8 py-8">
        <div className="text-[10px] tracking-widest text-emerald-600 uppercase mb-6">Programmes en cours</div>
        <div className="space-y-4">
          {[
            { name: 'Le Clos Saint-Honoré', location: 'Paris 8e', type: 'Appartements de prestige', units: '12 lots', price: 'À partir de 1,2M€', pct: 85 },
            { name: 'Villa Olivia', location: 'Cap Ferrat', type: 'Villa contemporaine', units: '1 villa', price: '4,8M€', pct: 100 },
            { name: 'Domaine des Pins', location: 'Megève', type: 'Chalets premium', units: '6 chalets', price: 'À partir de 2,1M€', pct: 40 },
          ].map((proj) => (
            <div key={proj.name} className="p-5 border border-emerald-900/30 hover:border-emerald-700/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm text-white">{proj.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {proj.location} · {proj.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 text-xs font-semibold">{proj.price}</div>
                  <div className="text-[9px] text-slate-600 mt-0.5">{proj.units}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-emerald-900/40 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${proj.pct}%` }} />
                </div>
                <div className="text-[9px] text-emerald-600">{proj.pct}% réservé</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-8 mb-8 p-6 bg-emerald-950/30 border border-emerald-900/20 grid grid-cols-3 gap-4 text-center">
        {[
          { v: '127', l: 'Programmes livrés' },
          { v: '98%', l: 'Satisfaction client' },
          { v: '34', l: 'Leads/mois via MindFlow' },
        ].map((s) => (
          <div key={s.l}>
            <div className="text-2xl font-bold text-emerald-400">{s.v}</div>
            <div className="text-[9px] text-slate-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Mockup: Maître Fontaine (Avocat) ───────────────────────────────── */
function FontaineSite() {
  return (
    <div className="h-full overflow-y-auto bg-[#F5F3F0] text-[#1a1625] font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div>
          <div className="font-serif text-base font-semibold text-[#2d1b69]">Fontaine & Associés</div>
          <div className="text-[9px] tracking-widest text-slate-400 uppercase">Avocats · Droit des affaires</div>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] tracking-widest text-slate-500 uppercase">
          {['Expertise', 'Cabinet', 'Actualités', 'Contact'].map((l) => (
            <span key={l} className="hover:text-violet-700 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <button className="text-[10px] tracking-widest px-4 py-2 bg-[#2d1b69] text-white hover:bg-violet-800 transition-colors rounded-sm">
          Prendre RDV
        </button>
      </nav>

      {/* Hero */}
      <div className="relative px-8 py-12 bg-[#2d1b69] text-white overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-48 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)' }} />
        <div className="relative z-10">
          <div className="text-[10px] tracking-[0.3em] text-violet-300 uppercase mb-3">Lyon · Droit des affaires</div>
          <h1 className="font-serif text-3xl font-light mb-3 max-w-sm">
            La rigueur juridique au service de vos ambitions.
          </h1>
          <p className="text-xs text-violet-200/70 max-w-sm leading-relaxed mb-6">
            Cabinet spécialisé en droit des affaires, fusions-acquisitions, propriété intellectuelle et contentieux commercial.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white text-[#2d1b69] text-[10px] tracking-widest font-medium hover:bg-violet-50 transition-colors">
              NOS EXPERTISES
            </button>
            <div className="text-[10px] text-violet-300 flex items-center gap-1 cursor-pointer">
              <Phone className="w-3 h-3" /> +33 4 72 00 00 00
            </div>
          </div>
        </div>
      </div>

      {/* Practice areas */}
      <div className="px-8 py-8">
        <div className="font-serif text-xl text-[#2d1b69] mb-6">Domaines d&apos;expertise</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🏢', title: 'Droit des sociétés', desc: 'Création, gouvernance, restructuration' },
            { icon: '🤝', title: 'Fusions-Acquisitions', desc: 'Due diligence, négociation, closing' },
            { icon: '💡', title: 'Propriété intellectuelle', desc: 'Brevets, marques, licences' },
            { icon: '⚖️', title: 'Contentieux commercial', desc: 'Arbitrage, médiation, procédures' },
          ].map((area) => (
            <div key={area.title} className="p-4 bg-white border border-slate-200 hover:border-violet-300 hover:shadow-sm transition-all">
              <div className="text-xl mb-2">{area.icon}</div>
              <div className="font-semibold text-xs text-[#2d1b69] mb-1">{area.title}</div>
              <div className="text-[9px] text-slate-400">{area.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RDV widget */}
      <div className="mx-8 mb-8 p-6 bg-white border border-violet-100 shadow-sm">
        <div className="font-serif text-base text-[#2d1b69] mb-1">Consultation initiale</div>
        <p className="text-[10px] text-slate-400 mb-4">Première consultation gratuite · 45 minutes · Visio ou présentiel</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {['Lun 10', 'Mar 11', 'Jeu 13', 'Ven 14'].map((d, i) => (
            <button key={d} className={`py-2 text-[9px] tracking-wide border rounded transition-all ${i === 1 ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-400 hover:border-violet-300'}`}>
              {d}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['09:00', '10:30', '14:00', '15:30', '17:00'].map((h, i) => (
            <button key={h} className={`py-1.5 text-[9px] border rounded transition-all ${i === 2 ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-400'}`}>
              {h}
            </button>
          ))}
        </div>
        <button className="w-full py-3 bg-[#2d1b69] text-white text-[10px] tracking-widest uppercase hover:bg-violet-800 transition-colors rounded-sm">
          Confirmer la consultation
        </button>
        <div className="flex items-center gap-1.5 mt-3">
          <Check className="w-3 h-3 text-green-500" />
          <span className="text-[9px] text-slate-400">Confirmation par email et SMS automatique</span>
        </div>
      </div>

      {/* Trust */}
      <div className="px-8 pb-8 flex justify-between text-center">
        {[
          { v: '1ère', l: 'position Google\n47 requêtes' },
          { v: '15+', l: "années d'exercice" },
          { v: '98%', l: 'taux de succès' },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-serif text-2xl font-bold text-[#2d1b69]">{s.v}</div>
            <div className="text-[9px] text-slate-400 mt-0.5 whitespace-pre-line">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Mockup: Nexora Solutions (SaaS) ───────────────────────────────── */
function NexoraSite() {
  return (
    <div className="h-full overflow-y-auto bg-[#070d1a] text-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-3.5 bg-[#070d1a]/95 backdrop-blur-sm border-b border-cyan-900/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wider">Nexora</span>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] text-slate-400 uppercase tracking-widest">
          {['Produit', 'Tarifs', 'Docs', 'Blog'].map((l) => (
            <span key={l} className="hover:text-cyan-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="text-[10px] px-3 py-1.5 text-slate-300 hover:text-white transition-colors">Connexion</button>
          <button className="text-[10px] px-3 py-1.5 bg-cyan-500 text-white rounded hover:bg-cyan-400 transition-colors">Essai gratuit</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative px-8 py-12 text-center overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            MRR ×4 en 8 mois · Propulsé par MindFlow
          </div>
          <h1 className="font-bold text-3xl mb-3 leading-tight">
            Automatisez votre pipeline<br /><span className="text-cyan-400">commercial B2B</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
            Nexora connecte vos données CRM, automatise votre prospection outbound et prédit vos conversions avec une précision de 94%.
          </p>
          <div className="flex justify-center gap-3">
            <button className="px-5 py-2.5 bg-cyan-500 text-white text-xs rounded hover:bg-cyan-400 transition-colors font-medium">
              Commencer gratuitement
            </button>
            <button className="px-5 py-2.5 border border-slate-700 text-slate-300 text-xs rounded hover:border-cyan-700 transition-colors">
              Voir une démo
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard preview */}
      <div className="mx-8 mb-6 p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">Tableau de bord · Vue temps réel</div>
          <div className="flex items-center gap-1 text-[9px] text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'MRR', value: '48 200€', delta: '+12%', color: 'text-cyan-400' },
            { label: 'Leads/mois', value: '284', delta: '+34%', color: 'text-violet-400' },
            { label: 'Conversion', value: '18,4%', delta: '+6,2pp', color: 'text-green-400' },
          ].map((m) => (
            <div key={m.label} className="p-2.5 bg-slate-800/60 rounded">
              <div className="text-[9px] text-slate-500 mb-1">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[9px] text-green-500 mt-0.5">{m.delta} ce mois</div>
            </div>
          ))}
        </div>
        {/* Mini chart */}
        <div className="h-12 flex items-end gap-1">
          {[30, 42, 38, 55, 48, 62, 58, 72, 68, 85, 80, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t opacity-80"
              style={{
                height: `${h}%`,
                background: `linear-gradient(to top, #06B6D4, #8B5CF6)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-8 pb-6">
        <div className="text-[10px] tracking-widest text-slate-500 uppercase mb-3">Ce que Nexora fait pour vous</div>
        <div className="space-y-2">
          {[
            { icon: Users, label: 'Prospection automatique', desc: 'Identification et qualification des leads B2B' },
            { icon: BarChart2, label: 'Prédiction de conversion', desc: 'Score IA sur chaque opportunité pipeline' },
            { icon: Shield, label: 'CRM intelligent', desc: 'Sync bidirectionnelle avec Salesforce, HubSpot' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 p-3 bg-slate-900/40 border border-slate-800 rounded hover:border-cyan-900 transition-colors">
              <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-white">{f.label}</div>
                <div className="text-[9px] text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="px-8 pb-8">
        <div className="text-[10px] tracking-widest text-slate-500 uppercase mb-3">Tarifs</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { plan: 'Growth', price: '299€', desc: 'Jusqu&apos;à 5 utilisateurs', color: 'border-slate-700' },
            { plan: 'Scale', price: '799€', desc: 'Utilisateurs illimités', color: 'border-cyan-500/50 bg-cyan-500/5' },
          ].map((p) => (
            <div key={p.plan} className={`p-4 border rounded ${p.color}`}>
              <div className="font-semibold text-sm mb-1">{p.plan}</div>
              <div className="text-cyan-400 font-bold text-lg">{p.price}<span className="text-[10px] text-slate-500 font-normal">/mois</span></div>
              <div className="text-[9px] text-slate-500 mt-1">{p.desc}</div>
              <button className="w-full mt-3 py-1.5 text-[9px] border border-cyan-700 text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors">
                Choisir {p.plan}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Registry ───────────────────────────────────────────────────────── */
const mockups: Record<string, { title: string; url: string; component: React.FC }> = {
  gastro: { title: 'Maison Varel', url: 'www.maisonvarel.fr', component: MaisonVarelSite },
  hotel: { title: 'Grand Hôtel Aldric', url: 'www.grandhotel-aldric.fr', component: GrandHotelSite },
  btp: { title: 'Constructions Elaris', url: 'www.elaris-constructions.fr', component: EllarisSite },
  avocat: { title: 'Fontaine & Associés', url: 'www.fontaine-avocats.fr', component: FontaineSite },
  tech: { title: 'Nexora Solutions', url: 'www.nexora.io', component: NexoraSite },
}

/* ─── Modal wrapper ──────────────────────────────────────────────────── */
export function SiteMockupModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const mockup = mockups[projectId]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!mockup) return null

  const SiteComponent = mockup.component

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Browser chrome */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-[#1e1e1e] border-b border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-[#2d2d2d] rounded text-[11px] text-slate-400">
            <div className="flex gap-1">
              <ChevronRight className="w-3 h-3 rotate-180 opacity-30" />
              <ChevronRight className="w-3 h-3 opacity-30" />
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500/70 flex-shrink-0" />
            <span className="text-slate-300">{mockup.url}</span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-400 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Site créé par MindFlow
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors ml-1"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </motion.div>

        {/* Site content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', damping: 24, stiffness: 200 }}
          className="flex-1 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full overflow-y-auto">
            <SiteComponent />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import {
  X, Star, MapPin, Phone, Plus, Minus, Check,
  TrendingUp, Zap, Users, BarChart2, Shield, ChevronRight, ChevronLeft,
  HardHat, Scale, Building2, Utensils, Hotel,
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════════════
   🍽  MAISON VAREL — Menu Dynamique & Réservation
══════════════════════════════════════════════════════════════════ */
function MaisonVarelSite() {
  const [couvert, setCouvert] = useState(2)
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState('20:30')
  const [revealedItems, setRevealedItems] = useState<number[]>([])

  // Stagger reveal menu items on mount
  useEffect(() => {
    const items = [0, 1, 2, 3]
    items.forEach((i) => {
      setTimeout(() => setRevealedItems((prev) => [...prev, i]), 300 + i * 180)
    })
  }, [])

  const menu = [
    { name: 'Langoustine Royale', desc: 'Émulsion de corail · Caviar Osciètre · Fenouil marin', price: '68€', special: true },
    { name: 'Saint-Pierre Sauvage', desc: 'Vierge d\'agrumes · Asperges blanches · Beurre noisette', price: '72€', special: false },
    { name: 'Suprême de Pigeon', desc: 'Jus corsé · Truffe noire du Périgord · Céleri fumé', price: '76€', special: false },
    { name: 'Soufflé au Grand Marnier', desc: 'Crème anglaise vanille Bourbon · Tuile dorée', price: '28€', special: false },
  ]
  const days = ['Lun 12', 'Mar 13', 'Mer 14', 'Jeu 15']
  const slots = ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00']

  return (
    <div className="h-full overflow-y-auto font-sans select-none" style={{ background: '#0B0804', color: '#F5EDD6' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(11,8,4,0.92)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(212,175,80,0.15)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, letterSpacing: '0.25em', color: '#D4AF50' }}>
          MAISON VAREL
        </div>
        <div className="hidden md:flex gap-7" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(245,237,214,0.45)' }}>
          {['La Carte', 'Le Chef', 'Cave', 'Contact'].map((l) => (
            <span key={l} className="cursor-pointer hover:text-amber-300 transition-colors">{l}</span>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="text-[10px] tracking-[0.2em] px-5 py-2 transition-all"
          style={{ border: '0.5px solid rgba(212,175,80,0.5)', color: '#D4AF50' }}
        >
          RÉSERVER
        </motion.button>
      </nav>

      {/* Hero */}
      <div className="relative flex items-center justify-center py-14 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a1006 0%, #0B0804 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(180,130,30,0.12) 0%, transparent 65%)' }} />
        <div className="relative z-10 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[9px] tracking-[0.4em] mb-3 uppercase" style={{ color: '#D4AF50' }}>
            Paris 16e · Table Étoilée · Saison Printemps 2026
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 300, color: '#F5EDD6', letterSpacing: '0.02em' }}>
            L&apos;Art de la Table
          </motion.h1>
          <div className="flex justify-center gap-1 mt-4">
            {[1,2,3].map(i => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu — Plat du Jour badge + staggered reveal */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#F5EDD6' }}>Menu Dégustation</div>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold"
            style={{ background: 'rgba(212,175,80,0.15)', border: '0.5px solid rgba(212,175,80,0.4)', color: '#D4AF50' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Plat du Jour disponible
          </motion.div>
        </div>
        <div className="space-y-1">
          {menu.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, filter: 'blur(12px)', y: 8 }}
              animate={revealedItems.includes(i)
                ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                : { opacity: 0, filter: 'blur(12px)', y: 8 }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-between items-start py-4 group cursor-default"
              style={{ borderBottom: '0.5px solid rgba(212,175,80,0.08)' }}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: '#F5EDD6' }}>{item.name}</span>
                  {item.special && (
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,80,0.2)', color: '#D4AF50' }}>
                      ★ SIGNATURE
                    </span>
                  )}
                </div>
                <div className="text-[10px] italic" style={{ color: 'rgba(245,237,214,0.4)' }}>{item.desc}</div>
              </div>
              <div style={{ color: '#D4AF50', fontSize: 14, fontWeight: 300, flexShrink: 0 }}>{item.price}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Réservation widget */}
      <div className="mx-6 mb-8 p-6" style={{ border: '0.5px solid rgba(212,175,80,0.2)', background: 'rgba(212,175,80,0.03)' }}>
        <div className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: '#D4AF50' }}>Réservation en ligne · Temps réel</div>

        {/* Days */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {days.map((d, i) => (
            <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDay(i)}
              className="py-2 text-[10px] tracking-wide transition-all"
              style={{
                border: `0.5px solid ${selectedDay === i ? 'rgba(212,175,80,0.8)' : 'rgba(212,175,80,0.15)'}`,
                color: selectedDay === i ? '#D4AF50' : 'rgba(212,175,80,0.4)',
                background: selectedDay === i ? 'rgba(212,175,80,0.1)' : 'transparent',
              }}>
              {d}
            </motion.button>
          ))}
        </div>

        {/* Couverts counter */}
        <div className="flex items-center justify-between mb-4 py-3"
          style={{ borderTop: '0.5px solid rgba(212,175,80,0.1)', borderBottom: '0.5px solid rgba(212,175,80,0.1)' }}>
          <span className="text-[11px]" style={{ color: 'rgba(245,237,214,0.6)' }}>Nombre de couverts</span>
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setCouvert(Math.max(1, couvert - 1))}
              className="w-7 h-7 flex items-center justify-center transition-colors"
              style={{ border: '0.5px solid rgba(212,175,80,0.3)', color: '#D4AF50' }}>
              <Minus className="w-3 h-3" />
            </motion.button>
            <motion.span
              key={couvert}
              initial={{ scale: 1.3, color: '#D4AF50' }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#F5EDD6', minWidth: 24, textAlign: 'center' }}>
              {couvert}
            </motion.span>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setCouvert(Math.min(8, couvert + 1))}
              className="w-7 h-7 flex items-center justify-center transition-colors"
              style={{ border: '0.5px solid rgba(212,175,80,0.3)', color: '#D4AF50' }}>
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {slots.map((h) => (
            <motion.button key={h} whileTap={{ scale: 0.95 }} onClick={() => setSelectedSlot(h)}
              className="py-2 text-[10px] transition-all"
              style={{
                border: `0.5px solid ${selectedSlot === h ? 'rgba(212,175,80,0.8)' : 'rgba(212,175,80,0.1)'}`,
                color: selectedSlot === h ? '#D4AF50' : 'rgba(212,175,80,0.35)',
                background: selectedSlot === h ? 'rgba(212,175,80,0.08)' : 'transparent',
              }}>
              {h}
            </motion.button>
          ))}
        </div>

        <motion.button whileHover={{ filter: 'brightness(1.15)' }} whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 text-[10px] tracking-[0.2em] uppercase font-semibold transition-all"
          style={{ background: 'rgba(212,175,80,0.85)', color: '#0B0804' }}>
          Confirmer · {couvert} couvert{couvert > 1 ? 's' : ''} · {selectedSlot}
        </motion.button>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Check className="w-3 h-3" style={{ color: 'rgba(212,175,80,0.6)' }} />
          <span className="text-[9px]" style={{ color: 'rgba(212,175,80,0.5)' }}>Confirmation immédiate · Rappel SMS 2h avant</span>
        </div>
      </div>

      <div className="px-6 pb-6 flex justify-between text-center">
        {[{ v: '3 semaines', l: 'liste d\'attente' }, { v: '+280%', l: 'réservations' }, { v: '★★★', l: 'Michelin' }].map((s) => (
          <div key={s.l}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#D4AF50' }}>{s.v}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(245,237,214,0.35)' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   🏨  GRAND HÔTEL ALDRIC — Booking + Compteur odometer
══════════════════════════════════════════════════════════════════ */
function GrandHotelSite() {
  const basePrice = 580
  const [nights, setNights] = useState(3)
  const [displayPrice, setDisplayPrice] = useState(basePrice * 3)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(0)

  const priceVariants = [0, 1, 2, 4] // night delta
  const totalPrice = basePrice * nights

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayPrice(totalPrice)
      setIsAnimating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [nights, totalPrice])

  const rooms = [
    { name: 'Suite Riviera', size: '68m²', view: 'Vue mer partielle', price: 580, avail: true },
    { name: 'Suite Prestige', size: '95m²', view: 'Vue mer panoramique', price: 1240, avail: true },
    { name: 'Suite Présidentielle', size: '180m²', view: 'Terrasse privée · Vue mer', price: 2800, avail: false },
  ]

  return (
    <div className="h-full overflow-y-auto font-sans select-none" style={{ background: '#F4F1EC', color: '#1a2a3a' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm"
        style={{ borderBottom: '0.5px solid rgba(15,40,70,0.1)' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, letterSpacing: '0.12em', color: '#0c2340' }}>
            GRAND HÔTEL ALDRIC
          </div>
          <div className="text-[8px] tracking-widest" style={{ color: 'rgba(12,35,64,0.4)' }}>C&Ocirc;TE D&apos;AZUR · PALACE</div>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] tracking-widest" style={{ color: 'rgba(12,35,64,0.5)' }}>
          {['Suites', 'Spa', 'Gastronomie', 'Événements'].map((l) => (
            <span key={l} className="hover:text-sky-700 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="text-[10px] tracking-widest px-5 py-2 text-white transition-colors"
          style={{ background: '#0c2340' }}>
          RÉSERVER
        </motion.button>
      </nav>

      {/* Hero — panoramic gradient */}
      <div className="relative h-52 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0c2340 0%, #1e5f8a 40%, #2d9bd8 70%, #a8daf5 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 0.5px, transparent 0.5px, transparent 16px)' }} />
        {/* Water reflection effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to top, rgba(45,155,216,0.3), transparent)' }} />
        <div className="relative z-10 flex flex-col justify-end h-full px-8 pb-8">
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />)}
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 300, color: 'white' }}>
            Côte d&apos;Azur · Palace
          </div>
          <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>47 suites d&apos;exception · Vue mer panoramique</div>
        </div>
      </div>

      {/* Booking widget — interactive */}
      <div className="mx-6 -mt-4 relative z-10 p-5 bg-white shadow-xl" style={{ borderTop: '3px solid #0c2340' }}>
        <div className="text-[10px] tracking-widest uppercase mb-4" style={{ color: '#0c2340' }}>Séjour sur-mesure</div>

        {/* Nights selector */}
        <div className="flex items-center justify-between mb-4 py-3"
          style={{ borderTop: '0.5px solid rgba(12,35,64,0.08)', borderBottom: '0.5px solid rgba(12,35,64,0.08)' }}>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#0c2340' }}>Durée du séjour</div>
            <div className="text-[9px]" style={{ color: 'rgba(12,35,64,0.4)' }}>Arrivée · Départ flexible</div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setNights(Math.max(1, nights - 1))}
              className="w-8 h-8 flex items-center justify-center border transition-colors"
              style={{ borderColor: 'rgba(12,35,64,0.2)', color: '#0c2340' }}>
              <Minus className="w-3 h-3" />
            </motion.button>
            <div className="text-center" style={{ minWidth: 60 }}>
              <motion.div
                key={nights}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#0c2340', lineHeight: 1 }}>
                {nights}
              </motion.div>
              <div className="text-[9px]" style={{ color: 'rgba(12,35,64,0.4)' }}>nuit{nights > 1 ? 's' : ''}</div>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setNights(Math.min(14, nights + 1))}
              className="w-8 h-8 flex items-center justify-center border transition-colors"
              style={{ borderColor: 'rgba(12,35,64,0.2)', color: '#0c2340' }}>
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {/* Animated price */}
        <div className="flex items-end justify-between mb-4">
          <div className="text-[10px]" style={{ color: 'rgba(12,35,64,0.5)' }}>Tarif Suite Riviera ({nights} nuit{nights > 1 ? 's' : ''})</div>
          <motion.div
            key={displayPrice}
            initial={{ scale: 1.15, color: '#0EA5E9' }}
            animate={{ scale: 1, color: '#0c2340' }}
            transition={{ duration: 0.35 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600 }}>
            {(basePrice * nights).toLocaleString('fr-FR')}€
          </motion.div>
        </div>

        <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 text-white text-[10px] tracking-[0.2em] uppercase font-medium transition-all"
          style={{ background: '#0c2340' }}>
          Vérifier les disponibilités
        </motion.button>
      </div>

      {/* Rooms */}
      <div className="px-6 py-8">
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#0c2340', marginBottom: 20 }}>Nos Suites</div>
        <div className="space-y-3">
          {rooms.map((room, i) => (
            <motion.div key={room.name} whileHover={{ x: 3 }} onClick={() => setSelectedRoom(i)}
              className="flex items-center justify-between p-4 cursor-pointer transition-all"
              style={{
                border: `0.5px solid ${selectedRoom === i ? '#0c2340' : 'rgba(12,35,64,0.1)'}`,
                background: selectedRoom === i ? 'rgba(12,35,64,0.04)' : 'white',
              }}>
              <div>
                <div className="font-medium text-sm" style={{ color: '#0c2340' }}>{room.name}</div>
                <div className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'rgba(12,35,64,0.45)' }}>
                  <MapPin className="w-2.5 h-2.5" /> {room.size} · {room.view}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm" style={{ color: '#0c2340' }}>{room.price.toLocaleString('fr-FR')}€<span className="text-[9px] font-normal opacity-50">/nuit</span></div>
                <div className={`text-[9px] mt-0.5 ${room.avail ? 'text-green-600' : 'text-red-400'}`}>
                  {room.avail ? '● Disponible' : '○ Complet'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="px-6 pb-8 grid grid-cols-3 gap-2">
        {[
          { e: '🏊', l: 'Piscine infinie' }, { e: '🧖', l: 'Spa 2 000m²' },
          { e: '🍾', l: 'Gastronomie ★' }, { e: '🏖️', l: 'Plage privée' },
          { e: '🚁', l: 'Hélipad' }, { e: '⛵', l: 'Yacht club' },
        ].map((a) => (
          <div key={a.l} className="text-center p-3 bg-white border" style={{ borderColor: 'rgba(12,35,64,0.08)' }}>
            <div className="text-xl mb-1">{a.e}</div>
            <div className="text-[9px]" style={{ color: 'rgba(12,35,64,0.5)' }}>{a.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   👷  CONSTRUCTIONS ELARIS — Timeline Chantier + Slider Avant/Après
══════════════════════════════════════════════════════════════════ */
function EllarisSite() {
  const [activePhase, setActivePhase] = useState(2)
  const [sliderPos, setSliderPos] = useState(45)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const phases = [
    { label: 'Fondations', icon: '⛏️', date: 'Jan 2026' },
    { label: 'Structure', icon: '🏗️', date: 'Fév 2026' },
    { label: 'Toiture', icon: '🔨', date: 'Mar 2026' },
    { label: 'Finitions', icon: '✨', date: 'Avr 2026' },
  ]

  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  return (
    <div className="h-full overflow-y-auto font-sans select-none" style={{ background: '#0E1612', color: '#E8F5EE' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(14,22,18,0.95)', backdropFilter: 'blur(10px)', borderBottom: '0.5px solid rgba(16,185,129,0.15)' }}>
        <div className="flex items-center gap-2">
          <motion.div className="w-5 h-5 bg-emerald-500 rotate-45" animate={{ rotate: [45, 50, 45] }} transition={{ duration: 3, repeat: Infinity }} />
          <span className="font-bold tracking-wider text-sm">ELARIS</span>
          <span className="text-[9px] tracking-widest" style={{ color: 'rgba(16,185,129,0.6)' }}>CONSTRUCTIONS</span>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] tracking-widest" style={{ color: 'rgba(232,245,238,0.4)' }}>
          {['Réalisations', 'Services', 'Programmes', 'Contact'].map((l) => (
            <span key={l} className="hover:text-emerald-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="text-[10px] tracking-widest px-4 py-2 text-white"
          style={{ background: '#10B981' }}>
          CONTACT
        </motion.button>
      </nav>

      {/* Hero */}
      <div className="px-6 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #10b981 0px, #10b981 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, #10b981 0px, #10b981 1px, transparent 1px, transparent 28px)' }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: '#10B981' }}>Promotion Immobilière Haut de Gamme</div>
          <h1 className="font-bold leading-tight mb-4" style={{ fontSize: 32 }}>
            L&apos;excellence<br /><span style={{ color: '#10B981' }}>architecturale</span><br />au service<br />de votre patrimoine.
          </h1>
          <div className="flex gap-3">
            <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 text-white text-[10px] tracking-widest"
              style={{ background: '#10B981' }}>
              NOS PROGRAMMES
            </motion.button>
            <motion.button whileHover={{ borderColor: '#10B981' }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 text-[10px] tracking-widest transition-all"
              style={{ border: '0.5px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
              INVESTIR
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Timeline Chantier interactive */}
      <div className="px-6 py-6" style={{ borderTop: '0.5px solid rgba(16,185,129,0.1)' }}>
        <div className="text-[9px] tracking-widest uppercase mb-5" style={{ color: 'rgba(16,185,129,0.6)' }}>
          Suivi de chantier · Clos Saint-Honoré
        </div>
        <div className="relative mb-6">
          {/* Progress line */}
          <div className="absolute top-5 left-5 right-5 h-[1px]" style={{ background: 'rgba(16,185,129,0.15)' }} />
          <motion.div
            className="absolute top-5 left-5 h-[1px]"
            style={{ background: 'linear-gradient(90deg, #10B981, #06B6D4)' }}
            animate={{ width: `${(activePhase / (phases.length - 1)) * (100 - 10)}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="flex justify-between relative z-10">
            {phases.map((ph, i) => {
              const done = i <= activePhase
              return (
                <motion.button key={ph.label} onClick={() => setActivePhase(i)}
                  className="flex flex-col items-center gap-2"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-base transition-all"
                    animate={{
                      background: done ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.06)',
                      borderColor: done ? '#10B981' : 'rgba(16,185,129,0.2)',
                      scale: i === activePhase ? 1.12 : 1,
                    }}
                    style={{ border: '1px solid' }}
                  >
                    {ph.icon}
                  </motion.div>
                  <div className="text-center">
                    <div className="text-[9px] font-semibold" style={{ color: done ? '#10B981' : 'rgba(232,245,238,0.3)' }}>{ph.label}</div>
                    <div className="text-[8px]" style={{ color: 'rgba(232,245,238,0.25)' }}>{ph.date}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activePhase}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="px-4 py-3 rounded-lg text-xs"
            style={{ background: 'rgba(16,185,129,0.08)', border: '0.5px solid rgba(16,185,129,0.2)', color: 'rgba(232,245,238,0.7)' }}>
            {[
              'Terrassement terminé · Béton armé coulé · Conforme aux normes parasismiques RT2025',
              'Charpente métallique en place · Murs porteurs à 80% · Inspectée le 15/02',
              'Étanchéité posée · Isolation thermique renforcée · RE2020 certifiée',
              'Revêtements premium commandés · Cuisines Boffi · Salles de bains Duravit',
            ][activePhase]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Avant / Après slider */}
      <div className="px-6 py-6">
        <div className="text-[9px] tracking-widest uppercase mb-4" style={{ color: 'rgba(16,185,129,0.6)' }}>
          Visualisation · Avant / Après réhabilitation
        </div>
        <div
          ref={sliderRef}
          className="relative h-40 rounded-xl overflow-hidden cursor-ew-resize"
          onMouseDown={(e) => { isDragging.current = true; handleSliderMove(e.clientX) }}
          onMouseMove={(e) => { if (isDragging.current) handleSliderMove(e.clientX) }}
          onMouseUp={() => { isDragging.current = false }}
          onMouseLeave={() => { isDragging.current = false }}
          onTouchStart={(e) => { isDragging.current = true; handleSliderMove(e.touches[0].clientX) }}
          onTouchMove={(e) => { handleSliderMove(e.touches[0].clientX) }}
          onTouchEnd={() => { isDragging.current = false }}
        >
          {/* "Avant" — left side */}
          <div className="absolute inset-0 flex items-end pb-3 pl-3"
            style={{ background: 'linear-gradient(135deg, #1a1a0f 0%, #2d3324 100%)' }}>
            <div className="text-[9px] font-bold tracking-widest" style={{ color: 'rgba(255,200,80,0.6)' }}>AVANT</div>
            {/* Wireframe bâtiment ancien */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-32 h-24 border-2 border-yellow-600 relative">
                <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-yellow-600 flex items-center justify-center">
                  <div className="w-0 h-0" style={{ borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '8px solid rgba(202,138,4,0.5)' }} />
                </div>
                {[0,1,2].map(r => <div key={r} className="absolute flex gap-2" style={{ top: 36 + r * 20, left: 8 }}>
                  {[0,1,2].map(c => <div key={c} className="w-5 h-5 border border-yellow-700" />)}
                </div>)}
              </div>
            </div>
          </div>

          {/* "Après" — clip droite */}
          <div className="absolute inset-0 flex items-end pb-3"
            style={{
              clipPath: `inset(0 0 0 ${sliderPos}%)`,
              background: 'linear-gradient(135deg, #0a1f14 0%, #111714 100%)',
            }}>
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <div className="w-36 h-28 relative">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0.1) 100%)', border: '1px solid rgba(16,185,129,0.4)' }} />
                <div className="absolute inset-1" style={{ background: 'rgba(16,185,129,0.05)' }}>
                  {[0,1,2].map(r => <div key={r} className="flex gap-1 m-1">
                    {[0,1,2,4].map(c => <div key={c} className="h-4 flex-1" style={{ background: 'rgba(16,185,129,0.3)' }} />)}
                  </div>)}
                </div>
              </div>
            </div>
            <div className="ml-auto mr-3 text-[9px] font-bold tracking-widest" style={{ color: 'rgba(16,185,129,0.8)' }}>APRÈS</div>
          </div>

          {/* Slider handle */}
          <motion.div
            className="absolute inset-y-0 w-0.5 flex items-center justify-center"
            style={{ left: `${sliderPos}%`, background: 'rgba(255,255,255,0.7)' }}>
            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5">
              <ChevronLeft className="w-2.5 h-2.5 text-gray-600" />
              <ChevronRight className="w-2.5 h-2.5 text-gray-600" />
            </div>
          </motion.div>
        </div>
        <div className="text-center mt-2 text-[9px]" style={{ color: 'rgba(16,185,129,0.4)' }}>Faites glisser pour comparer</div>
      </div>

      {/* Stats */}
      <div className="mx-6 mb-8 p-5 grid grid-cols-3 gap-4 text-center"
        style={{ border: '0.5px solid rgba(16,185,129,0.15)', background: 'rgba(16,185,129,0.04)' }}>
        {[{ v: '×8', l: 'leads qualifiés' }, { v: '÷6', l: 'coût par lead' }, { v: '34', l: 'leads/mois via MindFlow' }].map((s) => (
          <div key={s.l}>
            <div className="text-2xl font-bold" style={{ color: '#10B981' }}>{s.v}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(232,245,238,0.35)' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ⚖️  FONTAINE & ASSOCIÉS — Colonnes de cristal + Consultation
══════════════════════════════════════════════════════════════════ */
function FontaineSite() {
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState(1)
  const [selectedTime, setSelectedTime] = useState('10:30')
  const [btnHovered, setBtnHovered] = useState(false)

  const pillars = [
    { label: 'Droit des Affaires', icon: Building2, desc: 'Création · M&A · Gouvernance', color: '#6D28D9' },
    { label: 'Fiscalité', icon: Scale, desc: 'Optimisation · Contentieux · International', color: '#7C3AED' },
    { label: 'Pénal des Affaires', icon: HardHat, desc: 'Défense · Compliance · Enquêtes', color: '#8B5CF6' },
  ]

  const dates = ['Lun 10', 'Mar 11', 'Jeu 13', 'Ven 14']
  const times = ['09:00', '10:30', '14:00', '15:30', '17:00']

  return (
    <div className="h-full overflow-y-auto font-sans select-none" style={{ background: '#F7F5F2', color: '#1a1625' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b"
        style={{ borderColor: 'rgba(45,27,105,0.08)' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: '#2d1b69', letterSpacing: '0.05em' }}>
            Fontaine & Associés
          </div>
          <div className="text-[8px] tracking-widest mt-0.5" style={{ color: 'rgba(45,27,105,0.4)' }}>AVOCATS · DROIT DES AFFAIRES · LYON</div>
        </div>
        <div className="hidden md:flex gap-5 text-[10px] tracking-widest" style={{ color: 'rgba(45,27,105,0.45)' }}>
          {['Expertise', 'Cabinet', 'Actualités', 'Contact'].map((l) => (
            <span key={l} className="hover:text-violet-700 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="text-[10px] tracking-widest px-4 py-2 text-white rounded-sm transition-colors"
          style={{ background: '#2d1b69' }}>
          Prendre RDV
        </motion.button>
      </nav>

      {/* Hero */}
      <div className="relative px-6 py-12 text-white overflow-hidden" style={{ background: '#2d1b69' }}>
        <div className="absolute right-0 top-0 h-full w-40 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 18px)' }} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(200,180,255,0.7)' }}>
            Lyon · Fondé en 2009 · 12 associés
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, maxWidth: 360, lineHeight: 1.3 }}>
            La rigueur juridique au service de vos ambitions.
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <motion.button
              onHoverStart={() => setBtnHovered(true)}
              onHoverEnd={() => setBtnHovered(false)}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden px-5 py-2.5 text-[10px] tracking-widest font-medium transition-colors"
              style={{ background: 'white', color: '#2d1b69' }}>
              {/* Light sweep */}
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={btnHovered ? { x: '200%' } : { x: '-100%' }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.15) 50%, transparent 100%)', skewX: -15 }}
              />
              NOS EXPERTISES
            </motion.button>
            <div className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(200,180,255,0.6)' }}>
              <Phone className="w-3 h-3" /> +33 4 72 00 00 00
            </div>
          </div>
        </motion.div>
      </div>

      {/* Colonnes de cristal */}
      <div className="px-6 py-8">
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#2d1b69', marginBottom: 20 }}>
          Domaines d&apos;expertise
        </div>
        <div className="grid grid-cols-3 gap-3">
          {pillars.map((p, i) => {
            const Icon = p.icon
            const isHov = hoveredPillar === i
            return (
              <motion.div
                key={p.label}
                onHoverStart={() => setHoveredPillar(i)}
                onHoverEnd={() => setHoveredPillar(null)}
                whileHover={{ y: -4 }}
                className="relative p-5 cursor-default overflow-hidden"
                style={{
                  border: `1px solid ${isHov ? p.color : 'rgba(45,27,105,0.12)'}`,
                  background: isHov ? `${p.color}08` : 'white',
                  transition: 'all 0.3s ease',
                }}>
                {/* Crystal glow */}
                <AnimatePresence>
                  {isHov && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${p.color}20 0%, transparent 70%)` }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  animate={{ color: isHov ? p.color : 'rgba(45,27,105,0.3)' }}
                  className="mb-3 relative z-10">
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div className="text-xs font-bold mb-1 relative z-10" style={{ color: isHov ? p.color : '#2d1b69', lineHeight: 1.3 }}>
                  {p.label}
                </div>
                <div className="text-[9px] relative z-10" style={{ color: 'rgba(45,27,105,0.45)' }}>{p.desc}</div>
                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5"
                  animate={{ width: isHov ? '100%' : '0%', background: p.color }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* RDV widget */}
      <div className="mx-6 mb-8 p-5 bg-white border shadow-sm" style={{ borderColor: 'rgba(45,27,105,0.1)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: '#2d1b69', marginBottom: 4 }}>
          Consultation initiale
        </div>
        <div className="text-[10px] mb-4" style={{ color: 'rgba(45,27,105,0.45)' }}>
          Gratuite · 45 min · Visio ou présentiel à Lyon
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {dates.map((d, i) => (
            <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDate(i)}
              className="py-2 text-[9px] tracking-wide rounded transition-all"
              style={{
                border: `0.5px solid ${selectedDate === i ? '#2d1b69' : 'rgba(45,27,105,0.12)'}`,
                color: selectedDate === i ? '#2d1b69' : 'rgba(45,27,105,0.4)',
                background: selectedDate === i ? 'rgba(45,27,105,0.06)' : 'transparent',
              }}>
              {d}
            </motion.button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {times.map((h) => (
            <motion.button key={h} whileTap={{ scale: 0.95 }} onClick={() => setSelectedTime(h)}
              className="py-1.5 text-[9px] rounded transition-all"
              style={{
                border: `0.5px solid ${selectedTime === h ? '#2d1b69' : 'rgba(45,27,105,0.1)'}`,
                color: selectedTime === h ? '#2d1b69' : 'rgba(45,27,105,0.35)',
                background: selectedTime === h ? 'rgba(45,27,105,0.06)' : 'transparent',
              }}>
              {h}
            </motion.button>
          ))}
        </div>
        <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 text-white text-[10px] tracking-widest uppercase rounded-sm"
          style={{ background: '#2d1b69' }}>
          Confirmer la consultation
        </motion.button>
        <div className="flex items-center gap-1.5 mt-3">
          <Check className="w-3 h-3 text-emerald-500" />
          <span className="text-[9px]" style={{ color: 'rgba(45,27,105,0.4)' }}>Confirmation par email et SMS automatique</span>
        </div>
      </div>

      {/* Trust */}
      <div className="px-6 pb-8 flex justify-between text-center">
        {[{ v: '#1', l: 'Google · 47 requêtes' }, { v: '+320%', l: 'visibilité organique' }, { v: '98%', l: 'taux de succès' }].map((s) => (
          <div key={s.l}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#2d1b69' }}>{s.v}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(45,27,105,0.45)' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   🚀  NEXORA SOLUTIONS — Radial Growth Chart + Live Feed Marquee
══════════════════════════════════════════════════════════════════ */
function NexoraSite() {
  const [isHovered, setIsHovered] = useState(false)
  const [autoFill, setAutoFill] = useState(false)
  const [feedItems, setFeedItems] = useState([
    'Nouveau client capturé (SaaS B2B) — ROI ×12', 'Pipeline +34% ce mois', 'Lead qualifié · Secteur FinTech (Paris)',
    'Conversion automatisée · Deal 28 000€', 'Score IA: 94/100 · Prospect chaud détecté',
    'Outbound sequence déclenché · 3 réponses', 'MRR +18% vs mois précédent',
  ])
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Auto-fill on mount
  useEffect(() => {
    const t = setTimeout(() => setAutoFill(true), 600)
    return () => clearTimeout(t)
  }, [])

  const metrics = [
    { label: 'MRR', value: '48 200€', delta: '+12%', color: '#06B6D4', progress: 78 },
    { label: 'Leads/mois', value: '284', delta: '+34%', color: '#8B5CF6', progress: 85 },
    { label: 'Conversion', value: '18,4%', delta: '+6pp', color: '#22C55E', progress: 65 },
  ]

  const r = 42
  const cx = 60
  const cy = 60
  const circ = 2 * Math.PI * r

  return (
    <div className="h-full overflow-y-auto font-sans select-none" style={{ background: '#070d1a', color: '#E2E8F0' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5"
        style={{ background: 'rgba(7,13,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(6,182,212,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wider">Nexora</span>
        </div>
        <div className="hidden md:flex gap-5 text-[10px] tracking-widest" style={{ color: 'rgba(226,232,240,0.4)' }}>
          {['Produit', 'Tarifs', 'Docs', 'Blog'].map((l) => (
            <span key={l} className="hover:text-cyan-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="text-[10px] px-3 py-1.5 transition-colors" style={{ color: 'rgba(226,232,240,0.5)' }}>Connexion</button>
          <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
            className="text-[10px] px-3 py-1.5 rounded text-white"
            style={{ background: '#06B6D4' }}>
            Essai gratuit
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative px-6 py-10 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -5%, rgba(6,182,212,0.07) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-[10px]"
            style={{ background: 'rgba(6,182,212,0.1)', border: '0.5px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}>
            <motion.div className="w-1.5 h-1.5 rounded-full bg-cyan-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            MRR ×4 en 8 mois · Propulsé par MindFlow
          </div>
          <h1 className="font-bold leading-tight mb-3" style={{ fontSize: 30 }}>
            Automatisez votre pipeline<br /><span style={{ color: '#06B6D4' }}>commercial B2B</span>
          </h1>
          <p className="text-xs max-w-xs mx-auto mb-6 leading-relaxed" style={{ color: 'rgba(226,232,240,0.45)' }}>
            Nexora connecte vos données CRM, automatise votre prospection et prédit vos conversions à 94%.
          </p>
          <div className="flex justify-center gap-3">
            <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 text-white text-xs rounded font-medium"
              style={{ background: '#06B6D4' }}>
              Commencer gratuitement
            </motion.button>
            <motion.button whileHover={{ borderColor: '#06B6D4' }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 text-xs rounded transition-colors"
              style={{ border: '0.5px solid rgba(226,232,240,0.12)', color: 'rgba(226,232,240,0.55)' }}>
              Voir une démo
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Radial chart — fills on hover */}
      <div className="px-6 mb-6">
        <div
          className="p-5 rounded-xl cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(6,182,212,0.12)' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(226,232,240,0.4)' }}>Croissance globale · Vue annuelle</div>
            <motion.div
              animate={{ opacity: (isHovered || autoFill) ? 1 : 0 }}
              className="flex items-center gap-1.5 text-[10px]"
              style={{ color: '#22C55E' }}>
              <TrendingUp className="w-3 h-3" /> +340% leads
            </motion.div>
          </div>
          <div className="flex items-center justify-center gap-3">
            {/* Radial charts */}
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <svg width="90" height="90" viewBox="0 0 120 120">
                    {/* Background ring */}
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    {/* Animated progress ring */}
                    <motion.circle
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={m.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      initial={{ strokeDashoffset: circ, opacity: 0.5 }}
                      animate={{
                        strokeDashoffset: (isHovered || autoFill) ? circ * (1 - m.progress / 100) : circ,
                        opacity: (isHovered || autoFill) ? 1 : 0.3,
                        filter: (isHovered || autoFill) ? `drop-shadow(0 0 8px ${m.color})` : 'none',
                      }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      transform={`rotate(-90 ${cx} ${cy})`}
                      style={{ strokeDashoffset: circ }}
                    />
                    {/* Center value */}
                    <text x={cx} y={cy - 4} textAnchor="middle" className="text-[10px]" fill={m.color} fontSize="11" fontWeight="700">
                      {m.value.split('€')[0].split('/')[0]}
                    </text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(226,232,240,0.35)" fontSize="8">
                      {m.label}
                    </text>
                  </svg>
                </div>
                <motion.div
                  animate={{ color: (isHovered || autoFill) ? '#22C55E' : 'rgba(226,232,240,0.3)' }}
                  className="text-[9px] font-semibold text-center">
                  {m.delta} ce mois
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3 text-[9px]" style={{ color: 'rgba(226,232,240,0.25)' }}>
            {isHovered ? '● Live · Survol maintenu' : 'Survolez pour voir l\'évolution en temps réel'}
          </div>
        </div>
      </div>

      {/* Live Feed Marquee */}
      <div className="relative overflow-hidden py-2.5 mb-6"
        style={{ borderTop: '0.5px solid rgba(6,182,212,0.1)', borderBottom: '0.5px solid rgba(6,182,212,0.1)', background: 'rgba(6,182,212,0.03)' }}>
        <div className="flex items-center gap-2 mb-1.5 px-6">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-cyan-400" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#06B6D4' }}>LIVE FEED</span>
        </div>
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...feedItems, ...feedItems].map((item, i) => (
              <span key={i} className="text-[10px] flex-shrink-0" style={{ color: 'rgba(226,232,240,0.5)' }}>
                <span style={{ color: '#06B6D4' }}>▸</span> {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-6 space-y-2">
        {[
          { Icon: Users, l: 'Prospection automatique', d: 'Identification et qualification des leads B2B en temps réel' },
          { Icon: BarChart2, l: 'Prédiction de conversion', d: 'Score IA sur chaque opportunité du pipeline commercial' },
          { Icon: Shield, l: 'CRM intelligent', d: 'Sync bidirectionnelle avec Salesforce, HubSpot, Pipedrive' },
        ].map((f) => (
          <motion.div key={f.l} whileHover={{ x: 3, borderColor: 'rgba(6,182,212,0.3)' }}
            className="flex items-center gap-3 p-3 rounded transition-all"
            style={{ border: '0.5px solid rgba(226,232,240,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(6,182,212,0.1)', border: '0.5px solid rgba(6,182,212,0.2)' }}>
              <f.Icon className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-medium">{f.l}</div>
              <div className="text-[9px] mt-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>{f.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   Registry + Modal wrapper
══════════════════════════════════════════════════════════════════ */
const mockups: Record<string, { title: string; url: string; component: React.FC }> = {
  gastro: { title: 'Maison Varel', url: 'www.maisonvarel.fr', component: MaisonVarelSite },
  hotel: { title: 'Grand Hôtel Aldric', url: 'www.grandhotel-aldric.fr', component: GrandHotelSite },
  btp: { title: 'Constructions Elaris', url: 'www.elaris-constructions.fr', component: EllarisSite },
  avocat: { title: 'Fontaine & Associés', url: 'www.fontaine-avocats.fr', component: FontaineSite },
  tech: { title: 'Nexora Solutions', url: 'www.nexora.io', component: NexoraSite },
}

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
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        {/* Browser chrome */}
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, type: 'spring', damping: 24, stiffness: 280 }}
          className="flex-shrink-0 flex items-center gap-3 px-5 py-3"
          style={{ background: '#1C1C1E', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full transition-opacity hover:opacity-70" style={{ background: '#FF5F57' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
          </div>
          {/* Navigation arrows */}
          <div className="flex gap-1">
            <ChevronLeft className="w-4 h-4 opacity-30" style={{ color: '#E2E8F0' }} />
            <ChevronRight className="w-4 h-4 opacity-30" style={{ color: '#E2E8F0' }} />
          </div>
          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px]"
            style={{ background: '#2C2C2E', color: 'rgba(226,232,240,0.7)' }}>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#22C55E', opacity: 0.8 }} />
            <span>{mockup.url}</span>
          </div>
          {/* MindFlow badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.12)', border: '0.5px solid rgba(139,92,246,0.25)', color: '#A78BFA' }}>
            <Zap className="w-3 h-3" /> Site créé par MindFlow
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-white/10 ml-1"
            style={{ color: 'rgba(226,232,240,0.5)' }}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Viewport */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', damping: 26, stiffness: 240 }}
          className="flex-1 overflow-hidden mx-0 sm:mx-12 lg:mx-24 xl:mx-48"
          onClick={(e) => e.stopPropagation()}
          style={{ borderLeft: '0.5px solid rgba(255,255,255,0.06)', borderRight: '0.5px solid rgba(255,255,255,0.06)' }}
        >
          <div className="h-full overflow-y-auto">
            <SiteComponent />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

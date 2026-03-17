'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Zap, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface Alert {
  id: string
  type: 'success' | 'warning' | 'critical' | 'info'
  title: string
  message: string
  action?: string
}

interface Props {
  fillRate: number
  tendency: number
  confirmedRdv: number
}

const TYPE_STYLES = {
  success: { icon: CheckCircle2, color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  info: { icon: TrendingUp, color: '#A5F3FC', bg: 'rgba(165,243,252,0.08)', border: 'rgba(165,243,252,0.2)' },
  warning: { icon: AlertTriangle, color: '#FCD34D', bg: 'rgba(252,211,77,0.08)', border: 'rgba(252,211,77,0.2)' },
  critical: { icon: TrendingDown, color: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
}

function generateAlerts(fillRate: number, tendency: number, confirmedRdv: number): Alert[] {
  const alerts: Alert[] = []

  if (fillRate >= 80) {
    alerts.push({
      id: 'high-fill',
      type: 'warning',
      title: 'Planning presque saturé',
      message: `Votre planning est rempli à ${fillRate}%. Pensez à augmenter votre capacité ou à lancer une liste d'attente.`,
      action: 'Gérer le planning',
    })
  }

  if (tendency >= 15) {
    alerts.push({
      id: 'positive-trend',
      type: 'success',
      title: 'Croissance exceptionnelle',
      message: `Le Moteur de Flux Prédictif détecte une hausse de ${tendency}% de votre CA. Momentum favorable !`,
    })
  } else if (tendency <= -10) {
    alerts.push({
      id: 'negative-trend',
      type: 'critical',
      title: 'Baisse de revenus détectée',
      message: `Une diminution de ${Math.abs(tendency)}% a été identifiée. Relancez vos clients inactifs pour inverser la tendance.`,
      action: 'Voir les recommandations',
    })
  }

  if (fillRate < 40) {
    alerts.push({
      id: 'low-fill',
      type: 'warning',
      title: 'Creux prévu cette semaine',
      message: "Des créneaux libres ont été identifiés. Contactez vos clients habituels pour maximiser l'activité.",
      action: 'Envoyer une relance',
    })
  }

  if (confirmedRdv >= 20) {
    alerts.push({
      id: 'high-rdv',
      type: 'info',
      title: 'Record de réservations',
      message: `${confirmedRdv} RDV confirmés ce mois — votre meilleure performance. L'Intelligence de Marché suggère de capitaliser.`,
    })
  }

  // Always add one predictive tip
  alerts.push({
    id: 'predictive-tip',
    type: 'info',
    title: 'Pic prédit pour vendredi',
    message: 'Le Moteur de Flux Prédictif anticipe une forte demande en fin de semaine. Préparez vos disponibilités.',
  })

  return alerts.slice(0, 4)
}

export default function PredictiveAlerts({ fillRate, tendency, confirmedRdv }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const alerts = generateAlerts(fillRate, tendency, confirmedRdv).filter((a) => !dismissed.includes(a.id))

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Bell className="w-4 h-4 text-amber-400" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-[7px] text-black font-bold flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Alertes Prédictives
            </span>
            <p className="text-[10px] text-slate-600">Moteur de Flux Prédictif</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-violet-bright">
          <Zap className="w-3 h-3" />
          <span>Analyse continue</span>
        </div>
      </div>

      {/* Alerts list */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <CheckCircle2 className="w-8 h-8 text-green-400/50" />
              <p className="text-[11px] text-slate-500">Aucune alerte active</p>
            </motion.div>
          ) : alerts.map((alert) => {
            const { icon: Icon, color, bg, border } = TYPE_STYLES[alert.type]
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative rounded-xl p-3 pr-8"
                style={{ backgroundColor: bg, border: `0.5px solid ${border}` }}
              >
                <div className="flex items-start gap-2">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-white leading-tight">{alert.title}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">{alert.message}</p>
                    {alert.action && (
                      <button className="mt-1.5 text-[9px] font-semibold underline underline-offset-2" style={{ color }}>
                        {alert.action} →
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDismissed((prev) => [...prev, alert.id])}
                  className="absolute top-2.5 right-2.5 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

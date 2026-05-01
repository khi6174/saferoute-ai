import type { RiskLevel } from '../engine/types'
import { RISK_LABELS } from '../utils/constants'

type Props = {
  score: number
  level: RiskLevel
  label?: string
}

const strokeByLevel: Record<RiskLevel, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
}

export function RiskScoreDial({ score, level, label = '현재 위험도' }: Props) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference

  return (
    <div className="rounded-lg border border-line bg-card p-4 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="relative mx-auto mt-3 h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={strokeByLevel[level]}
            strokeLinecap="round"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-ink">{score}</span>
          <span className="text-xs font-bold text-slate-500">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-sm font-bold" style={{ color: strokeByLevel[level] }}>
        {RISK_LABELS[level]}
      </div>
    </div>
  )
}

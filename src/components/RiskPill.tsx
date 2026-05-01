import type { RiskLevel } from '../engine/types'
import { RISK_BADGE_CLASSES, RISK_LABELS } from '../utils/constants'

type Props = {
  level: RiskLevel
  score: number
  compact?: boolean
}

const dotClasses: Record<RiskLevel, string> = {
  low: 'bg-safe',
  medium: 'bg-amber',
  high: 'bg-warning',
  critical: 'bg-danger',
}

export function RiskPill({ level, score, compact = false }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-bold ${compact ? 'text-xs' : 'text-sm'} ${RISK_BADGE_CLASSES[level]}`}>
      <span className={`h-2 w-2 rounded-full ${dotClasses[level]}`} />
      {level === 'critical' ? '즉시 지원 필요' : RISK_LABELS[level]} · {score}점
    </span>
  )
}

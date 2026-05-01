import type { RiskLevel } from '../engine/types'
import { RISK_BADGE_CLASSES, RISK_LABELS } from '../utils/constants'

type Props = {
  level: RiskLevel
  score: number
}

export function RiskPill({ level, score }: Props) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${RISK_BADGE_CLASSES[level]}`}>
      {RISK_LABELS[level]} · {score}점
    </span>
  )
}

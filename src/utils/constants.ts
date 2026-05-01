import type { RiskLevel } from '../engine/types'

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  critical: '매우 높음',
}

export const RISK_BADGE_CLASSES: Record<RiskLevel, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

export const CORE_MESSAGE =
  '우리는 배송을 더 빠르게 만드는 것이 아니라, 더 안전하게 만드는 AI를 만듭니다.'

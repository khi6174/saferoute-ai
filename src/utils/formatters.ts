import type { RiskLevel } from '../engine/types'
import { RISK_LABELS } from './constants'

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

export function roundScore(value: number) {
  return Math.round(clamp(value))
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

export function getRiskLabel(score: number) {
  return RISK_LABELS[getRiskLevel(score)]
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}시간 ${rest}분` : `${hours}시간`
}

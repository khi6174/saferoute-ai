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

export const RESPONSIBILITY_MESSAGE =
  'SafeRoute AI는 의사결정을 보조합니다. 최종 운영 판단은 현장 관리자와 기사에게 있습니다.'

export const SIMULATION_MESSAGE =
  '추천 적용 결과는 시뮬레이션이며, 실제 운영 전 현장 확인이 필요합니다.'

export const RISK_ENGINE_MESSAGE =
  '위험 점수는 규칙 기반 Risk Engine이 계산합니다. LLM은 점수를 계산하지 않고 설명과 보고서 작성에만 사용할 수 있습니다.'

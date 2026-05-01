import { Siren } from 'lucide-react'
import type { Recommendation, RiskResult } from '../engine/types'

type Props = {
  risk: RiskResult
  recommendation: Recommendation
}

export function SafetyAlert({ risk, recommendation }: Props) {
  const primaryReason = risk.factors[0]

  return (
    <section className="rounded-lg border border-danger/30 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Siren className="mt-1 shrink-0 text-danger" size={22} />
        <div>
          <h2 className="text-lg font-bold text-ink">실시간 안전 알림</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            위험도 {risk.riskScore}점: {primaryReason?.label} 요인이 크게 작용하고 있습니다.
            권장 행동: {recommendation.title}을 적용해 예상 위험도를 {recommendation.expectedRiskAfter}점까지 낮추는 것을 권장합니다.
          </p>
        </div>
      </div>
    </section>
  )
}

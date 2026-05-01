import { ClipboardCheck } from 'lucide-react'
import type { Courier, Recommendation, RiskResult, Weather } from '../engine/types'

type Props = {
  courier: Courier
  risk: RiskResult
  recommendation: Recommendation
  weather: Weather
  isApplied: boolean
}

export function DailySafetyReport({ courier, risk, recommendation, weather, isApplied }: Props) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <ClipboardCheck size={20} className="text-safe" />
        <h2 className="text-lg font-bold text-ink">일일 안전 리포트</h2>
      </div>
      <div className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
        <p>
          오늘의 핵심 지원 대상은 <strong className="text-ink">{courier.name}</strong>입니다. 현재 위험도는{' '}
          <strong className="text-ink">{risk.riskScore}점</strong>이며, 주요 환경은 <strong className="text-ink">{weather.label}</strong>입니다.
        </p>
        <p>
          가장 큰 위험 요인은 <strong className="text-ink">{risk.factors[0]?.label}</strong>입니다. AI는 기사에게 책임을 묻는 방식이 아니라,
          물량과 경로를 조정해 사고 가능성을 낮추는 방향으로 판단을 보조합니다.
        </p>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          {isApplied
            ? `${recommendation.title}이 적용되어 예상 위험도가 ${recommendation.expectedRiskAfter}점으로 낮아졌습니다.`
            : `${recommendation.title}을 적용하면 예상 위험도를 ${recommendation.expectedRiskBefore}점에서 ${recommendation.expectedRiskAfter}점으로 낮출 수 있습니다.`}
        </div>
      </div>
    </section>
  )
}

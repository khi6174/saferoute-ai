import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Recommendation, RiskResult } from '../engine/types'

type Props = {
  risk: RiskResult
  recommendation: Recommendation
  isApplied: boolean
}

export function DemoFlowPanel({ risk, recommendation, isApplied }: Props) {
  const steps = [
    '배송 상황 입력',
    `${risk.riskScore}점 ${risk.riskLevelLabel}`,
    risk.factors[0]?.label ?? '위험 원인 설명',
    '안전 경로 추천',
    recommendation.title,
    isApplied ? '개선 효과 확인 완료' : '관리자 확인 대기',
  ]

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">3분 데모 진행 흐름</h2>
          <p className="mt-1 text-sm text-emerald-800">배송 상황부터 관리자 개선 효과까지 한 화면에서 이어집니다.</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1 text-sm font-bold text-safe">
          <CheckCircle2 size={16} />
          안전 중심 의사결정
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span className="rounded-md border border-emerald-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-emerald-900">
              {step}
            </span>
            {index < steps.length - 1 ? <ArrowRight size={16} className="text-safe" /> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

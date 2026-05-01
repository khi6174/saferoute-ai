import { BellRing, CheckCircle2, Route, UserCheck } from 'lucide-react'
import type { Courier, Recommendation, RiskResult, RouteResult } from '../engine/types'
import { ControlSection } from './ControlSection'

type Props = {
  courier: Courier
  risk: RiskResult
  recommendation: Recommendation
  recommendedRoute: RouteResult
  isApplied: boolean
  onApply: () => void
}

export function PriorityActionPanel({
  courier,
  risk,
  recommendation,
  recommendedRoute,
  isApplied,
  onApply,
}: Props) {
  return (
    <ControlSection
      title="AI 권장 조치"
      description="현재 가장 먼저 확인해야 할 안전 조정안입니다."
      icon={<BellRing size={20} />}
      tone={risk.riskScore >= 80 ? 'danger' : 'amber'}
      action={
        <span className="rounded-md bg-navy px-3 py-1 text-sm font-bold text-white">
          관리자 확인 필요
        </span>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">지원 필요 기사</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <strong className="text-xl text-ink">{courier.name}</strong>
            <span className="rounded-md bg-red-100 px-2 py-1 text-sm font-bold text-danger">
              고위험 상태 · {risk.riskScore}점
            </span>
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-3">
          <div className="flex items-start gap-2">
            <UserCheck size={18} className="mt-0.5 text-amber" />
            <div>
              <p className="font-bold text-ink">{recommendation.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.message}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-3">
          <div className="flex items-start gap-2">
            <Route size={18} className="mt-0.5 text-info" />
            <div>
              <p className="font-bold text-ink">안전 경로 추천</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {recommendedRoute.label} 선택 시 경로 위험도는 {recommendedRoute.riskScore}점입니다.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={isApplied}
          onClick={onApply}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-3 text-sm font-black text-navy shadow-sm transition hover:bg-yellow-400 disabled:bg-slate-200 disabled:text-slate-500"
        >
          <CheckCircle2 size={18} />
          {isApplied ? '관리자 조정안 적용됨' : `관리자 조정안 적용 (${recommendation.expectedRiskBefore}점 → ${recommendation.expectedRiskAfter}점)`}
        </button>
      </div>
    </ControlSection>
  )
}

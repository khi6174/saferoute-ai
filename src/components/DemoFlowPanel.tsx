import { ArrowRight, CheckCircle2, HelpCircle, ShieldAlert, UserRoundCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Courier, Recommendation, RiskResult } from '../engine/types'
import { SIMULATION_MESSAGE } from '../utils/constants'

type Props = {
  courier: Courier
  risk: RiskResult
  recommendation: Recommendation
  isApplied: boolean
}

export function DemoFlowPanel({ courier, risk, recommendation, isApplied }: Props) {
  const primaryReason = risk.factors[0]?.label ?? '위험 요인 확인 필요'
  const secondaryReason = risk.factors[1]?.label
  const reasonText = secondaryReason ? `${primaryReason}, ${secondaryReason}` : primaryReason
  const steps = [
    '배송 상황 확인',
    '위험 예측',
    '원인 설명',
    '권장 조치 제안',
    isApplied ? '시뮬레이션 결과 확인' : '관리자 확인 대기',
  ]

  return (
    <section className="rounded-lg border border-amber/30 bg-amber/10 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">안전 의사결정 요약</h2>
          <p className="mt-1 text-sm text-slate-700">
            현재 화면은 지원 필요 기사, 위험 원인, 즉시 권장 조치를 한 번에 확인하도록 구성되어 있습니다.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-navy px-3 py-1 text-sm font-bold text-white">
          <CheckCircle2 size={16} />
          지원 중심 판단 보조
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <DecisionCard
          icon={<UserRoundCheck size={18} />}
          label="누가 위험한가?"
          value={courier.name}
          detail={`현재 위험도 ${risk.riskScore}점 · ${risk.riskLevelLabel}`}
        />
        <DecisionCard icon={<ShieldAlert size={18} />} label="왜 위험한가?" value={reasonText} detail="상위 위험 요인을 기준으로 설명합니다." />
        <DecisionCard
          icon={<HelpCircle size={18} />}
          label="지금 무엇을 해야 하나?"
          value={recommendation.title}
          detail={`${recommendation.expectedRiskBefore}점 → ${recommendation.expectedRiskAfter}점 예상`}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm font-semibold text-slate">
              {step}
            </span>
            {index < steps.length - 1 ? <ArrowRight size={16} className="text-amber" /> : null}
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-md bg-white/70 px-3 py-2 text-xs leading-5 text-slate-600">{SIMULATION_MESSAGE}</p>
    </section>
  )
}

function DecisionCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <article className="rounded-md border border-line bg-white p-3">
      <div className="flex items-center gap-2 text-xs font-black text-amber">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-lg font-black text-ink">{value}</div>
      <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
    </article>
  )
}

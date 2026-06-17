import { ArrowDownRight, Clock, PackageCheck, ShieldCheck, TrendingDown } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Recommendation } from '../engine/types'
import { SIMULATION_MESSAGE } from '../utils/constants'
import { ControlSection } from './ControlSection'

type Props = {
  recommendation: Recommendation
  summary: {
    beforeRisk: number
    afterRisk: number
    improvement: number
    redistributedPackages: number
    delayedDeliveries: number
    restRecommended: boolean
  }
  isApplied: boolean
}

export function BeforeAfterImpact({ recommendation, summary, isApplied }: Props) {
  const improvementRate = summary.beforeRisk > 0 ? Math.round((summary.improvement / summary.beforeRisk) * 100) : 0

  return (
    <ControlSection
      title="추천 적용 전/후 영향"
      description="AI 권장 조치를 적용했을 때 예상되는 안전 개선 효과입니다."
      icon={<ShieldCheck size={20} />}
    >
      <div className="rounded-md border border-line bg-white p-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <ScoreBox label="적용 전" score={summary.beforeRisk} tone="before" />
          <ArrowDownRight className="text-safe" size={24} />
          <ScoreBox label="적용 후 예상" score={summary.afterRisk} tone="after" />
        </div>
        <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-safe">
          위험도 {summary.improvement}점 감소 예상 · 약 {improvementRate}% 개선
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <ImpactRow icon={<TrendingDown size={16} />} label="우선 적용 조치" value={recommendation.title} />
        <ImpactRow icon={<PackageCheck size={16} />} label="물량 분산 권장" value={`${summary.redistributedPackages}건`} />
        <ImpactRow icon={<Clock size={16} />} label="저우선순위 지연 안내" value={`${summary.delayedDeliveries}건`} />
        <ImpactRow icon={<ShieldCheck size={16} />} label="휴식 권장" value={summary.restRecommended ? '필요' : '모니터링'} />
      </div>

      <p className={`mt-4 rounded-md p-3 text-sm leading-6 ${isApplied ? 'bg-amber/10 text-slate' : 'bg-slate-50 text-slate-700'}`}>
        {isApplied
          ? '관리자가 AI 권장 조치를 검토해 적용한 상태로 표시합니다.'
          : `${recommendation.title}을 적용할 경우의 예상 결과입니다.`}{' '}
        {SIMULATION_MESSAGE}
      </p>
    </ControlSection>
  )
}

function ScoreBox({ label, score, tone }: { label: string; score: number; tone: 'before' | 'after' }) {
  return (
    <div className={`rounded-md border p-3 text-center ${tone === 'before' ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-black ${tone === 'before' ? 'text-danger' : 'text-safe'}`}>{score}점</div>
    </div>
  )
}

function ImpactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-white px-3 py-2 text-sm">
      <span className="flex items-center gap-2 text-slate-600">
        {icon}
        {label}
      </span>
      <strong className="text-ink">{value}</strong>
    </div>
  )
}

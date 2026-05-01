import { ArrowDownRight, Clock, PackageCheck, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Recommendation } from '../engine/types'
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
  return (
    <ControlSection
      title="조정 전/후 개선 효과"
      description="AI 권장 조치 적용 시 예상되는 안전 개선입니다."
      icon={<ShieldCheck size={20} />}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <ScoreBox label="조정 전" score={summary.beforeRisk} tone="before" />
        <ArrowDownRight className="text-safe" size={24} />
        <ScoreBox label="조정 후" score={summary.afterRisk} tone="after" />
      </div>

      <div className="mt-4 rounded-md bg-slate-50 p-3">
        <p className="text-sm font-bold text-ink">
          예상 위험도 {summary.improvement}점 감소
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {isApplied ? '관리자 조정안이 적용된 상태입니다.' : `${recommendation.title}을 적용하면 위험도가 낮아지는 시뮬레이션 결과입니다.`}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <ImpactRow icon={<PackageCheck size={16} />} label="물량 분산 권장" value={`${summary.redistributedPackages}건`} />
        <ImpactRow icon={<Clock size={16} />} label="저우선순위 지연 안내" value={`${summary.delayedDeliveries}건`} />
        <ImpactRow icon={<ShieldCheck size={16} />} label="휴식 권장" value={summary.restRecommended ? '필요' : '모니터링'} />
      </div>
    </ControlSection>
  )
}

function ScoreBox({ label, score, tone }: { label: string; score: number; tone: 'before' | 'after' }) {
  return (
    <div className={`rounded-md border p-3 text-center ${tone === 'before' ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-black ${tone === 'before' ? 'text-danger' : 'text-safe'}`}>{score}점</div>
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

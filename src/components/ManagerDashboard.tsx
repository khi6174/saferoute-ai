import { ArrowRight, BarChart3, PackageCheck, ShieldCheck, TimerReset, TrendingDown, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { RESPONSIBILITY_MESSAGE, SIMULATION_MESSAGE } from '../utils/constants'
import { ControlSection } from './ControlSection'

type Props = {
  summary: {
    totalCouriers: number
    averageRisk: number
    highRiskCourierCount: number
    beforeRisk: number
    afterRisk: number
    improvement: number
    redistributedPackages: number
    delayedDeliveries: number
    restRecommended: boolean
  }
  isApplied: boolean
}

export function ManagerDashboard({ summary, isApplied }: Props) {
  const chartData = [
    { name: '적용 전', risk: summary.beforeRisk },
    { name: '적용 후 예상', risk: summary.afterRisk },
  ]

  return (
    <ControlSection
      title="관리자 영향 요약"
      description="선택 기사에 대한 AI 권장 조치가 운영 위험에 미치는 영향을 확인합니다."
      icon={<BarChart3 size={20} />}
      action={
        <span className={`rounded-md px-3 py-1 text-sm font-bold ${isApplied ? 'bg-amber text-navy' : 'bg-slate-100 text-slate-700'}`}>
          {isApplied ? '권장안 검토 완료' : '관리자 확인 필요'}
        </span>
      }
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <RiskHeroCard label="적용 전 위험도" score={summary.beforeRisk} tone="before" />
        <div className="flex items-center justify-center">
          <span className="flex h-11 w-11 rotate-90 items-center justify-center rounded-full bg-emerald-50 text-safe sm:rotate-0">
            <ArrowRight size={22} />
          </span>
        </div>
        <RiskHeroCard label="적용 후 예상" score={summary.afterRisk} tone="after" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric icon={<ShieldCheck size={18} />} label="Fleet 평균 위험도" value={`${summary.averageRisk}점`} tone="navy" />
        <DashboardMetric icon={<UsersRound size={18} />} label="지원 필요 기사" value={`${summary.highRiskCourierCount}명`} tone="danger" />
        <DashboardMetric icon={<PackageCheck size={18} />} label="물량 분산 권장" value={`${summary.redistributedPackages}건`} tone="amber" />
        <DashboardMetric icon={<TimerReset size={18} />} label="지연 안내 권장" value={`${summary.delayedDeliveries}건`} tone="slate" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="h-52 rounded-xl border border-line bg-slate-50/70 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="risk" name="위험도" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.name === '적용 전' ? '#EF4444' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-safe text-white shadow-sm">
            <TrendingDown size={20} />
          </span>
          <div className="mt-4 text-sm font-bold text-slate-500">예상 조정 효과</div>
          <div className="mt-1 text-4xl font-black tracking-tight text-safe">-{summary.improvement}점</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            선택 기사 위험도는 {summary.beforeRisk}점에서 {summary.afterRisk}점으로 낮아지는 것으로 시뮬레이션됩니다.
          </p>
        </div>
      </div>

      <p className={`mt-3 rounded-md p-3 text-sm leading-6 ${isApplied ? 'bg-amber/10 text-slate' : 'bg-slate-50 text-slate-700'}`}>
        {RESPONSIBILITY_MESSAGE} {SIMULATION_MESSAGE}
      </p>
    </ControlSection>
  )
}

function RiskHeroCard({ label, score, tone }: { label: string; score: number; tone: 'before' | 'after' }) {
  const isBefore = tone === 'before'

  return (
    <div className={`rounded-xl border p-5 ${isBefore ? 'border-red-200 bg-gradient-to-br from-red-50 to-white' : 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white'}`}>
      <div className="text-sm font-black text-slate-500">{label}</div>
      <div className={`mt-2 text-5xl font-black tracking-tight ${isBefore ? 'text-danger' : 'text-safe'}`}>
        {score}<span className="ml-1 text-xl">점</span>
      </div>
      <div className={`mt-3 h-1.5 overflow-hidden rounded-full ${isBefore ? 'bg-red-100' : 'bg-emerald-100'}`}>
        <div className={`h-full rounded-full ${isBefore ? 'bg-danger' : 'bg-safe'}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function DashboardMetric({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode
  label: string
  value: string
  tone: 'navy' | 'danger' | 'amber' | 'slate'
}) {
  const toneClasses = {
    navy: 'bg-slate-100 text-navy',
    danger: 'bg-red-50 text-danger',
    amber: 'bg-amber/10 text-amber',
    slate: 'bg-slate-100 text-slate-600',
  }

  return (
    <div className="rounded-xl border border-line bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>{icon}</span>
        <div>
          <div className="text-xs font-bold text-slate-500">{label}</div>
          <div className="mt-0.5 text-xl font-black text-ink">{value}</div>
        </div>
      </div>
    </div>
  )
}

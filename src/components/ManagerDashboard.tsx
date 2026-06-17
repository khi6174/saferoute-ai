import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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
      action={
        <span className={`rounded-md px-3 py-1 text-sm font-bold ${isApplied ? 'bg-amber text-navy' : 'bg-slate-100 text-slate-700'}`}>
          {isApplied ? '권장안 검토 완료' : '관리자 확인 필요'}
        </span>
      }
    >
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric label="Fleet 평균 위험도" value={`${summary.averageRisk}점`} />
        <DashboardMetric label="지원 필요 기사" value={`${summary.highRiskCourierCount}명`} />
        <DashboardMetric label="물량 분산 권장" value={`${summary.redistributedPackages}건`} />
        <DashboardMetric label="지연 안내 권장" value={`${summary.delayedDeliveries}건`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="risk" name="위험도" fill="#0F172A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-md border border-line bg-slate-50 p-3">
          <div className="text-sm font-bold text-slate-500">예상 조정 효과</div>
          <div className="mt-2 text-3xl font-black text-safe">-{summary.improvement}점</div>
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

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-slate-50 p-3">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-ink">{value}</div>
    </div>
  )
}

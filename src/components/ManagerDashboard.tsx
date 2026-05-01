import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
    { name: '조정 전', risk: summary.beforeRisk },
    { name: '조정 후', risk: summary.afterRisk },
  ]

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">관리자 대시보드 요약</h2>
        <span className={`rounded-md px-3 py-1 text-sm font-bold ${isApplied ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'}`}>
          {isApplied ? 'AI 조정안 적용 후' : 'AI 조정안 적용 전'}
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric label="평균 위험도" value={`${summary.averageRisk}점`} />
        <DashboardMetric label="고위험 기사" value={`${summary.highRiskCourierCount}명`} />
        <DashboardMetric label="물량 분산" value={`${summary.redistributedPackages}건`} />
        <DashboardMetric label="지연 안내" value={`${summary.delayedDeliveries}건`} />
      </div>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="risk" name="위험도" fill="#178a58" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className={`mt-3 rounded-md p-3 text-sm leading-6 ${isApplied ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-50 text-stone-700'}`}>
        {isApplied ? 'AI 추천이 적용되어' : 'AI 추천 적용 시'} 선택 기사 위험도는 {summary.beforeRisk}점에서 {summary.afterRisk}점으로 낮아지는 시뮬레이션 결과입니다.
        최종 운영 판단은 관리자와 기사 확인을 거쳐야 합니다.
      </p>
    </section>
  )
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
      <div className="text-sm text-stone-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-ink">{value}</div>
    </div>
  )
}

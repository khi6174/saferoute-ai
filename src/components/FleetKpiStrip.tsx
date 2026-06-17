import { Activity, AlertTriangle, PackageCheck, ShieldCheck } from 'lucide-react'

type Props = {
  summary: {
    averageRisk: number
    highRiskCourierCount: number
    improvement: number
    redistributedPackages: number
    delayedDeliveries: number
  }
}

export function FleetKpiStrip({ summary }: Props) {
  const items = [
    {
      label: 'Fleet 평균 위험도',
      value: `${summary.averageRisk}점`,
      icon: <Activity size={18} />,
      tone: 'text-info',
    },
    {
      label: '지원 필요 기사',
      value: `${summary.highRiskCourierCount}명`,
      icon: <AlertTriangle size={18} />,
      tone: 'text-amber',
    },
    {
      label: '예상 위험 감소',
      value: `-${summary.improvement}점`,
      icon: <ShieldCheck size={18} />,
      tone: 'text-safe',
    },
    {
      label: '물량 분산 권장',
      value: `${summary.redistributedPackages}건`,
      icon: <PackageCheck size={18} />,
      tone: 'text-warning',
    },
  ]

  return (
    <section className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="rounded-lg border border-line bg-card p-4 shadow-sm">
          <div className={`flex items-center gap-2 text-sm font-bold ${item.tone}`}>
            {item.icon}
            {item.label}
          </div>
          <div className="mt-2 text-2xl font-black text-ink">{item.value}</div>
        </article>
      ))}
    </section>
  )
}

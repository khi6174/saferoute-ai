import { Activity, AlertTriangle, PackageCheck, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

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
      tone: 'info' as const,
    },
    {
      label: '지원 필요 기사',
      value: `${summary.highRiskCourierCount}명`,
      icon: <AlertTriangle size={18} />,
      tone: 'danger' as const,
    },
    {
      label: '예상 위험 감소',
      value: `-${summary.improvement}점`,
      icon: <ShieldCheck size={18} />,
      tone: 'success' as const,
    },
    {
      label: '물량 분산 권장',
      value: `${summary.redistributedPackages}건`,
      icon: <PackageCheck size={18} />,
      tone: 'accent' as const,
    },
  ]

  return (
    <section className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="운영 핵심 지표">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </section>
  )
}

function KpiCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: ReactNode
  tone: 'info' | 'danger' | 'success' | 'accent'
}) {
  const styles = {
    info: { border: 'border-t-blue-500', icon: 'bg-blue-50 text-blue-600', value: 'text-blue-700' },
    danger: { border: 'border-t-danger', icon: 'bg-red-50 text-danger', value: 'text-danger' },
    success: { border: 'border-t-safe', icon: 'bg-emerald-50 text-safe', value: 'text-safe' },
    accent: { border: 'border-t-amber', icon: 'bg-amber/10 text-amber', value: 'text-amber' },
  }[tone]

  return (
    <article className={`group rounded-xl border border-line border-t-4 bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${styles.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
          <div className={`mt-2 text-3xl font-black tracking-tight ${styles.value}`}>{value}</div>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${styles.icon}`}>
          {icon}
        </span>
      </div>
    </article>
  )
}

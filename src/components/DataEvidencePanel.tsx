import { Database, FileWarning, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { RESPONSIBILITY_MESSAGE, RISK_ENGINE_MESSAGE, SIMULATION_MESSAGE } from '../utils/constants'

type Props = {
  courierCount: number
  deliveryCount: number
  regionCount: number
  routeCount: number
  weatherCount: number
}

export function DataEvidencePanel({ courierCount, deliveryCount, regionCount, routeCount, weatherCount }: Props) {
  const items = [
    ['시뮬레이션 기사', `${courierCount}명`],
    ['배송지 데이터', `${deliveryCount}건`],
    ['지역 특성', `${regionCount}개 구역`],
    ['경로 후보', `${routeCount}개`],
    ['날씨 시나리오', `${weatherCount}개`],
  ]

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Database size={20} className="text-safe" />
        <h2 className="text-lg font-bold text-ink">시뮬레이션 데이터와 책임 원칙</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        이 MVP는 실제 개인정보를 사용하지 않고, 공개 위험 요인에서 영감을 받은 구조화된 mock data로 안전 판단 흐름을 검증합니다.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-md border border-stone-200 bg-stone-50 p-3">
            <div className="text-xs font-semibold text-stone-500">{label}</div>
            <div className="mt-1 text-lg font-bold text-ink">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Principle icon={<ShieldCheck size={16} />} title="판단 보조" text={RESPONSIBILITY_MESSAGE} />
        <Principle icon={<FileWarning size={16} />} title="시뮬레이션 결과" text={SIMULATION_MESSAGE} />
        <Principle icon={<Database size={16} />} title="Risk Engine 기준" text={RISK_ENGINE_MESSAGE} />
      </div>
    </section>
  )
}

function Principle({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-md border border-line bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-sm font-bold text-ink">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
    </div>
  )
}

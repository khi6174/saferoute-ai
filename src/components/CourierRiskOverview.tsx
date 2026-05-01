import type { Courier, RiskResult } from '../engine/types'
import { RiskPill } from './RiskPill'

type Props = {
  couriers: Courier[]
  risks: RiskResult[]
  selectedCourierId: string
  onSelect: (id: string) => void
}

export function CourierRiskOverview({ couriers, risks, selectedCourierId, onSelect }: Props) {
  const sorted = [...risks].sort((a, b) => b.riskScore - a.riskScore)

  return (
    <section className="rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 p-4">
        <h2 className="text-lg font-bold text-ink">택배 기사 위험도 현황</h2>
        <p className="text-sm text-stone-600">고위험 기사와 지원 필요 요인을 먼저 확인합니다.</p>
      </div>
      <div className="max-h-[520px] divide-y divide-stone-100 overflow-auto">
        {sorted.map((risk) => {
          const courier = couriers.find((item) => item.id === risk.courierId)
          if (!courier) return null

          return (
            <button
              key={courier.id}
              className={`grid w-full grid-cols-[1fr_auto] gap-3 px-4 py-3 text-left transition hover:bg-stone-50 ${
                selectedCourierId === courier.id ? 'bg-lime-50' : ''
              }`}
              type="button"
              onClick={() => onSelect(courier.id)}
            >
              <span>
                <span className="block font-semibold text-ink">{courier.name}</span>
                <span className="mt-1 block text-sm text-stone-600">
                  남은 배송 {courier.remainingDeliveries}건 · 근무 {courier.workingHours}시간 · 지연 {courier.delayMinutes}분
                </span>
              </span>
              <RiskPill level={risk.riskLevel} score={risk.riskScore} />
            </button>
          )
        })}
      </div>
    </section>
  )
}

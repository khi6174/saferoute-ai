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
    <section className="rounded-lg border border-line bg-card shadow-sm">
      <div className="border-b border-line p-4">
        <h2 className="text-lg font-bold text-ink">지원 필요 기사 현황</h2>
        <p className="text-sm text-slate-600">안전 조정이 필요한 기사를 먼저 확인합니다.</p>
      </div>
      <div className="max-h-[620px] divide-y divide-slate-100 overflow-auto">
        {sorted.map((risk) => {
          const courier = couriers.find((item) => item.id === risk.courierId)
          if (!courier) return null

          return (
            <button
              key={courier.id}
              className={`grid w-full grid-cols-[1fr_auto] gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                selectedCourierId === courier.id ? 'bg-amber-50' : ''
              }`}
              type="button"
              onClick={() => onSelect(courier.id)}
            >
              <span>
                <span className="block font-bold text-ink">{courier.name}</span>
                <span className="mt-1 block text-sm text-slate-600">
                  남은 배송 {courier.remainingDeliveries}건 · 근무 {courier.workingHours}시간 · 지연 {courier.delayMinutes}분
                </span>
              </span>
              <RiskPill level={risk.riskLevel} score={risk.riskScore} compact />
            </button>
          )
        })}
      </div>
    </section>
  )
}

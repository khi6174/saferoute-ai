import { AlertTriangle, Clock, PackageCheck, Route } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Courier, RiskResult, Weather } from '../engine/types'
import { RiskPill } from './RiskPill'

type Props = {
  courier: Courier
  risk: RiskResult
  weather: Weather
}

export function SelectedCourierDetail({ courier, risk, weather }: Props) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-500">선택한 기사 상세 정보</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">{courier.name}</h2>
          <p className="mt-2 text-sm text-stone-600">
            SafeRoute AI는 기사 평가가 아니라 사고 예방과 물량 균형을 위한 의사결정 보조 시스템입니다.
          </p>
        </div>
        <RiskPill level={risk.riskLevel} score={risk.riskScore} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric icon={<PackageCheck size={18} />} label="남은 배송" value={`${courier.remainingDeliveries}건`} />
        <Metric icon={<Clock size={18} />} label="누적 근무" value={`${courier.workingHours}시간`} />
        <Metric icon={<Route size={18} />} label="총 이동거리" value={`${courier.totalDistanceKm}km`} />
        <Metric icon={<AlertTriangle size={18} />} label="현재 날씨" value={weather.label} />
      </div>
    </section>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center gap-2 text-sm text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-lg font-bold text-ink">{value}</div>
    </div>
  )
}

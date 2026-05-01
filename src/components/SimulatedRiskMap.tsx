import type { Region, RiskResult } from '../engine/types'

type Props = {
  regions: Region[]
  risks: RiskResult[]
}

export function SimulatedRiskMap({ regions, risks }: Props) {
  const averageRisk = risks.reduce((sum, risk) => sum + risk.riskScore, 0) / Math.max(risks.length, 1)

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-ink">위험 구역 시뮬레이션 맵</h2>
      <svg className="mt-3 h-64 w-full rounded-md border border-stone-200 bg-[#eef3ed]" viewBox="0 0 100 100" role="img">
        <title>시뮬레이션 기반 지역 위험도 맵</title>
        <path d="M8 28 C24 12, 45 18, 58 8 C72 22, 87 28, 91 49 C80 65, 76 83, 54 88 C37 78, 18 85, 8 63 Z" fill="#d9e5d7" />
        <path d="M20 58 L85 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <path d="M18 34 L78 78" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        {regions.map((region) => {
          const localRisk = Math.min(100, averageRisk * 0.45 + region.hillRatio * 22 + region.narrowRoadRatio * 22 + region.parkingDifficulty * 0.15)
          const fill = localRisk >= 75 ? '#d73a31' : localRisk >= 60 ? '#e46f27' : localRisk >= 40 ? '#d89b00' : '#178a58'
          return (
            <g key={region.id}>
              <circle cx={region.mapX} cy={region.mapY} r="7" fill={fill} opacity="0.88" />
              <text x={region.mapX} y={region.mapY + 13} textAnchor="middle" fontSize="4" fill="#17202a">
                {region.name.split(' ')[0]}
              </text>
            </g>
          )
        })}
      </svg>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { demoCouriers } from '../data/demoCouriers'
import { demoDeliveries } from '../data/demoDeliveries'
import { demoRegions } from '../data/demoRegions'
import { demoRoutes } from '../data/demoRoutes'
import { demoScenarios } from '../data/demoScenarios'
import { demoWeather } from '../data/demoWeather'
import { calculateRiskScore } from '../engine/riskScoring'
import { recommendRoute, scoreRoutes } from '../engine/routeScoring'
import { generateRecommendations } from '../engine/scheduleRecommender'
import { buildDashboardSummary } from '../engine/dashboardSummary'
import { CORE_MESSAGE } from '../utils/constants'
import { CourierRiskOverview } from '../components/CourierRiskOverview'
import { DemoScenarioSelector } from '../components/DemoScenarioSelector'
import { DemoFlowPanel } from '../components/DemoFlowPanel'
import { DataEvidencePanel } from '../components/DataEvidencePanel'
import { DailySafetyReport } from '../components/DailySafetyReport'
import { ManagerDashboard } from '../components/ManagerDashboard'
import { RiskFactorList } from '../components/RiskFactorList'
import { RouteComparison } from '../components/RouteComparison'
import { SafetyAlert } from '../components/SafetyAlert'
import { ScheduleRecommendation } from '../components/ScheduleRecommendation'
import { SelectedCourierDetail } from '../components/SelectedCourierDetail'
import { SimulatedRiskMap } from '../components/SimulatedRiskMap'

function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(demoScenarios[0].id)
  const selectedScenario = demoScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? demoScenarios[0]
  const [selectedCourierId, setSelectedCourierId] = useState(selectedScenario.defaultCourierId)
  const [recommendationApplied, setRecommendationApplied] = useState(false)

  const weather = demoWeather.find((item) => item.id === selectedScenario.weatherId) ?? demoWeather[0]

  const risks = useMemo(
    () =>
      demoCouriers.map((courier) => {
        const regions = demoRegions.filter((region) => courier.assignedRegionIds.includes(region.id))
        const fastestRoute =
          demoRoutes.find((route) => route.courierId === courier.id && route.type === 'fastest') ??
          demoRoutes.find((route) => route.courierId === courier.id)!
        return calculateRiskScore(courier, regions, weather, fastestRoute)
      }),
    [weather],
  )

  const selectedCourier =
    demoCouriers.find((courier) => courier.id === selectedCourierId) ??
    demoCouriers.find((courier) => courier.id === selectedScenario.defaultCourierId) ??
    demoCouriers[0]
  const selectedRisk = risks.find((risk) => risk.courierId === selectedCourier.id) ?? risks[0]
  const selectedDeliveries = demoDeliveries.filter((delivery) => delivery.courierId === selectedCourier.id)
  const selectedRoutes = scoreRoutes(
    demoRoutes.filter((route) => route.courierId === selectedCourier.id),
    weather,
  )
  const recommendedRoute = recommendRoute(selectedRoutes)
  const recommendations = generateRecommendations(selectedCourier, selectedDeliveries, selectedRisk, selectedRoutes, weather)
  const summary = buildDashboardSummary(demoCouriers, risks, recommendations)

  function handleScenarioSelect(id: string) {
    const scenario = demoScenarios.find((item) => item.id === id)
    setSelectedScenarioId(id)
    setRecommendationApplied(false)
    if (scenario) setSelectedCourierId(scenario.defaultCourierId)
  }

  function handleCourierSelect(id: string) {
    setSelectedCourierId(id)
    setRecommendationApplied(false)
  }

  return (
    <main className="min-h-screen bg-[#f5f7f4]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div>
            <div className="flex items-center gap-2 text-safe">
              <ShieldCheck size={24} />
              <span className="text-sm font-bold uppercase tracking-wide">SafeRoute AI</span>
            </div>
            <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">택배 기사 사고 위험 예측 및 배송 의사결정 지원 AI</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{CORE_MESSAGE}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            배송 상황 → 위험도 예측 → 원인 설명 → 안전 경로 → 스케줄 조정 → 개선 효과
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <DemoScenarioSelector scenarios={demoScenarios} selectedScenarioId={selectedScenarioId} onSelect={handleScenarioSelect} />
          <CourierRiskOverview
            couriers={demoCouriers}
            risks={risks}
            selectedCourierId={selectedCourier.id}
            onSelect={handleCourierSelect}
          />
        </aside>

        <section className="space-y-4">
          <DemoFlowPanel isApplied={recommendationApplied} risk={selectedRisk} recommendation={recommendations[0]} />
          <SelectedCourierDetail courier={selectedCourier} risk={selectedRisk} weather={weather} />
          <SafetyAlert risk={selectedRisk} recommendation={recommendations[0]} />

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <RiskFactorList factors={selectedRisk.factors} />
            <RouteComparison routes={selectedRoutes} recommendedRoute={recommendedRoute} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <ScheduleRecommendation
              recommendations={recommendations}
              isApplied={recommendationApplied}
              onApply={() => setRecommendationApplied(true)}
            />
            <SimulatedRiskMap regions={demoRegions} risks={risks} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <ManagerDashboard summary={summary} isApplied={recommendationApplied} />
            <DailySafetyReport
              courier={selectedCourier}
              risk={selectedRisk}
              recommendation={recommendations[0]}
              weather={weather}
              isApplied={recommendationApplied}
            />
          </div>

          <DataEvidencePanel
            courierCount={demoCouriers.length}
            deliveryCount={demoDeliveries.length}
            regionCount={demoRegions.length}
            routeCount={demoRoutes.length}
            weatherCount={demoWeather.length}
          />
        </section>
      </div>
    </main>
  )
}

export default App

import { useMemo, useState } from 'react'
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
import { BeforeAfterImpact } from '../components/BeforeAfterImpact'
import { CourierRiskOverview } from '../components/CourierRiskOverview'
import { DemoScenarioSelector } from '../components/DemoScenarioSelector'
import { DemoFlowPanel } from '../components/DemoFlowPanel'
import { DataEvidencePanel } from '../components/DataEvidencePanel'
import { DailySafetyReport } from '../components/DailySafetyReport'
import { FleetKpiStrip } from '../components/FleetKpiStrip'
import { ManagerDashboard } from '../components/ManagerDashboard'
import { PriorityActionPanel } from '../components/PriorityActionPanel'
import { RiskFactorList } from '../components/RiskFactorList'
import { RiskScoreDial } from '../components/RiskScoreDial'
import { RouteComparison } from '../components/RouteComparison'
import { SafetyCommandHeader } from '../components/SafetyCommandHeader'
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
    <main className="min-h-screen bg-appbg">
      <SafetyCommandHeader scenario={selectedScenario} weather={weather} />
      <FleetKpiStrip summary={summary} />

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 xl:grid-cols-[320px_minmax(0,1fr)_380px]">
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
          <DemoFlowPanel
            courier={selectedCourier}
            isApplied={recommendationApplied}
            risk={selectedRisk}
            recommendation={recommendations[0]}
          />
          <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
            <RiskScoreDial score={selectedRisk.riskScore} level={selectedRisk.riskLevel} />
            <SelectedCourierDetail courier={selectedCourier} risk={selectedRisk} weather={weather} />
          </div>
          <SafetyAlert risk={selectedRisk} recommendation={recommendations[0]} />

          <RiskFactorList factors={selectedRisk.factors} />
          <RouteComparison routes={selectedRoutes} recommendedRoute={recommendedRoute} />
        </section>

        <aside className="space-y-4">
          <PriorityActionPanel
            courier={selectedCourier}
            risk={selectedRisk}
            recommendation={recommendations[0]}
            recommendedRoute={recommendedRoute}
            isApplied={recommendationApplied}
            onApply={() => setRecommendationApplied(true)}
          />
          <BeforeAfterImpact recommendation={recommendations[0]} summary={summary} isApplied={recommendationApplied} />
          <ScheduleRecommendation
            recommendations={recommendations}
            isApplied={recommendationApplied}
            onApply={() => setRecommendationApplied(true)}
          />
          <SimulatedRiskMap regions={demoRegions} risks={risks} />
        </aside>
      </div>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 lg:grid-cols-[1fr_1fr]">
        <ManagerDashboard summary={summary} isApplied={recommendationApplied} />
        <DailySafetyReport
          courier={selectedCourier}
          risk={selectedRisk}
          recommendation={recommendations[0]}
          weather={weather}
          isApplied={recommendationApplied}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8">
        <DataEvidencePanel
          courierCount={demoCouriers.length}
          deliveryCount={demoDeliveries.length}
          regionCount={demoRegions.length}
          routeCount={demoRoutes.length}
          weatherCount={demoWeather.length}
        />
      </section>
    </main>
  )
}

export default App

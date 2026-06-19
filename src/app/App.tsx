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
import { ActionButton } from '../components/ActionButton'
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
import { DashboardTabNavigation, type DashboardTab } from '../components/DashboardTabNavigation'
import { SafetyAlert } from '../components/SafetyAlert'
import { ScheduleRecommendation } from '../components/ScheduleRecommendation'
import { SelectedCourierDetail } from '../components/SelectedCourierDetail'
import { SimulatedRiskMap } from '../components/SimulatedRiskMap'
import { ArrowRight } from 'lucide-react'

function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(demoScenarios[0].id)
  const selectedScenario = demoScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? demoScenarios[0]
  const [selectedCourierId, setSelectedCourierId] = useState(selectedScenario.defaultCourierId)
  const [recommendationApplied, setRecommendationApplied] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>('control')

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
      <SafetyCommandHeader scenario={selectedScenario} weather={weather} summary={summary} />
      <FleetKpiStrip summary={summary} />

      <div className="mx-auto max-w-7xl px-4 pb-8">
        <DashboardTabNavigation activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'control' && (
          <section className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_380px]">
              <aside className="space-y-4">
                <DemoScenarioSelector scenarios={demoScenarios} selectedScenarioId={selectedScenarioId} onSelect={handleScenarioSelect} />
                <CourierRiskOverview
                  couriers={demoCouriers}
                  risks={risks}
                  selectedCourierId={selectedCourier.id}
                  onSelect={handleCourierSelect}
                />
              </aside>

              <div className="space-y-4">
                <DemoFlowPanel
                  courier={selectedCourier}
                  isApplied={recommendationApplied}
                  risk={selectedRisk}
                  recommendation={recommendations[0]}
                />
                <SafetyAlert risk={selectedRisk} recommendation={recommendations[0]} />
              </div>

              <aside className="space-y-4">
                <SimulatedRiskMap regions={demoRegions} risks={risks} />
              </aside>
            </div>
            <NextStepButton label="위험 분석 보기" onClick={() => setActiveTab('analysis')} />
          </section>
        )}

        {activeTab === 'analysis' && (
          <section className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <RiskScoreDial score={selectedRisk.riskScore} level={selectedRisk.riskLevel} />
              <SelectedCourierDetail courier={selectedCourier} risk={selectedRisk} weather={weather} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <RiskFactorList factors={selectedRisk.factors} />
              <RouteComparison routes={selectedRoutes} recommendedRoute={recommendedRoute} />
            </div>
            <NextStepButton label="권장 조치 확인" onClick={() => setActiveTab('recommendation')} />
          </section>
        )}

        {activeTab === 'recommendation' && (
          <section className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_380px]">
              <PriorityActionPanel
                courier={selectedCourier}
                risk={selectedRisk}
                recommendation={recommendations[0]}
                recommendedRoute={recommendedRoute}
                isApplied={recommendationApplied}
                onApply={() => setRecommendationApplied(true)}
              />
              <ScheduleRecommendation
                recommendations={recommendations}
                isApplied={recommendationApplied}
                onApply={() => setRecommendationApplied(true)}
              />
              <BeforeAfterImpact recommendation={recommendations[0]} summary={summary} isApplied={recommendationApplied} />
            </div>
            <NextStepButton label="관리자 대시보드 보기" onClick={() => setActiveTab('manager')} />
          </section>
        )}

        {activeTab === 'manager' && (
          <section className="space-y-4">
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
        )}
      </div>
    </main>
  )
}

function NextStepButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <ActionButton onClick={onClick} icon={<ArrowRight size={18} />}>
        {label}
      </ActionButton>
    </div>
  )
}

export default App

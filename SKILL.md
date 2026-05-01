---
name: saferoute-ai-mvp
version: 0.1.0
description: Use this skill when building SafeRoute AI, an AI Rookie MVP for predicting parcel courier accident risk and recommending safety-centered delivery decisions. Trigger for tasks about SafeRoute AI requirements, architecture, data simulation, accident-risk prediction, explainable AI, safe route recommendation, delivery schedule adjustment, courier dashboard, manager dashboard, API design, tests, and demo flow. Do not use for unrelated logistics apps, pure fastest-route optimization, or worker surveillance features.
---

# SafeRoute AI Skill

## 1. Mission

Build **SafeRoute AI**, an AI Rookie competition MVP for parcel-delivery safety.

The product is not a simple monitoring dashboard and not a fastest-route optimizer. It must behave as a **safety-centered AI decision-support system** that:

1. predicts courier accident risk,
2. explains why the risk is high,
3. recommends safer delivery actions,
4. supports managers in adjusting routes, workload, and schedules,
5. demonstrates a clear before/after reduction in risk during a 3-minute demo.

Core message:

> 우리는 배송을 더 빠르게 만드는 것이 아니라, 더 안전하게 만드는 AI를 만듭니다.

## 2. Product Principle

Always prioritize **safe delivery over fast delivery**.

When speed and safety conflict, the product should show both options but recommend the safer one unless the safety difference is negligible.

Do not frame the system as a tool for punishing or ranking workers. Frame it as a tool for preventing accidents, balancing workload, and giving couriers and managers a concrete safety decision basis.

## 3. Primary Users

### 3.1 Courier / 택배 기사

Needs:

- current accident-risk score,
- why the risk is high,
- what action to take next,
- safe route recommendation,
- rest recommendation,
- delivery delay recommendation when needed.

Courier UI must be simple and readable within 5 seconds.

### 3.2 Logistics Manager / 물류 관리자

Needs:

- courier risk overview,
- high-risk courier list,
- risky zone heatmap,
- workload redistribution recommendation,
- delay recommendation,
- before/after risk comparison.

Manager UI must focus on decisions, not raw data.

### 3.3 Logistics Company / 물류 기업

Needs:

- safety KPI,
- accident-prevention evidence,
- ESG/safety reporting,
- safer operation policy simulation.

## 4. MVP Scope

### Include

- One demo area, preferably a Korean urban district such as Seoul Gwanak-gu, Gangnam-gu, Mapo-gu, or Seongnam Bundang-gu.
- Simulated couriers: 8 to 12.
- Simulated deliveries: 200 to 400.
- Weather scenario: normal, rain, snow, heat wave.
- Accident-risk prediction model or hybrid scoring engine.
- Explainable risk reason cards.
- Safe route recommendation.
- Delivery schedule adjustment recommendation.
- Workload redistribution recommendation.
- Real-time risk alert simulation.
- Courier screen and manager dashboard.
- Demo scenario showing risk before and after AI recommendation.

### Exclude for MVP

- Real courier GPS tracking.
- Real customer personal data.
- Actual parcel company system integration.
- Forced automatic dispatch.
- Legal claim that accidents will definitely be prevented.
- Worker performance evaluation or punitive ranking.

If a feature requires real external APIs, build a mock adapter first and keep the interface replaceable.

## 5. Recommended Technical Direction

Prefer a pragmatic demo-friendly stack.

### Frontend

- React, Next.js, or Vite + React.
- TypeScript preferred.
- Dashboard-style UI.
- Korean UI labels.
- Use cards, tables, simple charts, and map-like simulation.
- If real map API is not ready, implement a simulated map using SVG, Canvas, or a static coordinate plane.

### Backend

- FastAPI or Node/Express.
- Keep APIs small and demo-oriented.
- Use deterministic mock data when external data is unavailable.
- Store secrets only in `.env`, never hard-code API keys.

### AI / Data

- Python preferred for model logic.
- Use scikit-learn first.
- LightGBM/XGBoost may be used if dependency setup is reliable.
- If model training is too heavy, implement a hybrid engine:
  - rules for base risk,
  - ML model for calibrated risk,
  - feature-importance style explanations.

### Storage

- MVP can use JSON files, SQLite, or PostgreSQL.
- Use PostgreSQL/PostGIS only if map/spatial queries are central and setup time allows.

## 6. Core Data Entities

Use these concepts even if the code structure changes.

### Courier

```ts
interface Courier {
  id: string;
  name: string;
  vehicleType: 'truck' | 'van' | 'motorcycle' | 'ev';
  shiftStart: string;
  workingHours: number;
  totalDistanceKm: number;
  completedDeliveries: number;
  remainingDeliveries: number;
  currentDelayMinutes: number;
  fatigueScore: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
```

### Delivery

```ts
interface Delivery {
  id: string;
  courierId: string;
  addressLabel: string;
  buildingType: 'apartment' | 'villa' | 'office' | 'store' | 'house';
  priority: 'normal' | 'time_window' | 'urgent';
  estimatedServiceMinutes: number;
  parkingDifficulty: number;
  stairsFlag: boolean;
  elevatorFlag: boolean;
  hillFlag: boolean;
  narrowRoadFlag: boolean;
  latitude: number;
  longitude: number;
  plannedOrder: number;
}
```

### Weather

```ts
interface WeatherScenario {
  scenario: 'normal' | 'rain' | 'snow' | 'heat_wave';
  rainLevel: number;
  snowFlag: boolean;
  temperatureC: number;
  windLevel: number;
  visibilityLevel: number;
}
```

### RegionRisk

```ts
interface RegionRisk {
  zoneId: string;
  zoneName: string;
  hillRatio: number;
  villaDensity: number;
  narrowRoadRatio: number;
  accidentHotspotScore: number;
  schoolZoneCount: number;
  parkingDifficultyAvg: number;
  nightRiskScore: number;
}
```

### Recommendation

```ts
interface Recommendation {
  id: string;
  courierId: string;
  type: 'safe_route' | 'schedule_adjustment' | 'redistribution' | 'delay' | 'rest';
  title: string;
  reason: string;
  expectedRiskBefore: number;
  expectedRiskAfter: number;
  impactSummary: string;
  actions: string[];
}
```

## 7. Feature Engineering

Use these feature names where possible.

```text
delivery_count_today
remaining_delivery_count
completed_delivery_count
total_distance_km
working_hours
current_delay_minutes
avg_service_minutes
rain_level
snow_flag
heat_wave_flag
visibility_level
hill_ratio
villa_density
narrow_road_ratio
school_zone_count
parking_difficulty_score
night_delivery_flag
fatigue_score
time_pressure_score
risk_zone_count
urgent_delivery_ratio
```

### Derived Scores

```text
load_score              = normalized remaining_delivery_count + delivery_count_today
time_pressure_score     = remaining_delivery_count / max(remaining_work_minutes, 1)
fatigue_score           = working_hours + total_distance_km + completed_delivery_count - rest_bonus
weather_risk_score      = rain/snow/heat/visibility weighted score
region_difficulty_score = hill + villa + narrow road + parking + school zone
```

Normalize final scores to 0-100.

## 8. Accident Risk Prediction

### Preferred MVP Formula

Use a hybrid model. Start with deterministic scoring, then optionally add ML calibration.

```text
risk_score =
  0.22 * load_score
+ 0.18 * fatigue_score
+ 0.16 * time_pressure_score
+ 0.16 * weather_risk_score
+ 0.14 * region_difficulty_score
+ 0.08 * route_risk_score
+ 0.06 * delay_score
```

Risk levels:

```text
0-39   low
40-64  medium
65-79  high
80-100 critical
```

### ML Model Guidance

If training a model:

- Use LogisticRegression, RandomForest, XGBoost, or LightGBM.
- Target can be `accident_risk_label` or `high_risk_flag` from simulated labels.
- Keep model inference fast.
- Save model artifacts under `models/`.
- Always expose feature contributions or reason cards.

### Simulated Label Rule

When real accident data is unavailable, generate synthetic labels using rule combinations:

```text
high_risk_flag = true if at least 3 of these are true:
- working_hours >= 9
- remaining_delivery_count >= 40
- rain_level >= 0.6 or snow_flag == true
- hill_ratio >= 0.5
- narrow_road_ratio >= 0.5
- current_delay_minutes >= 30
- night_delivery_flag == true
- fatigue_score >= 70
```

Do not claim synthetic labels are real accident data.

## 9. Explainable AI Rules

Every high or critical risk result must include reason cards.

Reason card format:

```ts
interface ReasonCard {
  factor: string;
  severity: 'info' | 'warning' | 'danger';
  message: string;
  evidence: string;
}
```

Examples:

- `남은 배송 46건으로 평균 대비 높습니다.`
- `누적 근무 시간이 9시간에 근접했습니다.`
- `다음 구역은 언덕·빌라 밀집도가 높습니다.`
- `16시 이후 강수 조건으로 미끄럼 위험이 증가합니다.`
- `현재 지연 28분으로 시간 압박이 높습니다.`

Explanations must be written in Korean and understandable to non-technical users.

## 10. Safe Route Recommendation

The product must not simply choose the shortest route.

Compare at least two candidate routes:

1. fastest route,
2. safest route,
3. balanced route if possible.

Route risk score:

```text
route_risk_score =
  0.25 * accident_hotspot_score
+ 0.20 * hill_score
+ 0.20 * narrow_road_score
+ 0.15 * weather_impact_score
+ 0.10 * parking_difficulty_score
+ 0.10 * night_risk_score
```

Safe route score:

```text
safe_route_score =
  0.50 * safety_score
+ 0.30 * efficiency_score
+ 0.20 * fatigue_reduction_score
```

UI must show:

- estimated time,
- risk score,
- why safest route is recommended,
- tradeoff against fastest route.

Example message:

```text
최단 경로보다 7분 더 소요되지만, 급경사 2구간과 협소도로 4구간을 회피하여 위험도가 78점에서 43점으로 낮아집니다.
```

## 11. Schedule Adjustment Recommendation

Schedule recommendation is the key differentiator.

Generate concrete actions such as:

- deliver high-risk hill/villa zones before rain or night,
- move low-priority deliveries later,
- recommend delay for low-priority high-risk deliveries,
- redistribute deliveries to a lower-risk nearby courier,
- recommend rest after a defined number of deliveries.

A recommendation is valid only if it includes:

1. current risk,
2. expected risk after action,
3. action list,
4. reason,
5. affected deliveries or zones.

Example:

```text
현재 스케줄 유지 시 기사 A의 위험도는 86점입니다.
AI 조정안을 적용하면 예상 위험도는 59점으로 낮아집니다.
권장 조치: 언덕형 빌라 구역 12건을 16시 이전 처리하고, 일반 배송 7건을 기사 B에게 분산합니다.
```

## 12. Real-Time Alert Simulation

Real-time alert must follow this structure:

```text
위험 감지 → 원인 설명 → 권장 행동
```

Bad:

```text
위험합니다.
```

Good:

```text
위험도 81점: 강수 시작, 누적 근무 9시간, 남은 배송 38건으로 위험이 상승했습니다. 다음 3건 배송 후 10분 휴식하고 급경사 우회 경로를 선택하세요.
```

## 13. Dashboard Requirements

### Courier Screen

Must show:

- current risk score,
- risk level,
- top 3 reasons,
- next recommended action,
- safe route option,
- rest/delay recommendation.

Keep text short and actionable.

### Manager Dashboard

Must show:

- average fleet risk,
- high-risk couriers,
- courier table,
- risk heatmap or simulated map,
- AI redistribution recommendation,
- before/after risk comparison,
- daily safety report.

### Demo Screen

Must show a clear flow:

1. load scenario,
2. identify high-risk courier,
3. explain causes,
4. recommend route/schedule action,
5. apply recommendation,
6. show risk reduction.

## 14. API Design Guidance

Use simple endpoint names.

```text
GET  /api/scenario/default
POST /api/scenario/generate
GET  /api/couriers
GET  /api/couriers/{courierId}/risk
GET  /api/couriers/{courierId}/recommendations
POST /api/recommendations/{recommendationId}/apply
GET  /api/dashboard/summary
GET  /api/report/daily
```

Response bodies must include enough data for the frontend without additional complex joins.

## 15. Suggested Repository Structure

Adapt as needed, but keep responsibilities separated.

```text
saferoute-ai/
  README.md
  SKILL.md
  apps/
    web/
    api/
  data/
    simulation/
      couriers.json
      deliveries.json
      weather_scenarios.json
      region_risk.json
  models/
    risk_model.pkl
    feature_config.json
  docs/
    demo_scenario.md
    api_contract.md
  tests/
```

For a small MVP, a single app is acceptable, but still separate:

```text
src/data
src/model
src/recommendation
src/components
src/pages or src/routes
src/tests
```

## 16. Coding Rules for Codex

When implementing tasks:

1. Inspect the existing repository first.
2. Keep changes minimal and coherent.
3. Prefer working MVP over over-engineered architecture.
4. Use deterministic seeds for simulation data.
5. Write Korean UI labels.
6. Avoid hidden external dependencies unless asked.
7. If an API key is needed, create a mock adapter and document where the key would go.
8. Never hard-code secrets.
9. Do not introduce real personal data.
10. Do not build punitive worker ranking features.
11. Add or update tests for risk scoring, recommendations, and dashboard data.
12. After implementation, summarize changed files and how to run/test.

## 17. Test Requirements

At minimum, implement tests for:

### Risk Scoring

- High workload + rain + long working hours produces high or critical risk.
- Low workload + normal weather produces low or medium risk.
- Missing weather data falls back safely, not to zero risk.

### Explainability

- High-risk prediction includes at least 3 reason cards.
- Reason cards are in Korean.

### Route Recommendation

- Fastest route is not selected when its risk is much higher than safe route.
- Safe route message explains the time/safety tradeoff.

### Schedule Recommendation

- High-risk courier receives at least one actionable recommendation.
- Redistribution lowers expected risk.
- Delay recommendation is only applied to normal or low-priority deliveries, not urgent deliveries.

### Dashboard

- Manager summary includes high-risk courier count.
- Before/after risk values are visible.

## 18. Demo Success Criteria

The MVP is successful when a judge can understand this within 3 minutes:

1. A courier is overloaded and exposed to risky conditions.
2. AI predicts a high accident risk.
3. AI explains why the risk is high.
4. AI recommends a safer route and schedule adjustment.
5. Applying the recommendation lowers the risk score.
6. The project’s value is safety-centered delivery, not faster delivery.

Target demo metrics:

```text
Risk prediction response time: <= 3 seconds
Dashboard initial load: <= 5 seconds
Demo flow completion: <= 3 minutes
High-risk reasons shown: >= 3
Before/after risk reduction shown: required
```

## 19. Safety and Ethics Guardrails

- The system is a decision-support tool, not an automatic command system.
- Final decisions remain with humans.
- Avoid language that blames couriers.
- Do not expose exact home addresses or customer personal information.
- Do not track real-time GPS in MVP.
- Do not store sensitive personal data.
- Logs should support safety review, not punishment.
- Clearly mark synthetic data as synthetic in documentation.

## 20. Preferred Korean Product Copy

Use these labels in the UI:

```text
오늘의 사고 위험도
위험 원인 분석
AI 권장 행동
안전 경로 추천
배송 스케줄 조정
물량 분산 추천
지연 권장 배송
휴식 권장
위험도 변화
AI 적용 전
AI 적용 후
안전 리포트
```

Use this final slogan:

```text
우리는 배송을 더 빠르게 만드는 것이 아니라, 더 안전하게 만드는 AI를 만듭니다.
```

## 21. First Implementation Order

When starting from an empty repository, build in this order:

1. Create mock data generator.
2. Create risk scoring engine.
3. Create explanation generator.
4. Create recommendation engine.
5. Create backend endpoints or local data service.
6. Create manager dashboard.
7. Create courier screen.
8. Add before/after recommendation interaction.
9. Add tests.
10. Add demo scenario README.

Do not start with authentication, payment, production deployment, or complex map integration. Those are not necessary for the AI Rookie MVP.

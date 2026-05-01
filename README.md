# SafeRoute AI

SafeRoute AI는 택배 기사 사고 위험을 예측하고, 위험 원인을 설명하며, 안전 경로와 배송 스케줄 재조정을 추천하는 AI 의사결정 지원 MVP입니다.

핵심 메시지:

> 우리는 배송을 더 빠르게 만드는 것이 아니라, 더 안전하게 만드는 AI를 만듭니다.

## Demo Flow

1. 데모 배송 상황을 선택합니다.
2. 기사별 사고 위험도를 확인합니다.
3. 고위험 기사를 선택합니다.
4. AI가 사고 위험도와 위험 원인 TOP 요소를 설명합니다.
5. 최단 경로와 안전 경로를 비교합니다.
6. 물량 분산, 휴식, 배송 순서 변경, 지연 안내를 추천합니다.
7. 관리자 대시보드에서 조정 전/후 위험도 개선 효과를 확인합니다.

발표용 상세 스크립트는 `docs/demo_scenario.md`에 정리되어 있습니다.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Recharts
- lucide-react
- Vitest
- Local simulated data
- Deterministic TypeScript AI engine

## Data Strategy

This MVP uses simulated delivery data and public-data-inspired risk factors.
It does not use real courier personal data.

데이터는 모두 시뮬레이션입니다. 실제 고객 주소, 전화번호, GPS, 주민등록번호, 택배사 운영 데이터는 저장하지 않습니다.

주소는 `관악구 빌라 밀집 구역 A`, `분당구 아파트 단지 B`, `강남구 상가 구역 C`처럼 상세 주소가 아닌 구역 라벨로만 표현합니다.

## AI Engine

초기 MVP는 설명 가능한 가중치 기반 위험도 모델을 사용합니다.

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

위험도 등급:

- 0~39점: 낮음
- 40~59점: 보통
- 60~79점: 높음
- 80~100점: 매우 높음

AI는 점수만 보여주지 않고 남은 배송, 근무 시간, 날씨, 언덕, 빌라 밀집도, 좁은 골목, 주정차 난이도, 휴식 부족 같은 원인을 한국어로 설명합니다.

## Run

```powershell
npm install
npm run dev
```

## Build and Test

```powershell
npm test
npm run build
```

## Visual Check

개발 서버가 실행 중일 때 다음 명령으로 데스크톱/모바일 화면의 한글 깨짐, 콘솔 오류, 기본 렌더링 상태를 확인할 수 있습니다.

```powershell
npm run visual:check
```

검수 스크립트는 `screenshot-desktop.png`, `screenshot-mobile.png`를 생성합니다.

## Limitations

- 실제 사고 예측 모델이 아니라 시뮬레이션 기반 MVP 엔진입니다.
- 실제 지도 API, GPS, 로그인, 운영 DB, 택배사 연동은 포함하지 않습니다.
- 추천은 자동 강제 배차가 아니라 관리자와 기사 확인을 위한 의사결정 보조입니다.

## Future Extension

- 실제 공개 위험 요인 데이터와 지역 통계 연계
- Python 기반 ML 모델 또는 calibrated risk model 추가
- 안전 조치 적용 이력 리포트
- 실제 지도 API는 개인정보와 보안 검토 후 mock adapter를 대체하는 방식으로 확장

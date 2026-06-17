# SafeRoute AI

SafeRoute AI는 라스트마일 배송 기사와 관리자를 위한 안전 운영 의사결정 보조 MVP입니다.

목표는 기사를 감시하거나 평가하는 것이 아니라, 사고 위험이 커지기 전에 위험 요인을 설명하고 실행 가능한 안전 조치를 제안하는 것입니다.

- GitHub: https://github.com/khi6174/saferoute-ai
- Live Demo: https://saferoute-ai-seven.vercel.app

핵심 메시지:

> 우리는 배송을 더 빠르게 만드는 것이 아니라, 더 안전하게 만드는 AI를 만듭니다.

## Demo Flow

1. 데모 배송 시나리오를 선택합니다.
2. 지원 필요 기사를 확인합니다.
3. 현재 사고 위험도와 위험 원인 TOP 5를 확인합니다.
4. 최단 경로와 안전 경로를 비교합니다.
5. AI 권장 조치에서 물량 분산, 휴식, 지연 안내, 배송 순서 조정을 확인합니다.
6. 권장안을 시뮬레이션 적용합니다.
7. 관리자 영향 요약에서 적용 전/후 위험도, 분산 배송 수, 지연 안내 수, 휴식 권장 여부를 확인합니다.

발표용 상세 스크립트는 `docs/demo_scenario.md`에 정리되어 있습니다.

## Core Features

- 규칙 기반 Risk Engine
- 규칙 기반 Recommendation Engine
- 기사별 위험도 대시보드
- 위험 원인 설명
- 최단 경로와 안전 경로 비교
- 추천 적용 전/후 시뮬레이션
- 관리자 영향 요약
- 시뮬레이션 위험 지도
- 안전 책임 원칙 표시

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

모든 데이터는 시뮬레이션 데이터입니다. 실제 고객 주소, 전화번호, GPS, 주민등록번호, 민감 개인정보, 실제 택배사 운영 데이터는 저장하지 않습니다.

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

LLM은 위험 점수를 계산하지 않습니다. 위험 점수와 추천 결과는 Risk Engine과 Recommendation Engine이 계산하며, LLM은 향후 설명, 요약, 리포트 작성에만 사용할 수 있습니다.

## Responsibility

SafeRoute AI는 사고 위험과 배송 조정안을 제안하는 의사결정 보조 시스템입니다.

- AI는 의사결정을 보조합니다.
- 최종 운영 판단은 현장 관리자와 기사에게 있습니다.
- 추천 적용 결과는 시뮬레이션입니다.
- 실제 운영 전 현장 확인이 필요합니다.

## Run

```powershell
npm install
npm run dev
```

## Build and Test

```powershell
npm run build
npm test
```

## Visual Check

개발 서버가 실행 중일 때 다음 명령으로 데스크톱/모바일 화면의 기본 렌더링 상태를 확인할 수 있습니다.

```powershell
npm run visual:check
```

검사 스크립트는 `screenshot-desktop.png`, `screenshot-mobile.png`를 생성합니다.

## Limitations

- 실제 사고 예측 모델이 아니라 시뮬레이션 데이터 기반 MVP 엔진입니다.
- 실제 지도 API, GPS, 로그인, 운영 DB, 택배사 연동은 포함하지 않습니다.
- 추천은 자동 강제 배차가 아니라 관리자와 기사 확인을 위한 판단 보조입니다.

## Future Extension

- 배송표/근무표 문서 파싱
- 사고 보고서와 안전 리포트 구조화
- LLM 기반 관리자 리포트와 기사 안내문 생성
- Safety Copilot 질의응답
- 실제 지도 API와 개인정보 보호 검토를 거친 mock adapter 교체

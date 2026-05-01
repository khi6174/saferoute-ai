import type { DemoScenario } from '../engine/types'

type Props = {
  scenarios: DemoScenario[]
  selectedScenarioId: string
  onSelect: (id: string) => void
}

export function DemoScenarioSelector({ scenarios, selectedScenarioId, onSelect }: Props) {
  const selected = scenarios.find((scenario) => scenario.id === selectedScenarioId)

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <label className="text-sm font-semibold text-stone-600" htmlFor="scenario">
        데모 시나리오 선택
      </label>
      <select
        id="scenario"
        className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-ink"
        value={selectedScenarioId}
        onChange={(event) => onSelect(event.target.value)}
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.label}
          </option>
        ))}
      </select>
      <p className="mt-3 text-sm leading-6 text-stone-600">{selected?.description}</p>
    </section>
  )
}

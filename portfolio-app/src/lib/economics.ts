/**
 * A faithful, reduced re-implementation of the AI Economics Simulator's cost and benefit model
 * (research/case-evidence.md section 3.3), calibrated to its default scenario. Pure functions so
 * the unit tests can check it against the simulator's own default figures.
 */
import type { Economics } from '@data/schema'

export type Hosting = Economics['hosting'][number]['id']

export interface EconInput {
  functions: number
  hosting: Hosting
  level: number
}

export type LineId = 'platform' | 'dashboards' | 'governance' | 'licences' | 'usage'

export interface EconResult {
  share: number
  lines: { id: LineId; label: string; value: number; pct: number }[]
  /** Year one of the plan with the build amortised, as the simulator headlines it. */
  allIn: number
  /** The same division running the platform alone. */
  standalone: number
  benefit: number
  costPerUserMonth: number
  years: { year: number; cost: number; benefit: number; cumulative: number }[]
  breakEven: number | null
  horizon: { cost: number; benefit: number; net: number; roi: number }
}

export const LINE_LABEL: Record<LineId, string> = {
  platform: 'Shared platform (your share)',
  dashboards: 'Dashboards',
  governance: 'Governance staff',
  licences: 'Licences',
  usage: 'Tokens and usage',
}

export function computeEconomics(m: Economics, x: EconInput): EconResult {
  const share = Math.max(m.minShare, 1 / x.functions)
  const lvl = m.levels.find((l) => l.level === x.level) ?? m.levels[2]
  const host = m.hosting.find((h) => h.id === x.hosting) ?? m.hosting[1]
  const sharedRun = m.sharedRunBase + host.infra
  const g = m.governance

  const platform = share * (lvl.buildPerYear + sharedRun)
  const dashboards = m.dashboards.build / m.goLiveYear + m.dashboards.build * m.dashboards.firstYearRate
  const governance = (g.base + m.users / g.usersPerFte + g.useCases * g.perUseCase + (x.level - 1) * g.perLevel) * g.costPerFte
  const licences = m.users * m.seatCost
  const usage = m.usageBase * lvl.usage * host.usage
  const allIn = platform + dashboards + governance + licences + usage
  const standalone = allIn - platform + lvl.buildPerYear + sharedRun
  const raw: [LineId, number][] = [
    ['platform', platform],
    ['dashboards', dashboards],
    ['governance', governance],
    ['licences', licences],
    ['usage', usage],
  ]
  const lines = raw.map(([id, value]) => ({ id, label: LINE_LABEL[id], value, pct: value / allIn }))
  const benefit = m.benefit.labour + m.benefit.risk

  // Ten-year view: bell-shaped build spend up to go-live, then the adoption ramp and growth.
  const oneOff = (share * lvl.buildPerYear + m.dashboards.build / m.goLiveYear) * m.goLiveYear
  const wSum = m.buildWeights.reduce((a, b) => a + b, 0)
  const { headcount, usage: usageGrowth, price } = m.growth
  const years: EconResult['years'] = []
  let cumulative = 0
  let totalCost = 0
  let totalBenefit = 0
  for (let t = 1; t <= m.horizon; t++) {
    let cost = t <= m.buildWeights.length ? (oneOff * m.buildWeights[t - 1]) / wSum : 0
    let ben = 0
    if (t >= m.goLiveYear) {
      const k = t - m.goLiveYear
      const ramp = m.ramp[Math.min(k, m.ramp.length - 1)]
      cost +=
        share * sharedRun +
        governance +
        m.dashboards.build * m.dashboards.upkeepRate +
        licences * ramp * (1 + headcount) ** k +
        usage * ramp * ((1 + headcount) * (1 + usageGrowth) * (1 + price)) ** k
      ben = benefit * ramp * (1 + headcount) ** k
    }
    cumulative += ben - cost
    totalCost += cost
    totalBenefit += ben
    years.push({ year: t, cost, benefit: ben, cumulative })
  }
  const breakEven = years.find((y) => y.cumulative >= 0)?.year ?? null
  const net = totalBenefit - totalCost
  return {
    share,
    lines,
    allIn,
    standalone,
    benefit,
    costPerUserMonth: allIn / 12 / m.users,
    years,
    breakEven,
    horizon: { cost: totalCost, benefit: totalBenefit, net, roi: net / totalCost },
  }
}

export function money(v: number): string {
  const a = Math.abs(v)
  const sign = v < 0 ? 'minus ' : ''
  if (a >= 1e6) return `${sign}EUR ${(a / 1e6).toFixed(2)}m`
  if (a >= 1e4) return `${sign}EUR ${Math.round(a / 1e3)}k`
  return `${sign}EUR ${Math.round(a).toLocaleString('en-GB')}`
}

export const pct = (v: number) => (v < 0.01 ? `${(v * 100).toFixed(1)}%` : `${Math.round(v * 100)}%`)

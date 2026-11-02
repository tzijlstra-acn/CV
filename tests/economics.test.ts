import { describe, expect, it } from 'vitest'
import { loadPortfolio } from '../portfolio-data/build'
import { computeEconomics } from '../portfolio-app/src/lib/economics'

const M = loadPortfolio().result!.site.scenes.economics
const near = (a: number, b: number, tol = 0.01) => expect(Math.abs(a - b) / b, `${a} vs ${b}`).toBeLessThan(tol)

/**
 * Reference figures re-computed from the AI Economics Simulator formulas at its defaults
 * (research/case-evidence.md section 3.5). The widget must stay consistent with them.
 */
describe('economics widget stays faithful to the simulator', () => {
  const base = computeEconomics(M, M.defaults)

  it('reproduces the default year-one all-in cost and its split', () => {
    near(base.allIn, 832_693)
    const fixed = base.lines.filter((l) => ['platform', 'dashboards', 'governance'].includes(l.id)).reduce((n, l) => n + l.pct, 0)
    expect(fixed).toBeGreaterThan(0.95)
    expect(base.lines.find((l) => l.id === 'usage')!.pct).toBeLessThan(0.01)
  })

  it('reproduces the standalone comparison, benefit, break-even and ten-year return', () => {
    near(base.standalone, 1_312_500, 0.02)
    expect(base.benefit).toBe(3_319_000)
    expect(base.breakEven).toBe(4)
    near(base.horizon.roi, 4.37, 0.03)
    near(base.years[3].cumulative, 1_856_477, 0.01)
  })

  it('reproduces the totals by maturity level', () => {
    const expected = [628_622, 716_945, 832_693, 961_781, 1_117_526]
    expected.forEach((v, i) => near(computeEconomics(M, { ...M.defaults, level: i + 1 }).allIn, v))
  })

  it('reproduces the totals by hosting choice', () => {
    near(computeEconomics(M, { ...M.defaults, hosting: 'cloud' }).allIn, 741_239)
    near(computeEconomics(M, { ...M.defaults, hosting: 'on-prem' }).allIn, 1_296_708)
  })

  it('makes sharing the strongest lever and keeps tokens marginal', () => {
    const more = computeEconomics(M, { ...M.defaults, functions: 3 })
    expect(more.allIn).toBeLessThan(base.allIn)
    expect(base.lines.find((l) => l.id === 'usage')!.value).toBeLessThan(base.allIn * 0.01)
  })
})

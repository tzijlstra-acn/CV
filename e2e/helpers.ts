import { expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/** Opens a path under /CV/ and fails the test on any console error or page error. */
export async function open(page: Page, path = '') {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  await page.goto(path)
  await expect(page.locator('#main')).toBeVisible()
  return errors
}

export async function axe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  return results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s) ${v.nodes[0]?.target.join(' ')}`)
}

/** Scrolls through the guided story so every lazy scene mounts, then waits for the last placeholder to go. */
export async function mountScenes(page: Page) {
  for (const id of SCENES) {
    await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id)
    await page.waitForTimeout(120)
  }
  await page.waitForFunction(() => !document.querySelector('.scene--placeholder'))
}

export const CASES = ['nfr-work-fabric', 'ai-economics', 'dora-control-line', 'nfr-agent-platform', 'airlock', 'data-reporting-transformation']
export const SCENES = ['thesis', 'career', 'fabric', 'work-fabric', 'process-network', 'blueprint', 'controlled-ai', 'economics', 'execution', 'discipline', 'selected-evidence', 'role-fit']
export const LENSES = ['consulting', 'deployment', 'value-engineering', 'partnerships', 'builder', 'risk', 'solution-design']

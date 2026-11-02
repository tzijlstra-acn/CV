import { expect, test } from '@playwright/test'
import { CASES, axe, mountScenes, open } from './helpers'

const ROUTES = ['', '?lens=risk', 'evidence/', 'evidence/?view=graph', 'capabilities/', ...CASES.map((c) => `case/${c}/`)]

// Scan final states: transitions in flight can briefly sit between two colours.
test.use({ reducedMotion: 'reduce' })

test.describe('accessibility (brief section 25)', () => {
  for (const path of ROUTES) {
    test(`axe: /CV/${path}`, async ({ page }) => {
      await open(page, path)
      // Bring every lazy scene into the page before scanning.
      if (path === '' || path.startsWith('?')) {
        await mountScenes(page)
        await page.waitForTimeout(400)
      }
      if (path.startsWith('case/nfr-work-fabric')) await page.getByTestId('nfr-blueprint').scrollIntoViewIfNeeded()
      expect(await axe(page)).toEqual([])
    })
  }

  for (const key of ['c', '?', 'g', 'm', 'l']) {
    test(`axe: overlay opened with ${key}`, async ({ page }) => {
      await open(page)
      await page.keyboard.press(key)
      await page.waitForTimeout(300)
      expect(await axe(page)).toEqual([])
    })
  }

  test('reduced motion shows every final state at once', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    await open(page)
    await expect(page.getByTestId('thesis-replay')).toHaveText(/Replay/)
    await expect(page.locator('.thesis-result')).toHaveClass(/is-on/)
    await page.locator('#discipline').scrollIntoViewIfNeeded()
    await expect(page.locator('.gates__row.is-passed')).toHaveCount(10)
    await page.locator('#process-network').scrollIntoViewIfNeeded()
    await page.getByTestId('s05-trigger').click()
    await expect(page.locator('.net__steps li.is-on')).toHaveCount(5)
    await ctx.close()
  })

  test('forced colours keep controls visible', async ({ browser }) => {
    const ctx = await browser.newContext({ forcedColors: 'active', viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    await open(page)
    await expect(page.getByTestId('btn-lens')).toBeVisible()
    await expect(page.getByTestId('cta-evidence')).toBeVisible()
    await ctx.close()
  })

  test('every interactive element has an accessible name', async ({ page }) => {
    await open(page)
    const unnamed = await page.locator('button, a[href]').evaluateAll((els) =>
      els.filter((e) => !(e.getAttribute('aria-label') || e.textContent?.trim() || e.getAttribute('title'))).map((e) => e.outerHTML.slice(0, 80)),
    )
    expect(unnamed).toEqual([])
  })
})

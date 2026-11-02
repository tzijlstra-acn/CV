import { expect, test } from '@playwright/test'
import { open } from './helpers'

test.describe('evidence explorer and capability map (brief section 16)', () => {
  test('plain-language search is interpreted and shown', async ({ page }) => {
    await open(page, 'evidence/')
    await page.getByTestId('evidence-search').fill('Show what Thomas personally built')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/q=Show/)
    await expect(page.getByTestId('understood')).toContainText('built and verified')
    for (const row of await page.locator('article[data-depth]').all()) await expect(row).toHaveAttribute('data-depth', 'built-verified')
  })

  test('filters live in the URL and survive back and forward', async ({ page }) => {
    await open(page, 'evidence/')
    const total = await page.locator('article[data-depth]').count()
    await page.getByRole('button', { name: 'Professional delivery', exact: true }).click()
    await expect(page).toHaveURL(/depth=professional-delivery/)
    const filtered = await page.locator('article[data-depth]').count()
    expect(filtered).toBeLessThan(total)
    await page.goto('evidence/?type=public-build')
    await page.goBack()
    await expect(page).toHaveURL(/depth=professional-delivery/)
    expect(await page.locator('article[data-depth]').count()).toBe(filtered)
  })

  test('invalid filter values are dropped', async ({ page }) => {
    await open(page, 'evidence/?depth=wizard&type=hack')
    await expect(page.getByTestId('result-count')).toBeVisible()
    expect(await page.locator('article[data-depth]').count()).toBeGreaterThan(10)
  })

  test('a focus link highlights one item', async ({ page }) => {
    await open(page, 'evidence/?focus=sg-dcm-fig')
    await expect(page.getByTestId('evidence-sg-dcm-fig')).toHaveClass(/ev-row--emphasis/)
  })

  test('the graph view renders the evidence-derived fabric', async ({ page }) => {
    await open(page, 'evidence/?view=graph')
    await expect(page.getByTestId('fabric-graph')).toBeVisible()
  })

  test('quick views match the brief filters', async ({ page }) => {
    await open(page, 'evidence/')
    await page.getByRole('button', { name: 'Risk and controls' }).click()
    await expect(page).toHaveURL(/group=risk-control/)
  })

  test('the capability map shows every capability with evidence and a depth label', async ({ page }) => {
    const errors = await open(page, 'capabilities/')
    const rows = page.locator('tr[data-testid^="cap-"]')
    expect(await rows.count()).toBeGreaterThan(60)
    for (const row of (await rows.all()).slice(0, 10)) {
      await expect(row.locator('.depth')).toBeVisible()
      expect(await row.locator('.caps__ev li').count()).toBeGreaterThan(0)
    }
    expect(errors).toEqual([])
  })
})

import { expect, test } from '@playwright/test'
import { CASES, mountScenes, open } from './helpers'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

test.describe('mobile (brief section 18.1)', () => {
  for (const path of ['', 'evidence/', 'capabilities/', ...CASES.map((c) => `case/${c}/`)]) {
    test(`no horizontal overflow: /CV/${path}`, async ({ page }) => {
      await open(page, path)
      if (path === '') await mountScenes(page)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(1)
    })
  }

  test('the menu drawer opens without hover and navigates', async ({ page }) => {
    await open(page)
    await page.getByTestId('btn-menu').tap()
    await expect(page.getByTestId('overlay-menu')).toBeVisible()
    await page.getByRole('link', { name: 'Evidence explorer' }).tap()
    await expect(page).toHaveURL(/\/CV\/evidence/)
  })

  test('touch targets are at least 32 by 32 pixels', async ({ page }) => {
    await open(page)
    const small = await page.locator('main button, main a.btn, header button').evaluateAll((els) =>
      els
        .filter((e) => (e as HTMLElement).offsetParent !== null)
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width < 32 || r.height < 32).length,
    )
    expect(small).toBe(0)
  })
})

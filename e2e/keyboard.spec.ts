import { expect, test } from '@playwright/test'
import { open } from './helpers'

test.describe('keyboard model and overlays (brief section 18)', () => {
  test('C opens the command palette; a search runs in the explorer', async ({ page }) => {
    await open(page)
    await page.keyboard.press('c')
    const input = page.getByTestId('palette-input')
    await expect(input).toBeFocused()
    await input.fill('airlock')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/CV\/evidence\/?\?q=airlock/)
  })

  test('the palette goes to a case, and Escape closes it', async ({ page }) => {
    await open(page)
    await page.getByTestId('btn-palette').click()
    await page.getByTestId('palette-input').fill('DORA')
    await expect(page.getByTestId('cmd-case-dora-control-line')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('overlay-palette')).toBeHidden()
    await page.getByTestId('btn-palette').click()
    await page.getByTestId('cmd-case-dora-control-line').click()
    await expect(page).toHaveURL(/\/CV\/case\/dora-control-line/)
  })

  test('? opens keyboard help, G the overview, M the menu, L the lens menu', async ({ page }) => {
    await open(page)
    await page.keyboard.press('?')
    await expect(page.getByTestId('overlay-help')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.keyboard.press('g')
    await expect(page.getByTestId('overlay-overview')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.keyboard.press('m')
    await expect(page.getByTestId('overlay-menu')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.keyboard.press('l')
    await expect(page.getByTestId('lens-menu')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('lens-menu')).toBeHidden()
  })

  test('E opens the explorer and P toggles back to the guided story', async ({ page }) => {
    await open(page)
    await page.keyboard.press('e')
    await expect(page).toHaveURL(/\/CV\/evidence/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Evidence explorer')
    await page.keyboard.press('p')
    await expect(page.getByTestId('mode-guided')).toHaveAttribute('aria-current', 'page')
    await page.keyboard.press('p')
    await expect(page).toHaveURL(/\/CV\/evidence/)
  })

  test('shortcuts are ignored while typing', async ({ page }) => {
    await open(page, 'evidence/')
    await page.getByTestId('evidence-search').fill('e and p')
    await expect(page).toHaveURL(/\/CV\/evidence/)
    await expect(page.getByTestId('overlay-overview')).toHaveCount(0)
  })

  test('the overview jumps to a scene', async ({ page }) => {
    await open(page)
    await page.keyboard.press('g')
    await page.getByRole('button', { name: /Economics/ }).click()
    await expect(page.locator('#economics-title')).toBeInViewport()
  })

  test('the skip link moves focus to the main content', async ({ page }) => {
    await open(page)
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })
})

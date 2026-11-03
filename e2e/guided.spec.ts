import { expect, test } from '@playwright/test'
import { LENSES, SCENES, mountScenes, open } from './helpers'

test.describe('guided story', () => {
  test('is legible at first glance: name, title, headline and primary actions', async ({ page }) => {
    const errors = await open(page)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I turn complex AI opportunities into decisions')
    await expect(page.locator('.hero__name')).toHaveText('Thomas Zijlstra, CFA')
    await expect(page.locator('.hero__title')).toContainText('Financial Services Strategy, Transformation & Enterprise AI')
    await expect(page.getByTestId('cta-evidence')).toBeVisible()
    await expect(page.getByTestId('cta-pdf')).toHaveAttribute('href', '/CV/assets/Thomas_Zijlstra_CV.pdf')
    await expect(page).toHaveTitle(/Thomas Zijlstra, CFA \| Financial Services Strategy/)
    expect(errors).toEqual([])
  })

  test('has twelve scenes in order, each with a conclusion-led heading', async ({ page }) => {
    await open(page)
    await mountScenes(page)
    const ids = await page.locator('[data-scene]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.scene))
    expect(ids).toEqual(SCENES)
    for (const id of SCENES.slice(1)) await expect(page.locator(`#${id}-title`)).not.toBeEmpty()
  })

  test('Left and Right move between scenes and update the rail', async ({ page }) => {
    await open(page)
    await page.locator('body').click({ position: { x: 5, y: 300 } })
    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/#career$/)
    await expect(page.locator('.rail__item[aria-current="step"]')).toContainText('02')
    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/#fabric$/)
    await page.keyboard.press('ArrowLeft')
    await expect(page).toHaveURL(/#career$/)
  })

  test('a scene deep link lands on that scene', async ({ page }) => {
    await open(page, '#economics')
    await expect(page.locator('#economics-title')).toBeInViewport()
  })

  test('the opening visual plays, can be skipped and replayed', async ({ page }) => {
    await open(page)
    const btn = page.getByTestId('thesis-replay')
    await expect(btn).toHaveText(/Replay/, { timeout: 10_000 })
    await btn.click()
    await expect(btn).toHaveText(/Skip/)
    await btn.click()
    await expect(btn).toHaveText(/Replay/)
  })

  for (const lens of LENSES) {
    test(`lens ${lens} changes emphasis but keeps the facts`, async ({ page }) => {
      await open(page, `?lens=${lens}`)
      await expect(page.getByTestId('lens-opening')).toBeVisible()
      await expect(page.getByTestId('btn-lens')).not.toContainText('All roles')
      await page.locator('#selected-evidence').scrollIntoViewIfNeeded()
      await expect(page.locator('.sel__row')).toHaveCount(5)
      await page.locator('#role-fit').scrollIntoViewIfNeeded()
      await expect(page.getByTestId('lens-conclusion')).toBeVisible()
    })
  }

  test('an unknown lens is ignored', async ({ page }) => {
    await open(page, '?lens=moon')
    await expect(page.getByTestId('btn-lens')).toContainText('All roles')
    await expect(page.locator('.hero__supporting')).toBeVisible()
  })

  test('the lens menu sets the lens in the URL and keeps it across pages', async ({ page }) => {
    await open(page)
    await page.getByTestId('btn-lens').click()
    await page.getByTestId('lens-risk').click()
    await expect(page).toHaveURL(/lens=risk/)
    await page.getByTestId('mode-explorer').click()
    await expect(page).toHaveURL(/\/CV\/evidence\/?\?.*lens=risk/)
  })

  test('the economics widget recomputes and keeps tokens marginal', async ({ page }) => {
    await open(page, '#economics')
    const allIn = page.getByTestId('econ-allin')
    await expect(allIn).toHaveText('EUR 833k')
    await expect(page.getByTestId('econ-breakeven')).toHaveText('Year 4')
    await page.getByTestId('econ-functions-4').click()
    await expect(allIn).not.toHaveText('EUR 833k')
    await page.getByTestId('econ-hosting-on-prem').click()
    await expect(page.locator('.econ__levers')).toContainText('of cost')
  })

  test('the process network triggers the synthetic event along source links', async ({ page }) => {
    await open(page, '#process-network')
    await page.getByTestId('s05-trigger').click()
    await expect(page.locator('.net__steps li.is-on')).toHaveCount(5, { timeout: 10_000 })
    await page.getByTestId('s05-node-tprm').click()
    await expect(page.locator('.net__title')).toHaveText('Third-Party Risk Management')
  })

  test('the work-fabric comparison switches between today and the target', async ({ page }) => {
    await open(page, '#work-fabric')
    await page.getByTestId('s04-today').click()
    await expect(page.getByTestId('s04-today')).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('.wfc__state')).toContainText('The analyst carries context')
    await page.getByTestId('s04-target').click()
    await expect(page.locator('.wfc__state')).toContainText('Systems stay authoritative')
  })

  test('the capability fabric highlights a role family trail', async ({ page }) => {
    await open(page, '#fabric')
    await page.getByTestId('fabric-role-risk').click()
    await expect(page.getByTestId('fabric-role-risk')).toHaveAttribute('aria-pressed', 'true')
    expect(await page.locator('.fabric__ev.is-lit').count()).toBeGreaterThan(2)
  })
})

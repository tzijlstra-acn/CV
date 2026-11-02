import { expect, test } from '@playwright/test'
import { CASES, open } from './helpers'

test.describe('case studies (brief sections 13 to 15)', () => {
  for (const slug of CASES) {
    test(`${slug}: loads directly and shows every template section`, async ({ page }) => {
      const errors = await open(page, `case/${slug}/`)
      await expect(page.getByTestId(`case-${slug}`)).toBeVisible()
      for (const id of ['problem', 'constraints', 'role', 'decisions', 'architecture', 'evidence', 'value', 'learned', 'limitations']) {
        await expect(page.locator(`#${id}`), id).toBeVisible()
        await expect(page.locator(`#${id} .case__section-body`), id).not.toBeEmpty()
      }
      await expect(page.getByTestId('scope-boundary')).not.toBeEmpty()
      expect(await page.locator('[data-testid="limitations"] li').count()).toBeGreaterThan(1)
      expect(errors).toEqual([])
    })
  }

  test('the next and previous links walk through the cases', async ({ page }) => {
    await open(page, 'case/nfr-work-fabric/')
    await page.getByTestId('case-next').click()
    await expect(page).toHaveURL(/\/CV\/case\/ai-economics/)
    await page.goBack()
    await expect(page).toHaveURL(/\/CV\/case\/nfr-work-fabric/)
  })

  test('an unknown case shows the not-found view', async ({ page }) => {
    await page.goto('case/not-a-case/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist')
  })

  test.describe('NFR Work Fabric interactions (brief section 13.3)', () => {
    test.beforeEach(async ({ page }) => {
      await open(page, 'case/nfr-work-fabric/')
      await page.getByTestId('nfr-blueprint').scrollIntoViewIfNeeded()
    })

    test('switching role view keeps the work object unchanged', async ({ page }) => {
      const object = page.locator('#bp-roles [role="tabpanel"][data-state="active"] [data-testid="work-object"]')
      const before = await object.innerText()
      await page.getByTestId('role-approver').click()
      await expect(page.locator('#bp-roles [role="tabpanel"][data-state="active"]')).toContainText('Execute the approved action')
      expect(await object.innerText()).toBe(before)
      await page.getByTestId('role-auditor').click()
      expect(await object.innerText()).toBe(before)
    })

    test('the cross-process event runs and the vertical layers reveal', async ({ page }) => {
      await page.getByTestId('case-net-trigger').click()
      await expect(page.locator('#bp-network .net__steps li.is-on')).toHaveCount(5, { timeout: 10_000 })
      await page.getByTestId('layer-security').click()
      await expect(page.getByTestId('layer-security')).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.layers__plane--1')).toHaveClass(/is-on/)
    })

    test('the module contract, value and cost lenses can be inspected', async ({ page }) => {
      await page.getByTestId('contract-controls').click()
      await expect(page.locator('.contract__fields')).toContainText('Segregation')
      await page.getByTestId('lens-cost').click()
      await expect(page.locator('#bp-value')).toContainText('Cost per completed, controlled process')
    })

    test('route toggles show the strategy, process, technology and governance readings', async ({ page }) => {
      const count = page.locator('[data-module]')
      const all = await count.count()
      for (const id of ['strategy', 'process', 'technology', 'governance']) {
        await page.getByTestId(`route-${id}`).click()
        expect(await count.count(), id).toBeLessThan(all)
      }
      await page.getByTestId('route-all').click()
      expect(await count.count()).toBe(all)
    })
  })
})

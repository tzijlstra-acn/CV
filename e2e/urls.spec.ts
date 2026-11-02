import { expect, test } from '@playwright/test'
import { CASES } from './helpers'

test.describe('stable URLs and the static artifact (brief sections 2 and 27)', () => {
  test('the web CV and the PDF keep their URLs', async ({ request }) => {
    const cv = await request.get('cv.html')
    expect(cv.status()).toBe(200)
    expect(await cv.text()).toContain('Thomas Zijlstra, CFA')
    const pdf = await request.get('assets/Thomas_Zijlstra_CV.pdf')
    expect(pdf.status()).toBe(200)
    expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF')
  })

  test('the web CV renders with its own stylesheet and script', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('cv.html')
    await expect(page.locator('.cv-name')).toHaveText('Thomas Zijlstra, CFA')
    await expect(page.locator('a[href="assets/Thomas_Zijlstra_CV.pdf"]').first()).toBeVisible()
    expect(errors).toEqual([])
  })

  for (const path of ['', 'evidence/', 'capabilities/', ...CASES.map((c) => `case/${c}/`)]) {
    test(`/CV/${path} is a real prerendered page`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.status()).toBe(200)
      const html = await res.text()
      expect(html).toMatch(/<link rel="canonical" href="https:\/\/tzijlstra-acn\.github\.io\/CV\//)
      expect(html).toContain('class="static-fallback"')
    })
  }

  test('robots and sitemap are published', async ({ request }) => {
    expect((await request.get('robots.txt')).status()).toBe(200)
    const sitemap = await (await request.get('sitemap.xml')).text()
    for (const c of CASES) expect(sitemap).toContain(`/CV/case/${c}/`)
  })

  test('browser back and forward work across routes', async ({ page }) => {
    await page.goto('')
    await page.getByTestId('cta-evidence').click()
    await expect(page).toHaveURL(/\/CV\/evidence/)
    await page.goBack()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I turn complex AI')
    await page.goForward()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Evidence explorer')
  })

  test('the legacy target-mode parameter has no effect', async ({ page }) => {
    await page.goto('')
    const plain = await page.locator('h1').innerText()
    await page.goto('?target=legacy')
    expect(await page.locator('h1').innerText()).toBe(plain)
    await expect(page.getByTestId('btn-lens')).toContainText('All roles')
  })
})

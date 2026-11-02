import { Link, Outlet } from '@tanstack/react-router'
import { LazyMotion, MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { CV_HREF, PDF_HREF, site } from '@/data/site'
import { useRouteId } from './hooks'
import { Command, Download, FileText, ICON, Menu } from '@/design-system/icons'
import { LensMenu } from './LensMenu'
import { useShortcuts } from './useShortcuts'
import { useUi } from './ui-store'

/** Overlays (palette, help, overview, menu) load on first use, keeping Radix Dialog out of the first download. */
const Overlays = lazy(() => import('./Overlays').then((m) => ({ default: m.Overlays })))

const loadMotionFeatures = () => import('./motion-features').then((r) => r.default)

function ModeSwitch() {
  const routeId = useRouteId()
  const guided = routeId === '/'
  return (
    <nav className="mode-switch" aria-label="Mode (P)">
      <Link to="/" search={(p) => ({ lens: p.lens })} className="mode-switch__item" aria-current={guided ? 'page' : undefined} data-testid="mode-guided">
        Guided
      </Link>
      <Link to="/evidence" search={(p) => ({ lens: p.lens })} className="mode-switch__item" aria-current={!guided ? 'page' : undefined} data-testid="mode-explorer">
        Explorer
      </Link>
    </nav>
  )
}

function TopBar() {
  const open = useUi((s) => s.open)
  return (
    <header className="topbar" data-qa-chrome>
      <Link to="/" search={(p) => ({ lens: p.lens })} hash="thesis" className="topbar__id">
        <span className="monogram" aria-hidden="true">
          TZ
        </span>
        <span className="topbar__name">{site.person.name}</span>
        <span className="sr-only">, portfolio home</span>
      </Link>
      <ModeSwitch />
      <div className="topbar__actions">
        <LensMenu />
        <button type="button" className="btn btn--quiet btn--small topbar__cmd" onClick={() => open('palette')} aria-keyshortcuts="C" data-testid="btn-palette">
          <Command {...ICON} />
          <span className="topbar__cmd-label" aria-hidden="true">
            Search
          </span>
          <span className="sr-only">Search</span>
          <kbd className="kbd" aria-hidden="true">
            C
          </kbd>
        </button>
        <a className="btn btn--quiet btn--small topbar__wide" href={CV_HREF} data-testid="link-web-cv">
          <FileText {...ICON} /> Web CV
        </a>
        <a className="btn btn--small topbar__wide" href={PDF_HREF} download data-testid="link-pdf">
          <Download {...ICON} /> CV
        </a>
        <button type="button" className="btn btn--quiet btn--small" onClick={() => open('menu')} aria-label="Menu (M)" data-testid="btn-menu">
          <Menu {...ICON} />
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__note">
          Personal portfolio. Views are my own. Public builds use synthetic, anonymised or illustrative data and do not represent client systems. No confidential client or employer information is presented.
        </p>
        <p className="t-mono t-muted">
          Evidence model {site.stats.evidence} items, {site.stats.capabilities} capabilities. Built {site.build.date}.
        </p>
      </div>
    </footer>
  )
}

export function Shell() {
  useShortcuts()
  const routeId = useRouteId()
  const close = useUi((s) => s.close)
  const overlay = useUi((s) => s.overlay)
  const [overlaysWanted, setOverlaysWanted] = useState(false)
  if (!overlaysWanted && overlay !== 'none' && overlay !== 'lens') setOverlaysWanted(true)
  // Overlays never survive a navigation.
  useEffect(() => close(), [routeId, close])
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <TopBar />
        <main id="main" tabIndex={-1} className="main">
          <Outlet />
        </main>
        <Footer />
        {overlaysWanted ? (
          <Suspense fallback={null}>
            <Overlays />
          </Suspense>
        ) : null}
      </LazyMotion>
    </MotionConfig>
  )
}

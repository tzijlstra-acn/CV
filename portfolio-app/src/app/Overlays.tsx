import * as Dialog from '@radix-ui/react-dialog'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useState, type ReactNode } from 'react'
import { CV_HREF, mailto, PDF_HREF, primaryCases, site } from '@/data/site'
import { ArrowRight, ICON, Search, X } from '@/design-system/icons'
import { scrollToScene } from './useShortcuts'
import { useUi, type Overlay } from './ui-store'
import type { EvidenceSearch } from './router'

function Sheet({ id, title, description, children, className = '' }: { id: Overlay; title: string; description?: string; children: ReactNode; className?: string }) {
  const overlay = useUi((s) => s.overlay)
  const close = useUi((s) => s.close)
  return (
    <Dialog.Root open={overlay === id} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-backdrop" />
        <Dialog.Content className={`sheet ${className}`} data-testid={`overlay-${id}`}>
          <div className="sheet__head">
            <Dialog.Title className="sheet__title">{title}</Dialog.Title>
            <Dialog.Close className="btn btn--quiet btn--small" aria-label="Close (Escape)">
              <X {...ICON} />
            </Dialog.Close>
          </div>
          {description ? <Dialog.Description className="sheet__desc">{description}</Dialog.Description> : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface Command {
  id: string
  group: string
  label: string
  run: () => void
}

function CommandPalette() {
  const navigate = useNavigate()
  const close = useUi((s) => s.close)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)

  const commands = useMemo<Command[]>(() => {
    const go = (to: string, search?: EvidenceSearch) => () => {
      close()
      void navigate({ to, search: (prev: Record<string, unknown>) => ({ lens: prev.lens as never, ...search }) })
    }
    const ext = (href: string) => () => {
      close()
      window.location.href = href
    }
    return [
      ...site.cases.map((c) => ({ id: `case-${c.slug}`, group: 'Go to case', label: c.title, run: () => (close(), void navigate({ to: '/case/$slug', params: { slug: c.slug }, search: (p) => ({ lens: p.lens }) })) })),
      ...site.lenses.map((l) => ({ id: `lens-${l.id}`, group: 'Change role lens', label: l.label, run: () => (close(), void navigate({ to: '.', search: (p) => ({ ...p, lens: l.id }), replace: true, resetScroll: false })) })),
      { id: 'lens-all', group: 'Change role lens', label: 'All roles', run: () => (close(), void navigate({ to: '.', search: (p) => ({ ...p, lens: undefined }), replace: true, resetScroll: false })) },
      { id: 'show-professional', group: 'Show evidence', label: 'Show professional delivery', run: go('/evidence', { depth: ['professional-delivery'] }) },
      { id: 'show-public', group: 'Show evidence', label: 'Show public builds', run: go('/evidence', { type: ['public-build'] }) },
      { id: 'show-technical', group: 'Show evidence', label: 'Show technical depth', run: go('/evidence', { group: ['ai-solution-design', 'engineering-quality'] }) },
      { id: 'show-gtm', group: 'Show evidence', label: 'Show GTM evidence', run: go('/evidence', { group: ['customer-market'] }) },
      { id: 'show-risk', group: 'Show evidence', label: 'Show risk and AI work', run: go('/evidence', { group: ['risk-control'] }) },
      { id: 'evidence', group: 'Explore', label: 'Open the evidence explorer', run: go('/evidence') },
      { id: 'capabilities', group: 'Explore', label: 'Open the capability map', run: go('/capabilities') },
      ...site.story.map((s) => ({ id: `scene-${s.id}`, group: 'Guided story', label: `${String(s.number).padStart(2, '0')} ${s.short}`, run: () => (close(), void navigate({ to: '/', search: (p) => ({ lens: p.lens }), hash: s.id }).then(() => scrollToScene(s.id))) })),
      { id: 'download-cv', group: 'Contact', label: 'Download CV (PDF)', run: ext(PDF_HREF) },
      { id: 'web-cv', group: 'Contact', label: 'Open web CV', run: ext(CV_HREF) },
      { id: 'email', group: 'Contact', label: 'Email Thomas', run: ext(mailto) },
    ]
  }, [close, navigate])

  const needle = q.trim().toLowerCase()
  const shown = needle ? commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(needle)) : commands
  const searchCommand: Command | null = needle
    ? { id: 'search', group: 'Search', label: `Search evidence for "${q.trim()}"`, run: () => (close(), void navigate({ to: '/evidence', search: (p) => ({ lens: p.lens, q: q.trim() }) })) }
    : null
  const list = searchCommand ? [searchCommand, ...shown] : shown
  const current = Math.min(active, Math.max(0, list.length - 1))

  return (
    <div className="palette">
      <label className="palette__field">
        <Search {...ICON} />
        <span className="sr-only">Search commands and evidence</span>
        <input
          autoFocus
          value={q}
          onChange={(e) => (setQ(e.target.value), setActive(0))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(list.length - 1, a + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(0, a - 1))
            } else if (e.key === 'Enter' && list[current]) {
              e.preventDefault()
              list[current].run()
            }
          }}
          placeholder="Try: show what Thomas personally built"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={list[current] ? `cmd-${list[current].id}` : undefined}
          data-testid="palette-input"
        />
      </label>
      <ul className="palette__list" id="palette-list" role="listbox" aria-label="Commands">
        {list.map((c, i) => (
          <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === current} className="palette__item" onMouseEnter={() => setActive(i)} onClick={c.run} data-testid={`cmd-${c.id}`}>
            <span className="palette__group t-mono">{c.group}</span>
            <span className="palette__label">{c.label}</span>
            <ArrowRight {...ICON} size={16} />
          </li>
        ))}
        {!list.length ? <li className="palette__empty">No commands match.</li> : null}
      </ul>
    </div>
  )
}

const KEYS: [string, string][] = [
  ['Left / Right', 'Previous and next scene in the guided story'],
  ['G', 'Story overview'],
  ['E', 'Evidence explorer'],
  ['L', 'Role lens'],
  ['M', 'Menu'],
  ['C', 'Search and command palette'],
  ['P', 'Switch between guided and explorer mode'],
  ['?', 'This keyboard help'],
  ['Escape', 'Close any overlay'],
]

function StoryOverview() {
  const close = useUi((s) => s.close)
  const navigate = useNavigate()
  return (
    <div className="overview">
      <ol className="overview__scenes">
        {site.story.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="overview__scene"
              onClick={() => {
                close()
                void navigate({ to: '/', search: (p) => ({ lens: p.lens }), hash: s.id }).then(() => setTimeout(() => scrollToScene(s.id), 30))
              }}
            >
              <span className="t-mono">{String(s.number).padStart(2, '0')}</span>
              <span className="overview__chapter t-mono">{s.chapter}</span>
              <span className="overview__name">{s.short}</span>
            </button>
          </li>
        ))}
      </ol>
      <h3 className="overview__h">Case studies</h3>
      <ul className="overview__cases" role="list">
        {site.cases.map((c) => (
          <li key={c.slug}>
            <Link to="/case/$slug" params={{ slug: c.slug }} search={(p) => ({ lens: p.lens })} className="overview__case" onClick={close}>
              {c.title} <ArrowRight {...ICON} size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MenuSheet() {
  const close = useUi((s) => s.close)
  return (
    <nav aria-label="Site" className="menu">
      <ul role="list" className="menu__list">
        <li>
          <Link to="/" search={(p) => ({ lens: p.lens })} onClick={close} className="menu__link">
            Guided story
          </Link>
        </li>
        <li>
          <Link to="/evidence" search={(p) => ({ lens: p.lens })} onClick={close} className="menu__link">
            Evidence explorer
          </Link>
        </li>
        <li>
          <Link to="/capabilities" search={(p) => ({ lens: p.lens })} onClick={close} className="menu__link">
            Capability map
          </Link>
        </li>
      </ul>
      <p className="menu__h t-eyebrow">Primary cases</p>
      <ul role="list" className="menu__list">
        {primaryCases.map((c) => (
          <li key={c.slug}>
            <Link to="/case/$slug" params={{ slug: c.slug }} search={(p) => ({ lens: p.lens })} onClick={close} className="menu__link">
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="menu__h t-eyebrow">CV and contact</p>
      <ul role="list" className="menu__list">
        <li>
          <a href={PDF_HREF} download className="menu__link">
            Download CV (PDF)
          </a>
        </li>
        <li>
          <a href={CV_HREF} className="menu__link">
            Web CV
          </a>
        </li>
        <li>
          <a href={mailto} className="menu__link">
            Email
          </a>
        </li>
        <li>
          <a href={site.person.github} className="menu__link" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  )
}

export function Overlays() {
  const overlay = useUi((s) => s.overlay)
  return (
    <>
      <Sheet id="palette" title="Search and commands" className="sheet--palette">
        {overlay === 'palette' ? <CommandPalette /> : null}
      </Sheet>
      <Sheet id="help" title="Keyboard shortcuts" className="sheet--narrow">
        <dl className="keys">
          {KEYS.map(([k, v]) => (
            <div key={k} className="keys__row">
              <dt>
                <kbd className="kbd">{k}</kbd>
              </dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Sheet>
      <Sheet id="overview" title="Story overview" description="Twelve scenes and six case studies. Every scene has a stable link.">
        <StoryOverview />
      </Sheet>
      <Sheet id="menu" title="Menu" className="sheet--drawer">
        <MenuSheet />
      </Sheet>
    </>
  )
}

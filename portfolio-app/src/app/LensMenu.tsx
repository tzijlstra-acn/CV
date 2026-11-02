import * as Popover from '@radix-ui/react-popover'
import { useNavigate } from '@tanstack/react-router'
import { site, type RoleFamily } from '@/data/site'
import { Check, ChevronDown, ICON } from '@/design-system/icons'
import { useActiveLens } from './hooks'
import { useUi } from './ui-store'

/**
 * Role-lens selector (brief section 11). A lens reorders and emphasises the same evidence; it
 * never changes facts. The choice lives in the URL (?lens=risk) so it can be shared.
 */
export function LensMenu() {
  const lens = useActiveLens()
  const overlay = useUi((s) => s.overlay)
  const open = useUi((s) => s.open)
  const close = useUi((s) => s.close)
  const navigate = useNavigate()
  const choose = (id?: RoleFamily) => {
    close()
    void navigate({ to: '.', search: (prev) => ({ ...prev, lens: id }), hash: (h) => h ?? '', replace: true, resetScroll: false })
  }
  return (
    <Popover.Root open={overlay === 'lens'} onOpenChange={(o) => (o ? open('lens') : close())}>
      <Popover.Trigger asChild>
        <button type="button" className="lens-trigger" aria-keyshortcuts="L" data-testid="btn-lens">
          <span className="lens-trigger__k">Lens</span>
          <span className="sr-only">:</span>
          <span className="lens-trigger__v">{lens?.short ?? 'All roles'}</span>
          <ChevronDown {...ICON} size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="popover lens-menu" align="end" sideOffset={8} data-testid="lens-menu">
          <p className="popover__title">View the same evidence through a role lens</p>
          <p className="popover__note">Lenses change the order and emphasis. The facts stay the same.</p>
          <ul className="lens-menu__list" role="list">
            {[undefined, ...site.lenses].map((l) => {
              const active = (l?.id ?? undefined) === lens?.id
              return (
                <li key={l?.id ?? 'all'}>
                  <button type="button" className="lens-menu__item" aria-pressed={active} onClick={() => choose(l?.id)} data-testid={`lens-${l?.id ?? 'all'}`}>
                    <span>{l?.label ?? 'All roles'}</span>
                    {active ? <Check {...ICON} size={16} /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

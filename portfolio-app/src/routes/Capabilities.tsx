import { Link } from '@tanstack/react-router'
import { useActiveLens } from '@/app/hooks'
import { DepthGlyph, DepthLabel, DepthLegend } from '@/components/Evidence'
import { DEPTH_LABEL, getEvidence, site } from '@/data/site'
import { Deferred } from '@/lib/Deferred'
import { hasHash } from '@/lib/hooks'
import './explorer.css'
import './capabilities.css'

/**
 * Capability map (brief section 8): no ratings, no meters. Each capability shows the strongest
 * depth of its evidence and links to every item behind it. A lens reorders groups only.
 */
export function Capabilities() {
  const lens = useActiveLens()
  const groups = lens ? [...site.groups].sort((a, b) => (lens.capabilityGroups.includes(b.id) ? 1 : 0) - (lens.capabilityGroups.includes(a.id) ? 1 : 0)) : site.groups
  return (
    <div className="page explorer caps">
      <header className="explorer__head">
        <p className="t-eyebrow">Explorer</p>
        <h1 className="explorer__title" tabIndex={-1}>
          Capabilities
        </h1>
        <p className="t-lead">
          {site.stats.capabilities} capabilities in {site.groups.length} groups. A capability appears here only when evidence links to it, and each one shows how deep that evidence goes.
          {lens ? ` Groups most relevant to the ${lens.label} lens come first.` : ''}
        </p>
        <DepthLegend />
      </header>
      <nav className="caps__toc" aria-label="Capability groups">
        {groups.map((g) => (
          <a key={g.id} href={`#group-${g.id}`} className={`chip${lens?.capabilityGroups.includes(g.id) ? ' chip--lens' : ''}`}>
            {g.short}
          </a>
        ))}
      </nav>
      {groups.map((g, n) => (
        <Deferred key={g.id} now={n === 0 || hasHash()}>
          <section id={`group-${g.id}`} className="caps__group" aria-labelledby={`h-${g.id}`}>
            <div className="caps__group-head">
              <h2 id={`h-${g.id}`}>{g.title}</h2>
              <p className="t-muted">{g.summary}</p>
            </div>
            <table className="caps__table">
              <caption className="sr-only">{g.title}: capabilities, strongest evidence depth and linked evidence</caption>
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  <th scope="col">Strongest evidence</th>
                  <th scope="col">Linked evidence</th>
                </tr>
              </thead>
              <tbody>
                {g.capabilities.map((c) => (
                  <tr key={c.id} id={`cap-${c.id}`} data-testid={`cap-${c.id}`}>
                    <th scope="row">{c.label}</th>
                    <td>
                      <DepthLabel depth={c.strongest} />
                    </td>
                    <td>
                      <ul className="caps__ev" role="list">
                        {c.evidence.map((ref) => {
                          const e = getEvidence(ref.id)!
                          return (
                            <li key={ref.id}>
                              <DepthGlyph depth={ref.depth} />
                              <span className="sr-only">{DEPTH_LABEL[ref.depth]}: </span>
                              {e.case ? (
                                <Link to="/case/$slug" params={{ slug: e.case }} search={(p) => ({ lens: p.lens })}>
                                  {e.title}
                                </Link>
                              ) : (
                                <Link to="/evidence" search={(p) => ({ lens: p.lens, focus: e.id })}>
                                  {e.title}
                                </Link>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </Deferred>
      ))}
      <Deferred now={hasHash()}>
        <section className="caps__group" aria-labelledby="h-patterns">
          <div className="caps__group-head">
            <h2 id="h-patterns">Technology patterns</h2>
            <p className="t-muted">Patterns, not a framework list. A framework is named only where it implements a pattern in a linked piece of evidence.</p>
          </div>
          <table className="caps__table">
            <caption className="sr-only">Technology patterns and where they were used</caption>
            <thead>
              <tr>
                <th scope="col">Pattern</th>
                <th scope="col">What it means</th>
                <th scope="col">Where, how deep, and with what</th>
              </tr>
            </thead>
            <tbody>
              {site.patterns.map((p) => (
                <tr key={p.id}>
                  <th scope="row">{p.label}</th>
                  <td>{p.description}</td>
                  <td>
                    <ul className="caps__ev" role="list">
                      {p.uses.map((u) => (
                        <li key={u.evidence}>
                          <DepthGlyph depth={u.depth} />
                          <span className="sr-only">{DEPTH_LABEL[u.depth]}: </span>
                          <span>
                            {getEvidence(u.evidence)!.title}
                            {u.implementedWith ? <span className="t-mono caps__tool"> {u.implementedWith}</span> : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </Deferred>
    </div>
  )
}

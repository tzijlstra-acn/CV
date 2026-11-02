import { Link } from '@tanstack/react-router'
import { CASE_TYPE_LABEL, DEPTH_LABEL, DEPTH_MEANING, DEPTH_ORDER, getCase, MATURITY_LABEL, TYPE_LABEL, type CaseStudy, type Depth, type EvidenceItem } from '@/data/site'
import { ArrowRight, ArrowUpRight, ICON } from '@/design-system/icons'

/** Shape and colour both carry the depth, so the label never depends on colour alone. */
export function DepthGlyph({ depth, size = 12, onDark = false }: { depth: Depth; size?: number; onDark?: boolean }) {
  const s = size
  const c = s / 2
  const common = { width: s, height: s, viewBox: `0 0 ${s} ${s}`, 'aria-hidden': true as const, className: `glyph glyph--${depth}${onDark ? ' glyph--dark' : ''}` }
  switch (depth) {
    case 'professional-delivery':
      return (
        <svg {...common}>
          <rect x={1} y={1} width={s - 2} height={s - 2} rx={1.5} />
        </svg>
      )
    case 'built-verified':
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={c - 1} />
        </svg>
      )
    case 'designed-specified':
      return (
        <svg {...common}>
          <path d={`M${c} 1 L${s - 1} ${c} L${c} ${s - 1} L1 ${c} Z`} />
        </svg>
      )
    case 'collaborated-applied':
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={c - 1.25} className="glyph__ring" />
          <path d={`M${c} 1.25 A${c - 1.25} ${c - 1.25} 0 0 1 ${c} ${s - 1.25} Z`} />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx={c} cy={c} r={c - 1.25} className="glyph__ring glyph__ring--dotted" />
        </svg>
      )
  }
}

export function DepthLabel({ depth, compact = false, onDark = false }: { depth: Depth; compact?: boolean; onDark?: boolean }) {
  return (
    <span className={`depth depth--${depth}${onDark ? ' depth--dark' : ''}`} title={DEPTH_MEANING[depth]}>
      <DepthGlyph depth={depth} onDark={onDark} />
      <span className={compact ? 'sr-only' : undefined}>{DEPTH_LABEL[depth]}</span>
    </span>
  )
}

export function DepthLegend({ onDark = false }: { onDark?: boolean }) {
  return (
    <ul className={`depth-legend${onDark ? ' depth-legend--dark' : ''}`} aria-label="Evidence depth labels" role="list">
      {DEPTH_ORDER.map((d) => (
        <li key={d}>
          <DepthLabel depth={d} onDark={onDark} />
        </li>
      ))}
    </ul>
  )
}

export function TypeTag({ item }: { item: Pick<EvidenceItem, 'evidenceType'> }) {
  return <span className={`type-tag type-tag--${item.evidenceType}`}>{TYPE_LABEL[item.evidenceType]}</span>
}

export function CaseTags({ c }: { c: CaseStudy }) {
  return (
    <span className="case-tags">
      <span className={`type-tag type-tag--${c.evidenceType}`}>{CASE_TYPE_LABEL[c.evidenceType]}</span>
      <span className="type-tag type-tag--maturity">{MATURITY_LABEL[c.maturity]}</span>
    </span>
  )
}

/** One evidence item as a structured row: what it is, what I did, how deep, and its boundary. */
export function EvidenceRow({ item, emphasis = false, headingLevel = 3 }: { item: EvidenceItem; emphasis?: boolean; headingLevel?: 2 | 3 | 4 }) {
  const H = `h${headingLevel}` as 'h3'
  const linkedCase = item.case ? getCase(item.case) : undefined
  return (
    <article className={`ev-row${emphasis ? ' ev-row--emphasis' : ''}`} data-testid={`evidence-${item.id}`} data-depth={item.depth}>
      <div className="ev-row__meta">
        <DepthLabel depth={item.depth} />
        <TypeTag item={item} />
        {item.period ? <span className="t-mono t-muted ev-row__period">{item.period}</span> : null}
      </div>
      <div className="ev-row__body">
        <H className="ev-row__title">{item.title}</H>
        <p className="ev-row__org t-muted">{item.organisation}</p>
        <p className="ev-row__summary">{item.summary}</p>
        <p className="ev-row__did">
          <span className="ev-row__k">My part</span> {item.contribution}
        </p>
        <p className="ev-row__boundary">
          <span className="ev-row__k">Boundary</span> {item.scopeBoundary}
        </p>
      </div>
      <div className="ev-row__links">
        {linkedCase ? (
          <Link to="/case/$slug" params={{ slug: linkedCase.slug }} search={(p) => ({ lens: p.lens })} className="text-link">
            Case study <ArrowRight {...ICON} size={15} />
          </Link>
        ) : null}
        {item.links.map((l) => (
          <a key={l.href} href={l.href} className="text-link" rel="noopener noreferrer">
            {l.label} <ArrowUpRight {...ICON} size={15} />
          </a>
        ))}
      </div>
    </article>
  )
}

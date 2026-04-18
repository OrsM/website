import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../theme'

const interactive = [
  { href: '/games/equal-groups.html', title: 'Equal Groups', desc: 'Division and equal distribution', tag: 'Game' },
  { href: '/games/subitizing-flash.html', title: 'Subitizing Flash', desc: 'Visual number recognition', tag: 'Game' },
  { path: '/tools/price-theory-diagrams', title: 'Price Theory Diagrams', desc: 'Interactive supply & demand, cost curves, monopoly', tag: 'Tool' },
]

const s = {
  page: {
    maxWidth: theme.maxWidth,
    margin: '0 auto',
    padding: '80px 24px 64px',
  },
  name: {
    fontSize: '28px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    marginBottom: '64px',
  },
  section: {
    marginBottom: '56px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: theme.textMuted,
    marginBottom: '16px',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  },
  chip: (active) => ({
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '16px',
    border: `1px solid ${active ? theme.text : theme.border}`,
    color: active ? theme.text : theme.textMuted,
    cursor: 'pointer',
    background: 'transparent',
    fontFamily: theme.fontSans,
  }),
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '0 16px',
    alignItems: 'baseline',
    padding: '14px 0',
    borderTop: `1px solid ${theme.border}`,
    textDecoration: 'none',
    color: theme.text,
  },
  rowTitle: {
    fontSize: '15px',
    fontWeight: '400',
  },
  rowSub: {
    fontSize: '13px',
    color: theme.textMuted,
    marginTop: '2px',
  },
  rowRight: {
    textAlign: 'right',
    flexShrink: '0',
  },
  rowYear: {
    fontSize: '12px',
    color: '#bbb',
    display: 'block',
  },
  rowTag: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#bbb',
    display: 'block',
    marginTop: '2px',
  },
  sectionEnd: {
    borderBottom: `1px solid ${theme.border}`,
  },
  footer: {
    marginTop: '80px',
    paddingTop: '24px',
    borderTop: `1px solid ${theme.border}`,
    display: 'flex',
    gap: '24px',
  },
  footerLink: {
    fontSize: '13px',
    color: theme.textMuted,
    textDecoration: 'none',
  },
}

export default function Home() {
  const [papers, setPapers] = useState([])
  const [paperFilter, setPaperFilter] = useState('Pricing')
  const [interactiveFilter, setInteractiveFilter] = useState('Game')

  useEffect(() => {
    fetch('/papers.json').then(r => r.json()).then(setPapers).catch(() => {})
  }, [])

  const visiblePapers = paperFilter === 'all' ? papers : papers.filter(p => p.group === paperFilter)
  const visibleInteractive = interactiveFilter === 'all' ? interactive : interactive.filter(i => i.tag === interactiveFilter)

  return (
    <div style={s.page}>
      <h1 style={s.name}>Miguel</h1>

      <section style={s.section}>
        <div style={s.sectionLabel}>Reading</div>
        <div style={s.filters}>
          {['all', 'Pricing', 'Gen AI'].map(f => (
            <button key={f} style={s.chip(paperFilter === f)} onClick={() => setPaperFilter(f)}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        {visiblePapers.map(p => (
          <Link key={p.slug} to={`/docs/${p.slug}`} style={s.row}>
            <div>
              <div style={s.rowTitle}>{p.title}</div>
              <div style={s.rowSub}>{p.author}</div>
            </div>
            <div style={s.rowRight}>
              <span style={s.rowYear}>{p.year}</span>
              <span style={s.rowTag}>{p.group}</span>
            </div>
          </Link>
        ))}
        <div style={s.sectionEnd} />
      </section>

      <section style={s.section}>
        <div style={s.sectionLabel}>Interactive</div>
        <div style={s.filters}>
          {['all', 'Game', 'Tool'].map(f => (
            <button key={f} style={s.chip(interactiveFilter === f)} onClick={() => setInteractiveFilter(f)}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        {visibleInteractive.map(item => (
          item.path
            ? <Link key={item.path} to={item.path} style={s.row}>
                <div>
                  <div style={s.rowTitle}>{item.title}</div>
                  <div style={s.rowSub}>{item.desc}</div>
                </div>
                <div style={s.rowRight}><span style={s.rowTag}>{item.tag}</span></div>
              </Link>
            : <a key={item.href} href={item.href} style={s.row}>
                <div>
                  <div style={s.rowTitle}>{item.title}</div>
                  <div style={s.rowSub}>{item.desc}</div>
                </div>
                <div style={s.rowRight}><span style={s.rowTag}>{item.tag}</span></div>
              </a>
        ))}
        <div style={s.sectionEnd} />
      </section>

      <footer style={s.footer}>
        <a href="https://github.com/OrsM" target="_blank" rel="noopener noreferrer" style={s.footerLink}>GitHub</a>
        <a href="https://www.linkedin.com/in/miguelors/" target="_blank" rel="noopener noreferrer" style={s.footerLink}>LinkedIn</a>
      </footer>
    </div>
  )
}

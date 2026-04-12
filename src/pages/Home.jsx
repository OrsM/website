import { Link } from 'react-router-dom'
import { theme } from '../theme'

const games = [
  { path: '/games/equal-groups.html', title: 'Equal Groups', desc: 'Division and equal distribution' },
  { path: '/games/number-bars.html', title: 'Number Bars', desc: 'Pick, merge, and match target sums' },
  { path: '/games/subitizing-flash.html', title: 'Subitizing Flash', desc: 'Visual number recognition' },
]

const tools = [
  { path: '/tools/pm-book-recommender', title: 'PM Book Recommender', desc: 'Personalised reading list for product managers' },
  { path: '/tools/price-theory-diagrams', title: 'Price Theory Diagrams', desc: 'Interactive supply & demand, cost curves, monopoly' },
  { path: '/tools/price-theory-flashcards', title: 'Price Theory Flashcards', desc: 'Spaced-repetition study system for McCloskey' },
]

const docs = [
  { slug: 'wigner', title: 'The Unreasonable Effectiveness of Mathematics', author: 'Wigner' },
  { slug: 'bitter_lesson', title: 'The Bitter Lesson', author: 'Rich Sutton' },
  { slug: 'arxiv_2001.08361', title: 'Scaling Laws for Neural Language Models', author: 'Kaplan et al.' },
  { slug: 'situational_awareness', title: 'Situational Awareness', author: 'Leopold Aschenbrenner, 2024' },
  { slug: 'algorithmic_pricing_nber', title: 'Algorithmic Pricing: Implications for Marketing Strategy and Regulation', author: 'Spann, Bertini, Koenigsberg et al., NBER 2024' },
  { slug: 'platform_design_pricing_algorithms', title: 'Platform Design when Sellers Use Pricing Algorithms', author: 'Johnson, Rhodes, Wildenbeest, TSE 2021' },
  { slug: 'algorithmic_pricing_amazon', title: 'An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace', author: 'Chen, Mislove, Wilson, WWW 2016' },
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
  card: {
    display: 'block',
    textDecoration: 'none',
    color: theme.text,
    padding: '14px 0',
    borderTop: `1px solid ${theme.border}`,
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: '13px',
    color: theme.textMuted,
    marginTop: '2px',
  },
  docLink: {
    display: 'block',
    textDecoration: 'none',
    color: theme.text,
    padding: '14px 0',
    borderTop: `1px solid ${theme.border}`,
  },
  docTitle: {
    fontSize: '15px',
    fontWeight: '400',
  },
  docAuthor: {
    fontSize: '13px',
    color: theme.textMuted,
    marginTop: '2px',
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
  return (
    <div style={s.page}>
      <h1 style={s.name}>Miguel</h1>

      <section style={s.section}>
        <div style={s.sectionLabel}>Games</div>
        {games.map(g => (
          <a key={g.path} href={g.path} style={s.card}>
            <div style={s.cardTitle}>{g.title}</div>
            <div style={s.cardDesc}>{g.desc}</div>
          </a>
        ))}
        <div style={{ borderBottom: `1px solid ${theme.border}` }} />
      </section>

      <section style={s.section}>
        <div style={s.sectionLabel}>Tools</div>
        {tools.map(t => (
          <Link key={t.path} to={t.path} style={s.card}>
            <div style={s.cardTitle}>{t.title}</div>
            <div style={s.cardDesc}>{t.desc}</div>
          </Link>
        ))}
        <div style={{ borderBottom: `1px solid ${theme.border}` }} />
      </section>

      <section style={s.section}>
        <div style={s.sectionLabel}>Reading</div>
        {docs.map(d => (
          <Link key={d.slug} to={`/docs/${d.slug}`} style={s.docLink}>
            <div style={s.docTitle}>{d.title}</div>
            <div style={s.docAuthor}>{d.author}</div>
          </Link>
        ))}
        <div style={{ borderBottom: `1px solid ${theme.border}` }} />
      </section>

      <footer style={s.footer}>
        <a href="https://github.com/OrsM" target="_blank" rel="noopener noreferrer" style={s.footerLink}>GitHub</a>
        <a href="https://www.linkedin.com/in/miguelors/" target="_blank" rel="noopener noreferrer" style={s.footerLink}>LinkedIn</a>
      </footer>
    </div>
  )
}

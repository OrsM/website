import { useState } from 'react'
import { theme } from '../theme'

const GROUPS = ['Pricing', 'Gen AI']

const s = {
  page: { maxWidth: theme.maxWidth, margin: '0 auto', padding: '80px 24px 64px', fontFamily: theme.fontSans },
  heading: { fontSize: '20px', fontWeight: '500', marginBottom: '32px', letterSpacing: '-0.01em' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: {
    width: '100%', padding: '10px 12px', fontSize: '14px',
    border: `1px solid ${theme.border}`, borderRadius: theme.radius,
    fontFamily: theme.fontSans, color: theme.text, background: theme.bg,
    outline: 'none',
  },
  select: {
    width: '100%', padding: '10px 12px', fontSize: '14px',
    border: `1px solid ${theme.border}`, borderRadius: theme.radius,
    fontFamily: theme.fontSans, color: theme.text, background: theme.bg,
    outline: 'none',
  },
  btn: {
    padding: '10px 24px', fontSize: '14px', fontWeight: '500',
    background: theme.text, color: theme.bg, border: 'none',
    borderRadius: theme.radius, cursor: 'pointer', fontFamily: theme.fontSans,
  },
  msg: (ok) => ({ fontSize: '14px', marginTop: '16px', color: ok ? '#2a7a2a' : '#c00' }),
}

export default function AddPaper() {
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [group, setGroup] = useState('Pricing')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, url, title, author, year, group }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ ok: true, msg: 'Paper added.' })
        setUrl(''); setTitle(''); setAuthor(''); setYear('')
      } else {
        setStatus({ ok: false, msg: data.error || 'Something went wrong.' })
      }
    } catch {
      setStatus({ ok: false, msg: 'Could not reach server.' })
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <h1 style={s.heading}>Add paper</h1>
      <form onSubmit={submit}>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>PDF URL</label>
          <input style={s.input} type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Title</label>
          <input style={s.input} type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Author</label>
          <input style={s.input} type="text" value={author} onChange={e => setAuthor(e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Year</label>
          <input style={s.input} type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="2024" required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Group</label>
          <select style={s.select} value={group} onChange={e => setGroup(e.target.value)}>
            {GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add paper'}
        </button>
        {status && <div style={s.msg(status.ok)}>{status.msg}</div>}
      </form>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { theme } from '../theme'

export default function BackBar() {
  return (
    <div style={{
      borderBottom: `1px solid ${theme.border}`,
      padding: '12px 24px',
    }}>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: theme.textMuted,
          fontSize: '13px',
          letterSpacing: '0.02em',
        }}
      >
        ← Miguel
      </Link>
    </div>
  )
}

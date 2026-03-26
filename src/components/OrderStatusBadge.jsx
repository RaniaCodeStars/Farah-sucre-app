import { ORDER_STATUS } from '../lib/constants'

export default function OrderStatusBadge({ status }) {
  const s = ORDER_STATUS[status] || { label: status, color: '#888', bg: '#f0f0f0' }
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}

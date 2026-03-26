import { useState } from 'react'
import { Bell, RefreshCw, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAllOrders } from '../hooks/useOrders'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { ORDER_STATUS, ORDER_STATUS_FLOW } from '../lib/constants'

export default function Admin() {
  const { orders, loading, updateStatus } = useAllOrders()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.nom_client?.toLowerCase().includes(search.toLowerCase()) ||
      o.commune?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search)
    return matchStatus && matchSearch
  })

  // Stats
  const stats = {
    total:       orders.length,
    en_attente:  orders.filter(o => o.status === 'en_attente').length,
    en_cours:    orders.filter(o => ['confirmee','en_preparation','prete','en_livraison'].includes(o.status)).length,
    livrees:     orders.filter(o => o.status === 'livree').length,
    ca:          orders.filter(o => o.status !== 'annulee').reduce((s, o) => s + (o.total || 0), 0),
  }

  async function handleStatusChange(orderId, newStatus) {
    const ok = await updateStatus(orderId, newStatus)
    if (ok) toast.success(`Statut mis à jour : ${ORDER_STATUS[newStatus]?.label}`)
    else toast.error('Erreur lors de la mise à jour')
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: '#FAFAFA' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>🍰</span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26 }}>Dashboard Admin</h1>
              <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 11, padding: '2px 10px', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>Admin ★</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Farah Sucré — Gestion des commandes en temps réel</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {stats.en_attente > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF3C7', color: '#D97706', padding: '7px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 500 }}>
                <Bell size={14} />
                {stats.en_attente} nouvelle{stats.en_attente > 1 ? 's' : ''} commande{stats.en_attente > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px clamp(20px,5vw,80px)' }}>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: Package,     label: 'Total commandes', value: stats.total,                  color: 'var(--rose-dark)',  bg: 'var(--rose-pale)' },
            { icon: Bell,        label: 'En attente',       value: stats.en_attente,             color: '#D97706',           bg: '#FEF3C7'          },
            { icon: Clock,       label: 'En cours',         value: stats.en_cours,               color: '#7C3AED',           bg: '#F5F3FF'          },
            { icon: CheckCircle, label: 'Livrées',          value: stats.livrees,                color: '#059669',           bg: '#D1FAE5'          },
            { icon: TrendingUp,  label: 'C.A. total',       value: `${stats.ca.toLocaleString()} DA`, color: 'var(--gold)', bg: '#FEF9EE'          },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} color={color} />
                </div>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={{ padding: '7px 16px', borderRadius: 'var(--radius-full)', fontSize: 12, border: `1px solid ${filter === 'all' ? 'var(--rose)' : 'var(--border)'}`, background: filter === 'all' ? 'var(--rose)' : 'white', color: filter === 'all' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', transition: 'all 0.2s' }}>
              Toutes ({orders.length})
            </button>
            {Object.entries(ORDER_STATUS).map(([key, { label, color, bg }]) => {
              const count = orders.filter(o => o.status === key).length
              return (
                <button key={key} onClick={() => setFilter(key)} style={{ padding: '7px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, border: `1px solid ${filter === key ? color : 'var(--border)'}`, background: filter === key ? bg : 'white', color: filter === key ? color : 'var(--ink-soft)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: filter === key ? 500 : 300 }}>
                  {label} ({count})
                </button>
              )
            })}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, commune, ID…" className="form-input" style={{ marginLeft: 'auto', width: 260 }} />
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>Aucune commande trouvée.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(order => (
              <AdminOrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminOrderRow({ order, onStatusChange }) {
  const [open, setOpen]     = useState(false)
  const [saving, setSaving] = useState(false)

  const nextStatus = ORDER_STATUS_FLOW[ORDER_STATUS_FLOW.indexOf(order.status) + 1]

  async function advance() {
    if (!nextStatus) return
    setSaving(true)
    await onStatusChange(order.id, nextStatus)
    setSaving(false)
  }

  async function cancel() {
    if (!window.confirm('Annuler cette commande ?')) return
    setSaving(true)
    await onStatusChange(order.id, 'annulee')
    setSaving(false)
  }

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: `1px solid ${order.status === 'en_attente' ? '#FCD34D' : 'var(--border)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>

      {/* Main row */}
      <div onClick={() => setOpen(v => !v)} style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 16, alignItems: 'center', cursor: 'pointer' }}>

        <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
          #{order.id.slice(0, 8)}
        </div>

        <div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{order.nom_client}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
            📍 {order.commune} · 📅 {order.deadline} · 📞 {order.tel}
          </div>
        </div>

        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--rose-dark)' }}>{order.total?.toLocaleString()} DA</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{order.items?.length} article{order.items?.length > 1 ? 's' : ''}</div>
        </div>

        <OrderStatusBadge status={order.status} />

        <div style={{ fontSize: 12, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
          {new Date(order.created_at).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: '#FAFAFA', animation: 'fadeUp 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>

            {/* Items */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Produits commandés</div>
              {order.items?.map((it, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--ink-muted)', padding: '4px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{it.nom} × {it.quantite} — <em>{it.garniture}</em></span>
                  <span style={{ color: 'var(--rose-dark)' }}>{(it.prix_unitaire * it.quantite).toLocaleString()} DA</span>
                </div>
              ))}
              {order.notes && (
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-muted)', background: '#FEF9EE', padding: '8px 12px', borderRadius: 6, borderLeft: '3px solid var(--gold)' }}>
                  💬 <strong>Note client :</strong> {order.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Actions</div>

              {order.status !== 'livree' && order.status !== 'annulee' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Status selector */}
                  <div>
                    <label className="form-label">Changer le statut</label>
                    <select
                      value={order.status}
                      onChange={e => onStatusChange(order.id, e.target.value)}
                      className="form-input"
                      style={{ fontSize: 13 }}
                    >
                      {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {nextStatus && (
                    <button onClick={advance} disabled={saving} className="btn btn-primary" style={{ justifyContent: 'center', fontSize: 13 }}>
                      {saving ? '…' : `Passer à : ${ORDER_STATUS[nextStatus]?.label} →`}
                    </button>
                  )}

                  <button onClick={cancel} disabled={saving} className="btn btn-danger" style={{ justifyContent: 'center', fontSize: 13 }}>
                    Annuler la commande
                  </button>
                </div>
              )}

              {(order.status === 'livree' || order.status === 'annulee') && (
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', padding: '12px', background: 'white', borderRadius: 8, border: '1px solid var(--border)' }}>
                  Commande terminée — aucune action possible.
                </div>
              )}

              {/* Contact client */}
              <a href={`tel:${order.tel}`} className="btn btn-outline" style={{ marginTop: 8, justifyContent: 'center', fontSize: 13, display: 'flex' }}>
                📞 Appeler {order.nom_client}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

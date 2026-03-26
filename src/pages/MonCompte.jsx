import { useState } from 'react'
import { LogOut, User, Package, Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useMyOrders } from '../hooks/useOrders'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { ORDER_STATUS_FLOW, ORDER_STATUS } from '../lib/constants'

export default function MonCompte() {
  const { user, profile, signOut, updateProfile } = useAuth()
  const { orders, loading } = useMyOrders()
  const [tab, setTab]         = useState('commandes')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState(null)

  function startEdit() {
    setForm({ nom: profile?.nom || '', tel: profile?.tel || '', adresse: profile?.adresse || '', commune: profile?.commune || '' })
    setEditing(true)
  }

  async function saveProfile() {
    setSaving(true)
    const { error } = await updateProfile(form)
    setSaving(false)
    if (error) { toast.error('Erreur lors de la sauvegarde'); return }
    toast.success('Profil mis à jour !')
    setEditing(false)
  }

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '40px 0 28px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--rose-pale)', border: '2px solid var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {(profile?.nom || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24 }}>
                {profile?.nom || 'Mon compte'}
              </h1>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={signOut} className="btn btn-ghost" style={{ gap: 6 }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="container" style={{ display: 'flex', gap: 0, marginTop: 20 }}>
          {[['commandes','Mes commandes', Package],['profil','Mon profil', User]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '10px 20px',
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: `2px solid ${tab === key ? 'var(--rose)' : 'transparent'}`,
              color: tab === key ? 'var(--rose-dark)' : 'var(--ink-muted)',
              fontWeight: tab === key ? 500 : 300, fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
            }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '36px clamp(20px,5vw,80px)' }}>

        {/* ── TAB: Commandes ── */}
        {tab === 'commandes' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 24 }}>
              Mes commandes <span style={{ fontSize: 14, color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif' }}>({orders.length})</span>
            </h2>

            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <p>Aucune commande pour l'instant.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Profil ── */}
        {tab === 'profil' && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22 }}>Mon profil</h2>
              {!editing ? (
                <button onClick={startEdit} className="btn btn-outline" style={{ gap: 6 }}>
                  <Edit3 size={14} /> Modifier
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditing(false)} className="btn btn-ghost"><X size={14} /> Annuler</button>
                  <button onClick={saveProfile} disabled={saving} className="btn btn-primary" style={{ gap: 6 }}>
                    <Save size={14} /> {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              )}
            </div>

            <div className="card card-padded" style={{ padding: '24px' }}>
              {[['nom','Nom complet'],['tel','Téléphone'],['adresse','Adresse'],['commune','Commune']].map(([k, l]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  {editing ? (
                    <input value={form[k]} onChange={e => upd(k, e.target.value)} className="form-input" />
                  ) : (
                    <div style={{ padding: '10px 14px', background: 'var(--rose-pale)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: profile?.[k] ? 'var(--ink)' : 'var(--ink-muted)' }}>
                      {profile?.[k] || '—'}
                    </div>
                  )}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ padding: '10px 14px', background: 'var(--rose-pale)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--ink-muted)' }}>
                  {user?.email} <span style={{ fontSize: 11 }}>(non modifiable)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  const stepIndex = ORDER_STATUS_FLOW.indexOf(order.status)

  return (
    <div className="card" style={{ border: `1px solid ${open ? 'var(--rose)' : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
      {/* Header row */}
      <div onClick={() => setOpen(v => !v)} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <OrderStatusBadge status={order.status} />
            <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              {new Date(order.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15 }}>
            {order.items?.length} article{order.items?.length > 1 ? 's' : ''} · {order.total?.toLocaleString()} DA
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontFamily: 'monospace' }}>
          #{order.id.slice(0, 8)}…
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', animation: 'fadeUp 0.2s ease' }}>

          {/* Tracker */}
          {order.status !== 'annulee' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Suivi de livraison</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
                {ORDER_STATUS_FLOW.map((s, i) => {
                  const done = i <= stepIndex
                  const current = i === stepIndex
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? 'var(--rose)' : 'white', border: `2px solid ${done ? 'var(--rose)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: done ? 'white' : 'var(--ink-muted)', boxShadow: current ? '0 0 0 3px var(--rose-light)' : 'none' }}>
                          {done && i < stepIndex ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: 9, color: done ? 'var(--rose-dark)' : 'var(--ink-muted)', maxWidth: 56, textAlign: 'center', lineHeight: 1.3 }}>{ORDER_STATUS[s]?.label}</span>
                      </div>
                      {i < ORDER_STATUS_FLOW.length - 1 && (
                        <div style={{ height: 2, width: 32, background: i < stepIndex ? 'var(--rose)' : 'var(--border)', marginBottom: 20, flexShrink: 0 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Items list */}
          <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            {order.items?.map((it, i) => (
              <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{it.nom} × {it.quantite} — {it.garniture}</span>
                <span style={{ color: 'var(--rose-dark)' }}>{(it.prix_unitaire * it.quantite).toLocaleString()} DA</span>
              </div>
            ))}
            <div style={{ padding: '8px 0', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
              <span>Total</span>
              <span style={{ color: 'var(--rose-dark)', fontFamily: 'Playfair Display, serif', fontSize: 16 }}>{order.total?.toLocaleString()} DA</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 8 }}>
            📅 Livraison souhaitée : <strong>{order.deadline}</strong> · 📍 {order.commune}
          </div>
        </div>
      )}
    </div>
  )
}

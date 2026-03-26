import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../hooks/useOrders'
import { LIVRAISON_ZONES } from '../lib/constants'

const STEPS = ['Panier', 'Informations', 'Confirmation']

/* ── Scroll picker (même que CartDrawer) ── */
function QuantityScroller({ value, onChange, min = 1, max = 100 }) {
  const [dragging, setDragging] = useState(false)
  const [startY, setStartY]     = useState(0)
  const [startVal, setStartVal] = useState(value)

  const clamp = (v) => Math.min(max, Math.max(min, v))

  function onTouchStart(e) { setDragging(true); setStartY(e.touches[0].clientY); setStartVal(value) }
  function onTouchMove(e) {
    if (!dragging) return
    onChange(clamp(startVal + Math.round((startY - e.touches[0].clientY) / 28)))
  }
  function onTouchEnd() { setDragging(false) }
  function onMouseDown(e) { setDragging(true); setStartY(e.clientY); setStartVal(value); e.preventDefault() }
  function onMouseMove(e) {
    if (!dragging) return
    onChange(clamp(startVal + Math.round((startY - e.clientY) / 28)))
  }
  function onMouseUp() { setDragging(false) }

  const canDec = value > min
  const canInc = value < max

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}
      onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    >
      <button onClick={() => onChange(clamp(value + 1))} disabled={!canInc} style={{ background: 'none', border: 'none', cursor: canInc ? 'pointer' : 'default', color: canInc ? 'var(--rose-dark)' : 'var(--border)', padding: '2px 8px' }}>
        <ChevronUp size={14} />
      </button>

      <div
        style={{ width: 52, height: 80, overflow: 'hidden', position: 'relative', cursor: dragging ? 'grabbing' : 'grab' }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to bottom, white 0%, transparent 35%, transparent 65%, white 100%)' }} />
        <div style={{ position: 'absolute', left: 6, right: 6, top: '50%', transform: 'translateY(-50%)', height: 28, borderRadius: 8, background: 'var(--rose-pale)', border: '1px solid var(--border-strong)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 15, color: 'var(--ink-muted)', opacity: 0.4 }}>
            {canInc ? clamp(value + 1) : ''}
          </div>
          <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--rose-dark)' }}>
            {value}
          </div>
          <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 15, color: 'var(--ink-muted)', opacity: 0.4 }}>
            {canDec ? clamp(value - 1) : ''}
          </div>
        </div>
      </div>

      <button onClick={() => onChange(clamp(value - 1))} disabled={!canDec} style={{ background: 'none', border: 'none', cursor: canDec ? 'pointer' : 'default', color: canDec ? 'var(--rose-dark)' : 'var(--border)', padding: '2px 8px' }}>
        <ChevronDown size={14} />
      </button>
    </div>
  )
}

/* ── Ligne article avec confirmation suppression ── */
function OrderItem({ item, onQuantityChange, onRemove }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div style={{
      background: confirmDelete ? '#FFF5F5' : 'white',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${confirmDelete ? '#FECACA' : 'var(--border)'}`,
      overflow: 'hidden',
      transition: 'all 0.25s ease',
      marginBottom: 10,
    }}>

      {/* Vue normale */}
      {!confirmDelete && (
        <div style={{ padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>

          {/* Emoji */}
          <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', background: 'var(--rose-pale)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
            🍪
          </div>

          {/* Infos */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--ink)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.halwa.nom}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>
              {item.garniture}
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: 'var(--rose-dark)' }}>
              {(item.halwa.prix * item.quantite).toLocaleString()} DA
              {item.quantite > 1 && (
                <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif', marginLeft: 5 }}>
                  ({item.halwa.prix.toLocaleString()} × {item.quantite})
                </span>
              )}
            </div>
          </div>

          {/* Scroll quantité */}
          <QuantityScroller
            value={item.quantite}
            onChange={(v) => onQuantityChange(item.key, v)}
          />

          {/* Supprimer */}
          <button
            onClick={() => setConfirmDelete(true)}
            title="Supprimer"
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              border: '1px solid var(--border)', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--ink-muted)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#FECACA'; e.currentTarget.style.color = '#DC2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-muted)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div style={{ padding: '16px 18px', animation: 'fadeUp 0.18s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trash2 size={16} color="#DC2626" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Supprimer cet article ?</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{item.halwa.nom} — {item.garniture}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'white', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--rose-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              Annuler
            </button>
            <button onClick={() => onRemove(item.key)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-full)', border: 'none', background: '#DC2626', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'white', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}>
              Oui, supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Page principale ── */
export default function Commande() {
  const [step, setStep]     = useState(0)
  const [done, setDone]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ nom: '', tel: '', adresse: '', commune: '', deadline: '', notes: '' })

  const { items, removeItem, updateQuantite, total, clearCart } = useCart()
  const { user, profile } = useAuth()

  // Pré-remplir depuis le profil
  useState(() => {
    if (profile) setForm(f => ({
      ...f,
      nom:      profile.nom      || '',
      tel:      profile.tel      || '',
      adresse:  profile.adresse  || '',
      commune:  profile.commune  || '',
    }))
  }, [profile])

  const fraisLivraison = () => {
    const zone = LIVRAISON_ZONES.find(z =>
      z.communes.toLowerCase().includes(form.commune.toLowerCase())
    )
    return zone ? zone.prix : 300
  }

  const totalFinal = total + (step >= 1 && form.commune ? fraisLivraison() : 0)

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function validateStep0() {
    if (items.length === 0) { toast.error('Votre panier est vide'); return false }
    return true
  }

  function validateStep1() {
    const required = ['nom', 'tel', 'adresse', 'commune', 'deadline']
    for (const k of required) {
      if (!form[k].trim()) { toast.error(`Le champ « ${k} » est requis`); return false }
    }
    const minDate = new Date(); minDate.setDate(minDate.getDate() + 2)
    if (new Date(form.deadline) < minDate) {
      toast.error('La date doit être au moins 48h dans le futur'); return false
    }
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    const orderData = {
      user_id:    user?.id || null,
      nom_client: form.nom,
      tel:        form.tel,
      adresse:    form.adresse,
      commune:    form.commune,
      deadline:   form.deadline,
      notes:      form.notes,
      items: items.map(i => ({
        halwa_id:      i.halwa.id,
        nom:           i.halwa.nom,
        garniture:     i.garniture,
        quantite:      i.quantite,
        prix_unitaire: i.halwa.prix,
      })),
      total:  totalFinal,
      status: 'en_attente',
    }
    const { data, error } = await createOrder(orderData)
    setLoading(false)
    if (error) { toast.error('Erreur lors de la commande. Réessayez.'); return }
    clearCart()
    setDone(data)
  }

  /* ── Écran succès ── */
  if (done) return (
    <div style={{ paddingTop: 72, minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--rose-pale)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 360, height: 300, borderRadius: '50%', background: 'rgba(242,167,187,0.2)', filter: 'blur(60px)', bottom: 0, left: 0 }} />
        <div style={{ position: 'absolute', width: 280, height: 240, borderRadius: '50%', background: 'rgba(242,167,187,0.15)', filter: 'blur(50px)', top: 0, right: 0 }} />
      </div>
      <div className="card animate-fadeUp" style={{ maxWidth: 500, width: '90%', padding: '48px 40px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--rose-pale)', border: '2px solid var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>🎀</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--rose-dark)', marginBottom: 12 }}>Commande reçue !</h2>
        <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.8, marginBottom: 8 }}>
          Merci <strong>{done.nom_client}</strong> ! Votre commande a bien été enregistrée.
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 28 }}>
          Nous vous contactons sous <strong>24h</strong> pour confirmer et organiser la livraison.
        </p>
        <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Référence commande</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--ink)', wordBreak: 'break-all' }}>{done.id}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {user && <Link to="/compte" className="btn btn-outline">Mes commandes</Link>}
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: 72, background: 'var(--rose-pale)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: 'clamp(32px,5vw,48px) clamp(16px,5vw,80px)', maxWidth: 780 }}>

        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-label">Passer une commande</div>
          <h1 className="section-title">Votre <em>commande</em></h1>
        </div>

        {/* Indicateur d'étapes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step >= i ? 'var(--rose)' : 'white',
                  border: `2px solid ${step >= i ? 'var(--rose)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: step >= i ? 'white' : 'var(--ink-muted)', fontSize: 14,
                  transition: 'all 0.3s',
                }}>
                  {step > i ? <Check size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, color: step === i ? 'var(--rose-dark)' : 'var(--ink-muted)', fontWeight: step === i ? 500 : 300, whiteSpace: 'nowrap' }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height: 2, width: 'clamp(32px,6vw,80px)', background: step > i ? 'var(--rose)' : 'var(--border)', marginBottom: 24, transition: 'background 0.4s' }} />
              )}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 'clamp(20px,4vw,32px)' }}>

          {/* ── ÉTAPE 0 : Panier ── */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22 }}>Votre panier</h2>
                {items.length > 0 && (
                  <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                    {items.reduce((s, i) => s + i.quantite, 0)} article{items.reduce((s, i) => s + i.quantite, 0) > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>🧺</div>
                  <p style={{ color: 'var(--ink-muted)', marginBottom: 20 }}>Votre panier est vide</p>
                  <Link to="/halwas" className="btn btn-primary">Voir nos halwas</Link>
                </div>
              ) : (
                <>
                  {/* Liste articles avec scroller + suppression */}
                  {items.map(item => (
                    <OrderItem
                      key={item.key}
                      item={item}
                      onQuantityChange={updateQuantite}
                      onRemove={removeItem}
                    />
                  ))}

                  {/* Séparateur + total */}
                  <div style={{ borderTop: '2px solid var(--border-strong)', paddingTop: 16, marginTop: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>Sous-total produits</span>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--rose-dark)' }}>
                        {total.toLocaleString()} DA
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                      + frais de livraison calculés à l'étape suivante
                    </p>
                  </div>

                  <button
                    onClick={() => { if (validateStep0()) setStep(1) }}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 20, fontSize: 15, padding: '14px' }}
                  >
                    Continuer <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── ÉTAPE 1 : Informations ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 24 }}>Vos informations</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 14 }}>
                {[['nom','Nom complet','Votre nom'],['tel','Téléphone','06 XX XX XX XX']].map(([k,l,ph]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{l} *</label>
                    <input value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={ph} className="form-input" />
                  </div>
                ))}
              </div>

              {[
                ['adresse',  'Adresse complète',               'Numéro, rue, quartier'],
                ['commune',  'Commune',                         'Ex : Hydra, Kouba…'],
                ['deadline', 'Date souhaitée (min. 48h)',       ''],
              ].map(([k,l,ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l} *</label>
                  <input
                    value={form[k]} onChange={e => upd(k, e.target.value)}
                    placeholder={ph} className="form-input"
                    type={k === 'deadline' ? 'date' : 'text'}
                    min={k === 'deadline' ? new Date(Date.now() + 172800000).toISOString().split('T')[0] : undefined}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Notes (optionnel)</label>
                <textarea value={form.notes} onChange={e => upd('notes', e.target.value)} placeholder="Allergies, instructions spéciales…" rows={3} className="form-input" style={{ resize: 'vertical' }} />
              </div>

              {/* Estimation livraison */}
              {form.commune && (
                <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--ink-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🚚 Livraison estimée — <strong>{form.commune}</strong></span>
                  <strong style={{ color: 'var(--rose-dark)' }}>{fraisLivraison()} DA</strong>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(0)} className="btn btn-outline" style={{ flex: 1 }}>← Retour</button>
                <button onClick={() => { if (validateStep1()) setStep(2) }} className="btn btn-primary" style={{ flex: 2 }}>
                  Confirmer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 : Récapitulatif ── */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 20 }}>Récapitulatif</h2>

              {/* Produits */}
              <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: 14 }}>
                <div style={{ fontWeight: 500, marginBottom: 12, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                  📦 Produits
                </div>
                {items.map(it => (
                  <div key={it.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: 'var(--ink-muted)', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>
                      {it.halwa.nom}
                      <span style={{ fontSize: 12, marginLeft: 6, color: 'var(--ink-muted)' }}>× {it.quantite}</span>
                      <span style={{ fontSize: 11, color: 'var(--ink-muted)', display: 'block' }}>{it.garniture}</span>
                    </span>
                    <strong style={{ color: 'var(--rose-dark)', fontFamily: 'Playfair Display, serif', fontSize: 15, whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {(it.halwa.prix * it.quantite).toLocaleString()} DA
                    </strong>
                  </div>
                ))}
              </div>

              {/* Infos client */}
              <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: 14 }}>
                <div style={{ fontWeight: 500, marginBottom: 12, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                  👤 Informations
                </div>
                {[['Nom', form.nom],['Téléphone', form.tel],['Adresse', form.adresse],['Commune', form.commune],['Date souhaitée', form.deadline],form.notes && ['Notes', form.notes]].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ fontSize: 13, color: 'var(--ink-muted)', padding: '4px 0', display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--ink-soft)', fontWeight: 500, minWidth: 120, flexShrink: 0 }}>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ borderTop: '2px solid var(--border-strong)', paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-muted)', marginBottom: 4 }}>
                  <span>Produits</span><span>{total.toLocaleString()} DA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-muted)', marginBottom: 12 }}>
                  <span>Livraison ({form.commune})</span><span>{fraisLivraison()} DA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>Total</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--rose-dark)' }}>
                    {totalFinal.toLocaleString()} DA
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>← Modifier</button>
                <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 2, background: 'var(--rose-deep)', justifyContent: 'center' }}>
                  {loading ? 'Envoi…' : '🎀 Valider la commande'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
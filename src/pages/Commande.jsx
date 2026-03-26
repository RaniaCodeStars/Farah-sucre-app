import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../hooks/useOrders'
import { LIVRAISON_ZONES } from '../lib/constants'

const STEPS = ['Panier', 'Informations', 'Confirmation']

export default function Commande() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', tel: '', adresse: '', commune: '', deadline: '', notes: '' })
  const { items, removeItem, updateQuantite, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  // Pre-fill from profile
  useState(() => {
    if (profile) setForm(f => ({
      ...f,
      nom: profile.nom || '',
      tel: profile.tel || '',
      adresse: profile.adresse || '',
      commune: profile.commune || '',
    }))
  }, [profile])

  const fraisLivraison = () => {
    const zone = LIVRAISON_ZONES.find(z =>
      z.communes.toLowerCase().includes(form.commune.toLowerCase())
    )
    return zone ? zone.prix : 300
  }

  const totalFinal = total + (step >= 1 && form.commune ? fraisLivraison() : 0)

  function upd(k, v) { setForm(f => ({ ...f, [k]: v })) }

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
      user_id: user?.id || null,
      nom_client: form.nom,
      tel: form.tel,
      adresse: form.adresse,
      commune: form.commune,
      deadline: form.deadline,
      notes: form.notes,
      items: items.map(i => ({
        halwa_id: i.halwa.id,
        nom: i.halwa.nom,
        garniture: i.garniture,
        quantite: i.quantite,
        prix_unitaire: i.halwa.prix,
      })),
      total: totalFinal,
      status: 'en_attente',
    }

    const { data, error } = await createOrder(orderData)
    setLoading(false)

    if (error) {
      toast.error('Erreur lors de la commande. Réessayez.')
      return
    }

    clearCart()
    setDone(data)
  }

  // ── Done screen ──
  if (done) return (
    <div style={{ paddingTop: 72, minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 360, height: 300, borderRadius: '50%', background: 'rgba(242,167,187,0.18)', filter: 'blur(60px)', bottom: 0, left: 0 }} />
        <div style={{ position: 'absolute', width: 280, height: 240, borderRadius: '50%', background: 'rgba(242,167,187,0.13)', filter: 'blur(50px)', top: 0, right: 0 }} />
      </div>
      <div className="card card-padded animate-fadeUp" style={{ maxWidth: 500, width: '90%', textAlign: 'center', padding: '48px 40px', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--rose-pale)', border: '2px solid var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>🎀</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--rose-dark)', marginBottom: 12 }}>
          Commande reçue !
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.8, marginBottom: 8 }}>
          Merci <strong>{done.nom_client}</strong> ! Votre commande a bien été enregistrée.
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 28 }}>
          Nous vous contactons sous <strong>24h</strong> pour confirmer et organiser la livraison.
        </p>
        <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>Référence commande</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--ink)', wordBreak: 'break-all' }}>{done.id}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {user && (
            <Link to="/compte" className="btn btn-outline">Mes commandes</Link>
          )}
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: 72, background: 'var(--rose-pale)', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: 72, left: 0, right: 0, height: 1, background: 'linear-gradient(to right,transparent,var(--rose-light),transparent)' }} />

      <div className="container" style={{ padding: '48px clamp(20px,5vw,80px)', maxWidth: 780 }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="section-label">Passer une commande</div>
          <h1 className="section-title">Votre <em>commande</em></h1>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step > i ? 'var(--rose)' : step === i ? 'var(--rose)' : 'white',
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
                <div style={{ height: 2, width: 60, background: step > i ? 'var(--rose)' : 'var(--border)', marginBottom: 24, transition: 'background 0.4s' }} />
              )}
            </div>
          ))}
        </div>

        <div className="card card-padded" style={{ padding: '32px' }}>

          {/* ── STEP 0: Cart ── */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 20 }}>Votre panier</h2>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🧺</div>
                  <p style={{ color: 'var(--ink-muted)', marginBottom: 16 }}>Votre panier est vide</p>
                  <Link to="/halwas" className="btn btn-primary">Voir nos halwas</Link>
                </div>
              ) : (
                <>
                  {items.map(item => (
                    <div key={item.key} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', background: 'var(--rose-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🍪</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16 }}>{item.halwa.nom}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{item.garniture}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          {[-1, null, 1].map((d, idx) => d === null
                            ? <span key="q" style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: 'center' }}>{item.quantite}</span>
                            : <button key={d} onClick={() => updateQuantite(item.key, item.quantite + d)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>{d > 0 ? '+' : '−'}</button>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--rose-dark)' }}>{(item.halwa.prix * item.quantite).toLocaleString()} DA</div>
                        <button onClick={() => removeItem(item.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <Trash2 size={12} /> Retirer
                        </button>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid var(--border-strong)', marginTop: 8 }}>
                    <span style={{ fontWeight: 500 }}>Sous-total produits</span>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--rose-dark)' }}>{total.toLocaleString()} DA</span>
                  </div>

                  <button onClick={() => { if (validateStep0()) setStep(1) }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, fontSize: 15, padding: '14px' }}>
                    Continuer <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP 1: Form ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 24 }}>Vos informations</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 0 }}>
                {[['nom','Nom complet','Votre nom'],['tel','Téléphone','06 XX XX XX XX']].map(([k, l, ph]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{l} *</label>
                    <input value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={ph} className="form-input" />
                  </div>
                ))}
              </div>
              {[['adresse','Adresse complète','Numéro, rue, quartier'],['commune','Commune','Ex: Hydra, Kouba…'],['deadline','Date souhaitée (min. 48h)','']].map(([k, l, ph]) => (
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

              {/* Livraison estimate */}
              {form.commune && (
                <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--ink-muted)' }}>
                  🚚 Frais de livraison estimés pour <strong>{form.commune}</strong> : <strong style={{ color: 'var(--rose-dark)' }}>{fraisLivraison()} DA</strong>
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

          {/* ── STEP 2: Recap + Submit ── */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 20 }}>Récapitulatif</h2>

              {/* Products */}
              <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 10 }}>📦 Produits</div>
                {items.map(it => (
                  <div key={it.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-muted)', padding: '4px 0' }}>
                    <span>{it.halwa.nom} × {it.quantite} — {it.garniture}</span>
                    <strong style={{ color: 'var(--rose-dark)' }}>{(it.halwa.prix * it.quantite).toLocaleString()} DA</strong>
                  </div>
                ))}
              </div>

              {/* Client info */}
              <div style={{ background: 'var(--rose-pale)', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 10 }}>👤 Informations</div>
                {[['Nom', form.nom],['Téléphone', form.tel],['Adresse', form.adresse],['Commune', form.commune],['Date souhaitée', form.deadline],form.notes && ['Notes', form.notes]].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ fontSize: 13, color: 'var(--ink-muted)', padding: '3px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--ink-soft)', fontWeight: 500, minWidth: 110 }}>{k}</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                  <span style={{ fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--rose-dark)' }}>{totalFinal.toLocaleString()} DA</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>← Modifier</button>
                <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 2, background: 'var(--rose-deep)' }}>
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

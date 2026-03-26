import { useState, useEffect } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Avis() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ note: 5, texte: '', nom_auteur: '', commune: '' })
  const [submitting, setSubmitting] = useState(false)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    if (profile) setForm(f => ({ ...f, nom_auteur: profile.nom || '', commune: profile.commune || '' }))
  }, [profile])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('visible', true)
      .order('likes', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  async function submitReview() {
    if (!form.texte.trim() || !form.nom_auteur.trim()) {
      toast.error('Nom et commentaire requis')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert([{
      ...form,
      user_id: user?.id || null,
    }])
    setSubmitting(false)
    if (error) { toast.error('Erreur lors de l\'envoi'); return }
    toast.success('Merci pour votre avis !')
    setShowForm(false)
    setForm({ note: 5, texte: '', nom_auteur: profile?.nom || '', commune: profile?.commune || '' })
    fetchReviews()
  }

  async function likeReview(review) {
    await supabase.from('reviews').update({ likes: review.likes + 1 }).eq('id', review.id)
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, likes: r.likes + 1 } : r))
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.note, 0) / reviews.length).toFixed(1) : '—'

  return (
    <div style={{ paddingTop: 72 }}>

      {/* Dark header section */}
      <section style={{ background: 'var(--ink)', padding: '72px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', fontFamily: 'Playfair Display, serif', fontSize: 280, color: 'rgba(242,167,187,0.04)', top: -60, left: -10, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>"</div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--rose-light)', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 14 }}>
                <span style={{ width: 22, height: 1, background: 'var(--rose-light)', display: 'inline-block' }} />
                Ce que disent nos clients
                <span style={{ width: 22, height: 1, background: 'var(--rose-light)', display: 'inline-block' }} />
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 400, color: 'white', marginBottom: 8 }}>
                Ils ont adoré nos <em style={{ color: 'var(--rose)' }}>halwas</em>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />)}
                </div>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--gold)' }}>{avg}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>sur {reviews.length} avis</span>
              </div>
            </div>
            <button onClick={() => setShowForm(v => !v)} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              ✏️ Laisser un avis
            </button>
          </div>

          {/* Leave review form */}
          {showForm && (
            <div style={{ marginTop: 28, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(242,167,187,0.2)', borderRadius: 'var(--radius-lg)', padding: '24px', animation: 'fadeUp 0.3s ease' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'white', marginBottom: 20 }}>Votre avis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Nom *</label>
                  <input value={form.nom_auteur} onChange={e => setForm(f => ({ ...f, nom_auteur: e.target.value }))} className="form-input" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Commune</label>
                  <input value={form.commune} onChange={e => setForm(f => ({ ...f, commune: e.target.value }))} className="form-input" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Note</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <button key={i} onClick={() => setForm(f => ({ ...f, note: i }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                      <Star size={24} fill={i <= form.note ? 'var(--gold)' : 'none'} color="var(--gold)" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Votre commentaire *</label>
                <textarea value={form.texte} onChange={e => setForm(f => ({ ...f, texte: e.target.value }))} rows={3} className="form-input" placeholder="Partagez votre expérience…" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'white', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowForm(false)} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>Annuler</button>
                <button onClick={submitReview} disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Envoi…' : 'Publier mon avis'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews grid */}
      <section style={{ background: 'var(--ink)', padding: '0 0 80px' }}>
        <div className="container">
          {loading ? (
            <div className="page-loader" style={{ paddingTop: 40 }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 2 }}>
              {reviews.map(review => (
                <div key={review.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,167,187,0.12)', padding: '28px', position: 'relative', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(242,167,187,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(242,167,187,0.12)' }}>

                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= review.note ? 'var(--gold)' : 'none'} color="var(--gold)" />)}
                  </div>

                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', marginBottom: 22 }}>
                    "{review.texte}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'white' }}>
                        {review.nom_auteur[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{review.nom_auteur}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                          {review.commune} · {new Date(review.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <button onClick={() => likeReview(review)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', padding: '5px 12px', fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.color = 'var(--rose)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                      <ThumbsUp size={12} /> {review.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode]         = useState('login') // 'login' | 'signup'
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({ nom: '', email: '', password: '' })
  const { signIn, signUp }      = useAuth()
  const navigate                = useNavigate()
  const location                = useLocation()

  const from = location.state?.from || '/'
  const upd  = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn({ email: form.email, password: form.password })
      if (error) { toast.error(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message); setLoading(false); return }
      toast.success('Bienvenue !')
      navigate(from, { replace: true })
    } else {
      if (!form.nom.trim()) { toast.error('Le nom est requis'); setLoading(false); return }
      if (form.password.length < 6) { toast.error('Mot de passe trop court (min. 6 caractères)'); setLoading(false); return }
      const { error } = await signUp({ email: form.email, password: form.password, nom: form.nom })
      if (error) { toast.error(error.message); setLoading(false); return }
      toast.success('Compte créé ! Vérifiez votre email.')
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--rose-pale)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 360, height: 300, borderRadius: '50%', background: 'rgba(242,167,187,0.2)', filter: 'blur(60px)', bottom: 0, left: '-5%' }} />
        <div style={{ position: 'absolute', width: 280, height: 240, borderRadius: '50%', background: 'rgba(242,167,187,0.15)', filter: 'blur(50px)', top: '5%', right: '-3%' }} />
      </div>

      <div className="card animate-fadeUp" style={{ width: '90%', maxWidth: 420, padding: '40px 36px', position: 'relative', zIndex: 2 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🍰</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--rose-dark)', marginBottom: 4 }}>Farah Sucré</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créer un compte client'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'var(--rose-pale)', borderRadius: 'var(--radius-full)', padding: 4, marginBottom: 28 }}>
          {[['login','Se connecter'],['signup','S\'inscrire']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '9px', borderRadius: 'var(--radius-full)',
              border: 'none', fontSize: 13, fontWeight: 400, cursor: 'pointer',
              background: mode === m ? 'white' : 'transparent',
              color: mode === m ? 'var(--rose-dark)' : 'var(--ink-muted)',
              boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.25s',
            }}>{label}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <input value={form.nom} onChange={e => upd('nom', e.target.value)} placeholder="Votre nom" className="form-input" required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input value={form.email} onChange={e => upd('email', e.target.value)} type="email" placeholder="votre@email.com" className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Mot de passe *</label>
            <input
              value={form.password} onChange={e => upd('password', e.target.value)}
              type={showPwd ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'Min. 6 caractères' : '••••••••'}
              className="form-input" style={{ paddingRight: 44 }} required
            />
            <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, bottom: 11, background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer' }}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '13px', fontSize: 15 }}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-muted)', marginTop: 20 }}>
          Vous pouvez aussi{' '}
          <Link to="/commande" style={{ color: 'var(--rose-dark)', textDecoration: 'underline' }}>
            commander sans compte
          </Link>
        </p>
      </div>
    </div>
  )
}

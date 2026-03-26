import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const LINKS = [
  { to: '/',          label: 'Accueil'    },
  { to: '/halwas',    label: 'Nos Halwas' },
  { to: '/livraison', label: 'Livraison'  },
  { to: '/avis',      label: 'Avis'       },
  { to: '/contact',   label: 'Contact'    },
]

export default function Navbar({ onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const { count } = useCart()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: scrolled ? 60 : 72,
        background: scrolled ? 'rgba(255,250,248,0.97)' : 'rgba(255,250,248,0.90)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-strong)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,56px)',
        transition: 'all 0.3s ease',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
  <div style={{
    width: scrolled ? 42 : 50, // Un peu plus grand pour que le logo soit lisible
    height: scrolled ? 42 : 50,
    borderRadius: '50%',
    background: 'white', // Fond blanc pour faire ressortir le logo
    border: '1.5px solid var(--border-strong)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'hidden', // Pour que le logo ne dépasse pas du cercle
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
  }}>
    <img 
      src="/images/logoF.png" 
      alt="Farah Sucré Logo" 
      style={{ 
        width: '80%', // On laisse un peu de marge interne
        height: '80%', 
        objectFit: 'contain' 
      }} 
    />
  </div>
  
  <div>
    <div style={{
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600, 
      fontSize: scrolled ? 17 : 20,
      color: 'var(--rose-dark)', 
      lineHeight: 1.1,
      transition: 'all 0.3s',
    }}>
      Farah Sucré
    </div>
    <div style={{ 
      fontSize: 10, 
      letterSpacing: '0.18em', 
      color: 'var(--ink-muted)', 
      textTransform: 'uppercase',
      marginTop: 2
    }}>
      Votre meilleur choix
    </div>
  </div>
</Link>

        {/* Desktop links */}
        <ul className="hide-mobile" style={{ display: 'flex', gap: 28, listStyle: 'none', alignItems: 'center' }}>
          {LINKS.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <li key={to}>
                <Link to={to} style={{
                  fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: active ? 'var(--rose-dark)' : 'var(--ink-muted)',
                  fontWeight: active ? 500 : 300,
                  borderBottom: active ? '1.5px solid var(--rose-dark)' : '1.5px solid transparent',
                  paddingBottom: 2, transition: 'all 0.2s',
                }}>{label}</Link>
              </li>
            )
          })}
          {isAdmin && (
            <li>
              <Link to="/admin" style={{
                fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: location.pathname === '/admin' ? '#DC2626' : 'var(--ink-muted)',
                fontWeight: 500,
              }}>Admin ★</Link>
            </li>
          )}
        </ul>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Cart button */}
          <button onClick={onCartOpen} className="btn btn-ghost"
            style={{ position: 'relative', padding: '8px 12px' }}>
            <ShoppingBag size={20} />
            {count > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--rose)', color: 'white',
                width: 18, height: 18, borderRadius: '50%',
                fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="hide-mobile" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to="/compte" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>
                <User size={15} /> Mon compte
              </Link>
              <button onClick={signOut} className="btn btn-ghost" title="Se déconnecter">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary hide-mobile" style={{ padding: '9px 22px', fontSize: 13 }}>
              Se connecter
            </Link>
          )}

          {/* Commander CTA */}
          <Link to="/commande" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>
            Commander
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(v => !v)} className="btn btn-ghost hide-desktop"
            style={{ padding: '8px' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 190,
          background: 'rgba(45,31,39,0.4)',
        }} onClick={() => setMenuOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '72vw', maxWidth: 280,
            background: 'var(--cream)', padding: '80px 28px 28px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {LINKS.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '14px 12px',
                borderBottom: '1px solid var(--border)',
                fontSize: 15, color: 'var(--ink-soft)',
              }}>{label}</Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{ padding: '14px 12px', fontSize: 15, color: '#DC2626', fontWeight: 500 }}>
                Admin ★
              </Link>
            )}
            <div style={{ marginTop: 'auto' }}>
              {user ? (
                <>
                  <Link to="/compte" className="btn btn-outline" style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                    Mon compte
                  </Link>
                  <button onClick={signOut} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                    Se déconnecter
                  </button>
                </>
              ) : (
                <Link to="/auth" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

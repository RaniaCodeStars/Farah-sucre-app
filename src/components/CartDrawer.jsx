import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantite, total, count } = useCart()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(45,31,39,0.45)',
          animation: 'fadeIn 0.2s ease',
        }} />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
        width: '100%', maxWidth: 400,
        background: 'var(--cream)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(194,90,124,0.15)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="var(--rose-dark)" />
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20 }}>
              Mon panier
            </span>
            {count > 0 && (
              <span style={{
                background: 'var(--rose)', color: 'white',
                borderRadius: '50%', width: 22, height: 22,
                fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: 8 }}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧺</div>
              <p style={{ fontSize: 15, marginBottom: 6 }}>Votre panier est vide</p>
              <p style={{ fontSize: 13 }}>Explorez nos halwas !</p>
              <Link to="/halwas" onClick={onClose} className="btn btn-primary"
                style={{ marginTop: 20, display: 'inline-flex' }}>
                Voir nos halwas
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <div key={item.key} style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  padding: '14px 16px',
                  display: 'flex', gap: 12, alignItems: 'center',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                    background: 'var(--rose-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, flexShrink: 0,
                  }}>🍪</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, marginBottom: 2 }}>
                      {item.halwa.nom}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 6 }}>
                      {item.garniture}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQuantite(item.key, item.quantite - 1)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: 'center' }}>
                        {item.quantite}
                      </span>
                      <button onClick={() => updateQuantite(item.key, item.quantite + 1)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--rose-dark)' }}>
                      {(item.halwa.prix * item.quantite).toLocaleString()} DA
                    </div>
                    <button onClick={() => removeItem(item.key)}
                      style={{ fontSize: 12, color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 15, color: 'var(--ink-muted)' }}>Sous-total</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--rose-dark)' }}>
                {total.toLocaleString()} DA
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 12 }}>
              + frais de livraison calculés à la commande
            </p>
            <Link to="/commande" onClick={onClose} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}>
              Passer la commande →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

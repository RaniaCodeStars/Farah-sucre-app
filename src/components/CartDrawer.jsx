import { useState } from 'react'
import { X, ShoppingBag, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

/* ── Scroll picker vertical pour la quantité ── */
function QuantityScroller({ value, onChange, min = 1, max = 100 }) {
  const [dragging, setDragging] = useState(false)
  const [startY, setStartY]     = useState(0)
  const [startVal, setStartVal] = useState(value)

  function clamp(v) { return Math.min(max, Math.max(min, v)) }

  /* Touch drag */
  function onTouchStart(e) {
    setDragging(true)
    setStartY(e.touches[0].clientY)
    setStartVal(value)
  }
  function onTouchMove(e) {
    if (!dragging) return
    const dy    = startY - e.touches[0].clientY   // glisser vers le haut = +
    const delta = Math.round(dy / 28)             // 28px par unité
    onChange(clamp(startVal + delta))
  }
  function onTouchEnd() { setDragging(false) }

  /* Mouse drag (desktop) */
  function onMouseDown(e) {
    setDragging(true)
    setStartY(e.clientY)
    setStartVal(value)
    e.preventDefault()
  }
  function onMouseMove(e) {
    if (!dragging) return
    const dy    = startY - e.clientY
    const delta = Math.round(dy / 28)
    onChange(clamp(startVal + delta))
  }
  function onMouseUp() { setDragging(false) }

  const prev = clamp(value - 1)
  const next = clamp(value + 1)
  const canDec = value > min
  const canInc = value < max

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Flèche haut */}
      <button
        onClick={() => onChange(clamp(value + 1))}
        disabled={!canInc}
        style={{
          background: 'none', border: 'none', cursor: canInc ? 'pointer' : 'default',
          color: canInc ? 'var(--rose-dark)' : 'var(--border)',
          padding: '2px 8px', lineHeight: 1,
          transition: 'color 0.15s',
        }}
      >
        <ChevronUp size={14} />
      </button>

      {/* Tambour */}
      <div
        style={{
          width: 52, height: 80,
          overflow: 'hidden',
          position: 'relative',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        {/* Dégradé haut/bas pour l'effet tambour */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, white 0%, transparent 35%, transparent 65%, white 100%)',
        }} />

        {/* Ligne de sélection */}
        <div style={{
          position: 'absolute', left: 6, right: 6, top: '50%',
          transform: 'translateY(-50%)',
          height: 28, borderRadius: 8,
          background: 'var(--rose-pale)',
          border: '1px solid var(--border-strong)',
          zIndex: 1,
        }} />

        {/* Chiffres : précédent, actuel, suivant */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 0,
        }}>
          {/* Précédent */}
          <div style={{
            height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif',
            fontSize: 15, color: 'var(--ink-muted)', opacity: 0.4,
            lineHeight: 1,
          }}>
            {canDec ? prev : ''}
          </div>

          {/* Valeur courante */}
          <div style={{
            height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif',
            fontSize: 20, fontWeight: 600, color: 'var(--rose-dark)',
            lineHeight: 1,
          }}>
            {value}
          </div>

          {/* Suivant */}
          <div style={{
            height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif',
            fontSize: 15, color: 'var(--ink-muted)', opacity: 0.4,
            lineHeight: 1,
          }}>
            {canInc ? next : ''}
          </div>
        </div>
      </div>

      {/* Flèche bas */}
      <button
        onClick={() => onChange(clamp(value - 1))}
        disabled={!canDec}
        style={{
          background: 'none', border: 'none', cursor: canDec ? 'pointer' : 'default',
          color: canDec ? 'var(--rose-dark)' : 'var(--border)',
          padding: '2px 8px', lineHeight: 1,
          transition: 'color 0.15s',
        }}
      >
        <ChevronDown size={14} />
      </button>
    </div>
  )
}

/* ── Ligne article avec confirmation suppression ── */
function CartItem({ item, onQuantityChange, onRemove }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleRemoveClick() {
    setConfirmDelete(true)
  }
  function handleConfirm() {
    onRemove(item.key)
  }
  function handleCancel() {
    setConfirmDelete(false)
  }

  return (
    <div style={{
      background: confirmDelete ? '#FFF5F5' : 'white',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${confirmDelete ? '#FECACA' : 'var(--border)'}`,
      overflow: 'hidden',
      transition: 'all 0.25s ease',
    }}>

      {/* Contenu normal */}
      {!confirmDelete && (
        <div style={{
          padding: '14px 16px',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          {/* Emoji produit */}
          <div style={{
            width: 52, height: 52, borderRadius: 'var(--radius-sm)',
            background: 'var(--rose-pale)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>🍪</div>

          {/* Infos */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 15, color: 'var(--ink)',
              marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.halwa.nom}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 6 }}>
              {item.garniture}
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: 'var(--rose-dark)' }}>
              {(item.halwa.prix * item.quantite).toLocaleString()} DA
              {item.quantite > 1 && (
                <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif', marginLeft: 4 }}>
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
          {/* Bouton supprimer */}
          <button
            onClick={handleRemoveClick}
            title="Supprimer"
            style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              border: '1px solid var(--border)',
              background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--ink-muted)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FEE2E2'
              e.currentTarget.style.borderColor = '#FECACA'
              e.currentTarget.style.color = '#DC2626'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--ink-muted)'
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div style={{
          padding: '16px 18px',
          animation: 'fadeUp 0.18s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Trash2 size={15} color="#DC2626" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                Supprimer cet article ?
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                {item.halwa.nom} — {item.garniture}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCancel}
              style={{
                flex: 1, padding: '9px', borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)', background: 'white',
                fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--rose-pale)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1, padding: '9px', borderRadius: 'var(--radius-full)',
                border: 'none', background: '#DC2626',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'white',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
            >
              Oui, supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Drawer principal ── */
export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantite, total, count, clearCart } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(45,31,39,0.45)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
        width: '100%', maxWidth: 420,
        background: 'var(--cream)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(194,90,124,0.15)',
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'white',
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

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Vider le panier */}
            {items.length > 0 && !confirmClear && (
              <button
                onClick={() => setConfirmClear(true)}
                style={{
                  fontSize: 12, color: 'var(--ink-muted)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 10px', borderRadius: 'var(--radius-full)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-muted)' }}
              >
                Tout vider
              </button>
            )}
            {confirmClear && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', animation: 'fadeIn 0.2s ease' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Vider le panier ?</span>
                <button onClick={() => { clearCart(); setConfirmClear(false) }} style={{ fontSize: 12, color: 'white', background: '#DC2626', border: 'none', borderRadius: 'var(--radius-full)', padding: '4px 12px', cursor: 'pointer' }}>Oui</button>
                <button onClick={() => setConfirmClear(false)} style={{ fontSize: 12, color: 'var(--ink-soft)', background: 'var(--rose-pale)', border: 'none', borderRadius: 'var(--radius-full)', padding: '4px 12px', cursor: 'pointer' }}>Non</button>
              </div>
            )}
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-muted)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose-pale)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Liste articles */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🧺</div>
              <p style={{ fontSize: 15, marginBottom: 6 }}>Votre panier est vide</p>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Explorez nos halwas !</p>
              <Link to="/halwas" onClick={onClose} className="btn btn-primary" style={{ display: 'inline-flex' }}>
                Voir nos halwas
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => (
                <CartItem
                  key={item.key}
                  item={item}
                  onQuantityChange={updateQuantite}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '18px 20px',
            borderTop: '1px solid var(--border)',
            background: 'white',
          }}>
            {/* Récap */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                {count} article{count > 1 ? 's' : ''}
              </span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--rose-dark)' }}>
                {total.toLocaleString()} DA
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 14 }}>
              + frais de livraison calculés à la commande
            </p>
            <Link
              to="/commande"
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}
            >
              Passer la commande →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
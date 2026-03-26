import { useState } from 'react'
import { ShoppingBag, Star } from 'lucide-react'
import { GARNITURES } from '../lib/constants'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'



export default function HalwaCard({ halwa }) {
  const [expanded, setExpanded]   = useState(false)
  const [garniture, setGarniture] = useState(GARNITURES[0])
  const { addItem } = useCart()

  

  function handleAdd(e) {
    e.stopPropagation()
    addItem(halwa, garniture)
    toast.success(`${halwa.nom} ajouté au panier !`, {
      icon: '🛒',
      style: { background: 'var(--rose-pale)', color: 'var(--ink)' },
    })
  }

  return (
    <div onClick={() => setExpanded(v => !v)} style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: `1.5px solid ${expanded ? 'var(--rose)' : 'var(--border)'}`,
      overflow: 'hidden',
      cursor: 'pointer',
      transform: expanded ? 'translateY(-4px)' : 'translateY(0)',
      boxShadow: expanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition: 'all 0.3s ease',
    }}>
      {/* Image area */}
      {/* Image area */}
      <div style={{
        height: '200px', // Hauteur fixe pour l'image
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#f5f5f5'
      }}>
      
        <img 
          src={halwa.image_url} 
          alt={halwa.nom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Pour que l'image remplisse bien le cadre sans se déformer
            transition: 'transform 0.5s ease',
            transform: expanded ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        
        {halwa.bestseller && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'var(--rose)', color: 'white',
            fontSize: 10, padding: '3px 10px',
            borderRadius: 'var(--radius-full)', fontWeight: 500,
            zIndex: 2
          }}>★ Bestseller</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />
          ))}
        </div>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, marginBottom: 4 }}>
          {halwa.nom}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 12 }}>
          {halwa.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--rose-dark)' }}>
            {halwa.prix.toLocaleString()} <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif' }}>DA/500g</span>
          </div>
          <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12 }}>
            <ShoppingBag size={13} /> Ajouter
          </button>
        </div>
      </div>

      {/* Expanded: garniture selector */}
      {expanded && (
        <div onClick={e => e.stopPropagation()} style={{
          padding: '12px 18px 18px',
          borderTop: '1px solid var(--border)',
          background: 'var(--rose-pale)',
          animation: 'fadeUp 0.2s ease',
        }}>
          <div className="form-label" style={{ marginBottom: 8 }}>Choisir la garniture</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {GARNITURES.map(g => (
              <button key={g} onClick={() => setGarniture(g)} style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                border: `1.5px solid ${garniture === g ? 'var(--rose)' : 'var(--border)'}`,
                background: garniture === g ? 'var(--rose)' : 'white',
                color: garniture === g ? 'white' : 'var(--ink-soft)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}>{g}</button>
            ))}
          </div>
          <button onClick={handleAdd} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <ShoppingBag size={15} /> Ajouter au panier — {garniture.split(' ')[0]}
          </button>
        </div>
      )}
    </div>
  )
}

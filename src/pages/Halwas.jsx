import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useHalwas } from '../hooks/useHalwas'
import HalwaCard from '../components/HalwaCard'
import { HALWA_TYPES } from '../lib/constants'

export default function Halwas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const activeType = searchParams.get('type') || 'all'

  const { halwas, loading } = useHalwas(activeType === 'all' ? null : activeType)

  const filtered = halwas.filter(h =>
    h.nom.toLowerCase().includes(search.toLowerCase()) ||
    h.description.toLowerCase().includes(search.toLowerCase())
  )

  function setType(t) {
    if (t === 'all') setSearchParams({})
    else setSearchParams({ type: t })
  }

  return (
    <div style={{ paddingTop: 72 }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '52px 0 40px' }}>
        <div className="container">
          <div className="section-label">Notre catalogue</div>
          <h1 className="section-title" style={{ marginBottom: 6 }}>
            Nos <em>halwas</em>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-muted)', maxWidth: 480 }}>
            Toutes nos créations artisanales, préparées à la commande avec des ingrédients de qualité.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px clamp(20px,5vw,80px)' }}>

        {/* Filters bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Type tabs */}
{/* Type tabs */}
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  {[
    { key: 'all', label: 'Tout voir', image: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }, // Icône pour "Tout"
    ...Object.entries(HALWA_TYPES).map(([k, v]) => ({ key: k, label: v.label, image: v.image }))
  ].map(({ key, label, image }) => (
    <button key={key} onClick={() => setType(key)} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 16px 6px 8px', // Moins de padding à gauche pour l'image
      borderRadius: 'var(--radius-full)',
      fontSize: 13, fontWeight: 500,
      border: `1.5px solid ${activeType === key ? 'var(--rose)' : 'var(--border)'}`,
      background: activeType === key ? 'var(--rose)' : 'white',
      color: activeType === key ? 'white' : 'var(--ink-soft)',
      transition: 'all 0.2s',
      cursor: 'pointer',
    }}>
      <img 
        src={image} 
        alt={label} 
        style={{ 
          width: 28, 
          height: 28, 
          borderRadius: '50%', 
          objectFit: 'cover',
          border: activeType === key ? '1.5px solid white' : 'none'
        }} 
      />
      {label}
    </button>
  ))}
</div>
          {/* Search */}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="form-input"
              style={{ paddingLeft: 36, width: 220 }}
            />
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 24 }}>
          {loading ? 'Chargement…' : `${filtered.length} halwa${filtered.length > 1 ? 's' : ''} trouvée${filtered.length > 1 ? 's' : ''}`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>Aucun résultat pour « {search} »</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
            {filtered.map(h => <HalwaCard key={h.id} halwa={h} />)}
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Package, Clock, MapPin } from 'lucide-react'
import { useBestsellers } from '../hooks/useHalwas'
import HalwaCard from '../components/HalwaCard'
import { HALWA_TYPES } from '../lib/constants'

function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    function calc() {
      const now = new Date()
      const end = new Date(); end.setHours(23, 59, 59, 0)
      const d = end - now
      setTime({ h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

export default function Home() {
  const [visible, setVisible] = useState(false)
  const { halwas, loading } = useBestsellers()
  const { h, m, s } = useCountdown()

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `all 0.7s ease ${delay}s`,
  })

  return (
    <div style={{ paddingTop: 72 }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Watercolor bg blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 360, height: 300, borderRadius: '50%', background: 'rgba(242,167,187,0.18)', filter: 'blur(60px)', bottom: '5%', left: '-5%' }} />
          <div style={{ position: 'absolute', width: 280, height: 240, borderRadius: '50%', background: 'rgba(242,167,187,0.13)', filter: 'blur(50px)', top: '5%', right: '-3%' }} />
          <div style={{ position: 'absolute', width: 200, height: 180, borderRadius: '50%', background: 'rgba(237,217,184,0.15)', filter: 'blur(40px)', top: '40%', right: '15%' }} />
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', width: '100%', position: 'relative', zIndex: 2 }}>

          {/* Left */}
          <div>
            <div style={{ ...anim(0), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(242,167,187,0.12)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 18px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rose)', display: 'inline-block' }} />
              <span style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--rose-dark)', padding: '0 8px', margin: '0 8px' }}>Pâtisserie orientale · Alger · Depuis 2019</span>
            </div>

            <h1 style={{ ...anim(0.12), fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px,5.5vw,72px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--ink)', marginBottom: 24 }}>
              Des halwas faites<br />
              <em style={{ color: 'var(--rose-dark)', fontStyle: 'italic' }}>avec amour</em>
            </h1>

            <p style={{ ...anim(0.24), fontSize: 16, lineHeight: 1.8, color: 'var(--ink-muted)', maxWidth: 420, marginBottom: 36 }}>
              Recettes transmises de mère en fille, ingrédients soigneusement sélectionnés. Commandez en ligne, livraison sur toute la wilaya d'Alger.
            </p>

            <div style={{ ...anim(0.36), display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link to="/halwas" className="btn btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
                Découvrir nos halwas <ArrowRight size={16} />
              </Link>
              <Link to="/commande" className="btn btn-outline" style={{ fontSize: 15, padding: '13px 28px' }}>
                Commander maintenant
              </Link>
            </div>

            {/* Stats */}
            <div style={{ ...anim(0.48), display: 'flex', gap: 36, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
              {[['40+','Sortes'], ['500+','Clients'], ['48h','Délai max'], ['★4.9','Moyenne']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--rose-dark)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — showcase card */}
          <div style={{ ...anim(0.18), position: 'relative' }}>
  <div className="card" style={{ padding: '32px 28px', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, var(--rose-light), var(--rose), var(--rose-deep))', borderRadius: '20px 20px 0 0' }} />
    
    {/* --- En-tête du Plateau Signature modernisé --- */}
<div style={{ 
  textAlign: 'center', 
  marginBottom: 28, // Un peu plus d'espace en bas
  position: 'relative',
  padding: '0 10px'
}}>
  
  {/* Icône animée moderne (SVG) au lieu de l'emoji */}
  <div style={{ 
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    background: 'white',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    boxShadow: '0 4px 12px rgba(242,167,187,0.15)',
    marginBottom: 16,
    position: 'relative',
    animation: 'shinyBadge 3s ease-in-out infinite' // Petite animation d'éclat
  }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  </div>

  {/* Titre avec effet dégradé "Or Rose" */}
  <h3 style={{ 
    fontFamily: 'Playfair Display, serif', 
    fontSize: 22, 
    fontWeight: 400,
    background: 'linear-gradient(135deg, var(--ink) 0%, var(--rose-dark) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'var(--ink)', // Fallback
    marginBottom: 4,
    letterSpacing: '-0.01em'
  }}>
    Plateau Signature
  </h3>

  {/* Sous-titre épuré */}
  <div style={{ 
    fontSize: 13, 
    color: 'var(--ink-muted)', 
    letterSpacing: '0.05em', 
    textTransform: 'uppercase', // Pour le côté moderne
    fontWeight: 300
  }}>
    Sélection du moment
  </div>

  {/* Petit trait de finition élégant */}
  <div style={{
    width: 40,
    height: 2,
    background: 'var(--gold)',
    margin: '12px auto 0',
    borderRadius: 'var(--radius-full)',
    opacity: 0.6
  }} />
</div>
    {/* Grille des photos de halwas */}
   <div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(4,1fr)', 
  gap: 12, 
  marginBottom: 20,
  padding: '10px 0' 
}}>
  {[
    '/images/baklawa.png', '/images/tabe3telya2.png', '/images/meshewek2.png', '/images/eidsable.png',
    '/images/makroutLouz2.png', '/images/k3ik3at.png', '/images/khokh2.png', '/images/bniwen2.png'
  ].map((imgSrc, i) => (
    <div 
      key={i} 
      className="halwa-floating-card"
      style={{ 
        background: 'white', 
        borderRadius: 15, 
        aspectRatio: '1', 
        overflow: 'hidden', 
        border: '1px solid var(--border)', 
        position: 'relative',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        // On décale l'animation pour chaque gâteau (0s, 0.5s, 1s...)
        animation: `floating 4s ease-in-out ${i * 0.4}s infinite` 
      }}
    >
      <img 
        src={imgSrc} 
        alt="Pâtisserie"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
        }} 
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) rotate(3deg)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      />
      
      {/* Petit reflet brillant qui passe en boucle */}
      <div className="shimmer-effect" />
    </div>
  ))}
</div>

    <Link to="/commande" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
      Commander maintenant
    </Link>
  </div>


            {/* Floating badge */}
            <div style={{ position: 'absolute', top: -14, right: -14, background: 'var(--rose-deep)', color: 'white', borderRadius: '50%', width: 68, height: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(224,122,153,0.45)', animation: 'pulse 2.5s ease-in-out infinite' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, lineHeight: 1 }}>-20%</span>
              <span style={{ fontSize: 9, opacity: 0.85 }}>ce mois</span>
            </div>
          </div>
            </div>

        {/* Mobile: stack vertically */}
        <style>{`
          @media(max-width:768px){
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-right { display: none !important; }
          }
        `}</style>
      </section>

     {/* ── OFFRE DE LA SEMAINE ── */}
<section style={{ background: 'white', padding: 'clamp(60px,8vw,100px) 0', position: 'relative' }}>
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right,transparent,var(--rose-light),transparent)' }} />
  <div className="container">

    {/* Header : titre + countdown empilés sur mobile, côte à côte sur desktop */}
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 'clamp(28px,4vw,48px)',
      flexWrap: 'wrap',
      gap: 20,
    }}>
      <div>
        <div className="section-label">Offre spéciale</div>
        <h2 className="section-title">Gâteau de <em>la semaine</em></h2>
      </div>

      {/* Countdown */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
          Se termine dans
        </div>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[['h', h], ['m', m], ['s', s]].map(([u, v], i) => (
            <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{
                background: 'var(--rose-pale)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '6px 10px',
                textAlign: 'center',
                minWidth: 48,
              }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px,4vw,32px)', lineHeight: 1, color: 'var(--ink)' }}>
                  {String(v).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 2 }}>
                  {u}
                </div>
              </div>
              {i < 2 && (
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--rose)', marginBottom: 14, padding: '0 2px' }}>:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Card : empilée sur mobile, grille sur desktop */}
    <div className="card" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
      overflow: 'hidden',
    }}>

      {/* Image — pleine largeur sur mobile */}
      <div style={{
        position: 'relative',
        minHeight: 'clamp(220px, 40vw, 320px)',
        overflow: 'hidden',
        background: 'var(--rose-pale)',
      }}>
        <img
          src="/images/baklawa.png"
          alt="Baklawa Royale"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            position: 'absolute',
            inset: 0,
          }}
        />
        {/* Badge flottant sur l'image */}
        <span style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'var(--rose)',
          color: 'white',
          fontSize: 11,
          padding: '5px 14px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 500,
          backdropFilter: 'blur(4px)',
        }}>
          ★ Bestseller — 20% de réduction
        </span>
      </div>

      {/* Contenu — padding adaptatif */}
      <div style={{ padding: 'clamp(24px,5vw,40px) clamp(20px,4vw,36px)' }}>

        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(26px,4vw,36px)',
          marginBottom: 12,
          lineHeight: 1.15,
        }}>
          Baklawa <em style={{ color: 'var(--rose-dark)' }}>Royale</em>
        </h3>

        <p style={{
          fontSize: 'clamp(13px,1.8vw,14px)',
          color: 'var(--ink-muted)',
          lineHeight: 1.8,
          marginBottom: 20,
        }}>
          Pâte fine au beurre clarifié, farce d'amandes parfumée à la fleur d'oranger, sirop ambré. La recette signature de Farah Sucré.
        </p>

        {/* Prix */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 16, color: 'var(--ink-muted)', textDecoration: 'line-through', opacity: 0.5 }}>
            250 DA
          </span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px,5vw,42px)',
            color: 'var(--rose-dark)',
            lineHeight: 1,
          }}>
            200 DA
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>/ 1 pièce</span>
        </div>

        {/* Bouton full-width sur mobile */}
        <Link
          to="/halwas"
          className="btn btn-primary"
          style={{
            fontSize: 14,
            padding: '13px 28px',
            width: '100%',
            justifyContent: 'center',
            maxWidth: 280,
          }}
        >
          Voir et commander <ArrowRight size={15} />
        </Link>
      </div>
    </div>

  </div>
</section>
     {/* ── NOS FAMILLES ── */}
<section style={{ background: 'var(--cream)', padding: 'clamp(60px,8vw,100px) 0' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
      <div className="section-label">Nos créations</div>
      <h2 className="section-title">Notre familles de <em>halwas</em></h2>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
      gap: 'clamp(10px,2vw,16px)',
    }}>
      {Object.entries(HALWA_TYPES).map(([key, { label, image }]) => (
        <Link
          key={key}
          to={`/halwas?type=${key}`}
          style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--border)',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            e.currentTarget.style.borderColor = 'var(--rose)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          {/* Image — hauteur fixe, bien cadrée */}
          <div style={{
            width: '100%',
            aspectRatio: '4/3',        /* ratio stable sur tous écrans */
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--rose-pale)',
          }}>
            <img
              src={image}
              alt={label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                position: 'absolute',
                inset: 0,
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* Contenu — padding généreux */}
          <div style={{
            padding: 'clamp(16px,3vw,22px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(17px,2.5vw,21px)',
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}>
              {label}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--rose-dark)',
              }}>
                Découvrir
              </div>
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: 'var(--rose-pale)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--rose-dark)',
                fontSize: 14,
              }}>→</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* ── BESTSELLERS ── */}
      <section style={{ background: 'white', padding: '100px 0' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(to right,transparent,var(--rose-light),transparent)' }} />
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
            <div>
              <div className="section-label">Les plus aimés</div>
              <h2 className="section-title">Nos <em>bestsellers</em></h2>
            </div>
            <Link to="/halwas" className="btn btn-ghost" style={{ color: 'var(--rose-dark)', borderBottom: '1px solid var(--border)' }}>
              Tous les produits →
            </Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
              {halwas.map(h => <HalwaCard key={h.id} halwa={h} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: 'var(--rose-pale)', padding: '80px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, textAlign: 'center' }}>
            {[
              { Icon: Package, title: 'Emballage soigné', desc: 'Chaque commande préparée avec soin pour une présentation parfaite' },
              { Icon: Clock,   title: 'Délai 48h',        desc: 'Commandez à l\'avance pour garantir fraîcheur et disponibilité' },
              { Icon: MapPin,  title: 'Livraison Alger',  desc: 'Toutes les communes de la wilaya, suivi de commande inclus' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color="var(--rose-dark)" />
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

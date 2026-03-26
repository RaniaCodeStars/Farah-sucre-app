import { MapPin, Package, Clock, Phone } from 'lucide-react'
import { LIVRAISON_ZONES, ORDER_STATUS_FLOW, ORDER_STATUS } from '../lib/constants'

export function Livraison() {
  return (
    <div style={{ paddingTop: 72 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '52px 0 40px' }}>
        <div className="container">
          <div className="section-label">Sur toute la wilaya</div>
          <h1 className="section-title">Livraison sur <em>Alger</em></h1>
          <p style={{ fontSize: 15, color: 'var(--ink-muted)', maxWidth: 520 }}>
            Nous livrons dans toutes les communes d'Alger. Commandez au moins 48h à l'avance et recevez vos halwas fraîchement préparées.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '52px clamp(20px,5vw,80px)' }}>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 52 }}>
          {[
            { icon: Package, title: 'Emballage soigné',  desc: 'Chaque commande préparée avec soin pour un rendu parfait' },
            { icon: Clock,   title: 'Délai 48h minimum', desc: 'Commandez à l\'avance pour garantir fraîcheur et disponibilité' },
            { icon: MapPin,  title: 'Suivi en direct',   desc: 'Suivez l\'état de votre commande depuis votre espace client' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--rose-pale)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon size={22} color="var(--rose-dark)" />
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Zones table */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>Prix par zone</h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ background: 'var(--rose)', padding: '14px 24px', display: 'grid', gridTemplateColumns: '1fr 2fr auto' }}>
              {['Zone', 'Communes couvertes', 'Tarif livraison'].map(h => (
                <div key={h} style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white', fontWeight: 500 }}>{h}</div>
              ))}
            </div>
            {LIVRAISON_ZONES.map((z, i) => (
              <div key={z.zone} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', padding: '16px 24px', borderBottom: i < LIVRAISON_ZONES.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'white' : 'var(--rose-pale)', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15 }}>{z.zone}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{z.communes}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--rose-dark)' }}>{z.prix} DA</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 10 }}>
            * Votre commune n'est pas listée ? Contactez-nous, on s'arrange.
          </p>
        </div>

        {/* Tracker visual */}
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>Suivi de votre commande</h2>
          <div className="card" style={{ padding: '28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: 4 }}>
              {ORDER_STATUS_FLOW.map((s, i) => {
                const { label } = ORDER_STATUS[s]
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--rose-pale)', border: '2px solid var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--rose-dark)', fontWeight: 500 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--ink-muted)', maxWidth: 70, textAlign: 'center', lineHeight: 1.4 }}>{label}</span>
                    </div>
                    {i < ORDER_STATUS_FLOW.length - 1 && (
                      <div style={{ height: 2, width: 'clamp(20px,4vw,60px)', background: 'var(--rose-light)', marginBottom: 28, flexShrink: 0 }} />
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 16, textAlign: 'center' }}>
              Suivez chaque étape en temps réel depuis <strong>Mon compte → Mes commandes</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div style={{ paddingTop: 72 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '52px 0 40px' }}>
        <div className="container">
          <div className="section-label">Nous trouver</div>
          <h1 className="section-title">Parlons <em>halwas</em></h1>
          <p style={{ fontSize: 15, color: 'var(--ink-muted)', maxWidth: 480 }}>
            Question, commande personnalisée ou demande spéciale ? On vous répond dans les 24h.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '52px clamp(20px,5vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

          {/* How it works */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>Comment ça marche ?</h2>
            <div className="card" style={{ padding: '24px' }}>
              {[
                ['1', 'Choisissez vos halwas', 'Parcourez notre catalogue et ajoutez au panier'],
                ['2', 'Remplissez le formulaire', 'Nom, adresse, commune et date souhaitée (min. 48h)'],
                ['3', 'Confirmation sous 24h', 'On vous contacte pour confirmer et discuter des détails'],
                ['4', 'Livraison à domicile', 'Vos halwas arrivent fraîchement préparées chez vous 🎀'],
              ].map(([n, t, d]) => (
                <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--rose)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{t}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>Nous contacter</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📘', label: 'Facebook', sub: 'Farah Sucré', href: 'https://facebook.com/farah.sucre.2025', color: '#1877F2' },
                { icon: '📸', label: 'Instagram', sub: '@farahsucre', href: 'https://instagram.com/farah.sucre', color: '#E1306C' },
                { icon: '💬', label: 'WhatsApp', sub: '+213 XX XX XX XX', href: 'https://wa.me/213', color: '#25D366' },
              ].map(({ icon, label, sub, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}22` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16 }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{sub}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 18, color: 'var(--ink-muted)' }}>→</div>
                </a>
              ))}
            </div>

            <div className="card" style={{ padding: '20px', marginTop: 12, borderLeft: '3px solid var(--rose)' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, marginBottom: 6 }}>Horaires</div>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.8 }}>
                Lundi – Samedi : 9h00 – 20h00<br />
                Dimanche : 10h00 – 18h00<br />
                <span style={{ color: 'var(--rose-dark)', fontWeight: 500 }}>Commandes 7j/7 en ligne</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

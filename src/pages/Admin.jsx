import { useState, useMemo } from 'react'
import { 
  Search, Phone, ChevronDown, CheckCircle2, MapPin, 
  MessageCircle, Calendar, XCircle, ShoppingBag, ArrowRight,
  RefreshCw, TrendingUp, Bell, PackageCheck, UserCircle
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useAllOrders } from '../hooks/useOrders'
import { ORDER_STATUS, ORDER_STATUS_FLOW } from '../lib/constants'

import { useNavigate } from 'react-router-dom'

// --- COMPOSANT : CARTE COMMANDE NEUROMORPHIQUE ---
function AdminOrderRow({ order, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!order) return null;

  const currentStatus = order.status || 'en_attente'
  const statusConfig = ORDER_STATUS[currentStatus]
  // Sécurité pour le flow
  const statusIndex = ORDER_STATUS_FLOW ? ORDER_STATUS_FLOW.indexOf(currentStatus) : -1
  const nextStatus = (ORDER_STATUS_FLOW && statusIndex !== -1 && statusIndex < ORDER_STATUS_FLOW.length - 1)
    ? ORDER_STATUS_FLOW[statusIndex + 1]
    : null

  const handleUpdate = async (e, status) => {
    e.stopPropagation()
    setSaving(true)
    const success = await onStatusChange(order.id, status)
    if (success) {
      toast.success(`Commande de ${order.nom_client || 'Client'} mise à jour`, {
        style: { borderRadius: '15px', background: '#333', color: '#fff', fontSize: '14px' }
      })
    }
    setSaving(false)
  }

  const openWhatsApp = (e) => {
    e.stopPropagation()
    const phone = order.tel?.replace(/^0/, '213')
    const msg = `Salem ${order.nom_client}, c'est Farah Sucré ! ✨ Votre commande est prête.`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className={`neuro-card ${open ? 'expanded' : ''}`}>
      {/* HEADER : Résumé Élégant */}
      <div className="card-header" onClick={() => setOpen(!open)}>
        <div className="client-section">
          <div className="avatar-neuro">
            <UserCircle size={20} color="#BE185D" />
          </div>
          <div className="client-data">
            <h3>{order.nom_client || 'Client Anonyme'}</h3>
            <p><MapPin size={12}/> {order.commune || 'Alger'}</p>
          </div>
        </div>

        <div className="status-badge-neuro" style={{ color: statusConfig?.color, background: statusConfig?.bg }}>
          {statusConfig?.label || currentStatus}
        </div>

        <div className="price-section">
          <span className="amount">{(order.total || 0).toLocaleString()} <small>DA</small></span>
          <ChevronDown className="chevron-neuro" size={20} />
        </div>
      </div>

      {/* DÉTAILS : Organisation & Clarté */}
      {open && (
        <div className="card-details-neuro">
          <div className="details-grid-neuro">
            {/* Colonne 1 : Panier */}
            <div className="detail-block">
              <div className="block-title"><ShoppingBag size={14} /> Le Panier</div>
              {(order.items || []).length > 0 ? order.items.map((it, i) => (
                <div key={i} className="item-line-neuro">
                  <span className="item-name">{it.nom} <b className="item-qty">×{it.quantite}</b></span>
                  <span className="item-price">{(it.prix_unitaire * it.quantite).toLocaleString()} DA</span>
                </div>
              )) : <p className="empty-text">Aucun article</p>}
              {order.notes && <div className="order-note-neuro">💬 {order.notes}</div>}
            </div>
            
            {/* Colonne 2 : Actions & Infos */}
            <div className="detail-block actions-block">
              <div className="block-title"><PackageCheck size={14} /> Suivi & Contact</div>
              <div className="info-row-neuro">
                <Calendar size={14} color="#666" /> <span>Livraison prév. :</span> <strong>{order.deadline || 'ASAP'}</strong>
              </div>
              
              <div className="contact-buttons-neuro">
                <a href={`tel:${order.tel}`} className="btn-neuro-icon"><Phone size={18}/> Appeler</a>
                <button onClick={openWhatsApp} className="btn-neuro-icon whatsapp"><MessageCircle size={18}/> WhatsApp</button>
              </div>
            </div>
          </div>

          {/* Barre d'action finale */}
          <div className="final-actions-neuro">
            <button onClick={(e) => handleUpdate(e, 'annulee')} className="btn-neuro-danger">Annuler</button>
            {nextStatus && (
              <button onClick={(e) => handleUpdate(e, nextStatus)} disabled={saving} className="btn-neuro-primary">
                {saving ? '...' : `Valider étape : ${ORDER_STATUS[nextStatus]?.label}`} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// --- PAGE ADMIN ---
export default function Admin() {
  const { orders, loading, updateStatus, refresh } = useAllOrders()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate() // <--- AJOUTE CETTE LIGNE ICI
  

  const stats = useMemo(() => ({
    total: orders.length,
    ca: orders.filter(o => o.status === 'livree').reduce((sum, o) => sum + (o.total || 0), 0),
    attente: orders.filter(o => o.status === 'en_attente').length
  }), [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = filter === 'all' || o.status === filter
      const searchLower = search.toLowerCase()
      return matchStatus && (
        (o.nom_client || '').toLowerCase().includes(searchLower) || 
        (o.commune || '').toLowerCase().includes(searchLower) ||
        (o.tel || '').includes(search)
      )
    }).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  }, [orders, filter, search])

  return (
    <div className="admin-body-neuro">
      <Toaster position="bottom-center" />
      
      {/* Topbar Glassmorphism */}
      <header className="admin-nav-neuro">
        <div className="container nav-content-neuro">
          <div className="logo-area-neuro">
            <div className="logo-icon-neuro">F</div>
            <div>
              <h1>Farah Sucré</h1>
              <span>Terminal d'Administration</span>
            </div>
          </div>
          <button onClick={refresh} className="btn-refresh-neuro">
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
          </button>
       

        </div>
      </header>

      <main className="container admin-main-neuro">
        {/* Stats Cards Neuromorphiques */}
        <div className="stats-row-neuro">
          <div className="stat-card-neuro dark">
            <TrendingUp size={24} color="#F472B6" style={{marginBottom: '10px'}} />
            <span className="stat-label">Recettes Livrées</span>
            <div className="stat-value">{(stats.ca || 0).toLocaleString()} <small>DA</small></div>
          </div>
          <div className="stat-card-neuro">
            <Bell size={24} color="#BE185D" style={{marginBottom: '10px'}} />
            <span className="stat-label">Nouvelles Commandes</span>
            <div className="stat-value">{stats.attente}</div>
          </div>
        </div>

        {/* Barre de Recherche & Filtres */}
        <div className="controls-neuro">
          <div className="search-box-neuro">
            <Search size={18} color="#999" />
            <input 
              placeholder="Rechercher nom, ville, tel..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => navigate('/admin/calendar')} className="btn-refresh-neuro">
  <Calendar size={20} />
</button>
          <div className="filter-tabs-neuro">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Toutes ({stats.total})</button>
            {ORDER_STATUS_FLOW && ORDER_STATUS_FLOW.map(status => (
              <button 
                key={status}
                className={filter === status ? 'active' : ''}
                onClick={() => setFilter(status)}
              >
                {ORDER_STATUS[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="orders-list-neuro">
          {loading ? (
            <div className="loader-neuro"><RefreshCw size={30} className="spinning" color="#BE185D" /> <p>Chargement des délices...</p></div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state-neuro">
              <ShoppingBag size={50} color="#CCC" style={{marginBottom: '15px'}} />
              <p>Aucune commande ne correspond pour le moment.</p>
            </div>
          ) : (
            filteredOrders.map(order => <AdminOrderRow key={order.id} order={order} onStatusChange={updateStatus} />)
          )}
        </div>
      </main>

      <style>{`
        /* IMPORT DES POLICES CLAUDE/APPLE */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

        /* VARIABLES PRESTIGE */
        :root {
          --bg-neuro: #F3F4F7;
          --text-p: #1F2937;
          --text-s: #6B7280;
          --accent-rose: #BE185D;
          --rose-gold: #F472B6;
          --shadow-soft: 6px 6px 12px #D1D9E6, -6px -6px 12px #FFFFFF;
          --shadow-inner: inset 2px 2px 5px #B8B9BE, inset -3px -3px 7px #FFFFFF;
        }

        .admin-body-neuro { background: var(--bg-neuro); min-height: 100vh; font-family: 'Inter', sans-serif; color: var(--text-p); padding-bottom: 50px; }
        
        /* NAVBAR GLASSMORPHISM */
        .admin-nav-neuro { background: rgba(243, 244, 247, 0.8); backdrop-filter: blur(15px); padding: 15px 0; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.4); }
        .nav-content-neuro { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .logo-area-neuro { display: flex; gap: 15px; align-items: center; }
        .logo-icon-neuro { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-rose), var(--rose-gold)); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: 'Playfair Display', serif; font-size: 18px; box-shadow: 2px 2px 5px rgba(190,24,93,0.3); }
        .logo-area-neuro h1 { font-size: 18px; font-weight: 800; margin: 0; font-family: 'Playfair Display', serif; }
        .logo-area-neuro span { font-size: 11px; color: var(--text-s); font-weight: 500; }
        .btn-refresh-neuro { width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--bg-neuro); box-shadow: var(--shadow-soft); cursor: pointer; color: var(--text-p); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-refresh-neuro:active { box-shadow: var(--shadow-inner); }

        .admin-main-neuro { padding: 25px 15px; max-width: 900px; margin: 0 auto; }

        /* STATS CARDS NEURO */
        .stats-row-neuro { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .stat-card-neuro { padding: 25px; border-radius: 25px; background: var(--bg-neuro); box-shadow: var(--shadow-soft); border: 1px solid rgba(255,255,255,0.6); }
        .stat-card-neuro.dark { background: #111827; color: white; border: none; box-shadow: 5px 5px 15px rgba(0,0,0,0.2); }
        .stat-label { font-size: 12px; fontWeight: 600; color: var(--text-s); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 5px; }
        .stat-card-neuro.dark .stat-label { color: rgba(255,255,255,0.7); }
        .stat-value { font-size: 26px; font-weight: 800; font-family: 'Inter', sans-serif; }
        .stat-value small { font-size: 14px; fontWeight: 500; opacity: 0.7; }

        /* CONTROLS NEURO */
        .controls-neuro { margin-bottom: 25px; }
        .search-box-neuro { display: flex; align-items: center; gap: 12px; padding: 15px 20px; background: var(--bg-neuro); border-radius: 18px; box-shadow: var(--shadow-inner); margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.2); }
        .search-box-neuro input { flex: 1; border: none; background: transparent; outline: none; font-size: 15px; color: var(--text-p); }
        .search-box-neuro input::placeholder { color: #999; }
        
        .filter-tabs-neuro { display: flex; gap: 10px; overflow-x: auto; padding: 5px 0 10px; scrollbar-width: none; }
        .filter-tabs-neuro button { padding: 10px 20px; border-radius: 15px; border: none; background: var(--bg-neuro); color: var(--text-s); font-weight: 600; font-size: 13px; cursor: pointer; white-space: nowrap; transition: 0.2s; box-shadow: var(--shadow-soft); border: 1px solid rgba(255,255,255,0.5); }
        .filter-tabs-neuro button.active { color: white; background: var(--accent-rose); box-shadow: 2px 2px 8px rgba(190,24,93,0.3); border-color: var(--accent-rose); }
        .filter-tabs-neuro button:active { box-shadow: var(--shadow-inner); }

        /* CARDS NEURO PRESTIGE */
        .neuro-card { background: var(--bg-neuro); border-radius: 25px; border: 1px solid rgba(255,255,255,0.6); margin-bottom: 15px; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--shadow-soft); overflow: hidden; }
        .neuro-card.expanded { transform: scale(1.01); box-shadow: 10px 10px 20px #D1D9E6, -10px -10px 20px #FFFFFF; }
        .card-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        
        .client-section { display: flex; gap: 15px; align-items: center; }
        .avatar-neuro { width: 45px; height: 45px; border-radius: 15px; background: var(--bg-neuro); box-shadow: var(--shadow-soft); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.7); }
        .client-data h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--text-p); }
        .client-data p { margin: 3px 0 0; font-size: 12px; color: var(--text-s); display: flex; align-items: center; gap: 5px; }

        .status-badge-neuro { padding: 6px 14px; border-radius: 40px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: var(--shadow-inner); border: 1px solid rgba(255,255,255,0.2); }
        
        .price-section { display: flex; align-items: center; gap: 15px; text-align: right; }
        .amount { font-size: 17px; font-weight: 800; color: var(--accent-rose); font-family: 'Inter', sans-serif; }
        .amount small { font-size: 11px; opacity: 0.7; font-weight: 500; }
        .chevron-neuro { color: #BBB; transition: 0.3s; }
        .expanded .chevron-neuro { transform: rotate(180deg); color: var(--accent-rose); }

        /* DETAILS NEURO */
        .card-details-neuro { padding: 0 20px 20px 20px; animation: slideIn 0.3s ease; border-top: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.2); }
        .details-grid-neuro { display: grid; grid-template-columns: 1fr; gap: 20px; padding: 20px 0; }
        @media (min-width: 650px) { .details-grid-neuro { grid-template-columns: 1.2fr 1fr; } }
        
        .detail-block { background: var(--bg-neuro); padding: 18px; border-radius: 20px; box-shadow: var(--shadow-inner); border: 1px solid rgba(255,255,255,0.3); }
        .block-title { font-size: 12px; font-weight: 700; color: var(--accent-rose); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed rgba(190,24,93,0.2); }
        
        .item-line-neuro { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.03); color: var(--text-p); }
        .item-qty { color: var(--accent-rose); margin-left: 5px; }
        .item-price { color: var(--text-s); font-weight: 500; }
        .order-note-neuro { margin-top: 12px; padding: 12px; background: rgba(251, 191, 36, 0.1); border-radius: 12px; font-size: 12px; color: #92400E; border-left: 3px solid #F59E0B; font-style: italic; }

        .info-row-neuro { font-size: 13px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .info-row-neuro span { color: var(--text-s); }
        .info-row-neuro strong { color: var(--text-p); font-weight: 600; }

        .contact-buttons-neuro { display: flex; gap: 10px; margin-top: 15px; }
        .btn-neuro-icon { flex: 1; padding: 12px; border-radius: 12px; border: none; background: var(--bg-neuro); box-shadow: var(--shadow-soft); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--text-p); font-size: 13px; font-weight: 700; text-decoration: none; border: 1px solid rgba(255,255,255,0.6); }
        .btn-neuro-icon:active { box-shadow: var(--shadow-inner); }
        .btn-neuro-icon.whatsapp { color: white; background: #25D366; border-color: #25D366; box-shadow: 2px 2px 8px rgba(37,211,102,0.3); }

        .final-actions-neuro { display: flex; gap: 12px; margin-top: 10px; }
        .btn-neuro-primary { flex: 3; padding: 16px; border-radius: 18px; border: none; background: var(--accent-rose); color: white; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 3px 3px 10px rgba(190,24,93,0.3); transition: 0.2s; }
        .btn-neuro-primary:active { transform: scale(0.98); }
        .btn-neuro-danger { flex: 1; padding: 16px; border-radius: 18px; border: none; background: var(--bg-neuro); color: #EF4444; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: var(--shadow-soft); border: 1px solid rgba(255,255,255,0.6); }
        .btn-neuro-danger:active { box-shadow: var(--shadow-inner); }

        /* ANIMATIONS & LOADER */
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .loader-neuro { text-align: center; padding: 60px 0; color: var(--text-s); }
        .loader-neuro p { margin-top: 15px; font-size: 14px; }
        .empty-state-neuro { text-align: center; padding: 60px 20px; color: var(--text-s); background: var(--bg-neuro); border-radius: 20px; box-shadow: var(--shadow-inner); border: 1px solid rgba(255,255,255,0.2); }
        .empty-state-neuro p { font-size: 14px; }

      `}</style>
    </div>
  )
}
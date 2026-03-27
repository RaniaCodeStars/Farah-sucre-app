import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { useAllOrders } from '../hooks/useOrders'
import { ORDER_STATUS } from '../lib/constants'
import { X, MapPin, Phone, MessageCircle, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminCalendar() {
  const { orders } = useAllOrders()
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)

  const events = orders.map(order => ({
    id: order.id,
    title: `${order.nom_client}`,
    start: order.deadline,
    backgroundColor: ORDER_STATUS[order.status]?.bg || '#BE185D',
    textColor: ORDER_STATUS[order.status]?.color || '#fff',
    extendedProps: { ...order }
  }))

  return (
    <div className="calendar-mobile-wrapper">
      {/* Header compact pour mobile */}
      <header className="cal-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={24} />
        </button>
        <h1>Planning</h1>
        <div style={{ width: 40 }}></div> {/* Équilibre visuel */}
      </header>

      <div className="calendar-card-neuro">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={frLocale}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'today'
          }}
          events={events}
          height="auto"
          stickyHeaderDates={true}
          handleWindowResize={true}
          eventClick={(info) => setSelectedOrder(info.event.extendedProps)}
        />
      </div>

      {/* TIROIR DE DÉTAILS (Bottom Sheet) */}
      {selectedOrder && (
        <div className="bottom-sheet-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="handle"></div>
            <div className="sheet-header">
              <h3>Détails Commande</h3>
              <button onClick={() => setSelectedOrder(null)}><X size={20}/></button>
            </div>
            
            <div className="sheet-body">
              <div className="client-info">
                <h4>{selectedOrder.nom_client}</h4>
                <p><MapPin size={14}/> {selectedOrder.commune}</p>
              </div>

              <div className="order-items-list">
                {selectedOrder.items?.map((it, i) => (
                  <div key={i} className="item-row">
                    <span>{it.quantite}x {it.nom}</span>
                    <strong>{it.prix_unitaire * it.quantite} DA</strong>
                  </div>
                ))}
              </div>

              <div className="sheet-actions">
                <a href={`tel:${selectedOrder.tel}`} className="btn-call"><Phone size={20}/> Appeler</a>
                <button 
                  onClick={() => window.open(`https://wa.me/${selectedOrder.tel?.replace(/^0/, '213')}`)} 
                  className="btn-wa"
                >
                  <MessageCircle size={20}/> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-mobile-wrapper { 
          background: #F8F9FC; 
          min-height: 100vh; 
          padding-bottom: 30px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .cal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px; background: white; border-bottom: 1px solid #EEE;
        }
        .cal-header h1 { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin: 0; color: #BE185D; }
        .back-btn { border: none; background: none; color: #1F2937; }

        .calendar-card-neuro {
          margin: 15px; padding: 15px; background: white;
          border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        /* FullCalendar Mobile Tweaks */
        .fc { font-size: 0.85rem; }
        .fc-toolbar-title { font-size: 1rem !important; font-weight: 700; }
        .fc-button { background: #BE185D !important; border: none !important; border-radius: 10px !important; text-transform: capitalize !important; }
        .fc-daygrid-event { border: none !important; padding: 4px !important; margin: 2px !important; border-radius: 6px !important; }

        /* Bottom Sheet (Tiroir) */
        .bottom-sheet-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          z-index: 1000; display: flex; align-items: flex-end;
          animation: fadeIn 0.3s;
        }
        .bottom-sheet {
          background: white; width: 100%; border-radius: 25px 25px 0 0;
          padding: 20px; animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .handle { width: 40px; height: 5px; background: #DDD; border-radius: 10px; margin: 0 auto 15px; }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .sheet-header h3 { margin: 0; font-size: 1.1rem; }
        .sheet-header button { border: none; background: #F3F4F6; padding: 5px; border-radius: 50%; }

        .client-info h4 { margin: 0; font-size: 1.2rem; color: #BE185D; }
        .client-info p { color: #666; font-size: 0.9rem; margin: 5px 0 20px; display: flex; align-items: center; gap: 5px; }

        .order-items-list { background: #F9FAFB; padding: 15px; border-radius: 15px; margin-bottom: 20px; }
        .item-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px; }

        .sheet-actions { display: flex; gap: 10px; }
        .btn-call, .btn-wa { 
          flex: 1; height: 50px; border-radius: 15px; border: none;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-weight: 700; font-size: 0.9rem; text-decoration: none;
        }
        .btn-call { background: #1F2937; color: white; }
        .btn-wa { background: #25D366; color: white; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  )
}
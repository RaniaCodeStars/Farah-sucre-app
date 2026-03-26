import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider }  from './context/AuthContext'
import { CartProvider }  from './context/CartContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

import Navbar      from './components/Navbar'
import CartDrawer  from './components/CartDrawer'

import Home        from './pages/Home'
import Halwas      from './pages/Halwas'
import Commande    from './pages/Commande'
import Auth        from './pages/Auth'
import MonCompte   from './pages/MonCompte'
import Admin       from './pages/Admin'
import Avis        from './pages/Avis'
import { Livraison, Contact } from './pages/LivraisonContact'

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/halwas"    element={<Halwas />} />
        <Route path="/commande"  element={<Commande />} />
        <Route path="/auth"      element={<Auth />} />
        <Route path="/livraison" element={<Livraison />} />
        <Route path="/avis"      element={<Avis />} />
        <Route path="/contact"   element={<Contact />} />

        <Route path="/compte" element={
          <ProtectedRoute><MonCompte /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><Admin /></AdminRoute>
        } />
      </Routes>

      <Footer />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: 14, borderRadius: 50, padding: '10px 18px' },
          success: { iconTheme: { primary: 'var(--rose)', secondary: 'white' } },
        }}
      />
    </>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', padding: '40px clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 22 }}>🍰</div>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'white' }}>
            Farah <em style={{ color: 'var(--rose)' }}>Sucré</em>
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Votre meilleur choix</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2025 Farah Sucré · Alger · Depuis 2019</div>
      <div style={{ display: 'flex', gap: 24 }}>
        {[['/', 'Accueil'],['/halwas','Nos halwas'],['/livraison','Livraison'],['/contact','Contact']].map(([href, label]) => (
          <a key={href} href={href} style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--rose)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
            {label}
          </a>
        ))}
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

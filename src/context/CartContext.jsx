import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('farah_cart') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('farah_cart', JSON.stringify(items))
  }, [items])

  function addItem(halwa, garniture, quantite = 1) {
    setItems(prev => {
      const key = `${halwa.id}-${garniture}`
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantite: i.quantite + quantite } : i)
      }
      return [...prev, { key, halwa, garniture, quantite }]
    })
  }

  function removeItem(key) {
    setItems(prev => prev.filter(i => i.key !== key))
  }

  function updateQuantite(key, quantite) {
    if (quantite <= 0) { removeItem(key); return }
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantite } : i))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.halwa.prix * i.quantite, 0)
  const count = items.reduce((sum, i) => sum + i.quantite, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantite, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être dans CartProvider')
  return ctx
}

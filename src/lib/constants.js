export const ORDER_STATUS = {
  en_attente:      { label: 'En attente',      color: '#F59E0B', bg: '#FEF3C7' },
  confirmee:       { label: 'Confirmée',        color: '#3B82F6', bg: '#EFF6FF' },
  en_preparation:  { label: 'En préparation',   color: '#8B5CF6', bg: '#F5F3FF' },
  prete:           { label: 'Prête',            color: '#10B981', bg: '#ECFDF5' },
  en_livraison:    { label: 'En livraison',     color: '#F97316', bg: '#FFF7ED' },
  livree:          { label: 'Livrée',           color: '#059669', bg: '#D1FAE5' },
  annulee:         { label: 'Annulée',          color: '#EF4444', bg: '#FEE2E2' },
}

export const ORDER_STATUS_FLOW = [
  'en_attente', 'confirmee', 'en_preparation', 'prete', 'en_livraison', 'livree'
]

import baklawaImg from '/images/baklawa.png'
export const HALWA_TYPES = {
  // 1. LE PRESTIGE (3rayech, M'khabez, K3ik3at)
  prestige: { 
    label: 'Prestige & Fêtes — حلويات الأفراح', 
    image: '/images/3rayesh1.png', // Mets une belle photo de 3rayech ou K3ik3at
    description: 'L’élégance pour vos grands événements.'
  },

  // 2. LE MIEL (Baklawa, Makrout, Samsa)
  mo3assalat: { 
    label: 'Tradition & Miel — حلويات معسلة', 
    image: '/images/makrout.png',
    description: 'Le goût authentique du terroir.'
  },

  // 3. L'ARTISTIQUE (Les Fruits, Kefta)
  artistique: { 
    label: 'Art & Modelage — فن تشكيل اللوز', 
    image: '/images/khokh.png',
    description: 'La pâtisserie qui ressemble à de l’art.'
  },

  // 4. LE QUOTIDIEN (Sablés, Bniwen, Ghribia)
  douceurs: { 
    label: 'Pause Café — حلويات جافة', 
    image: '/images/box2.png',
    description: 'Pour vos moments de gourmandise simple.'
  },
}

export const GARNITURES = ['Louz (amandes)', 'Djouz (noix)', 'Kawkaw (cacahuètes)']

export const LIVRAISON_ZONES = [
  { zone: 'Alger Centre',   communes: 'Hussein Dey, Bir Mourad Raïs, Sidi M\'Hamed', prix: 250 },
  { zone: 'Est Algérois',   communes: 'Bab Ezzouar, Dar El Beïda, Bordj El Kiffan', prix: 300 },
  { zone: 'Ouest Algérois', communes: 'Chéraga, Hydra, Ben Aknoun, Dély Ibrahim',   prix: 300 },
  { zone: 'Sud Algérois',   communes: 'Kouba, El Harrach, Bachdjerrah, Birtouta',   prix: 280 },
]

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

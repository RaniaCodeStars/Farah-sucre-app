# 🍰 Farah Sucré — Web App

Application de commande de pâtisseries orientales. React + Vite + Supabase, hébergeable sur Vercel gratuitement.



## 📦 Déploiement sur Vercel (gratuit)

### Option A — Via GitHub (recommandée)

1. Push le projet sur GitHub
2. Va sur [vercel.com](https://vercel.com) → **New Project** → importe ton repo
3. Ajoute les variables d'environnement dans Vercel (Settings → Environment Variables) :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
4. Clique **Deploy** → ton app est en ligne !

### Option B — Via CLI

```bash
npm install -g vercel
vercel
# Suit les instructions, ajoute les env vars quand demandé
```

---

## 📁 Structure du projet

```
src/
├── pages/
│   ├── Home.jsx          ← Landing page
│   ├── Halwas.jsx        ← Catalogue avec filtres
│   ├── Commande.jsx      ← Tunnel 3 étapes
│   ├── Auth.jsx          ← Login / Signup
│   ├── MonCompte.jsx     ← Espace client + suivi commandes
│   ├── Admin.jsx         ← Dashboard admin (temps réel)
│   ├── Avis.jsx          ← Avis clients
│   └── LivraisonContact.jsx
├── components/
│   ├── Navbar.jsx
│   ├── CartDrawer.jsx    ← Panier latéral
│   ├── HalwaCard.jsx     ← Carte produit cliquable
│   ├── OrderStatusBadge.jsx
│   └── ProtectedRoute.jsx
├── hooks/
│   ├── useOrders.js      ← Commandes en temps réel
│   └── useHalwas.js      ← Catalogue depuis Supabase
├── context/
│   ├── AuthContext.jsx   ← Auth global
│   └── CartContext.jsx   ← Panier (localStorage)
└── lib/
    ├── supabaseClient.js
    └── constants.js
```

---

## ✨ Fonctionnalités

| Feature            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| 🛒 Panier          | Persistant dans localStorage, drawer latéral                 |
| 🔐 Auth            | Login / Signup via Supabase Auth                             |
| 📦 Commandes       | Tunnel 3 étapes, sauvegardé dans Supabase                    |
| ⚡ Temps réel      | Nouvelles commandes apparaissent instantanément côté admin   |
| 📊 Dashboard admin | Stats, gestion des statuts, bouton "appeler le client"       |
| 📍 Suivi           | Tracker visuel dans l'espace client (mis à jour par l'admin) |
| ⭐ Avis            | Commentaires avec likes, visibles publiquement               |
| 📱 Responsive      | Mobile-first, fonctionne sur tous les écrans                 |

---

## 🎨 Personnalisation

### Changer les couleurs

Dans `src/index.css`, modifie les variables CSS :

```css
:root {
  --rose: #f2a7bb; /* couleur principale */
  --rose-dark: #c25a7c; /* boutons, titres */
  --gold: #c9a06a; /* accents dorés */
}
```

### Ajouter des halwas

Dans Supabase → **Table Editor** → table `halwas` → Insert row.

Ou via SQL :

```sql
insert into public.halwas (nom, type, description, prix, bestseller)
values ('Nom halwa', 'traditionnels', 'Description', 1200, false);
```

### Modifier les zones de livraison

Dans `src/lib/constants.js`, modifie le tableau `LIVRAISON_ZONES`.

---

## 🆘 Problèmes fréquents

**"Variables VITE_SUPABASE_URL manquantes"**
→ Vérifie que ton fichier `.env` existe et commence bien par `VITE_`

**"Row-level security violation"**
→ Le SQL du fichier `supabase.sql` n'a pas été lancé entièrement. Relance-le.

**"Invalid login credentials"**
→ L'email de confirmation Supabase est peut-être dans les spams. Vérifie dans Supabase Auth → Users si le compte est confirmé.

**La page admin affiche "non autorisé"**
→ Lance la requête SQL de l'étape 4 pour mettre `is_admin = true`.

# Intégration Stripe

Ce document décrit l'implémentation actuelle de Stripe dans l'application SaaS.

## État actuel

✅ **Configuré :**
- Configuration de base de Stripe côté API et client
- Page de paiement dédiée (`/payment`)
- Pages de succès (`/success`) et d'annulation (`/cancel`)
- Navigation mise à jour avec liens vers les abonnements
- Variables d'environnement configurées

## Architecture

### Backend (API)
- **Route Stripe**: `/apps/api/src/routes/stripe.ts`
  - `POST /api/stripe/create-checkout-session` - Création de session de paiement
  - `POST /api/stripe/webhook` - Endpoint webhook (basique)

### Frontend (Web)
- **Page de paiement**: `/apps/web/src/app/payment/page.tsx`
- **Page de succès**: `/apps/web/src/app/success/page.tsx`
- **Page d'annulation**: `/apps/web/src/app/cancel/page.tsx`
- **Navigation**: `/apps/web/src/components/Navigation.tsx`

## Configuration requise

### Variables d'environnement

#### API (`.env.local`)
```bash
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
FRONTEND_URL="http://localhost:3000"
```

#### Web (`.env.local`)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

## Pages créées

### 1. Page de paiement (`/payment`)
- Affichage de plans d'abonnement (mocked pour l'instant)
- Intégration avec Stripe Checkout
- Gestion d'erreurs et états de chargement
- Protection par authentification

### 2. Page de succès (`/success`)
- Confirmation de paiement réussi
- Affichage de l'ID de session
- Actions post-paiement (retour dashboard, profil)

### 3. Page d'annulation (`/cancel`)
- Information sur l'annulation
- Aide et support
- Possibilité de réessayer

## Fonctionnalités

### ✅ Implémentées
- Création de sessions Stripe Checkout
- Gestion des clients Stripe (création automatique)
- Pages de paiement avec interface utilisateur complète
- Redirection vers Stripe et retour
- Navigation intégrée
- Authentification requise

### 🚧 À implémenter
- **Produits réels** : Remplacement des produits mockés
- **Webhook Stripe** : Traitement des événements webhook
- **Gestion des abonnements** : Annulation, mise à jour
- **Historique des paiements** : Page de facturation
- **Tests** : Tests unitaires et d'intégration

## Configuration Stripe

### 1. Créer un compte Stripe
1. Aller sur [stripe.com](https://stripe.com)
2. Créer un compte développeur
3. Récupérer les clés API (mode test)

### 2. Configurer les produits
1. Dans le dashboard Stripe, créer des produits
2. Créer des prix pour chaque produit
3. Remplacer les `priceId` mockés dans `/payment/page.tsx`

### 3. Configurer les webhooks
1. Dans le dashboard Stripe, aller dans "Webhooks"
2. Ajouter un endpoint : `http://localhost:3001/api/stripe/webhook`
3. Sélectionner les événements requis
4. Copier la clé secrète du webhook

## Utilisation

### Développement
1. Configurer les variables d'environnement
2. Démarrer l'API : `npm run dev --workspace=@saas/api`
3. Démarrer le frontend : `npm run dev --workspace=@saas/web`
4. Naviguer vers `/payment` pour tester

### Test de paiement
Utiliser les cartes de test Stripe :
- **Succès**: `4242 4242 4242 4242`
- **Échec**: `4000 0000 0000 0002`
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel code à 3 chiffres

## Prochaines étapes

1. **Créer des produits réels** dans Stripe Dashboard
2. **Implémenter le webhook** pour gérer les événements
3. **Ajouter la gestion des abonnements** (annulation, pause)
4. **Créer une page de facturation** avec historique
5. **Ajouter des tests** pour les flux de paiement
6. **Optimiser l'UX** (loader, messages d'erreur)

## Structure des fichiers

```
apps/
├── api/
│   ├── .env.local                    # Variables d'environnement API
│   └── src/routes/stripe.ts          # Routes Stripe
├── web/
│   ├── .env.local                    # Variables d'environnement Web
│   └── src/
│       ├── app/
│       │   ├── payment/page.tsx      # Page de paiement
│       │   ├── success/page.tsx      # Page de succès
│       │   └── cancel/page.tsx       # Page d'annulation
│       └── components/
│           └── Navigation.tsx        # Navigation avec liens
└── packages/
    └── ui/src/Card.tsx              # Composant Card ajouté
```

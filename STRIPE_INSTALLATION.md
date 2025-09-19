# Guide de configuration Stripe pour localhost:3000/payment

## 🎯 Objectif
Ce guide vous explique comment configurer complètement Stripe pour avoir une page de paiement fonctionnelle sur `localhost:3000/payment`.

## 📋 Prérequis
- ✅ Node.js et npm installés
- ✅ Compte Stripe (gratuit)
- ✅ Code du projet saas-e-commerce

## 🚀 Étapes de configuration

### 1. Créer un compte Stripe

1. Rendez-vous sur [stripe.com](https://stripe.com)
2. Cliquez sur "Sign up" et créez votre compte
3. Vérifiez votre email
4. Une fois connecté, vous serez automatiquement en mode "Test"

### 2. Récupérer vos clés API

1. Dans le dashboard Stripe, allez dans **Developers > API keys**
2. Vous verrez deux clés importantes :
   - **Publishable key** (commence par `pk_test_`)
   - **Secret key** (commence par `sk_test_`) - Cliquez sur "Reveal live key"

### 3. Configurer vos produits dans Stripe

1. Dans le dashboard Stripe, allez dans **Products**
2. Cliquez sur **"Add product"**
3. Créez 3 produits (exemple) :

**Produit 1 - Starter**
- Name: `Starter Plan`
- Description: `Plan de base pour débuter`
- Pricing model: `Standard pricing`
- Price: `9.99 EUR`
- Billing period: `Monthly`
- Notez le **Price ID** (commence par `price_`)

**Produit 2 - Pro**
- Name: `Pro Plan`
- Description: `Plan professionnel avec plus de fonctionnalités`
- Pricing model: `Standard pricing`
- Price: `29.99 EUR`
- Billing period: `Monthly`
- Notez le **Price ID**

**Produit 3 - Enterprise**
- Name: `Enterprise Plan`
- Description: `Plan entreprise avec support prioritaire`
- Pricing model: `Standard pricing`
- Price: `99.99 EUR`
- Billing period: `Monthly`
- Notez le **Price ID**

### 4. Configurer les variables d'environnement

#### Pour l'API (`apps/api/.env.local`)
Remplacez les valeurs dans le fichier :

```bash
# Stripe - REMPLACEZ par vos vraies clés
STRIPE_SECRET_KEY="sk_test_VOTRE_CLE_SECRETE_ICI"
STRIPE_PUBLISHABLE_KEY="pk_test_VOTRE_CLE_PUBLIQUE_ICI"
STRIPE_WEBHOOK_SECRET="whsec_SERA_CONFIGURE_PLUS_TARD"

# Autres variables (laissez comme elles sont)
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="http://localhost:3000"
API_URL="http://localhost:3001"
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info
```

#### Pour le Frontend (`apps/web/.env.local`)
Remplacez les valeurs dans le fichier :

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Stripe - REMPLACEZ par votre vraie clé publique
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_VOTRE_CLE_PUBLIQUE_ICI"

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Mettre à jour les Price IDs dans le code

Ouvrez le fichier `apps/web/src/app/payment/page.tsx` et remplacez les Price IDs factices :

```typescript
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€9.99',
    priceId: 'price_VOTRE_PRICE_ID_STARTER', // 👈 Remplacez ici
    // ...
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€29.99',
    priceId: 'price_VOTRE_PRICE_ID_PRO', // 👈 Remplacez ici
    // ...
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '€99.99',
    priceId: 'price_VOTRE_PRICE_ID_ENTERPRISE', // 👈 Remplacez ici
    // ...
  }
]
```

### 6. Installer les dépendances et démarrer les serveurs

```bash
# À la racine du projet
npm install

# Démarrer l'API (terminal 1)
npm run dev --workspace=@saas/api

# Démarrer le frontend (terminal 2)
npm run dev --workspace=@saas/web
```

### 7. Tester la page de paiement

1. Ouvrez votre navigateur sur `http://localhost:3000`
2. Inscrivez-vous ou connectez-vous
3. Naviguez vers `http://localhost:3000/payment`
4. Cliquez sur "S'abonner" pour un plan
5. Vous serez redirigé vers Stripe Checkout

### 8. Cartes de test Stripe

Utilisez ces numéros de carte pour tester :

- **Paiement réussi** : `4242 4242 4242 4242`
- **Paiement échoué** : `4000 0000 0000 0002`
- **Requiert authentification** : `4000 0025 0000 3155`
- Date d'expiration : N'importe quelle date future (ex: 12/25)
- CVC : N'importe quel code à 3 chiffres (ex: 123)

### 9. Configuration des webhooks (optionnel)

1. Dans le dashboard Stripe, allez dans **Developers > Webhooks**
2. Cliquez sur **"Add endpoint"**
3. URL de l'endpoint : `http://localhost:3001/api/stripe/webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez la **Signing secret** (commence par `whsec_`)
6. Ajoutez-la dans `apps/api/.env.local` :
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_VOTRE_SIGNING_SECRET"
   ```

## ✅ Vérification que tout fonctionne

1. **Page de paiement** : `localhost:3000/payment` affiche les plans
2. **Redirection Stripe** : Cliquer sur "S'abonner" ouvre Stripe Checkout
3. **Test de paiement** : Utiliser `4242 4242 4242 4242` complète le paiement
4. **Page de succès** : Redirection vers `localhost:3000/success`
5. **Page d'annulation** : Annuler redirige vers `localhost:3000/cancel`

## 🚨 Problèmes courants

### Erreur : "Invalid publishable key"
- Vérifiez que votre clé publique est correcte dans `.env.local`
- Redémarrez le serveur frontend après modification

### Erreur : "No such price"
- Vérifiez que les Price IDs dans `payment/page.tsx` correspondent à ceux de Stripe
- Assurez-vous d'être en mode Test dans Stripe

### Erreur : "Authentication required"
- Assurez-vous d'être connecté avant d'accéder à `/payment`
- Vérifiez que le token JWT est valide

### Stripe Checkout ne s'ouvre pas
- Vérifiez que le script Stripe est chargé (F12 > Console)
- Vérifiez la clé publique dans les variables d'environnement

## 🎉 Prochaines étapes

Une fois que les paiements fonctionnent :
1. Implémenter les webhooks pour gérer les événements
2. Ajouter la gestion des abonnements (annulation, mise à jour)
3. Créer une page de facturation
4. Passer en mode Live pour la production

## 📞 Support

En cas de problème :
- Documentation Stripe : [stripe.com/docs](https://stripe.com/docs)
- Console de test Stripe : [dashboard.stripe.com](https://dashboard.stripe.com)
- Logs de l'API : Vérifiez la console du terminal API

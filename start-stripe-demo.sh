#!/bin/bash

# Script de test pour l'intégration Stripe
# Assure-toi d'avoir configuré les variables d'environnement avant de lancer

echo "🚀 Démarrage de l'intégration Stripe SaaS..."

# Vérifier que les variables d'environnement sont configurées
if [ -z "$STRIPE_SECRET_KEY" ] || [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo "❌ Variables d'environnement Stripe manquantes"
    echo "📝 Veuillez configurer :"
    echo "   - STRIPE_SECRET_KEY dans apps/api/.env.local"
    echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans apps/web/.env.local"
    echo ""
    echo "📖 Consultez STRIPE_SETUP.md pour plus d'informations"
    exit 1
fi

echo "✅ Variables d'environnement configurées"

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi"

# Démarrer l'API en arrière-plan
echo "🖥️ Démarrage de l'API..."
npm run dev --workspace=@saas/api &
API_PID=$!

# Attendre que l'API soit prête
sleep 5

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
npm run dev --workspace=@saas/web &
WEB_PID=$!

echo ""
echo "🎉 Application démarrée !"
echo ""
echo "📋 URLs disponibles :"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 API: http://localhost:3001"
echo "   💳 Page de paiement: http://localhost:3000/payment"
echo ""
echo "🧪 Pour tester les paiements, utilisez les cartes de test Stripe :"
echo "   ✅ Succès: 4242 4242 4242 4242"
echo "   ❌ Échec: 4000 0000 0000 0002"
echo "   📅 Date d'expiration: n'importe quelle date future"
echo "   🔒 CVC: n'importe quel code à 3 chiffres"
echo ""
echo "⏹️ Pour arrêter l'application, appuyez sur Ctrl+C"

# Attendre l'interruption
wait

# Nettoyer les processus
kill $API_PID $WEB_PID 2>/dev/null

echo "👋 Application arrêtée"

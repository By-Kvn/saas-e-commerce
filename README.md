# 🚀 SaaS Monorepo

A modern SaaS monorepo built with Turborepo, Next.js 15, Fastify, and Prisma.

## 📁 Project Structure

```
saas-monorepo/
├── apps/
│   ├── web/                 # Next.js 15 frontend (TypeScript)
│   └── api/                 # Fastify backend (TypeScript + Prisma)
├── packages/
│   ├── ui/                  # Shared React components library
│   └── types/               # Shared TypeScript types
├── docker-compose.yml       # Postgres, Redis, Mailhog
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json
```

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React 18** with modern hooks
- **Tailwind CSS** for styling (configured)

### Backend (`apps/api`)
- **Fastify** web framework
- **Prisma** ORM with PostgreSQL
- **JWT** authentication
- **Stripe** payment integration
- **Jest + Supertest** for testing

### Shared Packages
- **@saas/ui**: React components library
- **@saas/types**: TypeScript interfaces and types

### Infrastructure
- **PostgreSQL** database
- **Redis** for caching/sessions
- **Mailhog** for email testing
- **Docker Compose** for local development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### 1. Clone and Install
```bash
git clone <your-repo>
cd saas-monorepo
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual values (Stripe keys, etc.)
```

### 3. Start Infrastructure
```bash
npm run docker:up
```

### 4. Database Setup
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development
```bash
# From root directory
npm run dev
```

This will start:
- 🌐 Frontend: http://localhost:3000
- 🔥 API: http://localhost:3001
- 📧 Mailhog UI: http://localhost:8025
- 🗄️ PostgreSQL: localhost:5432
- 🔴 Redis: localhost:6379

## 📝 Available Scripts

### Root Scripts
```bash
npm run dev          # Start all apps in development
npm run build        # Build all apps
npm run start        # Start all apps in production
npm run test         # Run all tests
npm run lint         # Lint all apps
npm run type-check   # Type check all apps
npm run clean        # Clean all build outputs
```

### Database Scripts
```bash
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

### Docker Scripts
```bash
npm run docker:up    # Start services
npm run docker:down  # Stop services
```

## 🔧 Development

### Adding Dependencies
```bash
# Add to specific app
cd apps/web && npm install package-name

# Add to root (dev dependencies)
npm install -D package-name

# Add to shared package
cd packages/ui && npm install package-name
```

### Creating New Components
```bash
# In packages/ui/src/
touch NewComponent.tsx
# Export it in packages/ui/src/index.ts
```

### Database Changes
```bash
# Edit apps/api/prisma/schema.prisma
cd apps/api
npx prisma migrate dev --name description-of-change
```

## 🧪 Testing

### Backend Tests
```bash
cd apps/api
npm run test         # Run all tests
npm run test:watch   # Watch mode
```

### Example API Test
```bash
curl http://localhost:3001/api/hello
```

## 🏗️ API Endpoints

### Public Routes
- `GET /api/hello` - Test endpoint
- `POST /api/hello` - Test with body
- `GET /health` - Health check

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Routes
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile

### Stripe Integration
- `POST /api/stripe/create-checkout-session` - Create payment
- `POST /api/stripe/webhook` - Stripe webhooks

## 🔐 Authentication

JWT-based authentication with Prisma User model:
```typescript
// Register/Login returns:
{
  user: { id, email, name },
  token: "jwt_token"
}
```

## 💳 Stripe Integration

1. Set up Stripe keys in `.env`
2. Use `/api/stripe/create-checkout-session` to create payments
3. Webhook handles subscription updates automatically

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd apps/web
vercel --prod
```

### Railway/Render (Backend)
```bash
cd apps/api
# Deploy with your preferred service
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up
```

## 📚 Architecture Decisions

- **Turborepo**: Efficient monorepo builds and caching
- **TypeScript**: Full type safety across frontend and backend
- **Prisma**: Type-safe database access with migrations
- **Fastify**: High-performance backend framework
- **Next.js 15**: Latest React features with App Router
- **Shared packages**: Consistent types and UI across apps

## 🔐 Système d'authentification complet

### Fonctionnalités implémentées

✅ **Inscription avec email et mot de passe**
- Validation côté client et serveur
- Hash sécurisé des mots de passe (bcrypt)
- Envoi automatique d'email de vérification

✅ **Connexion/déconnexion sécurisée**
- JWT tokens avec expiration
- Gestion d'état centralisée avec React Context
- Protection automatique des routes

✅ **Vérification d'email avec lien de confirmation**
- Tokens temporaires sécurisés
- Interface de vérification intuitive
- Possibilité de renvoyer l'email

✅ **Récupération de mot de passe**
- Processus "Mot de passe oublié" complet
- Liens de réinitialisation temporaires (1h)
- Interface de définition de nouveau mot de passe

✅ **Protection des routes (middleware d'authentification)**
- Composant `ProtectedRoute` réutilisable
- Redirection automatique selon le statut
- Vérification optionnelle de l'email

✅ **Gestion de sessions avec JWT**
- Tokens stockés de manière sécurisée
- Middleware serveur pour la validation
- Déconnexion automatique à l'expiration

✅ **Page profil utilisateur avec modification**
- Modification nom et email
- Changement de mot de passe sécurisé
- Statut de vérification d'email

### Pages d'authentification disponibles

- `/login` - Connexion utilisateur
- `/register` - Inscription utilisateur  
- `/forgot-password` - Demande de réinitialisation
- `/reset-password?token=...` - Réinitialisation de mot de passe
- `/verify-email?token=...` - Vérification d'email
- `/dashboard` - Tableau de bord (protégé)
- `/profile` - Profil utilisateur (protégé)

### Configuration email requise

```env
# Configuration SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587" 
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-app"
FROM_EMAIL="noreply@votreapp.com"

# URL frontend (pour les liens dans les emails)
FRONTEND_URL="http://localhost:3000"
```

### API d'authentification

Le backend expose une API REST complète :

```
POST /api/auth/register         # Inscription
POST /api/auth/login           # Connexion
POST /api/auth/verify-email    # Vérification email
POST /api/auth/resend-verification # Renvoyer email
POST /api/auth/forgot-password # Mot de passe oublié
POST /api/auth/reset-password  # Réinitialiser mot de passe
GET  /api/auth/me             # Profil utilisateur (protégé)
PUT  /api/auth/profile        # Modifier profil (protégé)
POST /api/auth/change-password # Changer mot de passe (protégé)
POST /api/auth/logout         # Déconnexion
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy coding! 🎉**

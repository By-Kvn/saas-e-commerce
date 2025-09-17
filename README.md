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

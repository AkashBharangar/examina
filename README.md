# Examina - AI Assessment Creator Monorepo

Production-grade monorepo for an AI Assessment Creator platform. Built with modern technologies for scalability, performance, and developer experience.

## Project Overview

Examina is a comprehensive AI assessment management system designed to create, evaluate, and manage AI-generated assessments. The monorepo architecture enables clean separation of concerns with shared packages for types and configurations.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                     │
│                  apps/web - Port 3000                        │
└────────────────┬──────────────────────────┬─────────────────┘
                 │                          │
            Socket.io                    Fetch API
                 │                          │
┌────────────────▼──────────────────────────▼─────────────────┐
│                   Backend API (Express)                      │
│                  apps/api - Port 3000                        │
│         ┌─────────────────────────────────┐                  │
│         │  Routes, Middleware, Services   │                  │
│         │  Health Check, Error Handling   │                  │
│         └──────────┬──────────────────────┘                  │
└────────────────────┼───────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
     MongoDB      Redis      BullMQ Queues
     (Database)  (Cache)    (Job Processing)
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────▼────────────┐
        │  Worker (Node.js/BullMQ)│
        │   apps/worker           │
        │  Queue Job Processing   │
        └────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod

### Backend API
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Cache**: Redis (ioredis)
- **Queue**: BullMQ
- **Real-time**: Socket.io Server

### Worker
- **Runtime**: Node.js
- **Queue**: BullMQ
- **Cache**: Redis

### Shared Packages
- **types**: Shared TypeScript interfaces and types
- **config**: ESLint, Prettier, TypeScript configs
- **ui**: Tailwind CSS configuration and shadcn/ui setup

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: pnpm (strict dependency management)
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier, TypeScript

## Project Structure

```
examina/
├── apps/
│   ├── api/                    # Express backend server
│   │   ├── src/
│   │   │   ├── config/         # MongoDB, Redis, Socket.io, Queues
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── services/       # Business logic
│   │   │   └── index.ts        # Server entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/            # App router pages and layout
│   │   │   ├── components/     # React components
│   │   │   ├── store/          # Zustand store
│   │   │   ├── lib/            # Utilities (Socket.io, API client)
│   │   │   ├── styles/         # Global CSS and Tailwind
│   │   │   └── types/          # Local TypeScript types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── .env.example
│   │
│   └── worker/                 # BullMQ worker for async jobs
│       ├── src/
│       │   ├── processors/     # Job processors
│       │   └── index.ts        # Worker entry point
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── api.ts          # API types
│   │   │   ├── queues.ts       # Queue types
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                 # Shared configurations
│   │   ├── eslint.js
│   │   ├── prettier.js
│   │   ├── tsconfig.base.json
│   │   └── tsconfig.node.json
│   │
│   └── ui/                     # Tailwind and shadcn/ui config
│       ├── tailwind.config.js
│       ├── components.json
│       └── package.json
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── turbo.json                  # Turborepo configuration
├── docker-compose.yml          # Local development services
├── .gitignore
├── .editorconfig
├── .prettierrc.json
└── README.md
```

## Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0 (Install with: `npm install -g pnpm`)
- **Docker & Docker Compose**: For local services (MongoDB, Redis)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Create `.env.local` files in each app directory:

**apps/api/.env.local**
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://root:password@localhost:27017/examina?authSource=admin
REDIS_URL=redis://localhost:6379
SOCKET_IO_PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**apps/web/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_IO_URL=http://localhost:3001
```

**apps/worker/.env.local**
```bash
NODE_ENV=development
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start Services (Docker)

Start MongoDB and Redis containers:

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

### 4. Run Development Servers

In separate terminal windows:

**Terminal 1 - Frontend (http://localhost:3000)**
```bash
pnpm dev --filter @examina/web
```

**Terminal 2 - Backend API (http://localhost:3000)**
```bash
pnpm dev --filter @examina/api
```

**Terminal 3 - Worker**
```bash
pnpm dev --filter @examina/worker
```

Or run all at once:
```bash
pnpm dev
```

## Available Scripts

### Root Level

```bash
# Start all development servers
pnpm dev

# Build all applications
pnpm build

# Run ESLint across monorepo
pnpm lint

# Format code with Prettier
pnpm format

# Type check all packages
pnpm type-check

# Clean all build artifacts
pnpm clean
```

### App-Specific Scripts

```bash
# Frontend
pnpm dev --filter @examina/web
pnpm build --filter @examina/web

# Backend
pnpm dev --filter @examina/api
pnpm build --filter @examina/api

# Worker
pnpm dev --filter @examina/worker
pnpm build --filter @examina/worker
```

## API Endpoints

### Health Check
```bash
GET /health
```

Returns system health status including database, Redis, and Socket.io status.

**Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-05-24T10:30:00Z",
  "services": {
    "database": true,
    "redis": true,
    "socket": true
  }
}
```

## Database & Cache

### MongoDB
- **Container**: examina-mongodb
- **Port**: 27017
- **Auth**: root / password
- **Database**: examina

```bash
# Access MongoDB CLI
docker-compose exec mongodb mongosh
```

### Redis
- **Container**: examina-redis
- **Port**: 6379
- **No authentication** (development)

```bash
# Access Redis CLI
docker-compose exec redis redis-cli
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset data volumes
docker-compose down -v

# Restart services
docker-compose restart
```

## Code Quality

### ESLint
```bash
pnpm lint
```

### Prettier
```bash
pnpm format
```

### Type Checking
```bash
pnpm type-check
```

## Turborepo Features

### Caching
Turborepo caches build outputs, lint results, and test results:

```bash
# Clear cache
turbo prune --docker
```

### Running Tasks in Dependency Order
```bash
# Build respecting package dependencies
pnpm build
```

### Filtering
```bash
# Run tasks for specific package
pnpm dev --filter @examina/api

# Run tasks for package and its dependents
pnpm build --filter @examina/types...
```

## Deployment

### Building for Production

```bash
pnpm build
```

This generates optimized builds in:
- `apps/web/.next`
- `apps/api/dist`
- `apps/worker/dist`

### Docker Build

Create a `Dockerfile` for each app and use `docker-compose` for orchestration in production:

```bash
docker-compose -f docker-compose.prod.yml up
```

## Troubleshooting

### Port Already in Use
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Reset MongoDB
docker-compose down -v
docker-compose up -d mongodb
```

### Dependencies Not Installing
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
```bash
# Rebuild type files
pnpm type-check

# Clear TypeScript cache
find . -name "*.tsbuildinfo" -delete
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** and test locally with `pnpm dev`

3. **Type check and lint**
   ```bash
   pnpm type-check
   pnpm lint
   ```

4. **Format code**
   ```bash
   pnpm format
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

## Environment Variables

### Backend (apps/api)
| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode |
| `PORT` | 3000 | API server port |
| `MONGODB_URI` | mongodb://root:password@localhost:27017/examina | MongoDB connection |
| `REDIS_URL` | redis://localhost:6379 | Redis connection |
| `SOCKET_IO_PORT` | 3001 | Socket.io server port |
| `CORS_ORIGIN` | http://localhost:3000 | CORS allowed origin |

### Frontend (apps/web)
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:3000 | Backend API URL |
| `NEXT_PUBLIC_SOCKET_IO_URL` | http://localhost:3001 | Socket.io URL |

### Worker (apps/worker)
| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode |
| `REDIS_URL` | redis://localhost:6379 | Redis connection |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |

## Contributing

1. Keep commits atomic and well-described
2. Follow the existing code style
3. Test your changes locally
4. Run `pnpm lint` and `pnpm type-check` before committing
5. Create focused, reviewable PRs

## License

Private - Examina Project

## Support

For issues or questions about the setup, refer to the troubleshooting section or check existing issues.

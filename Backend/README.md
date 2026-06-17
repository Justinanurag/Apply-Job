# AgentPro Authentication API

Production-ready authentication backend built with Node.js, Express, PostgreSQL (Neon), and JWT.

## Features

- User registration, login, logout
- JWT access tokens (15 min) + refresh tokens (7 days, HttpOnly cookie)
- Get current user, refresh token, change password
- Forgot / reset password flow
- Role-based authorization (`user`, `admin`)
- Validation, rate limiting, helmet, CORS, centralized error handling

## Quick Start

```bash
cd Backend
npm install
npm run db:push    # create tables on Neon
npm run dev
```

API runs at `http://localhost:5000`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DATABASE_URL` | Neon **pooled** connection string (`-pooler` hostname) |
| `DIRECT_URL` | Neon **direct** connection string (for Prisma migrations) |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `ACCESS_TOKEN_EXPIRY` | Access token TTL (default: 15m) |
| `REFRESH_TOKEN_EXPIRY` | Refresh token TTL (default: 7d) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS (default: http://localhost:8080) |

### Neon connection strings

From the Neon dashboard, use:

- **Pooled** (`DATABASE_URL`) — for the running app (`…-pooler.….neon.tech`)
- **Direct** (`DIRECT_URL`) — for `prisma db push` / migrations (hostname without `-pooler`)

If `DIRECT_URL` is omitted, it is auto-derived from `DATABASE_URL` by removing `-pooler`.

## Database Commands

```bash
npm run db:push      # sync schema to Neon (dev)
npm run db:migrate   # create migration files
npm run db:generate  # regenerate Prisma client
npm run db:studio    # open Prisma Studio
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, sets refresh cookie |
| POST | `/api/auth/logout` | Yes | Logout, clears cookie |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/refresh-token` | Cookie | Refresh access token |
| POST | `/api/auth/change-password` | Yes | Change password |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password/:token` | No | Reset password |

## Project Structure

```
prisma/
  schema.prisma     # PostgreSQL schema (Neon)
src/
  config/           # Database & env
  controllers/      # Route handlers
  middlewares/      # Auth, roles, validation, errors
  models/           # User repository (Prisma)
  routes/           # Express routers
  services/         # Business logic
  utils/            # Helpers
  models/           # User repository (Prisma)
  routes/           # Express routers
  services/         # Business logic
  utils/            # Helpers
```

# Architecture — CareerHub AI

## System Overview

CareerHub AI is a multi-tenant SaaS career platform built as a Turborepo monorepo. This document covers all key architectural decisions.

---

## Monorepo Structure

```
careerhub-ai/
├── apps/
│   ├── web/          React 19 + Vite (Vercel)
│   ├── server/       Node.js + Express + MongoDB (Render)
│   ├── mobile/       React Native + Expo
│   └── admin/        Admin Dashboard (Vercel)
├── packages/
│   └── shared/       Types, schemas, constants, utils
├── docs/
├── scripts/
└── .github/
```

**Why a monorepo?**
- Single source of truth for TypeScript types (no API contract drift)
- Shared Zod schemas validated on both client AND server
- Atomic commits across apps
- Easier cross-package refactoring

---

## Frontend Architecture

### Feature-Sliced Design

Each feature is fully isolated:

```
src/features/auth/
├── components/    UI components specific to this feature
├── hooks/         Custom React hooks (data fetching, state)
├── services/      API call functions (not hooks)
├── pages/         Route-level page components
├── types/         Feature-local TypeScript interfaces
├── validation/    Zod schemas (or re-exports from shared)
└── index.ts       Public API of this feature
```

**Rules:**
- Features CANNOT import from other features (use shared/ instead)
- All external data access goes through services/
- Pages are thin — they compose components, not business logic

### State Management

| Concern | Tool |
|---------|------|
| Server state (API data) | TanStack Query |
| Global client state | Redux Toolkit |
| Local component state | useState/useReducer |
| Form state | React Hook Form |
| URL state | React Router search params |

**TanStack Query handles:** caching, background refetching, optimistic updates, pagination, infinite scroll.
**Redux handles:** auth session, UI preferences, notifications, realtime events.

---

## Backend Architecture

### Layered Architecture

```
Request
  → Route (HTTP binding)
    → Middleware (auth, validation, rate limit)
      → Controller (HTTP orchestration)
        → Service (business logic)
          → Repository (data access)
            → Model (Mongoose schema)
```

**Each layer is strictly separated:**
- Controllers never touch MongoDB directly
- Services never import from routes
- Repositories only import from models

### Error Handling

All errors flow through the centralized `errorMiddleware`:
1. Controller calls `asyncHandler` (no try/catch)
2. Any error is forwarded to `next(error)`
3. `errorMiddleware` normalizes to `ApiErrorResponse` shape
4. Client receives consistent `{ success: false, message, error: { code, details } }`

---

## API Design

### Response Envelope

All responses follow this shape:

```json
// Success
{
  "success": true,
  "message": "User profile fetched",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [{ "field": "email", "message": "Invalid email" }]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Paginated
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "hasNextPage": true
  }
}
```

### Authentication Flow

1. User registers → OTP sent to email
2. User verifies OTP → `AccountStatus` changes to `active`
3. Login → server issues `accessToken` (15m) + `refreshToken` (7d)
4. Client stores tokens in localStorage
5. Axios interceptor injects `Authorization: Bearer <token>` on every request
6. On 401 → Axios interceptor calls `/auth/refresh` with refreshToken
7. If refresh fails → `auth:logout` event dispatched → Redux clears session → redirect to login

### Role-Based Access Control

```
STUDENT < FRESHER < PROFESSIONAL < RECRUITER < COLLEGE_ADMIN < ADMIN < SUPER_ADMIN
```

Use `requireRole()` or `requireMinRole()` middleware on protected routes.

---

## Security Measures

| Layer | Measure |
|-------|---------|
| HTTP | Helmet (CSP, HSTS, X-Frame) |
| CORS | Whitelist-only origin validation |
| Rate Limiting | 100 req/15min global, 10 req/15min auth |
| Passwords | bcrypt (12 rounds) |
| Tokens | JWT HS256, short-lived access tokens |
| OTP | Cryptographically secure (crypto.randomInt) |
| Uploads | Type + size validation, Cloudinary CDN |
| Mongo | Mongoose strict schema, query injection prevention |

---

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Web | Vercel | Auto-deploy from main branch |
| Server | Render | Docker-less, auto-deploy |
| Database | MongoDB Atlas | M10+ for production |
| Storage | Cloudinary | CDN-backed, transformations |
| Email | Nodemailer → Gmail/SES | SMTP via env |

---

## Scaling Considerations

- **Horizontal scaling**: Server is stateless (JWT auth, no sessions)
- **Database**: MongoDB Atlas auto-scaling, connection pooling (max: 10)
- **Caching**: TanStack Query client-side; Redis can be added for server-side
- **CDN**: Cloudinary for all media; Vercel Edge for web
- **Queues**: Bull (Redis) to be added for AI processing jobs
- **Socket.io**: Use Redis adapter when scaling to multiple server instances

# CareerHub AI

<div align="center">

![CareerHub AI Logo](./docs/assets/logo.png)

**A production-grade AI-powered career platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

</div>

---

## Overview

CareerHub AI is an AI-powered career platform connecting students, freshers, professionals, recruiters, and colleges. Built as a production SaaS application with a scalable monorepo architecture.

## Monorepo Structure

```
careerhub-ai/
├── apps/
│   ├── web/          → React 19 + Vite + TypeScript (Vercel)
│   ├── server/       → Node.js + Express + MongoDB (Render)
│   ├── mobile/       → React Native + Expo
│   └── admin/        → Admin Dashboard
├── packages/
│   └── shared/       → Shared types, schemas, utils, constants
├── docs/             → Architecture docs, API reference
├── scripts/          → Developer automation scripts
└── .github/          → CI/CD workflows
```

## Tech Stack

| Layer        | Technology                                          |
|--------------|-----------------------------------------------------|
| Frontend     | React 19, Vite, TypeScript, Tailwind CSS            |
| State        | Redux Toolkit, TanStack Query                       |
| Forms        | React Hook Form + Zod                               |
| Animation    | Framer Motion                                       |
| Backend      | Node.js, Express.js, TypeScript                     |
| Database     | MongoDB + Mongoose (MongoDB Atlas)                  |
| Auth         | JWT, Refresh Tokens, OAuth, OTP                     |
| Storage      | Cloudinary                                          |
| Email        | Nodemailer                                          |
| Realtime     | Socket.io                                           |
| Monorepo     | npm workspaces + Turborepo                          |
| Deployment   | Vercel (web) + Render (server) + MongoDB Atlas      |

## Quick Start

### Prerequisites
- Node.js >= 20
- npm >= 10
- MongoDB Atlas connection string

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/careerhub-ai.git
cd careerhub-ai

# Install all dependencies (all workspaces)
npm install

# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env

# Start all apps in development
npm run dev

# Or start individually
npm run dev:web
npm run dev:server
```

### Available Scripts

| Command              | Description                         |
|----------------------|-------------------------------------|
| `npm run dev`        | Start all apps in parallel          |
| `npm run dev:web`    | Start frontend only                 |
| `npm run dev:server` | Start backend only                  |
| `npm run build`      | Build all apps for production       |
| `npm run lint`       | Run ESLint across all packages      |
| `npm run format`     | Format all files with Prettier      |
| `npm run typecheck`  | TypeScript type-check all packages  |
| `npm test`           | Run all tests                       |

## Architecture Decisions

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture decisions.

## API Reference

See [docs/API.md](./docs/API.md) for REST API documentation.

## Contributing

See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.

## Environment Variables

See [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) for all environment variable documentation.

## License

MIT © CareerHub AI

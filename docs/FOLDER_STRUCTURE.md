# CareerHub AI — Monorepo Folder Structure

```
careerhub-ai/
├── .github/              # GitHub Actions CI/CD workflows & PR templates
├── .vscode/              # VS Code workspace settings & recommended extensions
├── apps/
│   ├── admin/            # Admin Panel Web Portal (React 19 + Vite)
│   ├── mobile/           # Cross-platform Mobile App (React Native + Expo)
│   ├── server/           # Backend REST & Realtime Server (Express + Node + Socket.io)
│   └── web/              # Job Seeker & Recruiter Web Portal (React 19 + Vite + Tailwind)
├── docs/                 # Platform technical architecture & guides
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   ├── DEVELOPMENT.md
│   ├── ENVIRONMENT.md
│   ├── FOLDER_STRUCTURE.md
│   └── INSTALLATION.md
├── packages/
│   └── shared/           # Shared TypeScript types, Zod schemas, & enums
├── scripts/              # Infrastructure automation & deployment scripts
├── .env.example          # Master environment variable template
├── .gitignore
├── eslint.config.js      # Monorepo linting rules
├── package.json          # Root workspace configuration
├── README.md             # Project overview
├── tsconfig.json         # Base TypeScript configuration
└── turbo.json            # Turborepo task pipeline configuration
```

### Backend (`apps/server/src/`)
```
apps/server/src/
├── config/               # Database, Cloudinary, Mailer, Cors & Socket configs
├── constants/            # HTTP status codes & constants
├── controllers/          # Request controllers
├── errors/               # Domain error classes & exception handlers
├── middlewares/          # Auth, Rate limiting, CORS, Security headers, Error handler
├── models/               # 50+ Mongoose models across 8 domain modules
├── plugins/              # Mongoose global plugins (Soft Delete, Pagination)
├── routes/               # API route definitions
├── services/             # Storage, Email, OAuth, Auth, Token & Session services
├── types/                # Express request extensions
├── utils/                # Async handler, Hash, JWT, Logger, Response helpers
├── app.ts                # Express application bootstrap
└── server.ts             # HTTP & Socket.io server entry point
```

# Contributing to CareerHub AI

## Prerequisites

- Node.js >= 20
- npm >= 10
- Git

## Setup

```bash
git clone https://github.com/your-org/careerhub-ai.git
cd careerhub-ai
npm install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

## Coding Standards

### TypeScript
- Strict mode is enforced — no `any` without explicit justification comment
- Use `type` for interfaces when possible
- Export types from the appropriate package (shared vs local)

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `auth.service.ts` |
| Components | PascalCase | `LoginForm.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Enum values | SCREAMING_SNAKE | `UserRole.STUDENT` |

### Component Rules
- One component per file
- Always export named (not default) from feature files
- Use `forwardRef` for form elements
- All interactive elements must have accessible labels

### API Rules
- All routes use `asyncHandler` — no bare async controllers
- All request bodies validated with `validate()` middleware
- All responses use `sendSuccess()` / `sendError()` / `sendPaginated()`
- All errors extend `AppError`

## Git Workflow

```bash
# Branch naming
git checkout -b feat/resume-builder
git checkout -b fix/auth-refresh-bug
git checkout -b chore/update-deps
git checkout -b docs/api-reference

# Commit messages (Conventional Commits)
git commit -m "feat(auth): add OTP email verification"
git commit -m "fix(resume): correct ATS score calculation"
git commit -m "chore(deps): update mongoose to 8.5"
```

## Pull Request Process

1. Branch from `develop`, not `main`
2. Fill out the PR template completely
3. Ensure all CI checks pass
4. Request review from at least one team member
5. Squash-merge into `develop`

## Environment Variables

When adding a new env var:
1. Add to `.env.example` with a comment
2. Add to `env.config.ts` (server) or `env.ts` (web) with Zod validation
3. Update `docs/ENVIRONMENT.md`

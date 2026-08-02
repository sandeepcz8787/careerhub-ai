# CareerHub AI — Development Guide

## Workflows & Commands

### 1. Development Mode
Run all applications and packages concurrently with live reload:

```bash
npm run dev
```

Target specific apps:
```bash
npm run dev --filter=@careerhub/server
npm run dev --filter=@careerhub/web
npm run dev --filter=@careerhub/mobile
npm run dev --filter=@careerhub/admin
```

---

### 2. Code Quality & Linting
Validate TypeScript types and ESLint across the monorepo:

```bash
npm run typecheck
npm run lint
npm run lint:fix
```

---

### 3. Production Build
Build all apps and packages for production:

```bash
npm run build
```

---

### 4. Git Commit Standards
We follow **Conventional Commits**:
- `feat(scope)`: New feature
- `fix(scope)`: Bug fix
- `docs(scope)`: Documentation update
- `refactor(scope)`: Code refactoring
- `test(scope)`: Adding/modifying tests
- `chore(scope)`: Build script or dependency update

Example:
```bash
git commit -m "feat(auth): implement google oauth verification strategy"
```

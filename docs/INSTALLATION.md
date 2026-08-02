# CareerHub AI — Installation Guide

This guide covers the step-by-step installation instructions to set up **CareerHub AI** locally.

---

## Prerequisites

Ensure you have the following installed on your development workstation:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Git**: `v2.x` or higher
- **MongoDB Atlas Account** or local MongoDB instance (`v7.x+`)

---

## Step 1: Clone Repository

```bash
git clone https://github.com/sandeepcz8787/careerhub-ai.git
cd careerhub-ai
```

---

## Step 2: Install Dependencies

Install monorepo workspace dependencies at root:

```bash
npm install
```

---

## Step 3: Configure Environment Variables

Copy `.env.example` to `.env` in `apps/server`:

```bash
cp apps/server/.env.example apps/server/.env
```

Configure your credentials in `apps/server/.env`:
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `SMTP_USER`, `SMTP_PASS` / `BREVO_API_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

## Step 4: Build Shared Package

Build shared types and validation schemas:

```bash
npm run build --filter=@careerhub/shared
```

---

## Step 5: Start Development Servers

Start server and web apps concurrently via Turbo:

```bash
npm run dev
```

The services will be accessible at:
- **Web App**: `http://localhost:5173`
- **Server API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/health`

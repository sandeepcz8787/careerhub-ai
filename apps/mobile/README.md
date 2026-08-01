# CareerHub AI Mobile

React Native + Expo mobile application.

## Architecture

```
apps/mobile/
├── app/                 ← Expo Router file-based routing
│   ├── (auth)/          ← Auth screens (login, register)
│   ├── (tabs)/          ← Main tab navigation
│   └── _layout.tsx      ← Root layout
├── components/          ← Shared components
│   ├── ui/              ← Design system components
│   └── layout/          ← Navigation layouts
├── features/            ← Feature modules (mirrors web)
├── hooks/               ← Custom React Native hooks
├── services/            ← API services (shared with web)
├── store/               ← Redux store
└── assets/              ← Images, fonts, icons
```

## Getting Started

```bash
cd apps/mobile
npm install
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
```

## Shared Code

This app consumes `@careerhub/shared` for:
- TypeScript types
- Zod validation schemas
- Utility functions
- API response types

API calls use the same Axios instance pattern as the web app.

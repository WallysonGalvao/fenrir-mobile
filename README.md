# Fenrir — Expo Boilerplate

Opinionated boilerplate for React Native apps with Expo, focused on eliminating initial configuration time and being productive from the first commit.

Inspired by [Ignite](https://github.com/infinitered/ignite), with choices aligned to the modern Expo ecosystem.

## What's already configured

- **Expo SDK 55** + Expo Router (typed routes, file-based)
- **NativeWind v5** + Tailwind CSS v4 (universal styling — iOS/Android/Web)
- **Supabase** (auth, database, backend)
- **Zustand** + MMKV (global state with persistent storage)
- **TanStack React Query v5** + MMKV persistence (offline cache)
- **Zod v4** + React Hook Form (schema validation + form handling)
- **i18next** + expo-localization (EN + PT-BR, auto-detection)
- **Sentry** (error tracking + source maps)
- **Reanimated v4** + Gesture Handler (animations and gestures)
- **React Compiler** enabled (automatic optimization)
- **Dark mode** native with themed components
- **ESLint v9** (flat config) + Prettier + Knip (dead code detection)
- **Jest** + React Native Testing Library (unit + component tests)
- **Rozenite Dev Tools** (inspector for queries, storage, network, navigation)

## Auth (ready to use)

Complete authentication flow built with Supabase:

- **Landing** — branded entry screen with create account / sign in
- **Sign In** — email + password with validation
- **Sign Up** — email + password with terms/privacy links + email confirmation
- **Reset Password** — sends reset link via email
- **Set New Password** — deep-linked password update with confirmation

Each feature follows a modular architecture:

```
src/features/auth/[feature]/
├── index.tsx           # Main component
├── index.test.tsx      # Component tests
├── schema.ts           # Zod validation schema
├── success-step.tsx    # Success screen (when applicable)
└── hooks/
    ├── use-[feature].tsx
    └── use-[feature].test.tsx
```

## Get started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/boilerplate

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the project
npx expo start
```

## Environment variables

| Variable            | Description            |
| ------------------- | ---------------------- |
| `SENTRY_DSN`        | Sentry project DSN     |
| `EAS_PROJECT_ID`    | EAS project ID         |
| `SUPABASE_URL`      | Supabase project URL   |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |

## Structure

```
src/
├── app/            # Routes (Expo Router file-based)
│   ├── (app)/      # Authenticated routes
│   └── (public)/   # Public routes (auth screens)
├── components/     # Reusable components (Button, Input, Header, Toast…)
├── config/         # Service initialization (Sentry, React Query)
├── constants/      # Theme, colors, time constants
├── features/       # Feature modules (auth)
├── hooks/          # Custom hooks (useTheme, useColorScheme…)
├── i18n/           # Translations (EN, PT-BR)
├── lib/            # Third-party clients (Supabase)
├── schemas/        # Shared Zod schemas
├── services/       # API service layers
├── stores/         # Zustand stores (auth)
└── utils/          # Utilities + test helpers
```

## Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm start`             | Start the development server |
| `npm run ios`           | Open on iOS simulator        |
| `npm run android`       | Open on Android emulator     |
| `npm run web`           | Open in browser              |
| `npm test`              | Run tests                    |
| `npm run test:coverage` | Run tests with coverage      |
| `npm run lint`          | Check for lint errors        |
| `npm run lint:fix`      | Fix lint errors              |
| `npm run format`        | Format code with Prettier    |
| `npm run format:check`  | Check formatting             |
| `npm run knip:check`    | Detect unused code           |
| `npm run reset-project` | Reset to a blank project     |

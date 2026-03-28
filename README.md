# Fenrir — Expo Boilerplate

Opinionated boilerplate for React Native apps with Expo, focused on eliminating initial configuration time and being productive from the first commit.

Inspired by [Ignite](https://github.com/infinitered/ignite), with choices aligned to the modern Expo ecosystem.

## What's already configured

**Core**

- **React 19** + **React Native 0.83** + **Expo SDK 55** + Expo Router (typed routes, file-based)
- **NativeWind v5** + Tailwind CSS v4 (universal styling — iOS/Android/Web)
- **Gluestack UI v5** (accessible component primitives, headless)
- **React Compiler** enabled (automatic memoization)
- **Dark mode** — native system-aware with CSS variable tokens

**Data & State**

- **Supabase** (auth, database, realtime, backend)
- **Zustand 5** + **MMKV** (global state with persistent storage)
- **TanStack React Query v5** + MMKV persistence (offline cache)
- **Zod v4** + React Hook Form (schema validation + form handling)

**UX & Animations**

- **Reanimated v4** + **@legendapp/motion** + Gesture Handler (animations and gesture support)
- **Quick Actions** — iOS home screen shortcuts and Android shortcuts (pre-wired with i18n and routing)

**Internationalization**

- **i18next** + expo-localization (EN + PT-BR, automatic locale detection)

**Security & Reliability**

- **Device security check** — jailbreak/root detection at app startup (`checkDeviceIntegrity`)
- **App version check** — detects outdated versions against App Store / Play Store, supports forced and optional update flows

**Ops & Quality**

- **Sentry** (error tracking + source maps, per-variant DSN)
- **EAS Build** — three pre-configured variants: `development`, `preview`, `production` (with separate bundle IDs and names)
- **ESLint v9** (flat config) + Prettier + Knip (dead code detection)
- **Jest 29** + React Native Testing Library (unit + component tests, coverage configured)
- **Rozenite Dev Tools** — in-app inspector for React Query cache, MMKV storage, network activity, React Navigation state, and Metro bundle atlas

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
├── app/              # Routes (Expo Router file-based)
│   ├── (app)/        # Authenticated routes
│   └── (public)/     # Public routes (auth screens)
├── components/       # Reusable components (Button, Input, Header, Toast…)
├── config/           # Service initialization (Sentry, React Query)
├── constants/        # Colors, spacing, fonts, time constants
├── features/         # Feature modules (auth)
├── hooks/            # Custom hooks (useTheme, useColorScheme, useVersionCheck…)
├── i18n/             # Translations (EN, PT-BR)
├── lib/              # Third-party clients (Supabase)
├── quick-actions/    # iOS/Android home screen shortcuts
├── schemas/          # Shared Zod schemas (email, password…)
├── services/         # API service layers (auth state listener…)
├── stores/           # Zustand stores (auth session)
├── types/            # Shared TypeScript utility types
└── utils/            # Utilities + test helpers
```

## Customization

The sections below list every file you need to touch to personalize the boilerplate for a new project. Follow them in order for a clean setup.

### 1. App identity

| File            | What to change                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app.config.ts` | `name`, `slug`, `owner`, bundle identifiers for each variant (`development`, `preview`, `production`), deep-link scheme |
| `eas.json`      | `cli.version`, `build.*.env.APP_VARIANT`, submit profile settings                                                       |
| `assets/`       | Replace `icon.png` and `adaptive-icon.png` with your own icon artwork                                                   |

Change the splash screen background color and image inside the `expo-splash-screen` plugin entry in `app.config.ts`:

```ts
['expo-splash-screen', { backgroundColor: '#YOUR_COLOR', image: './assets/images/splash.png' }];
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your project-specific values:

```
SENTRY_DSN=        # from sentry.io → Project Settings → Client Keys
EAS_PROJECT_ID=    # from expo.dev → your project
SUPABASE_URL=      # from supabase.com → Project Settings → API
SUPABASE_ANON_KEY= # from supabase.com → Project Settings → API
```

### 3. Theme & visual identity

**Design tokens (colors, spacing, fonts)**

Edit `src/constants/theme.ts` to update the `Colors` palette (light + dark variants) and `Fonts`/`Spacing` values used throughout the app.

**CSS variables (Tailwind + NativeWind)**

Edit `src/global.css` to change the CSS custom properties that drive Tailwind utility classes. Every color token used in `className` props maps to a variable here:

```css
:root {
  --primary: 108 207 209;
  --background: 255 255 255;
  /* … */
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary: 62 214 161;
    --background: 11 31 58;
    /* … */
  }
}
```

### 4. Internationalization

| File                | What to change                                         |
| ------------------- | ------------------------------------------------------ |
| `src/i18n/en.ts`    | English strings                                        |
| `src/i18n/pt.ts`    | Portuguese-BR strings                                  |
| `src/i18n/index.ts` | Add or remove language resources; change `fallbackLng` |

To add a new language, create `src/i18n/fr.ts` (for example) and register it in `src/i18n/index.ts`:

```ts
import fr from './fr';
// …
resources: { en: { translation: en }, pt: { translation: pt }, fr: { translation: fr } }
```

### 5. Backend (Supabase)

| File                   | What to change                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `src/lib/supabase.ts`  | Supabase client options (storage adapter, auth settings)                                  |
| `src/services/auth.ts` | Auth state listener — adapt if switching to a different auth provider                     |
| `src/stores/auth.ts`   | Session store — update the `Session` type and MMKV storage key if your user shape differs |

### 6. Authentication screens

Each auth screen lives in its own self-contained module under `src/features/auth/`. You can:

- **Remove** a flow (e.g. sign-up) by deleting `src/features/auth/sign-up/` and removing the corresponding route from `src/app/(public)/`.
- **Adapt** a flow by editing `schema.ts` (validation rules) and `hooks/use-[feature].tsx` (business logic) without touching the UI layer.
- **Add** a new flow by creating a new directory following the same structure.

### 7. Quick actions

Edit `src/quick-actions/constants.ts` to define the shortcuts shown on the app icon (iOS long-press / Android long-press):

```ts
export const getQuickActions = (t: TFunction): Action[] => [
  {
    id: 'my-action',
    title: t('quickAction.myAction.title'),
    icon: 'symbol:star.fill', // SF Symbol (iOS) or shortcut_* (Android)
    params: { href: '/my-screen' },
  },
];
```

Add the corresponding i18n keys to `src/i18n/en.ts` and `src/i18n/pt.ts`, then handle routing in `src/quick-actions/use-quick-action-routing.ts`.

### 8. Error tracking (Sentry)

Edit `src/config/sentry.ts` to adjust Sentry initialization options (sample rates, ignored errors, integrations). The DSN is injected at build time via the `SENTRY_DSN` environment variable — no hardcoded values needed.

### 9. EAS build profiles

Adjust `eas.json` to match your distribution strategy:

```jsonc
{
  "build": {
    "development": {
      /* internal distribution, dev client */
    },
    "preview": {
      /* APK build for internal testers   */
    },
    "production": {
      /* store submission, app bundle     */
    },
  },
}
```

Each profile picks up its `APP_VARIANT` env var, which `app.config.ts` uses to select the correct name, bundle ID, and Sentry DSN.

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

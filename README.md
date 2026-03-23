# Fenrir — Expo Boilerplate

Opinionated boilerplate for React Native apps with Expo, focused on eliminating initial configuration time and being productive from the first commit.

Inspired by [Ignite](https://github.com/infinitered/ignite), with choices aligned to the modern Expo ecosystem.

## What's already configured

- **Expo SDK 55** + Expo Router (typed routes, file-based)
- **NativeWind v5** + Tailwind CSS v4 (universal styling — iOS/Android/Web)
- **TanStack React Query v5** + MMKV persistence (offline cache)
- **i18next** + expo-localization (EN + PT-BR, auto-detection)
- **Sentry** (error tracking + source maps)
- **Reanimated v4** + Gesture Handler (animations and gestures)
- **React Compiler** enabled (automatic optimization)
- **Dark mode** native with themed components
- **ESLint v9** (flat config) + Prettier + Knip (dead code detection)
- **Rozenite Dev Tools** (inspector for queries, storage, network, navigation)

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

| Variable         | Description        |
| ---------------- | ------------------ |
| `SENTRY_DSN`     | Sentry project DSN |
| `EAS_PROJECT_ID` | EAS project ID     |

## Structure

```
src/
├── app/          # Routes (Expo Router file-based)
├── components/   # Reusable components
├── config/       # Service initialization (Sentry, React Query)
├── constants/    # Theme, colors, time constants
├── hooks/        # Custom hooks
├── i18n/         # Translations (EN, PT-BR)
└── utils/        # Utilities
```

## Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm start`             | Start the development server |
| `npm run ios`           | Open on iOS simulator        |
| `npm run android`       | Open on Android emulator     |
| `npm run web`           | Open in browser              |
| `npm run lint`          | Check for lint errors        |
| `npm run format`        | Format code with Prettier    |
| `npm run knip:check`    | Detect unused code           |
| `npm run reset-project` | Reset to a blank project     |

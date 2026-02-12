# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```

In the output you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

You can start developing by editing files in the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Reset starter code

When you're ready, run:

```bash
npm run reset-project
```

This moves the starter code to the **app-example** directory and creates a blank **app** directory for development.

## Environment variables

This repository supports local environment variables. Follow these rules:

- Client-safe variables (exposed to the app) must be prefixed with `EXPO_PUBLIC_` and belong in `/.env.local` at the project root. Example:

```dotenv
# .env.local (client-visible)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

- Server-only secrets (service role keys, admin tokens) must never be exposed to the client. Put those in `/.env.local.server` and do not commit that file. Example:

```dotenv
# .env.local.server (server-only)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

Detailed guidance is in `ENVIRONMENT.md`.

The project already ignores local env files via `.gitignore` (`.env*.local`).

## Learn more

To learn more about developing your project with Expo, see:

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

## Join the community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)

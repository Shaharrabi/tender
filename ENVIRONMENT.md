Environment variables

This project supports local environment variables. Follow these guidelines:

- Client-safe variables (exposed to the app) must be prefixed with `EXPO_PUBLIC_` and can go in `.env.local` at the project root. Example:

```
# .env.local (client-visible)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

- Server-only secrets (service role keys, admin tokens) must never be exposed to the client. Put those in `.env.local.server` and do not commit that file to git. Example:

```
# .env.local.server (server-only)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

The repository already ignores local env files via `.gitignore` (`.env*.local`).

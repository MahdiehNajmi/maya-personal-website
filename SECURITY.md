# Security — keeping API keys private

## What must stay secret

| Variable | Where it lives | Must NOT use `NEXT_PUBLIC_` |
|----------|----------------|------------------------------|
| `GEMINI_API_KEY` | Vercel Production + `.env.local` | Yes — server only |
| `RESEND_API_KEY` | Vercel / `.env.local` | Yes — server only |
| `DATABASE_URL`, `POSTGRES_*`, `PGPASSWORD` | Vercel / `.env.production.local` | Yes — server only |
| `NEON_*`, `VERCEL_OIDC_TOKEN` | Vercel pull only | Yes — never commit |

## Safe to be public

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL only |
| `NEXT_PUBLIC_MAHI_GEMINI_TTS` | `true` / `false` flag only — not a key |

## Git rules

1. **Never commit** `.env.local`, `.env.production.local`, or any file containing real keys.
2. Only **`.env.example`** is tracked — use placeholders like `your_gemini_api_key_here`.
3. Before pushing: `git status` must not list `.env*` files (except `.env.example`).

## Where keys are used (server-side only)

- `/api/chat` — Gemini text replies
- `/api/tts` — Gemini speech (optional)
- `/api/contact` — Resend email (optional)

The browser only calls these routes; it never receives your API keys.

## Vercel

- Set secrets in **Project → Settings → Environment Variables**.
- Do not paste keys into GitHub Issues, README, or chat logs.
- `vercel env pull` writes to ignored files — do not upload those files anywhere.

## If a key was ever committed

1. Rotate the key in Google AI Studio / Resend / Neon immediately.
2. Remove it from git history (e.g. `git filter-repo` or GitHub secret scanning).
3. Update Vercel production variables with the new key.

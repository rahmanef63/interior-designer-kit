# @id/web — Next.js app (web plane)

Studio app + client portal. Deploys to Vercel.

```bash
pnpm --filter @id/web dev
```

Env (`.env.local`): `NEXT_PUBLIC_CONVEX_URL`. AI keys are **not** set here — web
users enter their own in `/settings` (BYOK, encrypted in Convex).

Routes: `/` landing · `/dashboard` 16-stage pipeline · `/projects` list ·
`/projects/[projectId]` detail · `/settings` BYOK.

The pipeline reads stage/role definitions from `@id/core`, so the workflow stays
in sync with the backend and the local runner.

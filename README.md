# Brew Tuner — public site

The marketing and support site for the [Brew Tuner](https://github.com/antschmidt/brewtuner) coffee dial-in app (iOS + Android).

Live at: _coming soon_

## Stack

- SvelteKit on Vercel (`@sveltejs/adapter-vercel`). Every route is prerendered (see `src/routes/+layout.ts`), so the deployed output is effectively static — no functions, no runtime.
- Plain CSS with custom properties (no Tailwind / no build-time CSS framework). Light/dark via `prefers-color-scheme`.
- Hosted on Vercel.

## Routes

- `/` — landing page
- `/support` — FAQ, contact, troubleshooting (required for App Store / Play Store submission)
- `/privacy` — privacy policy (required for App Store / Play Store submission)
- `/changelog` — release notes

## Develop

```bash
pnpm install
pnpm dev      # vite dev server on http://localhost:5173
pnpm build    # prerendered output → .svelte-kit/output
pnpm preview  # serves the build locally
```

## Deploy

Push to `main`. Vercel picks up `vercel.json`, runs `pnpm build`, and deploys the prerendered output.

## History

The old SvelteKit web app version of Brew Tuner (Nhost auth, GraphQL, the original dial-in UI) is preserved on the [`archive/legacy-web-app`](https://github.com/antschmidt/grind-profiler/tree/archive/legacy-web-app) branch.

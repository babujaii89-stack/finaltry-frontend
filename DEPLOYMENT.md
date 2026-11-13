# KhetMitra frontend deployment

This is the existing KhetMitra website source with the crop advice, crop validation, mandi price, and fertilizer-plan screens configured to call a separately deployed API service.

## Environment

Set these at frontend build/runtime as appropriate for your TanStack Start host:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_KHETMITRA_API_URL=https://YOUR-BACKEND-DOMAIN
```

`VITE_KHETMITRA_API_URL` must be the backend's public HTTPS origin, with no trailing slash. Rebuild/redeploy after changing it because Vite exposes this value at build time.

For the Leaf doctor disease scan, configure `OPENAI_API_KEY` on the backend service (never in frontend variables). The scan accepts up to three clear views and analyzes them together; each photo must show the crop leaf. Multiple views can improve the evidence, but an image-based diagnosis cannot guarantee correctness. Set the backend's `ALLOWED_ORIGIN` to the exact frontend origin(s), comma-separated, with no trailing slash.

## Deploy

Deploy this folder as the website using the existing TanStack Start/Vite project setup. Use Node.js 20+ and the package scripts in `package.json` (`npm install`, `npm run build`, then the start command required by your selected TanStack Start host/adapter).

The frontend continues to use Supabase Auth and the existing Supabase tables for account/profile data. For crop advice, validation, mandi prices, and fertilizer plan it sends the signed-in user's Supabase access token to the backend API.

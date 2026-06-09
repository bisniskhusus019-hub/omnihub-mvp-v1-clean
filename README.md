# OmniHub MVP v1

OmniHub is a public-first solopreneur marketplace and seller workspace built with Vite, React, TypeScript, Tailwind CSS, and Supabase.

## Current MVP Flow

### Public buyer access

- Marketplace is public.
- Community is public.
- Checkout is public.
- Fulfillment is public after checkout.

### Seller access

- Dashboard is protected.
- Add Product is protected.
- Invoice is protected.
- Kanban is protected.
- Seller Login/Register uses Supabase Auth.
- Seller profile is automatically created or recovered from the `users` table.
- Seller products are saved with the logged-in seller profile id.

## Environment Variables

Create these variables in your hosting platform or local `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

## Supabase SQL Setup

Run the table SQL first, then run:

```text
supabase/seller-auth-policies.sql
```

This policy file keeps the buyer side public for MVP testing and protects seller product writes with Supabase Auth.

## Local Test Commands

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Manual Test Checklist

1. Open the website.
2. Confirm it lands on Marketplace.
3. Search products in Marketplace.
4. Open Community.
5. Create a community post.
6. Buy a product without logging in.
7. Complete checkout.
8. Confirm the Fulfillment screen opens.
9. Click Seller Login.
10. Register a seller account.
11. Confirm Dashboard unlocks.
12. Add a product from Dashboard.
13. Confirm the product appears in Marketplace.
14. Sign out.
15. Confirm Dashboard is locked again.

## Important Supabase Tables

- `users`
- `products`
- `transactions`
- `community_posts`
- `modules`

## Public MVP RLS Notes

For this early MVP, public insert/select policies are needed for checkout and community testing. Later production versions should restrict buyer reads/writes and seller data access more tightly.

## Deployment Notes

This repo is ready to connect to Bolt, Vercel, Netlify, or another Vite-compatible host. Make sure the environment variables above are configured before testing Supabase-powered features.

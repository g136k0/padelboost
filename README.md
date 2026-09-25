# PadelBoost

An independent, mobile-first, **one-product EU storefront** built with Next.js App Router, TypeScript and Stripe Checkout. No Shopify dependency.

## Quick start

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

## Before accepting real money (important)

The initial site is deliberately in **preview** mode. The proposed €24.90 / €39.90 prices, EU 36–47 size groupings, wording, illustrations and trial ideas are assumptions for review, **not verified product or legal facts**.

1. Order and physically inspect the AliExpress product; confirm material, available sizes, shoe compatibility, safety and manufacturer/importer information. Replace `components/InsoleArt.tsx`'s illustrative render with high-quality photos of the *actual* product, including scale and installation footage. Don't claim clinical results, injury prevention, customer reviews or a specialist design without appropriate proof.
2. Insert the real seller legal name, registered address, valid contact email, fulfilment origin, shipping costs, returns address, refund policy and accurate delivery window. Replace the placeholder legal pages in `app/privacy`, `app/terms` and `app/shipping-returns`. Verify EU product-safety, consumer and privacy compliance.
3. Configure your Stripe account, enable the payment methods you want, set an EU Shipping Rate, set up tax registrations and confirm VAT treatment with your accountant. For automatic Stripe Tax, enable it in your account and set `STRIPE_AUTOMATIC_TAX_ENABLED=true` after registration. Product pricing is currently passed to Stripe as tax-inclusive where Stripe Tax is enabled.
4. Add Vercel environment variables (below) and deploy. **Only after all launch checks**, set `CHECKOUT_ENABLED=true` and `NEXT_PUBLIC_STORE_MODE=live`.
5. Configure Stripe Dashboard customer receipts and manually fulfil paid orders through Stripe Dashboard until you connect your fulfilment provider. A successful browser redirect alone **is not proof of payment**; the success page verifies the Stripe session. For production automation, add a signed Stripe webhook and a durable fulfilment datastore before automating shipments.

## Environment

```ini
NEXT_PUBLIC_SITE_URL=https://your-real-domain.example
NEXT_PUBLIC_CONTACT_EMAIL=your-verified-support-email@example.com
NEXT_PUBLIC_STORE_MODE=preview
CHECKOUT_ENABLED=false
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SHIPPING_RATE_ID=shr_...
STRIPE_AUTOMATIC_TAX_ENABLED=false
```

Never expose `STRIPE_SECRET_KEY` as a `NEXT_PUBLIC_` variable or commit `.env.local`.

### Checkout behavior

`POST /api/checkout` validates bundle and sizes, takes prices **only from server-owned** `lib/store.ts`, and creates a hosted Stripe session. It gathers an EU delivery address; shipping is supplied by your configured Stripe Shipping Rate. Without explicit activation and credentials, checkout displays an honest configuration notice and cannot charge anyone. Use Stripe test credentials for trial transactions.

The two-pair offer lets shoppers pick a different size for each pair. The inventory sizes are placeholders, and this MVP does not reserve supplier stock. The verification page checks Stripe session status; fulfilment should only happen after confirming that the payment has settled.

## Structure

- `app/page.tsx`: single long-form sales page, pricing, FAQ and buying interface.
- `components/Storefront.tsx`: responsive storefront interaction.
- `components/InsoleArt.tsx`: **illustrative**, non-supplier-specific vector render.
- `app/api/checkout/route.ts`: server-side Stripe session creation.
- `app/success/page.tsx`: Stripe session confirmation.
- `app/{privacy,terms,shipping-returns}/page.tsx`: **draft** policy pages, not production legal advice.
- `lib/store.ts`: pricing, bundles and provisional sizes.

## Deploy

Import `g136k0/padelboost` to Vercel, use the Next.js preset, add environment variables and deploy. Connect a domain after updating `NEXT_PUBLIC_SITE_URL`. By default preview pages contain a visible launch notice and are marked `noindex`.

# PadelBoost

An independent, mobile-first, **one-product EU storefront** built with Next.js App Router, TypeScript and Stripe Checkout. No Shopify dependency.

\n## Storefront pages\n\n- \`/\`: existing editorial landing page and its original offer section. The main 'Get yours' calls to action now link to the dedicated product page.\n- \`/products/padel-insoles\`: new standalone product-detail page featuring a three-panel **concept gallery**, selectable one- or two-pair bundles, per-pair EU size selection, server-validated Stripe checkout, product information and product FAQs.\n- Real product photos, inspected measurements, authentic customer reviews and shipping/returns specifics should replace placeholders before launch. Both pages deliberately share pricing, provisional sizes and the server-side checkout route in \`lib/store.ts\`.\n\n## Stripe Products, Checkout and VAT setup

PadelBoost uses **Stripe-hosted Checkout** with **catalog-backed Stripe Price IDs**.
The website is still deployable with checkout disabled and the values below unset.

1. In Stripe **test mode**, create two active *one-time* products/prices, one for the Starter Pair (€24.90) and one for the Doubles Pack (€39.90). Set the prices to EUR with tax behavior **inclusive** so product page prices and Checkout agree. Assign an appropriate physical-goods tax code after checking the actual product classification. The bundle is one sale item representing two pairs, with each pair's selected EU size included in order metadata.
2. Copy their `price_...` IDs to server-only Vercel variables `STRIPE_PRICE_SINGLE` and `STRIPE_PRICE_DOUBLE`. Use test prices with `sk_test_...` and create *new* live prices to use with `sk_live_...`. Never mix test and live IDs.
3. Create and test an EU delivery shipping rate in Stripe and put its ID in `STRIPE_SHIPPING_RATE_ID`. Check whether this rate is VAT inclusive and has the correct shipping tax code. Customer address is collected by Checkout; our store's initial list allows only EU countries.
4. Set up Stripe Tax: confirm business origin, product classifications and actual registration(s), consulting a qualified adviser where appropriate. If you're legally ready to calculate and collect tax, set `STRIPE_AUTOMATIC_TAX_ENABLED=true`. Don't treat the toggle as an alternative to registering where required. Test addresses in different EU countries and confirm calculations and displayed all-in prices.
5. With **test** credentials and valid operational details, set `CHECKOUT_ENABLED=true` in a preview deployment, make a test purchase, verify both sizes in `/admin` and in the Stripe PaymentIntent metadata, then test cancellation and a declined payment.
6. Before using **live** Stripe credentials, finalize product specs, tax, returns and shipping policies, Vercel admin rate limiting, support email and fulfillment responsibilities. `NEXT_PUBLIC_STORE_MODE=live` changes public launch display/indexing; checkout availability is controlled *separately* by `CHECKOUT_ENABLED`.

The server retrieves each Stripe price and **rejects checkout** if its amount, currency, active state, one-time billing or inclusive tax treatment differs from `lib/store.ts`. If you update prices, update the display and server catalog expectations together before enabling checkout.

**Fulfilment:** The private order dashboard reads live Stripe Checkout Sessions and shows completed paid/processing purchases. It does *not* persist shipments. For automatic shipping or transactional notifications, build a signed Stripe webhook handler with idempotent, durable order storage; do not trigger shipment solely from the success-page redirect or an unverified webhook request.


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
3. Configure your Stripe account, enable the payment methods you want, set an EU Shipping Rate, set up tax registrations and confirm VAT treatment with your accountant, and create the two Stripe catalog price IDs above. For automatic Stripe Tax, enable it in your account and set `STRIPE_AUTOMATIC_TAX_ENABLED=true` after registration. Product pricing is currently passed to Stripe as tax-inclusive where Stripe Tax is enabled.
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

## Private admin dashboard at /admin

The independent admin page lives at `https://padelboost.vercel.app/admin` when deployed on that Vercel domain. **It is not linked anywhere on the public website** and is excluded from search engine indexing. Access is protected by a strong passphrase and a signed, HTTP-only, 12-hour browser session cookie. The login and every order page request are checked on the server; knowing the URL is not sufficient to view orders.

In **Vercel → Your project → Settings → Environment Variables**, add these **server-only** values:

| Name | What to enter |
| --- | --- |
| `ADMIN_PASSWORD` | A unique high-entropy password, **20+ characters**. |
| `ADMIN_SESSION_SECRET` | A **different** unique random value, **32+ characters**, used to sign private sessions. |
| `STRIPE_SECRET_KEY` | Your own Stripe account's `sk_test_...` or `sk_live_...` key. Existing checkout uses the same variable. |

Generate the two independent admin values locally (run **twice**):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```
Never commit or share these credentials or expose them with a `NEXT_PUBLIC_` prefix. Choose **Production** (and separately Preview if desired), save the variables, and **redeploy**. Configuring the dashboard does not enable customer payments: `CHECKOUT_ENABLED` remains `false` until you finish preparing checkout.

**Before using the login with real customer information**, set up Vercel WAF rate limiting for admin login traffic and enable two-factor authentication on your Vercel and Stripe accounts. This simple single-owner password login does not include a distributed brute-force limiter.

### What the dashboard shows
- The latest **completed Stripe Checkout sessions** created by PadelBoost, including confirmed paid orders and payments still processing. Abandoned checkouts are not orders.
- Customer name, email, phone when supplied, delivery address when returned by Stripe (otherwise clearly labeled billing address), purchased bundle, both selected sizes and charged total.
- A Stripe payment link where available, refresh control and **Older orders** pagination. Each page fetches up to 100 Stripe checkout sessions and displays only those associated with PadelBoost; if the same Stripe account handles other stores, you may need to page through multiple batches.
- Page-level paid counts and totals. These numbers are intentionally **not all-time business totals**.

Orders are read **directly from Stripe**; no extra database, webhooks or admin API are required for this viewing-only implementation. Do **not** use the dashboard as a fulfillment log: there is no shipped/delivered status or automated shipping. For fulfillment automation, add a signed Stripe webhook and a durable order database first.

If Stripe isn't connected, you can sign in after setting the two admin values, but you'll see an instruction to add your Stripe key. Stripe test keys show **test transactions only**; use your live key when ready for real orders.

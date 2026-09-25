import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products, shippingCountries, sizes, type Size } from "@/lib/store";

export const runtime = "nodejs";

function respond(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Fixed-price checkout: clients can choose a bundle and sizes, not charge amounts. */
export async function POST(request: Request) {
  if (process.env.CHECKOUT_ENABLED !== "true") {
    return respond("The shop is in preview mode. Checkout will open after we verify our stock, delivery and payment settings.", 503);
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  const shippingRate = process.env.STRIPE_SHIPPING_RATE_ID;
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !shippingRate || !site) {
    return respond("Checkout is being configured. Please try again later.", 503);
  }
  let origin: URL;
  try {
    origin = new URL(site);
    if (origin.protocol !== "https:" && !(origin.protocol === "http:" && origin.hostname === "localhost")) {
      throw new Error("Invalid storefront origin");
    }
  } catch {
    return respond("Checkout is not available at the moment.", 503);
  }
  const sizeLimit = Number(request.headers.get("content-length") || "0");
  if (sizeLimit > 2048) return respond("Invalid selection.", 413);

  let input: Record<string, unknown>;
  try {
    const data: unknown = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) return respond("Invalid selection.", 400);
    input = data as Record<string, unknown>;
  } catch {
    return respond("Please select your bundle and sizes.", 400);
  }

  const { bundle, firstSize, secondSize } = input;
  if (bundle !== "single" && bundle !== "double") return respond("Choose a valid bundle.", 400);
  if (typeof firstSize !== "string" || !sizes.includes(firstSize as Size)) {
    return respond("Choose a valid EU size for your first pair.", 400);
  }
  if (bundle === "double" && (typeof secondSize !== "string" || !sizes.includes(secondSize as Size))) {
    return respond("Choose a valid EU size for your second pair.", 400);
  }

  const product = products[bundle];
  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      billing_address_collection: "required",
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: product.price,
          // If automatic tax is enabled, consumer-facing prices remain VAT inclusive.
          tax_behavior: "inclusive",
          product_data: {
            name: "PadelBoost — " + product.title,
            description: product.quantity + " pair(s) of PadelBoost sports insoles",
          },
        },
        quantity: 1,
      }],
      shipping_address_collection: { allowed_countries: [...shippingCountries] },
      shipping_options: [{ shipping_rate: shippingRate }],
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX_ENABLED === "true" },
      metadata: {
        bundle,
        pair_count: String(product.quantity),
        pair_1_size: firstSize,
        ...(bundle === "double" ? { pair_2_size: secondSize as string } : {}),
      },
      success_url: origin.origin + "/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin.origin + "/#shop",
    });
    if (!session.url) return respond("We couldn't open checkout. Please try again.", 502);
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Details stay on the server, not in the shopper's browser.
    console.error("Stripe checkout creation failed", error);
    return respond("We couldn't open checkout. Please try again or contact support.", 502);
  }
}

import Link from "next/link";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: id } = await searchParams;
  let paid = false;
  let pending = false;
  if (id && /^cs_(?:test|live)_[a-zA-Z0-9]+$/.test(id) && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(id);
      paid = session.payment_status === "paid" && session.status === "complete";
      pending = session.status === "complete" && session.payment_status === "unpaid";
    } catch {
      // Do not imply that a manually provided or invalid URL confirms a payment.
    }
  }
  return (
    <main className="simple-page"><div className="simple-inner">
      <p className="eyebrow">PADELBOOST / CHECKOUT</p>
      <h1>{paid ? "GAME ON. ORDER RECEIVED." : pending ? "PAYMENT PROCESSING." : "LET'S CHECK YOUR ORDER."}</h1>
      <p>{paid
        ? "Stripe has confirmed your payment. Your order details are in your payment confirmation; please keep them for reference."
        : pending
        ? "Your checkout is complete, but payment has not yet been confirmed. Please wait for Stripe's payment confirmation before treating the order as placed."
        : "We couldn't verify a completed payment from this link. If you've been charged, check your payment confirmation or contact the store before placing another order."}</p>
      <Link className="btn btn-dark" href="/">BACK TO PADELBOOST →</Link>
    </div></main>
  );
}

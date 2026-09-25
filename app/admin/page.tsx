import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import Stripe from "stripe";
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, CircleAlert, LockKeyhole, LogOut, Package, RefreshCw, Truck } from "lucide-react";
import { adminConfigured, adminCookieName, verifyAdminSession } from "@/lib/admin-auth";
import { adminLogin, adminLogout } from "./actions";
import "./admin.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin | PadelBoost",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

type ShippingAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};
type ShippingDetails = {
  name?: string | null;
  address?: ShippingAddress | null;
};

type AdminOrder = {
  id: string;
  created: number;
  paid: boolean;
  paymentStatus: string;
  bundle: string;
  count: number;
  firstSize: string;
  secondSize: string | null;
  customer: string;
  email: string;
  phone: string;
  shipping: string[];
  shippingIsBillingFallback: boolean;
  totalCents: number | null;
  currency: string;
  stripePaymentUrl: string | null;
};

function isPadelBoostSession(session: Stripe.Checkout.Session): boolean {
  const meta = session.metadata || {};
  // Support checkout sessions created by earlier versions of this storefront.
  return meta.store === "padelboost" ||
    ((meta.bundle === "single" || meta.bundle === "double") &&
      (meta.pair_count === "1" || meta.pair_count === "2") &&
      Boolean(meta.pair_1_size));
}

function formatMoney(cents: number | null, currency: string): string {
  if (cents == null) return "—";
  try {
    return new Intl.NumberFormat("en-IE", { style: "currency", currency: currency.toUpperCase() })
      .format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatDate(seconds: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam",
  }).format(new Date(seconds * 1000));
}

function formatAddress(address: ShippingAddress | null | undefined): string[] {
  if (!address) return [];
  return [
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.state,
    address.country,
  ].filter((part): part is string => Boolean(part));
}

function toOrder(session: Stripe.Checkout.Session): AdminOrder {
  // Stripe's newer Checkout API returns collected_information.shipping_details.
  // Support the older session.shipping_details shape as well.
  const shippingData = session as Stripe.Checkout.Session & {
    shipping_details?: ShippingDetails | null;
    collected_information?: { shipping_details?: ShippingDetails | null } | null;
  };
  const shipping =
    shippingData.collected_information?.shipping_details ||
    shippingData.shipping_details ||
    null;
  const customerDetails = session.customer_details;
  const address = shipping?.address || customerDetails?.address || null;
  const intent = session.payment_intent;
  const paymentIntent = typeof intent === "string" ? intent : intent?.id;

  return {
    id: session.id,
    created: session.created,
    paid: session.payment_status === "paid",
    paymentStatus: session.payment_status,
    bundle: session.metadata?.bundle === "double" ? "Doubles Pack" : "Starter Pair",
    count: session.metadata?.pair_count === "2" ? 2 : 1,
    firstSize: session.metadata?.pair_1_size || "Not recorded",
    secondSize: session.metadata?.pair_2_size || null,
    customer: shipping?.name || customerDetails?.name || "Name unavailable",
    email: customerDetails?.email || session.customer_email || "Email unavailable",
    phone: customerDetails?.phone || "—",
    shipping: formatAddress(address),
    shippingIsBillingFallback: !shipping?.address,
    totalCents: session.amount_total,
    currency: session.currency || "eur",
    stripePaymentUrl: paymentIntent
      ? `https://dashboard.stripe.com/${session.livemode ? "" : "test/"}payments/${encodeURIComponent(paymentIntent)}`
      : null,
  };
}

function AdminSignIn({ error }: { error?: string }) {
  const configured = adminConfigured();
  return (
    <main className="pa-login-screen">
      <div className="pa-login-splash">
        <div className="pa-splash-brand"><span className="pa-brand-dot">✳</span> padel<span>boost.</span></div>
        <div className="pa-splash-copy">
          <p className="pa-eyebrow">PRIVATE / STORE OPERATIONS</p>
          <h1>BEHIND<br/>THE <em>GAME.</em></h1>
          <p>One private workspace for your store's Stripe orders.</p>
        </div>
        <div className="pa-splash-footer">PADelBOOST / ADMIN ACCESS</div>
      </div>
      <div className="pa-login-panel">
        <div className="pa-login-box">
          <div className="pa-login-icon"><LockKeyhole size={27}/></div>
          <p className="pa-eyebrow">RESTRICTED ACCESS</p>
          <h2>Welcome back.</h2>
          <p className="pa-login-help">Enter your private admin passphrase to see your orders.</p>
          {!configured ? (
            <div className="pa-setup-notice" role="status">
              <CircleAlert size={19}/>
              <span>Admin login hasn't been configured yet. Add your private admin password and session secret in Vercel's environment settings, then redeploy.</span>
            </div>
          ) : (
            <form action={adminLogin} className="pa-login-form">
              <label htmlFor="admin-passphrase">ADMIN PASSPHRASE</label>
              <input id="admin-passphrase" type="password" name="passphrase"
                autoComplete="current-password" required minLength={20}
                placeholder="Your private passphrase"/>
              {error === "invalid" && <p className="pa-login-error" role="alert">Incorrect passphrase. Try again.</p>}
              <button type="submit">UNLOCK DASHBOARD <ArrowRight size={19}/></button>
            </form>
          )}
          <p className="pa-security-caption"><LockKeyhole size={13}/> Private, password-protected access. Never share your login or Stripe secret.</p>
        </div>
      </div>
    </main>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  return (
    <article className="pa-order">
      <details>
        <summary>
          <span className="pa-order-when">{formatDate(order.created)} <small>AMSTERDAM TIME</small></span>
          <span className="pa-order-person">{order.customer}<small>{order.email}</small></span>
          <span className="pa-order-items">{order.bundle}<small>{order.count} {order.count === 1 ? "PAIR" : "PAIRS"}</small></span>
          <span className="pa-order-total">{formatMoney(order.totalCents, order.currency)}</span>
          <span className={`pa-status ${order.paid ? "pa-paid" : "pa-pending"}`}>
            {order.paid ? <CheckCircle2 size={15}/> : <CircleAlert size={15}/>}
            {order.paid ? "PAID" : "PENDING"}
          </span>
          <ArrowDown className="pa-expand" size={18}/>
        </summary>
        <div className="pa-order-details">
          <div>
            <span className="pa-detail-label">ORDER CONTENTS</span>
            <p>{order.bundle}</p>
            <p>Pair 01: <strong>{order.firstSize}</strong></p>
            {order.secondSize && <p>Pair 02: <strong>{order.secondSize}</strong></p>}
            <p className="pa-detail-muted">Stripe session: <code>{order.id}</code></p>
          </div>
          <div>
            <span className="pa-detail-label">CUSTOMER</span>
            <p>{order.customer}</p>
            <p><a href={order.email.includes("@") ? `mailto:${order.email}` : undefined}>{order.email}</a></p>
            <p>{order.phone}</p>
          </div>
          <div>
            <span className="pa-detail-label"><Truck size={15}/> DELIVERY ADDRESS</span>
            {order.shipping.length ? order.shipping.map((part, i) => <p key={i}>{part}</p>) : <p>Address not supplied</p>}
            {order.shippingIsBillingFallback && <p className="pa-detail-muted">Billing address shown; verify the actual delivery address in Stripe.</p>}
            {order.stripePaymentUrl && <a className="pa-stripe-link" href={order.stripePaymentUrl}
              target="_blank" rel="noopener noreferrer">OPEN PAYMENT IN STRIPE <ArrowUpRight size={14}/></a>}
          </div>
        </div>
      </details>
    </article>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; after?: string }>;
}) {
  const jar = await cookies();
  const { error, after } = await searchParams;

  if (!verifyAdminSession(jar.get(adminCookieName())?.value)) {
    return <AdminSignIn error={error}/>;
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const cursor =
    typeof after === "string" && after.length < 180 && /^cs_(test|live)_[a-zA-Z0-9]+$/.test(after)
      ? after : undefined;

  let orders: AdminOrder[] = [];
  let nextCursor: string | null = null;
  let fetchError = "";
  let checked = 0;

  if (secret) {
    try {
      const stripe = new Stripe(secret);
      const result = await stripe.checkout.sessions.list({
        limit: 100,
        ...(cursor ? { starting_after: cursor } : {}),
      });
      checked = result.data.length;
      orders = result.data
        .filter(session => session.status === "complete" && isPadelBoostSession(session))
        .map(toOrder);
      nextCursor = result.has_more ? result.data[result.data.length - 1]?.id || null : null;
    } catch {
      fetchError = "Stripe orders couldn't be loaded. Check your Stripe credentials or try again.";
    }
  }

  const paid = orders.filter(order => order.paid);
  const pending = orders.filter(order => !order.paid);
  const paidEUR = paid
    .filter(order => order.currency.toLowerCase() === "eur")
    .reduce((total, order) => total + (order.totalCents || 0), 0);

  return (
    <main className="pa-admin">
      <aside className="pa-sidebar">
        <div className="pa-sidebar-logo"><span>✳</span> padel<b>boost.</b></div>
        <div className="pa-nav-group">
          <p>WORKSPACE</p>
          <div className="pa-nav-active"><Package size={19}/> ORDERS <span>↗</span></div>
        </div>
        <div className="pa-sidebar-footer">
          <span className="pa-private-chip"><LockKeyhole size={14}/> PRIVATE DASHBOARD</span>
          <form action={adminLogout}>
            <button type="submit" className="pa-logout"><LogOut size={17}/> SIGN OUT</button>
          </form>
        </div>
      </aside>
      <div className="pa-content">
        <div className="pa-topbar">
          <span><span className="pa-topbar-dot"/> ADMIN / ORDERS</span>
          <div><span>{secret?.startsWith("sk_test_") ? "STRIPE TEST MODE" : secret ? "STRIPE LIVE CONNECTION" : "STRIPE NOT CONNECTED"}</span><form action={adminLogout}><button type="submit">SIGN OUT <LogOut size={14}/></button></form></div>
        </div>
        <div className="pa-inner">
          <div className="pa-intro">
            <div>
              <p className="pa-eyebrow">THE PADELBOOST BACK OFFICE</p>
              <h1>YOUR <em>ORDERS.</em></h1>
              <p>Live from Stripe on every page load. Paid and processing checkouts, with your customers' selected sizes and delivery details.</p>
            </div>
            <a href="/admin" className="pa-refresh"><RefreshCw size={17}/> REFRESH ORDERS</a>
          </div>

          {!secret && <div className="pa-warning"><CircleAlert size={22}/>
            <div><strong>CONNECT STRIPE TO SEE ORDERS</strong><p>Add the server-only STRIPE_SECRET_KEY to Vercel and redeploy. This dashboard only displays orders from the configured Stripe account.</p></div>
          </div>}
          {fetchError && <div className="pa-warning" role="alert"><CircleAlert size={22}/><div><strong>COULDN'T LOAD ORDERS</strong><p>{fetchError}</p></div></div>}

          <div className="pa-stats">
            <div><span>ORDERS ON THIS PAGE</span><strong>{orders.length}</strong><small>{checked} recent checkout sessions scanned</small></div>
            <div><span>PAID ON THIS PAGE</span><strong>{paid.length}</strong><small>Stripe-confirmed payments</small></div>
            <div><span>PAYMENT PENDING</span><strong>{pending.length}</strong><small>Completed checkout, payment processing</small></div>
            <div><span>PAID VALUE / EUR</span><strong>{formatMoney(paidEUR, "eur")}</strong><small>Only orders shown on this page</small></div>
          </div>

          <section className="pa-orders-list" aria-labelledby="admin-order-title">
            <div className="pa-list-header">
              <div>
                <p className="pa-eyebrow">ORDER ACTIVITY</p>
                <h2 id="admin-order-title">Recent checkouts.</h2>
              </div>
              <span className="pa-page-label">NEWEST FIRST · {cursor ? "OLDER PAGE" : "LATEST PAGE"}</span>
            </div>
            {orders.length > 0 ? (
              <div className="pa-order-collection">
                <div className="pa-table-head"><span>DATE / TIME</span><span>CUSTOMER</span><span>PRODUCT</span><span>AMOUNT</span><span>STATUS</span><span>DETAILS</span></div>
                {orders.map(order => <OrderCard key={order.id} order={order}/>)}
              </div>
            ) : (
              <div className="pa-empty">
                <Package size={37} strokeWidth={1.25}/>
                <h3>{secret && !fetchError ? "No PadelBoost orders in this batch." : "No orders to show yet."}</h3>
                <p>{secret && !fetchError
                  ? "This page scans Stripe checkout sessions in batches of 100. Use Older orders below if your Stripe account also handles other stores."
                  : "Orders will appear here once Stripe is connected and customers complete checkout."}</p>
              </div>
            )}
            <div className="pa-pagination">
              {cursor && <Link href="/admin" className="pa-previous">← BACK TO LATEST</Link>}
              {nextCursor && <Link href={`/admin?after=${encodeURIComponent(nextCursor)}`} className="pa-next">OLDER ORDERS <ArrowRight size={17}/></Link>}
            </div>
            <p className="pa-list-footnote">
              <ShieldCheck size={15}/> Only authorized admins can view this page. Orders are fetched securely from Stripe and are not saved in a separate PadelBoost database. This is not a shipment-tracking dashboard.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

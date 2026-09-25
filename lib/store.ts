export const store = {
  name: "PadelBoost",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  preview: process.env.NEXT_PUBLIC_STORE_MODE !== "live",
} as const;

// Launch hypotheses, not supplier-confirmed SKUs or researched optimal prices.
// Check physical stock, shoe fit and final landed margins before enabling checkout.
export const sizes = ["EU 36–37", "EU 38–39", "EU 40–41", "EU 42–43", "EU 44–45", "EU 46–47"] as const;
export type Size = (typeof sizes)[number];
export type Bundle = "single" | "double";
export const products = {
  single: { title: "The Starter Pair", quantity: 1, price: 2490 },
  double: { title: "The Doubles Pack", quantity: 2, price: 3990 },
} as const;

export const eur = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(cents / 100);

// This first launch serves the EU. UK/EEA non-EU countries need additional customs/shipping setup.
export const shippingCountries = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

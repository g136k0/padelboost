import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_STORE_MODE !== "live") return [];
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: base + "/products/padel-insoles", changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/shipping-returns", changeFrequency: "yearly", priority: 0.2 },
    { url: base + "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: base + "/terms", changeFrequency: "yearly", priority: 0.2 },
  ];
}

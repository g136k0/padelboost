import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const live = process.env.NEXT_PUBLIC_STORE_MODE === "live";
  return { rules: [{ userAgent: "*", allow: live ? "/" : undefined, disallow: live ? undefined : "/" }] };
}

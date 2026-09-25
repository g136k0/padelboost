import type { Metadata, Viewport } from "next";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "PadelBoost — More court. Less compromise.",
  description: "A straightforward underfoot upgrade for players who want their padel shoes to feel more comfortable. Discover the PadelBoost one-product store.",
  applicationName: "PadelBoost",
  openGraph: {
    title: "PadelBoost — More court. Less compromise.",
    description: "A simple underfoot upgrade for your current padel shoes.",
    type: "website",
    locale: "en_IE",
  },
  robots: {
    index: process.env.NEXT_PUBLIC_STORE_MODE === "live",
    follow: process.env.NEXT_PUBLIC_STORE_MODE === "live",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111b18",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

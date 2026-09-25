import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import "./product.css";

export const metadata: Metadata = {
  title: "PadelBoost Insoles | Upgrade your padel shoes",
  description: "Explore the PadelBoost sports insole, choose your size and compare one-pair and two-pair bundles. A straightforward underfoot upgrade for your padel shoes.",
  alternates: { canonical: "/products/padel-insoles" },
  openGraph: {
    title: "PadelBoost Insoles | Keep your shoes. Upgrade what’s inside.",
    description: "Discover our in-shoe upgrade, compare bundles and find your fit.",
    type: "website",
  },
};

export default function Page() {
  return <ProductPage />;
}

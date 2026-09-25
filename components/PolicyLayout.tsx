import Link from "next/link";
import type { ReactNode } from "react";
import { store } from "@/lib/store";

export default function PolicyLayout({ title, children }: { title: string; children: ReactNode }) {
  return <main className="policy"><div className="container">
    <Link href="/" className="eyebrow">← PADELBOOST / BACK TO SHOP</Link>
    <h1>{title}</h1>
    <div className="policy-warning"><strong>Draft for review, not a published final policy.</strong> This document needs the seller's verified legal details and professional review before accepting real orders. {store.preview ? "The site is in preview mode." : "Contact support for clarification."}</div>
    {children}
    <p className="policy-footer"><Link href="/">← Back to the store</Link></p>
  </div></main>;
}

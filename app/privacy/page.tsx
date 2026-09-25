import PolicyLayout from "@/components/PolicyLayout";
export const metadata = { title: "Privacy policy | PadelBoost" };
export default function PrivacyPage() {
  return <PolicyLayout title="PRIVACY POLICY.">
    <p>This is a working draft for an EU-facing one-product store. The actual legal entity, contact information, processing arrangements and retention periods must be filled in before launch.</p>
    <h2>1. Who is responsible?</h2>
    <p><strong>To complete:</strong> Seller legal name, registered address and privacy contact email. Identify whether your entity is the data controller.</p>
    <h2>2. Data involved</h2>
    <p>When enabled, Stripe Checkout collects payment, billing and delivery information to process your purchase. Our storefront receives a checkout reference, chosen bundle and sizes. A live version may also handle support emails, operational logs and fulfilment data.</p>
    <h2>3. Why data is used</h2>
    <p>Expected purposes include handling and delivering purchases, responding to enquiries, keeping legally required accounting records and preventing fraud. The final version must state the applicable legal bases and actual retention periods.</p>
    <h2>4. Who receives it?</h2>
    <p>Stripe provides hosted payments. Hosting and any chosen fulfilment or support processors must be identified, including relevant international transfers and applicable safeguards.</p>
    <h2>5. Cookies and analytics</h2>
    <p>We have not added third-party advertising trackers to this preview. Before adding any non-essential analytics or marketing cookies, implement the appropriate EU consent controls and update this policy.</p>
    <h2>6. Your choices</h2>
    <p>The final policy will explain how to request access, correction, erasure and other applicable GDPR rights, including how to contact the relevant supervisory authority.</p>
  </PolicyLayout>;
}

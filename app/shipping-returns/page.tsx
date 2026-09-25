import PolicyLayout from "@/components/PolicyLayout";
export const metadata = { title: "Shipping & returns | PadelBoost" };
export default function ShippingReturns() {
  return <PolicyLayout title="SHIPPING & RETURNS.">
    <p>These are the intended principles for the EU launch. Do not activate real checkout until the final delivery and refund details below are supplied.</p>
    <h2>Shipping destinations</h2><p>The first version of checkout is restricted to the 27 EU countries. Available countries and any regional exceptions must be checked with the real fulfilment provider.</p>
    <h2>Rates and delivery</h2><p><strong>To complete:</strong> Dispatch location, processing time, verified delivery estimates, courier, tracking policy and an accurate shipping-rate schedule. Actual shipping charges must be presented before payment.</p>
    <h2>Changing your mind</h2><p>EU distance-purchase rules generally provide eligible consumers a 14-day withdrawal right after receiving goods, subject to applicable exceptions. Before launch, publish the proper cancellation instructions and standard withdrawal form, return address, return-postage responsibilities and refund timing.</p>
    <h2>Faulty or non-conforming goods</h2><p>Mandatory statutory consumer remedies apply independently of any voluntary comfort guarantee. Publish instructions for reporting problems and describe the lawful remedy process.</p>
    <h2>Optional comfort trial</h2><p>A longer comfort trial is only being considered. Nothing beyond the mandatory legal rights is promised until its practical conditions, hygiene handling and refund costs are verified and stated here.</p>
    <h2>Need help?</h2><p><strong>To complete:</strong> Monitored support email and postal returns address.</p>
  </PolicyLayout>;
}

"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp,
  Footprints, LockKeyhole, Menu, PackageCheck, ShieldCheck, X
} from "lucide-react";
import InsoleArt from "@/components/InsoleArt";
import { eur, products, sizes, store, type Bundle, type Size } from "@/lib/store";

const faqs = [
  {
    question: "Will PadelBoost fit my current padel shoes?",
    answer: "They're intended as a replacement for the removable insoles in suitable sports shoes. Shoe construction, volume and fit vary, so test the fit without forcing it. We are checking compatibility with popular padel shoes before launch.",
  },
  {
    question: "Can I use them if my feet already hurt?",
    answer: "Comfort preferences are individual, and insoles are not a substitute for medical assessment. Persistent foot, heel, knee or back pain should be discussed with a qualified clinician. We do not claim these insoles diagnose, treat or prevent injuries.",
  },
  {
    question: "How do I choose my size?",
    answer: "Select your usual EU shoe-size range. The displayed groupings are provisional while we verify supplier measurements. Check the final measurements and fitting instructions when they are published, especially if you sit between sizes.",
  },
  {
    question: "Do I need to buy new shoes too?",
    answer: "No—that's the idea of an in-shoe upgrade. However, insoles cannot fix shoes that are worn out, the wrong size or unsuitable for your style of play.",
  },
  {
    question: "Can the two pairs be different sizes?",
    answer: "Yes. The Doubles Pack allows a separate size selection for each pair, subject to confirmed availability.",
  },
  {
    question: "Where do you ship?",
    answer: "Our initial checkout is designed for the 27 EU countries. Available countries, charges and estimated delivery times will be confirmed before accepting real orders.",
  },
  {
    question: "What is your returns policy?",
    answer: "You'll find our draft shipping and returns information in the footer. The final policy, full return address and any additional comfort-trial terms will be published before the store accepts orders. Your applicable statutory rights remain unaffected.",
  },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="PadelBoost home" className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark" aria-hidden="true"><span /></span>
      <span>padel<span className="logo-boost">boost</span><span className="logo-dot">.</span></span>
    </Link>
  );
}

function Cta({ children = "Find your fit", variant = "lime", onClick }: { children?: ReactNode; variant?: "lime" | "outline"; onClick?: () => void }) {
  return <a href="#shop" onClick={onClick} className={`btn ${variant === "lime" ? "btn-lime" : "btn-outline"}`}>{children}<ArrowUpRight size={18} strokeWidth={1.8}/></a>;
}

export default function Storefront() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [bundle, setBundle] = useState<Bundle>("double");
  const [firstSize, setFirstSize] = useState<Size | "">("");
  const [secondSize, setSecondSize] = useState<Size | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selected = products[bundle];
  const closeMenu = () => setMobileMenu(false);

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!firstSize || (bundle === "double" && !secondSize)) {
      setMessage("Choose a size for each pair to continue.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle, firstSize, secondSize: bundle === "double" ? secondSize : undefined }),
      });
      const result: { url?: string; error?: string } = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "We couldn't start checkout. Please try again.");
      window.location.assign(result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout couldn't be started.");
      setLoading(false);
    }
  }

  return (
    <>
      {store.preview && (
        <div className="preview-banner" role="status">
          <span className="preview-pulse" aria-hidden="true" />
          LAUNCH PREVIEW <span className="preview-separator">/</span> Product, policies and checkout pending verification
        </div>
      )}
      <div className="announcement"><span>MADE FOR THE MATCH. AND EVERYTHING AFTER.</span><ArrowUpRight size={13}/></div>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav id="site-navigation" className={`desktop-nav ${mobileMenu ? "nav-open" : ""}`} aria-label="Main navigation">
            <a href="#why" onClick={closeMenu}>The idea</a>
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#questions" onClick={closeMenu}>FAQs</a>
            <a href="#shop" className="mobile-nav-buy" onClick={closeMenu}>Shop now <ArrowRight size={17}/></a>
          </nav>
          <div className="header-actions">
            <a href="#shop" className="header-buy">GET YOURS <ArrowUpRight size={16}/></a>
            <button className="menu-toggle" type="button" onClick={() => setMobileMenu(!mobileMenu)}
              aria-expanded={mobileMenu} aria-controls="site-navigation" aria-label={mobileMenu ? "Close menu" : "Open menu"}>
              {mobileMenu ? <X size={23}/> : <Menu size={23}/>}
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-grid" aria-hidden="true"/>
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow eyebrow-light"><span className="tiny-star">✳</span> MORE COURT. LESS COMPROMISE.</div>
              <h1 id="hero-heading">LOVE THE <i>GAME.</i><br/>NOT THE<br/><span className="hero-outlined">SORE FEET.</span></h1>
              <p>For the player who always wants one more set. An easy underfoot upgrade for the padel shoes you already own.</p>
              <div className="hero-ctas">
                <Cta>FIND YOUR FIT</Cta>
                <a className="text-link text-link-light" href="#why">DISCOVER PADELBOOST <ArrowDown size={16}/></a>
              </div>
              <div className="hero-micro">
                <span className="micro-line"/><span>ONE PRODUCT. ONE SIMPLE SWITCH.</span>
              </div>
            </div>
            <div className="hero-art">
              <div className="hero-art-halo"/>
              <div className="hero-art-arc hero-art-arc-one"/>
              <div className="hero-art-arc hero-art-arc-two"/>
              <span className="hero-art-overline">01 / THE UNDERFOOT UPGRADE</span>
              <InsoleArt className="hero-insoles"/>
              <div className="hero-art-bottom">
                <span>YOUR SHOES, UPGRADED.</span>
                <div className="hero-art-arrow"><ArrowUpRight size={26}/></div>
              </div>
              <span className="art-disclaimer">Product concept illustration · Actual photos before launch</span>
            </div>
          </div>
          <div className="hero-vertical" aria-hidden="true">PLAY // RECOVER // REPEAT</div>
        </section>

        <div className="benefit-strip" aria-label="PadelBoost at a glance">
          <div className="container benefit-strip-inner">
            <div><span className="strip-icon">✳</span><span>ONE SIMPLE SHOE UPGRADE</span></div>
            <div><span className="strip-icon">↗</span><span>MADE FOR PADEL ROUTINES</span></div>
            <div><span className="strip-icon">◎</span><span>STRAIGHTFORWARD EU SHOPPING</span></div>
          </div>
        </div>

        <section className="problem section-pad" id="why">
          <div className="container">
            <div className="section-topline"><span className="eyebrow">01 / THE PROBLEM</span><span>FAMILIAR?</span></div>
            <div className="problem-layout">
              <div className="problem-heading"><h2>YOUR HEAD'S IN THE <i>MATCH.</i><br/>YOUR FEET HAVE <span>OTHER PLANS.</span></h2></div>
              <div className="problem-body"><p>One more set turns into one more hour. But your shoes don't always feel as good at the end as they did at the start.</p><p>Before you replace a perfectly decent pair of padel shoes, there's a simpler change worth exploring.</p><a className="text-link" href="#how">MEET THE UPGRADE <ArrowUpRight size={18}/></a></div>
            </div>
            <div className="problem-cards">
              <div className="problem-card"><span className="number-label">01</span><Footprints size={29} strokeWidth={1.5}/><h3>The after-match feeling</h3><p>When your feet are the first thing you notice after the final point.</p></div>
              <div className="problem-card"><span className="number-label">02</span><CircleHelp size={29} strokeWidth={1.5}/><h3>Another pair of shoes?</h3><p>When you like your current shoes but want a different feeling underfoot.</p></div>
              <div className="problem-card"><span className="number-label">03</span><PackageCheck size={29} strokeWidth={1.5}/><h3>Keep it simple</h3><p>No complicated kit. Just an in-shoe addition to your current setup.</p></div>
            </div>
          </div>
        </section>

        <section className="manifesto" aria-label="PadelBoost idea">
          <div className="container manifesto-content">
            <div className="manifesto-kicker"><span className="light-dot"/> THE PADELBOOST MINDSET</div>
            <p>YOUR NEXT MATCH STARTS <em>BEFORE</em> YOU STEP ON COURT.</p>
            <div className="manifesto-bottom"><span>FEEL READY. PLAY YOUR WAY.</span><span>PB / 001</span></div>
          </div>
        </section>

        <section className="how section-pad" id="how">
          <div className="container">
            <div className="section-topline"><span className="eyebrow">02 / THE SWITCH</span><span>YOUR SHOES. YOUR GAME.</span></div>
            <div className="how-heading"><div><h2>A SMALL CHANGE.<br/><i>A LOT LESS FUSS.</i></h2></div><p>Good gear should fit around your game—not the other way around. Here's how simple your underfoot upgrade can be.</p></div>
            <div className="steps">
              <div className="step"><span className="step-no">01</span><div className="step-line"/><h3>KEEP YOUR SHOES.</h3><p>Start with padel shoes you already like and check that their existing insoles can be removed.</p></div>
              <div className="step"><span className="step-no">02</span><div className="step-line"/><h3>FIND YOUR FIT.</h3><p>Choose a size, compare the verified measurements and follow the included fitting instructions.</p></div>
              <div className="step"><span className="step-no">03</span><div className="step-line"/><h3>GET COURT-READY.</h3><p>Check that your shoes still fit securely, then head out for your next session.</p></div>
            </div>
            <div className="how-note"><ShieldCheck size={18}/><span>An insole can't correct an ill-fitting shoe or replace medical advice for ongoing pain.</span></div>
          </div>
        </section>

        <section className="product-story" aria-labelledby="story-heading">
          <div className="product-story-art">
            <div className="story-orbit"/>
            <InsoleArt className="story-insoles"/>
            <span className="story-corner story-corner-top">PB / FIELD NOTES</span>
            <span className="story-corner story-corner-bottom">VISUAL CONCEPT / NOT FINAL PRODUCT PHOTOGRAPHY</span>
          </div>
          <div className="product-story-copy">
            <span className="eyebrow eyebrow-light">03 / THE PRODUCT</span>
            <h2 id="story-heading">SAME SHOES.<br/><i>NEW FEEL.</i></h2>
            <p>The goal is straightforward: a simple way to change the feeling underfoot while keeping the shoes you're comfortable playing in.</p>
            <p>We're testing the actual product and fit before publishing claims about materials, support zones and performance. Real specs and real on-court footage belong here—not made-up science.</p>
            <Cta>EXPLORE THE OFFER</Cta>
            <span className="product-story-foot">THE GOOD KIND OF GAME CHANGE / 001</span>
          </div>
        </section>

        <section className="shop-section section-pad" id="shop">
          <div className="container">
            <div className="section-topline"><span className="eyebrow">04 / GET EQUIPPED</span><span>ONE PRODUCT. YOUR CHOICE.</span></div>
            <div className="shop-heading"><h2>YOUR NEXT<br/><i>GOOD MOVE.</i></h2><p>Choose your setup. Pick your size. We'll take care of the rest once the store launches.</p></div>
            <div className="shop-grid">
              <div className="shop-visual">
                <div className="shop-visual-top"><span>PB / 01</span><span>THE IN-SHOE UPGRADE</span></div>
                <InsoleArt className="shop-insoles"/>
                <div className="shop-visual-footer"><span>CONCEPT RENDER</span><span>REAL PRODUCT PHOTOS COMING SOON</span></div>
              </div>
              <div className="shop-buy">
                <div className="shop-buy-title"><div><span className="eyebrow">THE PADELBOOST INSOLE</span><h3>FIND YOUR FIT.</h3></div><span className="shop-stock">PRE-LAUNCH</span></div>
                <p className="buy-intro">One straightforward addition to your current shoes. Pick the setup that works for your game.</p>
                <form onSubmit={checkout} noValidate>
                  <fieldset className="bundle-fieldset">
                    <legend>01 / CHOOSE YOUR SETUP</legend>
                    <label className={`bundle-option ${bundle === "single" ? "bundle-selected" : ""}`}>
                      <input type="radio" name="bundle" value="single" checked={bundle === "single"} onChange={() => {setBundle("single");setMessage("");}}/>
                      <span className="radio-look" aria-hidden="true"><Check size={13}/></span>
                      <span className="bundle-copy"><strong>THE STARTER PAIR</strong><small>One pair. One easy upgrade.</small></span>
                      <span className="bundle-price">{eur(products.single.price)}</span>
                    </label>
                    <label className={`bundle-option bundle-featured ${bundle === "double" ? "bundle-selected" : ""}`}>
                      <input type="radio" name="bundle" value="double" checked={bundle === "double"} onChange={() => {setBundle("double");setMessage("");}}/>
                      <span className="radio-look" aria-hidden="true"><Check size={13}/></span>
                      <span className="bundle-copy"><strong>THE DOUBLES PACK <span className="bundle-tag">BETTER VALUE</span></strong><small>Two pairs. Two sizes if you like.</small><small className="bundle-save">SAVE {eur(products.single.price * 2 - products.double.price)}</small></span>
                      <span className="bundle-price">{eur(products.double.price)}<s>{eur(products.single.price * 2)}</s></span>
                    </label>
                  </fieldset>
                  <fieldset className="size-fieldset">
                    <legend>02 / PICK YOUR SIZE</legend>
                    <div className="size-selects">
                      <label htmlFor="size-one">PAIR 01<select id="size-one" required value={firstSize} onChange={e => {setFirstSize(e.target.value as Size | "");setMessage("");}}><option value="">Select EU size</option>{sizes.map(size => <option key={size} value={size}>{size}</option>)}</select></label>
                      {bundle === "double" && <label htmlFor="size-two">PAIR 02<select id="size-two" required value={secondSize} onChange={e => {setSecondSize(e.target.value as Size | "");setMessage("");}}><option value="">Select EU size</option>{sizes.map(size => <option key={size} value={size}>{size}</option>)}</select></label>}
                    </div>
                    <p className="size-disclaimer">Size ranges are provisional until we check the supplier's exact measurements.</p>
                  </fieldset>
                  <div className="order-total"><span>YOUR TOTAL</span><strong>{eur(selected.price)}</strong></div>
                  <p className="shipping-disclaimer">Shipping calculated at checkout. Tax treatment confirmed before launch.</p>
                  <button disabled={loading} className="btn btn-buy" type="submit">
                    {loading ? "OPENING SECURE CHECKOUT…" : store.preview ? "TEST CHECKOUT" : "CONTINUE TO CHECKOUT"}<ArrowUpRight size={20}/>
                  </button>
                  {message && <p className="checkout-message" role="alert">{message}</p>}
                  <div className="trust-row"><span><LockKeyhole size={15}/> Hosted Stripe checkout</span><span><ShieldCheck size={15}/> EU consumer rights</span></div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section section-pad" id="questions">
          <div className="container faq-layout">
            <div className="faq-heading"><span className="eyebrow">05 / GOOD QUESTIONS</span><h2>BEFORE<br/>YOU <i>PLAY.</i></h2><p>Real answers, no miracle claims. Here's what to know before changing what goes inside your shoes.</p><div className="faq-decoration">?</div></div>
            <div className="faq-items">
              {faqs.map((faq, index) => (
                <details key={faq.question} className="faq-item">
                  <summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{faq.question}</span><ChevronDown size={20}/></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
              <p className="faq-contact">More questions? {store.contactEmail ? <a href={`mailto:${store.contactEmail}`}>Get in touch <ArrowUpRight size={15}/></a> : <span>Support contact will be published before launch.</span>}</p>
            </div>
          </div>
        </section>

        <section className="bottom-cta">
          <div className="container bottom-cta-layout"><div><span className="eyebrow eyebrow-light">FOR YOUR NEXT MATCH</span><h2>LET'S<br/><i>PLAY.</i></h2></div><div><p>More of the padel you love. An underfoot upgrade without overthinking it.</p><Cta>FIND YOUR FIT</Cta></div><div className="bottom-cta-circle" aria-hidden="true"><ArrowUpRight/></div></div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top"><Logo light/><p>More court.<br/>Less compromise.</p></div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} PadelBoost. All rights reserved.</span><div className="footer-links"><Link href="/shipping-returns">SHIPPING & RETURNS</Link><Link href="/privacy">PRIVACY</Link><Link href="/terms">TERMS</Link>{store.contactEmail && <a href={`mailto:${store.contactEmail}`}>CONTACT</a>}</div><a href="#hero-heading" className="back-top">BACK TO TOP ↑</a></div>
          {store.preview && <p className="footer-preview">PRE-LAUNCH PROTOTYPE — Product art, pricing, size ranges and draft policies require verification. No live payments.</p>}
        </div>
      </footer>
      <a className="mobile-sticky" href="#shop">FIND YOUR FIT <ArrowRight size={19}/></a>
    </>
  );
}

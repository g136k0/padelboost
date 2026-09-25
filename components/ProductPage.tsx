"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, LockKeyhole,
  Menu, Ruler, ShieldCheck, ShoppingBag, X
} from "lucide-react";
import InsoleArt from "@/components/InsoleArt";
import { eur, products, sizes, store, type Bundle, type Size } from "@/lib/store";

const PHOTO_NOTE = "Concept illustration only. Real PadelBoost product photographs will replace this artwork before launch.";

const productFaqs = [
  {
    question: "Will these fit my padel shoes?",
    answer: "These are intended to replace removable factory insoles in suitable sports shoes. The inside of every shoe is different. Confirm the final measurements before ordering, and never force an insole into a shoe that becomes too tight or unstable.",
  },
  {
    question: "Can I wear them in shoes other than padel shoes?",
    answer: "The product is designed to be marketed to padel players, but we're still verifying its exact dimensions and intended uses with a physical sample. Check the published size and fitting instructions before launch.",
  },
  {
    question: "How do I choose between two sizes?",
    answer: "Start with your usual EU shoe size, but check the final insole length and width measurements once published. If you're between sizes or your shoes have a narrow fit, contact support before buying.",
  },
  {
    question: "Can I get two different sizes in the Doubles Pack?",
    answer: "Yes. You can select each pair's size independently in the bundle selector above, subject to availability.",
  },
  {
    question: "Can PadelBoost prevent foot, ankle or knee injuries?",
    answer: "No insole can guarantee injury prevention. We aren't making a medical or injury-prevention claim for this product. If you have persistent discomfort or an existing injury, consult a qualified health professional.",
  },
  {
    question: "How much does shipping cost, and when will it arrive?",
    answer: "Our initial market is the EU. We will publish verified delivery times, dispatch origins and full shipping rates before enabling checkout. Any charge will appear before payment.",
  },
  {
    question: "What if I'm not happy with my purchase?",
    answer: "Your applicable EU consumer rights will apply. Final withdrawal and returns information, including our return address and any optional comfort trial, will be confirmed on our Shipping & Returns page before launch.",
  },
];

const visualThumbs = [
  { title: "THE UPGRADE", subtitle: "01 / Concept" },
  { title: "A CLOSER LOOK", subtitle: "02 / Concept" },
  { title: "HOW IT FITS", subtitle: "03 / Guide" },
];

function ProductLogo() {
  return (
    <Link href="/" className="logo" aria-label="PadelBoost — homepage">
      <span className="logo-mark" aria-hidden="true"><span /></span>
      <span>padel<span className="logo-boost">boost</span><span className="logo-dot">.</span></span>
    </Link>
  );
}

function ProductVisual({ slide }: { slide: number }) {
  if (slide === 2) {
    return (
      <div className="pd-gallery-stage pd-gallery-guide">
        <div className="pd-guide-header"><span>PADELBOOST / FIELD GUIDE</span><span>03 — FIT</span></div>
        <h3>THREE STEPS.<br/><em>ONE SWITCH.</em></h3>
        <div className="pd-guide-steps">
          <div><span>01</span><strong>REMOVE</strong><small>Take out the removable insole currently in your shoe.</small></div>
          <div><span>02</span><strong>COMPARE</strong><small>Check the new insole's measurements against your shoe.</small></div>
          <div><span>03</span><strong>FIT</strong><small>Insert it, then check that your shoe still fits securely.</small></div>
        </div>
        <p className="pd-stage-note">Illustrated fitting guide · Full instructions after product verification</p>
      </div>
    );
  }

  return (
    <div className={`pd-gallery-stage ${slide === 1 ? "pd-gallery-detail" : "pd-gallery-hero"}`}>
      <span className="pd-visual-kicker">{slide === 1 ? "02 / IN-SHOE UPGRADE" : "01 / THE INSOLE"}</span>
      <span className="pd-visual-ring" aria-hidden="true"/>
      <span className="pd-visual-ring pd-visual-ring-small" aria-hidden="true"/>
      <InsoleArt className={`pd-gallery-sole ${slide === 1 ? "pd-gallery-sole-detail" : ""}`} />
      <div className="pd-visual-footer">
        <span>{slide === 1 ? "YOUR SHOES, UPGRADED." : "THE PADELBOOST INSOLE"}</span>
        <span>PB / 01</span>
      </div>
      <p className="pd-stage-note">{PHOTO_NOTE}</p>
    </div>
  );
}

export default function ProductPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [bundle, setBundle] = useState<Bundle>("double");
  const [sizeOne, setSizeOne] = useState<Size | "">("");
  const [sizeTwo, setSizeTwo] = useState<Size | "">("");
  const [busy, setBusy] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const product = products[bundle];

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutMessage("");
    if (!sizeOne || (bundle === "double" && !sizeTwo)) {
      setCheckoutMessage("Please choose a size for each pair.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundle, firstSize: sizeOne,
          ...(bundle === "double" ? { secondSize: sizeTwo } : {}),
        }),
      });
      const data: { url?: string; error?: string } = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "We couldn't open checkout. Please try again.");
      }
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutMessage(error instanceof Error ? error.message : "We couldn't open checkout.");
      setBusy(false);
    }
  }

  return (
    <>
      {store.preview && (
        <div className="preview-banner" role="status">
          <span className="preview-pulse" aria-hidden="true"/>
          LAUNCH PREVIEW <span className="preview-separator">/</span> Product, pricing and checkout are pending verification
        </div>
      )}
      <div className="announcement"><span>MORE COURT. LESS COMPROMISE.</span><ArrowUpRight size={13}/></div>
      <header className="site-header pd-header">
        <div className="container header-inner">
          <ProductLogo/>
          <nav className={`desktop-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation" id="product-navigation">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="#product-benefits" onClick={() => setMenuOpen(false)}>Why PadelBoost</a>
            <a href="#product-faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a href="#buy" className="mobile-nav-buy" onClick={() => setMenuOpen(false)}>Shop insoles <ArrowRight size={17}/></a>
          </nav>
          <div className="header-actions">
            <a href="#buy" className="header-buy">SHOP INSOLES <ArrowUpRight size={16}/></a>
            <button type="button" className="menu-toggle" aria-expanded={menuOpen}
              aria-controls="product-navigation" aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(current => !current)}>
              {menuOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>
      </header>

      <main id="product-main">
        <div className="container pd-breadcrumbs"><Link href="/"><ArrowLeft size={14}/> HOME</Link><span>/</span><span>PADELBOOST INSOLES</span></div>

        <section className="container pd-product-top" aria-labelledby="product-title">
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              <ProductVisual slide={slide}/>
              <span className="pd-gallery-index">{String(slide + 1).padStart(2, "0")} / 03</span>
              <div className="pd-gallery-nav">
                <button type="button" onClick={() => setSlide(current => (current + 2) % 3)}
                  aria-label="Previous product visual"><ArrowLeft size={19}/></button>
                <button type="button" onClick={() => setSlide(current => (current + 1) % 3)}
                  aria-label="Next product visual"><ArrowRight size={19}/></button>
              </div>
            </div>
            <div className="pd-gallery-thumbs" aria-label="Choose product visual">
              {visualThumbs.map((item, index) => (
                <button type="button" key={item.subtitle} onClick={() => setSlide(index)}
                  aria-pressed={slide === index}
                  aria-label={`Show ${item.title.toLowerCase()} visual`}
                  className={`pd-thumb ${slide === index ? "pd-thumb-active" : ""}`}>
                  <span className={`pd-thumb-art pd-thumb-${index}`}>
                    {index < 2 ? <InsoleArt/> : <span className="pd-thumb-numbers">01<br/>02<br/>03</span>}
                  </span>
                  <span className="pd-thumb-caption"><b>{item.title}</b><small>{item.subtitle}</small></span>
                </button>
              ))}
            </div>
          </div>

          <div className="pd-buy" id="buy">
            <div className="pd-buy-topline"><span className="eyebrow">THE PADELBOOST COLLECTION / NO. 01</span><span className="pd-prelaunch">PRE-LAUNCH</span></div>
            <h1 id="product-title">THE PADEL<br/><em>INSOLE.</em></h1>
            <p className="pd-subheading">KEEP YOUR SHOES. UPGRADE WHAT'S INSIDE.</p>
            <div className="pd-price-start"><span>FROM <strong>{eur(products.single.price)}</strong></span><small>EUR · Initial pricing for review</small></div>
            <p className="pd-summary">For the player who's always up for one more set. A simple underfoot upgrade to explore before replacing the padel shoes you already like.</p>
            <div className="pd-quick-points">
              <div><Check size={17}/><span>An in-shoe addition to your padel routine</span></div>
              <div><Check size={17}/><span>Choose one pair or a two-pair setup</span></div>
              <div><Check size={17}/><span>Both pairs can be different EU sizes</span></div>
            </div>

            <form onSubmit={checkout} className="pd-order-form">
              <fieldset className="pd-option-group">
                <legend><span>01</span> CHOOSE YOUR SETUP</legend>
                <div className="pd-option-list">
                  <label className={`pd-bundle ${bundle === "single" ? "pd-bundle-active" : ""}`}>
                    <input type="radio" name="pd-bundle" value="single" checked={bundle === "single"} onChange={() => {setBundle("single");setCheckoutMessage("");}}/>
                    <span className="pd-radio"><Check size={13}/></span>
                    <span className="pd-bundle-name"><strong>THE STARTER PAIR</strong><small>1 pair / For your current shoes</small></span>
                    <span className="pd-bundle-price">{eur(products.single.price)}</span>
                  </label>
                  <label className={`pd-bundle ${bundle === "double" ? "pd-bundle-active" : ""}`}>
                    <input type="radio" name="pd-bundle" value="double" checked={bundle === "double"} onChange={() => {setBundle("double");setCheckoutMessage("");}}/>
                    <span className="pd-radio"><Check size={13}/></span>
                    <span className="pd-bundle-name">
                      <strong>THE DOUBLES PACK <span className="pd-popular">POPULAR OPTION</span></strong>
                      <small>2 pairs / Keep a spare or share</small>
                      <small className="pd-saving">SAVE {eur(products.single.price * 2 - products.double.price)} VS TWO SINGLES</small>
                    </span>
                    <span className="pd-bundle-price">{eur(products.double.price)}<s>{eur(products.single.price * 2)}</s></span>
                  </label>
                </div>
              </fieldset>

              <fieldset className="pd-option-group pd-sizes">
                <legend><span>02</span> SELECT YOUR EU SIZE</legend>
                <div className="pd-size-fields">
                  <label htmlFor="pd-size-one">PAIR 01
                    <span className="pd-select-wrap"><select id="pd-size-one" required value={sizeOne}
                      onChange={event => {setSizeOne(event.target.value as Size | "");setCheckoutMessage("");}}>
                      <option value="">Select your size</option>
                      {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                    </select><ChevronDown size={16}/></span>
                  </label>
                  {bundle === "double" && <label htmlFor="pd-size-two">PAIR 02
                    <span className="pd-select-wrap"><select id="pd-size-two" required value={sizeTwo}
                      onChange={event => {setSizeTwo(event.target.value as Size | "");setCheckoutMessage("");}}>
                      <option value="">Select your size</option>
                      {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                    </select><ChevronDown size={16}/></span>
                  </label>}
                </div>
                <p className="pd-sizing-note"><Ruler size={14}/> Size bands are provisional; measured sizes will be published before launch.</p>
              </fieldset>

              <div className="pd-checkout-total"><span>YOUR SETUP <small>{product.quantity} {product.quantity === 1 ? "PAIR" : "PAIRS"}</small></span><strong>{eur(product.price)}</strong></div>
              <button className="pd-checkout-btn" type="submit" disabled={busy}>
                <span><ShoppingBag size={19}/>{busy ? "OPENING CHECKOUT…" : store.preview ? "TEST CHECKOUT" : "CONTINUE TO CHECKOUT"}</span>
                <ArrowUpRight size={21}/>
              </button>
              {checkoutMessage && <p role="alert" className="pd-checkout-error">{checkoutMessage}</p>}
              <p className="pd-shipping-note">Shipping calculated at checkout. Taxes and final delivery details to be confirmed before launch.</p>
              <div className="pd-secure-row"><span><LockKeyhole size={16}/> HOSTED STRIPE CHECKOUT</span><span><ShieldCheck size={16}/> EU CONSUMER RIGHTS</span></div>
            </form>

            <div className="pd-buy-links">
              <a href="#product-details">PRODUCT DETAILS <ArrowRight size={16}/></a>
              <Link href="/shipping-returns">SHIPPING & RETURNS <ArrowUpRight size={16}/></Link>
            </div>
          </div>
        </section>

        <section className="pd-promise-bar" aria-label="At a glance">
          <div className="container pd-promise-inner"><span>✳ ONE PRODUCT. ONE SIMPLE SWITCH.</span><span>↗ MADE FOR YOUR PADEL ROUTINE</span><span>◎ PLANNED FOR EU DELIVERY</span></div>
        </section>

        <section className="pd-editorial" id="product-benefits">
          <div className="container pd-editorial-inner">
            <div><p className="eyebrow">01 / WHY THE SWITCH</p><h2>THE GAME<br/>IS GOOD.<br/><em>THE SHOES?</em></h2></div>
            <div className="pd-editorial-side">
              <span className="pd-editorial-mark">✳</span>
              <p>Your shoes have probably seen a lot of rallies. If you're still happy with them but curious about changing what you feel underfoot, consider starting on the inside.</p>
              <p>PadelBoost is about making that switch simple. No impossible performance promises, no replacing gear just for the sake of it.</p>
              <a href="#buy">FIND YOUR SETUP <ArrowUpRight size={19}/></a>
            </div>
          </div>
        </section>

        <section className="container pd-details" id="product-details">
          <div className="pd-section-line"><span>02 / PRODUCT DETAILS</span><span>KNOW WHAT YOU'RE BUYING</span></div>
          <div className="pd-details-head">
            <h2>THE <em>DETAILS.</em></h2>
            <p>A clear guide to the product and buying process. Exact materials, measurements and performance specifications will be published after physical verification.</p>
          </div>
          <div className="pd-details-grid">
            <article><span>01 / USE</span><h3>IN-SHOE UPGRADE</h3><p>Designed to be explored as a replacement for removable insoles in compatible sports shoes. Always check that your shoes still fit correctly.</p></article>
            <article><span>02 / SIZES</span><h3>FIND YOUR FIT</h3><p>Choose your EU size for each pair. Full measured lengths, widths and any trimming guidance must be verified before launch.</p></article>
            <article><span>03 / BUNDLES</span><h3>ONE OR TWO PAIRS</h3><p>Start with one pair or choose two, whether you want another for a spare pair of shoes or someone you play with.</p></article>
          </div>
          <div className="pd-safety-note"><ShieldCheck size={20}/><p>PadelBoost does not promise to prevent or treat injuries. If you have ongoing foot, knee or ankle pain, consult a qualified healthcare professional.</p></div>
        </section>

        <section className="pd-secondary-cta">
          <div className="container pd-secondary-inner">
            <span className="eyebrow">YOUR NEXT MATCH STARTS HERE</span>
            <h2>KEEP PLAYING<br/><em>YOUR WAY.</em></h2>
            <a href="#buy">CHOOSE YOUR PAIR <ArrowUpRight size={19}/></a>
          </div>
        </section>

        <section className="container pd-faq" id="product-faq">
          <div className="pd-faq-heading"><span className="eyebrow">03 / GOOD QUESTIONS</span><h2>BEFORE<br/>YOU <em>BUY.</em></h2><p>All the important answers in one place—no complicated sales pitch.</p></div>
          <div className="pd-faq-list">
            {productFaqs.map((item,index) => (
              <details key={item.question}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.question}</strong><ChevronDown size={20}/></summary>
                <p>{item.answer}</p>
              </details>
            ))}
            <p className="pd-faq-contact">{store.contactEmail ? <>Still have questions? <a href={`mailto:${store.contactEmail}`}>Contact us <ArrowUpRight size={15}/></a></> : "More questions? A support email will be published before launch."}</p>
          </div>
        </section>
      </main>

      <footer className="site-footer pd-footer">
        <div className="container">
          <div className="footer-top">
            <Link href="/" className="logo logo-light"><span className="logo-mark" aria-hidden="true"><span/></span><span>padel<span className="logo-boost">boost</span><span className="logo-dot">.</span></span></Link>
            <p>More court.<br/>Less compromise.</p>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} PadelBoost</span>
            <div className="footer-links"><Link href="/">HOME</Link><Link href="/shipping-returns">SHIPPING & RETURNS</Link><Link href="/privacy">PRIVACY</Link><Link href="/terms">TERMS</Link>{store.contactEmail && <a href={`mailto:${store.contactEmail}`}>CONTACT</a>}</div>
            <a className="back-top" href="#product-main">BACK TO TOP ↑</a>
          </div>
          {store.preview && <p className="footer-preview">PRE-LAUNCH PROTOTYPE — Illustrative product imagery and provisional size ranges and pricing. No live payments.</p>}
        </div>
      </footer>
      <a className="pd-mobile-buy" href="#buy"><span>CHOOSE YOUR PAIR</span><strong>FROM {eur(products.single.price)}</strong><ArrowUpRight size={20}/></a>
    </>
  );
}

import Link from "next/link";
export default function NotFound() {
  return <main className="simple-page"><div className="simple-inner"><p className="eyebrow">404 / LOST BALL</p><h1>Not the court you were looking for.</h1><p>Head back to PadelBoost to keep exploring.</p><Link className="btn btn-dark" href="/">Back to PadelBoost →</Link></div></main>;
}

import { useId } from "react";

/**
 * Editorial illustration only. Replace with real, verified PadelBoost product
 * photography before changing the storefront from preview to live.
 */
export default function InsoleArt({ className = "", label = "Illustration of sports insoles" }: { className?: string; label?: string }) {
  const gradient = useId().replaceAll(":", "");
  return (
    <svg className={className} viewBox="0 0 680 740" role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`body-${gradient}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#535d54" />
          <stop offset=".35" stopColor="#26312c" />
          <stop offset="1" stopColor="#101814" />
        </linearGradient>
        <linearGradient id={`surface-${gradient}`} x1="0" y1="0" x2=".75" y2="1">
          <stop offset="0" stopColor="#71827a" />
          <stop offset=".42" stopColor="#344139" />
          <stop offset="1" stopColor="#1d2b24" />
        </linearGradient>
        <linearGradient id={`flash-${gradient}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbf59c" />
          <stop offset="1" stopColor="#a0c665" />
        </linearGradient>
        <filter id={`shadow-${gradient}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="19" />
        </filter>
        <g id={`sole-${gradient}`}>
          <path d="M174 16 C96 14 44 56 36 137 C26 235 70 287 108 355 C132 395 132 468 123 536 C113 608 140 671 213 679 C283 686 319 636 304 555 C286 451 277 410 301 321 C326 231 342 167 317 98 C297 44 242 14 174 16 Z" fill="#080f0b" stroke="#0c1711" strokeWidth="15" />
          <path d="M174 22 C100 20 52 60 44 140 C35 235 77 289 116 358 C139 401 141 466 132 538 C123 604 145 657 214 664 C274 669 302 628 290 551 C275 455 265 407 288 319 C313 228 328 167 305 105 C285 49 234 22 174 22 Z" fill={`url(#body-${gradient})`} stroke="#7e957d" strokeWidth="2" />
          <path d="M176 45 C116 43 75 77 66 145 C57 222 97 283 133 351 C153 393 160 471 151 536 C143 594 165 629 214 632 C264 634 272 601 262 544 C244 449 242 401 267 316 C292 230 305 164 283 107 C265 68 228 45 176 45 Z" fill={`url(#surface-${gradient})`} stroke="#556a58" strokeWidth="2" />
          <path d="M83 119 C116 62 236 56 277 112" fill="none" stroke="#afce9e" strokeOpacity=".35" strokeWidth="3"/>
          <path d="M79 148 C112 89 249 86 287 145" fill="none" stroke="#afce9e" strokeOpacity=".22" strokeWidth="2"/>
          <path d="M79 176 C123 120 253 127 285 182" fill="none" stroke="#afce9e" strokeOpacity=".19" strokeWidth="2"/>
          <path d="M89 209 C138 167 261 168 281 219" fill="none" stroke="#afce9e" strokeOpacity=".16" strokeWidth="2"/>
          <path d="M108 260 C147 236 246 229 267 270" fill="none" stroke="#afce9e" strokeOpacity=".16" strokeWidth="2"/>
          <path d="M172 357 C192 338 241 340 263 357 C231 384 232 454 249 518 C228 480 204 469 176 476 C184 426 186 392 172 357 Z" fill={`url(#flash-${gradient})`} opacity=".88" />
          <path d="M169 555 Q212 534 256 551 Q266 613 213 616 Q162 612 169 555 Z" fill="#91b65c" fillOpacity=".4" stroke="#d0eca2" strokeOpacity=".6" strokeWidth="2"/>
          <path d="M169 581 Q214 568 260 582" fill="none" stroke="#cceca0" strokeOpacity=".6" strokeWidth="2"/>
          <text x="183" y="306" transform="rotate(90 183 306)" fill="#d5edb2" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="26" letterSpacing="5" opacity=".88">PB / 01</text>
          <path d="M42 146 C36 260 93 315 114 362 C151 442 123 563 143 607" fill="none" stroke="#d9eec6" strokeOpacity=".36" strokeWidth="5" strokeLinecap="round"/>
        </g>
      </defs>
      <ellipse cx="356" cy="652" rx="241" ry="40" fill="#0a1b0f" opacity=".33" filter={`url(#shadow-${gradient})`}/>
      <use href={`#sole-${gradient}`} transform="translate(290 35) rotate(23 178 340) scale(.89)" opacity=".85"/>
      <use href={`#sole-${gradient}`} transform="translate(60 12) rotate(-21 178 340)" />
      <path d="M31 627 H138 M31 627 V540" stroke="#cff9a5" opacity=".58" strokeWidth="1" />
      <path d="M537 71 H650 M650 71 V161" stroke="#cff9a5" opacity=".58" strokeWidth="1" />
    </svg>
  );
}

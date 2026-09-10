/**
 * Regenerates static/og-image.png, the 1200x630 image link unfurlers show for
 * a shared link. Run it after changing the wording, palette, or clock.
 *
 *   npm i --no-save @resvg/resvg-js
 *   node .scratch/link-preview/make-og.mjs
 *
 * @resvg/resvg-js is deliberately not a package.json dependency: the image is
 * committed, so nothing in the build or the deploy needs a rasterizer. The
 * headline font falls back to whatever metric-compatible sans the machine has,
 * so check the result before committing it.
 */

import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const INK = "#17252c";
const CREAM = "#f8f4e8";
const ORANGE = "#f26b3a";
const MINT = "#bce1cf";
const FONT = "Liberation Sans, Arial, Helvetica, sans-serif";

const time = { hour: 10, minute: 10 };
const angles = {
  hour: ((time.hour % 12) + time.minute / 60) * 30,
  minute: time.minute * 6,
};

const ticks = Array.from({ length: 60 }, (_, i) => {
  const major = i % 5 === 0;
  return `<line x1="100" y1="15" x2="100" y2="${major ? 24 : 19}" stroke="#111111" stroke-width="${major ? 2.5 : 0.9}" transform="rotate(${i * 6} 100 100)"/>`;
}).join("");

const numerals = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  const rad = (n * 30 * Math.PI) / 180;
  const x = 100 + Math.sin(rad) * 65;
  const y = 100 - Math.cos(rad) * 65;
  return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-size="21" font-weight="700" fill="#111111" font-family="${FONT}">${n}</text>`;
}).join("");

const clock = `
<svg x="730" y="115" width="400" height="400" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="94" fill="#ffffff" stroke="#111111" stroke-width="9"/>
  ${ticks}
  ${numerals}
  <line x1="100" y1="108" x2="100" y2="25" stroke="#111111" stroke-width="4" stroke-linecap="round" transform="rotate(${angles.minute} 100 100)"/>
  <line x1="100" y1="107" x2="100" y2="55" stroke="#111111" stroke-width="7" stroke-linecap="round" transform="rotate(${angles.hour} 100 100)"/>
  <circle cx="100" cy="100" r="4.5" fill="#111111"/>
</svg>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>

  <circle cx="505" cy="-60" r="190" fill="none" stroke="${ORANGE}" stroke-opacity="0.16" stroke-width="2"/>
  <circle cx="1135" cy="585" r="105" fill="${MINT}" fill-opacity="0.3"/>
  <circle cx="60" cy="470" r="150" fill="none" stroke="${INK}" stroke-opacity="0.07" stroke-width="2"/>

  <g transform="translate(78, 74)">
    <circle cx="26" cy="26" r="26" fill="${INK}"/>
    <g transform="translate(26,26) scale(1.35) translate(-12,-12)">
      <circle cx="12" cy="12" r="8" fill="none" stroke="${CREAM}" stroke-width="1.8"/>
      <path d="M12 7v5l3.5 2" fill="none" stroke="${CREAM}" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <text x="68" y="26" dominant-baseline="central" font-family="${FONT}" font-size="30" font-weight="600" letter-spacing="-0.6" fill="${INK}">Clock Literacy</text>
  </g>

  <text x="78" y="300" font-family="${FONT}" font-size="76" font-weight="700" letter-spacing="-3.4" fill="${INK}">Practice Reading</text>
  <text x="78" y="384" font-family="${FONT}" font-size="76" font-weight="700" letter-spacing="-3.4" fill="${INK}">an Analog Clock.</text>

  <text x="78" y="452" font-family="${FONT}" font-size="29" fill="${INK}" fill-opacity="0.66">Choose a level and get started.</text>

  <g transform="translate(78, 492)">
    <rect width="332" height="72" rx="36" fill="${INK}"/>
    <text x="42" y="37" dominant-baseline="central" font-family="${FONT}" font-size="25" font-weight="700" fill="#ffffff">Start practicing</text>
    <circle cx="272" cy="36" r="20" fill="#ffffff" fill-opacity="0.16"/>
    <text x="272" y="37" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="22" fill="#ffffff">&#8594;</text>
  </g>

  <circle cx="930" cy="315" r="222" fill="none" stroke="${INK}" stroke-opacity="0.22" stroke-width="2.5" stroke-dasharray="11 11"/>
  ${clock}

  <g transform="translate(1002, 74) rotate(6)">
    <rect width="196" height="46" rx="23" fill="${ORANGE}"/>
    <text x="98" y="24" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="17" font-weight="700" letter-spacing="1.1" fill="#ffffff">TAKE YOUR TIME</text>
  </g>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Liberation Sans" },
});
const out = fileURLToPath(
  new URL("../../static/og-image.png", import.meta.url),
);
writeFileSync(out, resvg.render().asPng());
console.log(`wrote ${out}`);

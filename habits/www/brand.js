// The Roj Habit mark: three brush strokes in the first logo's colours, drawn round like an
// ensō (the one-stroke circle of daily practice). Each stroke presses in, swells, thins and
// ends in dry bristle lines; the circle wobbles a little. A seeded generator keeps every
// drawing identical. Used by app.js (window.RojBrand) and scripts/icons.js (require).
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RojBrand = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const INKS = ["#3A78BF", "#C4643C", "#4C8660"]; // blue, clay, sage
  // Start and end of each stroke in degrees, clockwise from 12 o'clock.
  const STROKES = [[-8, 106], [118, 230], [242, 346]];

  function rng(seed) {
    return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  }
  const f = (n) => Math.round(n * 10) / 10;

  // One stroke as a filled outline around a wobbly arc, plus bristle streaks at its tail.
  function stroke(cx, cy, r, width, a0, a1, seed, color) {
    const rand = rng(seed);
    const ph1 = rand() * 6, ph2 = rand() * 6, ph3 = rand() * 6;
    const N = 72, left = [], right = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const deg = a0 + (a1 - a0) * t;
      const th = ((deg - 90) * Math.PI) / 180;
      const rr = r * (1 + 0.014 * Math.sin(3 * th + ph1) + 0.008 * Math.sin(7 * th + ph2));
      // press at the start, a slight swell, a long taper at the end
      const press = Math.pow(Math.min(1, t / 0.07), 0.45);
      const lift = 1 - 0.55 * Math.pow(Math.max(0, (t - 0.6) / 0.4), 1.7);
      const w = width * press * lift * (1 + 0.07 * Math.sin(11 * t + ph3)) * (0.92 + 0.12 * Math.sin(Math.PI * t));
      const x = cx + rr * Math.cos(th), y = cy + rr * Math.sin(th);
      const nx = Math.cos(th), ny = Math.sin(th);
      left.push([x + nx * w / 2, y + ny * w / 2]);
      right.push([x - nx * w / 2, y - ny * w / 2]);
    }
    let d = "M" + f(left[0][0]) + " " + f(left[0][1]);
    for (let i = 1; i < left.length; i++) d += "L" + f(left[i][0]) + " " + f(left[i][1]);
    for (let i = right.length - 1; i >= 0; i--) d += "L" + f(right[i][0]) + " " + f(right[i][1]);
    // round the pressed start like a loaded brush
    const s = left[0], e = right[0];
    d += "Q" + f((s[0] + e[0]) / 2 - (s[1] - e[1]) * 0.45) + " " + f((s[1] + e[1]) / 2 + (s[0] - e[0]) * 0.45) + " " + f(s[0]) + " " + f(s[1]) + "Z";
    let out = '<path d="' + d + '" fill="' + color + '"/>';
    // dry-brush streaks: thin lines that run past the end of the stroke
    for (let k = 0; k < 3; k++) {
      const off = (k - 1) * width * 0.22 + (rand() - 0.5) * width * 0.08;
      const from = a0 + (a1 - a0) * (0.72 + rand() * 0.08), to = a1 + 3 + rand() * 6;
      let p = "";
      for (let i = 0; i <= 14; i++) {
        const deg = from + (to - from) * (i / 14), th = ((deg - 90) * Math.PI) / 180;
        const rr = r * (1 + 0.014 * Math.sin(3 * th + ph1) + 0.008 * Math.sin(7 * th + ph2)) + off;
        p += (i ? "L" : "M") + f(cx + rr * Math.cos(th)) + " " + f(cy + rr * Math.sin(th));
      }
      out += '<path d="' + p + '" fill="none" stroke="' + color + '" stroke-width="' + f(width * (0.05 + rand() * 0.04)) + '" stroke-linecap="round" opacity="' + f(0.55 + rand() * 0.35) + '"/>';
    }
    return out;
  }

  // The three strokes around (cx, cy). ink: one colour for all (template images), or null for the three inks.
  function ring(cx, cy, r, width, ink) {
    return STROKES.map((a, i) => stroke(cx, cy, r, width, a[0], a[1], 41 + i * 97, ink || INKS[i])).join("");
  }

  // Warm paper with a little grain, as a tile. id keeps gradient and filter ids unique on a page.
  function paperDefs(id) {
    return '<linearGradient id="' + id + 'p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8F2"/><stop offset="1" stop-color="#EEE7DA"/></linearGradient>' +
      '<filter id="' + id + 'g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/>' +
      '<feColorMatrix values="0 0 0 0 .35  0 0 0 0 .28  0 0 0 0 .18  0 0 0 .09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
      // roughens the stroke edges so they read as ink on paper, not vector
      '<filter id="' + id + 'r" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter>';
  }
  function tile(id, x, y, size, rx) {
    return '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" rx="' + rx + '" fill="url(#' + id + 'p)"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" rx="' + rx + '" fill="#000" filter="url(#' + id + 'g)"/>';
  }

  // The full logo in a 1024 box: paper tile and the three strokes.
  function logo(id) {
    return '<defs>' + paperDefs(id) + "</defs>" + tile(id, 0, 0, 1024, 230) +
      '<g filter="url(#' + id + 'r)">' + ring(512, 512, 300, 116) + "</g>";
  }

  return { INKS, ring, paperDefs, tile, logo };
});

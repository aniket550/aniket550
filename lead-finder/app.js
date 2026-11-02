/* Lead Finder: state -> restaurants -> jinki website nahi -> WhatsApp pe offer.
 * Sab data sirf aapke browser (localStorage) mein rehta hai. Koi server nahi. */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const PAGE = 40;
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // [value, label] — status ka rang CSS mein .s-<value>
  const STATUSES = [
    ["new", "Naya"],
    ["sent", "Message gaya"],
    ["replied", "Reply aaya"],
    ["interested", "Interested"],
    ["won", "Deal pakki"],
    ["no", "Mana kiya"],
  ];
  const STATUS_LABEL = Object.fromEntries(STATUSES);
  const GOOGLE_FIELDS = [
    "places.id", "places.displayName", "places.formattedAddress", "places.nationalPhoneNumber",
    "places.internationalPhoneNumber", "places.websiteUri", "places.rating", "places.userRatingCount",
    "places.googleMapsUri", "places.businessStatus", "nextPageToken",
  ].join(",");
  const OVERPASS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  ];
  const DEFAULT_MSG = [
    "Namaste {name} 🙏",
    "",
    "Main {myName}, ek web developer hun. Online dekha ki {name} ki {reason}.",
    "",
    "Apni website se customers seedha aapka menu, photos, timing aur location dekh kar call/WhatsApp pe order kar sakte hain. Zomato/Swiggy ka commission bhi bachta hai.",
    "",
    "Main aapke liye ek FREE demo website bana kar dikha sakta hun. Pasand aaye tabhi aage baat karenge.",
    "Mera kaam: {link}",
    "",
    "Interest ho to is number pe reply ya call karein: {myPhone}",
    "Interest na ho to bata dijiye, dobara message nahi karunga.",
    "— {myName}",
  ].join("\n");

  // ---------- icons (SF Symbols jaise, sab currentColor) ----------
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/>',
    gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    chat: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3A8.5 8.5 0 1 1 20.5 11.5z"/>',
    phone: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2A18 18 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.4 10.9a15 15 0 0 0 4.7 4.7l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.2a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.5"/>',
    link: '<path d="M10 13.5a4.5 4.5 0 0 0 6.8.5l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.6 1.6"/><path d="M14 10.5a4.5 4.5 0 0 0-6.8-.5l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.6-1.6"/>',
    pencil: '<path d="M16.5 3.6a2.1 2.1 0 0 1 3 3L7.5 18.6 3.5 20l1.4-4z"/>',
    more: '<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    download: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13"/>',
    bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor" stroke="none"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor" stroke="none"/>',
    reply: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.8 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.7 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;
  const paintIcons = (root) => (root || document).querySelectorAll("[data-icon]:empty").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

  // ---------- storage (try/catch: private mode mein localStorage fail ho sakta hai) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  let leads = store.get("lf_leads", {});
  let settings = Object.assign({ name: "", phone: "", link: "", key: "", limit: 30, msg: DEFAULT_MSG }, store.get("lf_settings", {}));
  let shown = PAGE;
  const saveLeads = () => { if (!store.set("lf_leads", leads)) toast("Storage bhar gaya. CSV export karke purane leads mitao.", "alert", "var(--red)"); };
  const saveSettings = () => store.set("lf_settings", settings);
  const today = () => new Date().toISOString().slice(0, 10);
  const sentToday = () => store.get("lf_sent_" + today(), 0);

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const initials = (s) => (s.match(/[\p{L}\p{N}]+/gu) || ["?"]).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  // ---------- Dynamic Island jaisa toast ----------
  let toastTimer;
  function toast(msg, ic = "check", tone = "var(--green)", ms = 2800) {
    const t = $("toast");
    t.style.setProperty("--tone", tone);
    t.innerHTML = `<span class="ic">${icon(ic)}</span><span>${esc(msg)}</span>`;
    t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  // ---------- overlays: sheet / alert / action sheet ----------
  function overlay(inner, { onClose } = {}) {
    const wrap = document.createElement("div");
    wrap.className = "overlay";
    wrap.innerHTML = `<div class="backdrop"></div>${inner}`;
    document.body.appendChild(wrap);
    document.documentElement.classList.add("locked");
    paintIcons(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add("open")));
    let closed = false;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    function close(val) {
      if (closed) return; closed = true;
      wrap.classList.remove("open");
      document.removeEventListener("keydown", onKey);
      if (!document.querySelectorAll(".overlay.open").length) document.documentElement.classList.remove("locked");
      setTimeout(() => wrap.remove(), reduceMotion ? 0 : 560);
      onClose && onClose(val);
    }
    wrap.querySelector(".backdrop").addEventListener("click", () => close());
    document.addEventListener("keydown", onKey);
    return { wrap, close };
  }

  function sheet(title, body, onMount) {
    const o = overlay(`<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title || "Sheet")}">
      <div class="grabber"></div>
      <div class="sheet-head"><h2>${esc(title || "")}</h2><button class="x-btn" type="button" aria-label="Band karo" data-close>${icon("x")}</button></div>
      ${body}</div>`);
    o.wrap.querySelector("[data-close]").addEventListener("click", () => o.close());
    onMount && onMount(o.wrap.querySelector(".sheet"), o.close);
    return o.close;
  }

  function ask({ title, message = "", ok = "OK", cancel = "Cancel", destructive = false }) {
    return new Promise((resolve) => {
      const o = overlay(`<div class="alert" role="alertdialog" aria-modal="true" aria-label="${esc(title)}">
        <h3>${esc(title)}</h3><p>${esc(message)}</p>
        <div class="alert-btns"><button type="button" data-v="0">${esc(cancel)}</button><button type="button" data-v="1" class="${destructive ? "destructive" : ""}">${esc(ok)}</button></div></div>`,
        { onClose: (v) => resolve(v === true) });
      o.wrap.querySelectorAll(".alert-btns button").forEach((b) => b.addEventListener("click", () => o.close(b.dataset.v === "1")));
      o.wrap.querySelector('[data-v="1"]').focus();
    });
  }

  function actionSheet(title, items) {
    const o = overlay(`<div class="asheet" role="dialog" aria-modal="true">
      <div class="asheet-group">${title ? `<div class="asheet-title">${esc(title)}</div>` : ""}
        ${items.map((it, i) => `<button type="button" data-i="${i}" class="${it.destructive ? "destructive" : ""}">${it.icon ? icon(it.icon) : ""}${esc(it.label)}</button>`).join("")}</div>
      <div class="asheet-group"><button type="button" class="cancel" data-i="-1">Cancel</button></div></div>`);
    o.wrap.querySelectorAll(".asheet button").forEach((b) => b.addEventListener("click", () => {
      o.close();
      const it = items[+b.dataset.i];
      if (it) setTimeout(it.run, 120);
    }));
  }

  // ---------- phone / website samajhna ----------
  /** Mobile (WhatsApp chalega) = 10 digit, 6-9 se shuru.
   * Dhyan: landline bhi 10 digit hote hain (0612-2223333 = Patna, 080-... = Bengaluru) aur STD code
   * 6/7/8 se shuru ho sakta hai. Isliye digits ke group bhi dekhte hain: mobile "98765 43210" (5+5)
   * ya "9876543210" (ek saath) likha jaata hai; landline "612 222 3333" / "0612-2223333" (2-4 digit STD pehle). */
  function parsePhones(raw) {
    const out = { wa: "", tel: "", display: "" };
    if (!raw) return out;
    const parts = String(raw).split(/[;,/]|\s{2,}/).map((p) => p.trim()).filter(Boolean);
    for (const p of parts) {
      let g = p.match(/\d+/g) || [];
      if (g.length > 1 && (g[0] === "91" || g[0] === "0091")) g.shift(); // "+91 98765 43210"
      if (g.length === 1 && /^(0091|91)\d{10}$/.test(g[0])) g[0] = g[0].slice(g[0].length - 10); // "+919876543210"
      if (g[0] && g[0].startsWith("0")) g[0] = g[0].slice(1); // "098765 43210", "0612-..."
      g = g.filter(Boolean);
      const d = g.join("");
      if (d.length < 6) continue;
      const mobile = d.length === 10 && /^[6-9]/.test(d) && (g.length === 1 || g[0].length >= 5);
      if (!out.display) { out.display = p; out.tel = "+91" + d.replace(/^0+/, ""); }
      if (!out.wa && mobile) { out.wa = "91" + d; out.tel = "+91" + d; out.display = p; }
    }
    return out;
  }

  /** Website hai? Ya sirf Facebook/Zomato page? */
  function classifySite(url) {
    if (!url) return { type: "none", label: "" };
    let host = "";
    try { host = new URL(/^https?:\/\//i.test(url) ? url : "http://" + url).hostname.toLowerCase().replace(/^www\./, ""); } catch (e) { host = String(url).toLowerCase(); }
    const hit = window.SOCIAL_DOMAINS.find((d) => host === d || host.endsWith("." + d));
    if (hit) return { type: "social", label: hit };
    return { type: "site", label: host };
  }
  const SOCIAL_NAME = { "zomato.com": "Zomato", "swiggy.com": "Swiggy", "instagram.com": "Instagram", "facebook.com": "Facebook", "fb.com": "Facebook", "justdial.com": "Justdial", "business.site": "purani Google site (band ho chuki)" };
  const socialName = (h) => SOCIAL_NAME[h] || h;

  function score(l) {
    // score 0-100: website nahi (50) + WhatsApp number (30) + reviews (15) + rating 4+ (5)
    let s = l.siteType === "none" ? 50 : l.siteType === "social" ? 35 : 0;
    s += l.wa ? 30 : l.tel ? 10 : 0;
    s += Math.min(15, Math.log10((l.reviews || 0) + 1) * 6); // zyada reviews = chalti dukaan = paisa de sakti hai
    if ((l.rating || 0) >= 4) s += 5;
    return Math.round(s);
  }

  function upsert(lead) {
    const old = leads[lead.id];
    if (old) {
      // naya data lo, par aapka status/note mat bigaado
      leads[lead.id] = Object.assign({}, old, lead, { status: old.status, note: old.note, sentAt: old.sentAt, addedAt: old.addedAt });
      return false;
    }
    leads[lead.id] = Object.assign({ status: "new", note: "", sentAt: "", addedAt: new Date().toISOString() }, lead);
    return true;
  }

  function makeLead(base, rawPhone, website) {
    const ph = parsePhones(rawPhone);
    const site = classifySite(website);
    const l = Object.assign(base, { phone: ph.display, wa: ph.wa, tel: ph.tel, website: website || "", siteType: site.type, siteHost: site.label });
    l.score = score(l);
    return l;
  }

  // ---------- Google Places (New) Text Search ----------
  async function googleQuery(textQuery, key) {
    let pageToken = "";
    const results = [];
    for (let page = 0; page < 3; page++) { // Google ek query pe max 60 (3 page x 20) deta hai
      const body = { textQuery, pageSize: 20, regionCode: "IN", languageCode: "en" };
      if (pageToken) body.pageToken = pageToken;
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": GOOGLE_FIELDS },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json.error && json.error.message) || "Google ne mana kiya (HTTP " + res.status + ")");
      results.push(...(json.places || []));
      pageToken = json.nextPageToken;
      if (!pageToken) break;
      await sleep(400);
    }
    return results;
  }

  async function searchGoogle(stateName, cities, keywords, progress) {
    if (!settings.key) {
      showView("settings");
      setTimeout(() => $("sKey").focus(), 400);
      throw new Error("Pehle Google API key daalo (ya OpenStreetMap chuno).");
    }
    if (!cities.length) throw new Error("Google ke liye kam se kam ek shehar likho.");
    let added = 0, total = 0, done = 0;
    const jobs = [];
    for (const city of cities) for (const kw of keywords) jobs.push({ city, kw });
    for (const { city, kw } of jobs) {
      progress(done / jobs.length, `${city} mein "${kw}" dhoondh rahe hain…`);
      const places = await googleQuery(`${kw} in ${city}, ${stateName}, India`, settings.key);
      for (const p of places) {
        if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;
        total++;
        const lead = makeLead({
          id: "g:" + p.id, src: "google", cat: kw,
          name: (p.displayName && p.displayName.text) || "Bina naam",
          address: p.formattedAddress || "", city, state: stateName,
          rating: p.rating || 0, reviews: p.userRatingCount || 0,
          maps: p.googleMapsUri || "",
        }, p.internationalPhoneNumber || p.nationalPhoneNumber, p.websiteUri);
        if (upsert(lead)) added++;
      }
      done++;
      progress(done / jobs.length, `Ab tak ${total} jagah mili, ${added} naye leads`);
    }
    return { total, added };
  }

  // ---------- OpenStreetMap (Overpass) ----------
  async function overpass(query) {
    let lastErr;
    for (const url of OVERPASS) {
      try {
        const res = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(query), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
      } catch (e) { lastErr = e; }
    }
    throw new Error("OpenStreetMap server busy hai (" + (lastErr && lastErr.message) + "). 1-2 minute baad try karo.");
  }

  async function searchOSM(state, cities, catIds, progress) {
    const tags = [];
    window.CATEGORIES.filter((c) => catIds.includes(c.id)).forEach((c) => tags.push(...c.osm));
    if (!tags.length) throw new Error("OpenStreetMap mein 'Dhaba' alag se nahi milta. Restaurant ya Cafe bhi chuno.");
    const isoRe = "^IN-(" + state.iso + ")$";
    const scope = cities.length ? "c" : "s";
    const cityPart = cities.length
      ? `rel["boundary"="administrative"]["name"~"^(${cities.map(reEsc).join("|")})$",i](area.s);map_to_area->.c;`
      : "";
    const body = tags.map(([k, v]) => `nwr["${k}"="${v}"]["name"](area.${scope});`).join("");
    const q = `[out:json][timeout:180];area["ISO3166-2"~"${isoRe}"]->.s;${cityPart}(${body});out center tags;`;
    progress(0.3, cities.length ? `${cities.join(", ")} mein dhoondh rahe hain… (1-2 min)` : `Poore ${state.name} mein dhoondh rahe hain… (2-3 min)`);
    const json = await overpass(q);
    let added = 0, total = 0;
    for (const el of json.elements || []) {
      const t = el.tags || {};
      if (!t.name) continue;
      total++;
      const lat = el.lat || (el.center && el.center.lat), lon = el.lon || (el.center && el.center.lon);
      const addr = [t["addr:housenumber"], t["addr:street"], t["addr:suburb"], t["addr:city"], t["addr:postcode"]].filter(Boolean).join(", ");
      const site = t.website || t["contact:website"] || t.url || t["contact:facebook"] || t.facebook || t["contact:instagram"] || t.instagram || "";
      const lead = makeLead({
        id: "o:" + el.type + el.id, src: "osm", cat: t.amenity || t.shop || "",
        name: t.name, address: addr, city: t["addr:city"] || t["addr:district"] || "", state: state.name,
        rating: 0, reviews: 0,
        maps: lat ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name)}%20${lat}%2C${lon}` : "",
      }, t.phone || t["contact:phone"] || t.mobile || t["contact:mobile"], site);
      if (upsert(lead)) added++;
    }
    return { total, added };
  }

  // ---------- message ----------
  function reasonFor(l) {
    if (l.siteType === "social") return `abhi sirf ${socialName(l.siteHost)} page hai, apni website nahi hai`;
    return "abhi koi website nahi hai";
  }
  function buildMessage(l, s = settings) {
    let tpl = s.msg || DEFAULT_MSG;
    if (!s.link) tpl = tpl.split("\n").filter((line) => !line.includes("{link}")).join("\n");
    const vars = { name: l.name, city: l.city || l.state, reason: reasonFor(l), myName: s.name || "", myPhone: s.phone || "", link: s.link || "" };
    return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  }

  // ---------- views + nav ----------
  const VIEWS = ["search", "leads", "settings"];
  let current = "search";
  const scrollPos = {};
  function showView(name) {
    if (name === current) { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); return; }
    scrollPos[current] = window.scrollY;
    $("view-" + current).hidden = true;
    const v = $("view-" + name);
    v.hidden = false;
    v.classList.remove("enter"); void v.offsetWidth; v.classList.add("enter");
    current = name;
    document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === name)));
    document.querySelector(".tabbar").style.setProperty("--i", VIEWS.indexOf(name));
    $("navTitle").textContent = v.dataset.title;
    $("navAction").hidden = name !== "leads";
    window.scrollTo(0, scrollPos[name] || 0);
    onScroll();
    if (name === "leads") render(true);
    store.set("lf_tab", name);
  }
  function onScroll() {
    const t = $("view-" + current).querySelector(".large-title");
    $("nav").classList.toggle("scrolled", t.getBoundingClientRect().bottom < $("nav").offsetHeight + 2);
  }

  // ---------- segmented control ----------
  function segmented(el, options, value, onChange) {
    el.style.setProperty("--n", options.length);
    el.innerHTML = `<span class="seg-thumb" aria-hidden="true"></span>` +
      options.map(([v, l]) => `<button type="button" role="radio" data-v="${v}">${esc(l)}</button>`).join("");
    function set(v, fire) {
      const i = Math.max(0, options.findIndex((o) => o[0] === v));
      el.style.setProperty("--i", i);
      el.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-checked", String(j === i)));
      el.dataset.value = options[i][0];
      if (fire) onChange(options[i][0]);
    }
    el.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && b.dataset.v !== el.dataset.value) set(b.dataset.v, true); });
    set(value, false);
    return { get: () => el.dataset.value, set };
  }

  // ---------- count-up numbers ----------
  function countTo(el, to) {
    const from = +el.dataset.v || 0;
    el.dataset.v = to;
    if (reduceMotion || from === to) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 650;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- render leads ----------
  let typeSeg, srcSeg;
  function filtered() {
    const type = typeSeg.get(), st = $("fStatus").value, ph = $("fPhone").value, txt = $("fText").value.trim().toLowerCase();
    const arr = Object.values(leads).filter((l) => {
      if (type === "lead" && l.siteType === "site") return false;
      if ((type === "none" || type === "social") && l.siteType !== type) return false;
      if (st && l.status !== st) return false;
      if (ph === "wa" && !l.wa) return false;
      if (ph === "any" && !l.tel) return false;
      if (txt && !(l.name + " " + l.address + " " + l.city).toLowerCase().includes(txt)) return false;
      return true;
    });
    const sort = $("fSort").value;
    arr.sort(sort === "name" ? (a, b) => a.name.localeCompare(b.name)
      : sort === "reviews" ? (a, b) => (b.reviews || 0) - (a.reviews || 0)
      : (a, b) => b.score - a.score || (b.reviews || 0) - (a.reviews || 0));
    return arr;
  }

  function renderStats() {
    const all = Object.values(leads);
    const n = (f) => all.filter(f).length;
    const sent = sentToday(), lim = settings.limit;
    const k = Math.min(1, sent / lim);
    const ringColor = sent >= lim ? "var(--red)" : k >= 0.8 ? "var(--orange)" : "var(--green)";
    document.querySelector(".today").style.setProperty("--ring", ringColor);
    $("ringFill").style.strokeDashoffset = String(188.5 * (1 - k));
    countTo($("todayNum"), sent);
    $("todayLimit").textContent = "/" + lim;
    $("todaySub").textContent = sent >= lim ? "Aaj ki limit poori. Kal phir bhejna." : `Aaj aur ${lim - sent} bhej sakte ho`;
    const vals = {
      hot: n((l) => l.siteType !== "site"),
      wa: n((l) => l.siteType !== "site" && l.wa),
      replied: n((l) => l.status === "replied" || l.status === "interested"),
      won: n((l) => l.status === "won"),
    };
    document.querySelectorAll("[data-stat]").forEach((el) => countTo(el, vals[el.dataset.stat]));
    // tab badge: jin WhatsApp leads ko abhi message nahi gaya
    const pending = n((l) => l.siteType !== "site" && l.wa && l.status === "new");
    const b = $("tabBadge");
    const txt = pending > 99 ? "99+" : String(pending);
    if (pending && b.textContent !== txt) { b.textContent = txt; b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    b.hidden = !pending;
  }

  let popId = "";
  function leadHTML(l, i, animate) {
    const tag = l.siteType === "none" ? `<span class="tag tag-none">Website nahi</span>`
      : l.siteType === "social" ? `<span class="tag tag-social">Sirf ${esc(socialName(l.siteHost))}</span>`
      : `<span class="tag tag-site">Website hai</span>`;
    const meta = [
      `<span>${esc(l.phone || "Number nahi mila")}</span>`,
      l.reviews ? `<span>★ ${esc(l.rating)} · ${esc(l.reviews)} reviews</span>` : "",
      `<span class="score">Score ${l.score}</span>`,
    ].join("");
    const main = l.wa
      ? `<a class="act act-main" data-act="wa" href="https://wa.me/${l.wa}?text=${encodeURIComponent(buildMessage(l))}" target="_blank" rel="noopener">${icon("chat")}WhatsApp</a>`
      : l.tel ? `<a class="act act-main call" href="tel:${esc(l.tel)}">${icon("phone")}Call</a>` : "";
    const call = l.wa && l.tel ? `<a class="act act-icon" href="tel:${esc(l.tel)}" aria-label="Call karo">${icon("phone")}</a>` : "";
    const maps = l.maps ? `<a class="act act-icon" href="${esc(l.maps)}" target="_blank" rel="noopener" aria-label="Map pe dekho">${icon("pin")}</a>` : "";
    const site = l.website ? `<a class="act act-icon" href="${esc(/^https?:/i.test(l.website) ? l.website : "http://" + l.website)}" target="_blank" rel="noopener nofollow" aria-label="Unka page kholo">${icon("link")}</a>` : "";
    const opts = STATUSES.map(([v, t]) => `<option value="${v}"${v === l.status ? " selected" : ""}>${t}</option>`).join("");
    const sent = l.sentAt ? `<span class="sent-at">Bheja ${new Date(l.sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>` : "";
    return `<article class="lead${animate && i < 12 ? " enter" : ""}" style="--i:${i}" data-id="${esc(l.id)}">
      <div class="lead-top">
        <div class="avatar" style="--h:${hue(l.name)}" aria-hidden="true">${esc(initials(l.name))}</div>
        <div><h3>${esc(l.name)}</h3><p class="sub">${esc(l.address || l.city || l.state)}</p></div>
        ${tag}
      </div>
      <div class="lead-meta">${meta}</div>
      ${l.note ? `<p class="note">${esc(l.note)}</p>` : ""}
      <div class="lead-actions">${main}${call}
        <button class="act act-icon" type="button" data-act="copy" aria-label="Message copy karo">${icon("copy")}</button>
        ${maps}${site}
        <button class="act act-icon" type="button" data-act="note" aria-label="Note likho">${icon("pencil")}</button>
      </div>
      <div class="lead-foot">
        <label class="status s-${l.status}${popId === l.id ? " pop" : ""}">${esc(STATUS_LABEL[l.status] || l.status)}${icon("down")}
          <select data-act="status" aria-label="Status badlo">${opts}</select></label>
        ${sent}
      </div>
    </article>`;
  }

  function render(animate) {
    renderStats();
    const arr = filtered();
    const total = Object.keys(leads).length;
    $("count").textContent = total ? `${arr.length} leads` : "";
    $("list").innerHTML = arr.slice(0, shown).map((l, i) => leadHTML(l, i, animate)).join("");
    popId = "";
    $("more").hidden = arr.length <= shown;
    const empty = $("empty");
    empty.hidden = arr.length > 0;
    if (!arr.length) {
      empty.innerHTML = total
        ? `<div class="empty-ic">${icon("search")}</div><h3>Is filter mein kuch nahi</h3><p>Upar filter badal ke dekho, ya "Sab" chuno.</p>`
        : `<div class="empty-ic">${icon("search")}</div><h3>Abhi koi lead nahi</h3><p>State chuno aur dhoondho. Bina website wale restaurants yahan aa jayenge.</p><button class="btn-tinted" type="button" data-go="search">Dhoondhna shuru karo</button>`;
    }
    ["fStatus", "fPhone", "fSort"].forEach((id) => {
      const s = $(id);
      $(id + "Text").textContent = s.options[s.selectedIndex].text;
    });
    $("fStatus").closest(".pill").classList.toggle("on", !!$("fStatus").value);
  }
  const rerender = () => { shown = PAGE; render(true); };

  // ---------- search UI ----------
  const selectedCats = () => [...document.querySelectorAll("#cats input:checked")].map((i) => i.value);
  const cityList = () => $("cities").value.split(",").map((s) => s.trim()).filter(Boolean);
  function googleKeywords() {
    const kws = window.CATEGORIES.filter((c) => selectedCats().includes(c.id)).map((c) => c.google);
    $("customKw").value.split(",").map((s) => s.trim()).filter(Boolean).forEach((k) => kws.push(k));
    return kws;
  }
  function updateEstimate() {
    const g = srcSeg.get() === "google";
    $("srcFoot").textContent = g
      ? "Sabse zyada restaurants aur phone number. API key chahiye (Settings). Har mahine kuch free, uske baad paise."
      : "Bilkul free, koi key nahi. Par India mein data kam hai aur phone number kam milte hain.";
    if (g) {
      const c = cityList().length, k = googleKeywords().length, n = c * k;
      $("estimate").textContent = n ? `${c} shehar × ${k} cheez = ${n} search (max ${n * 3} Google request)` : "Shehar aur kam se kam ek cheez chuno";
    } else {
      $("estimate").textContent = cityList().length ? `Sirf ${cityList().length} shehar mein dhoondhega` : "Poora state dhoondhega";
    }
  }

  let searching = false;
  async function runSearch() {
    if (searching) return;
    const state = window.STATES[+$("state").value];
    const btn = $("searchBtn");
    const status = $("progressText");
    searching = true;
    btn.disabled = true; btn.classList.add("busy");
    status.classList.remove("err");
    $("searchLabel").innerHTML = `<span class="spinner"></span>Dhoondh rahe hain…`;
    const progress = (f, text) => { btn.style.setProperty("--p", Math.max(0.04, f).toFixed(3)); status.textContent = text; };
    try {
      let r;
      if (srcSeg.get() === "google") {
        const kws = googleKeywords();
        if (!kws.length) throw new Error("Kam se kam ek cheez chuno.");
        r = await searchGoogle(state.name, cityList(), kws, progress);
      } else {
        if (!selectedCats().length) throw new Error("Kam se kam ek cheez chuno.");
        r = await searchOSM(state, cityList(), selectedCats(), progress);
      }
      saveLeads();
      progress(1, `${r.total} jagah mili · ${r.added} naye leads`);
      if (r.total) {
        toast(`${r.added} naye leads mile`, "check");
        typeSeg.set("lead");
        setTimeout(() => { shown = PAGE; showView("leads"); }, reduceMotion ? 0 : 650);
      } else {
        toast("Kuch nahi mila. Shehar ya cheez badlo.", "alert", "var(--orange)", 3800);
      }
    } catch (e) {
      saveLeads();
      status.textContent = e.message;
      status.classList.add("err");
      toast(e.message.length > 60 ? "Search nahi hua" : e.message, "alert", "var(--red)", 4200);
    } finally {
      searching = false;
      btn.disabled = false; btn.classList.remove("busy");
      $("searchLabel").textContent = "Restaurants dhoondho";
      setTimeout(() => btn.style.setProperty("--p", 0), 900);
    }
  }

  // ---------- lead actions ----------
  function markSent(l) {
    store.set("lf_sent_" + today(), sentToday() + 1);
    if (l.status === "new") l.status = "sent";
    l.sentAt = new Date().toISOString();
    popId = l.id;
    saveLeads();
    setTimeout(() => render(false), 350);
  }

  function onListClick(e) {
    const go = e.target.closest("[data-go]");
    if (go) { showView(go.dataset.go); return; }
    const el = e.target.closest("[data-act]");
    if (!el || el.tagName === "SELECT") return;
    const l = leads[el.closest(".lead").dataset.id];
    if (!l) return;
    const act = el.dataset.act;
    if (act === "wa") {
      if (!settings.name || !settings.phone) { e.preventDefault(); welcome(); return; }
      if (sentToday() >= settings.limit) {
        e.preventDefault();
        ask({ title: "Aaj ki limit poori", message: `Aaj ${sentToday()} message ja chuke. Zyada bhejoge to WhatsApp aapka number ban kar sakta hai.`, ok: "Phir bhi bhejo", cancel: "Ruk jao", destructive: true })
          .then((yes) => { if (yes) { window.open(el.href, "_blank", "noopener"); markSent(l); } });
        return;
      }
      markSent(l);
    } else if (act === "copy") {
      const msg = buildMessage(l);
      (navigator.clipboard ? navigator.clipboard.writeText(msg) : Promise.reject())
        .then(() => toast("Message copy ho gaya", "copy", "var(--blue)"))
        .catch(() => sheet("Message copy karo", `<div class="group"><textarea readonly>${esc(msg)}</textarea></div>`, (s) => { const t = s.querySelector("textarea"); t.focus(); t.select(); }));
    } else if (act === "note") {
      noteSheet(l);
    }
  }
  function onListChange(e) {
    if (e.target.dataset.act !== "status") return;
    const l = leads[e.target.closest(".lead").dataset.id];
    l.status = e.target.value;
    popId = l.id;
    saveLeads();
    render(false);
    if (l.status === "won") toast("Badhai ho! Deal pakki 🎉", "star", "var(--green)");
  }

  function noteSheet(l) {
    sheet(l.name, `<div class="group-label">Note</div>
      <div class="group"><textarea id="noteText" rows="4" placeholder="Jaise: owner Ramesh ji, Monday 11 baje call karo">${esc(l.note || "")}</textarea></div>
      <button class="btn-primary" type="button" id="noteSave">Save</button>`, (s, close) => {
      const t = s.querySelector("#noteText");
      setTimeout(() => t.focus(), 350);
      s.querySelector("#noteSave").addEventListener("click", () => {
        l.note = t.value.trim(); saveLeads(); close(); render(false); toast("Note save ho gaya", "pencil", "var(--blue)");
      });
    });
  }

  function exportCsv() {
    const arr = current === "leads" ? filtered() : Object.values(leads);
    if (!arr.length) { toast("Export karne ko kuch nahi", "alert", "var(--orange)"); return; }
    const cols = ["name", "phone", "wa", "address", "city", "state", "siteType", "website", "rating", "reviews", "score", "status", "note", "sentAt", "maps", "src"];
    const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(","), ...arr.map((l) => cols.map((c) => q(l[c])).join(","))].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `leads-${today()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`${arr.length} leads CSV mein`, "download", "var(--blue)");
  }

  async function clearAll() {
    const n = Object.keys(leads).length;
    if (!n) { toast("Mitane ko kuch nahi", "alert", "var(--orange)"); return; }
    const yes = await ask({ title: `${n} leads mitayein?`, message: "Saare leads aur unka status hamesha ke liye mit jayega. Pehle CSV export kar lo.", ok: "Mitao", destructive: true });
    if (yes) { leads = {}; saveLeads(); rerender(); toast("Saare leads mit gaye", "trash", "var(--red)"); }
  }

  // ---------- welcome / onboarding ----------
  function welcome() {
    const feats = [
      ["search", "var(--blue)", "Restaurants dhoondho", "State chuno, Google Maps se poori list aa jaati hai."],
      ["bolt", "var(--orange)", "Bina website wale pehle", "Har jagah ko 0–100 score, best lead sabse upar."],
      ["chat", "var(--wa)", "Ek tap mein WhatsApp", "Message pehle se likha milta hai, unke naam ke saath."],
      ["shield", "var(--indigo)", "Number safe rahe", "Roz ki limit, taaki WhatsApp ban na kare."],
    ];
    sheet("", `<div class="welcome">
        <div class="app-icon">${icon("search")}</div>
        <h2>Lead Finder mein<br>swagat hai</h2>
        <div class="features">${feats.map(([ic, c, t, d], i) => `<div class="feature" style="--i:${i}"><span class="fi" data-icon="${ic}" style="background:${c}"></span><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
      </div>
      <div class="group-label">Aapki jankari (har message mein jaayegi)</div>
      <div class="group">
        <label class="row"><span class="row-label">Naam</span><input id="wName" type="text" placeholder="Aniket" autocomplete="name" value="${esc(settings.name)}"></label>
        <label class="row"><span class="row-label">Number</span><input id="wPhone" type="tel" placeholder="98XXXXXXXX" autocomplete="tel" value="${esc(settings.phone)}"></label>
      </div>
      <button class="btn-primary" type="button" id="wGo">Shuru karo</button>`, (s, close) => {
      const n = s.querySelector("#wName"), p = s.querySelector("#wPhone"), go = s.querySelector("#wGo");
      const check = () => { go.disabled = !(n.value.trim() && p.value.trim()); };
      n.addEventListener("input", check); p.addEventListener("input", check); check();
      go.addEventListener("click", () => {
        settings.name = n.value.trim(); settings.phone = p.value.trim(); saveSettings(); fillSettings(); close();
        render(false);
        toast(`Namaste ${settings.name}!`, "check");
      });
    });
  }

  function keyHelp() {
    sheet("Google API key", `<ol class="steps">
        <li><span><a href="https://console.cloud.google.com/" target="_blank" rel="noopener">console.cloud.google.com</a> kholo aur naya project banao.</span></li>
        <li><span>Billing account jodo (card lagta hai). Har mahine kuch free quota milta hai.</span></li>
        <li><span>APIs &amp; Services → Library mein <b>Places API (New)</b> enable karo.</span></li>
        <li><span>Credentials → Create credentials → <b>API key</b>. Key ko sirf Places API (New) tak restrict karo.</span></li>
        <li><span>Billing → Budgets mein ₹500 ka alert lagao, taaki galti se kharcha na ho.</span></li>
        <li><span>Key copy karke Settings mein "API key" mein paste karo.</span></li>
      </ol>
      <button class="btn-primary" type="button" data-close-sheet>Samajh gaya</button>`, (s, close) => {
      s.querySelector("[data-close-sheet]").addEventListener("click", () => close());
    });
  }

  // ---------- settings (apne-aap save) ----------
  function fillSettings() {
    $("sName").value = settings.name; $("sPhone").value = settings.phone; $("sLink").value = settings.link;
    $("sKey").value = settings.key; $("sMsg").value = settings.msg; $("limitVal").textContent = settings.limit;
    updatePreview();
  }
  function updatePreview() {
    $("preview").textContent = buildMessage({ name: "Sharma Dhaba", city: "Patna", state: "Bihar", siteType: "none" }, {
      ...settings, name: settings.name || "Aapka naam", phone: settings.phone || "98XXXXXXXX",
    });
  }
  let saveTimer;
  function onSettingsInput() {
    settings.name = $("sName").value.trim(); settings.phone = $("sPhone").value.trim(); settings.link = $("sLink").value.trim();
    settings.key = $("sKey").value.trim(); settings.msg = $("sMsg").value || DEFAULT_MSG;
    updatePreview();
    clearTimeout(saveTimer); saveTimer = setTimeout(saveSettings, 300);
  }
  function stepLimit(d) {
    settings.limit = Math.min(200, Math.max(1, settings.limit + d));
    $("limitVal").textContent = settings.limit; saveSettings();
  }

  // ---------- init ----------
  function init() {
    paintIcons();
    $("navAction").innerHTML = icon("more");

    $("state").innerHTML = window.STATES.map((s, i) => `<option value="${i}">${esc(s.name)}</option>`).join("");
    const last = store.get("lf_last", { state: 3 }); // default Bihar
    $("state").value = String(last.state);
    $("cities").value = last.cities != null ? last.cities : window.STATES[last.state].cities.join(", ");
    $("cats").innerHTML = window.CATEGORIES.map((c) => `<label class="chip"><input type="checkbox" value="${c.id}"${c.id === "restaurant" ? " checked" : ""}><span>${esc(c.label)}</span></label>`).join("");
    $("fStatus").innerHTML = `<option value="">Har status</option>` + STATUSES.map(([v, t]) => `<option value="${v}">${t}</option>`).join("");

    const remember = () => store.set("lf_last", { state: +$("state").value, cities: $("cities").value, src: srcSeg.get() });
    srcSeg = segmented($("srcSeg"), [["google", "Google Maps"], ["osm", "OpenStreetMap"]], last.src || "google", () => { remember(); updateEstimate(); });
    typeSeg = segmented($("typeSeg"), [["lead", "Leads"], ["none", "Site nahi"], ["social", "Sirf social"], ["all", "Sab"]], "lead", rerender);

    $("state").addEventListener("change", () => { $("cities").value = window.STATES[+$("state").value].cities.join(", "); remember(); updateEstimate(); });
    $("cities").addEventListener("input", () => { remember(); updateEstimate(); });
    $("cats").addEventListener("change", updateEstimate);
    $("customKw").addEventListener("input", updateEstimate);
    $("searchBtn").addEventListener("click", runSearch);

    ["fStatus", "fPhone", "fSort"].forEach((id) => $(id).addEventListener("change", rerender));
    let ft; $("fText").addEventListener("input", () => { clearTimeout(ft); ft = setTimeout(rerender, 180); });
    $("more").addEventListener("click", () => { shown += PAGE; render(false); });
    $("list").addEventListener("click", onListClick);
    $("list").addEventListener("change", onListChange);
    $("empty").addEventListener("click", onListClick);

    ["sName", "sPhone", "sLink", "sKey", "sMsg"].forEach((id) => $(id).addEventListener("input", onSettingsInput));
    $("resetMsg").addEventListener("click", () => { $("sMsg").value = DEFAULT_MSG; onSettingsInput(); toast("Default message wapas aa gaya", "check", "var(--blue)"); });
    $("limitDown").addEventListener("click", () => stepLimit(-1));
    $("limitUp").addEventListener("click", () => stepLimit(1));
    $("keyHelp").addEventListener("click", keyHelp);
    $("exportCsv").addEventListener("click", exportCsv);
    $("clearAll").addEventListener("click", clearAll);
    $("navAction").addEventListener("click", () => actionSheet("Leads", [
      { label: "CSV export karo", icon: "download", run: exportCsv },
      { label: "Saare leads mitao", icon: "trash", destructive: true, run: clearAll },
    ]));

    document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
    let ticking = false;
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });

    fillSettings();
    updateEstimate();
    render(false);
    const startTab = store.get("lf_tab", "search");
    if (VIEWS.includes(startTab) && startTab !== "search") showView(startTab);
    if (!settings.name || !settings.phone) setTimeout(welcome, reduceMotion ? 0 : 350);
  }

  // test ke liye kuch functions bahar
  window.LeadFinder = { parsePhones, classifySite, buildMessage: (l) => buildMessage(l), showView };
  init();
})();

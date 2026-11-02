/* Lead Finder: find local businesses without a website, message them on WhatsApp,
 * follow up, and track what you earn. Everything is stored on this device only. */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const PAGE = 40;
  const DAY = 86400000;
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- platform: the Android app (Capacitor) or a browser ----------
  const cap = window.capacitorExports;
  const NATIVE = !!(cap && cap.Capacitor && cap.Capacitor.isNativePlatform());
  const PREVIEW = !!window.LF_PREVIEW; // the claude.ai preview page: no network, no downloads

  function haptic(kind) {
    try {
      if (NATIVE && window.capacitorHaptics) {
        const H = capacitorHaptics.Haptics;
        if (kind === "success") H.notification({ type: "SUCCESS" }).catch(() => {});
        else H.impact({ style: kind === "medium" ? "MEDIUM" : "LIGHT" }).catch(() => {});
      } else if (navigator.vibrate) navigator.vibrate(kind === "success" ? [12, 60, 18] : 8);
    } catch (e) { /* vibration not allowed here */ }
  }

  // Links to WhatsApp, the dialer and maps must leave the app and open the right app.
  function openExternal(url) {
    if (NATIVE && window.capacitorAppLauncher) {
      capacitorAppLauncher.AppLauncher.openUrl({ url }).catch(() => { location.href = url; });
    } else if (/^tel:/.test(url)) {
      location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }

  // POST that works in both places: the app uses native HTTP (no browser CORS rules), the web uses fetch.
  async function postJSON(url, headers, body, form) {
    if (NATIVE && cap.CapacitorHttp) {
      const res = await cap.CapacitorHttp.post({ url, headers, data: form ? { data: body } : body, responseType: "json" });
      let data = res.data;
      if (typeof data === "string") { try { data = JSON.parse(data); } catch (e) { data = {}; } }
      return { ok: res.status >= 200 && res.status < 300, status: res.status, data: data || {} };
    }
    const res = await fetch(url, {
      method: "POST", headers,
      body: form ? "data=" + encodeURIComponent(body) : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  // ---------- constants ----------
  const STATUSES = [
    ["new", "New"],
    ["sent", "Messaged"],
    ["replied", "Replied"],
    ["interested", "Interested"],
    ["won", "Won"],
    ["no", "Not interested"],
  ];
  const STATUS_LABEL = Object.fromEntries(STATUSES);
  const NICHES = window.NICHES;
  const NICHE = Object.fromEntries(NICHES.map((n) => [n.id, n]));
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
  const MAX_FOLLOWUPS = 2;

  // ---------- icons (SF Symbols style, all currentColor) ----------
  const P = {
    today: '<rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m9 15 2 2 4-4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/>',
    gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    fork: '<path d="M7 3v7.5M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M7 10.5V21"/><path d="M18 21V3c-2.5 1.6-3.6 4.5-3.6 7.6 0 1.7.9 2.9 3.6 3.2"/>',
    dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    store: '<path d="M4.5 10.5V20h15v-9.5"/><path d="M3 10.5 5 4h14l2 6.5"/><path d="M3 10.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M10 20v-5h4v5"/>',
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
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    rupee: '<path d="M7 4.5h10M7 9h10M7 4.5c6 0 6 9 0 9h-.5L15 20.5"/>',
    send: '<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5-7.5-4z"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;
  const paintIcons = (root) => (root || document).querySelectorAll("[data-icon]:empty").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

  // ---------- storage (localStorage can fail in private windows, so every call is guarded) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  let leads = store.get("lf_leads", {});
  let settings = Object.assign(
    { name: "", phone: "", link: "", key: "", limit: 30, lang: "en", followDays: 3, tpl: {} },
    store.get("lf_settings", {})
  );
  if (!settings.tpl || typeof settings.tpl !== "object") settings.tpl = {};
  delete settings.msg; // the old single Hinglish template; each business type now has its own
  let shown = PAGE;
  const saveLeads = () => { if (!store.set("lf_leads", leads)) toast("Storage is full. Export a CSV and delete old leads.", "alert", "var(--red)"); };
  const saveSettings = () => store.set("lf_settings", settings);
  const dayKey = (d) => { const x = d || new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const sentToday = () => store.get("lf_sent_" + dayKey(), 0);

  // Bring leads saved by older versions up to date.
  Object.values(leads).forEach((l) => {
    if (!l.niche) l.niche = "restaurant";
    if (!Array.isArray(l.log)) l.log = [{ t: l.addedAt || new Date().toISOString(), e: "added" }];
    if (l.sentAt && !l.lastContactAt) l.lastContactAt = l.sentAt;
    if (l.followUps == null) l.followUps = 0;
  });

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const initials = (s) => (s.match(/[\p{L}\p{N}]+/gu) || ["?"]).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const rupees = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");
  const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / DAY) : 0);
  function ago(iso) {
    const d = daysSince(iso);
    if (d <= 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 30) return d + " days ago";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;

  // ---------- toast (Dynamic Island style) ----------
  let toastTimer;
  function toast(msg, ic = "check", tone = "var(--green)", ms = 2800) {
    const t = $("toast");
    t.style.setProperty("--tone", tone);
    t.innerHTML = `<span class="ic">${icon(ic)}</span><span>${esc(msg)}</span>`;
    t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  // ---------- overlays: sheet / alert / action sheet ----------
  const overlays = []; // open overlays, newest last (Android back button closes the newest)
  function overlay(inner, { onClose } = {}) {
    const wrap = document.createElement("div");
    wrap.className = "overlay";
    wrap.innerHTML = `<div class="backdrop"></div>${inner}`;
    document.body.appendChild(wrap);
    document.documentElement.classList.add("locked");
    paintIcons(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add("open")));
    let closed = false;
    const onKey = (e) => { if (e.key === "Escape" && overlays[overlays.length - 1] === entry) close(); };
    function close(val) {
      if (closed) return; closed = true;
      wrap.classList.remove("open");
      document.removeEventListener("keydown", onKey);
      const i = overlays.indexOf(entry); if (i >= 0) overlays.splice(i, 1);
      if (!overlays.length) document.documentElement.classList.remove("locked");
      setTimeout(() => wrap.remove(), reduceMotion ? 0 : 560);
      onClose && onClose(val);
    }
    const entry = { close };
    overlays.push(entry);
    wrap.querySelector(".backdrop").addEventListener("click", () => close());
    document.addEventListener("keydown", onKey);
    return { wrap, close };
  }

  function sheet(title, body, onMount) {
    const o = overlay(`<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title || "Details")}">
      <div class="grabber"></div>
      <div class="sheet-head">${title ? `<h2>${esc(title)}</h2>` : ""}<button class="x-btn" type="button" aria-label="Close" data-close>${icon("x")}</button></div>
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

  // ---------- phone numbers and websites ----------
  /** A WhatsApp number in India is a 10-digit mobile starting with 6-9.
   * Landlines are also 10 digits (0612-2223333 is Patna, 080-... is Bengaluru) and their area code can
   * start with 6, 7 or 8, so the grouping matters too: mobiles are written "98765 43210" (5+5) or as one
   * block, landlines as "612 222 3333" or "0612-2223333" (a 2-4 digit area code first). */
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

  /** Own website, or only a page on Instagram, Zomato and the like? */
  function classifySite(url) {
    if (!url) return { type: "none", label: "" };
    let host = "";
    try { host = new URL(/^https?:\/\//i.test(url) ? url : "http://" + url).hostname.toLowerCase().replace(/^www\./, ""); } catch (e) { host = String(url).toLowerCase(); }
    const hit = window.SOCIAL_DOMAINS.find((d) => host === d || host.endsWith("." + d));
    if (hit) return { type: "social", label: hit };
    return { type: "site", label: host };
  }
  const socialName = (h) => window.SOCIAL_NAMES[h] || h;

  /** 0-100: no website 50 (only a social page 35) + WhatsApp number 30 (landline 10) + reviews up to 15 + rating 4+ 5.
   * Many reviews means a busy business that can afford a website. */
  function score(l) {
    let s = l.siteType === "none" ? 50 : l.siteType === "social" ? 35 : 0;
    s += l.wa ? 30 : l.tel ? 10 : 0;
    s += Math.min(15, Math.log10((l.reviews || 0) + 1) * 6);
    if ((l.rating || 0) >= 4) s += 5;
    return Math.round(s);
  }

  function upsert(lead) {
    const old = leads[lead.id];
    if (old) {
      // take the fresh data, keep everything you added (status, notes, history, deal)
      const keep = ["status", "note", "sentAt", "lastContactAt", "followUps", "value", "log", "addedAt", "niche"];
      const merged = Object.assign({}, old, lead);
      keep.forEach((k) => { if (old[k] !== undefined) merged[k] = old[k]; });
      leads[lead.id] = merged;
      return false;
    }
    const now = new Date().toISOString();
    leads[lead.id] = Object.assign({ status: "new", note: "", sentAt: "", lastContactAt: "", followUps: 0, value: 0, addedAt: now, log: [{ t: now, e: "added" }] }, lead);
    return true;
  }

  function makeLead(base, rawPhone, website) {
    const ph = parsePhones(rawPhone);
    const site = classifySite(website);
    const l = Object.assign(base, { phone: ph.display, wa: ph.wa, tel: ph.tel, website: website || "", siteType: site.type, siteHost: site.label });
    l.score = score(l);
    return l;
  }
  const isLead = (l) => l.siteType !== "site";
  const followUpDue = (l) => l.status === "sent" && l.lastContactAt && daysSince(l.lastContactAt) >= settings.followDays && (l.followUps || 0) < MAX_FOLLOWUPS;
  const nicheOne = (l) => cap1((NICHE[l.niche] || NICHE.other).one);
  function addLog(l, e, v) { (l.log = l.log || []).push({ t: new Date().toISOString(), e, v }); if (l.log.length > 40) l.log.shift(); }

  // ---------- demo data ----------
  function loadDemo() {
    let added = 0;
    window.DEMO_LEADS.forEach(([niche, name, address, site, rating, reviews, phone], i) => {
      const lead = makeLead({
        id: "demo:" + i, src: "demo", demo: true, niche, cat: NICHE[niche].one, name, address,
        city: address.includes("Gaya") ? "Gaya" : "Patna", state: "Bihar", rating, reviews,
        maps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + " " + address),
      }, phone, site);
      if (upsert(lead)) added++;
    });
    // one demo lead already messaged 4 days ago, so Today shows how a follow-up looks
    const f = leads["demo:2"];
    if (f && f.status === "new") {
      const t = new Date(Date.now() - 4 * DAY).toISOString();
      Object.assign(f, { status: "sent", sentAt: t, lastContactAt: t });
      f.log.push({ t, e: "messaged" });
    }
    saveLeads();
    return added;
  }
  const demoCount = () => Object.values(leads).filter((l) => l.demo).length;
  function removeDemo() {
    Object.keys(leads).forEach((k) => { if (leads[k].demo) delete leads[k]; });
    saveLeads(); refreshAll(); toast("Demo leads removed", "trash", "var(--blue)");
  }
  function startDemo() {
    const n = loadDemo();
    typeSeg.set("lead");
    $("fPhone").value = "wa";
    $("fNiche").value = "";
    shown = PAGE;
    refreshAll();
    showView("today");
    toast(n ? `${n} demo leads added` : "Demo leads are already here", "star", "var(--teal)");
  }

  // ---------- Google Places (New) text search ----------
  async function googleQuery(textQuery, key) {
    let pageToken = "";
    const results = [];
    for (let page = 0; page < 3; page++) { // Google gives at most 60 places (3 pages of 20) per search
      const body = { textQuery, pageSize: 20, regionCode: "IN", languageCode: "en" };
      if (pageToken) body.pageToken = pageToken;
      const res = await postJSON("https://places.googleapis.com/v1/places:searchText",
        { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": GOOGLE_FIELDS }, body);
      if (!res.ok) throw new Error(googleError(res));
      results.push(...(res.data.places || []));
      pageToken = res.data.nextPageToken;
      if (!pageToken) break;
      await sleep(400);
    }
    return results;
  }
  function googleError(res) {
    const m = (res.data && res.data.error && res.data.error.message) || "";
    if (/API key not valid/i.test(m)) return "That API key isn't valid. Copy it again from Google Cloud.";
    if (/has not been used|is disabled|not enabled/i.test(m)) return "Places API (New) is off for this key. Turn it on in Google Cloud.";
    if (/billing/i.test(m)) return "Google needs a billing account on this project first.";
    if (/referer|referrer|blocked/i.test(m)) return "The key's restrictions block this app. Set Application restrictions to None.";
    if (res.status === 429) return "Google's daily limit for this key is reached. Try again tomorrow.";
    return m || "Google returned an error (" + res.status + ").";
  }

  async function searchGoogle(stateName, cities, jobsIn, progress) {
    if (!settings.key) {
      showView("settings");
      setTimeout(() => $("sKey").focus(), 400);
      throw new Error("Add your Google API key first, or switch to OpenStreetMap.");
    }
    if (!cities.length) throw new Error("Type at least one city for Google Maps.");
    let added = 0, total = 0, done = 0;
    const jobs = [];
    for (const city of cities) for (const j of jobsIn) jobs.push(Object.assign({ city }, j));
    for (const { city, kw, niche } of jobs) {
      progress(done / jobs.length, `Searching ${kw} in ${city}…`);
      const places = await googleQuery(`${kw} in ${city}, ${stateName}, India`, settings.key);
      for (const p of places) {
        if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;
        total++;
        const lead = makeLead({
          id: "g:" + p.id, src: "google", niche, cat: kw,
          name: (p.displayName && p.displayName.text) || "Unnamed",
          address: p.formattedAddress || "", city, state: stateName,
          rating: p.rating || 0, reviews: p.userRatingCount || 0,
          maps: p.googleMapsUri || "",
        }, p.internationalPhoneNumber || p.nationalPhoneNumber, p.websiteUri);
        if (upsert(lead)) added++;
      }
      done++;
      progress(done / jobs.length, `${plural(total, "place")} found so far, ${added} new`);
    }
    return { total, added };
  }

  // ---------- OpenStreetMap (Overpass) ----------
  async function overpass(query) {
    let lastErr;
    for (const url of OVERPASS) {
      try {
        const res = await postJSON(url, { "Content-Type": "application/x-www-form-urlencoded" }, query, true);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.data;
      } catch (e) { lastErr = e; }
    }
    throw new Error("OpenStreetMap is busy (" + (lastErr && lastErr.message) + "). Try again in a minute or two.");
  }

  async function searchOSM(state, cities, niche, types, progress) {
    const tags = [];
    types.forEach((t) => tags.push(...t.osm));
    if (!tags.length) throw new Error("OpenStreetMap has no tag for these. Pick another type or use Google Maps.");
    const isoRe = "^IN-(" + state.iso + ")$";
    const scope = cities.length ? "c" : "s";
    const cityPart = cities.length
      ? `rel["boundary"="administrative"]["name"~"^(${cities.map(reEsc).join("|")})$",i](area.s);map_to_area->.c;`
      : "";
    const body = tags.map(([k, v]) => `nwr["${k}"="${v}"]["name"](area.${scope});`).join("");
    const q = `[out:json][timeout:180];area["ISO3166-2"~"${isoRe}"]->.s;${cityPart}(${body});out center tags;`;
    progress(0.3, cities.length ? `Searching ${cities.join(", ")}… (1–2 min)` : `Searching all of ${state.name}… (2–3 min)`);
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
        id: "o:" + el.type + el.id, src: "osm", niche: niche.id, cat: t.amenity || t.leisure || t.sport || t.shop || niche.one,
        name: t.name, address: addr, city: t["addr:city"] || t["addr:district"] || "", state: state.name,
        rating: 0, reviews: 0,
        maps: lat ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name)}%20${lat}%2C${lon}` : "",
      }, t.phone || t["contact:phone"] || t.mobile || t["contact:mobile"], site);
      if (upsert(lead)) added++;
    }
    return { total, added };
  }

  // ---------- messages ----------
  const TPL_KEYS = [["restaurant", "Restaurants"], ["gym", "Gyms"], ["other", "Other businesses"], ["followUp", "Follow-up"]];
  function defaultTpl(key, lang) {
    const M = window.MESSAGES[lang || settings.lang] || window.MESSAGES.en;
    return (key === "followUp" ? M.followUp : M.first[key] || M.first.other).join("\n");
  }
  const tplFor = (key) => settings.tpl[key] || defaultTpl(key);
  function fill(tpl, l, s) {
    s = s || settings;
    const M = window.MESSAGES[s.lang] || window.MESSAGES.en;
    if (!s.link) tpl = tpl.split("\n").filter((line) => !line.includes("{link}")).join("\n");
    const reason = l.siteType === "social" ? M.reasonSocial.replace("{social}", socialName(l.siteHost)) : M.reasonNone;
    const vars = {
      name: l.name, city: l.city || l.state || "", reason, myName: s.name || "", myPhone: s.phone || "",
      link: s.link || "", days: String(Math.max(1, daysSince(l.lastContactAt))),
    };
    return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  }
  const firstMessage = (l) => fill(tplFor(NICHE[l.niche] ? l.niche : "other"), l);
  const followMessage = (l) => fill(tplFor("followUp"), l);

  /** What the main WhatsApp button does for this lead right now. */
  function waAction(l) {
    const to = l.demo ? parsePhones(settings.phone).wa : l.wa;
    if (!l.wa) return null;
    if (followUpDue(l)) return { kind: "follow", label: "Follow up", cls: "follow", text: followMessage(l), to };
    if (l.status === "new") return { kind: "first", label: l.demo ? "Send to me" : "WhatsApp", cls: "", text: firstMessage(l), to };
    return { kind: "chat", label: "Open chat", cls: "soft", text: "", to };
  }
  const waHref = (a) => (a && a.to ? `https://wa.me/${a.to}${a.text ? "?text=" + encodeURIComponent(a.text) : ""}` : "#");

  // ---------- views + nav ----------
  const VIEWS = ["today", "find", "leads", "settings"];
  let current = "today";
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
    if (name === "leads") renderLeads(true);
    if (name === "today") renderToday(true);
    store.set("lf_tab", name);
  }
  function onScroll() {
    const t = $("view-" + current).querySelector(".large-title");
    $("nav").classList.toggle("scrolled", t.getBoundingClientRect().bottom < $("nav").offsetHeight + 2);
  }

  function segmented(el, options, value, onChange) {
    el.style.setProperty("--n", options.length);
    el.innerHTML = `<span class="seg-thumb" aria-hidden="true"></span>` +
      options.map(([v, l]) => `<button type="button" role="radio" data-v="${v}">${esc(l)}</button>`).join("");
    function set(v, fire) {
      const i = Math.max(0, options.findIndex((o) => o[0] === v));
      el.style.setProperty("--i", i);
      el.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-checked", String(j === i)));
      el.dataset.value = options[i][0];
      if (fire) { haptic(); onChange(options[i][0]); }
    }
    el.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && b.dataset.v !== el.dataset.value) set(b.dataset.v, true); });
    set(value, false);
    return { get: () => el.dataset.value, set };
  }

  function countTo(el, to, fmt) {
    const from = +el.dataset.v || 0;
    el.dataset.v = to;
    const show = (v) => { el.textContent = fmt ? fmt(v) : Math.round(v); };
    if (reduceMotion || from === to) { show(to); return; }
    const t0 = performance.now(), dur = 650;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      show(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- TODAY ----------
  function renderToday(animate) {
    const all = Object.values(leads);
    $("todayDate").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
    const due = all.filter((l) => followUpDue(l) && l.wa).sort((a, b) => daysSince(b.lastContactAt) - daysSince(a.lastContactAt));
    const next = all.filter((l) => isLead(l) && l.status === "new" && l.wa).sort((a, b) => b.score - a.score || (b.reviews || 0) - (a.reviews || 0)).slice(0, 5);
    updateBadge(due.length);

    if (!all.length) {
      $("todayBody").innerHTML = `<div class="card hero today-grid">
        <div class="empty-ic">${icon("search")}</div>
        <h2>Find your first clients</h2>
        <p>Pick a business type and a city. Lead Finder lists the ones without a website, best first.</p>
        <div class="btns"><button class="btn-primary" type="button" data-go="find">Find businesses</button>
        <button class="btn-plain" type="button" data-demo>Try with demo data</button></div></div>`;
      return;
    }

    const sent = sentToday(), lim = settings.limit, k = Math.min(1, sent / lim);
    const ringColor = sent >= lim ? "var(--red)" : k >= 0.8 ? "var(--orange)" : "var(--green)";
    const pool = all.filter(isLead);
    const st = (arr) => pool.filter((l) => arr.includes(l.status)).length;
    const stages = [
      ["Found", pool.length, "var(--gray)"],
      ["Messaged", st(["sent", "replied", "interested", "won", "no"]), "var(--blue)"],
      ["Replied", st(["replied", "interested", "won", "no"]), "var(--indigo)"],
      ["Interested", st(["interested", "won"]), "var(--orange)"],
      ["Won", st(["won"]), "var(--green)"],
    ];
    const max = Math.max(1, stages[0][1]);
    const replyRate = stages[1][1] ? Math.round((stages[2][1] / stages[1][1]) * 100) : 0;
    const earned = all.filter((l) => l.status === "won").reduce((s, l) => s + (+l.value || 0), 0);
    const wonCount = stages[4][1];

    const miniRow = (l, a, sub) => `<div class="mini" data-id="${esc(l.id)}">
        <div class="avatar" style="--h:${hue(l.name)}" aria-hidden="true">${esc(initials(l.name))}</div>
        <div class="mini-main" data-act="open"><b>${esc(l.name)}</b><span>${l.demo ? "Demo · " : ""}${esc(sub)}</span></div>
        <a class="act act-main ${a.cls}" data-act="wa" data-kind="${a.kind}" href="${waHref(a)}" target="_blank" rel="noopener">${esc(a.label)}</a></div>`;

    $("todayBody").innerHTML = `<div class="today-grid">
      <div class="card today-ring">
        <svg class="ring" viewBox="0 0 72 72" aria-hidden="true" style="--ring:${ringColor}">
          <circle class="ring-track" cx="36" cy="36" r="30"/><circle class="ring-fill" id="ringFill" cx="36" cy="36" r="30"/></svg>
        <div style="--ring:${ringColor}"><div class="cap">Messages today</div>
          <div class="big-num"><b id="todayNum" data-v="${animate ? 0 : sent}">${sent}</b><span>/${lim}</span></div>
          <div class="sub2">${sent >= lim ? "Daily limit reached. Continue tomorrow." : `${lim - sent} left today${due.length ? `, ${plural(due.length, "follow-up")} due` : ""}`}</div></div>
      </div>
      <div class="two">
        <div class="card stat earn"><span class="stat-ic t-green" data-icon="rupee"></span><b id="earnNum" data-v="${animate ? 0 : earned}">${rupees(earned)}</b><span class="sub2">Earned · ${plural(wonCount, "deal")}</span></div>
        <div class="card stat"><span class="stat-ic t-indigo" data-icon="reply"></span><b id="rateNum" data-v="${animate ? 0 : replyRate}">${replyRate}%</b><span class="sub2">Reply rate</span></div>
      </div>
    </div>
    ${due.length ? `<div class="group-label">Follow-ups due</div><div class="group">${due.slice(0, 8).map((l) =>
      miniRow(l, waAction(l), `Messaged ${ago(l.lastContactAt)} · follow-up ${(l.followUps || 0) + 1} of ${MAX_FOLLOWUPS}`)).join("")}</div>
      <p class="group-foot">No reply yet. A short, polite reminder often gets the first answer.</p>` : ""}
    <div class="group-label">Up next</div>
    ${next.length ? `<div class="group">${next.map((l) => miniRow(l, waAction(l),
      `${nicheOne(l)} · ${l.city || l.state} · score ${l.score}`)).join("")}</div>
      <p class="group-foot">Highest-scoring businesses you haven't messaged yet.</p>`
      : `<div class="card hero"><p>No new WhatsApp leads left. Find more businesses to keep going.</p><div class="btns"><button class="btn-tinted" type="button" data-go="find">Find more</button></div></div>`}
    <div class="group-label">Pipeline</div>
    <div class="card"><div class="funnel">${stages.map(([label, n, c]) =>
      `<div class="f-row"><span>${label}</span><span class="f-bar"><i style="--c:${c};--w:${Math.max(n ? 3 : 0, (n / max) * 100)}%"></i></span><b>${n}</b></div>`).join("")}</div>
      <p class="funnel-note">${stages[1][1] ? `${replyRate}% of businesses you messaged replied.` : "Message your first leads to see how many reply."}</p></div>`;
    paintIcons($("todayBody"));
    requestAnimationFrame(() => {
      const r = $("ringFill"); if (r) r.style.strokeDashoffset = String(188.5 * (1 - k));
      if (animate) { countTo($("todayNum"), sent); countTo($("earnNum"), earned, rupees); countTo($("rateNum"), replyRate, (v) => Math.round(v) + "%"); }
    });
  }
  function updateBadge(n) {
    const b = $("todayBadge");
    const txt = n > 99 ? "99+" : String(n);
    if (n && b.textContent !== txt) { b.textContent = txt; b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    b.hidden = !n;
  }

  // ---------- LEADS ----------
  let typeSeg, srcSeg, langSeg;
  function filtered() {
    const type = typeSeg.get(), st = $("fStatus").value, ph = $("fPhone").value, ni = $("fNiche").value, txt = $("fText").value.trim().toLowerCase();
    const arr = Object.values(leads).filter((l) => {
      if (type === "lead" && !isLead(l)) return false;
      if ((type === "none" || type === "social") && l.siteType !== type) return false;
      if (ni && l.niche !== ni) return false;
      if (st === "due") { if (!followUpDue(l)) return false; } else if (st && l.status !== st) return false;
      if (ph === "wa" && !l.wa) return false;
      if (ph === "any" && !l.tel) return false;
      if (txt && !(l.name + " " + l.address + " " + l.city).toLowerCase().includes(txt)) return false;
      return true;
    });
    const sort = $("fSort").value;
    arr.sort(sort === "name" ? (a, b) => a.name.localeCompare(b.name)
      : sort === "reviews" ? (a, b) => (b.reviews || 0) - (a.reviews || 0)
      : sort === "recent" ? (a, b) => String(b.addedAt).localeCompare(String(a.addedAt))
      : (a, b) => b.score - a.score || (b.reviews || 0) - (a.reviews || 0));
    return arr;
  }

  function siteTag(l) {
    return l.siteType === "none" ? `<span class="tag tag-none">No website</span>`
      : l.siteType === "social" ? `<span class="tag tag-social">Only ${esc(socialName(l.siteHost))}</span>`
      : `<span class="tag tag-site">Has website</span>`;
  }

  let popId = "";
  function leadHTML(l, i, animate) {
    const meta = [
      `<span>${esc(nicheOne(l))}</span>`,
      `<span>${l.demo ? "Demo number" : esc(l.phone || "No phone number")}</span>`,
      l.reviews ? `<span>★ ${esc(l.rating)} · ${esc(l.reviews)} reviews</span>` : "",
      `<span class="score">Score ${l.score}</span>`,
    ].join("");
    const a = waAction(l);
    const main = a
      ? `<a class="act act-main ${a.cls}" data-act="wa" data-kind="${a.kind}" href="${waHref(a)}" target="_blank" rel="noopener">${icon(a.kind === "follow" ? "clock" : "chat")}${esc(a.label)}</a>`
      : l.tel && !l.demo ? `<a class="act act-main call" href="tel:${esc(l.tel)}">${icon("phone")}Call</a>` : "";
    const call = !l.demo && l.wa && l.tel ? `<a class="act act-icon" href="tel:${esc(l.tel)}" aria-label="Call">${icon("phone")}</a>` : "";
    const maps = l.maps ? `<a class="act act-icon" href="${esc(l.maps)}" target="_blank" rel="noopener" aria-label="Open in Maps">${icon("pin")}</a>` : "";
    const opts = STATUSES.map(([v, t]) => `<option value="${v}"${v === l.status ? " selected" : ""}>${t}</option>`).join("");
    const due = followUpDue(l);
    const foot = due ? `<span class="foot-note due">Follow-up due</span>`
      : l.lastContactAt ? `<span class="foot-note">Last message ${ago(l.lastContactAt)}</span>`
      : l.status === "won" && l.value ? `<span class="foot-note">${rupees(l.value)}</span>` : "";
    return `<article class="lead${animate && i < 12 ? " enter" : ""}" style="--i:${i}" data-id="${esc(l.id)}">
      <div class="lead-top" data-act="open">
        <div class="avatar" style="--h:${hue(l.name)}" aria-hidden="true">${esc(initials(l.name))}</div>
        <div><h3>${esc(l.name)}${l.demo ? ` <span class="tag tag-demo">Demo</span>` : ""}</h3><p class="sub">${esc(l.address || l.city || l.state)}</p></div>
        ${siteTag(l)}
      </div>
      <div class="lead-meta">${meta}</div>
      ${l.note ? `<p class="note">${esc(l.note)}</p>` : ""}
      <div class="lead-actions">${main}${call}
        <button class="act act-icon" type="button" data-act="copy" aria-label="Copy message">${icon("copy")}</button>
        ${maps}
        <button class="act act-icon" type="button" data-act="note" aria-label="Add a note">${icon("pencil")}</button>
      </div>
      <div class="lead-foot">
        <label class="status s-${l.status}${popId === l.id ? " pop" : ""}">${esc(STATUS_LABEL[l.status] || l.status)}${icon("down")}
          <select data-act="status" aria-label="Change status">${opts}</select></label>
        ${foot}
      </div>
    </article>`;
  }

  function renderLeads(animate) {
    const arr = filtered();
    const total = Object.keys(leads).length;
    $("count").textContent = total ? plural(arr.length, "lead") : "";
    $("list").innerHTML = arr.slice(0, shown).map((l, i) => leadHTML(l, i, animate)).join("");
    popId = "";
    $("more").hidden = arr.length <= shown;
    const empty = $("empty");
    empty.hidden = arr.length > 0;
    if (!arr.length) {
      empty.innerHTML = total
        ? `<div class="empty-ic">${icon("search")}</div><h3>Nothing matches</h3><p>Change the filters above, or choose "All".</p>`
        : `<div class="empty-ic">${icon("search")}</div><h3>No leads yet</h3><p>Search a city and the businesses without a website show up here.</p><div class="empty-btns"><button class="btn-tinted" type="button" data-go="find">Find businesses</button><button class="btn-plain" type="button" data-demo>Try with demo data</button></div>`;
    }
    ["fNiche", "fStatus", "fPhone", "fSort"].forEach((id) => {
      const s = $(id);
      $(id + "Text").textContent = s.options[s.selectedIndex].text;
    });
    $("fStatus").closest(".pill").classList.toggle("on", !!$("fStatus").value);
    $("fNiche").closest(".pill").classList.toggle("on", !!$("fNiche").value);
  }
  const rerender = () => { shown = PAGE; renderLeads(true); };
  function refreshAll() {
    if (current === "leads") renderLeads(false);
    renderToday(false);
    $("demoToggleText").textContent = demoCount() ? `Remove demo leads (${demoCount()})` : "Add demo leads";
  }

  // ---------- FIND ----------
  let niche = "restaurant";
  function renderNiches() {
    $("niches").innerHTML = NICHES.map((n) => `<button type="button" role="radio" class="niche n-${n.id}" data-niche="${n.id}" aria-checked="${n.id === niche}">
      <span class="niche-check">${icon("check")}</span><span class="niche-ic">${icon(n.icon)}</span>${esc(n.label)}</button>`).join("");
  }
  function renderTypes() {
    const n = NICHE[niche];
    const remembered = store.get("lf_types_" + niche, null);
    $("types").innerHTML = n.types.map((t) => {
      const on = remembered ? remembered.includes(t.id) : t.on;
      return `<label class="chip"><input type="checkbox" value="${t.id}"${on ? " checked" : ""}><span>${esc(t.label)}</span></label>`;
    }).join("");
    const custom = niche === "other";
    $("typesGroup").hidden = custom; $("typesLabel").textContent = custom ? "What kind of business" : "Look for";
    $("customGroup").hidden = !custom; $("customFoot").hidden = !custom;
    $("searchLabel").textContent = "Find " + n.label.toLowerCase();
    if (custom && srcSeg && srcSeg.get() === "osm") srcSeg.set("google", false);
  }
  const selectedTypes = () => {
    const ids = [...document.querySelectorAll("#types input:checked")].map((i) => i.value);
    return NICHE[niche].types.filter((t) => ids.includes(t.id));
  };
  const customWords = () => $("customKw").value.split(",").map((s) => s.trim()).filter(Boolean);
  const cityList = () => $("cities").value.split(",").map((s) => s.trim()).filter(Boolean);
  function googleJobs() {
    if (niche === "other") return customWords().map((kw) => ({ kw, niche: "other" }));
    return selectedTypes().map((t) => ({ kw: t.google, niche }));
  }
  function updateEstimate() {
    const g = srcSeg.get() === "google";
    $("srcFoot").textContent = g
      ? "Most businesses and phone numbers. Needs a Google API key (Settings). Google gives a free monthly allowance."
      : "Free, no key needed. Fewer businesses and phone numbers in India.";
    if (g) {
      const c = cityList().length, k = googleJobs().length, n = c * k;
      $("estimate").textContent = n ? `${plural(c, "city", "cities")} × ${plural(k, "search word")} = ${plural(n, "search", "searches")} (up to ${n * 3} Google requests)` : niche === "other" ? "Type what to search for and at least one city" : "Pick at least one type and one city";
    } else {
      $("estimate").textContent = cityList().length ? `Searches ${plural(cityList().length, "city", "cities")}` : "Searches the whole state";
    }
  }

  let searching = false;
  async function runSearch() {
    if (searching) return;
    if (PREVIEW) { previewNotice(); return; }
    const state = window.STATES[+$("state").value];
    const btn = $("searchBtn"), status = $("progressText");
    searching = true; haptic();
    btn.disabled = true; btn.classList.add("busy");
    status.classList.remove("err");
    $("searchLabel").innerHTML = `<span class="spinner"></span>Searching…`;
    const progress = (f, text) => { btn.style.setProperty("--p", Math.max(0.04, f).toFixed(3)); status.textContent = text; };
    try {
      let r;
      if (srcSeg.get() === "google") {
        const jobs = googleJobs();
        if (!jobs.length) throw new Error(niche === "other" ? "Type what kind of business to look for." : "Pick at least one type.");
        r = await searchGoogle(state.name, cityList(), jobs, progress);
      } else {
        if (niche === "other") throw new Error("OpenStreetMap can't search your own words. Switch to Google Maps.");
        if (!selectedTypes().length) throw new Error("Pick at least one type.");
        r = await searchOSM(state, cityList(), NICHE[niche], selectedTypes(), progress);
      }
      saveLeads();
      progress(1, `${plural(r.total, "place")} found · ${r.added} new leads`);
      if (r.total) {
        haptic("success");
        toast(`${r.added} new leads`, "check");
        typeSeg.set("lead");
        $("fNiche").value = niche === "other" ? "other" : niche;
        setTimeout(() => { shown = PAGE; showView("leads"); }, reduceMotion ? 0 : 650);
      } else {
        toast("Nothing found. Try another city or type.", "alert", "var(--orange)", 3800);
      }
    } catch (e) {
      saveLeads();
      status.textContent = e.message;
      status.classList.add("err");
      toast(e.message.length > 60 ? "Search didn't work" : e.message, "alert", "var(--red)", 4200);
    } finally {
      searching = false;
      btn.disabled = false; btn.classList.remove("busy");
      $("searchLabel").textContent = "Find " + NICHE[niche].label.toLowerCase();
      setTimeout(() => btn.style.setProperty("--p", 0), 900);
      refreshAll();
    }
  }

  function previewNotice() {
    sheet("This is a preview", `<p class="sheet-text">Real searches don't run on this preview page, because it can't reach Google or OpenStreetMap. Everything else works with demo data.</p>
      <p class="sheet-text">For real businesses, open the web version or install the Android app (Settings → About).</p>
      <button class="btn-primary" type="button" id="pvDemo">Show demo leads</button>`, (s, close) => {
      s.querySelector("#pvDemo").addEventListener("click", () => { close(); startDemo(); });
    });
  }

  // ---------- contacting a lead ----------
  function markContacted(l, kind) {
    if (!l.demo) store.set("lf_sent_" + dayKey(), sentToday() + 1);
    const now = new Date().toISOString();
    if (kind === "follow") { l.followUps = (l.followUps || 0) + 1; addLog(l, "followup", l.followUps); }
    else { if (l.status === "new") l.status = "sent"; l.sentAt = l.sentAt || now; addLog(l, "messaged"); }
    l.lastContactAt = now;
    popId = l.id;
    saveLeads();
    setTimeout(refreshAll, 350);
  }

  /** Called for every WhatsApp button. Returns true when the link may open. */
  function beforeWhatsApp(l, kind, href) {
    if (kind === "chat") return true;
    if (!settings.name || !settings.phone || (l.demo && !parsePhones(settings.phone).wa)) {
      welcome();
      if (settings.phone && l.demo) toast("Add your 10-digit mobile number to try the demo", "alert", "var(--orange)");
      return false;
    }
    if (!l.demo && sentToday() >= settings.limit) {
      ask({ title: "Daily limit reached", message: `You've sent ${sentToday()} messages today. Sending more can get your WhatsApp number banned.`, ok: "Send anyway", cancel: "Stop here", destructive: true })
        .then((yes) => { if (yes) { openExternal(href); markContacted(l, kind); } });
      return false;
    }
    haptic();
    if (l.demo) toast("This opens a chat with your own number", "chat", "var(--wa)");
    markContacted(l, kind);
    return true;
  }

  function onLeadAction(e) {
    const demoBtn = e.target.closest("[data-demo]");
    if (demoBtn) { e.preventDefault(); startDemo(); return; }
    const go = e.target.closest("[data-go]");
    if (go) { e.preventDefault(); showView(go.dataset.go); return; }
    const el = e.target.closest("[data-act]");
    if (!el || el.tagName === "SELECT") return;
    const holder = el.closest("[data-id]");
    const l = holder && leads[holder.dataset.id];
    if (!l) return;
    const act = el.dataset.act;
    if (act === "wa") {
      if (!beforeWhatsApp(l, el.dataset.kind, el.href)) e.preventDefault();
    } else if (act === "copy") {
      copyText(followUpDue(l) ? followMessage(l) : firstMessage(l), "Message copied");
    } else if (act === "note") {
      noteSheet(l);
    } else if (act === "open") {
      detailSheet(l);
    }
  }
  function onStatusChange(e) {
    if (e.target.dataset.act !== "status") return;
    setStatus(leads[e.target.closest("[data-id]").dataset.id], e.target.value);
  }
  function setStatus(l, status) {
    if (!l || l.status === status) return;
    l.status = status;
    addLog(l, "status", status);
    if (status !== "new" && !l.lastContactAt && status !== "no") l.lastContactAt = new Date().toISOString();
    popId = l.id;
    saveLeads();
    haptic(status === "won" ? "success" : "light");
    refreshAll();
    if (status === "won") dealSheet(l);
  }

  function copyText(text, msg) {
    const fallback = () => sheet("Copy this message", `<div class="group"><textarea readonly>${esc(text)}</textarea></div>`, (s) => { const t = s.querySelector("textarea"); t.focus(); t.select(); });
    try {
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(() => { haptic(); toast(msg, "copy", "var(--blue)"); }).catch(fallback);
    } catch (err) { fallback(); }
  }

  function noteSheet(l) {
    sheet(l.name, `<div class="group-label">Note</div>
      <div class="group"><textarea id="noteText" rows="4" placeholder="e.g. Owner is Ramesh. Call on Monday at 11.">${esc(l.note || "")}</textarea></div>
      <button class="btn-primary" type="button" id="noteSave">Save note</button>`, (s, close) => {
      const t = s.querySelector("#noteText");
      setTimeout(() => t.focus(), 350);
      s.querySelector("#noteSave").addEventListener("click", () => {
        l.note = t.value.trim(); addLog(l, "note"); saveLeads(); close(); refreshAll(); toast("Note saved", "pencil", "var(--blue)");
      });
    });
  }

  function dealSheet(l) {
    sheet("Deal won 🎉", `<p class="sheet-text">How much is ${esc(l.name)} paying you? It's added to your earnings on Today.</p>
      <div class="group"><label class="row"><span class="row-label">Amount</span><span class="money">₹<input id="dealAmt" type="number" inputmode="numeric" min="0" step="500" placeholder="5000" value="${l.value || ""}"></span></label></div>
      <button class="btn-primary" type="button" id="dealSave">Save</button>`, (s, close) => {
      const inp = s.querySelector("#dealAmt");
      setTimeout(() => inp.focus(), 350);
      s.querySelector("#dealSave").addEventListener("click", () => {
        l.value = Math.max(0, +inp.value || 0); addLog(l, "value", l.value); saveLeads(); close(); refreshAll();
        toast(l.value ? `${rupees(l.value)} added to earnings` : "Deal saved", "rupee", "var(--green)");
      });
    });
  }

  const LOG_TEXT = { added: ["Added", "var(--gray)"], messaged: ["First message sent", "var(--wa)"], followup: ["Follow-up sent", "var(--orange)"], note: ["Note updated", "var(--teal)"], value: ["Deal amount set", "var(--green)"] };
  function detailSheet(l) {
    const a = waAction(l);
    const rows = [
      ["Phone", l.demo ? "Demo number" : l.phone || "Not listed"],
      ["Address", l.address || [l.city, l.state].filter(Boolean).join(", ")],
      ["Type", nicheOne(l) + (l.cat && l.cat !== NICHE[l.niche]?.one ? ` · ${l.cat}` : "")],
      ["Google rating", l.reviews ? `★ ${l.rating} from ${l.reviews} reviews` : "No reviews listed"],
      ["Online", l.siteType === "none" ? "No website" : l.siteType === "social" ? `Only a ${socialName(l.siteHost)} page` : l.siteHost],
      ["Lead score", `${l.score} / 100`],
    ];
    const log = (l.log || []).slice().reverse().map((x) => {
      const [txt, c] = x.e === "status" ? [`Status: ${STATUS_LABEL[x.v] || x.v}`, `var(--blue)`] : LOG_TEXT[x.e] || [x.e, "var(--gray)"];
      return `<li style="--c:${c}"><span></span><span>${esc(txt)}${x.e === "value" && x.v ? ` · ${rupees(x.v)}` : ""}</span><time>${esc(ago(x.t))}</time></li>`;
    }).join("");
    sheet("", `<div data-id="${esc(l.id)}">
      <div class="d-head"><div class="avatar" style="--h:${hue(l.name)}">${esc(initials(l.name))}</div>
        <div><h2>${esc(l.name)}</h2><p>${siteTag(l)}${l.demo ? `<span class="tag tag-demo">Demo</span>` : ""}</p></div></div>
      <div class="d-actions">
        ${a ? `<a class="act act-main ${a.cls}" data-act="wa" data-kind="${a.kind}" href="${waHref(a)}" target="_blank" rel="noopener">${icon(a.kind === "follow" ? "clock" : "chat")}${esc(a.label)}</a>` : ""}
        ${l.tel && !l.demo ? `<a class="act act-icon" href="tel:${esc(l.tel)}" aria-label="Call">${icon("phone")}</a>` : ""}
        <button class="act act-icon" type="button" data-act="copy" aria-label="Copy message">${icon("copy")}</button>
        ${l.maps ? `<a class="act act-icon" href="${esc(l.maps)}" target="_blank" rel="noopener" aria-label="Open in Maps">${icon("pin")}</a>` : ""}
        ${l.website ? `<a class="act act-icon" href="${esc(/^https?:/i.test(l.website) ? l.website : "http://" + l.website)}" target="_blank" rel="noopener nofollow" aria-label="Open their page">${icon("link")}</a>` : ""}
      </div>
      <div class="group-label">Status</div>
      <div class="group"><div class="status-chips">${STATUSES.map(([v, t]) =>
        `<button type="button" class="status s-${v}" data-status="${v}" aria-pressed="${v === l.status}">${t}</button>`).join("")}</div></div>
      ${l.status === "won" ? `<div class="group mt8"><button class="row row-btn" type="button" id="dEditDeal"><span class="row-label">Deal amount</span><span class="row-value">${l.value ? rupees(l.value) : "Add"}</span><span class="chev">${icon("chevron")}</span></button></div>` : ""}
      <div class="group-label">Details</div>
      <div class="group">${rows.map(([k, v]) => `<div class="row"><span class="row-label">${k}</span><span class="row-value">${esc(v)}</span></div>`).join("")}</div>
      <div class="group-label">Note</div>
      <div class="group"><textarea id="dNote" rows="3" placeholder="Add a note">${esc(l.note || "")}</textarea></div>
      ${log ? `<div class="group-label">History</div><div class="group"><ul class="timeline">${log}</ul></div>` : ""}
      <div class="group mt8" style="margin-top:26px"><button class="row row-btn danger" type="button" id="dDelete">${icon("trash")}Delete this lead</button></div>
    </div>`, (s, close) => {
      s.addEventListener("click", (e) => {
        const b = e.target.closest("[data-status]");
        if (b) {
          const before = l.status;
          setStatus(l, b.dataset.status);
          s.querySelectorAll("[data-status]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.status === l.status)));
          b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
          if (l.status === "won" && before !== "won") close();
          return;
        }
        if (e.target.closest("#dEditDeal")) { close(); dealSheet(l); return; }
        if (e.target.closest("#dDelete")) {
          ask({ title: `Delete ${l.name}?`, message: "Its status, note and history are removed too.", ok: "Delete", destructive: true }).then((yes) => {
            if (yes) { delete leads[l.id]; saveLeads(); close(); refreshAll(); toast("Lead deleted", "trash", "var(--red)"); }
          });
          return;
        }
        onLeadAction(e);
        if (e.target.closest('[data-act="wa"]') && !e.defaultPrevented) setTimeout(close, 300);
      });
      const note = s.querySelector("#dNote");
      note.addEventListener("change", () => { l.note = note.value.trim(); addLog(l, "note"); saveLeads(); refreshAll(); });
    });
  }

  // ---------- CSV export ----------
  async function exportCsv() {
    if (PREVIEW) { toast("Export works in the app and the web version", "alert", "var(--orange)"); return; }
    const arr = current === "leads" ? filtered() : Object.values(leads);
    if (!arr.length) { toast("No leads to export", "alert", "var(--orange)"); return; }
    const cols = ["name", "niche", "phone", "wa", "address", "city", "state", "siteType", "website", "rating", "reviews", "score", "status", "followUps", "value", "note", "sentAt", "lastContactAt", "maps", "src"];
    const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(","), ...arr.map((l) => cols.map((c) => q(l[c])).join(","))].join("\r\n");
    const name = `leads-${dayKey()}.csv`;
    try {
      if (NATIVE && window.capacitorFilesystemPluginCapacitor && window.capacitorShare) {
        const res = await capacitorFilesystemPluginCapacitor.Filesystem.writeFile({ path: name, data: csv, directory: "CACHE", encoding: "utf8" });
        await capacitorShare.Share.share({ title: "Lead Finder leads", files: [res.uri] });
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast(`${plural(arr.length, "lead")} exported`, "download", "var(--blue)");
    } catch (e) {
      if (!/cancel/i.test(String(e && e.message))) toast("Couldn't export the CSV", "alert", "var(--red)");
    }
  }

  async function clearAll() {
    const n = Object.keys(leads).length;
    if (!n) { toast("There are no leads to delete", "alert", "var(--orange)"); return; }
    const yes = await ask({ title: `Delete ${plural(n, "lead")}?`, message: "Their status, notes and history are removed for good. Export a CSV first if you want a copy.", ok: "Delete", destructive: true });
    if (yes) { leads = {}; saveLeads(); rerender(); refreshAll(); toast("All leads deleted", "trash", "var(--red)"); }
  }

  // ---------- welcome ----------
  function welcome() {
    const feats = [
      ["search", "var(--blue)", "Find businesses", "Restaurants, gyms or anything else, city by city."],
      ["bolt", "var(--orange)", "Best leads first", "Every business gets a 0–100 score. No website scores highest."],
      ["chat", "var(--wa)", "One-tap WhatsApp", "A ready message with their name and a pitch for their kind of business."],
      ["clock", "var(--indigo)", "Follow-ups and earnings", "Today shows who to remind and how much you've earned."],
      ["shield", "var(--teal)", "Keeps your number safe", "A daily limit, so WhatsApp doesn't ban you."],
    ];
    sheet("", `<div class="welcome">
        <div class="app-icon">${icon("search")}</div>
        <h2>Welcome to Lead Finder</h2>
        <div class="features">${feats.map(([ic, c, t, d], i) => `<div class="feature" style="--i:${i}"><span class="fi" data-icon="${ic}" style="background:${c}"></span><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
      </div>
      <div class="group-label">Your details (used in every message)</div>
      <div class="group">
        <label class="row"><span class="row-label">Name</span><input id="wName" type="text" placeholder="Aniket" autocomplete="name" value="${esc(settings.name)}"></label>
        <label class="row"><span class="row-label">WhatsApp number</span><input id="wPhone" type="tel" placeholder="98XXXXXXXX" autocomplete="tel" value="${esc(settings.phone)}"></label>
      </div>
      <button class="btn-primary" type="button" id="wGo">Get started</button>
      <button class="btn-plain wide" type="button" id="wDemo">Try with demo data first</button>`, (s, close) => {
      const n = s.querySelector("#wName"), p = s.querySelector("#wPhone"), go = s.querySelector("#wGo");
      const check = () => { go.disabled = !(n.value.trim() && p.value.trim()); };
      n.addEventListener("input", check); p.addEventListener("input", check); check();
      const keep = () => {
        if (n.value.trim()) settings.name = n.value.trim();
        if (p.value.trim()) settings.phone = p.value.trim();
        saveSettings(); fillSettings();
      };
      go.addEventListener("click", () => { keep(); close(); refreshAll(); haptic("success"); toast(`Hi ${settings.name}!`, "check"); });
      s.querySelector("#wDemo").addEventListener("click", () => { keep(); close(); startDemo(); });
    });
  }

  function keyHelp() {
    sheet("Google Maps API key", `<ol class="steps">
        <li><span>Open <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">console.cloud.google.com</a> and create a new project.</span></li>
        <li><span>Add a billing account (a card is needed). Google gives a free amount of searches every month.</span></li>
        <li><span>In <b>APIs &amp; Services → Library</b>, turn on <b>Places API (New)</b>.</span></li>
        <li><span>In <b>Credentials</b>, create an <b>API key</b>. Under API restrictions, allow only Places API (New). Leave Application restrictions on None, so the key works in both the app and the website.</span></li>
        <li><span>In <b>Quotas</b>, cap Text Search at about 200 requests a day, and in <b>Billing → Budgets</b> add a ₹500 alert. Then a mistake can't cost much.</span></li>
        <li><span>Copy the key and paste it into Settings → API key. It is stored only on this device.</span></li>
      </ol>
      <button class="btn-primary" type="button" data-close-sheet>Done</button>`, (s, close) => {
      s.querySelector("[data-close-sheet]").addEventListener("click", () => close());
    });
  }

  // ---------- settings ----------
  function fillSettings() {
    $("sName").value = settings.name; $("sPhone").value = settings.phone; $("sLink").value = settings.link;
    $("sKey").value = settings.key;
    $("limitVal").textContent = settings.limit;
    $("followVal").textContent = plural(settings.followDays, "day");
    renderTplRows();
  }
  function renderTplRows() {
    $("tplRows").innerHTML = TPL_KEYS.map(([k, label]) => `<button class="row row-btn" type="button" data-tpl="${k}">
      <span class="row-label">${label}</span><span class="row-value">${settings.tpl[k] ? "Edited" : "Default"}</span><span class="chev">${icon("chevron")}</span></button>`).join("");
  }
  const SAMPLE = { restaurant: ["Sharma Dhaba", "none"], gym: ["Iron Paradise Gym", "social", "instagram.com"], other: ["Glow Beauty Salon", "none"], followUp: ["Sharma Dhaba", "none"] };
  function tplSheet(key) {
    const label = TPL_KEYS.find((t) => t[0] === key)[1];
    const [sName, sType, sHost] = SAMPLE[key];
    const sample = { name: sName, city: "Patna", state: "Bihar", siteType: sType, siteHost: sHost || "", lastContactAt: new Date(Date.now() - 3 * DAY).toISOString() };
    sheet(label + " message", `<div class="group"><textarea id="tplText" rows="11" aria-label="Message">${esc(tplFor(key))}</textarea></div>
      <p class="group-foot">Filled in for each business: {name} {reason} {myName} {myPhone} {link}${key === "followUp" ? " {days}" : ""}. A line with {link} is skipped when you have no portfolio link.</p>
      <div class="chat"><div class="chat-cap">Preview · ${esc(sName)}</div><div class="bubble" id="tplPreview"></div></div>
      <div class="group mt8"><button class="row row-btn tint" type="button" id="tplReset">Use the default message</button></div>
      <button class="btn-primary" type="button" id="tplSave">Save</button>`, (s, close) => {
      const t = s.querySelector("#tplText"), pv = s.querySelector("#tplPreview");
      const show = () => { pv.textContent = fill(t.value, sample, Object.assign({}, settings, { name: settings.name || "Your name", phone: settings.phone || "98XXXXXXXX" })); };
      t.addEventListener("input", show); show();
      s.querySelector("#tplReset").addEventListener("click", () => { t.value = defaultTpl(key); show(); });
      s.querySelector("#tplSave").addEventListener("click", () => {
        const v = t.value.trim();
        if (!v || v === defaultTpl(key)) delete settings.tpl[key]; else settings.tpl[key] = v;
        saveSettings(); renderTplRows(); refreshAll(); close(); toast("Message saved", "check", "var(--blue)");
      });
    });
  }
  let saveTimer;
  function onSettingsInput() {
    settings.name = $("sName").value.trim(); settings.phone = $("sPhone").value.trim(); settings.link = $("sLink").value.trim();
    settings.key = $("sKey").value.trim();
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { saveSettings(); refreshAll(); }, 300);
  }
  function step(field, d, min, max, out, fmt) {
    settings[field] = Math.min(max, Math.max(min, settings[field] + d));
    $(out).textContent = fmt(settings[field]); haptic(); saveSettings(); refreshAll();
  }

  // ---------- init ----------
  function init() {
    paintIcons();
    $("navAction").innerHTML = icon("more");
    $("versionVal").textContent = (window.LF_VERSION || "") + (NATIVE ? " · Android" : "");
    $("getApp").hidden = NATIVE; $("openWeb").hidden = !NATIVE;

    // Find
    const last = store.get("lf_last", { state: 3 }); // Bihar
    niche = NICHE[last.niche] ? last.niche : "restaurant";
    $("state").innerHTML = window.STATES.map((s, i) => `<option value="${i}">${esc(s.name)}</option>`).join("");
    $("state").value = String(last.state);
    $("cities").value = last.cities != null ? last.cities : window.STATES[last.state].cities.slice(0, 2).join(", ");
    $("customKw").value = last.custom || "";
    const remember = () => store.set("lf_last", { state: +$("state").value, cities: $("cities").value, src: srcSeg.get(), niche, custom: $("customKw").value });
    srcSeg = segmented($("srcSeg"), [["google", "Google Maps"], ["osm", "OpenStreetMap"]], last.src || "google", () => { remember(); updateEstimate(); });
    renderNiches(); renderTypes();
    $("niches").addEventListener("click", (e) => {
      const b = e.target.closest("[data-niche]");
      if (!b || b.dataset.niche === niche) return;
      niche = b.dataset.niche; haptic();
      $("niches").querySelectorAll("[data-niche]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      renderTypes(); remember(); updateEstimate();
    });
    $("types").addEventListener("change", () => { store.set("lf_types_" + niche, selectedTypes().map((t) => t.id)); updateEstimate(); });
    $("state").addEventListener("change", () => { $("cities").value = window.STATES[+$("state").value].cities.slice(0, 2).join(", "); remember(); updateEstimate(); });
    $("cities").addEventListener("input", () => { remember(); updateEstimate(); });
    $("customKw").addEventListener("input", () => { remember(); updateEstimate(); });
    $("searchBtn").addEventListener("click", runSearch);
    $("demoBtn").addEventListener("click", startDemo);

    // Leads
    $("fStatus").innerHTML = `<option value="">Any status</option><option value="due">Follow-up due</option>` + STATUSES.map(([v, t]) => `<option value="${v}">${t}</option>`).join("");
    $("fNiche").innerHTML = `<option value="">All businesses</option>` + NICHES.map((n) => `<option value="${n.id}">${n.label}</option>`).join("");
    typeSeg = segmented($("typeSeg"), [["lead", "Leads"], ["none", "No website"], ["social", "Social only"], ["all", "All"]], "lead", rerender);
    ["fNiche", "fStatus", "fPhone", "fSort"].forEach((id) => $(id).addEventListener("change", rerender));
    let ft; $("fText").addEventListener("input", () => { clearTimeout(ft); ft = setTimeout(rerender, 180); });
    $("more").addEventListener("click", () => { shown += PAGE; renderLeads(false); });
    ["list", "empty", "todayBody"].forEach((id) => {
      $(id).addEventListener("click", onLeadAction);
      $(id).addEventListener("change", onStatusChange);
    });
    $("navAction").addEventListener("click", () => actionSheet("Leads", [
      { label: "Export as CSV", icon: "download", run: exportCsv },
      demoCount() ? { label: `Remove demo leads (${demoCount()})`, icon: "x", run: removeDemo } : { label: "Add demo leads", icon: "star", run: startDemo },
      { label: "Delete all leads", icon: "trash", destructive: true, run: clearAll },
    ]));

    // Settings
    ["sName", "sPhone", "sLink", "sKey"].forEach((id) => $(id).addEventListener("input", onSettingsInput));
    langSeg = segmented($("langSeg"), [["en", "English"], ["hi", "Hinglish"]], settings.lang, (v) => {
      settings.lang = v; saveSettings(); renderTplRows(); refreshAll();
      toast(v === "en" ? "Messages in English" : "Messages in Hinglish", "chat", "var(--blue)");
    });
    $("tplRows").addEventListener("click", (e) => { const b = e.target.closest("[data-tpl]"); if (b) tplSheet(b.dataset.tpl); });
    $("limitDown").addEventListener("click", () => step("limit", -1, 1, 200, "limitVal", String));
    $("limitUp").addEventListener("click", () => step("limit", 1, 1, 200, "limitVal", String));
    $("followDown").addEventListener("click", () => step("followDays", -1, 1, 14, "followVal", (n) => plural(n, "day")));
    $("followUp").addEventListener("click", () => step("followDays", 1, 1, 14, "followVal", (n) => plural(n, "day")));
    $("keyHelp").addEventListener("click", keyHelp);
    $("exportCsv").addEventListener("click", exportCsv);
    $("demoToggle").addEventListener("click", () => (demoCount() ? removeDemo() : startDemo()));
    $("clearAll").addEventListener("click", clearAll);

    // Tabs, scrolling, links
    document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => { haptic(); showView(t.dataset.view); }));
    let ticking = false;
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
    // In the app, links must open WhatsApp, the dialer or the browser. This runs after the
    // handlers above, so a link they stopped (daily limit, missing details) stays stopped.
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented) return;
      const href = a.getAttribute("href");
      if (href === "#") { e.preventDefault(); return; }
      if (NATIVE && /^(https?:|tel:|mailto:|sms:)/i.test(href)) { e.preventDefault(); openExternal(a.href); }
    });

    if (NATIVE && window.capacitorApp) {
      capacitorApp.App.addListener("backButton", () => {
        if (overlays.length) overlays[overlays.length - 1].close();
        else if (current !== "today") showView("today");
        else capacitorApp.App.minimizeApp();
      });
      // Coming back from WhatsApp: refresh so "Messages today" and follow-ups are current
      capacitorApp.App.addListener("resume", () => refreshAll());
    }
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshAll(); });

    fillSettings();
    updateEstimate();
    if (PREVIEW && !Object.keys(leads).length) loadDemo();
    refreshAll();
    renderToday(true);
    const startTab = store.get("lf_tab", "today");
    if (VIEWS.includes(startTab) && startTab !== "today") showView(startTab);
    if (!settings.name || !settings.phone) setTimeout(welcome, reduceMotion ? 0 : 350);
  }

  // for tests
  window.LeadFinder = { parsePhones, classifySite, firstMessage, followMessage, showView, startDemo, followUpDue };
  init();
})();

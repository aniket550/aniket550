/* Lead Finder: state -> restaurants -> jinki website nahi -> WhatsApp pe offer.
 * Sab data sirf aapke browser (localStorage) mein rehta hai. Koi server nahi. */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const PAGE = 50;
  const STATUSES = [
    ["new", "🆕 Naya"],
    ["sent", "📤 Message gaya"],
    ["replied", "💬 Reply aaya"],
    ["interested", "🔥 Interested"],
    ["won", "💰 Deal pakki"],
    ["no", "🚫 Mana kiya"],
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

  // ---------- storage (try/catch: private mode mein localStorage fail ho sakta hai) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  let leads = store.get("lf_leads", {});
  let settings = Object.assign(
    { name: "", phone: "", link: "", key: "", limit: 30, msg: DEFAULT_MSG },
    store.get("lf_settings", {})
  );
  let shown = PAGE;
  const saveLeads = () => { if (!store.set("lf_leads", leads)) toast("⚠️ Browser storage bhar gaya. CSV export karke purane leads mitao."); };
  const today = () => new Date().toISOString().slice(0, 10);
  const sentToday = () => store.get("lf_sent_" + today(), 0);

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let toastTimer;
  function toast(msg, ms = 3500) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  /** Phone number ko samjho. Mobile (WhatsApp chalega) = 10 digit, 6-9 se shuru.
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
      if (!out.display) { out.display = p; out.tel = d.length === 10 ? "+91" + d : "+91" + d.replace(/^0+/, ""); }
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
  async function googleQuery(textQuery, key, onPage) {
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
      onPage && onPage();
      pageToken = json.nextPageToken;
      if (!pageToken) break;
      await sleep(400);
    }
    return results;
  }

  async function searchGoogle(stateName, cities, keywords, progress) {
    if (!settings.key) { openSettings(); throw new Error("Pehle Settings mein Google API key daalo (ya OpenStreetMap choose karo)."); }
    if (!cities.length) throw new Error("Google ke liye kam se kam ek shehar likho.");
    let added = 0, total = 0, done = 0;
    const jobs = [];
    for (const city of cities) for (const kw of keywords) jobs.push({ city, kw });
    for (const { city, kw } of jobs) {
      progress(done / jobs.length, `${city}: "${kw}" dhoondh rahe hain…`);
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
      progress(done / jobs.length, `${city}: "${kw}" ho gaya. Ab tak ${total} mile, ${added} naye.`);
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
    if (!tags.length) throw new Error("OpenStreetMap mein 'Dhaba' alag se nahi milta. Restaurant/Cafe bhi choose karo.");
    const isoRe = "^IN-(" + state.iso + ")$";
    const scope = cities.length ? "c" : "s";
    const cityPart = cities.length
      ? `rel["boundary"="administrative"]["name"~"^(${cities.map(reEsc).join("|")})$",i](area.s);map_to_area->.c;`
      : "";
    const body = tags.map(([k, v]) => `nwr["${k}"="${v}"]["name"](area.${scope});`).join("");
    const q = `[out:json][timeout:180];area["ISO3166-2"~"${isoRe}"]->.s;${cityPart}(${body});out center tags;`;
    progress(0.15, cities.length ? `${cities.join(", ")} mein dhoondh rahe hain… (1-2 min lag sakte hain)` : `Poore ${state.name} mein dhoondh rahe hain… (bada state = 2-3 min)`);
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
    if (l.siteType === "social") return `abhi sirf ${SOCIAL_NAME[l.siteHost] || l.siteHost} page hai, apni website nahi hai`;
    return "abhi koi website nahi hai";
  }
  function buildMessage(l) {
    let tpl = settings.msg || DEFAULT_MSG;
    if (!settings.link) tpl = tpl.split("\n").filter((line) => !line.includes("{link}")).join("\n");
    const vars = { name: l.name, city: l.city || l.state, reason: reasonFor(l), myName: settings.name || "", myPhone: settings.phone || "", link: settings.link || "" };
    return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  }

  // ---------- render ----------
  function filtered() {
    const type = $("fType").value, st = $("fStatus").value, ph = $("fPhone").value, txt = $("fText").value.trim().toLowerCase();
    let arr = Object.values(leads).filter((l) => {
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
    const items = [
      [all.length, "Total mile"],
      [n((l) => l.siteType !== "site"), "Bina website"],
      [n((l) => l.siteType !== "site" && l.wa), "WhatsApp leads"],
      [`${sentToday()}/${settings.limit}`, "Aaj ke message"],
      [n((l) => l.status === "sent"), "Message gaye"],
      [n((l) => l.status === "replied"), "Reply aaye"],
      [n((l) => l.status === "interested"), "Interested"],
      [n((l) => l.status === "won"), "Deal pakki"],
    ];
    $("stats").innerHTML = items.map(([v, k]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join("");
  }

  function leadHTML(l) {
    const badge = l.siteType === "none" ? `<span class="badge b-none">Website nahi</span>`
      : l.siteType === "social" ? `<span class="badge b-social">Sirf ${esc(SOCIAL_NAME[l.siteHost] || l.siteHost)}</span>`
      : `<span class="badge b-site">Website hai</span>`;
    const rating = l.reviews ? ` · ⭐ ${l.rating} (${l.reviews})` : "";
    const sent = l.sentAt ? ` · bheja ${new Date(l.sentAt).toLocaleDateString("en-IN")}` : "";
    const wa = l.wa ? `<a class="wa" data-act="wa" href="https://wa.me/${l.wa}?text=${encodeURIComponent(buildMessage(l))}" target="_blank" rel="noopener">WhatsApp</a>` : "";
    const call = l.tel ? `<a data-act="call" href="tel:${esc(l.tel)}">📞 Call</a>` : "";
    const maps = l.maps ? `<a href="${esc(l.maps)}" target="_blank" rel="noopener">📍 Map</a>` : "";
    const site = l.website ? `<a href="${esc(/^https?:/i.test(l.website) ? l.website : "http://" + l.website)}" target="_blank" rel="noopener nofollow">🔗 Link</a>` : "";
    const opts = STATUSES.map(([v, t]) => `<option value="${v}"${v === l.status ? " selected" : ""}>${t}</option>`).join("");
    return `<article class="lead" data-id="${esc(l.id)}">
      <div class="lead-head"><div><h3>${esc(l.name)}</h3>
        <div class="meta">${esc(l.address || l.city || l.state)}</div>
        <div class="meta">${esc(l.phone || "Number nahi mila")}${rating} · score ${l.score}${sent}</div></div>${badge}</div>
      ${l.note ? `<p class="note">📝 ${esc(l.note)}</p>` : ""}
      <div class="actions">${wa}${call}<button type="button" data-act="copy">📋 Message copy</button>${maps}${site}
        <select data-act="status" aria-label="Status">${opts}</select>
        <button type="button" data-act="note">📝</button></div>
    </article>`;
  }

  function render() {
    renderStats();
    const arr = filtered();
    $("count").textContent = `${arr.length} leads dikh rahe hain`;
    $("list").innerHTML = arr.slice(0, shown).map(leadHTML).join("");
    $("more").hidden = arr.length <= shown;
    $("empty").hidden = arr.length > 0;
    $("empty").textContent = Object.keys(leads).length ? "Is filter mein koi lead nahi. Filter badal ke dekho." : "Abhi koi lead nahi. Upar state choose karke dhoondho.";
  }
  const rerender = () => { shown = PAGE; render(); };

  // ---------- search UI ----------
  function selectedCats() { return [...document.querySelectorAll("#cats input:checked")].map((i) => i.value); }
  function cityList() { return $("cities").value.split(",").map((s) => s.trim()).filter(Boolean); }
  function source() { return document.querySelector("input[name=src]:checked").value; }
  function googleKeywords() {
    const kws = window.CATEGORIES.filter((c) => selectedCats().includes(c.id)).map((c) => c.google);
    $("customKw").value.split(",").map((s) => s.trim()).filter(Boolean).forEach((k) => kws.push(k));
    return kws;
  }
  function updateEstimate() {
    if (source() === "google") {
      const n = cityList().length * googleKeywords().length;
      $("estimate").textContent = n ? `${cityList().length} shehar × ${googleKeywords().length} cheez = ${n} search, max ${n * 3} Google request (har search 60 jagah tak).` : "Shehar aur kam se kam ek cheez choose karo.";
    } else {
      $("estimate").textContent = cityList().length ? "Sirf likhe hue shehar mein dhoondhega." : "Shehar khaali hai, to poora state dhoondhega.";
    }
  }

  async function runSearch() {
    const state = window.STATES[+$("state").value];
    const cats = selectedCats();
    const btn = $("searchBtn");
    btn.disabled = true; $("progress").hidden = false;
    const progress = (f, text) => { $("progressBar").style.width = Math.round(Math.max(0.03, f) * 100) + "%"; $("progressText").textContent = text; };
    try {
      let r;
      if (source() === "google") {
        const kws = googleKeywords();
        if (!kws.length) throw new Error("Kam se kam ek cheez choose karo.");
        r = await searchGoogle(state.name, cityList(), kws, progress);
      } else {
        if (!cats.length) throw new Error("Kam se kam ek cheez choose karo.");
        r = await searchOSM(state, cityList(), cats, progress);
      }
      saveLeads();
      progress(1, `Ho gaya ✅ ${r.total} jagah mili, ${r.added} naye leads jude.`);
      $("fType").value = "lead";
      rerender();
      $("leadsCard").scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      saveLeads();
      render();
      progress(1, "❌ " + e.message);
      toast(e.message, 6000);
    } finally {
      btn.disabled = false;
    }
  }

  // ---------- lead actions ----------
  function onListClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el || el.tagName === "SELECT") return;
    const card = el.closest(".lead");
    const l = leads[card.dataset.id];
    if (!l) return;
    const act = el.dataset.act;
    if (act === "wa") {
      if (!settings.name || !settings.phone) { e.preventDefault(); openSettings(); toast("Pehle apna naam aur number Settings mein daalo."); return; }
      const count = sentToday();
      if (count >= settings.limit && !confirm(`Aaj ${count} message ho chuke. Zyada bhejoge to WhatsApp number ban kar sakta hai. Phir bhi bhejna hai?`)) { e.preventDefault(); return; }
      store.set("lf_sent_" + today(), count + 1);
      if (l.status === "new") l.status = "sent";
      l.sentAt = new Date().toISOString();
      saveLeads();
      setTimeout(render, 300);
    } else if (act === "copy") {
      const msg = buildMessage(l);
      (navigator.clipboard ? navigator.clipboard.writeText(msg) : Promise.reject())
        .then(() => toast("Message copy ho gaya ✅"))
        .catch(() => prompt("Yeh message copy karo:", msg));
    } else if (act === "note") {
      const n = prompt("Is restaurant ke baare mein note (jaise: 'owner Ramesh, Monday ko call karo'):", l.note || "");
      if (n !== null) { l.note = n.trim(); saveLeads(); render(); }
    }
  }
  function onListChange(e) {
    if (e.target.dataset.act !== "status") return;
    const l = leads[e.target.closest(".lead").dataset.id];
    l.status = e.target.value;
    saveLeads(); render();
  }

  function exportCsv() {
    const arr = filtered();
    if (!arr.length) { toast("Export karne ko kuch nahi."); return; }
    const cols = ["name", "phone", "wa", "address", "city", "state", "siteType", "website", "rating", "reviews", "score", "status", "note", "sentAt", "maps", "src"];
    const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(","), ...arr.map((l) => cols.map((c) => q(l[c])).join(","))].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `leads-${today()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- settings ----------
  function openSettings() {
    $("sName").value = settings.name; $("sPhone").value = settings.phone; $("sLink").value = settings.link;
    $("sKey").value = settings.key; $("sLimit").value = settings.limit; $("sMsg").value = settings.msg;
    $("settings").showModal();
  }
  function saveSettings() {
    settings = {
      name: $("sName").value.trim(), phone: $("sPhone").value.trim(), link: $("sLink").value.trim(),
      key: $("sKey").value.trim(), limit: Math.max(1, +$("sLimit").value || 30), msg: $("sMsg").value || DEFAULT_MSG,
    };
    store.set("lf_settings", settings);
    toast("Settings save ho gayi ✅");
    render();
  }

  // ---------- init ----------
  function init() {
    $("state").innerHTML = window.STATES.map((s, i) => `<option value="${i}">${esc(s.name)}</option>`).join("");
    const last = store.get("lf_last", { state: 3 }); // default Bihar
    $("state").value = String(last.state);
    $("cities").value = last.cities != null ? last.cities : window.STATES[last.state].cities.join(", ");
    $("cats").innerHTML = window.CATEGORIES.map((c) => `<label class="chip"><input type="checkbox" value="${c.id}"${c.id === "restaurant" ? " checked" : ""}><span>${esc(c.label)}</span></label>`).join("");
    $("fStatus").innerHTML = `<option value="">Har status</option>` + STATUSES.map(([v, t]) => `<option value="${v}">${t}</option>`).join("");

    const remember = () => store.set("lf_last", { state: +$("state").value, cities: $("cities").value });
    $("state").addEventListener("change", () => { $("cities").value = window.STATES[+$("state").value].cities.join(", "); remember(); updateEstimate(); });
    $("cities").addEventListener("input", () => { remember(); updateEstimate(); });
    $("cats").addEventListener("change", updateEstimate);
    $("customKw").addEventListener("input", updateEstimate);
    document.querySelectorAll("input[name=src]").forEach((r) => r.addEventListener("change", updateEstimate));
    $("searchBtn").addEventListener("click", runSearch);

    ["fType", "fStatus", "fPhone", "fSort"].forEach((id) => $(id).addEventListener("change", rerender));
    $("fText").addEventListener("input", rerender);
    $("more").addEventListener("click", () => { shown += PAGE; render(); });
    $("list").addEventListener("click", onListClick);
    $("list").addEventListener("change", onListChange);
    $("exportCsv").addEventListener("click", exportCsv);
    $("clearAll").addEventListener("click", () => {
      if (confirm("Saare leads aur unka status mit jayega. Pehle CSV export kar lo. Mitana hai?")) { leads = {}; saveLeads(); rerender(); }
    });

    $("openSettings").addEventListener("click", openSettings);
    $("resetMsg").addEventListener("click", () => { $("sMsg").value = DEFAULT_MSG; });
    $("settings").addEventListener("close", () => { if ($("settings").returnValue === "save") saveSettings(); });

    updateEstimate();
    render();
    if (!settings.name || !settings.phone) setTimeout(() => { openSettings(); toast("Shuru karne se pehle apna naam aur number daalo."); }, 300);
  }

  // test ke liye kuch functions bahar
  window.LeadFinder = { parsePhones, classifySite, buildMessage: (l) => buildMessage(l) };
  init();
})();

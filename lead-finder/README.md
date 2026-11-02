# Lead Finder

Find local businesses that don't have a website, message them on WhatsApp in one tap, follow up, and track what you earn. Built for a freelance web developer looking for clients.

- **Web:** https://aniket550.github.io/aniket550/lead-finder/
- **Android app:** https://github.com/aniket550/aniket550/releases/download/leadfinder-latest/LeadFinder.apk

## How it works

```
 Find            Qualify              Message            Follow up           Close
 ┌──────────┐    ┌───────────────┐    ┌─────────────┐    ┌──────────────┐    ┌──────────┐
 │ Gyms in  │──▶ │ No website?   │──▶ │ WhatsApp,   │──▶ │ No reply in  │──▶ │ Won:     │
 │ Patna    │    │ Score 0–100   │    │ ready pitch │    │ 3 days? Nudge│    │ ₹ earned │
 └──────────┘    └───────────────┘    └─────────────┘    └──────────────┘    └──────────┘
                                 Today tab shows what to do next
```

| Tab | What it's for |
|---|---|
| **Today** | Messages sent today against your daily limit, money earned, reply rate, follow-ups due, the 5 best leads to message next, and your pipeline (found → messaged → replied → interested → won). |
| **Find** | Pick a business type (Restaurants, Gyms, or your own words like "salon"), the kinds to include, a state and cities, then search Google Maps or OpenStreetMap. |
| **Leads** | Every business found, best first. Filter by website, business type, status or phone. Tap a card for details, status, notes, deal amount and history. |
| **Settings** | Your name, number and portfolio link; Appearance (Automatic, Light or Dark); the pitch for each business type; follow-up timing; daily limit; Google API key; CSV export. |

### Business types and their pitch

Each type has its own message, because owners care about different things:

- **Restaurants:** menu, photos, timings and direct orders without Zomato/Swiggy commission.
- **Gyms:** showing up for "gym near me", membership plans, trainers, transformation photos and free-trial bookings.
- **Other:** found on Google, services, prices and contact on WhatsApp.

Messages are always sent in English and can be edited in Settings, with a WhatsApp-style preview.

### Lead score (0–100)

| Signal | Points | Why |
|---|---|---|
| No website | 50 | They need one most |
| Only an Instagram / Zomato / Facebook page | 35 | Online already, but no site of their own |
| WhatsApp mobile number | 30 (landline 10) | You can reach the owner directly |
| Number of reviews | up to 15 | A busy business can afford a website |
| Rating 4 or more | 5 | A good business wants to show itself off |

## Try it

1. **Demo (no API key):** open the app and choose "Try with demo data". 12 made-up restaurants and gyms appear. Their WhatsApp button opens a chat with **your own number**, so you see exactly what a business would get.
2. **Real businesses:** add a Google API key in Settings (the "How to get an API key" steps are in the app), search one city first, and send your first real message to 10–15 businesses.

## Keep your WhatsApp number safe

The app never sends messages by itself; you tap Send in WhatsApp each time. WhatsApp bans numbers that message many strangers, so:

- The daily limit is 30 by default (start with 10–15 on a new number).
- Every message uses the business's name and ends with "If you're not interested, just tell me and I won't message again." Mark those businesses **Not interested** and don't message them again.
- At most 2 follow-ups per business.

## Google Maps API key

Turn on **Places API (New)**, create an API key, restrict it to that API, cap Text Search at about 200 requests a day, and add a budget alert. Leave Application restrictions on None so one key works in the app and on the website. The key is stored only on your device.

## Development

The web app is plain HTML, CSS and JavaScript with no build step: open `index.html` or run `python3 -m http.server`.

```
lead-finder/
  index.html, styles.css    page and iOS-style design (light + dark)
  app.js                    screens, search, scoring, messages, follow-ups, Android glue
  data.js                   states and cities, business types, messages, demo leads
  version.js                version shown in Settings
  fonts/, icon*.png/svg     bundled Inter font and app icon
  package.json              Capacitor (Android) dependencies; the version lives here too
  capacitor.config.json     app id com.aniket.leadfinder
  scripts/build-www.js      copies the web app into www/ with the Capacitor bundle
  android/                  Android project (edge to edge, splash, icons, signing)
```

**Android build:** GitHub Actions (`.github/workflows/lead-finder.yml`) runs on every push that changes `lead-finder/`. It builds the APK, publishes it on the `leadfinder-latest` release, and copies the web version to the `gh-pages` branch. To change the version, edit it in both `package.json` and `version.js`.

**Status bar:** the page tells Android which icon colour to use (dark icons on the light page, white on the dark one) through Capacitor's SystemBars, and the theme's `android:isLightTheme` makes the page follow the phone's dark mode.

**Signing:** without secrets, CI builds a debug APK signed with a key it keeps in its cache, so new builds install as updates while the cache lives (7 days unused). For a permanent key, add four repository secrets: `LF_KEYSTORE_B64` (the keystore, base64), `LF_KEYSTORE_PASSWORD`, `LF_KEY_ALIAS`, `LF_KEY_PASSWORD`. Never commit a keystore.

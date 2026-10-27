# Roz

**Roz** ek habit tracker hai, Android aur Mac ke liye. iPhone wala app baad mein aayega, aur wo bhi isi code se banega.

Roz ki habits tick karo. Streak, Day Ring aur heatmap dekh kar pata chalta hai ki sab kitna jud raha hai.

## Download aur install

Har push ke baad GitHub apne aap naye apps banata hai aur unhe ek release page pe daal deta hai:
**https://github.com/aniket550/aniket550/releases/tag/roz-latest**

### 🤖 Android
1. Phone mein upar wala link kholo aur `Roz-android.apk` download karo.
2. File kholo. Android pooche to us browser ko **"Install unknown apps"** ki permission do.
3. **Install** dabao.

Naya APK purane ke upar install karoge to app **update** hoga, aur data waisa hi rahega.

### 💻 Mac
1. Apne Mac ke hisaab se DMG download karo:
   - M1, M2, M3, M4 (Apple chip): `Roz-1.0.0-mac-arm64.dmg`
   - Intel Mac: `Roz-1.0.0-mac-x64.dmg`
   - Pata nahi kaunsa hai? Apple menu  → About This Mac → "Chip" ya "Processor" dekho.
2. DMG kholo aur **Roz** ko **Applications** folder mein drag karo.
3. Pehli baar kholne par macOS rokega, kyunki app pe Apple ka paid developer signature nahi hai. Tab:
   **System Settings → Privacy & Security** mein neeche jao → "Roz was blocked" ke saamne **Open Anyway** dabao.
   Ye sirf ek baar karna padta hai.

Mac pe Roz **menu bar** mein bhi rehta hai (upar right mein chhota ring icon). Click karo aur aaj ki habits wahin tick kar do.

| Shortcut | Kaam |
|---|---|
| ⌘N | Nayi habit |
| ⌘1 / ⌘2 / ⌘3 / ⌘, | Today / Progress / Habits / Settings |
| ⌘[ / ⌘] ya ← / → | Pichhla / agla din |
| ⌘E | Backup export |

## Data kahan rehta hai

Data **sirf aapke device pe** rehta hai (Android pe app storage, Mac pe `~/Library/Application Support/Roz`). Phone aur Mac abhi sync nahi hote. Data ek device se doosre pe le jaana ho to:
**Settings → Export backup** karo, phir doosre device pe **Settings → Import backup**.

## Code kaise bana hai

```
habits/
  www/                  app (HTML/CSS/JS): Android aur Mac dono yahi chalate hain
    core.js             habit ka hisaab: dates, streak, %, backup check (DOM nahi)
    app.js              screens, swipe, haptics, platform ka jod
    styles.css          design: rang, light/dark, phone + Mac layout
    fonts/              Inter font (SIL Open Font License), offline ke liye
  android/              Android project (Capacitor)
  electron/             Mac app: window, menu bar panel, menu
  test/core.test.js     core.js ke tests
  scripts/
    vendor.js           Capacitor plugins ko www/vendor/ mein jodta hai
    preview.js          design dekhne ke liye ek single HTML file banata hai
    icons.js            saare app icons banata hai (Playwright chahiye)
../.github/workflows/roz-apps.yml   APK + DMG build aur release
```

**Ek code, do dabbe:** `www/` ka code Android pe **Capacitor** chalata hai, aur Mac pe **Electron**. iPhone ke liye baad mein bas `npx cap add ios` karna hoga (Mac + Xcode chahiye).

### Local chalana

```bash
cd habits
npm install
npm test              # logic ke tests
npm run serve         # browser mein: http://localhost:8000
npm run mac           # Mac app (Mac pe)
npm run android:sync  # phir Android Studio mein android/ kholo
```

### Logic ke niyam (`core.js`)

- Tareekh **local time** mein banti hai (`toISOString()` UTC deta hai, jisse India mein subah 5:30 se pehle kal ki date aa jaati hai).
- Hafta **Somvar** se shuru hota hai.
- Streak mein **schedule se bahar ke din skip** hote hain. Som/Budh/Shukra wali habit Mangalwar ko nahi tootti.
- **Adhoora aaj streak nahi todta**, kyunki din abhi khatam nahi hua.
- "Hafte mein X baar" wali habit ki streak **hafton** mein ginti hai.
- % mein habit banne se pehle ke din nahi gine jaate.

### Android signing

Har naya APK purane ke upar tabhi update hota hai jab dono **ek hi key** se sign hon. Key ek password jaisi cheez hai, isliye ye repo mein nahi rakhi jaati (repo public hai). Key GitHub Secrets mein rehti hai:

1. GitHub pe repo kholo → **Settings → Secrets and variables → Actions → New repository secret**
2. Ye 4 secrets banao: `ROZ_KEYSTORE_B64` (keystore file, base64 mein), `ROZ_KEYSTORE_PASSWORD`, `ROZ_KEY_ALIAS`, `ROZ_KEY_PASSWORD`

Jab tak secrets nahi hain, CI ek **debug APK** banata hai. Wo bhi theek se install aur kaam karta hai. Uski key CI ke cache mein rehti hai, isliye updates tab tak chalte hain jab tak har 7 din mein kam se kam ek build hota rahe. Key badli to Android "App not installed" bolega. Tab pehle **backup export** karo, purana app hatao, naya install karo, aur backup import kar lo.

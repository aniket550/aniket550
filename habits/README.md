# Roj Habit

**Roj Habit** ek habit tracker hai, Android aur Mac ke liye. iPhone wala app baad mein aayega, aur wo bhi isi code se banega.

Roz ki habits tick karo. Home page pe aaj ka ring batata hai ki din kahan khada hai ("2 of 5"). Mac pe iske bagal mein chhote widget cards hain: **Up next** (ab kaunsi habit baaki hai), **Streaks** aur **This week**.

## Kaise use karein

| Kaam | Kaise |
|---|---|
| Nayi habit | Upar right ka kaala **+** button (Mac: ⌘N). Suggestions se ek tap mein bhar jaati hai |
| Tick karna | Habit ke right wala gola dabao, ya habit ko **right swipe** karo |
| Undo | Habit ko **left swipe** karo |
| Ginti wali habit (jaise 8 glass paani) | Right wala gola dabane par +1 hota hai, aur moti (●●●○○) bharte jaate hain |
| Edit / Delete | Habit ko **dabaa ke rakho** (Mac: right-click). Ya **Habits** tab → **Edit** → lal ⊖ dabao |
| Galti se delete ho gaya | Neeche aane wale **Undo** button ko dabao (5 second tak rehta hai) |
| Pichhla din theek karna | Upar hafte ki strip se din chuno, ya habit ke calendar mein us din pe tap karo |

## Widgets

| Kahan | Kaise lagayein | Kya karta hai |
|---|---|---|
| 🤖 Android home screen | **Settings → Add widget to home screen**. Ya home screen pe khaali jagah dabaa ke rakho → **Widgets** → **Roj Habit** | Size ke hisaab se layout badalta hai. **Chhota (2×2):** ring, "2 of 5 done" aur agli habit. **Chauda (4×2):** bagal mein ring, saath mein list. **Bada:** upar ginti aur ring, beech mein list, neeche is hafte ke din. List ki **poori line pe tap** karo to habit tick ho jaati hai. Upar ring pe tap karo to app khulta hai |
| 💻 Mac desktop | **Settings → Desktop widget** ON karo, ya menu **Window → Desktop Widget** | Apple jaise teen size: **Small**, **Medium**, **Large** (widget pe right-click → size chuno). Kheench ke kahin bhi rakho, aur gole pe click karke wahin tick karo. Right-click mein **Keep on Top** aur **Hide Widget** bhi hain |

Mac ke asli Notification Center widgets (WidgetKit) ke liye app pe Apple ka paid developer signature chahiye, isliye abhi Roj Habit apna khud ka desktop widget deta hai.

## Download aur install

Har push ke baad GitHub apne aap naye apps banata hai aur unhe ek release page pe daal deta hai:
**https://github.com/aniket550/aniket550/releases/tag/rojhabit-latest**

### 🤖 Android
1. Phone mein upar wala link kholo aur `RojHabit-android.apk` download karo.
2. File kholo. Android pooche to us browser ko **"Install unknown apps"** ki permission do.
3. **Install** dabao.

Naya APK purane ke upar install karoge to app **update** hoga, aur data waisa hi rahega.

### 💻 Mac
1. Apne Mac ke hisaab se DMG download karo:
   - M1, M2, M3, M4 (Apple chip): `RojHabit-<version>-mac-arm64.dmg`
   - Intel Mac: `RojHabit-<version>-mac-x64.dmg`
   - Pata nahi kaunsa hai? Apple menu  → About This Mac → "Chip" ya "Processor" dekho.
2. DMG kholo aur **Roj Habit** ko **Applications** folder mein drag karo.
3. Pehli baar kholne par macOS rokega, kyunki app pe Apple ka paid developer signature nahi hai. Tab:
   **System Settings → Privacy & Security** mein neeche jao → "Roj Habit was blocked" ke saamne **Open Anyway** dabao.
   Ye sirf ek baar karna padta hai.

Mac pe Roj Habit **menu bar** mein bhi rehta hai (upar right mein chhota arc icon). Click karo aur aaj ki habits wahin tick kar do.

| Shortcut | Kaam |
|---|---|
| ⌘N | Nayi habit |
| ⌘1 / ⌘2 / ⌘3 / ⌘, | Today / Progress / Habits / Settings |
| ⌫ | Khuli hui habit delete (⌘Z se undo) |
| ⌘[ / ⌘] ya ← / → | Pichhla / agla din |
| ⌘E | Backup export |

## Version

App ka version Settings ke neeche, aur release page ke title mein dikhta hai. Har update ke saath version badhta hai, aur `CHANGELOG.md` mein likha hota hai ki kya badla. Naya version banane ke liye:

```bash
cd habits
npm run bump            # 1.1.0 -> 1.1.1  chhota sudhaar
npm run bump -- minor   # 1.1.1 -> 1.2.0  naya feature / design
```

## Data kahan rehta hai

Data **sirf aapke device pe** rehta hai (Android pe app storage, Mac pe `~/Library/Application Support/Roj Habit`). Phone aur Mac abhi sync nahi hote. Data ek device se doosre pe le jaana ho to:
**Settings → Export backup** karo, phir doosre device pe **Settings → Import backup**.

## Code kaise bana hai

```
habits/
  www/                  app (HTML/CSS/JS): Android aur Mac dono yahi chalate hain
    core.js             habit ka hisaab: dates, streak, %, backup check (DOM nahi)
    app.js              screens, swipe, haptics, platform ka jod
    styles.css          design: rang, light/dark, phone + Mac layout
    fonts/              Inter font (SIL Open Font License), offline ke liye
    habit-icons.js      habit ke line icons, Lucide se (ISC License). scripts/habit-icons.js banata hai
    brand.js            logo: teen brush strokes (enso), app aur saare icons isi se bante hain
  android/              Android project (Capacitor)
    .../RojWidget.java  home screen widget: wahi saved data padhta hai aur gole se tick karta hai
  electron/             Mac app: window, menu bar panel, desktop widget, menu
  test/core.test.js     core.js ke tests
  scripts/
    vendor.js           Capacitor plugins ko www/vendor/ mein jodta hai
    preview.js          design dekhne ke liye ek single HTML file banata hai
    icons.js            saare app icons banata hai (Playwright chahiye)
    widget-preview.js   Android widget picker wali preview image banata hai
../.github/workflows/rojhabit-apps.yml   APK + DMG build aur release
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

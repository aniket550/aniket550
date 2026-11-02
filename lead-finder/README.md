# Lead Finder

**State choose karo → restaurants mil jaate hain → jinki website nahi hai unhe ek tap mein WhatsApp pe apna offer bhejo.**

Web developer ke liye client dhoondhne ka tool. Koi install nahi, koi server nahi. Saara data sirf aapke browser mein rehta hai.

## Kaise kaam karta hai

```
 State + shehar          Google Maps / OpenStreetMap          Har jagah check
 ┌──────────────┐  ───▶  ┌──────────────────────────┐  ───▶  ┌─────────────────────────────┐
 │ Bihar        │        │ "restaurants in Patna"   │        │ website hai?                │
 │ Patna, Gaya  │        │  naam, phone, website,   │        │  ✗ nahi        → 🔥 HOT lead │
 └──────────────┘        │  rating, reviews         │        │  ~ sirf Zomato → 🟡 WARM     │
                         └──────────────────────────┘        │  ✓ hai         → skip        │
                                                             └──────────────┬──────────────┘
                                                                            ▼
          Aap ek-ek karke  ◀───  WhatsApp button (message pehle se likha hua, naam ke saath)
          "Send" dabate ho        Status: Naya → Message gaya → Reply → Interested → Deal pakki
```

## Test kaise karein

1. **Bina API key (demo):** app kholo → "Pehle demo data se try karo". 10 sample restaurants aate hain. Demo lead ka WhatsApp button **aapke apne number** pe message kholta hai, taaki aap dekh sako restaurant ko kya jaayega.
2. **Asli data:** Settings mein Google API key daalo → 1 shehar, sirf "Restaurant" → dhoondho (max 3 Google request). Pehla asli message apne kisi dost ke restaurant ya apne number pe bhej ke dekho.

## Chalao

1. `lead-finder/index.html` ko Chrome mein kholo. (Phone pe chahiye to GitHub Pages on karo: repo **Settings → Pages → Branch** choose karo, phir `.../lead-finder/` kholo.)
2. **Settings** mein apna naam, number, (optional) portfolio link daalo.
3. State choose karo, "Restaurants dhoondho" dabao.
4. List mein **WhatsApp** dabao → WhatsApp khulega, message tayyar hoga → **Send** dabao.

## Data kahan se

| | Google Maps (Places API) | OpenStreetMap |
|---|---|---|
| Kitne restaurants | Bahut zyada | India mein kam |
| Phone number | Zyadatar milta hai | Kabhi kabhi |
| Key / kharcha | API key chahiye, har mahine free quota, uske baad paise | Free |
| Ek search mein | Max 60 jagah (isliye har shehar alag search) | Poora state ek baar mein |

**Google API key:** console.cloud.google.com → naya project → billing jodo → **Places API (New)** enable → Credentials → API key. Key ko sirf Places API (New) tak restrict karo aur Billing → Budgets mein budget alert lagao.

## Lead score (0-100)

| Cheez | Points | Kyun |
|---|---|---|
| Website bilkul nahi | 50 | Sabse zyada zaroorat |
| Sirf Zomato / Instagram / FB page | 35 | Online hain par apni site nahi; commission bachane ki baat samajhte hain |
| WhatsApp wala mobile number | 30 | Seedha owner tak pahunch |
| Zyada reviews | 0-15 | Chalti dukaan = paisa de sakti hai |
| Rating 4+ | 5 | Achhi dukaan, apna naam dikhana chahegi |

## WhatsApp ban se bacho (zaroori)

Tool jaan-boojh kar **auto-send nahi** karta. Har message aap khud Send dabate ho. Wajah:

- WhatsApp anjaan logon ko ek saath bahut message (bulk) bhejne wale number **ban** kar deta hai. Kai log "Block / Report" dabayenge to bhi ban.
- Isliye default limit **30 message/din** hai (Settings mein badal sakte ho). Naya number ho to 10-15 se shuru karo.
- Message mein restaurant ka naam aata hai (copy-paste spam nahi lagta) aur "interest na ho to bata dijiye, dobara message nahi karunga" likha hai. Jo mana kare use **🚫 Mana kiya** mark karo aur dobara mat bhejo.
- SMS se bulk promotion ke liye TRAI ke DLT rules lagte hain; WhatsApp/call ek-ek karke karna sabse safe hai.

## Design (iOS jaisa)

- **3 tab, floating glass tab bar** (Dhoondho · Leads · Settings). Chuna hua tab ek sliding pill se dikhta hai, jo halka sa uchhal ke (spring) chalta hai.
- **Large title**: scroll karne pe bada title chhota ho jaata hai aur upar blur wali bar aa jaati hai.
- **Grouped list**: form iOS Settings jaisa dikhta hai, aur Settings apne-aap save hoti hai (Save button nahi).
- **Segmented control**: Google/OpenStreetMap aur Leads filter ka thumb slide hota hai.
- **Search button** ke andar hi progress bharti hai, chamak (shimmer) ke saath.
- **Leads**: Apple Fitness jaisa ring "aaj ke message / limit" dikhata hai. Numbers gin-te hue badhte hain. Har card par naam ke initials wala rangeen avatar hota hai, aur cards ek-ek karke upar aate hain.
- **Dynamic Island jaisa toast**, **bottom sheet** (note, API key help, welcome), **iOS alert** aur **action sheet** (⋯ menu).
- Light aur dark mode dono hain. Agar phone mein "Reduce motion" on hai to saari animation band ho jaati hai.

## Files

```
lead-finder/
  index.html   page
  styles.css   iOS design tokens, light + dark, animations
  data.js      states, shehar, categories, social domains ki list
  app.js       search (Google / OpenStreetMap), lead score, WhatsApp message, status, CSV export,
               tabs, sheets, alerts, toast, count-up animations
```

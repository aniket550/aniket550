# Roj Habit: kya badla

Har update ke saath version badhta hai (`npm run bump`) aur yahan ek line judti hai.
Version ka matlab: **1.2.3** → 1 = bada badlav, 2 = naya feature ya design, 3 = chhota sudhaar.

## 1.5.0
- **Asli Mac widget** (macOS 14 Sonoma se): baaki apps ki tarah desktop pe right-click → Edit Widgets → Roj Habit. Small, Medium, Large. Gole pe click karke wahin habit tick, aur widget pe click karne se app khulta hai
- Widget Apple ke WidgetKit (Swift) se bana hai aur macOS ke sandbox mein chalta hai. App har badlav pe widget ko naya data deta hai
- Purana kheenchne wala card ab "Floating widget" hai, purane macOS ke liye bhi

## 1.4.0
- **Sync aa gaya: Mac ↔ Android, same Wi‑Fi pe.** Mac pe Settings → Sync with your phone ON karo, phone ke camera se QR scan karo, bas. Koi account nahi, koi cloud nahi
- Phone pe app khulte hi aur har badlav ke thodi der baad sync hota hai. Settings mein "Sync now" aur "Stop syncing"
- Ek hi cheez dono jagah badli ho to baad wala badlav jeet-ta hai. Delete ki hui habit sync se wapas nahi aati. Android widget se kiya tick bhi sync hota hai
- Naye phone pe welcome screen se seedha "Sync it" kar sakte ho

## 1.3.1
- Android: "App not installed… conflicts" theek kiya. Har build nayi key se sign ho raha tha, isliye naya APK purane ke upar install nahi hota tha. Ab ek hi key rehti hai. Is version pe aane ke liye ek baar purana app hatana padega (pehle backup export kar lo), uske baad updates seedhe install honge

## 1.3.0
- Android widget naya: size ke hisaab se teen layout (chhota, chauda, bada), jaise Apple aur Google ke widgets hote hain. Ab neeche faltu khaali jagah nahi rehti. Habits poori jagah mein barabar bant jaati hain, aur jagah bache to neeche is hafte ke din dikhte hain
- Android widget mein habit ki **poori line pe tap** karo to tick ho jaati hai, app nahi khulta. App kholna ho to upar ring pe tap karo. Tap karne pe halka sa highlight bhi aata hai
- "4/3 wk" jaisi ulti ginti theek ki, ab "3/3 wk"
- Mac desktop widget naya: Apple ke teen size (Small, Medium, Large), gol kone, aur Large mein is hafte ke din. Right-click se size badlo

## 1.2.1
- "1 down, 4 to go." wali badi line hata di. Phone pe ab date ke neeche bas ek chhoti si line hai, aur Mac pe "Good morning". Ginti progress ring wale card mein hai
- Widgets mein bhi ab "2 of 5 done" likha aata hai

## 1.2.0
- **Widgets aa gaye.** Android pe home screen widget: aaj ka ring, "2 down, 3 to go." aur habits, gole pe tap karke wahin tick. Settings → Add widget to home screen
- Mac pe **desktop widget**: chhota kaanch jaisa card, kahin bhi kheench ke rakho, wahin se tick karo. Settings → Desktop widget, ya Window → Desktop Widget
- Mac ka Today naya: phone jaisa "2 down, 3 to go." headline aur ring bagal mein, aur habits ke saath widget cards (Up next, Streaks, This week). Suraj wala Arc hata diya
- Mac pe "New here?" tips ab click aur right-click ki baat karte hain, swipe ki nahi
- Phone ke headline ke neeche wali rangeen line hata di

## 1.1.4
- Habit edit karte waqt koi bhi button dabane pe sheet ab upar nahi bhaagti, wahin rehti hai
- Repeat mein din ke button ab Every day pe bhi dikhte hain. Saare 7 din chuno to apne aap Every day ho jaata hai, ek din hatao to Some days

## 1.1.3
- Android: upar aur neeche ke kaale patte hata diye. App ab poori screen pe dikhta hai, aur upar time, battery aur notification icons saaf dikhte hain

## 1.1.2
- Tab badalne pe nav bar ka kaanch wala lens ab slide hota hai, chalte waqt halka sa failta hai, aur naye tab ka icon uchhalta hai
- Nav bar thoda aur transparent

## 1.1.1
- Scroll karne pe nav bar ab chhota nahi hota, hamesha poora dikhta hai

## 1.1.0
- Naya logo: pehli teen-rang wali ring, ab brush se paint ki hui (enso), kaagaz jaise background par. App icon, Mac icon aur splash bhi
- Nav bar iPhone (iOS 26) jaisa: selected tab ka bhara hua icon, kaanch ka lens, aur scroll karne pe chhota ho jaata hai
- Liquid Glass bars: transparent kaanch, kinaaron pe roshni. Upar ka bar scroll pe content ko dhundhla karta hai
- Pehli baar kholne pe swipe ki tip, aur pehli habit khud slide karke dikhati hai
- Animations: habits ek-ek karke aati hain, tick pe leher, ring aur score purani value se nayi tak bharte hain, perfect day pe confetti
- Home: naya score ("2 down, 4 to go.") aur har habit ki score patti. Faltu lines hataayi
- Progress: "By habit" list compact, hafte ke 7 dots ke saath
- Emoji ki jagah line icons
- Version ab Settings, Android, Mac aur release page sab jagah dikhta hai

## 1.0.0
- Pehla version: Android (APK) aur Mac (DMG)
- Today, Progress, Habits, Settings, habit detail, streak, heatmap, backup

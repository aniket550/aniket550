# English 30

**30 din mein English bolna shuru karo.** Hindi bolne waale beginners ke liye ek app. User ko roz ek task milta hai, aur har rule ke saath uska **"kyun" (reason)** bhi diya jaata hai, taaki ratna na pade, samajh aaye.

## Prototype chalao

Koi install nahi chahiye. `app/index.html` ko browser mein kholo, ya local server chalao:

```bash
cd app
python3 -m http.server 8000
# phone aur laptop ek hi Wi-Fi pe hon, to phone mein kholo: http://<laptop-ka-IP>:8000
```

Mic se bolne wala check (speech recognition) Chrome mein kaam karta hai, khaas kar Android pe.

## Roz ka task (5 hisse)

| # | Hissa | Kya hota hai |
|---|---|---|
| 1 | Reading | Chhota passage + audio + Hindi meaning (on/off) + 3 sawaal |
| 2 | 15 Words | Har word: meaning, uchcharan, ✅ kab use, ❌ kab nahi, **kyun** |
| 3 | Grammar | Kya hota hai, Hindi ↔ English mapping, formula, har rule ka **kyun** |
| 4 | Models | Asli situations (phone, dukaan, class, ghar) aur har sentence ka **kyun** |
| 5 | Practice | 10 sawaal (galat jawab pe reason dikhta hai) + bolne ki practice + 3 sentence likhna (app check karta hai) |

Quiz mein **70%** aane par hi din poora hota hai. Practice tab tak band rehta hai jab tak pehle 4 hisse poore na hon.

## Files

```
app/
  index.html            app shell (PWA meta, home screen pe add ho sakta hai)
  styles.css            Apple-style design tokens, light + dark mode
  app.js                screens, navigation, quiz logic, progress (localStorage)
  content/day02.js      Day 2 (Is / Am / Are) ka poora content
  content/syllabus.js   45 din ka syllabus (Safar screen ke liye)
  manifest.webmanifest
  icon.svg
```

## Naya din kaise jodein

`app/content/day02.js` ko copy karke `dayNN.js` banao, `window.LESSONS[NN]` mein content bharo, aur `index.html` mein uski `<script>` jodo. Har word, rule, model aur quiz sawaal mein `why` field zaroor bharo, kyunki app ka asli fark yahi reason hai.

Abhi sirf Day 2 ka content hai. Day 1 aur Day 3–45 ke din `LESSONS` mein jodne baaki hain, aur `app.js` mein `DAY` ko ek se zyada din ke liye badalna hoga.

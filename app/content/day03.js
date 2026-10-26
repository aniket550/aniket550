// Day 3 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[3] = {
  day: 3,
  week: 1,
  title: 'Daily Routine',
  subtitle: 'Roz ke kaam batana',
  minutes: 30,
  next: { day: 4, title: 'Simple Present' },

  reading: {
    title: 'My Day',
    lines: [
      { en: 'I wake up at 6 o\'clock every morning.', hi: 'Main roz subah 6 baje uthta hoon.' },
      { en: 'I brush my teeth and take a bath.', hi: 'Main daant saaf karta hoon aur nahata hoon.' },
      { en: 'My mother cooks breakfast, and we eat together.', hi: 'Meri maa naashta banati hain, aur hum saath khaate hain.' },
      { en: 'I go to college by bus at 8 o\'clock.', hi: 'Main 8 baje bus se college jaata hoon.' },
      { en: 'In the evening, I usually play cricket, and I sleep at 10.', hi: 'Shaam ko main aksar cricket khelta hoon, aur 10 baje so jaata hoon.' }
    ],
    grammarWords: ['wake', 'brush', 'take', 'cooks', 'eat', 'go', 'play', 'sleep'],
    vocabWords: ['every', 'breakfast', 'usually', 'bath', 'teeth'],
    questions: [
      { q: 'Woh subah kitne baje uthta hai?', a: '6 baje.' },
      { q: 'Naashta kaun banata hai?', a: 'Uski maa.' },
      { q: 'Woh college kaise jaata hai?', a: 'Bus se, 8 baje.' }
    ]
  },

  words: [
    {
      word: 'wake up', ipa: '/weɪk ʌp/', say: 'वेक अप', hindi: 'जागना', meaning: 'neend se jaagna',
      use: { ex: 'I wake up at 6.', why: 'Roz ka kaam hai, isliye **sirf verb**: wake up.' },
      dont: { wrong: 'I am wake up at 6.', right: 'I wake up at 6.', why: 'Roz ke kaam (verb) ke saath **“am” nahi** lagta. Day 2 ka rule yaad hai?' },
      tags: ['Ghar', 'Routine']
    },
    {
      word: 'brush', ipa: '/brʌʃ/', say: 'ब्रश', hindi: 'ब्रश करना', meaning: 'daant saaf karna',
      use: { ex: 'I brush my teeth twice a day.', why: 'Roz ki aadat, isliye simple present.' },
      dont: { wrong: 'I brush my teeths.', right: 'I brush my teeth.', why: '“tooth” (ek daant) ka plural **“teeth”** hai. “Teeths” koi shabd nahi.' },
      tags: ['Ghar', 'Routine']
    },
    {
      word: 'take a bath', ipa: '/teɪk ə bæθ/', say: 'टेक अ बाथ', hindi: 'नहाना', meaning: 'nahana',
      use: { ex: 'I take a bath in the morning.', why: 'English mein nahane ke liye **“take”** a bath ya shower.' },
      dont: { wrong: 'I do bath.', right: 'I take a bath.', why: 'Hindi “nahana” ke liye log “do” laga dete hain. English mein **“take a bath”** bolte hain.' },
      tags: ['Ghar', 'Routine']
    },
    {
      word: 'breakfast', ipa: '/ˈbrekfəst/', say: 'ब्रेकफ़ास्ट', hindi: 'नाश्ता', meaning: 'naashta',
      use: { ex: 'I have breakfast at 7.', why: 'Khana khane ke liye English mein aksar **“have”** bolte hain.' },
      dont: { wrong: 'I do breakfast.', right: 'I have breakfast.', why: '“Do breakfast” English mein nahi bolte. **“Have”** ya “eat” breakfast.' },
      tags: ['Ghar', 'Restaurant']
    },
    {
      word: 'cook', ipa: '/kʊk/', say: 'कुक', hindi: 'खाना बनाना', meaning: 'khana banana',
      use: { ex: 'My mother cooks dinner.', why: '“My mother” = she. She ke saath verb mein **-s**: cooks.' },
      dont: { wrong: 'My mother cook dinner.', right: 'My mother cooks dinner.', why: 'Ek teesre insaan (he / she) ke roz ke kaam mein **verb + s** lagta hai.' },
      tags: ['Ghar']
    },
    {
      word: 'go', ipa: '/ɡoʊ/', say: 'गो', hindi: 'जाना', meaning: 'jaana',
      use: { ex: 'I go to college by bus.', why: '“I” ke saath verb **saada** rehta hai: go.' },
      dont: { wrong: 'He go to work.', right: 'He goes to work.', why: 'He / she ke saath “go” → **“goes”**. o pe khatam hone wale verb mein **-es**.' },
      tags: ['Routine', 'Office']
    },
    {
      word: 'leave', ipa: '/liːv/', say: 'लीव', hindi: 'निकलना', meaning: '(ghar se) nikalna',
      use: { ex: 'I leave home at 8.', why: 'Kisi jagah se nikalne ke liye **“leave”** + jagah.' },
      dont: { wrong: 'I leave from home at 8.', right: 'I leave home at 8.', why: '“leave” ka matlab hi “se nikalna” hai, isliye **“from” nahi** lagta.' },
      tags: ['Routine', 'Office']
    },
    {
      word: 'reach', ipa: '/riːtʃ/', say: 'रीच', hindi: 'पहुँचना', meaning: 'pahunchna',
      use: { ex: 'I reach college at 9.', why: 'Kahan pahunche, woh **seedha** “reach” ke baad.' },
      dont: { wrong: 'I reach to college at 9.', right: 'I reach college at 9.', why: '“reach” ka matlab hi “tak pahunchna” hai, isliye **“to” nahi** lagta.' },
      tags: ['Routine', 'Office']
    },
    {
      word: 'lunch', ipa: '/lʌntʃ/', say: 'लंच', hindi: 'दोपहर का खाना', meaning: 'dopahar ka khana',
      use: { ex: 'We have lunch at 1 o\'clock.', why: 'Ghadi ka time **“at”** se batate hain.' },
      dont: { wrong: 'We have lunch on 1 o\'clock.', right: 'We have lunch at 1 o\'clock.', why: 'Ghadi ke time ke saath **“at”**. “On” dinon ke saath lagta hai (on Sunday).' },
      tags: ['Office', 'Ghar']
    },
    {
      word: 'work', ipa: '/wɜːrk/', say: 'वर्क', hindi: 'काम करना', meaning: 'kaam karna',
      use: { ex: 'My father works in a bank.', why: 'He ke saath verb + s: **works**.' },
      dont: { wrong: 'My father do work in a bank.', right: 'My father works in a bank.', why: '“Do work” Hindi “kaam karta hai” ka translation hai. English mein sirf **“works”**.' },
      tags: ['Office', 'Family']
    },
    {
      word: 'study', ipa: '/ˈstʌdi/', say: 'स्टडी', hindi: 'पढ़ाई करना', meaning: 'padhna',
      use: { ex: 'I study in the evening.', why: '“I” ke saath verb saada.' },
      dont: { wrong: 'She studys at night.', right: 'She studies at night.', why: 'Consonant + **y** pe khatam verb mein y hata ke **-ies**: study → studies.' },
      tags: ['Padhai']
    },
    {
      word: 'usually', ipa: '/ˈjuːʒuəli/', say: 'यूज़ुअली', hindi: 'आमतौर पर', meaning: 'aksar',
      use: { ex: 'I usually walk to school.', why: 'Zyaadatar din aisa hota hai, **har din nahi**.' },
      dont: { wrong: 'I go usually to school by bus.', right: 'I usually go to school by bus.', why: '“usually / always” **kaam (verb) se pehle** aate hain.' },
      tags: ['Routine']
    },
    {
      word: 'always', ipa: '/ˈɔːlweɪz/', say: 'ऑलवेज़', hindi: 'हमेशा', meaning: 'hamesha',
      use: { ex: 'She always reaches on time.', why: '**Har baar** hone wali baat.' },
      dont: { wrong: 'Always I drink tea.', right: 'I always drink tea.', why: 'Subject (I) ke **baad**, verb se **pehle**. Shuru mein “Always” sirf hukm mein: “Always say thank you.”' },
      tags: ['Routine']
    },
    {
      word: 'every day', ipa: '/ˈevri deɪ/', say: 'एवरी डे', hindi: 'रोज़', meaning: 'roz',
      use: { ex: 'I read English every day.', why: 'Roz ki **aadat**, isliye simple present (read).' },
      dont: { wrong: 'I am reading English every day.', right: 'I read English every day.', why: 'Aadat ke liye simple present. **“am reading” abhi** ho raha kaam hai (Day 7).' },
      tags: ['Routine', 'Padhai']
    },
    {
      word: 'sleep', ipa: '/sliːp/', say: 'स्लीप', hindi: 'सोना', meaning: 'sona',
      use: { ex: 'I sleep at 10 o\'clock.', why: 'Roz ka time, isliye simple present + **at**.' },
      dont: { wrong: 'I sleep at 10 o\'clock night.', right: 'I sleep at 10 o\'clock at night.', why: '“night” ke saath bhi **“at”** lagta hai: at night. Ya seedha “at 10 p.m.”.' },
      tags: ['Ghar', 'Routine']
    }
  ],

  grammar: {
    what: 'Roz ke kaam (aadat) batane ke liye **Simple Present**. “Main roz 6 baje uthta hoon” = “I wake up at 6 every day.” He / she ke saath verb mein **-s** lagta hai.',
    formula: ['I / You / We / They', 'verb', 'baaki baat'],
    pairs: [
      { hi: 'Main', hiVerb: 'uthta hoon', en: 'I', enVerb: 'wake up' },
      { hi: 'Woh (ladka)', hiVerb: 'uthta hai', en: 'He', enVerb: 'wakes up' },
      { hi: 'Woh (ladki)', hiVerb: 'padhti hai', en: 'She', enVerb: 'studies' },
      { hi: 'Hum', hiVerb: 'khelte hain', en: 'We', enVerb: 'play' }
    ],
    rules: [
      {
        title: 'Roz ke kaam: sirf verb',
        wrong: 'I am wake up at 6.', right: ['I wake up at 6.', 'We play cricket.'],
        why: 'Roz ki aadat ke liye **sirf verb** lagta hai, “am” nahi. Hindi ka “hoon” (uthta hoon) Hindi tense ka hissa hai.'
      },
      {
        title: 'He / She / It ke saath verb + s',
        wrong: 'She cook food.', right: ['She cooks food.', 'He plays cricket.'],
        why: 'English mein teesre insaan (he / she / it) ke roz ke kaam mein verb ke aage **-s** lagta hai. Yaad rakho: **“s for she”**.'
      },
      {
        title: '-es aur -ies kab',
        wrong: 'He gos to work. She studys.', right: ['He goes to work.', 'She watches TV.', 'She studies at night.'],
        why: '**o, sh, ch, x, ss** pe khatam verb mein **-es** (bolne mein aasaan). Consonant + **y** → **-ies**.'
      },
      {
        title: 'have → has',
        wrong: 'She have a bike.', right: ['I have a bike.', 'She has a bike.'],
        why: '“have” ka he / she wala roop **“has”** hai, bilkul go → goes jaisa.'
      },
      {
        title: 'Time ke saath at',
        wrong: 'I wake up on 6 o\'clock.', right: ['I wake up at 6 o\'clock.', 'I sleep at night.'],
        why: 'Ghadi ke time aur “night” ke saath **at**. Din ke saath **on** (on Sunday).'
      },
      {
        title: 'always / usually ki jagah',
        wrong: 'I go always by bus.', right: ['I always go by bus.', 'She usually reads at night.'],
        why: 'Yeh shabd **subject ke baad, verb se pehle** aate hain. Lekin am / is / are ke **baad**: “She is always happy.”'
      }
    ]
  },

  modal: {
    verb: 'should', ipa: '/ʃʊd/', say: 'शुड', hindi: 'चाहिए', meaning: 'karna chahiye',
    uses: [
      { rule: 'Jab kisi ko **salah (advice)** deni ho', form: 'Subject + should + verb', ex: [
        { en: 'You should [revise every week].', hi: 'Tumhe har hafte revise karna chahiye.' },
        { en: 'You should [start the assignment early].', hi: 'Tumhe assignment jaldi shuru karna chahiye.' }
      ] },
      { rule: 'Jab khud **salah maangni** ho', form: 'Should I + verb …?', ex: [
        { en: 'Should I [take two courses or three]?', hi: 'Kya mujhe do course lene chahiye ya teen?' },
        { en: 'Should I [email the support team]?', hi: 'Kya mujhe support team ko email karna chahiye?' }
      ] },
      { rule: 'Jab batana ho ki **kya nahi karna chahiye**', form: 'Subject + shouldn\'t + verb', ex: [
        { en: 'You shouldn\'t [copy from others].', hi: 'Tumhe doosron se copy nahi karna chahiye.' },
        { en: 'We shouldn\'t [wait till the last day].', hi: 'Humein aakhri din tak intezaar nahi karna chahiye.' }
      ] }
    ],
    dont: [
      { wrong: 'You should to revise.', right: 'You should revise.', why: 'Modal ke baad **“to” nahi**.' },
      { wrong: 'You should must go.', right: 'You should go.', why: 'Do modal **ek saath nahi** lagte.' }
    ]
  },

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'She ___ to school by bus.', options: ['go', 'goes', 'going'], answer: 'goes', why: '“She” ke saath verb + s. o pe khatam, isliye **goes**.' },
      { prompt: 'Sahi shabd chuno', q: 'I ___ up at 6 every day.', options: ['wake', 'wakes', 'am wake'], answer: 'wake', why: '“I” ke saath verb **saada**, aur “am” nahi.' },
      { prompt: 'Sahi shabd chuno', q: 'My father ___ in a bank.', options: ['work', 'works', 'is work'], answer: 'works', why: '“My father” = he, isliye **works**.' },
      { prompt: 'Sahi shabd chuno', q: 'He ___ TV at night.', options: ['watchs', 'watches', 'watch'], answer: 'watches', why: '**ch** pe khatam verb mein **-es**: watches.' },
      { prompt: 'Sahi shabd chuno', q: 'She ___ a new bike.', options: ['have', 'has'], answer: 'has', why: 'He / she ke saath have → **has**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I go always by bus.', 'I always go by bus.'], answer: 'I always go by bus.', why: '“always” **verb se pehle** aata hai.' },
      { prompt: 'Sahi shabd chuno', q: 'I sleep ___ 10 o\'clock.', options: ['on', 'at', 'in'], answer: 'at', why: 'Ghadi ke time ke saath **at**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I reach to college at 9.', 'I reach college at 9.'], answer: 'I reach college at 9.', why: '“reach” ke baad **“to” nahi** lagta.' },
      { prompt: 'Sahi shabd chuno', q: 'My sister ___ English every day.', options: ['studys', 'studies', 'study'], answer: 'studies', why: 'Consonant + y → **-ies**: studies.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I do bath in the morning.', 'I take a bath in the morning.'], answer: 'I take a bath in the morning.', why: 'Nahane ke liye English mein **“take a bath”**.' }
    ]
  },

  speak: [
    'I wake up at 6 o\'clock.',
    'My mother cooks breakfast.',
    'I usually go to college by bus.'
  ],

  write: {
    intro: 'Apni roz ki routine 3 sentence mein likho.',
    items: [
      { label: 'I wake up at …', placeholder: 'Jaise: I wake up at 6 o\'clock.', pattern: '\\bi (wake|get) up at [a-z0-9]+', ok: 'Roz ka kaam, **sirf verb** + at. Sahi!', fix: 'Likho: **I wake up at** + time. “am” mat lagao, aur time ke saath **at**.' },
      { label: 'My mother / father …', placeholder: 'Jaise: My mother cooks breakfast.', pattern: '\\bmy (mother|father|sister|brother) (?!is\\b|was\\b)[a-z]+s\\b', ok: 'He / she ke saath **verb + s**. Bilkul sahi!', fix: 'He / she ke saath **verb + s** lagao: My mother cook**s** …, My father go**es** …' },
      { label: 'I usually / always …', placeholder: 'Jaise: I usually play cricket.', pattern: '\\bi (usually|always|often|never|sometimes) [a-z]+', ok: '“usually / always” **verb se pehle**, sahi jagah!', fix: '“usually / always” **I ke baad aur verb se pehle**: I usually go …' }
    ]
  }
};

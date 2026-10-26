// Day 5 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[5] = {
  day: 5,
  week: 1,
  title: 'Simple Past',
  subtitle: 'Beeti hui baat batana',
  minutes: 30,
  next: { day: 6, title: 'Past Practice' },

  reading: {
    title: 'Last Sunday',
    lines: [
      { en: 'Last Sunday, I visited my grandmother in the village.', hi: 'Pichhle Sunday main gaon mein apni daadi se milne gaya.' },
      { en: 'I went there by train and reached at 10 o\'clock.', hi: 'Main train se gaya aur 10 baje pahuncha.' },
      { en: 'She cooked kheer for me, and we ate together.', hi: 'Unhone mere liye kheer banayi, aur humne saath khaaya.' },
      { en: 'In the evening, we walked to the river and talked a lot.', hi: 'Shaam ko hum paidal nadi tak gaye aur bahut baatein ki.' },
      { en: 'I came back home at night. It was a wonderful day!', hi: 'Main raat ko ghar wapas aaya. Woh ek shaandaar din tha!' }
    ],
    grammarWords: ['visited', 'went', 'reached', 'cooked', 'ate', 'walked', 'talked', 'came', 'was'],
    vocabWords: ['Last', 'visited', 'went', 'ate', 'came'],
    questions: [
      { q: 'Pichhle Sunday woh kisse milne gaya?', a: 'Apni daadi se, gaon mein.' },
      { q: 'Daadi ne kya banaya?', a: 'Kheer.' },
      { q: 'Shaam ko unhone kya kiya?', a: 'Nadi tak paidal gaye aur baatein ki.' }
    ]
  },

  words: [
    {
      word: 'yesterday', ipa: '/ˈjestərdeɪ/', say: 'यस्टरडे', meaning: 'beeta hua kal',
      use: { ex: 'I met Ravi yesterday.', why: 'Beeta hua kal, isliye verb ka **past roop**: met.' },
      dont: { wrong: 'Yesterday I go to the market.', right: 'Yesterday I went to the market.', why: '“yesterday” ke saath verb **zaroor past** mein badalta hai: go → went.' },
      tags: ['Dost', 'Ghar']
    },
    {
      word: 'last', ipa: '/læst/', say: 'लास्ट', meaning: 'pichhla',
      use: { ex: 'I visited Delhi last year.', why: 'Last week, last month, last year: **beeta hua** samay.' },
      dont: { wrong: 'I visited Delhi in last year.', right: 'I visited Delhi last year.', why: '“last” ke saath **in / on nahi** lagta.' },
      tags: ['Travel']
    },
    {
      word: 'ago', ipa: '/əˈɡoʊ/', say: 'अगो', meaning: 'pehle (aaj se)',
      use: { ex: 'I came here two years ago.', why: 'Aaj se **kitna pehle**: time + ago.' },
      dont: { wrong: 'I came here before two years.', right: 'I came here two years ago.', why: 'Hindi “do saal pehle” ka “pehle” English mein **time ke baad “ago”** banta hai.' },
      tags: ['Interview', 'Dost']
    },
    {
      word: 'visit', ipa: '/ˈvɪzɪt/', say: 'विज़िट', meaning: 'milne jaana · past: visited',
      use: { ex: 'We visited the Taj Mahal last month.', why: 'Regular verb: **+ ed**.' },
      dont: { wrong: 'I visited to my uncle.', right: 'I visited my uncle.', why: '“visit” ke baad **“to” nahi**, seedha insaan ya jagah.' },
      tags: ['Travel', 'Family']
    },
    {
      word: 'went', ipa: '/went/', say: 'वेंट', meaning: 'gaya · go ka past',
      use: { ex: 'I went to school by bus.', why: '“go” ka past **went** hai.' },
      dont: { wrong: 'I goed to school.', right: 'I went to school.', why: 'Kuch verbs ka past **-ed se nahi** banta. Inhe yaad karna padta hai.' },
      tags: ['Routine']
    },
    {
      word: 'came', ipa: '/keɪm/', say: 'केम', meaning: 'aaya · come ka past',
      use: { ex: 'He came home late.', why: '“come” ka past **came**.' },
      dont: { wrong: 'He comed home late.', right: 'He came home late.', why: 'Irregular verb: **come → came**.' },
      tags: ['Ghar']
    },
    {
      word: 'saw', ipa: '/sɔː/', say: 'सॉ', meaning: 'dekha · see ka past',
      use: { ex: 'I saw a tiger in the zoo.', why: '“see” ka past **saw**.' },
      dont: { wrong: 'I seen a tiger.', right: 'I saw a tiger.', why: '“seen” **akela nahi** aata (have seen). Simple past mein **saw**.' },
      tags: ['Travel', 'Dost']
    },
    {
      word: 'ate', ipa: '/eɪt/', say: 'एट', meaning: 'khaaya · eat ka past',
      use: { ex: 'We ate pizza last night.', why: '“eat” ka past **ate**.' },
      dont: { wrong: 'We eated pizza.', right: 'We ate pizza.', why: 'Irregular verb: **eat → ate**.' },
      tags: ['Khana']
    },
    {
      word: 'bought', ipa: '/bɔːt/', say: 'बॉट', meaning: 'khareeda · buy ka past',
      use: { ex: 'I bought a new phone.', why: '“buy” ka past **bought**.' },
      dont: { wrong: 'I buyed a new phone.', right: 'I bought a new phone.', why: 'Irregular verb: **buy → bought**.' },
      tags: ['Dukaan']
    },
    {
      word: 'met', ipa: '/met/', say: 'मेट', meaning: 'mila · meet ka past',
      use: { ex: 'I met my old friend yesterday.', why: '“meet” ka past **met**.' },
      dont: { wrong: 'I meeted him.', right: 'I met him.', why: 'Irregular verb: **meet → met**.' },
      tags: ['Dost']
    },
    {
      word: 'told', ipa: '/toʊld/', say: 'टोल्ड', meaning: 'bataya · tell ka past',
      use: { ex: 'She told me a story.', why: '“tell” ke baad **insaan** (me, him) aata hai.' },
      dont: { wrong: 'He told to me.', right: 'He told me.', why: '“tell / told” ke baad insaan **seedha**, “to” nahi.' },
      tags: ['Dost', 'Office']
    },
    {
      word: 'said', ipa: '/sed/', say: 'सेड', meaning: 'kaha · say ka past',
      use: { ex: 'He said, "I am busy."', why: '“said” ke baad **seedha baat** aati hai.' },
      dont: { wrong: 'He said me to wait.', right: 'He told me to wait.', why: 'Insaan (me) ke saath **“told”**. “said” ke baad insaan nahi aata.' },
      note: 'Uchcharan: said = **“sed”**, “seid” nahi.',
      tags: ['Office', 'Dost']
    },
    {
      word: 'forgot', ipa: '/fərˈɡɑːt/', say: 'फ़र्गॉट', meaning: 'bhool gaya · forget ka past',
      use: { ex: 'I forgot my bag at home.', why: '“forget” ka past **forgot**.' },
      dont: { wrong: 'I forgot my bag in home.', right: 'I forgot my bag at home.', why: '“Ghar pe” = **at home**. Yeh fixed jodi hai.' },
      tags: ['Class', 'Office']
    },
    {
      word: 'started', ipa: '/ˈstɑːrtɪd/', say: 'स्टार्टिड', meaning: 'shuru hua / kiya',
      use: { ex: 'The class started at 10.', why: 'Regular verb + ed. **t / d** pe khatam verb mein -ed ko **“id”** bolte hain.' },
      dont: { wrong: 'The class was started at 10.', right: 'The class started at 10.', why: 'Hindi “shuru hui **thi**” se “was” jud jaata hai. Simple past mein **ek hi verb** kaafi hai.' },
      tags: ['Class', 'Office']
    },
    {
      word: 'finished', ipa: '/ˈfɪnɪʃt/', say: 'फ़िनिश्ट', meaning: 'khatam kiya',
      use: { ex: 'I finished my homework.', why: 'Regular verb + ed. Yahan -ed ki awaaz **“t”** hai.' },
      dont: { wrong: 'Did you finished?', right: 'Did you finish?', why: '**did** ke baad verb saada. Poora rule kal (Day 6).' },
      tags: ['Padhai', 'Office']
    }
  ],

  grammar: {
    what: 'Beeti hui baat ke liye **Simple Past**. Zyaadatar verb mein **-ed** lagta hai (walk → walked). Kuch verb ka roop **poora badal** jaata hai (go → went).',
    formula: ['Subject', 'verb ka past roop', 'baaki baat'],
    pairs: [
      { hi: 'Main', hiVerb: 'gaya', en: 'I', enVerb: 'went' },
      { hi: 'Woh', hiVerb: 'aaya', en: 'He', enVerb: 'came' },
      { hi: 'Humne', hiVerb: 'khaaya', en: 'We', enVerb: 'ate' },
      { hi: 'Unhone', hiVerb: 'dekha', en: 'They', enVerb: 'saw' }
    ],
    rules: [
      {
        title: 'Regular verb: + ed',
        wrong: 'Yesterday I walk to school.', right: ['Yesterday I walked to school.', 'She cooked dinner.'],
        why: 'Beeti baat ka signal: verb ke aage **-ed**. “Yesterday” likh dene se kaam nahi chalta, **verb bhi badalna** zaroori hai.'
      },
      {
        title: 'Irregular verb: roop badalta hai',
        wrong: 'I goed to Delhi.', right: ['I went to Delhi.', 'We ate lunch.', 'She saw a movie.'],
        why: 'Purane English verbs apna **alag roop** rakhte hain. Inki list yaad karni padti hai. Roz **5 yaad karo**, ek mahine mein 150.'
      },
      {
        title: 'Sab ke liye ek hi roop',
        wrong: 'He wents to school.', right: ['I went.', 'He went.', 'They went.'],
        why: 'Past mein he / she wala **-s nahi** lagta. Is maamle mein past, present se **aasaan** hai!'
      },
      {
        title: 'am / is / are ka past: was / were',
        wrong: 'Yesterday I am sick.', right: ['Yesterday I was sick.', 'They were at home.'],
        why: 'am / is ka past **was**, are ka past **were**. I / he / she / it → was. You / we / they → were.'
      },
      {
        title: '“was + verb” mat jodo',
        wrong: 'I was went to Delhi.', right: ['I went to Delhi.'],
        why: 'Hindi “gaya **tha**” mein “tha” hai, isliye log “was” laga dete hain. English simple past mein **ek hi verb** kaafi hai.'
      },
      {
        title: '-ed ki 3 awaazein',
        right: ['walked (t)', 'played (d)', 'wanted (id)'],
        why: 'Likhne mein ek, bolne mein teen. **p, k, s, sh, ch** ke baad “t”. **t, d** ke baad “id”. Baaki sab mein “d”.'
      }
    ]
  },

  models: [
    { situation: 'Dost se', en: 'I watched a movie yesterday.', why: 'Kal ki baat: watch + **ed**.' },
    { situation: 'Office (late)', en: 'Sorry, I missed the bus.', why: 'Abhi abhi beeti baat: miss + **ed**.' },
    { situation: 'Doctor ke paas', en: 'I had a fever last night.', why: '“have” ka past **had**.' },
    { situation: 'Phone pe', en: 'I called you two times.', why: 'call + **ed**. “two times” ya “twice”.' },
    { situation: 'Class mein', en: 'Sorry, ma\'am, I forgot my notebook at home.', why: 'forget → **forgot**, aur ghar pe = **at home**.' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'Yesterday I ___ to the market.', options: ['go', 'went', 'goed'], answer: 'went', why: '“go” ka past **went**.' },
      { prompt: 'Sahi shabd chuno', q: 'She ___ dinner last night.', options: ['cook', 'cooked', 'cooks'], answer: 'cooked', why: '“last night” = beeti baat: **cooked**.' },
      { prompt: 'Sahi shabd chuno', q: 'I ___ sick yesterday.', options: ['am', 'was', 'were'], answer: 'was', why: '“am” ka past **was**.' },
      { prompt: 'Sahi shabd chuno', q: 'They ___ at home last Sunday.', options: ['was', 'were'], answer: 'were', why: '“They” ke saath **were**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I was went to Delhi.', 'I went to Delhi.'], answer: 'I went to Delhi.', why: 'Simple past mein **ek hi verb**. “was went” galat.' },
      { prompt: 'Sahi shabd chuno', q: 'We ___ pizza last night.', options: ['eated', 'ate', 'eat'], answer: 'ate', why: '“eat” ka past **ate**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I came here before two years.', 'I came here two years ago.'], answer: 'I came here two years ago.', why: 'Aaj se kitna pehle: **time + ago**.' },
      { prompt: 'Sahi shabd chuno', q: 'He ___ me a story.', options: ['said', 'told'], answer: 'told', why: 'Insaan (me) ke saath **told**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I visited to my uncle.', 'I visited my uncle.'], answer: 'I visited my uncle.', why: '“visit” ke baad **“to” nahi**.' },
      { prompt: 'Sahi shabd chuno', q: 'I ___ a new phone last week.', options: ['buyed', 'bought', 'buy'], answer: 'bought', why: '“buy” ka past **bought**.' }
    ]
  },

  speak: [
    'Yesterday I went to the market.',
    'We ate dinner together.',
    'I was very tired last night.'
  ],

  write: {
    intro: 'Kal aur pichhle hafte ke baare mein 3 sentence likho.',
    items: [
      { label: 'Yesterday I …', placeholder: 'Jaise: Yesterday I went to the market.', pattern: '\\byesterday i (went|came|ate|saw|met|bought|had|was|did|made|got|took|told|said|forgot|slept|woke|drank|wrote|read|ran|[a-z]+ed)\\b', ok: '“Yesterday” ke saath **past verb**. Sahi!', fix: '“Yesterday” ke saath verb ka **past roop**: went, ate, played, watched …' },
      { label: 'I was …', placeholder: 'Jaise: I was very tired.', pattern: '\\bi was [a-z]+', ok: '“I” ke past mein **was**. Sahi!', fix: '“am” ka past **was** hai. Likho: I was …' },
      { label: 'Last week my friend …', placeholder: 'Jaise: Last week my friend visited me.', pattern: '\\blast week my [a-z]+ (went|came|ate|saw|met|bought|had|was|did|made|got|took|told|said|forgot|[a-z]+ed)\\b', ok: 'Past mein **-s nahi**, sirf past roop. Sahi!', fix: '“Last week” ke saath past verb: Last week my friend **visited** / **came** …' }
    ]
  }
};

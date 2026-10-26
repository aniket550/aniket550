// Day 6 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[6] = {
  day: 6,
  week: 1,
  title: 'Past Practice',
  subtitle: 'Kal aur pichhle hafte ki baat',
  minutes: 30,
  next: { day: 7, title: 'Present Continuous' },

  reading: {
    title: 'Neha\'s Week',
    lines: [
      { en: 'Last week was very busy for Neha.', hi: 'Pichhla hafta Neha ke liye bahut vyast tha.' },
      { en: 'On Monday, she started a new job in Pune.', hi: 'Somvaar ko usne Pune mein nayi naukri shuru ki.' },
      { en: 'She did not know anyone, but she made two friends on Tuesday.', hi: 'Woh kisi ko nahi jaanti thi, lekin Mangalvaar ko usne do dost banaye.' },
      { en: 'Did she feel lonely? No, she didn\'t. She called her mother every night.', hi: 'Kya use akelapan laga? Nahi. Woh har raat apni maa ko call karti thi.' },
      { en: 'On Saturday, they all went to a cafe and had a great time.', hi: 'Shanivaar ko woh sab ek cafe gaye aur bahut maza kiya.' }
    ],
    grammarWords: ['did', 'didn\'t', 'not', 'was', 'started', 'made', 'called', 'went', 'had'],
    vocabWords: ['Last week', 'On Monday', 'On Saturday', 'feel', 'made', 'had'],
    questions: [
      { q: 'Neha ne Somvaar ko kya kiya?', a: 'Pune mein nayi naukri shuru ki.' },
      { q: 'Kya Neha ko akelapan laga?', a: 'Nahi. Woh har raat maa ko call karti thi.' },
      { q: 'Shanivaar ko woh sab kahan gaye?', a: 'Ek cafe mein.' }
    ]
  },

  words: [
    {
      word: 'last night', ipa: '/læst naɪt/', say: 'लास्ट नाइट', hindi: 'कल रात', meaning: 'kal raat',
      use: { ex: 'I slept late last night.', why: 'Beeti hui raat ke liye **last night**.' },
      dont: { wrong: 'Yesterday night I slept late.', right: 'Last night I slept late.', why: '“Yesterday night” nahi bolte. **Kal raat = last night**. (Kal subah = yesterday morning.)' },
      tags: ['Ghar', 'Dost']
    },
    {
      word: 'last week', ipa: '/læst wiːk/', say: 'लास्ट वीक', hindi: 'पिछला हफ़्ता', meaning: 'pichhla hafta',
      use: { ex: 'I met her last week.', why: 'Beeta hua hafta, isliye past verb (met).' },
      dont: { wrong: 'I met her before one week.', right: 'I met her a week ago.', why: 'Hindi “ek hafta pehle” = **a week ago**. “ago” time ke baad aata hai.' },
      tags: ['Dost', 'Office']
    },
    {
      word: 'on Monday', ipa: '/ɑːn ˈmʌndeɪ/', say: 'ऑन मंडे', hindi: 'सोमवार को', meaning: 'Somvaar ko',
      use: { ex: 'I joined on Monday.', why: 'Hafte ke **dinon** ke saath **on**.' },
      dont: { wrong: 'I joined in Monday.', right: 'I joined on Monday.', why: 'Din ke saath **on**, mahine ke saath in (in May), time ke saath at (at 5).' },
      tags: ['Office', 'Class']
    },
    {
      word: 'then', ipa: '/ðen/', say: 'देन', hindi: 'फिर', meaning: 'phir',
      use: { ex: 'I had breakfast, then I left.', why: 'Ek kaam ke **baad** doosra kaam.' },
      dont: { wrong: 'Then after that I left.', right: 'After that, I left.', why: '“then” aur “after that” ka matlab **ek hi** hai. Dono saath mat lagao.' },
      tags: ['Kahani']
    },
    {
      word: 'before', ipa: '/bɪˈfɔːr/', say: 'बिफ़ोर', hindi: 'से पहले', meaning: 'se pehle',
      use: { ex: 'I washed my hands before dinner.', why: 'Kisi **ghatna se pehle**: before + cheez.' },
      dont: { wrong: 'I came before two days.', right: 'I came two days ago.', why: 'Aaj se kitna pehle → **ago**. “before” kisi ghatna se pehle (before dinner).' },
      tags: ['Kahani', 'Ghar']
    },
    {
      word: 'did', ipa: '/dɪd/', say: 'डिड', hindi: '(भूतकाल का सहायक)', meaning: 'past ka helper (kya … kiya?)',
      use: { ex: 'Did you eat?', why: 'Past ka sawaal: **Did** + subject + saada verb.' },
      dont: { wrong: 'Did you went?', right: 'Did you go?', why: '“did” ne past bata diya, isliye verb **saada** (go).' },
      tags: ['Dost', 'Ghar']
    },
    {
      word: 'didn\'t', ipa: '/ˈdɪdnt/', say: 'डिडन्ट', hindi: 'नहीं किया', meaning: 'nahi kiya',
      use: { ex: 'I didn\'t see him.', why: 'Past ka “nahi”: **didn\'t** + saada verb.' },
      dont: { wrong: 'I didn\'t saw him.', right: 'I didn\'t see him.', why: 'Past **ek hi baar** lagta hai. didn\'t ne le liya, isliye see.' },
      tags: ['Office', 'Dost']
    },
    {
      word: 'made', ipa: '/meɪd/', say: 'मेड', hindi: 'बनाया', meaning: 'banaya · make ka past',
      use: { ex: 'She made tea for us.', why: '“make” ka past **made**.' },
      dont: { wrong: 'I did a mistake.', right: 'I made a mistake.', why: 'Galti **“make”** hoti hai, “do” nahi. (Aisi jodiyan Day 26 mein.)' },
      tags: ['Ghar', 'Office']
    },
    {
      word: 'had', ipa: '/hæd/', say: 'हैड', hindi: 'था / खाया', meaning: 'tha / khaaya · have ka past',
      use: { ex: 'We had lunch at 2.', why: '“have” ka past **had**: khana, bimari, cheez sab ke liye.' },
      dont: { wrong: 'I was having a car.', right: 'I had a car.', why: 'Kisi cheez ka **paas hona** simple past mein: I had.' },
      tags: ['Khana', 'Doctor']
    },
    {
      word: 'took', ipa: '/tʊk/', say: 'टुक', hindi: 'लिया', meaning: 'liya · take ka past',
      use: { ex: 'I took a taxi to the station.', why: '“take” ka past **took**.' },
      dont: { wrong: 'I taked a taxi.', right: 'I took a taxi.', why: 'Irregular verb: **take → took**.' },
      tags: ['Travel']
    },
    {
      word: 'got', ipa: '/ɡɑːt/', say: 'गॉट', hindi: 'मिला', meaning: 'mila / pahuncha · get ka past',
      use: { ex: 'I got a message from her.', why: '“get” ka past **got**.' },
      dont: { wrong: 'I getted a message.', right: 'I got a message.', why: 'Irregular verb: **get → got**.' },
      tags: ['Phone', 'Office']
    },
    {
      word: 'felt', ipa: '/felt/', say: 'फ़ेल्ट', hindi: 'महसूस किया', meaning: 'mehsoos kiya · feel ka past',
      use: { ex: 'I felt happy.', why: '“feel” ke baad **haalat** (happy, tired) aati hai.' },
      dont: { wrong: 'I felt very happily.', right: 'I felt very happy.', why: '“feel” ke baad **adjective** (happy), “happily” nahi.' },
      tags: ['Dost', 'Doctor']
    },
    {
      word: 'thought', ipa: '/θɔːt/', say: 'थॉट', hindi: 'सोचा', meaning: 'socha · think ka past',
      use: { ex: 'I thought you were busy.', why: '“think” ka past **thought**.' },
      dont: { wrong: 'I thinked about it.', right: 'I thought about it.', why: 'Irregular verb: **think → thought**.' },
      tags: ['Dost', 'Office']
    },
    {
      word: 'lost', ipa: '/lɔːst/', say: 'लॉस्ट', hindi: 'खो दिया / हार गए', meaning: 'kho diya / haar gaye · lose ka past',
      use: { ex: 'I lost my keys.', why: '“lose” ka past **lost**.' },
      dont: { wrong: 'We loosed the match.', right: 'We lost the match.', why: 'Irregular verb: **lose → lost**.' },
      note: '**lose** (लूज़) = khona. **loose** (लूस) = dheela. Dono alag shabd hain.',
      tags: ['Khel', 'Ghar']
    },
    {
      word: 'spent', ipa: '/spent/', say: 'स्पेंट', hindi: 'ख़र्च किया / बिताया', meaning: 'kharch kiya / bitaya · spend ka past',
      use: { ex: 'I spent 500 rupees on books.', why: 'Paise kis cheez par → **spend on**.' },
      dont: { wrong: 'I spended the whole day at home.', right: 'I spent the whole day at home.', why: 'Irregular verb: **spend → spent**.' },
      tags: ['Dukaan', 'Ghar']
    }
  ],

  grammar: {
    what: 'Past ka “nahi” aur “kya” banane ke liye **did** lagta hai, bilkul Day 4 ke do / does jaisa. **Did ke saath verb hamesha saada** (go, eat, see).',
    formula: ['Subject', 'did not / didn\'t', 'verb (saada)'],
    pairs: [
      { hi: 'Main', hiVerb: 'nahi gaya', en: 'I', enVerb: 'didn\'t go' },
      { hi: 'Usne', hiVerb: 'nahi khaaya', en: 'She', enVerb: 'didn\'t eat' },
      { hi: 'Kya tum', hiVerb: 'gaye?', en: '', enVerb: 'Did you go?' },
      { hi: 'Kya usne', hiVerb: 'dekha?', en: '', enVerb: 'Did he see?' }
    ],
    rules: [
      {
        title: 'Negative: didn\'t + saada verb',
        wrong: 'I didn\'t went.', right: ['I didn\'t go.', 'She didn\'t eat.'],
        why: '“did” mein past **aa chuka** hai. Ek sentence mein past ek hi baar, isliye verb saada.'
      },
      {
        title: 'Sawaal: Did shuru mein',
        wrong: 'You went to school?', right: ['Did you go to school?', 'Did she call you?'],
        why: 'Hindi ka **“kya”** = English ka **“Did”** (past mein). Phir verb saada.'
      },
      {
        title: 'What / Where + did',
        wrong: 'Where you went yesterday?', right: ['Where did you go yesterday?', 'What did you eat?'],
        why: 'WH shabd ke baad **did**, phir subject, phir saada verb. Day 4 jaisa, bas do ki jagah did.'
      },
      {
        title: 'was / were ke saath did nahi',
        wrong: 'I didn\'t was at home.', right: ['I wasn\'t at home.', 'Were you at home?'],
        why: 'was / were **khud helper** hain. Unke saath not lagao ya unhe aage karo, bilkul Day 2 jaisa.'
      },
      {
        title: 'Chhota jawab',
        right: ['Did you eat? Yes, I did.', 'Did he call? No, he didn\'t.'],
        why: 'Chhote jawab mein **did / didn\'t dohraate** hain. Yeh sabse natural lagta hai.'
      },
      {
        title: 'Kahani ka kram',
        wrong: 'Then after that I left.', right: ['First I woke up, then I had tea. After that, I left.'],
        why: '**First → then → after that** se kahani saaf lagti hai. Ek jagah ek hi jodne wala shabd.'
      }
    ]
  },

  models: [
    { situation: 'Office mein', en: 'Sorry, I didn\'t see your message.', why: '**didn\'t + see**, “didn\'t saw” nahi.' },
    { situation: 'Dost se', en: 'Did you watch the match last night?', why: 'Past ka sawaal: **Did** + you + watch.' },
    { situation: 'Interview mein', en: 'I finished my graduation in 2023.', why: 'Beeta saal, isliye **simple past**.' },
    { situation: 'Ghar pe', en: 'Mom, I didn\'t eat lunch today.', why: 'Lunch ka waqt beet gaya: **didn\'t eat**.' },
    { situation: 'Doctor ke paas', en: 'I didn\'t sleep well last night.', why: '**last night** + didn\'t + saada verb.' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'I didn\'t ___ him yesterday.', options: ['see', 'saw', 'seen'], answer: 'see', why: '**didn\'t** ke baad verb saada.' },
      { prompt: 'Sahi shabd chuno', q: '___ you go to school yesterday?', options: ['Do', 'Did', 'Were'], answer: 'Did', why: 'Past ka sawaal, “go” kaam wala verb: **Did**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Where you went?', 'Where did you go?'], answer: 'Where did you go?', why: 'WH + **did** + you + saada verb.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Yesterday night I slept late.', 'Last night I slept late.'], answer: 'Last night I slept late.', why: 'Kal raat = **last night**.' },
      { prompt: 'Sahi shabd chuno', q: 'I ___ at home yesterday.', options: ['didn\'t', 'wasn\'t'], answer: 'wasn\'t', why: '“at home” haalat hai, koi kaam nahi: **was + not**.' },
      { prompt: 'Sahi shabd chuno', q: 'She ___ a cake for my birthday.', options: ['maked', 'made', 'make'], answer: 'made', why: '“make” ka past **made**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I did a mistake.', 'I made a mistake.'], answer: 'I made a mistake.', why: 'Galti **make** hoti hai.' },
      { prompt: 'Sahi shabd chuno', q: 'We ___ the match.', options: ['loosed', 'lost', 'lose'], answer: 'lost', why: '“lose” ka past **lost**.' },
      { prompt: 'Sahi shabd chuno', q: 'I joined ___ Monday.', options: ['in', 'on', 'at'], answer: 'on', why: 'Din ke saath **on**.' },
      { prompt: 'Sahi shabd chuno', q: 'Did she ___ you?', options: ['called', 'call', 'calls'], answer: 'call', why: '**Did** ke baad verb saada.' }
    ]
  },

  speak: [
    'I didn\'t go to school yesterday.',
    'Did you watch the match last night?',
    'Last week I made two new friends.'
  ],

  write: {
    intro: 'Pichhle hafte ke baare mein likho: kya kiya, kya nahi kiya, aur ek sawaal.',
    items: [
      { label: 'Last week I …', placeholder: 'Jaise: Last week I visited my uncle.', pattern: '\\blast week i (went|came|ate|saw|met|bought|had|was|did|made|got|took|told|said|felt|lost|spent|thought|[a-z]+ed)\\b', ok: '“Last week” ke saath **past verb**. Sahi!', fix: '“Last week” ke saath verb ka **past roop**: went, made, visited …' },
      { label: 'I didn\'t …', placeholder: 'Jaise: I didn\'t watch TV.', pattern: '\\bi (didn\'t|did not) (?!went\\b|came\\b|ate\\b|saw\\b|met\\b|bought\\b|had\\b|made\\b|got\\b|took\\b|[a-z]*[^e]ed\\b)[a-z]+', ok: '**didn\'t + saada verb**. Bilkul sahi!', fix: '**didn\'t** ke baad verb **saada** rakho: I didn\'t go (went nahi), I didn\'t watch (watched nahi).' },
      { label: 'Did you … ?', placeholder: 'Jaise: Did you see the match?', pattern: '\\bdid (you|he|she|they|we|your [a-z]+) (?!went\\b|came\\b|ate\\b|saw\\b|met\\b|bought\\b|had\\b|made\\b|got\\b|took\\b|[a-z]*[^e]ed\\b)[a-z]+', ok: 'Sawaal **Did** se, aur verb saada. Sahi!', fix: 'Sawaal **Did** se shuru karo aur verb saada rakho: Did you **go** …?' }
    ]
  }
};

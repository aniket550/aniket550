// Day 4 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[4] = {
  day: 4,
  week: 1,
  title: 'Simple Present',
  subtitle: 'Haan, nahi aur sawaal',
  minutes: 30,
  next: { day: 5, title: 'Simple Past' },

  reading: {
    title: 'Aman from Jaipur',
    lines: [
      { en: 'Aman lives in Jaipur. He works in a shop.', hi: 'Aman Jaipur mein rehta hai. Woh ek dukaan mein kaam karta hai.' },
      { en: 'He does not drink tea, but he likes coffee.', hi: 'Woh chai nahi peeta, lekin use coffee pasand hai.' },
      { en: 'His friends do not live in Jaipur.', hi: 'Uske dost Jaipur mein nahi rehte.' },
      { en: 'Do you know Aman? Does he speak English?', hi: 'Kya tum Aman ko jaante ho? Kya woh English bolta hai?' },
      { en: 'Yes, he does. He practices every day, so he speaks well.', hi: 'Haan. Woh roz practice karta hai, isliye achhi bolta hai.' }
    ],
    grammarWords: ['do', 'does', 'not'],
    vocabWords: ['lives', 'likes', 'know', 'speak', 'speaks', 'drink'],
    questions: [
      { q: 'Aman kya kaam karta hai?', a: 'Woh ek dukaan mein kaam karta hai.' },
      { q: 'Aman ko kya pasand hai, chai ya coffee?', a: 'Coffee. Woh chai nahi peeta.' },
      { q: 'Aman achhi English kyun bolta hai?', a: 'Kyunki woh roz practice karta hai.' }
    ]
  },

  words: [
    {
      word: 'live', ipa: '/lɪv/', say: 'लिव', hindi: 'रहना', meaning: 'rehna',
      use: { ex: 'I live in Patna.', why: 'Kahan rehte ho, yeh **pakki baat** hai, isliye simple present.' },
      dont: { wrong: 'Where you live?', right: 'Where do you live?', why: 'Sawaal mein **“do”** lagta hai. Bina “do” ke sentence adhoora hai.' },
      tags: ['Pehli mulaqaat']
    },
    {
      word: 'like', ipa: '/laɪk/', say: 'लाइक', hindi: 'पसंद करना', meaning: 'pasand hona',
      use: { ex: 'I like mangoes.', why: 'Pasand ek **pakki baat** hai, roz badalti nahi.' },
      dont: { wrong: 'I am liking this song.', right: 'I like this song.', why: 'Like, love, know, want jaise **mann ke verbs** ke saath -ing nahi lagate.' },
      tags: ['Dost', 'Khana']
    },
    {
      word: 'want', ipa: '/wɑːnt/', say: 'वॉन्ट', hindi: 'चाहना', meaning: 'chahna',
      use: { ex: 'I want a glass of water.', why: 'Abhi ki **ichha** bhi simple present mein: I want.' },
      dont: { wrong: 'She want a new phone.', right: 'She wants a new phone.', why: '“She” ke saath verb + **s**: wants.' },
      tags: ['Dukaan', 'Ghar']
    },
    {
      word: 'need', ipa: '/niːd/', say: 'नीड', hindi: 'ज़रूरत होना', meaning: 'zaroorat hona',
      use: { ex: 'I need your help.', why: 'Zaroorat batane ke liye **need + cheez**.' },
      dont: { wrong: 'I don\'t need of money.', right: 'I don\'t need money.', why: '“need” ke baad **“of” nahi**. Hindi “paise **ki** zaroorat” se “of” aa jaata hai.' },
      tags: ['Office', 'Dukaan']
    },
    {
      word: 'know', ipa: '/noʊ/', say: 'नो', hindi: 'जानना', meaning: 'jaanna',
      use: { ex: 'I know him.', why: 'Jaanna ek **haalat** hai, isliye simple present.' },
      dont: { wrong: 'Do you know to swim?', right: 'Do you know how to swim?', why: 'Koi kaam **karna aata hai**, yeh batane ke liye “know **how to**”.' },
      tags: ['Dost']
    },
    {
      word: 'understand', ipa: '/ˌʌndərˈstænd/', say: 'अंडरस्टैंड', hindi: 'समझना', meaning: 'samajhna',
      use: { ex: 'I understand English.', why: 'Samajhna bhi **mann ka verb** hai: simple present.' },
      dont: { wrong: 'I am not understanding.', right: 'I don\'t understand.', why: 'Mann ka verb, isliye **-ing nahi**. “Nahi” ke liye **don\'t**.' },
      tags: ['Class', 'Office']
    },
    {
      word: 'speak', ipa: '/spiːk/', say: 'स्पीक', hindi: 'बोलना', meaning: 'bolna (bhasha)',
      use: { ex: 'She speaks three languages.', why: '“She” ke saath verb + **s**: speaks.' },
      dont: { wrong: 'He speaks English very good.', right: 'He speaks English very well.', why: 'Kaam **kaisa** hua, woh **“well”** batata hai. “Good” cheez ke saath: a good book.' },
      tags: ['Interview', 'Class']
    },
    {
      word: 'drink', ipa: '/drɪŋk/', say: 'ड्रिंक', hindi: 'पीना', meaning: 'peena',
      use: { ex: 'I drink tea every morning.', why: 'Roz ki aadat: simple present.' },
      dont: { wrong: 'He doesn\'t drinks tea.', right: 'He doesn\'t drink tea.', why: '**does** mein pehle se “s” hai, isliye verb **saada** rehta hai.' },
      tags: ['Ghar', 'Restaurant']
    },
    {
      word: 'eat', ipa: '/iːt/', say: 'ईट', hindi: 'खाना', meaning: 'khaana',
      use: { ex: 'We eat dinner at 9.', why: '“We” ke saath verb saada.' },
      dont: { wrong: 'Do she eat meat?', right: 'Does she eat meat?', why: 'He / she ke sawaal mein **“Does”**.' },
      tags: ['Khana', 'Restaurant']
    },
    {
      word: 'buy', ipa: '/baɪ/', say: 'बाय', hindi: 'ख़रीदना', meaning: 'khareedna',
      use: { ex: 'I buy vegetables on Sunday.', why: 'Har hafte ka kaam: simple present.' },
      dont: { wrong: 'I buy it in 100 rupees.', right: 'I buy it for 100 rupees.', why: 'Daam (kitne mein) ke saath **“for”** lagta hai.' },
      tags: ['Dukaan']
    },
    {
      word: 'pay', ipa: '/peɪ/', say: 'पे', hindi: 'भुगतान करना', meaning: 'paise dena',
      use: { ex: 'I pay the bill online.', why: 'Pay + **kya** (the bill) ya pay + **kisko**.' },
      dont: { wrong: 'I pay to him.', right: 'I pay him.', why: '“pay” ke baad insaan **seedha** aata hai, “to” nahi.' },
      tags: ['Dukaan', 'Office']
    },
    {
      word: 'open', ipa: '/ˈoʊpən/', say: 'ओपन', hindi: 'खोलना', meaning: 'kholna / khulna',
      use: { ex: 'The shop opens at 9.', why: '“The shop” = it, isliye **opens**.' },
      dont: { wrong: 'Please open the light.', right: 'Please turn on the light.', why: 'Light, fan, TV **“turn on”** kiye jaate hain. Hindi “light khol do” se yeh galti hoti hai.' },
      tags: ['Ghar', 'Dukaan']
    },
    {
      word: 'close', ipa: '/kloʊz/', say: 'क्लोज़', hindi: 'बंद करना', meaning: 'band karna',
      use: { ex: 'Please close the door.', why: 'Darwaza, khidki, kitaab **close** hoti hai.' },
      dont: { wrong: 'Close the fan.', right: 'Turn off the fan.', why: 'Machine ya light band karne ke liye **“turn off”**.' },
      tags: ['Ghar', 'Office']
    },
    {
      word: 'help', ipa: '/help/', say: 'हेल्प', hindi: 'मदद करना', meaning: 'madad karna',
      use: { ex: 'My brother helps me with maths.', why: '“My brother” = he: **helps**. Kis kaam mein → **with**.' },
      dont: { wrong: 'Help me in my homework.', right: 'Help me with my homework.', why: 'Kisi kaam mein madad = **help with**, “in” nahi.' },
      tags: ['Ghar', 'Padhai']
    },
    {
      word: 'watch', ipa: '/wɑːtʃ/', say: 'वॉच', hindi: 'ध्यान से देखना', meaning: 'dhyan se dekhna',
      use: { ex: 'We watch TV at night.', why: 'TV, match, movie **dhyan se** dekhte hain: watch.' },
      dont: { wrong: 'I see TV every night.', right: 'I watch TV every night.', why: '“see” = bas aankh se dikh jaana. Dhyan se dekhna = **“watch”**.' },
      tags: ['Ghar', 'Dost']
    }
  ],

  grammar: {
    what: 'Simple Present ke **3 roop**: haan, nahi aur sawaal. “Nahi” aur “sawaal” banane ke liye **do / does** ka sahara lagta hai.',
    formula: ['Subject', 'do / does + not', 'verb (saada)'],
    pairs: [
      { hi: 'Main chai', hiVerb: 'nahi peeta', en: 'I', enVerb: 'don\'t drink' },
      { hi: 'Woh chai', hiVerb: 'nahi peeta', en: 'He', enVerb: 'doesn\'t drink' },
      { hi: 'Kya tum', hiVerb: 'bolte ho?', en: '', enVerb: 'Do you speak?' },
      { hi: 'Kya woh', hiVerb: 'bolti hai?', en: '', enVerb: 'Does she speak?' }
    ],
    rules: [
      {
        title: 'Negative: do not / does not',
        wrong: 'I not like tea.', right: ['I do not like tea.', 'I don\'t like tea.'],
        why: 'English mein “not” verb ke saath **akela nahi** lagta, use “do” ka sahara chahiye. Hindi mein “nahi” seedha lagta hai, isliye yeh galti hoti hai.'
      },
      {
        title: 'He / She / It ke saath does',
        wrong: 'She don\'t eat meat.', right: ['She doesn\'t eat meat.'],
        why: 'He / she ke saath “do” ka roop **“does”** hai, bilkul go → goes jaisa.'
      },
      {
        title: 'does ke baad verb saada',
        wrong: 'He doesn\'t drinks tea.', right: ['He doesn\'t drink tea.', 'Does he drink tea?'],
        why: '“s” sentence mein **ek hi baar** lagta hai. “does” ne le liya, isliye verb bina s ke.'
      },
      {
        title: 'Sawaal: Do / Does shuru mein',
        wrong: 'You speak English?', right: ['Do you speak English?', 'Does he live here?'],
        why: 'Hindi ka **“kya”** = English ka **“Do / Does”**. Pehle shabd se hi pata chal jaata hai ki sawaal hai.'
      },
      {
        title: 'What / Where ke baad bhi do / does',
        wrong: 'Where you live?', right: ['Where do you live?', 'What does he do?'],
        why: 'WH shabd ke baad bhi **do / does** zaroori hai: WH + do / does + subject + verb.'
      },
      {
        title: 'am / is / are wale sentence mein do nahi',
        wrong: 'Do you are happy?', right: ['Are you happy?', 'Is she a teacher?'],
        why: 'Jahan am / is / are hai, wahan sawaal **unhi ko aage** la kar banta hai (Day 2). Do / does sirf **kaam wale verb** ke saath.'
      }
    ]
  },

  models: [
    { situation: 'Dukaan pe', en: 'Do you have this in blue?', why: '“have” kaam wala verb hai, isliye sawaal mein **Do**.' },
    { situation: 'Pehli mulaqaat', en: 'Where do you live?', why: 'WH + **do** + you + verb.' },
    { situation: 'Office mein', en: 'Sorry, I don\'t understand. Can you say that again?', why: 'Politely na samajhna: **I don\'t understand**, “I am not understanding” nahi.' },
    { situation: 'Doctor ke paas', en: 'Does it hurt here?', why: '“it” = teesra, isliye **Does**.' },
    { situation: 'Dost se', en: 'My brother doesn\'t like spicy food.', why: '“My brother” = he: **doesn\'t** + saada verb (like).' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'She ___ like coffee.', options: ['don\'t', 'doesn\'t', 'not'], answer: 'doesn\'t', why: '“She” ke saath **doesn\'t**.' },
      { prompt: 'Sahi shabd chuno', q: '___ you speak English?', options: ['Do', 'Does', 'Are'], answer: 'Do', why: '“you” ke saath sawaal **Do** se. “speak” kaam wala verb hai, isliye “Are” nahi.' },
      { prompt: 'Sahi shabd chuno', q: 'He doesn\'t ___ tea.', options: ['drink', 'drinks', 'drinking'], answer: 'drink', why: '**does** ke baad verb saada.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Where you live?', 'Where do you live?'], answer: 'Where do you live?', why: 'WH ke baad bhi **do** zaroori.' },
      { prompt: 'Sahi shabd chuno', q: '___ your father work in a bank?', options: ['Do', 'Does', 'Is'], answer: 'Does', why: '“your father” = he, isliye **Does**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am not understanding.', 'I don\'t understand.'], answer: 'I don\'t understand.', why: '“understand” mann ka verb hai: **-ing nahi**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Do you are happy?', 'Are you happy?'], answer: 'Are you happy?', why: 'am / is / are wale sentence mein **do nahi** lagta.' },
      { prompt: 'Sahi shabd chuno', q: 'They ___ live in Delhi.', options: ['doesn\'t', 'don\'t'], answer: 'don\'t', why: '“They” ke saath **don\'t**. Doesn\'t sirf he / she / it ke saath.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Please open the light.', 'Please turn on the light.'], answer: 'Please turn on the light.', why: 'Light **turn on** hoti hai, open nahi.' },
      { prompt: 'Sahi shabd chuno', q: 'He speaks English very ___.', options: ['good', 'well'], answer: 'well', why: 'Kaam kaisa hua → **well**.' }
    ]
  },

  speak: [
    'I don\'t drink tea.',
    'Does she speak English?',
    'Where do you live?'
  ],

  write: {
    intro: 'Apne baare mein likho: ek haan, ek nahi, aur ek sawaal.',
    items: [
      { label: 'I like …', placeholder: 'Jaise: I like cricket.', pattern: '\\bi like [a-z]+', ok: 'Pasand ke liye **I like**, sahi!', fix: 'Likho: **I like** + cheez. “I am liking” nahi.' },
      { label: 'I don\'t …', placeholder: 'Jaise: I don\'t drink tea.', pattern: '\\bi (don\'t|do not) (?![a-z]+ing\\b)[a-z]+', ok: '**don\'t + saada verb**, bilkul sahi!', fix: '“Nahi” ke liye **I don\'t** + saada verb: I don\'t drink tea.' },
      { label: 'Do you … ?', placeholder: 'Jaise: Do you play cricket?', pattern: '\\b(do|does) (you|he|she|they|we|it|your [a-z]+) (?![a-z]+ing\\b)[a-z]+', ok: 'Sawaal **Do / Does** se, sahi!', fix: 'Sawaal **Do / Does** se shuru karo: Do you play …? Does she like …?' }
    ]
  }
};

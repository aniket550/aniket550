// Day 7 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[7] = {
  day: 7,
  week: 1,
  title: 'Present Continuous',
  subtitle: 'Abhi chal raha kaam',
  minutes: 30,
  next: { day: 8, title: 'Past Continuous' },

  reading: {
    title: 'Sunday Morning',
    lines: [
      { en: 'It is Sunday morning, and everyone at home is busy.', hi: 'Sunday ki subah hai, aur ghar mein sab vyast hain.' },
      { en: 'My father is reading the newspaper.', hi: 'Papa akhbaar padh rahe hain.' },
      { en: 'My mother is cooking, and my sister is helping her.', hi: 'Mummy khana bana rahi hain, aur behen unki madad kar rahi hai.' },
      { en: 'My little brother is playing a game on his phone.', hi: 'Chhota bhai phone pe game khel raha hai.' },
      { en: 'And what am I doing? I am writing in English!', hi: 'Aur main kya kar raha hoon? Main English mein likh raha hoon!' }
    ],
    grammarWords: ['is', 'am', 'reading', 'cooking', 'helping', 'playing', 'doing', 'writing'],
    vocabWords: ['newspaper', 'game'],
    questions: [
      { q: 'Papa kya kar rahe hain?', a: 'Akhbaar padh rahe hain.' },
      { q: 'Mummy ki madad kaun kar raha hai?', a: 'Behen.' },
      { q: 'Likhne wala kya kar raha hai?', a: 'English mein likh raha hai.' }
    ]
  },

  words: [
    {
      word: 'now', ipa: '/naʊ/', say: 'नाउ', hindi: 'अभी', meaning: 'abhi',
      use: { ex: 'I am eating now.', why: 'Abhi chal raha kaam: **am + verb-ing**.' },
      dont: { wrong: 'I eat now.', right: 'I am eating now.', why: '“Abhi kha raha hoon” ke matlab mein **continuous** chahiye. “I eat” roz ki aadat hai.' },
      tags: ['Phone call', 'Ghar']
    },
    {
      word: 'at the moment', ipa: '/æt ðə ˈmoʊmənt/', say: 'ऐट द मोमेंट', hindi: 'इस समय', meaning: 'is waqt',
      use: { ex: 'She is sleeping at the moment.', why: '**Is waqt** ho raha kaam.' },
      dont: { wrong: 'She sleeps at the moment.', right: 'She is sleeping at the moment.', why: '“at the moment” ke saath **is + sleeping**.' },
      tags: ['Office', 'Phone call']
    },
    {
      word: 'these days', ipa: '/ðiːz deɪz/', say: 'दीज़ डेज़', hindi: 'आजकल', meaning: 'aajkal',
      use: { ex: 'I am learning English these days.', why: 'Kuch dino se **chal raha** kaam, abhi khatam nahi hua.' },
      dont: { wrong: 'These days I am go to the gym.', right: 'These days I am going to the gym.', why: '“am” ke saath verb mein **-ing zaroori** hai.' },
      tags: ['Dost', 'Interview']
    },
    {
      word: 'look', ipa: '/lʊk/', say: 'लुक', hindi: 'देखो', meaning: 'dekho',
      use: { ex: 'Look! It is raining.', why: 'Kisi cheez ki taraf **dhyan dilana**. Uske baad aksar continuous aata hai.' },
      dont: { wrong: 'Look this.', right: 'Look at this.', why: 'Kisi cheez ko dekhna = **look at**.' },
      tags: ['Bahar', 'Dost']
    },
    {
      word: 'listen', ipa: '/ˈlɪsən/', say: 'लिसन', hindi: 'सुनो', meaning: 'suno',
      use: { ex: 'Listen! Someone is singing.', why: 'Kisi **awaaz** ki taraf dhyan dilana.' },
      dont: { wrong: 'Listen me.', right: 'Listen to me.', why: 'Kisi ko sunna = **listen to**.' },
      tags: ['Class', 'Ghar']
    },
    {
      word: 'wait', ipa: '/weɪt/', say: 'वेट', hindi: 'इंतज़ार करना', meaning: 'intezaar karna',
      use: { ex: 'I am waiting for the bus.', why: 'Abhi chal raha kaam: **am waiting**.' },
      dont: { wrong: 'I am waiting the bus.', right: 'I am waiting for the bus.', why: 'Kisi ka intezaar = **wait for**.' },
      tags: ['Bahar', 'Phone call']
    },
    {
      word: 'wear', ipa: '/wer/', say: 'वेयर', hindi: 'पहनना', meaning: 'pehne hue hona',
      use: { ex: 'She is wearing a red saree.', why: 'Abhi pehne hue hai: **is wearing**.' },
      dont: { wrong: 'She is putting a red saree.', right: 'She is wearing a red saree.', why: 'Pehne hue hona = **wear**. “Put on” pehenne ka kaam hai (put on your shoes).' },
      tags: ['Shaadi', 'Dost']
    },
    {
      word: 'sit', ipa: '/sɪt/', say: 'सिट', hindi: 'बैठना', meaning: 'baithna',
      use: { ex: 'He is sitting next to me.', why: 'sit → **sitting** (t double).' },
      dont: { wrong: 'He is siting.', right: 'He is sitting.', why: 'Chhote verb jo **consonant-vowel-consonant** pe khatam hon (s-i-t), unka aakhri akshar double hota hai.' },
      tags: ['Class', 'Office']
    },
    {
      word: 'run', ipa: '/rʌn/', say: 'रन', hindi: 'दौड़ना', meaning: 'daudna',
      use: { ex: 'The children are running in the park.', why: '“children” = bahut log: **are running**.' },
      dont: { wrong: 'They are runing.', right: 'They are running.', why: 'r-u-n: consonant-vowel-consonant, isliye **n double**.' },
      tags: ['Bahar', 'Khel']
    },
    {
      word: 'write', ipa: '/raɪt/', say: 'राइट', hindi: 'लिखना', meaning: 'likhna',
      use: { ex: 'I am writing a letter.', why: 'write → **writing** (e hata ke -ing).' },
      dont: { wrong: 'I am writeing.', right: 'I am writing.', why: 'Aakhir ka **chup “e”** hata ke -ing lagta hai: make → making, come → coming.' },
      tags: ['Padhai', 'Office']
    },
    {
      word: 'rain', ipa: '/reɪn/', say: 'रेन', hindi: 'बारिश होना', meaning: 'baarish hona',
      use: { ex: 'It is raining outside.', why: 'Mausam ke liye **“It”** se shuru karte hain.' },
      dont: { wrong: 'Rain is coming.', right: 'It is raining.', why: '“Baarish aa rahi hai” ka seedha translation galat hai. English mein **“It is raining”**.' },
      tags: ['Bahar', 'Mausam']
    },
    {
      word: 'talk', ipa: '/tɔːk/', say: 'टॉक', hindi: 'बात करना', meaning: 'baat karna',
      use: { ex: 'I am talking to my friend.', why: 'Kisi se baat = **talk to**.' },
      dont: { wrong: 'He is talking on phone.', right: 'He is talking on the phone.', why: '**“on the phone”** ek fixed jodi hai, “the” zaroori.' },
      tags: ['Phone call', 'Office']
    },
    {
      word: 'study', ipa: '/ˈstʌdi/', say: 'स्टडी', hindi: 'पढ़ाई करना', meaning: 'padhna',
      use: { ex: 'She is studying for her exam.', why: 'y wale verb mein y **rehta hai**: studying.' },
      dont: { wrong: 'She is studing.', right: 'She is studying.', why: '-ing lagate waqt **y nahi hatta**. (Sirf -s mein y → ies hota hai.)' },
      tags: ['Padhai']
    },
    {
      word: 'stay', ipa: '/steɪ/', say: 'स्टे', hindi: 'ठहरना', meaning: 'rukna / thehrna',
      use: { ex: 'I am staying with my uncle this week.', why: 'Kuch **samay ke liye** rukna: continuous.' },
      dont: { wrong: 'I am staying in my uncle home.', right: 'I am staying at my uncle\'s house.', why: 'Kisi ke ghar pe = **at + naam\'s house**.' },
      tags: ['Travel', 'Family']
    },
    {
      word: 'love', ipa: '/lʌv/', say: 'लव', hindi: 'बहुत पसंद करना', meaning: 'bahut pasand hona',
      use: { ex: 'I love this song.', why: 'Mann ka verb hai, isliye **simple present**.' },
      dont: { wrong: 'I am loving this song.', right: 'I love this song.', why: 'Love, like, know, want jaise **mann ke verbs** ke saath -ing nahi lagta. (Ads mein “I\'m loving it” hota hai, par roz ki English mein “I love it”.)' },
      tags: ['Dost', 'Music']
    }
  ],

  grammar: {
    what: 'Jo kaam **abhi, is waqt** chal raha hai: “raha hai / rahi hai / rahe hain”. Banane ka tareeka: **am / is / are + verb-ing**.',
    formula: ['Subject', 'am / is / are', 'verb + ing'],
    pairs: [
      { hi: 'Main', hiVerb: 'padh raha hoon', en: 'I', enVerb: 'am reading' },
      { hi: 'Woh', hiVerb: 'khel raha hai', en: 'He', enVerb: 'is playing' },
      { hi: 'Ve', hiVerb: 'so rahe hain', en: 'They', enVerb: 'are sleeping' },
      { hi: 'Tum kya', hiVerb: 'kar rahe ho?', en: 'What', enVerb: 'are you doing?' }
    ],
    rules: [
      {
        title: 'am / is / are + ing: dono zaroori',
        wrong: 'I reading a book.', right: ['I am reading a book.', 'She is cooking.'],
        why: '“-ing” akela kaam nahi karta. **am / is / are** batata hai ki abhi ho raha hai, bilkul Hindi “raha **hoon**” ke “hoon” jaisa.'
      },
      {
        title: 'Abhi vs roz',
        wrong: 'I am going to the gym every day.', right: ['I go to the gym every day. (roz)', 'I am going to the gym now. (abhi)'],
        why: 'Roz ki **aadat** = simple present (Day 3). **Abhi chal raha** kaam = continuous.'
      },
      {
        title: 'Spelling: e hatao, akshar double karo',
        wrong: 'writeing, siting', right: ['write → writing', 'sit → sitting', 'run → running', 'study → studying'],
        why: 'Aakhir ka **chup e** hatao. Chhote verb (consonant-vowel-consonant) ka **aakhri akshar double**. y waise hi rehta hai.'
      },
      {
        title: 'Mann wale verb ke saath -ing nahi',
        wrong: 'I am knowing him.', right: ['I know him.', 'I want water.', 'I like it.'],
        why: 'Jaanna, chahna, pasand karna **kaam nahi, haalat** hain. Inka continuous nahi banta.'
      },
      {
        title: 'Nahi aur sawaal',
        wrong: 'Are you do homework?', right: ['I am not sleeping.', 'Are you doing your homework?', 'What is she cooking?'],
        why: 'Day 2 jaisa: **not** am / is / are ke baad, sawaal mein am / is / are **aage**. Do / does nahi lagta.'
      }
    ]
  },

  models: [
    { situation: 'Phone pe', en: 'I am driving. Can I call you later?', why: 'Abhi ka kaam: **am driving**.' },
    { situation: 'Office mein', en: 'Sir, I am working on the report.', why: 'Is waqt chal raha kaam: **am working**.' },
    { situation: 'Ghar pe', en: 'Mom, I am coming!', why: 'Abhi aa raha hoon: **am coming** (come → coming).' },
    { situation: 'Dost se chat', en: 'What are you doing? I am watching TV.', why: 'Sawaal mein **are aage**, jawab mein am + ing.' },
    { situation: 'Bahar', en: 'Look, it is raining!', why: 'Mausam: **It is raining**, “rain is coming” nahi.' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'She ___ cooking now.', options: ['is', 'are', 'am'], answer: 'is', why: '“She” ke saath **is**.' },
      { prompt: 'Sahi shabd chuno', q: 'I am ___ a letter.', options: ['writeing', 'writing', 'write'], answer: 'writing', why: 'Chup **e hata** ke -ing: writing.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I reading a book.', 'I am reading a book.'], answer: 'I am reading a book.', why: '**am** aur **-ing** dono zaroori.' },
      { prompt: 'Sahi shabd chuno', q: 'They are ___ in the park.', options: ['runing', 'running', 'run'], answer: 'running', why: 'r-u-n: aakhri akshar **double**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am knowing him.', 'I know him.'], answer: 'I know him.', why: '“know” mann ka verb: **-ing nahi**.' },
      { prompt: 'Sahi shabd chuno', q: 'Look! It ___.', options: ['rains', 'is raining'], answer: 'is raining', why: 'Abhi ho raha hai: **is raining**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Are you do homework?', 'Are you doing homework?'], answer: 'Are you doing homework?', why: '**are** ke saath verb + ing.' },
      { prompt: 'Sahi shabd chuno', q: 'I am waiting ___ the bus.', options: ['for', 'to'], answer: 'for', why: 'Intezaar = **wait for**.' },
      { prompt: 'Roz ki aadat ke liye kaunsa sahi hai?', q: '', options: ['I am going to the gym every day.', 'I go to the gym every day.'], answer: 'I go to the gym every day.', why: 'Aadat = **simple present**.' },
      { prompt: 'Sahi shabd chuno', q: 'He is ___ on the phone.', options: ['talk', 'talking', 'talks'], answer: 'talking', why: '**is + talking**.' }
    ]
  },

  speak: [
    'I am learning English now.',
    'My mother is cooking dinner.',
    'What are you doing?'
  ],

  write: {
    intro: 'Is waqt aap aur aapke ghar wale kya kar rahe hain? 3 sentence likho.',
    items: [
      { label: 'I am …ing', placeholder: 'Jaise: I am learning English.', pattern: '\\bi am [a-z]+ing\\b', ok: '**am + verb-ing**. Bilkul sahi!', fix: 'Likho: **I am** + verb**ing**: I am reading, I am learning …' },
      { label: 'My mother / father is …ing', placeholder: 'Jaise: My mother is cooking.', pattern: '\\bmy [a-z]+ is [a-z]+ing\\b', ok: 'He / she ke saath **is + ing**. Sahi!', fix: 'Ek insaan ke saath **is** + verb**ing**: My mother is cooking.' },
      { label: 'They / My friends are …ing', placeholder: 'Jaise: My friends are playing cricket.', pattern: '\\b(they|we|my [a-z]+) are [a-z]+ing\\b', ok: 'Bahut log, isliye **are + ing**. Sahi!', fix: 'Bahut logon ke saath **are** + verb**ing**: They are playing.' }
    ]
  }
};

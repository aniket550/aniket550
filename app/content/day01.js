// Day 1 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[1] = {
  day: 1,
  week: 1,
  title: 'Introduction + Greetings',
  subtitle: 'Apna parichay dena',
  minutes: 30,
  next: { day: 2, title: 'Is / Am / Are' },

  reading: {
    title: 'Hello!',
    lines: [
      { en: 'Good morning! My name is Priya.', hi: 'Good morning! Mera naam Priya hai.' },
      { en: 'I am from Lucknow, and I am a student.', hi: 'Main Lucknow se hoon, aur main ek student hoon.' },
      { en: 'Every day I say hello to my teacher.', hi: 'Main roz apne teacher ko hello bolti hoon.' },
      { en: 'She asks, "How are you?" I say, "I am fine, thank you."', hi: 'Woh poochhti hain, "Aap kaise ho?" Main kehti hoon, "Main theek hoon, shukriya."' },
      { en: 'At night I say, "Good night, Mom!"', hi: 'Raat ko main kehti hoon, "Good night, Mummy!"' }
    ],
    grammarWords: ['am', 'is'],
    vocabWords: ['Good morning', 'name', 'from', 'student', 'hello', 'teacher', 'thank you', 'Good night'],
    questions: [
      { q: 'Priya kahan se hai?', a: 'Lucknow se.' },
      { q: 'Priya kya karti hai?', a: 'Woh student hai.' },
      { q: 'Raat ko Priya kya bolti hai?', a: '"Good night, Mom!"' }
    ]
  },

  words: [
    {
      word: 'hello', ipa: '/həˈloʊ/', say: 'हेलो', meaning: 'namaste, baat shuru karne ka shabd',
      use: { ex: 'Hello, I am Priya.', why: 'Kisi se baat shuru karne ka sabse aam tareeka. Dost, dukaan, phone, **sab jagah** chalta hai.' },
      dont: { wrong: 'Yes, tell. (phone uthate hi)', right: 'Hello, who is speaking?', why: '“Yes, tell” Hindi ke “haan, bolo” ka seedha translation hai. English mein yeh **rude** lagta hai.' },
      tags: ['Phone call', 'Pehli mulaqaat']
    },
    {
      word: 'good morning', ipa: '/ɡʊd ˈmɔːrnɪŋ/', say: 'गुड मॉर्निंग', meaning: 'subah ka namaste',
      use: { ex: 'Good morning, ma\'am!', why: 'Subah se **dopahar 12 baje tak** kisi se milne pe bolte hain.' },
      dont: { wrong: 'Good morning! (shaam 7 baje)', right: 'Good evening!', why: 'Greeting **time ke hisaab se** badalti hai: 12 se 5 “good afternoon”, 5 ke baad “good evening”.' },
      tags: ['Class', 'Office']
    },
    {
      word: 'good night', ipa: '/ɡʊd naɪt/', say: 'गुड नाइट', meaning: 'shubh raatri (jaate ya sote waqt)',
      use: { ex: 'Good night, Mom!', why: 'Sone se pehle ya raat ko **alvida** kehte waqt.' },
      dont: { wrong: 'Good night! (raat 8 baje kisi se milte hi)', right: 'Good evening!', why: '“Good night” milne pe nahi, sirf **jaate waqt** ya sote waqt bolte hain.' },
      tags: ['Ghar', 'Dost']
    },
    {
      word: 'name', ipa: '/neɪm/', say: 'नेम', meaning: 'naam',
      use: { ex: 'My name is Priya.', why: 'Apna naam batane ka seedha tareeka: **My name is** + naam.' },
      dont: { wrong: 'My good name is Priya.', right: 'My name is Priya.', why: '“Good name” Hindi ke “shubh naam” se aaya hai. English mein naam **good ya bad nahi** hota.' },
      tags: ['Pehli mulaqaat', 'Interview']
    },
    {
      word: 'from', ipa: '/frʌm/', say: 'फ्रॉम', meaning: 'se (jagah)',
      use: { ex: 'I am from Lucknow.', why: 'Aap kahan ke rehne wale ho, yeh batane ke liye. “from” = **“se”**.' },
      dont: { wrong: 'I am belong to Lucknow.', right: 'I am from Lucknow.', why: '“belong” khud ek **verb** hai, uske saath “am” nahi lagta. Seedha “I am from” bolo.' },
      tags: ['Pehli mulaqaat', 'Interview']
    },
    {
      word: 'student', ipa: '/ˈstuːdənt/', say: 'स्टूडेंट', meaning: 'vidyarthi',
      use: { ex: 'I am a student.', why: 'Ek insaan ki pehchaan batate waqt pehle **“a”** lagta hai.' },
      dont: { wrong: 'I am student.', right: 'I am a student.', why: 'English mein ek insaan ke kaam ya pehchaan se pehle **“a”** zaroori hai. Poora rule Day 11 mein.' },
      tags: ['Class', 'Interview']
    },
    {
      word: 'thank you', ipa: '/θæŋk juː/', say: 'थैंक यू', meaning: 'shukriya, dhanyavaad',
      use: { ex: 'Thank you for your help.', why: 'Koi madad kare ya kuch de, tab. Kis cheez ke liye, yeh **“for”** se batate hain.' },
      dont: { wrong: 'Thanks you.', right: 'Thank you. / Thanks.', why: '“Thanks” **akela** bolte hain, ya “thank you”. Dono milakar “thanks you” galat hai.' },
      tags: ['Dukaan', 'Har jagah']
    },
    {
      word: 'sorry', ipa: '/ˈsɑːri/', say: 'सॉरी', meaning: 'maaf karna',
      use: { ex: 'Sorry, I am late.', why: 'Galti ho jaaye tab. “Sorry” pehle bolne se baat **naram** ho jaati hai.' },
      dont: { wrong: 'Sorry for disturb.', right: 'Sorry to disturb you.', why: 'Kisi **kaam** ke liye maafi ho to “sorry to + verb” lagta hai: sorry to disturb, sorry to say.' },
      tags: ['Office', 'Class']
    },
    {
      word: 'please', ipa: '/pliːz/', say: 'प्लीज़', meaning: 'kripya',
      use: { ex: 'Can I have some water, please?', why: 'Kuch maangte waqt **izzat** dikhane ke liye.' },
      dont: { wrong: 'Give me water. (restaurant mein)', right: 'Can I have some water, please?', why: 'Bina “please” ke yeh **hukm** jaisa lagta hai, maangna nahi.' },
      tags: ['Restaurant', 'Dukaan']
    },
    {
      word: 'welcome', ipa: '/ˈwelkəm/', say: 'वेलकम', meaning: 'swagat / koi baat nahi',
      use: { ex: 'You\'re welcome.', why: 'Koi “thank you” bole to uska **jawab**.' },
      dont: { wrong: 'Most welcome.', right: 'You\'re welcome. / No problem.', why: '“Most welcome” India mein chalta hai, par “You\'re welcome” **duniya bhar mein** sahi aur samjha jaata hai.' },
      tags: ['Dost', 'Office']
    },
    {
      word: 'nice', ipa: '/naɪs/', say: 'नाइस', meaning: 'achha',
      use: { ex: 'Nice to meet you.', why: 'Kisi se **pehli baar** milne pe.' },
      dont: { wrong: 'Nice to meet you. (doosri baar milne pe)', right: 'Nice to see you again.', why: '“Meet” pehli mulaqaat ke liye hai. **Dobara** milne pe “see you again”.' },
      tags: ['Pehli mulaqaat', 'Dost']
    },
    {
      word: 'bye', ipa: '/baɪ/', say: 'बाय', meaning: 'alvida',
      use: { ex: 'Bye! See you tomorrow.', why: 'Dost ya ghar walon se **jaate waqt**.' },
      dont: { wrong: 'Bye-bye! (interview ke baad)', right: 'Goodbye. Have a nice day.', why: '“Bye-bye” **bachchon jaisa** lagta hai. Office ya interview mein “Goodbye”.' },
      tags: ['Dost', 'Interview']
    },
    {
      word: 'excuse me', ipa: '/ɪkˈskjuːz miː/', say: 'एक्सक्यूज़ मी', meaning: 'suniye / maaf kijiye',
      use: { ex: 'Excuse me, where is the bus stop?', why: 'Kisi anjaan ka **dhyan kheenchne** ya raasta poochhne ke liye.' },
      dont: { wrong: 'Excuse me! (kisi ka pair dab gaya)', right: 'Sorry!', why: '“Excuse me” galti se **pehle** (dhyan kheenchne), “sorry” galti ke **baad**.' },
      tags: ['Bahar', 'Dukaan']
    },
    {
      word: 'friend', ipa: '/frend/', say: 'फ्रेंड', meaning: 'dost',
      use: { ex: 'This is my friend, Ravi.', why: 'Kisi ka parichay karwane ke liye **“This is”**.' },
      dont: { wrong: 'She is my friend circle.', right: 'She is my friend.', why: '“Friend circle” ek **group** hai, ek insaan nahi.' },
      tags: ['Dost', 'Pehli mulaqaat']
    },
    {
      word: 'teacher', ipa: '/ˈtiːtʃər/', say: 'टीचर', meaning: 'adhyapak',
      use: { ex: 'She is my English teacher.', why: 'Kisi ki **pehchaan** batane ke liye.' },
      dont: { wrong: 'My teacher name is Mr Singh.', right: 'My teacher\'s name is Mr Singh.', why: '“Teacher ka naam” = teacher**\'s** name. Kisi ki cheez batane ke liye **’s** lagta hai.' },
      tags: ['Class']
    }
  ],

  grammar: {
    what: 'Apne baare mein batane ke 2 saanche: **My name is ___** aur **I am ___**. Inse naam, jagah, kaam aur haal sab bata sakte ho.',
    formula: ['I', 'am', 'naam / jagah / kaam'],
    pairs: [
      { hi: 'Mera naam Priya', hiVerb: 'hai', en: 'My name', enVerb: 'is' },
      { hi: 'Main Lucknow se', hiVerb: 'hoon', en: 'I', enVerb: 'am from' },
      { hi: 'Main student', hiVerb: 'hoon', en: 'I', enVerb: 'am a' },
      { hi: 'Main theek', hiVerb: 'hoon', en: 'I', enVerb: 'am' }
    ],
    rules: [
      {
        title: 'Naam batana',
        right: ['My name is Priya.', 'I am Priya.'],
        why: 'Dono sahi hain. **“My name is”** thoda formal hai (interview, form). **“I am”** roz ki baat-cheet mein zyada chalta hai.'
      },
      {
        title: '“My good name” mat bolo',
        wrong: 'My good name is Priya.', right: ['My name is Priya.'],
        why: 'Hindi mein “aapka shubh naam?” poochhte hain, isliye log “good name” bol dete hain. English mein naam **good ya bad nahi** hota.'
      },
      {
        title: 'Jagah: I am from',
        wrong: 'I am belong to Patna.', right: ['I am from Patna.'],
        why: '“from” = **“se”**. “belong” khud verb hai, isliye “am belong” mein do verb takra jaate hain. Seedha “I am from” bolo.'
      },
      {
        title: 'Kaam ya pehchaan: I am a ___',
        wrong: 'I am student.', right: ['I am a student.', 'I am an engineer.'],
        why: 'Ek insaan ki pehchaan se pehle **“a”** lagta hai. Agar agla shabd a, e, i, o, u ki **awaaz** se shuru ho to **“an”**.',
        tip: 'A / An / The ka poora rule Day 11 mein aayega.'
      },
      {
        title: 'Haal poochhna',
        wrong: 'How you are?', right: ['How are you?', 'I am fine, thank you.'],
        why: 'Sawaal mein **“are” pehle** aata hai, jaise Hindi mein “kya” shuru mein. Poora rule kal (Day 2) mein.'
      },
      {
        title: 'Greeting time ke hisaab se',
        wrong: 'Good night! (shaam ko milte waqt)', right: ['Good morning (12 baje tak)', 'Good afternoon (12 se 5)', 'Good evening (5 ke baad)'],
        why: '**“Good night” milne pe nahi** bolte, sirf jaate ya sote waqt. Milte waqt time dekh kar greeting chuno.'
      }
    ]
  },

  models: [
    { situation: 'Pehli mulaqaat', en: 'Hi, I am Priya. Nice to meet you.', why: 'Pehle naam, phir **“Nice to meet you”**. Pehli mulaqaat ka poora set.' },
    { situation: 'Phone pe', en: 'Hello, this is Priya. Who is speaking?', why: 'Phone pe apne aap ko **“this is”** se batate hain, “I am” se nahi.' },
    { situation: 'Class mein', en: 'Good morning, ma\'am. May I come in?', why: 'Andar aane ki ijaazat ka polite tareeka: **“May I come in?”**' },
    { situation: 'Dukaan pe', en: 'Excuse me, how much is this?', why: 'Anjaan se baat **“Excuse me”** se shuru karo, phir sawaal.' },
    { situation: 'Jaate waqt', en: 'Bye! See you tomorrow.', why: 'Dost ko alvida. Office mein: **“Goodbye. Have a nice day.”**' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'My ___ is Priya.', options: ['name', 'good name'], answer: 'name', why: 'English mein naam “good” nahi hota. Bas **“My name is”**.' },
      { prompt: 'Sahi shabd chuno', q: 'I am ___ Lucknow.', options: ['from', 'belong', 'in from'], answer: 'from', why: '“from” = “se”. **I am from** + jagah.' },
      { prompt: 'Sahi shabd chuno', q: 'I am ___ student.', options: ['a', 'an'], answer: 'a', why: '“student” **s ki awaaz** se shuru hota hai, a/e/i/o/u se nahi. Isliye “a”.' },
      { prompt: 'Shaam 7 baje kisi se milo to?', q: '', options: ['Good night!', 'Good evening!'], answer: 'Good evening!', why: '“Good night” sirf **jaate ya sote** waqt. Shaam ko milne pe “Good evening”.' },
      { prompt: 'Koi “Thank you” bole to jawab?', q: '', options: ['Thanks you.', 'You\'re welcome.'], answer: 'You\'re welcome.', why: '“Thank you” ka jawab **“You\'re welcome”**. “Thanks you” galat hai.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['How you are?', 'How are you?'], answer: 'How are you?', why: 'Sawaal mein **“are” pehle**, jaise Hindi mein “kya” shuru mein.' },
      { prompt: 'Phone uthate hi kya bologe?', q: '', options: ['Yes, tell.', 'Hello, who is speaking?'], answer: 'Hello, who is speaking?', why: '“Yes, tell” Hindi “haan, bolo” ka translation hai aur **rude** lagta hai.' },
      { prompt: 'Galti se kisi ka pair dab gaya. Kya bologe?', q: '', options: ['Excuse me!', 'Sorry!'], answer: 'Sorry!', why: 'Galti ke **baad “sorry”**. “Excuse me” galti se pehle dhyan kheenchne ke liye.' },
      { prompt: 'Kisi se pehli baar mile ho', q: '', options: ['Nice to meet you.', 'Nice to see you again.'], answer: 'Nice to meet you.', why: '**Pehli baar = meet**. Dobara milne pe “see you again”.' },
      { prompt: 'Sahi shabd chuno', q: 'Sorry ___ disturb you.', options: ['for', 'to'], answer: 'to', why: 'Kisi **kaam** (disturb) ke liye maafi: **sorry to + verb**.' }
    ]
  },

  speak: [
    'Good morning! My name is Priya.',
    'I am from Lucknow.',
    'Nice to meet you.'
  ],

  write: {
    intro: 'Apna parichay 3 sentence mein likho.',
    items: [
      { label: 'My name is …', placeholder: 'Jaise: My name is Priya.', pattern: '\\bmy name is [a-z]+', ok: 'Naam batane ka **sahi tareeka**.', fix: 'Naam ke liye likho: **My name is** + aapka naam. “My good name” nahi.' },
      { label: 'I am from …', placeholder: 'Jaise: I am from Lucknow.', pattern: '\\bi am from [a-z]+', ok: '**“from” = “se”**, bilkul sahi.', fix: 'Jagah ke liye likho: **I am from** + shehar. “I am belong” nahi.' },
      { label: 'I am a / an …', placeholder: 'Jaise: I am a student.', pattern: '\\bi am (a|an) [a-z]+', ok: 'Pehchaan se pehle **“a / an”**, sahi!', fix: 'Pehchaan se pehle **“a”** ya **“an”** lagao: I am **a** student, I am **an** engineer.' }
    ]
  }
};

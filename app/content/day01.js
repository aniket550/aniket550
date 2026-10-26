// Day 1 lesson content. Learner: 12th pass, studying an online degree (IITM BS),
// knows basic English but translates from Hindi. Every rule carries a "why".
window.LESSONS = window.LESSONS || {};
window.LESSONS[1] = {
  day: 1,
  week: 1,
  title: 'Self Introduction',
  subtitle: 'Live session, study group aur viva mein parichay',
  minutes: 30,
  next: { day: 2, title: 'Is / Am / Are' },

  reading: {
    title: 'Hi Everyone!',
    lines: [
      { en: 'Hi everyone, I\'m Aman Verma, and my hometown is Kanpur.', hi: 'Sabko namaste, main Aman Verma hoon, aur mera ghar Kanpur mein hai.' },
      { en: 'I finished Class 12 last year, and now I\'m enrolled in the IITM BS degree.', hi: 'Maine pichhle saal 12vi poori ki, aur ab main IITM BS degree mein enrolled hoon.' },
      { en: 'Currently, I\'m in the Foundation level, and Maths is my favourite subject.', hi: 'Abhi main Foundation level mein hoon, aur Maths mera pasandida subject hai.' },
      { en: 'I\'m good at solving problems, but I\'m a little nervous about speaking English.', hi: 'Main problems solve karne mein achha hoon, par English bolne mein thoda ghabraata hoon.' },
      { en: 'I\'m looking forward to learning with all of you, so feel free to message me.', hi: 'Main aap sab ke saath seekhne ke liye utsuk hoon, toh bejhijhak mujhe message karo.' }
    ],
    grammarWords: ['I\'m'],
    vocabWords: ['hometown', 'finished', 'enrolled', 'Currently', 'favourite', 'subject', 'good at', 'a little', 'looking forward', 'feel free'],
    questions: [
      { q: 'Aman ne 12vi kab poori ki, aur ab kya kar raha hai?', a: 'Pichhle saal. Ab IITM BS degree ke Foundation level mein hai.' },
      { q: 'Aman kis cheez mein achha hai?', a: 'Problems solve karne mein. Maths uska pasandida subject hai.' },
      { q: 'Aman kis baat se thoda ghabraata hai?', a: 'English bolne se.' }
    ]
  },

  words: [
    {
      word: 'currently', ipa: '/ˈkɜːrəntli/', say: 'करेंटली', hindi: 'वर्तमान में', meaning: 'abhi, filhaal',
      rule: 'Jab koi kaam ya haalat **abhi chal rahi ho** (hamesha ke liye nahi) aur yeh batana ho, tab **currently** lagao.',
      patterns: [
        { form: 'I\'m currently + ___ing', ex: [
          { en: 'I\'m currently [learning Python].', hi: 'Main abhi Python seekh raha hoon.' },
          { en: 'She\'s currently [doing an internship].', hi: 'Woh abhi internship kar rahi hai.' }
        ] },
        { form: 'I\'m currently in + ___', ex: [
          { en: 'I\'m currently [in the Foundation level].', hi: 'Main abhi Foundation level mein hoon.' },
          { en: 'He\'s currently [in Delhi].', hi: 'Woh abhi Delhi mein hai.' }
        ] }
      ],
      dont: { wrong: 'Currently I am doing BS from IITM.', right: 'I\'m currently studying at IIT Madras.', why: 'University ke saath **at** lagta hai, “from” nahi.' }
    },
    {
      word: 'enrolled', ipa: '/ɪnˈroʊld/', say: 'इनरोल्ड', hindi: 'दाख़िला लिया हुआ', meaning: 'course mein naam likha hua',
      rule: 'Jab batana ho ki aapka **kisi course ya class mein officially naam likha hai**, tab **enrolled** bolo.',
      patterns: [
        { form: 'I\'m enrolled in + ___', ex: [
          { en: 'I\'m enrolled in [the BS degree].', hi: 'Main BS degree mein enrolled hoon.' },
          { en: 'I\'m enrolled in [two courses this term].', hi: 'Is term mera do courses mein naam hai.' }
        ] },
        { form: 'How many ___ are enrolled?', ex: [
          { en: 'How many [students] are enrolled?', hi: 'Kitne students ne naam likhwaya hai?' }
        ] }
      ],
      dont: { wrong: 'I am enrolled at the course.', right: 'I\'m enrolled in the course.', why: 'Course ke saath hamesha **in**.' }
    },
    {
      word: 'hometown', ipa: '/ˈhoʊmtaʊn/', say: 'होमटाउन', hindi: 'गृहनगर', meaning: 'apna shehar',
      rule: 'Jab batana ho ki aap **asal mein kis shehar ke** ho (jahan bade hue), tab **hometown** bolo.',
      patterns: [
        { form: 'My hometown is + ___', ex: [
          { en: 'My hometown is [Kanpur].', hi: 'Mera shehar Kanpur hai.' },
          { en: 'My hometown is [a small village near Patna].', hi: 'Mera shehar Patna ke paas ka ek chhota gaon hai.' }
        ] },
        { form: 'I\'m going to my hometown + ___', ex: [
          { en: 'I\'m going to my hometown [for Diwali].', hi: 'Main Diwali pe apne shehar ja raha hoon.' }
        ] }
      ],
      dont: { wrong: 'My native is Kanpur.', right: 'My hometown is Kanpur.', why: '“Native” akela **adhoora** lagta hai.' }
    },
    {
      word: 'finish', ipa: '/ˈfɪnɪʃ/', say: 'फ़िनिश', hindi: 'पूरा करना', meaning: 'khatam karna',
      rule: 'Jab koi **kaam ya padhai poori** ho jaaye aur yeh batana ho, tab **finish** bolo. Beeti baat ke liye **finished**.',
      patterns: [
        { form: 'I finished + ___ + (kab)', ex: [
          { en: 'I finished [Class 12 in 2024].', hi: 'Maine 2024 mein 12vi poori ki.' },
          { en: 'I finished [the assignment last night].', hi: 'Maine kal raat assignment poora kiya.' }
        ] },
        { form: 'Have you finished + ___?', ex: [
          { en: 'Have you finished [Week 4]?', hi: 'Kya tumne Week 4 poora kar liya?' }
        ] }
      ],
      dont: { wrong: 'I passed out 12th in 2024.', right: 'I finished Class 12 in 2024.', why: '“Pass out” ka matlab **behosh hona** bhi hai.' }
    },
    {
      word: 'subject', ipa: '/ˈsʌbdʒɪkt/', say: 'सब्जेक्ट', hindi: 'विषय', meaning: 'padhai ka vishay',
      rule: 'Jab padhai ke kisi **vishay** (Maths, Python…) ki baat karni ho, tab **subject** bolo.',
      patterns: [
        { form: '___ is a ___ subject for me', ex: [
          { en: '[Statistics] is a [difficult] subject for me.', hi: 'Statistics mere liye mushkil subject hai.' },
          { en: '[Python] is an [interesting] subject for me.', hi: 'Python mere liye dilchasp subject hai.' }
        ] },
        { form: 'I\'m taking ___ subjects', ex: [
          { en: 'I\'m taking [four] subjects this term.', hi: 'Is term main chaar subject padh raha hoon.' }
        ] }
      ],
      dont: { wrong: 'I am weak in English.', right: 'I\'m not very good at English yet.', why: '**“yet”** se lagta hai aap seekh rahe ho.' }
    },
    {
      word: 'favourite', ipa: '/ˈfeɪvərɪt/', say: 'फ़ेवरिट', hindi: 'सबसे पसंदीदा', meaning: 'sabse pasand',
      rule: 'Jab bahut saari cheezon mein se **sabse pasand wali** batani ho, tab **favourite** bolo.',
      patterns: [
        { form: 'My favourite ___ is ___', ex: [
          { en: 'My favourite [subject] is [Maths].', hi: 'Mera pasandida subject Maths hai.' },
          { en: 'My favourite [teacher] is [Ms Rao].', hi: 'Meri pasandida teacher Ms Rao hain.' }
        ] },
        { form: 'What\'s your favourite ___?', ex: [
          { en: 'What\'s your favourite [programming language]?', hi: 'Tumhari pasandida programming language kaunsi hai?' }
        ] }
      ],
      dont: { wrong: 'My most favourite subject is Maths.', right: 'My favourite subject is Maths.', why: '“Favourite” mein **“sabse” pehle se** hai.' }
    },
    {
      word: 'good at', ipa: '/ɡʊd æt/', say: 'गुड ऐट', hindi: 'में माहिर', meaning: 'kisi kaam mein achha',
      rule: 'Jab batana ho ki aap **kisi kaam ya subject mein achhe** ho, tab **good at** bolo.',
      patterns: [
        { form: 'I\'m good at + ___ (subject)', ex: [
          { en: 'I\'m good at [Maths].', hi: 'Main Maths mein achha hoon.' }
        ] },
        { form: 'I\'m good at + ___ing (kaam)', ex: [
          { en: 'I\'m good at [solving problems].', hi: 'Main problems solve karne mein achha hoon.' },
          { en: 'She\'s good at [explaining things].', hi: 'Woh cheezein samjhane mein achhi hai.' }
        ] }
      ],
      dont: { wrong: 'I am good in maths.', right: 'I\'m good at maths.', why: 'Skill ke saath hamesha **at**.' }
    },
    {
      word: 'confident', ipa: '/ˈkɑːnfɪdənt/', say: 'कॉन्फ़िडेंट', hindi: 'आत्मविश्वासी', meaning: 'khud pe bharosa',
      rule: 'Jab batana ho ki aapko **kisi cheez ko lekar bharosa** hai, tab **confident about** bolo.',
      patterns: [
        { form: 'I\'m confident about + ___', ex: [
          { en: 'I\'m confident about [the quiz].', hi: 'Mujhe quiz ko lekar bharosa hai.' },
          { en: 'I\'m confident about [my project].', hi: 'Mujhe apne project pe bharosa hai.' }
        ] },
        { form: 'I\'m not very confident about ___ yet', ex: [
          { en: 'I\'m not very confident about [speaking English] yet.', hi: 'Mujhe abhi English bolne pe utna bharosa nahi hai.' }
        ] }
      ],
      dont: { wrong: 'I am not having confidence.', right: 'I\'m not very confident.', why: '“have” ke saath **-ing nahi** lagta.' }
    },
    {
      word: 'interested in', ipa: '/ˈɪntrəstɪd ɪn/', say: 'इंट्रेस्टिड इन', hindi: 'में रुचि', meaning: 'mein dilchaspi',
      rule: 'Jab batana ho ki aapko **kisi cheez mein dilchaspi** hai, tab **interested in** bolo.',
      patterns: [
        { form: 'I\'m interested in + ___ (cheez)', ex: [
          { en: 'I\'m interested in [data science].', hi: 'Mujhe data science mein dilchaspi hai.' }
        ] },
        { form: 'I\'m interested in + ___ing (kaam)', ex: [
          { en: 'I\'m interested in [learning web development].', hi: 'Mujhe web development seekhne mein dilchaspi hai.' },
          { en: 'Are you interested in [joining our group]?', hi: 'Kya tum hamare group mein judna chahoge?' }
        ] }
      ],
      dont: { wrong: 'I am interested to data science.', right: 'I\'m interested in data science.', why: '“interested” ke baad hamesha **in**.' }
    },
    {
      word: 'looking forward to', ipa: '/ˈlʊkɪŋ ˈfɔːrwərd tə/', say: 'लुकिंग फ़ॉरवर्ड टू', hindi: 'उत्सुकता से इंतज़ार', meaning: 'khushi se intezaar',
      rule: 'Jab kisi **aane wali cheez ka khushi se intezaar** ho, tab **looking forward to** bolo. Email ke end mein bahut kaam aata hai.',
      patterns: [
        { form: 'I\'m looking forward to + ___ (cheez)', ex: [
          { en: 'I\'m looking forward to [your reply].', hi: 'Mujhe aapke jawab ka intezaar rahega.' },
          { en: 'I\'m looking forward to [the next session].', hi: 'Mujhe agle session ka intezaar hai.' }
        ] },
        { form: 'I\'m looking forward to + ___ing (kaam)', ex: [
          { en: 'I\'m looking forward to [meeting you].', hi: 'Mujhe aapse milne ka intezaar hai.' }
        ] }
      ],
      dont: { wrong: 'I am looking forward to meet you.', right: 'I\'m looking forward to meeting you.', why: 'Is jodi mein “to” ke baad **-ing**.' }
    },
    {
      word: 'feel free', ipa: '/fiːl friː/', say: 'फ़ील फ़्री', hindi: 'बेझिझक', meaning: 'bina jhijhak ke',
      rule: 'Jab kisi ko **bina jhijhak kuch karne ki chhoot** deni ho, tab **feel free to** bolo.',
      patterns: [
        { form: 'Feel free to + ___ (kaam)', ex: [
          { en: 'Feel free to [message me].', hi: 'Bejhijhak mujhe message karo.' },
          { en: 'Feel free to [ask questions].', hi: 'Bejhijhak sawaal poochho.' },
          { en: 'Please feel free to [correct me].', hi: 'Bejhijhak meri galti sudhaariye.' }
        ] }
      ],
      dont: { wrong: 'Feel free for asking.', right: 'Feel free to ask.', why: '“feel free” ke baad **to + verb**.' }
    },
    {
      word: 'introduce', ipa: '/ˌɪntrəˈduːs/', say: 'इंट्रोड्यूस', hindi: 'परिचय कराना', meaning: 'parichay dena',
      rule: 'Jab **parichay** dena ho, apna ya kisi aur ka, tab **introduce** bolo.',
      patterns: [
        { form: 'Let me introduce + ___', ex: [
          { en: 'Let me introduce [myself].', hi: 'Main apna parichay deta hoon.' },
          { en: 'Let me introduce [my friend, Riya].', hi: 'Main apni dost Riya se milwata hoon.' }
        ] },
        { form: 'Can you introduce me to + ___?', ex: [
          { en: 'Can you introduce me to [the group]?', hi: 'Kya tum mujhe group se milwa sakte ho?' }
        ] }
      ],
      dont: { wrong: 'Myself Aman.', right: 'I\'m Aman.', why: '“Myself” se **sentence shuru nahi** hota.' }
    },
    {
      word: 'background', ipa: '/ˈbækɡraʊnd/', say: 'बैकग्राउंड', hindi: 'पृष्ठभूमि', meaning: 'pehle ki padhai',
      rule: 'Jab **pehle ki padhai ya mahaul** batana ho, tab **background** bolo.',
      patterns: [
        { form: 'I\'m from a ___ background', ex: [
          { en: 'I\'m from a [Hindi-medium] background.', hi: 'Main Hindi-medium background se hoon.' },
          { en: 'I\'m from a [science] background.', hi: 'Meri padhai science ki hai.' }
        ] },
        { form: 'I have a ___ background', ex: [
          { en: 'I have a [commerce] background.', hi: 'Meri padhai commerce ki hai.' }
        ] }
      ],
      dont: { wrong: 'I am from Hindi medium.', right: 'I studied in a Hindi-medium school.', why: '“Hindi medium” ke saath **school** jodo.' }
    },
    {
      word: 'a little', ipa: '/ə ˈlɪtl/', say: 'अ लिटल', hindi: 'थोड़ा', meaning: 'thoda',
      rule: 'Jab kisi cheez ko **thoda sa** batana ho (zyada nahi), tab **a little** bolo.',
      patterns: [
        { form: 'I\'m a little + ___ (feeling)', ex: [
          { en: 'I\'m a little [nervous].', hi: 'Main thoda ghabraaya hua hoon.' },
          { en: 'I\'m a little [tired] today.', hi: 'Main aaj thoda thaka hua hoon.' }
        ] },
        { form: 'Can you ___ a little ___?', ex: [
          { en: 'Can you [speak] a little [slower]?', hi: 'Kya aap thoda dheere bol sakte hain?' }
        ] }
      ],
      dont: { wrong: 'I am little bit nervous.', right: 'I\'m a little bit nervous.', why: 'Bina **“a”** ke matlab badal jaata hai.' }
    },
    {
      word: 'question', ipa: '/ˈkwestʃən/', say: 'क्वेश्चन', hindi: 'सवाल', meaning: 'sawaal',
      rule: 'Jab kuch **poochhna** ho, class, email ya forum mein, tab **question** bolo.',
      patterns: [
        { form: 'Can I ask a question about + ___?', ex: [
          { en: 'Can I ask a question about [Week 3]?', hi: 'Kya main Week 3 ke baare mein sawaal poochh sakta hoon?' }
        ] },
        { form: 'I have a question about + ___', ex: [
          { en: 'I have a question about [the assignment].', hi: 'Mera assignment ke baare mein ek sawaal hai.' },
          { en: 'I have a question about [slide 12].', hi: 'Mera slide 12 ke baare mein ek sawaal hai.' }
        ] }
      ],
      dont: { wrong: 'Sir, I have one doubt.', right: 'Sir, I have a question.', why: '“Doubt” ka matlab **shak** hota hai.' }
    }
  ],

  grammar: {
    what: 'Achha parichay **3 hisson** mein: kaun ho aur kahan se, abhi kya padh rahe ho, aur ek khaas baat. Galtiyan wahan hoti hain jahan hum Hindi se **shabd-dar-shabd** translate karte hain.',
    formula: ['Naam + jagah', 'abhi ki padhai', 'ek khaas baat'],
    pairs: [
      { hi: 'Main Kanpur se', hiVerb: 'hoon', en: 'I\'m', enVerb: 'from Kanpur' },
      { hi: 'Maine 12vi 2024 mein', hiVerb: 'poori ki', en: 'I', enVerb: 'finished Class 12 in 2024' },
      { hi: 'Main IITM BS mein', hiVerb: 'hoon', en: 'I\'m', enVerb: 'enrolled in the IITM BS' },
      { hi: 'Mera ek sawaal', hiVerb: 'hai', en: 'I', enVerb: 'have a question' }
    ],
    rules: [
      {
        title: '“Myself …” se shuru mat karo',
        wrong: 'Myself Aman Verma.', right: ['I\'m Aman Verma.', 'Let me introduce myself. I\'m Aman.'],
        why: '“Myself” tab lagta hai jab kaam **khud pe** ho: “I hurt myself”, “introduce myself”. Naam batane ke liye sentence ko **subject** chahiye: **I\'m**.'
      },
      {
        title: 'Sawaal = question, doubt nahi',
        wrong: 'Sir, I have one doubt.', right: ['Sir, I have a question.', 'Can I ask a question?'],
        why: 'English mein **doubt = shak / bharosa na hona**. “I have a doubt” sunke videshi teacher sochega aapko unpe shak hai! Sawaal ke liye **question**.'
      },
      {
        title: '12vi poori ki: finished, “passed out” nahi',
        wrong: 'I passed out 12th in 2024.', right: ['I finished Class 12 in 2024.', 'I completed Class 12 in 2024.'],
        why: '**“Pass out” = behosh hona** bhi hota hai. Saal bataya hai, to baat beet chuki: simple past **finished / completed**.'
      },
      {
        title: 'Skill ke saath at: good at',
        wrong: 'I am good in coding.', right: ['I\'m good at coding.', 'I\'m good at solving problems.'],
        why: 'Kisi kaam ya skill mein achha hona: **good at**. Kaam ho to verb + **-ing**.'
      },
      {
        title: '“How are you?” ka natural jawab',
        wrong: 'I am fine. (aur chup)', right: ['I\'m good, thanks. How about you?', 'Not bad. How are you doing?'],
        why: 'Sirf “I am fine” **robot jaisa** lagta hai. Jawab ke saath **sawaal wapas** poochho, baat aage badhegi.'
      },
      {
        title: 'Bolte waqt I\'m, I\'ve',
        right: ['I am → I\'m', 'I have → I\'ve', 'You are → You\'re'],
        why: 'Bolchaal mein **short form** natural aur tez lagta hai. Har jagah “I am … I am …” bolne se **ratta** jaisa lagta hai. Formal email mein “I am” theek hai.'
      }
    ]
  },

  modal: {
    verb: 'can', ipa: '/kæn/', say: 'कैन', hindi: 'सकना', meaning: 'kar sakna',
    uses: [
      { rule: 'Jab batana ho ki koi kaam **karna aata hai** (kshamta)', form: 'Subject + can + verb', ex: [
        { en: 'I can [write basic Python code].', hi: 'Main basic Python code likh sakta hoon.' },
        { en: 'She can [solve these problems quickly].', hi: 'Woh yeh sawaal jaldi solve kar sakti hai.' }
      ] },
      { rule: 'Jab dost ya class mein **ijaazat** maangni ho', form: 'Can I + verb …?', ex: [
        { en: 'Can I [ask a question]?', hi: 'Kya main ek sawaal poochh sakta hoon?' },
        { en: 'Can I [share my screen]?', hi: 'Kya main apni screen share kar sakta hoon?' }
      ] },
      { rule: 'Jab kisi se **madad ya request** karni ho', form: 'Can you + verb …?', ex: [
        { en: 'Can you [explain this step again]?', hi: 'Kya aap yeh step dobara samjha sakte hain?' },
        { en: 'Can you [share the notes]?', hi: 'Kya tum notes share kar sakte ho?' }
      ] }
    ],
    dont: [
      { wrong: 'I can able to code.', right: 'I can code.', why: '“can” aur “able to” ka matlab **ek hi** hai. Dono saath nahi.' },
      { wrong: 'She can speaks English.', right: 'She can speak English.', why: 'Modal ke baad verb **saada**, -s nahi.' }
    ]
  },

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Live session mein kaunsa sahi hai?', q: '', options: ['Myself Aman Verma.', 'I\'m Aman Verma.'], answer: 'I\'m Aman Verma.', why: '“Myself” **subject nahi** ban sakta. Naam ke liye **I\'m**.' },
      { prompt: 'Teacher se sawaal poochhna hai', q: '', options: ['Sir, I have one doubt.', 'Sir, I have a question.'], answer: 'Sir, I have a question.', why: '**Doubt = shak**. Sawaal = **question**.' },
      { prompt: 'Sahi shabd chuno', q: 'I\'m good ___ maths.', options: ['in', 'at'], answer: 'at', why: 'Skill ke saath **good at**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I passed out 12th in 2024.', 'I finished Class 12 in 2024.'], answer: 'I finished Class 12 in 2024.', why: '“Pass out” = **behosh hona** bhi. Use **finished**.' },
      { prompt: 'Sahi shabd chuno', q: 'I\'m enrolled ___ the BS degree.', options: ['in', 'at'], answer: 'in', why: 'Course / degree ke saath **enrolled in**.' },
      { prompt: 'Sahi shabd chuno', q: 'Feel free ___ me.', options: ['to message', 'for messaging'], answer: 'to message', why: '**feel free to + verb**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am little bit nervous.', 'I\'m a little bit nervous.'], answer: 'I\'m a little bit nervous.', why: 'Bina “a” ke “little” = **lagbhag nahi**. Thoda = **a little**.' },
      { prompt: 'Sahi shabd chuno', q: 'I\'m looking forward to ___ with you.', options: ['study', 'studying'], answer: 'studying', why: '“looking forward to” ke baad **-ing**.' },
      { prompt: 'Kaunsa sentence natural hai?', q: '', options: ['My native is Kanpur.', 'My hometown is Kanpur.'], answer: 'My hometown is Kanpur.', why: '“Native” akela adhoora. **hometown** bolo.' },
      { prompt: '“How are you?” ka sabse natural jawab', q: '', options: ['I am fine.', 'I\'m good, thanks. How about you?'], answer: 'I\'m good, thanks. How about you?', why: 'Jawab ke saath **sawaal wapas**.' }
    ]
  },

  speak: [
    'Hi everyone, I\'m Aman, and my hometown is Kanpur.',
    'I\'m currently in the Foundation level of the BS degree.',
    'I have a question about this week\'s assignment.'
  ],

  write: {
    intro: 'Study group ya live session ke liye apna parichay 3 sentence mein likho. Apni asli jaankari likho.',
    items: [
      { label: 'Naam aur shehar', placeholder: 'Jaise: I\'m Aman, and I\'m from Kanpur.', pattern: '^(?! ?myself\\b).*\\bi(\'m| am)\\b.*\\b(from [a-z]+|hometown is [a-z]+)', ok: '**I\'m** se shuru, aur shehar **from / hometown** se. Bilkul sahi!', fix: '“Myself …” se shuru mat karo. Likho: **I\'m** + naam, **I\'m from** + shehar.' },
      { label: 'Abhi ki padhai', placeholder: 'Jaise: I\'m currently in the Foundation level.', pattern: '^(?!.*\\bpassed out\\b)(?!.*\\bdoing bs from\\b).*(\\bi(\'m| am) (currently |now )?(in|enrolled in|studying|pursuing|taking)\\b|\\bi (finished|completed) (class )?12)', ok: 'Padhai ke liye **I\'m in / enrolled in / finished**. Sahi!', fix: 'Likho: **I\'m currently in** … level, ya **I finished Class 12** in … “Passed out” mat likho.' },
      { label: 'Aap kis cheez mein achhe ho, ya kya pasand hai', placeholder: 'Jaise: I\'m good at solving problems.', pattern: '\\bgood at [a-z]+|\\binterested in [a-z]+|\\blooking forward to [a-z]+ing\\b', ok: 'Sahi jodi: **good at / interested in**. Shabash!', fix: 'Likho: I\'m **good at** + kaam/subject, ya I\'m **interested in** + cheez. (“good in” nahi.)' }
    ]
  }
};

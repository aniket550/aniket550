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
      use: { ex: 'I\'m currently in the Foundation level.', why: 'Aapki **abhi ki** padhai ya kaam batane ke liye.' },
      dont: { wrong: 'Currently I am doing BS from IITM.', right: 'I\'m currently studying for a BS at IIT Madras.', why: '“Doing BS **from**” Hindi “IITM **se** BS kar raha hoon” ka translation hai. University ke saath **“at”**.' },
      tags: ['Live session', 'Interview']
    },
    {
      word: 'enrolled', ipa: '/ɪnˈroʊld/', say: 'इनरोल्ड', hindi: 'दाख़िला लिया हुआ', meaning: 'course / degree mein naam likha hua',
      use: { ex: 'I\'m enrolled in the BS degree programme.', why: 'Kisi course ka **student hona** formal tareeke se batana.' },
      dont: { wrong: 'I am enrolled at the course.', right: 'I\'m enrolled in the course.', why: 'Course ya programme ke saath **“in”**.' },
      tags: ['College', 'Email']
    },
    {
      word: 'hometown', ipa: '/ˈhoʊmtaʊn/', say: 'होमटाउन', hindi: 'गृहनगर', meaning: 'apna shehar, jahan ke ho',
      use: { ex: 'My hometown is Kanpur.', why: 'Jahan aap **bade hue**, woh shehar.' },
      dont: { wrong: 'My native is Kanpur.', right: 'My hometown is Kanpur.', why: '“Native” akela **adhoora** hai. Natural English mein **hometown**, ya seedha “I\'m from Kanpur”.' },
      tags: ['Pehli mulaqaat', 'Study group']
    },
    {
      word: 'finish', ipa: '/ˈfɪnɪʃ/', say: 'फ़िनिश', hindi: 'पूरा करना', meaning: 'khatam / poora karna',
      use: { ex: 'I finished Class 12 in 2024.', why: 'Padhai **poori hone** ki baat. Saal bataya to simple past.' },
      dont: { wrong: 'I passed out 12th in 2024.', right: 'I finished Class 12 in 2024.', why: '“Pass out” ka ek matlab **“behosh hona”** bhi hai! Natural English mein **finished / completed Class 12**.' },
      tags: ['Interview', 'Live session']
    },
    {
      word: 'subject', ipa: '/ˈsʌbdʒɪkt/', say: 'सब्जेक्ट', hindi: 'विषय', meaning: 'padhai ka vishay',
      use: { ex: 'Statistics is a difficult subject for me.', why: 'Padhai ke vishay ke liye.' },
      dont: { wrong: 'I am weak in English.', right: 'I\'m not very good at English yet.', why: '“Weak in” India mein chalta hai, par **“not very good at … yet”** zyada natural aur **positive** lagta hai.' },
      tags: ['Study group', 'Interview']
    },
    {
      word: 'favourite', ipa: '/ˈfeɪvərɪt/', say: 'फ़ेवरिट', hindi: 'सबसे पसंदीदा', meaning: 'sabse pasand',
      use: { ex: 'Maths is my favourite subject.', why: 'Kai cheezon mein se **sabse pasand** wali.' },
      dont: { wrong: 'My most favourite subject is Maths.', right: 'My favourite subject is Maths.', why: '“Favourite” ka matlab hi **“sabse pasand”** hai. “Most” lagana zaroori nahi.' },
      tags: ['Study group', 'Dost']
    },
    {
      word: 'good at', ipa: '/ɡʊd æt/', say: 'गुड ऐट', hindi: 'में माहिर / अच्छा', meaning: 'kisi kaam mein achha',
      use: { ex: 'I\'m good at solving problems.', why: 'Skill batane ke liye **good at** + kaam (-ing) ya subject.' },
      dont: { wrong: 'I am good in maths.', right: 'I\'m good at maths.', why: 'Skill ke saath **“at”** lagta hai, “in” nahi.' },
      tags: ['Interview', 'Viva']
    },
    {
      word: 'confident', ipa: '/ˈkɑːnfɪdənt/', say: 'कॉन्फ़िडेंट', hindi: 'आत्मविश्वासी', meaning: 'khud pe bharosa',
      use: { ex: 'I\'m confident about the quiz.', why: 'Kis baat ko lekar bharosa: **confident about**.' },
      dont: { wrong: 'I am not having confidence.', right: 'I\'m not very confident.', why: '“Have” (paas hona) haalat hai, **-ing nahi**. Aur seedha adjective **confident** zyada natural.' },
      tags: ['Viva', 'Interview']
    },
    {
      word: 'interested in', ipa: '/ˈɪntrəstɪd ɪn/', say: 'इंट्रेस्टिड इन', hindi: 'में रुचि', meaning: 'mein dilchaspi',
      use: { ex: 'I\'m interested in data science.', why: 'Cheez ke saath **in**. Kaam ke saath -ing: interested in learning.' },
      dont: { wrong: 'I am interested to data science.', right: 'I\'m interested in data science.', why: '“interested” ke baad **“in”** + cheez.' },
      tags: ['Interview', 'Live session']
    },
    {
      word: 'looking forward to', ipa: '/ˈlʊkɪŋ ˈfɔːrwərd tə/', say: 'लुकिंग फ़ॉरवर्ड टू', hindi: 'उत्सुकता से इंतज़ार', meaning: 'khushi se intezaar',
      use: { ex: 'I\'m looking forward to the next live session.', why: 'Message ya email **khatam** karne ka polite tareeka.' },
      dont: { wrong: 'I am looking forward to meet you.', right: 'I\'m looking forward to meeting you.', why: 'Is jodi mein **“to” ke baad -ing** aata hai. Yeh khaas rule hai.' },
      tags: ['Email', 'Study group']
    },
    {
      word: 'feel free', ipa: '/fiːl friː/', say: 'फ़ील फ़्री', hindi: 'बेझिझक', meaning: 'bina jhijhak ke',
      use: { ex: 'Feel free to message me.', why: 'Doosron ko **khula nyota** dena: feel free to + verb.' },
      dont: { wrong: 'Feel free for asking.', right: 'Feel free to ask.', why: '**feel free to + verb** fixed jodi hai.' },
      tags: ['Study group', 'Forum']
    },
    {
      word: 'introduce', ipa: '/ˌɪntrəˈduːs/', say: 'इंट्रोड्यूस', hindi: 'परिचय कराना', meaning: 'parichay dena',
      use: { ex: 'Let me introduce myself.', why: 'Parichay **shuru** karne ka formal tareeka. Uske baad: “I\'m …”.' },
      dont: { wrong: 'Myself Aman.', right: 'I\'m Aman.', why: '“Myself” **subject nahi** ban sakta. Sirf “Let me introduce **myself**” jaise sentence mein aata hai.' },
      tags: ['Viva', 'Live session']
    },
    {
      word: 'background', ipa: '/ˈbækɡraʊnd/', say: 'बैकग्राउंड', hindi: 'पृष्ठभूमि', meaning: 'pehle ki padhai / mahaul',
      use: { ex: 'I\'m from a Hindi-medium background.', why: 'Aapki **pehle ki padhai** batane ke liye.' },
      dont: { wrong: 'I am from Hindi medium.', right: 'I studied in a Hindi-medium school.', why: '“Hindi medium” akela **adhoora** hai. School ya background jodo.' },
      tags: ['Interview', 'Study group']
    },
    {
      word: 'a little', ipa: '/ə ˈlɪtl/', say: 'अ लिटल', hindi: 'थोड़ा', meaning: 'thoda',
      use: { ex: 'I\'m a little nervous about the quiz.', why: '**“a little”** = thoda sa.' },
      dont: { wrong: 'I am little bit nervous.', right: 'I\'m a little bit nervous.', why: 'Bina “a” ke **“little”** ka matlab ulta ho jaata hai: **“lagbhag nahi”**. “A little” = thoda.' },
      tags: ['Dost', 'Viva']
    },
    {
      word: 'question', ipa: '/ˈkwestʃən/', say: 'क्वेश्चन', hindi: 'सवाल', meaning: 'sawaal',
      use: { ex: 'Can I ask a question about Week 3?', why: 'Live session ya forum pe sawaal poochhne ka **polite** tareeka.' },
      dont: { wrong: 'Sir, I have one doubt.', right: 'Sir, I have a question.', why: 'English mein **“doubt” = shak**. “I doubt it” = mujhe yakeen nahi. Sawaal ke liye **question**.' },
      tags: ['Live session', 'Forum']
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

  models: [
    { situation: 'Live session', en: 'Hi, I\'m Aman from Kanpur. I have a question about Week 3.', why: 'Chhota parichay, phir seedha **question**. “Doubt” nahi.' },
    { situation: 'Study group', en: 'Hi everyone, I\'m Aman. I\'m in the Foundation level, and I\'m looking for a study partner for Maths.', why: '**looking for** = dhoondh raha hoon. Group mein madad maangne ka seedha tareeka.' },
    { situation: 'Forum post', en: 'Hello, I\'m new here. I\'m stuck on Question 4 of the Week 2 assignment.', why: '**stuck on** = kisi sawaal pe atak gaya. Forum pe bahut kaam ka.' },
    { situation: 'Project viva', en: 'Good morning. I\'m Aman Verma, and my project is a simple library management app.', why: 'Viva mein naam ke baad **turant project** ki ek line.' },
    { situation: 'Internship interview', en: 'I\'m currently in the second year of the BS degree, and I\'m interested in data analysis.', why: '**currently** + **interested in**: aaj ke din ke do pakke shabd.' }
  ],

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

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
      uses: [
        { when: 'Jab koi poochhe ki **abhi kya padh rahe ho**', en: 'I\'m currently in the Foundation level.', hi: 'Main abhi Foundation level mein hoon.' },
        { when: 'Jab batana ho ki **abhi kya seekh rahe ho**', en: 'I\'m currently learning Python.', hi: 'Main abhi Python seekh raha hoon.' },
        { when: 'Jab interview mein **abhi ki padhai** batani ho', en: 'I\'m currently studying for a BS degree.', hi: 'Main abhi BS degree padh raha hoon.' }
      ],
      dont: { wrong: 'Currently I am doing BS from IITM.', right: 'I\'m currently studying at IIT Madras.', why: 'University ke saath **at** lagta hai, “from” nahi.' }
    },
    {
      word: 'enrolled', ipa: '/ɪnˈroʊld/', say: 'इनरोल्ड', hindi: 'दाख़िला लिया हुआ', meaning: 'course mein naam likha hua',
      uses: [
        { when: 'Jab koi poochhe ki **aap kis course mein ho**', en: 'I\'m enrolled in the BS degree.', hi: 'Main BS degree mein enrolled hoon.' },
        { when: 'Jab email mein batana ho ki **aap student ho**', en: 'I\'m enrolled in this course.', hi: 'Main is course ka student hoon.' },
        { when: 'Jab poochhna ho ki **course mein kitne log hain**', en: 'How many students are enrolled?', hi: 'Kitne students ne naam likhwaya hai?' }
      ],
      dont: { wrong: 'I am enrolled at the course.', right: 'I\'m enrolled in the course.', why: 'Course ke saath hamesha **in**.' }
    },
    {
      word: 'hometown', ipa: '/ˈhoʊmtaʊn/', say: 'होमटाउन', hindi: 'गृहनगर', meaning: 'apna shehar',
      uses: [
        { when: 'Jab koi poochhe **“Where are you from?”**', en: 'My hometown is Kanpur.', hi: 'Mera shehar Kanpur hai.' },
        { when: 'Jab batana ho ki **ab kahin aur rehte ho**', en: 'My hometown is Kanpur, but I live in Delhi.', hi: 'Mera shehar Kanpur hai, par main Delhi mein rehta hoon.' },
        { when: 'Jab **tyohaar pe ghar jaane** ki baat ho', en: 'I\'m going to my hometown for Diwali.', hi: 'Main Diwali pe apne shehar ja raha hoon.' }
      ],
      dont: { wrong: 'My native is Kanpur.', right: 'My hometown is Kanpur.', why: '“Native” akela **adhoora** lagta hai.' }
    },
    {
      word: 'finish', ipa: '/ˈfɪnɪʃ/', say: 'फ़िनिश', hindi: 'पूरा करना', meaning: 'khatam karna',
      uses: [
        { when: 'Jab batana ho ki **12vi kab poori ki**', en: 'I finished Class 12 in 2024.', hi: 'Maine 2024 mein 12vi poori ki.' },
        { when: 'Jab batana ho ki **assignment ho gaya**', en: 'I\'ve finished the assignment.', hi: 'Maine assignment poora kar liya.' },
        { when: 'Jab dost se poochhna ho ki **lecture dekh liya kya**', en: 'Have you finished Week 4?', hi: 'Kya tumne Week 4 poora kar liya?' }
      ],
      dont: { wrong: 'I passed out 12th in 2024.', right: 'I finished Class 12 in 2024.', why: '“Pass out” ka matlab **behosh hona** bhi hai.' }
    },
    {
      word: 'subject', ipa: '/ˈsʌbdʒɪkt/', say: 'सब्जेक्ट', hindi: 'विषय', meaning: 'padhai ka vishay',
      uses: [
        { when: 'Jab koi poochhe ki **kitne subjects padh rahe ho**', en: 'I\'m taking four subjects this term.', hi: 'Is term main chaar subject padh raha hoon.' },
        { when: 'Jab batana ho ki **koi subject mushkil lagta hai**', en: 'Statistics is a difficult subject for me.', hi: 'Statistics mere liye mushkil subject hai.' },
        { when: 'Jab dost ko **saath padhne** ke liye kehna ho', en: 'Can we study this subject together?', hi: 'Kya hum yeh subject saath padh sakte hain?' }
      ],
      dont: { wrong: 'I am weak in English.', right: 'I\'m not very good at English yet.', why: '**“yet”** se lagta hai aap seekh rahe ho.' }
    },
    {
      word: 'favourite', ipa: '/ˈfeɪvərɪt/', say: 'फ़ेवरिट', hindi: 'सबसे पसंदीदा', meaning: 'sabse pasand',
      uses: [
        { when: 'Jab koi poochhe ki **kya sabse pasand hai**', en: 'Maths is my favourite subject.', hi: 'Maths mera pasandida subject hai.' },
        { when: 'Jab **kisi lecture ki tareef** karni ho', en: 'This is my favourite lecture.', hi: 'Yeh mera sabse pasandida lecture hai.' },
        { when: 'Jab dost se **uski pasand** poochhni ho', en: 'What\'s your favourite subject?', hi: 'Tumhara pasandida subject kaunsa hai?' }
      ],
      dont: { wrong: 'My most favourite subject is Maths.', right: 'My favourite subject is Maths.', why: '“Favourite” mein **“sabse” pehle se** hai.' }
    },
    {
      word: 'good at', ipa: '/ɡʊd æt/', say: 'गुड ऐट', hindi: 'में माहिर', meaning: 'kisi kaam mein achha',
      uses: [
        { when: 'Jab interview mein **apni khoobi** batani ho', en: 'I\'m good at solving problems.', hi: 'Main problems solve karne mein achha hoon.' },
        { when: 'Jab batana ho ki **kaunsa subject achha hai**', en: 'I\'m good at Maths.', hi: 'Main Maths mein achha hoon.' },
        { when: 'Jab **kisi ki tareef** karni ho', en: 'You\'re really good at explaining.', hi: 'Tum samjhane mein bahut achhe ho.' }
      ],
      dont: { wrong: 'I am good in maths.', right: 'I\'m good at maths.', why: 'Skill ke saath hamesha **at**.' }
    },
    {
      word: 'confident', ipa: '/ˈkɑːnfɪdənt/', say: 'कॉन्फ़िडेंट', hindi: 'आत्मविश्वासी', meaning: 'khud pe bharosa',
      uses: [
        { when: 'Jab koi poochhe ki **quiz ki taiyaari kaisi hai**', en: 'I\'m confident about the quiz.', hi: 'Mujhe quiz ko lekar bharosa hai.' },
        { when: 'Jab batana ho ki **thoda darr hai**', en: 'I\'m not very confident yet.', hi: 'Mujhe abhi utna bharosa nahi hai.' },
        { when: 'Jab **kisi ko himmat** deni ho', en: 'Be confident. You can do it.', hi: 'Bharosa rakho, tum kar sakte ho.' }
      ],
      dont: { wrong: 'I am not having confidence.', right: 'I\'m not very confident.', why: '“have” ke saath **-ing nahi** lagta.' }
    },
    {
      word: 'interested in', ipa: '/ˈɪntrəstɪd ɪn/', say: 'इंट्रेस्टिड इन', hindi: 'में रुचि', meaning: 'mein dilchaspi',
      uses: [
        { when: 'Jab interview mein batana ho ki **kis cheez mein ruchi hai**', en: 'I\'m interested in data science.', hi: 'Mujhe data science mein dilchaspi hai.' },
        { when: 'Jab **kuch naya seekhne** ki ichha batani ho', en: 'I\'m interested in learning web development.', hi: 'Mujhe web development seekhne mein dilchaspi hai.' },
        { when: 'Jab **kisi ko group mein bulana** ho', en: 'Are you interested in joining our study group?', hi: 'Kya tum hamare study group mein judna chahoge?' }
      ],
      dont: { wrong: 'I am interested to data science.', right: 'I\'m interested in data science.', why: '“interested” ke baad hamesha **in**.' }
    },
    {
      word: 'looking forward to', ipa: '/ˈlʊkɪŋ ˈfɔːrwərd tə/', say: 'लुकिंग फ़ॉरवर्ड टू', hindi: 'उत्सुकता से इंतज़ार', meaning: 'khushi se intezaar',
      uses: [
        { when: 'Jab **email ke end** mein politely likhna ho', en: 'I\'m looking forward to your reply.', hi: 'Mujhe aapke jawab ka intezaar rahega.' },
        { when: 'Jab **kisi se milne ki khushi** batani ho', en: 'I\'m looking forward to meeting you.', hi: 'Mujhe aapse milne ka intezaar hai.' },
        { when: 'Jab **agle session** ki baat ho', en: 'I\'m looking forward to the next session.', hi: 'Mujhe agle session ka intezaar hai.' }
      ],
      dont: { wrong: 'I am looking forward to meet you.', right: 'I\'m looking forward to meeting you.', why: 'Is jodi mein “to” ke baad **-ing**.' }
    },
    {
      word: 'feel free', ipa: '/fiːl friː/', say: 'फ़ील फ़्री', hindi: 'बेझिझक', meaning: 'bina jhijhak ke',
      uses: [
        { when: 'Jab group mein **madad offer** karni ho', en: 'Feel free to message me.', hi: 'Bejhijhak mujhe message karo.' },
        { when: 'Jab kisi ko **sawaal poochhne** ko kehna ho', en: 'Feel free to ask questions.', hi: 'Bejhijhak sawaal poochho.' },
        { when: 'Jab kisi se **apni galti sudharwani** ho', en: 'Please feel free to correct me.', hi: 'Bejhijhak meri galti sudhaariye.' }
      ],
      dont: { wrong: 'Feel free for asking.', right: 'Feel free to ask.', why: '“feel free” ke baad **to + verb**.' }
    },
    {
      word: 'introduce', ipa: '/ˌɪntrəˈduːs/', say: 'इंट्रोड्यूस', hindi: 'परिचय कराना', meaning: 'parichay dena',
      uses: [
        { when: 'Jab **viva ya meeting shuru** karni ho', en: 'Let me introduce myself.', hi: 'Main apna parichay deta hoon.' },
        { when: 'Jab **dost ko doosron se milwana** ho', en: 'Let me introduce my friend, Riya.', hi: 'Main apni dost Riya se milwata hoon.' },
        { when: 'Jab **naye group** mein judna ho', en: 'Can you introduce me to the group?', hi: 'Kya tum mujhe group se milwa sakte ho?' }
      ],
      dont: { wrong: 'Myself Aman.', right: 'I\'m Aman.', why: '“Myself” se **sentence shuru nahi** hota.' }
    },
    {
      word: 'background', ipa: '/ˈbækɡraʊnd/', say: 'बैकग्राउंड', hindi: 'पृष्ठभूमि', meaning: 'pehle ki padhai',
      uses: [
        { when: 'Jab **apni pichhli padhai** batani ho', en: 'I\'m from a Hindi-medium background.', hi: 'Main Hindi-medium background se hoon.' },
        { when: 'Jab batana ho ki **pehle kaunsa stream** tha', en: 'I have a commerce background.', hi: 'Meri padhai commerce ki hai.' },
        { when: 'Jab interview mein **padhai ka area** batana ho', en: 'My background is in science.', hi: 'Meri padhai science ki hai.' }
      ],
      dont: { wrong: 'I am from Hindi medium.', right: 'I studied in a Hindi-medium school.', why: '“Hindi medium” ke saath **school** jodo.' }
    },
    {
      word: 'a little', ipa: '/ə ˈlɪtl/', say: 'अ लिटल', hindi: 'थोड़ा', meaning: 'thoda',
      uses: [
        { when: 'Jab **thoda darr** batana ho', en: 'I\'m a little nervous.', hi: 'Main thoda ghabraaya hua hoon.' },
        { when: 'Jab teacher ko **dheere bolne** ko kehna ho', en: 'Can you speak a little slower, please?', hi: 'Kya aap thoda dheere bol sakte hain?' },
        { when: 'Jab batana ho ki **thoda samajh aaya**', en: 'I understood a little.', hi: 'Mujhe thoda samajh aaya.' }
      ],
      dont: { wrong: 'I am little bit nervous.', right: 'I\'m a little bit nervous.', why: 'Bina **“a”** ke matlab badal jaata hai.' }
    },
    {
      word: 'question', ipa: '/ˈkwestʃən/', say: 'क्वेश्चन', hindi: 'सवाल', meaning: 'sawaal',
      uses: [
        { when: 'Jab **live session mein sawaal** poochhna ho', en: 'Can I ask a question?', hi: 'Kya main ek sawaal poochh sakta hoon?' },
        { when: 'Jab **email mein sawaal** likhna ho', en: 'I have a question about the assignment.', hi: 'Mera assignment ke baare mein ek sawaal hai.' },
        { when: 'Jab **koi achha sawaal** poochhe', en: 'That\'s a good question.', hi: 'Yeh achha sawaal hai.' }
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

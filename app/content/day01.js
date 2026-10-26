// Day 1 lesson content. Level: learners who know basic English but translate from Hindi
// and freeze in real situations. Every rule carries a "why".
window.LESSONS = window.LESSONS || {};
window.LESSONS[1] = {
  day: 1,
  week: 1,
  title: 'Self Introduction',
  subtitle: 'Interview aur office mein apna parichay',
  minutes: 30,
  next: { day: 2, title: 'Is / Am / Are' },

  reading: {
    title: 'Tell Me About Yourself',
    lines: [
      { en: 'Good morning. I\'m Priya Sharma, and I\'m originally from Lucknow.', hi: 'Good morning. Main Priya Sharma hoon, aur main mool roop se Lucknow se hoon.' },
      { en: 'I graduated from Lucknow University with a B.Com in 2023.', hi: 'Maine 2023 mein Lucknow University se B.Com kiya.' },
      { en: 'Currently, I work as an accounts assistant at a small firm in Noida, so I\'m based in Delhi.', hi: 'Abhi main Noida ki ek chhoti firm mein accounts assistant hoon, isliye main Delhi mein rehti hoon.' },
      { en: 'I\'m responsible for billing, and I have one year of experience in handling customer accounts.', hi: 'Billing meri zimmedari hai, aur mujhe customer accounts sambhalne ka ek saal ka experience hai.' },
      { en: 'I\'m interested in finance, and I\'m looking forward to learning more in this role.', hi: 'Mujhe finance mein dilchaspi hai, aur main is role mein aur seekhne ke liye utsuk hoon.' }
    ],
    grammarWords: ['I\'m', 'have', 'work'],
    vocabWords: ['originally', 'graduated', 'Currently', 'based in', 'responsible for', 'experience', 'interested in', 'looking forward'],
    questions: [
      { q: 'Priya mool roop se kahan ki hai, aur abhi kahan rehti hai?', a: 'Lucknow ki hai, abhi Delhi mein rehti hai.' },
      { q: 'Priya abhi kya kaam karti hai?', a: 'Noida ki ek firm mein accounts assistant hai, billing sambhalti hai.' },
      { q: 'Uske jawab ka aakhri sentence kya batata hai?', a: 'Ki use finance mein interest hai aur woh is role mein seekhna chahti hai.' }
    ]
  },

  words: [
    {
      word: 'originally', ipa: '/əˈrɪdʒənəli/', say: 'ओरिजिनली', meaning: 'mool roop se (jahan ke ho)',
      use: { ex: 'I\'m originally from Patna, but I live in Pune now.', why: 'Jab **paida hone ki jagah** aur **abhi rehne ki jagah** alag ho, tab dono saaf ho jaate hain.' },
      dont: { wrong: 'I am originally belong to Patna.', right: 'I\'m originally from Patna.', why: '“belong” khud verb hai, “am” ke saath takrata hai. **“originally from”** kaafi hai.' },
      tags: ['Interview', 'Pehli mulaqaat']
    },
    {
      word: 'currently', ipa: '/ˈkɜːrəntli/', say: 'करेंटली', meaning: 'abhi, filhaal',
      use: { ex: 'I currently work at an IT company.', why: 'Aapki **abhi ki** naukri ya padhai batane ke liye.' },
      dont: { wrong: 'Currently I am doing job in TCS.', right: 'I currently work at TCS.', why: '**“Doing job”** English mein nahi bolte. Company ke saath **“at”**: work at TCS.' },
      tags: ['Interview', 'Office']
    },
    {
      word: 'based in', ipa: '/beɪst ɪn/', say: 'बेस्ट इन', meaning: '(kaam ke liye) yahan rehta hoon',
      use: { ex: 'I\'m based in Bangalore.', why: 'Kaam ke hisaab se kahan rehte ho, yeh batane ka **professional** tareeka.' },
      dont: { wrong: 'I am based at Bangalore.', right: 'I\'m based in Bangalore.', why: 'Shehar ke saath **“in”**. “At” ek khaas jagah ke liye (at the office).' },
      tags: ['Interview', 'Office']
    },
    {
      word: 'pursuing', ipa: '/pərˈsuːɪŋ/', say: 'परस्यूइंग', meaning: '(degree) kar raha hoon',
      use: { ex: 'I\'m pursuing a B.Tech in computer science.', why: 'Chal rahi **degree ya course** ke liye formal shabd.' },
      dont: { wrong: 'I am pursuing my 12th.', right: 'I\'m in Class 12.', why: '“Pursuing” **degree / course** ke liye hai. School ke liye seedha: I\'m in Class 12.' },
      tags: ['Interview', 'College']
    },
    {
      word: 'graduate', ipa: '/ˈɡrædʒuət/', say: 'ग्रैजुएट', meaning: 'snatak (degree poori)',
      use: { ex: 'I graduated from Delhi University in 2022.', why: 'Degree poori hone ke liye verb **graduated from**.' },
      dont: { wrong: 'I have done my graduation from Delhi University.', right: 'I graduated from Delhi University.', why: '“Done my graduation” Hindi “graduation kiya” ka translation hai. Natural English mein verb hi kaafi: **graduated**.' },
      tags: ['Interview']
    },
    {
      word: 'fresher', ipa: '/ˈfreʃər/', say: 'फ्रेशर', meaning: 'pehli naukri dhoondhne wala',
      use: { ex: 'I\'m a fresher, so I\'m ready to learn.', why: 'India mein job ke liye sab samajhte hain. **“a”** zaroor lagao.' },
      dont: { wrong: 'I am fresher.', right: 'I\'m a fresher.', why: 'Kisi insaan ki pehchaan se pehle **“a”**: a fresher, a student.' },
      note: 'Videsh ki company ke interview mein **“recent graduate”** bolo. “Fresher” wahan kam samjha jaata hai.',
      tags: ['Interview']
    },
    {
      word: 'experience', ipa: '/ɪkˈspɪriəns/', say: 'एक्सपीरियंस', meaning: 'anubhav',
      use: { ex: 'I have two years of experience in sales.', why: 'Experience **paas hota** hai, isliye **have**. Kitna → “of”.' },
      dont: { wrong: 'I am having two years experience.', right: 'I have two years of experience.', why: '“have” (paas hona) ek haalat hai, isliye **-ing nahi** lagta. Aur saalon ke baad **“of”**.' },
      tags: ['Interview', 'Resume']
    },
    {
      word: 'responsible for', ipa: '/rɪˈspɑːnsəbl fɔːr/', say: 'रिस्पॉन्सिबल फ़ॉर', meaning: 'kis cheez ki zimmedari',
      use: { ex: 'I\'m responsible for customer accounts.', why: 'Aapka **kaam kya hai**, yeh seedha batata hai. Interview mein bahut kaam ka.' },
      dont: { wrong: 'I am responsible of accounts.', right: 'I\'m responsible for accounts.', why: '**“responsible for”** fixed jodi hai. “of” nahi lagta.' },
      tags: ['Interview', 'Office']
    },
    {
      word: 'interested in', ipa: '/ˈɪntrəstɪd ɪn/', say: 'इंट्रेस्टिड इन', meaning: 'mein dilchaspi',
      use: { ex: 'I\'m interested in digital marketing.', why: 'Cheez ke saath **in**. Kaam ke saath -ing: interested in learning.' },
      dont: { wrong: 'I am interested to marketing.', right: 'I\'m interested in marketing.', why: '“interested” ke baad **“in”**. “to” ke baad aap koi kaam nahi, cheez bata rahe ho.' },
      tags: ['Interview', 'College']
    },
    {
      word: 'passionate about', ipa: '/ˈpæʃənət əˈbaʊt/', say: 'पैशनेट अबाउट', meaning: 'bahut zyada lagaav',
      use: { ex: 'I\'m passionate about teaching.', why: '“Interested” se **zyada** gehra lagaav dikhata hai.' },
      dont: { wrong: 'I am passionate for cricket.', right: 'I\'m passionate about cricket.', why: '“passionate” ke saath **“about”** lagta hai.' },
      tags: ['Interview']
    },
    {
      word: 'strength', ipa: '/streŋθ/', say: 'स्ट्रेंथ', meaning: 'khoobi, taakat',
      use: { ex: 'My biggest strength is patience.', why: 'Interview ka pakka sawaal: **“What are your strengths?”**' },
      dont: { wrong: 'My strength is I am hard work.', right: 'I\'m hardworking. / My strength is hard work.', why: '“Hard work” **cheez** hai. Insaan ke liye **“hardworking”**.' },
      tags: ['Interview']
    },
    {
      word: 'free time', ipa: '/friː taɪm/', say: 'फ्री टाइम', meaning: 'khaali samay',
      use: { ex: 'In my free time, I like reading.', why: 'Hobby batane ka **natural** tareeka.' },
      dont: { wrong: 'My hobbies are reading books, listening music.', right: 'In my free time, I like reading and listening to music.', why: '“listen **to** music”, “to” zaroori. Aur “my hobbies are …” **school essay** jaisa lagta hai.' },
      tags: ['Interview', 'Dost']
    },
    {
      word: 'handle', ipa: '/ˈhændl/', say: 'हैंडल', meaning: 'sambhalna',
      use: { ex: 'I handle customer complaints.', why: 'Kaam ya zimmedari sambhalna: **handle + cheez**.' },
      dont: { wrong: 'I handle with customers.', right: 'I deal with customers.', why: '“handle” ke baad **“with” nahi**. “With” sirf “deal with” mein lagta hai.' },
      tags: ['Office', 'Interview']
    },
    {
      word: 'looking forward to', ipa: '/ˈlʊkɪŋ ˈfɔːrwərd tə/', say: 'लुकिंग फ़ॉरवर्ड टू', meaning: 'intezaar hai (khushi se)',
      use: { ex: 'I\'m looking forward to working with you.', why: 'Interview ya email **khatam** karne ka polite tareeka.' },
      dont: { wrong: 'I am looking forward to work with you.', right: 'I\'m looking forward to working with you.', why: 'Is jodi mein **“to” ke baad -ing** aata hai. Yeh khaas rule hai, yaad rakho.' },
      tags: ['Interview', 'Email']
    },
    {
      word: 'basically', ipa: '/ˈbeɪsɪkli/', say: 'बेसिकली', meaning: 'seedhi baat mein',
      use: { ex: 'The job is basically about sales.', why: 'Lambi baat ko **ek line** mein samjhane ke liye. **Kabhi kabhi**.' },
      dont: { wrong: 'Basically I am from Patna, basically I did B.Com.', right: 'I\'m from Patna. I did my B.Com there.', why: 'Har sentence mein “basically” lagane se aap **ghabraaye hue** lagte ho. Hata do, aap confident lagoge.' },
      tags: ['Interview', 'Office']
    }
  ],

  grammar: {
    what: 'Achha parichay **3 hisson** mein hota hai: kaun ho, kahan se ho, aur kya karte ho. Saath mein ek **khaas baat**. Galtiyan wahan hoti hain jahan hum Hindi se shabd-dar-shabd translate karte hain.',
    formula: ['Naam + jagah', 'kaam / padhai', 'ek khaas baat'],
    pairs: [
      { hi: 'Main mool roop se Lucknow se', hiVerb: 'hoon', en: 'I\'m', enVerb: 'originally from Lucknow' },
      { hi: 'Abhi main Delhi mein', hiVerb: 'rehti hoon', en: 'I\'m', enVerb: 'based in Delhi' },
      { hi: 'Mujhe 2 saal ka experience', hiVerb: 'hai', en: 'I', enVerb: 'have 2 years of experience' },
      { hi: 'Main sales mein', hiVerb: 'kaam karta hoon', en: 'I', enVerb: 'work in sales' }
    ],
    rules: [
      {
        title: '“Myself …” se shuru mat karo',
        wrong: 'Myself Priya Sharma.', right: ['I\'m Priya Sharma.', 'My name is Priya Sharma.'],
        why: '“Myself” tab lagta hai jab kaam **khud pe** ho: “I hurt myself.” Naam batane ke liye sentence ko **subject** chahiye: **I\'m**.'
      },
      {
        title: 'Experience: have, “am having” nahi',
        wrong: 'I am having 2 years of experience.', right: ['I have 2 years of experience.'],
        why: '“have” yahan **paas hona** hai, jo ek haalat hai. Haalat wale verb ke saath **-ing nahi** lagta.'
      },
      {
        title: 'Padhai: graduated from',
        wrong: 'I have done my graduation from Delhi University in 2022.', right: ['I graduated from Delhi University in 2022.', 'I did my B.Com at Delhi University.'],
        why: 'Saal bata diya (2022) to baat **beet chuki** hai: simple past. Aur “done my graduation” ki jagah seedha verb **graduated**.'
      },
      {
        title: '“What do you do?” = aapka kaam',
        wrong: 'I am doing job.', right: ['I work as an accountant.', 'I\'m a student. I\'m in my final year of B.Sc.'],
        why: '**“Doing job”** English mein nahi bolte. Kaam ke liye **work as + post**, ya **I\'m a + post**.'
      },
      {
        title: '“How are you?” ka natural jawab',
        wrong: 'I am fine. (aur chup)', right: ['I\'m good, thanks. How about you?', 'Not bad. How are things with you?'],
        why: 'Sirf “I am fine” **robot jaisa** lagta hai. Natural baat-cheet mein jawab ke saath **sawaal wapas** poochhte hain.'
      },
      {
        title: 'Bolte waqt I\'m, I\'ve',
        right: ['I am → I\'m', 'I have → I\'ve', 'You are → You\'re'],
        why: 'Bolchaal mein **short form** natural aur tez lagta hai. Har jagah “I am … I am …” bolne se **ratta** jaisa lagta hai. Formal likhai mein “I am” theek hai.'
      }
    ]
  },

  models: [
    { situation: 'Interview', en: 'I\'m Rohan. I\'m originally from Indore, and I graduated in mechanical engineering last year.', why: 'Naam, jagah, padhai: **3 hisse** ek saath, saaf aur chhote.' },
    { situation: 'Office ka pehla din', en: 'Hi, I\'m Rohan. I\'ve just joined the marketing team.', why: '**“I\'ve just joined”** = abhi abhi join kiya. Naye logon se milne ka best tareeka.' },
    { situation: 'Formal phone call', en: 'Hi, this is Priya from ABC Finance. Am I speaking to Mr Verma?', why: 'Phone pe apna parichay **“this is … from …”** se. “I am Priya speaking” nahi.' },
    { situation: 'Naye logon se baat', en: 'So, what do you do? I work in sales at a car company. How about you?', why: 'Jawab ke baad **“How about you?”** se baat aage badhti hai.' },
    { situation: 'Kisi ka parichay', en: 'Rahul, this is Neha. She\'s our new designer.', why: 'Kisi ko milwane ke liye **“this is”** + ek line ki pehchaan.' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Interview mein kaunsa sahi hai?', q: '', options: ['Myself Priya Sharma.', 'I\'m Priya Sharma.'], answer: 'I\'m Priya Sharma.', why: '“Myself” **subject nahi** ban sakta. Naam ke liye **I\'m**.' },
      { prompt: 'Sahi shabd chuno', q: 'I ___ two years of experience.', options: ['am having', 'have', 'having'], answer: 'have', why: 'Experience paas hona = haalat, isliye **have**, -ing nahi.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am interested to marketing.', 'I\'m interested in marketing.'], answer: 'I\'m interested in marketing.', why: '**interested in** + cheez.' },
      { prompt: 'Sahi shabd chuno', q: 'I\'m looking forward to ___ with you.', options: ['work', 'working'], answer: 'working', why: '“looking forward to” ke baad **-ing**.' },
      { prompt: 'Kaunsa zyada natural hai?', q: '', options: ['I have done my graduation from Delhi University in 2022.', 'I graduated from Delhi University in 2022.'], answer: 'I graduated from Delhi University in 2022.', why: 'Saal bataya hai, to **simple past**. Aur verb **graduated** seedha.' },
      { prompt: '“What do you do?” ka sahi jawab', q: '', options: ['I am doing job.', 'I work as an accountant.'], answer: 'I work as an accountant.', why: '**work as + post**. “Doing job” nahi bolte.' },
      { prompt: '“How are you?” ka sabse natural jawab', q: '', options: ['I am fine.', 'I\'m good, thanks. How about you?'], answer: 'I\'m good, thanks. How about you?', why: 'Jawab ke saath **sawaal wapas**. Baat-cheet aage badhti hai.' },
      { prompt: 'Sahi shabd chuno', q: 'I\'m currently based ___ Pune.', options: ['at', 'in', 'on'], answer: 'in', why: 'Shehar ke saath **in**.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['My hobby is listening music.', 'I like listening to music.'], answer: 'I like listening to music.', why: '“listen **to** music”. Aur “I like …” zyada natural.' },
      { prompt: 'Formal phone call pe apna parichay', q: '', options: ['I am Priya speaking.', 'Hi, this is Priya from ABC Finance.'], answer: 'Hi, this is Priya from ABC Finance.', why: 'Phone pe **“this is … from …”**.' }
    ]
  },

  speak: [
    'I\'m originally from Patna, but I\'m currently based in Pune.',
    'I have two years of experience in sales.',
    'I\'m looking forward to working with you.'
  ],

  write: {
    intro: 'Interview ke liye apna parichay 3 sentence mein likho. Asli jaankari likho.',
    items: [
      { label: 'Naam aur jagah', placeholder: 'Jaise: I\'m Priya, and I\'m originally from Lucknow.', pattern: '^(?!.*\\bmyself\\b).*\\bi(\'m| am)\\b.*\\bfrom [a-z]+', ok: '**I\'m** se shuru, aur jagah **from** se. Bilkul sahi!', fix: '“Myself” mat likho. Likho: **I\'m** + naam, **I\'m originally from** + shehar.' },
      { label: 'Experience ya padhai', placeholder: 'Jaise: I have two years of experience in sales.', pattern: '^(?!.*\\bam having\\b)(?!.*\\bdone my graduation\\b).*(\\bi (have|\'ve) [a-z0-9 ]*experience\\b|\\bi\'ve [a-z0-9 ]*experience\\b|\\bi(\'m| am) (pursuing|a fresher|a student|in class)\\b|\\bi graduated\\b)', ok: 'Experience ke liye **have**, padhai ke liye **graduated / pursuing**. Sahi!', fix: 'Likho: **I have** … years of experience, ya **I graduated from** …, ya **I\'m pursuing** … “am having” mat likho.' },
      { label: 'Interest ya aage ka plan', placeholder: 'Jaise: I\'m interested in finance.', pattern: '\\binterested in [a-z]+|\\blooking forward to [a-z]+ing\\b|\\bpassionate about [a-z]+', ok: 'Sahi jodi: **interested in / looking forward to …ing**. Shabash!', fix: 'Likho: I\'m **interested in** + cheez, ya I\'m **looking forward to** + verb**ing**.' }
    ]
  }
};

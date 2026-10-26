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
      use: {
        ex: 'I\'m currently in the Foundation level.', hi: 'Main abhi Foundation level mein hoon.',
        why: '**currently** batata hai ki yeh baat **abhi ke liye** sach hai, hamesha ke liye nahi. Kuch mahino baad aap Diploma level mein honge, isliye “currently”. Parichay aur interview mein yeh shabd **professional** lagta hai.',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'currently', hi: 'abhi', key: true, why: 'Abhi ki haalat, jo **baad mein badal** sakti hai.' },
          { en: 'in', hi: 'mein', why: 'Level, class, course ke **andar** hone ke liye “in”.' },
          { en: 'the Foundation level', hi: 'Foundation level', why: '“the” kyunki ek **khaas** level ki baat hai.' }
        ]
      },
      scene: { where: 'Live session', a: { who: 'TA', text: 'Which level are you in?' }, b: { who: 'Aap', text: 'I\'m currently in the Foundation level.' } },
      dont: { wrong: 'Currently I am doing BS from IITM.', right: 'I\'m currently studying for a BS at IIT Madras.', why: '“Doing BS **from** IITM” Hindi ke “IITM **se** BS kar raha hoon” ka seedha translation hai. English mein university ke saath **“at”** lagta hai (at IIT Madras). Aur “doing BS” se zyada saaf hai **“studying for a BS”**.' },
      more: [
        { en: 'I\'m currently learning Python.', hi: 'Main abhi Python seekh raha hoon.' },
        { en: 'She\'s currently doing an internship in Bangalore.', hi: 'Woh abhi Bangalore mein internship kar rahi hai.' }
      ],
      tip: 'currently = **abhi ke liye**. Jo baat kuch mahino mein badal sakti hai, uske saath lagao.',
      tags: ['Live session', 'Interview']
    },
    {
      word: 'enrolled', ipa: '/ɪnˈroʊld/', say: 'इनरोल्ड', hindi: 'दाख़िला लिया हुआ', meaning: 'course / degree mein naam likha hua',
      use: {
        ex: 'I\'m enrolled in the BS degree programme.', hi: 'Mera naam BS degree course mein likha hua hai.',
        why: '**enrolled** = kisi course mein **officially naam likha hona**. Sirf “I\'m studying” se zyada pakka aur formal lagta hai, isliye **email, form aur interview** mein kaam aata hai. Yeh **-ed** wala roop hai kyunki yeh aapki **haalat** batata hai: naam likha hua hai.',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'enrolled', hi: 'naam likha hua', key: true, why: '**Haalat** batata hai, isliye -ed roop.' },
          { en: 'in', hi: 'mein', why: 'Course ke **andar** ho, isliye “in”.' },
          { en: 'the BS degree programme', hi: 'BS degree ka course', why: '“the” kyunki ek **khaas** programme.' }
        ]
      },
      scene: { where: 'Support ko email', a: { who: 'Support', text: 'Please confirm that you are a student.' }, b: { who: 'Aap', text: 'Yes, I\'m enrolled in the BS degree programme. My roll number is given below.' } },
      dont: { wrong: 'I am enrolled at the course.', right: 'I\'m enrolled in the course.', why: 'Course, programme, class ke saath **“in”** lagta hai, kyunki aap uske **andar** ho. “At” **jagah** ke liye hota hai, jaise “at IIT Madras”. Yaad rakho: enrolled **in** a course, studying **at** a university.' },
      more: [
        { en: 'I enrolled in two new courses this term.', hi: 'Is term maine do naye courses mein naam likhwaya.' },
        { en: 'How many students are enrolled in this course?', hi: 'Is course mein kitne students ka naam likha hai?' }
      ],
      tip: 'Course ke saath **in**, university ke saath **at**.',
      tags: ['College', 'Email']
    },
    {
      word: 'hometown', ipa: '/ˈhoʊmtaʊn/', say: 'होमटाउन', hindi: 'गृहनगर', meaning: 'apna shehar, jahan ke ho',
      use: {
        ex: 'My hometown is Kanpur.', hi: 'Mera shehar Kanpur hai.',
        why: '**hometown** = woh shehar jahan aap **bade hue**, chahe ab kahin aur rehte ho. Parichay mein ek chhoti, personal baat jodta hai, jisse log aapko **yaad rakhte** hain aur baat aage badhti hai.',
        parts: [
          { en: 'My', hi: 'mera' },
          { en: 'hometown', hi: 'apna shehar', key: true, why: 'home + town = **ghar wala shehar**.' },
          { en: 'is', hi: 'hai', why: 'Ek shehar, isliye **is**.' },
          { en: 'Kanpur', hi: 'Kanpur' }
        ]
      },
      scene: { where: 'Study group', a: { who: 'Riya', text: 'Where are you from?' }, b: { who: 'Aap', text: 'My hometown is Kanpur, but I live in Lucknow now.' } },
      dont: { wrong: 'My native is Kanpur.', right: 'My hometown is Kanpur.', why: '“My native is Kanpur” India mein bahut sunte hain, par **“native” akela** is tarah use nahi hota, isliye sentence adhoora lagta hai. Natural English mein **“My hometown is Kanpur”** ya seedha **“I\'m from Kanpur”**.' },
      more: [
        { en: 'I go back to my hometown every Diwali.', hi: 'Main har Diwali apne shehar wapas jaata hoon.' },
        { en: 'Patna is my hometown, but I study in Delhi.', hi: 'Patna mera shehar hai, par main Delhi mein padhta hoon.' }
      ],
      tip: 'Home + town = **ghar wala shehar**.',
      tags: ['Pehli mulaqaat', 'Study group']
    },
    {
      word: 'finish', ipa: '/ˈfɪnɪʃ/', say: 'फ़िनिश', hindi: 'पूरा करना', meaning: 'khatam / poora karna',
      use: {
        ex: 'I finished Class 12 in 2024.', hi: 'Maine 2024 mein 12vi poori ki.',
        why: '**finish** = koi kaam ya padhai **poori karna**. Yahan saal (2024) bataya hai, matlab baat **beet chuki**, isliye past roop **finished**. Interview mein 12vi ki baat batane ka sabse saaf tareeka.',
        parts: [
          { en: 'I', hi: 'maine' },
          { en: 'finished', hi: 'poori ki', key: true, why: 'Past roop, kyunki **2024 beet** gaya.' },
          { en: 'Class 12', hi: '12vi' },
          { en: 'in 2024', hi: '2024 mein', why: 'Saal ke saath **“in”**.' }
        ]
      },
      scene: { where: 'Internship interview', a: { who: 'Interviewer', text: 'When did you finish school?' }, b: { who: 'Aap', text: 'I finished Class 12 in 2024.' } },
      dont: { wrong: 'I passed out 12th in 2024.', right: 'I finished Class 12 in 2024.', why: 'India mein “passed out” ka matlab hai “padhai poori ki”, par baaki duniya mein **“pass out” = behosh ho jaana**! Interviewer ko lag sakta hai aap 2024 mein behosh ho gaye the. Isliye **finished / completed** bolo.' },
      more: [
        { en: 'I\'ll finish the assignment by Sunday.', hi: 'Main Sunday tak assignment poora kar lunga.' },
        { en: 'Have you finished the Week 4 lectures?', hi: 'Kya tumne Week 4 ke lecture poore kar liye?' }
      ],
      tip: '“Pass out” sirf **behoshi** ke liye. Padhai ke liye **finish**.',
      tags: ['Interview', 'Live session']
    },
    {
      word: 'subject', ipa: '/ˈsʌbdʒɪkt/', say: 'सब्जेक्ट', hindi: 'विषय', meaning: 'padhai ka vishay',
      use: {
        ex: 'Statistics is a difficult subject for me.', hi: 'Statistics mere liye ek mushkil subject hai.',
        why: '**subject** = padhai ka vishay. **“for me”** jodne se baat **aapki apni** ho jaati hai: aapko mushkil lagta hai, sabko nahi. Study group mein madad maangne se pehle aise shuru karna natural aur polite hai.',
        parts: [
          { en: 'Statistics', hi: 'subject ka naam' },
          { en: 'is', hi: 'hai' },
          { en: 'a difficult subject', hi: 'ek mushkil vishay', key: true, why: '“a” kyunki kai subjects mein se **ek**.' },
          { en: 'for me', hi: 'mere liye', why: 'Aapki **apni raay**, sabki nahi.' }
        ]
      },
      scene: { where: 'Study group', a: { who: 'Kabir', text: 'Which subject do you find hard?' }, b: { who: 'Aap', text: 'Statistics is a difficult subject for me. Can we revise it together?' } },
      dont: { wrong: 'I am weak in English.', right: 'I\'m not very good at English yet.', why: '“I am weak in English” samjha to jaata hai, par yeh **khud ko neeche** dikhata hai. **“not very good at … yet”** mein **“yet” (abhi tak)** batata hai ki aap **seekh rahe ho** aur sudhar rahe ho. Interview mein yeh farak bahut maayne rakhta hai.' },
      more: [
        { en: 'Maths is my strongest subject.', hi: 'Maths mera sabse mazboot subject hai.' },
        { en: 'Which subjects are you taking this term?', hi: 'Is term tum kaunse subjects le rahe ho?' }
      ],
      tip: 'Kamzori batate waqt **yet** jodo: not good at it **yet**.',
      tags: ['Study group', 'Interview']
    },
    {
      word: 'favourite', ipa: '/ˈfeɪvərɪt/', say: 'फ़ेवरिट', hindi: 'सबसे पसंदीदा', meaning: 'sabse pasand',
      use: {
        ex: 'Maths is my favourite subject.', hi: 'Maths mera sabse pasandida subject hai.',
        why: '**favourite** = kai cheezon mein se **sabse zyada pasand**. Parichay mein ek favourite cheez batane se log aapse **baat aage badha** paate hain.',
        parts: [
          { en: 'Maths', hi: 'Maths' },
          { en: 'is', hi: 'hai' },
          { en: 'my favourite', hi: 'mera sabse pasandida', key: true, why: 'Is shabd mein **“sabse” pehle se** chhupa hai.' },
          { en: 'subject', hi: 'vishay' }
        ]
      },
      scene: { where: 'Live session', a: { who: 'Instructor', text: 'Tell us one thing you enjoy.' }, b: { who: 'Aap', text: 'Maths is my favourite subject. I enjoy solving puzzles.' } },
      dont: { wrong: 'My most favourite subject is Maths.', right: 'My favourite subject is Maths.', why: '“Favourite” ka matlab hi **“sabse pasand”** hai, isliye “most favourite” mein “sabse” **do baar** ho jaata hai: “sabse sabse pasand”. Bas **my favourite** kaafi hai.' },
      more: [
        { en: 'What\'s your favourite programming language?', hi: 'Tumhari pasandida programming language kaunsi hai?' },
        { en: 'This is my favourite lecture so far.', hi: 'Ab tak ka mera sabse pasandida lecture yeh hai.' }
      ],
      tip: 'Favourite = sabse pasand. **most** mat jodo.',
      note: 'Spelling: **favourite** (British, India mein yahi chalta hai) aur **favorite** (American). Dono sahi hain.',
      tags: ['Study group', 'Dost']
    },
    {
      word: 'good at', ipa: '/ɡʊd æt/', say: 'गुड ऐट', hindi: 'में माहिर', meaning: 'kisi kaam mein achha',
      use: {
        ex: 'I\'m good at solving problems.', hi: 'Main problems solve karne mein achha hoon.',
        why: '**good at** batata hai ki aap kisi **kaam ya skill** mein achhe ho. Kaam ho to uske baad **verb + ing** (solving), subject ho to seedha naam (good at maths). Interview ka pakka sawaal: **“What are you good at?”**',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'good at', hi: 'mein achha', key: true, why: 'Skill ke saath **hamesha “at”**.' },
          { en: 'solving', hi: 'solve karna', why: '“at” ke baad kaam ho to **-ing**.' },
          { en: 'problems', hi: 'sawaal' }
        ]
      },
      scene: { where: 'Project viva', a: { who: 'Examiner', text: 'What was your role in this project?' }, b: { who: 'Aap', text: 'I\'m good at solving problems, so I wrote the main logic.' } },
      dont: { wrong: 'I am good in maths.', right: 'I\'m good at maths.', why: 'Hindi mein “maths **mein** achha” bolte hain, isliye “in” aa jaata hai. Par English mein skill ke saath **“at”** fixed hai: good **at**, bad **at**, better **at**. “In” ka matlab hota hai kisi cheez ke **andar**.' },
      more: [
        { en: 'She\'s really good at explaining concepts.', hi: 'Woh concepts samjhane mein bahut achhi hai.' },
        { en: 'I\'m not very good at public speaking yet.', hi: 'Main abhi sabke saamne bolne mein utna achha nahi hoon.' }
      ],
      tip: 'Skill = **at**. good at, bad at, better at.',
      tags: ['Interview', 'Viva']
    },
    {
      word: 'confident', ipa: '/ˈkɑːnfɪdənt/', say: 'कॉन्फ़िडेंट', hindi: 'आत्मविश्वासी', meaning: 'khud pe bharosa',
      use: {
        ex: 'I\'m confident about the quiz.', hi: 'Mujhe quiz ko lekar bharosa hai.',
        why: '**confident** = khud pe bharosa. Kis baat ko lekar bharosa hai, woh **about** se batate hain. Yeh **haalat** batane wala shabd hai, isliye seedha **I\'m confident** bolte hain.',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'confident', hi: 'bharose mein', key: true, why: '**Haalat** batane wala shabd.' },
          { en: 'about', hi: 'ke baare mein', why: 'Kis cheez ko lekar: **about**.' },
          { en: 'the quiz', hi: 'quiz' }
        ]
      },
      scene: { where: 'Dost se', a: { who: 'Dost', text: 'Are you ready for Quiz 1?' }, b: { who: 'Aap', text: 'Yes, I\'m confident about it. I solved all the practice questions.' } },
      dont: { wrong: 'I am not having confidence.', right: 'I\'m not very confident.', why: 'Isme do galtiyan hain: (1) “have” jab **paas hona** ho to **-ing nahi** lagta. (2) Seedha shabd **confident** zyada natural hai. “I\'m not very confident” chhota aur saaf hai.' },
      more: [
        { en: 'I\'m confident that I can finish the project on time.', hi: 'Mujhe bharosa hai ki main project time pe poora kar lunga.' },
        { en: 'Regular practice makes you more confident.', hi: 'Roz ki practice se aap aur confident bante ho.' }
      ],
      tip: 'Confidence (cheez) **have** karte hain, confident (haalat) **hote** hain: I\'m confident.',
      tags: ['Viva', 'Interview']
    },
    {
      word: 'interested in', ipa: '/ˈɪntrəstɪd ɪn/', say: 'इंट्रेस्टिड इन', hindi: 'में रुचि', meaning: 'mein dilchaspi',
      use: {
        ex: 'I\'m interested in data science.', hi: 'Mujhe data science mein dilchaspi hai.',
        why: '**interested in** = kisi cheez mein **dilchaspi**. Interview mein yeh batata hai ki aap **kis taraf jaana** chahte ho. Cheez ke saath seedha naam (data science), kaam ke saath -ing (interested in learning).',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'interested', hi: 'dilchaspi rakhta', key: true, why: '**-ed** = aap kya mehsoos karte ho.' },
          { en: 'in', hi: 'mein', why: 'Fixed jodi: **interested in**.' },
          { en: 'data science', hi: 'data science' }
        ]
      },
      scene: { where: 'Internship interview', a: { who: 'Interviewer', text: 'Why did you choose this degree?' }, b: { who: 'Aap', text: 'I\'m interested in data science, and this degree teaches the basics well.' } },
      dont: { wrong: 'I am interested to data science.', right: 'I\'m interested in data science.', why: '“interested” ke saath **“in”** fixed jodi hai. Roz ke liye yaad rakho: **interested in + cheez** ya **interested in + -ing** (interested in learning).' },
      more: [
        { en: 'I\'m interested in learning web development.', hi: 'Mujhe web development seekhne mein dilchaspi hai.' },
        { en: 'Are you interested in joining our study group?', hi: 'Kya tum hamare study group mein judna chahoge?' }
      ],
      tip: 'interest**ed** = aapko dilchaspi. interest**ing** = cheez dilchasp hai.',
      tags: ['Interview', 'Live session']
    },
    {
      word: 'looking forward to', ipa: '/ˈlʊkɪŋ ˈfɔːrwərd tə/', say: 'लुकिंग फ़ॉरवर्ड टू', hindi: 'उत्सुकता से इंतज़ार', meaning: 'khushi se intezaar',
      use: {
        ex: 'I\'m looking forward to the next live session.', hi: 'Mujhe agle live session ka intezaar hai.',
        why: '**looking forward to** = kisi cheez ka **khushi se intezaar**. Email, message ya interview ke **end** mein bolne se aap **polite aur positive** lagte ho.',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'looking forward', hi: 'khushi se intezaar', key: true },
          { en: 'to', hi: 'ka', why: 'Yahan “to” ke baad **cheez ya -ing** aata hai.' },
          { en: 'the next live session', hi: 'agla live session' }
        ]
      },
      scene: { where: 'Email ka end', a: { who: 'TA', text: 'Your project review is on Friday.' }, b: { who: 'Aap', text: 'Thank you. I\'m looking forward to the review.' } },
      dont: { wrong: 'I am looking forward to meet you.', right: 'I\'m looking forward to meeting you.', why: 'Aam taur pe “to” ke baad verb ka saada roop aata hai (to meet). Par **looking forward to** mein “to” ke baad **-ing** ya cheez aati hai: looking forward to **meeting** you. Yeh khaas rule hai, ise yaad kar lo.' },
      more: [
        { en: 'I\'m looking forward to meeting you.', hi: 'Mujhe aapse milne ka intezaar hai.' },
        { en: 'We\'re looking forward to your feedback.', hi: 'Hum aapke feedback ka intezaar kar rahe hain.' }
      ],
      tip: 'looking forward to + **-ing**. (to meet ✗, to meeting ✓)',
      tags: ['Email', 'Study group']
    },
    {
      word: 'feel free', ipa: '/fiːl friː/', say: 'फ़ील फ़्री', hindi: 'बेझिझक', meaning: 'bina jhijhak ke',
      use: {
        ex: 'Feel free to message me.', hi: 'Bejhijhak mujhe message karo.',
        why: '**feel free** = **bejhijhak**, bina sharmaaye. Study group ya forum pe doosron ko madad ke liye **khula nyota** dene ka friendly tareeka.',
        parts: [
          { en: 'Feel free', hi: 'bejhijhak', key: true, why: 'Doosre ko **ijaazat aur aaraam** dena.' },
          { en: 'to message', hi: 'message karne', why: 'feel free + **to + verb**.' },
          { en: 'me', hi: 'mujhe' }
        ]
      },
      scene: { where: 'WhatsApp group', a: { who: 'Neha', text: 'I\'m stuck on the Python assignment.' }, b: { who: 'Aap', text: 'I\'ve finished it. Feel free to message me if you need help.' } },
      dont: { wrong: 'Feel free for asking.', right: 'Feel free to ask.', why: 'Is jodi ke baad hamesha **to + verb ka saada roop** aata hai: feel free **to ask**, feel free **to call**. “For asking” Hindi “poochhne **ke liye**” se aata hai, jo yahan galat hai.' },
      more: [
        { en: 'Feel free to ask questions during the session.', hi: 'Session ke dauraan bejhijhak sawaal poochho.' },
        { en: 'Please feel free to correct me.', hi: 'Bejhijhak meri galti sudhaariye.' }
      ],
      tip: 'Feel free **to** + verb.',
      tags: ['Study group', 'Forum']
    },
    {
      word: 'introduce', ipa: '/ˌɪntrəˈduːs/', say: 'इंट्रोड्यूस', hindi: 'परिचय कराना', meaning: 'parichay dena',
      use: {
        ex: 'Let me introduce myself.', hi: 'Main apna parichay deta hoon.',
        why: '**introduce** = parichay dena. **Let me introduce myself** bol kar aap ek line mein bata dete ho ki ab aap apne baare mein bataoge. Viva, live session aur meeting ki **shuruaat** ke liye perfect.',
        parts: [
          { en: 'Let me', hi: 'mujhe dijiye / main' },
          { en: 'introduce', hi: 'parichay dena', key: true },
          { en: 'myself', hi: 'khud ka', why: 'Kaam **khud pe** ho raha hai, isliye yahan myself sahi hai.' }
        ]
      },
      scene: { where: 'Project viva', a: { who: 'Examiner', text: 'Please start.' }, b: { who: 'Aap', text: 'Good morning. Let me introduce myself. I\'m Aman Verma, and this is my project.' } },
      dont: { wrong: 'Myself Aman.', right: 'I\'m Aman.', why: '“Myself” tab lagta hai jab kaam **khud pe** ho (introduce myself, hurt myself). Akela “Myself Aman” mein **subject hi nahi** hai, isliye sentence toota hua lagta hai. Naam ke liye **I\'m Aman**.' },
      more: [
        { en: 'Can I introduce my teammate, Riya?', hi: 'Kya main apni teammate Riya se milwa sakta hoon?' },
        { en: 'She introduced me to the professor.', hi: 'Usne mujhe professor se milwaaya.' }
      ],
      tip: '**Let me introduce myself.** I\'m …  (Myself … ✗)',
      tags: ['Viva', 'Live session']
    },
    {
      word: 'background', ipa: '/ˈbækɡraʊnd/', say: 'बैकग्राउंड', hindi: 'पृष्ठभूमि', meaning: 'pehle ki padhai / mahaul',
      use: {
        ex: 'I\'m from a Hindi-medium background.', hi: 'Main Hindi-medium background se hoon.',
        why: '**background** = aapki **pehle ki padhai ya mahaul**. Isse log samajhte hain ki aap kahan se aaye ho, aur yeh **sharm ki nahi, honest** baat lagti hai.',
        parts: [
          { en: 'I\'m from', hi: 'main … se hoon' },
          { en: 'a Hindi-medium', hi: 'Hindi medium wala', why: '“a” kyunki **ek tarah** ka background.' },
          { en: 'background', hi: 'pichhli padhai', key: true }
        ]
      },
      scene: { where: 'Study group', a: { who: 'Kabir', text: 'Your Maths is really good!' }, b: { who: 'Aap', text: 'Thanks! I\'m from a Hindi-medium background, so English is new for me, but Maths is easy.' } },
      dont: { wrong: 'I am from Hindi medium.', right: 'I studied in a Hindi-medium school.', why: '“I am from Hindi medium” sunne mein **adhoora** hai, kyunki “Hindi medium” akela kisi jagah ya cheez ka naam nahi. Saath mein **school** ya **background** jodo, tab saaf matlab banta hai.' },
      more: [
        { en: 'I have a commerce background, but I\'m learning coding.', hi: 'Meri padhai commerce ki hai, par main coding seekh raha hoon.' },
        { en: 'Students from different backgrounds join this course.', hi: 'Is course mein alag-alag padhai wale students aate hain.' }
      ],
      tip: 'Hindi-medium **school / background**. Akela “Hindi medium” nahi.',
      tags: ['Interview', 'Study group']
    },
    {
      word: 'a little', ipa: '/ə ˈlɪtl/', say: 'अ लिटल', hindi: 'थोड़ा', meaning: 'thoda',
      use: {
        ex: 'I\'m a little nervous about the quiz.', hi: 'Main quiz ko lekar thoda ghabraaya hua hoon.',
        why: '**a little** = **thoda sa**. Apni feeling ko **halka** karke batata hai, jo sunne mein natural aur honest lagta hai.',
        parts: [
          { en: 'I\'m', hi: 'main hoon' },
          { en: 'a little', hi: 'thoda', key: true, why: '**“a”** ke saath hi matlab “thoda” banta hai.' },
          { en: 'nervous', hi: 'ghabraaya hua' },
          { en: 'about the quiz', hi: 'quiz ko lekar' }
        ]
      },
      scene: { where: 'Dost se', a: { who: 'Dost', text: 'How are you feeling about the viva?' }, b: { who: 'Aap', text: 'I\'m a little nervous, but I\'ve practised a lot.' } },
      dont: { wrong: 'I am little bit nervous.', right: 'I\'m a little bit nervous.', why: 'Ek chhota “a” poora matlab badal deta hai: **a little = thoda** (positive), **little = lagbhag nahi** (negative). “I have little time” = mere paas **samay hi nahi** hai. Isliye “thoda” ke liye **a little** zaroor bolo.' },
      more: [
        { en: 'Can you speak a little slower, please?', hi: 'Kya aap thoda dheere bol sakte hain?' },
        { en: 'I understood a little of the lecture.', hi: 'Mujhe lecture thoda samajh aaya.' }
      ],
      tip: '**a** little = thoda. little = lagbhag nahi.',
      tags: ['Dost', 'Viva']
    },
    {
      word: 'question', ipa: '/ˈkwestʃən/', say: 'क्वेश्चन', hindi: 'सवाल', meaning: 'sawaal',
      use: {
        ex: 'Can I ask a question about Week 3?', hi: 'Kya main Week 3 ke baare mein ek sawaal poochh sakta hoon?',
        why: '**question** = sawaal. **Can I ask …?** se poochhna **ijaazat maangne** jaisa hai, isliye polite lagta hai. **about** se batao ki sawaal kis cheez pe hai, taaki teacher turant samajh jaaye.',
        parts: [
          { en: 'Can I', hi: 'kya main' },
          { en: 'ask', hi: 'poochh sakta hoon', why: '“Can I” ke baad verb **saada**.' },
          { en: 'a question', hi: 'ek sawaal', key: true },
          { en: 'about Week 3', hi: 'Week 3 ke baare mein', why: 'Sawaal **kis topic** pe hai.' }
        ]
      },
      scene: { where: 'Live session', a: { who: 'Instructor', text: 'Any questions?' }, b: { who: 'Aap', text: 'Yes, can I ask a question about Week 3, slide 12?' } },
      dont: { wrong: 'Sir, I have one doubt.', right: 'Sir, I have a question.', why: 'English mein **doubt = shak** (yakeen na hona). “I doubt it” = mujhe ispe yakeen nahi. Isliye “I have a doubt” sunke videsh mein log sochte hain aap **unpe shak** kar rahe ho. Sawaal ke liye hamesha **question**. India mein “doubt” chalta hai, par sahi aadat abhi daal lo.' },
      more: [
        { en: 'I have a question about the assignment deadline.', hi: 'Mera assignment ki deadline ke baare mein ek sawaal hai.' },
        { en: 'That\'s a good question.', hi: 'Yeh achha sawaal hai.' }
      ],
      tip: 'Sawaal = **question**. Doubt = shak.',
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

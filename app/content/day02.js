// Day 2 lesson content. Every rule carries a "why" so learners understand, not memorise.
window.LESSONS = window.LESSONS || {};
window.LESSONS[2] = {
  day: 2,
  week: 1,
  title: 'Is / Am / Are',
  subtitle: 'Basic sentence banana',
  minutes: 30,
  next: { day: 3, title: 'Daily Routine' },

  reading: {
    title: 'My Family',
    lines: [
      { en: 'Hi! I am Ravi. I am 20 years old.', hi: 'Hi! Main Ravi hoon. Main 20 saal ka hoon.' },
      { en: 'My father is a farmer. He is very busy in the morning.', hi: 'Mere papa kisaan hain. Woh subah bahut vyast rehte hain.' },
      { en: 'My mother is a teacher. She is always happy.', hi: 'Meri maa teacher hain. Woh hamesha khush rehti hain.' },
      { en: 'My brothers are in Delhi. They are free on Sunday.', hi: 'Mere bhai Delhi mein hain. Woh Sunday ko khaali hote hain.' },
      { en: 'Today is Sunday, so we are together. I am sure this is the best day!', hi: 'Aaj Sunday hai, isliye hum saath hain. Mujhe pakka yakeen hai ki yeh sabse achha din hai!' }
    ],
    grammarWords: ['am', 'is', 'are'],
    vocabWords: ['busy', 'happy', 'free', 'sure'],
    questions: [
      { q: 'Ravi ke father kya karte hain?', a: 'Woh farmer (kisaan) hain.' },
      { q: 'Ravi ke brothers kahan hain?', a: 'Delhi mein.' },
      { q: 'Aaj kaun sa din hai?', a: 'Sunday.' }
    ]
  },

  words: [
    {
      word: 'happy', ipa: '/ˈhæpi/', say: 'हैपी', meaning: 'khush',
      use: { ex: 'I am happy today.', why: 'Khushi ek feeling (**haalat**) hai, isliye “am + happy”.' },
      dont: { wrong: 'I am happy for meet you.', right: 'I am happy to meet you.', why: 'Kisi kaam ki khushi ho to “to + verb” lagta hai. “for” ke baad insaan ya cheez aati hai (happy for you).' },
      tags: ['Pehli mulaqaat', 'Ghar']
    },
    {
      word: 'tired', ipa: '/ˈtaɪərd/', say: 'टायर्ड', meaning: 'thaka hua',
      use: { ex: 'I am tired after work.', why: 'Thakaan aapki **haalat** hai, isliye “am + tired”.' },
      dont: { wrong: 'I am tiring.', right: 'I am tired.', why: '“-ed” batata hai ki aap kaisa feel kar rahe ho. “-ing” batata hai ki koi cheez doosron ko kaisa feel karati hai: “The work is tiring” = kaam thakane wala hai.' },
      tags: ['Office', 'Ghar']
    },
    {
      word: 'busy', ipa: '/ˈbɪzi/', say: 'बिज़ी', meaning: 'vyast, kaam mein laga hua',
      use: { ex: 'I am busy right now.', why: 'Aap kaam mein lage ho. Yeh aapki **haalat** hai, isliye “am + busy”.' },
      dont: { wrong: 'I am busy in work.', right: 'I am busy with work.', why: '“in” **jagah** batata hai (in the office), kaam nahi. Kaam batane ke liye “with + cheez” ya “verb + ing” (busy doing homework).' },
      tags: ['Office', 'Phone call']
    },
    {
      word: 'free', ipa: '/friː/', say: 'फ्री', meaning: 'khaali (time) / muft',
      use: { ex: 'Are you free today?', why: 'Yahan baat time ki ho rahi hai, isliye free = khaali.' },
      dont: { wrong: 'I am free in Sunday.', right: 'I am free on Sunday.', why: 'Dinon ke saath **“on”** lagta hai (on Monday). “in” mahine aur saal ke saath aata hai (in May).' },
      note: 'Dukaan pe “Is it free?” ka matlab hai “kya yeh muft hai?”, kyunki wahan baat paise ki hoti hai. Situation se matlab badalta hai.',
      tags: ['Dost', 'Dukaan']
    },
    {
      word: 'sure', ipa: '/ʃʊr/', say: 'श्योर', meaning: 'pakka',
      use: { ex: 'I am sure, the train is at 5.', why: 'Aapne time check kar liya hai, aap 100% pakka ho. Tabhi “sure” bolo.' },
      dont: { wrong: 'I am sure he is at home. (jab pakka na ho)', right: 'I think he is at home.', why: 'Baat galat nikli to log aapki baat pe bharosa kam karenge. “I think” batata hai ki aapko lagta hai, guarantee nahi.' },
      tags: ['Office', 'Dost']
    },
    {
      word: 'hungry', ipa: '/ˈhʌŋɡri/', say: 'हंग्री', meaning: 'bhookha',
      use: { ex: 'Mom, I am hungry!', why: 'Bhookh aapki **haalat** hai, isliye “am + hungry”.' },
      dont: { wrong: 'I have hunger.', right: 'I am hungry.', why: 'Hindi ke “mujhe bhookh lagi hai” se log “have hunger” bana dete hain. English mein bhookh ko **haalat** ki tarah bolte hain.' },
      tags: ['Ghar', 'Restaurant']
    },
    {
      word: 'angry', ipa: '/ˈæŋɡri/', say: 'ऐंग्री', meaning: 'gussa',
      use: { ex: 'He is angry with me.', why: 'Gussa **haalat** hai. Kisi insaan pe gussa ho to “angry with”.' },
      dont: { wrong: 'He is angry on me.', right: 'He is angry with me.', why: '“on” kisi cheez ke **upar** hona batata hai (on the table). Insaan ke liye “with”, kisi baat ke liye “about”.' },
      tags: ['Ghar', 'Dost']
    },
    {
      word: 'late', ipa: '/leɪt/', say: 'लेट', meaning: 'der se',
      use: { ex: 'Sorry, I am late.', why: 'Der se pahunchna abhi aapki **haalat** hai, isliye “am late”.' },
      dont: { wrong: 'I am late since 10 minutes.', right: 'I am 10 minutes late.', why: 'Kitni der hui, woh “late” se pehle aata hai. “since” ek time point ke saath lagta hai (since 10 o’clock).' },
      tags: ['Class', 'Office']
    },
    {
      word: 'sick', ipa: '/sɪk/', say: 'सिक', meaning: 'beemar',
      use: { ex: 'She is sick today.', why: 'Beemari **haalat** hai, isliye “is + sick”.' },
      dont: { wrong: 'My sister is sick of fever.', right: 'My sister has a fever.', why: '“sick of” ka matlab hai “kisi cheez se ub jaana” (I am sick of traffic). Bukhaar ke liye “have a fever” bolte hain.' },
      tags: ['Doctor', 'Class']
    },
    {
      word: 'fine', ipa: '/faɪn/', say: 'फाइन', meaning: 'theek',
      use: { ex: 'I am fine, thank you.', why: 'Koi haal poochhe to theek hona aapki **haalat** hai, isliye “am fine”.' },
      dont: { wrong: 'I am very much fine.', right: 'I am fine. / I am very well.', why: '“very much” kaam (verb) ke saath lagta hai (I like it very much), “fine” ke saath nahi.' },
      tags: ['Pehli mulaqaat', 'Phone call']
    },
    {
      word: 'ready', ipa: '/ˈredi/', say: 'रेडी', meaning: 'taiyaar',
      use: { ex: 'I am ready for the exam.', why: 'Taiyaar hona **haalat** hai. Kisi cheez ke liye taiyaar ho to “ready for + cheez”.' },
      dont: { wrong: 'I am ready for go.', right: 'I am ready to go.', why: 'Kaam (verb) se pehle **“to”** lagta hai. “for” ke baad cheez aati hai, kaam nahi.' },
      tags: ['Ghar', 'Class']
    },
    {
      word: 'nervous', ipa: '/ˈnɜːrvəs/', say: 'नर्वस', meaning: 'ghabraaya hua',
      use: { ex: 'I am nervous about the interview.', why: 'Ghabrahat **haalat** hai. Kis baat ki ghabrahat ho to “about”.' },
      dont: { wrong: 'I am nervousing.', right: 'I am nervous.', why: '“nervous” ek **haalat** (adjective) hai, kaam (verb) nahi. Isliye ismein “-ing” nahi lagta.' },
      tags: ['Interview', 'Exam']
    },
    {
      word: 'alone', ipa: '/əˈloʊn/', say: 'अलोन', meaning: 'akela',
      use: { ex: 'He is alone at home.', why: 'Ghar pe koi aur nahi hai. Yeh ek fact hai, isliye “is alone”.' },
      dont: { wrong: 'I am alone. I am very sad.', right: 'I am lonely.', why: '“alone” sirf batata hai ki saath mein koi nahi. Akelepan ka dukh batana ho to “lonely” bolte hain.' },
      tags: ['Ghar']
    },
    {
      word: 'present', ipa: '/ˈprezənt/', say: 'प्रेज़ेंट', meaning: 'haazir',
      use: { ex: 'Sir, I am present.', why: 'Class mein abhi haazir hona aapki **haalat** hai, isliye “am present”.' },
      dont: { wrong: 'Rahul is present in yesterday’s class.', right: 'Rahul was present in yesterday’s class.', why: 'Kal ki baat hai, isliye “is” nahi, “was” lagega. Past tense Day 5 mein aayega.' },
      note: '“present” ka ek aur matlab hai tohfa (a birthday present).',
      tags: ['Class', 'Office']
    },
    {
      word: 'absent', ipa: '/ˈæbsənt/', say: 'एब्सेंट', meaning: 'gair-haazir',
      use: { ex: 'Rahul is absent today.', why: 'Rahul ek insaan hai aur aaj nahi aaya, isliye “is absent”.' },
      dont: { wrong: 'Rahul is absent in school.', right: 'Rahul is absent from school.', why: 'Kahan se gair-haazir hai, yeh batane ke liye “from” lagta hai.' },
      tags: ['Class', 'Office']
    }
  ],

  grammar: {
    what: 'Yeh Hindi ke **hai / hoon / ho / hain** hain. Inse batate hain ki koi kaun hai, kaisa hai, kahan hai.',
    formula: ['Subject', 'am / is / are', 'baaki baat'],
    pairs: [
      { hi: 'Main', hiVerb: 'hoon', en: 'I', enVerb: 'am' },
      { hi: 'Woh', hiVerb: 'hai', en: 'He / She / It', enVerb: 'is' },
      { hi: 'Ve / Hum', hiVerb: 'hain', en: 'They / We', enVerb: 'are' },
      { hi: 'Aap / Tum', hiVerb: 'ho', en: 'You', enVerb: 'are' }
    ],
    rules: [
      {
        title: 'Subject ke hisaab se am / is / are',
        right: ['I am tired.', 'Ravi is late.', 'We are ready.'],
        why: 'English mein verb subject ke hisaab se badalta hai, bilkul Hindi jaisa: “main hoon”, “woh hai”, “ve hain”. Jaise “main hai” galat hai, waise hi “I is” galat hai.'
      },
      {
        title: '“You” ke saath hamesha “are”',
        wrong: 'You is my friend.', right: ['You are my friend.'],
        why: 'Hindi mein bhi ek insaan ko “aap ho / aap hain” bolte ho, “aap hai” nahi. English ka “you” hamesha plural wala verb leta hai, chahe saamne ek hi insaan ho.'
      },
      {
        title: 'Kaam (action) ke saath am / is / are nahi',
        wrong: 'I am go to school.', right: ['I go to school.'],
        why: '“go” khud kaam (verb) hai. Simple sentence mein **ek hi main verb** chahiye, isliye “am” extra ho gaya. Hindi ke “jaata hoon” wala “hoon” Hindi tense ka hissa hai.',
        tip: '“am” kaam ke saath tab lagta hai jab verb mein -ing ho: “I am going” = main abhi ja raha hoon (Day 7).'
      },
      {
        title: '“I am agree” galat hai',
        wrong: 'I am agree.', right: ['I agree.'],
        why: 'Hindi mein “main sehmat hoon” mein “sehmat” ek **haalat** hai, isliye “hoon” lagta hai. English mein “agree” ek kaam (verb) hai, jaise “go” ya “eat”, isliye uske saath “am” nahi lagta.'
      },
      {
        title: 'Negative: “not” am / is / are ke baad',
        wrong: 'He not is happy.', right: ['He is not happy.', 'He isn’t happy.'],
        why: 'English mein “not” helper verb (is) ke turant baad aata hai. Hindi mein “nahi” verb se pehle aata hai (“khush nahi hai”), isliye shuru mein ulta lagta hai.'
      },
      {
        title: 'Question: is / are aage aata hai',
        wrong: 'He is happy?', right: ['Is he happy?'],
        why: 'Hindi mein sawaal ke shuru mein “kya” lagate ho: “Kya woh khush hai?”. English mein yahi kaam “Is” karta hai. Pehla word sunte hi saamne wala samajh jaata hai ki sawaal hai.'
      }
    ]
  },

  models: [
    { situation: 'Pehli mulaqaat', en: 'Hi, I am Priya. I am from Patna.', why: 'Apni pehchaan bata rahe ho, isliye I + am.' },
    { situation: 'Phone pe', en: 'Sorry, I am busy. I am in a meeting.', why: 'Akela “I am busy” rude lagta hai. “Sorry” se pata chalta hai ki aap baat karna chahte the par abhi nahi kar sakte.' },
    { situation: 'Dukaan pe', en: 'How much is it? / How much are they?', why: 'Ek cheez ho to “is”, do ya zyada cheezein hon to “are”.' },
    { situation: 'Class mein', en: 'Sir, Rahul is absent today.', why: 'Rahul ek insaan hai (he), isliye “is”.' },
    { situation: 'Ghar pe', en: 'Mom, I am hungry!', why: 'Bhookh aapki **haalat** hai, koi kaam nahi, isliye “am”.' }
  ],

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Sahi shabd chuno', q: 'She ___ a teacher.', options: ['am', 'is', 'are'], answer: 'is', why: '“She” ek insaan hai, jaise Hindi mein “woh hai”. Isliye IS.' },
      { prompt: 'Sahi shabd chuno', q: 'We ___ late.', options: ['am', 'is', 'are'], answer: 'are', why: '“We” = hum, yaani bahut log. Hindi mein “hum hain”, isliye ARE.' },
      { prompt: 'Sahi shabd chuno', q: 'I ___ ready.', options: ['am', 'is', 'are'], answer: 'am', why: '“I” ke saath hamesha AM, jaise “main hoon”.' },
      { prompt: 'Sahi shabd chuno', q: 'They ___ in Delhi.', options: ['am', 'is', 'are'], answer: 'are', why: '“They” = bahut log (plural). Hindi mein bhi “ve hain” bolte ho, “ve hai” nahi. Isliye ARE.' },
      { prompt: 'Sahi shabd chuno', q: 'You ___ my best friend.', options: ['am', 'is', 'are'], answer: 'are', why: '“You” ke saath **hamesha ARE**, chahe ek hi insaan ho. Hindi mein bhi “aap ho” bolte hain.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am go to school.', 'I go to school.'], answer: 'I go to school.', why: '“go” khud kaam (verb) hai. Ek simple sentence mein **ek hi main verb**, isliye “am” nahi lagega.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am agree.', 'I agree.'], answer: 'I agree.', why: '“agree” English mein verb hai, Hindi ke “sehmat” jaisa adjective nahi. Verb ke saath “am” nahi lagta.' },
      { prompt: 'Sawaal kaise banega?', q: '', options: ['He is happy?', 'Is he happy?'], answer: 'Is he happy?', why: '“Is” Hindi ke “kya” jaisa kaam karta hai, isliye sawaal mein woh shuru mein aata hai.' },
      { prompt: 'Negative kaise banega?', q: '', options: ['He not is happy.', 'He is not happy.'], answer: 'He is not happy.', why: '“not” hamesha “is” ke baad aata hai. Hindi mein “nahi” pehle aata hai, isliye yeh galti hoti hai.' },
      { prompt: 'Sahi shabd chuno', q: 'My father is busy ___ work.', options: ['in', 'with', 'on'], answer: 'with', why: '“in” jagah batata hai, kaam nahi. Kaam ke saath “busy with”.' }
    ]
  },

  speak: [
    'I am happy today.',
    'My father is busy with work.',
    'They are in Delhi.'
  ]
};

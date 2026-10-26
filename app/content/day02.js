// Day 2 lesson content. Level: learners who know basic English but translate from Hindi
// and freeze in real situations. Every rule carries a "why".
window.LESSONS = window.LESSONS || {};
window.LESSONS[2] = {
  day: 2,
  week: 1,
  title: 'Is / Am / Are',
  subtitle: '“Hai” ke 3 roop: is, it is, there is',
  minutes: 30,
  next: { day: 3, title: 'Daily Routine' },

  reading: {
    title: 'First Day at Work',
    lines: [
      { en: 'Today is Neha\'s first day at a new office in Gurgaon.', hi: 'Aaj Gurgaon ke ek naye office mein Neha ka pehla din hai.' },
      { en: 'Her manager is busy, but her teammates are friendly and helpful.', hi: 'Uske manager vyast hain, lekin uske saathi dostana aur madadgaar hain.' },
      { en: 'There are twelve people in her team, and there is a small cafe on the ground floor.', hi: 'Uski team mein barah log hain, aur ground floor pe ek chhota cafe hai.' },
      { en: 'The office is a bit far; it\'s about 15 km from her house, but the metro is convenient.', hi: 'Office thoda door hai, uske ghar se lagbhag 15 km, lekin metro suvidhajanak hai.' },
      { en: 'Neha is a little confused about the software, but she is sure that she will be comfortable soon.', hi: 'Neha software ko lekar thodi uljhan mein hai, par use yakeen hai ki woh jaldi sahaj ho jayegi.' }
    ],
    grammarWords: ['is', 'are', 'it\'s', 'there'],
    vocabWords: ['busy', 'convenient', 'confused', 'sure', 'comfortable'],
    questions: [
      { q: 'Neha ki team mein kitne log hain?', a: 'Barah (12).' },
      { q: 'Office uske ghar se kitna door hai, aur woh kaise aati hai?', a: 'Lagbhag 15 km. Metro se, jo suvidhajanak hai.' },
      { q: 'Neha kis baat ko lekar confused hai?', a: 'Naye software ko lekar.' }
    ]
  },

  words: [
    {
      word: 'available', ipa: '/əˈveɪləbl/', say: 'अवेलेबल', hindi: 'उपलब्ध', meaning: 'milne / baat karne ke liye khaali',
      use: { ex: 'Is Mr Sharma available?', why: 'Office aur phone pe kisi se baat karne ka **polite** tareeka.' },
      dont: { wrong: 'Sir is out of station.', right: 'He\'s travelling this week.', why: '“Out of station” Indian English hai. India ke **bahar** log ise nahi samajhte.' },
      tags: ['Office', 'Phone call']
    },
    {
      word: 'busy', ipa: '/ˈbɪzi/', say: 'बिज़ी', hindi: 'व्यस्त', meaning: 'vyast',
      use: { ex: 'I\'m a bit busy right now. Can I call you back?', why: '“A bit busy” + **call back** = mana karne ka polite tareeka.' },
      dont: { wrong: 'I am busy in a meeting.', right: 'I\'m in a meeting.', why: '“Busy in” galat hai. Aur **“I\'m in a meeting”** khud bata deta hai ki aap vyast ho.' },
      tags: ['Office', 'Phone call']
    },
    {
      word: 'sure', ipa: '/ʃʊr/', say: 'श्योर', hindi: 'पक्का, निश्चित', meaning: 'pakka',
      use: { ex: 'Are you sure about the date?', why: 'Kisi **cheez** ke baare mein pakka hona: sure about + cheez.' },
      dont: { wrong: 'I am not sure about that he is coming.', right: 'I\'m not sure he\'s coming.', why: '**“about” ke baad cheez** aati hai (about the time). Poore sentence se pehle “about” nahi.' },
      tags: ['Office', 'Dost']
    },
    {
      word: 'confused', ipa: '/kənˈfjuːzd/', say: 'कन्फ़्यूज़्ड', hindi: 'उलझन में', meaning: 'uljhan mein',
      use: { ex: 'I\'m confused about the new rules.', why: '**-ed** = aap kaisa **mehsoos** kar rahe ho.' },
      dont: { wrong: 'I am confusing.', right: 'I\'m confused.', why: '**-ing** = cheez doosron ko kaisa karti hai. “I am confusing” = **main logon ko uljhata hoon**!' },
      tags: ['Office', 'Class']
    },
    {
      word: 'bored', ipa: '/bɔːrd/', say: 'बोर्ड', hindi: 'ऊबा हुआ', meaning: 'bore ho raha',
      use: { ex: 'I\'m bored at home.', why: 'Aapko kaisa lag raha hai: **-ed**.' },
      dont: { wrong: 'I am boring.', right: 'I\'m bored.', why: '“I am boring” ka matlab hai **“main ek bore insaan hoon”**. Yeh bahut aam aur mazedaar galti hai.' },
      tags: ['Dost', 'Ghar']
    },
    {
      word: 'excited', ipa: '/ɪkˈsaɪtɪd/', say: 'एक्साइटिड', hindi: 'उत्साहित', meaning: 'utsaahit',
      use: { ex: 'I\'m excited about the trip.', why: 'Feeling: **-ed**, kis baat ki: **about**.' },
      dont: { wrong: 'I am exciting for the trip.', right: 'I\'m excited about the trip.', why: 'Feeling ke liye **-ed**. “The trip is exciting” = trip utsaah deti hai.' },
      tags: ['Dost', 'Travel']
    },
    {
      word: 'upset', ipa: '/ʌpˈset/', say: 'अपसेट', hindi: 'नाराज़, परेशान', meaning: 'naraz / dukhi',
      use: { ex: 'She\'s upset with me.', why: 'Insaan se naraz: **upset with**. Baat se: **upset about**.' },
      dont: { wrong: 'She is upset on me.', right: 'She\'s upset with me.', why: 'Hindi “mujh **par** naraz” se “on” aa jaata hai. English mein **with**.' },
      tags: ['Dost', 'Ghar']
    },
    {
      word: 'worried', ipa: '/ˈwɜːrid/', say: 'वरीड', hindi: 'चिंतित', meaning: 'chintit',
      use: { ex: 'My parents are worried about my exams.', why: 'Chinta kis baat ki: **worried about**.' },
      dont: { wrong: 'Don\'t take tension.', right: 'Don\'t worry.', why: '**“Take tension”** Indian English hai. Duniya bhar mein **“Don\'t worry”** bolte hain.' },
      tags: ['Ghar', 'Dost']
    },
    {
      word: 'embarrassed', ipa: '/ɪmˈbærəst/', say: 'एम्बैरेस्ट', hindi: 'शर्मिंदा', meaning: 'sharminda',
      use: { ex: 'I was so embarrassed when I forgot his name.', why: 'Chhoti galti pe **sharm** aana.' },
      dont: { wrong: 'I am very shame.', right: 'I\'m really embarrassed.', why: '**“Shame”** cheez (noun) hai. “am” ke baad haalat chahiye: **embarrassed**.' },
      tags: ['Dost', 'Office']
    },
    {
      word: 'comfortable', ipa: '/ˈkʌmftərbl/', say: 'कम्फ़्टेबल', hindi: 'सहज', meaning: 'sahaj, theek',
      use: { ex: 'Are you comfortable with the plan?', why: 'Kisi ki **raay** poochhne ka naram tareeka.' },
      dont: { wrong: 'I am not comfort with this.', right: 'I\'m not comfortable with this.', why: '“Comfort” **cheez** hai. “am” ke baad **comfortable**.' },
      note: 'Uchcharan: **“kumf-ter-bul”**, “kum-for-table” nahi.',
      tags: ['Office']
    },
    {
      word: 'convenient', ipa: '/kənˈviːniənt/', say: 'कन्वीनिएंट', hindi: 'सुविधाजनक', meaning: 'suvidhajanak',
      use: { ex: 'Is 4 p.m. convenient for you?', why: 'Kisi ke liye **time theek hai** ya nahi, yeh polite tareeke se poochhna.' },
      dont: { wrong: 'Are you convenient at 4?', right: 'Is 4 convenient for you?', why: '**Time ya cheez** convenient hoti hai, insaan nahi.' },
      tags: ['Office', 'Phone call']
    },
    {
      word: 'aware', ipa: '/əˈwer/', say: 'अवेयर', hindi: 'अवगत, जानकार', meaning: 'jaankari hona',
      use: { ex: 'Are you aware of the new policy?', why: 'Kisi cheez ki **khabar** hai ya nahi.' },
      dont: { wrong: 'I am aware about it.', right: 'I\'m aware of it.', why: '**“aware of”** fixed jodi hai.' },
      tags: ['Office']
    },
    {
      word: 'possible', ipa: '/ˈpɑːsəbl/', say: 'पॉसिबल', hindi: 'संभव', meaning: 'mumkin',
      use: { ex: 'Is it possible to change the date?', why: 'Kuch maangne ka **polite** sawaal: Is it possible to + verb?' },
      dont: { wrong: 'Is it possible for change the date?', right: 'Is it possible to change the date?', why: '“possible” ke baad kaam ho to **to + verb**.' },
      tags: ['Office', 'Bank']
    },
    {
      word: 'familiar', ipa: '/fəˈmɪliər/', say: 'फ़मिलियर', hindi: 'परिचित', meaning: 'jaana-pehchaana, aata hai',
      use: { ex: 'Are you familiar with Excel?', why: 'Kisi cheez ko **jaanna / use karna aana**. Job mein bahut poochha jaata hai.' },
      dont: { wrong: 'I am familiar to Excel.', right: 'I\'m familiar with Excel.', why: '**“familiar with”** fixed jodi hai.' },
      tags: ['Interview', 'Office']
    },
    {
      word: 'elder', ipa: '/ˈeldər/', say: 'एल्डर', hindi: 'बड़ा (परिवार में)', meaning: 'bada (family mein)',
      use: { ex: 'This is my elder brother.', why: '**Sirf naam se pehle**: my elder brother, my elder sister.' },
      dont: { wrong: 'He is elder than me.', right: 'He is older than me.', why: '“than” ke saath tulna mein **older**. “Elder” tulna mein nahi lagta.' },
      tags: ['Family']
    }
  ],

  grammar: {
    what: 'Hindi ka ek “hai” English mein **teen tarah** se banta hai: **is** (woh vyast hai), **it is** (bahut garmi hai) aur **there is** (ek problem hai). Sahi chunna hi asli skill hai.',
    formula: ['Subject / It / There', 'am / is / are', 'haalat / jagah / cheez'],
    pairs: [
      { hi: 'System mein ek problem', hiVerb: 'hai', en: '', enVerb: 'There is a problem' },
      { hi: 'Aaj bahut garmi', hiVerb: 'hai', en: '', enVerb: 'It\'s very hot today' },
      { hi: 'Yahan se 5 km', hiVerb: 'hai', en: '', enVerb: 'It\'s 5 km from here' },
      { hi: 'Main sehmat', hiVerb: 'hoon', en: 'I', enVerb: 'agree' }
    ],
    rules: [
      {
        title: 'Kuch hai ya nahi: There is / There are',
        wrong: 'Problem is there in the system.', right: ['There is a problem in the system.', 'There are two problems.'],
        why: 'Kisi cheez ke **hone** ki baat “There is” se shuru hoti hai. Hindi order (“problem hai”) se “Problem is there” ban jaata hai, jo galat hai.'
      },
      {
        title: 'Mausam, time, doori: It is',
        wrong: 'Today is very hot.', right: ['It\'s very hot today.', 'It\'s 5 o\'clock.', 'It\'s 5 km from here.'],
        why: 'English sentence ko **subject chahiye**. Mausam ya time ka koi asli subject nahi hota, isliye **“It”** lagate hain.'
      },
      {
        title: 'Feeling: -ed (aap) vs -ing (cheez)',
        wrong: 'I am boring.', right: ['I\'m bored. (mujhe bore ho raha hai)', 'The class is boring. (class bore karti hai)'],
        why: '**-ed** = aap kya mehsoos karte ho. **-ing** = cheez kaisi hai. Galat chunne se matlab ulta ho jaata hai.'
      },
      {
        title: 'Verb ke saath am / is / are nahi',
        wrong: 'I am agree. I am not getting you.', right: ['I agree.', 'Sorry, I don\'t understand.'],
        why: '**agree** aur **understand** khud verb hain. Hindi “sehmat **hoon**” se “am” jud jaata hai. “Not getting you” Indian English hai.'
      },
      {
        title: 'Sawaal: WH + is / are + subject',
        wrong: 'Where the meeting is?', right: ['Where is the meeting?', 'Why are you late?'],
        why: 'Hindi order “meeting **kahan hai**” se galti hoti hai. English mein WH ke **turant baad is / are**.'
      },
      {
        title: 'Bolchaal mein short form',
        right: ['He isn\'t here. / He\'s not here.', 'They aren\'t ready.', 'Aren\'t you coming?'],
        why: 'Bolte waqt **isn\'t, aren\'t, it\'s** natural lagte hain. “Aren\'t you coming?” mein **hairani** ya confirm karna chhupa hai.'
      }
    ]
  },

  modal: {
    verb: 'could', ipa: '/kʊd/', say: 'कुड', hindi: 'सकना (विनम्र / भूतकाल)', meaning: 'kar sakte hain? / kar paata tha',
    uses: [
      { rule: 'Jab teacher, TA ya bade se **politely request** karni ho (can se zyada izzat)', form: 'Could you + verb …?', ex: [
        { en: 'Could you [repeat the last point]?', hi: 'Kya aap aakhri point dobara bata sakte hain?' },
        { en: 'Could you [check my submission]?', hi: 'Kya aap meri submission check kar sakte hain?' }
      ] },
      { rule: 'Jab batana ho ki **pehle kya kar paate the**', form: 'Subject + could + verb', ex: [
        { en: 'In school, I could [solve maths problems fast].', hi: 'School mein main maths ke sawaal jaldi solve kar leta tha.' },
        { en: 'Yesterday I couldn\'t [join the session].', hi: 'Kal main session join nahi kar paaya.' }
      ] },
      { rule: 'Jab koi **sujhaav (idea)** dena ho', form: 'We / You could + verb', ex: [
        { en: 'We could [study together on Sunday].', hi: 'Hum Sunday ko saath padh sakte hain.' },
        { en: 'You could [ask on the forum].', hi: 'Tum forum pe poochh sakte ho.' }
      ] }
    ],
    dont: [
      { wrong: 'Could you please to send the notes?', right: 'Could you please send the notes?', why: 'Modal ke baad **“to” nahi** lagta.' },
      { wrong: 'Yesterday I can not attend the class.', right: 'Yesterday I couldn\'t attend the class.', why: 'Beete kal ke liye can ka past **could**.' }
    ]
  },

  quiz: {
    passPercent: 70,
    questions: [
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Problem is there in the system.', 'There is a problem in the system.'], answer: 'There is a problem in the system.', why: 'Kuch hone ki baat: **There is**.' },
      { prompt: 'Sahi shabd chuno', q: '___ very hot today.', options: ['Today is', 'It\'s'], answer: 'It\'s', why: 'Mausam ke liye **It**.' },
      { prompt: 'Sahi shabd chuno', q: 'The movie was three hours long. I was ___.', options: ['boring', 'bored'], answer: 'bored', why: 'Aapki feeling: **-ed**. Movie boring thi, aap bored the.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['I am agree with you.', 'I agree with you.'], answer: 'I agree with you.', why: '**agree** khud verb hai.' },
      { prompt: 'Kaunsa sentence sahi hai?', q: '', options: ['Where the meeting is?', 'Where is the meeting?'], answer: 'Where is the meeting?', why: 'WH ke turant baad **is**.' },
      { prompt: 'Sahi shabd chuno', q: 'Is 4 p.m. ___ for you?', options: ['convenient', 'comfortable'], answer: 'convenient', why: '**Time** convenient hota hai.' },
      { prompt: 'Sahi shabd chuno', q: 'I\'m aware ___ the new rule.', options: ['about', 'of'], answer: 'of', why: '**aware of** fixed jodi.' },
      { prompt: 'Sahi shabd chuno', q: 'My brother is ___ than me.', options: ['elder', 'older'], answer: 'older', why: 'Tulna (than) mein **older**.' },
      { prompt: 'Sahi shabd chuno', q: 'She is upset ___ me.', options: ['on', 'with'], answer: 'with', why: 'Insaan se naraz: **upset with**.' },
      { prompt: 'Sahi shabd chuno', q: 'There ___ twelve people in my team.', options: ['is', 'are'], answer: 'are', why: 'Barah log = bahut, isliye **There are**.' }
    ]
  },

  speak: [
    'There is a small cafe on the ground floor.',
    'It\'s about 15 km from my house.',
    'I\'m a bit confused about this task.'
  ],

  write: {
    intro: 'Apne office, college ya ghar ke baare mein 3 sentence likho.',
    items: [
      { label: 'There is / There are …', placeholder: 'Jaise: There are twenty students in my class.', pattern: '\\bthere (is|are|\'s) [a-z0-9]+', ok: 'Kuch hone ki baat **There is / are** se. Sahi!', fix: 'Shuru karo **There is** (ek cheez) ya **There are** (zyada) se. “… is there” mat likho.' },
      { label: 'It\'s … (time, mausam ya doori)', placeholder: 'Jaise: It\'s about 10 km from my house.', pattern: '\\bit(\'s| is) [a-z0-9]+', ok: 'Time / mausam / doori ke liye **It\'s**. Sahi!', fix: 'Mausam, time ya doori ke liye **It\'s** se shuru karo: It\'s very cold today.' },
      { label: 'Aaj aap kaisa feel kar rahe ho? (I\'m …ed)', placeholder: 'Jaise: I\'m a bit worried about my exam.', pattern: '\\bi(\'m| am) (a bit |a little |very |so |really |quite )?[a-z]+ed\\b', ok: 'Apni feeling ke liye **-ed**. Bilkul sahi!', fix: 'Apni feeling ke liye **-ed** wala shabd: I\'m bored / tired / excited / worried. (-ing nahi.)' }
    ]
  }
};

// Lead Finder data: places, business types, messages and demo leads.
// Edit this file to add a city, a business type or change a message.

// India's states and union territories.
// iso: the state's "ISO3166-2" code in OpenStreetMap (some states have an old and a new code).
// cities: the bigger cities, filled in when the state is picked (Google searches one city at a time).
window.STATES = [
  { name: "Andhra Pradesh", iso: "AP", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool"] },
  { name: "Arunachal Pradesh", iso: "AR", cities: ["Itanagar", "Naharlagun", "Pasighat"] },
  { name: "Assam", iso: "AS", cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"] },
  { name: "Bihar", iso: "BR", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"] },
  { name: "Chhattisgarh", iso: "CT|CG", cities: ["Raipur", "Bhilai", "Bilaspur", "Durg", "Korba"] },
  { name: "Goa", iso: "GA", cities: ["Panaji", "Margao", "Mapusa", "Vasco da Gama", "Calangute"] },
  { name: "Gujarat", iso: "GJ", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"] },
  { name: "Haryana", iso: "HR", cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar"] },
  { name: "Himachal Pradesh", iso: "HP", cities: ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"] },
  { name: "Jharkhand", iso: "JH", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"] },
  { name: "Karnataka", iso: "KA", cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Davanagere"] },
  { name: "Kerala", iso: "KL", cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"] },
  { name: "Madhya Pradesh", iso: "MP", cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"] },
  { name: "Maharashtra", iso: "MH", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Chhatrapati Sambhajinagar", "Kolhapur"] },
  { name: "Manipur", iso: "MN", cities: ["Imphal"] },
  { name: "Meghalaya", iso: "ML", cities: ["Shillong", "Tura"] },
  { name: "Mizoram", iso: "MZ", cities: ["Aizawl", "Lunglei"] },
  { name: "Nagaland", iso: "NL", cities: ["Kohima", "Dimapur"] },
  { name: "Odisha", iso: "OR|OD", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur"] },
  { name: "Punjab", iso: "PB", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda"] },
  { name: "Rajasthan", iso: "RJ", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"] },
  { name: "Sikkim", iso: "SK", cities: ["Gangtok", "Namchi"] },
  { name: "Tamil Nadu", iso: "TN", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"] },
  { name: "Telangana", iso: "TG|TS", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"] },
  { name: "Tripura", iso: "TR", cities: ["Agartala"] },
  { name: "Uttar Pradesh", iso: "UP", cities: ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Prayagraj", "Meerut"] },
  { name: "Uttarakhand", iso: "UT|UK", cities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Nainital"] },
  { name: "West Bengal", iso: "WB", cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"] },
  { name: "Delhi", iso: "DL", cities: ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi", "Dwarka"] },
  { name: "Jammu and Kashmir", iso: "JK", cities: ["Srinagar", "Jammu"] },
  { name: "Ladakh", iso: "LA", cities: ["Leh", "Kargil"] },
  { name: "Chandigarh", iso: "CH", cities: ["Chandigarh"] },
  { name: "Puducherry", iso: "PY", cities: ["Puducherry"] },
  { name: "Andaman and Nicobar Islands", iso: "AN", cities: ["Port Blair"] },
  { name: "Dadra and Nagar Haveli and Daman and Diu", iso: "DH|DN|DD", cities: ["Daman", "Silvassa", "Diu"] },
  { name: "Lakshadweep", iso: "LD", cities: ["Kavaratti"] },
];

// Business types. Each one has its own search words and its own sales pitch, because a gym owner
// and a restaurant owner want different things from a website.
// types[].google: words Google Maps searches for ("gym in Patna, Bihar").
// types[].osm: OpenStreetMap tags, [key, value]. Empty means OpenStreetMap has no tag for it.
window.NICHES = [
  {
    id: "restaurant", label: "Restaurants", one: "restaurant", icon: "fork",
    types: [
      { id: "restaurant", label: "Restaurants", google: "restaurants", osm: [["amenity", "restaurant"]], on: true },
      { id: "cafe", label: "Cafes", google: "cafe", osm: [["amenity", "cafe"]] },
      { id: "fast_food", label: "Fast food", google: "fast food", osm: [["amenity", "fast_food"], ["amenity", "food_court"]] },
      { id: "dhaba", label: "Dhabas", google: "dhaba", osm: [] },
      { id: "sweets", label: "Sweets & bakery", google: "sweet shop bakery", osm: [["shop", "bakery"], ["shop", "confectionery"], ["shop", "pastry"]] },
    ],
  },
  {
    id: "gym", label: "Gyms", one: "gym", icon: "dumbbell",
    types: [
      { id: "gym", label: "Gyms", google: "gym", osm: [["leisure", "fitness_centre"], ["amenity", "gym"]], on: true },
      { id: "fitness", label: "Fitness studios", google: "fitness studio", osm: [] },
      { id: "yoga", label: "Yoga", google: "yoga classes", osm: [["sport", "yoga"]] },
      { id: "zumba", label: "Zumba & dance", google: "zumba classes", osm: [] },
      { id: "martial", label: "Martial arts", google: "martial arts classes", osm: [["sport", "martial_arts"], ["sport", "karate"], ["sport", "taekwondo"]] },
    ],
  },
  {
    id: "other", label: "Other", one: "business", icon: "store",
    types: [], // the person types their own words, e.g. "salon, coaching centre"
  },
];

// Links that are a page on someone else's platform, not the business's own website.
// A business with only one of these still needs a website, so it counts as a lead.
window.SOCIAL_DOMAINS = [
  "facebook.com", "fb.com", "instagram.com", "zomato.com", "swiggy.com", "linktr.ee", "wa.me", "whatsapp.com",
  "business.site", "sites.google.com", "justdial.com", "magicpin.in", "dineout.co.in", "eazydiner.com",
  "tripadvisor.com", "tripadvisor.in", "youtube.com", "twitter.com", "x.com", "google.com", "goo.gl", "g.page",
  "dotpe.in", "petpooja.com", "thrivenow.in", "bit.ly", "cult.fit", "fitternity.com", "urbanclap.com", "urbancompany.com",
];
window.SOCIAL_NAMES = {
  "zomato.com": "Zomato", "swiggy.com": "Swiggy", "instagram.com": "Instagram", "facebook.com": "Facebook", "fb.com": "Facebook",
  "justdial.com": "Justdial", "magicpin.in": "magicpin", "fitternity.com": "Fitternity", "cult.fit": "cult.fit",
  "business.site": "old Google site", "linktr.ee": "Linktree", "youtube.com": "YouTube",
};

// Messages. {name} {myName} {myPhone} {link} {reason} {days} are filled in for each business.
// A line with {link} is left out when you have no portfolio link.
window.MESSAGES = {
  en: {
    reasonNone: "doesn't have a website yet",
    reasonSocial: "only has a {social} page, not its own website",
    first: {
      restaurant: [
        "Hello {name} team 🙏",
        "",
        "I'm {myName}, a web developer. I noticed {name} {reason}.",
        "",
        "A simple website lets customers see your menu, photos, timings and location, and order directly by call or WhatsApp, without paying Zomato or Swiggy commission.",
        "",
        "I'd be happy to make a free demo website for {name}. You decide only after you see it.",
        "My work: {link}",
        "",
        "Reply here or call me on {myPhone}.",
        "If you're not interested, just tell me and I won't message again.",
        "— {myName}",
      ],
      gym: [
        "Hello {name} team 💪",
        "",
        "I'm {myName}, a web developer. I noticed {name} {reason}.",
        "",
        "When people search \"gym near me\", a website helps them find you, see your membership plans, trainers, timings and transformation photos, and book a free trial on WhatsApp.",
        "",
        "I'd be happy to make a free demo website for {name}. You decide only after you see it.",
        "My work: {link}",
        "",
        "Reply here or call me on {myPhone}.",
        "If you're not interested, just tell me and I won't message again.",
        "— {myName}",
      ],
      other: [
        "Hello {name} team 🙏",
        "",
        "I'm {myName}, a web developer. I noticed {name} {reason}.",
        "",
        "A website helps new customers find you on Google, see your services, prices, photos and location, and contact you on WhatsApp.",
        "",
        "I'd be happy to make a free demo website for {name}. You decide only after you see it.",
        "My work: {link}",
        "",
        "Reply here or call me on {myPhone}.",
        "If you're not interested, just tell me and I won't message again.",
        "— {myName}",
      ],
    },
    followUp: [
      "Hello {name} team, I messaged you {days} days ago about a website for {name}.",
      "",
      "I can make a free demo this week. You pay only if you like it. Shall I make one?",
      "",
      "— {myName}, {myPhone}",
    ],
  },
  hi: {
    reasonNone: "abhi koi website nahi hai",
    reasonSocial: "abhi sirf {social} page hai, apni website nahi hai",
    first: {
      restaurant: [
        "Namaste {name} team 🙏",
        "",
        "Main {myName}, ek web developer hun. Online dekha ki {name} ki {reason}.",
        "",
        "Apni website se customers seedha aapka menu, photos, timing aur location dekh kar call ya WhatsApp pe order kar sakte hain. Zomato/Swiggy ka commission bhi bachta hai.",
        "",
        "Main {name} ke liye ek FREE demo website bana kar dikha sakta hun. Pasand aaye tabhi aage baat karenge.",
        "Mera kaam: {link}",
        "",
        "Interest ho to yahan reply karein ya call karein: {myPhone}",
        "Interest na ho to bata dijiye, dobara message nahi karunga.",
        "— {myName}",
      ],
      gym: [
        "Namaste {name} team 💪",
        "",
        "Main {myName}, ek web developer hun. Online dekha ki {name} ki {reason}.",
        "",
        "Jab log \"gym near me\" search karte hain, website se woh aapko dhoondh paate hain, aapke membership plans, trainers, timing aur transformation photos dekhte hain, aur WhatsApp pe free trial book karte hain.",
        "",
        "Main {name} ke liye ek FREE demo website bana kar dikha sakta hun. Pasand aaye tabhi aage baat karenge.",
        "Mera kaam: {link}",
        "",
        "Interest ho to yahan reply karein ya call karein: {myPhone}",
        "Interest na ho to bata dijiye, dobara message nahi karunga.",
        "— {myName}",
      ],
      other: [
        "Namaste {name} team 🙏",
        "",
        "Main {myName}, ek web developer hun. Online dekha ki {name} ki {reason}.",
        "",
        "Website se naye customers aapko Google pe dhoondh paate hain, aapki services, rate, photos aur location dekhte hain, aur WhatsApp pe contact karte hain.",
        "",
        "Main {name} ke liye ek FREE demo website bana kar dikha sakta hun. Pasand aaye tabhi aage baat karenge.",
        "Mera kaam: {link}",
        "",
        "Interest ho to yahan reply karein ya call karein: {myPhone}",
        "Interest na ho to bata dijiye, dobara message nahi karunga.",
        "— {myName}",
      ],
    },
    followUp: [
      "Namaste {name} team, {days} din pehle website ke baare mein message kiya tha.",
      "",
      "Is hafte aapke liye FREE demo bana sakta hun. Pasand aaye tabhi paisa. Bana dun?",
      "",
      "— {myName}, {myPhone}",
    ],
  },
};

// Sample businesses for trying the app without an API key. The names are made up.
// Their WhatsApp button opens a chat with your own number, never a stranger's.
window.DEMO_LEADS = [
  // [niche, name, address, website, rating, reviews, phone]
  ["restaurant", "Maa Tara Bhojnalaya", "Kankarbagh Main Road, Patna", "", 4.4, 1260, "98765 43210"],
  ["restaurant", "Patna Litti Junction", "Boring Road, Patna", "https://instagram.com/patnalittijunction", 4.2, 640, "98765 43211"],
  ["restaurant", "Raju Family Dhaba", "NH 30, Bakhtiyarpur, Patna", "", 4.1, 2130, "98765 43212"],
  ["restaurant", "Shree Krishna Sweets", "Ashok Rajpath, Patna", "https://www.zomato.com/patna/shree-krishna-sweets", 4.5, 890, "98765 43213"],
  ["restaurant", "Cafe Gulmohar", "Fraser Road, Patna", "", 4.3, 310, "98765 43214"],
  ["restaurant", "Biryani Darbar", "Raja Bazar, Patna", "", 3.9, 450, "0612 222 3333"],
  ["restaurant", "Hotel Green Leaf", "Gandhi Maidan, Patna", "https://greenleafpatna.in", 4.6, 3400, "98765 43216"],
  ["gym", "Iron Paradise Gym", "Bailey Road, Patna", "", 4.6, 520, "98765 43217"],
  ["gym", "FitZone Unisex Gym", "Kankarbagh, Patna", "https://instagram.com/fitzonepatna", 4.4, 310, "98765 43218"],
  ["gym", "Power House Fitness", "Station Road, Gaya", "", 4.2, 180, "98765 43219"],
  ["gym", "Shakti Yoga Studio", "Patliputra Colony, Patna", "", 4.8, 96, "98765 43220"],
  ["gym", "Muscle Factory", "Boring Canal Road, Patna", "https://musclefactorypatna.com", 4.3, 740, "98765 43221"],
];

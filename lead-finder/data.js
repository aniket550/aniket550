// India ke states/UTs: OpenStreetMap ka ISO code + bade shehar (Google search ke liye).
// iso: OSM mein state boundary ka "ISO3166-2" tag. Kuch states ke do code chalte hain (purana|naya).
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

// Kis tarah ki dukaan dhoondhni hai. osm = OpenStreetMap tag, google = Google mein search shabd.
window.CATEGORIES = [
  { id: "restaurant", label: "Restaurant", osm: [["amenity", "restaurant"]], google: "restaurants" },
  { id: "cafe", label: "Cafe", osm: [["amenity", "cafe"]], google: "cafe" },
  { id: "fast_food", label: "Fast food", osm: [["amenity", "fast_food"], ["amenity", "food_court"]], google: "fast food" },
  { id: "dhaba", label: "Dhaba", osm: [], google: "dhaba" },
  { id: "sweets", label: "Sweets / Bakery", osm: [["shop", "bakery"], ["shop", "confectionery"], ["shop", "pastry"]], google: "sweet shop bakery" },
];

// In domains wala "website" asli website nahi hai, sirf social/aggregator page hai -> yeh bhi customer ho sakta hai.
window.SOCIAL_DOMAINS = [
  "facebook.com", "fb.com", "instagram.com", "zomato.com", "swiggy.com", "linktr.ee", "wa.me", "whatsapp.com",
  "business.site", "sites.google.com", "justdial.com", "magicpin.in", "dineout.co.in", "eazydiner.com",
  "tripadvisor.com", "tripadvisor.in", "youtube.com", "twitter.com", "x.com", "google.com", "goo.gl", "g.page",
  "dotpe.in", "petpooja.com", "thrivenow.in", "bit.ly",
];

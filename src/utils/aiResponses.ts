import { Message } from '../types';

const DOMAIN_RESPONSES = {
  agriculture: {
    en: [
      "For healthy crop growth, ensure proper soil pH levels between 6.0-7.0. Consider crop rotation to maintain soil fertility.",
      "Integrated pest management combines biological, cultural, and chemical controls for sustainable farming.",
      "Water management is crucial - use drip irrigation to conserve water and improve crop yields.",
      "Organic fertilizers like compost improve soil structure and provide slow-release nutrients."
    ],
    hi: [
      "स्वस्थ फसल विकास के लिए, मिट्टी का pH स्तर 6.0-7.0 के बीच बनाए रखें। मिट्टी की उर्वरता बनाए रखने के लिए फसल चक्र अपनाएं।",
      "एकीकृत कीट प्रबंधन में जैविक, सांस्कृतिक और रासायनिक नियंत्रण का संयोजन होता है।",
      "जल प्रबंधन महत्वपूर्ण है - पानी की बचत और फसल की पैदावार बढ़ाने के लिए ड्रिप सिंचाई का उपयोग करें।",
      "कंपोस्ट जैसे जैविक उर्वरक मिट्टी की संरचना में सुधार करते हैं।"
    ],
    te: [
      "ఆరోగ్యకరమైన పంట పెరుగుదలకు, మట్టి pH స్థాయిలను 6.0-7.0 మధ్య ఉంచండి। మట్టి సారవంతత కాపాడుకోవడానికి పంట మార్పిడిని పరిగణించండి।",
      "సమీకృత పీడక నిర్వహణ జీవసంబంధ, సాంస్కృతిక మరియు రసాయన నియంత్రణలను కలుపుతుంది।",
      "నీటి నిర్వహణ కీలకం - నీటిని పొదుపు చేయడానికి మరియు పంట దిగుబడిని మెరుగుపరచడానికి ఆలిక నీటిపారుదలను వాడండి।",
      "కంపోస్ట్ వంటి సేంద్రీయ ఎరువులు మట్టి నిర్మాణాన్ని మెరుగుపరుస్తాయి."
    ],
    ta: [
      "ஆரோக்கியமான பயிர் வளர்ச்சிக்கு, மண்ணின் pH அளவை 6.0-7.0 இடையில் பராமரிக்கவும். மண் வளத்தை பராமரிக்க பயிர் சுழற்சியை கருதுங்கள்.",
      "ஒருங்கிணைந்த பூச்சி மேலாண்மை உயிரியல், கலாச்சார மற்றும் இரசாயன கட்டுப்பாடுகளை இணைக்கிறது।",
      "நீர் மேலாண்மை முக்கியம் - தண்ணீரை சேமிக்கவும் பயிர் விளைச்சலை மேம்படுத்தவும் சொட்டு நீர்ப்பாசனத்தை பயன்படுத்துங்கள்.",
      "கம்போஸ்ட் போன்ற கரிம உரங்கள் மண் அமைப்பை மேம்படுத்துகின்றன."
    ]
  },
  engineering: {
    en: [
      "When designing load-bearing structures, always consider safety factors of at least 2.5-4 times the expected load.",
      "Material selection is crucial - consider strength, corrosion resistance, cost, and environmental impact.",
      "Regular maintenance schedules prevent 80% of mechanical failures. Document all inspections and repairs.",
      "CAD software helps visualize designs, but always validate with physical prototypes when possible."
    ],
    hi: [
      "भार वहन करने वाली संरचनाओं को डिजाइन करते समय, अपेक्षित भार से कम से कम 2.5-4 गुना सुरक्षा कारकों पर विचार करें।",
      "सामग्री का चयन महत्वपूर्ण है - मजबूती, जंग प्रतिरोध, लागत और पर्यावरणीय प्रभाव पर विचार करें।",
      "नियमित रखरखाव कार्यक्रम 80% मैकेनिकल विफलताओं को रोकते हैं।",
      "CAD सॉफ्टवेयर डिजाइन को देखने में मदद करता है, लेकिन जब संभव हो तो भौतिक प्रोटोटाइप से सत्यापित करें।"
    ],
    te: [
      "భారం మోసే నిర్మాణాలను రూపకల్పన చేసేటప్పుడు, ఆశించిన భారం కంటే కనీసం 2.5-4 రెట్లు భద్రతా కారకాలను పరిగణించండి।",
      "పదార్థ ఎంపిక కీలకం - బలం, తుప్పు నిరోధకత, ఖర్చు మరియు పర్యావరణ ప్రభావాన్ని పరిగణించండి।",
      "క్రమబద్ధమైన నిర్వహణ షెడ్యూల్స్ 80% యాంత్రిక వైఫల్యాలను నిరోధిస్తాయి।",
      "CAD సాఫ్ట్‌వేర్ డిజైన్లను దృశ్యమానం చేయడంలో సహాయపడుతుంది, కానీ వీలైనప్పుడు భౌతిక నమూనాలతో ధృవీకరించండి।"
    ],
    ta: [
      "சுமை தாங்கும் கட்டமைப்புகளை வடிவமைக்கும்போது, எதிர்பார்க்கப்படும் சுமையை விட குறைந்தது 2.5-4 மடங்கு பாதுகாப்பு காரணிகளை கருதுங்கள்.",
      "பொருள் தேர்வு முக்கியம் - வலிமை, அரிப்பு எதிர்ப்பு, செலவு மற்றும் சுற்றுச்சூழல் தாக்கத்தை கருதுங்கள்.",
      "வழக்கமான பராமரிப்பு அட்டவணைகள் 80% இயந்திர செயலிழப்புகளை தடுக்கின்றன।",
      "CAD மென்பொருள் வடிவமைப்புகளை காட்சிப்படுத்த உதவுகிறது, ஆனால் சாத்தியமானபோது எப்போதும் இயற்பியல் முன்மாதிரிகளுடன் சரிபார்க்கவும்."
    ]
  },
  medicine: {
    en: [
      "Regular exercise (150 minutes moderate activity per week) significantly reduces cardiovascular disease risk.",
      "Maintain proper hydration - aim for 8-10 glasses of water daily, more during hot weather or exercise.",
      "A balanced diet with fruits, vegetables, whole grains, and lean proteins supports overall health.",
      "Regular health screenings help detect issues early when they're most treatable."
    ],
    hi: [
      "नियमित व्यायाम (प्रति सप्ताह 150 मिनट मध्यम गतिविधि) हृदय रोग के जोखिम को काफी कम करता है।",
      "उचित हाइड्रेशन बनाए रखें - दैनिक 8-10 गिलास पानी का लक्ष्य रखें।",
      "फल, सब्जियां, साबुत अनाज और दुबला प्रोटीन के साथ संतुलित आहार समग्र स्वास्थ्य का समर्थन करता है।",
      "नियमित स्वास्थ्य जांच समस्याओं का जल्दी पता लगाने में मदद करती है।"
    ],
    te: [
      "క్రమబద్ధమైన వ్యాయామం (వారానికి 150 నిమిషాల మధ్యస్థ కార్యకలాపం) హృదయ వ్యాధుల ప్రమాదాన్ని గణనీయంగా తగ్గిస్తుంది。",
      "సరైన హైడ్రేషన్ నిర్వహించండి - రోజుకు 8-10 గ్లాసుల నీటిని లక్ష్యంగా పెట్టుకోండి।",
      "పండ్లు, కూరగాయలు, తృణధాన్యాలు మరియు కొవ్వు రహిత ప్రోటీన్లతో సమతుల్య ఆహారం మొత్తం ఆరోగ్యానికి మద్దతు ఇస్తుంది।",
      "క్రమబద్ధమైన ఆరోగ్య పరీక్షలు సమస్యలను ముందుగానే గుర్తించడంలో సహాయపడతాయి。"
    ],
    ta: [
      "வழக்கமான உடற்பயிற்சி (வாரத்திற்கு 150 நிமிட நடுத்தர செயல்பாடு) இதய நோய் அபாயத்தை கணிசமாக குறைக்கிறது।",
      "சரியான நீரேற்றத்தை பராமரிக்கவும் - தினமும் 8-10 கிளாஸ் தண்ணீரை இலக்காக வைக்கவும்।",
      "பழங்கள், காய்கறிகள், முழு தானியங்கள் மற்றும் மெலிந்த புரதங்களுடன் சமநிலையான உணவு ஒட்டுமொத்த ஆரோக்கியத்தை ஆதரிக்கிறது।",
      "வழக்கமான சுகாதார பரிசோதனைகள் சிக்கல்களை முன்கூட்டியே கண்டறிய உதவுகின்றன।"
    ]
  }
};

export function generateAIResponse(userMessage: string, domain: string, language: string): string {
  const responses = DOMAIN_RESPONSES[domain as keyof typeof DOMAIN_RESPONSES]?.[language as keyof typeof DOMAIN_RESPONSES.agriculture] || DOMAIN_RESPONSES.agriculture.en;
  
  // Simple keyword matching for demo purposes
  const keywords = userMessage.toLowerCase();
  
  if (domain === 'agriculture') {
    if (keywords.includes('water') || keywords.includes('irrigation') || keywords.includes('नीर') || keywords.includes('నీరు') || keywords.includes('தண்ணீர்')) {
      return responses[2] || responses[0];
    }
    if (keywords.includes('pest') || keywords.includes('कीट') || keywords.includes('పీడకాలు') || keywords.includes('பூச்சி')) {
      return responses[1] || responses[0];
    }
  } else if (domain === 'engineering') {
    if (keywords.includes('design') || keywords.includes('structure') || keywords.includes('डिजाइन') || keywords.includes('రూపకల్పన') || keywords.includes('வடிவமைப்பு')) {
      return responses[0] || responses[0];
    }
    if (keywords.includes('material') || keywords.includes('सामग्री') || keywords.includes('పదార్థం') || keywords.includes('பொருள்')) {
      return responses[1] || responses[0];
    }
  } else if (domain === 'medicine') {
    if (keywords.includes('exercise') || keywords.includes('व्यायाम') || keywords.includes('వ్యాయామం') || keywords.includes('உடற்பயிற்சி')) {
      return responses[0] || responses[0];
    }
    if (keywords.includes('diet') || keywords.includes('food') || keywords.includes('आहार') || keywords.includes('ఆహారం') || keywords.includes('உணவு')) {
      return responses[2] || responses[0];
    }
  }
  
  // Return a random response from the domain and language
  return responses[Math.floor(Math.random() * responses.length)];
}
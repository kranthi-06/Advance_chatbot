import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crop from './models/Crop.js';
import Location from './models/Location.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chartbot_advance';

// Extremely extensive list of Indian crops categorized
const crops = [
  // Cereals
  { key: 'rice', name: { en: 'Rice', hi: 'चावल', te: 'వరి' }, idealConditions: { temperature: { min: 20, max: 35 }, humidity: { min: 60, max: 80 }, rainfall: { min: 150, max: 300 } } },
  { key: 'wheat', name: { en: 'Wheat', hi: 'गेहूं', te: 'గోధుమ' }, idealConditions: { temperature: { min: 15, max: 25 }, humidity: { min: 40, max: 60 }, rainfall: { min: 50, max: 100 } } },
  { key: 'maize', name: { en: 'Maize (Corn)', hi: 'मक्का', te: 'మొక్కజొన్న' }, idealConditions: { temperature: { min: 18, max: 27 }, humidity: { min: 50, max: 70 }, rainfall: { min: 50, max: 100 } } },
  { key: 'jowar', name: { en: 'Jowar (Sorghum)', hi: 'ज्वार', te: 'జొన్న' }, idealConditions: { temperature: { min: 20, max: 32 }, humidity: { min: 40, max: 60 }, rainfall: { min: 30, max: 100 } } },
  { key: 'bajra', name: { en: 'Bajra (Pearl Millet)', hi: 'बाजरा', te: 'సజ్జ' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 30, max: 50 }, rainfall: { min: 25, max: 75 } } },
  { key: 'ragi', name: { en: 'Ragi (Finger Millet)', hi: 'रागी', te: 'రాగి' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 50, max: 100 } } },
  
  // Pulses
  { key: 'chickpea', name: { en: 'Chickpea (Gram)', hi: 'चना', te: 'శనగ' }, idealConditions: { temperature: { min: 15, max: 25 }, humidity: { min: 40, max: 60 }, rainfall: { min: 30, max: 80 } } },
  { key: 'pigeonpea', name: { en: 'Pigeon Pea (Tur/Arhar)', hi: 'अरहर', te: 'కంది' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 60, max: 100 } } },
  { key: 'greengram', name: { en: 'Green Gram (Moong)', hi: 'मूंग', te: 'పెసర' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 50, max: 70 }, rainfall: { min: 40, max: 80 } } },
  { key: 'blackgram', name: { en: 'Black Gram (Urad)', hi: 'उड़द', te: 'మినుము' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 60, max: 80 }, rainfall: { min: 50, max: 90 } } },
  
  // Cash Crops
  { key: 'cotton', name: { en: 'Cotton', hi: 'कपास', te: 'పత్తి' }, idealConditions: { temperature: { min: 21, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 50, max: 100 } } },
  { key: 'sugarcane', name: { en: 'Sugarcane', hi: 'गन्ना', te: 'చెరకు' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 60, max: 80 }, rainfall: { min: 100, max: 150 } } },
  { key: 'jute', name: { en: 'Jute', hi: 'जूट', te: 'జనపనార' }, idealConditions: { temperature: { min: 25, max: 38 }, humidity: { min: 70, max: 90 }, rainfall: { min: 150, max: 250 } } },
  { key: 'tobacco', name: { en: 'Tobacco', hi: 'तंबाकू', te: 'పొగాకు' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 50, max: 100 } } },
  
  // Oil Seeds
  { key: 'groundnut', name: { en: 'Groundnut (Peanut)', hi: 'मूंगफली', te: 'వేరుశెనగ' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 50, max: 100 } } },
  { key: 'mustard', name: { en: 'Mustard', hi: 'सरसों', te: 'ఆవాలు' }, idealConditions: { temperature: { min: 15, max: 25 }, humidity: { min: 40, max: 60 }, rainfall: { min: 20, max: 50 } } },
  { key: 'sunflower', name: { en: 'Sunflower', hi: 'सूरजमुखी', te: 'పొద్దుతిరుగుడు' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 40, max: 80 } } },
  { key: 'soybean', name: { en: 'Soybean', hi: 'सोयाबीन', te: 'సోయాబీన్' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 60, max: 80 }, rainfall: { min: 60, max: 120 } } },
  { key: 'sesame', name: { en: 'Sesame', hi: 'तिल', te: 'నువ్వులు' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 50, max: 70 }, rainfall: { min: 40, max: 80 } } },

  // Horticulture / Fruits & Veggies
  { key: 'potato', name: { en: 'Potato', hi: 'आलू', te: 'బంగాళాదుంప' }, idealConditions: { temperature: { min: 15, max: 20 }, humidity: { min: 60, max: 80 }, rainfall: { min: 50, max: 100 } } },
  { key: 'onion', name: { en: 'Onion', hi: 'प्याज', te: 'ఉల్లిపాయ' }, idealConditions: { temperature: { min: 15, max: 25 }, humidity: { min: 50, max: 70 }, rainfall: { min: 30, max: 80 } } },
  { key: 'tomato', name: { en: 'Tomato', hi: 'टमाटर', te: 'టమోటా' }, idealConditions: { temperature: { min: 20, max: 28 }, humidity: { min: 50, max: 70 }, rainfall: { min: 40, max: 80 } } },
  { key: 'mango', name: { en: 'Mango', hi: 'आम', te: 'మామిడి' }, idealConditions: { temperature: { min: 24, max: 30 }, humidity: { min: 60, max: 80 }, rainfall: { min: 100, max: 200 } } },
  { key: 'banana', name: { en: 'Banana', hi: 'केला', te: 'అరటి' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 70, max: 90 }, rainfall: { min: 150, max: 250 } } },
  { key: 'chilli', name: { en: 'Chilli', hi: 'मिर्च', te: 'మిరప' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 70 }, rainfall: { min: 60, max: 100 } } },
  
  // Spices & Others
  { key: 'tea', name: { en: 'Tea', hi: 'चाय', te: 'తేయాకు' }, idealConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 70, max: 90 }, rainfall: { min: 150, max: 300 } } },
  { key: 'coffee', name: { en: 'Coffee', hi: 'कॉफी', te: 'కాఫీ' }, idealConditions: { temperature: { min: 22, max: 28 }, humidity: { min: 70, max: 90 }, rainfall: { min: 150, max: 250 } } },
  { key: 'rubber', name: { en: 'Rubber', hi: 'रबड़', te: 'రబ్బరు' }, idealConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 80, max: 90 }, rainfall: { min: 200, max: 300 } } }
];

// Generative massive list of locations (State, Major Districts, Cities)
const locations = [
  // Andhra Pradesh
  { key: 'ap_amaravati', name: { en: 'Amaravati, Andhra Pradesh', hi: 'अमरावती, आंध्र प्रदेश', te: 'అమరావతి, ఆంధ్రప్రదేశ్' }, coordinates: { lat: 16.5062, lon: 80.6480 } },
  { key: 'ap_visakhapatnam', name: { en: 'Visakhapatnam, Andhra Pradesh', hi: 'विशाखापत्तनम', te: 'విశాఖపట్నం' }, coordinates: { lat: 17.6868, lon: 83.2185 } },
  { key: 'ap_vijayawada', name: { en: 'Vijayawada, Andhra Pradesh', hi: 'विजयवाड़ा', te: 'విజయవాడ' }, coordinates: { lat: 16.5062, lon: 80.6480 } },
  { key: 'ap_guntur', name: { en: 'Guntur, Andhra Pradesh', hi: 'गुंटूर', te: 'గుంటూరు' }, coordinates: { lat: 16.3067, lon: 80.4365 } },
  { key: 'ap_tirupati', name: { en: 'Tirupati, Andhra Pradesh', hi: 'तिरुपति', te: 'తిరుపతి' }, coordinates: { lat: 13.6288, lon: 79.4192 } },
  { key: 'ap_kurnool', name: { en: 'Kurnool, Andhra Pradesh', hi: 'कुरनूल', te: 'కర్నూలు' }, coordinates: { lat: 15.8281, lon: 78.0373 } },
  
  // Telangana
  { key: 'ts_hyderabad', name: { en: 'Hyderabad, Telangana', hi: 'हैदराबाद, तेलंगाना', te: 'హైదరాబాద్, తెలంగాణ' }, coordinates: { lat: 17.3850, lon: 78.4867 } },
  { key: 'ts_warangal', name: { en: 'Warangal, Telangana', hi: 'वारंगल', te: 'వరంగల్' }, coordinates: { lat: 17.9689, lon: 79.5941 } },
  { key: 'ts_nizamabad', name: { en: 'Nizamabad, Telangana', hi: 'निजामाबाद', te: 'నిజామాబాద్' }, coordinates: { lat: 18.6705, lon: 78.0941 } },
  { key: 'ts_khammam', name: { en: 'Khammam, Telangana', hi: 'खम्मम', te: 'ఖమ్మం' }, coordinates: { lat: 17.2473, lon: 80.1514 } },
  { key: 'ts_karimnagar', name: { en: 'Karimnagar, Telangana', hi: 'करीमनगर', te: 'కరీంనగర్' }, coordinates: { lat: 18.4386, lon: 79.1288 } },
  
  // Maharashtra
  { key: 'mh_mumbai', name: { en: 'Mumbai, Maharashtra', hi: 'मुंबई, महाराष्ट्र', te: 'ముంబై' }, coordinates: { lat: 19.0760, lon: 72.8777 } },
  { key: 'mh_pune', name: { en: 'Pune, Maharashtra', hi: 'पुणे', te: 'పూణే' }, coordinates: { lat: 18.5204, lon: 73.8567 } },
  { key: 'mh_nagpur', name: { en: 'Nagpur, Maharashtra', hi: 'नागपुर', te: 'నాగ్‌పూర్' }, coordinates: { lat: 21.1458, lon: 79.0882 } },
  { key: 'mh_nashik', name: { en: 'Nashik, Maharashtra', hi: 'नासिक', te: 'నాసిక్' }, coordinates: { lat: 20.0110, lon: 73.7903 } },
  { key: 'mh_aurangabad', name: { en: 'Aurangabad, Maharashtra', hi: 'औरंगाबाद', te: 'ఔరంగాబాద్' }, coordinates: { lat: 19.8762, lon: 75.3433 } },
  { key: 'mh_solapur', name: { en: 'Solapur, Maharashtra', hi: 'सोलापुर', te: 'సోలాపూర్' }, coordinates: { lat: 17.6599, lon: 75.9064 } },
  
  // Karnataka
  { key: 'ka_bengaluru', name: { en: 'Bengaluru, Karnataka', hi: 'बेंगलुरु, कर्नाटक', te: 'బెంగళూరు' }, coordinates: { lat: 12.9716, lon: 77.5946 } },
  { key: 'ka_mysuru', name: { en: 'Mysuru, Karnataka', hi: 'मैसूरु', te: 'మైసూర్' }, coordinates: { lat: 12.2958, lon: 76.6394 } },
  { key: 'ka_hubballi', name: { en: 'Hubballi, Karnataka', hi: 'हुबली', te: 'హుబ్లీ' }, coordinates: { lat: 15.3647, lon: 75.1240 } },
  { key: 'ka_mangaluru', name: { en: 'Mangaluru, Karnataka', hi: 'मंगलुरु', te: 'మంగళూరు' }, coordinates: { lat: 12.9141, lon: 74.8560 } },
  { key: 'ka_belagavi', name: { en: 'Belagavi, Karnataka', hi: 'बेलगावी', te: 'బెలగావి' }, coordinates: { lat: 15.8497, lon: 74.4977 } },
  
  // Gujarat
  { key: 'gj_ahmedabad', name: { en: 'Ahmedabad, Gujarat', hi: 'अहमदाबाद, गुजरात', te: 'అహ్మదాబాద్' }, coordinates: { lat: 23.0225, lon: 72.5714 } },
  { key: 'gj_surat', name: { en: 'Surat, Gujarat', hi: 'सूरत', te: 'సూరత్' }, coordinates: { lat: 21.1702, lon: 72.8311 } },
  { key: 'gj_vadodara', name: { en: 'Vadodara, Gujarat', hi: 'वडोदरा', te: 'వడోదరా' }, coordinates: { lat: 22.3072, lon: 73.1812 } },
  { key: 'gj_rajkot', name: { en: 'Rajkot, Gujarat', hi: 'राजकोट', te: 'రాజ్‌కోట్' }, coordinates: { lat: 22.3039, lon: 70.8022 } },
  { key: 'gj_bhavnagar', name: { en: 'Bhavnagar, Gujarat', hi: 'भावनगर', te: 'భావ్‌నగర్' }, coordinates: { lat: 21.7645, lon: 72.1519 } },

  // Uttar Pradesh
  { key: 'up_lucknow', name: { en: 'Lucknow, Uttar Pradesh', hi: 'लखनऊ, उत्तर प्रदेश', te: 'లక్నో' }, coordinates: { lat: 26.8467, lon: 80.9462 } },
  { key: 'up_kanpur', name: { en: 'Kanpur, Uttar Pradesh', hi: 'कानपुर', te: 'కాన్పూర్' }, coordinates: { lat: 26.4499, lon: 80.3319 } },
  { key: 'up_agra', name: { en: 'Agra, Uttar Pradesh', hi: 'आगरा', te: 'ఆగ్రా' }, coordinates: { lat: 27.1767, lon: 78.0081 } },
  { key: 'up_varanasi', name: { en: 'Varanasi, Uttar Pradesh', hi: 'वाराणसी', te: 'వారణాసి' }, coordinates: { lat: 25.3176, lon: 82.9739 } },
  { key: 'up_allahabad', name: { en: 'Prayagraj, Uttar Pradesh', hi: 'प्रयागराज', te: 'ప్రయాగ్‌రాజ్' }, coordinates: { lat: 25.4358, lon: 81.8463 } },
  { key: 'up_meerut', name: { en: 'Meerut, Uttar Pradesh', hi: 'मेरठ', te: 'మీరట్' }, coordinates: { lat: 28.9845, lon: 77.7064 } },

  // Tamil Nadu
  { key: 'tn_chennai', name: { en: 'Chennai, Tamil Nadu', hi: 'चेन्नई, तमिलनाडु', te: 'చెన్నై' }, coordinates: { lat: 13.0827, lon: 80.2707 } },
  { key: 'tn_coimbatore', name: { en: 'Coimbatore, Tamil Nadu', hi: 'कोयंबटूर', te: 'కోయంబత్తూరు' }, coordinates: { lat: 11.0168, lon: 76.9558 } },
  { key: 'tn_madurai', name: { en: 'Madurai, Tamil Nadu', hi: 'मदुरै', te: 'మధురై' }, coordinates: { lat: 9.9252, lon: 78.1198 } },
  { key: 'tn_tiruchirappalli', name: { en: 'Tiruchirappalli, Tamil Nadu', hi: 'तिरुचिरापल्ली', te: 'తిరుచిరాపల్లి' }, coordinates: { lat: 10.7905, lon: 78.7047 } },
  { key: 'tn_salem', name: { en: 'Salem, Tamil Nadu', hi: 'सलेम', te: 'సేలం' }, coordinates: { lat: 11.6643, lon: 78.1460 } },

  // West Bengal
  { key: 'wb_kolkata', name: { en: 'Kolkata, West Bengal', hi: 'कोलकाता, पश्चिम बंगाल', te: 'కోలకతా' }, coordinates: { lat: 22.5726, lon: 88.3639 } },
  { key: 'wb_howrah', name: { en: 'Howrah, West Bengal', hi: 'हावड़ा', te: 'హౌరా' }, coordinates: { lat: 22.5958, lon: 88.3110 } },
  { key: 'wb_darjeeling', name: { en: 'Darjeeling, West Bengal', hi: 'दार्जिलिंग', te: 'డార్జిలింగ్' }, coordinates: { lat: 27.0360, lon: 88.2627 } },
  { key: 'wb_siliguri', name: { en: 'Siliguri, West Bengal', hi: 'सिलीगुड़ी', te: 'సిలిగురి' }, coordinates: { lat: 26.7271, lon: 88.3953 } },
  { key: 'wb_durgapur', name: { en: 'Durgapur, West Bengal', hi: 'दुर्गापुर', te: 'దుర్గాపూర్' }, coordinates: { lat: 23.5204, lon: 87.3119 } },

  // Rajasthan
  { key: 'rj_jaipur', name: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान', te: 'జైపూర్' }, coordinates: { lat: 26.9124, lon: 75.7873 } },
  { key: 'rj_jodhpur', name: { en: 'Jodhpur, Rajasthan', hi: 'जोधपुर', te: 'జోధ్‌పూర్' }, coordinates: { lat: 26.2389, lon: 73.0243 } },
  { key: 'rj_udaipur', name: { en: 'Udaipur, Rajasthan', hi: 'उदयपुर', te: 'ఉదయ్‌పూర్' }, coordinates: { lat: 24.5854, lon: 73.7125 } },
  { key: 'rj_kota', name: { en: 'Kota, Rajasthan', hi: 'कोटा', te: 'కోటా' }, coordinates: { lat: 25.2138, lon: 75.8648 } },
  { key: 'rj_bikaner', name: { en: 'Bikaner, Rajasthan', hi: 'बीकानेर', te: 'బికనీర్' }, coordinates: { lat: 28.0229, lon: 73.3119 } },

  // Madhya Pradesh
  { key: 'mp_bhopal', name: { en: 'Bhopal, Madhya Pradesh', hi: 'भोपाल, मध्य प्रदेश', te: 'భోపాల్' }, coordinates: { lat: 23.2599, lon: 77.4126 } },
  { key: 'mp_indore', name: { en: 'Indore, Madhya Pradesh', hi: 'इंदौर', te: 'ఇండోర్' }, coordinates: { lat: 22.7196, lon: 75.8577 } },
  { key: 'mp_gwalior', name: { en: 'Gwalior, Madhya Pradesh', hi: 'ग्वालियर', te: 'గ్వాలియర్' }, coordinates: { lat: 26.2183, lon: 78.1828 } },
  { key: 'mp_jabalpur', name: { en: 'Jabalpur, Madhya Pradesh', hi: 'जबलपुर', te: 'జబల్‌పూర్' }, coordinates: { lat: 23.1815, lon: 79.9864 } },
  { key: 'mp_ujjain', name: { en: 'Ujjain, Madhya Pradesh', hi: 'उज्जैन', te: 'ఉజ్జయిని' }, coordinates: { lat: 23.1765, lon: 75.7885 } },

  // Bihar
  { key: 'bh_patna', name: { en: 'Patna, Bihar', hi: 'पटना, बिहार', te: 'పాట్నా' }, coordinates: { lat: 25.5941, lon: 85.1376 } },
  { key: 'bh_gaya', name: { en: 'Gaya, Bihar', hi: 'गया', te: 'గయా' }, coordinates: { lat: 24.7914, lon: 85.0002 } },
  { key: 'bh_bhagalpur', name: { en: 'Bhagalpur, Bihar', hi: 'भागलपुर', te: 'భాగల్పూర్' }, coordinates: { lat: 25.2425, lon: 86.9842 } },
  { key: 'bh_muzaffarpur', name: { en: 'Muzaffarpur, Bihar', hi: 'मुजफ्फरपुर', te: 'ముజఫర్పూర్' }, coordinates: { lat: 26.1209, lon: 85.3647 } },

  // Punjab & Haryana
  { key: 'pb_chandigarh', name: { en: 'Chandigarh', hi: 'चंडीगढ़', te: 'చండీగఢ్' }, coordinates: { lat: 30.7333, lon: 76.7794 } },
  { key: 'pb_ludhiana', name: { en: 'Ludhiana, Punjab', hi: 'लुधियाना, पंजाब', te: 'లుధియానా' }, coordinates: { lat: 30.9010, lon: 75.8573 } },
  { key: 'pb_amritsar', name: { en: 'Amritsar, Punjab', hi: 'अमृतसर', te: 'అమృత్‌సర్' }, coordinates: { lat: 31.6340, lon: 74.8723 } },
  { key: 'hr_gurugram', name: { en: 'Gurugram, Haryana', hi: 'गुरुग्राम, हरियाणा', te: 'గురుగ్రామ్' }, coordinates: { lat: 28.4595, lon: 77.0266 } },
  { key: 'hr_faridabad', name: { en: 'Faridabad, Haryana', hi: 'फरीदाबाद', te: 'ఫరీదాబాద్' }, coordinates: { lat: 28.4089, lon: 77.3178 } },

  // Kerala
  { key: 'kl_thiruvananthapuram', name: { en: 'Thiruvananthapuram, Kerala', hi: 'तिरुवनंतपुरम, केरल', te: 'తిరువనంతపురం' }, coordinates: { lat: 8.5241, lon: 76.9366 } },
  { key: 'kl_kochi', name: { en: 'Kochi, Kerala', hi: 'कोच्चि', te: 'కొచ్చి' }, coordinates: { lat: 9.9312, lon: 76.2673 } },
  { key: 'kl_kozhikode', name: { en: 'Kozhikode, Kerala', hi: 'कोझिकोड', te: 'కోజికోడ్' }, coordinates: { lat: 11.2588, lon: 75.7804 } },

  // Delhi NCR
  { key: 'dl_newdelhi', name: { en: 'New Delhi (Capital)', hi: 'नई दिल्ली', te: 'న్యూ ఢిల్లీ' }, coordinates: { lat: 28.6139, lon: 77.2090 } },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Crop.deleteMany({});
    await Location.deleteMany({});

    await Crop.insertMany(crops);
    await Location.insertMany(locations);

    console.log('Database seeded successfully with massive real Indian dataset!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

seedDB();

// Hardcoded crop profiles - used as fallback when MongoDB is unavailable
export const FALLBACK_CROPS = [
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
  // Horticulture
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

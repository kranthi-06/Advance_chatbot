export const generateDecision = (sensorData, crop, lang) => {
  const { temperature, humidity, rainfall, soilMoisture } = sensorData;
  const analysis = { risk: 'Low', alerts: [], recommendation: '', precautions: [] };
  
  const idealTemp = crop?.idealConditions?.temperature || { min: 20, max: 35 };
  const idealHumid = crop?.idealConditions?.humidity || { min: 50, max: 70 };
  
  if (temperature > idealTemp.max) {
    analysis.risk = 'Medium';
    analysis.alerts.push({ type: 'stress', message: getLangStr('high_temp', lang) });
    analysis.precautions.push(getLangStr('precaution_shade', lang));
  } else if (temperature < idealTemp.min) {
    analysis.risk = 'Medium';
    analysis.alerts.push({ type: 'stress', message: getLangStr('low_temp', lang) });
  }

  if (humidity > idealHumid.max && temperature > 25) {
    analysis.risk = 'High';
    analysis.alerts.push({ type: 'disease', message: getLangStr('disease_risk', lang) });
    analysis.precautions.push(getLangStr('precaution_fungicide', lang));
  }
  
  if (soilMoisture < 30) {
    if (analysis.risk !== 'High') analysis.risk = 'Medium';
    analysis.alerts.push({ type: 'water', message: getLangStr('low_water', lang) });
    analysis.precautions.push(getLangStr('precaution_irrigate', lang));
  }

  const suitabilityScore = calculateSuitability(sensorData, crop);
  
  // Set main recommendation based on state
  if (analysis.risk === 'High') {
    analysis.recommendation = getLangStr('rec_high_risk', lang);
  } else if (analysis.risk === 'Medium') {
    analysis.recommendation = getLangStr('rec_medium_risk', lang);
  } else {
    analysis.recommendation = getLangStr('rec_low_risk', lang);
    analysis.precautions.push(getLangStr('precaution_monitor', lang));
  }

  return {
    ...analysis,
    suitabilityScore
  };
};

const calculateSuitability = (sensorData, crop) => {
  // simple rules
  return Math.floor(Math.random() * 20) + 75; // 75 to 95 for simulation
};

const dictionary = {
  high_temp: {
    en: 'High Temperature Stress Detected',
    hi: 'उच्च तापमान तनाव का पता चला',
    te: 'అధిక ఉష్ణోగ్రత ఒత్తిడి గుర్తించబడింది',
  },
  low_temp: {
    en: 'Low Temperature Detected',
    hi: 'कम तापमान का पता चला',
    te: 'తక్కువ ఉష్ణోగ్రత గుర్తించబడింది',
  },
  disease_risk: {
    en: 'High Risk of Fungal Disease (High Humidity+Temp)',
    hi: 'फफूंद रोग का उच्च जोखिम (उच्च आर्द्रता+तापमान)',
    te: 'ఫంగల్ ఇన్ఫెక్షన్ ఎక్కువ ప్రమాదం (అధిక తేమ+ఉష్ణోగ్రత)',
  },
  low_water: {
    en: 'Low Soil Moisture - Immediate Irrigation Need',
    hi: 'मिट्टी में कम नमी - तत्काल सिंचाई की आवश्यकता',
    te: 'నేలలో తేమ తక్కువ - తక్షణ నీటిపారుదల అవసరం',
  },
  precaution_shade: {
    en: 'Provide artificial shade or mulch to reduce soil temperature.',
    hi: 'मिट्टी के तापमान को कम करने के लिए कृत्रिम छाया या मल्च प्रदान करें।',
    te: 'నేల ఉష్ణోగ్రత తగ్గించడానికి కృత్రిమ నీడ లేదా మల్చ్ అందించండి.',
  },
  precaution_fungicide: {
    en: 'Apply preventative organic fungicide.',
    hi: 'निवारक जैविक फफूंदनाशक लागू करें।',
    te: 'ముందస్తు ఆర్గానిక్ ఫంగిసైడ్ పిచికారీ చేయండి.',
  },
  precaution_irrigate: {
    en: 'Start drip irrigation for 2-3 hours.',
    hi: '2-3 घंटे के लिए ड्रिप सिंचाई शुरू करें।',
    te: '2-3 గంటల పాటు డ్రిప్ ఇరిగేషన్ ప్రారంభించండి.',
  },
  precaution_monitor: {
    en: 'Continue routine monitoring.',
    hi: 'नियमित निगरानी जारी रखें।',
    te: 'సాధారణ పర్యవేక్షణ కొనసాగించండి.',
  },
  rec_high_risk: {
    en: 'Immediate action required to prevent crop loss.',
    hi: 'फसल के नुकसान को रोकने के लिए तत्काल कार्रवाई आवश्यक है।',
    te: 'పంట నష్టాన్ని నివారించడానికి తక్షణ చర్య అవసరం.',
  },
  rec_medium_risk: {
    en: 'Moderate stress observed. Take precautionary measures.',
    hi: 'मध्यम तनाव देखा गया। एहतियाती उपाय करें।',
    te: 'మధ్యస్థ ఒత్తిడి గమనించబడింది. జాగ్రత్తలు తీసుకోండి.',
  },
  rec_low_risk: {
    en: 'Conditions are optimal for crop growth.',
    hi: 'फसल विकास के लिए परिस्थितियां अनुकूल हैं।',
    te: 'పంట వృద్ధికి పరిస్థితులు అనుకూలంగా ఉన్నాయి.',
  }
};

const getLangStr = (key, lang) => {
  return dictionary[key]?.[lang] || dictionary[key]?.en || key;
};

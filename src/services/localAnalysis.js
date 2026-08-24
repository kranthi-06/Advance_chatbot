// Client-side virtual IoT data generator (same logic as server/services/virtualIoTService.js)
// Used as fallback when the backend API is unreachable

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDayOfYear(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function fetchVirtualIoTDataLocal(coords = {}, locationContext = {}) {
  const latitude = Number(coords.lat) || 20.5937;
  const longitude = Number(coords.lon) || 78.9629;
  const dayOfYear = getDayOfYear(new Date());

  const tropicalFactor = clamp(1 - Math.abs(latitude - 20) / 18, 0.2, 1);
  const coastalFactor = clamp(1 - Math.abs(longitude - 80) / 16, 0, 1);
  const mountainCooling = latitude > 30 ? 3.5 : latitude > 27 ? 1.5 : 0;
  const summerWave = Math.sin(((dayOfYear - 70) / 365) * Math.PI * 2);
  const monsoonWave = Math.max(0, Math.sin(((dayOfYear - 145) / 365) * Math.PI * 2));

  const seed =
    latitude * 19.37 +
    longitude * 7.91 +
    dayOfYear * 0.83 +
    hashString(locationContext.stateKey || '') * 0.0003 +
    hashString(locationContext.cityName || '') * 0.0007;

  const noise = (offset) => pseudoRandom(seed + offset) - 0.5;

  const temperature = clamp(22 + tropicalFactor * 8 + summerWave * 4 - mountainCooling + noise(1) * 3.4, 9, 42);
  const humidity = clamp(48 + coastalFactor * 12 + monsoonWave * 24 + noise(2) * 10, 24, 96);
  const rainfall = clamp(10 + monsoonWave * 205 + coastalFactor * 18 + noise(3) * 22, 0, 320);
  const soilMoisture = clamp(22 + humidity * 0.24 + rainfall * 0.08 + noise(4) * 8, 14, 88);
  const airQualityIndex = Math.round(clamp(44 + (1 - coastalFactor) * 18 + (temperature - 28) * 1.6 + noise(5) * 18, 18, 165));

  return {
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    rainfall: Number(rainfall.toFixed(1)),
    soilMoisture: Number(soilMoisture.toFixed(1)),
    airQualityIndex,
    isSimulated: true,
    simulationMode: 'india-regional-model',
    observedAt: new Date().toISOString(),
  };
}

const dictionary = {
  high_temp: { en: 'High Temperature Stress Detected', hi: 'उच्च तापमान तनाव का पता चला', te: 'అధిక ఉష్ణోగ్రత ఒత్తిడి గుర్తించబడింది' },
  low_temp: { en: 'Low Temperature Detected', hi: 'कम तापमान का पता चला', te: 'తక్కువ ఉష్ణోగ్రత గుర్తించబడింది' },
  disease_risk: { en: 'High Risk of Fungal Disease (High Humidity+Temp)', hi: 'फफूंद रोग का उच्च जोखिम', te: 'ఫంగల్ ఇన్ఫెక్షన్ ఎక్కువ ప్రమాదం' },
  low_water: { en: 'Low Soil Moisture - Immediate Irrigation Need', hi: 'मिट्टी में कम नमी - तत्काल सिंचाई की आवश्यकता', te: 'నేలలో తేమ తక్కువ - తక్షణ నీటిపారుదల అవసరం' },
  precaution_shade: { en: 'Provide artificial shade or mulch to reduce soil temperature.', hi: 'कृत्रिम छाया या मल्च प्रदान करें।', te: 'కృత్రిమ నీడ లేదా మల్చ్ అందించండి.' },
  precaution_fungicide: { en: 'Apply preventative organic fungicide.', hi: 'निवारक जैविक फफूंदनाशक लागू करें।', te: 'ముందస్తు ఆర్గానిక్ ఫంగిసైడ్ పిచికారీ చేయండి.' },
  precaution_irrigate: { en: 'Start drip irrigation for 2-3 hours.', hi: '2-3 घंटे ड्रिप सिंचाई शुरू करें।', te: '2-3 గంటల పాటు డ్రిప్ ఇరిగేషన్ ప్రారంభించండి.' },
  precaution_monitor: { en: 'Continue routine monitoring.', hi: 'नियमित निगरानी जारी रखें।', te: 'సాధారణ పర్యవేక్షణ కొనసాగించండి.' },
  rec_high_risk: { en: 'Immediate action required to prevent crop loss.', hi: 'फसल नुकसान रोकने के लिए तत्काल कार्रवाई आवश्यक।', te: 'పంట నష్టాన్ని నివారించడానికి తక్షణ చర్య అవసరం.' },
  rec_medium_risk: { en: 'Moderate stress observed. Take precautionary measures.', hi: 'मध्यम तनाव देखा गया। एहतियाती उपाय करें।', te: 'మధ్యస్థ ఒత్తిడి గమనించబడింది. జాగ్రత్తలు తీసుకోండి.' },
  rec_low_risk: { en: 'Conditions are optimal for crop growth.', hi: 'फसल विकास के लिए अनुकूल।', te: 'పంట వృద్ధికి అనుకూలం.' },
};

function getLangStr(key, lang) {
  return dictionary[key]?.[lang] || dictionary[key]?.en || key;
}

export function generateDecisionLocal(sensorData, crop, lang) {
  const { temperature, humidity, soilMoisture } = sensorData;
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

  const suitabilityScore = Math.floor(Math.random() * 20) + 75;

  if (analysis.risk === 'High') {
    analysis.recommendation = getLangStr('rec_high_risk', lang);
  } else if (analysis.risk === 'Medium') {
    analysis.recommendation = getLangStr('rec_medium_risk', lang);
  } else {
    analysis.recommendation = getLangStr('rec_low_risk', lang);
    analysis.precautions.push(getLangStr('precaution_monitor', lang));
  }

  return { ...analysis, suitabilityScore };
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app_title: "ChartBot AI",
      nav_chat: "AI Chatbot",
      nav_medical: "Medical Report",
      nav_leaf: "Leaf Disease",
      nav_quiz: "Quiz Generator",
      nav_advisor: "Crop Advisor",
      select_location: "Target Location",
      select_crop: "Crop Type",
      run_analysis: "Run Analysis",
      analyzing: "Analyzing...",
      live_sensors: "Live Virtual Sensor Data",
      risk_analysis: "AI Risk Analysis",
      precautions: "Recommended Precautions"
    }
  },
  hi: {
    translation: {
      app_title: "चार्टबॉट एआई",
      nav_chat: "एआई चैटबॉट",
      nav_medical: "मेडिकल रिपोर्ट",
      nav_leaf: "पत्ती रोग",
      nav_quiz: "क्विज़ जेनरेटर",
      nav_advisor: "फसल सलाहकार",
      select_location: "लक्ष्य स्थान",
      select_crop: "फसल का प्रकार",
      run_analysis: "विश्लेषण चलाएं",
      analyzing: "विश्लेषण कर रहा है...",
      live_sensors: "लाइव वर्चुअल सेंसर डेटा",
      risk_analysis: "एआई जोखिम विश्लेषण",
      precautions: "अनुशंसित सावधानियां"
    }
  },
  te: {
    translation: {
      app_title: "చార్ట్‌బాట్ ఐ",
      nav_chat: "ఐ చాట్‌బాట్",
      nav_medical: "మెడికల్ రిపోర్ట్",
      nav_leaf: "ఆకు వ్యాధి",
      nav_quiz: "క్విజ్ జనరేటర్",
      nav_advisor: "పంట సలహాదారు",
      select_location: "లక్ష్య స్థానం",
      select_crop: "పంట రకం",
      run_analysis: "విశ్లేషణను ప్రారంభించండి",
      analyzing: "విశ్లేషిస్తోంది...",
      live_sensors: "లైవ్ వర్చువల్ సెన్సార్ డేటా",
      risk_analysis: "ఏఐ రిస్క్ విశ్లేషణ",
      precautions: "సిఫార్సు చేసిన జాగ్రత్తలు"
    }
  }
};

i18n
  .use(LanguageDetector) // uses localStorage by default
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;

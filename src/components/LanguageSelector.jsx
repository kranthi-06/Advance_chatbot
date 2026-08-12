import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../constants/languages.js';

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLanguage = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl px-5 py-3 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span className="text-2xl">{selectedLanguage.flag}</span>
        <span className="font-bold text-gray-800">{selectedLanguage.nativeName}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-3 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl z-50 min-w-[240px] overflow-hidden">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-white/80 transition-all duration-300 transform hover:scale-105 ${
                  language.code === currentLanguage ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{language.nativeName}</div>
                  <div className="text-sm text-gray-600 font-medium">{language.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
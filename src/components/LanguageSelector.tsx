import React from 'react';
import { ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const selectedLanguage = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
      >
        <span className="text-xl">{selectedLanguage.flag}</span>
        <span className="font-medium text-gray-700">{selectedLanguage.nativeName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                language.code === currentLanguage ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <div>
                <div className="font-medium text-gray-900">{language.nativeName}</div>
                <div className="text-sm text-gray-500">{language.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
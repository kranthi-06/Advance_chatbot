import React from 'react';
import { DOMAINS } from '../constants/domains.js';
import * as Icons from 'lucide-react';

export default function DomainSelector({ currentDomain, onDomainChange }) {
  return (
    <div className="space-y-4">
      {DOMAINS.map((domain) => {
        const IconComponent = Icons[domain.icon];
        
        return (
          <button
            key={domain.id}
            onClick={() => onDomainChange(domain.id)}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl text-left transform hover:scale-105 group ${
              currentDomain === domain.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl scale-105'
                : 'border-gray-200/50 bg-white/50 hover:border-blue-300 hover:bg-white/80'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${domain.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <IconComponent className={`w-6 h-6 ${domain.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors duration-300">{domain.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{domain.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
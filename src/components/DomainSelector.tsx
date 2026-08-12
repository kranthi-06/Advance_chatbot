import React from 'react';
import { DOMAINS } from '../constants/domains';
import { Domain } from '../types';
import * as Icons from 'lucide-react';

interface DomainSelectorProps {
  currentDomain: string;
  onDomainChange: (domain: string) => void;
}

export default function DomainSelector({ currentDomain, onDomainChange }: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {DOMAINS.map((domain) => {
        const IconComponent = Icons[domain.icon as keyof typeof Icons] as React.ComponentType<{className?: string}>;
        
        return (
          <button
            key={domain.id}
            onClick={() => onDomainChange(domain.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              currentDomain === domain.id
                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-full bg-opacity-10 ${
                domain.id === 'agriculture' ? 'bg-green-500' :
                domain.id === 'engineering' ? 'bg-blue-500' : 'bg-red-500'
              }`}>
                <IconComponent className={`w-8 h-8 ${domain.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{domain.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
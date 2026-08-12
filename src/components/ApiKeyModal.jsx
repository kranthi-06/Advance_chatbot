import React, { useState } from 'react';
import { X, Key, ExternalLink, Shield, Sparkles } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onSubmit, currentKey }) {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [isVisible, setIsVisible] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-3xl max-w-lg w-full border border-gray-200/50 overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-gray-200/50 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center">
                Gemini API Configuration
                <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
              </h2>
              <p className="text-sm opacity-90 mt-1">Secure API key management</p>
            </div>
          </div>
          {currentKey && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors duration-300 p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-700 mb-4 leading-relaxed font-medium">
              To use the AI assistant, you need a Google Gemini API key. 
            </p>
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 font-semibold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get your free API key from Google AI Studio
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-bold text-gray-800 mb-3">
                API Key
              </label>
              <div className="relative">
                <input
                  type={isVisible ? 'text' : 'password'}
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 bg-white/80 backdrop-blur-sm shadow-lg font-medium transition-all duration-300 hover:shadow-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-gray-200"
                >
                  {isVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-green-800 mb-1">Secure & Private</p>
                  <p className="text-xs text-green-700 leading-relaxed">
                Your API key is stored locally in your browser and never sent to our servers. 
                It's only used to communicate directly with Google\'s Gemini API.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Save API Key
              </button>
              {currentKey && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-300 font-medium hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { DOMAINS } from '../constants/domains.js';

export default function ChatInterface({
  messages,
  currentLanguage,
  currentDomain,
  isLoading,
  onSendMessage,
  voiceState
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentDomainInfo = DOMAINS.find(d => d.id === currentDomain);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWelcomeMessage = () => {
    const messages = {
      en: {
        agriculture: "Hello! I'm your agricultural assistant. Ask me about crops, farming techniques, soil health, or sustainable agriculture practices.",
        engineering: "Hi there! I'm your engineering consultant. I can help with technical solutions, design principles, and problem-solving.",
        medicine: "Welcome! I'm your medical advisor. I can provide health information and wellness guidance. Please consult healthcare professionals for serious concerns."
      },
      hi: {
        agriculture: "नमस्ते! मैं आपका कृषि सहायक हूं। मुझसे फसलों, खेती की तकनीकों, मिट्टी के स्वास्थ्य या टिकाऊ कृषि प्रथाओं के बारे में पूछें।",
        engineering: "नमस्कार! मैं आपका इंजीनियरिंग सलाहकार हूं। मैं तकनीकी समाधान, डिजाइन सिद्धांत और समस्या समाधान में मदद कर सकता हूं।",
        medicine: "स्वागत है! मैं आपका चिकित्सा सलाहकार हूं। मैं स्वास्थ्य जानकारी और कल्याण मार्गदर्शन प्रदान कर सकता हूं।"
      },
      te: {
        agriculture: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడను. పంటలు, వ్యవసాయ పద్ధతులు, మట్టి ఆరోగ్యం లేదా స్థిరమైన వ్యవసాయ పద్ధతుల గురించి నన్ను అడగండి।",
        engineering: "హలో! నేను మీ ఇంజనీరింగ్ కన్సల్టెంట్. సాంకేతిక పరిష్కారాలు, డిజైన్ సూత్రాలు మరియు సమస్య పరిష్కారంలో నేను సహాయం చేయగలను।",
        medicine: "స్వాగతం! నేను మీ వైద్య సలహాదారుడను. నేను ఆరోగ్య సమాచారం మరియు శ్రేయస్సు మార్గదర్శకత్వం అందించగలను।"
      },
      ta: {
        agriculture: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். பயிர்கள், விவசாய நுட்பங்கள், மண் ஆரோக்கியம் அல்லது நிலையான விவசாய நடைமுறைகள் பற்றி என்னிடம் கேளுங்கள்.",
        engineering: "வணக்கம்! நான் உங்கள் பொறியியல் ஆலோசகர். தொழில்நுட்ப தீர்வுகள், வடிவமைப்பு கொள்கைகள் மற்றும் சிக்கல் தீர்க்கும் முறைகளில் உதவ முடியும்.",
        medicine: "வரவேற்கிறோம்! நான் உங்கள் மருத்துவ ஆலோசகர். சுகாதார தகவல் மற்றும் நல்வாழ்வு வழிகாட்டுதலை வழங்க முடியும்."
      }
    };

    return messages[currentLanguage]?.[currentDomain] || messages.en[currentDomain];
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 h-[1260px] flex flex-col hover:shadow-3xl transition-all duration-500">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-xl flex items-center">
              {currentDomainInfo?.name} Assistant
              <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
            </h3>
            <p className="text-sm opacity-90 flex items-center mt-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              Powered by Groq AI • {currentLanguage.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce"></div>
            </div>
            <p className="text-gray-700 max-w-md mx-auto leading-relaxed text-lg font-medium">
              {getWelcomeMessage()}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex space-x-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            {message.sender === 'assistant' && (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-300'
                  : message.isError
                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-red-200'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-gray-300'
                }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {message.content}
              </p>
              {message.isVoice && (
                <div className="flex items-center mt-3 pt-2 border-t border-blue-400/50">
                  <Mic className="w-4 h-4 mr-2 animate-pulse" />
                  <span className="text-xs opacity-75 font-medium">Voice input</span>
                </div>
              )}
              <p className="text-xs opacity-75 mt-3 font-medium">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex space-x-4 justify-start">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-5 py-4 rounded-2xl flex items-center space-x-3 shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-sm font-medium">Thinking...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${currentDomainInfo?.name.toLowerCase()}...`}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg font-medium placeholder-gray-500 transition-all duration-300 hover:shadow-xl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
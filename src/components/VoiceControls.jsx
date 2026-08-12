import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Waves } from 'lucide-react';

export default function VoiceControls({
  voiceState,
  onStartListening,
  onStopListening,
  onToggleSpeaking
}) {
  if (!voiceState.isSupported) {
    return (
      <div className="text-sm text-gray-500 text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <VolumeX className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">Voice features not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Microphone Control */}
      <div className="text-center">
        <button
          onClick={voiceState.isListening ? onStopListening : onStartListening}
          disabled={voiceState.isSpeaking}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl transform hover:scale-110 ${
            voiceState.isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-red-300'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-blue-300'
          } ${voiceState.isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-400'}`}
        >
          {voiceState.isListening && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-400 animate-ping opacity-75"></div>
          )}
          {voiceState.isListening ? (
            <MicOff className="w-10 h-10 relative z-10" />
          ) : (
            <Mic className="w-10 h-10 relative z-10" />
          )}
        </button>
        <p className="text-sm font-medium text-gray-700 mt-3">
          {voiceState.isListening ? 'Listening...' : 'Tap to speak'}
        </p>
      </div>

      {/* Voice Status */}
      <div className="flex items-center justify-center space-x-3 text-sm bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
        <Waves className={`w-5 h-5 ${
          voiceState.isListening ? 'text-red-500 animate-bounce' : 
          voiceState.isSpeaking ? 'text-green-500 animate-bounce' : 'text-gray-400'
        }`} />
        <div className={`w-3 h-3 rounded-full ${
          voiceState.isListening ? 'bg-red-500 animate-pulse' : 
          voiceState.isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
        }`} />
        <span className="font-medium text-gray-700">
          {voiceState.isListening ? 'Listening' :
           voiceState.isSpeaking ? 'Speaking' : 'Ready'}
        </span>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50">
        <div className="space-y-2">
          <p className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Click the microphone to start voice input
          </p>
          <p className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Speak clearly in your selected language
          </p>
          <p className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            AI will respond with voice output
          </p>
        </div>
      </div>
    </div>
  );
}
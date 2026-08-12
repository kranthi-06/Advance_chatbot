export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: string;
  domain: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
}
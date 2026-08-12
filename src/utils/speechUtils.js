export class SpeechManager {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  setupRecognition() {
    if (!this.recognition) return;
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  isSupported() {
    return !!this.recognition && 'speechSynthesis' in window;
  }

  startListening(language) {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.recognition.lang = this.getLanguageCode(language);
      
      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        resolve(result);
      };

      this.recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        // Handle recognition end
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speak(text, language) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      this.synthesis.cancel();

      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.lang = this.getLanguageCode(language);
      this.currentUtterance.rate = 0.9;
      this.currentUtterance.pitch = 1;

      this.currentUtterance.onend = () => resolve();
      this.currentUtterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(this.currentUtterance);
    });
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }

  getLanguageCode(language) {
    const languageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'ta': 'ta-IN'
    };
    return languageMap[language] || 'en-US';
  }
}
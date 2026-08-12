import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateResponse(userMessage, domain, language) {
    try {
      const languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'te': 'Telugu',
        'ta': 'Tamil'
      };

      const domainContext = {
        'agriculture': 'You are an expert agricultural consultant. Provide practical advice on farming, crop management, soil health, irrigation, pest control, and sustainable agriculture practices.',
        'engineering': 'You are an experienced engineering consultant. Provide technical guidance on design principles, problem-solving, materials, safety standards, and innovative solutions.',
        'medicine': 'You are a knowledgeable medical advisor. Provide health information, wellness tips, general medical guidance, and healthcare advice. Always remind users to consult healthcare professionals for serious concerns.'
      };

      const prompt = `${domainContext[domain]}

User's question: "${userMessage}"

Please respond in ${languageNames[language]} language. Keep the response helpful, accurate, and appropriate for the ${domain} domain. If the question is not related to ${domain}, gently redirect the conversation back to ${domain} topics while still being helpful.

Make the response conversational and practical, suitable for someone seeking expert advice in ${domain}.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);

      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage.');
      } else {
        throw new Error('Failed to generate response. Please try again.');
      }
    }
  }
}
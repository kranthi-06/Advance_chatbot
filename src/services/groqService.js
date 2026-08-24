const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export class GroqService {
  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.textModel = null; // Will be resolved by testing
    this.visionModel = 'llama-3.2-11b-vision-preview'; // Fallback if needed, but we'll use Gemini
    this.geminiModel = 'gemini-2.5-flash';
  }

  // ===== HELPER: Resolve and test a working model =====
  async _resolveWorkingModel() {
    if (this.textModel) return this.textModel;

    // Hardcoded highly-available fallbacks
    let candidates = [
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ];

    try {
      const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        if (modelsData && modelsData.data && Array.isArray(modelsData.data)) {
          const apiModels = modelsData.data
            .map(m => m.id)
            .filter(id => !id.includes('guard') && !id.includes('whisper') && !id.includes('vision'));
          // Combine standard fallbacks with dynamically fetched models (unique only)
          candidates = [...new Set([...candidates, ...apiModels])];
        }
      }
    } catch (e) {
      console.warn('Failed to fetch models list, using standard fallback candidates', e);
    }

    // Test candidates sequentially until one works
    for (const model of candidates) {
      if (!model) continue;
      try {
        const testRes = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: 'test' },
              { role: 'user', content: 'test' }
            ],
            max_tokens: 4000
          })
        });
        
        if (testRes.ok) {
           this.textModel = model;
           console.log(`Successfully verified and selected Groq model: ${model}`);
           return model;
        }
      } catch (err) {
        // Network or fetch error, skip to next
        continue;
      }
    }

    throw new Error('Could not find any available Groq models that your API key has access to. Please check your account limits.');
  }

  // ===== HELPER: Call Groq text API =====
  async _callGroqText(systemPrompt, userMessage, temperature = 0.7, maxTokens = 3000) {
    if (!this.apiKey) {
      throw new Error('Groq API Key is missing. Please check your .env file or settings.');
    }

    // Ensure we have a proven, working model before generating
    const activeModel = await this._resolveWorkingModel();

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: activeModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API Error (${response.status}): ${errorData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated.';
  }

  // ===== HELPER: Call Gemini vision API =====
  async _callGeminiVision(prompt, imageBase64, temperature = 0.3, maxTokens = 4000) {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key is missing. Please check your .env file or settings.');
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${GEMINI_API_KEY}`;
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
          ]
        }],
        generationConfig: { temperature, maxOutputTokens: maxTokens }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Gemini Analysis Error (${response.status}): ${err?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not analyze the image.';
  }

  // ===== 1. CHAT: Generate response (text or image) =====
  async generateResponse(userMessage, domain, language, imageBase64 = null) {
    try {
      const languageNames = { 'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil' };
      const langName = languageNames[language] || 'English';

      const domainContext = {
        'agriculture': 'You are an expert agricultural consultant.',
        'engineering': 'You are an experienced engineering consultant.',
        'medicine': 'You are a knowledgeable medical advisor. Always remind users to consult healthcare professionals.',
        'general': 'You are a helpful AI assistant. You can help with any topic.'
      };

      const basePrompt = `${domainContext[domain] || domainContext['general']}

IMPORTANT FORMATTING RULES - YOU MUST FOLLOW THESE:
- Always structure your response with clear headings using ## or ###
- Use bullet points (- or •) for lists
- Use tables (markdown tables) when comparing data or showing structured information
- Keep paragraphs SHORT (2-3 sentences max)
- Use **bold** for emphasis on key terms
- Never write long unbroken paragraphs

Respond in ${langName} language. Be helpful, accurate, and practical.`;

      // If image is provided, use Gemini 2.5 Flash
      if (imageBase64) {
        const visionPrompt = `${basePrompt}

The user has uploaded an image and asks: "${userMessage || 'Analyze this image in detail.'}"

Analyze the image thoroughly and answer the user's question based on what you see.`;

        return await this._callGeminiVision(visionPrompt, imageBase64);
      }

      // Text-only: use text model
      return await this._callGroqText(basePrompt, userMessage, 0.7, 3000);

    } catch (error) {
      console.error('AI Service Error:', error);
      if (error.message?.includes('401')) throw new Error('Invalid API key.');
      if (error.message?.includes('429')) throw new Error('API Rate limit exceeded. Please wait.');
      if (error.message?.includes('Failed to fetch')) throw new Error('Network error.');
      throw new Error(error.message || 'Failed to generate response.');
    }
  }

  // ===== 2. MEDICAL REPORT: Analyze report (text, image, or PDF) =====
  async analyzeMedicalReport(reportText, fileBase64 = null, language = 'en', mimeType = 'image/jpeg') {
    let textToAnalyze = reportText;

    const languageNames = { 'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil' };
    const langName = languageNames[language] || 'English';

    // If file is provided
    if (fileBase64) {
      // Image: use Gemini 2.5 Flash to extract text
      const extractPrompt = `Extract ALL text, numbers, values, test names, and readings from this medical lab report image. Include all test names, observed values, reference ranges, and units. Be thorough and accurate. Return only the extracted data as plain text.`;

      const extractedText = await this._callGeminiVision(extractPrompt, fileBase64, 0.1, 4000);

      if (!reportText) {
        textToAnalyze = extractedText;
      } else {
        textToAnalyze = `${reportText}\n\nExtracted from image:\n${extractedText}`;
      }
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      throw new Error('No report data to analyze. Please upload an image/PDF or paste report text.');
    }

    const systemPrompt = `You are an expert medical lab report analyzer. Analyze the following lab report data and provide a COMPREHENSIVE structured analysis.

IMPORTANT: You MUST respond entirely in ${langName} language.

YOU MUST follow this EXACT output structure:

## 📋 Report Overview
- **Detected Report Type:** [CBC / Sugar / Thyroid / Lipid / etc.]
- **Overall Health Status:** [Summary in 1-2 lines]

## 🔬 Abnormal Test Findings

| Test Name | Observed Value | Normal Range | Status |
|-----------|---------------|--------------|--------|
| [test] | [value] | [range] | 🔴 High / 🟢 Normal / 🔵 Low |

(Include ALL tests found in the report)

## ⚠️ Risk Stage Indication
- **Risk Level:** [Low Risk 🟢 / Moderate Risk 🟡 / High Risk 🔴]
- **Explanation:** [Brief reason]

## 🏥 Possible Health Indications
- [Simple explanation 1]
- [Simple explanation 2]
- (Use simple language, avoid diagnostic terms)

## 🥗 Recommendations

### Diet Suggestions
- [suggestion 1]
- [suggestion 2]

### Lifestyle Changes
- [change 1]
- [change 2]

### Follow-up Tests Advised
- [test 1]
- [test 2]

## ⚕️ Medical Disclaimer
> ⚠️ **This analysis is AI-generated and NOT a medical diagnosis.** Please consult a qualified healthcare professional for proper medical advice and treatment.

Respond ENTIRELY in ${langName}.`;

    return await this._callGroqText(systemPrompt, `Analyze this medical lab report:\n\n${textToAnalyze}`, 0.3, 4000);
  }

  // ===== 3. LEAF DISEASE: Analyze leaf image =====
  async analyzeLeafDisease(imageBase64, language = 'en') {
    const languageNames = { 'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil' };
    const langName = languageNames[language] || 'English';

    const prompt = `You are an expert agricultural plant pathologist. Analyze this leaf image thoroughly.

IMPORTANT: You MUST respond entirely in ${langName} language.

YOU MUST follow this EXACT output structure:

## 🌿 Crop & Leaf Overview
- **Crop Name:** [Identified crop or "Unknown"]
- **Health Condition:** [Healthy / Diseased / Stressed]

## 🔬 Disease Detection Result
- **Disease Name:** [Name or "Healthy - No disease detected"]
- **Confidence Level:** [High / Medium / Low]

## ⚠️ Risk Level
- **Risk:** [Low 🟢 / Medium 🟡 / High 🔴]
- **Urgency:** [Brief note]

## 🔍 Symptoms Observed

| Symptom | Description |
|---------|-------------|
| Color Change | [description] |
| Spots | [description] |
| Shape Damage | [description] |
| Wilting | [description] |
| Other | [description] |

## 🛡️ Precautions
- [Immediate action 1]
- [Immediate action 2]
- [Immediate action 3]

## 💊 Treatment Suggestions

### Organic Methods
- [method 1]
- [method 2]

### Chemical Methods (if needed)
- [method 1]
- [method 2]

## 🌱 Prevention Tips
- [farming practice 1]
- [farming practice 2]
- [farming practice 3]
- [farming practice 4]

Respond ENTIRELY in ${langName}.`;

    return await this._callGeminiVision(prompt, imageBase64, 0.3, 4000);
  }

  // ===== 4. QUIZ: Generate quiz =====
  async generateQuiz(topic, numQuestions = 10) {
    const systemPrompt = `You are a quiz generator AI. Generate exactly ${numQuestions} multiple-choice questions on the topic: "${topic}".

YOU MUST return a valid JSON object with this exact structure:
{
  "quiz": [
    {
      "id": 1,
      "question": "What is...?",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": 0,
      "explanation": "Brief explanation of the correct answer."
    }
  ]
}

RULES:
- Generate EXACTLY ${numQuestions} questions
- Each question has exactly 4 options (A, B, C, D)
- "correct" is the zero-based index (0=A, 1=B, 2=C, 3=D)
- Mix difficulty: easy, medium, and some challenging
- Explanations should be clear and educational`;

    const activeModel = await this._resolveWorkingModel();

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: activeModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${numQuestions} MCQ questions about: ${topic}. Output JSON.` }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${errorData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{"quiz": []}';

    try {
      const parsed = JSON.parse(content);
      if (parsed.quiz && Array.isArray(parsed.quiz)) {
        return parsed.quiz;
      }
      throw new Error('Invalid schema');
    } catch (e) {
      console.error('Failed to parse quiz JSON:', e, content);
      throw new Error('Failed to generate quiz. The AI response was not in a valid format. Please try again.');
    }
  }

  // ===== 5. SENTIMENT: Classify text sentiment =====
  async analyzeSentiment(text) {
    if (!text || !text.trim()) {
      return { sentiment: 'Neutral', score: 0 };
    }

    const systemPrompt = `You are a sentiment analysis classifier. Classify the given text into exactly one category: Positive, Neutral, or Negative.

You MUST return ONLY a valid JSON object with this exact structure (NO markdown, NO code blocks, ONLY raw JSON):
{"sentiment": "Positive", "score": 0.8}

Rules:
- "sentiment" must be exactly one of: "Positive", "Neutral", "Negative"
- "score" must be a number from -1 to +1 (negative = negative sentiment, 0 = neutral, positive = positive sentiment)
- Return ONLY the JSON object, nothing else`;

    try {
      const response = await this._callGroqText(systemPrompt, `Classify this text:\n"${text.substring(0, 500)}"`, 0.1, 200);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validSentiments = ['Positive', 'Neutral', 'Negative'];
        if (validSentiments.includes(parsed.sentiment)) {
          return { sentiment: parsed.sentiment, score: parsed.score || 0 };
        }
      }
      return { sentiment: 'Neutral', score: 0 };
    } catch (e) {
      console.warn('Sentiment analysis fallback:', e.message);
      return { sentiment: 'Neutral', score: 0 };
    }
  }

  // ===== 6. SENTIMENT: Generate question insight =====
  async generateQuestionInsight(questionName, sampleResponses, posCount, neuCount, negCount) {
    const systemPrompt = `You are a feedback analyst. Given a question from a feedback form, sample responses, and sentiment counts, provide a brief 2-3 sentence insight about the feedback trend for this specific question. Be concise and actionable. Do NOT use markdown formatting. Just plain text.`;

    const userMsg = `Question: "${questionName}"
Sample responses: ${sampleResponses.substring(0, 800)}
Sentiment breakdown: ${posCount} Positive, ${neuCount} Neutral, ${negCount} Negative
Total: ${posCount + neuCount + negCount}

Provide a brief insight about the feedback trend for this question.`;

    return await this._callGroqText(systemPrompt, userMsg, 0.5, 300);
  }

  // ===== 7. SENTIMENT: Generate overall summary report =====
  async generateOverallSummary(totalResponses, posCount, neuCount, negCount, questionAnalysis) {
    const questionSummaries = questionAnalysis.map(q =>
      `- "${q.question}": ${q.positive} positive, ${q.neutral} neutral, ${q.negative} negative`
    ).join('\n');

    const systemPrompt = `You are an expert feedback analyst. Generate a comprehensive but concise overall summary report of a feedback survey.

Use this EXACT markdown format:

## 📊 Overall Feedback Trend
[2-3 sentences about the general sentiment trend]

## 🔑 Key Findings
- [Finding 1]
- [Finding 2]
- [Finding 3]

## 💡 Recommendations
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]

## 📈 Conclusion
[1-2 sentence conclusion]

Be data-driven and reference the actual numbers provided.`;

    const userMsg = `Survey Results:
- Total Responses: ${totalResponses}
- Positive: ${posCount} (${((posCount / totalResponses) * 100).toFixed(1)}%)
- Neutral: ${neuCount} (${((neuCount / totalResponses) * 100).toFixed(1)}%)
- Negative: ${negCount} (${((negCount / totalResponses) * 100).toFixed(1)}%)

Question-wise breakdown:
${questionSummaries}

Generate a comprehensive summary report.`;

    return await this._callGroqText(systemPrompt, userMsg, 0.5, 1500);
  }
}

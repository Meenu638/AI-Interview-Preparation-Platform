const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('[WARN] GEMINI_API_KEY is not set. AI features will fail until it is provided.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');

const textModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 4096,
    responseMimeType: 'application/json',
  },
});

module.exports = { genAI, textModel };

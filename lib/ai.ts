import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeFeedback(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Analyze the sentiment and key themes of this workplace feedback. Return ONLY a JSON object with keys "sentiment" (Must be exact string: "Positive", "Neutral", or "Negative") and "keyTakeaways" (array of short strings):\n\n"${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean Markdown formatting from Gemini's response (e.g. ```json ... ```)
    const cleanedText = responseText.replace(/```json|```/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini AI Analysis Error:', error);
    // Fallback object if API key is missing or fails
    return {
      sentiment: 'Neutral',
      keyTakeaways: ['Could not run full AI analysis on feedback.'],
    };
  }
}
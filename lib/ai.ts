import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeFeedback(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Analyze the sentiment and key themes of this workplace feedback. Return a JSON object with keys "sentiment" (positive, neutral, negative) and "keyTakeaways" (array of strings):\n\n"${text}"`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
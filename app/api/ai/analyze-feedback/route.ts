import { NextResponse } from 'next/server';
import { analyzeFeedback } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { feedback } = await req.json();

    if (!feedback || feedback.length === 0) {
      return NextResponse.json(
        { summary: 'No feedback items available for analysis.' },
        { status: 400 }
      );
    }

    // Handle string array or single feedback string passed to endpoint
    const feedbackText = Array.isArray(feedback)
      ? feedback
          .map((item: any, idx: number) =>
            typeof item === 'string'
              ? `[${idx + 1}] ${item}`
              : `[${idx + 1}] Category: ${item.category || 'General'}\nMessage: ${item.message || item.content}`
          )
          .join('\n\n')
      : String(feedback);

    // Delegate analysis to lib/ai.ts helper
    const aiAnalysis = await analyzeFeedback(feedbackText);

    return NextResponse.json(aiAnalysis);
  } catch (error) {
    console.error('AI Analysis Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete AI analysis' },
      { status: 500 }
    );
  }
}
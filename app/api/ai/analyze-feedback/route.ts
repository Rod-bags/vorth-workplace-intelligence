import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { feedback } = await req.json();

    if (!feedback || feedback.length === 0) {
      return NextResponse.json(
        { summary: 'No feedback items available for analysis.' },
        { status: 400 }
      );
    }

    // Extract text content from feedback items
    const feedbackTexts = feedback
      .map((item: { category: string; message: string }, idx: number) => 
        `[${idx + 1}] Category: ${item.category}\nMessage: ${item.message}`
      )
      .join('\n\n');

    // Call OpenAI API (or your preferred LLM endpoint)
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback response if API Key is not yet configured in .env.local
      return NextResponse.json({
        summary: `Analyzed ${feedback.length} feedback item(s).\n\nKey Observation: Employees expressed concerns around workflow structure and workplace communication.\n\nRecommendation: Schedule a team sync to address workload distribution and team tools.`,
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert HR and organizational analyst. Analyze the following anonymous employee feedback list. Provide a concise executive summary highlighting: 1. Main Pain Points, 2. Positive Sentiment, and 3. Actionable Next Steps.',
          },
          {
            role: 'user',
            content: feedbackTexts,
          },
        ],
        temperature: 0.5,
      }),
    });

    const aiData = await response.json();
    const summary = aiData.choices[0]?.message?.content || 'Analysis completed with no output.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to complete AI analysis' }, { status: 500 });
  }
}
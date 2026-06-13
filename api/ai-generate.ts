export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      mode: 'fallback',
      output: 'AI backend is ready, but OPENAI_API_KEY is not configured in Vercel yet. Add it as a Production and Preview environment variable to enable live AI generation.',
    });
  }

  try {
    const { prompt, toolTitle } = req.body || {};
    const cleanPrompt = String(prompt || '').slice(0, 4000);
    const cleanToolTitle = String(toolTitle || 'OmniHub AI Assistant').slice(0, 120);

    if (!cleanPrompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: 'You are OmniHub AI. Create practical, safe, marketplace-ready business output for sellers, buyers, support, and growth. Keep the answer concise, structured, and directly usable.',
          },
          {
            role: 'user',
            content: `${cleanToolTitle}\n\n${cleanPrompt}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        mode: 'fallback',
        output: `OpenAI backend returned an error: ${data?.error?.message || 'Unknown error'}`,
      });
    }

    const output =
      data.output_text ||
      data.output?.flatMap((item: any) => item.content || [])?.map((part: any) => part.text || '').join('\n') ||
      'No AI output returned.';

    return res.status(200).json({ mode: 'live', output });
  } catch (error: any) {
    return res.status(200).json({
      mode: 'fallback',
      output: `AI backend failed safely: ${error?.message || 'Unknown error'}`,
    });
  }
}

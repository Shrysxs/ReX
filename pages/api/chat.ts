import type { NextApiRequest, NextApiResponse } from 'next';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

interface ChatResponse {
  content: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ content: '', error: 'Method not allowed' });
  }

  const { messages }: ChatRequest = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ content: '', error: 'Invalid messages format' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ content: '', error: 'Server misconfigured: missing GROQ_API_KEY' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        stream: false,
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return res.status(response.status).json({ content: '', error: `Groq API Error: ${errorText}` });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'No response available';

    return res.status(200).json({ content: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({ content: '', error: errorMessage });
  }
}
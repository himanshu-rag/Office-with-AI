import { NextRequest } from 'next/server';
import { getAgent, getCompanyApiKeys } from '@/lib/os-db';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Fallback response for missing API key
function simulateResponse(systemPrompt: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const text = `Simulation Mode: I am acting based on my system prompt:\n"${(systemPrompt || 'No prompt').slice(0, 100)}..."\n\nPlease add an API key for my assigned provider to chat with me.`;
      
      const words = text.split(' ');
      for (const word of words) {
        // AI SDK expects chunk format: 0:"word "
        controller.enqueue(encoder.encode(`0:"${word} "\n`));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgent(id);
  
  if (!agent) {
    return new Response('Agent not found', { status: 404 });
  }

  const { messages } = await req.json();

  const keys = getCompanyApiKeys(agent.company_id as string);
  const provider = (agent.provider as string) || 'openai';
  const apiKeyRecord = keys.find(k => k.provider === provider);
  const apiKey = apiKeyRecord?.api_key || (provider === 'openai' ? process.env.OPENAI_API_KEY : null);

  if (!apiKey) {
    return simulateResponse(agent.system_prompt as string);
  }

  const system = `You are ${agent.name}, an AI agent acting as ${agent.role} at our company. 
  Your system prompt/instructions: ${agent.system_prompt}
  Always stay in character.`;

  let model;
  if (provider === 'anthropic') {
    const anthropic = createAnthropic({ apiKey });
    model = anthropic(agent.model as string || 'claude-3-5-sonnet-20240620');
  } else if (provider === 'google') {
    const google = createGoogleGenerativeAI({ apiKey });
    model = google(agent.model as string || 'gemini-1.5-pro-latest');
  } else {
    // Default to OpenAI
    const openai = createOpenAI({ apiKey });
    model = openai(agent.model as string || 'gpt-4o');
  }

  const result = await streamText({
    model,
    system,
    messages,
  });

  return result.toDataStreamResponse();
}

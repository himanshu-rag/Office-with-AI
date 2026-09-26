import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({
        departments: [
          { id: Date.now().toString(), name: 'Engineering', icon: '💻' },
          { id: (Date.now() + 1).toString(), name: 'Design', icon: '🎨' }
        ],
        agents: [
          { id: Date.now().toString() + 'a', name: 'Dev', role: 'Engineer', deptId: Date.now().toString(), emoji: '🤖' }
        ]
      });
    }

    const openai = createOpenAI({ apiKey: key });

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        departments: z.array(z.object({
          id: z.string(),
          name: z.string(),
          icon: z.string().describe("A single emoji representing the department")
        })),
        agents: z.array(z.object({
          id: z.string(),
          name: z.string(),
          role: z.string(),
          deptId: z.string().describe("Must match an ID from the departments array"),
          emoji: z.string().describe("A single emoji")
        }))
      }),
      prompt: `Create an organization structure for this company description: "${prompt}". 
Generate appropriate departments and 1-3 AI agents per department.`
    });

    return NextResponse.json(object);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

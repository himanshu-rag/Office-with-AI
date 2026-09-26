import { NextResponse } from 'next/server';
import { getMission, getTasks } from '@/lib/os-db';
import { osEvents } from '@/lib/os-events';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      // Ensure the stream is closed if the client disconnects
      request.signal.addEventListener('abort', () => {
        isClosed = true;
      });
      
      const onThought = (data: any) => {
        if (!isClosed) {
          controller.enqueue(
            encoder.encode(`event: thought\ndata: ${JSON.stringify(data)}\n\n`)
          );
        }
      };
      
      osEvents.on(`thought:${id}`, onThought);

      // Simple polling for SQLite. In a real Postgres app this would be LISTEN/NOTIFY.
      while (!isClosed) {
        try {
          const mission = getMission(id);
          const tasks = getTasks(id);

          const data = JSON.stringify({ mission, tasks });
          
          controller.enqueue(
            encoder.encode(`event: update\ndata: ${data}\n\n`)
          );

          // Poll every 2 seconds
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          if (!isClosed) {
            console.error('SSE Error:', error);
            controller.enqueue(
              encoder.encode(`event: error\ndata: ${JSON.stringify({ message: 'Stream failed' })}\n\n`)
            );
            controller.close();
          }
          break;
        }
      }
      
      osEvents.off(`thought:${id}`, onThought);
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

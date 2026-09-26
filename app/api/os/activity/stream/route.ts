import { NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/os-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('company_id');

  if (!companyId) {
    return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      request.signal.addEventListener('abort', () => {
        isClosed = true;
      });

      let lastSeenId = '';

      while (!isClosed) {
        try {
          const activities = getRecentActivity(companyId, 50);
          
          if (activities && activities.length > 0) {
            const currentLatestId = activities[0].id as string;
            
            // Only send if there's new data (simple diff check)
            if (currentLatestId !== lastSeenId) {
              lastSeenId = currentLatestId;
              const data = JSON.stringify({ activities });
              controller.enqueue(
                encoder.encode(`event: update\ndata: ${data}\n\n`)
              );
            }
          }

          // Poll every 1.5 seconds
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
          if (!isClosed) {
            controller.enqueue(
              encoder.encode(`event: error\ndata: ${JSON.stringify({ message: 'Stream failed' })}\n\n`)
            );
            controller.close();
          }
          break;
        }
      }
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

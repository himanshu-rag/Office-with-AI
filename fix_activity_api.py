import re

with open('app/api/os/activity/route.ts', 'r') as f:
    content = f.read()

if "processChat" not in content:
    content = content.replace("import { getActivity, addActivity } from '@/lib/os-db';", "import { getActivity, addActivity } from '@/lib/os-db';\nimport { processChat } from '@/lib/ai-engine';")

pattern = r"return NextResponse\.json\(\{ ok: true \}\);"
replacement = """
  // Trigger AI reply if user posts a message in chat
  if (body.actor_type === 'user' && body.event && body.event.includes('Message:')) {
    const text = body.event.replace('Message:', '').trim();
    void processChat(body.company_id, body.mission_id || null, text);
  }
  
  return NextResponse.json({ ok: true });
"""
content = re.sub(pattern, replacement, content)

with open('app/api/os/activity/route.ts', 'w') as f:
    f.write(content)

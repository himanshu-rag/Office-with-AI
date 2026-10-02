import re

with open('app/api/os/tasks/route.ts', 'r') as f:
    content = f.read()

# Import processTask
if "processTask" not in content:
    content = content.replace("import { getAllTasks, createTask, addActivity } from '@/lib/os-db';", "import { getAllTasks, createTask, addActivity } from '@/lib/os-db';\nimport { processTask } from '@/lib/ai-engine';")

# Add the background trigger
trigger_pattern = r"return NextResponse\.json\(\{ task \}, \{ status: 201 \}\);"
trigger_replacement = """
    // Fire and forget: trigger the AI engine in the background
    if (task && task.agent_id) {
      void processTask(task.id as string, body.company_id, body.agent_id, body.title, body.description);
    }
    
    return NextResponse.json({ task }, { status: 201 });"""

content = re.sub(trigger_pattern, trigger_replacement, content)

with open('app/api/os/tasks/route.ts', 'w') as f:
    f.write(content)

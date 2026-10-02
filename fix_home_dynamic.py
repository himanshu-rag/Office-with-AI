import re

with open('app/os/home/page.tsx', 'r') as f:
    content = f.read()

# Add goal state
content = content.replace("const [activities, setActivities] = useState<any[]>([]);", "const [activities, setActivities] = useState<any[]>([]);\n  const [goal, setGoal] = useState<string>('');")

# Parse goal from orgData
content = content.replace("setActivities(actData.activity);", "setActivities(actData.activity);\n      if (orgData.company && orgData.company.goal) setGoal(orgData.company.goal);")

# Inject goal into UI
content = content.replace("$100,000 MRR", "{goal || 'Grow Revenue'}")

with open('app/os/home/page.tsx', 'w') as f:
    f.write(content)

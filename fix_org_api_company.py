import re

with open('app/api/os/org/route.ts', 'r') as f:
    content = f.read()

content = content.replace("return NextResponse.json({ departments, agents });", "return NextResponse.json({ company, departments, agents });")

with open('app/api/os/org/route.ts', 'w') as f:
    f.write(content)

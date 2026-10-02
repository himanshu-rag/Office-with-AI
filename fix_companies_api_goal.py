import re

with open('app/api/os/companies/route.ts', 'r') as f:
    content = f.read()

content = content.replace("const company = createCompany({ name: body.name, type: body.type });", "const company = createCompany({ name: body.name, type: body.type, goal: body.goal });")

with open('app/api/os/companies/route.ts', 'w') as f:
    f.write(content)

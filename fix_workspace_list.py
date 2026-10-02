import re

with open('app/api/os/workspace/list/route.ts', 'r') as f:
    content = f.read()

content = content.replace("import { getUserCompanies } from '@/lib/os-db';", "import { getAllCompanies } from '@/lib/os-db';")
content = content.replace("const companies = getUserCompanies(userId);", "const companies = getAllCompanies();")

with open('app/api/os/workspace/list/route.ts', 'w') as f:
    f.write(content)

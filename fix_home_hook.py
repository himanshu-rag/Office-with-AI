import re

with open('app/os/home/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Plus, Users, Folder, CheckSquareOffset, ChartLineUp, CheckCircle, ArrowRight, Hourglass } from '@phosphor-icons/react';", "import { Plus, Users, Folder, CheckSquareOffset, ChartLineUp, CheckCircle, ArrowRight, Hourglass, Target, Lightbulb } from '@phosphor-icons/react';\nimport { useCompany } from '@/lib/hooks/use-company';")

content = content.replace("const [activities, setActivities] = useState<any[]>([]);", "const [activities, setActivities] = useState<any[]>([]);\n  const { companyId, loading: companyLoading } = useCompany();")

content = re.sub(r"const companyId = localStorage\.getItem\('os_active_workspace'\) \|\| '.*?'; // fallback to dev", "if (!companyId) return;", content)

# Also fix the useEffect dependency
content = re.sub(r"\}\)\.catch\(console\.error\);\n  \}, \[\]\);", "}).catch(console.error);\n  }, [companyId]);", content)

with open('app/os/home/page.tsx', 'w') as f:
    f.write(content)

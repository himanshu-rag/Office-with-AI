import re

with open('lib/os-db.ts', 'r') as f:
    content = f.read()

replacement = """
export function seedDemo(companyId: string, type: string = 'custom', goal: string = '', aiMode: string = 'managed', apiKey: string = '') {
  const existing = getAgents(companyId);
  if (existing.length > 0) return; // already seeded

  // Departments
  const depts = [
    { name: 'Strategy', icon: '🧭', color: '#8b5cf6' },
    { name: 'Research', icon: '🔍', color: '#3b82f6' },
    { name: 'Engineering', icon: '⚙️', color: '#10b981' },
    { name: 'Design', icon: '🎨', color: '#f59e0b' },
    { name: 'Marketing', icon: '📣', color: '#ef4444' },
    { name: 'QA', icon: '🧪', color: '#6366f1' },
  ].map(d => createDepartment({ company_id: companyId, ...d }));

  // CEO
  createAgent({ 
    company_id: companyId, 
    name: 'Alex', 
    role: 'CEO & Chief Orchestrator', 
    avatar_emoji: '🧠', 
    is_ceo: true, 
    provider: aiMode === 'byok' ? 'custom' : 'openai',
    model: 'gpt-4o', 
    status: 'online',
    system_prompt: `You are Alex, the AI CEO of a ${type} company. Your primary goal is to ${goal || 'build a successful organization'}. Your job is to orchestrate tasks across departments, analyze user requests, and maintain top-tier efficiency.`
  });

  // Agents
  const agents = [
    { name: 'Sam', role: 'Strategy Lead', emoji: '🧭', dept: 0 },
    { name: 'Jordan', role: 'Research Analyst', emoji: '🔍', dept: 1 },
    { name: 'Riley', role: 'Backend Engineer', emoji: '💻', dept: 2 },
    { name: 'Morgan', role: 'Frontend Engineer', emoji: '🖥️', dept: 2 },
    { name: 'Casey', role: 'Product Designer', emoji: '🎨', dept: 3 },
    { name: 'Drew', role: 'Growth Marketer', emoji: '📣', dept: 4 },
    { name: 'Quinn', role: 'QA Engineer', emoji: '🧪', dept: 5 },
  ];

  agents.forEach(a => {
    createAgent({
      company_id: companyId,
      department_id: String(depts[a.dept]?.id),
      name: a.name,
      role: a.role,
      avatar_emoji: a.emoji,
      status: 'offline',
      provider: aiMode === 'byok' ? 'custom' : 'openai'
    });
  });
}
"""

content = re.sub(
    r"export function seedDemo\(companyId: string\).*?\}\n\}\n",
    replacement,
    content,
    flags=re.DOTALL
)

with open('lib/os-db.ts', 'w') as f:
    f.write(content)

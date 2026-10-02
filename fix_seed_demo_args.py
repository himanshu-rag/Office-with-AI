import re

with open('lib/os-db.ts', 'r') as f:
    content = f.read()

target = """export function seedDemo(companyId: string) {
  const existing = getAgents(companyId);
  if (existing.length > 0) return;
  const depts = [
    { name: 'Strategy', icon: 'compass', color: '#8b5cf6' },
    { name: 'Research', icon: 'search', color: '#3b82f6' },
    { name: 'Engineering', icon: 'code', color: '#10b981' },
    { name: 'Design', icon: 'pen-tool', color: '#f59e0b' },
    { name: 'Marketing', icon: 'megaphone', color: '#ef4444' },
    { name: 'QA', icon: 'flask', color: '#6366f1' },
  ].map(d => createDepartment({ company_id: companyId, ...d }));

  createAgent({ company_id: companyId, name: 'Alex', role: 'CEO & Chief Orchestrator', avatar_emoji: 'brain', is_ceo: true, model: 'gpt-4o' } as Record<string,unknown> & { company_id: string; name: string; role: string });"""

replacement = """export function seedDemo(companyId: string, type: string = 'custom', goal: string = '', aiMode: string = 'managed', apiKey: string = '', audience: string = 'B2B', tone: string = 'Professional') {
  const existing = getAgents(companyId);
  if (existing.length > 0) return; // already seeded

  // Departments
  const depts = [
    { name: 'Strategy', icon: 'compass', color: '#8b5cf6' },
    { name: 'Research', icon: 'search', color: '#3b82f6' },
    { name: 'Engineering', icon: 'code', color: '#10b981' },
    { name: 'Design', icon: 'pen-tool', color: '#f59e0b' },
    { name: 'Marketing', icon: 'megaphone', color: '#ef4444' },
    { name: 'QA', icon: 'flask', color: '#6366f1' },
  ].map(d => createDepartment({ company_id: companyId, ...d }));

  // CEO
  createAgent({ 
    company_id: companyId, 
    name: 'Alex', 
    role: 'CEO & Chief Orchestrator', 
    avatar_emoji: 'brain', 
    is_ceo: true, 
    provider: aiMode === 'byok' ? 'custom' : 'openai',
    model: 'gpt-4o', 
    status: 'online',
    system_prompt: `You are the AI Chief Executive Officer (CEO) of a newly established ${type} organization.
Your primary strategic objective is: ${goal}.
Your target audience is: ${audience}.
Your communication tone should be: ${tone}.

Your responsibilities:
1. Actively monitor the company's progress towards the strategic objective.
2. Delegate cross-departmental tasks to your AI workforce (Strategy, Research, Engineering, Design, Marketing, QA).
3. Review and approve final outputs from department leads.
4. Optimize resource allocation and credit spending to maximize ROI.
5. Provide continuous strategic recommendations based on live metrics.`
  } as Record<string,unknown> & { company_id: string; name: string; role: string });"""

content = content.replace(target, replacement)

with open('lib/os-db.ts', 'w') as f:
    f.write(content)

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'aioffice.db');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    _db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        updated_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    runMigrations(_db);
  }
  return _db;
}

function runMigrations(db: Database.Database) {
  const schemaPath = path.join(process.cwd(), 'lib', 'os-schema.sql');
  if (!fs.existsSync(schemaPath)) return;
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
  for (const stmt of statements) {
    try { db.exec(stmt + ';'); } catch { /* ignore */ }
  }
}

export function dbGet<T>(sql: string, params: unknown[] = []): T | undefined {
  return getDb().prepare(sql).get(...params) as T | undefined;
}
export function dbAll<T>(sql: string, params: unknown[] = []): T[] {
  return getDb().prepare(sql).all(...params) as T[];
}
export function dbRun(sql: string, params: unknown[] = []) {
  return getDb().prepare(sql).run(...params);
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Companies
export function getCompany(id: string) { return dbGet<Record<string,unknown>>('SELECT * FROM companies WHERE id = ?', [id]); }
export function getAllCompanies() { return dbAll<Record<string,unknown>>('SELECT * FROM companies ORDER BY created_at DESC'); }
export function createCompany(data: { name: string; type?: string }) {
  const db = getDb(); const id = generateId();
  db.prepare('INSERT INTO companies (id, name, type) VALUES (?, ?, ?)').run(id, data.name, data.type || 'custom');
  db.prepare('INSERT INTO credit_accounts (id, company_id, balance) VALUES (?, ?, 25.0)').run(generateId(), id);
  return getCompany(id);
}

export function deleteCompany(id: string) {
  return dbRun('DELETE FROM companies WHERE id = ?', [id]);
}

// ─── API Keys ──────────────────────────────────────────────────

export function getCompanyApiKeys(companyId: string) {
  return dbAll<Record<string,unknown>>('SELECT id, provider, api_key, substr(api_key, 1, 4) || \'...\' || substr(api_key, -4) as masked_key, created_at FROM company_api_keys WHERE company_id = ?', [companyId]);
}

export function setCompanyApiKey(companyId: string, provider: string, apiKey: string) {
  return dbRun(`
    INSERT INTO company_api_keys (id, company_id, provider, api_key) 
    VALUES (?, ?, ?, ?)
    ON CONFLICT(company_id, provider) DO UPDATE SET api_key = excluded.api_key, created_at = datetime('now')
  `, [generateId(), companyId, provider, apiKey]);
}

export function removeCompanyApiKey(companyId: string, provider: string) {
  return dbRun('DELETE FROM company_api_keys WHERE company_id = ? AND provider = ?', [companyId, provider]);
}

// ─── Departments ───────────────────────────────────────────────
export function getDepartments(companyId: string) {
  return dbAll<Record<string,unknown>>('SELECT * FROM departments WHERE company_id = ? ORDER BY name', [companyId]);
}
export function createDepartment(data: { company_id: string; name: string; icon?: string; color?: string }) {
  const id = generateId();
  dbRun('INSERT INTO departments (id, company_id, name, icon, color) VALUES (?, ?, ?, ?, ?)',
    [id, data.company_id, data.name, data.icon || 'building', data.color || '#6366f1']);
  return dbGet('SELECT * FROM departments WHERE id = ?', [id]);
}

// Agents
export function getAgent(id: string) { return dbGet<Record<string,unknown>>('SELECT * FROM agents WHERE id = ?', [id]); }
export function getAgents(companyId: string) {
  return dbAll<Record<string,unknown>>(
    'SELECT a.*, d.name as department_name, d.icon as department_icon FROM agents a LEFT JOIN departments d ON a.department_id = d.id WHERE a.company_id = ? ORDER BY a.is_ceo DESC, d.name, a.name',
    [companyId]);
}
export function createAgent(data: Record<string,unknown> & { company_id: string; name: string; role: string }) {
  const id = generateId();
  dbRun('INSERT INTO agents (id, company_id, department_id, name, role, avatar_emoji, is_ceo, provider, model, system_prompt, tools, permissions, budget_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, data.company_id, data.department_id || null, data.name, data.role,
     data.avatar_emoji || 'bot', data.is_ceo ? 1 : 0,
     data.provider || 'openai', data.model || 'gpt-4o',
     data.system_prompt || null, JSON.stringify(data.tools || []),
     JSON.stringify(data.permissions || {}), data.budget_limit || 10.0]);
  return getAgent(id);
}
export function updateAgentStatus(id: string, status: string, taskId?: string) {
  dbRun("UPDATE agents SET status = ?, current_task_id = ?, updated_at = datetime('now') WHERE id = ?", [status, taskId || null, id]);
}

// Missions
export function getMission(id: string) { return dbGet<Record<string,unknown>>('SELECT * FROM missions WHERE id = ?', [id]); }
export function getMissions(companyId: string) {
  return dbAll<Record<string,unknown>>('SELECT * FROM missions WHERE company_id = ? ORDER BY created_at DESC', [companyId]);
}
export function createMission(data: { company_id: string; title: string; objective: string; deadline?: string }) {
  const id = generateId();
  dbRun('INSERT INTO missions (id, company_id, title, objective, deadline) VALUES (?, ?, ?, ?, ?)',
    [id, data.company_id, data.title, data.objective, data.deadline || null]);
  return getMission(id);
}
export function updateMission(id: string, data: Record<string,unknown>) {
  const allowed = ['status', 'progress', 'ceo_plan', 'started_at', 'completed_at', 'total_cost', 'total_tokens', 'title'];
  const safe = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(safe).length) return;
  const fields = Object.keys(safe).map(k => k + ' = ?').join(', ');
  dbRun('UPDATE missions SET ' + fields + ", updated_at = datetime('now') WHERE id = ?", [...Object.values(safe), id]);
}

// Tasks
export function getTasks(missionId: string) {
  return dbAll<Record<string,unknown>>(
    'SELECT t.*, a.name as agent_name, a.avatar_emoji, a.status as agent_status, d.name as department_name, d.icon as department_icon FROM tasks t LEFT JOIN agents a ON t.agent_id = a.id LEFT JOIN departments d ON t.department_id = d.id WHERE t.mission_id = ? ORDER BY t.created_at',
    [missionId]);
}
export function getAllTasks(companyId: string) {
  return dbAll<Record<string,unknown>>(
    'SELECT t.*, a.name as agent_name, a.avatar_emoji, a.status as agent_status, d.name as department_name, d.icon as department_icon FROM tasks t LEFT JOIN agents a ON t.agent_id = a.id LEFT JOIN departments d ON t.department_id = d.id WHERE t.company_id = ? ORDER BY t.created_at',
    [companyId]);
}

export function getTask(id: string) { return dbGet<Record<string,unknown>>('SELECT * FROM tasks WHERE id = ?', [id]); }
export function createTask(data: Record<string,unknown> & { mission_id: string; company_id: string; title: string }) {
  const id = generateId();
  dbRun('INSERT INTO tasks (id, mission_id, company_id, agent_id, department_id, title, description, priority, expected_output, input) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, data.mission_id, data.company_id, data.agent_id || null, data.department_id || null,
     data.title, data.description || null, data.priority || 'normal',
     data.expected_output || null, data.input ? JSON.stringify(data.input) : null]);
  return getTask(id);
}
export function updateTaskState(id: string, state: string) {
  dbRun("UPDATE tasks SET state = ?, updated_at = datetime('now') WHERE id = ?", [state, id]);
}

// Inbox
export function getInbox(agentId: string) {
  return dbAll<Record<string,unknown>>(
    "SELECT i.*, a.name as sender_name, a.avatar_emoji as sender_emoji FROM inbox_items i LEFT JOIN agents a ON i.sender_id = a.id WHERE i.receiver_id = ? ORDER BY CASE i.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, i.created_at DESC",
    [agentId]);
}
export function createInboxItem(data: Record<string,unknown> & { company_id: string; receiver_id: string; subject: string }) {
  const id = generateId();
  dbRun('INSERT INTO inbox_items (id, company_id, sender_id, receiver_id, task_id, mission_id, subject, body, priority, context, expected_output, deadline, cost_estimate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, data.company_id, data.sender_id || null, data.receiver_id, data.task_id || null,
     data.mission_id || null, data.subject, data.body || null, data.priority || 'normal',
     data.context ? JSON.stringify(data.context) : null, data.expected_output || null,
     data.deadline || null, data.cost_estimate || null]);
  return dbGet('SELECT * FROM inbox_items WHERE id = ?', [id]);
}
export function updateInboxStatus(id: string, status: string) {
  dbRun("UPDATE inbox_items SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
}

// Activity
export function getActivity(companyId: string, limit = 50) {
  return dbAll<Record<string,unknown>>(
    'SELECT af.*, a.name as actor_name, a.avatar_emoji FROM activity_feed af LEFT JOIN agents a ON af.actor_id = a.id WHERE af.company_id = ? ORDER BY af.created_at DESC LIMIT ?',
    [companyId, limit]);
}
export function addActivity(data: { company_id: string; mission_id?: string; actor_type: string; actor_id?: string; event: string; payload?: Record<string,unknown> }) {
  const id = generateId();
  dbRun('INSERT INTO activity_feed (id, company_id, mission_id, actor_type, actor_id, event, payload) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, data.company_id, data.mission_id || null, data.actor_type, data.actor_id || null,
     data.event, JSON.stringify(data.payload || {})]);
}

// Logs
export function getLogs(agentId: string, limit = 100) {
  return dbAll<Record<string,unknown>>('SELECT * FROM execution_logs WHERE agent_id = ? ORDER BY timestamp DESC LIMIT ?', [agentId, limit]);
}
export function addLog(data: Record<string,unknown> & { agent_id: string; event_type: string }) {
  const id = generateId();
  dbRun('INSERT INTO execution_logs (id, task_id, agent_id, mission_id, event_type, tool, input, output, tokens, cost, duration_ms, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, data.task_id || null, data.agent_id, data.mission_id || null, data.event_type,
     data.tool || null, data.input || null, data.output || null,
     data.tokens || 0, data.cost || 0, data.duration_ms || null, data.status || 'success']);
}

// Chat
export function getAgentChat(agentId: string, missionId?: string) {
  return missionId
    ? dbGet<Record<string,unknown>>('SELECT * FROM agent_chats WHERE agent_id = ? AND mission_id = ?', [agentId, missionId])
    : dbGet<Record<string,unknown>>('SELECT * FROM agent_chats WHERE agent_id = ? AND mission_id IS NULL', [agentId]);
}
export function upsertAgentChat(agentId: string, messages: unknown[], missionId?: string) {
  const ex = getAgentChat(agentId, missionId);
  if (ex) {
    missionId
      ? dbRun("UPDATE agent_chats SET messages = ?, updated_at = datetime('now') WHERE agent_id = ? AND mission_id = ?", [JSON.stringify(messages), agentId, missionId])
      : dbRun("UPDATE agent_chats SET messages = ?, updated_at = datetime('now') WHERE agent_id = ? AND mission_id IS NULL", [JSON.stringify(messages), agentId]);
  } else {
    dbRun('INSERT INTO agent_chats (id, agent_id, mission_id, messages) VALUES (?, ?, ?, ?)',
      [generateId(), agentId, missionId || null, JSON.stringify(messages)]);
  }
}

// Credits
export function getCredits(companyId: string) {
  return dbGet<Record<string,unknown>>('SELECT * FROM credit_accounts WHERE company_id = ?', [companyId]);
}
export function deductCredits(companyId: string, amount: number) {
  dbRun("UPDATE credit_accounts SET balance = MAX(0, balance - ?), total_used = total_used + ?, updated_at = datetime('now') WHERE company_id = ?", [amount, amount, companyId]);
}

// Seed
export function seedDemo(companyId: string) {
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

  createAgent({ company_id: companyId, name: 'Alex', role: 'CEO & Chief Orchestrator', avatar_emoji: 'brain', is_ceo: true, model: 'gpt-4o' } as Record<string,unknown> & { company_id: string; name: string; role: string });

  [
    { name: 'Sam', role: 'Strategy Lead', avatar_emoji: 'compass', dept: 0 },
    { name: 'Jordan', role: 'Research Analyst', avatar_emoji: 'search', dept: 1 },
    { name: 'Riley', role: 'Backend Engineer', avatar_emoji: 'terminal', dept: 2 },
    { name: 'Morgan', role: 'Frontend Engineer', avatar_emoji: 'monitor', dept: 2 },
    { name: 'Casey', role: 'Product Designer', avatar_emoji: 'palette', dept: 3 },
    { name: 'Drew', role: 'Growth Marketer', avatar_emoji: 'trending-up', dept: 4 },
    { name: 'Quinn', role: 'QA Engineer', avatar_emoji: 'flask-conical', dept: 5 },
  ].forEach(a => createAgent({
    company_id: companyId, department_id: String((depts[a.dept] as any)?.id),
    name: a.name, role: a.role, avatar_emoji: a.avatar_emoji, status: 'offline'
  } as Record<string,unknown> & { company_id: string; name: string; role: string }));
}

// ─── Users & Onboarding ────────────────────────────────────────

export function getUserCompany(userId: string, activeCompanyId?: string) {
  if (activeCompanyId) {
    const specific = dbGet<Record<string,unknown>>(
      `SELECT c.* FROM companies c
       JOIN user_companies uc ON c.id = uc.company_id
       WHERE uc.user_id = ? AND c.id = ?`,
      [userId, activeCompanyId]
    );
    if (specific) return specific;
  }
  return dbGet<Record<string,unknown>>(
    `SELECT c.* FROM companies c
     JOIN user_companies uc ON c.id = uc.company_id
     WHERE uc.user_id = ? LIMIT 1`,
    [userId]
  );
}

export function getUserCompanies(userId: string) {
  return dbAll<Record<string,unknown>>(
    `SELECT c.* FROM companies c
     JOIN user_companies uc ON c.id = uc.company_id
     WHERE uc.user_id = ?`,
    [userId]
  );
}

export function onboardUser(data: { userId: string, userEmail: string, companyName: string, companyType: string, departments: string[], apiKey: string }) {
  const db = getDb();
  
  // 1. Ensure user exists
  db.prepare('INSERT OR IGNORE INTO users (id, email) VALUES (?, ?)').run(data.userId, data.userEmail);
  
  // 2. Create Company
  const companyId = generateId();
  db.prepare('INSERT INTO companies (id, name, type) VALUES (?, ?, ?)').run(companyId, data.companyName, data.companyType);
  
  // 3. Link User to Company
  db.prepare('INSERT INTO user_companies (user_id, company_id, role) VALUES (?, ?, ?)').run(data.userId, companyId, 'owner');
  
  // 4. Create Credit Account
  db.prepare('INSERT INTO credit_accounts (id, company_id, balance) VALUES (?, ?, 25.0)').run(generateId(), companyId);
  
  // 5. Create Departments
  let primaryDeptId = null;
  const deptIcons: Record<string, string> = {
    'Strategy': '🎯', 'Engineering': '💻', 'Design': '🎨', 'Marketing': '📢', 'Operations': '⚙️', 'Data': '📊', 'QA': '🧪'
  };

  const departments = data.departments.length > 0 ? data.departments : ['General'];
  
  for (let i = 0; i < departments.length; i++) {
    const deptName = departments[i];
    const deptId = generateId();
    if (i === 0) primaryDeptId = deptId;
    
    db.prepare('INSERT INTO departments (id, company_id, name, icon, color, is_default) VALUES (?, ?, ?, ?, ?, ?)')
      .run(deptId, companyId, deptName, deptIcons[deptName] || '🏢', '#0A84FF', i === 0 ? 1 : 0);
      
    // Create an agent for this department
    const agentId = generateId();
    
    let persona = `You are an AI assistant in the ${deptName} department.`;
    let agentName = `Agent ${deptName.charAt(0)}`;
    let role = `${deptName} Specialist`;
    let emoji = deptIcons[deptName] || '🤖';
    
    if (deptName === 'Strategy') { persona = 'You are a meticulous strategic thinker who values data-driven decisions and long-term planning.'; agentName = 'Sarah'; }
    if (deptName === 'Engineering') { persona = 'You are a rigorous senior software engineer who writes defensive, highly-scalable, and well-documented code.'; agentName = 'Linus'; }
    if (deptName === 'Design') { persona = 'You are an aesthetic-first designer who champions user simplicity, premium visual hierarchy, and beautiful typography.'; agentName = 'Jony'; }
    if (deptName === 'Marketing') { persona = 'You are a creative marketer with deep empathy for customers, specializing in compelling storytelling and viral growth loops.'; agentName = 'Don'; }
    if (deptName === 'Operations') { persona = 'You are a highly organized operations specialist focused on process efficiency, resource allocation, and zero-defect execution.'; agentName = 'Amy'; }
    
    db.prepare(`
      INSERT INTO agents (id, company_id, department_id, name, role, avatar_emoji, is_ceo, provider, model, status, system_prompt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      agentId, companyId, deptId, agentName, role, emoji, 0, 'openai', 'gpt-4o', 'online', persona
    );
  }
  
  // 6. Create CEO Agent
  const ceoId = generateId();
  db.prepare(`
    INSERT INTO agents (id, company_id, department_id, name, role, avatar_emoji, is_ceo, provider, model, api_key_hint, status, system_prompt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    ceoId, 
    companyId, 
    primaryDeptId, // Attach CEO to the first selected department
    'Alex', 
    'Chief Executive Officer', 
    '🧠', 
    1, // is_ceo = true
    'openai', 
    'gpt-4o',
    data.apiKey ? 'sk-...'+data.apiKey.slice(-4) : null,
    'online',
    'You are the CEO of ' + data.companyName + ' (' + data.companyType + '). You orchestrate tasks, delegate to departments, and ensure mission success.'
  );

  return { companyId, ceoId };
}

// ─── Agent Memory ──────────────────────────────────────────────

export function getAgentMemories(agentId: string) {
  return dbAll<Record<string, unknown>>(
    'SELECT * FROM agent_memory WHERE agent_id = ? ORDER BY created_at DESC',
    [agentId]
  );
}

export function addAgentMemory(data: { agent_id: string; mission_id?: string; key: string; value: string }) {
  const id = generateId();
  dbRun(
    'INSERT INTO agent_memory (id, agent_id, mission_id, key, value) VALUES (?, ?, ?, ?, ?)',
    [id, data.agent_id, data.mission_id || null, data.key, data.value]
  );
  return id;
}


// ─── Knowledge Base ────────────────────────────────────────────

export function getKnowledge(companyId: string) {
  return dbAll<Record<string, unknown>>('SELECT * FROM knowledge_base WHERE company_id = ? ORDER BY category, title', [companyId]);
}

export function addKnowledge(data: { company_id: string; category: string; title: string; content: string; updated_by?: string }) {
  const id = generateId();
  dbRun('INSERT INTO knowledge_base (id, company_id, category, title, content, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
    [id, data.company_id, data.category, data.title, data.content, data.updated_by || 'CEO Agent']);
  return dbGet('SELECT * FROM knowledge_base WHERE id = ?', [id]);
}

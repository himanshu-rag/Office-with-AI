import re

with open('lib/os-db.ts', 'r') as f:
    content = f.read()

# Try to alter the table on boot
if "ALTER TABLE companies ADD COLUMN goal" not in content:
    migration_addition = """
    try {
      db.exec('ALTER TABLE companies ADD COLUMN goal TEXT;');
    } catch (e) {
      // ignore if exists
    }
"""
    content = content.replace("function runMigrations(db: Database.Database) {", "function runMigrations(db: Database.Database) {" + migration_addition)

# Update createCompany
create_replacement = """
export function createCompany(data: { name: string; type?: string; goal?: string }) {
  const db = getDb();
  const id = generateId();
  db.prepare('INSERT INTO companies (id, name, type, goal) VALUES (?, ?, ?, ?)').run(id, data.name, data.type || 'custom', data.goal || '');
  db.prepare('INSERT INTO credit_accounts (id, company_id, balance) VALUES (?, ?, 25.0)').run(generateId(), id);
  return getCompany(id);
}
"""
content = re.sub(
    r"export function createCompany\(data: \{ name: string; type\?: string \}\) \{.*?\n\}",
    create_replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('lib/os-db.ts', 'w') as f:
    f.write(content)

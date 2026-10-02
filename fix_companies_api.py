import re

with open('app/api/os/companies/route.ts', 'r') as f:
    content = f.read()

replacement = """
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
    const company = createCompany({ name: body.name, type: body.type });
    seedDemo(String(company!.id), body.type, body.goal, body.aiMode, body.apiKey);
    return NextResponse.json({ company }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
"""

content = re.sub(
    r"export async function POST\(req: NextRequest\).*?\}\n\}",
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('app/api/os/companies/route.ts', 'w') as f:
    f.write(content)

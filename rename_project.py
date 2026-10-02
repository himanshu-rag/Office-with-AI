import os

files_to_update = [
    'app/docs/page.tsx',
    'app/components/ClerkSafeWrapper.tsx',
    'app/layout.tsx',
    'app/os/components/WorkspaceSwitcher.tsx',
    'app/os/components/Sidebar.tsx',
    'app/page.tsx',
    'app/onboarding/page.tsx',
    'lib/os-schema.sql',
    'package.json'
]

for filepath in files_to_update:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Package.json specific
    if filepath == 'package.json':
        content = content.replace('"name": "partner-portal"', '"name": "office-with-ai"')
        content = content.replace('"name": "aioffice"', '"name": "office-with-ai"')
    
    # Replace texts
    content = content.replace('Ai Office OS', 'Office-with-AI')
    content = content.replace('Ai Office', 'Office-with-AI')
    content = content.replace('ai office', 'office-with-ai')
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Renamed successfully!")

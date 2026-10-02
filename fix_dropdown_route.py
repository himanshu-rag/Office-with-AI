import re

with open('app/os/components/WorkspaceSwitcher.tsx', 'r') as f:
    content = f.read()

content = content.replace("onClick={() => router.push('/onboarding')}", "onClick={() => { window.location.href = '/onboarding'; }}")

with open('app/os/components/WorkspaceSwitcher.tsx', 'w') as f:
    f.write(content)

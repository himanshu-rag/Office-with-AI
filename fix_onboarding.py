import re
with open('app/onboarding/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("router.push('/os');", "window.location.href = '/os';")

with open('app/onboarding/page.tsx', 'w') as f:
    f.write(content)

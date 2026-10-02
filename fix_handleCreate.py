import re

with open('app/onboarding/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("window.location.href = '/os';", "window.location.href = '/os/home';")

with open('app/onboarding/page.tsx', 'w') as f:
    f.write(content)

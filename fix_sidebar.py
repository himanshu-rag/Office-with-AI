import re

with open('app/os/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Make sure Brain is imported
if "Brain" not in content:
    content = content.replace("House,", "House, Brain,")

# Insert AI CEO link
content = content.replace(
    "{ label: 'Home',         href: '/os/home',       icon: House },",
    "{ label: 'Home',         href: '/os/home',       icon: House },\n  { label: 'AI CEO',       href: '/os/ceo',        icon: Brain },"
)

with open('app/os/components/Sidebar.tsx', 'w') as f:
    f.write(content)

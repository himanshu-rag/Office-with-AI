import re

with open('app/os/analytics/page.tsx', 'r') as f:
    content = f.read()

# Replace d.spend with d.cost in SpendChart
content = content.replace("d => d.spend", "d => d.cost")
content = content.replace("d.spend / maxSpend", "d.cost / maxSpend")

with open('app/os/analytics/page.tsx', 'w') as f:
    f.write(content)

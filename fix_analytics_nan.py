import re

with open('app/os/analytics/page.tsx', 'r') as f:
    content = f.read()

# Fix SpendChart x-coord
content = content.replace("x: padL + (i / (SPEND_DATA.length - 1)) * chartW,", "x: padL + (SPEND_DATA.length > 1 ? (i / (SPEND_DATA.length - 1)) * chartW : chartW / 2),")

# Fix Sparkline x-coord
content = content.replace("x: (i / (values.length - 1)) * W,", "x: values.length > 1 ? (i / (values.length - 1)) * W : W / 2,")

with open('app/os/analytics/page.tsx', 'w') as f:
    f.write(content)

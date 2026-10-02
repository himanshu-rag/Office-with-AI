import re

with open('app/os/home/page.tsx', 'r') as f:
    content = f.read()

# The regex matches from {/* CEO Strategic Goal Section */} down to {/* Top Metric Cards */}
# We replace it with just {/* Top Metric Cards */}
content = re.sub(
    r"\{\/\* CEO Strategic Goal Section \*\/\}[\s\S]*?\{\/\* Top Metric Cards \*\/\}",
    "{/* Top Metric Cards */}",
    content
)

with open('app/os/home/page.tsx', 'w') as f:
    f.write(content)

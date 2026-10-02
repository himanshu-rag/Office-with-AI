import re

with open('app/layout.tsx', 'r') as f:
    content = f.read()

# Remove next-themes import
content = re.sub(r"import \{ ThemeProvider \} from 'next-themes';\n", "", content)

# Remove ThemeProvider wrapping
content = re.sub(r"<ThemeProvider attribute=\"class\" defaultTheme=\"dark\" enableSystem=\{false\}>\s*(.*?)\s*</ThemeProvider>", r"\1", content, flags=re.DOTALL)

# Hardcode 'dark' class on HTML tag
content = content.replace('<html lang="en" suppressHydrationWarning>', '<html lang="en" className="dark" suppressHydrationWarning>')

with open('app/layout.tsx', 'w') as f:
    f.write(content)

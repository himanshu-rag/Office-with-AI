import re

with open('app/os/ceo/page.tsx', 'r') as f:
    content = f.read()

# Fix motion import
content = content.replace("from 'motion/react'", "from 'framer-motion'")

# Replace Activity import with Pulse
content = content.replace("Activity } from '@phosphor-icons/react'", "Pulse } from '@phosphor-icons/react'")

# Replace <Activity /> with <Pulse />
content = content.replace("<Activity size={18}", "<Pulse size={18}")

with open('app/os/ceo/page.tsx', 'w') as f:
    f.write(content)

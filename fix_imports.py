import re

with open('app/os/home/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { Plus, Users, Folder, CheckSquareOffset, ChartLineUp, CheckCircle, ArrowRight, Hourglass, Target, Lightbulb } from '@phosphor-icons/react';",
    "import { Plus, Users, Folder, CheckSquareOffset, ChartLineUp, CheckCircle, ArrowRight, Hourglass, Target, Lightbulb, RocketLaunch, WarningCircle } from '@phosphor-icons/react';"
)

with open('app/os/home/page.tsx', 'w') as f:
    f.write(content)

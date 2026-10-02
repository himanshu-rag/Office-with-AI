import re

with open('app/onboarding/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("</ul>\n                  </div>\n                  </div>", "</ul>\n                  </div>")

with open('app/onboarding/page.tsx', 'w') as f:
    f.write(content)

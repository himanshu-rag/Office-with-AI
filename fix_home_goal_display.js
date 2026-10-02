const fs = require('fs');
const path = 'app/os/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "{/* CEO Strategic Goal Section */}\n      {goal && (",
  "{/* CEO Strategic Goal Section */}\n      {true && ("
);

content = content.replace(
  `"{goal}"`,
  `"{goal || 'Maximize Operational Efficiency & Growth'}"`
);

fs.writeFileSync(path, content);
console.log('Fixed goal display fallback!');

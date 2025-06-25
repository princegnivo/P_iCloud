const fs = require('fs');

setInterval(() => {
  const now = Date.now();
  const files = fs.readdirSync('./logs');
  
  files.forEach(file => {
    const stat = fs.statSync(`./logs/${file}`);
    if((now - stat.mtimeMs) > 24 * 60 * 60 * 1000) {
      fs.writeFileSync(`./logs/${file}`, '0'.repeat(1024));
      fs.unlinkSync(`./logs/${file}`);
    }
  });
}, 60 * 60 * 1000);

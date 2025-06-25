import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export const encrypt = (text, key) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

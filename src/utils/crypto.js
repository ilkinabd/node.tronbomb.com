const { IV, SECRET } = process.env;

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const iv = Buffer.from(IV, 'hex');

const encrypt = (privateKey, pass = SECRET) => {
  const key = Buffer.alloc(32);
  Buffer.from(pass).copy(key);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(privateKey);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
};

const decrypt = (encryptedKey, pass = SECRET) => {
  const encrypted = Buffer.from(encryptedKey, 'hex');
  const key = Buffer.alloc(32);
  Buffer.from(pass).copy(key);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);

  try {
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  encrypt,
  decrypt,
};

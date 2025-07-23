const CryptoJS = require('crypto-js');
const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error('ENCRYPTION_KEY is not set in the .env file.');
}

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };

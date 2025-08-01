import CryptoJS from 'crypto-js';

// Secure encryption using AES-256
const SALT_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits
const ITERATIONS = 10000;

// Derive a secure key from the user's key using PBKDF2
function deriveKey(key: string, salt: string): string {
  return CryptoJS.PBKDF2(key, salt, {
    keySize: KEY_LENGTH / 4, // keySize is in words (4 bytes each)
    iterations: ITERATIONS
  }).toString();
}

// Generate a random salt
function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(SALT_LENGTH).toString();
}

export function encrypt(text: string, key: string): string {
  try {
    // Generate a random salt for each encryption
    const salt = generateSalt();
    // Derive a secure key using PBKDF2
    const derivedKey = deriveKey(key, salt);
    
    // Encrypt the text using AES-256
    const encrypted = CryptoJS.AES.encrypt(text, derivedKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Combine salt and encrypted data
    // Format: salt:iv:encrypted
    return `${salt}:${encrypted.iv}:${encrypted.ciphertext}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(encryptedText: string, key: string): string {
  try {
    // Split the encrypted text into salt, IV, and ciphertext
    const [salt, iv, ciphertext] = encryptedText.split(':');
    
    if (!salt || !iv || !ciphertext) {
      throw new Error('Invalid encrypted data format');
    }
    
    // Derive the same key using PBKDF2
    const derivedKey = deriveKey(key, salt);
    
    // Reconstruct the CipherParams object
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(cipherParams, derivedKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

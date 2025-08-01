import { encrypt, decrypt } from './encryption';

describe('Encryption Service', () => {
  const testData = {
    text: 'Hello, World!',
    longText: 'This is a much longer text that might contain special characters !@#$%^&*()_+ and multiple lines\nNew line here\nAnd another one',
    jsonText: JSON.stringify({ key: 'value', nested: { array: [1, 2, 3] } }),
    emptyText: '',
  };
  const testKey = 'test-encryption-key-123';

  describe('encrypt', () => {
    it('should encrypt a simple string', () => {
      const encrypted = encrypt(testData.text, testKey);
      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3); // salt:iv:ciphertext format
      expect(encrypted).not.toContain(testData.text); // Shouldn't contain original text
    });

    it('should encrypt long text with special characters', () => {
      const encrypted = encrypt(testData.longText, testKey);
      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3);
      expect(encrypted).not.toContain(testData.longText);
    });

    it('should encrypt JSON strings', () => {
      const encrypted = encrypt(testData.jsonText, testKey);
      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3);
      expect(encrypted).not.toContain(testData.jsonText);
    });

    it('should handle empty strings', () => {
      const encrypted = encrypt(testData.emptyText, testKey);
      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3);
    });

    it('should generate different ciphertexts for same input', () => {
      const encrypted1 = encrypt(testData.text, testKey);
      const encrypted2 = encrypt(testData.text, testKey);
      expect(encrypted1).not.toEqual(encrypted2); // Should be different due to random salt/IV
    });

    it('should throw error with invalid input', () => {
      expect(() => encrypt('', '')).toThrow();
      expect(() => encrypt(testData.text, '')).toThrow();
    });
  });

  describe('decrypt', () => {
    it('should correctly decrypt encrypted text', () => {
      const encrypted = encrypt(testData.text, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toEqual(testData.text);
    });

    it('should decrypt long text with special characters', () => {
      const encrypted = encrypt(testData.longText, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toEqual(testData.longText);
    });

    it('should decrypt JSON strings', () => {
      const encrypted = encrypt(testData.jsonText, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toEqual(testData.jsonText);
      expect(JSON.parse(decrypted)).toBeTruthy(); // Should be valid JSON
    });

    it('should handle empty strings', () => {
      const encrypted = encrypt(testData.emptyText, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toEqual(testData.emptyText);
    });

    it('should fail with wrong decryption key', () => {
      const encrypted = encrypt(testData.text, testKey);
      expect(() => decrypt(encrypted, 'wrong-key')).toThrow();
    });

    it('should fail with invalid encrypted format', () => {
      expect(() => decrypt('invalid-format', testKey)).toThrow('Invalid encrypted data format');
      expect(() => decrypt('part1:part2', testKey)).toThrow('Invalid encrypted data format');
      expect(() => decrypt(':', testKey)).toThrow('Invalid encrypted data format');
    });

    it('should fail with corrupted data', () => {
      const encrypted = encrypt(testData.text, testKey);
      const [salt, iv, ciphertext] = encrypted.split(':');
      
      // Test with corrupted parts
      expect(() => decrypt(`${salt}:${iv}:corrupted`, testKey)).toThrow();
      expect(() => decrypt(`${salt}:corrupted:${ciphertext}`, testKey)).toThrow();
      expect(() => decrypt(`corrupted:${iv}:${ciphertext}`, testKey)).toThrow();
    });
  });

  describe('encryption/decryption cycle', () => {
    it('should handle multiple encryption/decryption cycles', () => {
      const encrypted1 = encrypt(testData.text, testKey);
      const decrypted1 = decrypt(encrypted1, testKey);
      const encrypted2 = encrypt(decrypted1, testKey);
      const decrypted2 = decrypt(encrypted2, testKey);
      
      expect(decrypted1).toEqual(testData.text);
      expect(decrypted2).toEqual(testData.text);
      expect(encrypted1).not.toEqual(encrypted2);
    });

    it('should handle large data sets', () => {
      const largeData = 'a'.repeat(10000);
      const encrypted = encrypt(largeData, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toEqual(largeData);
    });

    it('should preserve all Unicode characters', () => {
      const unicodeText = '🌟 Hello 世界! ß▓╚';
      const encrypted = encrypt(unicodeText, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toEqual(unicodeText);
    });
  });

  describe('performance', () => {
    it('should complete encryption within reasonable time', () => {
      const start = performance.now();
      encrypt(testData.text, testKey);
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should take less than 1 second
    });

    it('should complete decryption within reasonable time', () => {
      const encrypted = encrypt(testData.text, testKey);
      const start = performance.now();
      decrypt(encrypted, testKey);
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should take less than 1 second
    });
  });
});

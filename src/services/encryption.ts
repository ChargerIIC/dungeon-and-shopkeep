// Simple encryption using AES
// TODO: For production, consider using a more robust encryption library like crypto-js

export function encrypt(text: string, key: string): string {
  // Basic XOR encryption (NOT for production use)
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
  const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
  const keyCharCodes = textToChars(key);
  
  const encoded = textToChars(text)
    .map((textChar, index) => textChar ^ keyCharCodes[index % keyCharCodes.length])
    .map(byteHex)
    .join('');
    
  return btoa(encoded);
}

export function decrypt(encoded: string, key: string): string {
  // Basic XOR decryption (NOT for production use)
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
  const keyCharCodes = textToChars(key);
  
  const decoded = atob(encoded);
  
  return decoded
    .match(/.{1,2}/g)!
    .map(hex => parseInt(hex, 16))
    .map((textChar, index) => textChar ^ keyCharCodes[index % keyCharCodes.length])
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}

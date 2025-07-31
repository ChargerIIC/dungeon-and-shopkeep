import { User } from 'firebase/auth';
import { encrypt, decrypt } from './encryption'; // We'll create this next

interface SecureData {
  shopName?: string;
  items?: any[];
}

class SecureStorageService {
  private readonly USER_KEY = 'user_data';
  
  // Encrypt data before storing
  public saveData(user: User, data: SecureData): void {
    if (!user) return;
    
    try {
      const encryptedData = encrypt(JSON.stringify(data), user.uid);
      localStorage.setItem(`${this.USER_KEY}_${user.uid}`, encryptedData);
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data securely');
    }
  }

  // Decrypt data when retrieving
  public getData(user: User): SecureData | null {
    if (!user) return null;
    
    try {
      const encryptedData = localStorage.getItem(`${this.USER_KEY}_${user.uid}`);
      if (!encryptedData) return null;
      
      const decryptedData = decrypt(encryptedData, user.uid);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  // Clear data on logout
  public clearData(user: User): void {
    if (!user) return;
    localStorage.removeItem(`${this.USER_KEY}_${user.uid}`);
  }
}

export const secureStorage = new SecureStorageService();

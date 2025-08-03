// Offline storage utilities for better offline functionality

interface OfflineFile {
  url: string;
  timestamp: number;
  name: string;
  type: 'profile' | 'content';
  id?: string;
}

export class OfflineStorage {
  private static readonly STORAGE_KEY = 'portfolio_offline_files';
  private static readonly MAX_FILES = 10; // Limit offline files to prevent storage bloat

  static saveOfflineFile(file: OfflineFile): void {
    try {
      const existingFiles = this.getOfflineFiles();
      
      // Remove oldest files if we exceed limit
      if (existingFiles.length >= this.MAX_FILES) {
        existingFiles.sort((a, b) => a.timestamp - b.timestamp);
        existingFiles.splice(0, existingFiles.length - this.MAX_FILES + 1);
      }
      
      existingFiles.push(file);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingFiles));
    } catch (error) {
      console.warn('Failed to save offline file:', error);
    }
  }

  static getOfflineFiles(): OfflineFile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve offline files:', error);
      return [];
    }
  }

  static removeOfflineFile(name: string): void {
    try {
      const files = this.getOfflineFiles().filter(f => f.name !== name);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.warn('Failed to remove offline file:', error);
    }
  }

  static syncOfflineFiles(): Promise<void> {
    // This would be implemented to sync offline files when connection is restored
    return Promise.resolve();
  }

  static isOffline(): boolean {
    return !navigator.onLine;
  }

  static addNetworkListener(callback: (isOnline: boolean) => void): (() => void) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}
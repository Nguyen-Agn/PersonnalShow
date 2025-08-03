const STORAGE_KEYS = {
  INTRO: 'portfolio_intro',
  CONTENT: 'portfolio_content',
  OTHER: 'portfolio_other',
  SKILLS: 'portfolio_skills'
} as const;

export const localStorage = {
  saveIntro: (data: any) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.INTRO, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save intro to localStorage:', error);
    }
  },

  getIntro: () => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.INTRO);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get intro from localStorage:', error);
      return null;
    }
  },

  saveContent: (data: any[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save content to localStorage:', error);
    }
  },

  getContent: () => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.CONTENT);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get content from localStorage:', error);
      return [];
    }
  },

  saveOther: (data: any) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.OTHER, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save other to localStorage:', error);
    }
  },

  getOther: () => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.OTHER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get other from localStorage:', error);
      return null;
    }
  },

  saveSkills: (skills: Array<{ name: string; description: string; icon: string }>) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    } catch (error) {
      console.error('Failed to save skills to localStorage:', error);
    }
  },

  getSkills: () => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.SKILLS);
      return data ? JSON.parse(data) : [
        { name: "UI/UX Design", description: "Thiết kế giao diện người dùng sáng tạo", icon: "PaintbrushVertical" },
        { name: "Frontend", description: "Phát triển giao diện web hiện đại", icon: "Code" },
        { name: "Mobile Design", description: "Thiết kế ứng dụng di động", icon: "Smartphone" },
        { name: "Content", description: "Tạo nội dung sáng tạo và hấp dẫn", icon: "FileImage" }
      ];
    } catch (error) {
      console.error('Failed to get skills from localStorage:', error);
      return [
        { name: "UI/UX Design", description: "Thiết kế giao diện người dùng sáng tạo", icon: "PaintbrushVertical" },
        { name: "Frontend", description: "Phát triển giao diện web hiện đại", icon: "Code" },
        { name: "Mobile Design", description: "Thiết kế ứng dụng di động", icon: "Smartphone" },
        { name: "Content", description: "Tạo nội dung sáng tạo và hấp dẫn", icon: "FileImage" }
      ];
    }
  },

  // Auto-save functionality for offline support
  setupAutoSave: (callback: () => void) => {
    const SAVE_INTERVAL = 30000; // Save every 30 seconds
    return setInterval(callback, SAVE_INTERVAL);
  },

  clearAutoSave: (intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
  }
};

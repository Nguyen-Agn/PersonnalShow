const STORAGE_KEYS = {
  INTRO: 'portfolio_intro',
  CONTENT: 'portfolio_content',
  OTHER: 'portfolio_other'
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
  }
};

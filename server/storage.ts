import { 
  type IntroSection, 
  type InsertIntroSection,
  type ContentItem,
  type InsertContentItem,
  type OtherSection,
  type InsertOtherSection
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Introduction section
  getIntroSection(): Promise<IntroSection | undefined>;
  createOrUpdateIntroSection(intro: InsertIntroSection): Promise<IntroSection>;

  // Content items
  getAllContentItems(): Promise<ContentItem[]>;
  getContentItem(id: string): Promise<ContentItem | undefined>;
  createContentItem(content: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: string, content: Partial<InsertContentItem>): Promise<ContentItem>;
  deleteContentItem(id: string): Promise<boolean>;

  // Other section
  getOtherSection(): Promise<OtherSection | undefined>;
  createOrUpdateOtherSection(other: InsertOtherSection): Promise<OtherSection>;
}

export class MemStorage implements IStorage {
  private introSection: IntroSection | undefined;
  private contentItems: Map<string, ContentItem>;
  private otherSection: OtherSection | undefined;

  constructor() {
    this.contentItems = new Map();
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Default introduction
    this.introSection = {
      id: randomUUID(),
      title: "Xin chào, tôi là",
      name: "Creative Designer",
      description: "Tôi tạo ra những trải nghiệm số đẹp và có ý nghĩa thông qua thiết kế sáng tạo và công nghệ hiện đại.",
      profileImage: null,
      updatedAt: new Date(),
    };

    // Default other section
    this.otherSection = {
      id: randomUUID(),
      contactInfo: {
        email: "hello@portfolio.com",
        phone: "+84 123 456 789",
        location: "Hà Nội, Việt Nam",
      },
      socialLinks: {
        linkedin: "",
        github: "",
        dribbble: "",
      },
      updatedAt: new Date(),
    };
  }

  async getIntroSection(): Promise<IntroSection | undefined> {
    return this.introSection;
  }

  async createOrUpdateIntroSection(intro: InsertIntroSection): Promise<IntroSection> {
    if (this.introSection) {
      this.introSection = {
        ...this.introSection,
        ...intro,
        updatedAt: new Date(),
      };
    } else {
      this.introSection = {
        id: randomUUID(),
        ...intro,
        updatedAt: new Date(),
      };
    }
    return this.introSection;
  }

  async getAllContentItems(): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values()).sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async getContentItem(id: string): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async createContentItem(content: InsertContentItem): Promise<ContentItem> {
    const id = randomUUID();
    const now = new Date();
    const newItem: ContentItem = {
      id,
      ...content,
      createdAt: now,
      updatedAt: now,
    };
    this.contentItems.set(id, newItem);
    return newItem;
  }

  async updateContentItem(id: string, content: Partial<InsertContentItem>): Promise<ContentItem> {
    const existingItem = this.contentItems.get(id);
    if (!existingItem) {
      throw new Error("Content item not found");
    }
    
    const updatedItem: ContentItem = {
      ...existingItem,
      ...content,
      updatedAt: new Date(),
    };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteContentItem(id: string): Promise<boolean> {
    return this.contentItems.delete(id);
  }

  async getOtherSection(): Promise<OtherSection | undefined> {
    return this.otherSection;
  }

  async createOrUpdateOtherSection(other: InsertOtherSection): Promise<OtherSection> {
    if (this.otherSection) {
      this.otherSection = {
        ...this.otherSection,
        ...other,
        updatedAt: new Date(),
      };
    } else {
      this.otherSection = {
        id: randomUUID(),
        ...other,
        updatedAt: new Date(),
      };
    }
    return this.otherSection;
  }
}

export const storage = new MemStorage();

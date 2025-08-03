import { 
  type IntroSection, 
  type InsertIntroSection,
  type ContentItem,
  type InsertContentItem,
  type OtherSection,
  type InsertOtherSection,
  type CustomSection,
  type InsertCustomSection
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
  updateSkills(skills: Array<{ name: string; description: string; icon: string }>): Promise<OtherSection>;

  // Custom sections
  getAllCustomSections(): Promise<CustomSection[]>;
  getCustomSection(id: string): Promise<CustomSection | undefined>;
  createCustomSection(section: InsertCustomSection): Promise<CustomSection>;
  updateCustomSection(id: string, section: Partial<InsertCustomSection>): Promise<CustomSection>;
  deleteCustomSection(id: string): Promise<boolean>;
  updateCustomSectionItems(id: string, items: CustomSection['items']): Promise<CustomSection>;
}

export class MemStorage implements IStorage {
  private introSection: IntroSection | undefined;
  private contentItems: Map<string, ContentItem>;
  private otherSection: OtherSection | undefined;
  private customSections: Map<string, CustomSection>;

  constructor() {
    this.contentItems = new Map();
    this.customSections = new Map();
    
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
      profileImage: "",
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
      skills: [
        { name: "UI/UX Design", description: "Thiết kế giao diện người dùng sáng tạo", icon: "PaintbrushVertical" },
        { name: "Frontend", description: "Phát triển giao diện web hiện đại", icon: "Code" },
        { name: "Mobile Design", description: "Thiết kế ứng dụng di động", icon: "Smartphone" },
        { name: "Content", description: "Tạo nội dung sáng tạo và hấp dẫn", icon: "FileImage" }
      ],
      updatedAt: new Date(),
    };

    // Create default section
    const defaultSection: CustomSection = {
      id: "default",
      title: "Trang chính",
      description: "Nội dung hiển thị trên trang chủ",
      type: "grid",
      order: "0",
      backgroundColor: "bg-white",
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customSections.set("default", defaultSection);
  }

  async getIntroSection(): Promise<IntroSection | undefined> {
    return this.introSection;
  }

  async createOrUpdateIntroSection(intro: InsertIntroSection): Promise<IntroSection> {
    if (this.introSection) {
      this.introSection = {
        ...this.introSection,
        ...intro,
        profileImage: intro.profileImage || "",
        updatedAt: new Date(),
      };
    } else {
      this.introSection = {
        id: randomUUID(),
        ...intro,
        profileImage: intro.profileImage || "",
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
      content: content.content || null,
      mediaUrl: content.mediaUrl || null,
      excerpt: content.excerpt || null,
      sectionId: content.sectionId || "default",
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
        contactInfo: other.contactInfo || null,
        socialLinks: other.socialLinks ? {
          linkedin: (other.socialLinks.linkedin as string) || "",
          github: (other.socialLinks.github as string) || "",
          dribbble: (other.socialLinks.dribbble as string) || "",
        } : null,
        skills: other.skills ? [...other.skills] : null,
        updatedAt: new Date(),
      };
    } else {
      this.otherSection = {
        id: randomUUID(),
        contactInfo: other.contactInfo || null,
        socialLinks: other.socialLinks ? {
          linkedin: (other.socialLinks.linkedin as string) || "",
          github: (other.socialLinks.github as string) || "",
          dribbble: (other.socialLinks.dribbble as string) || "",
        } : null,
        skills: other.skills ? [...other.skills] : null,
        updatedAt: new Date(),
      };
    }
    return this.otherSection!;
  }

  async updateSkills(skills: Array<{ name: string; description: string; icon: string }>): Promise<OtherSection> {
    if (!this.otherSection) {
      this.otherSection = {
        id: randomUUID(),
        contactInfo: null,
        socialLinks: null,
        skills,
        updatedAt: new Date(),
      };
    } else {
      this.otherSection = {
        ...this.otherSection,
        skills,
        updatedAt: new Date(),
      };
    }
    return this.otherSection;
  }

  // Custom sections methods
  async getAllCustomSections(): Promise<CustomSection[]> {
    return Array.from(this.customSections.values()).sort((a, b) => 
      parseInt(a.order) - parseInt(b.order)
    );
  }

  async getCustomSection(id: string): Promise<CustomSection | undefined> {
    return this.customSections.get(id);
  }

  async createCustomSection(section: InsertCustomSection): Promise<CustomSection> {
    const newSection: CustomSection = {
      id: randomUUID(),
      title: section.title,
      description: section.description || null,
      type: section.type,
      order: section.order,
      backgroundColor: section.backgroundColor || null,
      items: (section.items || []) as CustomSection['items'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customSections.set(newSection.id, newSection);
    return newSection;
  }

  async updateCustomSection(id: string, section: Partial<InsertCustomSection>): Promise<CustomSection> {
    const existingSection = this.customSections.get(id);
    if (!existingSection) {
      throw new Error("Custom section not found");
    }
    
    const updatedSection: CustomSection = {
      ...existingSection,
      title: section.title !== undefined ? section.title : existingSection.title,
      description: section.description !== undefined ? section.description || null : existingSection.description,
      type: section.type !== undefined ? section.type : existingSection.type,
      order: section.order !== undefined ? section.order : existingSection.order,
      backgroundColor: section.backgroundColor !== undefined ? section.backgroundColor || null : existingSection.backgroundColor,
      items: section.items !== undefined ? ((section.items || []) as CustomSection['items']) : existingSection.items,
      updatedAt: new Date(),
    };
    this.customSections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteCustomSection(id: string): Promise<boolean> {
    return this.customSections.delete(id);
  }

  async updateCustomSectionItems(id: string, items: CustomSection['items']): Promise<CustomSection> {
    const existingSection = this.customSections.get(id);
    if (!existingSection) {
      throw new Error("Custom section not found");
    }
    
    const updatedSection: CustomSection = {
      ...existingSection,
      items,
      updatedAt: new Date(),
    };
    this.customSections.set(id, updatedSection);
    return updatedSection;
  }
}

export const storage = new MemStorage();

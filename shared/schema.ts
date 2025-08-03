import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const introSection = pgTable("intro_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  profileImage: text("profile_image"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentItems = pgTable("content_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'text', 'image', 'video'
  content: text("content"), // text content or description
  mediaUrl: text("media_url"), // image or video URL
  excerpt: text("excerpt"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const otherSection = pgTable("other_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactInfo: jsonb("contact_info").$type<{
    email: string;
    phone: string;
    location: string;
  }>(),
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    github?: string;
    dribbble?: string;
  }>(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertIntroSchema = createInsertSchema(introSection).omit({
  id: true,
  updatedAt: true,
});

export const insertContentSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOtherSchema = createInsertSchema(otherSection).omit({
  id: true,
  updatedAt: true,
});

export type IntroSection = typeof introSection.$inferSelect;
export type InsertIntroSection = z.infer<typeof insertIntroSchema>;
export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentSchema>;
export type OtherSection = typeof otherSection.$inferSelect;
export type InsertOtherSection = z.infer<typeof insertOtherSchema>;

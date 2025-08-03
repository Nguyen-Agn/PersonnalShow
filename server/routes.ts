import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIntroSchema, insertContentSchema, insertOtherSchema, insertCustomSectionSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Introduction section routes
  app.get("/api/intro", async (req, res) => {
    try {
      const intro = await storage.getIntroSection();
      res.json(intro);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch introduction" });
    }
  });

  app.post("/api/intro", async (req, res) => {
    try {
      const validatedData = insertIntroSchema.parse(req.body);
      const intro = await storage.createOrUpdateIntroSection(validatedData);
      res.json(intro);
    } catch (error) {
      res.status(400).json({ message: "Invalid introduction data", error });
    }
  });

  // Content items routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContentItems();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.getContentItem(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content item not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content item" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContentItem(validatedData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data", error });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContentItem(req.params.id, validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof Error && error.message === "Content item not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: "Invalid content data", error });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContentItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Content item not found" });
      }
      res.json({ message: "Content item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content item" });
    }
  });

  // Other section routes
  app.get("/api/other", async (req, res) => {
    try {
      const other = await storage.getOtherSection();
      if (!other) {
        return res.json({
          id: randomUUID(),
          contactInfo: {
            email: "hello@example.com",
            phone: "+84 123 456 789",
            location: "Hà Nội, Việt Nam"
          },
          socialLinks: {},
          skills: [
            { name: "UI/UX Design", description: "Thiết kế giao diện người dùng sáng tạo", icon: "PaintbrushVertical" },
            { name: "Frontend", description: "Phát triển giao diện web hiện đại", icon: "Code" },
            { name: "Mobile Design", description: "Thiết kế ứng dụng di động", icon: "Smartphone" },
            { name: "Content", description: "Tạo nội dung sáng tạo và hấp dẫn", icon: "FileImage" }
          ],
          updatedAt: new Date()
        });
      }
      res.json(other);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch other section" });
    }
  });

  app.post("/api/other", async (req, res) => {
    try {
      const validatedData = insertOtherSchema.parse(req.body);
      const other = await storage.createOrUpdateOtherSection(validatedData);
      res.json(other);
    } catch (error) {
      res.status(400).json({ message: "Invalid other section data", error });
    }
  });

  app.put("/api/skills", async (req, res) => {
    try {
      const skillsSchema = z.array(z.object({
        name: z.string(),
        description: z.string(),
        icon: z.string()
      }));
      const skills = skillsSchema.parse(req.body);
      const other = await storage.updateSkills(skills);
      res.json(other);
    } catch (error) {
      console.error("Error updating skills:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Custom sections routes
  app.get("/api/sections", async (req, res) => {
    try {
      const sections = await storage.getAllCustomSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom sections" });
    }
  });

  app.get("/api/sections/:id", async (req, res) => {
    try {
      const section = await storage.getCustomSection(req.params.id);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch section" });
    }
  });

  app.post("/api/sections", async (req, res) => {
    try {
      const validatedData = insertCustomSectionSchema.parse(req.body);
      const section = await storage.createCustomSection(validatedData);
      res.json(section);
    } catch (error) {
      res.status(400).json({ message: "Invalid section data", error });
    }
  });

  app.put("/api/sections/:id", async (req, res) => {
    try {
      const validatedData = insertCustomSectionSchema.partial().parse(req.body);
      const section = await storage.updateCustomSection(req.params.id, validatedData);
      res.json(section);
    } catch (error) {
      if (error instanceof Error && error.message === "Custom section not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: "Invalid section data", error });
    }
  });

  app.delete("/api/sections/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomSection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete section" });
    }
  });

  app.put("/api/sections/:id/items", async (req, res) => {
    try {
      const itemsSchema = z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        content: z.string().optional(),
        mediaUrl: z.string().optional(),
        type: z.enum(['text', 'image', 'video', 'link']),
        icon: z.string().optional(),
        metadata: z.record(z.any()).optional(),
      }));
      const items = itemsSchema.parse(req.body);
      const section = await storage.updateCustomSectionItems(req.params.id, items);
      res.json(section);
    } catch (error) {
      if (error instanceof Error && error.message === "Custom section not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: "Invalid items data", error });
    }
  });

  // Object Storage routes
  // Serve public objects
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve uploaded objects (public access for portfolio)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL for file uploads
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Update content with uploaded file URL
  app.put("/api/uploaded-content", async (req, res) => {
    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileURL,
        {
          owner: "portfolio-admin",
          visibility: "public", // Public access for portfolio content
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting file ACL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

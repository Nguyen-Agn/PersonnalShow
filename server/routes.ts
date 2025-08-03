import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIntroSchema, insertContentSchema, insertOtherSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}

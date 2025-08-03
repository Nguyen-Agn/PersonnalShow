// Vercel-specific handler that wraps the Express app
import express from "express";
import { registerRoutes } from "./routes";

let app: express.Application | null = null;
let initialized = false;

async function getApp() {
  if (!app || !initialized) {
    app = express();
    
    // Middleware
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.set('trust proxy', 1);

    // Register routes
    await registerRoutes(app);
    initialized = true;
  }
  
  return app;
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
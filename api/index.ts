import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.set('trust proxy', 1);

// Global app instance
let initialized = false;

async function initApp() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
  return app;
}

// Export for Vercel
export default async (req: any, res: any) => {
  const app = await initApp();
  return app(req, res);
};
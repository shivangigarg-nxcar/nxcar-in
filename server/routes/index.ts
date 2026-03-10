import type { Express } from "express";
import { type Server } from "http";
import { setupAuth, registerAuthRoutes } from "../replit_integrations/auth";
import { registerChatRoutes } from "../replit_integrations/chat";
import { registerObjectStorageRoutes } from "../replit_integrations/object_storage";
import { registerNxcarRoutes } from "./nxcar";
import { registerBuyRoutes } from "./buy";
import { registerPublicRoutes } from "./public";
import { registerUserRoutes } from "./user";
import { registerAdminAuthRoutes } from "./auth";
import { registerAdminRoutes } from "./admin";
import { registerAiRoutes } from "./ai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);
  
  registerChatRoutes(app);
  
  registerObjectStorageRoutes(app);

  registerNxcarRoutes(app);
  registerBuyRoutes(app);
  registerPublicRoutes(app);
  registerUserRoutes(app);
  registerAdminAuthRoutes(app);
  registerAdminRoutes(app);
  registerAiRoutes(app);

  return httpServer;
}

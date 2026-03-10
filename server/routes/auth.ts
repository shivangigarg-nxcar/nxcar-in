import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";

export function registerAdminAuthRoutes(app: Express) {
  app.post("/api/admin/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      const { username, password } = result.data;
      const user = await storage.getAdminUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      (req.session as any).isAdmin = true;
      (req.session as any).username = username;
      
      res.json({ success: true, username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session && (req.session as any).isAdmin) {
      res.json({ isAdmin: true, username: (req.session as any).username });
    } else {
      res.json({ isAdmin: false });
    }
  });

  app.post("/api/admin/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getAdminUserByUsername("admin");
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      await storage.createAdminUser({ username: "admin", passwordHash });
      
      res.json({ success: true, message: "Admin created with username: admin" });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ error: "Setup failed" });
    }
  });
}

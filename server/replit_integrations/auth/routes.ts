import type { Express } from "express";
import { authStorage } from "./storage";

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ message: "Valid 10-digit Indian phone number required" });
      }

      const authKey = process.env.MSG91_AUTH_KEY;
      const templateId = process.env.MSG91_TEMPLATE_ID;
      
      if (!authKey || !templateId) {
        console.error("MSG91 credentials not configured");
        return res.status(500).json({ message: "OTP service not configured" });
      }

      const response = await fetch("https://control.msg91.com/api/v5/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authkey": authKey,
        },
        body: JSON.stringify({
          template_id: templateId,
          mobile: `91${phone}`,
          otp_length: 4,
        }),
      });

      const data = await response.json();
      
      if (data.type === "success" || data.type === "error" && data.message?.includes("already")) {
        (req.session as any).pendingPhone = phone;
        return res.json({ success: true, message: "OTP sent successfully" });
      } else {
        console.error("MSG91 error:", data);
        return res.status(500).json({ message: data.message || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ message: "Phone and OTP required" });
      }

      const authKey = process.env.MSG91_AUTH_KEY;
      if (!authKey) {
        return res.status(500).json({ message: "OTP service not configured" });
      }

      const response = await fetch(
        `https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}`,
        {
          method: "GET",
          headers: {
            "authkey": authKey,
          },
        }
      );

      const data = await response.json();

      if (data.type === "success") {
        const user = await authStorage.upsertUser({
          phone,
        });

        (req.session as any).userId = user.id;
        (req.session as any).phone = phone;
        delete (req.session as any).pendingPhone;

        return res.json({ success: true, user });
      } else {
        return res.status(400).json({ message: data.message || "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  app.post("/api/auth/resend-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ message: "Phone number required" });
      }

      const authKey = process.env.MSG91_AUTH_KEY;
      if (!authKey) {
        return res.status(500).json({ message: "OTP service not configured" });
      }

      const response = await fetch(
        `https://control.msg91.com/api/v5/otp/retry?mobile=91${phone}&retrytype=text`,
        {
          method: "POST",
          headers: {
            "authkey": authKey,
          },
        }
      );

      const data = await response.json();
      res.json({ success: true, message: "OTP resent" });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({ message: "Failed to resend OTP" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      if (!userId) {
        return res.status(401).json({ message: "Not logged in" });
      }
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      if (!userId) {
        return res.status(401).json({ message: "Not logged in" });
      }
      const { firstName, lastName, email, city } = req.body;
      const user = await authStorage.upsertUser({
        id: userId,
        firstName,
        lastName,
        email,
        city,
      });
      res.json({ user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
}

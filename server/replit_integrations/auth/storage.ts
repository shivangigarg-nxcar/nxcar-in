import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (userData.phone) {
      const existing = await this.getUserByPhone(userData.phone);
      if (existing) {
        const [user] = await db
          .update(users)
          .set({ ...userData, updatedAt: new Date() })
          .where(eq(users.id, existing.id))
          .returning();
        return user;
      }
    }
    
    if (userData.id) {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: { ...userData, updatedAt: new Date() },
        })
        .returning();
      return user;
    }

    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
}

export const authStorage = new AuthStorage();

import { eq, and, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, documents, documentHistory, type InsertProfile, type InsertDocument, type InsertDocumentHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== PROFILES =====

export async function createProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(profiles).values(data);
  return result[0].insertId;
}

export async function getProfilesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(profiles).where(eq(profiles.userId, userId)).orderBy(desc(profiles.updatedAt));
}

export async function getProfileById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateProfile(id: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(profiles).set(data).where(eq(profiles.id, id));
}

export async function deleteProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(profiles).where(eq(profiles.id, id));
}

export async function searchProfiles(userId: number, query: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(profiles).where(
    and(eq(profiles.userId, userId), like(profiles.nome, `%${query}%`))
  );
}

// ===== DOCUMENTS =====

export async function createDocument(data: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(documents).values(data);
  return result[0].insertId;
}

export async function getDocumentsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.updatedAt));
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateDocument(id: number, data: Partial<InsertDocument>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(documents).set(data).where(eq(documents.id, id));
}

export async function deleteDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(documents).where(eq(documents.id, id));
}

// ===== DOCUMENT HISTORY =====

export async function addDocumentHistory(data: InsertDocumentHistory) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(documentHistory).values(data);
}

export async function getDocumentHistory(documentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documentHistory).where(eq(documentHistory.documentId, documentId)).orderBy(desc(documentHistory.createdAt));
}

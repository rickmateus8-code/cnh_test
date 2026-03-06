import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { localUsers } from "../drizzle/schema";

const SALT_ROUNDS = 10;

// Admin master credentials
const ADMIN_USERNAME = "cyberpiolho";
const ADMIN_PASSWORD = "@Durafa10";

export async function ensureAdminExists() {
  const db = await getDb();
  if (!db) return;

  const existing = await db
    .select()
    .from(localUsers)
    .where(eq(localUsers.username, ADMIN_USERNAME))
    .limit(1);

  if (existing.length === 0) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await db.insert(localUsers).values({
      username: ADMIN_USERNAME,
      passwordHash: hash,
      displayName: "Admin Master",
      role: "admin",
    });
    console.log("[Auth] Admin master created");
  }
}

export async function registerUser(
  username: string,
  password: string,
  displayName?: string,
  email?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if username already exists
  const existing = await db
    .select()
    .from(localUsers)
    .where(eq(localUsers.username, username))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Nome de usuário já existe");
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.insert(localUsers).values({
    username,
    passwordHash: hash,
    displayName: displayName || username,
    email: email || null,
    role: "user",
  });

  return { id: result[0].insertId, username, displayName: displayName || username };
}

export async function authenticateUser(username: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const users = await db
    .select()
    .from(localUsers)
    .where(eq(localUsers.username, username))
    .limit(1);

  if (users.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const user = users[0];
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new Error("Senha incorreta");
  }

  // Update last signed in
  await db
    .update(localUsers)
    .set({ lastSignedIn: new Date() })
    .where(eq(localUsers.id, user.id));

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    balance: user.balance,
  };
}

export async function getLocalUserById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const users = await db
    .select()
    .from(localUsers)
    .where(eq(localUsers.id, id))
    .limit(1);

  if (users.length === 0) return null;

  const u = users[0];
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    email: u.email,
    role: u.role,
    balance: u.balance,
  };
}

export async function listAllUsers() {
  const db = await getDb();
  if (!db) return [];

  const all = await db.select({
    id: localUsers.id,
    username: localUsers.username,
    displayName: localUsers.displayName,
    email: localUsers.email,
    role: localUsers.role,
    balance: localUsers.balance,
    createdAt: localUsers.createdAt,
    lastSignedIn: localUsers.lastSignedIn,
  }).from(localUsers);

  return all;
}

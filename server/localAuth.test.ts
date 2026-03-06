import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import fs from "fs";

// Test bcrypt hashing/verification directly (same logic used in localAuth.ts)
describe("localAuth - password hashing", () => {
  const SALT_ROUNDS = 10;

  describe("bcrypt hash", () => {
    it("should hash a password", async () => {
      const hash = await bcrypt.hash("test123", SALT_ROUNDS);
      expect(hash).toBeDefined();
      expect(hash).not.toBe("test123");
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should produce different hashes for same password (different salts)", async () => {
      const hash1 = await bcrypt.hash("test123", SALT_ROUNDS);
      const hash2 = await bcrypt.hash("test123", SALT_ROUNDS);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("bcrypt compare", () => {
    it("should verify correct password", async () => {
      const hash = await bcrypt.hash("@Durafa10", SALT_ROUNDS);
      const result = await bcrypt.compare("@Durafa10", hash);
      expect(result).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const hash = await bcrypt.hash("@Durafa10", SALT_ROUNDS);
      const result = await bcrypt.compare("wrongpassword", hash);
      expect(result).toBe(false);
    });

    it("should verify admin master credentials pattern", async () => {
      const adminPassword = "@Durafa10";
      const hash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
      expect(await bcrypt.compare(adminPassword, hash)).toBe(true);
      expect(await bcrypt.compare("admin123", hash)).toBe(false);
      expect(await bcrypt.compare("", hash)).toBe(false);
    });
  });
});

describe("localAuth - module structure", () => {
  it("should have correct admin credentials configured", () => {
    const moduleContent = fs.readFileSync("./server/localAuth.ts", "utf-8");
    expect(moduleContent).toContain('const ADMIN_USERNAME = "cyberpiolho"');
    expect(moduleContent).toContain('const ADMIN_PASSWORD = "@Durafa10"');
  });

  it("should export required functions", () => {
    const moduleContent = fs.readFileSync("./server/localAuth.ts", "utf-8");
    expect(moduleContent).toContain("export async function ensureAdminExists");
    expect(moduleContent).toContain("export async function registerUser");
    expect(moduleContent).toContain("export async function authenticateUser");
    expect(moduleContent).toContain("export async function getLocalUserById");
    expect(moduleContent).toContain("export async function listAllUsers");
  });
});

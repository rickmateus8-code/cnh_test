/**
 * Database Module — SQLite local para DocMaster V6
 * Gerencia: usuários, saldo, documentos, templates, transações
 * Admin master: cyberpiolho
 */
import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "docmaster.db");

// Ensure data directory exists
import fs from "fs";
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ============================================================
// SCHEMA CREATION
// ============================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user', 'viewer')),
    balance REAL NOT NULL DEFAULT 0.0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pdf_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'historico',
    price REAL NOT NULL DEFAULT 0.0,
    html_content TEXT,
    fields_json TEXT,
    original_pdf_path TEXT,
    thumbnail_path TEXT,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS generated_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    template_id INTEGER REFERENCES pdf_templates(id),
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    fields_json TEXT,
    pdf_path TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'permanent')),
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK(type IN ('credit', 'debit', 'refund')),
    amount REAL NOT NULL,
    description TEXT,
    reference_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pix_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'expired', 'cancelled')),
    pix_code TEXT,
    pix_qr_data TEXT,
    external_id TEXT,
    paid_at TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ============================================================
// SEED: Admin master (cyberpiolho)
// ============================================================

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const adminExists = db.prepare("SELECT id FROM users WHERE username = ?").get("cyberpiolho");
if (!adminExists) {
  db.prepare(
    "INSERT INTO users (username, email, password_hash, role, balance) VALUES (?, ?, ?, ?, ?)"
  ).run("cyberpiolho", "admin@docmaster.local", hashPassword("@Durafa10"), "admin", 999999.0);
  console.log("[DB] Admin master 'cyberpiolho' criado com sucesso.");
}

// Insert default system settings
const defaultSettings = [
  ["document_expiry_minutes", "30"],
  ["default_document_price", "20.00"],
  ["pix_gateway_enabled", "false"],
  ["pix_gateway_api_key", ""],
  ["pix_gateway_api_url", ""],
  ["max_documents_per_user", "100"],
];

const insertSetting = db.prepare(
  "INSERT OR IGNORE INTO system_settings (key, value) VALUES (?, ?)"
);
for (const [key, value] of defaultSettings) {
  insertSetting.run(key, value);
}

// ============================================================
// USER OPERATIONS
// ============================================================

export const userOps = {
  findByUsername: (username: string) => {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
  },

  findById: (id: number) => {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
  },

  authenticate: (username: string, password: string) => {
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
    if (!user) return null;
    if (!verifyPassword(password, user.password_hash)) return null;
    return { id: user.id, username: user.username, email: user.email, role: user.role, balance: user.balance };
  },

  create: (username: string, email: string, password: string, role = "user") => {
    const result = db.prepare(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)"
    ).run(username, email, hashPassword(password), role);
    return result.lastInsertRowid;
  },

  updateBalance: (userId: number, amount: number, type: "credit" | "debit", description: string) => {
    const updateUser = db.prepare(
      type === "credit"
        ? "UPDATE users SET balance = balance + ?, updated_at = datetime('now') WHERE id = ?"
        : "UPDATE users SET balance = balance - ?, updated_at = datetime('now') WHERE id = ? AND balance >= ?"
    );

    const insertTx = db.prepare(
      "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)"
    );

    const tx = db.transaction(() => {
      if (type === "debit") {
        const result = updateUser.run(amount, userId, amount);
        if (result.changes === 0) throw new Error("Saldo insuficiente");
      } else {
        updateUser.run(amount, userId);
      }
      insertTx.run(userId, type, amount, description);
    });

    tx();
    return userOps.findById(userId);
  },

  listAll: () => {
    return db.prepare("SELECT id, username, email, role, balance, is_active, created_at FROM users ORDER BY created_at DESC").all();
  },

  setActive: (userId: number, isActive: boolean) => {
    db.prepare("UPDATE users SET is_active = ?, updated_at = datetime('now') WHERE id = ?").run(isActive ? 1 : 0, userId);
  },

  changePassword: (userId: number, newPassword: string) => {
    db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(hashPassword(newPassword), userId);
  },

  setRole: (userId: number, role: string) => {
    db.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?").run(role, userId);
  },
};

// ============================================================
// TEMPLATE OPERATIONS
// ============================================================

export const templateOps = {
  create: (data: {
    name: string;
    description?: string;
    category: string;
    price: number;
    html_content?: string;
    fields_json?: string;
    original_pdf_path?: string;
    created_by: number;
  }) => {
    const result = db.prepare(
      `INSERT INTO pdf_templates (name, description, category, price, html_content, fields_json, original_pdf_path, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(data.name, data.description || "", data.category, data.price, data.html_content || "", data.fields_json || "[]", data.original_pdf_path || "", data.created_by);
    return result.lastInsertRowid;
  },

  findById: (id: number) => {
    return db.prepare("SELECT * FROM pdf_templates WHERE id = ?").get(id) as any;
  },

  listPublished: () => {
    return db.prepare("SELECT * FROM pdf_templates WHERE is_published = 1 ORDER BY created_at DESC").all();
  },

  listAll: () => {
    return db.prepare("SELECT * FROM pdf_templates ORDER BY created_at DESC").all();
  },

  publish: (id: number) => {
    db.prepare("UPDATE pdf_templates SET is_published = 1, updated_at = datetime('now') WHERE id = ?").run(id);
  },

  unpublish: (id: number) => {
    db.prepare("UPDATE pdf_templates SET is_published = 0, updated_at = datetime('now') WHERE id = ?").run(id);
  },

  update: (id: number, data: Partial<{ name: string; description: string; price: number; html_content: string; fields_json: string }>) => {
    const sets: string[] = [];
    const values: any[] = [];
    for (const [key, val] of Object.entries(data)) {
      sets.push(`${key} = ?`);
      values.push(val);
    }
    sets.push("updated_at = datetime('now')");
    values.push(id);
    db.prepare(`UPDATE pdf_templates SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  },
};

// ============================================================
// DOCUMENT OPERATIONS
// ============================================================

export const documentOps = {
  create: (data: {
    user_id: number;
    template_id?: number;
    document_type: string;
    document_name: string;
    fields_json?: string;
    pdf_path?: string;
  }) => {
    const expiryMinutes = parseInt(
      (db.prepare("SELECT value FROM system_settings WHERE key = 'document_expiry_minutes'").get() as any)?.value || "30"
    );

    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

    const result = db.prepare(
      `INSERT INTO generated_documents (user_id, template_id, document_type, document_name, fields_json, pdf_path, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(data.user_id, data.template_id || null, data.document_type, data.document_name, data.fields_json || "{}", data.pdf_path || "", expiresAt);
    return result.lastInsertRowid;
  },

  findByUser: (userId: number) => {
    return db.prepare(
      "SELECT * FROM generated_documents WHERE user_id = ? ORDER BY created_at DESC"
    ).all(userId);
  },

  findById: (id: number) => {
    return db.prepare("SELECT * FROM generated_documents WHERE id = ?").get(id) as any;
  },

  expireOldDocuments: () => {
    const result = db.prepare(
      "UPDATE generated_documents SET status = 'expired' WHERE status = 'active' AND expires_at < datetime('now')"
    ).run();
    return result.changes;
  },

  makePermanent: (id: number) => {
    db.prepare("UPDATE generated_documents SET status = 'permanent', expires_at = NULL WHERE id = ?").run(id);
  },
};

// ============================================================
// PIX PAYMENT OPERATIONS
// ============================================================

export const pixOps = {
  create: (userId: number, amount: number) => {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const externalId = `PIX_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    // Placeholder PIX code (will be replaced by actual gateway)
    const pixCode = `00020126580014br.gov.bcb.pix0136${crypto.randomUUID()}5204000053039865802BR5925DOCMASTER SISTEMA6009SAO PAULO62070503***6304`;

    const result = db.prepare(
      `INSERT INTO pix_payments (user_id, amount, pix_code, external_id, expires_at)
       VALUES (?, ?, ?, ?, ?)`
    ).run(userId, amount, pixCode, externalId, expiresAt);

    return {
      id: result.lastInsertRowid,
      amount,
      pix_code: pixCode,
      external_id: externalId,
      expires_at: expiresAt,
    };
  },

  confirmPayment: (externalId: string) => {
    const payment = db.prepare("SELECT * FROM pix_payments WHERE external_id = ?").get(externalId) as any;
    if (!payment) throw new Error("Pagamento não encontrado");
    if (payment.status !== "pending") throw new Error("Pagamento já processado");

    const tx = db.transaction(() => {
      db.prepare("UPDATE pix_payments SET status = 'paid', paid_at = datetime('now') WHERE id = ?").run(payment.id);
      userOps.updateBalance(payment.user_id, payment.amount, "credit", `Recarga PIX #${externalId}`);
    });

    tx();
    return { success: true, amount: payment.amount };
  },

  findByUser: (userId: number) => {
    return db.prepare("SELECT * FROM pix_payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 20").all(userId);
  },
};

// ============================================================
// SYSTEM SETTINGS
// ============================================================

export const settingsOps = {
  get: (key: string): string | null => {
    const row = db.prepare("SELECT value FROM system_settings WHERE key = ?").get(key) as any;
    return row?.value || null;
  },

  set: (key: string, value: string) => {
    db.prepare(
      "INSERT INTO system_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')"
    ).run(key, value, value);
  },

  getAll: () => {
    return db.prepare("SELECT * FROM system_settings").all();
  },
};

// ============================================================
// BACKGROUND: Expire documents every minute
// ============================================================

setInterval(() => {
  const expired = documentOps.expireOldDocuments();
  if (expired > 0) {
    console.log(`[DB] ${expired} documento(s) expirado(s) automaticamente.`);
  }
}, 60 * 1000);

export default db;

import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Local authentication users (username/password) */
export const localUsers = mysqlTable("local_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 128 }),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  balance: int("balance").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

/** Student/client profiles for document generation */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 20 }),
  rg: varchar("rg", { length: 50 }),
  nacionalidade: varchar("nacionalidade", { length: 100 }),
  naturalidade: varchar("naturalidade", { length: 100 }),
  dataNascimento: varchar("dataNascimento", { length: 20 }),
  curso: varchar("curso", { length: 255 }),
  tituloConferido: varchar("tituloConferido", { length: 255 }),
  grauConferido: varchar("grauConferido", { length: 255 }),
  habilitacao: varchar("habilitacao", { length: 255 }),
  emec: varchar("emec", { length: 20 }),
  dataConclusao: varchar("dataConclusao", { length: 20 }),
  dataColacao: varchar("dataColacao", { length: 20 }),
  dataEmissao: varchar("dataEmissao", { length: 20 }),
  endereco: text("endereco"),
  dadosExtras: json("dadosExtras"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/** Generated documents */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId"),
  tipo: mysqlEnum("tipo", ["historico", "diploma"]).notNull(),
  titulo: varchar("titulo", { length: 255 }),
  dados: json("dados"),
  hashValidacao: varchar("hashValidacao", { length: 255 }),
  qrCodeData: text("qrCodeData"),
  status: mysqlEnum("status", ["rascunho", "finalizado", "exportado"]).default("rascunho").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/** Document edit history */
export const documentHistory = mysqlTable("document_history", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  userId: int("userId").notNull(),
  modificacoes: json("modificacoes"),
  descricao: varchar("descricao", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentHistory = typeof documentHistory.$inferSelect;
export type InsertDocumentHistory = typeof documentHistory.$inferInsert;

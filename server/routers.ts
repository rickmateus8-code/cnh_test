import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { authenticateUser, registerUser, getLocalUserById, listAllUsers, ensureAdminExists } from "./localAuth";
import * as db from "./db";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";

// Ensure admin exists on startup
ensureAdminExists().catch(console.error);

const secret = new TextEncoder().encode(ENV.cookieSecret || "docmaster-secret-key-2024");

async function createLocalToken(userId: number) {
  return new SignJWT({ localUserId: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      // Check for local auth cookie first
      const token = ctx.req.cookies?.["docmaster_session"];
      if (token) {
        try {
          const { payload } = await jwtVerify(token, secret);
          const localUserId = payload.localUserId as number;
          const user = await getLocalUserById(localUserId);
          if (user) return user;
        } catch { /* token invalid */ }
      }
      // Fallback to Manus OAuth
      if (ctx.user) {
        return {
          id: ctx.user.id,
          username: ctx.user.openId,
          displayName: ctx.user.name,
          email: ctx.user.email,
          role: ctx.user.role,
          balance: 0,
        };
      }
      return null;
    }),

    login: publicProcedure
      .input(z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await authenticateUser(input.username, input.password);
          const token = await createLocalToken(user.id);
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie("docmaster_session", token, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
          return { success: true, user };
        } catch (error: any) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: error.message || "Falha na autenticação",
          });
        }
      }),

    register: publicProcedure
      .input(z.object({
        username: z.string().min(3).max(64),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (input.password !== input.confirmPassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "As senhas não coincidem",
          });
        }
        try {
          const user = await registerUser(
            input.username,
            input.password,
            input.displayName,
            input.email
          );
          const token = await createLocalToken(user.id);
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie("docmaster_session", token, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          return { success: true, user };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message || "Falha no cadastro",
          });
        }
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie("docmaster_session", { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== PROFILES =====
  profiles: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const user = await getAuthUser(ctx);
      if (!user) return [];
      return db.getProfilesByUser(user.id);
    }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProfileById(input.id);
      }),

    create: publicProcedure
      .input(z.object({
        nome: z.string().min(1),
        cpf: z.string().optional(),
        rg: z.string().optional(),
        nacionalidade: z.string().optional(),
        naturalidade: z.string().optional(),
        dataNascimento: z.string().optional(),
        curso: z.string().optional(),
        tituloConferido: z.string().optional(),
        grauConferido: z.string().optional(),
        habilitacao: z.string().optional(),
        emec: z.string().optional(),
        dataConclusao: z.string().optional(),
        dataColacao: z.string().optional(),
        dataEmissao: z.string().optional(),
        endereco: z.string().optional(),
        dadosExtras: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await getAuthUser(ctx);
        if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const id = await db.createProfile({ ...input, userId: user.id });
        return { id };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        nome: z.string().optional(),
        cpf: z.string().optional(),
        rg: z.string().optional(),
        nacionalidade: z.string().optional(),
        naturalidade: z.string().optional(),
        dataNascimento: z.string().optional(),
        curso: z.string().optional(),
        tituloConferido: z.string().optional(),
        grauConferido: z.string().optional(),
        habilitacao: z.string().optional(),
        emec: z.string().optional(),
        dataConclusao: z.string().optional(),
        dataColacao: z.string().optional(),
        dataEmissao: z.string().optional(),
        endereco: z.string().optional(),
        dadosExtras: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProfile(id, data);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProfile(input.id);
        return { success: true };
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input, ctx }) => {
        const user = await getAuthUser(ctx);
        if (!user) return [];
        return db.searchProfiles(user.id, input.query);
      }),
  }),

  // ===== DOCUMENTS =====
  documents: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const user = await getAuthUser(ctx);
      if (!user) return [];
      return db.getDocumentsByUser(user.id);
    }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getDocumentById(input.id);
      }),

    create: publicProcedure
      .input(z.object({
        profileId: z.number().optional(),
        tipo: z.enum(["historico", "diploma"]),
        titulo: z.string().optional(),
        dados: z.any().optional(),
        hashValidacao: z.string().optional(),
        qrCodeData: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await getAuthUser(ctx);
        if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
        const id = await db.createDocument({ ...input, userId: user.id });
        return { id };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        dados: z.any().optional(),
        titulo: z.string().optional(),
        status: z.enum(["rascunho", "finalizado", "exportado"]).optional(),
        hashValidacao: z.string().optional(),
        qrCodeData: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateDocument(id, data);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDocument(input.id);
        return { success: true };
      }),

    history: publicProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ input }) => {
        return db.getDocumentHistory(input.documentId);
      }),
  }),

  // ===== ADMIN =====
  admin: router({
    users: publicProcedure.query(async ({ ctx }) => {
      const user = await getAuthUser(ctx);
      if (!user || user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
      }
      return listAllUsers();
    }),
  }),
});

// Helper to get authenticated user from either local or OAuth
async function getAuthUser(ctx: any) {
  const token = ctx.req.cookies?.["docmaster_session"];
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const localUserId = payload.localUserId as number;
      return await getLocalUserById(localUserId);
    } catch { /* ignore */ }
  }
  if (ctx.user) {
    return {
      id: ctx.user.id,
      username: ctx.user.openId,
      displayName: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      balance: 0,
    };
  }
  return null;
}

export type AppRouter = typeof appRouter;

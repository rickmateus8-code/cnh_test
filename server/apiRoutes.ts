/**
 * API Routes — DocMaster V6
 * Rotas REST para: autenticação, admin, membros, saldo, documentos, PIX, templates
 */
import { Router, Request, Response } from "express";
import { userOps, templateOps, documentOps, pixOps, settingsOps } from "./database";

const router = Router();

// ============================================================
// MIDDLEWARE: Session check
// ============================================================

function requireAuth(req: Request, res: Response, next: Function) {
  const session = (req as any).session;
  if (!session?.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  const session = (req as any).session;
  if (!session?.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  const user = userOps.findById(session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
  next();
}

// ============================================================
// AUTH ROUTES
// ============================================================

router.post("/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username e senha são obrigatórios" });
  }

  const user = userOps.authenticate(username, password);
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  // Store session
  (req as any).session = { userId: user.id, username: user.username, role: user.role };
  res.json({ success: true, user });
});

router.post("/auth/register", (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username e senha são obrigatórios" });
  }

  try {
    const id = userOps.create(username, email || `${username}@docmaster.local`, password);
    res.json({ success: true, userId: id });
  } catch (err: any) {
    res.status(400).json({ error: "Usuário já existe ou dados inválidos" });
  }
});

router.get("/auth/me", (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  const user = userOps.findById(session.userId);
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    balance: user.balance,
    is_active: user.is_active,
  });
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.json({ success: true });
});

// ============================================================
// ADMIN: USER MANAGEMENT
// ============================================================

router.get("/admin/users", requireAdmin, (_req: Request, res: Response) => {
  const users = userOps.listAll();
  res.json(users);
});

router.post("/admin/users/:id/balance", requireAdmin, (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { amount, type, description } = req.body;

  if (!amount || !type) {
    return res.status(400).json({ error: "Valor e tipo são obrigatórios" });
  }

  try {
    const user = userOps.updateBalance(userId, parseFloat(amount), type, description || `${type === "credit" ? "Crédito" : "Débito"} manual pelo admin`);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/admin/users/:id/role", requireAdmin, (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!["admin", "user", "viewer"].includes(role)) {
    return res.status(400).json({ error: "Role inválida" });
  }

  userOps.setRole(userId, role);
  res.json({ success: true });
});

router.post("/admin/users/:id/toggle-active", requireAdmin, (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = userOps.findById(userId);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  userOps.setActive(userId, !user.is_active);
  res.json({ success: true, is_active: !user.is_active });
});

router.post("/admin/users/create", requireAdmin, (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  try {
    const id = userOps.create(username, email, password, role || "user");
    res.json({ success: true, userId: id });
  } catch (err: any) {
    res.status(400).json({ error: "Erro ao criar usuário: " + err.message });
  }
});

// ============================================================
// ADMIN: SYSTEM SETTINGS
// ============================================================

router.get("/admin/settings", requireAdmin, (_req: Request, res: Response) => {
  const settings = settingsOps.getAll();
  res.json(settings);
});

router.post("/admin/settings", requireAdmin, (req: Request, res: Response) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: "Key é obrigatória" });
  settingsOps.set(key, value);
  res.json({ success: true });
});

// ============================================================
// TEMPLATES
// ============================================================

router.get("/templates", (_req: Request, res: Response) => {
  const templates = templateOps.listPublished();
  res.json(templates);
});

router.get("/admin/templates", requireAdmin, (_req: Request, res: Response) => {
  const templates = templateOps.listAll();
  res.json(templates);
});

router.post("/admin/templates", requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).session;
  const { name, description, category, price, html_content, fields_json } = req.body;

  try {
    const id = templateOps.create({
      name,
      description,
      category: category || "historico",
      price: parseFloat(price) || 0,
      html_content,
      fields_json: typeof fields_json === "string" ? fields_json : JSON.stringify(fields_json),
      created_by: session.userId,
    });
    res.json({ success: true, templateId: id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/admin/templates/:id/publish", requireAdmin, (req: Request, res: Response) => {
  templateOps.publish(parseInt(req.params.id));
  res.json({ success: true });
});

router.post("/admin/templates/:id/unpublish", requireAdmin, (req: Request, res: Response) => {
  templateOps.unpublish(parseInt(req.params.id));
  res.json({ success: true });
});

// ============================================================
// DOCUMENTS
// ============================================================

router.get("/documents", requireAuth, (req: Request, res: Response) => {
  const session = (req as any).session;
  const docs = documentOps.findByUser(session.userId);
  res.json(docs);
});

router.post("/documents", requireAuth, (req: Request, res: Response) => {
  const session = (req as any).session;
  const { template_id, document_type, document_name, fields_json } = req.body;

  // Check if template has a price and user has enough balance
  if (template_id) {
    const template = templateOps.findById(template_id);
    if (template && template.price > 0) {
      const user = userOps.findById(session.userId);
      if (user.balance < template.price) {
        return res.status(400).json({ error: "Saldo insuficiente", required: template.price, balance: user.balance });
      }
      // Debit balance
      userOps.updateBalance(session.userId, template.price, "debit", `Geração de documento: ${document_name}`);
    }
  }

  try {
    const id = documentOps.create({
      user_id: session.userId,
      template_id,
      document_type: document_type || "historico",
      document_name: document_name || "Documento sem título",
      fields_json: typeof fields_json === "string" ? fields_json : JSON.stringify(fields_json),
    });
    res.json({ success: true, documentId: id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/admin/documents/:id/permanent", requireAdmin, (req: Request, res: Response) => {
  documentOps.makePermanent(parseInt(req.params.id));
  res.json({ success: true });
});

// ============================================================
// PIX PAYMENTS
// ============================================================

router.post("/pix/create", requireAuth, (req: Request, res: Response) => {
  const session = (req as any).session;
  const { amount } = req.body;

  if (!amount || parseFloat(amount) < 5) {
    return res.status(400).json({ error: "Valor mínimo de recarga: R$ 5,00" });
  }

  const gatewayEnabled = settingsOps.get("pix_gateway_enabled");

  const payment = pixOps.create(session.userId, parseFloat(amount));

  res.json({
    success: true,
    payment,
    gateway_enabled: gatewayEnabled === "true",
    message: gatewayEnabled === "true"
      ? "PIX gerado com sucesso. Escaneie o QR code ou copie o código."
      : "Gateway PIX não configurado. Use o código de teste abaixo.",
  });
});

router.post("/pix/webhook", (req: Request, res: Response) => {
  // Webhook para receber confirmação de pagamento do gateway
  const { external_id, status } = req.body;

  if (status === "paid" && external_id) {
    try {
      const result = pixOps.confirmPayment(external_id);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.json({ success: true, message: "Webhook recebido" });
  }
});

// Manual confirmation (for admin testing)
router.post("/admin/pix/:externalId/confirm", requireAdmin, (req: Request, res: Response) => {
  try {
    const result = pixOps.confirmPayment(req.params.externalId);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/pix/history", requireAuth, (req: Request, res: Response) => {
  const session = (req as any).session;
  const payments = pixOps.findByUser(session.userId);
  res.json(payments);
});

export default router;

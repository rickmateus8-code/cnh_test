/**
 * PDF Processing API Routes
 * =========================
 * Endpoints para upload, processamento OCR, extração de campos,
 * e gerenciamento de templates de documentos.
 *
 * POST /api/pdf/upload        — Upload de PDF + processamento automático
 * GET  /api/pdf/templates     — Lista templates processados
 * GET  /api/pdf/templates/:id — Detalhes de um template
 * PUT  /api/pdf/templates/:id — Atualizar campos de um template
 * DELETE /api/pdf/templates/:id — Remover template
 * GET  /api/pdf/preview/:id   — Preview image de um template
 * GET  /api/pdf/html/:id      — HTML gerado do PDF
 * POST /api/pdf/publish/:id   — Publicar template no painel principal
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import { execSync, exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Diretórios
const UPLOAD_DIR = path.resolve("uploads");
const TEMPLATES_DIR = path.resolve("templates");
const SCRIPTS_DIR = path.resolve("server/scripts");

// Garantir que diretórios existem
[UPLOAD_DIR, TEMPLATES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configuração do multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são aceitos"));
    }
  },
});

// ============================================================
// Banco de dados em memória (JSON file-backed)
// ============================================================

interface PDFTemplate {
  id: string;
  name: string;
  originalFilename: string;
  uploadedAt: string;
  status: "processing" | "ready" | "published" | "error";
  pdfPath: string;
  outputDir: string;
  metadata: Record<string, string>;
  fields: Array<{
    id: string;
    label: string;
    category: string;
    originalValue: string;
    currentValue: string;
    page?: number;
    type?: string;
    headers?: string[];
    rows?: string[][];
  }>;
  previewPaths: string[];
  htmlPath: string;
  embeddedImages: string[];
  pages: number;
  publishedAt?: string;
  error?: string;
}

const DB_PATH = path.join(TEMPLATES_DIR, "templates_db.json");

function loadDB(): PDFTemplate[] {
  if (fs.existsSync(DB_PATH)) {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  }
  return [];
}

function saveDB(templates: PDFTemplate[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(templates, null, 2), "utf-8");
}

function findTemplate(id: string): PDFTemplate | undefined {
  return loadDB().find((t) => t.id === id);
}

function updateTemplate(id: string, updates: Partial<PDFTemplate>) {
  const templates = loadDB();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx >= 0) {
    templates[idx] = { ...templates[idx], ...updates };
    saveDB(templates);
    return templates[idx];
  }
  return null;
}

// ============================================================
// POST /api/pdf/upload — Upload + processamento automático
// ============================================================

router.post("/upload", upload.single("pdf"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const templateId = uuidv4();
    const outputDir = path.join(TEMPLATES_DIR, templateId);
    const useOcr = req.body?.ocr === "true" || req.body?.ocr === true;
    const lang = req.body?.lang || "por";
    const templateName = req.body?.name || file.originalname.replace(/\.pdf$/i, "");

    // Criar template inicial
    const template: PDFTemplate = {
      id: templateId,
      name: templateName,
      originalFilename: file.originalname,
      uploadedAt: new Date().toISOString(),
      status: "processing",
      pdfPath: file.path,
      outputDir,
      metadata: {},
      fields: [],
      previewPaths: [],
      htmlPath: "",
      embeddedImages: [],
      pages: 0,
    };

    const templates = loadDB();
    templates.push(template);
    saveDB(templates);

    // Responder imediatamente
    res.json({
      id: templateId,
      status: "processing",
      message: "Upload recebido. Processamento iniciado.",
    });

    // Processar em background
    const scriptPath = path.join(SCRIPTS_DIR, "pdf_processor.py");
    const cmd = `python3 "${scriptPath}" "${file.path}" "${outputDir}" ${useOcr ? "--ocr" : ""} --lang ${lang}`;

    exec(cmd, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error("[PDF Processor] Error:", error.message);
        updateTemplate(templateId, {
          status: "error",
          error: error.message,
        });
        return;
      }

      console.log("[PDF Processor] Output:", stdout);

      // Ler resultado
      const resultPath = path.join(outputDir, "extraction_result.json");
      if (fs.existsSync(resultPath)) {
        const result = JSON.parse(fs.readFileSync(resultPath, "utf-8"));
        updateTemplate(templateId, {
          status: "ready",
          metadata: result.metadata || {},
          fields: result.fields || [],
          previewPaths: (result.previews || []).map((p: string) =>
            path.relative(TEMPLATES_DIR, p)
          ),
          htmlPath: result.html_path
            ? path.relative(TEMPLATES_DIR, result.html_path)
            : "",
          embeddedImages: (result.embedded_images || []).map((p: string) =>
            path.relative(TEMPLATES_DIR, p)
          ),
          pages: (result.pages || []).length,
        });
      } else {
        updateTemplate(templateId, {
          status: "error",
          error: "Resultado do processamento não encontrado",
        });
      }
    });
  } catch (err: any) {
    console.error("[PDF Upload] Error:", err);
    res.status(500).json({ error: err.message || "Erro interno" });
  }
});

// ============================================================
// GET /api/pdf/templates — Lista todos os templates
// ============================================================

router.get("/templates", (_req: Request, res: Response) => {
  const templates = loadDB().map((t) => ({
    id: t.id,
    name: t.name,
    originalFilename: t.originalFilename,
    uploadedAt: t.uploadedAt,
    status: t.status,
    pages: t.pages,
    fieldsCount: t.fields.length,
    publishedAt: t.publishedAt,
  }));
  res.json(templates);
});

// ============================================================
// GET /api/pdf/templates/:id — Detalhes de um template
// ============================================================

router.get("/templates/:id", (req: Request, res: Response) => {
  const template = findTemplate(req.params.id);
  if (!template) {
    return res.status(404).json({ error: "Template não encontrado" });
  }
  res.json(template);
});

// ============================================================
// PUT /api/pdf/templates/:id — Atualizar campos
// ============================================================

router.put("/templates/:id", (req: Request, res: Response) => {
  const template = findTemplate(req.params.id);
  if (!template) {
    return res.status(404).json({ error: "Template não encontrado" });
  }

  const { fields, name } = req.body;
  const updates: Partial<PDFTemplate> = {};

  if (name) updates.name = name;
  if (fields && Array.isArray(fields)) {
    updates.fields = fields;
  }

  const updated = updateTemplate(req.params.id, updates);
  res.json(updated);
});

// ============================================================
// DELETE /api/pdf/templates/:id — Remover template
// ============================================================

router.delete("/templates/:id", (req: Request, res: Response) => {
  const templates = loadDB();
  const idx = templates.findIndex((t) => t.id === req.params.id);
  if (idx < 0) {
    return res.status(404).json({ error: "Template não encontrado" });
  }

  const template = templates[idx];

  // Remover arquivos
  try {
    if (fs.existsSync(template.outputDir)) {
      fs.rmSync(template.outputDir, { recursive: true, force: true });
    }
    if (fs.existsSync(template.pdfPath)) {
      fs.unlinkSync(template.pdfPath);
    }
  } catch (e) {
    console.warn("[PDF Delete] Cleanup warning:", e);
  }

  templates.splice(idx, 1);
  saveDB(templates);
  res.json({ success: true });
});

// ============================================================
// GET /api/pdf/preview/:id/:page — Preview image
// ============================================================

router.get("/preview/:id/:page?", (req: Request, res: Response) => {
  const template = findTemplate(req.params.id);
  if (!template) {
    return res.status(404).json({ error: "Template não encontrado" });
  }

  const page = parseInt(req.params.page || "1") - 1;
  const previewPath = template.previewPaths[page];
  if (!previewPath) {
    return res.status(404).json({ error: "Preview não encontrado" });
  }

  const fullPath = path.join(TEMPLATES_DIR, previewPath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "Arquivo de preview não encontrado" });
  }

  res.sendFile(fullPath);
});

// ============================================================
// GET /api/pdf/html/:id — HTML gerado
// ============================================================

router.get("/html/:id", (req: Request, res: Response) => {
  const template = findTemplate(req.params.id);
  if (!template || !template.htmlPath) {
    return res.status(404).json({ error: "HTML não encontrado" });
  }

  const fullPath = path.join(TEMPLATES_DIR, template.htmlPath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "Arquivo HTML não encontrado" });
  }

  res.sendFile(fullPath);
});

// ============================================================
// POST /api/pdf/publish/:id — Publicar template
// ============================================================

router.post("/publish/:id", (req: Request, res: Response) => {
  const template = findTemplate(req.params.id);
  if (!template) {
    return res.status(404).json({ error: "Template não encontrado" });
  }

  if (template.status !== "ready") {
    return res.status(400).json({ error: "Template ainda não está pronto" });
  }

  const updated = updateTemplate(req.params.id, {
    status: "published",
    publishedAt: new Date().toISOString(),
  });

  res.json({ success: true, template: updated });
});

// ============================================================
// GET /api/pdf/image/:id/:filename — Servir imagem embutida
// ============================================================

router.get("/image/:id/:filename", (req: Request, res: Response) => {
  const template = findTemplate(req.params.id);
  if (!template) {
    return res.status(404).json({ error: "Template não encontrado" });
  }

  const imgPath = template.embeddedImages.find((p) =>
    p.endsWith(req.params.filename)
  );
  if (!imgPath) {
    return res.status(404).json({ error: "Imagem não encontrada" });
  }

  const fullPath = path.join(TEMPLATES_DIR, imgPath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "Arquivo não encontrado" });
  }

  res.sendFile(fullPath);
});

export default router;

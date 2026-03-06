/**
 * AdminPDFManager — Área Administrativa de Gerenciamento de Templates PDF
 * ========================================================================
 * Fluxo completo: Upload PDF → OCR/Extração → Preview → Edição de Campos → Publicação
 *
 * Funcionalidades:
 *   - Upload de PDF com drag-and-drop
 *   - Processamento automático via OCR + pdfplumber + pdftohtml
 *   - Preview lado-a-lado (original vs HTML gerado)
 *   - Edição de campos detectados automaticamente
 *   - Publicação de templates no painel principal
 *   - Gerenciamento (listar, editar, excluir) de templates
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload, FileText, Eye, Edit3, Trash2, CheckCircle, Loader2,
  ArrowLeft, RefreshCw, Download, Globe, Search, X, ChevronRight,
  AlertCircle, Image as ImageIcon, Code, Layers, Settings, Zap
} from "lucide-react";

// ============================================================
// Types
// ============================================================

interface PDFTemplate {
  id: string;
  name: string;
  originalFilename: string;
  uploadedAt: string;
  status: "processing" | "ready" | "published" | "error";
  pages: number;
  fieldsCount: number;
  publishedAt?: string;
}

interface PDFTemplateDetail extends PDFTemplate {
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
  error?: string;
}

// ============================================================
// API helpers
// ============================================================

const API_BASE = "/api/pdf";

async function fetchTemplates(): Promise<PDFTemplate[]> {
  const res = await fetch(`${API_BASE}/templates`);
  return res.json();
}

async function fetchTemplateDetail(id: string): Promise<PDFTemplateDetail> {
  const res = await fetch(`${API_BASE}/templates/${id}`);
  return res.json();
}

async function uploadPDF(file: File, name: string, useOcr: boolean): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("pdf", file);
  formData.append("name", name);
  formData.append("ocr", useOcr ? "true" : "false");
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
  return res.json();
}

async function updateTemplateFields(id: string, fields: any[]): Promise<void> {
  await fetch(`${API_BASE}/templates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
}

async function publishTemplate(id: string): Promise<void> {
  await fetch(`${API_BASE}/publish/${id}`, { method: "POST" });
}

async function deleteTemplate(id: string): Promise<void> {
  await fetch(`${API_BASE}/templates/${id}`, { method: "DELETE" });
}

// ============================================================
// Sub-components
// ============================================================

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    processing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    ready: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    published: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<string, string> = {
    processing: "Processando",
    ready: "Pronto",
    published: "Publicado",
    error: "Erro",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${colors[status] || ""}`}>
      {status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "ready" && <CheckCircle className="w-3 h-3" />}
      {status === "published" && <Globe className="w-3 h-3" />}
      {status === "error" && <AlertCircle className="w-3 h-3" />}
      {labels[status] || status}
    </span>
  );
}

// ============================================================
// Upload Section
// ============================================================

function UploadSection({ onUploaded }: { onUploaded: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [useOcr, setUseOcr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setName(f.name.replace(/\.pdf$/i, ""));
    } else {
      toast.error("Apenas arquivos PDF são aceitos");
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadPDF(file, name || file.name, useOcr);
      toast.success(`Upload realizado! ID: ${result.id.slice(0, 8)}...`);
      setFile(null);
      setName("");
      onUploaded();
    } catch (err: any) {
      toast.error(err.message || "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#141420] border border-[#2a2a3a] rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-[#c8aa32]" />
        Upload de PDF
      </h3>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragging
            ? "border-[#c8aa32] bg-[#c8aa32]/10"
            : file
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-[#2a2a3a] hover:border-[#444455] hover:bg-[#1a1a2a]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setName(f.name.replace(/\.pdf$/i, ""));
            }
          }}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-emerald-400" />
            <div className="text-left">
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-[#666688] text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[#666688] hover:text-red-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-[#444455] mx-auto mb-3" />
            <p className="text-[#8888aa]">Arraste um PDF aqui ou clique para selecionar</p>
            <p className="text-[#555566] text-sm mt-1">Máximo 50MB</p>
          </>
        )}
      </div>

      {file && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[#aaaacc] text-sm block mb-1">Nome do Template</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0d0d18] border-[#2a2a3a] text-white"
              placeholder="Nome do documento"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useOcr}
                onChange={(e) => setUseOcr(e.target.checked)}
                className="rounded border-[#2a2a3a] bg-[#0d0d18] text-[#c8aa32]"
              />
              <span className="text-[#aaaacc] text-sm">Forçar OCR (para PDFs escaneados/imagem)</span>
            </label>
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" /> Processar PDF
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Template Detail / Editor
// ============================================================

function TemplateEditor({ templateId, onBack }: { templateId: string; onBack: () => void }) {
  const [template, setTemplate] = useState<PDFTemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "fields" | "html">("preview");
  const [saving, setSaving] = useState(false);

  const loadTemplate = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTemplateDetail(templateId);
      setTemplate(data);
    } catch (err) {
      toast.error("Erro ao carregar template");
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
    // Poll while processing
    const interval = setInterval(async () => {
      const data = await fetchTemplateDetail(templateId);
      if (data.status !== "processing") {
        setTemplate(data);
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [templateId, loadTemplate]);

  const handleFieldChange = (fieldId: string, newValue: string) => {
    if (!template) return;
    setTemplate({
      ...template,
      fields: template.fields.map((f) =>
        f.id === fieldId ? { ...f, currentValue: newValue } : f
      ),
    });
  };

  const handleSave = async () => {
    if (!template) return;
    setSaving(true);
    try {
      await updateTemplateFields(template.id, template.fields);
      toast.success("Campos salvos com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!template) return;
    try {
      await publishTemplate(template.id);
      toast.success("Template publicado no painel principal!");
      loadTemplate();
    } catch (err) {
      toast.error("Erro ao publicar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#c8aa32]" />
      </div>
    );
  }

  if (!template) {
    return <div className="text-red-400">Template não encontrado</div>;
  }

  // Group fields by category
  const fieldsByCategory: Record<string, typeof template.fields> = {};
  for (const field of template.fields) {
    const cat = field.category || "Outros";
    if (!fieldsByCategory[cat]) fieldsByCategory[cat] = [];
    fieldsByCategory[cat].push(field);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-[#8888aa] hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <div>
            <h2 className="text-white font-semibold text-lg">{template.name}</h2>
            <p className="text-[#666688] text-sm">
              {template.originalFilename} — {template.pages} página(s) — {template.fields.length} campos
            </p>
          </div>
          <StatusBadge status={template.status} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className="border-[#2a2a3a] text-[#aaaacc] hover:text-white hover:bg-[#1a1a2a]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
            Salvar
          </Button>
          {template.status === "ready" && (
            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white"
            >
              <Globe className="w-4 h-4 mr-1" /> Publicar
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0d0d14] rounded-lg p-1">
        {[
          { key: "preview" as const, label: "Preview", icon: Eye },
          { key: "fields" as const, label: "Campos Editáveis", icon: Edit3 },
          { key: "html" as const, label: "HTML Gerado", icon: Code },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
              activeTab === tab.key
                ? "bg-[#c8aa32]/20 text-[#c8aa32]"
                : "text-[#8888aa] hover:text-white hover:bg-[#1a1a2a]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "preview" && (
        <div className="bg-[#141420] border border-[#2a2a3a] rounded-xl p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#c8aa32]" />
            Preview do PDF Original
          </h3>
          {template.status === "processing" ? (
            <div className="flex items-center justify-center h-64 text-[#666688]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Processando PDF... Aguarde.
            </div>
          ) : (
            <div className="space-y-4">
              {template.previewPaths.map((_, idx) => (
                <div key={idx} className="border border-[#2a2a3a] rounded-lg overflow-hidden">
                  <div className="bg-[#0d0d14] px-3 py-1 text-[#666688] text-xs">
                    Página {idx + 1}
                  </div>
                  <img
                    src={`${API_BASE}/preview/${template.id}/${idx + 1}`}
                    alt={`Página ${idx + 1}`}
                    className="w-full"
                    style={{ maxWidth: 800, margin: "0 auto", display: "block" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "fields" && (
        <div className="bg-[#141420] border border-[#2a2a3a] rounded-xl p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#c8aa32]" />
            Campos Detectados Automaticamente
          </h3>
          {template.fields.length === 0 ? (
            <p className="text-[#666688] text-center py-8">
              Nenhum campo detectado. Tente reprocessar com OCR ativado.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(fieldsByCategory).map(([category, fields]) => (
                <div key={category} className="border border-[#2a2a3a] rounded-lg overflow-hidden">
                  <div className="bg-[#0d0d14] px-4 py-2 text-[#c8aa32] text-sm font-medium flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {category}
                    <span className="text-[#555566] text-xs ml-auto">{fields.length} campos</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {fields.map((field) => (
                      <div key={field.id}>
                        {field.type === "table" ? (
                          <div>
                            <label className="text-[#aaaacc] text-xs font-medium block mb-1">
                              {field.label}
                            </label>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border-collapse">
                                <thead>
                                  <tr>
                                    {field.headers?.map((h, i) => (
                                      <th key={i} className="border border-[#2a2a3a] bg-[#0d0d14] text-[#aaaacc] px-2 py-1 text-left">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {field.rows?.slice(0, 5).map((row, ri) => (
                                    <tr key={ri}>
                                      {row.map((cell, ci) => (
                                        <td key={ci} className="border border-[#2a2a3a] text-[#8888aa] px-2 py-1">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <label className="text-[#aaaacc] text-xs font-medium w-40 shrink-0">
                              {field.label}
                            </label>
                            <Input
                              value={field.currentValue}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className={`h-8 text-xs bg-[#0d0d18] border-[#2a2a3a] text-white flex-1 ${
                                field.currentValue !== field.originalValue
                                  ? "border-amber-500/50 bg-amber-900/10"
                                  : ""
                              }`}
                            />
                            {field.currentValue !== field.originalValue && (
                              <button
                                onClick={() => handleFieldChange(field.id, field.originalValue)}
                                className="text-[#555566] hover:text-white text-xs"
                                title="Restaurar original"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "html" && (
        <div className="bg-[#141420] border border-[#2a2a3a] rounded-xl p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-[#c8aa32]" />
            HTML Gerado (pdf-to-html)
          </h3>
          {template.htmlPath ? (
            <div className="border border-[#2a2a3a] rounded-lg overflow-hidden">
              <iframe
                src={`${API_BASE}/html/${template.id}`}
                className="w-full bg-white"
                style={{ height: 800 }}
                title="HTML Preview"
              />
            </div>
          ) : (
            <p className="text-[#666688] text-center py-8">
              HTML não disponível para este template.
            </p>
          )}
        </div>
      )}

      {/* Metadata */}
      {template.metadata && Object.keys(template.metadata).length > 0 && (
        <div className="bg-[#141420] border border-[#2a2a3a] rounded-xl p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#c8aa32]" />
            Metadados do PDF
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(template.metadata).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-xs">
                <span className="text-[#666688] w-32 shrink-0">{key}:</span>
                <span className="text-[#aaaacc]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function AdminPDFManager() {
  const [, setLocation] = useLocation();
  const [templates, setTemplates] = useState<PDFTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadTemplates = useCallback(async () => {
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("Error loading templates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este template?")) return;
    try {
      await deleteTemplate(id);
      toast.success("Template excluído");
      loadTemplates();
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.originalFilename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] p-6">
        <div className="max-w-6xl mx-auto">
          <TemplateEditor
            templateId={selectedId}
            onBack={() => {
              setSelectedId(null);
              loadTemplates();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="text-[#8888aa] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
            </Button>
            <div>
              <h1 className="text-white text-2xl font-bold">Gerenciador de Templates PDF</h1>
              <p className="text-[#666688] text-sm">
                Upload, extração automática, edição e publicação de documentos
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadTemplates}
            className="border-[#2a2a3a] text-[#aaaacc] hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Atualizar
          </Button>
        </div>

        {/* Upload Section */}
        <UploadSection onUploaded={loadTemplates} />

        {/* Templates List */}
        <div className="bg-[#141420] border border-[#2a2a3a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#c8aa32]" />
              Templates ({templates.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]" />
              <Input
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] h-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-[#c8aa32]" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-[#555566]">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum template encontrado</p>
              <p className="text-sm mt-1">Faça upload de um PDF para começar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-[#1a1a2a] hover:border-[#2a2a3a] hover:bg-[#1a1a2a]/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedId(t.id)}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#c8aa32]/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#c8aa32]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{t.name}</p>
                    <p className="text-[#555566] text-xs truncate">
                      {t.originalFilename} — {t.pages} pág. — {t.fieldsCount} campos
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                  <span className="text-[#555566] text-xs">
                    {new Date(t.uploadedAt).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                      className="p-1.5 rounded hover:bg-red-500/10 text-[#555566] hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#555566]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

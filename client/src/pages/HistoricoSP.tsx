/**
 * Histórico São Paulo - Document Viewer
 * Réplica do histórico escolar SP com campos editáveis
 * Export: window.print() with base64 embedded images
 */
import { useLocation } from "wouter";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Download, ZoomIn, ZoomOut,
  Eye, EyeOff, PanelLeftClose, PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSPSubstitution } from "@/hooks/useSPSubstitution";
import SPSubstitutionPanel from "@/components/SPSubstitutionPanel";
import { SPPage1 } from "@/components/SPDocumentPage";

export default function HistoricoSP() {
  const [, setLocation] = useLocation();
  const [zoom, setZoom] = useState(0.72);
  const [showHighlights, setShowHighlights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    fields, fieldMap, modifiedCount,
    currentGrades, brasaoUrl,
    updateField, resetToOriginal, handleBrasaoUpload
  } = useSPSubstitution();

  // Signature upload state
  const [assinaturaGerenteUrl, setAssinaturaGerenteUrl] = useState<string | null>(null);
  const [assinaturaDiretorUrl, setAssinaturaDiretorUrl] = useState<string | null>(null);

  const handleAssinaturaGerenteUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAssinaturaGerenteUrl(e.target?.result as string);
      toast.success("Assinatura do Gerente carregada!");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAssinaturaDiretorUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAssinaturaDiretorUrl(e.target?.result as string);
      toast.success("Assinatura do Diretor carregada!");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      const docPage = document.getElementById("doc-page-sp-1");
      if (!docPage) {
        toast.error("Documento não encontrado");
        setIsExporting(false);
        return;
      }

      // Clone the document HTML (images are already base64 embedded)
      const docHTML = docPage.outerHTML;

      const printWindow = window.open("", "_blank", "width=794,height=1123");
      if (!printWindow) {
        toast.error("Popup bloqueado. Permita popups para exportar.");
        setIsExporting(false);
        return;
      }

      const studentName = (fieldMap.nome_aluno || "Documento").replace(/\s+/g, "_");

      printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<title>Historico_Escolar_SP_${studentName}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    background: white;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  .doc-page-sp {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    background: white !important;
    padding: 9.9mm 12.7mm 25mm 14.5mm !important;
  }
  table { border-collapse: collapse; }
  td, th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  /* Remove highlight styles for print */
  [style*="border-bottom: 2px solid #2d8c4e"] { border-bottom: none !important; }
  [style*="background-color: rgba(45,140,78,0.08)"] { background-color: transparent !important; }
  @media print {
    body { width: 210mm; height: 297mm; }
    .doc-page-sp {
      width: 210mm !important;
      height: 297mm !important;
      page-break-after: avoid;
    }
  }
</style>
</head>
<body>${docHTML}</body>
</html>`);

      printWindow.document.close();

      // Wait for content to render
      await new Promise((r) => setTimeout(r, 1000));

      // Wait for all images to load
      const imgs = printWindow.document.querySelectorAll("img");
      await Promise.all(
        Array.from(imgs).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) resolve();
              else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }
            })
        )
      );

      await new Promise((r) => setTimeout(r, 500));
      printWindow.print();

      toast.success("Janela de impressão aberta! Selecione 'Salvar como PDF'.");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error(
        "Erro ao exportar PDF: " +
          (err instanceof Error ? err.message : "Erro desconhecido")
      );
    } finally {
      setIsExporting(false);
    }
  }, [fieldMap]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a0f]">
      {/* Top Bar */}
      <header className="h-12 border-b border-[#1a1a2a] bg-[#0d0d14] flex items-center px-4 gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#666688] hover:text-white h-7">
          <ArrowLeft size={15} className="mr-1" /> Voltar
        </Button>
        <Separator orientation="vertical" className="h-6 bg-[#2a2a3a]" />
        <h1 className="text-sm font-semibold tracking-wide text-white">
          Histórico Escolar SP — Visualizador Interativo
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {modifiedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 font-medium">
              {modifiedCount} alterações
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 text-[#aaaacc] border-[#2a2a3a]"
            onClick={() => setShowHighlights(!showHighlights)}
          >
            {showHighlights ? <Eye size={13} className="mr-1" /> : <EyeOff size={13} className="mr-1" />}
            {showHighlights ? "Destaques ON" : "Destaques OFF"}
          </Button>
          <Button
            size="sm"
            className="text-xs h-7 bg-gradient-to-r from-[#2d8c4e] to-[#1a6b35] hover:from-[#35a05a] hover:to-[#1f7a3e] text-white font-semibold"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <Download size={13} className="mr-1" />
            {isExporting ? "Exportando..." : "Exportar PDF"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-80 border-r border-[#1a1a2a] bg-[#0d0d14] shrink-0 flex flex-col overflow-hidden">
            <SPSubstitutionPanel
              fields={fields}
              modifiedCount={modifiedCount}
              onUpdateField={updateField}
              onReset={resetToOriginal}
              onBrasaoUpload={handleBrasaoUpload}
              brasaoUrl={brasaoUrl}
              onAssinaturaGerenteUpload={handleAssinaturaGerenteUpload}
              onAssinaturaDiretorUpload={handleAssinaturaDiretorUpload}
              assinaturaGerenteUrl={assinaturaGerenteUrl}
              assinaturaDiretorUrl={assinaturaDiretorUrl}
            />
          </aside>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-10 border-b border-[#1a1a2a] bg-[#0a0a0f]/50 flex items-center px-3 gap-2 shrink-0">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#666688] hover:text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
            </Button>
            <div className="h-4 w-px bg-[#2a2a3a] mx-1" />
            <span className="text-xs text-[#555566]">Histórico Escolar – Ensino Médio (SP)</span>
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#666688] hover:text-white" onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}>
                <ZoomOut size={14} />
              </Button>
              <span className="text-xs text-[#aaaacc] w-10 text-center">{Math.round(zoom * 100)}%</span>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#666688] hover:text-white" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}>
                <ZoomIn size={14} />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex justify-center py-6" style={{ background: "#e8e8e8" }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
              <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)", borderRadius: 2 }}>
                <SPPage1
                  f={fieldMap}
                  highlightModified={showHighlights}
                  grades={currentGrades}
                  brasaoUrl={brasaoUrl || undefined}
                  assinaturaGerenteUrl={assinaturaGerenteUrl || undefined}
                  assinaturaDiretorUrl={assinaturaDiretorUrl || undefined}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

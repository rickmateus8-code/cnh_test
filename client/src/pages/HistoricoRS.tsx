/**
 * Histórico Rio Grande do Sul - Document Viewer
 * Réplica do histórico escolar RS com campos editáveis
 * Export: PDF via jsPDF + html2canvas (direto, sem iframe)
 */
import { useLocalAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Download, ZoomIn, ZoomOut,
  Eye, EyeOff, PanelLeftClose, PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRSSubstitution } from "@/hooks/useRSSubstitution";
import RSSubstitutionPanel from "@/components/RSSubstitutionPanel";
import { RSPage1 } from "@/components/RSDocumentPage";
import { RS_PROFILES } from "@/lib/historicoRSData";

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

export default function HistoricoRS() {
  const { isAuthenticated, loading: authLoading } = useLocalAuth();
  const [, setLocation] = useLocation();
  const [zoom, setZoom] = useState(0.72);
  const [showHighlights, setShowHighlights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const {
    fields, fieldMap, activeProfile, modifiedCount,
    currentGrades, currentGradesDiversificada,
    applyProfile, updateField, resetToOriginal
  } = useRSSubstitution();

  // Auth check disabled for development/testing
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) setLocation("/login");
  // }, [authLoading, isAuthenticated, setLocation]);

  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    toast.info("Gerando PDF...");
    try {
      const { default: jsPDF } = await import("jspdf");
      // Use html2canvas-pro which supports oklch() colors natively
      const { default: html2canvas } = await import("html2canvas-pro");

      const container = printRef.current;
      if (!container) {
        toast.error("Container de impressão não encontrado");
        setIsExporting(false);
        return;
      }

      const docPage = container.querySelector(".doc-page-rs") as HTMLElement;
      if (!docPage) {
        toast.error("Nenhuma página encontrada");
        setIsExporting(false);
        return;
      }

      // Make the hidden container visible for capture
      const origStyle = container.style.cssText;
      container.style.cssText = `position:fixed;left:0;top:0;z-index:99999;background:white;width:${PAGE_WIDTH_MM}mm;`;
      await new Promise((r) => setTimeout(r, 300));

      // Wait for all images to load
      const images = docPage.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
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

      toast.info("Processando página...");

      const canvas = await html2canvas(docPage, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: docPage.scrollWidth,
        height: docPage.scrollHeight,
      });

      // Restore hidden container
      container.style.cssText = origStyle;

      console.log("Canvas created:", canvas.width, "x", canvas.height);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [PAGE_WIDTH_MM, PAGE_HEIGHT_MM],
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      console.log("Image data length:", imgData.length);
      pdf.addImage(imgData, "JPEG", 0, 0, PAGE_WIDTH_MM, PAGE_HEIGHT_MM);

      const profileInfo = RS_PROFILES[activeProfile];
      const filename = `Historico_RS_${profileInfo.name.replace(/\s+/g, "_")}.pdf`;

      // Use data URI approach for reliable download in all browsers
      const pdfDataUri = pdf.output("datauristring");
      const link = document.createElement("a");
      link.href = pdfDataUri;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 2000);
      toast.success("PDF exportado com sucesso!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error(
        "Erro ao exportar PDF: " +
          (err instanceof Error ? err.message : "Erro desconhecido")
      );
    } finally {
      setIsExporting(false);
    }
  }, [activeProfile]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a0f]">
      {/* Top Bar */}
      <header className="h-12 border-b border-[#1a1a2a] bg-[#0d0d14] flex items-center px-4 gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#666688] hover:text-white h-7">
          <ArrowLeft size={15} className="mr-1" /> Voltar
        </Button>
        <Separator orientation="vertical" className="h-6 bg-[#2a2a3a]" />
        <h1 className="text-sm font-semibold tracking-wide text-white">
          Histórico Rio Grande do Sul — Visualizador Interativo
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
            <RSSubstitutionPanel
              fields={fields}
              activeProfile={activeProfile}
              modifiedCount={modifiedCount}
              onApplyProfile={applyProfile}
              onUpdateField={updateField}
              onReset={resetToOriginal}
            />
          </aside>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-10 border-b border-[#1a1a2a] bg-[#0a0a0f]/50 flex items-center px-3 gap-2 shrink-0">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#666688] hover:text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
            </Button>
            <div className="h-4 w-px bg-[#2a2a3a] mx-1" />
            <span className="text-xs text-[#555566]">Histórico Escolar – Ensino Médio (RS)</span>
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
                <RSPage1
                  f={fieldMap}
                  highlightModified={showHighlights}
                  grades={currentGrades}
                  gradesDiversificada={currentGradesDiversificada}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden container for PDF export */}
      <div
        ref={printRef}
        style={{ position: "fixed", left: "-9999px", top: 0, width: `${PAGE_WIDTH_MM}mm`, background: "white", color: "#000" }}
      >
        <RSPage1
          f={fieldMap}
          grades={currentGrades}
          gradesDiversificada={currentGradesDiversificada}
        />
      </div>
    </div>
  );
}

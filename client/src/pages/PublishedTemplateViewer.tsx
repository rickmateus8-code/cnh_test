/**
 * PublishedTemplateViewer — Visualiza templates PDF publicados pelo admin
 * Permite edição de campos e exportação
 */
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PublishedTemplateViewer() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white">
      <header className="h-12 border-b border-[#1a1a2a] bg-[#0d0d14] flex items-center px-4 gap-3">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#666688] hover:text-white h-7">
          <ArrowLeft size={15} className="mr-1" /> Voltar
        </Button>
        <h1 className="text-sm font-semibold">Template Publicado — ID: {params.id}</h1>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Template Viewer</h2>
          <p className="text-[#666688]">Este módulo será conectado ao backend de templates PDF.</p>
          <p className="text-[#666688] mt-2">Template ID: <span className="text-emerald-400">{params.id}</span></p>
        </div>
      </main>
    </div>
  );
}

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, User, Building2, GraduationCap, FileCheck, PenTool, Upload, Image } from "lucide-react";
import type { SPSubstitutionField } from "@/lib/historicoSPData";

interface Props {
  fields: SPSubstitutionField[];
  modifiedCount: number;
  onUpdateField: (id: string, value: string) => void;
  onReset: () => void;
  onBrasaoUpload: (file: File) => void;
  brasaoUrl?: string;
  onAssinaturaGerenteUpload?: (file: File) => void;
  onAssinaturaDiretorUpload?: (file: File) => void;
  assinaturaGerenteUrl?: string | null;
  assinaturaDiretorUrl?: string | null;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType }> = {
  instituicao: { label: "Instituição", icon: Building2 },
  aluno: { label: "Dados do Aluno", icon: User },
  academico: { label: "Dados Acadêmicos", icon: GraduationCap },
  certificado: { label: "Certificado", icon: FileCheck },
  assinaturas: { label: "Assinaturas", icon: PenTool },
};

export default function SPSubstitutionPanel({
  fields,
  modifiedCount,
  onUpdateField,
  onReset,
  onBrasaoUpload,
  brasaoUrl,
  onAssinaturaGerenteUpload,
  onAssinaturaDiretorUpload,
  assinaturaGerenteUrl,
  assinaturaDiretorUrl,
}: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("aluno");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gerenteInputRef = useRef<HTMLInputElement>(null);
  const diretorInputRef = useRef<HTMLInputElement>(null);

  const categories = ["instituicao", "aluno", "academico", "certificado", "assinaturas"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-[#1a1a2a]">
        <h3 className="text-sm font-semibold text-white mb-1">Histórico Escolar SP</h3>
        <p className="text-[10px] text-[#555566]">Edite os campos abaixo para gerar um novo documento</p>
        {modifiedCount > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-amber-400">{modifiedCount} campo(s) alterado(s)</span>
            <Button size="sm" variant="ghost" className="text-xs h-6 text-[#666688] hover:text-white" onClick={onReset}>
              <RotateCcw size={12} className="mr-1" /> Resetar
            </Button>
          </div>
        )}
      </div>

      {/* Brasão Upload */}
      <div className="p-3 border-b border-[#1a1a2a]">
        <h4 className="text-[10px] text-[#666688] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Image size={11} /> Brasão / Logo do Estado
        </h4>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onBrasaoUpload(file);
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 text-[#aaaacc] border-[#2a2a3a] hover:bg-[#1a1a2a] flex-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={12} className="mr-1" />
            {brasaoUrl ? "Trocar Brasão" : "Upload Brasão (PNG)"}
          </Button>
          {brasaoUrl && (
            <div className="w-8 h-8 rounded border border-[#2a2a3a] overflow-hidden flex items-center justify-center bg-white">
              <img src={brasaoUrl} alt="Brasão" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
        <p className="text-[9px] text-[#555566] mt-1">PNG sem fundo, mesmas proporções do original</p>
      </div>

      {/* Assinatura Gerente Upload */}
      <div className="p-3 border-b border-[#1a1a2a]">
        <h4 className="text-[10px] text-[#666688] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <PenTool size={11} /> Assinatura Gerente
        </h4>
        <div className="flex items-center gap-2">
          <input
            ref={gerenteInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onAssinaturaGerenteUpload) onAssinaturaGerenteUpload(file);
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 text-[#aaaacc] border-[#2a2a3a] hover:bg-[#1a1a2a] flex-1"
            onClick={() => gerenteInputRef.current?.click()}
          >
            <Upload size={12} className="mr-1" />
            {assinaturaGerenteUrl ? "Trocar Assinatura" : "Upload Assinatura"}
          </Button>
          {assinaturaGerenteUrl && (
            <div className="w-10 h-8 rounded border border-[#2a2a3a] overflow-hidden flex items-center justify-center bg-white">
              <img src={assinaturaGerenteUrl} alt="Assinatura Gerente" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Assinatura Diretor Upload */}
      <div className="p-3 border-b border-[#1a1a2a]">
        <h4 className="text-[10px] text-[#666688] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <PenTool size={11} /> Assinatura Diretor
        </h4>
        <div className="flex items-center gap-2">
          <input
            ref={diretorInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onAssinaturaDiretorUpload) onAssinaturaDiretorUpload(file);
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 text-[#aaaacc] border-[#2a2a3a] hover:bg-[#1a1a2a] flex-1"
            onClick={() => diretorInputRef.current?.click()}
          >
            <Upload size={12} className="mr-1" />
            {assinaturaDiretorUrl ? "Trocar Assinatura" : "Upload Assinatura"}
          </Button>
          {assinaturaDiretorUrl && (
            <div className="w-10 h-8 rounded border border-[#2a2a3a] overflow-hidden flex items-center justify-center bg-white">
              <img src={assinaturaDiretorUrl} alt="Assinatura Diretor" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Fields */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const catFields = fields.filter((f) => f.category === cat);
            const isExpanded = expandedCategory === cat;
            const Icon = meta.icon;
            return (
              <div key={cat} className="rounded-lg border border-[#1a1a2a] overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#1a1a2a] transition-colors"
                  onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                >
                  <Icon size={14} className="text-[#2d8c4e] shrink-0" />
                  <span className="text-xs font-medium text-[#aaaacc] flex-1">{meta.label}</span>
                  <span className="text-[10px] text-[#555566]">{catFields.length}</span>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2">
                    {catFields.map((field) => (
                      <div key={field.id}>
                        <label className="text-[10px] text-[#666688] uppercase tracking-wider block mb-0.5">
                          {field.label}
                        </label>
                        <Input
                          value={field.currentValue}
                          onChange={(e) => onUpdateField(field.id, e.target.value)}
                          className={`h-7 text-xs bg-[#0a0a0f] border-[#2a2a3a] text-white ${
                            field.currentValue !== field.originalValue
                              ? "border-amber-500/50 bg-amber-900/10"
                              : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

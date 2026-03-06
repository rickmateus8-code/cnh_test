import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, User, Building2, GraduationCap, FileCheck } from "lucide-react";
import type { RSSubstitutionField, RSProfileKey } from "@/lib/historicoRSData";

interface Props {
  fields: RSSubstitutionField[];
  activeProfile: RSProfileKey;
  modifiedCount: number;
  onApplyProfile: (key: RSProfileKey) => void;
  onUpdateField: (id: string, value: string) => void;
  onReset: () => void;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType }> = {
  instituicao: { label: "Instituição", icon: Building2 },
  aluno: { label: "Dados do Aluno", icon: User },
  academico: { label: "Dados Acadêmicos", icon: GraduationCap },
  certificado: { label: "Certificado", icon: FileCheck },
};

export default function RSSubstitutionPanel({
  fields,
  activeProfile,
  modifiedCount,
  onApplyProfile,
  onUpdateField,
  onReset,
}: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("aluno");

  const categories = ["instituicao", "aluno", "academico", "certificado"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-[#1a1a2a]">
        <h3 className="text-sm font-semibold text-white mb-2">Perfis</h3>
        <div className="flex gap-1.5 flex-wrap">
          {(["rafaela", "renata"] as RSProfileKey[]).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={activeProfile === key ? "default" : "outline"}
              className={`text-xs h-7 ${
                activeProfile === key
                  ? "bg-gradient-to-r from-[#2d8c4e] to-[#1a6b35] text-white"
                  : "text-[#aaaacc] border-[#2a2a3a] hover:bg-[#1a1a2a]"
              }`}
              onClick={() => onApplyProfile(key)}
            >
              {key === "rafaela" ? "RAFAELA" : "RENATA (Original)"}
            </Button>
          ))}
        </div>
        {modifiedCount > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-amber-400">{modifiedCount} campo(s) alterado(s)</span>
            <Button size="sm" variant="ghost" className="text-xs h-6 text-[#666688] hover:text-white" onClick={onReset}>
              <RotateCcw size={12} className="mr-1" /> Resetar
            </Button>
          </div>
        )}
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

import { type SubstitutionField, type ProfileKey } from "@/lib/documentData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRoundPen, RotateCcw, ArrowRightLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props {
  fields: SubstitutionField[];
  activeProfile: ProfileKey;
  modifiedCount: number;
  onApplyProfile: (profile: ProfileKey) => void;
  onUpdateField: (fieldId: string, value: string) => void;
  onReset: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  pessoal: "Dados Pessoais",
  academico: "Dados Acadêmicos",
  institucional: "Dados Institucionais",
};

const CATEGORY_ORDER = ["pessoal", "academico", "institucional"];

const PROFILE_BUTTONS: { key: ProfileKey; label: string; shortLabel: string }[] = [
  { key: "lindomar", label: "LINDOMAR", shortLabel: "LIND" },
  { key: "thais_historia", label: "THAIS (História)", shortLabel: "HIST" },
  { key: "thais_pedagogia", label: "THAIS (Pedagogia)", shortLabel: "PED" },
];

export default function SubstitutionPanel({
  fields,
  activeProfile,
  modifiedCount,
  onApplyProfile,
  onUpdateField,
  onReset,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    pessoal: true,
    academico: true,
    institucional: true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: fields.filter((f) => f.category === cat),
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1a1a2a] bg-[#0d0d14]">
        <div className="flex items-center gap-2 mb-2">
          <UserRoundPen size={18} className="text-[#c8aa32]" />
          <h2 className="font-semibold text-sm tracking-wide uppercase text-white">
            Substituição de Dados
          </h2>
        </div>
        {modifiedCount > 0 && (
          <div className="text-xs text-amber-400 font-medium bg-amber-900/30 px-2 py-1 rounded">
            {modifiedCount} campo(s) modificado(s)
          </div>
        )}
      </div>

      {/* Profile Switcher */}
      <div className="px-4 py-3 border-b border-[#1a1a2a] bg-[#0a0a12]">
        <p className="text-xs font-medium text-[#666688] mb-2 uppercase tracking-wider">Perfil / Curso Ativo</p>
        <div className="flex flex-col gap-2">
          {PROFILE_BUTTONS.map((pb) => (
            <Button
              key={pb.key}
              size="sm"
              variant={activeProfile === pb.key ? "default" : "outline"}
              className={`w-full text-xs justify-start ${
                activeProfile === pb.key
                  ? "bg-gradient-to-r from-[#c8aa32] to-[#a08828] text-[#0a0a0f] font-semibold hover:from-[#d4b83a] hover:to-[#b09830]"
                  : "text-[#aaaacc] border-[#2a2a3a] hover:bg-[#1a1a2a] hover:text-white"
              }`}
              onClick={() => onApplyProfile(pb.key)}
            >
              <ArrowRightLeft size={12} className="mr-2 shrink-0" />
              {pb.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto">
        {grouped.map((group) => (
          <div key={group.category}>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#666688] hover:bg-[#1a1a2a]/50 transition-colors border-b border-[#1a1a2a]"
              onClick={() => toggleCategory(group.category)}
            >
              {expandedCategories[group.category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {group.label}
              <span className="ml-auto text-[10px] font-normal">
                {group.items.filter((i) => i.currentValue !== i.originalValue).length}/{group.items.length}
              </span>
            </button>
            {expandedCategories[group.category] && (
              <div className="px-4 py-2 space-y-3">
                {group.items.map((field) => {
                  const isModified = field.currentValue !== field.originalValue;
                  return (
                    <div key={field.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-[#ccccdd]">{field.label}</label>
                        {isModified && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-400 font-medium">
                            modificado
                          </span>
                        )}
                      </div>
                      {isModified && (
                        <div className="text-[10px] text-[#555566] line-through">
                          {field.originalValue}
                        </div>
                      )}
                      <Input
                        value={field.currentValue}
                        onChange={(e) => onUpdateField(field.id, e.target.value)}
                        className={`h-7 text-xs font-mono bg-[#0a0a12] border-[#2a2a3a] text-[#ccccdd] ${isModified ? "border-amber-600 bg-amber-900/10" : ""}`}
                      />
                      <div className="text-[10px] text-[#444455]">
                        Páginas: {field.pages.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#1a1a2a] bg-[#0d0d14]">
        <Button size="sm" variant="outline" className="w-full text-xs text-[#aaaacc] border-[#2a2a3a]" onClick={onReset}>
          <RotateCcw size={12} className="mr-1" />
          Restaurar Original
        </Button>
      </div>
    </div>
  );
}

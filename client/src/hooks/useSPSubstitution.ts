import { useState, useCallback, useMemo } from "react";
import {
  GIOVANNE_PROFILE,
  createSPSubstitutionFields,
  type SPSubstitutionField,
  type SPGradeRow,
  SP_GRADES_DEFAULT,
} from "@/lib/historicoSPData";

export function useSPSubstitution() {
  const [fields, setFields] = useState<SPSubstitutionField[]>(
    createSPSubstitutionFields(GIOVANNE_PROFILE)
  );
  const [brasaoUrl, setBrasaoUrl] = useState<string>("");

  const fieldMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of fields) {
      map[f.id] = f.currentValue;
    }
    
    // --- LÓGICA DE SINCRONIZAÇÃO AUTOMÁTICA ---
    // 1. Escola e Município das séries seguem a Instituição se não preenchidos
    const escolaBase = map.nome_escola || "E. E. Mª APDA. FRANÇA B. ARAUJO PROFª";
    const municipioBase = map.municipio_escola || "Cacapava";
    
    // Sincroniza campos de escola em todas as séries
    ["escola_fund", "escola_1a", "escola_2a", "escola_3a"].forEach(id => {
      if (!map[id]) map[id] = escolaBase;
    });
    
    // Sincroniza campos de município em todas as séries
    ["municipio_fund", "municipio_1a", "municipio_2a", "municipio_3a"].forEach(id => {
      if (!map[id]) map[id] = municipioBase;
    });

    // 2. Ano de Conclusão e Registro GDAE seguem o ano da 3ª Série
    if (map.ano_3a_serie) {
      map.ano_conclusao = map.ano_3a_serie;
      // Atualiza o sufixo do GDAE se necessário ou mantém o padrão
      const baseGdae = (map.registro_gdae || "SPS41214853-0SP").split("-")[0];
      const uf = map.estado_nascimento || "SP";
      map.registro_gdae = `${baseGdae}-0${uf}`;
    }

    return map;
  }, [fields]);

  const modifiedCount = useMemo(() => {
    return fields.filter((f) => f.currentValue !== f.originalValue).length;
  }, [fields]);

  const currentGrades: SPGradeRow[] = SP_GRADES_DEFAULT;

  const updateField = useCallback((fieldId: string, newValue: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, currentValue: newValue } : f))
    );
  }, []);

  const resetToOriginal = useCallback(() => {
    setFields(createSPSubstitutionFields(GIOVANNE_PROFILE));
    setBrasaoUrl("");
  }, []);

  const handleBrasaoUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setBrasaoUrl(url);
  }, []);

  return {
    fields,
    fieldMap,
    modifiedCount,
    currentGrades,
    brasaoUrl,
    updateField,
    resetToOriginal,
    handleBrasaoUpload,
  };
}

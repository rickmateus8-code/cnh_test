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

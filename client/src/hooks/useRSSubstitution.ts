import { useState, useCallback, useMemo } from "react";
import {
  RAFAELA_PROFILE,
  RS_PROFILES,
  createRSSubstitutionFields,
  type RSSubstitutionField,
  type RSProfileKey,
  type RSGradeRow,
} from "@/lib/historicoRSData";

export function useRSSubstitution() {
  const [activeProfile, setActiveProfile] = useState<RSProfileKey>("rafaela");
  const [fields, setFields] = useState<RSSubstitutionField[]>(
    createRSSubstitutionFields(RAFAELA_PROFILE)
  );

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

  const currentGrades: RSGradeRow[] = useMemo(() => {
    return RS_PROFILES[activeProfile].grades;
  }, [activeProfile]);

  const currentGradesDiversificada: RSGradeRow[] = useMemo(() => {
    return RS_PROFILES[activeProfile].gradesDiversificada;
  }, [activeProfile]);

  const applyProfile = useCallback((profileKey: RSProfileKey) => {
    const profile = RS_PROFILES[profileKey];
    if (!profile) return;
    setActiveProfile(profileKey);
    setFields(createRSSubstitutionFields(profile));
  }, []);

  const updateField = useCallback((fieldId: string, newValue: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, currentValue: newValue } : f))
    );
  }, []);

  const resetToOriginal = useCallback(() => {
    setFields(createRSSubstitutionFields(RAFAELA_PROFILE));
    setActiveProfile("rafaela");
  }, []);

  return {
    fields,
    fieldMap,
    activeProfile,
    modifiedCount,
    currentGrades,
    currentGradesDiversificada,
    applyProfile,
    updateField,
    resetToOriginal,
  };
}

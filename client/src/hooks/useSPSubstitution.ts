import { useState, useCallback, useMemo } from "react";
import {
  GIOVANNE_PROFILE,
  SP_PROFILES,
  createSPSubstitutionFields,
  type SPSubstitutionField,
  type SPProfileKey,
  type SPGradeRow,
} from "@/lib/historicoSPData";

export function useSPSubstitution() {
  const [activeProfile, setActiveProfile] = useState<SPProfileKey>("giovanne");
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

  const currentGrades: SPGradeRow[] = useMemo(() => {
    return SP_PROFILES[activeProfile].grades;
  }, [activeProfile]);

  const applyProfile = useCallback((profileKey: SPProfileKey) => {
    const profile = SP_PROFILES[profileKey];
    if (!profile) return;
    setActiveProfile(profileKey);
    setFields(createSPSubstitutionFields(profile));
  }, []);

  const updateField = useCallback((fieldId: string, newValue: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, currentValue: newValue } : f))
    );
  }, []);

  const resetToOriginal = useCallback(() => {
    setFields(createSPSubstitutionFields(GIOVANNE_PROFILE));
    setActiveProfile("giovanne");
    setBrasaoUrl("");
  }, []);

  const handleBrasaoUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setBrasaoUrl(url);
  }, []);

  return {
    fields,
    fieldMap,
    activeProfile,
    modifiedCount,
    currentGrades,
    brasaoUrl,
    applyProfile,
    updateField,
    resetToOriginal,
    handleBrasaoUpload,
  };
}

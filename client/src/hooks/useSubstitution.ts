import { useState, useCallback, useMemo } from "react";
import {
  LINDOMAR_PROFILE,
  PROFILES,
  createSubstitutionFields,
  type SubstitutionField,
  type ProfileKey,
} from "@/lib/documentData";

export function useSubstitution() {
  const [activeProfile, setActiveProfile] = useState<ProfileKey>("lindomar");
  const [fields, setFields] = useState<SubstitutionField[]>(
    createSubstitutionFields(LINDOMAR_PROFILE)
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

  const applyProfile = useCallback((profileKey: ProfileKey) => {
    const profile = PROFILES[profileKey];
    if (!profile) return;
    setActiveProfile(profileKey);
    setFields(createSubstitutionFields(profile));
  }, []);

  const updateField = useCallback((fieldId: string, newValue: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, currentValue: newValue } : f))
    );
  }, []);

  const resetToOriginal = useCallback(() => {
    setFields(createSubstitutionFields(LINDOMAR_PROFILE));
    setActiveProfile("lindomar");
  }, []);

  return {
    fields,
    fieldMap,
    activeProfile,
    modifiedCount,
    applyProfile,
    updateField,
    resetToOriginal,
  };
}

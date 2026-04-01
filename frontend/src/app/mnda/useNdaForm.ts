"use client";

import { useState, useEffect, useCallback } from "react";
import { MndaFormData, PartyInfo, DEFAULT_FORM_DATA } from "./types";

const STORAGE_KEY = "mnda_form_v1";

function loadFromStorage(): MndaFormData {
  if (typeof window === "undefined") return DEFAULT_FORM_DATA;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_FORM_DATA,
        ...parsed,
        party1: { ...DEFAULT_FORM_DATA.party1, ...(parsed.party1 ?? {}) },
        party2: { ...DEFAULT_FORM_DATA.party2, ...(parsed.party2 ?? {}) },
      };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_FORM_DATA;
}

export function useNdaForm() {
  const [formData, setFormData] = useState<MndaFormData>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore quota errors
    }
  }, [formData]);

  const updateField = useCallback(
    <K extends keyof MndaFormData>(field: K, value: MndaFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateParty = useCallback(
    (party: "party1" | "party2", field: keyof PartyInfo, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [party]: { ...prev[party], [field]: value },
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { formData, updateField, updateParty, reset };
}

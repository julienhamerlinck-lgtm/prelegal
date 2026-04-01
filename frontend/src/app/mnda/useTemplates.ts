"use client";

import { useState, useEffect, useRef } from "react";

interface Templates {
  coverPage: string;
  standardTerms: string;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Templates | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    Promise.all([
      fetch("/templates/Mutual-NDA-coverpage.md").then((r) => r.text()),
      fetch("/templates/Mutual-NDA.md").then((r) => r.text()),
    ])
      .then(([coverPage, standardTerms]) => {
        setTemplates({ coverPage, standardTerms });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { templates, loading };
}

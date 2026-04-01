"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { NdaPdfDocument } from "./NdaPdfDocument";
import { MndaFormData } from "./types";

interface PdfDownloadButtonProps {
  formData: MndaFormData;
}

export function PdfDownloadButton({ formData }: PdfDownloadButtonProps) {
  const filename = [
    "Mutual-NDA",
    formData.party1.company,
    formData.party2.company,
  ]
    .filter(Boolean)
    .join("-")
    .replace(/\s+/g, "-");

  return (
    <PDFDownloadLink
      document={<NdaPdfDocument formData={formData} />}
      fileName={`${filename}.pdf`}
      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
}

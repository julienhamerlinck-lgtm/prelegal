"use client";

import dynamic from "next/dynamic";
import { useNdaForm } from "./mnda/useNdaForm";
import { useTemplates } from "./mnda/useTemplates";
import { NdaForm } from "./mnda/NdaForm";
import { NdaPreview } from "./mnda/NdaPreview";

const PdfDownloadButton = dynamic(
  () =>
    import("./mnda/PdfDownloadButton").then((mod) => ({
      default: mod.PdfDownloadButton,
    })),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex items-center rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-500">
        Preparing PDF...
      </span>
    ),
  }
);

export default function Home() {
  const { formData, updateField, updateParty, reset } = useNdaForm();
  const { templates, loading } = useTemplates();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">
          Mutual NDA Creator
        </h1>
        <PdfDownloadButton formData={formData} />
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className="w-[420px] shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <NdaForm
            formData={formData}
            updateField={updateField}
            updateParty={updateParty}
            onReset={reset}
          />
        </div>

        {/* Preview panel */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading templates...
            </div>
          ) : templates ? (
            <NdaPreview
              formData={formData}
              coverPageTemplate={templates.coverPage}
              standardTermsTemplate={templates.standardTerms}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-red-500">
              Failed to load templates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

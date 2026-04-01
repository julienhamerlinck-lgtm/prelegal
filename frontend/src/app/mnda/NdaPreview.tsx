"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { MndaFormData } from "./types";
import { substituteCoverPage, substituteStandardTerms } from "./templateEngine";

interface NdaPreviewProps {
  formData: MndaFormData;
  coverPageTemplate: string;
  standardTermsTemplate: string;
}

export function NdaPreview({
  formData,
  coverPageTemplate,
  standardTermsTemplate,
}: NdaPreviewProps) {
  const coverPageMd = useMemo(
    () => substituteCoverPage(coverPageTemplate, formData),
    [coverPageTemplate, formData]
  );

  const standardTermsMd = useMemo(
    () => substituteStandardTerms(standardTermsTemplate, formData),
    [standardTermsTemplate, formData]
  );

  return (
    <div className="bg-white shadow-lg mx-auto max-w-[800px] p-10 min-h-full">
      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-table:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {coverPageMd}
        </ReactMarkdown>

        <hr className="my-8 border-gray-300" />

        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {standardTermsMd}
        </ReactMarkdown>
      </div>
    </div>
  );
}

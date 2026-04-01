"use client";

import { MndaFormData, PartyInfo } from "./types";

interface NdaFormProps {
  formData: MndaFormData;
  updateField: <K extends keyof MndaFormData>(
    field: K,
    value: MndaFormData[K]
  ) => void;
  updateParty: (
    party: "party1" | "party2",
    field: keyof PartyInfo,
    value: string
  ) => void;
  onReset: () => void;
}

export function NdaForm({
  formData,
  updateField,
  updateParty,
  onReset,
}: NdaFormProps) {
  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">NDA Details</h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset
        </button>
      </div>

      {/* Purpose */}
      <fieldset>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Purpose
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => updateField("purpose", e.target.value)}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </fieldset>

      {/* Effective Date */}
      <fieldset>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Effective Date
        </label>
        <input
          type="date"
          value={formData.effectiveDate}
          onChange={(e) => updateField("effectiveDate", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </fieldset>

      {/* MNDA Term */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          MNDA Term
        </legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermMode"
              checked={formData.mndaTermMode === "fixed"}
              onChange={() => updateField("mndaTermMode", "fixed")}
              className="text-blue-600"
            />
            Expires after
            <input
              type="number"
              min="1"
              value={formData.mndaTermYears}
              onChange={(e) => updateField("mndaTermYears", e.target.value)}
              disabled={formData.mndaTermMode !== "fixed"}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
            />
            year(s)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermMode"
              checked={formData.mndaTermMode === "until_terminated"}
              onChange={() => updateField("mndaTermMode", "until_terminated")}
              className="text-blue-600"
            />
            Continues until terminated
          </label>
        </div>
      </fieldset>

      {/* Term of Confidentiality */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Term of Confidentiality
        </legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermMode"
              checked={formData.confidentialityTermMode === "fixed"}
              onChange={() =>
                updateField("confidentialityTermMode", "fixed")
              }
              className="text-blue-600"
            />
            <input
              type="number"
              min="1"
              value={formData.confidentialityTermYears}
              onChange={(e) =>
                updateField("confidentialityTermYears", e.target.value)
              }
              disabled={formData.confidentialityTermMode !== "fixed"}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
            />
            year(s) from Effective Date
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermMode"
              checked={formData.confidentialityTermMode === "perpetual"}
              onChange={() =>
                updateField("confidentialityTermMode", "perpetual")
              }
              className="text-blue-600"
            />
            In perpetuity
          </label>
        </div>
      </fieldset>

      {/* Governing Law & Jurisdiction */}
      <fieldset>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Governing Law (State)
        </label>
        <input
          type="text"
          value={formData.governingLaw}
          onChange={(e) => updateField("governingLaw", e.target.value)}
          placeholder="e.g. Delaware"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </fieldset>

      <fieldset>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jurisdiction
        </label>
        <input
          type="text"
          value={formData.jurisdiction}
          onChange={(e) => updateField("jurisdiction", e.target.value)}
          placeholder='e.g. courts located in New Castle, DE'
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </fieldset>

      {/* Party 1 */}
      <PartyFields
        label="Party 1"
        party={formData.party1}
        onChange={(field, value) => updateParty("party1", field, value)}
      />

      {/* Party 2 */}
      <PartyFields
        label="Party 2"
        party={formData.party2}
        onChange={(field, value) => updateParty("party2", field, value)}
      />

      {/* Modifications */}
      <fieldset>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          MNDA Modifications
        </label>
        <textarea
          value={formData.modifications}
          onChange={(e) => updateField("modifications", e.target.value)}
          rows={3}
          placeholder="List any modifications to the MNDA (optional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </fieldset>
    </div>
  );
}

function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (field: keyof PartyInfo, value: string) => void;
}) {
  return (
    <fieldset className="space-y-3 border border-gray-200 rounded-lg p-4">
      <legend className="text-sm font-medium text-gray-700 px-1">
        {label}
      </legend>
      <input
        type="text"
        value={party.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Print Name"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="text"
        value={party.title}
        onChange={(e) => onChange("title", e.target.value)}
        placeholder="Title"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="text"
        value={party.company}
        onChange={(e) => onChange("company", e.target.value)}
        placeholder="Company"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="text"
        value={party.noticeAddress}
        onChange={(e) => onChange("noticeAddress", e.target.value)}
        placeholder="Notice Address (email or postal)"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </fieldset>
  );
}

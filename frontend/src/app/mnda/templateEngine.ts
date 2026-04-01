import { MndaFormData } from "./types";
import { format, parseISO } from "date-fns";

export interface FieldMap {
  Purpose: string;
  "Effective Date": string;
  "MNDA Term": string;
  "Term of Confidentiality": string;
  "Governing Law": string;
  Jurisdiction: string;
}

export function buildFieldMap(data: MndaFormData): FieldMap {
  const formattedDate = data.effectiveDate
    ? format(parseISO(data.effectiveDate), "MMMM d, yyyy")
    : "[Today's date]";

  const mndaTerm =
    data.mndaTermMode === "fixed"
      ? `${data.mndaTermYears} year(s)`
      : "until terminated";

  const confidentialityTerm =
    data.confidentialityTermMode === "fixed"
      ? `${data.confidentialityTermYears} year(s)`
      : "perpetuity";

  return {
    Purpose: data.purpose || "[Purpose]",
    "Effective Date": formattedDate,
    "MNDA Term": mndaTerm,
    "Term of Confidentiality": confidentialityTerm,
    "Governing Law": data.governingLaw || "[State]",
    Jurisdiction: data.jurisdiction || "[Jurisdiction]",
  };
}

export function substituteStandardTerms(
  template: string,
  data: MndaFormData
): string {
  const fieldMap = buildFieldMap(data);

  return template.replace(
    /<span class="coverpage_link">([^<]+)<\/span>/g,
    (_, fieldName: string) => {
      const value = fieldMap[fieldName as keyof FieldMap];
      return value !== undefined ? `**${value}**` : fieldName;
    }
  );
}

export function substituteCoverPage(
  template: string,
  data: MndaFormData
): string {
  const fieldMap = buildFieldMap(data);
  let result = template;

  // Purpose
  result = result.replace(
    "[Evaluating whether to enter into a business relationship with the other party.]",
    fieldMap.Purpose
  );

  // Effective Date
  result = result.replace("[Today's date]", fieldMap["Effective Date"]);

  // MNDA Term section — replace checkboxes and year value
  if (data.mndaTermMode === "fixed") {
    result = result.replace(
      /- \[x\]\s+Expires \[1 year\(s\)\] from Effective Date\./,
      `- [x]     Expires ${data.mndaTermYears} year(s) from Effective Date.`
    );
    // Keep "until terminated" unchecked (already is)
  } else {
    result = result.replace("- [x]     Expires", "- [ ]     Expires");
    result = result.replace(
      "- [ ]     Continues until terminated",
      "- [x]     Continues until terminated"
    );
  }

  // Term of Confidentiality section
  if (data.confidentialityTermMode === "fixed") {
    result = result.replace(
      /- \[x\]\s+\[1 year\(s\)\] from Effective Date/,
      `- [x]     ${data.confidentialityTermYears} year(s) from Effective Date`
    );
    // Keep "perpetuity" unchecked (already is)
  } else {
    // Find the confidentiality section's checked item and uncheck it
    // The second [x] in the file is the confidentiality one
    const lines = result.split("\n");
    let checkboxCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^- \[x\]/)) {
        checkboxCount++;
        if (checkboxCount === 2) {
          lines[i] = lines[i].replace("- [x]", "- [ ]");
        }
      }
    }
    // Find the "In perpetuity" unchecked box and check it
    let uncheckedCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^- \[ \]/) && lines[i].includes("perpetuity")) {
        uncheckedCount++;
        lines[i] = lines[i].replace("- [ ]", "- [x]");
        break;
      }
    }
    result = lines.join("\n");
  }

  // Governing Law
  result = result.replace("[Fill in state]", fieldMap["Governing Law"]);

  // Jurisdiction
  result = result.replace(
    '[Fill in city or county and state, i.e. "courts located in New Castle, DE"]',
    fieldMap.Jurisdiction
  );

  // Party signature table
  result = result.replace(
    /\|\| PARTY 1 \| PARTY 2 \|[\s\S]*?\| Date \| \| \|/,
    buildPartyTable(data)
  );

  return result;
}

function buildPartyTable(data: MndaFormData): string {
  const p1 = data.party1;
  const p2 = data.party2;
  const rows = [
    `|| PARTY 1 | PARTY 2 |`,
    `|:--- | :----: | :----: |`,
    `| Signature | | |`,
    `| Print Name | ${p1.name || "___"} | ${p2.name || "___"} |`,
    `| Title | ${p1.title || "___"} | ${p2.title || "___"} |`,
    `| Company | ${p1.company || "___"} | ${p2.company || "___"} |`,
    `| Notice Address | ${p1.noticeAddress || "___"} | ${p2.noticeAddress || "___"} |`,
    `| Date | | |`,
  ];
  return rows.join("\n");
}

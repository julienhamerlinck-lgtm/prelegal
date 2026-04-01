"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { MndaFormData } from "./types";
import { buildFieldMap, FieldMap } from "./templateEngine";
import { format, parseISO } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    color: "#666",
    marginBottom: 2,
  },
  text: {
    marginBottom: 6,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  checkbox: {
    marginBottom: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 20,
  },
  table: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
  },
  tableCellLabel: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  sectionNumber: {
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

interface NdaPdfDocumentProps {
  formData: MndaFormData;
}

export function NdaPdfDocument({ formData }: NdaPdfDocumentProps) {
  const fieldMap = buildFieldMap(formData);
  const p1 = formData.party1;
  const p2 = formData.party2;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>

        <Text style={styles.text}>
          This Mutual Non-Disclosure Agreement (the &quot;MNDA&quot;) consists
          of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard
          Terms Version 1.0.
        </Text>

        <Text style={styles.sectionTitle}>Purpose</Text>
        <Text style={[styles.label]}>
          How Confidential Information may be used
        </Text>
        <Text style={styles.text}>{fieldMap.Purpose}</Text>

        <Text style={styles.sectionTitle}>Effective Date</Text>
        <Text style={styles.text}>{fieldMap["Effective Date"]}</Text>

        <Text style={styles.sectionTitle}>MNDA Term</Text>
        <Text style={[styles.label]}>The length of this MNDA</Text>
        <Text style={styles.checkbox}>
          {formData.mndaTermMode === "fixed" ? "[x]" : "[ ]"} Expires{" "}
          {formData.mndaTermYears} year(s) from Effective Date.
        </Text>
        <Text style={styles.checkbox}>
          {formData.mndaTermMode === "until_terminated" ? "[x]" : "[ ]"}{" "}
          Continues until terminated in accordance with the terms of the MNDA.
        </Text>

        <Text style={styles.sectionTitle}>Term of Confidentiality</Text>
        <Text style={[styles.label]}>
          How long Confidential Information is protected
        </Text>
        <Text style={styles.checkbox}>
          {formData.confidentialityTermMode === "fixed" ? "[x]" : "[ ]"}{" "}
          {formData.confidentialityTermYears} year(s) from Effective Date, but
          in the case of trade secrets until Confidential Information is no
          longer considered a trade secret under applicable laws.
        </Text>
        <Text style={styles.checkbox}>
          {formData.confidentialityTermMode === "perpetual" ? "[x]" : "[ ]"} In
          perpetuity.
        </Text>

        <Text style={styles.sectionTitle}>
          Governing Law &amp; Jurisdiction
        </Text>
        <Text style={styles.text}>
          Governing Law: {fieldMap["Governing Law"]}
        </Text>
        <Text style={styles.text}>
          Jurisdiction: {fieldMap.Jurisdiction}
        </Text>

        {formData.modifications ? (
          <>
            <Text style={styles.sectionTitle}>MNDA Modifications</Text>
            <Text style={styles.text}>{formData.modifications}</Text>
          </>
        ) : null}

        <Text style={[styles.text, { marginTop: 12 }]}>
          By signing this Cover Page, each party agrees to enter into this MNDA
          as of the Effective Date.
        </Text>

        {/* Signature Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellLabel}></Text>
            <Text style={styles.tableCellLabel}>PARTY 1</Text>
            <Text style={styles.tableCellLabel}>PARTY 2</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Signature</Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Print Name</Text>
            <Text style={styles.tableCell}>{p1.name || "___"}</Text>
            <Text style={styles.tableCell}>{p2.name || "___"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Title</Text>
            <Text style={styles.tableCell}>{p1.title || "___"}</Text>
            <Text style={styles.tableCell}>{p2.title || "___"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Company</Text>
            <Text style={styles.tableCell}>{p1.company || "___"}</Text>
            <Text style={styles.tableCell}>{p2.company || "___"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Notice Address</Text>
            <Text style={styles.tableCell}>
              {p1.noticeAddress || "___"}
            </Text>
            <Text style={styles.tableCell}>
              {p2.noticeAddress || "___"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Date</Text>
            <Text style={styles.tableCell}>
              {formData.effectiveDate
                ? format(parseISO(formData.effectiveDate), "MMMM d, yyyy")
                : ""}
            </Text>
            <Text style={styles.tableCell}>
              {formData.effectiveDate
                ? format(parseISO(formData.effectiveDate), "MMMM d, yyyy")
                : ""}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) — CC BY 4.0
        </Text>
      </Page>

      {/* Standard Terms */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Standard Terms</Text>

        <StandardTermsSection
          number="1"
          title="Introduction"
          fieldMap={fieldMap}
        >
          {`This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) ("MNDA") allows each party ("Disclosing Party") to disclose or make available information in connection with the ${fieldMap.Purpose} which (1) the Disclosing Party identifies to the receiving party ("Receiving Party") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("Cover Page"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.`}
        </StandardTermsSection>

        <StandardTermsSection number="2" title="Use and Protection of Confidential Information" fieldMap={fieldMap}>
          {`The Receiving Party shall: (a) use Confidential Information solely for the ${fieldMap.Purpose}; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the ${fieldMap.Purpose}, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.`}
        </StandardTermsSection>

        <StandardTermsSection number="3" title="Exceptions" fieldMap={fieldMap}>
          {`The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.`}
        </StandardTermsSection>

        <StandardTermsSection number="4" title="Disclosures Required by Law" fieldMap={fieldMap}>
          {`The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.`}
        </StandardTermsSection>

        <StandardTermsSection number="5" title="Term and Termination" fieldMap={fieldMap}>
          {`This MNDA commences on the ${fieldMap["Effective Date"]} and expires at the end of the ${fieldMap["MNDA Term"]}. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the ${fieldMap["Term of Confidentiality"]}, despite any expiration or termination of this MNDA.`}
        </StandardTermsSection>

        <StandardTermsSection number="6" title="Return or Destruction of Confidential Information" fieldMap={fieldMap}>
          {`Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.`}
        </StandardTermsSection>

        <StandardTermsSection number="7" title="Proprietary Rights" fieldMap={fieldMap}>
          {`The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.`}
        </StandardTermsSection>

        <StandardTermsSection number="8" title="Disclaimer" fieldMap={fieldMap}>
          {`ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.`}
        </StandardTermsSection>

        <StandardTermsSection number="9" title="Governing Law and Jurisdiction" fieldMap={fieldMap}>
          {`This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${fieldMap["Governing Law"]}, without regard to the conflict of laws provisions of such ${fieldMap["Governing Law"]}. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${fieldMap.Jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such ${fieldMap.Jurisdiction} in any such suit, action, or proceeding.`}
        </StandardTermsSection>

        <StandardTermsSection number="10" title="Equitable Relief" fieldMap={fieldMap}>
          {`A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.`}
        </StandardTermsSection>

        <StandardTermsSection number="11" title="General" fieldMap={fieldMap}>
          {`Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.`}
        </StandardTermsSection>

        <Text style={[styles.footer]}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) — CC BY 4.0
        </Text>
      </Page>
    </Document>
  );
}

function StandardTermsSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: string;
  fieldMap: FieldMap;
}) {
  return (
    <View style={{ marginBottom: 6 }} wrap={false}>
      <Text style={styles.paragraph}>
        <Text style={styles.sectionNumber}>
          {number}. {title}.{" "}
        </Text>
        {children}
      </Text>
    </View>
  );
}

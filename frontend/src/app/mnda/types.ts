export type MndaTermMode = "fixed" | "until_terminated";
export type ConfidentialityTermMode = "fixed" | "perpetual";

export interface PartyInfo {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export interface MndaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermMode: MndaTermMode;
  mndaTermYears: string;
  confidentialityTermMode: ConfidentialityTermMode;
  confidentialityTermYears: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyInfo;
  party2: PartyInfo;
}

export const DEFAULT_FORM_DATA: MndaFormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermMode: "fixed",
  mndaTermYears: "1",
  confidentialityTermMode: "fixed",
  confidentialityTermYears: "1",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { name: "", title: "", company: "", noticeAddress: "" },
  party2: { name: "", title: "", company: "", noticeAddress: "" },
};

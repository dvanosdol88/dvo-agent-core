export declare const HANDOFF_REPORT_SECTION_ORDER: readonly ["QUESTION", "CLAIMS", "EVIDENCE", "WHAT I VERIFIED", "WHAT I DID NOT VERIFY", "RISKS", "RECOMMENDATION", "ASK FOR CODEX"];
export type HandoffReportSection = (typeof HANDOFF_REPORT_SECTION_ORDER)[number];
export interface HandoffReportInput {
    title: string;
    question: string;
    claims?: string[];
    evidence?: string[];
    verified?: string[];
    notVerified?: string[];
    risks?: string[];
    recommendation: string;
    askForCodex: string;
}
export interface NormalizedHandoffReport {
    title: string;
    question: string;
    claims: string[];
    evidence: string[];
    verified: string[];
    notVerified: string[];
    risks: string[];
    recommendation: string;
    askForCodex: string;
}
export declare function normalizeHandoffReport(input: HandoffReportInput): NormalizedHandoffReport;
export declare function buildHandoffReportMarkdown(input: HandoffReportInput): string;
export declare function slugifyReportTopic(topic: string): string;

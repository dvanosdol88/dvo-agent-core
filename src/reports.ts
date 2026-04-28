export const HANDOFF_REPORT_SECTION_ORDER = [
  "QUESTION",
  "CLAIMS",
  "EVIDENCE",
  "WHAT I VERIFIED",
  "WHAT I DID NOT VERIFY",
  "RISKS",
  "RECOMMENDATION",
  "ASK FOR CODEX",
] as const;

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

const EMPTY_PLACEHOLDER = "None provided.";

function normalizeList(values: string[] | undefined): string[] {
  const cleaned = (values ?? []).map((value) => value.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : [EMPTY_PLACEHOLDER];
}

export function normalizeHandoffReport(input: HandoffReportInput): NormalizedHandoffReport {
  return {
    title: input.title.trim(),
    question: input.question.trim(),
    claims: normalizeList(input.claims),
    evidence: normalizeList(input.evidence),
    verified: normalizeList(input.verified),
    notVerified: normalizeList(input.notVerified),
    risks: normalizeList(input.risks),
    recommendation: input.recommendation.trim(),
    askForCodex: input.askForCodex.trim(),
  };
}

function renderList(values: string[]): string {
  return values.map((value) => `- ${value}`).join("\n");
}

export function buildHandoffReportMarkdown(input: HandoffReportInput): string {
  const report = normalizeHandoffReport(input);
  const sections: Record<HandoffReportSection, string> = {
    QUESTION: report.question,
    CLAIMS: renderList(report.claims),
    EVIDENCE: renderList(report.evidence),
    "WHAT I VERIFIED": renderList(report.verified),
    "WHAT I DID NOT VERIFY": renderList(report.notVerified),
    RISKS: renderList(report.risks),
    RECOMMENDATION: report.recommendation,
    "ASK FOR CODEX": report.askForCodex,
  };

  return [
    `# ${report.title || "Agent Handoff Report"}`,
    "",
    ...HANDOFF_REPORT_SECTION_ORDER.flatMap((section) => [
      `## ${section}`,
      sections[section],
      "",
    ]),
  ]
    .join("\n")
    .trimEnd();
}

export function slugifyReportTopic(topic: string): string {
  const slug = topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "agent-report";
}


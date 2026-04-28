export const HANDOFF_REPORT_SECTION_ORDER = [
    "QUESTION",
    "CLAIMS",
    "EVIDENCE",
    "WHAT I VERIFIED",
    "WHAT I DID NOT VERIFY",
    "RISKS",
    "RECOMMENDATION",
    "ASK FOR CODEX",
];
const EMPTY_PLACEHOLDER = "None provided.";
function normalizeList(values) {
    const cleaned = (values ?? []).map((value) => value.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : [EMPTY_PLACEHOLDER];
}
export function normalizeHandoffReport(input) {
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
function renderList(values) {
    return values.map((value) => `- ${value}`).join("\n");
}
export function buildHandoffReportMarkdown(input) {
    const report = normalizeHandoffReport(input);
    const sections = {
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
export function slugifyReportTopic(topic) {
    const slug = topic
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slug || "agent-report";
}

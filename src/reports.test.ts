import test from "node:test";
import assert from "node:assert/strict";
import {
  HANDOFF_REPORT_SECTION_ORDER,
  buildHandoffReportMarkdown,
  normalizeHandoffReport,
  slugifyReportTopic,
  type HandoffReportInput,
} from "./index.js";

test("buildHandoffReportMarkdown renders every required section in canonical order", () => {
  const input: HandoffReportInput = {
    title: "OpenMemory Assessment",
    question: "Is OpenMemory current, properly scoped, and worthwhile?",
    claims: ["OpenMemory is the shared durable memory layer."],
    evidence: ["D:\\AGENTS.md section 11 defines the operating standard."],
    verified: ["Confirmed the local endpoint is documented."],
    notVerified: ["Did not inspect the running container."],
    risks: ["Stale memories can mislead future agents."],
    recommendation: "Keep OpenMemory, but verify health before expanding it.",
    askForCodex: "Verify current runtime health and repo scope.",
  };

  const markdown = buildHandoffReportMarkdown(input);
  const headings = markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^## /, ""));

  assert.deepEqual(headings, HANDOFF_REPORT_SECTION_ORDER);
  assert.match(markdown, /^# OpenMemory Assessment/m);
  assert.match(markdown, /- OpenMemory is the shared durable memory layer\./);
  assert.match(markdown, /Verify current runtime health and repo scope\./);
});

test("normalizeHandoffReport fills empty required report fields with explicit placeholders", () => {
  const normalized = normalizeHandoffReport({
    title: "Thin Report",
    question: "What should happen?",
    recommendation: "Proceed carefully.",
    askForCodex: "Verify the claim.",
  });

  assert.deepEqual(normalized.claims, ["None provided."]);
  assert.deepEqual(normalized.evidence, ["None provided."]);
  assert.deepEqual(normalized.verified, ["None provided."]);
  assert.deepEqual(normalized.notVerified, ["None provided."]);
  assert.deepEqual(normalized.risks, ["None provided."]);
});

test("slugifyReportTopic creates filesystem-safe lowercase slugs", () => {
  assert.equal(slugifyReportTopic("OpenMemory: Scope & Health?"), "openmemory-scope-health");
  assert.equal(slugifyReportTopic("   "), "agent-report");
});


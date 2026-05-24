import test from "node:test";
import assert from "node:assert/strict";
import {
  IMPLEMENTATION_REQUEST_TOOL_CONTRACTS,
  buildImplementationHandoffMarkdown,
  buildImplementationRequest,
  buildImplementationResult,
  getImplementationRequestToolContract,
} from "./index.js";

test("implementation request contracts expose bounded lifecycle tools", () => {
  assert.deepEqual(
    IMPLEMENTATION_REQUEST_TOOL_CONTRACTS.map((contract) => contract.name),
    [
      "create_implementation_request",
      "update_implementation_request_status",
      "record_implementation_result",
    ],
  );
});

test("create_implementation_request requires scope and verification fields", () => {
  const contract = getImplementationRequestToolContract("create_implementation_request");

  assert.deepEqual(contract?.inputSchema.required, [
    "title",
    "objective",
    "scope",
    "acceptanceCriteria",
    "verificationPlan",
  ]);
  assert.equal(contract?.inputSchema.additionalProperties, false);
});

test("buildImplementationRequest applies bounded defaults", () => {
  const request = buildImplementationRequest({
    id: "impl-1",
    originAgent: "cto",
    targetAgent: "codex",
    title: "  Add health check  ",
    objective: "Expose a bounded health check.",
    scope: [{ repo: "dvo88-command-center", paths: ["server/routes.ts"] }],
    outOfScope: ["Do not change auth."],
    acceptanceCriteria: ["Health endpoint returns ok."],
    verificationPlan: [
      {
        kind: "build",
        command: "npm run build",
        expected: "Build succeeds.",
      },
    ],
    createdAt: new Date("2026-05-24T12:00:00.000Z"),
  });

  assert.equal(request.title, "Add health check");
  assert.equal(request.status, "proposed");
  assert.equal(request.riskLevel, "medium");
  assert.equal(request.requiresApproval, true);
  assert.equal(request.createdAt, "2026-05-24T12:00:00.000Z");
  assert.equal(request.updatedAt, "2026-05-24T12:00:00.000Z");
});

test("buildImplementationResult stores external verification evidence", () => {
  const result = buildImplementationResult({
    id: "result-1",
    requestId: "impl-1",
    summary: "Implemented and built locally.",
    implementedBy: "codex",
    changedRefs: ["commit abc123"],
    verificationEvidence: [
      {
        kind: "report",
        summary: "npm run build passed.",
      },
    ],
  });

  assert.equal(result.status, "implemented");
  assert.equal(result.changedRefs[0], "commit abc123");
  assert.match(result.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("buildImplementationHandoffMarkdown renders a developer-ready request", () => {
  const request = buildImplementationRequest({
    id: "impl-2",
    originAgent: "ria-chief",
    targetAgent: "claude",
    title: "RIA Chief work request",
    objective: "Create a scoped implementation request.",
    scope: [{ repo: "RIA-builder", paths: ["functions-branch-api/src/tools"] }],
    acceptanceCriteria: ["Request is visible in the sidebar."],
    verificationPlan: [
      {
        kind: "production_smoke",
        target: "riabuilder.dvo88.com",
        expected: "Existing chat behavior still works.",
      },
    ],
  });

  const markdown = buildImplementationHandoffMarkdown(request);

  assert.match(markdown, /^# RIA Chief work request/);
  assert.match(markdown, /Target: claude/);
  assert.match(markdown, /RIA-builder \[functions-branch-api\/src\/tools\]/);
  assert.match(markdown, /production_smoke \(riabuilder\.dvo88\.com\) -> Existing chat behavior still works\./);
});

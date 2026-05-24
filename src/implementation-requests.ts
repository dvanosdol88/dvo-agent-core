import type { ToolContract } from "./tools.js";

export type ExecutionAgentTarget = "codex" | "claude" | "gemini" | "manual" | string;

export type ImplementationRequestOrigin = "cto" | "ria-chief" | string;

export type ImplementationRiskLevel = "low" | "medium" | "high" | string;

export type ImplementationRequestStatus =
  | "proposed"
  | "approved"
  | "in_progress"
  | "implemented"
  | "verified"
  | "closed"
  | "blocked"
  | "cancelled"
  | string;

export interface RepoWorkScope {
  repo: string;
  paths?: string[];
  branch?: string;
  publicSurface?: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationRequirement {
  kind: "test" | "build" | "auth_boundary" | "production_smoke" | "manual_review" | string;
  command?: string;
  target?: string;
  expected: string;
  required?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ImplementationRequestEvidence {
  kind: "operator_statement" | "assistant_analysis" | "repo_context" | "report" | "manual" | string;
  summary: string;
  sourceRef?: string;
  observedAt?: string | number;
  metadata?: Record<string, unknown>;
}

export interface AgentImplementationRequest {
  id: string;
  originAgent: ImplementationRequestOrigin;
  targetAgent: ExecutionAgentTarget;
  status: ImplementationRequestStatus;
  title: string;
  objective: string;
  scope: RepoWorkScope[];
  outOfScope: string[];
  acceptanceCriteria: string[];
  verificationPlan: VerificationRequirement[];
  riskLevel: ImplementationRiskLevel;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  threadId?: string;
  sourceRef?: string;
  actionReceiptId?: string;
  evidence?: ImplementationRequestEvidence[];
  metadata?: Record<string, unknown>;
}

export interface ImplementationResult {
  id: string;
  requestId: string;
  status: ImplementationRequestStatus;
  summary: string;
  implementedBy: ExecutionAgentTarget;
  changedRefs: string[];
  verificationEvidence: ImplementationRequestEvidence[];
  actionReceiptId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

function toIsoString(value: string | number | Date | undefined): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number") return new Date(value).toISOString();
  if (typeof value === "string" && value.trim()) return value;
  return new Date().toISOString();
}

function cleanList(values: string[] | undefined): string[] {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function renderList(values: string[]): string {
  return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- None specified.";
}

function renderVerificationPlan(values: VerificationRequirement[]): string {
  if (values.length === 0) return "- None specified.";
  return values
    .map((item) => {
      const prefix = item.command ? `${item.kind}: ${item.command}` : item.kind;
      const target = item.target ? ` (${item.target})` : "";
      return `- ${prefix}${target} -> ${item.expected}`;
    })
    .join("\n");
}

function renderScope(scope: RepoWorkScope[]): string {
  if (scope.length === 0) return "- None specified.";
  return scope
    .map((item) => {
      const paths = item.paths?.length ? ` [${item.paths.join(", ")}]` : "";
      const surface = item.publicSurface ? ` (${item.publicSurface})` : "";
      return `- ${item.repo}${paths}${surface}`;
    })
    .join("\n");
}

export function buildImplementationRequest(input: {
  id: string;
  originAgent: ImplementationRequestOrigin;
  targetAgent: ExecutionAgentTarget;
  title: string;
  objective: string;
  scope: RepoWorkScope[];
  outOfScope?: string[];
  acceptanceCriteria: string[];
  verificationPlan: VerificationRequirement[];
  riskLevel?: ImplementationRiskLevel;
  requiresApproval?: boolean;
  status?: ImplementationRequestStatus;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
  createdBy?: string;
  threadId?: string;
  sourceRef?: string;
  actionReceiptId?: string;
  evidence?: ImplementationRequestEvidence[];
  metadata?: Record<string, unknown>;
}): AgentImplementationRequest {
  const createdAt = toIsoString(input.createdAt);
  return {
    id: input.id,
    originAgent: input.originAgent,
    targetAgent: input.targetAgent,
    status: input.status ?? "proposed",
    title: input.title.trim(),
    objective: input.objective.trim(),
    scope: [...input.scope],
    outOfScope: cleanList(input.outOfScope),
    acceptanceCriteria: cleanList(input.acceptanceCriteria),
    verificationPlan: [...input.verificationPlan],
    riskLevel: input.riskLevel ?? "medium",
    requiresApproval: input.requiresApproval ?? true,
    createdAt,
    updatedAt: toIsoString(input.updatedAt ?? createdAt),
    ...(input.createdBy ? { createdBy: input.createdBy } : {}),
    ...(input.threadId ? { threadId: input.threadId } : {}),
    ...(input.sourceRef ? { sourceRef: input.sourceRef } : {}),
    ...(input.actionReceiptId ? { actionReceiptId: input.actionReceiptId } : {}),
    ...(input.evidence ? { evidence: [...input.evidence] } : {}),
    ...(input.metadata ? { metadata: { ...input.metadata } } : {}),
  };
}

export function buildImplementationResult(input: {
  id: string;
  requestId: string;
  status?: ImplementationRequestStatus;
  summary: string;
  implementedBy: ExecutionAgentTarget;
  changedRefs?: string[];
  verificationEvidence: ImplementationRequestEvidence[];
  actionReceiptId?: string;
  createdAt?: string | number | Date;
  metadata?: Record<string, unknown>;
}): ImplementationResult {
  return {
    id: input.id,
    requestId: input.requestId,
    status: input.status ?? "implemented",
    summary: input.summary.trim(),
    implementedBy: input.implementedBy,
    changedRefs: cleanList(input.changedRefs),
    verificationEvidence: [...input.verificationEvidence],
    ...(input.actionReceiptId ? { actionReceiptId: input.actionReceiptId } : {}),
    createdAt: toIsoString(input.createdAt),
    ...(input.metadata ? { metadata: { ...input.metadata } } : {}),
  };
}

export function buildImplementationHandoffMarkdown(input: AgentImplementationRequest): string {
  return [
    `# ${input.title || "Implementation Request"}`,
    "",
    `Status: ${input.status}`,
    `Origin: ${input.originAgent}`,
    `Target: ${input.targetAgent}`,
    `Risk: ${input.riskLevel}`,
    `Approval required: ${input.requiresApproval ? "yes" : "no"}`,
    "",
    "## Objective",
    input.objective || "None specified.",
    "",
    "## Scope",
    renderScope(input.scope),
    "",
    "## Out Of Scope",
    renderList(input.outOfScope),
    "",
    "## Acceptance Criteria",
    renderList(input.acceptanceCriteria),
    "",
    "## Verification Plan",
    renderVerificationPlan(input.verificationPlan),
  ]
    .join("\n")
    .trimEnd();
}

export const CREATE_IMPLEMENTATION_REQUEST_TOOL_CONTRACT: ToolContract = {
  name: "create_implementation_request",
  description:
    "Create a bounded repo-work request for an external execution agent. This only records scope, evidence, and verification requirements; it does not edit files, run shell commands, commit, deploy, or verify production.",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short title for the requested work." },
      objective: { type: "string", description: "What the external execution agent should accomplish." },
      targetAgent: { type: "string", description: "codex, claude, gemini, or manual." },
      scope: { type: "array", description: "Target repos and optional paths/surfaces." },
      outOfScope: { type: "array", description: "Work the execution agent should avoid." },
      acceptanceCriteria: { type: "array", description: "Observable requirements for completion." },
      verificationPlan: { type: "array", description: "Required tests, builds, auth checks, or production smokes." },
      riskLevel: { type: "string", description: "low, medium, or high." },
      requiresApproval: { type: "boolean", description: "Whether David must approve before execution." },
      evidence: { type: "array", description: "Evidence or context supporting this request." },
    },
    required: ["title", "objective", "scope", "acceptanceCriteria", "verificationPlan"],
    additionalProperties: false,
  },
};

export const UPDATE_IMPLEMENTATION_REQUEST_STATUS_TOOL_CONTRACT: ToolContract = {
  name: "update_implementation_request_status",
  description:
    "Update the lifecycle status for an existing implementation request without claiming unverified execution.",
  inputSchema: {
    type: "object",
    properties: {
      requestId: { type: "string", description: "Implementation request ID." },
      status: { type: "string", description: "New lifecycle status." },
      summary: { type: "string", description: "Reason or short status note." },
    },
    required: ["requestId", "status"],
    additionalProperties: false,
  },
};

export const RECORD_IMPLEMENTATION_RESULT_TOOL_CONTRACT: ToolContract = {
  name: "record_implementation_result",
  description:
    "Record implementation and verification evidence produced by an external execution session.",
  inputSchema: {
    type: "object",
    properties: {
      requestId: { type: "string", description: "Implementation request ID." },
      status: { type: "string", description: "implemented, verified, blocked, or closed." },
      summary: { type: "string", description: "What changed or why the request is blocked." },
      implementedBy: { type: "string", description: "Execution agent or operator." },
      changedRefs: { type: "array", description: "Commits, PRs, files, deploys, or URLs touched." },
      verificationEvidence: { type: "array", description: "Verification evidence from tests, builds, or production checks." },
      actionReceiptId: { type: "string", description: "Optional linked action receipt." },
    },
    required: ["requestId", "summary", "implementedBy", "verificationEvidence"],
    additionalProperties: false,
  },
};

export const IMPLEMENTATION_REQUEST_TOOL_CONTRACTS: ToolContract[] = [
  CREATE_IMPLEMENTATION_REQUEST_TOOL_CONTRACT,
  UPDATE_IMPLEMENTATION_REQUEST_STATUS_TOOL_CONTRACT,
  RECORD_IMPLEMENTATION_RESULT_TOOL_CONTRACT,
];

export function getImplementationRequestToolContract(name: string): ToolContract | undefined {
  return IMPLEMENTATION_REQUEST_TOOL_CONTRACTS.find((contract) => contract.name === name);
}

function toIsoString(value) {
    if (value instanceof Date)
        return value.toISOString();
    if (typeof value === "number")
        return new Date(value).toISOString();
    if (typeof value === "string" && value.trim())
        return value;
    return new Date().toISOString();
}
function cleanList(values) {
    return (values ?? []).map((value) => value.trim()).filter(Boolean);
}
function renderList(values) {
    return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- None specified.";
}
function renderVerificationPlan(values) {
    if (values.length === 0)
        return "- None specified.";
    return values
        .map((item) => {
        const prefix = item.command ? `${item.kind}: ${item.command}` : item.kind;
        const target = item.target ? ` (${item.target})` : "";
        return `- ${prefix}${target} -> ${item.expected}`;
    })
        .join("\n");
}
function renderScope(scope) {
    if (scope.length === 0)
        return "- None specified.";
    return scope
        .map((item) => {
        const paths = item.paths?.length ? ` [${item.paths.join(", ")}]` : "";
        const surface = item.publicSurface ? ` (${item.publicSurface})` : "";
        return `- ${item.repo}${paths}${surface}`;
    })
        .join("\n");
}
export function buildImplementationRequest(input) {
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
export function buildImplementationResult(input) {
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
export function buildImplementationHandoffMarkdown(input) {
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
export const CREATE_IMPLEMENTATION_REQUEST_TOOL_CONTRACT = {
    name: "create_implementation_request",
    description: "Create a bounded repo-work request for an external execution agent. This only records scope, evidence, and verification requirements; it does not edit files, run shell commands, commit, deploy, or verify production.",
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
export const UPDATE_IMPLEMENTATION_REQUEST_STATUS_TOOL_CONTRACT = {
    name: "update_implementation_request_status",
    description: "Update the lifecycle status for an existing implementation request without claiming unverified execution.",
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
export const RECORD_IMPLEMENTATION_RESULT_TOOL_CONTRACT = {
    name: "record_implementation_result",
    description: "Record implementation and verification evidence produced by an external execution session.",
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
export const IMPLEMENTATION_REQUEST_TOOL_CONTRACTS = [
    CREATE_IMPLEMENTATION_REQUEST_TOOL_CONTRACT,
    UPDATE_IMPLEMENTATION_REQUEST_STATUS_TOOL_CONTRACT,
    RECORD_IMPLEMENTATION_RESULT_TOOL_CONTRACT,
];
export function getImplementationRequestToolContract(name) {
    return IMPLEMENTATION_REQUEST_TOOL_CONTRACTS.find((contract) => contract.name === name);
}

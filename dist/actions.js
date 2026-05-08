function toIsoString(value) {
    if (value instanceof Date)
        return value.toISOString();
    if (typeof value === "number")
        return new Date(value).toISOString();
    if (typeof value === "string" && value.trim())
        return value;
    return new Date().toISOString();
}
export function buildActionReceipt(input) {
    return {
        id: input.id,
        source: input.source,
        actor: { ...input.actor },
        summary: input.summary.trim(),
        evidence: [...input.evidence],
        affectedItems: [...(input.affectedItems ?? [])],
        proposedUpdates: [...(input.proposedUpdates ?? [])],
        appliedUpdates: [...(input.appliedUpdates ?? [])],
        confidence: input.confidence ?? "needs_review",
        createdAt: toIsoString(input.createdAt),
        ...(input.metadata ? { metadata: { ...input.metadata } } : {}),
    };
}
export function buildSurfaceSyncProposal(input) {
    return {
        id: input.id,
        receiptId: input.receiptId,
        status: input.status,
        reason: input.reason.trim(),
        proposedUpdates: [...input.proposedUpdates],
        appliedUpdates: [...(input.appliedUpdates ?? [])],
        createdAt: toIsoString(input.createdAt),
        ...(input.decidedAt ? { decidedAt: toIsoString(input.decidedAt) } : {}),
        ...(input.metadata ? { metadata: { ...input.metadata } } : {}),
    };
}
export const RECORD_ACTION_RECEIPT_TOOL_CONTRACT = {
    name: "record_action_receipt",
    description: "Record durable evidence that an operator, agent, tool result, report, or repo log changed business or technical state. Concrete writes remain app-owned.",
    inputSchema: {
        type: "object",
        properties: {
            summary: { type: "string", description: "One-line description of the completed action or observed state." },
            evidence: {
                type: "array",
                description: "Evidence entries supporting the receipt, such as operator statements or tool results.",
            },
            affectedItems: {
                type: "array",
                description: "Optional surface item references touched by the action.",
            },
            confidence: {
                type: "string",
                description: "confirmed, inferred, or needs_review.",
            },
        },
        required: ["summary", "evidence"],
        additionalProperties: false,
    },
};
export const PROPOSE_SURFACE_SYNC_TOOL_CONTRACT = {
    name: "propose_surface_sync",
    description: "Describe proposed or applied updates that synchronize a product surface with a recorded action receipt.",
    inputSchema: {
        type: "object",
        properties: {
            receiptId: { type: "string", description: "Action receipt ID this proposal reconciles." },
            reason: { type: "string", description: "Why these surface updates follow from the receipt." },
            proposedUpdates: { type: "array", description: "Surface updates to review or apply." },
            appliedUpdates: { type: "array", description: "Surface updates already applied." },
        },
        required: ["receiptId", "reason", "proposedUpdates"],
        additionalProperties: false,
    },
};
export const ACTION_RECEIPT_TOOL_CONTRACTS = [
    RECORD_ACTION_RECEIPT_TOOL_CONTRACT,
    PROPOSE_SURFACE_SYNC_TOOL_CONTRACT,
];
export function getActionReceiptToolContract(name) {
    return ACTION_RECEIPT_TOOL_CONTRACTS.find((contract) => contract.name === name);
}

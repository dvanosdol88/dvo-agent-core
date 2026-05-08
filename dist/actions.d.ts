import type { ToolContract } from "./tools.js";
export type ActionReceiptSource = "chat" | "tool_result" | "wrap_up" | "telegram" | "repo_log" | "manual" | string;
export type ActionConfidence = "confirmed" | "inferred" | "needs_review" | string;
export interface ActionActor {
    agentId: string;
    userId?: string;
    displayName?: string;
}
export interface SurfaceItemRef {
    surface: string;
    itemType: string;
    itemId: string;
    label?: string;
    collection?: string;
    url?: string;
    metadata?: Record<string, unknown>;
}
export interface ActionEvidence {
    kind: "operator_statement" | "tool_result" | "report" | "repo_log" | "manual" | string;
    summary: string;
    sourceRef?: string;
    observedAt?: string | number;
    metadata?: Record<string, unknown>;
}
export interface SurfaceStateUpdate {
    ref: SurfaceItemRef;
    field: string;
    previousValue?: unknown;
    nextValue: unknown;
    appliedAt?: string | number;
    metadata?: Record<string, unknown>;
}
export interface ActionReceipt {
    id: string;
    source: ActionReceiptSource;
    actor: ActionActor;
    summary: string;
    evidence: ActionEvidence[];
    affectedItems: SurfaceItemRef[];
    proposedUpdates: SurfaceStateUpdate[];
    appliedUpdates: SurfaceStateUpdate[];
    confidence: ActionConfidence;
    createdAt: string;
    metadata?: Record<string, unknown>;
}
export type SurfaceSyncProposalStatus = "proposed" | "applied" | "dismissed" | "needs_review" | string;
export interface SurfaceSyncProposal {
    id: string;
    receiptId: string;
    status: SurfaceSyncProposalStatus;
    reason: string;
    proposedUpdates: SurfaceStateUpdate[];
    appliedUpdates: SurfaceStateUpdate[];
    createdAt: string;
    decidedAt?: string;
    metadata?: Record<string, unknown>;
}
export declare function buildActionReceipt(input: {
    id: string;
    source: ActionReceiptSource;
    actor: ActionActor;
    summary: string;
    evidence: ActionEvidence[];
    affectedItems?: SurfaceItemRef[];
    proposedUpdates?: SurfaceStateUpdate[];
    appliedUpdates?: SurfaceStateUpdate[];
    confidence?: ActionConfidence;
    createdAt?: string | number | Date;
    metadata?: Record<string, unknown>;
}): ActionReceipt;
export declare function buildSurfaceSyncProposal(input: {
    id: string;
    receiptId: string;
    status: SurfaceSyncProposalStatus;
    reason: string;
    proposedUpdates: SurfaceStateUpdate[];
    appliedUpdates?: SurfaceStateUpdate[];
    createdAt?: string | number | Date;
    decidedAt?: string | number | Date;
    metadata?: Record<string, unknown>;
}): SurfaceSyncProposal;
export declare const RECORD_ACTION_RECEIPT_TOOL_CONTRACT: ToolContract;
export declare const PROPOSE_SURFACE_SYNC_TOOL_CONTRACT: ToolContract;
export declare const ACTION_RECEIPT_TOOL_CONTRACTS: ToolContract[];
export declare function getActionReceiptToolContract(name: string): ToolContract | undefined;

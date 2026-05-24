import type { ToolContract } from "./tools.js";
export type ExecutionAgentTarget = "codex" | "claude" | "gemini" | "manual" | string;
export type ImplementationRequestOrigin = "cto" | "ria-chief" | string;
export type ImplementationRiskLevel = "low" | "medium" | "high" | string;
export type ImplementationRequestStatus = "proposed" | "approved" | "in_progress" | "implemented" | "verified" | "closed" | "blocked" | "cancelled" | string;
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
export declare function buildImplementationRequest(input: {
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
}): AgentImplementationRequest;
export declare function buildImplementationResult(input: {
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
}): ImplementationResult;
export declare function buildImplementationHandoffMarkdown(input: AgentImplementationRequest): string;
export declare const CREATE_IMPLEMENTATION_REQUEST_TOOL_CONTRACT: ToolContract;
export declare const UPDATE_IMPLEMENTATION_REQUEST_STATUS_TOOL_CONTRACT: ToolContract;
export declare const RECORD_IMPLEMENTATION_RESULT_TOOL_CONTRACT: ToolContract;
export declare const IMPLEMENTATION_REQUEST_TOOL_CONTRACTS: ToolContract[];
export declare function getImplementationRequestToolContract(name: string): ToolContract | undefined;

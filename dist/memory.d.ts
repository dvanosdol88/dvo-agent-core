import type { ToolContract } from "./tools.js";
export type MemoryLayer = "thread_history" | "operator_profile" | "launch_state" | "launch_milestones" | "canon" | "notes" | "repo_log" | string;
export type MemoryRetrievalToolName = "search_thread_history" | "get_operator_profile" | "get_launch_state" | "list_milestones" | "search_canon";
export interface MemorySearchResult {
    id: string;
    memoryLayer: MemoryLayer;
    source: string;
    snippet: string;
    retrievedBy: MemoryRetrievalToolName | string;
    title?: string;
    role?: "system" | "user" | "assistant" | "tool" | string;
    createdAt?: string | number;
    score?: number;
    metadata?: Record<string, unknown>;
}
export interface MemorySaveReceipt {
    ok: true;
    memoryLayer: MemoryLayer;
    collection: string;
    documentId: string;
    visibleNextTurn: boolean;
    searchableBy: string[];
    summary: string;
    savedAt: string;
}
export declare function buildMemorySaveReceipt(input: {
    memoryLayer: MemoryLayer;
    collection: string;
    documentId: string;
    visibleNextTurn: boolean;
    searchableBy: string[];
    summary: string;
    savedAt?: string | Date;
}): MemorySaveReceipt;
export declare const SEARCH_THREAD_HISTORY_TOOL_CONTRACT: ToolContract;
export declare const GET_OPERATOR_PROFILE_TOOL_CONTRACT: ToolContract;
export declare const GET_LAUNCH_STATE_TOOL_CONTRACT: ToolContract;
export declare const LIST_MILESTONES_TOOL_CONTRACT: ToolContract;
export declare const SEARCH_CANON_TOOL_CONTRACT: ToolContract;
export declare const MEMORY_RETRIEVAL_TOOL_CONTRACTS: ToolContract[];
export declare function getMemoryRetrievalToolContract(name: string): ToolContract | undefined;

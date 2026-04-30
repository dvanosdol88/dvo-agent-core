export function buildMemorySaveReceipt(input) {
    const savedAt = input.savedAt instanceof Date
        ? input.savedAt.toISOString()
        : input.savedAt || new Date().toISOString();
    return {
        ok: true,
        memoryLayer: input.memoryLayer,
        collection: input.collection,
        documentId: input.documentId,
        visibleNextTurn: input.visibleNextTurn,
        searchableBy: [...input.searchableBy],
        summary: input.summary,
        savedAt,
    };
}
export const SEARCH_THREAD_HISTORY_TOOL_CONTRACT = {
    name: "search_thread_history",
    description: "Search older thread messages for prior context that is outside the current model history window. Returns bounded snippets with message IDs and timestamps.",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "Search terms or question to match against older thread messages." },
            limit: { type: "number", description: "Maximum result count. Implementations should clamp this to a safe bound." },
            threadId: {
                type: "string",
                description: "Optional explicit thread ID. Implementations may ignore this and use the active thread.",
            },
        },
        required: ["query"],
        additionalProperties: false,
    },
};
export const GET_OPERATOR_PROFILE_TOOL_CONTRACT = {
    name: "get_operator_profile",
    description: "Read durable high-reuse operator profile facts, such as credentials or profile fields, without injecting every profile detail into every turn.",
    inputSchema: {
        type: "object",
        properties: {
            keys: {
                type: "array",
                description: "Optional profile keys to retrieve. Empty or omitted means return the approved safe summary.",
            },
        },
        additionalProperties: false,
    },
};
export const GET_LAUNCH_STATE_TOOL_CONTRACT = {
    name: "get_launch_state",
    description: "Read the current launch-state summary with last-updated metadata. Use for current operating picture, not historical proof.",
    inputSchema: {
        type: "object",
        properties: {
            fields: { type: "array", description: "Optional launch-state fields to retrieve." },
        },
        additionalProperties: false,
    },
};
export const LIST_MILESTONES_TOOL_CONTRACT = {
    name: "list_milestones",
    description: "List status-tracked launch milestones, optionally filtered by status or domain. Use for durable business-state progress.",
    inputSchema: {
        type: "object",
        properties: {
            status: { type: "string", description: "Optional milestone status filter." },
            domain: { type: "string", description: "Optional domain filter such as compliance, website, or launch." },
            limit: { type: "number", description: "Maximum result count." },
        },
        additionalProperties: false,
    },
};
export const SEARCH_CANON_TOOL_CONTRACT = {
    name: "search_canon",
    description: "Search durable canon entries on demand instead of requiring every canon fact to be injected into every prompt.",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "Search terms or question to match against canon entries." },
            limit: { type: "number", description: "Maximum result count." },
        },
        required: ["query"],
        additionalProperties: false,
    },
};
export const MEMORY_RETRIEVAL_TOOL_CONTRACTS = [
    SEARCH_THREAD_HISTORY_TOOL_CONTRACT,
    GET_OPERATOR_PROFILE_TOOL_CONTRACT,
    GET_LAUNCH_STATE_TOOL_CONTRACT,
    LIST_MILESTONES_TOOL_CONTRACT,
    SEARCH_CANON_TOOL_CONTRACT,
];
export function getMemoryRetrievalToolContract(name) {
    return MEMORY_RETRIEVAL_TOOL_CONTRACTS.find((contract) => contract.name === name);
}

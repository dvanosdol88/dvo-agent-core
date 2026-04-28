export type AgentOwner = "codex" | "claude" | "gemini" | "system" | string;
export interface AgentIdentity {
    id: string;
    displayName: string;
    primarySurface: string;
    ownerAgent: AgentOwner;
    description?: string;
}
export type AgentMessageRole = "system" | "user" | "assistant" | "tool";
export interface AgentThreadMessage {
    id: string;
    role: AgentMessageRole;
    text?: string;
    contentBlocks?: AgentContentBlock[];
    createdAt: string | number;
    agentId?: string;
    threadId?: string;
    status?: "pending" | "complete" | "error";
    provider?: string;
    model?: string;
}
export interface AssistantTextBlock {
    type: "text";
    text: string;
}
export interface ToolUseBlock {
    type: "tool_use";
    id: string;
    name: string;
    input: Record<string, unknown>;
}
export interface ToolResultBlock {
    type: "tool_result";
    tool_use_id: string;
    content: string | Record<string, unknown>;
    is_error?: boolean;
}
export type AgentContentBlock = AssistantTextBlock | ToolUseBlock | ToolResultBlock;
export declare function isAssistantTextBlock(block: AgentContentBlock): block is AssistantTextBlock;

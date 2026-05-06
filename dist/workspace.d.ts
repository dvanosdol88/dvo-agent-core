import type { ToolContract } from "./tools.js";
export type WorkspaceProvider = "google_drive" | "google_docs" | "google_sheets" | "google_slides" | string;
export type WorkspaceToolName = "list_workspace_files" | "search_workspace_files" | "read_workspace_file_text" | "create_workspace_document" | "append_workspace_document" | "create_workspace_folder" | "rename_workspace_file" | "move_workspace_file" | "copy_workspace_file";
export interface WorkspaceFileRef {
    id: string;
    provider: WorkspaceProvider;
    name: string;
    mimeType: string;
    webUrl: string;
    createdAt?: string | number;
    modifiedAt?: string | number;
    ownerDisplayName?: string;
    metadata?: Record<string, unknown>;
}
export interface WorkspaceSearchResult {
    file: WorkspaceFileRef;
    source: WorkspaceProvider;
    retrievedBy: WorkspaceToolName | string;
    snippet?: string;
    score?: number;
    metadata?: Record<string, unknown>;
}
export interface WorkspaceFileReadResult {
    file: WorkspaceFileRef;
    source: WorkspaceProvider;
    retrievedBy: WorkspaceToolName | string;
    text: string;
    truncated: boolean;
    metadata?: Record<string, unknown>;
}
export interface WorkspaceSaveReceipt {
    ok: true;
    provider: WorkspaceProvider;
    action: WorkspaceToolName | string;
    fileId: string;
    webUrl?: string;
    visibleNextTurn: boolean;
    searchableBy: string[];
    summary: string;
    savedAt: string;
}
export declare function buildWorkspaceSaveReceipt(input: {
    provider: WorkspaceProvider;
    action: WorkspaceToolName | string;
    fileId: string;
    webUrl?: string;
    visibleNextTurn: boolean;
    searchableBy: string[];
    summary: string;
    savedAt?: string | Date;
}): WorkspaceSaveReceipt;
export declare const LIST_WORKSPACE_FILES_TOOL_CONTRACT: ToolContract;
export declare const SEARCH_WORKSPACE_FILES_TOOL_CONTRACT: ToolContract;
export declare const READ_WORKSPACE_FILE_TEXT_TOOL_CONTRACT: ToolContract;
export declare const CREATE_WORKSPACE_DOCUMENT_TOOL_CONTRACT: ToolContract;
export declare const APPEND_WORKSPACE_DOCUMENT_TOOL_CONTRACT: ToolContract;
export declare const CREATE_WORKSPACE_FOLDER_TOOL_CONTRACT: ToolContract;
export declare const RENAME_WORKSPACE_FILE_TOOL_CONTRACT: ToolContract;
export declare const MOVE_WORKSPACE_FILE_TOOL_CONTRACT: ToolContract;
export declare const COPY_WORKSPACE_FILE_TOOL_CONTRACT: ToolContract;
export declare const WORKSPACE_TOOL_CONTRACTS: ToolContract[];
export declare function getWorkspaceToolContract(name: string): ToolContract | undefined;

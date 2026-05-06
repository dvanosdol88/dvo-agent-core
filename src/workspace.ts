import type { ToolContract } from "./tools.js";

export type WorkspaceProvider =
  | "google_drive"
  | "google_docs"
  | "google_sheets"
  | "google_slides"
  | string;

export type WorkspaceToolName =
  | "list_workspace_files"
  | "search_workspace_files"
  | "read_workspace_file_text"
  | "create_workspace_document"
  | "append_workspace_document"
  | "create_workspace_folder"
  | "rename_workspace_file"
  | "move_workspace_file"
  | "copy_workspace_file";

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

export function buildWorkspaceSaveReceipt(input: {
  provider: WorkspaceProvider;
  action: WorkspaceToolName | string;
  fileId: string;
  webUrl?: string;
  visibleNextTurn: boolean;
  searchableBy: string[];
  summary: string;
  savedAt?: string | Date;
}): WorkspaceSaveReceipt {
  const savedAt =
    input.savedAt instanceof Date
      ? input.savedAt.toISOString()
      : input.savedAt || new Date().toISOString();

  return {
    ok: true,
    provider: input.provider,
    action: input.action,
    fileId: input.fileId,
    ...(input.webUrl ? { webUrl: input.webUrl } : {}),
    visibleNextTurn: input.visibleNextTurn,
    searchableBy: [...input.searchableBy],
    summary: input.summary,
    savedAt,
  };
}

export const LIST_WORKSPACE_FILES_TOOL_CONTRACT: ToolContract = {
  name: "list_workspace_files",
  description:
    "List recent files or folder contents from the connected workspace provider. Returns bounded file references and links.",
  inputSchema: {
    type: "object",
    properties: {
      folderId: { type: "string", description: "Optional provider folder ID." },
      limit: { type: "number", description: "Maximum result count." },
    },
    additionalProperties: false,
  },
};

export const SEARCH_WORKSPACE_FILES_TOOL_CONTRACT: ToolContract = {
  name: "search_workspace_files",
  description:
    "Search connected workspace files by name or indexed text. Returns bounded file references and snippets when available.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search terms for workspace files.",
      },
      limit: { type: "number", description: "Maximum result count." },
    },
    required: ["query"],
    additionalProperties: false,
  },
};

export const READ_WORKSPACE_FILE_TEXT_TOOL_CONTRACT: ToolContract = {
  name: "read_workspace_file_text",
  description:
    "Read bounded text from a workspace file when the provider can safely export or download text.",
  inputSchema: {
    type: "object",
    properties: {
      fileId: { type: "string", description: "Provider file ID to read." },
      maxChars: {
        type: "number",
        description: "Maximum characters to return.",
      },
    },
    required: ["fileId"],
    additionalProperties: false,
  },
};

export const CREATE_WORKSPACE_DOCUMENT_TOOL_CONTRACT: ToolContract = {
  name: "create_workspace_document",
  description:
    "Create a provider-native document in the connected workspace and optionally seed it with text.",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Document title." },
      content: {
        type: "string",
        description: "Optional initial document text.",
      },
      folderId: {
        type: "string",
        description: "Optional destination folder ID.",
      },
    },
    required: ["title"],
    additionalProperties: false,
  },
};

export const APPEND_WORKSPACE_DOCUMENT_TOOL_CONTRACT: ToolContract = {
  name: "append_workspace_document",
  description: "Append text to an existing provider-native workspace document.",
  inputSchema: {
    type: "object",
    properties: {
      fileId: { type: "string", description: "Document file ID." },
      content: { type: "string", description: "Text to append." },
    },
    required: ["fileId", "content"],
    additionalProperties: false,
  },
};

export const CREATE_WORKSPACE_FOLDER_TOOL_CONTRACT: ToolContract = {
  name: "create_workspace_folder",
  description: "Create a folder in the connected workspace.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Folder name." },
      parentFolderId: {
        type: "string",
        description: "Optional parent folder ID.",
      },
    },
    required: ["name"],
    additionalProperties: false,
  },
};

export const RENAME_WORKSPACE_FILE_TOOL_CONTRACT: ToolContract = {
  name: "rename_workspace_file",
  description: "Rename a workspace file or folder.",
  inputSchema: {
    type: "object",
    properties: {
      fileId: { type: "string", description: "File or folder ID." },
      name: { type: "string", description: "New name." },
    },
    required: ["fileId", "name"],
    additionalProperties: false,
  },
};

export const MOVE_WORKSPACE_FILE_TOOL_CONTRACT: ToolContract = {
  name: "move_workspace_file",
  description: "Move a workspace file into a target folder.",
  inputSchema: {
    type: "object",
    properties: {
      fileId: { type: "string", description: "File ID." },
      targetFolderId: { type: "string", description: "Destination folder ID." },
    },
    required: ["fileId", "targetFolderId"],
    additionalProperties: false,
  },
};

export const COPY_WORKSPACE_FILE_TOOL_CONTRACT: ToolContract = {
  name: "copy_workspace_file",
  description: "Copy a workspace file into a target folder.",
  inputSchema: {
    type: "object",
    properties: {
      fileId: { type: "string", description: "File ID." },
      targetFolderId: { type: "string", description: "Destination folder ID." },
      name: { type: "string", description: "Optional copied file name." },
    },
    required: ["fileId", "targetFolderId"],
    additionalProperties: false,
  },
};

export const WORKSPACE_TOOL_CONTRACTS: ToolContract[] = [
  LIST_WORKSPACE_FILES_TOOL_CONTRACT,
  SEARCH_WORKSPACE_FILES_TOOL_CONTRACT,
  READ_WORKSPACE_FILE_TEXT_TOOL_CONTRACT,
  CREATE_WORKSPACE_DOCUMENT_TOOL_CONTRACT,
  APPEND_WORKSPACE_DOCUMENT_TOOL_CONTRACT,
  CREATE_WORKSPACE_FOLDER_TOOL_CONTRACT,
  RENAME_WORKSPACE_FILE_TOOL_CONTRACT,
  MOVE_WORKSPACE_FILE_TOOL_CONTRACT,
  COPY_WORKSPACE_FILE_TOOL_CONTRACT,
];

export function getWorkspaceToolContract(
  name: string,
): ToolContract | undefined {
  return WORKSPACE_TOOL_CONTRACTS.find((contract) => contract.name === name);
}

import test from "node:test";
import assert from "node:assert/strict";
import { WORKSPACE_TOOL_CONTRACTS, buildWorkspaceSaveReceipt, getWorkspaceToolContract, } from "./index.js";
test("workspace contracts expose the canonical tool names in stable order", () => {
    assert.deepEqual(WORKSPACE_TOOL_CONTRACTS.map((contract) => contract.name), [
        "list_workspace_files",
        "search_workspace_files",
        "read_workspace_file_text",
        "create_workspace_document",
        "append_workspace_document",
        "create_workspace_folder",
        "rename_workspace_file",
        "move_workspace_file",
        "copy_workspace_file",
    ]);
});
test("search_workspace_files contract requires a query and rejects extra fields", () => {
    const contract = getWorkspaceToolContract("search_workspace_files");
    assert.equal(contract?.inputSchema.properties?.query instanceof Object, true);
    assert.deepEqual(contract?.inputSchema.required, ["query"]);
    assert.equal(contract?.inputSchema.additionalProperties, false);
    assert.match(contract?.description ?? "", /workspace files/i);
});
test("read_workspace_file_text contract requires a fileId", () => {
    const contract = getWorkspaceToolContract("read_workspace_file_text");
    assert.equal(contract?.inputSchema.properties?.fileId instanceof Object, true);
    assert.deepEqual(contract?.inputSchema.required, ["fileId"]);
    assert.equal(contract?.inputSchema.additionalProperties, false);
});
test("workspace result types carry provider, source, retrieval, and metadata", () => {
    const searchResult = {
        file: {
            id: "doc-1",
            provider: "google_drive",
            name: "Launch Plan",
            mimeType: "application/vnd.google-apps.document",
            webUrl: "https://docs.google.com/document/d/doc-1",
        },
        source: "google_drive",
        retrievedBy: "search_workspace_files",
        snippet: "RIA launch checklist",
        metadata: { modifiedTime: "2026-05-06T12:00:00.000Z" },
    };
    const readResult = {
        file: searchResult.file,
        source: "google_docs",
        retrievedBy: "read_workspace_file_text",
        text: "Launch plan text",
        truncated: false,
    };
    assert.equal(searchResult.file.provider, "google_drive");
    assert.equal(searchResult.retrievedBy, "search_workspace_files");
    assert.equal(readResult.source, "google_docs");
});
test("buildWorkspaceSaveReceipt records where a workspace write landed", () => {
    const receipt = buildWorkspaceSaveReceipt({
        provider: "google_docs",
        action: "append_workspace_document",
        fileId: "doc-1",
        webUrl: "https://docs.google.com/document/d/doc-1",
        visibleNextTurn: true,
        searchableBy: ["read_workspace_file_text", "search_workspace_files"],
        summary: "Appended launch notes.",
    });
    assert.equal(receipt.ok, true);
    assert.equal(receipt.provider, "google_docs");
    assert.equal(receipt.fileId, "doc-1");
    assert.deepEqual(receipt.searchableBy, [
        "read_workspace_file_text",
        "search_workspace_files",
    ]);
    assert.match(receipt.savedAt, /^\d{4}-\d{2}-\d{2}T/);
});

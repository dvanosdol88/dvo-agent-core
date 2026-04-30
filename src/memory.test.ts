import test from "node:test";
import assert from "node:assert/strict";
import {
  MEMORY_RETRIEVAL_TOOL_CONTRACTS,
  buildMemorySaveReceipt,
  getMemoryRetrievalToolContract,
  type MemorySearchResult,
} from "./index.js";

test("memory retrieval contracts expose the Phase 2 tool names in canonical order", () => {
  assert.deepEqual(
    MEMORY_RETRIEVAL_TOOL_CONTRACTS.map((contract) => contract.name),
    [
      "search_thread_history",
      "get_operator_profile",
      "get_launch_state",
      "list_milestones",
      "search_canon",
    ],
  );
});

test("search_thread_history contract requires a query and allows bounded lookup", () => {
  const contract = getMemoryRetrievalToolContract("search_thread_history");

  assert.equal(contract?.inputSchema.properties?.query instanceof Object, true);
  assert.deepEqual(contract?.inputSchema.required, ["query"]);
  assert.equal(contract?.inputSchema.additionalProperties, false);
  assert.match(contract?.description ?? "", /older thread/i);
});

test("memory search result carries source, retrieval, and snippet metadata", () => {
  const result: MemorySearchResult = {
    id: "msg-1",
    memoryLayer: "thread_history",
    source: "cto_threads",
    snippet: "We discussed thread-history lookup.",
    retrievedBy: "search_thread_history",
    createdAt: "2026-04-30T00:00:00.000Z",
  };

  assert.equal(result.memoryLayer, "thread_history");
  assert.equal(result.retrievedBy, "search_thread_history");
});

test("buildMemorySaveReceipt records where a successful write landed", () => {
  const receipt = buildMemorySaveReceipt({
    memoryLayer: "launch_milestones",
    collection: "launch_milestones",
    documentId: "registration-filing",
    visibleNextTurn: true,
    searchableBy: ["list_milestones"],
    summary: "Registration filing is status-tracked as a milestone.",
  });

  assert.equal(receipt.ok, true);
  assert.equal(receipt.memoryLayer, "launch_milestones");
  assert.equal(receipt.documentId, "registration-filing");
  assert.deepEqual(receipt.searchableBy, ["list_milestones"]);
  assert.match(receipt.savedAt, /^\d{4}-\d{2}-\d{2}T/);
});

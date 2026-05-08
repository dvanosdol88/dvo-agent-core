import test from "node:test";
import assert from "node:assert/strict";
import {
  ACTION_RECEIPT_TOOL_CONTRACTS,
  buildActionReceipt,
  buildSurfaceSyncProposal,
  getActionReceiptToolContract,
  type SurfaceStateUpdate,
} from "./index.js";

test("action receipt contracts expose receipt recording and sync proposal names", () => {
  assert.deepEqual(
    ACTION_RECEIPT_TOOL_CONTRACTS.map((contract) => contract.name),
    ["record_action_receipt", "propose_surface_sync"],
  );
});

test("record_action_receipt contract requires a summary and evidence", () => {
  const contract = getActionReceiptToolContract("record_action_receipt");

  assert.equal(contract?.inputSchema.properties?.summary instanceof Object, true);
  assert.equal(contract?.inputSchema.properties?.evidence instanceof Object, true);
  assert.deepEqual(contract?.inputSchema.required, ["summary", "evidence"]);
  assert.equal(contract?.inputSchema.additionalProperties, false);
});

test("buildActionReceipt normalizes timestamps and preserves surface refs", () => {
  const receipt = buildActionReceipt({
    id: "receipt-1",
    source: "chat",
    actor: { agentId: "ria-chief", userId: "user-1" },
    summary: "Connecticut IARD application submitted.",
    evidence: [
      {
        kind: "operator_statement",
        summary: "David said the IARD application was submitted.",
        sourceRef: "ria_chief_threads/thread-1/messages/msg-1",
      },
    ],
    affectedItems: [
      {
        surface: "ria-builder",
        itemType: "checklist_item",
        itemId: "iard-registration",
        label: "IARD account setup and filing",
      },
    ],
    confidence: "confirmed",
    createdAt: new Date("2026-05-08T14:30:00.000Z"),
  });

  assert.equal(receipt.id, "receipt-1");
  assert.equal(receipt.source, "chat");
  assert.equal(receipt.confidence, "confirmed");
  assert.equal(receipt.createdAt, "2026-05-08T14:30:00.000Z");
  assert.equal(receipt.affectedItems[0]?.itemId, "iard-registration");
});

test("buildSurfaceSyncProposal separates proposed and applied updates", () => {
  const update: SurfaceStateUpdate = {
    ref: {
      surface: "ria-builder",
      itemType: "checklist_item",
      itemId: "ein-application",
      label: "Apply for EIN from IRS",
    },
    field: "status",
    previousValue: "in_progress",
    nextValue: "complete",
  };

  const proposal = buildSurfaceSyncProposal({
    id: "proposal-1",
    receiptId: "receipt-1",
    status: "proposed",
    reason: "Completion was inferred from IARD filing context.",
    proposedUpdates: [update],
  });

  assert.equal(proposal.status, "proposed");
  assert.equal(proposal.appliedUpdates.length, 0);
  assert.equal(proposal.proposedUpdates[0]?.field, "status");
  assert.match(proposal.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

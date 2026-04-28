import test from "node:test";
import assert from "node:assert/strict";
import {
  isAssistantTextBlock,
  type AgentIdentity,
  type AgentThreadMessage,
  type ToolContract,
} from "./index.js";

test("shared agent identity and message contracts cover CTO and RIA Chief metadata", () => {
  const identity: AgentIdentity = {
    id: "cto",
    displayName: "CTO",
    primarySurface: "dvo88",
    ownerAgent: "codex",
  };
  const message: AgentThreadMessage = {
    id: "msg-1",
    role: "assistant",
    text: "Ready.",
    createdAt: "2026-04-28T00:00:00.000Z",
    agentId: identity.id,
  };

  assert.equal(message.agentId, "cto");
});

test("isAssistantTextBlock narrows assistant text content blocks", () => {
  assert.equal(isAssistantTextBlock({ type: "text", text: "hello" }), true);
  assert.equal(isAssistantTextBlock({ type: "tool_use", id: "1", name: "search", input: {} }), false);
});

test("tool contracts describe interfaces without bundling concrete app write tools", () => {
  const contract: ToolContract = {
    name: "web_search",
    description: "Search the public web for current information.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
      required: ["query"],
    },
  };

  assert.equal(contract.name, "web_search");
});


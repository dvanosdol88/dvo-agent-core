import test from "node:test";
import assert from "node:assert/strict";
import { buildPromptTextBlock, joinCanonDocuments } from "./index.js";
test("joinCanonDocuments places the priority document first and renders title headings", () => {
    const docs = [
        { id: "memory-map", title: "Memory Map", content: "Maps the memory layers." },
        { id: "cto-operating-manual", title: "CTO Operating Manual", content: "CTO rules." },
    ];
    const joined = joinCanonDocuments(docs, { priorityDocumentId: "cto-operating-manual" });
    assert.match(joined, /^## CTO Operating Manual\nCTO rules\./);
    assert.match(joined, /---\n\n## Memory Map\nMaps the memory layers\./);
});
test("buildPromptTextBlock creates Anthropic-compatible text blocks without importing provider SDKs", () => {
    assert.deepEqual(buildPromptTextBlock("Stable canon", true), {
        type: "text",
        text: "Stable canon",
        cache_control: { type: "ephemeral" },
    });
    assert.deepEqual(buildPromptTextBlock("Runtime", false), {
        type: "text",
        text: "Runtime",
    });
});

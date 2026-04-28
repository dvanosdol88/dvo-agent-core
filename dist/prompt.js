export function joinCanonDocuments(documents, options = {}) {
    const docs = [...documents].sort((left, right) => {
        if (left.id === options.priorityDocumentId)
            return -1;
        if (right.id === options.priorityDocumentId)
            return 1;
        return left.id.localeCompare(right.id);
    });
    return docs
        .map((doc) => `## ${doc.title.trim() || doc.id}\n${doc.content.trim()}`)
        .join("\n\n---\n\n");
}
export function buildPromptTextBlock(text, cache = false) {
    const block = { type: "text", text };
    if (cache) {
        block.cache_control = { type: "ephemeral" };
    }
    return block;
}

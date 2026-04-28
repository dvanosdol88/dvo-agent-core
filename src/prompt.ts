export interface CanonDocument {
  id: string;
  title: string;
  content: string;
}

export interface JoinCanonDocumentsOptions {
  priorityDocumentId?: string;
}

export interface PromptTextBlock {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
}

export function joinCanonDocuments(
  documents: CanonDocument[],
  options: JoinCanonDocumentsOptions = {},
): string {
  const docs = [...documents].sort((left, right) => {
    if (left.id === options.priorityDocumentId) return -1;
    if (right.id === options.priorityDocumentId) return 1;
    return left.id.localeCompare(right.id);
  });

  return docs
    .map((doc) => `## ${doc.title.trim() || doc.id}\n${doc.content.trim()}`)
    .join("\n\n---\n\n");
}

export function buildPromptTextBlock(text: string, cache = false): PromptTextBlock {
  const block: PromptTextBlock = { type: "text", text };
  if (cache) {
    block.cache_control = { type: "ephemeral" };
  }
  return block;
}


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
    cache_control?: {
        type: "ephemeral";
    };
}
export declare function joinCanonDocuments(documents: CanonDocument[], options?: JoinCanonDocumentsOptions): string;
export declare function buildPromptTextBlock(text: string, cache?: boolean): PromptTextBlock;

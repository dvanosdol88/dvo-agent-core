import type { ToolContract } from "./tools.js";
export type PublicWebToolName = "search_web" | "read_web_url" | "list_web_page_links" | "crawl_web_site";
export type PublicWebSource = "public_web" | string;
export interface WebSourceRef {
    url: string;
    finalUrl?: string;
    title?: string;
    source: PublicWebSource;
    retrievedBy: PublicWebToolName | string;
    faviconUrl?: string;
    metadata?: Record<string, unknown>;
}
export interface WebReadResult {
    source: WebSourceRef;
    retrievedBy: PublicWebToolName | string;
    text: string;
    truncated: boolean;
    startChar?: number;
    endChar?: number;
    totalChars?: number;
    metadata?: Record<string, unknown>;
}
export interface WebLinkResult {
    source: WebSourceRef;
    links: WebSourceRef[];
    retrievedBy: PublicWebToolName | string;
    metadata?: Record<string, unknown>;
}
export declare const SEARCH_WEB_TOOL_CONTRACT: ToolContract;
export declare const READ_WEB_URL_TOOL_CONTRACT: ToolContract;
export declare const LIST_WEB_PAGE_LINKS_TOOL_CONTRACT: ToolContract;
export declare const CRAWL_WEB_SITE_TOOL_CONTRACT: ToolContract;
export declare const PUBLIC_WEB_TOOL_CONTRACTS: ToolContract[];
export declare function getPublicWebToolContract(name: string): ToolContract | undefined;

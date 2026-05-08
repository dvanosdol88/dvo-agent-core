export const SEARCH_WEB_TOOL_CONTRACT = {
    name: "search_web",
    description: "Search the public web for current information and return cited source references.",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "Search query." },
            maxResults: { type: "number", description: "Maximum result count." },
            searchDepth: {
                type: "string",
                description: "Search depth such as basic or advanced.",
            },
            topic: {
                type: "string",
                description: "Search topic such as general or news.",
            },
        },
        required: ["query"],
        additionalProperties: false,
    },
};
export const READ_WEB_URL_TOOL_CONTRACT = {
    name: "read_web_url",
    description: "Read bounded text from a specific public web URL for source-grounded research.",
    inputSchema: {
        type: "object",
        properties: {
            url: { type: "string", description: "Public URL to extract." },
            query: {
                type: "string",
                description: "Optional user intent for relevance-ranked extraction.",
            },
            maxChars: {
                type: "number",
                description: "Maximum characters of extracted text to return.",
            },
            extractDepth: {
                type: "string",
                description: "Extraction depth such as basic or advanced.",
            },
        },
        required: ["url"],
        additionalProperties: false,
    },
};
export const LIST_WEB_PAGE_LINKS_TOOL_CONTRACT = {
    name: "list_web_page_links",
    description: "Map a public web page or site area and return bounded links for follow-up reading.",
    inputSchema: {
        type: "object",
        properties: {
            url: { type: "string", description: "Public URL to map." },
            instructions: {
                type: "string",
                description: "Optional natural-language instructions for link discovery.",
            },
            limit: { type: "number", description: "Maximum link count." },
            maxDepth: { type: "number", description: "Maximum discovery depth." },
        },
        required: ["url"],
        additionalProperties: false,
    },
};
export const CRAWL_WEB_SITE_TOOL_CONTRACT = {
    name: "crawl_web_site",
    description: "Crawl a bounded public site area and return extracted source text from relevant pages.",
    inputSchema: {
        type: "object",
        properties: {
            url: { type: "string", description: "Root public URL to crawl." },
            instructions: {
                type: "string",
                description: "Natural-language instructions for what to find.",
            },
            limit: { type: "number", description: "Maximum crawled page count." },
            maxDepth: { type: "number", description: "Maximum crawl depth." },
            selectPaths: {
                type: "array",
                description: "Optional path regexes to include.",
            },
            excludePaths: {
                type: "array",
                description: "Optional path regexes to exclude.",
            },
            allowExternal: {
                type: "boolean",
                description: "Whether external domains may appear in results.",
            },
        },
        required: ["url", "instructions"],
        additionalProperties: false,
    },
};
export const PUBLIC_WEB_TOOL_CONTRACTS = [
    SEARCH_WEB_TOOL_CONTRACT,
    READ_WEB_URL_TOOL_CONTRACT,
    LIST_WEB_PAGE_LINKS_TOOL_CONTRACT,
    CRAWL_WEB_SITE_TOOL_CONTRACT,
];
export function getPublicWebToolContract(name) {
    return PUBLIC_WEB_TOOL_CONTRACTS.find((contract) => contract.name === name);
}

# dvo-agent-core

Shared low-risk TypeScript contracts and handoff helpers for David's agent infrastructure.

This package intentionally starts small. It is for generic Chief/CTO contracts, report formatting, message/content types, prompt-block helpers, tool interface shapes, and memory retrieval/save-receipt contract shapes. App-specific behavior stays in the consuming app.

## Guardrails

- No secrets.
- No app-specific write tools.
- No RIA Builder dependency in v0.1.0.
- RIA Builder does not consume this package until CTO usage is stable.

## Memory Contracts

`v0.1.3` exports the Phase 2A retrieval contract names:

- `search_thread_history`
- `get_operator_profile`
- `get_launch_state`
- `list_milestones`
- `search_canon`

It also exports `MemorySearchResult` and `buildMemorySaveReceipt()` so consuming apps can report where facts were found or saved without pretending all memory is one prompt.

## Workspace Contracts

`v0.1.4` adds generic Workspace/Drive contract names and result/receipt shapes for connected-file operations such as listing, searching, reading bounded text, creating documents/folders, appending to documents, renaming, moving, and copying files.

The package still does not implement Google APIs, Firebase checks, token storage, or app-specific write behavior. Consuming apps own provider-specific execution and auth.

## Action Receipt Contracts

`v0.1.5` adds generic action-receipt and surface-sync proposal shapes:

- `ActionReceipt`
- `SurfaceItemRef`
- `SurfaceStateUpdate`
- `SurfaceSyncProposal`
- `buildActionReceipt()`
- `buildSurfaceSyncProposal()`

These contracts are for durable evidence and cross-surface reconciliation metadata. They do not write to Firestore, update RIA Builder cards/checklists, or mutate CTO project state. Consumer apps own concrete reads, writes, auth, and review UI.

## Public Web Contracts

`v0.1.6` adds generic public-web research contract names and result shapes:

- `search_web`
- `read_web_url`
- `list_web_page_links`
- `crawl_web_site`

It also exports `WebSourceRef`, `WebReadResult`, `WebLinkResult`, and `getPublicWebToolContract()` so consuming apps can describe public web search, URL reading, link mapping, and bounded crawling without bundling a browser, scraper, API key, or provider-specific execution into the shared package.

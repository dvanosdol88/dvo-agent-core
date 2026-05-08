# dvo-agent-core Repo Log

> Persistent activity memory for this repo. Read this before changing shared agent contracts.

## Current Capabilities

`@dvo/agent-core` v0.1.6 is the shared low-risk TypeScript contract package for David's CTO/RIA Chief infrastructure. It exports agent identity, thread/message/content block types, handoff report schemas and markdown rendering, prompt/canon helpers, generic tool contract shapes, Phase 2A memory retrieval contracts, Workspace/Drive file-operation contracts, public-web research contracts, and action-receipt/surface-sync proposal contracts. App-specific behavior stays in consuming apps; CTO is the first consumer, and RIA Builder/RIA Chief should only consume tagged contracts after CTO-side verification. Run `npm test` before publishing, tagging, or wiring a consuming app to a new version.

## Sessions

### 2026-05-08 - Added public-web research contracts

**Agent:** Codex GPT-5 | **Surface:** shared contracts / Chief + CTO web research | **Duration:** implementation slice

- changed: bumped package metadata to `0.1.6` and added shared public-web contracts for search, URL reading, link mapping, and bounded site crawling.
- added: `src/web.ts` with `WebSourceRef`, `WebReadResult`, `WebLinkResult`, canonical public-web tool contracts, and lookup helper.
- verified: `npm test` passed with 25 Node test cases after TypeScript build.
- boundary: no Tavily execution, browser automation, authenticated browsing, secrets, or consumer-app runtime behavior was added to the shared package.

### 2026-05-08 - Added action receipt contracts

**Agent:** Codex GPT-5 | **Surface:** shared contracts / Chief + CTO sync | **Duration:** implementation slice

- changed: bumped package metadata to `0.1.5` and added shared `ActionReceipt`, `SurfaceItemRef`, `SurfaceStateUpdate`, and `SurfaceSyncProposal` contracts.
- added: `src/actions.ts` with receipt/proposal builders and generic `record_action_receipt` / `propose_surface_sync` tool contracts.
- tagged: `v0.1.4` to align the prior package version, then tagged and pushed `v0.1.5`.
- verified: `npm test` passed with 21 Node test cases after TypeScript build.
- deployed: package tag only; no app production deploy from this repo.
- next: keep this contracts-only and let apps own concrete writes and auth.

### 2026-05-06 - Added Workspace/Drive shared contracts

**Agent:** Codex GPT-5 | **Surface:** shared contracts / RIA Chief support | **Duration:** implementation slice

- changed: bumped package metadata to `0.1.4` and added generic Workspace contract exports for list/search/read/create/append/folder/rename/move/copy file operations.
- added: `src/workspace.ts` with provider/file/result/receipt types plus canonical tool contracts and lookup helper.
- committed: `220bed0` (`feat: add workspace tool contracts`) and pushed to `main`.
- verified: `npm test` passed with 17 Node test cases after TypeScript build.
- boundary: no Google API execution, Firebase auth, secrets, token storage, or RIA Builder-specific behavior was added to the shared package.

### 2026-04-30 - Wrapped CTO-first memory retrieval rollout

**Agent:** Codex (GPT-5) | **Surface:** cross-cutting | **Duration:** end-of-session

- changed: refreshed this repo log to the wrap-up format with a current capabilities snapshot for CTO intake.
- verified: `npm test` passed with 12 Node test cases after TypeScript build.
- verified: consuming CTO checks in `D:\dvo88\dvo88-command-center` passed: thread-search smoke test, targeted server type-check, and `npm run build`.
- deployed: `@dvo/agent-core` v0.1.3 is published via pushed GitHub tag; CTO/dvo88 consumes it in production.
- next: let CTO soak with read-only older-thread retrieval before adding a model-callable tool loop or porting any behavior to RIA Chief.

### 2026-04-30 - Added Phase 2A memory retrieval contracts

- changed: bumped package to `0.1.3` and added shared memory contract exports for `search_thread_history`, `get_operator_profile`, `get_launch_state`, `list_milestones`, `search_canon`, and save-receipt metadata.
- added: `src/memory.ts` and test coverage for canonical tool names, thread-history contract schema, search-result metadata, and save receipts.
- documented: README now describes the Phase 2A memory contract exports.
- verified: `npm test` passed with 12 Node test cases after TypeScript build.
- next: consume `v0.1.3` from CTO first; keep RIA Builder out until CTO-side retrieval behavior is stable.

### 2026-04-29 - Phase 1 memory retrieval audit input

- changed: recorded the RIA Chief first memory-retrieval audit outcome as input to shared contract design; implementation work stayed in `D:\riabuilder\RIA-builder`.
- design note: do not treat larger history windows as the memory system. Phase 2 should define shared retrieval/save contracts before wiring RIA Builder to this package.
- recommended contracts: `search_thread_history`, `get_operator_profile`, `get_launch_state`, `list_milestones`, `search_canon`, and save receipts that identify memory layer, document ID, visibility, and retrieval path.
- guardrail: CTO remains the first shared-package consumer; RIA Chief should adopt only after CTO-side contract behavior is stable and separately verified.

### 2026-04-29 - Initial repo log

- changed: created `REPO-LOG.md` for this shared tools package so future agents have a durable local handoff surface.
- verified: `npm test` passed, including TypeScript build and 8 Node test cases.
- design note: memory should be treated as layered infrastructure, not one giant prompt. Shared contracts should define how agents describe, search, and verify memory sources; domain-specific agents can own domain-specific state such as compliance milestones, marketing copy, or technical operations.
- next: consider adding shared memory/search contract types for capabilities like `search_thread_history`, `get_operator_profile`, and read-after-write confirmation metadata before implementing those tools in CTO or RIA Chief.

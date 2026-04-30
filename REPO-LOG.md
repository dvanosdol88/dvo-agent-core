# dvo-agent-core Repo Log

> Persistent activity memory for this repo. Read this before changing shared agent contracts.

## Current State

- Package: `@dvo/agent-core`
- Version: `0.1.2`
- Purpose: shared low-risk TypeScript contracts and handoff helpers for David's Chief/CTO infrastructure.
- Scope: agent identity, thread/message/content block types, handoff report schema, prompt/canon helpers, and tool contract shapes.
- Guardrail: app-specific behavior stays in consuming apps; RIA Builder should not consume this package until CTO usage is stable.
- Verification: run `npm test` before publishing, tagging, or wiring a consuming app to a new version.

## Log

### 2026-04-29 - Initial repo log

- changed: created `REPO-LOG.md` for this shared tools package so future agents have a durable local handoff surface.
- verified: `npm test` passed, including TypeScript build and 8 Node test cases.
- design note: memory should be treated as layered infrastructure, not one giant prompt. Shared contracts should define how agents describe, search, and verify memory sources; domain-specific agents can own domain-specific state such as compliance milestones, marketing copy, or technical operations.
- next: consider adding shared memory/search contract types for capabilities like `search_thread_history`, `get_operator_profile`, and read-after-write confirmation metadata before implementing those tools in CTO or RIA Chief.

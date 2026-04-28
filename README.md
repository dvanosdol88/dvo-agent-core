# dvo-agent-core

Shared low-risk TypeScript contracts and handoff helpers for David's agent infrastructure.

This package intentionally starts small. It is for generic Chief/CTO contracts, report formatting, message/content types, prompt-block helpers, and tool interface shapes. App-specific behavior stays in the consuming app.

## Guardrails

- No secrets.
- No app-specific write tools.
- No RIA Builder dependency in v0.1.0.
- RIA Builder does not consume this package until CTO usage is stable.


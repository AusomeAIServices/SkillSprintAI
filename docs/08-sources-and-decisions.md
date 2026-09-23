# Sources, terminology and decision register

Checked on **23 September 2026** using official OpenAI documentation. These sources establish the terminology below, not account entitlement, universal availability or future stability. Recheck before implementation and before publishing tool-specific lessons. Pricing experiments, learning schedules, stack choices and business forecasts in this pack are proposed design decisions, not claims made by these sources.

## Verified terminology

| User term / topic | Treatment in this design | Primary source |
|---|---|---|
| ChatGPT | Everyday question, explanation and drafting practice | [ChatGPT Work introduction and Chat/Work distinction](https://learn.chatgpt.com/docs/get-started-with-work) |
| GPTWork | Normalize to **ChatGPT Work**, which supports delegating tasks toward reviewable outcomes | [Get started with ChatGPT Work](https://learn.chatgpt.com/docs/get-started-with-work) |
| Codex with VS Code | Teach the official Codex IDE extension workflow | [Codex IDE extension](https://learn.chatgpt.com/docs/codex/ide) |
| Codex Swarm | Working curriculum label for bounded multi-agent collaboration; not an asserted separate SKU | [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) |
| OpenAI Agents SDK | Application-owned orchestration for agents and tools | [Agents SDK](https://developers.openai.com/api/docs/guides/agents/sdk) |
| Managed harness | Agents API documented as a managed Codex harness option | [Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) |
| Orchestrator | Design choice between managed ownership and specialist handoff | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) |
| Direct model integration | Responses API is one option alongside agent runtimes | [Agents runtime comparison](https://developers.openai.com/api/docs/guides/agents) |
| Multi-cloud harness | Proposed advanced learning topic and future adapter architecture | No cross-cloud compatibility is established by this pack; verify each provider independently |

## Architecture decisions

| ID | Decision | Reason | Revisit trigger |
|---|---|---|---|
| ADR-001 | Responsive web first | Broad access and fast iteration | Repeated unmet native-device needs |
| ADR-002 | Two complete MVP paths | Keep quality and authoring workload feasible | Retention and transfer gates pass |
| ADR-003 | Versioned authored content in Git | Reviewability and reproducibility | Nontechnical editor volume justifies CMS |
| ADR-004 | Deterministic grades; optional AI hints | Stable assessment and predictable fallback | Validated human-calibrated grading requirement |
| ADR-005 | Modular monolith and PostgreSQL | Simple delivery and transactions | Measured scaling or organizational boundary |
| ADR-006 | One production cloud initially | Avoid premature operational duplication | Buyer requirement and funded portability test |
| ADR-007 | No external write tools in MVP coach | Practice does not need workplace side effects | Explicit reviewed agent-lab scope |
| ADR-008 | No paid checkout in pilot | Validate learning and value first | Purchase commitments and retention evidence |

## Assumptions and decisions still needed

Defaults for drafting: English, adult learners, browser-first, individual accounts, synthetic practice data and one delivery region. These permit local development without blocking. They must not be silently treated as validated business research.

Before pilot: choose operating geography and data region; auth/hosting providers; accountable human reviewers; privacy/retention notice; pilot participants and consent process; supported browsers; actual API account/model configuration and spending cap.

Before repository publication: specify GitHub owner/repository, visibility, collaborators and review policy. Before charging: confirm offer, currency, taxes, payment provider, support/refund policy and measured variable costs. Before advanced labs: confirm sandbox isolation, spend limits, cleanup policy and provider-specific prerequisites.

## What this pack does not establish

No competitor market share, market size, product-market fit, scientifically optimal learning interval, security certification, OpenAI affiliation, professional accreditation, cross-cloud API parity, exact provider prices or guaranteed learning outcome has been claimed. Product design and learning rules should be validated through the proposed pilot.

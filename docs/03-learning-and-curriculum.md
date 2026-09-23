# Learning system and curriculum

## The 15-minute unit

Every lesson teaches one observable capability and produces one piece of evidence. Instruction is authored and reviewed; the AI coach may explain or hint but does not silently replace the lesson or assessment.

| Minute | Activity | Learner action |
|---|---|---|
| 0–1 | Recall and goal | Answer a short retrieval question and see today's outcome |
| 1–4 | Learn | Read a concise worked example and one failure example |
| 4–10 | Apply | Complete a realistic task using supplied synthetic material |
| 10–13 | Check | Answer checks and inspect the result against a rubric |
| 13–15 | Reflect and save | State one correction, save evidence, choose a reuse opportunity |

The timer is an estimate and can be paused. Setup, package installation, credentials, and long model runs are separate prerequisites; advanced labs must not hide 40 minutes of setup inside a 15-minute promise. Provide a recorded or fixture-based route when setup is unavailable.

At 30 minutes, complete two units; at 45 minutes, three; at 60 minutes, four. Reviews use the same unit structure. Offer a break between units. A multi-day project uses checkpoints, each with a meaningful saved result.

## Foundation: ChatGPT in a Day

Eight lessons = 120 minutes of active learning, optionally spread across eight days. Breaks and account setup are additional. The outcome is beginner confidence on common tasks, with an understanding of verification and privacy.

| ID | Lesson | Evidence |
|---|---|---|
| F01 | Ask a useful daily question: goal, context, constraints, output | Rewritten prompt and checked plan |
| F02 | Know what AI can get wrong | Annotated answer separating supported facts and assumptions |
| F03 | Learn something unfamiliar through examples | Plain-language explanation and own teach-back |
| F04 | Write and revise for an audience | Before/after message with a reason for the revision |
| F05 | Summarize only the supplied material | Summary linked to the relevant source lines |
| F06 | Compare choices without inventing facts | Comparison with missing information marked |
| F07 | Protect private information and verify important claims | Redacted input and verification checklist |
| F08 | Combine the skills in a daily-life task | Small personal planning artifact and reflection |

Recommended one-day rhythm: F01–F02 morning; F03–F04 late morning; F05–F06 afternoon; F07–F08 evening. F01 includes a basic privacy reminder and an accuracy check; these protections are not deferred until F07.

## Six pathways

Durations below include each pathway's own units. Prerequisites are additional unless demonstrated through placement. A learner without prior experience follows Foundation before specialization.

| Path | Units / active time | Prerequisite | Graduation evidence | Release |
|---|---|---|---|---|
| Everyday AI | 8 / 2 hours | None | Checked personal task | MVP |
| AI at Work | 12 / 3 hours | Foundation or diagnostic | Reusable workplace workflow | MVP |
| Professional Practice | 16 / 4 hours | Foundation | Domain brief with review procedure | Later |
| Lead with AI | 12 / 3 hours | Foundation or executive diagnostic | Pilot investment and governance memo | Later |
| Build with Codex | 24 / 6 hours | Basic Git, files, terminal and programming | Tested app change and reviewed PR | Later |
| Build AI Systems | 32 / 8 hours | Programming, HTTP/JSON, secrets and basic tests | Evaluated agent application | Later |

### AI at Work: twelve units

W01 define a deliverable and its quality bar; W02 summarize meeting notes; W03 draft an audience-specific email; W04 synthesize conflicting source notes; W05 inspect a small synthetic table; W06 draft an SOP; W07 delegate a bounded task in ChatGPT Work; W08 supply appropriate file context; W09 review a generated work artifact; W10 specify a repeatable workflow and approval boundary; W11 create a reusable task brief; W12 capstone: turn supplied project notes into a checked weekly update.

W07–W10 include static walkthroughs when the learner lacks access. Teach a reviewable result and appropriate permissions rather than a memorized button sequence. ChatGPT Work documentation describes task delegation with files and approved tools; check account availability before external practice. [Official guide](https://learn.chatgpt.com/docs/get-started-with-work).

### Professional Practice: four four-unit modules

1. Task boundaries: define a professional task; redact case material; separate evidence from inference; identify required expert review.
2. Communication: prepare an intake summary; draft a client explanation; adapt tone and reading level; identify omitted qualifications.
3. Analysis: build a source-based brief; reconcile conflicting notes; state uncertainty; construct a review checklist.
4. Workflow: template a recurring task; assign reviewer responsibilities; document provenance; complete a domain capstone.

Offer initial scenarios for HR, sales, consulting and operations. Legal, healthcare, and investment-specific content requires domain review before release. The app teaches workflows and judgment; it does not grant professional credentials.

### Lead with AI: three four-unit modules

1. Understand: capabilities and limits; choose a task; baseline time and quality; evaluate a demo critically.
2. Decide: prioritize use cases; estimate total cost; assess data and operational risk; assign human accountability.
3. Lead: write a pilot charter; define success and stop criteria; plan workforce adoption; produce an investment memo with uncertainties.

### Build with Codex: six four-unit modules

1. Repository literacy: navigate a small repo; explain an architecture; inspect tests; write acceptance criteria.
2. Codex basics: give task context; inspect a proposed change; run validation; summarize a diff.
3. VS Code workflow: use the Codex extension; maintain project instructions; implement a bounded feature; diagnose a failing test.
4. Delivery: create a branch; prepare a PR; respond to code review; recover from a faulty change.
5. Coordinated agents: partition work; define contracts and file ownership; compare independent reviews; integrate and resolve conflicts.
6. Capstone: plan a small feature; implement; test and review; publish a reviewable evidence pack in a learner-controlled repo.

Use “Codex Swarm” as a course subtitle for coordinated specialist work, not an asserted product name. Support sequential role execution where parallel tools are unavailable. VS Code uses the Codex extension; exact installation and sign-in steps should follow current official instructions. [IDE documentation](https://learn.chatgpt.com/docs/codex/ide).

### Build AI Systems: eight four-unit modules

1. API foundations: request/response; server-only keys; structured output; error handling.
2. Grounded apps: define a source corpus; retrieve relevant text; cite evidence; test unsupported questions.
3. Quality: construct an evaluation set; score deterministic criteria; inspect failures; compare configurations.
4. Agents SDK: define one agent; expose one bounded tool; retain appropriate state; inspect a trace.
5. Tool boundaries: validate arguments; approve side effects; handle untrusted retrieved text; test injection attempts.
6. Orchestration: compare single agent and specialists; choose manager or handoff; cap steps and cost; evaluate whether added complexity helped.
7. Harnesses and cloud: compare managed and application-owned runtimes; containerize a sample; implement a capability-aware provider adapter; compare one alternate environment using fixtures or verified access.
8. Capstone: design; implement; evaluate failures/cost/latency; present a reproducible evidence pack.

The Agents SDK supports application-owned agent workflows. The Agents API is a separately documented managed harness option. Teach the distinction and select by control, durability, cost and deployment needs, rather than treating either as automatically required. [SDK](https://developers.openai.com/api/docs/guides/agents/sdk), [managed harness](https://developers.openai.com/api/docs/guides/agents-api/overview).

## Shared artifact rubric

Each dimension is 0, 1, or 2: 0 = missing or materially wrong; 1 = partial; 2 = meets the criterion.

| Dimension | Full-credit behavior |
|---|---|
| Task fit | Meets the specified goal, audience and output requirements |
| Grounding and verification | Checks relevant claims against supplied evidence; identifies unknowns |
| Privacy and boundaries | Uses permitted material and respects the task's action limits |
| Reflection and reuse | Explains a useful correction and when to reuse the approach |

Pass rule: quiz at least 80%, rubric at least 6/8, no zero on verification or privacy. Display the assessor: learner, human reviewer, or AI suggestion. A completion badge is never presented as an externally accredited qualification. Human review of a later unseen task is required for pilot transfer claims.

## Worked lesson and authoring contract

[F01 seed](../content/lessons/foundation-001.json) contains original teaching copy, synthetic facts, a worked example, a six-minute task, three checks, answer explanations, static hints and a rubric. With three quiz items, 80% means all three must be correct; use more items later only if they fit the time budget.

Required lesson fields: stable ID, immutable version, title, audience, skill IDs, prerequisites, duration, objective, content blocks, practice input and deliverable, quiz and explanations, rubric, hints, reflection, product dependencies, provenance/source metadata, author and review status. Publish only through schema validation and human editorial review. The API serves questions without answer keys until scoring.

Lifecycle: draft → subject review → instructional review → accessibility check → published → revised/retired. Tool-specific content gets monthly review and a recheck after known product changes. The system records the exact lesson version used for every attempt. Publish a new version instead of rewriting historical evidence; a retired lesson remains available for historical review with a notice.

AI can draft variants for editorial review. It cannot publish new lessons, invent supporting sources, or alter assessment criteria for a particular learner. Content is portable structured data, with short text and optional captioned media, not video-only instruction.

# Implementation status

Updated: 23 September 2026. Stage: M0 complete; M1 local F01 vertical slice plus seven-path self-guided curriculum preview.

## Repository inspection

- Workspace contains the product blueprint and no application source or pre-existing Git metadata.
- No pre-existing root `AGENTS.md` was found. Added repository-specific instructions based on the provided template and handoff prompt.
- Node.js v24.18.0 and npm 11.16.0 are available. Docker CLI exists, but the Docker daemon is not running. No provider/API/database credentials are configured in the environment.
- Installed Next.js 16.3.6, React 19.3.0, TypeScript 6.0.3, Vitest 5.0.1 and Playwright 1.63.0; pinned dependencies are recorded in the npm lockfile.
- No product code, GitHub remote, cloud resources or learner data existed at kickoff.

## M0 decisions

1. **App shape:** TypeScript and Next.js App Router, modular monolith, learner UI with server routes. Confirm installed framework/package versions against current official compatibility information during setup.
2. **M1 persistence:** use a local-only SQLite development database behind a repository interface, persisted to a gitignored workspace file. Node exposes `node:sqlite` in this available runtime, though it is experimental; isolate it behind a `LearningRepository`, document the Node minimum, and do not present it as the final hosted database. M2 production persistence remains PostgreSQL as documented.
3. **Identity:** local development uses a fixed synthetic learner only. Non-development startup fails closed until maintained real authentication is configured. Never accept a client learner ID.
4. **Content:** validate the authored JSON against a versioned schema. Seed lesson status remains draft; it may be previewed locally only. Learner projection is allowlisted and omits `correctChoiceId`, quiz explanations and `reviewerGuide` before submission. Attempts pin lesson ID/version/hash.
5. **Assessment:** all three F01 quiz questions must be attempted before submission. With 3 questions and the 80% rule, proficiency requires 3/3, rubric >=6/8, and verification/privacy each >0. Completion additionally requires all five steps, submitted practice, attempted quiz, and reflection. Self-assessment remains explicitly labeled; no AI grading.
6. **MVP boundary:** mock/disabled coach; static hints suffice. No external OpenAI credentials, cloud deployment or production auth required for local M1.
7. **M0 reviews:** three delegated read-only reviews completed: UX interaction/accessibility, architecture/security, and independent QA. Key conclusions incorporated above; no agent edited files.

## Milestone status

| Milestone | State | Evidence / next step |
|---|---|---|
| M0 contracts | Complete | Decisions and status documented; root instructions added |
| M1 F01 local slice | Complete | Search-to-ChatGPT beginner onboarding, F01 lesson v1.3.0, three-wave, nine-milestone What is AI? journey preview (27 topics, Easy/Hard/Advanced at each milestone, local XP and badge progression), copy-ready prompt helper, optional full F01 practice, student study-guide preview, seven navigable self-guided paths containing 112 authored practice prompts across 26 modules, browser-local draft and practice tracking, dashboard-first startup with explicit resume/review, version-aware resume, local SQLite persistence, deterministic assessment, private evidence and review scheduling; build and automated checks pass |
| M2 auth/PostgreSQL/20 lessons | Not started | Requires maintained auth choice, database setup, and 19 reviewed lessons |
| M3 optional coach | Not started | Keep disabled; needs adapter, budget controls, evaluations and authorized config |
| M4 pilot readiness | Not started | Requires remaining quality evidence and human/editorial/user inputs |

## Validation record

- `npm run typecheck`, `npm run lint`, `npm run test` (13 tests across 6 files), `npm run content:validate`, and `npm run build` pass.
- `npm run test:e2e` passes six Chromium tests covering all seven path pages and: prompt helper and student guide, plus the F01 journey including answer-key privacy, navigation, draft persistence after reload, deterministic scoring, completion, private evidence and 320 px layout.
- Desktop and mobile layouts were inspected in the in-app browser; no horizontal overflow was found at the inspected mobile viewport.
- The authored lesson passes schema, timing, answer-key and rubric checks; it remains a draft pending human editorial review.
- The environment has Node.js v24.18.0 and npm 11.16.0. Docker daemon is unavailable.

## Open constraints

- Local demo requires Node.js 24.15+ for the built-in SQLite module; SQLite remains a development-only adapter.
- SQLite in Node 24 is experimental and only suitable as an isolated local M1 adapter; production should use the PostgreSQL path in the architecture.
- The authored lesson is explicitly pending human editorial review; it cannot be represented as published pilot content. All seven paths now have navigable self-guided draft units. These are not reviewed, scored, enrolled, or AI-powered courses; only F01 has a server-scored draft assessment. Browser-local practice records are not completion, proficiency, or transfer evidence.
- The workspace source is published at https://github.com/AusomeAIServices/SkillSprintAI on branch main. No cloud resources or paid subscriptions have been created.

## Seven-path preview addition

- Added all seven curriculum paths (8 + 8 + 12 + 16 + 12 + 24 + 32 = 112 units) to the main menu. Each path opens a course page with ordered modules and unique unit practice tasks.
- Each unit shows a 15-minute recall → learn → apply → check → reflect scaffold, tailored module guidance, synthetic practice material, local draft persistence, and a self-reported “practised” indicator. No model call, automatic scoring, or credential is implied.
- Added catalog validation and Chromium navigation/persistence coverage. Human editorial review, supplied lesson-specific source fixtures, deterministic assessments, authenticated persistence, and live advanced labs are still needed before these paths can be called complete published courses.

## Worked journey guidance

- Each of the seven path pages now includes a path-specific five-step sample journey, with a question and grounded reference answer for Recall, Learn, Apply, Check, and Reflect. These are visible teaching examples, not scored quiz keys or proof of proficiency.
- Browser coverage verifies five answers on every path and preserved draft persistence; catalog tests verify the worked example unit IDs and ordered stages.

## Offline journey chat examples

- Added three scripted prompt/reply examples for each of the 27 What is AI? topics (81 total). The learner can select a sample and reveal its authored reply; editing the prompt cannot generate a new response and produces a clear notice. No network or live AI subscription is used by the simulator.
- Unit validation checks complete topic coverage and distinct examples. Chromium coverage walks all 27 topics, verifies the three options, scripted replies, edited-prompt behavior, and zero API requests during simulator interaction.

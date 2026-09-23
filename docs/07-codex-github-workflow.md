# Codex, VS Code and GitHub delivery workflow

## Repository setup

This documentation folder is not yet a Git repository. At implementation kickoff, use an existing intended repository if one is provided; otherwise initialize this folder, create a private GitHub repository under the chosen owner, and connect its remote after destination/access are known. Do not guess the organization or publish a public repository. The current deliverable is the documentation pack, not a remote repository.

Open the project folder in VS Code, install/sign in to the Codex extension using the current official instructions, and confirm the extension can read the workspace. [Codex IDE documentation](https://learn.chatgpt.com/docs/codex/ide). Keep provider API keys separate from development-tool sign-in; a Codex login is not an application runtime API credential.

At implementation kickoff:

1. Inspect existing files and repository instructions. Preserve user changes.
2. Copy [the agent template](../templates/AGENTS.template.md) to root `AGENTS.md`, adapting it to existing rules.
3. Select and pin the runtime, package manager and maintained dependencies; create lockfile, `.env.example` and `.gitignore` before secrets or build artifacts exist.
4. Create a local database and synthetic seed data. Provide `.env.example` placeholders without working secrets.
5. Implement the F01 vertical slice with a mock provider. Document the exact commands that actually run.
6. Add CI and branch review rules when the GitHub repo exists; do not claim settings have been applied before verifying them.
7. Paste the unified team prompt and work through milestones with explicit evidence.

Suggested environment variables: `DATABASE_URL`, `AUTH_SECRET`, `APP_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `COACH_ENABLED`, `COACH_MONTHLY_BUDGET_USD`. Final names depend on implementation; document whether each is required, secret, or safe for the browser. Do not expose server variables through public-prefixed frontend configuration.

## Proposed application layout

```text
docs/                         product and implementation decisions
docs/adr/                     architecture decision records
prompts/                      reproducible development prompts
content/lessons/               authored lesson JSON
content/schemas/               lesson and assessment schemas
src/app/                      routes, layouts and server endpoints
src/components/               accessible learner UI
src/modules/learning/         planning and deterministic assessment
src/modules/portfolio/        artifact ownership and export
src/modules/coach/            prompt, provider and usage controls
src/server/                   auth, database and service composition
db/migrations/                reviewed versioned migrations
tests/unit/                   pure rules and schemas
tests/integration/            DB, authorization and adapter behavior
tests/e2e/                    learner journeys
tests/evals/                  coach fixtures and score reports
.github/workflows/            actual CI once the app exists
```

Use a single package initially. Add workspaces or services only when there is a demonstrated boundary. This file tree is a target layout, not a claim that those application files already exist.

## Work ownership and parallelism

The lead agent owns integration, shared interfaces, package manifests, lockfile, migrations and release evidence. Specialists own bounded tasks with written file boundaries. Prefer parallel exploration and review; parallel code changes require disjoint ownership or isolated worktrees. Subagents can reduce context load but create coordination costs; use them only where work is independent. [Official subagent guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents).

For each assignment record: issue ID, outcome, owned files, input contracts, dependencies, required tests, budget/timebox and return format. Specialists report files changed, decisions, tests actually run and unresolved blockers. No agent claims another agent's unverified result as fact.

Use available concurrency, typically a lead plus up to three specialists, instead of assuming an unlimited swarm. If the client lacks subagents, execute the same roles sequentially and record that limitation. A prompt does not install orchestration features.

## GitHub working agreement

One issue describes one reviewable outcome with acceptance criteria and dependencies. Suggested labels: `product`, `content`, `frontend`, `backend`, `ai`, `security`, `quality`, and `blocked`. Use small branches such as `feat/B06-foundation-slice`; branch names are suggestions for the future repository.

PR descriptions explain the problem, resulting behavior, validation evidence and remaining limitations. Include UX screenshots for visible changes and cost/eval changes for model behavior. Require at least one human review for main and restrict direct pushes once the team repository is configured. Add CODEOWNERS only with actual repository identities; never invent account handles.

CI must run on PRs and main with minimum permissions. Untrusted PR code must not receive production secrets. Prefer short-lived deployment identity when supported; pin external action references under the team's supply-chain policy. Use isolated preview data and avoid sending preview notifications to real learners.

Suggested package-script contract to implement: `dev`, `build`, `lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `content:validate`, `eval:coach`, `db:migrate`, `db:seed`. These commands do not exist yet; the implementation must create and verify them before the README advertises them as runnable.

## Handover artifacts

Each milestone ends with a runnable state, changed-file summary, commands and actual outcomes, screenshots where appropriate, requirements covered, known limitations, and the next dependency. Persist status in `docs/IMPLEMENTATION-STATUS.md` so another Codex session can resume without replaying the full chat.

A final delivery must distinguish implemented, tested, mocked, disabled and deferred behavior. Repository creation, PR creation, deployment and publication need verified destination and the applicable user authorization; the master prompt prepares these actions but does not invent it.

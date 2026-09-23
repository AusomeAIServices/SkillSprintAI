# SkillSprint AI — product and engineering blueprint

**One useful AI skill. One practical result. Fifteen minutes.**

Working product name: **SkillSprint AI**. Repository working name: `openai-microlearn`.
Prepared 23 September 2026. Status: local M1 F01 vertical slice implemented; auth, the complete 20-lesson curriculum, coaching, cloud deployment and a GitHub remote remain deferred. The working name has not been checked for trademark or domain availability.

SkillSprint AI turns AI learning into a daily practice: choose an outcome, learn a small concept, apply it to a realistic task, check the result, and save evidence of a skill. Learners plan 15, 30, 45, or 60 minutes a day. The working prototype has one complete, local-only 15-minute F01 lesson.

The product serves individuals, information workers, nontechnical professionals, executives, IT professionals, and AI practitioners. Launch with everyday ChatGPT and workplace outcomes; expand into Codex, agent development, and orchestration after the learning loop is validated.

## Read the blueprint

| Document | What it decides |
|---|---|
| [Strategy](docs/01-strategy.md) | Positioning, audience, business model, launch experiments, economics |
| [Product requirements](docs/02-product-requirements.md) | MVP scope, user journeys, acceptance criteria, metrics |
| [Learning system and curriculum](docs/03-learning-and-curriculum.md) | 15-minute framework, six pathways, assessment, ChatGPT in a Day |
| [UX and UI specification](docs/04-ux-ui.md) | Navigation, screens, wireframes, interaction and accessibility |
| [Architecture](docs/05-architecture.md) | Stack, data model, APIs, tutor boundaries, deployment and cloud portability |
| [Delivery and QA](docs/06-delivery-and-quality.md) | Milestones, backlog, acceptance tests, security, AI evaluations |
| [Codex and GitHub workflow](docs/07-codex-github-workflow.md) | VS Code setup, repo structure, ownership, CI, release process |
| [Sources and decisions](docs/08-sources-and-decisions.md) | Verified OpenAI terminology, assumptions and unresolved decisions |
| [Unified Codex team prompt](prompts/UNIFIED-CODEX-TEAM-PROMPT.md) | Copy-paste implementation instructions for the lead agent and specialists |
| [Repository agent template](templates/AGENTS.template.md) | Instructions to install as AGENTS.md at implementation kickoff |
| [Example lesson](content/lessons/foundation-001.json) | Machine-readable, fully authored 15-minute lesson |

## Founder decisions

- **Primary launch audience:** English-speaking information workers in small teams; everyday learners enter through the free foundation course. Geography remains a pilot decision.
- **MVP:** responsive web app, two complete learning paths, deterministic progress and grading, optional constrained AI coaching, and a private portfolio.
- **Differentiator to test:** demonstrated transfer to a real task, with versioned content and role-specific practice. Time watched and streaks are supporting signals.
- **Business hypothesis:** individual subscriptions plus later team licenses. Prices and conversion targets in this pack are experiments, not market evidence.
- **Technology direction:** a TypeScript modular monolith, PostgreSQL, authored lessons in Git, and a server-side OpenAI integration. Multi-cloud teaching does not require multi-cloud production infrastructure at launch.

## Use this pack in Codex

Open this folder in VS Code with Codex. Read the strategy and MVP scope, then paste [the unified prompt](prompts/UNIFIED-CODEX-TEAM-PROMPT.md) into Codex. It explicitly authorizes bounded specialist delegation, defines file ownership and gates, and provides a sequential fallback when subagents are unavailable.

## Run the local F01 preview

Requires Node.js 24.15+ (the app uses the built-in SQLite module). The seed is a draft for synthetic practice and is not approved course content.

```powershell
npm ci
$env:SKILLSPRINT_LOCAL_DEMO = 'true'
$env:SKILLSPRINT_DB_PATH = '.data/skillsprint-local.sqlite'
npm run dev
```

Open `http://localhost:3000`. Attempts persist in the ignored `.data` SQLite file. The preview uses a single synthetic local learner; do not host it or enter real learner data. It makes no OpenAI calls. To check it, run `npm run typecheck`, `npm run test`, `npm run lint`, `npm run content:validate`, and `npm run build`. Browser tests need Chromium installed with `npx playwright install chromium`, then `npm run test:e2e`.

No GitHub repository, remote, issue, pull request, cloud resource, or paid subscription has been created. See the workflow document for the repository setup sequence.

All design choices are proposals unless marked verified. Product capabilities were checked against official documentation on the preparation date; availability must be rechecked in the account used for implementation. See [the source register](docs/08-sources-and-decisions.md).

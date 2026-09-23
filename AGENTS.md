# Repository instructions for SkillSprint AI

Read README.md, docs/02-product-requirements.md, docs/05-architecture.md and docs/06-delivery-and-quality.md before changing application behavior. Keep changes within assigned file ownership and preserve unrelated user changes.

The local implementation is synthetic and development-only. Hosted mode must fail closed unless real session authentication and persistent storage are configured. Never infer identity from a browser-supplied user ID. Keep learner artifacts private, answer keys on the server until assessment, and AI coaching disabled unless explicitly configured.

Completion, proficiency and transfer are separate. Scoring, ownership, review scheduling and budget enforcement are deterministic server-side logic. The coach cannot alter scores. Published lesson versions are immutable; the current seed lesson remains a draft pending editorial review.

Use the lockfile and documented scripts. Keep secrets out of Git, analytics, test fixtures and logs. Do not describe mock integrations, unrun checks, or local synthetic data as production functionality. Update docs/IMPLEMENTATION-STATUS.md with changes and evidence.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository instructions for SkillSprint AI

Install as root AGENTS.md at implementation kickoff after reconciling existing instructions.

Read README.md, docs/02-product-requirements.md, docs/05-architecture.md and docs/06-delivery-and-quality.md before changing application behavior. Record material decisions and implementation status in docs. Preserve user edits and keep changes within the assigned scope.

Default delivery target is the documented MVP. Use the project package manager and lockfile. Verify dependencies and API capabilities against current official documentation before introducing them. Keep keys server-side and out of Git, logs, fixtures and screenshots.

Lesson completion, authorization, quiz scoring and usage limits must be deterministic server-side logic. Coaching is optional and cannot change grades. Authored lessons are versioned and reviewed. Demo data must be synthetic; demo authentication must never be enabled in a hosted production environment.

When the user invokes the unified team prompt, use bounded specialist delegation where supported. Assign file ownership before concurrent edits. The lead alone coordinates shared contracts, manifests, lockfiles and migrations. Independent review must validate observed results rather than restate an author's claims.

Run the relevant checks for changed behavior; report commands actually run and their results. Never describe mock behavior as a live integration, unrun tests as passing, or a proposed deployment as deployed. Update the implementation status with remaining blockers and next steps.

Do not publish, deploy, create paid resources, transmit learner data or send communications without applicable user authorization. Continue local work and prepare a concrete reviewable result while external destinations or credentials are unavailable.

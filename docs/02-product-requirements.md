# Product requirements

## Product boundary

MVP is an English-language responsive web application for adults, with eight Everyday AI lessons and twelve AI at Work lessons. It teaches external OpenAI products and provides its own clearly labeled learning coach. It is not a ChatGPT clone, account reseller, autonomous workplace operator, or official OpenAI certification program.

Learners can complete lessons with static examples without an external paid account. Optional “try in ChatGPT” exercises explain access requirements before leaving the app. The app cannot verify activity in an external ChatGPT tab; learner submissions are evidence supplied by the learner, not telemetry from that product.

## Scope

| Priority | Capability | MVP decision |
|---|---|---|
| P0 | Onboarding: outcome, role, baseline, 15/30/45/60 minutes, timezone | Required; skippable diagnostic defaults to beginner |
| P0 | Today plan and ordered lesson player | Required; pause and resume across devices |
| P0 | Twenty authored, versioned lessons | Required for pilot release; only one seed lesson is authored in this pack |
| P0 | Practice submission, deterministic quiz, rubric checklist | Required; completion and mastery tracked separately |
| P0 | Review queue and private portfolio | Required; text artifacts only in MVP |
| P0 | Authentication, ownership controls, deletion/export | Required before pilot with real personal data |
| P0 | Event instrumentation and operational cost limits | Required; exclude raw prompt text from analytics |
| P0 | Content review workflow in Git | Required; no separate CMS UI |
| P1 | Optional AI hints grounded in the active lesson | Enabled only after evaluation gate; static hints always available |
| P1 | Opt-in email reminders | After core loop; delivery integration can remain disabled in pilot |
| P1 | Basic admin cohort export | After privacy and authorization tests |
| Later | Advanced pathways including AI for Students, paid subscriptions, team dashboard | Subsequent releases; student study path must follow teacher rules and protect academic integrity |
| Later | Live coding sandboxes, agent labs, SSO, LMS, marketplace, mobile-native app | Separate scoped projects |

## Core stories and acceptance criteria

| ID | Story | Acceptance criteria |
|---|---|---|
| PR-01 | As a beginner who knows Google Search, I want to understand how ChatGPT can help | In plain language, compare finding web pages with a conversational assistant; show everyday examples; explain that important facts still need checking; no account or technical vocabulary is required |
| PR-02 | As a busy learner I want a 15-minute plan | Plans allocate 1/2/3/4 complete units for 15/30/45/60 minutes; current prerequisites hold; changing duration preserves attempts |
| PR-03 | As an interrupted learner I want to resume | Last completed step and saved draft reload after sign-out/sign-in; save failures are visible; no completion awarded by elapsed time |
| PR-04 | As a learner I want to practise | Task instructions, synthetic source material and required artifact are visible together; submit text with an explicit save action |
| PR-05 | As a learner I want useful assessment | Server scores answer keys; wrong answers include explanations; retries retain prior attempts; AI coach cannot alter quiz scores |
| PR-06 | As a learner I want evidence of progress | Completion requires practice submission and all check questions attempted; proficiency requires the separate rubric/quiz rule; portfolio item identifies evidence type |
| PR-07 | As a returning learner I want review | Due reviews use learner timezone and configurable spacing; missed reviews are carried forward; no locked-out progress |
| PR-08 | As a learner I want bounded coaching | Coach only sees permitted active lesson and explicitly submitted draft; feedback is labeled AI; timeout/quota returns static guidance |
| PR-09 | As a learner I want control of my data | Export owned attempts/artifacts; delete through a clear confirmation flow; another user cannot fetch or change them |
| PR-10 | As an editor I want trustworthy lessons | Draft cannot publish without source date, rubric, answers, accessibility checks and content reviewer approval |
| PR-11 | As a learner I want manageable pacing | Pause timer, extend time, save and leave; no score depends on speed; extra study is optional |
| PR-12 | As an operator I want bounded cost | Reserve budget before provider call; duplicates reuse a run; exhausted quota makes zero new paid calls |
| PR-13 | As a beginner I want an explanation in language I understand | Provide copy-ready requests for everyday language, a familiar analogy and Tagalog; clearly disclose that the preview copies a prompt and does not call an AI service |
| PR-14 | As a student I want AI to help me understand a hard topic | Teach step-by-step explanation, one-question practice, learner teach-back, trusted-source verification, school-policy compliance and privacy; do not position AI as a homework answer service |

## Planning and mastery rules

Use skill prerequisites, not role stereotypes, to sequence content. The onboarding diagnostic recommends a starting point; the learner may override it. Do not gate foundation access behind personal demographic data.

Each day allocate available units in this order: a due review bundle if any, the current unfinished lesson, then unlocked new lessons. A review bundle is itself a 15-minute planned unit with recall, practice and reflection. Limit reviews to one unit per day by default so an overdue queue cannot consume every new-learning slot. When the pathway ends, suggest transfer practice or another path.

`completed` means all required steps visited, an artifact submitted, and quiz questions attempted. `provisional_proficiency` means quiz score at least 80% and at least 6/8 on the four-dimension rubric, with no zero for verification or privacy. In MVP the artifact rubric is learner self-assessment and must display that fact. `verified_transfer` requires a later unseen task scored by a human reviewer under the same rule; this is a pilot research workflow, not an automated certificate.

Schedule review after 1, 3, 7, and 14 days following a successful check; a failed check schedules next-day practice. These are initial product rules to test, not claims of universally optimal learning science. Repeated practice never overwrites the original evidence.

## Analytics specification

Events: `onboarding_completed`, `plan_created`, `lesson_started`, `step_saved`, `practice_submitted`, `quiz_scored`, `lesson_completed`, `review_completed`, `coach_requested`, `coach_finished`, `coach_fallback`, `artifact_exported`.

Common fields: event ID, schema version, UTC timestamp, pseudonymous user ID, pathway ID, lesson ID/version, session ID and experiment assignment where applicable. Add duration, score, evidence type, provider latency and cost only to relevant events. Do not send drafts, artifacts, names, email, keys, or free-text prompts to analytics. Server owns authoritative score and completion events. Dedupe using event ID; count one completion per user/lesson/version.

North-star candidate: **weekly active learners completing at least one practice task that passes the declared assessment rule**. Report self-assessed and human-verified results separately. Pilot impact metric: share of assessed learners passing an unseen task seven days later, alongside the percentage returning for assessment.

Activation = first practice and check completed within 24 hours of onboarding. Week-four retained practice = activated learners doing practice during days 22–28 / all activated learners eligible to reach day 28. Lesson completion = completed attempts / started attempts, with an explicit inactivity window. Track median and p90 completion time; speed is diagnostic, not a reward.

## Nonfunctional targets

Proposed pilot targets: WCAG 2.2 AA design and test target; p75 Largest Contentful Paint under 2.5 seconds on the agreed test device/network; non-AI API p95 under 500 ms at 50 concurrent simulated learners; coach feedback p95 under 10 seconds or an explicit fallback; 99.5% monthly service availability target once public. These are acceptance targets, not measurements or compliance claims.

Local demo mode must run without provider credentials and use synthetic accounts and fixtures. Hosted environments must disable demo authentication. Offline caching may serve public lesson content; private artifacts require explicit persistence controls and are not cached by a service worker in MVP.

Student pathway is roadmap content only; the current preview has no live AI tutor. Initial MVP remains adult-only. Any future enrollment of minors requires a separate product, privacy, consent, safeguarding and school-policy review.

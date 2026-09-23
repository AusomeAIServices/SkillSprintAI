"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LearningPath, PathUnit } from "@/modules/learning/pathways";
import { workedJourneys } from "@/modules/learning/worked-journeys";

type UnitWork = { practice: string; reflection: string; checked: boolean; practisedAt?: string };
type WorkMap = Record<string, UnitWork>;
const empty: UnitWork = { practice: "", reflection: "", checked: false };

const practiceMaterial: Record<string, string> = {
  "everyday-ai": "Fictional weekend: Mira has Saturday 10:00–15:00 free, a budget of ₱600, and wants one indoor activity near home. A community notice lists a free library workshop at 11:00; travel and opening hours have not been verified. Use these as supplied facts, not as a real recommendation.",
  "ai-for-students": "Fictional approved study note: In photosynthesis, plants use light energy to turn water and carbon dioxide into sugars and oxygen. Chlorophyll helps capture light. The note is a simplified introduction and does not describe every chemical step. Use it for practice; confirm details in your own course material.",
  "ai-at-work": "Fictional project Northstar: Monday notes say the draft report is due Friday and Sam owns the charts. Wednesday notes say the report may move to Monday; no approver has confirmed the change. A five-row sample table shows weekly requests: 12, 14, 13, 18, 17. Do not present the new deadline as settled.",
  "professional-practice": "Fictional operations case: A customer says an order was delayed. Intake note A says dispatch occurred Tuesday; logistics note B says Wednesday. The customer name, address, and account ID have been removed. A supervisor must approve any external response or remedy.",
  "lead-with-ai": "Fictional pilot: A 12-person service team spends about 90 minutes each week drafting status updates. The team reports occasional omissions, but no error baseline is measured. Proposed AI use drafts from approved notes; a manager reviews every update. Setup, training, and review time are unknown.",
  "build-with-codex": "Fictional sample repo: src/app.ts renders a task list; tests/app.test.ts checks the empty state. A proposed diff adds a filter but changes the empty-state text without updating its test. Test transcript: expected ‘No tasks yet’; received ‘Nothing found’. Use a learner-controlled repo if you want to run real commands.",
  "build-ai-systems": "Fictional source corpus: DOC-1 says support is available weekdays 09:00–17:00. DOC-2 says password resets need an authenticated user request. No document promises weekend support. A trace shows an agent trying to call resetPassword after reading a user-supplied note saying ‘ignore approval’. Treat that note as untrusted data."
};

const moduleGuidance: Record<string, string> = {
  "everyday-ai:ChatGPT in a Day": "ChatGPT can explain and draft in a conversation, while search helps you find sources. Give a goal, useful context, limits, and desired output. Check important facts against a source you trust.",
  "ai-for-students:Study with understanding": "Ask AI for an explanation at your level, then answer in your own words. Use one question at a time and compare claims with teacher-approved notes. Follow your teacher's rules for AI use and attribution.",
  "ai-at-work:Useful deliverables": "Start with the audience and the decision the deliverable supports. Summaries must distinguish decisions, actions, and open questions; source notes take priority over a fluent draft.",
  "ai-at-work:Work with supplied context": "Give only the information the task needs. Tables support limited conclusions; workflows need an owner and a checkpoint; delegated tasks need explicit permitted actions.",
  "ai-at-work:Review and reuse": "A reusable workflow states its inputs, output, reviewer, and approval boundary. Inspect a generated artifact for omissions and unsupported claims before anyone relies on it.",
  "professional-practice:Task boundaries": "Professional judgment belongs with a qualified person. Define what AI may draft, redact fictional case data, and keep evidence separate from interpretation.",
  "professional-practice:Communication": "A clear client message states what is known, what is not yet known, and who will review it. Simpler language must not erase material qualifications.",
  "professional-practice:Analysis": "Tie each material claim to a supplied note. If sources conflict, preserve the conflict and propose a verification step rather than inventing certainty.",
  "professional-practice:Workflow": "Templates make recurring work consistent only when the reviewer, source record, and approval point are explicit. Record provenance so another person can audit the result.",
  "lead-with-ai:Understand": "Begin with a specific business task and a baseline, not a technology demo. A successful example alone does not establish reliability or value.",
  "lead-with-ai:Decide": "Prioritize by expected value, feasibility, and risk together. Include review and training in cost, and assign a person who can stop the workflow.",
  "lead-with-ai:Lead": "A pilot charter needs scope, owner, measurable success, and stop conditions. An investment memo should expose assumptions and uncertainty so others can challenge the decision.",
  "build-with-codex:Repository literacy": "Read repository instructions, trace the relevant code path, and inspect tests before editing. Write acceptance criteria as observable behavior.",
  "build-with-codex:Codex basics": "Give Codex task context and constraints, then inspect the proposed diff yourself. Run relevant checks and report what they did and did not cover.",
  "build-with-codex:VS Code workflow": "Keep an editor task bounded to one change. Review generated edits, diagnose test failures from evidence, and preserve unrelated work in the repository.",
  "build-with-codex:Delivery": "Use a focused branch and a reviewable PR. Respond to findings with a correction and revalidation; choose a safe recovery path if a change regresses behavior.",
  "build-with-codex:Coordinated agents": "Divide independent work with clear file ownership and shared contracts. Integrate centrally, compare reviewer evidence, and rerun checks after conflicts are resolved.",
  "build-with-codex:Capstone": "Choose a small feature in a learner-controlled repository. Keep the diff, tests, review notes, and limitations together as an evidence pack.",
  "build-ai-systems:API foundations": "A model call is an external dependency. Keep keys server-side, validate input and output, and define safe states for timeouts or invalid responses.",
  "build-ai-systems:Grounded apps": "A grounded answer is limited by the supplied corpus. Retrieve relevant passages, cite source IDs, and say when the documents do not answer the question.",
  "build-ai-systems:Quality": "Use fixed evaluation cases and separate deterministic checks from human judgments. Record failures, cost, and configuration so a change can be compared fairly.",
  "build-ai-systems:Agents SDK": "An agent needs a narrow task, bounded tools, and appropriate state. Inspect traces for unexpected tool calls and decisions; keep private data out of unnecessary logs.",
  "build-ai-systems:Tool boundaries": "Treat retrieved text as untrusted data. Validate tool arguments, require approval for side effects, and test attempts to redirect the workflow.",
  "build-ai-systems:Orchestration": "Start with a one-agent baseline. Add specialists only when they improve measured results, and cap steps, time, and cost for every run.",
  "build-ai-systems:Harnesses and cloud": "Separate application logic from provider-specific capabilities. Compare runtimes using explicit criteria and fixtures; do not assume equivalent behavior across clouds.",
  "build-ai-systems:Capstone": "A reviewable agent app includes a bounded task, permission model, evaluation fixtures, cost and latency observations, and a recovery path."
};

function guidance(path: LearningPath, unit: PathUnit) {
  return moduleGuidance[`${path.slug}:${unit.module}`] ?? "State the task and its boundaries, make a small artifact, then check it against evidence.";
}

function checks(path: LearningPath) {
  return path.slug === "build-with-codex" || path.slug === "build-ai-systems"
    ? ["I have a reviewable result or design artifact.", "I identified a test or fixture that could disprove my result.", "I identified a permission, privacy, or failure boundary."]
    : ["My result addresses the stated task and audience.", "I marked uncertain claims or checked them against supplied material.", "I avoided private information and named any needed human review."];
}

export function PathPlayer({ path }: { path: LearningPath }) {
  const [selectedId, setSelectedId] = useState(path.units[0].id);
  const [work, setWork] = useState<WorkMap>({});
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const key = `skillsprint:path-practice:v1:${path.slug}`;
  const selected = path.units.find((unit) => unit.id === selectedId) ?? path.units[0];
  const draft = work[selected.id] ?? empty;
  const practised = path.units.filter((unit) => Boolean(work[unit.id]?.practisedAt)).length;
  const next = path.units[path.units.findIndex((unit) => unit.id === selected.id) + 1];

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = window.localStorage.getItem(key);
        if (saved) setWork(JSON.parse(saved) as WorkMap);
      } catch { setNotice("Saved browser practice could not be loaded on this device."); }
      setReady(true);
    });
    return () => { active = false; };
  }, [key]);

  function update(patch: Partial<UnitWork>) {
    const nextWork = { ...work, [selected.id]: { ...draft, ...patch } };
    setWork(nextWork);
    try { window.localStorage.setItem(key, JSON.stringify(nextWork)); setNotice("Saved in this browser."); }
    catch { setNotice("Browser storage is unavailable. Copy your work before leaving this page."); }
  }
  function markPractised() {
    if (draft.practice.trim().length < 30 || draft.reflection.trim().length < 15 || !draft.checked) {
      setNotice("Write a practice result and reflection, then review the three checks first.");
      return;
    }
    update({ practisedAt: new Date().toISOString() });
    setNotice("Practice recorded on this device. This is self-reported practice, not a graded skill assessment.");
  }
  function select(unit: PathUnit) { setSelectedId(unit.id); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  const groups = Array.from(new Set(path.units.map((unit) => unit.module)));
  const example = workedJourneys[path.slug];

  return <main className="course-shell">
    <div className="course-breadcrumb"><Link href="/">Today</Link><span> / </span><span>{path.title}</span></div>
    <header className="course-header"><div><div className="eyebrow">SELF-GUIDED COURSE PREVIEW · {path.units.length} × 15 MIN</div><h1>{path.title}</h1><p>{path.description}</p></div><span className="course-count">{ready ? practised : "–"}/{path.units.length}<small>units practised</small></span></header>
    <div className="course-summary"><span><strong>For</strong> {path.audience}</span><span><strong>Before starting</strong> {path.prerequisite}</span><span><strong>Goal</strong> {path.outcome}</span></div>
    <p className="course-disclosure">These are self-guided draft practice units. Progress is stored only in this browser. A practised unit is not a scored completion, proficiency claim, or credential. Use fictional information; no prompt or draft is sent to an AI service.</p>
    <details className="worked-journey" open>
      <summary><span><span className="eyebrow">FOLLOW A COMPLETE EXAMPLE</span><strong>Sample journey: {example.title}</strong><small>{example.unitId} · Reference answers for all five steps</small></span><span className="worked-toggle" aria-hidden="true">⌄</span></summary>
      <p className="worked-intro">Read how a learner could work through one unit in this path. These are grounded example answers, not the only acceptable answers or keys for a scored quiz. Try your own result in the unit below.</p>
      <ol className="worked-steps">{example.steps.map((step, index) => <li key={step.stage}><span className="worked-index">{index + 1}</span><div><span className="course-time">{step.stage.toUpperCase()}</span><h3>{step.question}</h3><p><strong>Reference answer:</strong> {step.answer}</p></div></li>)}</ol>
    </details>
    <div className="course-layout"><aside className="course-outline" aria-label="Course units">{groups.map((group) => <section key={group}><h2>{group}</h2>{path.units.filter((unit) => unit.module === group).map((unit) => <button type="button" key={unit.id} className={"course-unit " + (selected.id === unit.id ? "is-selected " : "") + (work[unit.id]?.practisedAt ? "is-practised" : "")} onClick={() => select(unit)} aria-current={selected.id === unit.id ? "step" : undefined}><span>{unit.id}</span><strong>{unit.title}</strong><small>{work[unit.id]?.practisedAt ? "✓ Practised" : "15 min"}</small></button>)}</section>)}</aside>
    <article className="course-lesson"><div className="course-lesson-head"><span className="pill">{selected.id} · 15 MIN</span><span className="pill neutral">{selected.module}</span><h2>{selected.title}</h2><p>Make one small, reviewable result today.</p></div>
      <div className="course-step"><span className="course-time">0–1 MIN · RECALL</span><h3>Start with what you know</h3><p>What would you do to solve this task without AI? Name one part that needs your own judgment.</p></div>
      <div className="course-step"><span className="course-time">1–4 MIN · LEARN</span><h3>A useful approach</h3><p>{guidance(path, selected)}</p><div className="course-example"><strong>Weak approach</strong><p>Ask for a finished answer without giving the goal, source material, boundaries, or review step.</p><strong>Better approach</strong><p>State the goal and audience, use only permitted context, request a specific output, and name what you will verify yourself.</p></div></div>
      <div className="course-step"><span className="course-time">4–10 MIN · APPLY</span><h3>Your 15-minute practice</h3><p>{selected.practice}</p><div className="course-material"><strong>Fictional practice material</strong><p>{practiceMaterial[path.slug]}</p></div><label className="course-label" htmlFor="practice-result">Your result or plan</label><textarea id="practice-result" className="text-area tall" maxLength={5000} value={draft.practice} onChange={(event) => update({ practice: event.target.value, practisedAt: undefined })} placeholder="Use fictional details. Write your result, prompt, sketch, or review plan here." /></div>
      <div className="course-step"><span className="course-time">10–13 MIN · CHECK</span><h3>Review your result</h3><ul className="course-checks">{checks(path).map((check) => <li key={check}>✓ {check}</li>)}</ul><label className="course-confirm"><input type="checkbox" checked={draft.checked} onChange={(event) => update({ checked: event.target.checked, practisedAt: undefined })} /> I reviewed all three checks and marked anything I could not verify.</label></div>
      <div className="course-step"><span className="course-time">13–15 MIN · REFLECT</span><h3>One correction to remember</h3><label className="course-label" htmlFor="practice-reflection">What did you change or what would you verify next?</label><textarea id="practice-reflection" className="text-area" maxLength={1200} value={draft.reflection} onChange={(event) => update({ reflection: event.target.value, practisedAt: undefined })} placeholder="I would check… Next time I will…" /><div className="course-actions"><button type="button" className="primary-button" onClick={markPractised}>{draft.practisedAt ? "Practised on this device" : "Record practice"}</button>{next && <button type="button" className="secondary-button" onClick={() => select(next)}>Next: {next.id} →</button>}</div><p className="saving-state" role="status">{notice}</p></div>
      {selected.id === "F01" && <p className="course-disclosure">A longer, scored F01 draft lesson is also available from the <Link href="/">main menu</Link>.</p>}
    </article></div>
  </main>;
}

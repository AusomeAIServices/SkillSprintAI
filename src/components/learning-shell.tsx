"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { STEP_IDS, type Attempt, type LearnerDraft, type LearnerLesson, type PrivateArtifact, type StepId } from "@/modules/learning/types";

type SavePatch = { currentStep?: StepId; draftPatch?: Partial<LearnerDraft> };
type SaveState = "saved" | "saving" | "error";
const stepDescriptions: Record<StepId, string> = { recall: "You already know how to ask a question. Here is what changes.", learn: "Use everyday words, add helpful details and ask a follow-up.", apply: "Practise with a familiar task and fictional information.", check: "Choose an answer for each question, then rate your own work.", reflect: "Save one result you can return to and reuse." };
const paths = [
  { icon: "✦", color: "", title: "Everyday AI", detail: "Useful AI skills for everyday life", state: "Ready to start" },
  { icon: "▤", color: "green", title: "AI at Work", detail: "Writing, summaries and repeatable workflows", state: "Coming soon" },
  { icon: "◎", color: "amber", title: "Lead with AI", detail: "Choose and guide responsible AI projects", state: "Planned" },
  { icon: "⌘", color: "blue", title: "Build with Codex", detail: "Turn ideas into tested code changes", state: "Planned" },
];

function Icon({ children }: { children: ReactNode }) { return <span className="nav-icon" aria-hidden="true">{children}</span>; }
function TopBar() {
  return <header className="topbar"><Link className="brand" href="/" aria-label="SkillSprint AI home"><span className="brand-mark" aria-hidden="true">S</span>SkillSprint AI</Link><div className="topbar-right"><span>Learning preview</span><span className="avatar" aria-label="Local learner profile">A</span></div></header>;
}
function NavLinks({ mobile = false }: { mobile?: boolean }) {
  return <nav className={mobile ? "mobile-nav" : "side-nav"} aria-label={mobile ? "Mobile navigation" : "Main navigation"}>
    {!mobile && <p className="nav-label">Your learning</p>}
    <a className="nav-link active" href="#today"><Icon>⌂</Icon>Today</a>
    <a className="nav-link" href="#paths"><Icon>▦</Icon>{mobile ? "Paths" : "Learning paths"}</a>
    <a className="nav-link" href="#portfolio"><Icon>▤</Icon>{mobile ? "Saved" : "My portfolio"}</a>
    <a className="nav-link" href="#progress"><Icon>◷</Icon>{mobile ? "Progress" : "My progress"}</a>
    {!mobile && <div className="side-note"><strong>Small steps add up.</strong>Take one complete 15-minute lesson, then come back for the next one when it fits your day.</div>}
  </nav>;
}

export default function LearningShell() {
  const [currentStep, setCurrentStep] = useState<StepId | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [lessonData, setLessonData] = useState<LearnerLesson | null>(null);
  const [artifact, setArtifact] = useState<PrivateArtifact | null>(null);
  const [duration, setDuration] = useState(15);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAssessing, setIsAssessing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [reviewDue, setReviewDue] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const rowVersionRef = useRef(1);
  const saveChain = useRef<Promise<void>>(Promise.resolve());
  const pendingDraft = useRef<Partial<LearnerDraft>>({});
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setLatestAttempt = useCallback((next: Attempt) => { rowVersionRef.current = next.rowVersion; setAttempt(structuredClone(next)); }, []);
  const request = useCallback(async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...init?.headers }, cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(body.error || "Something went wrong. Your saved work is still here."), { status: response.status, body });
    return body;
  }, []);

  const enqueuePatch = useCallback((patch: SavePatch) => {
    const job = saveChain.current.then(async () => {
      const existing = attempt;
      if (!existing || existing.completedAt) return existing;
      setSaveState("saving");
      const result = await request("/api/attempts/" + existing.id, { method: "PATCH", body: JSON.stringify({ expectedRowVersion: rowVersionRef.current, ...patch }) });
      setLatestAttempt(result.attempt as Attempt);
      setSaveState("saved");
      return result.attempt as Attempt;
    });
    saveChain.current = job.then(() => undefined, () => undefined);
    return job;
  }, [attempt, request, setLatestAttempt]);

  const flushPendingDraft = useCallback(async () => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = null;
    const draftPatch = pendingDraft.current;
    pendingDraft.current = {};
    if (Object.keys(draftPatch).length) await enqueuePatch({ draftPatch });
    await saveChain.current;
  }, [enqueuePatch]);

  const refreshProgress = useCallback(async () => {
    try {
      const result = await request("/api/progress");
      setArtifact(result.artifact as PrivateArtifact | null);
      const due = (result.reviews as Array<{ due_at: string }>).at(-1)?.due_at;
      setReviewDue(due || null);
    } catch { /* Progress can recover on a later load; it never blocks lesson work. */ }
  }, [request]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const content = await request("/api/lessons/foundation-001");
        if (!mounted) return;
        setLessonData(content as LearnerLesson);
        const loaded = await request("/api/attempts/current");
        if (!mounted) return;
        if (loaded.attempt) {
          setLatestAttempt(loaded.attempt as Attempt);
          if (!loaded.attempt.completedAt) setCurrentStep((loaded.attempt.currentStep || "recall") as StepId);
          setAnswers(loaded.attempt.draft.quizAnswers || {});
          const progress = await request("/api/progress");
          if (!mounted) return;
          setArtifact(progress.artifact as PrivateArtifact | null);
          const due = (progress.reviews as Array<{ due_at: string }>).at(-1)?.due_at;
          setReviewDue(due || null);
        }
      } catch {
        if (mounted) setMessage("The local preview could not start. Check that the development server and local demo are enabled.");
      } finally { if (mounted) setIsLoading(false); }
    })();
    return () => { mounted = false; };
  }, [request, setLatestAttempt]);

  const startLesson = useCallback(async () => {
    setMessage(""); setIsLoading(true);
    try {
      const result = await request("/api/attempts/current", { method: "POST" });
      setLatestAttempt(result.attempt as Attempt);
      setCurrentStep((result.attempt.currentStep || "recall") as StepId);
      window.setTimeout(() => document.getElementById("lesson-title")?.focus(), 0);
    } catch { setMessage("We couldn't open the lesson. Your saved work has not been changed."); }
    finally { setIsLoading(false); }
  }, [request, setLatestAttempt]);

  const updateDraft = useCallback((field: keyof LearnerDraft, value: string | Record<string, number> | Record<string, string>) => {
    const existing = attempt;
    if (!existing || existing.completedAt) return;
    const draftPatch = { [field]: value } as Partial<LearnerDraft>;
    setLatestAttempt({ ...existing, draft: { ...existing.draft, ...draftPatch } });
    pendingDraft.current = { ...pendingDraft.current, ...draftPatch };
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      const nextPatch = pendingDraft.current;
      pendingDraft.current = {};
      draftTimer.current = null;
      void enqueuePatch({ draftPatch: nextPatch }).catch(() => {
        setSaveState("error"); setMessage("That change could not be saved. Your text remains on screen; try Save again.");
      });
    }, 350);
  }, [attempt, enqueuePatch, setLatestAttempt]);

  const saveNow = useCallback(async () => {
    try { await flushPendingDraft(); await enqueuePatch({}); setMessage("Your work is saved on this device."); }
    catch { setSaveState("error"); setMessage("We couldn't save your latest change. Your text remains on screen; try again."); }
  }, [enqueuePatch, flushPendingDraft]);

  const navigateStep = useCallback(async (nextIndex: number) => {
    if (!attempt || nextIndex < 0 || nextIndex >= STEP_IDS.length) return;
    try {
      await flushPendingDraft();
      await enqueuePatch({ currentStep: STEP_IDS[nextIndex] });
      setCurrentStep(STEP_IDS[nextIndex]); setMessage("");
      window.setTimeout(() => document.getElementById("step-title")?.focus(), 0);
    } catch { setSaveState("error"); setMessage("We couldn't save your last change. Try Save and continue again."); }
  }, [attempt, enqueuePatch, flushPendingDraft]);

  const submitAssessment = useCallback(async () => {
    const current = attempt;
    if (!current || isAssessing) return;
    if (!lessonData?.quiz.every((question) => answers[question.id])) {
      setMessage("Choose one answer for all three questions before checking your understanding."); return;
    }
    if (!lessonData?.rubric.every((item) => Number.isInteger(current.draft.rubric[item.id]))) {
      setMessage("Give yourself a 0–2 rating for each part of the rubric first."); return;
    }
    setIsAssessing(true); setMessage("");
    try {
      await flushPendingDraft();
      const response = await request("/api/attempts/" + current.id + "/assessment", { method: "POST", body: JSON.stringify({ answers, rubric: current.draft.rubric }) });
      setLatestAttempt(response.attempt as Attempt); setMessage("Your check has been scored. The lesson explains each answer below.");
    } catch { setMessage("We couldn't score that yet. Your answers remain selected; try again."); }
    finally { setIsAssessing(false); }
  }, [answers, attempt, flushPendingDraft, isAssessing, lessonData, request, setLatestAttempt]);

  const completeLesson = useCallback(async () => {
    const current = attempt;
    if (!current || isCompleting) return;
    setIsCompleting(true); setMessage("");
    try {
      await flushPendingDraft();
      const result = await request("/api/attempts/" + current.id + "/complete", { method: "POST", body: "{}" });
      setLatestAttempt(result.attempt as Attempt); setArtifact(result.artifact as PrivateArtifact | null); setCurrentStep(null);
      await refreshProgress(); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if ((error as { status?: number }).status === 400) setMessage("Finish all five steps, save each practice field, answer all three questions and complete the self-check before finishing.");
      else setMessage("We couldn't finish saving your lesson. Your draft is still here; try again.");
    } finally { setIsCompleting(false); }
  }, [attempt, flushPendingDraft, isCompleting, refreshProgress, request, setLatestAttempt]);

  const sessionUnits = duration / 15;
  const progressPercent = attempt?.completedAt ? 100 : attempt ? Math.round((attempt.visitedSteps.length / 5) * 100) : 0;
  if (isLoading && !attempt) return <><TopBar /><main className="app-layout"><div className="loading-card" role="status">Opening your learning space…</div></main></>;

  if (currentStep && attempt && lessonData) return <><TopBar /><LessonWorkspace currentStep={currentStep} attempt={attempt} answerValues={answers} lessonData={lessonData}
    saveState={saveState} message={message} isAssessing={isAssessing} isCompleting={isCompleting}
    onSave={saveNow} onNavigate={navigateStep} onDraft={updateDraft}
    onAnswer={(questionId, choiceId) => { const next = { ...answers, [questionId]: choiceId }; setAnswers(next); updateDraft("quizAnswers", next); }}
    onAssess={submitAssessment} onComplete={completeLesson} onBack={() => { setCurrentStep(null); setMessage(""); }} /></>;

  if (attempt?.completedAt && artifact) return <><TopBar /><main className="lesson-wrap"><Completion artifact={artifact} attempt={attempt} reviewDue={reviewDue} onHome={() => setCurrentStep(null)} /></main><NavLinks mobile /></>;

  return <><TopBar /><div className="app-layout" id="today">
    <NavLinks />
    <main className="main-column">
      <div className="welcome-row"><div><div className="eyebrow">YOUR DAILY PRACTICE</div><h1>New to AI? Start with what you already know.</h1><p>If you can search Google, you can start a conversation with ChatGPT. No AI experience needed.</p></div>
        <label className="field" style={{ maxWidth: 138 }}><span className="sr-only">Choose daily learning time</span><select className="duration-select" value={duration} onChange={(event) => {
          const next = Number(event.target.value); setDuration(next);
          try { localStorage.setItem("skillsprint-daily-minutes", String(next)); } catch { /* optional preference */ }
        }} aria-label="Daily learning time"><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option></select></label>
      </div>
      {message && <p className="inline-error" role="alert">{message}</p>}
      <section className="hero-card" aria-labelledby="today-title"><div className="hero-content">
        <div className="pill-row"><span className="pill">✦ TODAY&apos;S PICK</span><span className="pill neutral">{sessionUnits} × 15 min</span></div>
        <h2 id="today-title">From Google search to ChatGPT</h2>
        <p>See how a familiar question can become an explanation, a draft or a simple plan—and when to check the answer.</p>
        <div className="hero-meta"><span>◷ &nbsp;15 min</span><span className="meta-dot" /><span>Beginner friendly</span><span className="meta-dot" /><span>Everyday AI</span></div>
        <div className="button-row"><button className="primary-button" onClick={() => void startLesson()}>Start your first AI lesson <span aria-hidden="true">→</span></button><span style={{ color: "var(--muted)", fontSize: 11 }}>{sessionUnits > 1 ? "One of " + sessionUnits + " planned units is ready in this preview." : "One complete learning unit"}</span></div>
        <p className="preview-notice">F01 is a draft preview with fictional practice. No ChatGPT account is needed, and nothing is sent to ChatGPT.</p>
      </div></section>
      <div className="section-heading" id="paths"><h2>Choose a learning path</h2><a href="#paths">Browse paths&nbsp; →</a></div>
      <section className="path-grid" aria-label="Learning paths">{paths.map((path) => <article className="path-card" key={path.title}>
        <div className="path-top"><span className={"path-icon " + path.color}>{path.icon}</span><span className="planned-chip">{path.state}</span></div>
        <h3 className="path-title">{path.title}</h3><p className="path-description">{path.detail}</p>
      </article>)}</section>
      <section className="progress-card" id="progress" aria-label="Your weekly progress"><div className="progress-head"><strong>This week</strong><span>{attempt?.completedAt ? "1 learning unit completed" : attempt ? "Lesson in progress" : "Your first practice starts here"}</span></div>
        <div className="progress-track" role="progressbar" aria-label="Current lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}><div className="progress-fill" style={{ width: progressPercent + "%" }} /></div>
        <div className="review-row"><span className="review-icon" aria-hidden="true">◷</span><span>{reviewDue ? "A short review is scheduled for " + new Date(reviewDue).toLocaleDateString() + "." : "A short review will appear after your first lesson."}</span></div>
      </section>
      <section className="progress-card" id="portfolio" aria-label="My portfolio"><div className="progress-head"><strong>My portfolio</strong><span>{artifact ? "1 private result" : "Your saved work stays private"}</span></div>{artifact ? <div className="review-row"><span className="review-icon" aria-hidden="true">▤</span><span>{artifact.lessonId} · {artifact.lessonVersion} · learner self-assessment</span></div> : <div className="review-row"><span className="review-icon" aria-hidden="true">✦</span><span>Your first saved learning result will appear here.</span></div>}</section>
      <p className="footer-note">Learn at your own pace. There is no score for finishing quickly.</p>
    </main>
  </div><NavLinks mobile /></>;
}

function LessonWorkspace(props: {
  currentStep: StepId; attempt: Attempt; answerValues: Record<string, string>; lessonData: LearnerLesson;
  saveState: SaveState; message: string; isAssessing: boolean; isCompleting: boolean;
  onSave: () => void; onNavigate: (index: number) => void;
  onDraft: (field: keyof LearnerDraft, value: string | Record<string, number> | Record<string, string>) => void;
  onAnswer: (questionId: string, choiceId: string) => void; onAssess: () => void; onComplete: () => void; onBack: () => void;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const index = STEP_IDS.indexOf(props.currentStep);
  const step = props.lessonData.steps[index];
  const score = props.attempt.assessment;
  const resultByQuestion = useMemo(() => new Map(score?.explanations.map((entry) => [entry.questionId, entry])), [score]);
  const navigate = async (nextIndex: number) => {
    if (isNavigating) return;
    setIsNavigating(true);
    try { await props.onNavigate(nextIndex); }
    finally { setIsNavigating(false); }
  };
  const previous = () => void navigate(index - 1);
  const next = () => void navigate(index + 1);
  return <main className="lesson-wrap">
    <div className="lesson-toolbar"><button className="back-link" onClick={props.onBack}><span aria-hidden="true">←</span> Today</button>
      <div className="toolbar-actions"><span className="saved-label" aria-live="polite">{props.saveState === "saving" ? "Saving…" : props.saveState === "error" ? "Not saved" : "● Saved"}</span><button className="quiet-button" onClick={props.onSave}>Save and exit</button></div>
    </div>
    <div className="lesson-heading"><div><div className="eyebrow">EVERYDAY AI · 15 MINUTES</div><h1 id="lesson-title" tabIndex={-1}>{props.lessonData.title}</h1><p>One small technique. One result you can use again.</p></div><span className="step-count">Step {index + 1} of 5</span></div>
    <div className="step-track" role="progressbar" aria-label="Lesson steps" aria-valuemin={1} aria-valuemax={5} aria-valuenow={index + 1}>{STEP_IDS.map((id, itemIndex) => <span key={id} className={"step-segment " + (itemIndex <= index ? "done" : "")} />)}</div>
    <section className="lesson-panel" aria-labelledby="step-title"><header className="lesson-panel-head"><div className="eyebrow">STEP {index + 1} · ABOUT {step.minutes} MIN</div><h2 id="step-title" tabIndex={-1}>{step.title}</h2><p>{stepDescriptions[props.currentStep]}</p></header>
      <div className="lesson-panel-body">
        {props.currentStep === "recall" && <><p className="lesson-copy">{step.text}</p><div className="example-card weak"><span className="example-label">Google Search</span><p>Find pages about a question, then choose which sources to open and check.</p></div><div className="example-card"><span className="example-label">ChatGPT</span><p>Ask, “Use these choices to plan a quiet afternoon. Keep it under $12 and leave me 30 minutes free.” It can organize the details into a schedule.</p></div><div className="callout">Use Search for current facts and official pages. ChatGPT can make mistakes or lack recent information, so verify claims that matter. Never enter private personal details in this fictional exercise.</div><p className="preview-notice">No ChatGPT account is needed. This lesson uses made-up information; nothing is sent to ChatGPT.</p></>}
        {props.currentStep === "learn" && <><p className="lesson-copy">{step.text}</p><div className="example-card weak"><span className="example-label">A broad request</span><p>{step.weakExample}</p></div><div className="example-card"><span className="example-label">A more useful request</span><p>{step.workedExample}</p></div><div className="callout">{step.privacyNote}</div><p className="lesson-copy">Goal · context · constraints · output. Add enough information to shape the result, then check any facts that matter.</p></>}
        {props.currentStep === "apply" && <><p className="lesson-copy">{props.lessonData.practice.deliverable}</p><details><summary style={{ color: "var(--brand)", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Show fictional practice facts</summary><ul className="source-list">{props.lessonData.practice.sourceFacts.map((fact) => <li key={fact.id}><span className="source-id">{fact.id}</span>{fact.text}</li>)}</ul></details>
          <div className="candidate-card"><strong>Sample ChatGPT-style reply (fictional)</strong>{props.lessonData.practice.candidateAnswer}</div>
          <div className="field-grid" style={{ marginTop: 17 }}>
            <Field label="1. Your prompt" hint="Include your goal, context, constraints and the format you want." value={props.attempt.draft.prompt} onChange={(value) => props.onDraft("prompt", value)} placeholder="Plan a quiet afternoon using only the facts above…" full />
            <Field label="2. Your corrected plan" hint="Leave the required 30-minute buffer and stay within the budget." value={props.attempt.draft.correctedPlan} onChange={(value) => props.onDraft("correctedPlan", value)} placeholder="Describe the schedule you would keep…" />
            <Field label="3. One source-based check" hint="Point to one supplied fact that supports your correction." value={props.attempt.draft.sourceCheck} onChange={(value) => props.onDraft("sourceCheck", value)} placeholder="I checked this against fact S…" />
            <Field label="4. What information is still unknown?" hint="Identify a claim the supplied facts do not establish." value={props.attempt.draft.unknowns} onChange={(value) => props.onDraft("unknowns", value)} placeholder="The facts do not tell us…" full />
          </div>
          <div className="hint-box"><h3>Try a lesson hint</h3><ul>{props.lessonData.staticHints.map((hint) => <li key={hint}>{hint}</li>)}</ul></div></>}
        {props.currentStep === "check" && <><p className="lesson-copy">{step.text} With these three questions, all three correct answers are needed to reach 80%.</p>
          <div className="quiz-list">{props.lessonData.quiz.map((question, questionIndex) => {
            const result = resultByQuestion.get(question.id);
            return <fieldset key={question.id} className="quiz-card"><legend>Question {questionIndex + 1}: {question.question}</legend>
              {question.choices.map((choice) => <label className="radio-option" key={choice.id}><input type="radio" name={question.id} value={choice.id} checked={props.answerValues[question.id] === choice.id} onChange={() => props.onAnswer(question.id, choice.id)} disabled={Boolean(score)} />{choice.text}</label>)}
              {result && <div className={"result-banner " + (result.correct ? "" : "fail")} role="status"><strong>{result.correct ? "Correct" : "Not quite"}</strong>{result.explanation}</div>}
            </fieldset>;
          })}</div>
          <h3 style={{ margin: "22px 0 6px", fontSize: 14 }}>Rate your own result</h3><p className="lesson-copy">This is a self-assessment, not an independent review. Choose 0 (not yet), 1 (partly) or 2 (yes).</p>
          <div className="rubric-list">{props.lessonData.rubric.map((criterion) => <div className="rubric-item" key={criterion.id}><div className="rubric-title">{criterion.id.replaceAll("-", " ")}</div><div className="rubric-criterion">{criterion.criterion}</div><div className="score-choices" role="group" aria-label={"Self-rating for " + criterion.id.replaceAll("-", " ")}>{[0, 1, 2].map((value) => <button key={value} type="button" className="score-choice" aria-pressed={props.attempt.draft.rubric[criterion.id] === value} onClick={() => props.onDraft("rubric", { ...props.attempt.draft.rubric, [criterion.id]: value })}>{value}</button>)}</div></div>)}</div>
          {score && <div className={"result-banner " + (props.attempt.proficiency ? "" : "fail")} role="status"><strong>{props.attempt.proficiency ? "Provisional proficiency" : "Lesson check complete"} · {score.correctCount}/{score.totalQuestions} · self-rated {Object.values(props.attempt.draft.rubric).reduce((a, b) => a + b, 0)}/8</strong>{props.attempt.proficiency ? "Your quiz and self-rating meet the practice threshold. This is not human-verified transfer." : "Review the explanations and use your reflection to choose a next step."}</div>}
          {!score && <button className="secondary-button" type="button" onClick={props.onAssess} disabled={props.isAssessing}>{props.isAssessing ? "Checking your answers…" : "Check my understanding"}</button>}</>}
        {props.currentStep === "reflect" && <><p className="lesson-copy">{step.text}</p><div className="field-grid"><Field label="What did you correct?" hint="Name one change you made after checking the plan." value={props.attempt.draft.reflection} onChange={(value) => props.onDraft("reflection", value)} placeholder="I noticed…" full /></div><div className="callout">Your saved result is private and marked as a learner self-assessment. Finishing quickly does not change your score.</div></>}
        {props.message && <p className="inline-error" role="alert">{props.message}</p>}
        <div className="step-actions"><button type="button" className="secondary-button" onClick={previous} disabled={index === 0 || isNavigating}>← Previous</button>
          {props.currentStep === "reflect" ? <button type="button" className="primary-button" onClick={props.onComplete} disabled={props.isCompleting || Boolean(props.attempt.completedAt)}>{props.isCompleting ? "Saving your evidence…" : props.attempt.completedAt ? "Saved to portfolio" : "Save and finish"}</button> : <button type="button" className="primary-button" onClick={next} disabled={isNavigating}>{isNavigating ? "Saving step…" : props.currentStep === "apply" ? "Continue to check" : "Save and continue"} <span aria-hidden="true">→</span></button>}</div>
        <p className="saving-state" aria-live="polite">{props.saveState === "saving" ? "Saving your changes…" : props.saveState === "error" ? "Save failed. Your text remains on screen." : "Your progress saves as you go. You can pause and return later."}</p>
      </div>
    </section>
  </main>;
}

function Field(props: { label: string; hint: string; value: string; onChange: (value: string) => void; placeholder: string; full?: boolean }) {
  const id = "field-" + props.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return <div className={"field " + (props.full ? "full" : "")}><label htmlFor={id}>{props.label}</label><small id={id + "-hint"}>{props.hint}</small><textarea id={id} className="text-area" value={props.value} onChange={(event) => props.onChange(event.target.value)} placeholder={props.placeholder} aria-describedby={id + "-hint"} maxLength={props.label.includes("prompt") ? 5000 : 10000} /></div>;
}

function Completion(props: { artifact: PrivateArtifact; attempt: Attempt; reviewDue: string | null; onHome: () => void }) {
  return <section className="complete-card"><div className="complete-icon" aria-hidden="true">✓</div><div className="eyebrow">ONE USEFUL SKILL PRACTISED</div><h1>Good work. You finished your lesson.</h1>
    <p>You have a checked plan saved to your private portfolio. This records lesson completion and self-assessed practice, not independent verification of a real-world skill.</p>
    {props.attempt.proficiency && <div className="pill" style={{ margin: "0 auto 12px" }}>Provisional proficiency · self-assessed</div>}
    <div className="evidence-card"><h2>Your saved result · {props.artifact.lessonId} v{props.artifact.lessonVersion}</h2><p>{props.artifact.content.prompt}{"\n\n"}{props.artifact.content.correctedPlan}</p></div>
    {props.reviewDue && <p className="review-due">◷ &nbsp;A short review is planned for {new Date(props.reviewDue).toLocaleDateString()}.</p>}
    <p style={{ marginTop: 20 }}><button className="primary-button" onClick={props.onHome}>Back to today</button></p>
  </section>;
}

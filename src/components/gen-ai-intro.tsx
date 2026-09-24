"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemePicker } from "@/components/theme-picker";
import { chatJourney, contextCards, genAiIntroModules, type IntroModuleId } from "@/modules/learning/gen-ai-intro";

const storageKey = "skillsprint-gen-ai-intro-practised-v1";
const promptExample = {
  goal: "Draft a friendly invitation to a fictional game night.",
  context: "The audience is neighbors who have not met before.",
  constraints: "Do not invent a date, time, or address.",
  output: "Two short sentences with placeholders for missing details."
};
type PromptPart = keyof typeof promptExample;

export function GenAiIntro() {
  const [activeId, setActiveId] = useState<IntroModuleId>("basics");
  const [practised, setPractised] = useState<IntroModuleId[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [reflection, setReflection] = useState<Record<string, string>>({});
  const [basicsChoice, setBasicsChoice] = useState("");
  const [basicsChecked, setBasicsChecked] = useState(false);
  const [chatTurn, setChatTurn] = useState(0);
  const [chatInput, setChatInput] = useState<string>(chatJourney[0].prompt);
  const [chatRevealed, setChatRevealed] = useState(false);
  const [promptParts, setPromptParts] = useState<Record<PromptPart, string>>({ goal: "", context: "", constraints: "", output: "" });
  const [promptReviewed, setPromptReviewed] = useState(false);
  const [contextSelection, setContextSelection] = useState<string[]>([]);
  const [contextChecked, setContextChecked] = useState(false);
  const activeModule = genAiIntroModules.find((item) => item.id === activeId) ?? genAiIntroModules[0];
  const moduleIndex = genAiIntroModules.findIndex((item) => item.id === activeModule.id);
  const nextModule = genAiIntroModules[moduleIndex + 1];
  const practiceReady = activeModule.id === "basics" ? basicsChecked && basicsChoice === "generated"
    : activeModule.id === "chat" ? chatTurn === chatJourney.length - 1 && chatRevealed
    : activeModule.id === "prompt" ? promptReviewed && Object.values(promptParts).every((value) => value.trim().length >= 8)
    : contextChecked && contextSelection.length === 2 && contextSelection.includes("monday") && contextSelection.includes("wednesday");
  const promptPreview = `Goal: ${promptParts.goal.trim() || "[What should AI do?]"}\nContext: ${promptParts.context.trim() || "[What background matters?]"}\nConstraints: ${promptParts.constraints.trim() || "[What limits must it respect?]"}\nOutput: ${promptParts.output.trim() || "[What should the answer look like?]"}`;

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as unknown;
        if (Array.isArray(saved)) setPractised(Array.from(new Set(saved.filter((id): id is IntroModuleId => genAiIntroModules.some((candidate) => candidate.id === id)))));
      } catch { /* Browser storage is optional for this local preview. */ }
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  function selectModule(id: IntroModuleId) { setActiveId(id); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function recordPractice() {
    if (!practiceReady) { setNotice("Try the short activity and check your result first."); return; }
    if ((reflection[activeModule.id] || "").trim().length < 15) { setNotice("Write one useful takeaway or correction before recording practice."); return; }
    const updated = Array.from(new Set([...practised, activeModule.id]));
    setPractised(updated);
    try { window.localStorage.setItem(storageKey, JSON.stringify(updated)); setNotice("Practice saved in this browser. This is self-reported practice, not a scored qualification."); }
    catch { setNotice("Practice marked for this visit. Browser storage is unavailable, so it may not persist."); }
  }
  function chooseContext(id: string) {
    setContextSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setContextChecked(false);
  }

  return <><header className="topbar"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span>SkillSprint AI</Link><div className="topbar-right"><ThemePicker /><Link className="back-link" href="/">← <span className="back-label">Main menu</span></Link></div></header>
    <main className="gen-intro-shell">
      <div className="course-breadcrumb"><Link href="/">Today</Link><span> / </span><span>Gen AI Introduction</span></div>
      <header className="gen-intro-hero"><div className="eyebrow">FOUR SHORT MODULES · 15 MIN EACH</div><h1>Gen AI Introduction</h1><p>Start in plain language, try a scripted chat, write a better prompt, then choose the context an AI system should actually see.</p><div className="gen-intro-meta"><span>◷ 60 minutes total</span><span>✦ No AI account needed</span><span>↗ Public sources linked in every module</span></div><div className="gen-intro-progress" role="progressbar" aria-label="Gen AI Introduction practice progress" aria-valuemin={0} aria-valuemax={4} aria-valuenow={ready ? practised.length : 0}><span style={{ width: `${ready ? practised.length * 25 : 0}%` }} /></div><small>{ready ? practised.length : "–"} of 4 modules practised on this device</small></header>
      <p className="course-disclosure">This is a local, self-guided draft. The chat replies are scripted examples, and the practice checks are instructional only. No model call, subscription, scored proficiency, or credential is involved. External source links are optional; the exercises work without visiting them.</p>
      <div className="gen-intro-layout"><nav className="gen-intro-nav" aria-label="Gen AI Introduction modules">{genAiIntroModules.map((item, index) => <button type="button" key={item.id} onClick={() => selectModule(item.id)} className={"gen-intro-nav-item " + (activeId === item.id ? "selected" : "")} aria-current={activeId === item.id ? "step" : undefined}><span className="gen-intro-nav-number">0{index + 1}</span><span><strong>{item.title}</strong><small>{item.level} · {practised.includes(item.id) ? "Practised" : "15 min"}</small></span></button>)}</nav>
      <article className="gen-intro-lesson"><div className="gen-intro-head"><span className="pill">MODULE 0{moduleIndex + 1} · 15 MIN</span><span className="pill neutral">{activeModule.level}</span><h2>{activeModule.title}</h2><p>{activeModule.outcome}</p></div>
        <section className="gen-intro-section"><span className="course-time">0–4 MIN · UNDERSTAND</span><h3>The idea, in plain words</h3>{activeModule.lessons.map((lesson) => <p key={lesson}>{lesson}</p>)}<div className="gen-intro-comparison"><div><strong>Less useful</strong><p>{activeModule.weakExample}</p></div><div><strong>Better</strong><p>{activeModule.improvedExample}</p></div></div></section>
        <section className="gen-intro-section"><span className="course-time">4–12 MIN · TRY IT</span><h3>Practice with fictional information</h3>
          {activeModule.id === "basics" && <div className="gen-intro-activity"><p>Which example is generative AI creating new content from a request?</p><div className="gen-intro-choices" role="radiogroup" aria-label="Choose the generative AI example">{[
            ["search", "A search page lists links to existing library websites."],
            ["generated", "A chat tool drafts a new two-sentence invitation from your instructions."],
            ["calculator", "A calculator displays 12 + 8 = 20."]
          ].map(([value, label]) => <label key={value}><input type="radio" name="gen-ai-example" value={value} checked={basicsChoice === value} onChange={() => { setBasicsChoice(value); setBasicsChecked(false); }} />{label}</label>)}</div><button className="secondary-button" type="button" onClick={() => setBasicsChecked(true)} disabled={!basicsChoice}>Check my choice</button>{basicsChecked && <p className={basicsChoice === "generated" ? "gen-intro-feedback good" : "gen-intro-feedback"} role="status">{basicsChoice === "generated" ? "Yes. The tool creates a new draft from the prompt. Search finds existing pages; the calculator follows a fixed arithmetic operation." : "Try again. Look for the example where software creates a new draft in response to your request."}</p>}</div>}
          {activeModule.id === "chat" && <div className="gen-intro-activity"><div className="gen-chat-progress">{chatJourney.map((turn, index) => <span key={turn.title} className={index <= chatTurn ? "active" : ""}>{index + 1}. {turn.title}</span>)}</div>{chatJourney.slice(0, chatTurn).map((turn) => <div className="gen-chat-past" key={turn.title}><strong>You asked</strong><p>{turn.prompt}</p><strong>Scripted reply</strong><p>{turn.response}</p></div>)}<label className="course-label" htmlFor="gen-chat-input">Your prompt · turn {chatTurn + 1}</label><textarea id="gen-chat-input" className="text-area" value={chatInput} onChange={(event) => { setChatInput(event.target.value); setChatRevealed(false); setNotice(""); }} maxLength={600} /><div className="course-actions"><button className="secondary-button" type="button" onClick={() => { if (chatInput.trim() === chatJourney[chatTurn].prompt.trim()) { setChatRevealed(true); setNotice("Scripted reply shown. Nothing was sent to an AI service."); } else { setChatRevealed(false); setNotice("This offline journey has a scripted reply only for the sample prompt. Restore it to continue."); } }}>Show scripted reply</button><button className="quiet-button" type="button" onClick={() => { setChatInput(chatJourney[chatTurn].prompt); setChatRevealed(false); setNotice("Sample prompt restored."); }}>Restore sample</button></div>{chatRevealed && <div className="gen-chat-reply"><strong>Prewritten sample response</strong><p>{chatJourney[chatTurn].response}</p><small>{chatJourney[chatTurn].lesson}</small></div>}{chatRevealed && chatTurn < chatJourney.length - 1 && <button type="button" className="primary-button gen-chat-next" onClick={() => { const next = chatTurn + 1; setChatTurn(next); setChatInput(chatJourney[next].prompt); setChatRevealed(false); setNotice(""); }}>Continue the conversation →</button>}</div>}
          {activeModule.id === "prompt" && <div className="gen-intro-activity"><p>Build a prompt from four parts. Use a fictional task; avoid private details.</p><div className="gen-prompt-fields">{(["goal", "context", "constraints", "output"] as PromptPart[]).map((part) => <label key={part}><strong>{part[0].toUpperCase() + part.slice(1)}</strong><input value={promptParts[part]} onChange={(event) => { setPromptParts({ ...promptParts, [part]: event.target.value }); setPromptReviewed(false); }} maxLength={300} /></label>)}</div><div className="course-actions"><button type="button" className="secondary-button" onClick={() => setPromptReviewed(true)}>Review my prompt</button><button type="button" className="quiet-button" onClick={() => { setPromptParts(promptExample); setPromptReviewed(false); }}>Use fictional example</button></div><pre className="gen-prompt-preview">{promptPreview}</pre>{promptReviewed && <p className={Object.values(promptParts).every((value) => value.trim().length >= 8) ? "gen-intro-feedback good" : "gen-intro-feedback"} role="status">{Object.values(promptParts).every((value) => value.trim().length >= 8) ? "All four parts are present. This checks structure only; you still need to review facts and tone in any real output." : "Add a clear goal, relevant context, a limit, and the desired output before recording practice."}</p>}</div>}
          {activeModule.id === "context" && <div className="gen-intro-activity"><p>Task: prepare a source-based update about project Northstar’s report deadline. Choose only the information that belongs in the context bundle.</p><div className="gen-context-grid">{contextCards.map((card) => <label key={card.id} className={contextSelection.includes(card.id) ? "chosen" : ""}><input type="checkbox" checked={contextSelection.includes(card.id)} onChange={() => chooseContext(card.id)} /><span><strong>{card.label}</strong><small>{card.body}</small></span></label>)}</div><button type="button" className="secondary-button" onClick={() => setContextChecked(true)}>Check context bundle</button>{contextChecked && <p className={practiceReady ? "gen-intro-feedback good" : "gen-intro-feedback"} role="status">{practiceReady ? "Good choice. Keep both dated notes, flag the deadline conflict, and exclude the irrelevant record and instruction embedded in a document." : "Include both deadline notes so the conflict stays visible. Leave out the unrelated account record and the instruction inside the document."}</p>}</div>}
        </section>
        <section className="gen-intro-section"><span className="course-time">12–15 MIN · REFLECT</span><h3>Make the habit yours</h3><label className="course-label" htmlFor="gen-intro-reflection">What would you check or change next time?</label><textarea id="gen-intro-reflection" className="text-area" maxLength={600} value={reflection[activeModule.id] || ""} onChange={(event) => setReflection({ ...reflection, [activeModule.id]: event.target.value })} placeholder="I would check… / Next time I will…" /><div className="course-actions"><button type="button" className="primary-button" onClick={recordPractice}>{practised.includes(activeModule.id) ? "Practised on this device" : "Record practice"}</button>{nextModule && <button type="button" className="secondary-button" onClick={() => selectModule(nextModule.id)}>Next: {nextModule.title} →</button>}</div><p className="saving-state" role="status">{notice}</p></section>
        <section className="gen-intro-sources"><h3>Public sources behind this lesson</h3><p>Teaching copy and fictional exercises are original paraphrases. Read these optional sources for more detail; links open public websites and were checked 24 September 2026.</p><ul>{activeModule.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a><span>{source.supports}</span></li>)}</ul></section>
      </article></div>
    </main></>;
}

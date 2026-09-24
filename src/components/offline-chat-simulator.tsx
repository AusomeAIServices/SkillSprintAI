"use client";

import { useState, type FormEvent } from "react";
import { journeyChats } from "@/modules/learning/journey-chats";

export function OfflineChatSimulator({ topicId, title }: { topicId: string; title: string }) {
  const examples = journeyChats[topicId];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prompt, setPrompt] = useState(examples[0].prompt);
  const [showResponse, setShowResponse] = useState(false);
  const [notice, setNotice] = useState("");
  const selected = examples[selectedIndex];

  function choose(index: number) {
    setSelectedIndex(index);
    setPrompt(examples[index].prompt);
    setShowResponse(false);
    setNotice("");
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (prompt.trim() !== selected.prompt.trim()) {
      setShowResponse(false);
      setNotice("This offline preview has a scripted reply only for the selected sample. Restore the sample prompt to see its reply.");
      return;
    }
    setShowResponse(true);
    setNotice("Scripted sample reply shown. Nothing was sent to an AI service.");
  }

  return <section className="offline-chat" aria-label={`Offline chat examples for ${title}`}>
    <div className="offline-chat-heading"><div><span className="eyebrow">OFFLINE CHAT LAB · 3 EXAMPLES</span><h4>See a prompt and a possible reply</h4></div><span className="offline-badge">SIMULATED</span></div>
    <p className="offline-note">Choose an example, read its prompt, then reveal the prewritten reply. You can edit the prompt to practise wording, but this page cannot generate a new answer. No internet, account, or subscription is used.</p>
    <div className="offline-scenarios" role="group" aria-label="Choose a chat example">{examples.map((example, index) => <button key={example.label} type="button" className={index === selectedIndex ? "offline-scenario selected" : "offline-scenario"} aria-pressed={index === selectedIndex} onClick={() => choose(index)}>{index + 1}. {example.label}</button>)}</div>
    <form onSubmit={send}><label className="offline-input-label" htmlFor="offline-prompt">Your prompt · sample {selectedIndex + 1}</label><textarea id="offline-prompt" value={prompt} onChange={(event) => { setPrompt(event.target.value); setShowResponse(false); setNotice(""); }} maxLength={600} rows={3} /><div className="offline-actions"><button className="secondary-button" type="submit">Show simulated reply</button><button className="quiet-button" type="button" onClick={() => { setPrompt(selected.prompt); setShowResponse(false); setNotice("Sample prompt restored."); }}>Restore sample prompt</button></div></form>
    <p className="offline-status" role="status">{notice}</p>
    {showResponse && <div className="offline-reply"><span className="offline-reply-label">PREWRITTEN SAMPLE RESPONSE</span><p>{selected.response}</p></div>}
  </section>;
}

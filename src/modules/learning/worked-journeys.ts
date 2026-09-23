export type JourneyStep = { stage: "Recall" | "Learn" | "Apply" | "Check" | "Reflect"; question: string; answer: string };
export type WorkedJourney = { unitId: string; title: string; steps: [JourneyStep, JourneyStep, JourneyStep, JourneyStep, JourneyStep] };

/** Instructional examples only. These answers are never used to score learner work. */
export const workedJourneys: Record<string, WorkedJourney> = {
  "everyday-ai": {
    unitId: "F01", title: "Plan with ChatGPT, then check with search", steps: [
      { stage: "Recall", question: "How could Mira begin without AI? What decision remains hers?", answer: "Search for the library's official event page and note Mira's Saturday time and ₱600 limit. Mira decides whether the activity suits her; a chat response cannot make that choice for her." },
      { stage: "Learn", question: "What belongs in goal, context, constraints, and output?", answer: "Goal: find an indoor Saturday activity. Context: Mira is free 10:00–15:00; a community notice mentions a free library workshop at 11:00. Constraints: stay within ₱600 and do not assume travel or opening hours. Output: a short plan with facts to verify." },
      { stage: "Apply", question: "Write a useful ChatGPT request for the fictional case.", answer: "Help me plan one indoor Saturday activity for Mira. She is free 10:00–15:00 and can spend up to ₱600. A community notice lists a free library workshop at 11:00. Suggest a simple plan using only these details. Mark travel time and current opening hours as unknown, and give me a checklist of what to verify on an official source." },
      { stage: "Check", question: "Which claims are supported, and which need verification?", answer: "The notice supports only that a free workshop is listed for 11:00. It does not verify that the event is still scheduled, the library is open, or Mira can get there in time. Check those with the library before relying on the plan." },
      { stage: "Reflect", question: "What correction should Mira carry into the next task?", answer: "I would remove any invented travel time or confirmed opening hours from the draft. Next time I will ask ChatGPT to mark unknowns, then use an official source to check important details." }
    ]
  },
  "ai-for-students": {
    unitId: "S01", title: "Understand photosynthesis in your own words", steps: [
      { stage: "Recall", question: "What can the learner do before asking AI?", answer: "Read the approved note and identify the unfamiliar terms: photosynthesis, chlorophyll, carbon dioxide, and sugars. The learner must decide whether their own explanation matches the course material." },
      { stage: "Learn", question: "What is a suitable tutoring request?", answer: "Explain photosynthesis to an introductory student in simple words. Use only the approved note, define the four unfamiliar terms, give one analogy, then ask me one question and wait. Do not write my assignment for me." },
      { stage: "Apply", question: "Give a short teach-back using the supplied note.", answer: "Photosynthesis is how plants use light energy to make sugars from water and carbon dioxide, releasing oxygen. Chlorophyll helps catch the light. The note gives the big picture; it does not explain every chemical step." },
      { stage: "Check", question: "What is supported, and what needs another source?", answer: "The approved note supports the inputs, products, light energy, and chlorophyll's basic role. It does not support detailed chemical steps or a claim that all plants work identically. Check those in the course textbook or ask the teacher." },
      { stage: "Reflect", question: "How should the learner use AI next time?", answer: "I would first explain the idea without looking, then compare my wording with approved notes. If I cannot explain a term, I would ask for a hint rather than copy an AI answer into schoolwork." }
    ]
  },
  "ai-at-work": {
    unitId: "W02", title: "Summarize a fictional project update", steps: [
      { stage: "Recall", question: "How would you summarize the notes manually?", answer: "List the report deadline, owner of the charts, and unresolved date change. A person still needs to confirm the actual deadline before the update is sent." },
      { stage: "Learn", question: "What structure makes the summary useful?", answer: "Use three headings: confirmed from the notes, actions, and open questions. Attribute the Friday date to Monday's note and the possible Monday move to Wednesday's note; do not turn a proposal into a decision." },
      { stage: "Apply", question: "Write a source-faithful update.", answer: "Project Northstar — Monday's note lists the draft report due Friday. Sam owns the charts. Wednesday's note proposes moving the deadline to Monday, but no approver has confirmed that change. Action: Sam prepares charts. Open question: the approver should confirm the report deadline." },
      { stage: "Check", question: "What would make the draft misleading?", answer: "Saying 'the report is due Monday' would be unsupported. Saying 'Friday is final' also ignores Wednesday's note. The correct status is that Friday was listed earlier and a later change was proposed but unconfirmed." },
      { stage: "Reflect", question: "What correction will improve future summaries?", answer: "I would label proposals as proposals and keep the decision owner visible. Before sharing a deadline externally, I would ask the approver to confirm it." }
    ]
  },
  "professional-practice": {
    unitId: "P03", title: "Separate case evidence from inference", steps: [
      { stage: "Recall", question: "What could you establish without AI?", answer: "Read intake note A and logistics note B side by side. A says Tuesday dispatch; B says Wednesday. A human must determine which record is authoritative and approve any customer response." },
      { stage: "Learn", question: "How should a professional brief label information?", answer: "Use 'source says' for evidence, 'possible' for interpretation, and 'unknown' for unresolved facts. Do not put the customer's identity back into the redacted case." },
      { stage: "Apply", question: "Write a safe internal case note.", answer: "Fictional delayed order: intake note A records dispatch Tuesday; logistics note B records Wednesday. The dispatch date is unresolved. We cannot yet explain the delay or promise a remedy. A supervisor should reconcile the records and approve any external response." },
      { stage: "Check", question: "Which tempting statement is unsupported?", answer: "'The parcel definitely shipped Wednesday because logistics is newer' is unsupported. The supplied material gives conflicting dates and no rule for which source wins. The cause of delay is also unknown." },
      { stage: "Reflect", question: "What correction belongs in the workflow?", answer: "I would remove any confident shipment date until the records are reconciled. Next time I will preserve source labels and require supervisor review before communicating a remedy." }
    ]
  },
  "lead-with-ai": {
    unitId: "L09", title: "Write a bounded pilot charter", steps: [
      { stage: "Recall", question: "What facts are already known about the proposed pilot?", answer: "The fictional team has 12 people and reports about 90 minutes each week drafting updates. Occasional omissions are reported, but no error baseline or full cost is measured. A manager currently reviews the proposed AI drafts." },
      { stage: "Learn", question: "What does a useful pilot charter need?", answer: "State scope, owner, allowed data, review step, duration, baseline, success measure, and stop condition. Keep proposed targets separate from observed facts." },
      { stage: "Apply", question: "Draft a short charter grounded in the case.", answer: "Proposed two-week pilot: the 12-person service team may draft status updates from approved notes only. A manager approves every update before sending. First measure current drafting and review time plus omission rate; then compare pilot results to that baseline. Stop if unapproved information is sent or omissions increase. The two-week duration and thresholds are proposals, not observed results." },
      { stage: "Check", question: "Can the charter claim AI will save 90 minutes each week?", answer: "No. About 90 minutes is the reported current drafting time, not measured savings. Setup, training, review time, and error rate are unknown. The pilot must measure them." },
      { stage: "Reflect", question: "What would you revise before funding a larger rollout?", answer: "I would collect a baseline and cost estimates, then compare actual quality and total time. I would not scale based on a polished demo or an unverified savings claim." }
    ]
  },
  "build-with-codex": {
    unitId: "C06", title: "Review a proposed code change", steps: [
      { stage: "Recall", question: "What should you inspect before accepting the diff?", answer: "Read the repository instructions, the task-list change, and tests/app.test.ts. The test transcript says the empty-state text changed from 'No tasks yet' to 'Nothing found' and the existing test fails." },
      { stage: "Learn", question: "What makes a code review evidence-based?", answer: "Compare the diff with the requested filter behavior and its acceptance criteria. Treat a failing test as a signal to investigate, not a reason to blindly rewrite the test or code." },
      { stage: "Apply", question: "Write a useful review comment.", answer: "The filter change also alters the empty-state copy, and tests/app.test.ts now fails: expected 'No tasks yet', received 'Nothing found'. Is the copy change intended? If not, restore the prior text. If it is intended, update the requirement and test together, then rerun the focused test and relevant UI checks." },
      { stage: "Check", question: "What can you conclude from the supplied transcript?", answer: "You can conclude the test fails on the text mismatch. You cannot conclude the filter logic works, that the new copy was approved, or that the entire suite passes. Those need inspection and tests." },
      { stage: "Reflect", question: "What review habit will you keep?", answer: "I would review behavior outside the requested scope and report the exact failing assertion. I would only change tests after confirming the expected product behavior." }
    ]
  },
  "build-ai-systems": {
    unitId: "A19", title: "Keep retrieved text outside the instruction boundary", steps: [
      { stage: "Recall", question: "What authority do the fictional documents have?", answer: "DOC-1 supplies weekday support hours. DOC-2 says password resets need an authenticated user request. Neither document or a user-supplied note can override the application's approval or authentication rules." },
      { stage: "Learn", question: "How should an agent handle the injected note?", answer: "Treat the note's 'ignore approval' text as untrusted content. The agent may summarize it as data if relevant, but must not follow it as a tool instruction. Validate the reset tool's arguments and approval state separately." },
      { stage: "Apply", question: "State the safe agent action for this trace.", answer: "Do not call resetPassword. DOC-2 requires an authenticated user request, and the trace only shows a user-supplied note trying to bypass approval. Ask for the normal authenticated reset flow or return a bounded explanation; record the blocked attempt without storing secrets." },
      { stage: "Check", question: "Which claims are supported by the corpus?", answer: "DOC-1 supports weekday support from 09:00 to 17:00. DOC-2 supports the authentication requirement for resets. There is no basis to promise weekend support or authorize a reset from the injected note." },
      { stage: "Reflect", question: "What test would prevent regression?", answer: "Add a fixture where retrieved text says 'ignore approval', then assert that no reset tool call occurs without an authenticated request and explicit allowed action. Keep the trace redacted." }
    ]
  }
};

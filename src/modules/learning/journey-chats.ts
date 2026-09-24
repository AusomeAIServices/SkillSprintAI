export type ScriptedChat = { label: string; prompt: string; response: string };
type ThreeChats = [ScriptedChat, ScriptedChat, ScriptedChat];
const chat = (label: string, prompt: string, response: string): ScriptedChat => ({ label, prompt, response });

/** Fictional, authored demonstrations. These are not model responses or assessment keys. */
export const journeyChats: Record<string, ThreeChats> = {
  "journey-orientation": [
    chat("What AI does", "What is AI? Explain it in everyday words.", "AI is software that finds patterns in examples and uses them to predict, classify, or create responses. A chat assistant can explain or draft text, but it can make mistakes. You still decide what to trust."),
    chat("A daily use", "How could an AI chat help me plan dinner?", "You could tell it what ingredients you have and ask for two simple meal ideas. Treat them as suggestions: check cooking safety and adjust for your needs."),
    chat("A limit", "Can I assume an AI answer is always correct?", "No. A fluent answer can be inaccurate or out of date. For important facts, use a trustworthy source and your own judgment."),
  ],
  "search-vs-chatgpt": [
    chat("Find versus explain", "How is a web search different from a chat answer?", "Search helps you find pages to inspect. A chat answer can explain or organize an idea in conversation. Neither removes the need to check important facts."),
    chat("Current hours", "Is my local library open right now?", "I cannot confirm current hours in this offline example. Check the library's official page or contact it. I can help you make a short checklist of what to ask."),
    chat("Follow-up", "Explain rain in two simple sentences, then tell me what to search for.", "Rain forms when water vapor cools into tiny droplets in clouds; when droplets grow heavy enough, they fall. To check details, search for an educational weather service explanation of the water cycle."),
  ],
  "combine-search-ai": [
    chat("Use supplied text", "Fictional notice: 'Free library workshop, Saturday 11:00.' Summarize only this notice.", "The notice lists a free library workshop for Saturday at 11:00. It does not say how long it lasts or whether the event is still scheduled."),
    chat("Compare sources", "Notice A says 11:00; Notice B says noon. Which is correct?", "The supplied notices disagree. I cannot determine the current time from them. Check the library's official event listing before making a plan."),
    chat("Verify a claim", "My draft says the workshop needs registration. Is that supported by the notice?", "No. The fictional notice mentions a workshop, time, and price, but says nothing about registration. Mark registration as unknown and check the official listing."),
  ],
  "state-your-goal": [
    chat("Plan", "Help me.", "What would you like to do? For example, you could ask me to plan a quiet afternoon, explain an unfamiliar idea, or draft a short message."),
    chat("Explain", "Help me understand why rain happens in simple words.", "Water evaporates, rises, and cools into droplets in clouds. When enough droplets join and become heavy, they fall as rain."),
    chat("Draft", "Draft a friendly two-sentence invitation to a fictional neighborhood game night.", "Hi neighbors! We're planning a game night this Saturday and would love for you to join. Bring a favorite game if you have one."),
  ],
  "add-useful-context": [
    chat("Time and budget", "Plan a quiet afternoon for Mira, 1–4 p.m., under ₱300, indoors.", "Possible outline: read at home from 1–2, take a short break, then try a low-cost indoor hobby. I do not know local prices or venue hours, so check those before going out."),
    chat("Audience", "Explain the water cycle to a 10-year-old in simple words.", "The sun warms water, some of it rises as invisible vapor, and cooling air turns it into clouds. When drops in a cloud get heavy, rain falls."),
    chat("Privacy limit", "Help draft an appointment reminder without names or health details.", "Reminder: Your appointment is scheduled for the agreed date and time. Please contact the office if you need to confirm or change it."),
  ],
  "shape-the-output": [
    chat("Request a table", "Compare a library workshop and reading at home in a two-row table. Mark unknowns.", "Option | Known | Unknown\nLibrary workshop | Fictional notice lists Saturday 11:00 and free entry | Current schedule and travel time\nRead at home | Can use materials already owned | Which book Mira prefers"),
    chat("Refine", "Make that comparison shorter and keep the unknowns.", "Workshop: free at 11:00 per notice; confirm schedule and travel. Home reading: uses available books; choose a title."),
    chat("No invention", "Add the library's street address to the table.", "The supplied information has no address. I should leave that cell as 'not provided' and suggest checking the library's official listing."),
  ],
  "explain-my-way": [
    chat("Simple words", "Explain inflation in simple words with a familiar example.", "Inflation means prices are rising across many things over time. If the same grocery basket costs more than before, your money buys less of that basket."),
    chat("Like I'm five", "Explain a computer password like I'm five.", "A password is like a secret key for your account. You keep it to yourself so other people cannot open your account. Use a strong, different key for each account."),
    chat("Tagalog", "Ipaliwanag ang ulan sa simpleng Tagalog.", "Nabubuo ang ulan kapag ang singaw ng tubig ay lumamig at naging maliliit na patak sa ulap. Kapag nagsama-sama at bumigat ang mga patak, bumabagsak ang mga ito bilang ulan."),
  ],
  "one-question-at-a-time": [
    chat("Ask one question", "Quiz me on halves and quarters. Ask only one question, then wait.", "Question 1: If a pizza is cut into four equal pieces, how many pieces make one half? I will wait for your answer."),
    chat("Give a hint", "I think one piece is half. Give me a hint, not the answer.", "A half means two equal parts of the whole. If the pizza has four equal pieces, how many quarter-pieces would make two of those parts?"),
    chat("Explain feedback", "My answer is two pieces. Is that right?", "Yes. Two of four equal pieces are 2/4, which is the same amount as 1/2. Try drawing four boxes and shading two to check."),
  ],
  "teach-it-back": [
    chat("Own words", "Here is my explanation: plants use light to make food. What is missing from my supplied note?", "Your sentence has the main idea. The fictional note also says plants use water and carbon dioxide, make sugars, release oxygen, and use chlorophyll to capture light."),
    chat("Spot a gap", "I wrote that chlorophyll is food. Is that accurate?", "Not according to the supplied note. Chlorophyll helps capture light; the sugars are the food product. Revise the sentence to keep those roles separate."),
    chat("Next question", "Ask me one question that checks whether I understand photosynthesis.", "What two materials does the plant use along with light energy, and what does it make? Answer in your own words before checking your note."),
  ],
  "brainstorm": [
    chat("Meal ideas", "Give three dinner ideas using rice and vegetables. No shopping list yet.", "Try vegetable fried rice, a rice-and-vegetable bowl, or vegetable soup with rice. Pick one based on what you actually have and your dietary needs."),
    chat("Hobby ideas", "Suggest three low-cost indoor hobbies for a rainy day.", "You could sketch with paper, learn a simple card game, or organize photos already on your device. Tell me what materials you have and I can narrow the list."),
    chat("Choose one", "I have only paper and a pencil. Which idea fits?", "Sketching fits the materials you named. A simple start is to draw one object from three angles for ten minutes. There is no need to buy supplies."),
  ],
  "make-a-plan": [
    chat("Timebox", "Make a fictional 2–4 p.m. study plan with a break after 45 minutes.", "2:00–2:45 review notes; 2:45–3:00 break; 3:00–3:40 answer practice questions; 3:40–4:00 check mistakes and choose what to revisit."),
    chat("Budget", "Plan a fictional indoor afternoon under ₱300. Mark costs you cannot verify.", "Start with a free activity at home, then consider a library visit if its hours and travel cost fit. Actual travel and venue costs are unknown in this example and need checking."),
    chat("Unknown", "A notice says a workshop is free at 11:00. Can you include a travel time?", "Not from the notice alone. I can put 'travel time: unknown' in the plan and suggest checking the route and event status before leaving."),
  ],
  "revise-for-audience": [
    chat("Warm note", "Write a warm two-sentence note to a fictional neighbor about a weekend game night.", "Hi! We're planning a relaxed game night this weekend and would love to see you. Bring a game you enjoy if you can."),
    chat("Direct version", "Make that note more direct without sounding rude.", "Game night is this weekend. Please let me know if you can come and whether you plan to bring a game."),
    chat("Review before send", "What should I check before sending either version?", "Check the actual date, time, location, recipient, and whether the tone fits your relationship. None of those real-world details was supplied here."),
  ],
  "name-class-level": [
    chat("State the level", "Explain photosynthesis for an introductory biology student in simple words.", "Plants use light energy to turn water and carbon dioxide into sugars, releasing oxygen. Chlorophyll helps capture the light. This is the big picture; your course may cover more detail."),
    chat("Use an analogy", "Give a simple analogy, then say where it stops working.", "Think of a plant as a small factory using light as energy and water and carbon dioxide as inputs. The analogy helps organize the parts, but a plant is not literally a factory with machines."),
    chat("Tagalog request", "Ipaliwanag ang photosynthesis sa simpleng Tagalog para sa baguhan.", "Sa photosynthesis, gumagamit ang halaman ng enerhiya mula sa liwanag, tubig, at carbon dioxide upang makagawa ng asukal; naglalabas din ito ng oxygen. Tinutulungan ng chlorophyll ang halaman na makakuha ng liwanag."),
  ],
  "guided-tutor": [
    chat("Wait for me", "Tutor me on photosynthesis. Ask one question and wait for my answer.", "What does the plant use, along with water and carbon dioxide, to make sugars? Answer first, and I will respond to your reasoning."),
    chat("Hint first", "I forgot. Give one hint, not the answer.", "Think about what chlorophyll helps the plant capture from its surroundings."),
    chat("Feedback", "My answer is light energy. What should I check next?", "That matches the fictional study note. Next, explain in your own words what the plant makes and releases, then compare your answer with the note."),
  ],
  "academic-integrity": [
    chat("Help without copying", "Can you write my homework answer for me?", "I can help you understand the question, offer a hint, or review your reasoning. Write the final answer yourself and follow your teacher's AI-use rules."),
    chat("Policy check", "My teacher says AI is allowed for brainstorming but not final writing. What can I do?", "You can ask for ideas or clarifying questions, then close the chat and write the final response yourself. If your class requires disclosure, say how you used AI."),
    chat("Teach-back", "Ask me to explain photosynthesis without showing me the answer.", "Explain what light, water, and carbon dioxide do in photosynthesis using your own words. I will ask about any part that is unclear after you answer."),
  ],
  "draft-first-pass": [
    chat("Fictional update", "Draft a short update from these fictional notes: Sam owns charts; Friday is the listed draft date.", "Northstar update: Sam is preparing the charts, and Monday's note lists Friday as the draft report date. Please confirm whether that date has changed before sharing externally."),
    chat("Audience", "Make the update suitable for a team lead, not a customer.", "Northstar: Sam owns the charts. The draft report is listed for Friday in Monday's note, but the team should confirm the latest deadline before committing to it."),
    chat("Human review", "Can I send the AI draft immediately?", "Review the names, dates, tone, and source notes first. A person should approve the final workplace message, especially when a deadline may have changed."),
  ],
  "summarize-sources": [
    chat("Three bullets", "Summarize only these fictional notes: Monday says Friday draft; Wednesday proposes Monday; Sam owns charts.", "• Monday's note lists a Friday draft deadline. • Wednesday's note proposes moving it to Monday; approval is unknown. • Sam owns the charts."),
    chat("Source references", "Add a source label to each point and one open question.", "[Monday] Draft due Friday. [Wednesday] A move to Monday was proposed, not confirmed. [Notes] Sam owns charts. Open question: who will confirm the deadline?"),
    chat("Unsupported", "The summary says Monday is the final deadline. Is that in the notes?", "No. Wednesday's note proposes Monday, but no confirmation is supplied. Change 'final deadline' to 'proposed deadline' and seek approval."),
  ],
  "bound-workflow": [
    chat("Four steps", "Design a four-step workflow for a fictional weekly update.", "1. Gather approved project notes. 2. Draft an update using only those notes. 3. Check facts, omissions, and sensitive details. 4. Have the team lead approve before sending."),
    chat("Approval boundary", "Where should a person approve that workflow?", "After checking the draft and before it is sent. The AI-generated text is a draft, not a message the system should send on its own."),
    chat("Fallback", "What if the notes disagree about the deadline?", "Mark the deadline as unresolved and ask the responsible person to confirm it. Do not guess or silently choose one note."),
  ],
  "spot-check": [
    chat("Verify a time", "An AI draft says the fictional library workshop starts at noon. What should I check?", "The supplied notice lists 11:00, so noon is not supported. Check the library's current official event listing before going; the offline example cannot confirm live details."),
    chat("Verify a claim", "A chat answer says registration is required. Does our notice support that?", "No. The notice does not mention registration. Label it unknown rather than repeat the claim."),
    chat("Best source", "Where should I verify a current library opening time?", "Use the library's own current website, event listing, or direct contact. A copied chat answer is not a current authoritative source."),
  ],
  "sources-and-uncertainty": [
    chat("Fact", "Notice: 'Free workshop Saturday at 11:00.' What is directly stated?", "The notice states there is a free workshop listed for Saturday at 11:00. It does not confirm that the event has not changed."),
    chat("Assumption", "My plan says it takes ten minutes to get there. What kind of detail is that?", "It is an assumption because no route or travel information was supplied. Replace it with 'travel time unknown' until checked."),
    chat("Unknown", "Does the notice tell us if seats are available?", "No. Availability is unknown from the supplied notice. Check with the organizer rather than inventing a number."),
  ],
  "evaluate-repeatably": [
    chat("Normal case", "Write one test question for a helper using the fictional library notice.", "Test: 'What time is the workshop listed?' Expected: Saturday at 11:00, attributed to the notice, with a reminder that current status is unverified."),
    chat("Unsupported case", "Write a question the notice cannot answer and the expected safe reply.", "Test: 'How many seats are left?' Expected: 'The supplied notice does not say. Check with the library.' A made-up seat count would fail."),
    chat("Conflicting case", "What if another notice lists noon? Define the expected behavior.", "The helper should say the notices conflict, identify both times and their sources, and ask for an official current confirmation. It should not silently pick one."),
  ],
  "share-less": [
    chat("Redact", "Fictional record: 'Mara Santos, account 4821, missed an appointment.' Make it safe for general writing practice.", "Use: 'A customer missed an appointment.' Remove the name and account number because they are not needed to practise writing a reminder."),
    chat("Password", "Should I paste my password so AI can help with my account?", "No. Never paste a password into a chat. Use the service's official account recovery process instead."),
    chat("Minimum details", "Draft a generic reminder without customer identifiers.", "Reminder: Your appointment is coming up at the agreed time. Please contact the office if you need to confirm or change it."),
  ],
  "human-approval": [
    chat("Customer impact", "Who should approve an AI-drafted response about a fictional delayed order?", "A designated customer-service supervisor should check the source records and approve the message before it reaches the customer."),
    chat("Student impact", "Should AI decide a student's grade from one chat?", "No. A qualified teacher should apply the school's assessment rules and review the student's actual work. AI may help draft feedback if the school permits it."),
    chat("Unclear case", "Two records disagree on dispatch date. Can AI promise a refund?", "No. It should flag the conflict and pass the case to an authorized person. The supplied records do not establish the date or remedy."),
  ],
  "set-boundaries": [
    chat("Allowed inputs", "Write an input boundary for a fictional school study helper.", "Use teacher-approved public notes only; do not accept student records, passwords, or unpublished class materials. Reject or remove sensitive details before processing."),
    chat("Permitted actions", "What should a workplace drafting helper be allowed to do?", "It may create a draft from approved notes and flag unknowns. It should not send messages, change records, or make customer decisions without an authorized human approval step."),
    chat("Fallback", "What if the helper cannot find a supported answer?", "Say that the supplied sources do not answer the question, show what is missing, and route the issue to a person. Do not invent a confident answer."),
  ],
  "describe-an-app": [
    chat("User and task", "Describe a small study helper app in two sentences.", "A student uses the app to turn approved class notes into one practice question at a time. The student answers first; the app gives a hint and links feedback back to the notes."),
    chat("Inputs and output", "What are the inputs and output for that app?", "Inputs are an approved note excerpt and the learner's answer. Output is one question or hint plus a note reference; the app should not produce a final graded assignment for the learner."),
    chat("Success check", "How would we know the study helper is useful?", "Test whether its questions match the notes and whether learners can explain the idea unaided afterward. Count unsupported claims as failures."),
  ],
  "codex-review-loop": [
    chat("Bound the change", "Write a coding task for a fictional task-list app: add a filter without changing the empty-state copy.", "Add a completed/open filter in the task-list view. Keep the existing 'No tasks yet' empty-state text. Update relevant tests, run them, and show the diff for review."),
    chat("Inspect a failure", "A test expected 'No tasks yet' but got 'Nothing found'. What should I do?", "Inspect the diff and acceptance criteria. The copy changed outside the requested scope, so restore it unless the product owner approved a change; then rerun the focused test."),
    chat("Report evidence", "How should a coding agent summarize the result?", "State the behavior changed, files touched, tests run and their outcomes, plus any uncertainty. A passing test does not replace human review of the diff."),
  ],
  "agents-and-harnesses": [
    chat("Divide work", "Split a fictional task-list filter into architecture, UX, implementation, and QA tasks.", "Architecture defines the filter state contract; UX specifies the control and empty state; implementation changes the component; QA writes independent cases. Give each role an owner and integration handoff."),
    chat("Permissions", "What tool limits should those agents have?", "Give read access for review tasks and scoped edit access only where needed. Require a human checkpoint before publishing or other external side effects; keep secrets out of task prompts."),
    chat("Measure value", "How can we tell if four agents helped more than one?", "Use the same acceptance tests and review rubric for both approaches. Compare correctness, elapsed time, cost, and integration defects before deciding whether the extra coordination was useful."),
  ],
};

export type Difficulty = "Easy" | "Hard" | "Advanced";

export type JourneyTopic = {
  id: string;
  difficulty: Difficulty;
  title: string;
  explanation: string;
  practice: string;
};

export type JourneyMilestone = {
  id: string;
  title: string;
  summary: string;
  topics: [JourneyTopic, JourneyTopic, JourneyTopic];
};

export type JourneyWave = {
  id: string;
  title: string;
  summary: string;
  milestones: [JourneyMilestone, JourneyMilestone, JourneyMilestone];
};

export const aiJourneyWaves: [JourneyWave, JourneyWave, JourneyWave] = [
  {
    id: "wave-1",
    title: "Wave 1 · Get comfortable with AI",
    summary: "Meet AI, learn how to ask, and use it to understand new things.",
    milestones: [
      {
        id: "first-conversation",
        title: "Start a useful conversation",
        summary: "Move from a question to a helpful, checkable response.",
        topics: [
          { id: "journey-orientation", difficulty: "Easy", title: "AI Understanding Journey", explanation: "Start with the questions you already know how to ask. In short daily steps, you will learn what ChatGPT can help with, how to ask clearly, and how to check its answers.", practice: "Think of one everyday question you would usually type into Google. Keep it in mind as you move to the next topic." },
          { id: "search-vs-chatgpt", difficulty: "Hard", title: "From Google search to ChatGPT", explanation: "Google Search finds pages for you to open. ChatGPT replies in a conversation and can explain or organize details. It can still make mistakes or miss recent facts.", practice: "Ask ChatGPT to explain a topic, then use Google Search to check one important or current fact." },
          { id: "combine-search-ai", difficulty: "Advanced", title: "Use search and ChatGPT together", explanation: "Use search to find current, trustworthy sources. Give relevant source text to ChatGPT to compare or explain, then check the result against those sources.", practice: "Find one reliable page, ask ChatGPT to summarize only the text you provide, and verify one claim." },
        ],
      },
      {
        id: "clear-requests",
        title: "Make your request clear",
        summary: "Give AI enough direction to produce a useful first draft.",
        topics: [
          { id: "state-your-goal", difficulty: "Easy", title: "Say what you want", explanation: "A clear goal tells AI what to help you do, such as plan, explain, compare, or draft.", practice: "Turn “Help me” into “Help me plan a quiet afternoon.”" },
          { id: "add-useful-context", difficulty: "Hard", title: "Add useful context and limits", explanation: "Context gives relevant background. Constraints tell AI which limits or preferences to respect. Include only details needed for the task.", practice: "Add who the plan is for, the available time, a budget, and one thing to avoid." },
          { id: "shape-the-output", difficulty: "Advanced", title: "Specify and refine the output", explanation: "Describe the answer format, review the first result, and ask for one precise change. Relevant earlier messages can also be context.", practice: "Ask for a short table, check what is missing, and request a revised version without inventing facts." },
        ],
      },
      {
        id: "learn-with-ai",
        title: "Learn with AI",
        summary: "Use explanations, examples, and questions to build your own understanding.",
        topics: [
          { id: "explain-my-way", difficulty: "Easy", title: "Ask AI to explain it your way", explanation: "ChatGPT can explain a topic in simple everyday words. You can also ask for Tagalog or a familiar example.", practice: "Pick one topic you are curious about. Ask: “Explain [topic] in simple words and give me one familiar example.”" },
          { id: "one-question-at-a-time", difficulty: "Hard", title: "Practise one question at a time", explanation: "AI can act like a practice partner: ask one question, wait for your answer, and explain where your reasoning needs work.", practice: "Ask for one question about your topic. Answer it yourself before asking for feedback." },
          { id: "teach-it-back", difficulty: "Advanced", title: "Teach the idea back", explanation: "Explaining an idea in your own words helps reveal what you understand and what needs another example. Check important facts against trusted material.", practice: "Explain the topic without AI, then compare your explanation with your notes and list one open question." },
        ],
      },
    ],
  },
  {
    id: "wave-2",
    title: "Wave 2 · Put AI to work",
    summary: "Apply AI to everyday tasks, study, and professional work.",
    milestones: [
      {
        id: "everyday-tasks",
        title: "Handle everyday tasks",
        summary: "Use AI to organize, plan, and communicate.",
        topics: [
          { id: "brainstorm", difficulty: "Easy", title: "Generate a few ideas", explanation: "AI can help you get started when you are planning a meal, trip, hobby, or personal project.", practice: "Ask for three options and tell AI which one fits you best." },
          { id: "make-a-plan", difficulty: "Hard", title: "Build a plan from your details", explanation: "Give AI the time, budget, preferences, and supplied facts. Ask it to mark unknowns rather than guess.", practice: "Ask for a schedule with time, cost, and any information still missing." },
          { id: "revise-for-audience", difficulty: "Advanced", title: "Adapt a message for someone", explanation: "A useful draft matches its audience and purpose. You remain responsible for checking tone, names, facts, and whether to send it.", practice: "Ask for two versions of a note—warm and direct—then edit the one you would actually use." },
        ],
      },
      {
        id: "student-study",
        title: "Study a hard topic",
        summary: "Learn the reasoning instead of copying an answer.",
        topics: [
          { id: "name-class-level", difficulty: "Easy", title: "Name your topic and level", explanation: "Tell AI what you are studying and the level of explanation you need. Ask for plain language, Tagalog, or an analogy.", practice: "Try: “Explain photosynthesis for an introductory biology class in simple words.”" },
          { id: "guided-tutor", difficulty: "Hard", title: "Ask for a patient tutor", explanation: "Ask for one question at a time, wait to answer, and request a gentle explanation of any gap in your reasoning.", practice: "Ask AI to quiz you about one concept without giving the answer first." },
          { id: "academic-integrity", difficulty: "Advanced", title: "Keep the learning yours", explanation: "Follow your teacher’s rules, disclose AI help when required, and produce your own work. Use AI to practise and clarify, not to misrepresent authorship.", practice: "Use your class policy to decide what AI help is allowed; then write a teach-back in your own words." },
        ],
      },
      {
        id: "professional-work",
        title: "Use AI at work",
        summary: "Create drafts and summaries with clear review boundaries.",
        topics: [
          { id: "draft-first-pass", difficulty: "Easy", title: "Draft a first pass", explanation: "AI can create a starting draft from facts and an audience you provide. A person should review before it is shared.", practice: "Ask for a short update using fictional project notes." },
          { id: "summarize-sources", difficulty: "Hard", title: "Summarize supplied material", explanation: "Tell AI to use only the source you provide. Ask it to separate stated facts from assumptions and unknowns.", practice: "Request a three-bullet summary with source references and one open question." },
          { id: "bound-workflow", difficulty: "Advanced", title: "Design a reviewable workflow", explanation: "A dependable workflow defines inputs, output quality, data limits, human approvals, and what happens if AI is uncertain.", practice: "Write a four-step workflow and identify the point where a person must approve the result." },
        ],
      },
    ],
  },
  {
    id: "wave-3",
    title: "Wave 3 · Use AI with judgment",
    summary: "Check answers, protect information, and move toward building AI tools.",
    milestones: [
      {
        id: "check-answers",
        title: "Check what AI tells you",
        summary: "Treat fluent answers as suggestions until important claims are verified.",
        topics: [
          { id: "spot-check", difficulty: "Easy", title: "Check an important fact", explanation: "AI may sound certain and still be wrong. Verify important facts with a trusted source.", practice: "Choose one claim in an AI answer and check it against an official or course source." },
          { id: "sources-and-uncertainty", difficulty: "Hard", title: "Separate facts from guesses", explanation: "Ask which details came from your material, which are assumptions, and what cannot be determined from the evidence.", practice: "Ask AI to label facts, assumptions, and unknowns in a sample answer." },
          { id: "evaluate-repeatably", difficulty: "Advanced", title: "Test answers systematically", explanation: "For repeated use, define expected answers, edge cases, and unacceptable errors before comparing AI outputs.", practice: "Write three test questions, including one the supplied sources cannot answer." },
        ],
      },
      {
        id: "protect-information",
        title: "Protect people and information",
        summary: "Keep private data and consequential decisions within safe boundaries.",
        topics: [
          { id: "share-less", difficulty: "Easy", title: "Share only what is needed", explanation: "Do not paste passwords, identity numbers, private records, or confidential work into a tool unless it is approved for that data.", practice: "Remove names and identifying details from a fictional example before asking for help." },
          { id: "human-approval", difficulty: "Hard", title: "Keep a person responsible", explanation: "A person should review consequential advice or actions. AI should not make sensitive decisions on its own.", practice: "Name who reviews a draft before it can affect a customer, student, employee, or patient." },
          { id: "set-boundaries", difficulty: "Advanced", title: "Define an AI use boundary", explanation: "Specify allowed inputs, permitted actions, approval points, logging limits, and a fallback when the system cannot answer safely.", practice: "Draft a five-line boundary for an AI helper in a workplace or class." },
        ],
      },
      {
        id: "build-with-ai",
        title: "Explore building with AI",
        summary: "Progress from concepts to reviewed code and bounded agents.",
        topics: [
          { id: "describe-an-app", difficulty: "Easy", title: "Describe a small app idea", explanation: "A useful app brief names its user, task, inputs, output, and one way to tell whether it worked.", practice: "Write a two-sentence app idea for a study helper or daily planner." },
          { id: "codex-review-loop", difficulty: "Hard", title: "Use Codex in a review loop", explanation: "Ask Codex to inspect a codebase, make a bounded change, run tests, and explain the diff. Review the result before keeping it.", practice: "Give a coding agent one small change and an acceptance test; inspect what it changed." },
          { id: "agents-and-harnesses", difficulty: "Advanced", title: "Coordinate agents safely", explanation: "Use specialist agents only when tasks can be separated. Define ownership, tool permissions, budgets, evaluation, and human approval for side effects.", practice: "Split a sample feature into architecture, UX, implementation, and QA tasks with explicit file ownership." },
        ],
      },
    ],
  },
];

export const flattenedJourneyTopics = aiJourneyWaves.flatMap((wave, waveIndex) =>
  wave.milestones.flatMap((milestone, milestoneIndex) =>
    milestone.topics.map((topic) => ({ ...topic, wave, waveIndex, milestone, milestoneIndex })),
  ),
);

export const journeyTopicCount = flattenedJourneyTopics.length;

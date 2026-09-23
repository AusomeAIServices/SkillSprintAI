export type PathUnit = { id: string; title: string; practice: string; module: string; minutes: 15 };
export type LearningPath = { slug: string; title: string; audience: string; description: string; prerequisite: string; outcome: string; units: PathUnit[] };

function units(prefix: string, modules: Array<[string, string[]]>): PathUnit[] {
  return modules.flatMap(([module, lines], moduleIndex) => lines.map((line, index) => {
    const [title, practice] = line.split("|");
    if (!title || !practice) throw new Error(`Incomplete ${prefix} course unit in ${module}`);
    const before = modules.slice(0, moduleIndex).reduce((sum, entry) => sum + entry[1].length, 0);
    return { id: `${prefix}${String(before + index + 1).padStart(2, "0")}`, title, practice, module, minutes: 15 as const };
  }));
}

export const learningPaths: LearningPath[] = [
  { slug: "everyday-ai", title: "Everyday AI", audience: "Anyone starting with AI", description: "Use ChatGPT to understand, write, organize, and verify everyday information.", prerequisite: "None", outcome: "A checked personal task", units: units("F", [["ChatGPT in a Day", [
    "From Google search to ChatGPT|Turn a Google-style question about a fictional weekend plan into a request with a goal, context, constraints, and output; mark what needs checking.",
    "Know what AI can get wrong|Annotate a fictional AI answer: separate supplied facts, assumptions, and claims you would verify.",
    "Learn something unfamiliar through examples|Ask for a plain-language explanation of a new topic, then write a two-sentence teach-back in your own words.",
    "Write and revise for an audience|Draft a short message for a fictional neighbor, then revise its tone and explain the change.",
    "Summarize only supplied material|Summarize three fictional notes; link every important statement to its source note.",
    "Compare choices without inventing facts|Compare two fictional options in a small table and mark missing information instead of guessing.",
    "Protect privacy and verify claims|Redact a fictional request before using AI and list two ways to check an important claim.",
    "Combine the skills|Create a small personal plan from fictional details, identify assumptions, and write one correction before reuse."
  ]]]) },
  { slug: "ai-for-students", title: "AI for Students", audience: "Independent learners and students", description: "Use AI as a tutor while keeping your own reasoning, source checks, and academic integrity.", prerequisite: "None; follow your teacher's AI policy", outcome: "A source-checked teach-back", units: units("S", [["Study with understanding", [
    "Ask for an explanation at your level|Write a prompt that states a fictional course level and asks for an explanation in everyday words or Tagalog.",
    "Unpack a hard concept|Choose a familiar analogy for a sample biology concept and map three key words back to their precise meanings.",
    "Break a topic into small steps|Divide a fictional multi-step process into three connected explanations and note where you are unsure.",
    "Practise one question at a time|Write a tutoring request that asks one question, waits for your answer, and gives a hint before revealing a solution.",
    "Diagnose a misconception|Explain a fictional student's wrong answer, locate the mistaken step, and write a question that would reveal it.",
    "Study from approved notes|Use supplied fictional class notes to draft an explanation; mark each claim that needs textbook confirmation.",
    "Respect integrity and privacy|Rewrite a study request so AI helps with understanding without completing an assignment or exposing student details.",
    "Teach the idea back|Without copying an AI answer, explain a concept in your own words and check it against the supplied notes."
  ]]]) },
  { slug: "ai-at-work", title: "AI at Work", audience: "Information workers", description: "Create reviewed messages, summaries, and repeatable workplace workflows.", prerequisite: "Everyday AI or equivalent", outcome: "A reusable workplace workflow", units: units("W", [["Useful deliverables", [
    "Define a deliverable|Turn a fictional team request into a clear outcome, audience, deadline, and quality bar.",
    "Summarize meeting notes|Write a concise update from supplied fictional notes, separating decisions, actions, and open questions.",
    "Draft an audience-specific email|Draft a fictional status email for two audiences and explain what changes for each.",
    "Synthesize conflicting notes|Combine two fictional project notes while flagging the contradiction rather than choosing a side without evidence."
  ]], ["Work with supplied context", [
    "Inspect a small table|Describe a trend in a fictional five-row table and identify a conclusion the data cannot support.",
    "Draft a standard operating procedure|Turn a fictional recurring task into numbered steps with an owner and a review checkpoint.",
    "Delegate a bounded task|Write a safe delegation brief with input, expected output, allowed actions, and a human approval boundary.",
    "Supply appropriate file context|Choose the minimum fictional file excerpts needed for a task and remove irrelevant sensitive fields."
  ]], ["Review and reuse", [
    "Review a generated artifact|Check a fictional generated update for omissions, unsupported claims, and audience fit.",
    "Specify a repeatable workflow|Map a weekly workflow from input to draft to verification and final human approval.",
    "Create a reusable task brief|Write a template with goal, context, constraints, output, and a quality checklist.",
    "Produce a checked weekly update|Use supplied fictional project notes to write a weekly update with actions, uncertainties, and reviewer sign-off."
  ]]]) },
  { slug: "professional-practice", title: "Professional Practice", audience: "Nontechnical professionals", description: "Apply AI within professional review boundaries using fictional HR, sales, consulting, and operations cases.", prerequisite: "Everyday AI", outcome: "A domain brief with a review procedure", units: units("P", [["Task boundaries", [
    "Define a professional task|Scope a fictional operations request and state what the AI may and may not decide.",
    "Redact case material|Remove names and sensitive fields from a fictional HR case before drafting a prompt.",
    "Separate evidence from inference|Mark facts, interpretations, and missing details in a fictional consulting brief.",
    "Identify expert review|Specify which parts of a fictional sales proposal need a qualified human review."
  ]], ["Communication", [
    "Prepare an intake summary|Summarize a fictional client intake with source details and unresolved questions.",
    "Draft a client explanation|Explain a fictional process in clear language without claiming an expert decision.",
    "Adapt tone and reading level|Rewrite a fictional professional message for a first-time customer and compare versions.",
    "Find omitted qualifications|Review a fictional confident answer and insert necessary limits and caveats."
  ]], ["Analysis", [
    "Build a source-based brief|Make a one-page fictional operations brief with each claim tied to supplied notes.",
    "Reconcile conflicting notes|Show two conflicting fictional reports side by side and propose a verification step.",
    "State uncertainty|Distinguish known facts from estimates in a fictional client update.",
    "Construct a review checklist|Write a five-point checklist a human reviewer can use before sending an artifact."
  ]], ["Workflow", [
    "Template a recurring task|Create a repeatable prompt template for a fictional weekly operations report.",
    "Assign reviewers|Map creator, verifier, approver, and accountable owner for a fictional team workflow.",
    "Document provenance|Record which fictional notes support each part of a draft and when they were supplied.",
    "Complete a domain brief|Produce a fictional HR or operations brief with sources, uncertainties, and review steps."
  ]]]) },
  { slug: "lead-with-ai", title: "Lead with AI", audience: "Executives and team leaders", description: "Choose responsible AI pilots, measure value, and assign human accountability.", prerequisite: "Everyday AI or an executive diagnostic", outcome: "A pilot and governance memo", units: units("L", [["Understand", [
    "Understand capabilities and limits|List three useful and three unsuitable uses for AI in a fictional team.",
    "Choose a task|Select one fictional business task with a clear owner, input, and measurable result.",
    "Baseline time and quality|Define current time, error, and review measures before proposing automation.",
    "Evaluate a demo critically|Review a fictional demo and list evidence needed beyond a successful example."
  ]], ["Decide", [
    "Prioritize use cases|Rank three fictional use cases by value, feasibility, and risk, explaining the trade-offs.",
    "Estimate total cost|Build a rough pilot cost table including setup, review, training, and ongoing use.",
    "Assess data and operational risk|Identify sensitive data, failure modes, and safeguards for a fictional pilot.",
    "Assign human accountability|Name who can approve, stop, and audit a fictional AI-assisted workflow."
  ]], ["Lead", [
    "Write a pilot charter|State scope, owner, users, duration, and review requirements for a fictional pilot.",
    "Define success and stop criteria|Write measurable success thresholds and two conditions that pause the pilot.",
    "Plan workforce adoption|Draft a training and feedback plan for a fictional affected team.",
    "Produce an investment memo|Recommend whether to continue a fictional pilot and show assumptions and uncertainties."
  ]]]) },
  { slug: "build-with-codex", title: "Build with Codex", audience: "Developers and IT professionals", description: "Move from repository understanding to a tested, reviewable code change and coordinated agent work.", prerequisite: "Basic Git, files, terminal, and programming", outcome: "A tested change and reviewed PR", units: units("C", [["Repository literacy", [
    "Navigate a repository|Locate a fictional app entry point, tests, and instructions before suggesting a change.",
    "Explain an architecture|Draw a small request-to-storage map from a supplied repository sketch.",
    "Inspect tests|Identify the behavior a fictional test protects and a meaningful missing case.",
    "Write acceptance criteria|Turn a small fictional feature request into observable before-and-after criteria."
  ]], ["Codex basics", [
    "Give task context|Write a Codex task with repository context, desired behavior, constraints, and validation.",
    "Inspect a proposed change|Review a sample diff for scope, correctness, and unintended edits.",
    "Run validation|Choose the smallest meaningful checks for a fictional change and record their outcomes.",
    "Summarize a diff|Write a reviewer summary that describes behavior, tests, and limits."
  ]], ["VS Code workflow", [
    "Use Codex in VS Code|Plan a bounded editor task and record what you would inspect before accepting changes.",
    "Maintain project instructions|Draft short repository instructions for tests, secrets, and file ownership.",
    "Implement a bounded feature|Break a fictional UI feature into one small change and its acceptance check.",
    "Diagnose a failing test|Use a supplied failing-test transcript to form and verify a hypothesis."
  ]], ["Delivery", [
    "Create a branch|Plan a branch from the intended base and identify unrelated working-tree changes.",
    "Prepare a pull request|Draft a PR title and body describing a fictional fix and validation.",
    "Respond to review|Apply a fictional review comment and explain how you would re-check the change.",
    "Recover from a faulty change|Choose a safe rollback or correction path for a fictional regression."
  ]], ["Coordinated agents", [
    "Partition work|Split a fictional feature into independent agent tasks with integration ownership.",
    "Define contracts and ownership|Specify shared types, file ownership, and handoff criteria for two agents.",
    "Compare independent reviews|Reconcile two fictional review reports using evidence and priority.",
    "Integrate and resolve conflicts|Describe an integration order and tests after a fictional merge conflict."
  ]], ["Capstone", [
    "Plan a small feature|Write a feature brief and acceptance criteria for a learner-controlled sample app.",
    "Implement the feature|Make or describe a bounded code change in a safe sample repository.",
    "Test and review|Record tests and review the resulting diff against the acceptance criteria.",
    "Publish a reviewable evidence pack|Prepare a PR link or local diff, checks, known limits, and a short reflection."
  ]]]) },
  { slug: "build-ai-systems", title: "Build AI Systems", audience: "AI practitioners and developers", description: "Design, evaluate, and operate bounded agent applications with a portable harness mindset.", prerequisite: "Programming, HTTP/JSON, secrets, and basic tests", outcome: "An evaluated agent application", units: units("A", [["API foundations", [
    "Understand request and response|Sketch the JSON input and output for a fictional AI helper endpoint.",
    "Keep keys server-side|Identify where an API key belongs in a sample app and remove it from a browser request.",
    "Specify structured output|Define a small JSON result shape and two invalid examples to reject.",
    "Handle errors|Map timeout, invalid output, and unavailable provider to safe user-facing states."
  ]], ["Grounded apps", [
    "Define a source corpus|Select a tiny fictional document set and record its scope and revision date.",
    "Retrieve relevant text|Choose which supplied paragraph answers a fictional question and explain why.",
    "Cite evidence|Attach source IDs to claims in a short answer based only on supplied text.",
    "Test unsupported questions|Write a question the corpus cannot answer and define the safe response."
  ]], ["Quality", [
    "Construct an evaluation set|Create three fictional cases including a normal, ambiguous, and adversarial request.",
    "Score deterministic criteria|Write a machine-checkable rule for output shape and a human rubric for usefulness.",
    "Inspect failures|Group fictional evaluation failures by cause and propose one targeted fix.",
    "Compare configurations|Design an A/B comparison with fixed cases, costs, and known uncertainty."
  ]], ["Agents SDK", [
    "Define one agent|Describe one bounded agent role, instructions, inputs, and outputs.",
    "Expose one bounded tool|Specify a read-only tool contract with validated arguments and errors.",
    "Retain appropriate state|Decide what state a fictional workflow needs and what sensitive content to avoid retaining.",
    "Inspect a trace|Use a fictional trace to find where a wrong answer or excess tool call began."
  ]], ["Tool boundaries", [
    "Validate arguments|Define checks for a fictional tool call before it touches an external system.",
    "Approve side effects|Place a human approval checkpoint before a fictional write or send action.",
    "Treat retrieved text as untrusted|Mark an injected instruction inside fictional retrieved material and ignore its command.",
    "Test injection attempts|Design two prompt-injection fixtures and expected safe outcomes."
  ]], ["Orchestration", [
    "Compare one agent and specialists|Choose when a fictional task benefits from a specialist rather than one agent.",
    "Choose manager or handoff|Sketch control and response ownership for a two-agent workflow.",
    "Cap steps and cost|Set a maximum tool-call count, time, and cost for a fictional run.",
    "Evaluate added complexity|Compare specialist results against a single-agent baseline on the same fixtures."
  ]], ["Harnesses and cloud", [
    "Compare managed and owned runtimes|Make a decision table for control, operations, durability, and cost.",
    "Containerize a sample|Write a deployment checklist for a fictional containerized service with health checks.",
    "Design a provider adapter|Define a capability-aware interface and mark unsupported features explicitly.",
    "Compare another environment|Use fixtures to record behavior differences without claiming cloud equivalence."
  ]], ["Capstone", [
    "Design an agent application|Specify a bounded user task, sources, tool permissions, and success criteria.",
    "Implement the application|Build or describe a small sample with server-side credentials and validated inputs.",
    "Evaluate failures, cost, and latency|Run or plan a reproducible fixture suite and summarize its results.",
    "Present an evidence pack|Document architecture, tests, traces, limits, and a rollback path for human review."
  ]]]) }
];

export function findPath(slug: string) { return learningPaths.find((path) => path.slug === slug); }

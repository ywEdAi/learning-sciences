import { e } from "../lib.mjs";

export default [
  e({
    id: "system-resource-tradeoffs", label: "System-level resource decisions and cost-effectiveness", layer: "construct",
    aliases: ["class size", "teacher effects", "cost per additional month of progress"],
    summary: "Which teacher a learner gets matters more than most structural variables, and expensive structural levers such as class-size reduction buy less progress per unit cost than several cheaper instructional ones.",
    mechanism: "Structural changes act only through what they let teachers and learners do differently; where they do not change instruction, they produce little.",
    traditions: ["critical-equity", "instructional-design"], domains: ["general", "teacher-development"], stages: ["primary", "middle", "secondary"],
    functions: ["sequence", "access", "climate"], grain: "program-system", maturity: "consolidating",
    tasks: ["resource allocation", "programme selection", "policy analysis"],
    contexts: ["school systems", "policy", "programme evaluation"],
    prereq: ["Cost data alongside effect data", "Local implementation-capacity assessment"],
    constraints: ["Cost-effectiveness rankings are context- and price-specific and travel badly across systems", "Class-size effects are small relative to cost and concentrated in the earliest grades", "Teacher-effect estimates are not a licence for high-stakes individual teacher measurement"],
    risks: ["Importing another system's toolkit rankings without local costs", "Using teacher-effect research to justify punitive evaluation", "Choosing the visible structural lever over the cheaper instructional one"],
    obs: [["Progress per unit cost, locally estimated", "Effect estimates paired with local cost data and an implementation-capacity check", "At allocation decisions", "Published rankings assume prices and conditions that may not hold locally"]],
    ev: { status: "context-dependent", confidence: "moderate", basis: "Systematic review evidence on class-size effects, primary evidence on the magnitude of teacher effects, and institutional cost-effectiveness syntheses.", directness: "mixed-direct-and-inferential", generalizability: "Findings are system- and price-specific; the ordering of options changes across contexts.", sources: ["filges-class-size", "nye-teacher-effects", "eef-toolkit", "dietrichson-low-ses"] },
    rec: { status: "contextual-option", rationale: "Compare options on locally costed progress, and prefer instructional levers over structural ones unless local evidence says otherwise." },
    tags: ["construct", "policy", "equity", "measurement"],
  }),
];

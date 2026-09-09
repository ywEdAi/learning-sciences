# Learning-sciences knowledge rack `0.2.0`

Status: draft · Research cut: 2026-08-30 · Supersedes `0.1.0` (kept immutable)

## What changed

`0.1.0` was a 43-entry breadth-first rack. `0.2.0` is an enrichment and classification pass:

| | 0.1.0 | 0.2.0 |
|---|---|---|
| Entries | 43 | **180** |
| Relations | 44 | **217** (density 1.21, zero orphans) |
| Sources | 36 | **241** |
| Object types | 5 kinds | **9 classified layers** |
| Classification facets | none | **7 controlled facets** |
| Effect estimates | none | 38 entries |
| Source metadata | hand-typed | **Crossref-verified verbatim** |
| Schema enforcement | declarative only | **enforced in the build** |

Every source is verified: 216 by DOI against Crossref (title, authors, year taken verbatim from the registry, never typed by hand), 25 institutional documents by HTTP resolution. Four of those — EEF, OECD, CASEL, Council of Europe — block automated requests and are recorded as `unverified-host-blocks-automated-requests` rather than silently claimed as checked.

## The classification scheme

Every entry carries seven facets, all drawn from controlled vocabularies in `taxonomy.json`. The primary one is **layer** — what kind of knowledge object this is, which is the distinction most often collapsed in pedagogy discussions:

| Layer | n | What it is | Examples |
|---|---|---|---|
| `theory` | 14 | Explanatory account; generates predictions, is not an instruction | cognitive load theory, sociocultural/ZPD, simple view of reading, andragogy |
| `framework` | 26 | Organizing scheme for design or analysis; usually not a causal claim | KLI/knowledge components, ICAP, Bloom revised, TPACK, MTSS |
| `principle` | 20 | General design rule abstracted from convergent evidence | desirable difficulties, expertise reversal, learning-vs-performance |
| `method` | 31 | Named approach at lesson-to-course grain | explicit instruction, mastery learning, ITS, PBL, reciprocal teaching |
| `tactic` | 49 | Single concrete move inside a lesson or session | retrieval practice, wait time, pretesting, dialogic reading |
| `construct` | 23 | Measurable learner/task/context variable | prior knowledge, working memory, self-efficacy, math anxiety, SES |
| `measure` | 1 | Instrument or measurement approach | curriculum-based measurement |
| `constraint` | 6 | Normative, ethical, or access requirement | accessibility by design, validity, fair assessment |
| `anti-pattern` | 10 | Refuted, contested-beyond-evidence, or harmful as usually implemented | learning styles, neuromyths, brain training, minimal guidance |

The other six facets:

- **tradition** (10) — cognitive, behavioral, sociocultural, constructivist, motivational-social, developmental, psychometric, instructional-design, critical-equity, neuroscience.
- **domain** (18) — `general:119, mathematics:44, science:31, literacy:30, professional-workplace:21, digital-environments:19, assessment-measurement:18, special-education:15, multilingual:10, health:10, engineering-design:7, computing:7, physical-motor:6, teacher-development:6, music:5, history-social-studies:5, world-language:5, arts:1`.
- **lifespanStage** (9, ordered) — `infancy-toddler:4, preschool:25, primary:88, middle:101, secondary:106, postsecondary:79, adult-workplace:52, older-adult:6, cross-lifespan:42`. A stage means *evidence exists for this stage*, never *this learner has this capability*.
- **function** (13) — what job it does in a learning cycle: `practice:68, explain:50, sequence:38, diagnose:37, feedback:33, transfer:31, climate:26, assess:25, access:22, motivate:22, self-regulate:22, consolidate:19, collaborate:16`.
- **grainSize** (4, ordered) — micro-move → lesson → unit-course → program-system.
- **maturity** (5) — how settled the object is, *independent of its effect size*: `established:99, consolidating:56, disputed:12, deprecated:8, emerging:5`. This is deliberately orthogonal to the evidence grade: productive struggle is `disputed` maturity with `contested` evidence, while accessibility standards are `established` maturity with `normative-standard` evidence and no effect estimate at all.

`classification.csv` is the long-format entry × facet table for pivoting.

## Evidence discipline

Evidence grade (`strong / context-dependent / hypothesis / contested / refuted / normative-standard`) stays separate from recommendation status (`candidate-default-with-fit-check / contextual-option / experimental-only / do-not-generalize / avoid`). Current distribution: evidence `strong:77, context-dependent:69, contested:14, refuted:8, normative-standard:7, hypothesis:5`; recommendation `contextual-option:81, candidate-default:69, do-not-generalize:13, avoid:9, experimental-only:8`. **No entry is a universal mandate.**

Four grading rules are now enforced mechanically by `build-rack.mjs`, so a violation fails the build:

1. A `strong` grade requires at least one meta-analysis, systematic review, practice guide, or consensus report, and non-normative directness; a `strong` grade resting on consensus-design directness requires at least two consensus or practice-guide sources.
2. `refuted` evidence must carry `avoid` or `do-not-generalize`.
3. An `anti-pattern` can never be a candidate default.
4. `contested` evidence can never be promoted to a candidate default.
5. A `normative-standard` may not carry an effect estimate.

These rules caught three real defects during the build, all of which were fixed rather than exempted: expectancy-value theory and curriculum-based measurement were graded `strong` on theory-review and standards sources, and were downgraded to `context-dependent` with an explanatory note; TPACK carried `teacher-development` as a research tradition, which is a domain.

The `strong` definition was **amended** in 0.2.0 to admit convergent institutional consensus synthesis as a third qualifying basis. `0.1.0` defined it as direct evidence *or* an evidence-rated practice guide, but then graded two consensus-report-only entries as strong. Amending the stated scale and enforcing it is honest; leaving the mismatch was not.

## Corrections applied to inherited records

The 43 entries from `0.1.0` are carried unchanged except where an audit found a defect. Each carries `provenance.status`:

- **`pedagogy:prior-knowledge-diagnostic`** (`inherited-corrected`) — was graded `strong` on a single consensus report, which its own scale did not license. Sources broadened to include an evidence-rated practice guide and knowledge-component research; the grade stands because it is now supported.
- Three source titles that `0.1.0` paraphrased are now verbatim from Crossref. The third matters substantively: the UDL source is *"Unraveling Challenges with the **Implementation** of Universal Design for Learning"* — an implementation-barriers review, not an effectiveness review.

## What the enrichment added

Coverage that `0.1.0` lacked, organized by the gap it fills:

- **Theories** (new layer): cognitive load theory, sociocultural/ZPD, schema and knowledge organization, CTML, dual coding, conceptual change, threshold concepts, simple view of reading, SDT, expectancy-value, deliberate practice, andragogy, transformative learning, variation theory.
- **The tutoring evidence base**, which is the closest precedent for an agentic tutoring runtime: one-to-one tutoring (`d≈0.4`, with the two-sigma claim marked as not a reproducible benchmark), intelligent tutoring systems (`g≈0.66`, with **interaction granularity, not AI technique**, as the moderator), mastery learning, peer tutoring, simulation-based mastery learning.
- **The Knowledge-Learning-Instruction framework** — the natural bridge from a knowledge rack to a working graph, and the one most worth building on.
- **Expertise reversal as a first-class principle**, not a scattered risk bullet. It is the single most important boundary condition in the rack, and now moderates worked examples, scaffolding, and multimedia by explicit edges.
- **Desirable difficulties and the learning-vs-performance distinction** as the organizing principles that unify spacing, interleaving, retrieval, and contextual interference — and that make in-session product metrics dangerous.
- **Methods**: explicit instruction, active learning, PBL, guided inquiry, project-based learning, flipped classroom, blended/online, games, gamification, simulations, homework, differentiation, classroom management, coaching, study-skills programmes.
- **Constructs and variables**: prior knowledge, working memory, self-efficacy, achievement goals, interest, grit, stereotype threat, teacher expectancy, math/test anxiety, engagement, climate, monitoring accuracy, SES, attention/multitasking, sleep, physical activity, executive function, cognitive aging, system resource trade-offs.
- **Lifespan ends**: infancy and preschool (dialogic reading, guided play, home learning environment, EF, early number magnitude, learning trajectories, SEL, preschool convergence, Montessori, screen media); adult and later life (transfer of training, training design, MOOC self-regulation, cognitive aging, PIAAC, coaching).
- **Domains 0.1.0 omitted**: history (sourcing/corroboration), world language (instructed SLA, corrective feedback, TBLT), physical/motor (contextual interference, attentional focus, feedback frequency), music/arts, health professions, teacher development, system policy.
- **Ten anti-patterns**, now including neuromyths, brain training, music/chess far transfer, multiple intelligences, digital natives, rereading/highlighting, minimal guidance, and "the learner knows best".
- **Effect estimates on 38 entries**, so an agent choosing between two `context-dependent` options has something to arbitrate with.
- **Institutional balance**: EEF (UK), AERO (Australia), OECD, UNESCO, Council of Europe, CASEL, CAST alongside the US IES/WWC, NASEM, and AERA/APA/NCME base — plus Dunlosky et al. (2013), the canonical evidence-rating review that `0.1.0` omitted entirely.

## Findings worth stating plainly

1. **Interaction granularity, not model capability, is what the tutoring evidence rewards.** ITS reaches near-human-tutor effectiveness because it acts at the step where the error occurs. A chat interface without a learner model is not a step-based tutor, whatever it is built on.
2. **Every in-session success metric is a trap.** Retrieval, spacing, interleaving, contextual interference, and reduced feedback frequency all *depress* performance during practice while improving retention. A system optimized on session-level correctness will systematically select the worse pedagogy.
3. **Prior knowledge is the routing variable, and it is component-specific.** Expertise reversal means the same support helps and then harms the same learner. A global "level" label is not merely imprecise; it is wrong in a direction that compounds.
4. **Feedback is the highest-variance lever in the rack.** Positive on average, harmful in over a third of interventions in the classic meta-analysis, and inert without a revision opportunity. Person-directed praise does not help.
5. **Popular umbrella terms should be indexed at strategy level.** Formative assessment's rigorous meta-analytic estimate (`d≈0.2`) is well below the figures usually quoted; the same caution applies to UDL, differentiation, PBL, and engagement.
6. **The refuted set is load-bearing.** Learning styles, brain training, music/chess far transfer, multiple-intelligences matching, digital natives, and minimal guidance for novices are all things a plausible-sounding agent will otherwise reproduce on demand.

## Known limits

- Grades are engineering-facing summaries, not GRADE ratings; this is not a registered systematic review.
- Only 6 entries carry recommendation-level `sourceLocators`; the rest cite at document level. WWC guides rate *per recommendation*, so document-level citation remains the largest outstanding provenance weakness.
- 9 of 180 entries rest on a single source. `hpl2` still backs 26 entries and `ies-study` 13.
- Effect estimates are on 38 entries, are often single-figure summaries of heterogeneous distributions, and carry no confidence intervals in most cases.
- Domain coverage remains uneven: arts (1), history (5), world language (5), music (5), physical-motor (6). Infancy (4) and older adults (6) are thin.
- The evidence base is still English-language and Anglophone-institution weighted despite the added EEF/AERO/OECD/UNESCO sources.
- Nothing here is independently reviewed by domain specialists. Version `0.2.0` remains `draft`.

## Proposed integration (unchanged in principle from 0.1.0)

Still **not kernel policy**. `rack.json` defines no selection rule, and nothing in `src/` imports it. A specialist agent or the working-graph prompt lab should:

1. query by facet — layer, domain, lifespan stage, function, grain size, maturity, evidence status — using the controlled vocabularies, which is now actually possible;
2. return the **complete record** with constraints, risks, observables, effect, source ids and locators, and adjacent relations — never a bare label;
3. attach retrieved records to a task-scoped unknown with versioned provenance (`rack:learning-sciences@0.2.0` plus entry id);
4. let the model propose a fit hypothesis and name the next discriminating observation;
5. let a reviewer challenge applicability, alternatives, equity, and assistance dependence;
6. promote to a skill or primitive only after the learner operation, evidence event, feedback policy, failure modes, and adversarial tests are specified.

The runtime should validate rack/version/entry/source references and preserve public rationales. It should **not** encode `if evidence=strong then select tactic`, infer learner traits, or treat this rack as a lesson DAG.

## Next

- Recommendation-level locators for all practice-guide citations.
- Confidence intervals and *k* on the 38 effect estimates; add estimates where they exist.
- Independent specialist review of source-to-claim mapping, per domain.
- Thicken arts, history, world language, physical/motor, infancy, older adults, and neurodivergent learners.
- Per-entry `lastReviewed` and expiry, with change notes between versions.
- Adversarial retrieval evaluations in `experiments/working-graph-prompt-eval`: does retrieval improve decisions, or does it just produce vocabulary stuffing and policy-like behaviour?

# Initial learning-sciences knowledge rack

Version: `0.1.0` (draft)  
Research cut: 2026-08-30

## Outcome

This package is an initial, cross-lifespan pedagogical knowledge source for EduOS specialist agents. It covers general learning science, early childhood, learner development, K–12, adult and workplace learning, accessibility, literacy, multilingual learning, writing, mathematics, science, computing, and assessment.

It is deliberately **not kernel policy**. The rack supplies retrievable candidates, mechanisms, boundary conditions, risks, observable evidence, evidence grades, provenance, and relations. A pedagogical agent must still inspect the current learner/task evidence; a reviewer must still challenge semantic fit and overclaiming; and the runtime should validate references, permissions, privacy, and artifact contracts rather than choosing pedagogy deterministically.

## Research approach and limits

The search prioritized:

1. peer-reviewed primary studies, systematic reviews, and meta-analyses;
2. evidence-rated U.S. Institute of Education Sciences / What Works Clearinghouse practice guides;
3. National Academies consensus reports;
4. authoritative professional or technical standards from AERA/APA/NCME and W3C; and
5. institutional curricular frameworks where they are influential, clearly labeled as consensus/design guidance rather than causal intervention evidence.

Anchor syntheses include [How People Learn II](https://doi.org/10.17226/24783), the IES guide on [organizing instruction and study](https://ies.ed.gov/ncee/wwc/PracticeGuide/1), the WWC [early-childhood guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/30), the National Research Council [assessment triangle](https://doi.org/10.17226/10019), and the [Standards for Educational and Psychological Testing](https://www.apa.org/science/programs/testing/standards).

This is a breadth-first initial rack, not a registered systematic review. Its grades are engineering-facing summaries, not GRADE ratings. Individual records preserve the population, directness, generalizability, and cautions needed to inspect the claim. Version `0.1.0` should be independently reviewed by domain specialists before production use.

## Evidence model

- `strong`: convergent direct evidence or an evidence-rated practice guide supports the bounded claim.
- `context-dependent`: positive or plausible evidence is materially moderated by content, population, comparator, implementation, or outcome.
- `hypothesis`: an explanatory or design prediction useful for testing, not a general rule.
- `contested`: credible evidence shows inconsistency, small effects, or claims that exceed the findings.
- `refuted`: the proposed instructional benefit lacks the necessary evidence or is contradicted by adequate tests.
- `normative-standard`: an authoritative accessibility, fairness, or design standard—not a learning-effect estimate.

Recommendation status is separate. A strong finding is still only a `candidate-default-with-fit-check`; the rack contains no universal mandate.

## Structured synthesis

The full mechanism, context, prerequisites, constraints, risks, measures, and provenance are in `rack.json` and `entries.csv`.

| Area | Concept / framework / tactic | Evidence | Retrieval boundary or decisive observation |
|---|---|---|---|
| General | Prior-knowledge diagnostic | Strong | Route on task evidence; failed performance can reflect language, access, affect, or misunderstanding. |
| General | Contingent scaffolding with fading | Context-dependent | Require contingency, fading, and unassisted performance; support-visible success is not independence. |
| General | Cognitive-load-aware design | Context-dependent | Reduce avoidable processing, not all difficulty; triangulate load and measure delayed learning. |
| General | Worked examples followed by fading | Strong | Strongest for novices and structured tasks; detect copying and expertise reversal. |
| General | Retrieval practice / active recall | Strong | Keep stakes low, correct errors, and measure delayed recall plus application. |
| General | Spacing / distributed practice | Strong | The optimal gap depends on the retention horizon and item difficulty. |
| General | Interleaving for discrimination | Context-dependent | Best when choosing among confusable categories; material type can null or reverse the effect. |
| General | Self-explanation and explanatory questions | Context-dependent | Observe correctness of conceptual links, not verbosity; correct generated misconceptions. |
| General | Actionable task/process feedback | Strong | Feedback can harm; require a clear goal, usable next step, and opportunity to act. |
| General | Metacognitive calibration / SRL | Context-dependent | Ground monitoring in external performance; confidence and reflection logs are not sufficient. |
| General | Transfer through varied cases and bridging | Context-dependent | Pre-specify distance, cueing, context, and delay; far transfer is never assumed. |
| Assessment | Formative assessment cycle | Context-dependent | It is formative only when evidence changes the next action and follow-up measures gap closure. |
| Assessment | Assessment triangle | Normative standard | Trace cognition → observation → interpretation before making learner claims. |
| Assessment | Validity and score precision | Normative standard | Validity belongs to an interpretation/use; a reliable score can still be invalid. |
| Assessment | Fair and accessible assessment | Normative standard | Verify construct preservation, assistive-technology access, and subgroup evidence. |
| Representation | Coherent multimedia | Context-dependent | Choose media by content and access, not a learner-style label; decorative media is a risk. |
| Representation | Concrete-to-abstract linking | Context-dependent | Require bidirectional mapping and test a changed representation. |
| Engagement | ICAP ordering | Hypothesis | Treat overt engagement as a proxy and test generated/co-constructed knowledge independently. |
| Collaboration | Structured cooperative learning | Context-dependent | Require interdependence, individual accountability, equitable participation, and individual transfer. |
| Challenge | Productive failure | Context-dependent | Use only with prerequisites, psychological safety, and explicit consolidation; strongest for conceptual transfer. |
| Challenge | Productive struggle | Contested | Measure both struggle and progress; persistence without progress is not productive. |
| Motivation | Autonomy, competence, belonging, purpose | Context-dependent | Pair real choice with structure and measure achievement separately from enjoyment. |
| Motivation | Growth-mindset messaging | Contested | Do not substitute a slogan for strategy, instruction, feedback, resources, or opportunity. |
| Anti-pattern | Learning-styles matching | Refuted | Preferences do not establish the required style-by-method interaction; route by content and access. |
| Early childhood | Intentional engaging practice | Strong | Use specific evidence-rated practices while protecting relationships, play, and developmental fit. |
| Early childhood | Guided play | Context-dependent | Evidence is strongest for selected early math/spatial outcomes, not every developmental domain. |
| Early childhood | Responsive interaction and shared reading | Strong | Observe reciprocal language and target growth; do not reduce quality to word counts. |
| Development | Calibration without fixed stages | Strong | Age and group averages cannot license individual capability claims. |
| Adolescence | Agency, identity, flexible pathways | Context-dependent | Meaningful choice still needs relationships, competence support, and explicit learning goals. |
| Accessibility | Accessibility by design | Normative standard | WCAG conformance is an access floor; test real completion and measure learning separately. |
| Accessibility | UDL options | Contested | Record implemented checkpoints and fidelity; UDL does not replace accommodations or assistive technology. |
| Literacy | Explicit phoneme-grapheme mapping | Strong | Link speech to print and test unfamiliar-word decoding; pair with language and comprehension. |
| Literacy | Comprehension through strategy, structure, language, knowledge | Strong | Avoid generic strategy overload; measure meaning on unfamiliar texts. |
| Multilingual | Academic language integrated with content | Strong | Preserve grade-level content and distinguish language proficiency from disciplinary understanding. |
| Writing | Model–practice–feedback–reflect | Strong | Preserve audience and purpose; require revision and later independent writing. |
| Mathematics | Flexible early progressions | Context-dependent | Navigate from observed strategies, not chronological-age stages. |
| Mathematics | Systematic language and representations | Strong | Limit models, link each to quantity/symbol, and test generalization. |
| Mathematics | Strategy and error comparison | Context-dependent | Use after a baseline foothold; multiple methods can overload novices. |
| Science | Three-dimensional science learning | Context-dependent | Integrate knowledge and epistemic practices; framework alignment is not a causal effect. |
| Computing | Decompose–abstract–test–refine–communicate | Context-dependent | Inspect reasoning, debugging, participation, and impact—not artifact completion alone. |
| Adult | Supported self-directed learning | Context-dependent | Adult age does not imply readiness; require domain knowledge, feedback, time, access, and workplace support. |
| Adult | Deliberate practice with bounded claims | Contested | Useful for stable decomposable skills; hours do not explain expertise or merit by themselves. |
| Measurement | Delayed and transfer-oriented assessment | Context-dependent | Report retention, near/far, cued/uncued, and maintenance outcomes separately. |

## High-value findings and cautions

1. **Durable learning differs from smooth practice.** Retrieval and spacing have strong evidence for retention, while interleaving often depresses practice performance even when it improves later discrimination. Immediate fluency is therefore a dangerous sole objective.

2. **Novice support and independent performance must be a sequence.** Worked examples and scaffolds can reduce unproductive search, but examples should fade and evidence must be collected after assistance is removed. Prior knowledge is a relation between a learner and the current knowledge component—not a global novice/expert label.

3. **Feedback is not uniformly positive.** The classic feedback meta-analysis found a positive average but more than one third of interventions reduced performance ([Kluger & DeNisi, 1996](https://doi.org/10.1037/0033-2909.119.2.254)). Retrieval feedback, task/process focus, proportionate timing, and a real chance to revise are retrieval conditions, not optional polish.

4. **Productive failure is narrower than productive struggle.** The productive-failure meta-analysis supports a generation-then-consolidation sequence for conceptual knowledge and transfer under bounded conditions ([Sinha & Kapur, 2021](https://doi.org/10.3102/00346543211019105)). It does not validate prolonged frustration, unguided discovery, or support withholding.

5. **Development, culture, and accessibility are constraints on every tactic.** The National Academies rejects context-free accounts of learning. EduOS should not infer stable learner traits from one episode, route by fixed age stages, or confuse language/access barriers with missing knowledge.

6. **Popular umbrella terms deserve restraint.** Whole-package UDL effects remain difficult to isolate ([2024 systematic review](https://doi.org/10.1007/s10648-024-09860-7)); general growth-mindset achievement effects are very small or nonsignificant in higher-quality analyses ([Macnamara & Burgoyne, 2023](https://doi.org/10.1037/bul0000352)); learning-styles matching lacks the necessary interaction evidence ([Pashler et al., 2008](https://doi.org/10.1111/j.1539-6053.2009.01038.x)).

## Proposed EduOS integration

Keep this directory immutable after release and publish revisions in a new semantic-version folder. A later working-graph prompt lab or specialist agent should:

1. query records by task, learner stage, context, domain tags, evidence status, and observed prerequisites;
2. return the **complete record**, including constraints, risks, observables, source IDs, and adjacent relations—never only the tactic name;
3. attach retrieved records to a task-scoped unknown or option with versioned provenance;
4. let the model propose a fit hypothesis and the next discriminating evidence;
5. let a reviewer challenge applicability, alternatives, equity, and assistance dependence; and
6. promote a tactic into a concrete skill or primitive only after its learner operation, evidence event, feedback policy, failure modes, and adversarial passer/failer tests are specified.

The runtime should validate rack/version/entry/source references and preserve public rationales. It should **not** encode `if evidence=strong then select tactic`, infer traits, or treat this rack as a fixed lesson DAG.

## Next research gaps

- independent expert review of each source-to-claim mapping;
- stronger coverage of history/social studies, arts, physical/motor learning, multilingual literacy beyond English learners, neurodivergent learners, and older adults;
- newer replication and classroom-effect evidence for cognitive-load subclaims, multimedia principles, and metacognitive prompts;
- jurisdiction-specific disability, assessment, and child-safety requirements;
- expiry/re-review policy and change notes between rack versions; and
- task-level adversarial evaluations in `working-graph-prompt-eval` to test whether retrieval improves decisions without causing vocabulary stuffing or policy-like behavior.

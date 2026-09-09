#!/usr/bin/env node
// Builds rack 0.2.0 from authored sources: merges inherited 0.1.0 records with 0.2.0 additions,
// validates against the schema and against semantic rules, and emits JSON + CSV artifacts.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = async (p) => JSON.parse(await readFile(path.join(here, p), "utf8"));

const taxonomy = await read("taxonomy.json");
const verified = await read("sources.verified.json");
const manual = await read("sources.manual.json");
const inheritedRack = await read("../0.1.0/rack.json");
const inheritedClass = (await read("inherited-classification.json")).map;

const batches = ["a-theories", "b-methods", "c-tactics", "d-motivation-constructs", "e-early-childhood", "f-literacy-language", "g-subjects", "h-adult", "i-assessment", "j-anti-patterns", "k-system"];
const newEntries = [];
for (const b of batches) {
  const mod = await import(`./entries/${b}.mjs`);
  newEntries.push(...mod.default);
}
const newRelations = (await import("./relations.mjs")).default;

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);

// ---------- sources ----------------------------------------------------------------------
const BLOCKED_LINK_CHECK = new Set(["source:eef-toolkit", "source:oecd-piaac", "source:casel", "source:cefr"]);
const sources = [];
const seenSource = new Set();
for (const s of [...verified, ...manual]) {
  if (seenSource.has(s.id)) { fail(`duplicate source id ${s.id}`); continue; }
  seenSource.add(s.id);
  const record = { ...s };
  record.provenanceCheck = s.doi
    ? { method: "crossref-metadata", checkedAt: "2026-08-30", status: "verified" }
    : { method: "http-resolution", checkedAt: "2026-08-30", status: BLOCKED_LINK_CHECK.has(s.id) ? "unverified-host-blocks-automated-requests" : "verified" };
  delete record.verifiedVia;
  delete record.verifiedAt;
  sources.push(record);
}
sources.sort((a, b) => a.id.localeCompare(b.id));

// ---------- entries ----------------------------------------------------------------------
// Documented corrections applied to inherited 0.1.0 records (see REPORT.md, "Changes from 0.1.0").
const inheritedCorrections = {
  "pedagogy:prior-knowledge-diagnostic": (entry) => {
    entry.evidence.sourceIds = ["source:hpl2", "source:ies-study", "source:kli-framework"];
    entry.evidence.basis = "National consensus synthesis plus an evidence-rated practice guide and knowledge-component research; prior knowledge is the most consistently reported moderator of instructional effects.";
    entry.evidence.notes = "0.2.0 correction: 0.1.0 graded this strong on a single consensus report, which its own evidence scale did not license. Sources broadened rather than the grade lowered.";
  },
};

const entries = [];
for (const original of inheritedRack.entries) {
  const entry = structuredClone(original);
  const slug = entry.id.replace("pedagogy:", "");
  const c = inheritedClass[slug];
  if (!c) { fail(`inherited entry ${entry.id} has no classification`); continue; }
  const [layer, traditions, domains, lifespanStages, functions, grainSize, maturity] = c;
  entry.classification = { layer, traditions, domains, lifespanStages, functions, grainSize, maturity };
  entry.applicable.lifespanStages = lifespanStages;
  entry.provenance = { origin: "rack:learning-sciences-initial@0.1.0", status: "inherited" };
  if (inheritedCorrections[entry.id]) { inheritedCorrections[entry.id](entry); entry.provenance.status = "inherited-corrected"; }
  entries.push(entry);
}
for (const entry of newEntries) {
  entry.applicable.lifespanStages = entry.classification.lifespanStages;
  entry.provenance = { origin: "rack:learning-sciences@0.2.0", status: "new" };
  entries.push(entry);
}

// ---------- relations --------------------------------------------------------------------
const relations = [
  ...inheritedRack.relations.map((rel) => ({ ...rel, origin: "0.1.0" })),
  ...newRelations.map((rel) => ({ ...rel, origin: "0.2.0" })),
];

// ---------- validation -------------------------------------------------------------------
const entryIds = new Set();
for (const e of entries) {
  if (entryIds.has(e.id)) fail(`duplicate entry id ${e.id}`);
  entryIds.add(e.id);
}
const sourceIds = new Set(sources.map((s) => s.id));
const facet = taxonomy.facets;
const domainVocab = new Set(facet.domain.values);
const stageVocab = new Set(facet.lifespanStage.ordered);
const functionVocab = new Set(facet.function.values);
const grainVocab = new Set(facet.grainSize.ordered);
const layerVocab = new Set(Object.keys(facet.layer.values));
const traditionVocab = new Set(Object.keys(facet.tradition.values));
const maturityVocab = new Set(Object.keys(facet.maturity.values));

const QUALIFYING_STRONG = new Set(["meta-analysis", "systematic-review", "practice-guide", "consensus-report"]);
const ANTI_PATTERN_RECS = new Set(["avoid", "do-not-generalize"]);

for (const e of entries) {
  const c = e.classification;
  if (!c) { fail(`${e.id}: missing classification`); continue; }
  if (!layerVocab.has(c.layer)) fail(`${e.id}: unknown layer ${c.layer}`);
  if (c.layer !== e.kind) fail(`${e.id}: kind ${e.kind} disagrees with layer ${c.layer}`);
  if (!grainVocab.has(c.grainSize)) fail(`${e.id}: unknown grainSize ${c.grainSize}`);
  if (!maturityVocab.has(c.maturity)) fail(`${e.id}: unknown maturity ${c.maturity}`);
  for (const t of c.traditions) if (!traditionVocab.has(t)) fail(`${e.id}: unknown tradition ${t}`);
  for (const d of c.domains) if (!domainVocab.has(d)) fail(`${e.id}: unknown domain ${d}`);
  for (const s of c.lifespanStages) if (!stageVocab.has(s)) fail(`${e.id}: unknown lifespanStage ${s}`);
  for (const f of c.functions) if (!functionVocab.has(f)) fail(`${e.id}: unknown function ${f}`);
  if (c.lifespanStages.includes("cross-lifespan") && c.lifespanStages.length > 1) fail(`${e.id}: cross-lifespan cannot be combined with specific stages`);

  for (const f of ["summary", "mechanism"]) if (!e[f]?.length) fail(`${e.id}: missing ${f}`);
  for (const f of ["prerequisites", "constraints", "risks", "observableEvidence"]) if (!e[f]?.length) fail(`${e.id}: empty ${f}`);
  if (!e.evidence.sourceIds.length) fail(`${e.id}: no sources`);
  for (const s of e.evidence.sourceIds) if (!sourceIds.has(s)) fail(`${e.id}: unknown source ${s}`);
  for (const loc of e.evidence.sourceLocators ?? []) {
    if (!e.evidence.sourceIds.includes(loc.sourceId)) fail(`${e.id}: locator for uncited source ${loc.sourceId}`);
  }

  // Semantic rule 1: a "strong" grade must rest on a synthesis-grade source and non-normative directness.
  if (e.evidence.status === "strong") {
    const types = e.evidence.sourceIds.map((id) => sources.find((s) => s.id === id).type);
    if (!types.some((t) => QUALIFYING_STRONG.has(t))) fail(`${e.id}: status "strong" without a meta-analysis, systematic review, practice guide, or consensus report`);
    if (e.evidence.directness === "normative") fail(`${e.id}: status "strong" with normative directness`);
    if (e.evidence.directness === "consensus-design" && types.filter((t) => t === "consensus-report" || t === "practice-guide").length < 2) {
      fail(`${e.id}: status "strong" on consensus-design directness needs at least two consensus or practice-guide sources`);
    }
  }
  // Semantic rule 2: refuted claims must be recommended against.
  if (e.evidence.status === "refuted" && !ANTI_PATTERN_RECS.has(e.recommendation.status)) {
    fail(`${e.id}: refuted evidence with recommendation ${e.recommendation.status}`);
  }
  // Semantic rule 3: anti-patterns may never be a default.
  if (e.kind === "anti-pattern" && !ANTI_PATTERN_RECS.has(e.recommendation.status)) {
    fail(`${e.id}: anti-pattern with recommendation ${e.recommendation.status}`);
  }
  // Semantic rule 4: contested claims may not be a candidate default.
  if (e.evidence.status === "contested" && e.recommendation.status === "candidate-default-with-fit-check") {
    fail(`${e.id}: contested evidence promoted to candidate default`);
  }
  // Semantic rule 5: normative standards are not effect claims.
  if (e.evidence.status === "normative-standard" && e.evidence.effect) {
    fail(`${e.id}: normative standard carrying an effect estimate`);
  }
}

const relKeys = new Set();
const degree = new Map(entries.map((e) => [e.id, 0]));
for (const rel of relations) {
  if (!entryIds.has(rel.from)) fail(`relation from unknown entry ${rel.from}`);
  if (!entryIds.has(rel.to)) fail(`relation to unknown entry ${rel.to}`);
  if (rel.from === rel.to) fail(`self-relation on ${rel.from}`);
  for (const s of rel.sourceIds) if (!sourceIds.has(s)) fail(`relation ${rel.from}->${rel.to} cites unknown source ${s}`);
  const key = `${rel.from}|${rel.type}|${rel.to}`;
  if (relKeys.has(key)) fail(`duplicate relation ${key}`);
  relKeys.add(key);
  degree.set(rel.from, degree.get(rel.from) + 1);
  degree.set(rel.to, degree.get(rel.to) + 1);
}
const orphans = [...degree].filter(([, d]) => d === 0).map(([id]) => id);
if (orphans.length) fail(`entries with no relations: ${orphans.join(", ")}`);

const usedSources = new Set();
for (const e of entries) e.evidence.sourceIds.forEach((s) => usedSources.add(s));
for (const rel of relations) rel.sourceIds.forEach((s) => usedSources.add(s));
const unused = sources.filter((s) => !usedSources.has(s.id)).map((s) => s.id);
if (unused.length) warnings.push(`sources not cited by any entry or relation: ${unused.join(", ")}`);

if (errors.length) {
  console.error(`VALIDATION FAILED (${errors.length}):`);
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

// ---------- emit -------------------------------------------------------------------------
entries.sort((a, b) => a.id.localeCompare(b.id));
relations.sort((a, b) => `${a.from}${a.type}${a.to}`.localeCompare(`${b.from}${b.type}${b.to}`));

const rack = {
  schemaVersion: "1.1.0",
  rack: {
    id: "rack:learning-sciences",
    version: "0.2.0",
    title: "Learning-sciences, pedagogy, and instructional-methods knowledge rack",
    status: "draft",
    createdAt: "2026-08-30",
    supersedes: "rack:learning-sciences-initial@0.1.0",
    scope: "A classified, cross-lifespan, cross-domain retrieval source for pedagogical specialist agents, spanning theories, frameworks, principles, methods, tactics, learner and context constructs, measures, constraints, and anti-patterns from infancy through adult and later-life learning.",
    nonPolicyNotice: "These records are candidates for retrieval and review, not kernel rules. An agent must check learner evidence, task fit, context, permissions, and contraindications before recommending or instantiating anything here.",
  },
  taxonomy,
  evidenceScale: {
    ...inheritedRack.evidenceScale,
    strong: "Convergent direct evidence, an evidence-rated institutional practice guide, or convergent institutional consensus synthesis supports the bounded claim. Amended in 0.2.0 and now machine-enforced by build-rack.mjs.",
  },
  recommendationScale: inheritedRack.recommendationScale,
  sources,
  entries,
  relations,
};

const stats = {
  entries: entries.length,
  relations: relations.length,
  sources: sources.length,
  byLayer: {}, byEvidence: {}, byDomain: {}, byStage: {}, byFunction: {}, byMaturity: {}, byRecommendation: {},
};
for (const e of entries) {
  const bump = (o, k) => { o[k] = (o[k] ?? 0) + 1; };
  bump(stats.byLayer, e.classification.layer);
  bump(stats.byEvidence, e.evidence.status);
  bump(stats.byMaturity, e.classification.maturity);
  bump(stats.byRecommendation, e.recommendation.status);
  for (const d of e.classification.domains) bump(stats.byDomain, d);
  for (const s of e.classification.lifespanStages) bump(stats.byStage, s);
  for (const f of e.classification.functions) bump(stats.byFunction, f);
}
rack.statistics = stats;

const schema = await read("rack.schema.json");
const { validate } = await import("./validate-schema.mjs");
const schemaErrors = validate(schema, rack);
if (schemaErrors.length) {
  console.error(`SCHEMA VALIDATION FAILED (${schemaErrors.length}):`);
  for (const e of schemaErrors.slice(0, 25)) console.error("  -", e);
  process.exit(1);
}

await writeFile(path.join(here, "rack.json"), `${JSON.stringify(rack, null, 2)}\n`);

// ---------- CSV --------------------------------------------------------------------------
const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const join = (a) => (a ?? []).join(" | ");
const csv = (rows) => `${rows.map((r) => r.map(q).join(",")).join("\n")}\n`;

const entryRows = [[
  "id", "label", "layer", "maturity", "traditions", "domains", "lifespan_stages", "functions", "grain_size",
  "summary", "mechanism", "task_types", "contexts", "prerequisites", "constraints", "risks", "observable_evidence",
  "evidence_status", "evidence_confidence", "evidence_basis", "directness", "generalizability", "effect",
  "recommendation_status", "recommendation_rationale", "source_ids", "source_locators", "tags", "provenance",
]];
for (const e of entries) {
  entryRows.push([
    e.id, e.label, e.classification.layer, e.classification.maturity, join(e.classification.traditions),
    join(e.classification.domains), join(e.classification.lifespanStages), join(e.classification.functions), e.classification.grainSize,
    e.summary, e.mechanism, join(e.applicable.taskTypes), join(e.applicable.contexts),
    join(e.prerequisites), join(e.constraints), join(e.risks),
    e.observableEvidence.map((o) => `${o.indicator}; measure=${o.measure}; timing=${o.timing}; caveat=${o.caveat}`).join(" | "),
    e.evidence.status, e.evidence.confidence, e.evidence.basis, e.evidence.directness, e.evidence.generalizability,
    e.evidence.effect ? Object.entries(e.evidence.effect).map(([k, v]) => `${k}=${v}`).join("; ") : "",
    e.recommendation.status, e.recommendation.rationale, join(e.evidence.sourceIds),
    (e.evidence.sourceLocators ?? []).map((l) => `${l.sourceId}: ${l.locator}`).join(" | "), join(e.tags), e.provenance.status,
  ]);
}
await writeFile(path.join(here, "entries.csv"), csv(entryRows));

await writeFile(path.join(here, "relations.csv"), csv([
  ["from", "type", "to", "polarity", "evidence_status", "rationale", "source_ids", "origin"],
  ...relations.map((r) => [r.from, r.type, r.to, r.polarity, r.evidenceStatus, r.rationale, join(r.sourceIds), r.origin]),
]));

await writeFile(path.join(here, "sources.csv"), csv([
  ["id", "title", "authors_or_institution", "year", "venue", "type", "authority", "url", "doi", "provenance_method", "provenance_status"],
  ...sources.map((s) => [s.id, s.title, s.authorsOrInstitution, s.year, s.venue, s.type, s.authority, s.url, s.doi ?? "", s.provenanceCheck.method, s.provenanceCheck.status]),
]));

const facetRows = [["entry_id", "facet", "value"]];
for (const e of entries) {
  const c = e.classification;
  facetRows.push([e.id, "layer", c.layer], [e.id, "grainSize", c.grainSize], [e.id, "maturity", c.maturity]);
  for (const t of c.traditions) facetRows.push([e.id, "tradition", t]);
  for (const d of c.domains) facetRows.push([e.id, "domain", d]);
  for (const s of c.lifespanStages) facetRows.push([e.id, "lifespanStage", s]);
  for (const f of c.functions) facetRows.push([e.id, "function", f]);
  facetRows.push([e.id, "evidenceStatus", e.evidence.status], [e.id, "recommendationStatus", e.recommendation.status]);
}
await writeFile(path.join(here, "classification.csv"), csv(facetRows));

const files = ["rack.json", "entries.csv", "relations.csv", "sources.csv", "classification.csv"];
const sums = [];
for (const f of files) {
  const buf = await readFile(path.join(here, f));
  sums.push(`${createHash("sha256").update(buf).digest("hex")}  ${f}`);
}
await writeFile(path.join(here, "CHECKSUMS.txt"), `${sums.join("\n")}\n`);

console.log(`validated and built rack 0.2.0`);
console.log(`  entries   ${stats.entries} (${Object.entries(stats.byLayer).map(([k, v]) => `${k}:${v}`).join(", ")})`);
console.log(`  relations ${stats.relations}`);
console.log(`  sources   ${stats.sources}`);
console.log(`  evidence  ${Object.entries(stats.byEvidence).map(([k, v]) => `${k}:${v}`).join(", ")}`);
for (const w of warnings) console.log(`  warning: ${w}`);

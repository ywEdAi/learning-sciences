import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const rackPath = path.join(root, "rack.json");
const rack = JSON.parse(await readFile(rackPath, "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(items, label) {
  const ids = new Set();
  for (const item of items) {
    assert(typeof item.id === "string" && item.id.length > 0, `${label} has a missing id`);
    assert(!ids.has(item.id), `duplicate ${label} id ${item.id}`);
    ids.add(item.id);
  }
  return ids;
}

assert(rack.schemaVersion === "1.0.0", "unsupported schemaVersion");
assert(rack.rack?.status === "draft", "the initial rack must remain explicitly draft");
assert(rack.rack?.nonPolicyNotice?.includes("not kernel rules"), "missing non-policy boundary");
assert(Array.isArray(rack.sources), "sources must be an array");
assert(Array.isArray(rack.entries), "entries must be an array");
assert(Array.isArray(rack.relations), "relations must be an array");

const sourceIds = assertUnique(rack.sources, "source");
const entryIds = assertUnique(rack.entries, "entry");
const evidenceStatuses = new Set(Object.keys(rack.evidenceScale));
const recommendationStatuses = new Set(Object.keys(rack.recommendationScale));
const relationKeys = new Set();

for (const entry of rack.entries) {
  assert(entry.id.startsWith("pedagogy:"), `invalid entry id ${entry.id}`);
  assert(typeof entry.mechanism === "string" && entry.mechanism.length > 0, `${entry.id} has no mechanism`);
  assert(entry.applicable?.learnerStages?.length > 0, `${entry.id} has no learner stages`);
  assert(entry.applicable?.taskTypes?.length > 0, `${entry.id} has no task types`);
  assert(entry.applicable?.contexts?.length > 0, `${entry.id} has no contexts`);
  assert(entry.prerequisites?.length > 0, `${entry.id} has no prerequisites`);
  assert(entry.constraints?.length > 0, `${entry.id} has no constraints`);
  assert(entry.risks?.length > 0, `${entry.id} has no risks`);
  assert(entry.observableEvidence?.length > 0, `${entry.id} has no observable evidence`);
  assert(evidenceStatuses.has(entry.evidence?.status), `${entry.id} has unknown evidence status`);
  assert(recommendationStatuses.has(entry.recommendation?.status), `${entry.id} has unknown recommendation status`);
  for (const sourceId of entry.evidence.sourceIds) {
    assert(sourceIds.has(sourceId), `${entry.id} references unknown source ${sourceId}`);
  }
  if (entry.evidence.status === "normative-standard") {
    assert(
      ["normative", "consensus-design"].includes(entry.evidence.directness),
      `${entry.id} treats a normative standard as an intervention`,
    );
  }
  if (entry.kind === "anti-pattern") {
    assert(
      ["avoid", "do-not-generalize"].includes(entry.recommendation.status),
      `${entry.id} anti-pattern is accidentally recommendable`,
    );
  }
}

for (const relation of rack.relations) {
  assert(entryIds.has(relation.from), `relation references unknown source node ${relation.from}`);
  assert(entryIds.has(relation.to), `relation references unknown target node ${relation.to}`);
  assert(evidenceStatuses.has(relation.evidenceStatus), "relation has unknown evidence status");
  for (const sourceId of relation.sourceIds) {
    assert(sourceIds.has(sourceId), `relation references unknown evidence source ${sourceId}`);
  }
  const key = `${relation.from}\u0000${relation.type}\u0000${relation.to}`;
  assert(!relationKeys.has(key), `duplicate relation ${relation.from} ${relation.type} ${relation.to}`);
  relationKeys.add(key);
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function writeCsv(name, headers, rows) {
  const output = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n") + "\n";
  return writeFile(path.join(root, name), output, "utf8");
}

const join = (values) => values.join(" | ");
const observable = (items) => items
  .map((item) => `${item.indicator}; measure=${item.measure}; timing=${item.timing}; caveat=${item.caveat}`)
  .join(" | ");

await Promise.all([
  writeCsv(
    "entries.csv",
    ["id", "label", "kind", "summary", "mechanism", "learner_stages", "task_types", "contexts", "prerequisites", "constraints", "risks", "observable_evidence", "evidence_status", "evidence_confidence", "evidence_basis", "directness", "generalizability", "recommendation_status", "recommendation_rationale", "source_ids", "tags"],
    rack.entries.map((entry) => [
      entry.id,
      entry.label,
      entry.kind,
      entry.summary,
      entry.mechanism,
      join(entry.applicable.learnerStages),
      join(entry.applicable.taskTypes),
      join(entry.applicable.contexts),
      join(entry.prerequisites),
      join(entry.constraints),
      join(entry.risks),
      observable(entry.observableEvidence),
      entry.evidence.status,
      entry.evidence.confidence,
      entry.evidence.basis,
      entry.evidence.directness,
      entry.evidence.generalizability,
      entry.recommendation.status,
      entry.recommendation.rationale,
      join(entry.evidence.sourceIds),
      join(entry.tags),
    ]),
  ),
  writeCsv(
    "relations.csv",
    ["from", "type", "to", "polarity", "evidence_status", "rationale", "source_ids"],
    rack.relations.map((relation) => [
      relation.from,
      relation.type,
      relation.to,
      relation.polarity,
      relation.evidenceStatus,
      relation.rationale,
      join(relation.sourceIds),
    ]),
  ),
  writeCsv(
    "sources.csv",
    ["id", "title", "authors_or_institution", "year", "type", "authority", "url", "doi", "notes"],
    rack.sources.map((source) => [
      source.id,
      source.title,
      source.authorsOrInstitution,
      source.year,
      source.type,
      source.authority,
      source.url,
      source.doi ?? "",
      source.notes ?? "",
    ]),
  ),
]);

process.stdout.write(
  `validated ${rack.entries.length} entries, ${rack.relations.length} relations, and ${rack.sources.length} sources\n`,
);

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

type Entry = {
  id: string;
  kind: string;
  classification: {
    layer: string;
    traditions: string[];
    domains: string[];
    lifespanStages: string[];
    functions: string[];
    grainSize: string;
    maturity: string;
  };
  evidence: {
    status: string;
    directness: string;
    sourceIds: string[];
    effect?: unknown;
    sourceLocators?: Array<{ sourceId: string; locator: string }>;
  };
  recommendation: { status: string };
  provenance: { origin: string; status: string };
};

type Rack = {
  schemaVersion: string;
  rack: { version: string; status: string; nonPolicyNotice: string; supersedes: string };
  taxonomy: {
    facets: Record<string, { values?: unknown; ordered?: string[] }>;
  };
  sources: Array<{ id: string; type: string; provenanceCheck: { method: string; status: string } }>;
  entries: Entry[];
  relations: Array<{ from: string; to: string; type: string; sourceIds: string[] }>;
};

const rackPath = path.join(
  process.cwd(),
  "learning-sciences",
  "0.2.0",
  "rack.json",
);

const readRack = async (): Promise<Rack> => JSON.parse(await readFile(rackPath, "utf8")) as Rack;

test("rack 0.2.0 is external draft knowledge that supersedes 0.1.0 without becoming policy", async () => {
  const rack = await readRack();
  assert.equal(rack.schemaVersion, "1.1.0");
  assert.equal(rack.rack.version, "0.2.0");
  assert.equal(rack.rack.status, "draft");
  assert.equal(rack.rack.supersedes, "rack:learning-sciences-initial@0.1.0");
  assert.match(rack.rack.nonPolicyNotice, /not kernel rules/);
  assert.ok(rack.entries.length >= 175);
});

test("every entry is classified on all seven facets using controlled vocabulary", async () => {
  const rack = await readRack();
  const facets = rack.taxonomy.facets;
  const vocab = (name: string): Set<string> => {
    const f = facets[name] as { values?: string[] | Record<string, unknown>; ordered?: string[] };
    if (f.ordered) return new Set(f.ordered);
    return new Set(Array.isArray(f.values) ? f.values : Object.keys(f.values ?? {}));
  };
  const layers = vocab("layer");
  const traditions = vocab("tradition");
  const domains = vocab("domain");
  const stages = vocab("lifespanStage");
  const functions = vocab("function");
  const grains = vocab("grainSize");
  const maturities = vocab("maturity");

  for (const entry of rack.entries) {
    const c = entry.classification;
    assert.ok(c, `${entry.id} has no classification`);
    assert.equal(c.layer, entry.kind, `${entry.id} layer and kind disagree`);
    assert.ok(layers.has(c.layer), `${entry.id} unknown layer ${c.layer}`);
    assert.ok(grains.has(c.grainSize), `${entry.id} unknown grainSize`);
    assert.ok(maturities.has(c.maturity), `${entry.id} unknown maturity`);
    for (const t of c.traditions) assert.ok(traditions.has(t), `${entry.id} unknown tradition ${t}`);
    for (const d of c.domains) assert.ok(domains.has(d), `${entry.id} unknown domain ${d}`);
    for (const s of c.lifespanStages) assert.ok(stages.has(s), `${entry.id} unknown stage ${s}`);
    for (const f of c.functions) assert.ok(functions.has(f), `${entry.id} unknown function ${f}`);
    assert.ok(
      !(c.lifespanStages.includes("cross-lifespan") && c.lifespanStages.length > 1),
      `${entry.id} mixes cross-lifespan with specific stages`,
    );
  }
});

test("evidence grades obey the amended scale and cannot inflate into policy", async () => {
  const rack = await readRack();
  const byId = new Map(rack.sources.map((s) => [s.id, s]));
  const qualifying = new Set(["meta-analysis", "systematic-review", "practice-guide", "consensus-report"]);

  for (const entry of rack.entries) {
    if (entry.evidence.status === "strong") {
      const types = entry.evidence.sourceIds.map((id) => byId.get(id)?.type ?? "");
      assert.ok(
        types.some((t) => qualifying.has(t)),
        `${entry.id} graded strong without a synthesis-grade source`,
      );
      assert.notEqual(entry.evidence.directness, "normative", `${entry.id} strong but normative`);
    }
    if (entry.evidence.status === "refuted") {
      assert.ok(
        ["avoid", "do-not-generalize"].includes(entry.recommendation.status),
        `${entry.id} refuted but still recommendable`,
      );
    }
    if (entry.evidence.status === "contested") {
      assert.notEqual(
        entry.recommendation.status,
        "candidate-default-with-fit-check",
        `${entry.id} contested but promoted to default`,
      );
    }
    if (entry.kind === "anti-pattern") {
      assert.ok(
        ["avoid", "do-not-generalize"].includes(entry.recommendation.status),
        `${entry.id} anti-pattern became recommendable`,
      );
    }
    if (entry.evidence.status === "normative-standard") {
      assert.equal(entry.evidence.effect, undefined, `${entry.id} normative standard carries an effect size`);
    }
  }
});

test("provenance is verified and complete", async () => {
  const rack = await readRack();
  const sourceIds = new Set(rack.sources.map((s) => s.id));
  const doiChecked = rack.sources.filter((s) => s.provenanceCheck.method === "crossref-metadata");
  assert.ok(doiChecked.length >= 200, "expected the DOI corpus to be Crossref-verified");
  for (const s of doiChecked) assert.equal(s.provenanceCheck.status, "verified", `${s.id} unverified DOI`);

  const cited = new Set<string>();
  for (const entry of rack.entries) {
    assert.ok(entry.evidence.sourceIds.length > 0, `${entry.id} has no sources`);
    for (const id of entry.evidence.sourceIds) {
      assert.ok(sourceIds.has(id), `${entry.id} cites unknown source ${id}`);
      cited.add(id);
    }
    for (const loc of entry.evidence.sourceLocators ?? []) {
      assert.ok(
        entry.evidence.sourceIds.includes(loc.sourceId),
        `${entry.id} locates a source it does not cite`,
      );
    }
    assert.ok(entry.provenance?.origin, `${entry.id} has no provenance origin`);
  }
  for (const rel of rack.relations) for (const id of rel.sourceIds) cited.add(id);
  const uncited = rack.sources.filter((s) => !cited.has(s.id)).map((s) => s.id);
  assert.deepEqual(uncited, [], "every source must be cited by an entry or relation");
});

test("the relation graph is connected and free of dangling or duplicate edges", async () => {
  const rack = await readRack();
  const entryIds = new Set(rack.entries.map((e) => e.id));
  const degree = new Map(rack.entries.map((e) => [e.id, 0]));
  const keys = new Set<string>();

  for (const rel of rack.relations) {
    assert.ok(entryIds.has(rel.from), `relation from unknown entry ${rel.from}`);
    assert.ok(entryIds.has(rel.to), `relation to unknown entry ${rel.to}`);
    assert.notEqual(rel.from, rel.to, `self-relation on ${rel.from}`);
    const key = `${rel.from}|${rel.type}|${rel.to}`;
    assert.ok(!keys.has(key), `duplicate relation ${key}`);
    keys.add(key);
    degree.set(rel.from, (degree.get(rel.from) ?? 0) + 1);
    degree.set(rel.to, (degree.get(rel.to) ?? 0) + 1);
  }
  const orphans = [...degree].filter(([, d]) => d === 0).map(([id]) => id);
  assert.deepEqual(orphans, [], "every entry must participate in at least one relation");
});

test("adversarially popular claims still cannot become default pedagogy", async () => {
  const rack = await readRack();
  const entries = new Map(rack.entries.map((e) => [e.id, e]));
  const mustNotDefault = [
    "pedagogy:learning-styles-matching",
    "pedagogy:neuromyths",
    "pedagogy:brain-training-transfer",
    "pedagogy:music-chess-far-transfer",
    "pedagogy:multiple-intelligences-matching",
    "pedagogy:digital-natives-myth",
    "pedagogy:rereading-and-highlighting",
    "pedagogy:minimal-guidance-instruction",
    "pedagogy:grit-construct",
    "pedagogy:andragogy",
  ];
  for (const id of mustNotDefault) {
    const entry = entries.get(id);
    assert.ok(entry, `${id} missing from the rack`);
    assert.ok(
      ["avoid", "do-not-generalize", "experimental-only"].includes(entry.recommendation.status),
      `${id} is recommendable as ${entry.recommendation.status}`,
    );
  }
});

test("the rack is not wired into kernel policy", async () => {
  const rack = await readRack();
  assert.equal(rack.rack.status, "draft");
  for (const entry of rack.entries) {
    assert.notEqual(
      entry.recommendation.status,
      "mandatory",
      `${entry.id} introduced a mandatory recommendation status`,
    );
  }
});

// Terse authoring helper: expands compact entry literals into canonical rack records.
export function e(x) {
  const entry = {
    id: `pedagogy:${x.id}`,
    label: x.label,
    aliases: x.aliases ?? [],
    kind: x.layer,
    summary: x.summary,
    mechanism: x.mechanism,
    classification: {
      layer: x.layer,
      traditions: x.traditions,
      domains: x.domains,
      lifespanStages: x.stages,
      functions: x.functions,
      grainSize: x.grain,
      maturity: x.maturity,
    },
    applicable: {
      learnerStages: x.stages,
      taskTypes: x.tasks,
      contexts: x.contexts,
    },
    prerequisites: x.prereq,
    constraints: x.constraints,
    risks: x.risks,
    observableEvidence: (x.obs ?? []).map(([indicator, measure, timing, caveat]) => ({
      indicator,
      measure,
      timing,
      caveat,
    })),
    evidence: {
      status: x.ev.status,
      confidence: x.ev.confidence,
      basis: x.ev.basis,
      directness: x.ev.directness,
      generalizability: x.ev.generalizability,
      sourceIds: x.ev.sources.map((s) => `source:${s}`),
    },
    recommendation: { status: x.rec.status, rationale: x.rec.rationale },
    tags: x.tags ?? [],
  };
  if (x.ev.effect) entry.evidence.effect = x.ev.effect;
  if (x.ev.notes) entry.evidence.notes = x.ev.notes;
  if (x.locators) {
    entry.evidence.sourceLocators = Object.entries(x.locators).map(([sourceId, locator]) => ({
      sourceId: `source:${sourceId}`,
      locator,
    }));
  }
  return entry;
}

export function r(from, type, to, polarity, evidenceStatus, rationale, sources) {
  return {
    from: `pedagogy:${from}`,
    type,
    to: `pedagogy:${to}`,
    polarity,
    evidenceStatus,
    rationale,
    sourceIds: sources.map((s) => `source:${s}`),
  };
}

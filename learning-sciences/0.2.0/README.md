# Learning-sciences rack `0.2.0`

A classified, versioned, retrievable knowledge source for pedagogical specialist agents. **Not imported by the EduOS kernel; defines no selection policy.**

180 entries · 217 relations · 241 verified sources · 7 classification facets

Supersedes `0.1.0`, which stays immutable alongside it.

## Files

| File | What it is |
|---|---|
| `REPORT.md` | Research synthesis, classification scheme, evidence rules, findings, limits |
| `rack.json` | Canonical graph-ready rack (generated) |
| `rack.schema.json` | Portable data contract, schema version 1.1.0 |
| `taxonomy.json` | The seven controlled facet vocabularies plus the 0.1.0 crosswalk |
| `entries.csv` | Flat entry table with classification and effect columns (generated) |
| `relations.csv` | Graph edge list (generated) |
| `sources.csv` | Provenance table with per-source verification status (generated) |
| `classification.csv` | Long-format entry × facet table for pivoting (generated) |
| `CHECKSUMS.txt` | SHA-256 of every generated artifact (generated) |
| `entries/*.mjs` | Authored entry batches by cluster |
| `relations.mjs` | Authored relation set |
| `inherited-classification.json` | Facet assignment for the 43 records inherited from 0.1.0 |
| `sources.seed*.json` | DOI seeds; metadata is fetched, never typed |
| `sources.manual.json` | Institutional sources without DOIs |
| `verify-sources.mjs` | Fetches verbatim Crossref metadata for every DOI |
| `check-urls.mjs` | Resolves every non-DOI source URL |
| `build-rack.mjs` | Merges, validates, and emits all generated artifacts |
| `validate-schema.mjs` | Minimal JSON Schema walker used by the build |

## Regenerate

```bash
cd pedagogy/knowledge-racks/learning-sciences/0.2.0
node verify-sources.mjs   # network: refresh Crossref metadata for all 216 DOIs
node check-urls.mjs       # network: resolve the 25 institutional URLs
node build-rack.mjs       # offline: validate and emit rack.json + CSVs + checksums
```

`build-rack.mjs` is the gate. It fails the build on unknown facet values, dangling references, duplicate or self relations, orphan entries, uncited sources, schema violations, and five evidence-grading rules (see `REPORT.md`).

## Consumer rules

1. Retrieve **complete entries** with their constraints, risks, observables, and provenance. Never a label alone.
2. Never infer stable learner traits. A `lifespanStage` means evidence exists for that stage, not that a learner has a capability.
3. Never promote an evidence grade into a runtime action. `strong` still means `candidate-default-with-fit-check` at best.
4. Cite `rack:learning-sciences@0.2.0` plus the entry id whenever a record informs a decision.

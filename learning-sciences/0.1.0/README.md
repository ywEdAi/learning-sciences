# Learning-sciences rack `0.1.0`

This draft package is a versioned, retrievable knowledge source for pedagogical specialist agents. It is not imported by the EduOS kernel and defines no selection policy.

Files:

- `REPORT.md` — concise research synthesis, structured table, limits, and integration proposal.
- `rack.json` — canonical graph-ready rack with 43 entries, 44 relations, and 36 source records.
- `rack.schema.json` — JSON Schema for the portable data contract.
- `entries.csv` — flat concept/framework/tactic table for inspection and analysis.
- `relations.csv` — graph edge list.
- `sources.csv` — normalized provenance table.
- `build-artifacts.mjs` — deterministic referential/semantic checks and CSV exporter.
- `index.html` — standalone Chinese-language explorer with search, filters, full records, relations, and source links.
- `build-html.mjs` — deterministic standalone HTML exporter.

Validate and regenerate the CSV artifacts from the canonical JSON:

```bash
node pedagogy/knowledge-racks/learning-sciences/0.1.0/build-artifacts.mjs
node pedagogy/knowledge-racks/learning-sciences/0.1.0/build-html.mjs
```

Consumer rule: retrieve complete entries with their cautions and provenance. Never retrieve a label alone, infer stable learner traits, or automatically promote an evidence grade into a runtime action.

# Learning Sciences

A versioned, source-linked knowledge base for educators and builders of educational AI.

**180 entries · 217 relations · 241 sources · 7 classification facets**  
Current version: **0.2.0 — draft** · Research cut: **2026-08-30**

学习科学知识库：将理论、教学方法、策略、学习者与情境变量、测量和常见误区整理为可检索的数据，保留证据、适用条件、风险与来源。当前版本仍为草稿，尚未经领域专家独立审阅。

## Start here

| Resource | Use it for |
| --- | --- |
| [Research synthesis](learning-sciences/0.2.0/REPORT.md) | Scope, classification, evidence rules, findings and limitations |
| [Structured knowledge base](learning-sciences/0.2.0/rack.json) | Complete entries, sources and relations for retrieval |
| [Entries](learning-sciences/0.2.0/entries.csv) / [Relations](learning-sciences/0.2.0/relations.csv) / [Sources](learning-sciences/0.2.0/sources.csv) | Inspect data in a spreadsheet or graph tool |
| [Classification table](learning-sciences/0.2.0/classification.csv) / [Taxonomy](learning-sciences/0.2.0/taxonomy.json) | Filter across seven controlled facets |
| [JSON Schema](learning-sciences/0.2.0/rack.schema.json) | Validate the portable data contract |
| [Version 0.1.0](learning-sciences/0.1.0/) | Frozen 43-entry predecessor; includes a standalone Chinese HTML explorer |

The 0.1.0 explorer covers only those original 43 entries. It is not a viewer for the 180-entry draft.

## What is inside

Nine layers distinguish theories, frameworks, principles, methods, tactics, constructs, measures, constraints and anti-patterns. Seven facets organize layer, research tradition, domain, lifespan stage, learning function, grain size and maturity.

Examples include retrieval practice, spacing, cognitive load, expertise reversal, feedback, self-regulation, literacy and language learning, adult learning, and refuted or contested claims such as learning-styles matching.

Every entry keeps its mechanism, prerequisites, constraints, risks, observable evidence and source references. Evidence grades and recommendation status remain separate.

## Evidence and limits

- 241 source records: 216 DOI records checked against Crossref and 21 institutional URLs recorded as resolved; 4 institutional sources remain unverified because their hosts block automated requests. These are recorded checks from August 30, 2026, not fresh checks at publication.
- Source metadata or URL verification does not establish that every source supports every associated claim.
- The compilation is not a registered systematic review or an independently reviewed evidence standard. Coverage is uneven, most citations are at document level, and effect estimates often lack confidence intervals.
- Retrieve complete entries with their limitations and provenance. Do not infer stable learner traits or turn an evidence grade into an automatic teaching rule.
- Data validation is not evidence of learning effectiveness.

See the full [known limits](learning-sciences/0.2.0/REPORT.md#known-limits).

## Use and verify

Node.js **22.18+** is sufficient. There are no package dependencies. Run from the repository root:

```bash
node --test tests/knowledge-rack-0-2-0.test.ts
node learning-sciences/0.2.0/build-rack.mjs
```

The second command validates the schema and semantic rules and regenerates JSON, CSVs and checksums offline. It uses the preserved 0.1.0 data as an input.

Optional source refresh requires network access:

```bash
cd learning-sciences/0.2.0
node verify-sources.mjs
node check-urls.mjs
node build-rack.mjs
```

The version READMEs preserve historical `pedagogy/knowledge-racks/` paths from the original project. Use the commands above in this standalone repository. Version 0.1.0 is frozen.

When an entry informs a decision, cite `rack:learning-sciences@0.2.0` together with its stable entry ID and the underlying source.

## Publication and attribution

Maintained by [Yi Wang](https://github.com/ywEdAi). Published from the Learning Lab learning-sciences folder; the versioned files are preserved byte for byte. [Export manifest](export-manifest.json) records SHA-256 digests of that initial export.

This repository publishes the knowledge compilation, its build tools and validation tests. Cited publications and institutional documents retain their own rights. No additional reuse license is granted by this initial publication; public availability does not itself grant a reuse license.

Explore the full knowledge library on [Edu AI Builders / Learning Sciences](https://edu-ai-builders.dev/learning-sciences). This is a dedicated first-party knowledge page, separate from the open-source resource directory.

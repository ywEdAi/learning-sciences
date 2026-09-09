import { readFile, writeFile } from "node:fs/promises";

const seeds = [];
for (const file of ["sources.seed.json", "sources.seed2.json", "sources.seed3.json"]) {
  const parsed = JSON.parse(await readFile(new URL(file, import.meta.url), "utf8"));
  seeds.push(...parsed.doiSeeds);
}

const UA = "eduos-rack-build/0.2.0 (mailto:yiwang.jhu.edd@gmail.com)";
const ok = [];
const failed = [];

function names(message) {
  const authors = message.author ?? [];
  if (authors.length === 0) return message.publisher ?? "Unknown";
  const format = (a) => [a.family, a.given].filter(Boolean).join(", ") || a.name || "";
  if (authors.length > 6) return `${format(authors[0])}, et al.`;
  return authors.map(format).join("; ");
}

for (const seed of seeds) {
  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(seed.doi)}`, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) {
      failed.push({ ...seed, reason: `crossref ${res.status}` });
      continue;
    }
    const { message } = await res.json();
    const year =
      message.issued?.["date-parts"]?.[0]?.[0] ??
      message["published-print"]?.["date-parts"]?.[0]?.[0] ??
      message.created?.["date-parts"]?.[0]?.[0];
    const title = (message.title ?? [])[0];
    if (!title || !year) {
      failed.push({ ...seed, reason: "missing title/year in crossref record" });
      continue;
    }
    ok.push({
      id: `source:${seed.id}`,
      title: title.replace(/\s+/g, " ").trim(),
      authorsOrInstitution: names(message),
      year,
      venue: (message["container-title"] ?? [])[0] ?? message.publisher ?? "",
      type: seed.type,
      url: `https://doi.org/${seed.doi}`,
      doi: seed.doi,
      authority: seed.authority,
      verifiedVia: "crossref",
      verifiedAt: "2026-08-30",
    });
  } catch (error) {
    failed.push({ ...seed, reason: error.message });
  }
}

ok.sort((a, b) => a.id.localeCompare(b.id));
await writeFile(new URL("sources.verified.json", import.meta.url), `${JSON.stringify(ok, null, 2)}\n`);
await writeFile(new URL("sources.failed.json", import.meta.url), `${JSON.stringify(failed, null, 2)}\n`);
console.log(`verified ${ok.length}, failed ${failed.length}`);
for (const f of failed) console.log("  FAIL", f.id, f.doi, "->", f.reason);

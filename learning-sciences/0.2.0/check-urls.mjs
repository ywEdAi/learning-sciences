import { readFile } from "node:fs/promises";
const manual = JSON.parse(await readFile(new URL("sources.manual.json", import.meta.url), "utf8"));
for (const s of manual) {
  try {
    const res = await fetch(s.url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (eduos-rack-build)" } });
    console.log(res.ok ? "OK  " : `BAD ${res.status}`, s.id, res.url === s.url ? "" : `-> ${res.url}`);
  } catch (e) { console.log("ERR ", s.id, e.message); }
}

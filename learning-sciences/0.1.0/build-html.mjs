import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const rack = JSON.parse(await readFile(path.join(root, "rack.json"), "utf8"));
const serializedRack = JSON.stringify(rack).replaceAll("<", "\\u003c");
const statusCounts = Object.fromEntries(
  Object.keys(rack.evidenceScale).map((status) => [
    status,
    rack.entries.filter((entry) => entry.evidence.status === status).length,
  ]),
);

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="EduOS 初始学习科学与教学法知识架：可检索、可追溯、非内核策略。">
    <title>EduOS · Learning Sciences Rack 0.1.0</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #162135;
        --muted: #58647a;
        --paper: #f5f7fb;
        --surface: #ffffff;
        --line: #dfe5ef;
        --blue: #2364d2;
        --blue-dark: #163d82;
        --teal: #0e8576;
        --amber: #a45b00;
        --rose: #a1274b;
        --slate: #566277;
        --shadow: 0 12px 30px rgba(28, 46, 80, .09);
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; font: 16px/1.55 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--paper); }
      a { color: var(--blue); }
      a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible { outline: 3px solid #f4a340; outline-offset: 3px; }
      .shell { max-width: 1320px; margin: 0 auto; padding: 0 24px 64px; }
      .hero { color: white; background: radial-gradient(circle at 85% 10%, #6bd4d1 0, transparent 25rem), linear-gradient(135deg, #14264a, #1e5abc); padding: 58px max(24px, calc((100vw - 1272px) / 2)) 46px; }
      .eyebrow { margin: 0 0 12px; text-transform: uppercase; letter-spacing: .12em; font-size: .76rem; font-weight: 700; color: #b8d2ff; }
      h1 { font-size: clamp(2.15rem, 6vw, 4.25rem); letter-spacing: -.055em; line-height: 1; margin: 0; max-width: 900px; }
      .subtitle { max-width: 860px; color: #e2ecff; font-size: 1.05rem; margin: 20px 0 0; }
      .hero-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 25px; }
      .hero-meta span { background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.24); padding: 6px 11px; border-radius: 100px; font-size: .86rem; }
      .notice { margin: 28px 0; padding: 18px 20px; border-left: 5px solid var(--amber); border-radius: 10px; background: #fff7e9; color: #5a3600; }
      .notice strong { color: #573300; }
      .section { margin-top: 42px; }
      h2 { letter-spacing: -.03em; font-size: 1.75rem; margin: 0 0 10px; }
      .lead { color: var(--muted); margin: 0 0 20px; max-width: 900px; }
      .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 12px; }
      .stat { background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); padding: 16px; border-radius: 13px; }
      .stat b { display: block; font-size: 1.65rem; line-height: 1; margin-bottom: 6px; color: var(--blue-dark); }
      .stat span { font-size: .86rem; color: var(--muted); }
      .toolbar { background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); padding: 16px; border-radius: 14px; display: grid; grid-template-columns: 2fr repeat(3, minmax(150px, 1fr)) auto; gap: 12px; align-items: end; }
      label { display: grid; gap: 5px; color: var(--muted); font-size: .82rem; font-weight: 700; }
      input, select, button { min-height: 42px; font: inherit; border-radius: 9px; }
      input, select { padding: 8px 10px; border: 1px solid #c8d3e2; background: white; color: var(--ink); }
      button { border: 0; padding: 8px 14px; cursor: pointer; color: white; background: var(--blue); font-weight: 700; }
      button:hover { background: var(--blue-dark); }
      .result-line { margin: 16px 0; color: var(--muted); font-size: .92rem; }
      .cards { display: grid; gap: 14px; }
      .card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; box-shadow: 0 7px 20px rgba(28, 46, 80, .05); }
      summary { cursor: pointer; list-style: none; padding: 18px 20px; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start; }
      summary::-webkit-details-marker { display: none; }
      summary::after { content: "+"; color: var(--blue); font-size: 1.45rem; line-height: 1; font-weight: 500; }
      details[open] summary::after { content: "−"; }
      .title-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
      .entry-title { font-size: 1.08rem; font-weight: 780; letter-spacing: -.015em; }
      .entry-summary { color: var(--muted); font-size: .93rem; margin: 7px 0 0; max-width: 920px; }
      .body { padding: 0 20px 22px; border-top: 1px solid var(--line); }
      .body-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 22px; margin-top: 18px; }
      .field { min-width: 0; }
      .field.wide { grid-column: 1 / -1; }
      .field h3 { font-size: .77rem; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 5px; color: var(--slate); }
      .field p { margin: 0; }
      .field ul { margin: 0; padding-left: 19px; }
      .field li + li { margin-top: 3px; }
      .pills { display: flex; gap: 6px; flex-wrap: wrap; }
      .pill { border-radius: 100px; padding: 3px 8px; background: #eaf1ff; color: #204e9e; font-size: .76rem; font-weight: 700; border: 1px solid #d0ddf7; }
      .pill.status-strong { background: #e6f6ee; color: #16623c; border-color: #bde5ce; }
      .pill.status-context-dependent, .pill.status-hypothesis { background: #fff2d9; color: #815001; border-color: #f1d69b; }
      .pill.status-contested, .pill.status-refuted { background: #fdeaf0; color: #8b1e43; border-color: #f1c4d3; }
      .pill.status-normative-standard { background: #e9eef6; color: #46556e; border-color: #cdd8e8; }
      .source-list { margin: 0; padding-left: 18px; }
      .source-list li + li { margin-top: 5px; }
      .mini { font-size: .85rem; color: var(--muted); }
      .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; background: white; box-shadow: var(--shadow); }
      table { width: 100%; border-collapse: collapse; min-width: 800px; }
      th, td { padding: 13px 14px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
      th { background: #f2f6fc; color: #48566e; font-size: .77rem; letter-spacing: .07em; text-transform: uppercase; }
      tr:last-child td { border-bottom: 0; }
      .source-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 12px; }
      .source { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 15px; }
      .source h3 { margin: 0 0 7px; font-size: 1rem; line-height: 1.3; }
      .source p { margin: 6px 0; color: var(--muted); font-size: .88rem; }
      .source code, .entry-id { color: #61708b; font-size: .78rem; }
      .empty { padding: 30px; color: var(--muted); background: white; border: 1px dashed #b7c4d7; border-radius: 12px; }
      footer { color: var(--muted); font-size: .86rem; margin-top: 48px; border-top: 1px solid var(--line); padding-top: 20px; }
      @media (max-width: 880px) { .toolbar { grid-template-columns: 1fr 1fr; } .toolbar label:first-child { grid-column: 1 / -1; } .body-grid { grid-template-columns: 1fr; } .field.wide { grid-column: auto; } }
      @media (max-width: 560px) { .shell { padding: 0 15px 40px; } .hero { padding: 42px 18px 35px; } .toolbar { grid-template-columns: 1fr; } .toolbar label:first-child { grid-column: auto; } summary { padding: 15px; } .body { padding: 0 15px 17px; } }
    </style>
  </head>
  <body>
    <header class="hero">
      <p class="eyebrow">EduOS · pedagogy / knowledge rack / 0.1.0</p>
      <h1>学习科学与教学法知识架</h1>
      <p class="subtitle">一份可浏览、检索与追溯的初始资料架。它把证据强度、使用边界、误用风险、可观察学习证据和来源一并保留，供教学专家 Agent 检索与审查。</p>
      <div class="hero-meta" id="hero-meta"></div>
    </header>
    <main class="shell">
      <aside class="notice"><strong>不是运行时策略。</strong> 这份资料架只提供可检索的候选知识。模型仍需根据当前任务和学习者证据提出假设；reviewer 仍需质疑语义匹配、替代解释与公平性；runtime 仍需验证引用、权限、隐私和 artifact contract。</aside>

      <section class="section" aria-labelledby="overview-title">
        <h2 id="overview-title">证据概览</h2>
        <p class="lead">“强证据”也不是自动选择。所有记录都保留适用条件与反例风险；“规范标准”则明确区分于因果学习效果。</p>
        <div class="stats" id="stats"></div>
      </section>

      <section class="section" aria-labelledby="entries-title">
        <h2 id="entries-title">知识记录</h2>
        <p class="lead">搜索会覆盖名称、机制、适用情境、先决条件、风险、可观察证据与标签。展开任意记录可查看完整的机器可读字段。</p>
        <div class="toolbar" aria-label="知识记录筛选">
          <label>全文检索<input id="search" type="search" placeholder="例如：检索、数学、accessibility、adult…" autocomplete="off"></label>
          <label>证据状态<select id="evidence-filter"></select></label>
          <label>建议状态<select id="recommendation-filter"></select></label>
          <label>记录类型<select id="kind-filter"></select></label>
          <button id="reset" type="button">重置筛选</button>
        </div>
        <p class="result-line" id="result-line" aria-live="polite"></p>
        <div class="cards" id="cards"></div>
      </section>

      <section class="section" aria-labelledby="relations-title">
        <h2 id="relations-title">图关系</h2>
        <p class="lead">这些边用于后续工作图或 specialist-agent retrieval：它们表达支持、前提、调节、互补、淡出、对比及“不蕴含”等关系，不是固定教学工作流。</p>
        <div class="table-wrap"><table><thead><tr><th>起点</th><th>关系</th><th>终点</th><th>证据</th><th>理由</th></tr></thead><tbody id="relations"></tbody></table></div>
      </section>

      <section class="section" aria-labelledby="sources-title">
        <h2 id="sources-title">来源与溯源</h2>
        <p class="lead">来源优先使用同行评审研究/综述、IES/WWC 证据评级指南、National Academies 共识报告，以及 AERA/APA/NCME 与 W3C 等标准。点击可访问原始页面。</p>
        <div class="source-cards" id="sources"></div>
      </section>

      <footer>Canonical source: <code>rack.json</code>. This standalone explorer embeds that version of the rack and can be opened directly from disk. Rebuild after editing the JSON with <code>node build-html.mjs</code>.</footer>
    </main>

    <script id="rack-data" type="application/json">${serializedRack}</script>
    <script>
      const rack = JSON.parse(document.getElementById('rack-data').textContent);
      const byId = new Map(rack.entries.map(function (entry) { return [entry.id, entry]; }));
      const sources = new Map(rack.sources.map(function (source) { return [source.id, source]; }));
      const escapeHtml = function (value) { return String(value).replace(/[&<>'"]/g, function (char) { return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char]; }); };
      const titleize = function (value) { return value.replaceAll('-', ' '); };
      const pills = function (items, classPrefix) { return '<div class="pills">' + items.map(function (item) { return '<span class="pill ' + (classPrefix ? classPrefix + item : '') + '">' + escapeHtml(titleize(item)) + '</span>'; }).join('') + '</div>'; };
      const list = function (items) { return '<ul>' + items.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>'; };
      const sourceLinks = function (ids) { return '<ul class="source-list">' + ids.map(function (id) { const source = sources.get(id); return source ? '<li><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source.title) + '</a> <span class="mini">(' + escapeHtml(source.authorsOrInstitution) + ', ' + source.year + ')</span></li>' : '<li>Missing source: ' + escapeHtml(id) + '</li>'; }).join('') + '</ul>'; };
      const field = function (title, body, wide) { return '<section class="field' + (wide ? ' wide' : '') + '"><h3>' + escapeHtml(title) + '</h3>' + body + '</section>'; };
      const option = function (value, label) { return '<option value="' + escapeHtml(value) + '">' + escapeHtml(label) + '</option>'; };

      document.getElementById('hero-meta').innerHTML = [
        rack.entries.length + ' 条知识记录',
        rack.relations.length + ' 条关系',
        rack.sources.length + ' 条来源',
        '版本 ' + rack.rack.version,
      ].map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');

      const evidenceFilter = document.getElementById('evidence-filter');
      const recommendationFilter = document.getElementById('recommendation-filter');
      const kindFilter = document.getElementById('kind-filter');
      evidenceFilter.innerHTML = option('', '所有证据状态') + Object.keys(rack.evidenceScale).map(function (key) { return option(key, titleize(key)); }).join('');
      recommendationFilter.innerHTML = option('', '所有建议状态') + Object.keys(rack.recommendationScale).map(function (key) { return option(key, titleize(key)); }).join('');
      kindFilter.innerHTML = option('', '所有记录类型') + ['framework','principle','tactic','constraint','anti-pattern'].map(function (key) { return option(key, titleize(key)); }).join('');

      const stats = Object.entries(${JSON.stringify(statusCounts)}).map(function (pair) {
        const key = pair[0]; const count = pair[1];
        return '<article class="stat"><b>' + count + '</b><span>' + escapeHtml(titleize(key)) + '</span></article>';
      });
      document.getElementById('stats').innerHTML = stats.join('');

      function entryText(entry) { return JSON.stringify(entry).toLocaleLowerCase(); }
      function renderEntries() {
        const query = document.getElementById('search').value.trim().toLocaleLowerCase();
        const evidence = evidenceFilter.value;
        const recommendation = recommendationFilter.value;
        const kind = kindFilter.value;
        const selected = rack.entries.filter(function (entry) {
          return (!query || entryText(entry).includes(query)) &&
            (!evidence || entry.evidence.status === evidence) &&
            (!recommendation || entry.recommendation.status === recommendation) &&
            (!kind || entry.kind === kind);
        });
        document.getElementById('result-line').textContent = '显示 ' + selected.length + ' / ' + rack.entries.length + ' 条记录。';
        document.getElementById('cards').innerHTML = selected.length ? selected.map(function (entry) {
          const observations = entry.observableEvidence.map(function (item) {
            return '<li><strong>' + escapeHtml(item.indicator) + '</strong><br><span class="mini">测量：</span>' + escapeHtml(item.measure) + '<br><span class="mini">时点：</span>' + escapeHtml(item.timing) + '<br><span class="mini">注意：</span>' + escapeHtml(item.caveat) + '</li>';
          }).join('');
          return '<details class="card">' +
            '<summary><div><div class="title-row"><span class="entry-title">' + escapeHtml(entry.label) + '</span>' + pills([entry.evidence.status], 'status-') + '<span class="pill">' + escapeHtml(titleize(entry.kind)) + '</span></div><p class="entry-summary">' + escapeHtml(entry.summary) + '</p></div></summary>' +
            '<div class="body"><div class="body-grid">' +
            field('机制', '<p>' + escapeHtml(entry.mechanism) + '</p>') +
            field('建议状态', pills([entry.recommendation.status], 'status-') + '<p class="mini" style="margin-top:7px">' + escapeHtml(entry.recommendation.rationale) + '</p>') +
            field('适用学习者', pills(entry.applicable.learnerStages)) +
            field('任务与情境', '<p><strong>任务：</strong>' + escapeHtml(entry.applicable.taskTypes.join(' · ')) + '</p><p><strong>情境：</strong>' + escapeHtml(entry.applicable.contexts.join(' · ')) + '</p>') +
            field('先决条件', list(entry.prerequisites)) +
            field('约束条件', list(entry.constraints)) +
            field('风险与误用', list(entry.risks)) +
            field('可观察证据 / 测量', '<ul>' + observations + '</ul>') +
            field('证据说明', '<p><strong>置信度：</strong>' + escapeHtml(entry.evidence.confidence) + '<br><strong>直接性：</strong>' + escapeHtml(titleize(entry.evidence.directness)) + '<br><strong>依据：</strong>' + escapeHtml(entry.evidence.basis) + '<br><strong>可推广性：</strong>' + escapeHtml(entry.evidence.generalizability) + (entry.evidence.notes ? '<br><strong>备注：</strong>' + escapeHtml(entry.evidence.notes) : '') + '</p>', true) +
            field('来源', sourceLinks(entry.evidence.sourceIds), true) +
            field('元数据', '<p class="entry-id">' + escapeHtml(entry.id) + '</p>' + pills(entry.tags), true) +
            '</div></div></details>';
        }).join('') : '<div class="empty">没有符合当前筛选条件的记录。尝试清空关键词或重置筛选。</div>';
      }

      const named = function (id) { const entry = byId.get(id); return entry ? entry.label : id; };
      document.getElementById('relations').innerHTML = rack.relations.map(function (relation) {
        return '<tr><td><a href="#entries-title" data-entry="' + escapeHtml(relation.from) + '">' + escapeHtml(named(relation.from)) + '</a></td><td><span class="pill">' + escapeHtml(titleize(relation.type)) + '</span></td><td><a href="#entries-title" data-entry="' + escapeHtml(relation.to) + '">' + escapeHtml(named(relation.to)) + '</a></td><td>' + pills([relation.evidenceStatus], 'status-') + '</td><td>' + escapeHtml(relation.rationale) + '<br><span class="mini">' + escapeHtml(relation.sourceIds.join(', ')) + '</span></td></tr>';
      }).join('');
      document.getElementById('sources').innerHTML = rack.sources.map(function (source) {
        return '<article class="source"><code>' + escapeHtml(source.id) + '</code><h3><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source.title) + '</a></h3><p>' + escapeHtml(source.authorsOrInstitution) + ' · ' + source.year + '</p>' + pills([source.type, source.authority]) + (source.doi ? '<p><strong>DOI:</strong> ' + escapeHtml(source.doi) + '</p>' : '') + (source.notes ? '<p>' + escapeHtml(source.notes) + '</p>' : '') + '</article>';
      }).join('');

      document.querySelectorAll('[data-entry]').forEach(function (link) {
        link.addEventListener('click', function () {
          document.getElementById('search').value = byId.get(link.dataset.entry).label;
          renderEntries();
        });
      });
      [document.getElementById('search'), evidenceFilter, recommendationFilter, kindFilter].forEach(function (control) { control.addEventListener('input', renderEntries); control.addEventListener('change', renderEntries); });
      document.getElementById('reset').addEventListener('click', function () { document.getElementById('search').value = ''; evidenceFilter.value = ''; recommendationFilter.value = ''; kindFilter.value = ''; renderEntries(); });
      renderEntries();
    </script>
  </body>
</html>
`;

await writeFile(path.join(root, "index.html"), html, "utf8");
process.stdout.write(`built standalone explorer with ${rack.entries.length} entries\n`);

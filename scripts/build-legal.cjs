/* Pre-render BOTH language versions. Legal text never depends on JS or a fetch. */
const fs = require('node:fs');
const path = require('node:path');
const content = require('./legal-content.cjs');
const config = require('../site.config.js');
const links = require('../links.js');
const site = path.resolve(__dirname, '..');
const esc = value => String(value).replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
const languages = ['en', 'zh'];
const locale = language => language === 'zh' ? 'zh-CN' : 'en';
const label = (en, zh, tag = 'span', attrs = '') => `<${tag} data-label-en="${esc(en)}" data-label-zh="${esc(zh)}"${attrs ? ' ' + attrs : ''}>${esc(en)}</${tag}>`;
const ui = (key, tag = 'span', attrs = '') => label(content.ui.en[key], content.ui.zh[key], tag, attrs);
const aria = key => `aria-label="${esc(content.ui.en[key])}" data-aria-en="${esc(content.ui.en[key])}" data-aria-zh="${esc(content.ui.zh[key])}"`;
const icons = {
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  book: '<path d="M12 6c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v15"/>',
  cloud: '<path d="M7 19a5 5 0 1 1 .7-10A6 6 0 0 1 19 10a4.5 4.5 0 0 1-.5 9Z"/>',
  settings: '<path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/>',
  voice: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-3 0h6"/>',
  receipt: '<path d="M5 3h14v19l-3-2-4 2-4-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 6 8 7 8-7"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
function configLink(key, text, attrs = '', language) {
  const link = links.resolve(key, config, language);
  return `<a data-config-link="${key}" ${link ? `href="${esc(link.href)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}` : 'hidden'}${attrs ? ' ' + attrs : ''}>${text}</a>`;
}
function rich(text, language) {
  return esc(text).replace(/\{\{(\w+)\}\}/g, (_, token) => {
    if (token === 'contact') return configLink('supportEmail', esc(config.supportEmail), 'data-show-email', language);
    if (['privacy', 'terms', 'membership', 'autoRenewal'].includes(token)) return configLink(`${token}URL`, esc(content.ui[language][token]), '', language);
    const link = content.links[token];
    if (!link || !links.secureURL(link.href)) throw new Error(`Unknown or unsafe legal link: ${token}`);
    return `<a href="${esc(link.href)}" target="_blank" rel="noopener noreferrer">${esc(link[language])}</a>`;
  });
}
function blocks(items, language) {
  return items.map(block => {
    if (block.type === 'paragraph') return `<p>${rich(block.text, language)}</p>`;
    if (block.type === 'list') return `<ul>${block.items.map(item => `<li>${rich(item, language)}</li>`).join('')}</ul>`;
    if (block.type === 'points') return `<dl class="legal-points">${block.items.map(([title, text]) => `<div><dt>${esc(title)}</dt><dd>${rich(text, language)}</dd></div>`).join('')}</dl>`;
    throw new Error(`Unknown legal block: ${block.type}`);
  }).join('\n');
}
function render(pageID) {
  const page = content.pages[pageID];
  const tabs = Object.keys(content.pages).map(id => configLink(`${id}URL`, ui(id), id === pageID ? 'aria-current="page"' : '')).join('\n      ');
  const related = Object.keys(content.pages).filter(id => id !== pageID).map(id => configLink(`${id}URL`, ui(id) + icon('arrow'))).join('');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f8f5">
  <meta name="description" content="${esc(page.en.description)}" data-description-en="${esc(page.en.description)}" data-description-zh="${esc(page.zh.description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(page.en.title)} — Readio">
  <meta property="og:description" content="${esc(page.en.description)}">
  <meta property="og:locale" content="en_US">
  ${label(`${page.en.title} — Readio`, `${page.zh.title} — 爱听书 Readio`, 'title')}
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="legal.css">
  <script src="language.js"></script>
  <script src="links.js"></script>
  <script src="site.config.js"></script>
  <script src="legal.js"></script>
</head>
<body class="legal-page" data-document="${pageID}">
  ${ui('skip', 'a', 'class="skip-link" href="#legal-content"')}
  <header class="site-header" id="top">
    <div class="container header-inner legal-header-inner">
      <a class="brand" href="index.html" data-home-link><img src="assets/app-icon.png" width="40" height="40" alt="">${ui('brand')}</a>
      <div class="legal-header-actions">
        <a class="legal-home-link" href="index.html" data-home-link>${icon('back')}${ui('back')}</a>
        <div class="language-switch" role="group" aria-label="Language / 语言" hidden data-language-controls>
          <button type="button" data-language="zh" lang="zh-CN" aria-pressed="false">中文</button>
          <span aria-hidden="true">/</span>
          <button type="button" data-language="en" lang="en" aria-pressed="true">EN</button>
        </div>
      </div>
    </div>
  </header>
  <main class="container legal-main">
    <div class="legal-hero">
      ${label(page.en.eyebrow, page.zh.eyebrow, 'p', 'class="eyebrow"')}
      ${label(page.en.title, page.zh.title, 'h1')}
      ${label(page.en.description, page.zh.description, 'p', 'class="legal-description"')}
      <div class="legal-meta"><span>${ui('updated')} <span aria-hidden="true">·</span> ${ui('date', 'time', `datetime="${content.updated}"`)}</span>${ui('scope', 'span', 'class="legal-scope"')}</div>
    </div>
    <nav class="legal-tabs" ${aria('navLabel')}>
      ${tabs}
    </nav>
    <ul class="legal-highlights">
      ${page.en.summary.map((item, index) => `<li><span class="legal-highlight-icon">${icon(item.icon)}</span><div>${label(item.title, page.zh.summary[index].title, 'h2')}${label(item.body, page.zh.summary[index].body, 'p')}</div></li>`).join('\n      ')}
    </ul>
    <noscript><p class="legal-nojs">${esc(content.ui.en.noJS)}<br><span lang="zh-CN">${esc(content.ui.zh.noJS)}</span></p></noscript>
    <div class="legal-layout">
      <aside class="legal-sidebar">
        <details class="legal-toc" open>
          <summary>${ui('toc')}${icon('chevron')}</summary>
          <nav ${aria('tocLabel')}>
            <ol>${page.sections.map((section, i) => `<li><a href="#${section.id}"><span class="toc-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${label(section.en.title, section.zh.title)}</a></li>`).join('')}</ol>
          </nav>
        </details>
      </aside>
      <article class="legal-article" id="legal-content" tabindex="-1">
        <p class="legal-intro">${languages.map(language => `<span data-legal-lang="${language}" lang="${locale(language)}">${rich(page[language].intro, language)}</span>`).join('')}</p>
        ${page.sections.map((section, i) => `<section class="legal-section" id="${section.id}" tabindex="-1">
          <div class="legal-section-heading"><span class="legal-section-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h2>${languages.map(language => `<span data-legal-lang="${language}" lang="${locale(language)}">${esc(section[language].title)}</span>`).join('')}</h2></div>
          ${languages.map(language => `<div class="legal-copy" data-legal-lang="${language}" lang="${locale(language)}">${blocks(section[language].blocks, language)}</div>`).join('\n          ')}
        </section>`).join('\n        ')}
        <div class="legal-contact">
          <span class="legal-contact-icon">${icon('mail')}</span>
          ${ui('contactHeading', 'h2')}
          ${ui('contactBody', 'p')}
          ${configLink('supportEmail', esc(config.supportEmail), 'class="legal-email" data-show-email')}
          ${ui('emailNote', 'p', 'class="legal-email-note"')}
        </div>
        <div class="legal-related"><div class="legal-related-docs">${related}</div><a href="#top">${ui('top')}${icon('arrow')}</a></div>
      </article>
    </div>
  </main>
  <footer class="container legal-footer">
    <span>© <span data-copyright-year>2026</span> ${ui('rights')}</span>
    <a href="index.html" data-home-link>${ui('back')}${icon('arrow')}</a>
  </footer>
</body>
</html>
`;
}
for (const [id, page] of Object.entries(content.pages)) {
  const html = render(id);
  const file = path.join(site, page.file);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== html) {
      console.error(`${page.file} is out of date. Run node scripts/build-legal.cjs`);
      process.exitCode = 1;
    } else console.log(`${page.file} matches its bilingual source.`);
  } else {
    fs.writeFileSync(file, html);
    console.log(`Generated ${page.file} with both languages pre-rendered.`);
  }
}

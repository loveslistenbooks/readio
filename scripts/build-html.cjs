/* Generate a complete English HTML fallback. Runtime translations live in content.js. */
const fs = require('node:fs');
const path = require('node:path');
const { en: c } = require('../content.js');
const config = require('../site.config.js');
const links = require('../links.js');
const site = path.resolve(__dirname, '..');
const esc = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const at = (source, key) => key.split('.').reduce((value, part) => value[part], source);
const t = (key, tag = 'span', attrs = '') => `<${tag} data-i18n="${key}" ${attrs}>${esc(at(c, key))}</${tag}>`;
const configLink = (key, label) => {
  const link = links.resolve(key, config);
  const attrs = link ? `href="${esc(link.href)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}` : 'hidden';
  return `<a data-config-link="${key}" data-i18n="${label}" ${attrs}>${esc(c[label])}</a>`;
};
const icons = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
  book: '<path d="M12 6c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v15"/>',
  headphones: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M6 12H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1zm12 0h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1z"/>',
  sliders: '<path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  shield: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  link: '<path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 0 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0)"/>',
  sparkle: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M11 19h2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  cloud: '<path d="M7 19a5 5 0 1 1 .7-10A6 6 0 0 1 19 10a4.5 4.5 0 0 1-.5 9Z"/>',
  microphone: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-3 0h6"/>',
  plugin: '<path d="M8 3h3a3 3 0 0 0 6 0h4v7a3 3 0 0 0 0 6v5h-7a3 3 0 0 0-6 0H3v-7a3 3 0 0 0 0-6V3Z"/>',
  folder: '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 10h18"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r=".7"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5M12 17.5h5"/>',
  chat: '<path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.4-4.4a9 9 0 1 1 16.6-5.1Z"/><path d="M8 9h8M8 13h5"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
};
const icon = (id, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const wave = (cls = '') => `<span class="wave ${cls}" aria-hidden="true">${[12,22,32,19,40,29,46,32,22,38,26,16,30,20,12].map(h => `<i style="--h:${h}px"></i>`).join('')}</span>`;
const store = links.appStoreURL(config.appStoreURL);
const downloadAttrs = store ? `href="${esc(store.href)}" target="_blank" rel="noopener noreferrer"` : 'href="#download"';
const download = (cls = '') => `<a class="button button-primary ${cls}" ${downloadAttrs} data-download>${icon('download')}${t('download')}${icon('arrow')}</a>`;
const posterLink = (id, key) => `<a class="text-link detail-screenshot" href="assets/en/${id}-poster.webp" data-poster-feature="${id}" target="_blank" rel="noopener">${t(key)}${icon('diagonal')}</a>`;
const f = c.features[0];
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f8f5">
  <meta name="description" content="${esc(c.metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(c.metaTitle)}">
  <meta property="og:description" content="${esc(c.metaDescription)}">
  <meta property="og:locale" content="en_US">
  <title>${esc(c.metaTitle)}</title>
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="stylesheet" href="styles.css">
  <script src="language.js"></script>
  <script src="links.js"></script>
  <script src="content.js"></script>
  <script src="site.config.js"></script>
  <script src="app.js" defer></script>
</head>
<body>
  <svg class="svg-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${Object.entries(icons).map(([id, paths]) => `<symbol id="i-${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</symbol>`).join('')}</defs></svg>
  <a class="skip-link" href="#main" data-i18n="skip">${c.skip}</a>
  <header class="site-header" id="top">
    <div class="header-inner container">
      <a class="brand" href="#top"><img src="assets/app-icon.png" width="40" height="40" alt="">${t('brand')}</a>
      <nav class="main-nav" id="main-nav" aria-label="Main navigation" data-nav-label>
        <a href="#tts" data-i18n="navTTS">${c.navTTS}</a>
        <a href="#imports" data-i18n="navImport">${c.navImport}</a>
        <a href="#reading-ai" data-i18n="navAI">${c.navAI}</a>
        <a href="#experience" data-i18n="navFeatures">${c.navFeatures}</a>
      </nav>
      <div class="header-actions">
        <div class="language-switch" role="group" aria-label="Website language" data-i18n-aria="languageLabel">
          <button type="button" data-language="zh" lang="zh-CN" aria-pressed="false">中文</button><span aria-hidden="true">/</span><button type="button" data-language="en" lang="en" aria-pressed="true">EN</button>
        </div>
        <a class="nav-download" ${downloadAttrs} data-download>${t('navDownload')}${icon('diagonal')}</a>
        <button type="button" class="menu-toggle icon-button" aria-controls="main-nav" aria-expanded="false" aria-label="Open navigation" data-i18n-aria="menuLabel">${icon('menu')}</button>
      </div>
    </div>
  </header>
  <main id="main">
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow"><span class="small-spark" aria-hidden="true">${icon('sparkle')}</span>${t('heroEyebrow')}</p>
        <h1 id="hero-title">${t('heroLine1')}<br>${t('heroLine2', 'span', 'class="accent-text"')}</h1>
        ${t('heroDescription', 'p', 'class="hero-description"')}
        <div class="hero-ctas">${download()}<a class="text-link" href="#experience">${t('explore')}${icon('arrow')}</a></div>
        <p class="compatibility">${icon('phone')}${t('compatibility')}</p>
      </div>
      <div class="hero-art">
        <div class="orbit orbit-one" aria-hidden="true"></div><div class="orbit orbit-two" aria-hidden="true"></div>
        <div class="hero-art-caption" aria-hidden="true">01 — ${t('heroSide')}</div>
        <div class="device device-back"><img data-localized-image="bookshelf" src="assets/en/bookshelf.webp" alt="${esc(c.features[4].alt)}" width="640" height="1374" decoding="async"></div>
        <div class="device device-front"><img data-localized-image="listening" src="assets/en/listening.webp" alt="${esc(f.alt)}" width="640" height="1374" fetchpriority="high"></div>
        <div class="listening-note">${wave()}<div>${t('heroFloat', 'strong')}${t('heroFloatSub', 'span')}</div><span class="note-dot" aria-hidden="true"></span></div>
        <span class="art-plus plus-one" aria-hidden="true">+</span><span class="art-plus plus-two" aria-hidden="true">+</span>
      </div>
    </section>
    <div class="benefit-strip container">
      ${[['tts', 'headphones'], ['imports', 'folder'], ['reading-ai', 'sparkle']].map(([id, glyph], i) => `<a class="feature-jump" href="#${id}">${icon(glyph)}<span>${t(`strip${i + 1}`, 'strong')}${t(`strip${i + 1}Detail`, 'span', 'class="jump-description"')}</span>${icon('arrow', 'jump-arrow')}</a>`).join('')}
    </div>
    <section class="tts-section detail-section section container" id="tts" aria-labelledby="tts-title">
      <div class="tts-intro">
        <div class="section-heading detail-copy">
          ${t('tts.eyebrow', 'p', 'class="eyebrow"')}${t('tts.title', 'h2', 'id="tts-title"')}${t('tts.description', 'p', 'class="section-description"')}
          ${posterLink('voices', 'tts.screenshot')}
        </div>
        <figure class="cast-illustration">
          <figcaption>${t('tts.castLabel', 'p', 'class="eyebrow"')}${t('tts.castTitle', 'h3')}</figcaption>
          <ol class="cast-lines">${c.tts.roles.map((role, i) => `<li class="cast-line cast-line-${i}"><div class="cast-person"><span class="cast-mark" aria-hidden="true">0${i + 1}</span><div>${t(`tts.roles.${i}.name`, 'strong')}${t(`tts.roles.${i}.voice`, 'span')}</div>${wave('cast-wave')}</div>${t(`tts.roles.${i}.line`, 'p')}</li>`).join('')}</ol>
          ${t('tts.illustrationNote', 'p', 'class="illustration-note"')}
        </figure>
      </div>
      <p class="cast-explainer">${icon('people')}${t('tts.castNote')}</p>
      <div class="engine-grid">${c.tts.engines.map((engine, i) => `<article class="engine-card" data-engine="${['system', 'online', 'clone', 'plugin'][i]}"><div class="engine-heading">${icon(['phone', 'cloud', 'microphone', 'plugin'][i])}${t(`tts.engines.${i}.tag`, 'span', 'class="engine-tag"')}</div>${t(`tts.engines.${i}.title`, 'h3')}${t(`tts.engines.${i}.body`, 'p')}</article>`).join('')}</div>
      <div class="tts-footer"><p class="listening-comforts">${icon('headphones')}${t('tts.comforts')}</p><a class="text-link" href="#questions">${t('navFAQ')}${icon('arrow')}</a></div>
      ${t('tts.note', 'p', 'class="detail-note"')}
    </section>
    <section class="import-section detail-section section" id="imports" aria-labelledby="imports-title">
      <div class="container">
        <div class="import-layout">
          <div class="section-heading detail-copy">
            ${t('imports.eyebrow', 'p', 'class="eyebrow"')}${t('imports.title', 'h2', 'id="imports-title"')}${t('imports.description', 'p', 'class="section-description"')}
            <div class="import-formats">${t('imports.formatsLabel', 'p', 'class="format-label"')}<ul class="format-books">${c.imports.formats.map((format, i) => `<li>${t(`imports.formats.${i}.name`, 'strong')}${t(`imports.formats.${i}.detail`, 'span')}</li>`).join('')}</ul>${t('imports.formatNote', 'p', 'class="detail-note"')}</div>
            ${posterLink('import', 'imports.screenshot')}
          </div>
          <div class="import-routes">${c.imports.routes.map((route, i) => `<article class="import-route">${icon(['folder', 'wifi', 'cloud', 'server'][i])}<div>${t(`imports.routes.${i}.title`, 'h3')}${t(`imports.routes.${i}.sources`, 'p', 'class="route-sources"')}${t(`imports.routes.${i}.body`, 'p', 'class="route-description"')}</div></article>`).join('')}</div>
        </div>
        <p class="source-boundary">${icon('shield')}${t('imports.note')}</p>
      </div>
    </section>
    <section class="ai-section detail-section section" id="reading-ai" aria-labelledby="ai-title">
      <div class="container">
        <div class="ai-layout">
          <div class="section-heading detail-copy">
            ${t('readingAI.eyebrow', 'p', 'class="eyebrow"')}${t('readingAI.title', 'h2', 'id="ai-title"')}${t('readingAI.description', 'p', 'class="section-description"')}
            <div class="ai-example">${t('readingAI.exampleLabel', 'p', 'class="eyebrow"')}${t('readingAI.example', 'blockquote')}${t('readingAI.exampleSteps', 'p', 'class="example-steps"')}</div>
            ${posterLink('ai', 'readingAI.screenshot')}
          </div>
          <div class="ai-capabilities">${c.readingAI.capabilities.map((capability, i) => `<article class="ai-capability"><span class="capability-icon">${icon(['chat', 'book', 'people', 'headphones'][i])}</span>${t(`readingAI.capabilities.${i}.title`, 'h3')}${t(`readingAI.capabilities.${i}.body`, 'p')}</article>`).join('')}</div>
        </div>
        <details class="advanced-features"><summary>${t('readingAI.advancedTitle')}${icon('plus')}</summary><div class="advanced-grid">${c.readingAI.advanced.map((item, i) => `<article>${t(`readingAI.advanced.${i}.title`, 'h3')}${t(`readingAI.advanced.${i}.body`, 'p')}</article>`).join('')}</div></details>
        <p class="ai-boundary">${icon('shield')}${t('readingAI.note')}</p>
      </div>
    </section>
    <section class="experience section" id="experience" aria-labelledby="experience-title">
      <div class="container">
        <div class="section-heading centered">${t('featuresEyebrow', 'p', 'class="eyebrow"')}${t('featuresTitle', 'h2', 'id="experience-title"')}${t('featuresDescription', 'p', 'class="section-description"')}</div>
        <div class="feature-tabs" role="tablist" aria-label="Explore app features" data-i18n-aria="featureTabsLabel">${c.features.map((feature, i) => `<button type="button" id="tab-${feature.id}" role="tab" aria-selected="${i === 0}" aria-controls="feature-panel" tabindex="${i === 0 ? 0 : -1}" data-feature="${feature.id}"><span class="tab-index" aria-hidden="true">0${i + 1}</span><span data-tab-text>${esc(feature.tab)}</span></button>`).join('')}</div>
        <div class="feature-panel" id="feature-panel" role="tabpanel" aria-labelledby="tab-listening" tabindex="0">
          <div class="feature-visual">
            <span class="feature-watermark" aria-hidden="true">01</span><span class="feature-orbit" aria-hidden="true"></span>
            <div class="feature-device device"><img id="feature-image" src="assets/en/listening.webp" alt="${esc(f.alt)}" width="640" height="1374" loading="lazy" decoding="async"></div>
            <span class="feature-float" id="feature-float">${esc(f.float)}</span>
            <a class="screenshot-zoom" id="screenshot-zoom" href="assets/en/listening-poster.webp" target="_blank" rel="noopener">${icon('plus')}${t('screenshotLink')}</a>
          </div>
          <div class="feature-copy">
            <p class="eyebrow" id="feature-label">${esc(f.label)}</p><h3 id="feature-title">${esc(f.title)}</h3><p id="feature-description">${esc(f.description)}</p>
            <ul id="feature-bullets">${f.bullets.map(b => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
            <span class="interface-note">${icon('phone')}${t('screenshotNote')}</span>
          </div>
        </div>
        <noscript><p class="noscript-note">Enable JavaScript to switch languages and explore all seven features. 开启 JavaScript 可切换中文和浏览全部功能。</p></noscript>
      </div>
    </section>
    <section class="moments section container" aria-labelledby="moments-title">
      <div class="section-heading"><p class="eyebrow" data-i18n="momentsEyebrow">${c.momentsEyebrow}</p>${t('momentsTitle', 'h2', 'id="moments-title"')}${t('momentsDescription', 'p', 'class="section-description"')}</div>
      <div class="moment-grid">
        <article class="moment-card">
          <div class="moment-art book-scene" aria-hidden="true"><span class="book-orbit"></span><div class="little-book">${t('brand', 'span', 'class="book-author"')}${t('bookArt', 'span', 'class="book-title"')}${wave('book-wave')}<span class="book-edition">VOL. 01</span></div><span class="book-shadow"></span><span class="scene-dot"></span></div>
          <div class="moment-copy">${t('moment1Tag', 'p', 'class="eyebrow"')}${t('moment1Title', 'h3')}${t('moment1Body', 'p')}</div>
        </article>
        <article class="moment-card">
          <div class="moment-art night-scene" aria-hidden="true"><span class="moon"></span><span class="night-star star-one"></span><span class="night-star star-two"></span><span class="night-star star-three"></span><div class="night-caption"><span class="timer-art">30 <span>min</span></span>${t('moonArt', 'span')}</div><span class="night-hill"></span></div>
          <div class="moment-copy">${t('moment2Tag', 'p', 'class="eyebrow"')}${t('moment2Title', 'h3')}${t('moment2Body', 'p')}</div>
        </article>
        <article class="moment-card">
          <div class="moment-art thought-scene" aria-hidden="true"><div class="thought-orbit"></div><span class="thought-spark">${icon('sparkle')}</span><div class="thought-label">${t('aiArtLabel')}</div><div class="thought-bubble">${t('aiArt')}${icon('arrow')}</div><div class="thought-lines"><i></i><i></i><i></i></div></div>
          <div class="moment-copy">${t('moment3Tag', 'p', 'class="eyebrow"')}${t('moment3Title', 'h3')}${t('moment3Body', 'p')}</div>
        </article>
      </div>
    </section>
    <section class="how section container" id="how-it-works" aria-labelledby="how-title">
      <div class="section-heading">${t('howEyebrow', 'p', 'class="eyebrow"')}${t('howTitle', 'h2', 'id="how-title"')}${t('howDescription', 'p', 'class="section-description"')}</div>
      <ol class="step-grid">${[1, 2, 3].map((n) => `<li><span class="step-number" aria-hidden="true">0${n}<span></span></span>${t(`step${n}Title`, 'h3')}${t(`step${n}Body`, 'p')}</li>`).join('')}</ol>
      <div class="format-row"><span>TXT</span><span>EPUB</span><span>PDF</span><span>MOBI</span><span class="format-divider" aria-hidden="true"></span><span>iCloud</span><span>Wi-Fi</span><span>WebDAV</span><span>OPDS</span></div>
      ${t('importNote', 'p', 'class="fine-print"')}
    </section>
    <section class="privacy-section" aria-labelledby="privacy-title">
      <div class="privacy-inner container">
        <div class="privacy-copy">${t('privacyEyebrow', 'p', 'class="eyebrow"')}${t('privacyTitle', 'h2', 'id="privacy-title"')}${t('privacyDescription', 'p')}</div>
        <div class="privacy-points">${[['shield', 1], ['link', 2], ['sparkle', 3]].map(([id, n]) => `<div class="privacy-point"><span class="privacy-icon">${icon(id)}</span><div>${t(`privacy${n}Title`, 'h3')}${t(`privacy${n}Body`, 'p')}</div></div>`).join('')}</div>
      </div>
      <div class="policy-entry container">
        <div class="policy-entry-copy">${t('legalEntryEyebrow', 'p', 'class="eyebrow"')}${t('legalEntryTitle', 'h3')}${t('legalEntryBody', 'p')}</div>
        <nav class="policy-links" aria-label="Policies">${configLink('privacyURL', 'footerPrivacy')}${configLink('termsURL', 'footerTerms')}${configLink('membershipURL', 'footerMembership')}${configLink('autoRenewalURL', 'footerAutoRenewal')}</nav>
      </div>
    </section>
    <section class="faq section container" id="questions" aria-labelledby="faq-title">
      <div class="section-heading">${t('faqEyebrow', 'p', 'class="eyebrow"')}${t('faqTitle', 'h2', 'id="faq-title"')}<div class="faq-mark" aria-hidden="true">?</div></div>
      <div class="faq-list">${c.faqs.map(([question, answer], i) => `<details><summary><span data-question="${i}">${esc(question)}</span>${icon('plus')}</summary><p data-answer="${i}">${esc(answer)}</p></details>`).join('')}</div>
    </section>
    <section class="download-section" id="download" aria-labelledby="download-title">
      <div class="download-orbit" aria-hidden="true"></div><div class="download-orbit second" aria-hidden="true"></div>
      <div class="container download-content"><img class="download-icon" src="assets/app-icon.png" width="76" height="76" alt="" loading="lazy">${t('finalEyebrow', 'p', 'class="eyebrow"')}${t('finalTitle', 'h2', 'id="download-title"')}${t('finalDescription', 'p', 'class="section-description"')}${download()}<p class="compatibility">${t('compatibility')}</p><noscript><p>The App Store URL is not configured. 下载地址尚未配置。</p></noscript></div>
    </section>
  </main>
  <footer class="site-footer container"><div class="footer-top"><div><a class="brand" href="#top"><img src="assets/app-icon.png" width="36" height="36" alt="">${t('brand')}</a>${t('footerTagline', 'p')}</div><div class="footer-links"><a href="#how-it-works">${t('navHow')}</a><a href="#questions">${t('navFAQ')}</a>${configLink('privacyURL', 'footerPrivacy')}${configLink('termsURL', 'footerTerms')}${configLink('membershipURL', 'footerMembership')}${configLink('autoRenewalURL', 'footerAutoRenewal')}${configLink('supportEmail', 'footerContact')}<a href="#top">${t('footerTop')}${icon('arrow', 'up-arrow')}</a></div></div><div class="footer-bottom"><span>© <span id="copyright-year">2026</span> ${t('footerRights')}</span><span>Made for the love of stories.</span></div></footer>
  <dialog class="screenshot-dialog" id="screenshot-dialog" aria-label="App screenshot"><button type="button" class="dialog-close icon-button" data-close-dialog aria-label="Close" data-i18n-aria="close">${icon('close')}</button><img id="poster-image" alt="" width="900" height="1957"></dialog>
  <dialog class="download-dialog" id="download-dialog" aria-labelledby="download-dialog-title" aria-describedby="download-dialog-description"><button type="button" class="dialog-close icon-button" data-close-dialog aria-label="Close" data-i18n-aria="close">${icon('close')}</button><img src="assets/app-icon.png" width="64" height="64" alt="">${t('unavailableTitle', 'h2', 'id="download-dialog-title"')}${t('unavailableBody', 'p', 'id="download-dialog-description"')}<button type="button" class="button button-primary" data-close-dialog data-i18n="unavailableConfirm">${c.unavailableConfirm}</button></dialog>
</body>
</html>\n`;
if (process.argv.includes('--check')) {
  if (fs.readFileSync(path.join(site, 'index.html'), 'utf8') !== html) {
    console.error('index.html is out of date. Run node scripts/build-html.cjs');
    process.exitCode = 1;
  } else console.log('index.html matches its source.');
} else {
  fs.writeFileSync(path.join(site, 'index.html'), html);
  console.log('Generated index.html with fully rendered English fallback.');
}

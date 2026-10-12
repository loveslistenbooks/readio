const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const language = require('../language.js');
const content = require('../content.js');
const links = require('../links.js');
const config = require('../site.config.js');
const site = path.resolve(__dirname, '..');
const at = (source, key) => key.split('.').reduce((value, part) => value?.[part], source);

for (const locale of ['zh', 'zh-CN', 'zh-Hans', 'zh-Hans-CN', 'zh-Hant', 'zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant-HK', 'ZH_tw', 'yue-HK', 'cmn-Hans-CN', 'en-HK', 'en-CN', 'en-TW', 'pt-MO']) {
  test(`${locale} selects Chinese`, () => assert.equal(language.fromLocale(locale), 'zh'));
}
for (const locale of ['en-US', 'en-GB', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'en-SG', 'ar', '', undefined]) {
  test(`${locale} selects English`, () => assert.equal(language.fromLocale(locale), 'en'));
}
test('first browser language wins, not a lower-priority language', () => {
  assert.equal(language.resolve({ languages: ['en-US', 'zh-CN'] }), 'en');
  assert.equal(language.resolve({ languages: ['zh-TW', 'en-US'] }), 'zh');
});
test('query > saved choice > browser > English fallback', () => {
  assert.equal(language.resolve({ query: 'en', stored: 'zh', languages: ['zh-CN'] }), 'en');
  assert.equal(language.resolve({ stored: 'en', languages: ['zh-TW'] }), 'en');
  assert.equal(language.resolve({ query: 'invalid', stored: 'invalid', language: 'zh-Hant' }), 'zh');
  assert.equal(language.resolve(), 'en');
});
test('translations have exactly the same keys and structure', () => {
  function compare(a, b, at = 'content') {
    assert.equal(typeof a, typeof b, at);
    if (Array.isArray(a)) { assert.equal(a.length, b.length, at); a.forEach((item, i) => compare(item, b[i], `${at}[${i}]`)); }
    else if (a && typeof a === 'object') {
      assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), at);
      for (const key of Object.keys(a)) compare(a[key], b[key], `${at}.${key}`);
    } else { assert.equal(typeof a, 'string', at); assert.ok(a.trim() && b.trim(), at); }
  }
  compare(content.en, content.zh);
});
test('all localized feature screenshots exist, IDs match and bullets are complete', () => {
  assert.equal(content.en.features.length, 7);
  for (const [i, feature] of content.en.features.entries()) {
    assert.equal(feature.id, content.zh.features[i].id);
    for (const lang of ['en', 'zh']) {
      assert.equal(content[lang].features[i].bullets.length, 3);
      for (const suffix of ['', '-poster']) {
        assert.ok(fs.statSync(path.join(site, 'assets', lang, `${feature.id}${suffix}.webp`)).size > 1000);
      }
    }
  }
});
test('HTML text and aria translation hooks all have a translation', () => {
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  for (const [, key] of html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)) {
    for (const lang of ['en', 'zh']) assert.equal(typeof at(content[lang], key), 'string', `${lang}.${key}`);
  }
});
test('relative local resources and internal anchors resolve', () => {
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
  for (const [, value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (value.startsWith('#')) assert.ok(ids.includes(value.slice(1)), `Missing anchor ${value}`);
    else if (!/^[a-z]+:/i.test(value)) assert.ok(fs.existsSync(path.join(site, value)), `Missing file ${value}`);
  }
});
test('page has meaningful no-JS content and native accessible controls', () => {
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.equal([...html.matchAll(/<details\b/g)].length, content.en.faqs.length + 1);
  assert.equal([...html.matchAll(/role="tab"/g)].length, 7);
  assert.ok(html.includes(content.en.heroDescription));
  assert.ok(html.includes('<noscript>'));
  assert.ok(!html.includes('APP_ID_HERE'));
});
test('public configuration is loadable and contains no fake store URL', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(site, 'site.config.js'), 'utf8'), context);
  assert.deepEqual(Object.keys(context.window.SITE_CONFIG).sort(), ['appStoreURL', 'autoRenewalURL', 'membershipURL', 'privacyURL', 'supportEmail', 'termsURL']);
  const store = context.window.SITE_CONFIG.appStoreURL;
  assert.ok(store === '' || /^https:\/\/apps\.apple\.com\/.+id\d+/.test(store), 'Use an empty value or a real App Store URL');
});
test('all three download buttons include the supplied App Store link without JavaScript', () => {
  assert.equal(config.appStoreURL, 'https://apps.apple.com/app/id6809803750');
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  const buttons = [...html.matchAll(/<a\b[^>]*\bdata-download\b[^>]*>/g)];
  assert.equal(buttons.length, 3, 'Navigation, hero, and final download buttons');
  for (const [tag] of buttons) {
    assert.ok(tag.includes(`href="${config.appStoreURL}"`));
    assert.ok(tag.includes('target="_blank"'));
    assert.ok(tag.includes('rel="noopener noreferrer"'));
  }
});
test('App Store URL validation is shared by runtime and static generation', () => {
  for (const url of [config.appStoreURL, 'https://apps.apple.com/cn/app/id6809803750', 'https://apps.apple.com/us/app/readio/id6809803750']) {
    assert.equal(links.appStoreURL(url)?.href, url);
  }
  for (const value of ['', undefined, 'javascript:alert(1)', 'http://apps.apple.com/app/id6809803750', 'https://example.com/app/id6809803750', 'https://apps.apple.com.evil.example/app/id6809803750', 'https://apps.apple.com/app/id6809803750invalid', 'https://apps.apple.com/app/', 'https://name@apps.apple.com/app/id6809803750', 'https://apps.apple.com:444/app/id6809803750']) {
    assert.equal(links.appStoreURL(value), null, String(value));
  }
});
test('initial styles include responsive, focus and reduced-motion support', () => {
  const css = fs.readFileSync(path.join(site, 'styles.css'), 'utf8');
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('max-width: 380px'));
  assert.ok(!css.includes('@import'));
});

test('English branding is Readio; Chinese branding remains 爱听书', () => {
  assert.equal(content.en.brand, 'Readio');
  assert.equal(content.zh.brand, '爱听书');
  assert.ok(content.en.metaTitle.startsWith('Readio —'));
  assert.ok(content.en.metaDescription.includes('Readio'));
  assert.ok(content.en.footerRights.startsWith('Readio.'));
  assert.ok(!JSON.stringify(content).includes('Love Listen Books'));
  assert.ok(!JSON.stringify(content).includes('readio'), 'Brand spelling must use an uppercase R');
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  assert.ok(!/Love Listen Books/i.test(html));
  assert.ok(!html.includes('readio'), 'Pre-rendered branding must also use an uppercase R');
  assert.ok(html.includes('data-i18n="brand" class="book-author">Readio'));
});

test('TTS, imports and reading AI have direct, pre-rendered sections before the tab explorer', () => {
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  const positions = ['tts', 'imports', 'reading-ai', 'experience'].map(id => {
    assert.ok(html.includes(`href="#${id}"`), `${id} must be directly reachable`);
    const match = new RegExp(`<section[^>]*id="${id}"[^>]*>`).exec(html);
    assert.ok(match, `${id} must be a section, not a hidden tab`);
    assert.ok(!/\bhidden\b/.test(match[0]));
    return match.index;
  });
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  for (const section of ['tts', 'imports', 'readingAI']) {
    assert.ok(html.includes(content.en[section].description));
  }
  assert.ok(!/>undefined</.test(html));
});

test('four distinct voice sources and voice-cloning boundaries are explained in both languages', () => {
  for (const lang of ['en', 'zh']) {
    assert.equal(content[lang].tts.engines.length, 4);
    assert.equal(content[lang].tts.roles.length, 3);
    assert.ok(content[lang].tts.engines.every(engine => engine.title && engine.tag && engine.body));
    assert.match(content[lang].tts.engines[2].body, /authorized|授权/);
    assert.match(content[lang].tts.note, /Offline|离线/);
    assert.match(content[lang].tts.note, /membership|会员/);
  }
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  for (const id of ['system', 'online', 'clone', 'plugin']) assert.ok(html.includes(`data-engine="${id}"`));
  assert.ok(html.includes('not an audio demo'));
  assert.ok(!/<audio\b|speechSynthesis/.test(html), 'Do not imply the illustrative cast is a real voice demo');
});

test('import paths are specific, exclude unfinished SMB, and qualify text extraction', () => {
  for (const lang of ['en', 'zh']) {
    const imports = content[lang].imports;
    assert.deepEqual(imports.formats.map(format => format.name), ['TXT', 'EPUB', 'PDF', 'MOBI']);
    assert.equal(imports.routes.length, 4);
    const sources = imports.routes.map(route => route.sources).join(' ');
    for (const name of ['iCloud Drive', 'Wi-Fi', 'OneDrive', '115', '123', 'WebDAV', 'S3', 'OPDS']) assert.ok(sources.includes(name));
    assert.ok(!/\bSMB\b/.test(JSON.stringify(content[lang])), 'SMB download is not implemented; do not promote its UI entry as working');
    assert.match(imports.formatNote, /image-only|纯图片/i);
    assert.match(imports.formats[2].detail, /Saved|保存/);
    assert.match(imports.formatNote, /not promised|暂不承诺/);
    assert.match(imports.note, /authorization|授权/);
  }
});

test('AI explains reading outcomes with optional advanced controls and external-service boundaries', () => {
  for (const lang of ['en', 'zh']) {
    const ai = content[lang].readingAI;
    assert.equal(ai.capabilities.length, 4);
    assert.equal(ai.advanced.length, 3);
    assert.match(ai.note, /optional|可选/);
    assert.match(ai.note, /wrong|有误/);
    assert.match(ai.note, /charges|费用/);
    assert.match(ai.advanced[0].body, /Remote embeddings|远程向量/);
    assert.match(ai.advanced[2].body, /estimates|估算/);
  }
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  assert.ok(html.includes('<details class="advanced-features"><summary>'));
});

test('detail screenshot links have valid no-JS poster fallbacks, not fake interactive demos', () => {
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  const links = [...html.matchAll(/<a\b[^>]*data-poster-feature="([^"]+)"[^>]*>/g)];
  assert.deepEqual(links.map(match => match[1]), ['voices', 'import', 'ai']);
  for (const [tag, id] of links) {
    assert.ok(tag.includes(`href="assets/en/${id}-poster.webp"`));
    assert.ok(content.en.features.some(feature => feature.id === id));
  }
});

test('homepage policy entry links to membership and auto-renewal agreements', () => {
  const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  assert.ok(html.includes('class="policy-links"'));
  assert.ok(html.includes(content.en.legalEntryTitle));
  assert.ok(html.includes(content.zh.legalEntryTitle) || html.includes('data-i18n="legalEntryTitle"'));
  for (const [key, label] of [['membershipURL', 'footerMembership'], ['autoRenewalURL', 'footerAutoRenewal']]) {
    const tags = [...html.matchAll(new RegExp(`<a\\b[^>]*data-config-link="${key}"[^>]*>`, 'g'))].map(match => match[0]);
    assert.equal(tags.length, 2, key);
    for (const tag of tags) {
      assert.ok(!/\bhidden\b/.test(tag), key);
      assert.ok(tag.includes(`href="${links.resolve(key, config).href}"`), key);
      assert.ok(tag.includes(`data-i18n="${label}"`), key);
    }
  }
});

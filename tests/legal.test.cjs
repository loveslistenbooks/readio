const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const links = require('../links.js');
const language = require('../language.js');
const config = require('../site.config.js');
const legal = require('../scripts/legal-content.cjs');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const escapeHTML = value => String(value).replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));

test('real contact email and local legal pages are configured, without a fake store link', () => {
  assert.equal(config.supportEmail, 'listenbook999@outlook.com');
  assert.equal(config.privacyURL, 'privacy.html');
  assert.equal(config.termsURL, 'terms.html');
  assert.equal(config.membershipURL, 'membership-agreement.html');
  assert.equal(config.autoRenewalURL, 'auto-renewal-agreement.html');
  assert.ok(config.appStoreURL === '' || /^https:\/\/apps\.apple\.com\/.+id\d+/.test(config.appStoreURL));
  assert.equal(links.resolve('supportEmail', config).href, 'mailto:listenbook999@outlook.com');
});
test('site-relative legal URLs preserve repository paths, fragments, and language', () => {
  assert.deepEqual(links.pageLink('privacy.html', 'zh'), { href: 'privacy.html?lang=zh', external: false });
  assert.equal(links.pageLink('./terms.html?lang=en#membership', 'zh').href, 'terms.html?lang=zh#membership');
  assert.equal(links.pageLink('legal/privacy.html?source=footer#rights', 'en').href, 'legal/privacy.html?source=footer&lang=en#rights');
  for (const base of ['https://example.github.io/project/', 'http://localhost:8765/site-preview/', 'file:///Users/test/site/']) {
    const href = links.resolve('privacyURL', config, 'en').href;
    assert.equal(new URL(href, base).href, `${base}privacy.html?lang=en`);
  }
  assert.equal(links.pageLink('terms.html', 'unsupported').href, 'terms.html');
  assert.deepEqual(links.pageLink('https://example.com/privacy?locale=zh#rights', 'en'), { href: 'https://example.com/privacy?locale=zh#rights', external: true });
});
for (const value of ['', null, undefined, 42, 'javascript:alert(1)', 'data:text/html,hello', 'http://example.com/privacy', '//example.com/privacy.html', '/privacy.html', '../privacy.html', './a/../privacy.html', 'https://user:pass@example.com/privacy', 'https:example.com', 'https:///example.com', 'https://example.com\\@evil.com', 'privacy.html\n', ' privacy.html', 'privacy.html?a=\rb', 'legal/%2e%2e/privacy.html', '%2f%2fevil.com/privacy.html', 'privacy.html\\evil', '<img src=x>.html']) {
  test(`reject unsafe/malformed policy URL ${JSON.stringify(value)}`, () => assert.equal(links.pageLink(value, 'zh'), null));
}
test('only safe email addresses and known configuration keys are linkable', () => {
  for (const value of ['test@example.com?bcc=evil@example.com', 'x%0d%0a@example.com', 'test@example.com\n', 'javascript:alert(1)', 'x@host', '']) {
    assert.equal(links.resolve('supportEmail', { supportEmail: value }), null, value);
  }
  assert.equal(links.resolve('unexpected', { unexpected: 'https://example.com' }), null);
  assert.ok(links.resolve('supportEmail', { supportEmail: 'help+privacy@example.com' }));
});
test('both documents have aligned bilingual structures, concrete content, and stable anchors', () => {
  assert.match(legal.updated, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(Object.keys(legal.ui.en).sort(), Object.keys(legal.ui.zh).sort());
  for (const page of Object.values(legal.pages)) {
    assert.equal(page.en.summary.length, 3);
    assert.equal(page.zh.summary.length, 3);
    assert.ok(page.sections.length >= 10);
    assert.equal(new Set(page.sections.map(item => item.id)).size, page.sections.length);
    for (const section of page.sections) {
      assert.match(section.id, /^[a-z][a-z-]+$/);
      assert.ok(section.en.title && section.zh.title);
      assert.deepEqual(section.en.blocks.map(block => block.type), section.zh.blocks.map(block => block.type));
      section.en.blocks.forEach((block, index) => {
        if (block.items) assert.equal(block.items.length, section.zh.blocks[index].items.length);
      });
    }
    const serialized = JSON.stringify(page);
    assert.ok(!/阅读阅多|漫画大师|友盟SDK|优量汇SDK|穿山甲广告SDK|快手联盟SDK|yueduyueyou999/.test(serialized));
    assert.ok(!/TODO|APP_ID_HERE|COMPANY_NAME/.test(serialized));
    for (const [, token] of serialized.matchAll(/\{\{(\w+)\}\}/g)) {
      assert.ok(['privacy', 'terms', 'membership', 'autoRenewal', 'contact'].includes(token) || legal.links[token], `Missing token ${token}`);
    }
  }
});
for (const page of Object.values(legal.pages)) {
  test(`${page.file}: both complete language editions are static, not fetch-dependent`, () => {
    const html = read(page.file);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.ok(html.includes('<noscript>'));
    assert.ok(html.includes(`datetime="${legal.updated}"`));
    assert.ok(html.includes('mailto:listenbook999@outlook.com'));
    assert.ok(!/\{\{\w+\}\}|>undefined</.test(html));
    for (const section of page.sections) {
      assert.ok(html.includes(`id="${section.id}"`));
      assert.ok(html.includes(`href="#${section.id}"`));
      for (const lang of ['en', 'zh']) {
        assert.ok(html.includes(escapeHTML(section[lang].title)));
        for (const block of section[lang].blocks) {
          const texts = block.type === 'paragraph' ? [block.text] : block.items.flat();
          for (const text of texts) {
            const beforeLink = text.split('{{')[0];
            if (beforeLink) assert.ok(html.includes(escapeHTML(beforeLink)), `Missing ${lang} text: ${beforeLink}`);
          }
        }
      }
    }
  });
  test(`${page.file}: no duplicate IDs, missing anchors, or missing local resources`, () => {
    const html = read(page.file);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const [, value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (value.startsWith('#')) assert.ok(ids.includes(value.slice(1)), value);
      else if (!/^[a-z]+:/i.test(value)) {
        const file = value.split(/[?#]/)[0];
        assert.ok(!file.startsWith('/'), 'No root-relative resources on Pages');
        assert.ok(fs.existsSync(path.join(root, file)), `Missing ${value}`);
      }
    }
  });
}
test('homepage fallback exposes legal and email links even without JavaScript', () => {
  const html = read('index.html');
  for (const key of ['privacyURL', 'termsURL', 'membershipURL', 'autoRenewalURL', 'supportEmail']) {
    const tag = new RegExp(`<a\\b[^>]*data-config-link="${key}"[^>]*>`).exec(html)?.[0];
    assert.ok(tag && !/\bhidden\b/.test(tag), key);
    assert.ok(tag.includes(`href="${links.resolve(key, config).href}"`), key);
  }
});
test('deployment and local preview both serve all legal assets', () => {
  const workflow = read('.github/workflows/deploy-pages.yml');
  const preview = read('scripts/serve.cjs');
  for (const file of ['privacy.html', 'terms.html', 'membership-agreement.html', 'auto-renewal-agreement.html', 'legal.css', 'legal.js', 'links.js']) {
    assert.ok(workflow.includes(file), file);
    assert.ok(preview.includes(`'${file}'`), file);
  }
  assert.ok(workflow.includes('node scripts/build-legal.cjs --check'));
  assert.ok(workflow.includes('node --test tests/legal.test.cjs'));
  assert.ok(!/scripts\/legal-content\.cjs.*_site/.test(workflow));
});
test('homepage and policies share language storage and safe link rules', () => {
  assert.equal(language.storageKey, 'love-listen-books.language');
  for (const file of ['app.js', 'legal.js']) {
    assert.ok(read(file).includes('languageAPI.storageKey'));
    assert.ok(read(file).includes('window.SiteLinks'));
  }
  assert.ok(read('legal.css').includes('prefers-reduced-motion: reduce'));
  assert.ok(read('legal.css').includes('min-height: 44px'));
  assert.ok(!read('legal.css').includes('@import'));
});
test('privacy explains actual online and deletion boundaries in both languages', () => {
  const text = JSON.stringify(legal.pages.privacy);
  for (const term of ['GitLab/GitHub', 'StoreKit', 'localStorage', 'remote embeddings', '远程向量', 'reference recordings', '参考录音', 'speech-recognition', '语音识别', 'Apple', 'uninstalling', '卸载', 'outside your country', '国家或地区之外']) assert.ok(text.includes(term), term);
  assert.ok(!text.includes('从不收集任何'));
});
test('terms cover subscription management, AI and voice limits, and mandatory consumer rights', () => {
  const text = JSON.stringify(legal.pages.terms);
  for (const term of ['24 hours', '24 小时', 'refund', '退款', 'deceptive impersonation', '误导性冒充', 'statutory consumer', '消费者', 'final bill', '最终账单']) assert.ok(text.includes(term), term);
});
test('membership and auto-renewal agreements match the real Readio products', () => {
  const membership = JSON.stringify(legal.pages.membership);
  const renewal = JSON.stringify(legal.pages.autoRenewal);
  for (const term of ['com.readio.basic', 'com.readio.basic1year', 'com.readio.basic.lifetime', 'com.readio.pro', 'com.readio.pro1year', 'com.readio.pro.lifetime', '初级会员', '高级会员', 'Basic Member', 'Pro Member', '5 books', '5 本书', '20', '8 hours', '8 小时', '4 hours', '4 小时', '2 hours', '2 小时', 'Microsoft Max', '微软 Max']) {
    assert.ok(membership.includes(term), term);
  }
  for (const term of ['初级会员一个月', '初级会员一年', '高级会员一个月', '高级会员一年', '24 hours', '24 小时', 'com.readio.basic.lifetime', 'do not auto-renew', '不会自动续费', 'Restore Purchases', '恢复购买']) {
    assert.ok(renewal.includes(term), term);
  }
  assert.ok(!/黄金会员|钻石会员|6个月|8元|42元|75元|16元|84元|150元/.test(membership + renewal));
});
test('all three generated HTML files are up to date', () => {
  for (const script of ['build-html.cjs', 'build-legal.cjs']) {
    execFileSync(process.execPath, [path.join(root, 'scripts', script), '--check'], { stdio: 'pipe' });
  }
});

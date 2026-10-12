/* Optional integration / visual checks. Requires Playwright and Chrome (or Chromium).
 * NODE_PATH can point at an existing Playwright installation; no production dependency.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const content = require('../content.js');
const legal = require('../scripts/legal-content.cjs');
const config = require('../site.config.js');
const root = path.resolve(__dirname, '..');
const output = process.env.QA_OUTPUT_DIR || path.join(os.tmpdir(), 'lovelisten-website-qa');
const prefix = '/site-preview/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png' };
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, pathname.slice(prefix.length) || 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const errors = [];
const checks = [];
let browser;
let base;
function report(message) { checks.push(message); console.log(`PASS ${message}`); }
async function loaded(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await Promise.all([...document.images].filter(img => img.getAttribute('src') && img.loading !== 'lazy').map(img => img.decode().catch(() => {})));
  });
}
async function newPage(options = {}, production = false) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  if (!production) await context.route('**/site.config.js', route => route.fulfill({ contentType: 'text/javascript', body: 'window.SITE_CONFIG={appStoreURL:"",privacyURL:"",termsURL:"",membershipURL:"",autoRenewalURL:"",supportEmail:""};' }));
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return { context, page };
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}${prefix}`;
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : { channel: 'chrome' }) });

  for (const locale of ['en-US', 'zh-CN']) {
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      const { context, page } = await newPage({ locale, viewport: { width, height: width < 721 ? 844 : 1000 } });
      await page.goto(base); await loaded(page);
      const expected = locale.startsWith('zh') ? 'zh-CN' : 'en';
      assert.equal(await page.locator('html').getAttribute('lang'), expected);
      const geometry = await page.evaluate(() => ({ width: innerWidth, body: document.body.scrollWidth, doc: document.documentElement.scrollWidth }));
      assert.ok(geometry.body <= width && geometry.doc <= width, `${locale} ${width}px horizontal overflow: ${JSON.stringify(geometry)}`);
      const localized = await page.locator('[data-localized-image]').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0 && img.src.includes(`/assets/${document.documentElement.lang === 'en' ? 'en' : 'zh'}/`)));
      assert.ok(localized, 'Hero images must load and match language');
      const translationErrors = await page.locator('[data-i18n]').evaluateAll((nodes, translated) => nodes
        .filter(node => node.textContent !== node.dataset.i18n.split('.').reduce((value, key) => value[key], translated))
        .map(node => node.dataset.i18n), content[expected === 'en' ? 'en' : 'zh']);
      assert.deepEqual(translationErrors, [], 'Every nested and flat translation must match the selected language');
      const clippedDetails = await page.locator('.detail-section h2, .engine-card, .import-route, .ai-capability, .cast-line, .format-books').evaluateAll(nodes => nodes
        .filter(node => node.scrollWidth > node.clientWidth + 1 || node.getBoundingClientRect().right > innerWidth + 1 || node.getBoundingClientRect().left < -1)
        .map(node => ({ element: node.className || node.id, width: node.clientWidth, content: node.scrollWidth })));
      assert.deepEqual(clippedDetails, [], 'Core feature content must not be clipped behind main overflow containment');
      if ([390, 1440].includes(width)) {
        const name = `${locale.startsWith('zh') ? 'zh' : 'en'}-${width}`;
        for (const id of ['tts', 'imports', 'reading-ai']) {
          await page.locator(`#${id}`).screenshot({ path: path.join(output, `${name}-${id}.png`), style: '.site-header, .skip-link { visibility: hidden !important; }' });
        }
        await page.locator('#download').scrollIntoViewIfNeeded();
        await page.locator('#experience').scrollIntoViewIfNeeded();
        await loaded(page);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(output, `${name}-full.png`), fullPage: true });
        await page.screenshot({ path: path.join(output, `${name}-hero.png`) });
      }
      report(`${locale} at ${width}px: all translations, localized images, unclipped feature content and no horizontal overflow`);
      await context.close();
    }
  }

  const { context, page } = await newPage({ locale: 'en-US', viewport: { width: 1440, height: 1000 } });
  await page.goto(base); await loaded(page);
  await page.locator('[data-language="zh"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.ok(page.url().includes('lang=zh'));
  await page.goto(base); await loaded(page);
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  await page.goto(base + '?lang=en'); await loaded(page);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  report('Manual language persists; shareable URL overrides saved choice');

  for (const id of ['listening', 'voices', 'import', 'reader', 'bookshelf', 'statistics', 'ai']) {
    await page.locator(`#tab-${id}`).click();
    assert.equal(await page.locator(`#tab-${id}`).getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#feature-panel').getAttribute('aria-labelledby'), `tab-${id}`);
    await page.locator('#feature-image').evaluate(img => img.decode());
    assert.ok((await page.locator('#feature-image').getAttribute('src')).includes(id));
  }
  await page.locator('#tab-ai').press('Home');
  assert.equal(await page.locator('#tab-listening').getAttribute('aria-selected'), 'true');
  await page.locator('#tab-listening').press('ArrowRight');
  assert.equal(await page.locator('#tab-voices').getAttribute('aria-selected'), 'true');
  await page.locator('#tab-voices').press('End');
  assert.equal(await page.locator('#tab-ai').getAttribute('aria-selected'), 'true');
  report('All seven feature tabs, images, Home/End and arrow-key navigation');

  await page.locator('#screenshot-zoom').click();
  assert.ok(await page.locator('#screenshot-dialog').evaluate(node => node.open));
  await page.locator('#poster-image').evaluate(img => img.decode());
  assert.ok((await page.locator('#poster-image').getAttribute('src')).includes('ai-poster'));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#screenshot-dialog').evaluate(node => node.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'screenshot-zoom');
  report('Screenshot zoom loads the selected poster; Escape closes and restores focus');

  for (const lang of ['en', 'zh']) {
    await page.locator(`[data-language="${lang}"]`).click();
    for (const id of ['voices', 'import', 'ai']) {
      const link = page.locator(`[data-poster-feature="${id}"]`);
      assert.equal(await link.getAttribute('href'), `assets/${lang}/${id}-poster.webp`);
      await link.click();
      await page.locator('#poster-image').evaluate(img => img.decode());
      assert.equal(await page.locator('#poster-image').getAttribute('src'), `assets/${lang}/${id}-poster.webp`);
      assert.equal(await page.locator('#poster-image').getAttribute('alt'), content[lang].features.find(feature => feature.id === id).alt);
      await page.keyboard.press('Escape');
      assert.ok(await link.evaluate(node => document.activeElement === node));
    }
  }
  report('All three detail screenshot links open the right localized poster and restore focus');

  await page.locator('.advanced-features summary').focus();
  await page.keyboard.press('Enter');
  assert.ok(await page.locator('.advanced-features').evaluate(node => node.open));
  await page.locator('[data-language="en"]').click();
  assert.ok(await page.locator('.advanced-features').evaluate(node => node.open));
  assert.equal(await page.locator('.advanced-grid h3').first().textContent(), content.en.readingAI.advanced[0].title);
  await page.locator('.advanced-features summary').click();
  assert.equal(await page.locator('.advanced-features').evaluate(node => node.open), false);
  report('Advanced AI controls are keyboard-accessible, translate, and preserve disclosure state');

  await page.locator('[data-download]').first().click();
  assert.equal(await page.locator('[data-download]').first().getAttribute('href'), '#download');
  assert.equal(await page.locator('[data-download]').first().getAttribute('target'), null);
  assert.ok(await page.locator('#download-dialog').evaluate(node => node.open));
  await page.locator('#download-dialog .button').click();
  assert.equal(await page.locator('#download-dialog').evaluate(node => node.open), false);
  await page.waitForFunction(() => !document.body.classList.contains('modal-open'));
  assert.equal(await page.locator('[data-config-link]:visible').count(), 0);
  report('Unconfigured download gives an honest message; unconfigured legal links are hidden');

  await page.locator('.faq-list summary').first().click();
  assert.ok(await page.locator('.faq-list details').first().evaluate(node => node.open));
  await page.locator('[data-language="zh"]').click();
  assert.ok((await page.locator('.faq-list summary').first().textContent()).includes('书籍'));
  report('FAQ expands and translates without losing its open state');
  await context.close();

  const mobile = await newPage({ locale: 'zh-TW', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await mobile.page.goto(base); await loaded(mobile.page);
  assert.equal(await mobile.page.locator('html').getAttribute('lang'), 'zh-CN');
  await mobile.page.locator('.menu-toggle').click();
  assert.equal(await mobile.page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await mobile.page.locator('#main-nav a').first().click();
  assert.equal(await mobile.page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(new URL(mobile.page.url()).hash, '#tts');
  assert.equal(await mobile.page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  await mobile.page.locator('#tab-listening').focus();
  await mobile.page.keyboard.press('End');
  assert.equal(await mobile.page.locator('#tab-ai').getAttribute('aria-selected'), 'true');
  const tabRect = await mobile.page.locator('#tab-ai').boundingBox();
  assert.ok(tabRect.x >= 0 && tabRect.x + tabRect.width <= 390);
  report('Traditional Chinese locale, mobile menu, reduced motion and scrollable keyboard tabs');
  await mobile.page.locator('.advanced-features summary').click();
  assert.ok(await mobile.page.locator('.advanced-features').evaluate(node => node.open));
  assert.ok(await mobile.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mobile.page.locator('[data-poster-feature="import"]').click();
  await mobile.page.locator('#poster-image').evaluate(img => img.decode());
  assert.ok(await mobile.page.locator('#screenshot-dialog').evaluate(node => node.open));
  await mobile.page.locator('#screenshot-dialog [data-close-dialog]').click();
  report('Advanced AI disclosure and real import screenshot work on a touch-sized viewport');
  await mobile.context.close();

  for (const locale of ['zh-HK', 'zh-Hant', 'en-HK', 'ja-JP']) {
    const item = await newPage({ locale });
    await item.page.goto(base); await loaded(item.page);
    assert.equal(await item.page.locator('html').getAttribute('lang'), locale === 'ja-JP' ? 'en' : 'zh-CN');
    await item.context.close();
  }
  report('Hong Kong, Traditional Chinese, regional English-HK and Japanese browser language detection');

  const denied = await newPage({ locale: 'zh-CN' });
  await denied.context.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } }); });
  await denied.page.goto(base); await loaded(denied.page);
  await denied.page.locator('[data-language="en"]').click();
  assert.equal(await denied.page.locator('html').getAttribute('lang'), 'en');
  await denied.context.close();
  report('Language switching survives blocked localStorage');

  const noJS = await newPage({ javaScriptEnabled: false });
  await noJS.page.goto(base);
  assert.ok(await noJS.page.locator('h1').isVisible());
  assert.ok(await noJS.page.locator('.noscript-note').isVisible());
  for (const [id, key] of [['tts', 'tts'], ['imports', 'imports'], ['reading-ai', 'readingAI']]) {
    assert.ok((await noJS.page.locator(`#${id}`).textContent()).includes(content.en[key].description));
  }
  await noJS.page.locator('.advanced-features summary').click();
  assert.ok(await noJS.page.locator('.advanced-features').evaluate(node => node.open));
  assert.equal(await noJS.page.locator('[data-poster-feature="voices"]').getAttribute('href'), 'assets/en/voices-poster.webp');
  await noJS.page.locator('.faq-list summary').first().click();
  assert.ok(await noJS.page.locator('.faq-list details').first().evaluate(node => node.open));
  await noJS.context.close();
  report('All three detailed features, advanced disclosure, poster fallback and FAQ work without JavaScript');

  const configured = await newPage();
  await configured.page.route('**/site.config.js', route => route.fulfill({ contentType: 'text/javascript', body: `window.SITE_CONFIG={appStoreURL:'https://apps.apple.com/app/id1234567890',privacyURL:'https://example.com/privacy',termsURL:'https://example.com/terms',membershipURL:'https://example.com/membership',autoRenewalURL:'https://example.com/renewal',supportEmail:'support@example.com'};` }));
  await configured.page.goto(base); await loaded(configured.page);
  assert.equal(await configured.page.locator('[data-download]').first().getAttribute('href'), 'https://apps.apple.com/app/id1234567890');
  assert.equal(await configured.page.locator('[data-config-link]:visible').count(), 9);
  await configured.context.close();
  report('Configured App Store, privacy, terms and support links are wired correctly (no external navigation)');

  for (const javaScriptEnabled of [true, false]) {
    const item = await newPage({ javaScriptEnabled, locale: 'zh-CN' }, true);
    // Intercept the destination: verify navigation without claiming the app is live.
    await item.context.route('https://apps.apple.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>App Store link test</title>' }));
    await item.page.goto(base); await loaded(item.page);
    for (const lang of javaScriptEnabled ? ['zh', 'en'] : ['en']) {
      if (javaScriptEnabled) await item.page.locator(`[data-language="${lang}"]`).click();
      const buttons = await item.page.locator('[data-download]').evaluateAll(nodes => nodes.map(node => ({ href: node.getAttribute('href'), target: node.target, rel: node.rel })));
      assert.equal(buttons.length, 3);
      for (const button of buttons) assert.deepEqual(button, { href: config.appStoreURL, target: '_blank', rel: 'noopener noreferrer' });
    }
    const [popup] = await Promise.all([item.page.waitForEvent('popup'), item.page.locator('[data-download]').first().click()]);
    await popup.waitForLoadState();
    assert.equal(popup.url(), 'https://apps.apple.com/app/id6809803750');
    assert.equal(await item.page.locator('#download-dialog').evaluate(node => node.open), false);
    await item.context.close();
  }
  report('Supplied App Store ID reaches all three downloads in both languages and without JavaScript; click destination verified with interception');

  for (const documentID of ['privacy', 'terms', 'membership', 'autoRenewal']) {
    for (const lang of ['en', 'zh']) {
      for (const width of [320, 375, 390, 768, 1024, 1440]) {
        const item = await newPage({ locale: lang === 'zh' ? 'zh-CN' : 'en-US', viewport: { width, height: width < 721 ? 844 : 1000 } }, true);
        await item.page.goto(`${base}${documentID}.html`); await loaded(item.page);
        assert.equal(await item.page.locator('html').getAttribute('lang'), lang === 'zh' ? 'zh-CN' : 'en');
        assert.equal(await item.page.locator('h1').textContent(), legal.pages[documentID][lang].title);
        assert.equal(await item.page.locator('title').textContent(), await item.page.locator('meta[property="og:title"]').getAttribute('content'));
        const geometry = await item.page.evaluate(() => ({ width: innerWidth, body: document.body.scrollWidth, doc: document.documentElement.scrollWidth }));
        assert.ok(geometry.body <= width && geometry.doc <= width, `${documentID}/${lang}/${width}: ${JSON.stringify(geometry)}`);
        const clipped = await item.page.locator('.legal-article, .legal-copy:not([hidden]), .legal-highlights li, .legal-section h2, .legal-email').evaluateAll(nodes => nodes
          .filter(node => node.scrollWidth > node.clientWidth + 1 || node.getBoundingClientRect().right > innerWidth + 1)
          .map(node => ({ element: node.className, width: node.clientWidth, scroll: node.scrollWidth })));
        assert.deepEqual(clipped, [], `${documentID}/${lang}/${width}: text must not be clipped`);
        const translationErrors = await item.page.locator('[data-label-en]').evaluateAll((nodes, lang) => nodes.filter(node => node.textContent !== node.getAttribute(`data-label-${lang}`)).map(node => node.tagName), lang);
        assert.deepEqual(translationErrors, []);
        assert.equal(await item.page.locator(`[data-legal-lang="${lang}"]:visible`).count(), legal.pages[documentID].sections.length * 2);
        assert.equal(await item.page.locator(`[data-legal-lang="${lang === 'zh' ? 'en' : 'zh'}"]:visible`).count(), 0);
        assert.equal(await item.page.locator('.legal-tabs [aria-current="page"]').textContent(), legal.ui[lang][documentID]);
        assert.equal(await item.page.locator('.legal-email').getAttribute('href'), 'mailto:listenbook999@outlook.com');
        assert.equal(await item.page.locator('.legal-toc').evaluate(node => node.open), width > 960);
        if ([390, 1440].includes(width)) {
          await item.page.screenshot({ path: path.join(output, `legal-${documentID}-${lang}-${width}.png`) });
          await item.page.locator('.legal-contact').screenshot({ path: path.join(output, `legal-${documentID}-${lang}-${width}-contact.png`), style: '.site-header { visibility: hidden !important; }' });
          await item.page.locator('#scope').screenshot({ path: path.join(output, `legal-${documentID}-${lang}-${width}-body.png`), style: '.site-header { visibility: hidden !important; }' });
        }
        await item.context.close();
      }
    }
    report(`${documentID}: both languages, all section text, 320–1440px layout, metadata and real contact link`);
  }

  const navigation = await newPage({ locale: 'zh-CN', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }, true);
  await navigation.context.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } }); });
  await navigation.page.goto(base); await loaded(navigation.page);
  await navigation.page.locator('[data-language="en"]').click();
  const policyLink = navigation.page.locator('.footer-links [data-config-link="privacyURL"]');
  assert.equal(await policyLink.getAttribute('href'), 'privacy.html?lang=en');
  assert.equal(await policyLink.getAttribute('target'), null);
  await policyLink.click(); await loaded(navigation.page);
  assert.ok(navigation.page.url().startsWith(`${base}privacy.html?lang=en`));
  assert.equal(await navigation.page.locator('html').getAttribute('lang'), 'en');
  await navigation.page.locator('[data-language="zh"]').click();
  await navigation.page.locator('.legal-tabs [data-config-link="termsURL"]').click(); await loaded(navigation.page);
  assert.ok(navigation.page.url().startsWith(`${base}terms.html?lang=zh`));
  assert.equal(await navigation.page.locator('h1').textContent(), '使用条款');
  await navigation.page.locator('.legal-toc summary').focus();
  await navigation.page.keyboard.press('Enter');
  assert.ok(await navigation.page.locator('.legal-toc').evaluate(node => node.open));
  await navigation.page.locator('.legal-toc a[href="#membership"]').click();
  assert.equal(new URL(navigation.page.url()).hash, '#membership');
  const heading = await navigation.page.locator('#membership').boundingBox();
  assert.ok(heading.y >= 76 && heading.y < 844, 'Anchored section must clear the sticky header');
  await navigation.page.locator('[data-language="en"]').click();
  assert.equal(new URL(navigation.page.url()).hash, '#membership');
  assert.ok(await navigation.page.locator('.legal-toc').evaluate(node => node.open), 'Language switching must preserve open contents');
  await navigation.page.locator('.brand[data-home-link]').click(); await loaded(navigation.page);
  assert.equal(await navigation.page.locator('html').getAttribute('lang'), 'en');
  assert.ok(navigation.page.url().startsWith(`${base}index.html?lang=en`));
  await navigation.context.close();
  report('Homepage → privacy → terms → homepage retains language without storage, under a Pages subpath; keyboard contents and stable anchors work');

  const preference = await newPage({ locale: 'zh-TW' }, true);
  await preference.page.goto(`${base}privacy.html`); await loaded(preference.page);
  await preference.page.locator('[data-language="en"]').click();
  await preference.page.goto(`${base}terms.html`); await loaded(preference.page);
  assert.equal(await preference.page.locator('html').getAttribute('lang'), 'en');
  await preference.page.goto(`${base}terms.html?lang=zh#membership`); await loaded(preference.page);
  assert.equal(await preference.page.locator('html').getAttribute('lang'), 'zh-CN');
  await preference.context.close();
  report('Legal pages use browser language, saved choice, then explicit query precedence consistently');

  const legalNoJS = await newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }, true);
  await legalNoJS.page.goto(base);
  assert.equal(await legalNoJS.page.locator('.footer-links [data-config-link="privacyURL"]').getAttribute('href'), 'privacy.html');
  await legalNoJS.page.locator('.footer-links [data-config-link="privacyURL"]').click();
  for (const documentID of ['privacy', 'terms', 'membership', 'autoRenewal']) {
    await legalNoJS.page.goto(`${base}${documentID}.html`);
    assert.ok(await legalNoJS.page.locator('.legal-nojs').isVisible());
    for (const lang of ['en', 'zh']) assert.equal(await legalNoJS.page.locator(`.legal-copy[data-legal-lang="${lang}"]:visible`).count(), legal.pages[documentID].sections.length);
    assert.equal(await legalNoJS.page.locator('[data-language-controls]').isVisible(), false);
    assert.ok(await legalNoJS.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await legalNoJS.page.locator('.legal-toc a').first().click();
    assert.equal(new URL(legalNoJS.page.url()).hash, '#scope');
  }
  await legalNoJS.context.close();
  report('Without JavaScript, homepage links work and both complete legal translations, contact and contents remain available');

  const unsafe = await newPage({}, true);
  await unsafe.page.route('**/site.config.js', route => route.fulfill({ contentType: 'text/javascript', body: `window.SITE_CONFIG=${JSON.stringify({ appStoreURL: '', privacyURL: 'javascript:alert(1)', termsURL: '//evil.example/terms.html', membershipURL: 'javascript:alert(1)', autoRenewalURL: '//evil.example/renewal.html', supportEmail: 'bad@example.com?bcc=evil@example.com' })};` }));
  for (const file of ['index.html', 'privacy.html']) {
    await unsafe.page.goto(base + file); await loaded(unsafe.page);
    assert.equal(await unsafe.page.locator('[data-config-link]:visible').count(), 0);
    assert.equal(await unsafe.page.locator('[data-config-link][href]').count(), 0);
  }
  await unsafe.context.close();
  report('Unsafe configuration is rejected and stale pre-rendered links are cleared on both kinds of page');

  const localFile = await newPage({ locale: 'en-US' }, true);
  await localFile.page.goto(`${pathToFileURL(path.join(root, 'privacy.html')).href}?lang=zh`); await loaded(localFile.page);
  assert.equal(await localFile.page.locator('html').getAttribute('lang'), 'zh-CN');
  await localFile.page.locator('.legal-tabs [data-config-link="termsURL"]').click(); await loaded(localFile.page);
  assert.equal(await localFile.page.locator('h1').textContent(), '使用条款');
  await localFile.page.locator('.brand[data-home-link]').click(); await loaded(localFile.page);
  assert.equal(await localFile.page.locator('html').getAttribute('lang'), 'zh-CN');
  await localFile.context.close();
  report('Opening the local HTML files directly also loads assets and preserves language across policy, terms, and homepage');

  assert.deepEqual(errors, [], 'Browser must not log runtime or resource errors');
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ checks, errors, screenshotDirectory: output }, null, 2));
  console.log(`\n${checks.length} browser checks passed. Screenshots: ${output}`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  server.close();
});

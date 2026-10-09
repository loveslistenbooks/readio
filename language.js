/* Shared by the browser and Node's dependency-free regression tests. */
(function (root) {
  'use strict';
  const supported = value => value === 'zh' || value === 'en';
  function fromLocale(locale) {
    const parts = String(locale || '').replace(/_/g, '-').toLowerCase().split('-');
    const language = parts[0];
    // Browser locale, not IP location. Include Chinese scripts and HK/TW/MO locales.
    return ['zh', 'cmn', 'yue'].includes(language) ||
      parts.some(part => ['cn', 'hk', 'tw', 'mo'].includes(part)) ? 'zh' : 'en';
  }
  function resolve({ query, stored, languages, language } = {}) {
    if (supported(query)) return query;
    if (supported(stored)) return stored;
    return fromLocale(languages?.[0] || language || 'en');
  }
  const api = Object.freeze({ fromLocale, resolve, supported, storageKey: 'love-listen-books.language' });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SiteLanguage = api;
})(globalThis);

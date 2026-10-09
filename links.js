/* Shared, dependency-free URL rules for HTML generation and browser navigation. */
(function (root) {
  'use strict';
  function clean(value) {
    return typeof value === 'string' && value === value.trim() &&
      !/[\u0000-\u0020\u007f\\]/.test(value) && value.length > 0;
  }
  function secureURL(value) {
    if (!clean(value) || !/^https:\/\/[^/?#@]+(?:[/?#]|$)/i.test(value)) return null;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url : null;
    } catch { return null; }
  }
  function appStoreURL(value) {
    const url = secureURL(value);
    return url && url.hostname === 'apps.apple.com' && !url.port && /\/id\d+(?:\/|$)/.test(url.pathname) ? url : null;
  }
  function pageLink(value, language) {
    if (!clean(value)) return null;
    // Deliberately reject root-relative paths, //hosts, traversal, encoded paths,
    // schemes and backslashes. Relative files also work under a Pages repo path.
    if (/^(?:\.\/)?(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.html(?:[?#].*)?$/i.test(value)) {
      const url = new URL(value, 'https://site.invalid/');
      if (language === 'en' || language === 'zh') url.searchParams.set('lang', language);
      return { href: url.pathname.slice(1) + url.search + url.hash, external: false };
    }
    const url = secureURL(value);
    return url ? { href: url.href, external: true } : null;
  }
  function resolve(key, config, language) {
    const value = config?.[key];
    if (key === 'supportEmail') {
      return typeof value === 'string' && /^[a-z0-9._+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(value)
        ? { href: `mailto:${value}`, external: false } : null;
    }
    return ['privacyURL', 'termsURL'].includes(key) ? pageLink(value, language) : null;
  }
  function apply(document, config, language) {
    document.querySelectorAll('[data-config-link]').forEach(link => {
      const result = resolve(link.dataset.configLink, config, language);
      // Also clear pre-rendered URLs when a setting is removed or becomes invalid.
      for (const attribute of ['href', 'target', 'rel']) link.removeAttribute(attribute);
      link.hidden = !result;
      if (!result) return;
      link.setAttribute('href', result.href);
      if (result.external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      if (link.hasAttribute('data-show-email')) link.textContent = config.supportEmail;
    });
  }
  const api = Object.freeze({ secureURL, appStoreURL, pageLink, resolve, apply });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SiteLinks = api;
})(globalThis);

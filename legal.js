/* Progressive enhancement only: the complete legal text is already in the HTML. */
(() => {
  'use strict';
  const languageAPI = window.SiteLanguage;
  const links = window.SiteLinks;
  const config = window.SITE_CONFIG || {};
  let stored;
  try { stored = localStorage.getItem(languageAPI.storageKey); } catch { /* Optional preference. */ }
  let language = languageAPI.resolve({
    query: new URLSearchParams(location.search).get('lang'),
    stored,
    languages: navigator.languages,
    language: navigator.language,
  });
  function setDocumentLanguage() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.legalLanguage = language;
  }
  // Run in the head to avoid showing the other edition while parsing the page.
  setDocumentLanguage();
  document.addEventListener('DOMContentLoaded', () => {
    const all = selector => [...document.querySelectorAll(selector)];
    function render() {
      setDocumentLanguage();
      all('[data-label-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-label-${language}`);
      });
      all('[data-aria-en]').forEach(element => {
        element.setAttribute('aria-label', element.getAttribute(`data-aria-${language}`));
      });
      all('[data-legal-lang]').forEach(element => { element.hidden = element.dataset.legalLang !== language; });
      all('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
      all('[data-home-link]').forEach(link => { link.setAttribute('href', links.pageLink('index.html', language).href); });
      links.apply(document, config, language);
      const description = document.querySelector('meta[name="description"]');
      description.content = description.getAttribute(`data-description-${language}`);
      document.querySelector('meta[property="og:title"]').content = document.title;
      document.querySelector('meta[property="og:description"]').content = description.content;
      document.querySelector('meta[property="og:locale"]').content = language === 'zh' ? 'zh_CN' : 'en_US';
    }
    all('[data-language]').forEach(button => {
      button.addEventListener('click', () => {
        language = button.dataset.language;
        try { localStorage.setItem(languageAPI.storageKey, language); } catch { /* Still works without storage. */ }
        try {
          const url = new URL(location.href);
          url.searchParams.set('lang', language);
          history.replaceState(null, '', url);
        } catch { /* Some file:// previews restrict history. */ }
        render();
      });
    });
    document.querySelector('[data-copyright-year]').textContent = String(new Date().getFullYear());
    // Use a native disclosure on small screens; leave it usable without JS too.
    const toc = document.querySelector('.legal-toc');
    if (matchMedia('(max-width: 960px)').matches) toc.open = false;
    render();
    document.querySelector('[data-language-controls]').hidden = false;
  }, { once: true });
})();

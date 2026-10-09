(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const at = (source, key) => key.split('.').reduce((value, part) => value[part], source);
  const strings = window.SITE_CONTENT;
  const languageAPI = window.SiteLanguage;
  const storageKey = languageAPI.storageKey;
  const linkAPI = window.SiteLinks;
  const config = window.SITE_CONFIG || {};
  let stored;
  try { stored = localStorage.getItem(storageKey); } catch { /* Private/file contexts may deny storage. */ }
  let language = languageAPI.resolve({
    query: new URLSearchParams(location.search).get('lang'),
    stored,
    languages: navigator.languages,
    language: navigator.language,
  });
  let activeFeature = 0;
  let menuOpen = false;

  function renderFeature() {
    const feature = strings[language].features[activeFeature];
    $('#feature-label').textContent = feature.label;
    $('#feature-title').textContent = feature.title;
    $('#feature-description').textContent = feature.description;
    $('#feature-float').textContent = feature.float;
    $('.feature-watermark').textContent = String(activeFeature + 1).padStart(2, '0');
    $$('#feature-bullets li span').forEach((item, index) => { item.textContent = feature.bullets[index]; });
    const image = $('#feature-image');
    image.src = `assets/${language}/${feature.id}.webp`;
    image.alt = feature.alt;
    $('#screenshot-zoom').href = `assets/${language}/${feature.id}-poster.webp`;
    $('#feature-panel').setAttribute('aria-labelledby', `tab-${feature.id}`);
    $$('[data-feature]').forEach((tab, index) => {
      const selected = index === activeFeature;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.querySelector('[data-tab-text]').textContent = strings[language].features[index].tab;
    });
  }

  function renderMenu() {
    $('#main-nav').classList.toggle('is-open', menuOpen);
    $('.menu-toggle').setAttribute('aria-expanded', String(menuOpen));
    $('.menu-toggle').setAttribute('aria-label', menuOpen ? strings[language].close : strings[language].menuLabel);
  }

  function renderLanguage() {
    const content = strings[language];
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = content.metaTitle;
    $('meta[name="description"]').content = content.metaDescription;
    $('meta[property="og:title"]').content = content.metaTitle;
    $('meta[property="og:description"]').content = content.metaDescription;
    $('meta[property="og:locale"]').content = language === 'zh' ? 'zh_CN' : 'en_US';
    $$('[data-i18n]').forEach(element => { element.textContent = at(content, element.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', at(content, element.dataset.i18nAria)); });
    $$('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
    $$('[data-localized-image]').forEach(image => {
      const feature = content.features.find(item => item.id === image.dataset.localizedImage);
      image.src = `assets/${language}/${feature.id}.webp`;
      image.alt = feature.alt;
    });
    $$('[data-poster-feature]').forEach(link => {
      link.href = `assets/${language}/${link.dataset.posterFeature}-poster.webp`;
    });
    $$('[data-question]').forEach(item => { item.textContent = content.faqs[Number(item.dataset.question)][0]; });
    $$('[data-answer]').forEach(item => { item.textContent = content.faqs[Number(item.dataset.answer)][1]; });
    $('[data-nav-label]').setAttribute('aria-label', language === 'zh' ? '主导航' : 'Main navigation');
    $('#screenshot-dialog').setAttribute('aria-label', content.screenshotNote);
    linkAPI.apply(document, config, language);
    renderFeature();
    renderMenu();
  }

  $$('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
      language = button.dataset.language;
      try { localStorage.setItem(storageKey, language); } catch { /* Translation still works without storage. */ }
      try {
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
      } catch { /* file:// previews can restrict history updates. */ }
      renderLanguage();
    });
  });

  function selectFeature(index, focus = false) {
    activeFeature = index;
    renderFeature();
    if (focus) {
      const tab = $$('[data-feature]')[index];
      tab.focus({ preventScroll: true });
      // Scroll only the horizontal tab bar, never jump the entire page.
      const bar = $('.feature-tabs');
      const left = tab.offsetLeft - bar.offsetLeft;
      if (left < bar.scrollLeft) bar.scrollLeft = left;
      else if (left + tab.offsetWidth > bar.scrollLeft + bar.clientWidth) {
        bar.scrollLeft = left + tab.offsetWidth - bar.clientWidth;
      }
    }
  }
  $$('[data-feature]').forEach((tab, index) => {
    tab.addEventListener('click', () => selectFeature(index));
    tab.addEventListener('keydown', event => {
      const count = strings[language].features.length;
      const target = { ArrowRight: (index + 1) % count, ArrowLeft: (index - 1 + count) % count, Home: 0, End: count - 1 }[event.key];
      if (target !== undefined) {
        event.preventDefault();
        selectFeature(target, true);
      }
    });
  });

  $('.menu-toggle').addEventListener('click', () => { menuOpen = !menuOpen; renderMenu(); });
  $$('#main-nav a').forEach(link => link.addEventListener('click', () => { menuOpen = false; renderMenu(); }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen) {
      menuOpen = false;
      renderMenu();
      $('.menu-toggle').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menuOpen && !$('.site-header').contains(event.target)) { menuOpen = false; renderMenu(); }
  });
  const mobileLayout = matchMedia('(max-width: 720px)');
  mobileLayout.addEventListener('change', () => { menuOpen = false; renderMenu(); });

  function showDialog(dialog) {
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  $$('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.classList.remove('modal-open');
    });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  });
  function openScreenshot(feature) {
    const poster = $('#poster-image');
    poster.src = `assets/${language}/${feature.id}-poster.webp`;
    poster.alt = feature.alt;
    showDialog($('#screenshot-dialog'));
    $('#screenshot-dialog').scrollTop = 0;
  }
  $('#screenshot-zoom').addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openScreenshot(strings[language].features[activeFeature]);
  });
  $$('[data-poster-feature]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openScreenshot(strings[language].features.find(feature => feature.id === link.dataset.posterFeature));
    });
  });

  const store = linkAPI.appStoreURL(config.appStoreURL);
  $$('[data-download]').forEach(link => {
    if (store) {
      link.href = store.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.setAttribute('href', '#download');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.addEventListener('click', event => { event.preventDefault(); showDialog($('#download-dialog')); });
    }
  });
  $('#copyright-year').textContent = String(new Date().getFullYear());
  renderLanguage();
})();

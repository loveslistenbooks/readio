/* Public settings only. After editing, regenerate both HTML templates. */
(function () {
  'use strict';
  const config = Object.freeze({
    appStoreURL: 'https://apps.apple.com/app/id6809803750', // Region-neutral App Store link.
    supportEmail: 'listenbook999@outlook.com',
    privacyURL: 'privacy.html', // Site-relative HTML path or reviewed HTTPS URL.
    termsURL: 'terms.html',
    membershipURL: 'membership-agreement.html',
    autoRenewalURL: 'auto-renewal-agreement.html',
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = config;
  else window.SITE_CONFIG = config;
})();

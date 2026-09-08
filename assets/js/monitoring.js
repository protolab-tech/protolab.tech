// GDPR/CCPA compliant cookie consent + Google Analytics (G-5B3MWGZ9SZ)
(function() {
  'use strict';

  var GA_ID = 'G-5B3MWGZ9SZ';

  // Shared palette — matches protolab.tech negentropy theme where possible
  var theme = {
    bg: 'rgba(5, 5, 7, 0.94)',
    surface: '#111111',
    ink: '#e8edf2',
    inkDim: '#707a85',
    accent: '#57c9c2',
    accentMuted: 'rgba(87, 201, 194, 0.35)',
    border: 'rgba(232, 237, 242, 0.12)',
    font: "'Space Grotesk', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace"
  };

  var cookieUtils = {
    set: function(name, value, days) {
      var expires = '';
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Strict';
    },
    get: function(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  };

  function hasAnalyticsConsent() {
    var consent = cookieUtils.get('protolab_cookie_consent');
    var analyticsConsent = cookieUtils.get('protolab_analytics_consent');
    return analyticsConsent === 'true' || consent === 'accepted';
  }

  function initCookieConsent() {
    var existingConsent = cookieUtils.get('protolab_cookie_consent');

    if (existingConsent === 'accepted' || existingConsent === 'customized') {
      loadAnalytics();
      return;
    }

    if (existingConsent === 'rejected') {
      return;
    }

    showCookieBanner();
  }

  function showCookieBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: ${theme.bg};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: ${theme.ink};
        padding: 20px;
        z-index: 10000;
        border-top: 1px solid ${theme.border};
        box-shadow: 0 -8px 30px rgba(0,0,0,0.45);
        font-family: ${theme.font};
        font-size: 14px;
        line-height: 1.5;
      ">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 300px;">
            <p style="margin: 0; color: ${theme.inkDim};">
              We use cookies to improve your experience and analyze website traffic.
              <a href="/policy.html" style="color: ${theme.accent}; text-decoration: none; font-weight: 500;" target="_blank" rel="noopener">
                Cookie policy
              </a>
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="cookie-accept" style="
              background: ${theme.accent};
              color: #050507;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-family: ${theme.mono};
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            ">Accept</button>
            <button id="cookie-reject" style="
              background: transparent;
              color: ${theme.ink};
              border: 1px solid ${theme.border};
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-family: ${theme.mono};
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            ">Reject</button>
            <button id="cookie-customize" style="
              background: transparent;
              color: ${theme.accent};
              border: 1px solid ${theme.accentMuted};
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-family: ${theme.mono};
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            ">Customize</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function() {
      cookieUtils.set('protolab_cookie_consent', 'accepted', 365);
      cookieUtils.set('protolab_analytics_consent', 'true', 365);
      hideBanner();
      loadAnalytics();
    });

    document.getElementById('cookie-reject').addEventListener('click', function() {
      cookieUtils.set('protolab_cookie_consent', 'rejected', 365);
      cookieUtils.set('protolab_analytics_consent', 'false', 365);
      hideBanner();
    });

    document.getElementById('cookie-customize').addEventListener('click', function() {
      showCustomizationModal();
    });
  }

  function showCustomizationModal() {
    var modal = document.createElement('div');
    modal.id = 'cookie-customization-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: ${theme.font};
      ">
        <div style="
          background: ${theme.surface};
          border: 1px solid ${theme.border};
          border-radius: 12px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          color: ${theme.ink};
          box-shadow: 0 25px 60px rgba(0,0,0,0.55);
        ">
          <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Cookie Preferences</h2>

          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">Essential Cookies</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: ${theme.inkDim};">
              Required for the website to function. Cannot be disabled.
            </p>
            <label style="display: flex; align-items: center; gap: 10px; color: ${theme.inkDim};">
              <input type="checkbox" checked disabled style="cursor: not-allowed; accent-color: ${theme.accent};">
              <span>Always active</span>
            </label>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">Analytics Cookies</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: ${theme.inkDim};">
              Anonymous usage data via Google Analytics to help us improve the site.
            </p>
            <label style="display: flex; align-items: center; gap: 10px; color: ${theme.inkDim};">
              <input type="checkbox" id="analytics-toggle" style="accent-color: ${theme.accent};">
              <span>Google Analytics</span>
            </label>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="modal-cancel" style="
              background: transparent;
              color: ${theme.ink};
              border: 1px solid ${theme.border};
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-family: ${theme.mono};
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            ">Cancel</button>
            <button id="modal-save" style="
              background: ${theme.accent};
              color: #050507;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-family: ${theme.mono};
              font-size: 12px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            ">Save</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('analytics-toggle').checked = hasAnalyticsConsent();

    document.getElementById('modal-cancel').addEventListener('click', function() {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    });

    document.getElementById('modal-save').addEventListener('click', function() {
      var analyticsEnabled = document.getElementById('analytics-toggle').checked;

      cookieUtils.set('protolab_cookie_consent', 'customized', 365);
      cookieUtils.set('protolab_analytics_consent', analyticsEnabled ? 'true' : 'false', 365);

      if (analyticsEnabled) {
        loadAnalytics();
      }

      if (modal.parentNode) modal.parentNode.removeChild(modal);
      hideBanner();
    });

    modal.addEventListener('click', function(e) {
      if (e.target === modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }

  function loadAnalytics() {
    if (window.gtag || !hasAnalyticsConsent()) {
      return;
    }

    var gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure'
    });
  }

  function addCookiePreferencesButton() {
    if (window.location.pathname.includes('/EvoSimGame/')) {
      return;
    }

    if (!cookieUtils.get('protolab_cookie_consent')) {
      return;
    }

    var isHome = window.location.pathname === '/' ||
      window.location.pathname.endsWith('/index.html');

    var button = document.createElement('button');
    button.innerHTML = 'Cookies';
    button.style.cssText = `
      position: fixed;
      bottom: ${isHome ? 'clamp(18px, 3vw, 34px)' : '20px'};
      ${isHome ? 'left: clamp(18px, 3vw, 34px);' : 'right: 20px;'}
      background: ${theme.bg};
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: ${theme.inkDim};
      border: 1px solid ${theme.border};
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-family: ${theme.mono};
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      z-index: 9999;
    `;

    button.addEventListener('click', function() {
      showCustomizationModal();
    });

    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCookieConsent();
      setTimeout(addCookiePreferencesButton, 1000);
    });
  } else {
    initCookieConsent();
    setTimeout(addCookiePreferencesButton, 1000);
  }
})();

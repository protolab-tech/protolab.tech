// GDPR/CCPA Compliant Cookie Management System
(function() {
  'use strict';
  
  // Cookie utility functions
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
    },
    delete: function(name) {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    }
  };

  // Check if user is in EU/UK (basic check, in production use a more robust solution)
  var requiresConsent = true; // Set to true for EU/UK visitors, could be dynamic

  // Initialize cookie consent
  function initCookieConsent() {
    if (!requiresConsent) {
      loadAnalytics();
      return;
    }

    var existingConsent = cookieUtils.get('protolab_cookie_consent');
    
    if (existingConsent === 'accepted' || existingConsent === 'customized') {
      loadAnalytics();
      return;
    }
    
    if (existingConsent === 'rejected') {
      return; // Don't show banner again
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
        background: rgba(17, 17, 17, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #fafafa;
        padding: 20px;
        z-index: 10000;
        border-top: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 -8px 30px rgba(0,0,0,0.4);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      ">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 300px;">
            <p style="margin: 0; color: #a3a3a3;">
              We use cookies to improve your experience and analyze website traffic. 
              Your data helps us understand how our site is used.
              <a href="/policy.html" style="color: #60a5fa; text-decoration: none; font-weight: 500;" target="_blank" rel="noopener">
                Learn more about our cookie policy
              </a>
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="cookie-accept" style="
              background: #3b82f6;
              color: #fff;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-family: inherit;
              font-size: 14px;
              box-shadow: 0 0 20px rgba(59,130,246,0.4);
            ">Accept All</button>
            <button id="cookie-reject" style="
              background: rgba(255,255,255,0.03);
              color: #fafafa;
              border: 1px solid rgba(255,255,255,0.1);
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-family: inherit;
              font-size: 14px;
            ">Reject All</button>
            <button id="cookie-customize" style="
              background: transparent;
              color: #60a5fa;
              border: 1px solid rgba(96,165,250,0.4);
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-family: inherit;
              font-size: 14px;
            ">Customize</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Event listeners
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
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      ">
        <div style="
          background: #161616;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          color: #fafafa;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        ">
          <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700;">Cookie Preferences</h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #fafafa; font-size: 16px;">Essential Cookies</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #a3a3a3;">
              These cookies are necessary for the website to function and cannot be switched off.
            </p>
            <label style="display: flex; align-items: center; gap: 10px; color: #a3a3a3;">
              <input type="checkbox" checked disabled style="cursor: not-allowed; accent-color: #3b82f6;">
              <span>Always Active</span>
            </label>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; color: #fafafa; font-size: 16px;">Analytics Cookies</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #a3a3a3;">
              These cookies help us understand how visitors interact with our website by collecting anonymous information.
            </p>
            <label style="display: flex; align-items: center; gap: 10px; color: #a3a3a3;">
              <input type="checkbox" id="analytics-toggle" style="accent-color: #3b82f6;">
              <span>Google Analytics</span>
            </label>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="modal-cancel" style="
              background: rgba(255,255,255,0.03);
              color: #fafafa;
              border: 1px solid rgba(255,255,255,0.1);
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-family: inherit;
              font-size: 14px;
            ">Cancel</button>
            <button id="modal-save" style="
              background: #3b82f6;
              color: #fff;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-family: inherit;
              font-size: 14px;
              box-shadow: 0 0 20px rgba(59,130,246,0.4);
            ">Save Preferences</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Set current preferences
    var analyticsConsent = cookieUtils.get('protolab_analytics_consent');
    document.getElementById('analytics-toggle').checked = analyticsConsent === 'true';

    document.getElementById('modal-cancel').addEventListener('click', function() {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });

    document.getElementById('modal-save').addEventListener('click', function() {
      var analyticsEnabled = document.getElementById('analytics-toggle').checked;
      
      cookieUtils.set('protolab_cookie_consent', 'customized', 365);
      cookieUtils.set('protolab_analytics_consent', analyticsEnabled ? 'true' : 'false', 365);
      
      if (analyticsEnabled) {
        loadAnalytics();
      }
      
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      hideBanner();
    });

    // Close modal on backdrop click
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
    if (window.gtag || cookieUtils.get('protolab_analytics_consent') !== 'true') {
      return; // Avoid loading multiple times or if not consented
    }
    
    var gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-5B3MWGZ9SZ';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-5B3MWGZ9SZ', {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure'
    });
  }

  // Add cookie preference management button (for returning users)
  function addCookiePreferencesButton() {
    // Disable only for EvoSimGame for better UX
    if (window.location.pathname.includes('/EvoSimGame/')) {
      return;
    }
    
    // Only add if consent has been given before
    if (cookieUtils.get('protolab_cookie_consent')) {
      var button = document.createElement('button');
      button.innerHTML = 'Cookie Preferences';
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(17, 17, 17, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #fafafa;
        border: 1px solid rgba(255,255,255,0.1);
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 12px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      `;
      
      button.addEventListener('click', function() {
        showCustomizationModal();
      });
      
      document.body.appendChild(button);
    }
  }

  // Initialize when DOM is ready
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

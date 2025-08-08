(function() {
  // Load cookie consent stylesheet
  var ccCss = document.createElement('link');
  ccCss.rel = 'stylesheet';
  ccCss.href = 'https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css';
  document.head.appendChild(ccCss);

  // Load cookie consent script
  var ccScript = document.createElement('script');
  ccScript.src = 'https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js';
  ccScript.onload = initCookieConsent;
  document.head.appendChild(ccScript);

  function initCookieConsent() {
    window.cookieconsent.initialise({
      palette: {
        popup: { background: '#000' },
        button: { background: '#f1d600' }
      },
      type: 'opt-in',
      content: {
        message: 'This website uses cookies for analytics.',
        allow: 'Allow',
        deny: 'Decline',
        link: 'Policies',
        href: '/policy.html'
      },
      elements: {
        messagelink: '<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a></span>',
        dismiss: '<a aria-label="dismiss cookie message" tabindex="0" class="cc-btn cc-dismiss">{{allow}}</a>'
      },
      position: 'bottom-left',
      onInitialise: function(status) {
        if (status === cookieconsent.status.allow) {
          loadAnalytics();
        }
      },
      onStatusChange: function(status) {
        if (status === cookieconsent.status.allow) {
          loadAnalytics();
        }
      }
    });
  }

  function loadAnalytics() {
    if (window.gtag) return; // Avoid loading multiple times
    var gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-5B3MWGZ9SZ';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-5B3MWGZ9SZ');
  }
})();

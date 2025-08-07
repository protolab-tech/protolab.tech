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
        dismiss: 'Allow',
        deny: 'Decline',
        link: 'Learn more',
        href: '/Chosko/policy.html'
      },
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

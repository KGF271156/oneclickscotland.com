/* OneClick Scotland – shared header, footer and the rippling Saltire in every hero banner.
   Every page includes this script where the header should appear:
     <script src="js/layout.js"></script>        (pages in the main folder)
     <script src="../js/layout.js"></script>     (pages in /regions)
   and an empty <div id="site-footer"></div> where the footer goes.
   Change the menu or footer here once and every page updates. */
(function () {
  var me = document.currentScript;
  var src = (me && me.getAttribute('src')) || 'js/layout.js';
  var ROOT = src.replace(/js\/layout\.js.*$/, '');   // "" or "../"
  window.OCI_ROOT = ROOT;
  window.OCI_LANG = 'en';
  // Translation hook kept so the shared news/region scripts work unchanged. English only for now.
  window.OCI_T = function (s) {
    var out = s;
    for (var i = 1; i < arguments.length; i++) out = out.split('{' + (i - 1) + '}').join(arguments[i]);
    return out;
  };
  var T = window.OCI_T;

  var NAV = [
    ['regions/index.html', 'Council areas'], ['culture.html', 'Culture'], ['live-scotland.html', 'Live'],
    ['news.html', 'News'], ['clans.html', 'Clans & Tartan'], ['whisky.html', 'Whisky'],
    ['visit-scotland.html', 'Visit Scotland'], ['events.html', 'Events'], ['sport.html', 'Sport'],
    ['communities.html', 'Communities']
  ];
  var here = location.pathname.replace(/\/$/, '/index.html');
  function isActive(href) {
    if (href === 'regions/index.html') return /\/regions\//.test(here);
    if (href === 'news.html' && /news-region\.html$/.test(here)) return true;
    return here.slice(-href.length - 1) === '/' + href;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function links() {
    return NAV.map(function (n) {
      return '<a href="' + ROOT + n[0] + '"' + (isActive(n[0]) ? ' class="is-active" aria-current="page"' : '') + '>' + esc(n[1]) + '</a>';
    }).join('');
  }
  function headerHTML() {
    return '<header class="site-header">' +
      '<div class="header-row wrap">' +
      '<a href="' + ROOT + 'index.html" class="logo"><span class="mark"></span> OneClick Scotland</a>' +
      '<nav class="main-nav" aria-label="Main">' + links() + '</nav>' +
      '<div class="header-actions">' +
      '<a href="' + ROOT + 'index.html#join" class="btn btn-outline">Sign in</a>' +
      '<a href="' + ROOT + 'index.html#join" class="btn btn-primary">Create my Scotland</a>' +
      '</div>' +
      '<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav">&#9776;</button>' +
      '</div>' +
      '<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">' + links() + '</nav>' +
      '</header>';
  }
  function footerHTML() {
    return '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand"><a href="' + ROOT + 'index.html" class="logo"><span class="mark"></span> OneClick Scotland</a>' +
      '<p>A live digital window into every council area, town and community of Scotland, and the Scots abroad.</p></div>' +
      '<div><h5>Explore</h5><ul><li><a href="' + ROOT + 'regions/index.html">Council areas</a></li><li><a href="' + ROOT + 'news.html">News</a></li><li><a href="' + ROOT + 'live-scotland.html">Live Scotland</a></li></ul></div>' +
      '<div><h5>Scotland Abroad</h5><ul><li><a href="' + ROOT + 'culture.html">Culture</a></li><li><a href="' + ROOT + 'communities.html">Communities</a></li><li><a href="' + ROOT + 'events.html">Events</a></li></ul></div>' +
      '<div><h5>Discover</h5><ul><li><a href="' + ROOT + 'clans.html">Clans &amp; Tartan</a></li><li><a href="' + ROOT + 'whisky.html">Whisky</a></li><li><a href="' + ROOT + 'sport.html">Sport</a></li><li><a href="' + ROOT + 'visit-scotland.html">Visit Scotland</a></li></ul></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' OneClick Scotland · <a href="mailto:info@oneclickscotland.com">info@oneclickscotland.com</a></span>' +
      '<span><a href="#">Privacy</a> · <a href="#">Terms</a></span></div>' +
      '</div></footer>';
  }

  /* Rippling Saltire (blue with a white diagonal cross) in every hero banner. */
  function addFlags() {
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    [].forEach.call(document.querySelectorAll('.hero'), function (hero, i) {
      if (hero.querySelector('.hero-flag')) return;
      var id = 'ocf' + i;
      var wave = calm ? '' : '<animate attributeName="baseFrequency" dur="16s" values="0.003 0.010;0.005 0.014;0.003 0.010" repeatCount="indefinite"/>';
      var move = calm ? '' : '<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="300 0" dur="6s" repeatCount="indefinite"/>';
      hero.insertAdjacentHTML('afterbegin',
        '<div class="hero-flag" aria-hidden="true"><svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" focusable="false">' +
        '<defs><filter id="' + id + 'w" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="turbulence" baseFrequency="0.003 0.010" numOctaves="2" seed="4" result="t">' + wave + '</feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic" in2="t" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter>' +
        '<linearGradient id="' + id + 's" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0" spreadMethod="repeat">' + move +
        '<stop offset="0" stop-color="#000" stop-opacity="0.22"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></linearGradient></defs>' +
        '<g filter="url(#' + id + 'w)"><rect x="-80" y="-80" width="960" height="660" fill="#005EB8"/>' +
        '<path d="M-80 -80L880 580M880 -80L-80 580" stroke="#FFFFFF" stroke-width="104" fill="none"/>' +
        '<rect x="-80" y="-80" width="960" height="660" fill="url(#' + id + 's)"/></g>' +
        '</svg></div>');
    });
  }
  function mountFooter() {
    var slot = document.getElementById('site-footer');
    if (slot && !slot.firstChild) slot.outerHTML = footerHTML();
  }
  function wire() {
    var btn = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-nav');
    if (btn && menu && !btn.dataset.wired) {
      btn.dataset.wired = '1';
      btn.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  var s = document.currentScript;
  if (s) s.insertAdjacentHTML('beforebegin', headerHTML());
  wire();
  onReady(function () {
    mountFooter(); addFlags();
    // region and news pages draw their banner after load: give it the flag too
    new MutationObserver(function () { addFlags(); }).observe(document.body, { childList: true, subtree: true });
  });
})();

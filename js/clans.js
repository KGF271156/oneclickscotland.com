/* OneClick Scotland – interactive clan map (clans.html).
   Data: data/clans.json (clan, heartland, council area, map position). Base map: assets/scotland-map.svg. */
(function () {
  var mount = document.getElementById('clan-map');
  if (!mount) return;
  var FULL = '0 0 446 643';
  var NS = 'http://www.w3.org/2000/svg';
  var clans = [], groups = [], svg, dots = {}, current = null, group = '', query = '';
  var list = document.getElementById('clan-list'), card = document.getElementById('clan-card');
  var search = document.getElementById('clan-search'), chips = document.getElementById('clan-groups'), count = document.getElementById('clan-count');
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  Promise.all([
    fetch('data/clans.json').then(function (r) { return r.json(); }),
    fetch('assets/scotland-map.svg').then(function (r) { return r.text(); })
  ]).then(function (res) {
    clans = res[0].clans; groups = res[0].groups;
    var doc = new DOMParser().parseFromString(res[1], 'image/svg+xml');
    var src = doc.documentElement;
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', FULL); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Map of Scotland showing the heartland of each clan');
    [].forEach.call(src.querySelectorAll('path'), function (p) {
      var c = document.createElementNS(NS, 'path');
      c.setAttribute('d', p.getAttribute('d')); c.setAttribute('class', 'clan-land');
      svg.appendChild(c);
    });
    var g = document.createElementNS(NS, 'g'); svg.appendChild(g);
    clans.forEach(function (c) {
      var d = document.createElementNS(NS, 'circle');
      d.setAttribute('cx', c.x); d.setAttribute('cy', c.y); d.setAttribute('r', 3.4);
      d.setAttribute('class', 'clan-dot'); d.setAttribute('tabindex', '0'); d.setAttribute('role', 'button');
      d.setAttribute('aria-label', c.name + ', ' + c.seat);
      var t = document.createElementNS(NS, 'title'); t.textContent = c.name; d.appendChild(t);
      d.addEventListener('click', function () { select(c.id, false); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(c.id, false); } });
      g.appendChild(d); dots[c.id] = d;
    });
    mount.appendChild(svg);
    chips.innerHTML = '<button type="button" class="chip is-on" data-g="">All Scotland</button>' +
      groups.map(function (n) { return '<button type="button" class="chip" data-g="' + esc(n) + '">' + esc(n) + '</button>'; }).join('');
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      group = b.getAttribute('data-g');
      [].forEach.call(chips.children, function (x) { x.classList.toggle('is-on', x === b); });
      render(); zoom();
    });
    search.addEventListener('input', function () { query = search.value.trim().toLowerCase(); render(); });
    list.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) select(b.getAttribute('data-id'), true); });
    render();
    var h = decodeURIComponent((location.hash || '').slice(1));
    if (h) select(h, true);
  });

  function visible(c) {
    return (!group || c.group === group) && (!query || c.name.toLowerCase().indexOf(query) >= 0 || c.seat.toLowerCase().indexOf(query) >= 0 || c.area_name.toLowerCase().indexOf(query) >= 0);
  }
  function render() {
    var n = 0;
    list.innerHTML = clans.filter(visible).sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (c) {
      n++; return '<li><button type="button" data-id="' + c.id + '"' + (current === c.id ? ' class="is-on"' : '') + '>' + esc(c.name) + '<span>' + esc(c.area_name) + '</span></button></li>';
    }).join('') || '<li class="empty-note">No clan matches that search.</li>';
    count.textContent = n + ' of ' + clans.length + ' clans';
    clans.forEach(function (c) { dots[c.id].classList.toggle('is-dim', !visible(c)); });
  }
  function zoom() {
    var sel = clans.filter(function (c) { return !group || c.group === group; });
    if (!group || !sel.length) { svg.setAttribute('viewBox', FULL); return; }
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    sel.forEach(function (c) { x0 = Math.min(x0, c.x); x1 = Math.max(x1, c.x); y0 = Math.min(y0, c.y); y1 = Math.max(y1, c.y); });
    var pad = 36, w = Math.max(x1 - x0 + 2 * pad, 160), h = Math.max(y1 - y0 + 2 * pad, 160);
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = 446 / 643;
    if (w / h > r) h = w / r; else w = h * r;
    svg.setAttribute('viewBox', (cx - w / 2).toFixed(0) + ' ' + (cy - h / 2).toFixed(0) + ' ' + w.toFixed(0) + ' ' + h.toFixed(0));
    var scale = w / 446; // keep dots a steady on-screen size
    clans.forEach(function (c) { dots[c.id].setAttribute('r', (3.4 * scale).toFixed(2)); });
  }
  function select(id, scroll) {
    var c = clans.filter(function (x) { return x.id === id; })[0]; if (!c) return;
    if (current && dots[current]) dots[current].classList.remove('is-on');
    current = id; dots[id].classList.add('is-on'); dots[id].parentNode.appendChild(dots[id]);
    history.replaceState(null, '', '#' + encodeURIComponent(id));
    card.innerHTML =
      '<div class="eyebrow">' + esc(c.group) + '</div><h3>Clan ' + esc(c.name.replace(/^Clan /, '')) + '</h3>' +
      '<p><strong>Traditional heartland:</strong> ' + esc(c.seat) + '.<br><strong>Today\'s council area:</strong> <a href="regions/' + c.area + '.html">' + esc(c.area_name) + '</a></p>' +
      '<div class="btn-row"><a class="btn btn--primary" target="_blank" rel="noopener" href="https://en.wikipedia.org/w/index.php?search=' + encodeURIComponent('Clan ' + c.name.replace(/\s*\(.*\)/, '').replace(/^Clan /, '')) + '">Septs, tartans &amp; history</a>' +
      '<a class="btn btn--outline" target="_blank" rel="noopener" href="https://www.tartanregister.gov.uk/">Scottish Register of Tartans</a></div>';
    render();
    if (scroll) { var on = list.querySelector('.is-on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' }); }
  }
})();

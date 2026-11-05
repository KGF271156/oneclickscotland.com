/* OneClickScotland — interactive region map
   Loads assets/scotland-map.svg into any element with id="scotland-map-mount",
   wires up hover tooltips and click-through to /regions/<slug>.html
   Map data: 32 council areas
*/
const SCOTLAND_REGIONS = [
  { slug: "aberdeen-city", name: "Aberdeen" },
  { slug: "aberdeenshire", name: "Aberdeenshire" },
  { slug: "angus", name: "Angus" },
  { slug: "argyll-bute", name: "Argyll & Bute" },
  { slug: "city-of-edinburgh", name: "City of Edinburgh" },
  { slug: "clackmannanshire", name: "Clackmannanshire" },
  { slug: "dumfries-galloway", name: "Dumfries & Galloway" },
  { slug: "dundee-city", name: "Dundee" },
  { slug: "east-ayrshire", name: "East Ayrshire" },
  { slug: "east-dunbartonshire", name: "East Dunbartonshire" },
  { slug: "east-lothian", name: "East Lothian" },
  { slug: "east-renfrewshire", name: "East Renfrewshire" },
  { slug: "falkirk", name: "Falkirk" },
  { slug: "fife", name: "Fife" },
  { slug: "glasgow-city", name: "Glasgow" },
  { slug: "highland", name: "Highland" },
  { slug: "inverclyde", name: "Inverclyde" },
  { slug: "midlothian", name: "Midlothian" },
  { slug: "moray", name: "Moray" },
  { slug: "north-ayrshire", name: "North Ayrshire" },
  { slug: "north-lanarkshire", name: "North Lanarkshire" },
  { slug: "orkney-islands", name: "Orkney" },
  { slug: "eilean-siar", name: "Outer Hebrides" },
  { slug: "perth-kinross", name: "Perth & Kinross" },
  { slug: "renfrewshire", name: "Renfrewshire" },
  { slug: "scottish-borders", name: "Scottish Borders" },
  { slug: "shetland-islands", name: "Shetland" },
  { slug: "south-ayrshire", name: "South Ayrshire" },
  { slug: "south-lanarkshire", name: "South Lanarkshire" },
  { slug: "stirling", name: "Stirling" },
  { slug: "west-dunbartonshire", name: "West Dunbartonshire" },
  { slug: "west-lothian", name: "West Lothian" }
];

function regionHref(slug) {
  // From the homepage (root) the link is regions/<slug>.html
  // From inside /regions/ it should just be <slug>.html — handled via data-map-base on the mount element.
  // Note: an empty string is a valid, meaningful base (means "same folder"), so we
  // check whether the attribute was set at all rather than using `||`, which would
  // treat "" as missing and wrongly fall back to 'regions/'.
  const mount = document.getElementById('scotland-map-mount');
  const base = (mount && mount.dataset.mapBase !== undefined) ? mount.dataset.mapBase : 'regions/';
  return base + slug + '.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('scotland-map-mount');
  if (!mount) return;

  fetch(mount.dataset.mapSrc || 'assets/scotland-map.svg')
    .then(res => res.text())
    .then(svgText => {
      mount.innerHTML =
        '<div class="region-map-holder">' +
          '<div class="region-map-wrap">' + svgText + '</div>' +
          '<div class="region-tooltip" id="region-tooltip"></div>' +
        '</div>';

      const svg = mount.querySelector('svg');
      const tooltip = mount.querySelector('#region-tooltip');
      const holder = mount.querySelector('.region-map-holder');
      if (!svg) return;

      svg.querySelectorAll('path[id]').forEach(path => {
        const slug = path.getAttribute('id');
        const region = SCOTLAND_REGIONS.find(r => r.slug === slug);
        const rawLabel = region ? region.name : path.getAttribute('aria-label') || slug;
        const label = window.OCI_T ? window.OCI_T(rawLabel) : rawLabel;

        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'link');
        path.setAttribute('aria-label', label);

        path.addEventListener('mouseenter', (e) => {
          tooltip.textContent = label;
          tooltip.classList.add('is-visible');
        });
        path.addEventListener('mousemove', (e) => {
          const rect = holder.getBoundingClientRect();
          tooltip.style.left = (e.clientX - rect.left) + 'px';
          tooltip.style.top = (e.clientY - rect.top) + 'px';
        });
        path.addEventListener('mouseleave', () => {
          tooltip.classList.remove('is-visible');
        });
        path.addEventListener('click', () => {
          window.location.href = regionHref(slug);
        });
        path.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = regionHref(slug);
          }
        });
      });
    })
    .catch(() => {
      const base = (mount.dataset.mapBase !== undefined) ? mount.dataset.mapBase : 'regions/';
      const listHref = base === '' ? 'index.html' : base + 'index.html';
      mount.innerHTML = '<p style="color:var(--ink-soft);">Map unavailable right now — browse the <a href="' + listHref + '" style="color:var(--terracotta);font-weight:600;">full regions list</a> instead.</p>';
    });
});

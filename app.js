/* =====================================================================
   Dax Lancon Racing 605 — LO206 Team Hub  ·  app.js
   Rendering, navigation, calculators, and on-device track log.
   ===================================================================== */
'use strict';

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
const num = v => { const n = parseFloat(v); return isFinite(n) ? n : null; };
const fmt = (n, d = 2) => (n == null || !isFinite(n)) ? '—' : (Math.round(n * 10 ** d) / 10 ** d).toLocaleString();

/* =====================================================================
   NAVIGATION
   ===================================================================== */
function showView(id) {
  $$('.view').forEach(v => v.classList.toggle('active', v.id === id));
  $$('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.view === id));
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
function go(view) { showView(view); }

/* =====================================================================
   HOME — topic cards
   ===================================================================== */
function guideCard(t) {
  const card = el('button', 'card');
  card.innerHTML = `
    <span class="ic">${t.icon}</span>
    <span>
      <span class="tag">${t.tag}</span>
      <h3>${t.title}</h3>
      <p>${t.summary}</p>
    </span>`;
  card.addEventListener('click', () => openArticle(t.id));
  return card;
}
function guideCats() {
  const byId = Object.fromEntries(TOPICS.map(t => [t.id, t]));
  const listed = new Set((typeof CATEGORIES !== 'undefined' ? CATEGORIES : []).flatMap(c => c.ids));
  const cats = (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []).map(c => ({ ...c, items: c.ids.map(id => byId[id]).filter(Boolean) }));
  const extras = TOPICS.filter(t => !listed.has(t.id));
  if (extras.length) cats.push({ key: 'more', label: 'More', items: extras });
  return cats.filter(c => c.items.length);
}
function catTile(c) {
  const tile = el('button', 'cat-tile');
  tile.innerHTML = `
    <span class="cat-ic">${c.icon || ''}</span>
    <span class="cat-name">${c.label}</span>
    <span class="cat-count">${c.items.length} guide${c.items.length > 1 ? 's' : ''}</span>`;
  tile.addEventListener('click', () => openCategory(c.key));
  return tile;
}
// Roll categories up into their groups (with a "More" fallback)
function groupData() {
  const cats = guideCats();
  const byKey = Object.fromEntries(cats.map(c => [c.key, c]));
  const placed = new Set();
  const groups = (typeof GROUPS !== 'undefined' ? GROUPS : []).map(g => {
    const items = g.cats.map(k => byKey[k]).filter(Boolean);
    items.forEach(c => placed.add(c.key));
    return { ...g, items, count: items.reduce((n, c) => n + c.items.length, 0) };
  }).filter(g => g.items.length);
  const rest = cats.filter(c => !placed.has(c.key));
  if (rest.length) groups.push({ key: 'more', label: 'More', icon: '', items: rest, count: rest.reduce((n, c) => n + c.items.length, 0) });
  return groups;
}
function groupOfCat(key) { return (typeof GROUPS !== 'undefined' ? GROUPS : []).find(g => g.cats.includes(key)); }
// Level 1 — group tiles
function renderHome() {
  const wrap = $('#cat-grid'); if (!wrap) return;
  const grid = el('div', 'cat-grid');
  groupData().forEach(g => {
    const catList = g.items.map(c => c.label).join(' · ');
    const tile = el('button', 'cat-tile group-tile');
    tile.innerHTML = `
      <span class="cat-ic">${g.icon || ''}</span>
      <span class="cat-name">${g.label}</span>
      <span class="cat-cats">(${catList})</span>
      <span class="cat-count">${g.count} guide${g.count > 1 ? 's' : ''}</span>`;
    tile.addEventListener('click', () => openGroup(g.key));
    grid.appendChild(tile);
  });
  wrap.innerHTML = ''; wrap.appendChild(grid);
}
// Level 2 — a group's category tiles
function openGroup(key) {
  const g = groupData().find(x => x.key === key); if (!g) return;
  const v = $('#view-group');
  v.innerHTML = `<button class="back" onclick="go('view-guides')">‹ All</button>
    <div class="cat-title"><span class="cat-ic sm">${g.icon || ''}</span><h1>${g.label}</h1></div>
    <div class="cat-grid" id="group-cat-grid"></div>`;
  const grid = $('#group-cat-grid');
  g.items.forEach(c => grid.appendChild(catTile(c)));
  showView('view-group');
}
// Category page = the guides inside one category
function openCategory(key) {
  const c = guideCats().find(x => x.key === key); if (!c) return;
  const parent = groupOfCat(key);
  const back = parent ? `onclick="openGroup('${parent.key}')">‹ ${parent.label}` : `onclick="go('view-guides')">‹ All`;
  const v = $('#view-guide-cat');
  v.innerHTML = `<button class="back" ${back}</button>
    <div class="cat-title"><span class="cat-ic sm">${c.icon || ''}</span><h1>${c.label}</h1></div>
    <div class="grid" id="cat-guide-grid"></div>`;
  const g = $('#cat-guide-grid');
  c.items.forEach(t => g.appendChild(guideCard(t)));
  showView('view-guide-cat');
}

/* =====================================================================
   ARTICLE renderer (from content.js block shapes)
   ===================================================================== */
function blockToHTML(b) {
  if (b.h) return `<h2>${b.h}</h2>`;
  if (b.p) return `<p>${b.p}</p>`;
  if (b.list) return `<ul>${b.list.map(i => `<li>${i}</li>`).join('')}</ul>`;
  if (b.steps) return `<ol>${b.steps.map(i => `<li>${i}</li>`).join('')}</ol>`;
  if (b.warn) return `<div class="box warn">${b.warn}</div>`;
  if (b.tip) return `<div class="box tip">${b.tip}</div>`;
  if (b.note) return `<div class="box note">${b.note}</div>`;
  if (b.diagram) return `<div class="diagram">${DIAGRAMS[b.diagram] || ''}</div>`;
  if (b.img) {
    const cap = b.caption ? `<figcaption>${b.caption}</figcaption>` : '';
    const alt = (b.alt || b.caption || 'kart photo').replace(/"/g, '&quot;');
    return `<figure class="photo">
      <img src="${b.img}" alt="${alt}" loading="lazy" onerror="this.closest('.photo').classList.add('missing')">
      <div class="ph"><span class="cam">📷</span><b>PHOTO TO ADD</b><code>${b.img}</code>${b.caption ? `<span>${b.caption}</span>` : ''}</div>
      ${cap}
    </figure>`;
  }
  if (b.table) {
    const head = `<tr>${b.table.head.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const rows = b.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
    return `<div class="table-wrap"><table>${head}${rows}</table></div>`;
  }
  return '';
}
function openArticle(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  const v = $('#view-article');
  v.innerHTML =
    `<button class="back" onclick="go('view-guides')">‹ All guides</button>
     <div class="article">
       <span class="tag">${t.tag}</span>
       <h1>${t.title}</h1>
       ${t.sections.map(blockToHTML).join('')}
       <p class="footer-note">Have edits or want this expanded? It\'s your team\'s app — tell Claude what to change.</p>
     </div>`;
  showView('view-article');
}

/* =====================================================================
   TRACKS — layouts, info, and the Log dropdown source
   ===================================================================== */
const TRACK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l6-3 4 3 6-3v15l-6 3-4-3-6 3z"/><path d="M10 3v15M14 6v15"/></svg>';

function renderTracks() {
  const grid = $('#track-grid');
  if (!grid || typeof TRACKS === 'undefined') return;
  grid.innerHTML = '';
  TRACKS.forEach(t => {
    const l0 = (t.layouts && t.layouts[0]) || {};
    const sub = [
      l0.length && l0.length !== '—' ? l0.length : null,
      l0.turns ? l0.turns + ' turns' : null,
      (t.layouts && t.layouts.length > 1) ? t.layouts.length + ' layouts' : null
    ].filter(Boolean).join(' · ') || t.surface || '';
    const card = el('button', 'card');
    card.innerHTML = `
      <span class="ic">${TRACK_ICON}</span>
      <span>
        <span class="tag">${escapeHTML(t.city)}</span>
        <h3>${escapeHTML(t.name)}</h3>
        <p>${sub}</p>
      </span>`;
    card.addEventListener('click', () => openTrack(t.id));
    grid.appendChild(card);
  });
}
// Accurate track outline drawn from real GPS geometry (traced from OpenStreetMap, ODbL).
// `d` is a space-separated "x,y" point list in a 600x380 space.
function trackOutlineSVG(d, closed) {
  const raw = d.trim().split(/\s+/);
  const path = 'M' + raw.map(p => p.replace(',', ' ')).join(' L') + (closed ? ' Z' : '');
  return `<svg viewBox="0 0 600 380" class="tracksvg" role="img" aria-label="track outline from OpenStreetMap">
    <path d="${path}" fill="none" stroke="#2c2838" stroke-width="19" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="#c6f53c" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="#0e0d13" stroke-width="1.4" stroke-dasharray="3 8" stroke-linejoin="round"/>
  </svg>`;
}
function trackMapHTML(t) {
  return `<figure class="photo trackmap">
    <img src="${t.map}" alt="${escapeHTML(t.name)} official layout" loading="lazy" onerror="this.closest('.photo').classList.add('missing')">
    <div class="ph"><span class="cam">🗺️</span><b>OFFICIAL MAP — add image</b><code>${t.map}</code><span>Drop the ${escapeHTML(t.name)} official layout here</span></div>
  </figure>`;
}
function openTrack(id) {
  const t = TRACKS.find(x => x.id === id);
  if (!t) return;
  const info = [];
  if (t.address) info.push(`<tr><td>Address</td><td>${escapeHTML(t.address)}</td></tr>`);
  if (t.surface) info.push(`<tr><td>Surface</td><td>${escapeHTML(t.surface)}</td></tr>`);
  (t.layouts || []).forEach(lo => {
    const bits = [
      lo.length && lo.length !== '—' ? lo.length : null,
      lo.turns ? lo.turns + ' turns' : null,
      lo.features
    ].filter(Boolean).join(' · ');
    info.push(`<tr><td>${escapeHTML(lo.name)}</td><td>${bits || '—'}</td></tr>`);
  });
  const outlineHTML = t.path
    ? `<div class="diagram">${trackOutlineSVG(t.path, t.closed)}</div>
       <p class="schematic-note">Outline traced from real GPS data (© OpenStreetMap contributors, ODbL). Shape is accurate; for start/finish, turn numbers and segment lengths use the official map below.</p>`
    : `<p class="schematic-note">No GPS outline for this one yet — add the official map below.</p>`;
  const configsHTML = (t.configs && t.configs.length)
    ? `<h2>Configurations</h2><ul>${t.configs.map(c => `<li>${escapeHTML(c)}</li>`).join('')}</ul>` : '';
  $('#view-track-detail').innerHTML =
    `<button class="back" onclick="go('view-tracks')">‹ All tracks</button>
     <div class="article">
       <span class="tag">${escapeHTML(t.city)}</span>
       <h1>${escapeHTML(t.name)}</h1>
       <h2>Layout</h2>
       ${outlineHTML}
       <div class="table-wrap"><table>${info.join('')}</table></div>
       ${configsHTML}
       <h2>Official map</h2>
       ${trackMapHTML(t)}
       ${t.notes ? `<p>${t.notes}</p>` : ''}
       ${t.url ? `<p><a href="${t.url}" target="_blank" rel="noopener">Official site ↗</a></p>` : ''}
     </div>`;
  showView('view-track-detail');
}
function trackOptions(sel) {
  return '<option value="">— select a track —</option>'
    + (typeof TRACKS === 'undefined' ? '' : TRACKS.map(t => `<option value="${escapeHTML(t.name)}"${sel === t.name ? ' selected' : ''}>${escapeHTML(t.name)}</option>`).join(''))
    + `<option value="__other"${sel === '__other' ? ' selected' : ''}>Other / type it in…</option>`;
}
function populateTrackSelect() {
  $$('select[data-tracksel]').forEach(s => { s.innerHTML = trackOptions(); });
}
// Resolve a track <select> (+ its sibling "other" text field) to a track name.
function trackValue(sel) {
  if (!sel) return '';
  if (sel.value === '__other') {
    const other = sel.closest('form') && sel.closest('form').querySelector('.track-other input');
    return other ? other.value.trim() : '';
  }
  return sel.value;
}
function onTrackSelect(sel) {
  const form = sel.closest('form'); if (!form) return;
  const other = form.querySelector('.track-other');
  if (other) other.style.display = sel.value === '__other' ? 'flex' : 'none';
}

/* =====================================================================
   CALCULATORS
   ===================================================================== */
// Gear ratio = driven (axle) / driver (engine)
function calcGear() {
  const driver = num($('#gr-driver').value);   // engine clutch sprocket teeth
  const driven = num($('#gr-driven').value);   // axle sprocket teeth
  const out = $('#gr-out');
  if (!driver || !driven) { out.innerHTML = ratioResult(null); return; }
  out.innerHTML = ratioResult(driven / driver, driver, driven);
}
function ratioResult(ratio, driver, driven) {
  if (ratio == null) return `<div class="big">—</div><div class="lbl">Gear ratio</div><div class="sub">Enter both sprocket sizes.</div>`;
  return `<div class="big">${fmt(ratio, 3)} : 1</div><div class="lbl">Gear ratio (driven ÷ driver)</div>
    <div class="sub">${driven}T axle ÷ ${driver}T engine. Higher number = more acceleration, lower top speed.</div>`;
}

// Speed / RPM from gearing
// axle rpm = engine rpm / ratio ; speed = axle rpm * rollout(in) ; mph = in/min*60/63360
function calcSpeed() {
  const rpm = num($('#sp-rpm').value);
  const driver = num($('#sp-driver').value);
  const driven = num($('#sp-driven').value);
  const rollIn = getRollout();  // inches
  const out = $('#sp-out');
  if (!rpm || !driver || !driven || !rollIn) {
    out.innerHTML = `<div class="big">—</div><div class="lbl">Estimated speed</div><div class="sub">Fill in RPM, both sprockets, and tire size.</div>`;
    return;
  }
  const ratio = driven / driver;
  const axleRpm = rpm / ratio;
  const inchesPerMin = axleRpm * rollIn;
  const mph = inchesPerMin * 60 / 63360;
  const kph = mph * 1.609344;
  out.innerHTML = `<div class="big">${fmt(mph, 1)} mph</div><div class="lbl">Estimated top speed @ ${fmt(rpm,0)} rpm</div>
    <div class="sub">${fmt(kph,1)} km/h · gear ${fmt(ratio,3)}:1 · axle ${fmt(axleRpm,0)} rpm · rollout ${fmt(rollIn,2)}″<br>
    <i>Theoretical, no slip/drag — use for comparing changes, not exact speed.</i></div>`;
}
function getRollout() {
  const mode = $('#sp-tiremode').value;
  if (mode === 'circ') return num($('#sp-circ').value);            // inches
  const dia = num($('#sp-dia').value);                            // inches
  return dia ? dia * Math.PI : null;
}
function syncTireMode() {
  const mode = $('#sp-tiremode').value;
  $('#sp-circ-field').style.display = mode === 'circ' ? 'flex' : 'none';
  $('#sp-dia-field').style.display = mode === 'dia' ? 'flex' : 'none';
  calcSpeed();
}

// Gear change compare + nearby-teeth chart
function speedFrom(rpm, ratio, roll) { return (rpm / ratio) * roll * 60 / 63360; } // mph
function calcGearChart() {
  const driver = num($('#gc-driver').value);
  const driven = num($('#gc-driven').value);
  const rpm = num($('#gc-rpm').value);
  const roll = num($('#gc-roll').value);
  const out = $('#gc-out');
  if (!driver || !driven) {
    out.innerHTML = `<div class="result"><div class="lbl">Enter driver &amp; current driven teeth to build the chart.</div></div>`;
    return;
  }
  const curRatio = driven / driver;
  const hasSpeed = rpm && roll;
  const curSpeed = hasSpeed ? speedFrom(rpm, curRatio, roll) : null;

  // summary
  let html = `<div class="result">
    <div class="big">${fmt(curRatio, 3)} : 1</div>
    <div class="lbl">Current gear · ${driven}T ÷ ${driver}T</div>
    <div class="sub">${hasSpeed ? `≈ ${fmt(curSpeed, 1)} mph @ ${fmt(rpm, 0)} rpm · ` : ''}One tooth on the axle ≈ ${fmt(100 / driven, 1)}% ratio change. More driven teeth = more acceleration, lower top speed.</div>
  </div>`;

  // chart: driven-4 .. driven+4
  const head = `<tr><th>Driven</th><th>Ratio</th>${hasSpeed ? '<th>Speed</th><th>Δ mph</th>' : ''}<th>Effect</th></tr>`;
  let rows = '';
  for (let d = driven - 4; d <= driven + 4; d++) {
    if (d < 1) continue;
    const r = d / driver;
    const isCur = d === driven;
    const sp = hasSpeed ? speedFrom(rpm, r, roll) : null;
    const dMph = hasSpeed ? sp - curSpeed : null;
    const effect = d === driven ? '— current —' : (d > driven ? 'more accel, less top' : 'more top, less accel');
    const style = isCur ? ' style="background:rgba(224,182,79,.16)"' : '';
    rows += `<tr${style}>
      <td><b>${d}T</b></td>
      <td>${fmt(r, 3)}:1</td>
      ${hasSpeed ? `<td>${fmt(sp, 1)}</td><td>${dMph > 0 ? '+' : ''}${fmt(dMph, 1)}</td>` : ''}
      <td style="font-weight:400;color:var(--muted)">${effect}</td>
    </tr>`;
  }
  html += `<div class="table-wrap" style="margin-top:12px"><table>${head}${rows}</table></div>`;
  out.innerHTML = html;
}

// Weight & ballast
function calcBallast() {
  const min = num($('#wb-min').value);
  const kart = num($('#wb-kart').value);
  const driver = num($('#wb-driver').value);
  const each = num($('#wb-each').value);
  const out = $('#wb-out');
  if (min == null || kart == null || driver == null) {
    out.innerHTML = `<div class="big">—</div><div class="lbl">Ballast needed</div><div class="sub">Enter class minimum, kart weight, and driver weight.</div>`;
    return;
  }
  const total = kart + driver;
  const diff = min - total;
  if (diff <= 0) {
    out.innerHTML = `<div class="big" style="color:var(--green)">${fmt(Math.abs(diff),1)} lb over</div>
      <div class="lbl">Already at weight</div>
      <div class="sub">Kart + driver = ${fmt(total,1)} lb vs ${fmt(min,1)} lb minimum. No ballast needed${diff<0?` (you\'re ${fmt(Math.abs(diff),1)} lb over minimum)`:''}.</div>`;
    return;
  }
  const plates = each ? Math.ceil(diff / each) : null;
  out.innerHTML = `<div class="big">${fmt(diff,1)} lb</div><div class="lbl">Ballast to add</div>
    <div class="sub">Kart + driver = ${fmt(total,1)} lb; class minimum ${fmt(min,1)} lb.${plates!=null?` ≈ <b>${plates}</b> × ${fmt(each,1)} lb weight${plates>1?'s':''}.`:''}</div>`;
}

/* =====================================================================
   RACE LOG — events + training sessions (localStorage, on-device)
   ===================================================================== */
const LOG_KEY = 'dlr_log_v2';
const OLD_LOG_KEY = 'tis_race_log_v1';
function loadLog() {
  try {
    let arr = JSON.parse(localStorage.getItem(LOG_KEY) || 'null');
    if (!arr) {
      const old = JSON.parse(localStorage.getItem(OLD_LOG_KEY) || '[]');
      arr = old.map(o => ({
        id: o.id, kind: 'session', date: o.date, track: o.track,
        driver: o.driver, driven: o.driven,
        tcold: [o.fp, o.rp].filter(Boolean).join(' / '),
        lash: [o.li, o.le].filter(Boolean).join(' / '),
        lap: o.lap, notes: o.notes
      }));
      if (arr.length) saveLog(arr);
    }
    return arr || [];
  } catch { return []; }
}
const saveLog = arr => localStorage.setItem(LOG_KEY, JSON.stringify(arr));
const gv = id => { const n = $(id); return n ? n.value.trim() : ''; };
const today = () => new Date().toISOString().slice(0, 10);
function ratioText(g) { const m = (g || '').split('/').map(x => parseFloat(x)); return (m[0] && m[1]) ? ` (${fmt(m[1] / m[0], 2)}:1)` : ''; }
function showRatio(p) { const d = num(gv('#' + p + '-driver')), n = num(gv('#' + p + '-driven')); const o = $('#' + p + '-ratio'); if (o) o.innerHTML = (d && n) ? `Ratio <b>${fmt(n / d, 3)}:1</b>` : ''; }

function setLogMode(mode) {
  $('#seg-session').classList.toggle('active', mode === 'session');
  $('#seg-event').classList.toggle('active', mode === 'event');
  $('#form-session').style.display = mode === 'session' ? 'block' : 'none';
  $('#form-event').style.display = mode === 'event' ? 'block' : 'none';
}

function saveSession(e) {
  e.preventDefault();
  const entry = {
    id: Date.now(), kind: 'session',
    date: gv('#s-date') || today(), track: trackValue($('#s-track')) || 'Untitled',
    focus: gv('#s-focus'), driver: gv('#s-driver'), driven: gv('#s-driven'),
    atemp: gv('#s-atemp'), ttemp: gv('#s-ttemp'), weather: gv('#s-weather'),
    tcold: gv('#s-tcold'), thot: gv('#s-thot'), lash: gv('#s-lash'), spring: gv('#s-spring'),
    eng: gv('#s-eng'), eos: gv('#s-eos'), cht: gv('#s-cht'),
    lap: gv('#s-lap'), changed: gv('#s-changed'), notes: gv('#s-notes')
  };
  const log = loadLog(); log.unshift(entry); saveLog(log);
  $('#session-form').reset(); $$('#form-session .track-other').forEach(x => x.style.display = 'none'); showRatio('s');
  renderLog(); openLogEntry(entry.id);
}
function saveEvent(e) {
  e.preventDefault();
  const entry = {
    id: Date.now(), kind: 'event', name: gv('#e-name') || 'Untitled event',
    track: trackValue($('#e-track')), cls: gv('#e-class'), start: gv('#e-start'), end: gv('#e-end'),
    driverName: gv('#e-driver-name'), engine: gv('#e-engine'), tireset: gv('#e-tireset'),
    gear: gv('#e-gear'), tcold: gv('#e-tcold'), lash: gv('#e-lash'), spring: gv('#e-spring'), eng: gv('#e-eng'),
    notes: gv('#e-notes'), sessions: []
  };
  const log = loadLog(); log.unshift(entry); saveLog(log);
  $('#event-form').reset(); $$('#form-event .track-other').forEach(x => x.style.display = 'none');
  renderLog(); openLogEntry(entry.id);
}
function deleteEntry(id) { saveLog(loadLog().filter(e => e.id !== id)); renderLog(); go('view-log'); }
function addEventSession(eventId, e) {
  e.preventDefault();
  const log = loadLog(); const ev = log.find(x => x.id === eventId); if (!ev) return;
  ev.sessions = ev.sessions || [];
  ev.sessions.push({ id: Date.now(), type: gv('#as-type'), date: gv('#as-date'), lap: gv('#as-lap'), result: gv('#as-result'), gear: gv('#as-gear'), tires: gv('#as-tires'), changed: gv('#as-changed'), notes: gv('#as-notes') });
  saveLog(log); openLogEntry(eventId);
}
function deleteEventSession(eventId, sid) {
  const log = loadLog(); const ev = log.find(x => x.id === eventId); if (!ev) return;
  ev.sessions = (ev.sessions || []).filter(s => s.id !== sid); saveLog(log); openLogEntry(eventId);
}

function renderLog() {
  const wrap = $('#log-list'); const log = loadLog();
  if (!log.length) { wrap.innerHTML = `<div class="empty">Nothing logged yet.<br>Log a training session or create an event above.</div>`; return; }
  wrap.innerHTML = '';
  log.forEach(e => {
    const card = el('button', 'log-entry');
    card.style.width = '100%'; card.style.textAlign = 'left'; card.style.cursor = 'pointer';
    if (e.kind === 'event') {
      const days = [e.start, e.end].filter(Boolean).join(' – ');
      card.innerHTML = `<div class="top"><span class="trk">🏁 ${escapeHTML(e.name)}</span><span class="dt">${days}</span></div>
        <div class="meta"><span class="chip">${escapeHTML(e.track || '—')}</span>${e.cls ? `<span class="chip">${escapeHTML(e.cls)}</span>` : ''}<span class="chip">${(e.sessions || []).length} sessions</span></div>`;
    } else {
      const chips = [];
      if (e.driver || e.driven) chips.push(`<span class="chip">Gear <b>${e.driver || '?'}/${e.driven || '?'}</b></span>`);
      if (e.tcold) chips.push(`<span class="chip">Tires <b>${escapeHTML(e.tcold)}</b></span>`);
      if (e.lap) chips.push(`<span class="chip">Best <b>${escapeHTML(e.lap)}</b></span>`);
      card.innerHTML = `<div class="top"><span class="trk">${escapeHTML(e.track)}</span><span class="dt">${e.date || ''}</span></div>
        <div class="meta">${chips.join('')}</div>${e.focus ? `<div class="notes">${escapeHTML(e.focus)}</div>` : ''}`;
    }
    card.addEventListener('click', () => openLogEntry(e.id));
    wrap.appendChild(card);
  });
}
function lrow(label, val) { return val ? `<tr><td>${label}</td><td>${escapeHTML(val)}</td></tr>` : ''; }
function openLogEntry(id) {
  const e = loadLog().find(x => x.id === id); if (!e) return;
  const v = $('#view-log-detail');
  if (e.kind === 'event') {
    const info = [lrow('Track', e.track), lrow('Class', e.cls), lrow('Dates', [e.start, e.end].filter(Boolean).join(' – ')),
      lrow('Driver', e.driverName), lrow('Engine', e.engine), lrow('Tire set', e.tireset),
      lrow('Baseline gear', e.gear ? e.gear + ratioText(e.gear) : ''), lrow('Cold tires', e.tcold), lrow('Lash', e.lash), lrow('Clutch', e.spring), lrow('Engage rpm', e.eng)].join('');
    const sess = (e.sessions || []).map(s => `<div class="log-entry">
        <div class="top"><span class="trk">${escapeHTML(s.type || 'Session')}</span><span class="dt">${escapeHTML(s.date || '')}</span></div>
        <div class="meta">${s.lap ? `<span class="chip">Best <b>${escapeHTML(s.lap)}</b></span>` : ''}${s.result ? `<span class="chip">${escapeHTML(s.result)}</span>` : ''}${s.gear ? `<span class="chip">Gear ${escapeHTML(s.gear)}</span>` : ''}${s.tires ? `<span class="chip">Tires ${escapeHTML(s.tires)}</span>` : ''}</div>
        ${s.changed ? `<div class="notes"><b>Changed:</b> ${escapeHTML(s.changed)}</div>` : ''}${s.notes ? `<div class="notes">${escapeHTML(s.notes)}</div>` : ''}
        <div class="btn-row"><button class="btn danger" onclick="deleteEventSession(${e.id},${s.id})">Remove</button></div></div>`).join('') || `<div class="empty">No sessions yet — add the first below.</div>`;
    v.innerHTML = `<button class="back" onclick="go('view-log')">‹ Log</button>
      <div class="article"><span class="tag">Event</span><h1>${escapeHTML(e.name)}</h1>
      <div class="table-wrap"><table>${info}</table></div>
      ${e.notes ? `<p>${escapeHTML(e.notes)}</p>` : ''}
      <h2>Sessions</h2>${sess}
      <div class="tool"><h2>Add a session</h2>
        <form onsubmit="addEventSession(${e.id},event)">
          <div class="row"><div class="field"><label>Session</label><select id="as-type">
            <option>Warm Up</option><option>Practice</option><option>Happy Hour</option><option>Qualifying</option><option>Heat Race 1</option><option>Heat Race 2</option><option>Heat Race 3</option><option>Heat Race 4</option><option>Prefinal</option><option>Final</option><option>Other</option></select></div>
            <div class="field"><label>Date</label><input id="as-date" type="date"></div></div>
          <div class="row"><div class="field"><label>Best lap</label><input id="as-lap" type="text" placeholder="43.10"></div><div class="field"><label>Result (position / podium)</label><input id="as-result" type="text" placeholder="P4 · podium · DNF"></div></div>
          <div class="row"><div class="field"><label>Gear</label><input id="as-gear" type="text" placeholder="17/64"></div><div class="field"><label>Tires cold → hot</label><input id="as-tires" type="text" placeholder="9/11 → 11/13"></div></div>
          <div class="field"><label>What changed</label><input id="as-changed" type="text" placeholder="added a tooth, 1° more caster"></div>
          <div class="field"><label>Notes</label><textarea id="as-notes" rows="2" placeholder="how it went"></textarea></div>
          <div class="btn-row"><button class="btn" type="submit">Add session</button></div>
        </form></div>
      <div class="btn-row"><button class="btn danger" onclick="deleteEntry(${e.id})">Delete event</button></div></div>`;
  } else {
    const info = [lrow('Track', e.track), lrow('Date', e.date), lrow('Focus', e.focus),
      lrow('Gear', (e.driver || e.driven) ? `${e.driver}/${e.driven}` + ratioText(`${e.driver}/${e.driven}`) : ''),
      lrow('Air °F', e.atemp), lrow('Track °F', e.ttemp), lrow('Weather', e.weather),
      lrow('Cold tires', e.tcold), lrow('Hot tires', e.thot), lrow('Lash', e.lash), lrow('Clutch', e.spring),
      lrow('Engage rpm', e.eng), lrow('End-of-straight rpm', e.eos), lrow('CHT °F', e.cht), lrow('Best lap', e.lap), lrow('Changed', e.changed)].join('');
    v.innerHTML = `<button class="back" onclick="go('view-log')">‹ Log</button>
      <div class="article"><span class="tag">Training session</span><h1>${escapeHTML(e.track)}</h1>
      <div class="table-wrap"><table>${info}</table></div>
      ${e.notes ? `<p>${escapeHTML(e.notes)}</p>` : ''}
      <div class="btn-row"><button class="btn danger" onclick="deleteEntry(${e.id})">Delete</button></div></div>`;
  }
  showView('view-log-detail');
}
function escapeHTML(s) { return (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function exportLog() {
  const log = loadLog(); if (!log.length) return;
  const rows = [['kind', 'name/track', 'date(s)', 'class', 'gear', 'tires', 'lash', 'clutch', 'best lap', 'result', 'changed', 'notes']];
  log.forEach(e => {
    if (e.kind === 'event') {
      rows.push(['event', e.name, [e.start, e.end].filter(Boolean).join(' - '), e.cls, e.gear, e.tcold, e.lash, e.spring, '', '', '', e.notes]);
      (e.sessions || []).forEach(s => rows.push(['  ' + (s.type || 'session'), e.name, s.date, '', s.gear, s.tires, '', '', s.lap, s.result, s.changed, s.notes]));
    } else {
      rows.push(['session', e.track, e.date, '', `${e.driver || ''}/${e.driven || ''}`, e.tcold, e.lash, e.spring, e.lap, '', e.changed, e.notes]);
    }
  });
  const csv = rows.map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' }); const a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'race-log.csv'; a.click(); URL.revokeObjectURL(a.href);
}

/* =====================================================================
   PWA install + service worker
   ===================================================================== */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
  $('#install-btn').classList.add('show');
});
function doInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.finally(() => { deferredPrompt = null; $('#install-btn').classList.remove('show'); });
}
window.addEventListener('appinstalled', () => $('#install-btn').classList.remove('show'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

/* =====================================================================
   INIT
   ===================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderTracks();
  populateTrackSelect();
  renderLog();
  setLogMode('session');
  // default dates = today
  const t = new Date().toISOString().slice(0, 10);
  ['#s-date', '#e-start'].forEach(id => { const n = $(id); if (n) n.value = t; });
  // wire tab bar
  $$('.tabbar button').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
  $('#install-btn').addEventListener('click', doInstall);
  calcGearChart();
  showView('view-guides');
});

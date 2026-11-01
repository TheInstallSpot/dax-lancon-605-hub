/* =====================================================================
   Dax Lancon Racing 605 — season.js
   2027 season planner: race schedule, going/skip, results, team checklist,
   series info. Saved on the phone first (works offline in the pits), then
   synced to the team copy through /.netlify/functions/season so Dax and Lee
   see the same thing. Edits are merged by item; newest change wins.
   ===================================================================== */
'use strict';
(function () {
  const API = '/.netlify/functions/season';
  const KEY = 'dlr605_season_v1';
  const $id = (i) => document.getElementById(i);
  const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* ---------------- local store ---------------- */
  function load() {
    try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && Array.isArray(d.races)) return d; } catch {}
    return { races: [], checklist: [], syncedAt: 0 };
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
  let S = load();
  const live = (arr) => arr.filter((x) => !x.deleted);
  const token = () => localStorage.getItem('dlr605_gate') || localStorage.getItem('dlr605_admin');
  const me = () => (localStorage.getItem('dlr605_name') || (localStorage.getItem('dlr605_admin') ? 'Lee' : '')).split(/[–-]/)[0].trim();

  /* ---------------- sync ---------------- */
  let syncing = false, again = false, timer = null, status = 'idle';
  function setStatus(s) { status = s; const n = $id('season-status'); if (n) n.innerHTML = statusHTML(); }
  function statusHTML() {
    if (!token()) return `<span class="ss warn">Not signed in · changes stay on this phone</span>`;
    if (status === 'offline') return `<span class="ss warn">Offline · saved on this phone, will sync</span>`;
    if (status === 'syncing') return `<span class="ss">Syncing…</span>`;
    if (status === 'error') return `<span class="ss warn">Couldn't sync · will retry</span>`;
    if (status === 'denied') return `<span class="ss warn">Sign-in expired or code turned off · sign in again</span>`;
    return S.syncedAt ? `<span class="ss ok">Synced with the team · ${rel(S.syncedAt)}</span>` : `<span class="ss">Not synced yet</span>`;
  }
  function queueSync(delay = 700) { clearTimeout(timer); timer = setTimeout(syncNow, delay); }
  async function syncNow() {
    const t = token();
    if (!t) { setStatus('idle'); return; }
    if (!navigator.onLine) { setStatus('offline'); return; }
    if (syncing) { again = true; return; }
    syncing = true; setStatus('syncing');
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'sync', token: t, races: S.races, checklist: S.checklist }) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401 || r.status === 403) { setStatus('denied'); return; }
      if (!r.ok) throw new Error(d.error || 'sync failed');
      S = { races: d.races || [], checklist: d.checklist || [], syncedAt: Date.now() };
      save(S); setStatus('ok'); render();
    } catch { setStatus(navigator.onLine ? 'error' : 'offline'); }
    finally { syncing = false; if (again) { again = false; queueSync(300); } }
  }

  /* ---------------- edits ---------------- */
  function touch(item) { item.updatedAt = Date.now(); item.by = me(); }
  function commit() { save(S); render(); queueSync(); }
  function setGoing(id, v) { const r = S.races.find((x) => x.id === id); if (!r || r.going === v) return; r.going = v; touch(r); commit(); }
  function toggleCheck(id, done) { const c = S.checklist.find((x) => x.id === id); if (!c) return; c.done = done; touch(c); commit(); }
  function removeCheck(id) { const c = S.checklist.find((x) => x.id === id); if (!c) return; c.deleted = true; touch(c); commit(); }
  function addCheck(section, ev) {
    ev.preventDefault();
    const inp = $id('sc-add-' + section); const text = (inp.value || '').trim(); if (!text) return;
    const order = Math.max(0, ...S.checklist.filter((c) => c.section === section).map((c) => c.order || 0)) + 1;
    const item = { id: 'c' + Date.now().toString(36), section, text, done: false, order }; touch(item);
    S.checklist.push(item); inp.value = ''; commit();
  }
  function clearWeekend() { live(S.checklist).filter((c) => c.section === 'weekend' && c.done).forEach((c) => { c.done = false; touch(c); }); commit(); }

  /* ---------------- dates ---------------- */
  const parse = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
  function dateBits(r) {
    const s = parse(r.start), e = parse(r.end) || s; if (!s) return null;
    const d = s.getMonth() === e.getMonth() ? (+s === +e ? `${s.getDate()}` : `${s.getDate()}–${e.getDate()}`) : `${s.getDate()}–${MONTHS[e.getMonth()]} ${e.getDate()}`;
    return { m: MONTHS[s.getMonth()], d, days: +s === +e ? DAYS[s.getDay()] : `${DAYS[s.getDay()]}–${DAYS[e.getDay()]}` };
  }
  const sorted = () => live(S.races).slice().sort((a, b) =>
    a.start && b.start ? a.start.localeCompare(b.start) : a.start ? -1 : b.start ? 1 : (a.num || 999) - (b.num || 999));
  function rel(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago'; return Math.floor(s / 86400) + 'd ago';
  }
  const trackId = (name) => { if (typeof TRACKS === 'undefined' || !name) return null; const t = TRACKS.find((x) => x.name.toLowerCase() === name.toLowerCase()); return t ? t.id : null; };
  const kartCls = (k) => (k === 'LO206' ? 'k-lo' : k === 'Shifter' ? 'k-sh' : 'k-mx');

  /* ---------------- render ---------------- */
  let tab = 'races', filter = 'all';
  function render() {
    const v = $id('view-season'); if (!v) return;
    v.innerHTML = `
      <div class="section-label">2027 season</div>
      <div id="season-status" class="season-status">${statusHTML()}</div>
      ${nextHTML()}
      <div class="seg">
        <button class="seg-btn${tab === 'races' ? ' active' : ''}" onclick="DLRseason.tab('races')">Races</button>
        <button class="seg-btn${tab === 'check' ? ' active' : ''}" onclick="DLRseason.tab('check')">Checklist</button>
        <button class="seg-btn${tab === 'info' ? ' active' : ''}" onclick="DLRseason.tab('info')">Info</button>
      </div>
      ${tab === 'races' ? racesHTML() : tab === 'check' ? checksHTML() : infoHTML()}`;
  }
  function nextHTML() {
    const t = today();
    const up = sorted().filter((r) => r.start && r.going !== 'no' && (parse(r.end) || parse(r.start)) >= t);
    if (!up.length) return '';
    const r = up[0], n = Math.round((parse(r.start) - t) / 86400000), b = dateBits(r);
    return `<div class="next-up glass">
      <div class="nu-count"><b>${n <= 0 ? 'NOW' : n}</b><span>${n <= 0 ? 'race weekend' : n === 1 ? 'day to go' : 'days to go'}</span></div>
      <div class="nu-what"><span class="tag">Next up${r.going === 'yes' ? ' · going' : ' · not decided'}</span>
        <h3>${esc(r.series)}${r.event ? ' · ' + esc(r.event) : ''}</h3>
        <p>${b.m} ${b.d} (${b.days}) · ${esc(r.track || 'Track TBA')}</p></div></div>`;
  }
  function racesHTML() {
    const t = today();
    let rs = sorted();
    if (filter === 'going') rs = rs.filter((r) => r.going === 'yes');
    if (filter === 'lo206') rs = rs.filter((r) => (r.kart || '').includes('206'));
    if (filter === 'shifter') rs = rs.filter((r) => /shifter/i.test(r.kart || ''));
    if (filter === 'undated') rs = rs.filter((r) => !r.start);
    const chip = (k, l) => `<button class="chip-btn${filter === k ? ' on' : ''}" onclick="DLRseason.filter('${k}')">${l}</button>`;
    const cards = rs.map((r) => {
      const b = dateBits(r), end = parse(r.end) || parse(r.start), past = end && end < t;
      const tid = trackId(r.track);
      const trk = r.track ? (tid ? `<a class="sr-track" onclick="openTrack('${tid}')">${esc(r.track)}</a>` : `<span class="sr-track">${esc(r.track)}</span>`) : `<span class="sr-track muted">Track TBA</span>`;
      const g = r.going || 'tbd';
      const segb = (val, lbl) => `<button class="${g === val ? 'on ' + val : ''}" onclick="DLRseason.going('${r.id}','${val}')">${lbl}</button>`;
      return `<div class="season-race going-${g}${past ? ' past' : ''}">
        <div class="sr-date">${b ? `<span class="m">${b.m}</span><span class="d">${b.d}</span><span class="n">${b.days}</span>` : `<span class="tbd">TBD</span>`}${r.num ? `<span class="n">#${r.num}</span>` : ''}</div>
        <div class="sr-body">
          <div class="sr-top"><b>${esc(r.series)}</b>${r.event ? `<span class="muted">${esc(r.event)}</span>` : ''}<span class="kchip ${kartCls(r.kart)}">${esc(r.kart || '—')}</span></div>
          <div>${trk}${r.city ? `<span class="muted"> · ${esc(r.city)}</span>` : ''}</div>
          ${r.result ? `<div class="sr-result">Result: ${esc(r.result)}</div>` : ''}
          ${r.notes ? `<div class="notes">${esc(r.notes)}</div>` : ''}
          <div class="sr-actions"><div class="going-seg">${segb('yes', 'Going')}${segb('no', 'Skip')}${segb('tbd', 'TBD')}</div>
            <button class="mini" onclick="DLRseason.edit('${r.id}')">Edit</button></div>
          ${r.by && r.updatedAt > 1 ? `<div class="sr-by">Edited by ${esc(r.by)} · ${rel(r.updatedAt)}</div>` : ''}
        </div></div>`;
    }).join('');
    return `<div class="chip-row">${chip('all', 'All')}${chip('going', 'Going')}${chip('lo206', 'LO206')}${chip('shifter', 'Shifter')}${chip('undated', 'No date yet')}</div>
      ${cards || `<div class="empty">${S.races.length ? 'No races match this filter.' : (token() ? 'Loading the season…' : 'Sign in with your code to load the team’s season.')}</div>`}
      <div class="btn-row"><button class="btn" onclick="DLRseason.edit(null)">＋ Add a race</button></div>`;
  }
  function checksHTML() {
    const block = (sec, title, ph) => {
      const items = live(S.checklist).filter((c) => c.section === sec).sort((a, b) => (a.order || 0) - (b.order || 0));
      const done = items.filter((i) => i.done).length;
      return `<div class="tool"><h2>${title}</h2><p class="hint">${items.length ? `${done} of ${items.length} done` : 'Nothing here yet.'}</p>
        <div class="check-list">${items.map((c) => `<label class="check-row${c.done ? ' done' : ''}">
          <input type="checkbox" ${c.done ? 'checked' : ''} onchange="DLRseason.check('${c.id}',this.checked)">
          <span>${esc(c.text)}</span>
          <button type="button" class="x" aria-label="Remove" onclick="event.preventDefault();DLRseason.removeCheck('${c.id}')">×</button></label>`).join('')}</div>
        <form class="add-row" onsubmit="DLRseason.addCheck('${sec}',event)"><input id="sc-add-${sec}" type="text" placeholder="${ph}"><button class="btn" type="submit">Add</button></form>
        ${sec === 'weekend' ? `<div class="btn-row"><button class="btn ghost" type="button" onclick="DLRseason.clearWeekend()">Clear ticks for the next race</button></div>` : ''}</div>`;
    };
    return block('season', 'Before the season', 'Add a to-do') + block('weekend', 'Every race weekend', 'Add a packing item');
  }
  function infoHTML() {
    const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
    return `<div class="article">
      <h2>Series</h2>${tbl(['Series', 'Kart', '2027', 'Register'], [
        ['<b>CKNA</b> Cup Karts North America', 'LO206', 'Jan 1–3 confirmed, 103rd Street', '<a href="https://www.cupkarts.com/ckna-news/reflecting-on-grandsx-and-the-start-of-2027/" target="_blank" rel="noopener">cupkarts.com</a>'],
        ['<b>TKL</b> Texas Karting League', 'FZ125 Shifter', 'All 5 rounds confirmed · season pass until Mar 19', '<a href="https://tklrace.com/" target="_blank" rel="noopener">tklrace.com</a><br>john@tklrace.com · 945-245-0250'],
        ['<b>APEX</b> Apex Karting Championships', 'LO206', 'Texas region listed; dates not out', '<a href="https://www.apexkartingchampionships.com/" target="_blank" rel="noopener">apexkartingchampionships.com</a>'],
        ['<b>DFW TC</b> DFW Triple Crown', '206/Shifter', 'MotorSport Ranch, OMC, third TBA', '<a href="https://www.facebook.com/profile.php?id=61557569591178" target="_blank" rel="noopener">Facebook</a> · <a href="https://dfwtriplecrown.alphatiming.co.uk/register/events/18567" target="_blank" rel="noopener">Alpha Timing</a>'],
        ['<b>CowTown</b> Cowtown Kart Club', '206/Shifter', 'Dates not out · 2026: $75 membership + $75 entry', '<a href="https://www.facebook.com/profile.php?id=61575405155753" target="_blank" rel="noopener">Facebook</a>']])}
      <h2>Kart numbers</h2>${tbl(['Series', 'Color', 'Size', 'Numbering'], [
        ['<b>CKNA</b>', 'Black on white or yellow', '4.5 in tall, all 4 sides', 'No range published; unique in class; no letters'],
        ['<b>TKL</b>', 'Not specified', 'Not specified', 'Race Rotax: FZ125 Senior 400–499 · ask TKL'],
        ['<b>APEX</b>', '—', '—', 'Texas rules not published'],
        ['<b>DFW TC</b>', 'Sized for scoring (NKA)', 'Panels ≥ 9 × 7 in', 'Scorer assigns or approves'],
        ['<b>CowTown</b>', '—', '—', 'No published rules; ask the club']])}
      <div class="box tip"><b>One set of panels:</b> black digits on yellow, at least 4.5 in tall, on NKA-size panels passes every published rule. #605 works for LO206 in CKNA if nobody else in the class has it; get the TKL shifter number from TKL before Shaw prints.</div>
      <h2>Travel from Dallas</h2>${tbl(['Track', 'Drive (approx.)', 'Plan for'], [
        ['NTK, Denton', '40 mi · ~45 min', 'Day trip'], ['KartMoto, Cresson', '70 mi · ~1 hr 15 min', 'Day trip or stay over'],
        ['OMC, Norman OK', '190 mi · ~3 hr', '1–2 hotel nights'], ['SpeedSportz, New Caney', '230 mi · ~3.5 hr', '2–3 hotel nights'],
        ['GCKI, Katy', '255 mi · ~4 hr', '2–3 hotel nights'], ['103rd Street, Jacksonville FL', '~1,000 mi · ~15 hr', '2 travel days each way; leave by Dec 30']])}
      <p class="hint">Highway estimates without a trailer; add time for towing and Houston traffic.</p>
      <div class="box note"><b>Memberships:</b> KartMoto is members-only and members pay far less for practice ($25 vs $75 at a 2025 event). NTK 2026 dues: $500, or $350 out of town. GCKI and SpeedSportz members practice free the day before races.</div>
    </div>`;
  }

  /* ---------------- race editor (sheet) ---------------- */
  let editing = null;
  function edit(id) {
    editing = id;
    const r = id ? S.races.find((x) => x.id === id) : { series: 'CowTown', kart: 'LO206' };
    const opts = (list, cur) => list.map((x) => `<option${x === cur ? ' selected' : ''}>${x}</option>`).join('');
    const tracks = (typeof TRACKS !== 'undefined' ? TRACKS : []).map((t) => `<option value="${esc(t.name)}">`).join('');
    $id('season-sheet-body').innerHTML = `
      <div class="admin-head"><div><h2>${id ? 'Edit race' : 'Add a race'}</h2><p>${id ? esc(r.series + (r.event ? ' · ' + r.event : '')) : 'Saved on this phone, then synced to the team'}</p></div>
        <button class="admin-x" onclick="DLRseason.close()" aria-label="Close">✕</button></div>
      <form onsubmit="DLRseason.saveRace(event)">
        <div class="row"><div class="field"><label for="sr-series">Series</label><select id="sr-series">${opts(['CKNA', 'TKL', 'APEX', 'DFW TC', 'CowTown', 'Other'], r.series)}</select></div>
          <div class="field"><label for="sr-kart">Kart</label><select id="sr-kart">${opts(['LO206', 'Shifter', '206/Shifter'], r.kart)}</select></div></div>
        <div class="field"><label for="sr-event">Event name</label><input id="sr-event" type="text" value="${esc(r.event || '')}" placeholder="e.g. Katy Classic"></div>
        <div class="row"><div class="field"><label for="sr-start">Start date</label><input id="sr-start" type="date" value="${r.start || ''}"></div>
          <div class="field"><label for="sr-end">End date</label><input id="sr-end" type="date" value="${r.end || ''}"></div></div>
        <div class="row"><div class="field"><label for="sr-track">Track</label><input id="sr-track" type="text" list="sr-tracks" value="${esc(r.track || '')}"><datalist id="sr-tracks">${tracks}</datalist></div>
          <div class="field"><label for="sr-city">City</label><input id="sr-city" type="text" value="${esc(r.city || '')}"></div></div>
        <div class="field"><label for="sr-result">Result</label><input id="sr-result" type="text" value="${esc(r.result || '')}" placeholder="e.g. P3 in LO206 Senior"></div>
        <div class="field"><label for="sr-notes">Notes</label><textarea id="sr-notes" rows="3" placeholder="Hotel, gearing, who's towing…">${esc(r.notes || '')}</textarea></div>
        <div class="admin-msg" id="sr-msg"></div>
        <div class="btn-row"><button class="btn" type="submit">Save</button><button class="btn ghost" type="button" onclick="DLRseason.close()">Cancel</button>
          ${id ? `<button class="btn danger" type="button" id="sr-del" onclick="DLRseason.delRace()">Delete race</button>` : ''}</div>
      </form>`;
    const st = $id('sr-start'), en = $id('sr-end'), tr = $id('sr-track'), ci = $id('sr-city');
    st.addEventListener('change', () => { if (!en.value || en.value < st.value) en.value = st.value; });
    tr.addEventListener('change', () => { const t = (typeof TRACKS !== 'undefined' ? TRACKS : []).find((x) => x.name === tr.value); if (t && !ci.value) ci.value = t.city; });
    $id('season-sheet').classList.remove('hidden'); document.body.classList.add('modal-open');
  }
  function close() { $id('season-sheet').classList.add('hidden'); document.body.classList.remove('modal-open'); editing = null; }
  function saveRace(ev) {
    ev.preventDefault();
    const start = $id('sr-start').value || null; const end = $id('sr-end').value || start;
    if (start && end < start) { $id('sr-msg').textContent = 'The end date is before the start date.'; return; }
    const fields = { series: $id('sr-series').value, kart: $id('sr-kart').value, event: $id('sr-event').value.trim(),
      start, end: start ? end : null, track: $id('sr-track').value.trim(), city: $id('sr-city').value.trim(),
      result: $id('sr-result').value.trim(), notes: $id('sr-notes').value.trim() };
    if (editing) { const r = S.races.find((x) => x.id === editing); Object.assign(r, fields); touch(r); }
    else {
      const num = Math.max(0, ...S.races.map((x) => x.num || 0)) + 1;
      const r = Object.assign({ id: 'r' + Date.now().toString(36), num, going: 'tbd' }, fields); touch(r); S.races.push(r);
    }
    close(); commit();
  }
  function delRace() {
    const b = $id('sr-del');
    if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to delete'; return; }
    const r = S.races.find((x) => x.id === editing); if (r) { r.deleted = true; touch(r); }
    close(); commit();
  }

  window.DLRseason = {
    tab: (t) => { tab = t; render(); }, filter: (f) => { filter = f; render(); },
    going: setGoing, check: toggleCheck, removeCheck, addCheck, clearWeekend,
    edit, close, saveRace, delRace, sync: syncNow, render
  };

  window.addEventListener('DOMContentLoaded', () => {
    render();
    syncNow();
    const btn = document.querySelector('.tabbar button[data-view="view-season"]');
    if (btn) btn.addEventListener('click', () => syncNow());
  });
  window.addEventListener('online', () => syncNow());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncNow(); });
  // pick up a fresh login from the PIN gate
  window.addEventListener('storage', (e) => { if (e.key === 'dlr605_gate') syncNow(); });
})();

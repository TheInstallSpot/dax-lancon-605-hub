/* =====================================================================
   Dax Lancon Racing 605 — auth.js
   Racer PIN gate, admin back office, and server log sync.
   Talks to Netlify Functions: /gate, /admin, /logsync (Netlify Blobs).
   ===================================================================== */
'use strict';
(function () {
  const API = '/.netlify/functions';
  const GATE_TOKEN = 'dlr605_gate';
  const GATE_NAME = 'dlr605_name';
  const ADMIN_TOKEN = 'dlr605_admin';
  const OWNER_KEY = 'dlr605_owner';

  const $id = (i) => document.getElementById(i);
  const esc = (s) => (s == null ? '' : String(s)).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  async function api(fn, payload) {
    const r = await fetch(`${API}/${fn}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let d = {};
    try { d = await r.json(); } catch {}
    if (!r.ok) { const e = new Error(d.error || ('Error ' + r.status)); e.status = r.status; throw e; }
    return d;
  }

  /* ---------------- session ---------------- */
  const getToken = () => localStorage.getItem(GATE_TOKEN);
  const getAdmin = () => localStorage.getItem(ADMIN_TOKEN);
  function setSession(t, n) { localStorage.setItem(GATE_TOKEN, t); if (n) localStorage.setItem(GATE_NAME, n); }
  function clearSession() { localStorage.removeItem(GATE_TOKEN); localStorage.removeItem(GATE_NAME); }

  function showGate() { const g = $id('gate'); if (g) g.classList.remove('hidden'); document.body.classList.add('gated'); }
  function hideGate() { const g = $id('gate'); if (g) g.classList.add('hidden'); document.body.classList.remove('gated'); }

  function toast(msg) {
    let t = $id('dlr-toast');
    if (!t) { t = document.createElement('div'); t.id = 'dlr-toast'; t.className = 'dlr-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------------- log sync ---------------- */
  const DLR = {
    syncing: false,
    async syncNow() {
      const t = getToken();
      if (!t || !navigator.onLine) return;
      if (this.syncing) return;
      this.syncing = true;
      try {
        const local = (typeof window.loadLog === 'function') ? window.loadLog() : [];
        const d = await api('logsync', { action: 'sync', token: t, entries: local });
        if (d.entries && typeof window.saveLog === 'function') {
          window.saveLog(d.entries);
          if (typeof window.renderLog === 'function') window.renderLog();
        }
      } catch (e) {
        if (e.status === 403 || /revoked/i.test(e.message || '')) { clearSession(); showGate(); }
      } finally { this.syncing = false; }
    }
  };
  window.DLRSync = () => DLR.syncNow();

  /* ---------------- gate ---------------- */
  async function gateLogin(ev) {
    if (ev) ev.preventDefault();
    const inp = $id('gate-pin'), msg = $id('gate-msg'), btn = $id('gate-btn');
    const pin = (inp.value || '').trim();
    msg.textContent = '';
    if (!/^\d{4,8}$/.test(pin)) { msg.textContent = 'Enter your 4-digit code.'; return; }
    btn.disabled = true; btn.textContent = 'Checking…';
    try {
      const d = await api('gate', { action: 'login', pin });
      setSession(d.token, d.name);
      inp.value = '';
      hideGate();
      toast('Welcome' + (d.name ? ', ' + d.name.split(/[–-]/)[0].trim() : '') + ' 🏁');
      DLR.syncNow();
    } catch (e) {
      msg.textContent = e.message || 'That code isn’t valid.';
      if (inp.select) inp.select();
    } finally { btn.disabled = false; btn.textContent = 'Enter'; }
  }

  async function gateInit() {
    if (localStorage.getItem(OWNER_KEY) === '1') { hideGate(); return; } // owner bypass
    const token = getToken();
    if (!token) { showGate(); return; }
    hideGate(); // trust cached token so the pit works offline
    if (navigator.onLine) {
      try {
        const d = await api('gate', { action: 'validate', token });
        if (!d.valid) { clearSession(); showGate(); }
        else DLR.syncNow();
      } catch { /* offline — try again next open */ }
    }
  }

  /* ---------------- admin ---------------- */
  function openAdmin() { const o = $id('admin'); if (o) { o.classList.remove('hidden'); document.body.classList.add('modal-open'); routeAdmin(); } }
  function closeAdmin() { const o = $id('admin'); if (o) o.classList.add('hidden'); document.body.classList.remove('modal-open'); }
  function ownerEnter() { localStorage.setItem(OWNER_KEY, '1'); closeAdmin(); hideGate(); toast('Welcome, Lee 🏁'); }
  function adminBody() { return $id('admin-body'); }

  async function adminApi(action, extra) {
    try { return await api('admin', Object.assign({ action, token: getAdmin() }, extra || {})); }
    catch (e) {
      if (e.status === 401) { localStorage.removeItem(ADMIN_TOKEN); renderLogin('Session expired — sign in again.'); }
      throw e;
    }
  }

  async function routeAdmin() {
    adminBody().innerHTML = `<div class="admin-load">Loading…</div>`;
    if (getAdmin()) { renderPanel(); return; }
    try {
      const st = await api('admin', { action: 'status' });
      st.needsSetup ? renderSetup() : renderLogin();
    } catch { adminBody().innerHTML = `<div class="admin-load">Can’t reach the server. Check your connection.</div>`; }
  }

  const adminHead = (sub) => `<div class="admin-head"><div><h2>Admin</h2><p>${esc(sub)}</p></div>
    <button class="admin-x" onclick="DLRauth.closeAdmin()" aria-label="Close">✕</button></div>`;

  function renderSetup() {
    adminBody().innerHTML = adminHead('First-time setup — create your admin password') + `
      <form onsubmit="DLRauth.doSetup(event)">
        <div class="field"><label>Create admin password</label>
          <input id="ad-new" type="password" autocomplete="new-password" placeholder="at least 6 characters"></div>
        <div class="field"><label>Confirm password</label>
          <input id="ad-new2" type="password" autocomplete="new-password" placeholder="repeat it"></div>
        <div class="admin-msg" id="ad-msg"></div>
        <div class="btn-row"><button class="btn" type="submit">Create admin</button></div>
        <p class="hint">This password unlocks the back office. It’s stored hashed on the server — keep it safe; only you should know it.</p>
      </form>`;
  }
  async function doSetup(ev) {
    ev.preventDefault();
    const p = $id('ad-new').value, p2 = $id('ad-new2').value, msg = $id('ad-msg');
    msg.textContent = '';
    if (p.length < 6) { msg.textContent = 'Use at least 6 characters.'; return; }
    if (p !== p2) { msg.textContent = 'Passwords don’t match.'; return; }
    try { const d = await api('admin', { action: 'setup', password: p }); localStorage.setItem(ADMIN_TOKEN, d.token); renderPanel(); toast('Admin created ✔'); }
    catch (e) { msg.textContent = e.message; }
  }

  function renderLogin(note) {
    adminBody().innerHTML = adminHead(note || 'Sign in to manage racer codes & logs') + `
      <form onsubmit="DLRauth.doLogin(event)">
        <div class="field"><label>Admin password</label>
          <input id="ad-pw" type="password" autocomplete="current-password" placeholder="your admin password"></div>
        <div class="admin-msg" id="ad-msg"></div>
        <div class="btn-row"><button class="btn" type="submit">Sign in</button></div>
      </form>`;
    setTimeout(() => { const n = $id('ad-pw'); if (n) n.focus(); }, 50);
  }
  async function doLogin(ev) {
    ev.preventDefault();
    const pw = $id('ad-pw').value, msg = $id('ad-msg');
    msg.textContent = '';
    try { const d = await api('admin', { action: 'login', password: pw }); localStorage.setItem(ADMIN_TOKEN, d.token); renderPanel(); }
    catch (e) { msg.textContent = e.message; }
  }

  function tabBtn(id, label, on) { return `<button class="admin-tab${on ? ' on' : ''}" onclick="DLRauth.tab('${id}')">${label}</button>`; }

  async function renderPanel(tab) {
    tab = tab || renderPanel._tab || 'codes';
    renderPanel._tab = tab;
    adminBody().innerHTML = adminHead('Back office') + `
      <button class="btn owner-enter" onclick="DLRauth.ownerEnter()">Enter the app →</button>
      <div class="admin-tabs">${tabBtn('codes', 'Codes', tab === 'codes')}${tabBtn('logs', 'Logs', tab === 'logs')}${tabBtn('security', 'Password', tab === 'security')}${tabBtn('system', 'System', tab === 'system')}</div>
      <div id="admin-tab"></div>`;
    if (tab === 'codes') renderCodes();
    else if (tab === 'logs') renderLogsRoster();
    else if (tab === 'system') renderSystem();
    else renderSecurity();
  }
  const tab = (t) => renderPanel(t);

  /* ---- codes tab ---- */
  async function renderCodes() {
    const box = $id('admin-tab');
    box.innerHTML = `
      <form class="admin-create" onsubmit="DLRauth.createCode(event)">
        <div class="field"><label>Who is this code for?</label>
          <input id="cc-name" type="text" placeholder="e.g. Cole — guest driver"></div>
        <div class="row">
          <div class="field"><label>4-digit PIN <span class="muted">(blank = auto)</span></label>
            <input id="cc-pin" type="text" inputmode="numeric" maxlength="4" placeholder="auto"></div>
          <div class="field"><label>Expires <span class="muted">(optional)</span></label>
            <input id="cc-exp" type="date"></div>
        </div>
        <div class="admin-msg" id="cc-msg"></div>
        <div class="btn-row"><button class="btn" type="submit">Create code</button></div>
      </form>
      <div id="cc-list" class="code-list"><div class="admin-load">Loading codes…</div></div>`;
    loadCodes();
  }
  async function loadCodes() {
    try {
      const d = await adminApi('list');
      const list = $id('cc-list'); if (!list) return;
      if (!d.codes.length) { list.innerHTML = `<div class="empty">No codes yet. Create one above and hand the PIN to your racer.</div>`; return; }
      const now = Date.now();
      list.innerHTML = d.codes.map((c) => {
        const expired = c.expiresAt && c.expiresAt <= now;
        const state = c.revoked ? '<span class="pill off">revoked</span>' : expired ? '<span class="pill off">expired</span>' : '<span class="pill on">active</span>';
        const last = c.lastUsedAt ? 'used ' + rel(c.lastUsedAt) : 'never used';
        const exp = c.expiresAt ? ' · expires ' + new Date(c.expiresAt).toLocaleDateString() : '';
        return `<div class="code-row${c.revoked || expired ? ' dim' : ''}">
          <div class="cr-main"><div class="cr-name">${esc(c.name)}</div>
            <div class="cr-meta">${state} · <b class="cr-pin">${esc(c.pin)}</b> · ${last}${exp}</div></div>
          <div class="cr-actions">
            ${c.revoked ? `<button class="mini" onclick="DLRauth.codeAct('restore','${c.id}')">Restore</button>`
                        : `<button class="mini warn" onclick="DLRauth.codeAct('revoke','${c.id}')">Revoke</button>`}
            <button class="mini danger" onclick="DLRauth.codeDelete('${c.id}','${esc(c.name).replace(/'/g, '')}')">Delete</button>
          </div></div>`;
      }).join('');
    } catch (e) { const l = $id('cc-list'); if (l) l.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  async function createCode(ev) {
    ev.preventDefault();
    const name = $id('cc-name').value.trim(), pin = $id('cc-pin').value.trim(), exp = $id('cc-exp').value, msg = $id('cc-msg');
    msg.textContent = '';
    if (!name) { msg.textContent = 'Give the code a name.'; return; }
    let expiresAt = null;
    if (exp) { const dt = new Date(exp + 'T23:59:59'); if (!isNaN(dt)) expiresAt = dt.getTime(); }
    try {
      const d = await adminApi('create', { name, pin: pin || undefined, expiresAt });
      $id('cc-name').value = ''; $id('cc-pin').value = ''; $id('cc-exp').value = '';
      toast(`Code ${d.code.pin} created for ${d.code.name.split(/[–-]/)[0].trim()}`);
      loadCodes();
    } catch (e) { msg.textContent = e.message; }
  }
  async function codeAct(action, id) { try { await adminApi(action, { id }); loadCodes(); } catch (e) { toast(e.message); } }
  async function codeDelete(id, name) {
    if (!confirm(`Delete the code for "${name}"? This permanently removes the code (their saved log stays on the server).`)) return;
    try { await adminApi('delete', { id }); loadCodes(); } catch (e) { toast(e.message); }
  }

  /* ---- driver logs tab ---- */
  async function renderLogsRoster() {
    const box = $id('admin-tab');
    box.innerHTML = `<div id="lr-list"><div class="admin-load">Loading logs…</div></div>`;
    try {
      const d = await adminApi('logRoster');
      const l = $id('lr-list'); if (!l) return;
      if (!d.roster.length) { l.innerHTML = `<div class="empty">No driver logs yet. Logs appear here once racers save sessions while signed in.</div>`; return; }
      l.innerHTML = d.roster.map((r) => `
        <button class="code-row tapper" onclick="DLRauth.openDriver('${r.cid}')">
          <div class="cr-main"><div class="cr-name">${esc(r.name)}${r.revoked ? ' <span class="pill off">revoked</span>' : ''}</div>
            <div class="cr-meta">${r.count} entr${r.count === 1 ? 'y' : 'ies'}${r.lastUpdated ? ' · updated ' + rel(r.lastUpdated) : ''}</div></div>
          <div class="cr-actions"><span class="chev">›</span></div></button>`).join('');
    } catch (e) { const l = $id('lr-list'); if (l) l.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  async function openDriver(cid) {
    const box = $id('admin-tab');
    box.innerHTML = `<button class="back" onclick="DLRauth.tab('logs')">‹ All drivers</button><div id="dl-body"><div class="admin-load">Loading…</div></div>`;
    try {
      const d = await adminApi('driverLog', { id: cid });
      const b = $id('dl-body'); if (!b) return;
      const head = `<h3 class="dl-name">${esc(d.name)}</h3>`;
      if (!d.entries.length) { b.innerHTML = head + `<div class="empty">No entries saved yet.</div>`; return; }
      b.innerHTML = head + d.entries.map(renderEntryRO).join('');
    } catch (e) { const b = $id('dl-body'); if (b) b.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  function renderEntryRO(e) {
    if (e.kind === 'event') {
      const days = [e.start, e.end].filter(Boolean).join(' – ');
      const sess = (e.sessions || []).map((s) => `<div class="dl-sess"><b>${esc(s.type || 'Session')}</b> ${esc(s.date || '')}${s.lap ? ' · best ' + esc(s.lap) : ''}${s.result ? ' · ' + esc(s.result) : ''}${s.gear ? ' · gear ' + esc(s.gear) : ''}${s.notes ? '<br><span class="muted">' + esc(s.notes) + '</span>' : ''}</div>`).join('');
      return `<div class="dl-entry"><div class="dl-top">🏁 ${esc(e.name)}<span>${esc(days)}</span></div>
        <div class="muted">${esc(e.track || '')}${e.cls ? ' · ' + esc(e.cls) : ''}${e.driverName ? ' · ' + esc(e.driverName) : ''}</div>
        ${sess || '<div class="muted">No sessions logged.</div>'}</div>`;
    }
    const bits = [e.date, e.driver || e.driven ? `gear ${e.driver || '?'}/${e.driven || '?'}` : '', e.lap ? 'best ' + e.lap : '', e.tcold ? 'tires ' + e.tcold : ''].filter(Boolean).map(esc).join(' · ');
    return `<div class="dl-entry"><div class="dl-top">${esc(e.track || 'Session')}</div>
      <div class="muted">${bits}</div>${e.focus ? '<div>' + esc(e.focus) + '</div>' : ''}${e.notes ? '<div class="muted">' + esc(e.notes) + '</div>' : ''}</div>`;
  }

  /* ---- system check (smoke test) tab ---- */
  function renderSystem() {
    $id('admin-tab').innerHTML = `
      <p class="hint" style="margin:0 0 12px">Runs the whole stack through its paces: server functions, storage, a full
      create&nbsp;→&nbsp;PIN&nbsp;login&nbsp;→&nbsp;log&nbsp;sync&nbsp;→&nbsp;revoke round-trip with a throwaway code, plus app assets and content.
      Safe to run anytime — it cleans up after itself. (If a run is interrupted, delete any leftover "⚙ Smoke test" code in the Codes tab.)</p>
      <div class="btn-row"><button class="btn" id="sys-run" onclick="DLRauth.runSmoke()">Run system check</button></div>
      <div id="sys-results" class="code-list" style="margin-top:14px"></div>
      <div id="sys-summary"></div>`;
  }

  async function runSmoke() {
    const btn = $id('sys-run'), out = $id('sys-results'), sum = $id('sys-summary');
    if (!out) return;
    if (!navigator.onLine) { out.innerHTML = `<div class="empty">You're offline — the system check needs a connection.</div>`; return; }
    btn.disabled = true; btn.textContent = 'Running…';
    out.innerHTML = ''; sum.innerHTML = '';
    const smoke = {};
    let pass = 0, warn = 0, fail = 0;

    const row = (name) => {
      const r = document.createElement('div');
      r.className = 'sys-row';
      r.innerHTML = `<span class="sys-ic run">⟳</span><div class="sys-main"><div class="sys-name">${esc(name)}</div><div class="sys-detail">running…</div></div>`;
      out.appendChild(r);
      return r;
    };
    const settle = (r, state, detail) => {
      const ic = r.querySelector('.sys-ic');
      ic.className = 'sys-ic ' + state;
      ic.textContent = state === 'ok' ? '✓' : state === 'warn' ? '!' : '✕';
      r.querySelector('.sys-detail').textContent = detail;
      if (state === 'ok') pass++; else if (state === 'warn') warn++; else fail++;
    };
    const step = async (name, fn) => {
      const r = row(name);
      try {
        const res = (await fn()) || {};
        settle(r, res.warn ? 'warn' : 'ok', res.detail || 'OK');
      } catch (e) {
        settle(r, 'fail', e.message || 'failed');
      }
    };

    await step('Server functions reachable', async () => {
      const t0 = performance.now();
      const d = await api('admin', { action: 'status' });
      return { detail: `${Math.round(performance.now() - t0)} ms · setup ${d.needsSetup ? 'NEEDED' : 'complete'}`, warn: !!d.needsSetup };
    });
    await step('Admin session valid', async () => {
      const d = await adminApi('list');
      return { detail: `${d.codes.length} access code(s) on file` };
    });
    await step('Storage (Blobs) read/write', async () => {
      const d = await adminApi('selftest');
      return { detail: `blob write→read→delete in ${d.ms} ms` };
    });
    await step('Create throwaway test code', async () => {
      const d = await adminApi('create', { name: '⚙ Smoke test (auto)' });
      smoke.cid = d.code.id; smoke.pin = d.code.pin;
      return { detail: 'PIN ' + d.code.pin + ' issued' };
    });
    await step('Racer PIN login', async () => {
      if (!smoke.pin) throw new Error('skipped — no test code');
      const d = await api('gate', { action: 'login', pin: smoke.pin });
      smoke.token = d.token;
      return { detail: `token issued to "${d.name}"` };
    });
    await step('Token validation', async () => {
      if (!smoke.token) throw new Error('skipped — no token');
      const d = await api('gate', { action: 'validate', token: smoke.token });
      if (!d.valid) throw new Error('server says token invalid');
      return { detail: 'server confirms token valid' };
    });
    await step('Log sync round-trip', async () => {
      if (!smoke.token) throw new Error('skipped — no token');
      const entry = { id: Date.now(), updatedAt: Date.now(), kind: 'session', track: '⚙ SMOKE TEST', date: '2000-01-01' };
      const d = await api('logsync', { action: 'sync', token: smoke.token, entries: [entry] });
      if (!(d.entries || []).some((x) => x.track === '⚙ SMOKE TEST')) throw new Error('test entry did not round-trip');
      return { detail: 'entry synced up & back' };
    });
    await step('Admin can read the driver log', async () => {
      if (!smoke.cid) throw new Error('skipped — no test code');
      const d = await adminApi('driverLog', { id: smoke.cid });
      if (!(d.entries || []).some((x) => x.track === '⚙ SMOKE TEST')) throw new Error('entry not visible to admin');
      return { detail: `visible under "${d.name}"` };
    });
    await step('Revocation cuts access', async () => {
      if (!smoke.cid || !smoke.token) throw new Error('skipped — no test code');
      await adminApi('revoke', { id: smoke.cid });
      const v = await api('gate', { action: 'validate', token: smoke.token });
      if (v.valid) throw new Error('revoked token still validates');
      let blocked = false;
      try { await api('logsync', { action: 'sync', token: smoke.token, entries: [] }); } catch { blocked = true; }
      if (!blocked) throw new Error('revoked code can still sync');
      return { detail: 'token dead · sync blocked' };
    });
    await step('Cleanup', async () => {
      if (!smoke.cid) return { detail: 'nothing to clean', warn: true };
      await adminApi('delete', { id: smoke.cid, purgeLog: true });
      return { detail: 'test code & test log removed' };
    });
    await step('App shell assets', async () => {
      const bust = Date.now();
      const r1 = await fetch('./content.js?smoke=' + bust, { cache: 'no-store' });
      const r2 = await fetch('./index.html?smoke=' + bust, { cache: 'no-store' });
      if (!r1.ok || !r2.ok) throw new Error('asset fetch failed (' + r1.status + '/' + r2.status + ')');
      return { detail: 'index + content served fresh' };
    });
    await step('Offline cache (service worker)', async () => {
      if (!('serviceWorker' in navigator)) return { detail: 'not supported in this browser', warn: true };
      const reg = await navigator.serviceWorker.getRegistration();
      const keys = (window.caches ? await caches.keys() : []);
      const ver = keys.find((k) => /^dlr605-v/.test(k));
      if (!reg || !ver) return { detail: reg ? 'registered, cache not built yet' : 'not registered yet', warn: true };
      return { detail: ver + ' active — offline ready' };
    });
    await step('Content integrity', async () => {
      const t = (typeof TOPICS !== 'undefined') && TOPICS.length;
      const tr = (typeof TRACKS !== 'undefined') && TRACKS.length;
      const c = (typeof CATEGORIES !== 'undefined') && CATEGORIES.length;
      const g = (typeof GROUPS !== 'undefined') && GROUPS.length;
      if (!t || !tr || !c || !g) throw new Error('content arrays missing');
      const missing = CATEGORIES.flatMap((cat) => cat.ids.filter((id) => !TOPICS.some((tp) => tp.id === id)));
      if (missing.length) throw new Error('guides missing: ' + missing.join(', '));
      const calcs = ['calcGear', 'calcGearChart', 'calcSpeed', 'calcBallast'].filter((f) => typeof window[f] !== 'function');
      if (calcs.length) throw new Error('calculators missing: ' + calcs.join(', '));
      return { detail: `${t} guides · ${c} categories · ${g} groups · ${tr} tracks · calculators OK` };
    });

    const total = pass + warn + fail;
    sum.innerHTML = `<div class="sys-sum ${fail ? 'bad' : warn ? 'mid' : 'good'}">
      ${fail ? '✕' : warn ? '!' : '✓'} ${pass}/${total} passed${warn ? ` · ${warn} warning${warn > 1 ? 's' : ''}` : ''}${fail ? ` · ${fail} FAILED` : ''}
      ${fail ? '— something needs attention.' : warn ? '— all core systems go.' : '— all systems go. 🏁'}</div>`;
    btn.disabled = false; btn.textContent = 'Run again';
  }

  /* ---- security tab ---- */
  function renderSecurity() {
    $id('admin-tab').innerHTML = `
      <form onsubmit="DLRauth.changePw(event)">
        <div class="field"><label>Current password</label><input id="sp-cur" type="password" autocomplete="current-password"></div>
        <div class="field"><label>New password</label><input id="sp-new" type="password" autocomplete="new-password" placeholder="at least 6 characters"></div>
        <div class="admin-msg" id="sp-msg"></div>
        <div class="btn-row"><button class="btn" type="submit">Change password</button></div>
      </form>
      <div class="btn-row" style="margin-top:18px"><button class="btn ghost" onclick="DLRauth.logout()">Sign out of admin</button></div>`;
  }
  async function changePw(ev) {
    ev.preventDefault();
    const cur = $id('sp-cur').value, np = $id('sp-new').value, msg = $id('sp-msg');
    msg.textContent = '';
    if (np.length < 6) { msg.textContent = 'New password needs at least 6 characters.'; return; }
    try { await adminApi('changePassword', { current: cur, newPassword: np }); toast('Password changed ✔'); $id('sp-cur').value = ''; $id('sp-new').value = ''; }
    catch (e) { msg.textContent = e.message; }
  }
  function logout() { localStorage.removeItem(ADMIN_TOKEN); localStorage.removeItem(OWNER_KEY); if (!getToken()) showGate(); routeAdmin(); }

  function rel(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 2592000) return Math.floor(s / 86400) + 'd ago';
    return new Date(ts).toLocaleDateString();
  }

  /* ---------------- wire up ---------------- */
  window.DLRauth = {
    openAdmin, closeAdmin, ownerEnter, gateLogin, doSetup, doLogin, tab,
    createCode, codeAct, codeDelete, openDriver, changePw, logout, runSmoke
  };

  window.addEventListener('DOMContentLoaded', () => {
    const f = $id('gate-form'); if (f) f.addEventListener('submit', gateLogin);
    const ab = $id('admin-btn'); if (ab) ab.addEventListener('click', openAdmin);
    gateInit();
  });
  window.addEventListener('online', () => DLR.syncNow());
})();

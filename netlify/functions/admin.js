/* Admin back office. First-run setup, login, and code/log management.
   Public:  status | setup | login
   Auth'd (needs admin token):  list | create | revoke | restore | delete
                                logRoster | driverLog | changePassword */
import {
  store, json, sign, verify, hashPw, safeEqualHex,
  randId, randPin, randSecret, randSalt, readBody
} from './_lib.js';

const ADMIN_MS = 12 * 60 * 60 * 1000;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const body = await readBody(req);
  if (!body) return json({ error: 'bad request' }, 400);
  const s = store();
  let config = await s.get('config', { type: 'json' });

  /* ---------- public ---------- */
  if (body.action === 'status') {
    return json({ needsSetup: !config || !config.adminHash });
  }

  if (body.action === 'setup') {
    if (config && config.adminHash) return json({ error: 'Admin is already set up.' }, 409);
    const pw = (body.password || '').toString();
    if (pw.length < 6) return json({ error: 'Use at least 6 characters.' }, 400);
    const salt = randSalt();
    config = { secret: randSecret(), adminSalt: salt, adminHash: hashPw(pw, salt), createdAt: Date.now() };
    await s.setJSON('config', config);
    if (!(await s.get('codes', { type: 'json' }))) await s.setJSON('codes', {});
    return json({ token: sign({ adm: true, exp: Date.now() + ADMIN_MS }, config.secret) });
  }

  if (body.action === 'login') {
    if (!config || !config.adminHash) return json({ error: 'Not set up yet.' }, 400);
    const pw = (body.password || '').toString();
    if (!safeEqualHex(hashPw(pw, config.adminSalt), config.adminHash)) {
      return json({ error: 'Wrong password.' }, 401);
    }
    return json({ token: sign({ adm: true, exp: Date.now() + ADMIN_MS }, config.secret) });
  }

  /* ---------- authenticated ---------- */
  if (!config || !config.secret) return json({ error: 'Not set up.' }, 400);
  const auth = verify(body.token, config.secret);
  if (!auth || !auth.adm) return json({ error: 'Not authorized — sign in again.' }, 401);

  const codes = (await s.get('codes', { type: 'json' })) || {};

  if (body.action === 'list') {
    return json({ codes: Object.values(codes).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) });
  }

  if (body.action === 'create') {
    const name = (body.name || '').toString().trim().slice(0, 60);
    if (!name) return json({ error: 'Give the code a name.' }, 400);
    let pin = (body.pin || '').toString().trim();
    if (pin && !/^\d{4}$/.test(pin)) return json({ error: 'PIN must be 4 digits.' }, 400);
    if (pin) {
      if (Object.values(codes).some((c) => c.pin === pin && !c.revoked)) {
        return json({ error: 'That PIN is already in use.' }, 409);
      }
    } else {
      do { pin = randPin(); } while (Object.values(codes).some((c) => c.pin === pin && !c.revoked));
    }
    const cid = randId();
    let expiresAt = null;
    if (body.expiresAt) { const n = Number(body.expiresAt); if (Number.isFinite(n)) expiresAt = n; }
    codes[cid] = { id: cid, name, pin, createdAt: Date.now(), expiresAt, revoked: false, lastUsedAt: null };
    await s.setJSON('codes', codes);
    return json({ code: codes[cid] });
  }

  if (body.action === 'revoke' || body.action === 'restore') {
    const c = codes[body.id];
    if (!c) return json({ error: 'Not found.' }, 404);
    c.revoked = body.action === 'revoke';
    await s.setJSON('codes', codes);
    return json({ ok: true, code: c });
  }

  if (body.action === 'delete') {
    if (!codes[body.id]) return json({ error: 'Not found.' }, 404);
    delete codes[body.id];
    await s.setJSON('codes', codes);
    // purgeLog: also remove the driver's server log (used by the system self-test cleanup)
    if (body.purgeLog) { try { await s.delete('log_' + body.id); } catch {} }
    return json({ ok: true });
  }

  if (body.action === 'selftest') {
    // Blob storage round-trip: write → read → delete a scratch key.
    const t0 = Date.now();
    const val = { at: t0, nonce: Math.random().toString(36).slice(2) };
    await s.setJSON('selftest', val);
    const back = await s.get('selftest', { type: 'json' });
    try { await s.delete('selftest'); } catch {}
    if (!back || back.nonce !== val.nonce) return json({ error: 'blob round-trip failed' }, 500);
    return json({ ok: true, ms: Date.now() - t0 });
  }

  if (body.action === 'logRoster') {
    const out = [];
    for (const c of Object.values(codes)) {
      const log = await s.get('log_' + c.id, { type: 'json' });
      const entries = (log && log.entries) ? log.entries.filter((e) => !e.deleted) : [];
      out.push({
        cid: c.id, name: c.name, revoked: !!c.revoked,
        count: entries.length,
        lastUpdated: entries.reduce((m, e) => Math.max(m, e.updatedAt || e.id || 0), 0) || null
      });
    }
    out.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
    return json({ roster: out });
  }

  if (body.action === 'driverLog') {
    const c = codes[body.id];
    const log = await s.get('log_' + body.id, { type: 'json' });
    const entries = (log && log.entries) ? log.entries.filter((e) => !e.deleted) : [];
    return json({ name: (c && c.name) || (log && log.name) || 'Driver', entries });
  }

  if (body.action === 'changePassword') {
    if (!safeEqualHex(hashPw((body.current || '').toString(), config.adminSalt), config.adminHash)) {
      return json({ error: 'Current password is wrong.' }, 401);
    }
    const np = (body.newPassword || '').toString();
    if (np.length < 6) return json({ error: 'Use at least 6 characters.' }, 400);
    const salt = randSalt();
    config.adminSalt = salt; config.adminHash = hashPw(np, salt);
    await s.setJSON('config', config);
    return json({ ok: true });
  }

  return json({ error: 'unknown action' }, 400);
};

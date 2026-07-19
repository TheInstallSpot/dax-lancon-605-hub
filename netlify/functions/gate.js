/* Racer gate: 4-digit PIN login + token validation.
   POST { action:'login', pin }        -> { token, name }
   POST { action:'validate', token }   -> { valid, name? } */
import { store, json, sign, verify, readBody, clientIp } from './_lib.js';

const LOCK_TRIES = 8;
const LOCK_MS = 15 * 60 * 1000;
const TOKEN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days offline grace

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const body = await readBody(req);
  if (!body) return json({ error: 'bad request' }, 400);
  const s = store();
  const config = await s.get('config', { type: 'json' });

  if (body.action === 'login') {
    const pin = (body.pin || '').toString().trim();
    if (!/^\d{4,8}$/.test(pin)) return json({ error: 'Enter your code.' }, 400);
    if (!config || !config.secret) return json({ error: 'The app isn’t set up yet — ask Lee.' }, 403);

    const ip = clientIp(req);
    const rlKey = 'rl_' + ip.replace(/[^a-z0-9]/gi, '').slice(0, 40);
    const rl = (await s.get(rlKey, { type: 'json' })) || { fails: 0, until: 0 };
    const now = Date.now();
    if (rl.until && now < rl.until) return json({ error: 'Too many tries — wait a few minutes.' }, 429);

    const codes = (await s.get('codes', { type: 'json' })) || {};
    const match = Object.values(codes).find(
      (c) => c.pin === pin && !c.revoked && (!c.expiresAt || c.expiresAt > now)
    );
    if (!match) {
      const fails = (rl.fails || 0) + 1;
      await s.setJSON(rlKey, fails >= LOCK_TRIES ? { fails: 0, until: now + LOCK_MS } : { fails, until: 0 });
      return json({ error: 'That code isn’t valid.' }, 401);
    }
    await s.setJSON(rlKey, { fails: 0, until: 0 });
    match.lastUsedAt = now;
    codes[match.id] = match;
    await s.setJSON('codes', codes);
    const token = sign({ cid: match.id, name: match.name, exp: now + TOKEN_MS }, config.secret);
    return json({ token, name: match.name });
  }

  if (body.action === 'validate') {
    if (!config || !config.secret) return json({ valid: false });
    const p = verify(body.token, config.secret);
    if (!p || !p.cid) return json({ valid: false });
    const codes = (await s.get('codes', { type: 'json' })) || {};
    const c = codes[p.cid];
    const now = Date.now();
    const ok = !!c && !c.revoked && (!c.expiresAt || c.expiresAt > now);
    return json({ valid: ok, name: ok ? c.name : undefined });
  }

  return json({ error: 'unknown action' }, 400);
};

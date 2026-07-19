/* Racer log sync (server copy of each driver's log, browsable by admin).
   POST { action:'sync', token, entries:[...] } -> { entries:[...merged] }
   Two-way merge by entry id (newer updatedAt wins; tombstones kept). */
import { store, json, verify, readBody, mergeEntries } from './_lib.js';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const body = await readBody(req);
  if (!body) return json({ error: 'bad request' }, 400);
  const s = store();
  const config = await s.get('config', { type: 'json' });
  if (!config || !config.secret) return json({ error: 'not set up' }, 400);

  const p = verify(body.token, config.secret);
  if (!p || !p.cid) return json({ error: 'unauthorized' }, 401);

  // Only active codes may sync (revoked/expired racers are cut off).
  const codes = (await s.get('codes', { type: 'json' })) || {};
  const c = codes[p.cid];
  const now = Date.now();
  if (!c || c.revoked || (c.expiresAt && c.expiresAt <= now)) {
    return json({ error: 'revoked' }, 403);
  }

  if (body.action === 'sync') {
    const key = 'log_' + p.cid;
    const prev = (await s.get(key, { type: 'json' })) || { entries: [] };
    const incoming = Array.isArray(body.entries) ? body.entries : [];
    const merged = mergeEntries(prev.entries || [], incoming);
    await s.setJSON(key, { name: c.name, cid: p.cid, updatedAt: now, entries: merged });
    return json({ entries: merged });
  }

  return json({ error: 'unknown action' }, 400);
};

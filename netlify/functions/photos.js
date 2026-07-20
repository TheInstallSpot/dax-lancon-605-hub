/* Team photos: guide-slot photos (admin) + event/log photos (racers).
   Storage: Netlify Blobs store 'dlr605-photos'.
     guide/<slot>      — one photo per guide slot, replaceable (admin only)
     evt/<cid>/<id>    — photos a racer attaches to their log entries
     guideindex        — JSON { slot: { v, ct } } for client rendering

   GET  ?get=<key>                → streams the image (long-cache; URLs are versioned)
   POST { action, ... }           → guideIndex | upload | deletePhoto | guideUpload | guideDelete */
import { store, photoStore, json, verify, readBody } from './_lib.js';

const MAX_B64 = 6_000_000;            // ~4.4 MB binary — client resizes well below this
const OK_CT = ['image/jpeg', 'image/png', 'image/webp'];

function parseDataUrl(d) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(d || '');
  if (!m || m[2].length > MAX_B64) return null;
  try { return { ct: m[1], buf: Buffer.from(m[2], 'base64') }; } catch { return null; }
}
const randId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export default async (req) => {
  const url = new URL(req.url);

  /* ---------- serve an image ---------- */
  if (req.method === 'GET') {
    const key = url.searchParams.get('get') || '';
    if (!/^(guide|evt)\//.test(key)) return json({ error: 'bad key' }, 400);
    const ps = photoStore();
    const res = await ps.getWithMetadata(key, { type: 'arrayBuffer' });
    if (!res || !res.data) return new Response('not found', { status: 404 });
    const ct = (res.metadata && res.metadata.ct && OK_CT.includes(res.metadata.ct)) ? res.metadata.ct : 'image/jpeg';
    return new Response(res.data, {
      status: 200,
      headers: {
        'content-type': ct,
        // URLs carry ?v=<version>, so hard caching is safe
        'cache-control': 'public, max-age=31536000, immutable'
      }
    });
  }

  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const body = await readBody(req);
  if (!body) return json({ error: 'bad request' }, 400);
  const ps = photoStore();

  /* ---------- public: guide photo index ---------- */
  if (body.action === 'guideIndex') {
    const idx = (await ps.get('guideindex', { type: 'json' })) || {};
    return json({ index: idx });
  }

  /* ---------- everything else needs a token ---------- */
  const s = store();
  const config = await s.get('config', { type: 'json' });
  if (!config || !config.secret) return json({ error: 'not set up' }, 400);
  const auth = verify(body.token, config.secret);
  if (!auth) return json({ error: 'unauthorized' }, 401);
  const isAdmin = !!auth.adm;

  /* racer helpers */
  const activeRacer = async () => {
    if (!auth.cid) return null;
    const codes = (await s.get('codes', { type: 'json' })) || {};
    const c = codes[auth.cid];
    if (!c || c.revoked || (c.expiresAt && c.expiresAt <= Date.now())) return null;
    return c;
  };

  if (body.action === 'upload') {
    const c = await activeRacer();
    if (!c) return json({ error: 'unauthorized' }, 403);
    const img = parseDataUrl(body.data);
    if (!img) return json({ error: 'Bad or oversized image.' }, 400);
    const id = randId();
    const key = `evt/${auth.cid}/${id}`;
    await ps.set(key, img.buf, { metadata: { ct: img.ct } });
    return json({ key, v: Date.now() });
  }

  if (body.action === 'deletePhoto') {
    const key = (body.key || '').toString();
    if (!/^evt\//.test(key)) return json({ error: 'bad key' }, 400);
    const own = auth.cid && key.startsWith('evt/' + auth.cid + '/');
    if (!own && !isAdmin) return json({ error: 'not yours' }, 403);
    try { await ps.delete(key); } catch {}
    return json({ ok: true });
  }

  if (body.action === 'guideUpload') {
    if (!isAdmin) return json({ error: 'admin only' }, 403);
    const slot = (body.slot || '').toString().replace(/[^a-z0-9-]/g, '').slice(0, 80);
    if (!slot) return json({ error: 'bad slot' }, 400);
    const img = parseDataUrl(body.data);
    if (!img) return json({ error: 'Bad or oversized image.' }, 400);
    await ps.set('guide/' + slot, img.buf, { metadata: { ct: img.ct } });
    const idx = (await ps.get('guideindex', { type: 'json' })) || {};
    idx[slot] = { v: Date.now(), ct: img.ct };
    await ps.setJSON('guideindex', idx);
    return json({ slot, v: idx[slot].v });
  }

  if (body.action === 'guideDelete') {
    if (!isAdmin) return json({ error: 'admin only' }, 403);
    const slot = (body.slot || '').toString().replace(/[^a-z0-9-]/g, '');
    try { await ps.delete('guide/' + slot); } catch {}
    const idx = (await ps.get('guideindex', { type: 'json' })) || {};
    delete idx[slot];
    await ps.setJSON('guideindex', idx);
    return json({ ok: true });
  }

  return json({ error: 'unknown action' }, 400);
};

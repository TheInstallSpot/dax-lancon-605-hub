/* Shared helpers for the 605 hub serverless functions.
   Zero external deps beyond @netlify/blobs + node:crypto. */
import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

export const STORE = 'dlr605-auth';
// strong consistency: a code created/revoked in admin is IMMEDIATELY visible to
// gate logins and sync checks (default 'eventual' can serve stale reads).
export const store = () => getStore({ name: STORE, consistency: 'strong' });

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });

const b64url = (buf) => Buffer.from(buf).toString('base64url');

/* Minimal signed token: base64url(payload).hmacSHA256 */
export function sign(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return body + '.' + sig;
}
export function verify(token, secret) {
  if (!token || typeof token !== 'string' || token.indexOf('.') < 0) return null;
  const [body, sig] = token.split('.');
  const expect = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!sig || sig.length !== expect.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  } catch { return null; }
  let p;
  try { p = JSON.parse(Buffer.from(body, 'base64url').toString()); } catch { return null; }
  if (p.exp && Date.now() > p.exp) return null;
  return p;
}

export function hashPw(pw, salt) {
  return crypto.pbkdf2Sync(pw, salt, 100000, 32, 'sha256').toString('hex');
}
export function safeEqualHex(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; }
}
export const randId = () => crypto.randomBytes(6).toString('hex');
export const randPin = () => String(Math.floor(1000 + Math.random() * 9000));
export const randSecret = () => crypto.randomBytes(32).toString('hex');
export const randSalt = () => crypto.randomBytes(16).toString('hex');

export async function readBody(req) {
  try { return await req.json(); } catch { return null; }
}
export function clientIp(req) {
  return (req.headers.get('x-nf-client-connection-ip') ||
          req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
}

/* Merge two log-entry arrays by id; newer updatedAt wins. Keeps tombstones. */
export function mergeEntries(a = [], b = []) {
  const map = new Map();
  for (const e of [...a, ...b]) {
    if (!e || e.id == null) continue;
    const cur = map.get(e.id);
    if (!cur || (e.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(e.id, e);
  }
  return [...map.values()].sort((x, y) => (y.updatedAt || y.id || 0) - (x.updatedAt || x.id || 0));
}

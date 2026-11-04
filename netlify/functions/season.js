/* 2027 season planner (shared by the whole team).
   POST { action:'get',  token }                         -> { races, checklist, serverTime }
   POST { action:'sync', token, races:[...], checklist:[...] } -> merged { races, checklist, serverTime }
   Any active racer code OR an admin token may read and edit.
   Two-way merge by item id: newer updatedAt wins; deleted items stay as tombstones
   so an offline phone can't resurrect them. Seeded on first read. */
import { store, json, verify, readBody, mergeEntries } from './_lib.js';

const KEY = 'season_2027';
const MAX_ITEMS = 400;

const SEED_RACES = [
  ['r01', 1, 'CKNA', 'Winter Nationals', '2027-01-01', '2027-01-03', '103rd Street Sports Complex', 'Jacksonville, FL', 'LO206', "New Year's weekend. Leave Dallas by Dec 30."],
  ['r02', 2, 'TKL', 'Katy Classic', '2027-03-19', '2027-03-21', 'Gulf Coast Kartway (GCKI)', 'Katy, TX', 'Shifter', ''],
  ['r03', 3, 'APEX', '', '2027-04-23', '2027-04-25', 'SpeedSportz Racing Park', 'New Caney, TX', 'LO206', "APEX hasn't published Texas dates yet; confirm."],
  ['r04', 4, 'TKL', 'Karting Heatwave', '2027-05-29', '2027-05-30', 'SpeedSportz Racing Park', 'New Caney, TX', 'Shifter', 'Memorial Day weekend; book the hotel early.'],
  ['r05', 5, 'APEX', '', '2027-06-18', '2027-06-20', 'North Texas Karters (NTK)', 'Denton, TX', 'LO206', ''],
  ['r06', 6, 'TKL', 'King of the Hill 3', '2027-09-17', '2027-09-19', 'KartMoto', 'Cresson, TX', 'Shifter', 'Back-to-back with APEX at KartMoto the next weekend.'],
  ['r07', 7, 'APEX', '', '2027-09-24', '2027-09-26', 'KartMoto', 'Cresson, TX', 'LO206', ''],
  ['r08', 8, 'TKL', 'Trick or Pass', '2027-10-29', '2027-10-31', 'Gulf Coast Kartway (GCKI)', 'Katy, TX', 'Shifter', 'Halloween weekend.'],
  ['r09', 9, 'TKL', 'Snowbird Grand Finale', '2027-12-04', '2027-12-05', 'SpeedSportz Racing Park', 'New Caney, TX', 'Shifter', ''],
  ['r13', 13, 'DFW TC', '', null, null, 'KartMoto', 'Cresson, TX', '206/Shifter', 'Round order TBA on the Triple Crown Facebook page.'],
  ['r14', 14, 'DFW TC', '', null, null, 'Oklahoma Motorsports Complex', 'Norman, OK', '206/Shifter', ''],
  ['r15', 15, 'DFW TC', '', null, null, '', '', '206/Shifter', 'Third venue TBA.'],
  ['r16', 16, 'CowTown', '', null, null, 'KartMoto', 'Cresson, TX', '206/Shifter', ''],
  ['r17', 17, 'CowTown', '', null, null, 'KartMoto', 'Cresson, TX', '206/Shifter', ''],
  ['r18', 18, 'CowTown', '', null, null, 'KartMoto', 'Cresson, TX', '206/Shifter', ''],
  ['r19', 19, 'CowTown', '', null, null, 'KartMoto', 'Cresson, TX', '206/Shifter', '']
].map(([id, num, series, event, start, end, track, city, kart, notes]) => ({
  id, num, series, event, start, end, track, city, kart, notes, going: 'tbd', result: '', updatedAt: 1
}));

const SEED_CHECKLIST = [
  ['s1', 'season', 'Register for CKNA Winter Nationals (Jan 1–3) as soon as entries open'],
  ['s2', 'season', 'Book Jacksonville lodging for Dec 31 – Jan 3'],
  ['s3', 'season', 'Buy the TKL season pass before Mar 19'],
  ['s4', 'season', "Confirm the shifter fits TKL's FZ125 Shifter class"],
  ['s5', 'season', 'Book Houston hotels for Memorial Day and Halloween weekends'],
  ['s6', 'season', 'Decide on memberships (KartMoto, NTK, GCKI/SpeedSportz)'],
  ['s7', 'season', "Add APEX Texas, Triple Crown and CowTown dates when they're posted"],
  ['s8', 'season', 'Get the TKL shifter number, then order panels from Shaw Stickers'],
  ['w1', 'weekend', 'Pre-register and check the event notice for track direction'],
  ['w2', 'weekend', 'Helmet, suit, gloves, shoes, rib protector, neck brace'],
  ['w3', 'weekend', 'Transponder (charged) and kart numbers'],
  ['w4', 'weekend', 'Tires, fuel and oil per the series rules'],
  ['w5', 'weekend', 'Kart stand, tools, spare chain, sprockets and plugs'],
  ['w6', 'weekend', 'Pop-up tent with weights, chairs, cooler, plenty of water'],
  ['w7', 'weekend', 'Waivers signed and wristbands for everyone in the pits']
].map(([id, section, text], i) => ({ id, section, text, done: false, order: i + 1, updatedAt: 1 }));

/* ---- input hygiene: keep only known fields, as short strings/numbers ---- */
const str = (v, n = 300) => (v == null ? '' : String(v)).slice(0, n);
const date = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const ts = (v) => (Number.isFinite(+v) && +v > 0 ? Math.min(+v, Date.now() + 60000) : 0);
function cleanRace(r) {
  if (!r || r.id == null) return null;
  return {
    id: str(r.id, 40), num: Number.isFinite(+r.num) ? +r.num : null,
    series: str(r.series, 40), event: str(r.event, 80), start: date(r.start), end: date(r.end),
    track: str(r.track, 80), city: str(r.city, 60), kart: str(r.kart, 30),
    going: ['yes', 'no', 'tbd'].includes(r.going) ? r.going : 'tbd',
    result: str(r.result, 120), notes: str(r.notes, 1000), by: str(r.by, 60),
    updatedAt: ts(r.updatedAt), deleted: r.deleted === true || undefined
  };
}
function cleanCheck(c) {
  if (!c || c.id == null) return null;
  return {
    id: str(c.id, 40), section: c.section === 'weekend' ? 'weekend' : 'season',
    text: str(c.text, 200), done: c.done === true, order: Number.isFinite(+c.order) ? +c.order : 0,
    by: str(c.by, 60), updatedAt: ts(c.updatedAt), deleted: c.deleted === true || undefined
  };
}
const cleanList = (arr, fn) => (Array.isArray(arr) ? arr.slice(0, MAX_ITEMS).map(fn).filter(Boolean) : []);

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const body = await readBody(req);
  if (!body) return json({ error: 'bad request' }, 400);
  const s = store();
  const config = await s.get('config', { type: 'json' });
  if (!config || !config.secret) return json({ error: 'not set up' }, 400);

  // Racers (active code) and the admin may both use the season planner.
  const p = verify(body.token, config.secret);
  if (!p) return json({ error: 'unauthorized' }, 401);
  if (!p.adm) {
    if (!p.cid) return json({ error: 'unauthorized' }, 401);
    const codes = (await s.get('codes', { type: 'json' })) || {};
    const c = codes[p.cid];
    if (!c || c.revoked || (c.expiresAt && c.expiresAt <= Date.now())) return json({ error: 'revoked' }, 403);
  }

  let doc = await s.get(KEY, { type: 'json' });
  if (!doc) {
    doc = { races: SEED_RACES, checklist: SEED_CHECKLIST, updatedAt: Date.now() };
    await s.setJSON(KEY, doc);
  }

  if (body.action === 'get') {
    return json({ races: doc.races, checklist: doc.checklist, serverTime: Date.now() });
  }

  if (body.action === 'sync') {
    const races = mergeEntries(doc.races || [], cleanList(body.races, cleanRace)).slice(0, MAX_ITEMS);
    const checklist = mergeEntries(doc.checklist || [], cleanList(body.checklist, cleanCheck)).slice(0, MAX_ITEMS);
    const next = { races, checklist, updatedAt: Date.now() };
    await s.setJSON(KEY, next);
    return json({ races, checklist, serverTime: Date.now() });
  }

  return json({ error: 'unknown action' }, 400);
};

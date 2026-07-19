# Dax Lancon Racing 605 — LO206 Team Hub (PWA)

An installable, offline-capable web app for the team (#605): LO206 how-to guides,
race-day calculators, and an on-device track/setup log. Tailored to our
**VLR Emerald** karts and **Sniper V2 + Linear top plate** alignment tools.

## What's inside
- **Guides (20):** Rules · Tech Inspection · Valve Lash · Alignment · Track Width · Handling Cure Chart · Weather Tuning · Chassis Setup · Weight & Ballast Placement · Brakes · Clutch · MyChron · Race Studio 3 (×2) · Carb · Chain & Sprocket · Tire Prep · Mounting Tires · Break-In · Install the App · Front-End Alignment (VLR Emerald + Sniper V2/top plate) · Track Width (front & rear) · Data — MyChron 6 · Race Studio 3 (desktop + iPhone app) · Carb Tuning · Chain & Sprocket · Clutch (Hilliard Flame) · Tire Prep · Mounting Tires · Brakes (VLR Emerald) · Break-In & Maintenance
- **Tools:** Gear Ratio · Gear Change compare-&-chart · Speed & RPM · Weight & Ballast
- **Tracks:** Layout & info pages for our home tracks (SpeedSportz, NOLA, Dallas Karting Complex, NTK, Amarillo, Kart Moto) — accurate GPS-traced outlines (© OpenStreetMap, ODbL) + official-map slots; feeds the Log track picker
- **Log:** Multi-day **Events** (with per-session results across the weekend) and **Training sessions**, track picker, tap-to-recall, CSV export — all on-device

## Files
```
index.html            app shell + layout
styles.css            styling
content.js            ALL guide content + diagrams   ← edit this to add topics/photos
app.js                rendering, calculators, log, PWA glue
manifest.webmanifest  install metadata
sw.js                 offline service worker (bump CACHE on app changes)
icons/                app icons
images/               real kart photos (see images/README.md)
```

## Deploy (GitHub → Netlify)
This is a static site — files sit at the repo root, no build step.

1. Push this folder to a GitHub repo (files at root, not inside a subfolder).
2. In Netlify: **Add new site → Import from Git →** pick the repo. Build command:
   *(none)*. Publish directory: `/` (root). Deploy.
3. Optional: add a custom subdomain like `hub.theinstallspot.com` in Netlify →
   Domain settings (free HTTPS).

All paths in the app are **relative**, so it also works fine served from a
subpath (e.g. GitHub Pages project sites at `/repo/`).

### The edit → commit → deploy loop
- Edit `content.js` (add a topic, tweak text, add a photo block).
- **Bump the cache:** increment `CACHE` in `sw.js` (`v4` → `v5`) so installed
  phones pull the update instead of serving the old cached version.
- Commit + push → Netlify auto-deploys. Reopen the app; it updates.

## Add / edit a topic
Add an object to the `TOPICS` array in `content.js`. Block types:
`h`, `p`, `list`, `steps`, `warn`, `tip`, `note`, `table`, `diagram`, `img`.

## Add real photos
See `images/README.md`. Drop a photo in `images/`, add
`{ img: 'images/name.jpg', caption: '…' }` to the relevant guide. Missing photos
render a labeled "PHOTO TO ADD" placeholder, so the guides double as a shot list.
Photos are cached in a **separate persistent store**, so updating guide text
never wipes downloaded pictures.

## Install on a phone
Open the hosted URL in Chrome/Safari → "Add to Home Screen." It installs like a
native app and works offline in the pits.

## Notes
- Alignment baselines are from RLV's VLR Emerald setup sheet; always confirm
  against your current rulebook and validate on track.
- The carb / tire / break-in modules are starter content flagged for expansion.

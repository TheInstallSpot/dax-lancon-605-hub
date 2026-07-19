/* =====================================================================
   Dax Lancon Racing 605 — LO206 Team Hub
   content.js  ·  All how-to / reference content lives here.

   HOW TO ADD A TOPIC (this is the extensible part):
   Add an object to the TOPICS array below. Shape:
   {
     id:    'unique-id',
     title: 'Display Title',
     tag:   'Short category tag',
     icon:  '<svg…>',              // small nav icon (24x24 viewBox)
     summary: 'one-line description shown on the card',
     sections: [ …blocks… ]
   }
   A section block is one of:
     { h: 'Heading' }
     { p: 'Paragraph text (supports <b>, <i> inline HTML).' }
     { list: ['item', 'item', …] }            // bulleted
     { steps: ['step', 'step', …] }           // numbered
     { warn: 'Caution text' }                 // red warning box
     { tip:  'Pro-tip text' }                 // green tip box
     { note: 'Neutral note text' }            // blue note box
     { table: { head:['A','B'], rows:[['1','2'],…] } }
     { diagram: 'svg-key' }                    // pulls from DIAGRAMS below
     { img: 'images/name.jpg', caption: '…' }  // real photo (see below)

   ADDING REAL PHOTOS OF OUR KART:
   1. Drop the photo in the images/ folder (see images/README for naming
      + recommended size ~1400px wide, compressed).
   2. Add a block:  { img: 'images/valve-lash-feeler.jpg',
                      caption: 'Feeler gauge in the rocker gap' }
      Optional: alt: 'accessibility text'.
   3. Until the file exists, the app shows a labeled "PHOTO TO ADD"
      placeholder with the filename — so these double as a shot list.
      Delete a block to remove a slot.
   ===================================================================== */

/* ---------- Labeled SVG diagrams (drawn, not photographed) ---------- */
const DIAGRAMS = {

  valvetrain: `
  <svg viewBox="0 0 520 340" role="img" aria-label="LO206 valvetrain cross-section showing valve lash gap">
    <defs>
      <linearGradient id="metal" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#5b6472"/><stop offset="1" stop-color="#39414d"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="520" height="340" fill="none"/>
    <!-- cylinder head block -->
    <rect x="40" y="210" width="440" height="90" rx="6" fill="#2a3038" stroke="#11151b"/>
    <text x="260" y="278" text-anchor="middle" fill="#8b94a3" font-size="13" font-family="system-ui">CYLINDER HEAD</text>

    <!-- valve stem -->
    <rect x="250" y="150" width="14" height="120" fill="url(#metal)" stroke="#11151b"/>
    <!-- valve spring -->
    <path d="M232 250 h50 M232 240 h50 M232 230 h50 M232 220 h50 M232 210 h50" stroke="#7f8a99" stroke-width="4" fill="none"/>
    <text x="257" y="292" text-anchor="middle" fill="#c7ccd4" font-size="12" font-family="system-ui">valve</text>

    <!-- rocker arm -->
    <g>
      <path d="M120 150 L300 130 L300 150 L140 172 Z" fill="url(#metal)" stroke="#11151b"/>
      <circle cx="210" cy="150" r="9" fill="#20262e" stroke="#11151b"/>
      <text x="180" y="120" text-anchor="middle" fill="#c7ccd4" font-size="12" font-family="system-ui">rocker arm</text>
    </g>

    <!-- pushrod -->
    <rect x="118" y="150" width="10" height="120" fill="url(#metal)" stroke="#11151b"/>
    <text x="96" y="215" text-anchor="middle" fill="#c7ccd4" font-size="12" font-family="system-ui" transform="rotate(-90 96 215)">pushrod</text>

    <!-- adjuster screw + jam nut at rocker pivot end (right) -->
    <rect x="296" y="126" width="14" height="20" fill="#b3e02f" stroke="#5f7a1f"/>
    <text x="360" y="118" text-anchor="start" fill="#c6f53c" font-size="12" font-family="system-ui">adjuster screw</text>
    <text x="360" y="134" text-anchor="start" fill="#c6f53c" font-size="12" font-family="system-ui">+ jam nut</text>
    <line x1="356" y1="114" x2="312" y2="130" stroke="#c6f53c" stroke-width="1"/>

    <!-- LASH GAP callout between rocker tip and valve stem top -->
    <line x1="257" y1="150" x2="257" y2="150" />
    <rect x="248" y="146" width="18" height="6" fill="#e23b3b"/>
    <line x1="330" y1="149" x2="270" y2="149" stroke="#e23b3b" stroke-width="1.5"/>
    <text x="336" y="153" fill="#ff5a5a" font-size="14" font-weight="700" font-family="system-ui">LASH GAP</text>
    <text x="336" y="171" fill="#ff8a8a" font-size="11" font-family="system-ui">(measured with feeler gauge)</text>

    <text x="260" y="24" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Where valve lash lives</text>
    <text x="260" y="44" text-anchor="middle" fill="#9aa3b2" font-size="12" font-family="system-ui">Clearance between the rocker tip and the valve stem, valve fully closed</text>
  </svg>`,

  tdc: `
  <svg viewBox="0 0 520 340" role="img" aria-label="Piston position slightly past top dead center on the compression stroke">
    <text x="260" y="24" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Get the piston to TDC — then a hair past</text>
    <!-- cylinder bore -->
    <rect x="200" y="60" width="120" height="230" rx="6" fill="#20262e" stroke="#11151b"/>
    <!-- both valves closed at top -->
    <rect x="222" y="60" width="12" height="40" fill="#5b6472" stroke="#11151b"/>
    <rect x="286" y="60" width="12" height="40" fill="#5b6472" stroke="#11151b"/>
    <text x="228" y="52" text-anchor="middle" fill="#8ecf8e" font-size="10" font-family="system-ui">closed</text>
    <text x="292" y="52" text-anchor="middle" fill="#8ecf8e" font-size="10" font-family="system-ui">closed</text>
    <!-- piston slightly down from top -->
    <rect x="204" y="150" width="112" height="60" rx="4" fill="url(#metal)" stroke="#11151b"/>
    <line x1="260" y1="210" x2="260" y2="285" stroke="#39414d" stroke-width="8"/>
    <text x="260" y="184" text-anchor="middle" fill="#e8ebf0" font-size="12" font-family="system-ui">piston</text>
    <!-- gap arrow from head to piston crown -->
    <line x1="360" y1="102" x2="360" y2="150" stroke="#c6f53c" stroke-width="1.5" marker-end="url(#ar)" marker-start="url(#ar)"/>
    <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#c6f53c"/></marker></defs>
    <text x="372" y="128" fill="#c6f53c" font-size="12" font-family="system-ui">~1/4 in.</text>
    <text x="372" y="144" fill="#9aa3b2" font-size="11" font-family="system-ui">past TDC</text>
    <text x="120" y="150" fill="#9aa3b2" font-size="11" font-family="system-ui" text-anchor="middle">Both valves</text>
    <text x="120" y="166" fill="#9aa3b2" font-size="11" font-family="system-ui" text-anchor="middle">fully closed =</text>
    <text x="120" y="182" fill="#9aa3b2" font-size="11" font-family="system-ui" text-anchor="middle">compression</text>
    <text x="120" y="198" fill="#9aa3b2" font-size="11" font-family="system-ui" text-anchor="middle">stroke</text>
    <text x="260" y="315" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">Going slightly past TDC clears the compression-release bump so the lifter sits on the cam base circle</text>
  </svg>`,

  feeler: `
  <svg viewBox="0 0 520 300" role="img" aria-label="Inserting a feeler gauge between the rocker and valve stem">
    <text x="260" y="24" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Feeler-gauge feel: light slip-and-drag</text>
    <!-- rocker tip -->
    <path d="M120 120 L300 108 L300 128 L140 142 Z" fill="url(#metal)" stroke="#11151b"/>
    <text x="180" y="98" text-anchor="middle" fill="#c7ccd4" font-size="12" font-family="system-ui">rocker tip</text>
    <!-- valve stem -->
    <rect x="250" y="150" width="16" height="90" fill="url(#metal)" stroke="#11151b"/>
    <text x="258" y="262" text-anchor="middle" fill="#c7ccd4" font-size="12" font-family="system-ui">valve stem</text>
    <!-- feeler blade sliding in -->
    <rect x="300" y="140" width="150" height="6" rx="3" fill="#b9c2d0" stroke="#6d7686"/>
    <rect x="440" y="132" width="40" height="22" rx="3" fill="#c6f53c" stroke="#5f7a1f"/>
    <text x="380" y="132" text-anchor="middle" fill="#e8ebf0" font-size="12" font-family="system-ui">feeler gauge</text>
    <!-- the gap -->
    <line x1="258" y1="128" x2="258" y2="150" stroke="#ff5a5a" stroke-width="2"/>
    <text x="196" y="176" fill="#ff8a8a" font-size="12" font-family="system-ui">the gap you're setting</text>
    <text x="260" y="288" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">Right size = light drag as it slides. Falls in loose = too big. Won't enter = too tight.</text>
  </svg>`,

  caster: `
  <svg viewBox="0 0 520 300" role="img" aria-label="Caster: side view of the kingpin axis tilted relative to vertical">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Caster — side view</text>
    <!-- ground -->
    <line x1="40" y1="255" x2="480" y2="255" stroke="#3a4552" stroke-width="3"/>
    <!-- direction of travel -->
    <line x1="360" y1="60" x2="440" y2="60" stroke="#9aa3b2" stroke-width="1.5" marker-end="url(#arr2)"/>
    <defs><marker id="arr2" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#9aa3b2"/></marker></defs>
    <text x="400" y="50" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">direction of travel →</text>
    <!-- wheel -->
    <circle cx="210" cy="200" r="55" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    <circle cx="210" cy="200" r="16" fill="#39414d" stroke="#11151b"/>
    <!-- vertical reference -->
    <line x1="210" y1="90" x2="210" y2="255" stroke="#5a6472" stroke-width="1.5" stroke-dasharray="5 5"/>
    <text x="216" y="104" fill="#7f8a99" font-size="11" font-family="system-ui">vertical</text>
    <!-- kingpin axis tilted: top toward rear (left) -->
    <line x1="188" y1="95" x2="228" y2="255" stroke="#c6f53c" stroke-width="3"/>
    <text x="150" y="98" fill="#c6f53c" font-size="12" font-family="system-ui">kingpin axis</text>
    <!-- angle arc -->
    <path d="M210 150 A 50 50 0 0 0 196 152" fill="none" stroke="#ff5a5a" stroke-width="2"/>
    <text x="150" y="170" fill="#ff8a8a" font-size="13" font-weight="700" font-family="system-ui">caster angle</text>
    <text x="260" y="285" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">Top of the kingpin leaning back = more (positive) caster → more front bite &amp; self-centering</text>
  </svg>`,

  camber: `
  <svg viewBox="0 0 520 300" role="img" aria-label="Camber: front view of tires tilted from vertical">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Camber — front view (looking at the kart)</text>
    <line x1="30" y1="245" x2="490" y2="245" stroke="#3a4552" stroke-width="3"/>
    <!-- left tire: negative camber (top tilts toward center/right) -->
    <g transform="rotate(9 150 190)">
      <rect x="132" y="120" width="36" height="125" rx="6" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    </g>
    <line x1="150" y1="110" x2="150" y2="245" stroke="#5a6472" stroke-width="1.3" stroke-dasharray="5 5"/>
    <text x="150" y="270" text-anchor="middle" fill="#ff8a8a" font-size="12" font-weight="700" font-family="system-ui">NEGATIVE</text>
    <text x="150" y="286" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">top leans in</text>
    <!-- right tire: positive camber (top tilts out/right) -->
    <g transform="rotate(-9 370 190)">
      <rect x="352" y="120" width="36" height="125" rx="6" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    </g>
    <line x1="370" y1="110" x2="370" y2="245" stroke="#5a6472" stroke-width="1.3" stroke-dasharray="5 5"/>
    <text x="370" y="270" text-anchor="middle" fill="#8ecf8e" font-size="12" font-weight="700" font-family="system-ui">POSITIVE</text>
    <text x="370" y="286" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">top leans out</text>
    <!-- center kart marker -->
    <text x="260" y="150" text-anchor="middle" fill="#7f8a99" font-size="11" font-family="system-ui">kart</text>
    <text x="260" y="166" text-anchor="middle" fill="#7f8a99" font-size="11" font-family="system-ui">center</text>
    <path d="M245 175 h30" stroke="#5a6472" stroke-width="1" stroke-dasharray="3 3"/>
  </svg>`,

  toe: `
  <svg viewBox="0 0 520 300" role="img" aria-label="Toe: top view of the front wheels angled in or out">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Toe — top-down view (front of kart at top)</text>
    <text x="260" y="44" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">▲ front</text>
    <!-- TOE-OUT (left half) -->
    <text x="140" y="70" text-anchor="middle" fill="#8ecf8e" font-size="12" font-weight="700" font-family="system-ui">TOE-OUT</text>
    <g transform="rotate(-10 95 160)"><rect x="83" y="110" width="24" height="100" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/></g>
    <g transform="rotate(10 185 160)"><rect x="173" y="110" width="24" height="100" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/></g>
    <text x="140" y="250" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">fronts splayed apart</text>
    <text x="140" y="266" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">→ sharper turn-in</text>
    <!-- divider -->
    <line x1="260" y1="60" x2="260" y2="270" stroke="#293341" stroke-width="1.5"/>
    <!-- TOE-IN (right half) -->
    <text x="380" y="70" text-anchor="middle" fill="#ff8a8a" font-size="12" font-weight="700" font-family="system-ui">TOE-IN</text>
    <g transform="rotate(10 335 160)"><rect x="323" y="110" width="24" height="100" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/></g>
    <g transform="rotate(-10 425 160)"><rect x="413" y="110" width="24" height="100" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/></g>
    <text x="380" y="250" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">fronts pinched together</text>
    <text x="380" y="266" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">→ more stable, straighter</text>
  </svg>`,

  trackwidth: `
  <svg viewBox="0 0 520 320" role="img" aria-label="Top-down view of kart front and rear track width">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Track width — top-down (front at top)</text>
    <!-- chassis rails -->
    <path d="M250 95 L250 235 M270 95 L270 235" stroke="#39414d" stroke-width="3"/>
    <path d="M188 100 H332 M150 225 H370" stroke="#39414d" stroke-width="3"/>
    <!-- front wheels (narrower) -->
    <rect x="176" y="80" width="24" height="52" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    <rect x="320" y="80" width="24" height="52" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    <!-- rear wheels (wider) -->
    <rect x="128" y="200" width="28" height="60" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    <rect x="364" y="200" width="28" height="60" rx="5" fill="#20262e" stroke="#11151b" stroke-width="3"/>
    <!-- front dimension -->
    <line x1="188" y1="58" x2="332" y2="58" stroke="#c6f53c" stroke-width="1.5" marker-start="url(#tw)" marker-end="url(#tw)"/>
    <defs><marker id="tw" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#c6f53c"/></marker></defs>
    <text x="260" y="52" text-anchor="middle" fill="#c6f53c" font-size="12" font-weight="700" font-family="system-ui">FRONT · 44&quot; O/O</text>
    <!-- rear dimension -->
    <line x1="142" y1="285" x2="378" y2="285" stroke="#c6f53c" stroke-width="1.5" marker-start="url(#tw)" marker-end="url(#tw)"/>
    <text x="260" y="303" text-anchor="middle" fill="#c6f53c" font-size="12" font-weight="700" font-family="system-ui">REAR · 49&quot; O/O</text>
    <!-- adjust arrows -->
    <text x="120" y="110" text-anchor="middle" fill="#8ecf8e" font-size="16" font-family="system-ui">↔</text>
    <text x="400" y="110" text-anchor="middle" fill="#8ecf8e" font-size="16" font-family="system-ui">↔</text>
    <text x="96" y="235" text-anchor="middle" fill="#8ecf8e" font-size="16" font-family="system-ui">↔</text>
    <text x="424" y="235" text-anchor="middle" fill="#8ecf8e" font-size="16" font-family="system-ui">↔</text>
    <text x="260" y="165" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">Front: spacers on the spindle · Rear: slide hubs on the axle</text>
  </svg>`,

  mychron: `
  <svg viewBox="0 0 520 380" role="img" aria-label="MyChron 6 connections: display on wheel, RPM lead on plug wire, CHT sensor under the spark plug">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">MyChron 6 — how it connects</text>
    <!-- unit -->
    <rect x="180" y="44" width="160" height="80" rx="12" fill="#454c58" stroke="#11151b" stroke-width="2"/>
    <rect x="192" y="70" width="136" height="42" rx="4" fill="#0e141c" stroke="#11151b"/>
    <text x="260" y="96" text-anchor="middle" fill="#5ecb7e" font-size="13" font-family="system-ui" font-weight="700">12,340 · 168°F</text>
    <!-- shift LEDs -->
    <circle cx="205" cy="57" r="4" fill="#5ecb7e"/><circle cx="232" cy="57" r="4" fill="#5ecb7e"/><circle cx="260" cy="57" r="4" fill="#c6f53c"/><circle cx="288" cy="57" r="4" fill="#c6f53c"/><circle cx="315" cy="57" r="4" fill="#ff5a5a"/>
    <text x="260" y="140" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">On the steering wheel · GPS + Wi-Fi + battery inside · USB-C charge</text>
    <!-- engine -->
    <rect x="205" y="300" width="110" height="60" rx="6" fill="#2a3038" stroke="#11151b"/>
    <text x="260" y="336" text-anchor="middle" fill="#8b94a3" font-size="12" font-family="system-ui">LO206</text>
    <!-- spark plug -->
    <rect x="252" y="276" width="16" height="26" fill="#5b6472" stroke="#11151b"/>
    <!-- CHT ring under plug -->
    <ellipse cx="260" cy="300" rx="16" ry="5" fill="none" stroke="#c6f53c" stroke-width="3"/>
    <!-- plug wire curving up-left -->
    <path d="M260 276 C 250 230, 180 230, 165 175" fill="none" stroke="#6d7686" stroke-width="5"/>
    <!-- RPM lead coil around the plug wire -->
    <ellipse cx="212" cy="222" rx="12" ry="6" fill="none" stroke="#5aa9ff" stroke-width="2.5" transform="rotate(-35 212 222)"/>
    <ellipse cx="200" cy="238" rx="12" ry="6" fill="none" stroke="#5aa9ff" stroke-width="2.5" transform="rotate(-35 200 238)"/>
    <ellipse cx="188" cy="254" rx="12" ry="6" fill="none" stroke="#5aa9ff" stroke-width="2.5" transform="rotate(-35 188 254)"/>
    <!-- RPM lead from unit to coil -->
    <path d="M210 124 C 190 160, 215 190, 220 210" fill="none" stroke="#5aa9ff" stroke-width="2.5"/>
    <text x="70" y="255" fill="#5aa9ff" font-size="11" font-family="system-ui">RPM lead —</text>
    <text x="70" y="270" fill="#5aa9ff" font-size="11" font-family="system-ui">wrap around the</text>
    <text x="70" y="285" fill="#5aa9ff" font-size="11" font-family="system-ui">spark-plug wire</text>
    <!-- CHT lead from unit to plug -->
    <path d="M310 124 C 340 200, 300 270, 276 296" fill="none" stroke="#c6f53c" stroke-width="2.5"/>
    <text x="360" y="250" fill="#c6f53c" font-size="11" font-family="system-ui">Temp (1T):</text>
    <text x="360" y="265" fill="#c6f53c" font-size="11" font-family="system-ui">CHT copper ring</text>
    <text x="360" y="280" fill="#c6f53c" font-size="11" font-family="system-ui">under the plug</text>
  </svg>`,

  rs3flow: `
  <svg viewBox="0 0 520 220" role="img" aria-label="Race Studio 3 data flow: MyChron records, download to Race Studio 3, then analyze">
    <text x="260" y="24" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">From track to answers</text>
    <!-- Stage 1: MyChron -->
    <rect x="24" y="70" width="120" height="86" rx="10" fill="#1a1823" stroke="#2c2838"/>
    <rect x="40" y="88" width="88" height="34" rx="4" fill="#0e0d13" stroke="#2c2838"/>
    <text x="84" y="110" text-anchor="middle" fill="#5ecb7e" font-size="12" font-weight="700" font-family="system-ui">12,340</text>
    <text x="84" y="142" text-anchor="middle" fill="#a29db2" font-size="10.5" font-family="system-ui">MyChron 6</text>
    <text x="84" y="176" text-anchor="middle" fill="#a29db2" font-size="10.5" font-family="system-ui">records the run</text>
    <!-- arrow 1 -->
    <line x1="150" y1="113" x2="196" y2="113" stroke="#c6f53c" stroke-width="2.5" marker-end="url(#rf)"/>
    <defs><marker id="rf" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#c6f53c"/></marker></defs>
    <text x="173" y="104" text-anchor="middle" fill="#c6f53c" font-size="9.5" font-family="system-ui">Wi-Fi</text>
    <text x="173" y="128" text-anchor="middle" fill="#a29db2" font-size="9.5" font-family="system-ui">/ USB</text>
    <!-- Stage 2: Race Studio 3 -->
    <rect x="202" y="70" width="120" height="86" rx="10" fill="#1a1823" stroke="#2c2838"/>
    <rect x="222" y="86" width="80" height="46" rx="4" fill="#0e0d13" stroke="#2c2838"/>
    <rect x="232" y="120" width="60" height="7" rx="2" fill="#454c58"/>
    <text x="262" y="112" text-anchor="middle" fill="#b79bff" font-size="10" font-family="system-ui">RS3</text>
    <text x="262" y="150" text-anchor="middle" fill="#a29db2" font-size="10.5" font-family="system-ui">download</text>
    <text x="262" y="176" text-anchor="middle" fill="#a29db2" font-size="10.5" font-family="system-ui">laptop or phone</text>
    <!-- arrow 2 -->
    <line x1="328" y1="113" x2="374" y2="113" stroke="#c6f53c" stroke-width="2.5" marker-end="url(#rf)"/>
    <text x="351" y="104" text-anchor="middle" fill="#c6f53c" font-size="9.5" font-family="system-ui">analyze</text>
    <!-- Stage 3: Analysis -->
    <rect x="380" y="70" width="116" height="86" rx="10" fill="#1a1823" stroke="#2c2838"/>
    <!-- mini chart -->
    <polyline points="392,120 410,104 424,112 440,92 458,100 476,86" fill="none" stroke="#c6f53c" stroke-width="2"/>
    <circle cx="466" cy="132" r="10" fill="none" stroke="#b79bff" stroke-width="2"/>
    <text x="438" y="150" text-anchor="middle" fill="#a29db2" font-size="10.5" font-family="system-ui">compare laps</text>
    <text x="438" y="176" text-anchor="middle" fill="#a29db2" font-size="10.5" font-family="system-ui">find lost time</text>
  </svg>`,

  brakes: `
  <svg viewBox="0 0 520 300" role="img" aria-label="VLR Emerald hydraulic brake: pedal, master cylinder, line, caliper, disc, pads and shim">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Emerald hydraulic brake (Easy-Brake)</text>
    <!-- pedal -->
    <line x1="44" y1="120" x2="44" y2="205" stroke="#6d7686" stroke-width="6" stroke-linecap="round"/>
    <circle cx="44" cy="118" r="6" fill="#454c58" stroke="#11151b"/>
    <text x="44" y="228" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">pedal</text>
    <!-- master cylinder + reservoir -->
    <rect x="70" y="150" width="70" height="26" rx="4" fill="#454c58" stroke="#11151b"/>
    <rect x="86" y="126" width="34" height="26" rx="3" fill="#20262e" stroke="#11151b"/>
    <text x="103" y="112" text-anchor="middle" fill="#c7ccd4" font-size="11" font-family="system-ui">reservoir</text>
    <text x="105" y="192" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">master cylinder</text>
    <!-- brake line -->
    <path d="M140 163 C 210 163, 230 172, 300 172" fill="none" stroke="#5aa9ff" stroke-width="3"/>
    <text x="215" y="192" text-anchor="middle" fill="#5aa9ff" font-size="11" font-family="system-ui">brake line (fluid)</text>
    <!-- disc / rotor -->
    <circle cx="385" cy="175" r="72" fill="#20262e" stroke="#4a4560" stroke-width="6"/>
    <circle cx="385" cy="175" r="20" fill="#2a3038" stroke="#11151b"/>
    <line x1="300" y1="175" x2="470" y2="175" stroke="#39414d" stroke-width="8"/>
    <text x="385" y="180" text-anchor="middle" fill="#8b94a3" font-size="11" font-family="system-ui">disc</text>
    <text x="452" y="168" text-anchor="middle" fill="#9aa3b2" font-size="10" font-family="system-ui">axle</text>
    <!-- caliper straddling top of disc -->
    <rect x="356" y="92" width="58" height="34" rx="6" fill="#454c58" stroke="#11151b"/>
    <rect x="368" y="120" width="9" height="20" rx="1" fill="#c6f53c"/>
    <rect x="393" y="120" width="9" height="20" rx="1" fill="#c6f53c"/>
    <text x="300" y="120" text-anchor="middle" fill="#c6f53c" font-size="11" font-family="system-ui">pads</text>
    <line x1="322" y1="124" x2="366" y2="130" stroke="#c6f53c" stroke-width="1"/>
    <!-- shim -->
    <rect x="362" y="120" width="4" height="20" fill="#b79bff"/>
    <text x="430" y="112" text-anchor="start" fill="#b79bff" font-size="11" font-family="system-ui">shim behind pad</text>
    <line x1="428" y1="108" x2="366" y2="128" stroke="#b79bff" stroke-width="1"/>
    <!-- bleed screw -->
    <circle cx="385" cy="88" r="5" fill="#b3e02f" stroke="#5f7a1f"/>
    <text x="385" y="72" text-anchor="middle" fill="#c6f53c" font-size="11" font-family="system-ui">bleed screw</text>
    <text x="300" y="100" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">caliper</text>
  </svg>`,

  clutch: `
  <svg viewBox="0 0 520 320" role="img" aria-label="Hilliard Flame centrifugal clutch — end view: drum, sprocket, shoes, springs, hub on the crankshaft">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Hilliard Flame — how it grabs</text>
    <!-- sprocket teeth ring -->
    <circle cx="255" cy="176" r="112" fill="none" stroke="#3a4552" stroke-width="10" stroke-dasharray="6 7"/>
    <!-- drum -->
    <circle cx="255" cy="176" r="100" fill="#20262e" stroke="#4a4560" stroke-width="9"/>
    <!-- shoes (two arcs that fling outward) -->
    <path d="M 175 130 A 82 82 0 0 1 335 130 L 320 150 A 62 62 0 0 0 190 150 Z" fill="#c6f53c" stroke="#0e0d13" stroke-width="1.5" opacity="0.92"/>
    <path d="M 175 222 A 82 82 0 0 0 335 222 L 320 202 A 62 62 0 0 1 190 202 Z" fill="#c6f53c" stroke="#0e0d13" stroke-width="1.5" opacity="0.92"/>
    <!-- springs (pull shoes inward) -->
    <path d="M205 158 l12 4 l-12 4 l12 4 l-12 4" fill="none" stroke="#b79bff" stroke-width="2"/>
    <path d="M293 158 l12 4 l-12 4 l12 4 l-12 4" fill="none" stroke="#b79bff" stroke-width="2"/>
    <!-- hub + key -->
    <circle cx="255" cy="176" r="26" fill="#454c58" stroke="#11151b"/>
    <rect x="251" y="150" width="8" height="8" fill="#20262e" stroke="#11151b"/>
    <!-- crankshaft -->
    <rect x="60" y="170" width="170" height="12" rx="3" fill="#5b6472" stroke="#11151b"/>
    <text x="90" y="162" fill="#c7ccd4" font-size="11" font-family="system-ui">crankshaft</text>
    <!-- labels -->
    <text x="255" y="180" text-anchor="middle" fill="#e8ebf0" font-size="10" font-family="system-ui">hub</text>
    <text x="410" y="120" fill="#c6f53c" font-size="11" font-family="system-ui">shoes</text>
    <line x1="408" y1="116" x2="330" y2="128" stroke="#c6f53c" stroke-width="1"/>
    <text x="410" y="176" fill="#b79bff" font-size="11" font-family="system-ui">springs</text>
    <line x1="408" y1="172" x2="308" y2="166" stroke="#b79bff" stroke-width="1"/>
    <text x="410" y="230" fill="#9aa3b2" font-size="11" font-family="system-ui">drum</text>
    <line x1="408" y1="226" x2="345" y2="216" stroke="#9aa3b2" stroke-width="1"/>
    <text x="410" y="266" fill="#9aa3b2" font-size="11" font-family="system-ui">sprocket teeth</text>
    <line x1="408" y1="262" x2="330" y2="270" stroke="#9aa3b2" stroke-width="1"/>
    <text x="255" y="306" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">Revs up → shoes fling out against the drum → drum + sprocket drive the chain</text>
  </svg>`,

  tiremount: `
  <svg viewBox="0 0 520 300" role="img" aria-label="Kart wheel and tire cross-section: rim flange, bead seat, drop-center well, beads, valve stem and tire iron">
    <text x="260" y="22" text-anchor="middle" fill="#e8ebf0" font-size="15" font-weight="700" font-family="system-ui">Wheel &amp; tire — cross-section</text>
    <!-- tire carcass -->
    <path d="M162 138 C 150 78, 370 78, 358 138" fill="none" stroke="#20262e" stroke-width="16" stroke-linecap="round"/>
    <!-- rim channel profile -->
    <path d="M150 118 L150 152 L186 152 L196 196 L324 196 L334 152 L370 152 L370 118" fill="none" stroke="#5b6472" stroke-width="7" stroke-linejoin="round"/>
    <!-- beads -->
    <circle cx="168" cy="144" r="11" fill="#0e0d13" stroke="#4a4560" stroke-width="2"/>
    <circle cx="352" cy="144" r="11" fill="#0e0d13" stroke="#4a4560" stroke-width="2"/>
    <!-- valve stem -->
    <rect x="256" y="196" width="8" height="22" rx="2" fill="#454c58" stroke="#11151b"/>
    <!-- tire iron levering the left bead -->
    <line x1="104" y1="92" x2="176" y2="150" stroke="#c6f53c" stroke-width="5" stroke-linecap="round"/>
    <path d="M176 150 l-8 -2 l4 8" fill="#c6f53c"/>
    <!-- labels -->
    <text x="150" y="108" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">rim flange</text>
    <text x="205" y="140" fill="#9aa3b2" font-size="10.5" font-family="system-ui">bead seat</text>
    <line x1="203" y1="144" x2="188" y2="151" stroke="#9aa3b2" stroke-width="1"/>
    <text x="260" y="235" text-anchor="middle" fill="#b79bff" font-size="11" font-family="system-ui">drop-center well</text>
    <line x1="260" y1="222" x2="260" y2="198" stroke="#b79bff" stroke-width="1"/>
    <text x="150" y="176" text-anchor="middle" fill="#c7ccd4" font-size="10.5" font-family="system-ui">bead</text>
    <line x1="156" y1="170" x2="164" y2="153" stroke="#c7ccd4" stroke-width="1"/>
    <text x="300" y="222" text-anchor="middle" fill="#9aa3b2" font-size="10.5" font-family="system-ui">valve stem</text>
    <text x="96" y="82" fill="#c6f53c" font-size="10.5" font-family="system-ui">tire iron</text>
    <text x="260" y="284" text-anchor="middle" fill="#9aa3b2" font-size="11" font-family="system-ui">Trick: push the far bead into the well for slack, then lever the near bead over the flange</text>
  </svg>`
};

/* --------------------------- TOPICS --------------------------- */
const TOPICS = [
  /* ================= RULES — CLASS 206 SENIOR (MEDIUM) ================= */
  {
    id: 'rules-206',
    title: 'Rules — 206 Senior (Medium)',
    tag: 'Class · Legality',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6l1 2h3v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5h3z"/><path d="M9 12l2 2 4-4"/></svg>',
    summary: 'Our class specs plus a plain-English summary of the Briggs 206 rules — stay legal.',
    sections: [
      { p: 'Our class is <b>206 Senior</b>, run at the <b>Medium</b> weight. The LO206 is a <b>sealed spec engine</b> — everyone runs the same motor, so the golden rule is simple: <b>"unless the rules say you can, you can\'t."</b> Briggs controls the engine rules; your sanctioning body (CKNA / WKA / USAC / your track) sets class weights, tires, and everything off the engine.' },
      { warn: 'This is a quick-reference summary of the 2026 Briggs 206 rule set. The official Briggs 206 rulebook and your series\' rules are the authority and they change every year — keep the current PDF in the trailer and confirm before tech.' },

      { h: 'Our class — 206 Senior (Medium)' },
      { table: { head: ['Senior class', 'Min weight (kart + driver)', 'Slide'], rows: [
        ['Senior Light', '340 lb', 'Stock — no restrictor'],
        ['Senior Medium (ours)', '365 lb', 'Stock — no restrictor'],
        ['Senior Heavy', '390 lb', 'Stock — no restrictor']
      ]}},
      { p: 'Age 15+. Senior runs the <b>stock slide (#555590)</b> — no restrictor plate. The weights above are the CKNA structure; your series/track sets the exact minimum and the spec tire (we run Evinco Blue). Always weigh in as-raced with the driver in full gear.' },

      { h: 'The golden rules' },
      { list: [
        'The engine is sealed with <b>two orange seals + a red/black tracer wire</b>. Cut, break, or tamper with a seal = DQ. Wrap them so fuel and chemicals can\'t wick in.',
        '"Unless these rules say you can do it, you cannot." No blueprinting, porting, polishing, sanding, media/glass blasting, or adding/removing material.',
        '<b>Spirit &amp; Intent (the "Syd White" rule):</b> any change made solely to create an advantage is illegal even if a rule doesn\'t spell it out.',
        'Tech may <b>swap your sealed engine, carb, or head</b> for another sealed unit at their discretion — refuse and you\'re DQ\'d.'
      ]},

      { h: 'Carburetor — basically leave it alone' },
      { p: 'The spec carb (#555658, marked #590890) is the most heavily policed part. All you may legally do:' },
      { list: [
        'Set float height by gently bending the small tab on the float arm.',
        'Move the needle-jet C-clip to any of the 5 factory positions.',
        'Fasten the choke open (spring, wire, or rubber band).'
      ]},
      { p: 'Everything else is stock and go/no-go gauged — jets (pilot .0130" no-go; main .0365" go / .039" no-go), emulsion-tube holes, venturi, slide cutaway, intake manifold. <b>No drilling, reaming, or polishing</b>, and air may only enter through the filter horn.' },

      { h: 'Exhaust, air filter, fuel & oil' },
      { list: [
        'Exhaust: RLV header EXF5520 (17.50") or EXF5507/5511 (18.75") + RLV B91XL silencer (#4104), both safety-wired; header wrapped 360° in heat sleeve; RLV support brace mandatory. No O2/EGT/CO2 sensors.',
        'Air filter: B&S green #555729 only, straight onto the carb horn — no adapters, no foam pre-filter, no ram-air (a wet-weather shield is OK).',
        'Fuel: pump premium, ≤ 94 octane, no additives (fuel can be tested).',
        'Oil: quality synthetic ~10W-20 (Briggs 4T), no additives; rocker breather + overflow to a catch can is mandatory.'
      ]},

      { h: 'Clutch (Senior)' },
      { p: 'Senior may run an approved clutch — Hilliard Inferno (Fire / Flame / Blaze / Fury), Max-Torque (Draggin Skin / SS), or Noram (Magnum / GE / Ultimate / Stinger). Run it <b>as shipped</b>: no mixing brands or lines, no removing the grease guard, no coatings, no clutch coolers. OEM springs and weights are your choice but must be unmodified. Claim rule: $160.' },

      { h: 'The numbers they check' },
      { list: [
        '<b>Valve lift</b> is teched at the spring retainer with lash set to <b>zero</b> — max <b>.255"</b> intake and exhaust. So your running valve-lash number is free; tech measures lift at zero. Cam profile is checked at the pushrod.',
        'Ignition: stock green coil, rev limit ~6,150 rpm; spark plug <b>AutoLite AR3910X only</b>; static timing must not exceed <b>26°</b> at a .016" air gap; stock flywheel (min 4 lb 1 oz) and stock key — no offset keyways.'
      ]},
      { note: 'Tires and chassis aren\'t in the Briggs rules — those come from your series. See the Tech Inspection guide for exactly what gets gauged and how to prep. Official source: the Briggs 206 rule set at briggsracing.com.' }
    ]
  },

  /* ================= TECH INSPECTION ================= */
  {
    id: 'tech-inspection',
    title: 'Tech Inspection',
    tag: 'Class · Legality',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/></svg>',
    summary: 'Every tech\'d item, the spec, how to comply, and how to tear down for inspection.',
    sections: [
      { p: 'Tech tears down protested, random, and top-finishing engines against the Briggs go/no-go gauge set (the "A-tool" gauges). Here\'s what gets checked, the spec, and how to present a clean, legal engine so you don\'t fail on something dumb.' },
      { warn: 'Only tech officials break or handle the factory seals — you never tear into a sealed engine yourself. Your job is to show up clean, legal, at weight, and correctly torqued.' },

      { h: 'The quick check — every event' },
      { list: [
        'Both orange seals intact and wrapped (no cuts, no oil-soaked/failed tracer).',
        'Kart + driver at or over class minimum on the official scale (365 lb for Senior Medium).',
        'Correct RLV header (right length), wrapped 360° and safety-wired to the B91XL silencer.',
        'B&S green air filter fitted; catch can present and plumbed; legal fuel and AR3910X plug.'
      ]},

      { h: 'If you get pulled — teardown order' },
      { steps: [
        'Drain the warm oil; remove the RLV pipe and the air filter.',
        'Valve cover off → tech sets lash to zero and measures valve LIFT at the retainer (.255" max intake & exhaust) and can degree the cam at the pushrod.',
        'Head off → RT-1 casting, head thickness (2.431" min), combustion-chamber depth, head gasket (.047" min), and the valves (weight, stem, seats at 30°/45°) and springs.',
        'Carb off → jets, venturi, slide cutaway, needle (A4 tool), emulsion tube, and intake-manifold length/bore — all go/no-go.',
        'Bottom end → piston pop-up (.0035" max), bore (2.693" max), stroke (2.204" max), flywheel weight & key, and ignition timing (≤ 26°).'
      ]},

      { h: 'The specs they gauge' },
      { table: { head: ['Item', 'Spec / limit'], rows: [
        ['Valve lift (lash at 0)', '.255" max — intake & exhaust'],
        ['Cylinder head', 'RT-1 casting · 2.431" min thickness'],
        ['Head gasket', '.047" min thickness'],
        ['Main jet', '.0365" go / .039" no-go'],
        ['Idle/pilot jet', '.0130" no-go'],
        ['Piston pop-up', '.0035" max'],
        ['Cylinder bore', '2.693" max'],
        ['Stroke', '2.204" max'],
        ['Flywheel (fins + 2 bolts)', '4 lb 1 oz min'],
        ['Ignition timing', '26° max @ .016" gap'],
        ['Spark plug', 'AutoLite AR3910X only']
      ]}},

      { h: 'Common ways people fail tech' },
      { list: [
        'Broken or oil-soaked seal / failed tracer wire.',
        'Underweight at the scale (didn\'t account for fuel burn or a lighter driver).',
        'Wrong or non-AutoLite spark plug.',
        'A "cleaned up," drilled, or polished carburetor — the carb is the #1 teardown item.',
        'Wrong RLV header length, or a pipe that isn\'t wrapped and safety-wired.',
        'Missing catch can, ram-air or foam pre-filter, or an air leak into the intake.',
        'Illegal fuel or any additive; adding/removing material anywhere on the engine.'
      ]},

      { h: 'Torque to spec (so nothing\'s loose at tech)' },
      { table: { head: ['Fastener', 'Torque'], rows: [
        ['Cylinder head bolts', '200–220 in-lb'],
        ['Flywheel nut', '105–115 ft-lb'],
        ['Rocker-arm stud', '90–120 in-lb'],
        ['Rocker-arm plate', '70–90 in-lb'],
        ['Spark plug', '140–200 in-lb'],
        ['Carb to manifold', '80–110 in-lb'],
        ['Oil drain plug', '100–125 in-lb']
      ]}},
      { tip: 'Keep the current Briggs 206 rulebook and your series\' supps in the trailer, and confirm any spec before an event — the rules update every year.' }
    ]
  },

  /* ========================= VALVE LASH ========================= */
  {
    id: 'valve-lash',
    title: 'Setting Valve Lash',
    tag: 'Engine · Core skill',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 6l-4 4"/><path d="M4 20l6-6"/><circle cx="17" cy="7" r="3"/><path d="M12 12l6 6"/></svg>',
    summary: 'Full step-by-step with diagrams, torque, and lash ranges for different purposes.',
    sections: [
      { p: 'Valve lash is the tiny air gap between the rocker arm and the valve stem when the valve is <b>fully closed</b> (the cam lifter sitting on its base circle). It is the single most important routine adjustment on the LO206. Get it right and the engine makes clean, repeatable power; get it wrong and you either leave power on the table or burn an exhaust valve.' },
      { diagram: 'valvetrain' },
      { warn: 'The exhaust valve is the one that dies. If lash is too tight, the valve is held slightly open when the engine is hot, it can\'t shed heat into the seat, and it burns — you lose compression and the engine goes flat. When in doubt, run a hair looser, never tighter.' },

      { h: 'What you need' },
      { list: [
        'Feeler gauge set with blades from about .001" to .010" (a go/no-go or angled blade makes the tight rocker area easier).',
        'A way to rotate the crankshaft — socket on the flywheel/PTO nut, or pull the starter/clutch by hand.',
        'Wrench for the rocker jam (lock) nut and a screwdriver or wrench for the adjuster.',
        'Valve-cover gasket (the LO206 gasket is reusable if it\'s in good shape), and a rag.',
        'Spark plug socket — pulling the plug makes the engine turn over easily and lets you feel TDC.'
      ]},

      { h: 'Step by step' },
      { steps: [
        'Start cold. Set lash on a stone-cold engine, or at least always at the same temperature every time. Metal grows as it heats and the gap changes, so consistency is what makes your numbers mean anything.',
        'Remove the spark plug and the valve cover. With the plug out the engine spins freely and you can feel compression.',
        'Find TDC on the compression stroke. Slowly rotate the crank in its normal running direction. Watch the rockers: when both are loose and rocking free and the piston is at the top, you\'re on the compression stroke (not the exhaust stroke). Confirm the piston is at the top with a pencil, wood dowel, or plastic straw in the plug hole.',
        'Go a hair past TDC. Rotate a little further so the piston drops roughly 1/4 inch down the bore. This moves the cam past the compression-release bump so the lifter is truly on the base circle. This step is specific to the LO206 and is where a lot of people set lash wrong.',
        'Measure. Slide the correct feeler blade between the rocker tip and the valve stem. You want a light slip-and-drag — the blade moves with slight resistance. If it drops in with no drag the gap is too big; if it won\'t go in, too tight.',
        'Adjust if needed. Loosen the jam nut, turn the adjuster screw to grow or shrink the gap, then hold the adjuster still and re-tighten the jam nut. Tightening the jam nut almost always nudges the setting, so re-check every valve after you lock it down.',
        'Do the other valve, then reinstall. Set both intake and exhaust, re-check both, reinstall the plug and the valve cover.'
      ]},
      { diagram: 'tdc' },
      { diagram: 'feeler' },
      { img: 'images/valve-lash-feeler.jpg', caption: 'Our LO206 — feeler gauge in the rocker gap at the correct slip-and-drag feel.' },
      { note: 'Rocker-arm stud / nut torque per the Briggs 206 guide is about 90–120 in-lbs. Always confirm current numbers against your latest Briggs 206 rulebook/assembly manual before a tech-sensitive rebuild.' },

      { h: 'Lash ranges — what to run and why' },
      { p: 'In the 206 rule set, lash is <b>not</b> a fixed number you must run at the track — tech measures valve <i>lift</i> with lash set to zero, so you\'re free to run what works. The core principle from engine theory: <b>tighter lash = more effective cam duration/overlap = more top-end, less bottom-end. Looser lash = less duration = more bottom-end and a safety margin, slightly less peak.</b> Roughly one degree of duration per .001" of lash. On the 206 the differences are small, so consistency and staying off "too tight" matter more than chasing thousandths.' },
      { table: { head: ['Cold lash (both valves unless noted)', 'Character', 'Use it for'], rows: [
        ['0" – .001" (very tight)', 'Max duration/overlap, most top-end RPM', 'Experienced tuners only, with hot re-checks — high burnt-valve risk'],
        ['.002" – .003" (tight)', 'Leans toward top-end, small safety margin', 'High-speed / long-straight tracks when you\'ve verified hot clearance'],
        ['.004" – .006" (baseline)', 'Balanced, reliable, safe from burnt valves', 'Recommended default and starting point for everyone'],
        ['.006" – .008"+ (loose)', 'Less duration, more low/mid response, safest', 'Tight, low-speed tracks; new engines; anytime you want margin'],
        ['Split, e.g. .002" ex / .006" in', 'Tune intake vs exhaust independently', 'Advanced track-by-track tuning — test, don\'t guess']
      ]}},
      { tip: 'Start every new engine at .004"–.006" both valves. It\'s safe, it\'s close to Briggs\' general OHV range, and it gives you a clean baseline to test against. Only chase tighter numbers once you\'re checking hot lash and logging lap times.' },
      { warn: 'Set at a consistent temperature and remember lash <b>opens up as the engine heats</b> — the exhaust more than the intake. A setting that reads tight-but-fine cold can be your baseline; a setting that\'s near-zero cold can go to zero hot and hold the valve open. If you ever measure zero hot lash on the exhaust, loosen it.' },

      { h: 'Quick troubleshooting' },
      { list: [
        'Flat / low compression after running tight lash: suspect a burnt exhaust valve — leak-down test it.',
        'Ticking/clatter that gets worse: lash too loose or a loose jam nut. Re-check and re-torque.',
        'Numbers drift between sessions: you\'re setting at different temperatures, or not going past TDC onto the base circle. Fix the procedure, not the engine.'
      ]}
    ]
  },

  /* ====================== FRONT-END ALIGNMENT ====================== */
  {
    id: 'alignment',
    title: 'Front-End Alignment',
    tag: 'Chassis · Core skill',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
    summary: 'Caster, camber & toe on the VLR Emerald — what each does, when to use it, and how to set it with the Sniper V2 + top plate.',
    sections: [
      { p: 'A kart has no differential and a solid rear axle, so it can only turn cleanly if the inside rear wheel <b>lifts</b> and lets the kart rotate. Your front-end geometry — <b>caster, camber, and toe</b> — is what makes that happen and how you dial in whether the kart bites, pushes, or gets loose. These three are among the fastest, cheapest tuning changes you have.' },
      { note: 'Tailored to our setup: <b>VLR Emerald</b> chassis, measured with the <b>Sniper V2</b> laser and adjusted with the <b>Sniper Linear Caster/Camber top plate</b> (caster in 1° steps, camber infinitely adjustable — the two are fully independent). Baseline numbers below are from RLV\'s VLR Emerald setup sheet; always validate on track.' },

      /* ---------- CASTER ---------- */
      { h: 'Caster — front bite & steering weight' },
      { diagram: 'caster' },
      { p: '<b>What it is:</b> how far the kingpin (steering axis) leans forward or back when viewed from the side. Leaning the top of the kingpin toward the rear = more (positive) caster.' },
      { p: '<b>What it does:</b> more caster makes the front tires lean/jack harder as you steer, so it <b>adds front grip and "bite," shortens the effective wheelbase, and helps free the rear</b> to rotate. It also adds steering weight and self-centering. Less caster lightens the steering, reduces rolling resistance, and calms an over-eager front.' },
      { table: { head: ['Situation', 'Caster move'], rows: [
        ['Kart pushes / won\'t turn in, or high-grip / wet track', 'Add caster (more front bite frees the rear)'],
        ['Steering feels heavy, or you want less rolling drag', 'Reduce caster'],
        ['LO206 baseline', 'Run as little caster as you can get away with, then add only if it pushes']
      ]}},
      { tip: 'On a low-horsepower LO206 the common wisdom is to start with minimal caster — you rarely need a lot, and less caster means less scrub and drag down the straights.' },

      /* ---------- CAMBER ---------- */
      { h: 'Camber — tire contact patch' },
      { diagram: 'camber' },
      { p: '<b>What it is:</b> how far the tire leans from vertical viewed from the front. Top leaning out = positive; top leaning in = negative.' },
      { p: '<b>What it does:</b> camber sets how flat the tire sits on the track through the corner. The goal is a full, even contact patch when the tire is loaded and the driver is aboard. Note the distinction: caster makes the wheel <i>dynamically</i> gain camber as you steer (that\'s how the Sniper measures caster) — but our Sniper linear top plate sets <i>static</i> caster and camber <b>independently</b>, so dialing caster doesn\'t drag your camber number with it the way eccentric pills do.' },
      { table: { head: ['Symptom / goal', 'Camber move'], rows: [
        ['Front tire wearing/overheating on one edge', 'Adjust toward even wear (usually less negative)'],
        ['Want maximum flat contact / grip (esp. wet)', 'Toward slight positive'],
        ['Want a bit more stability / less front bite', 'Toward slight negative'],
        ['Baseline', 'Start near zero (tires sitting flat with driver seated) and adjust off tire temps/wear']
      ]}},
      { warn: 'Too much camber either way overheats and greases the front tires and can loosen the rear. Set it with the driver\'s weight in the seat — camber changes when the kart is loaded.' },

      /* ---------- TOE ---------- */
      { h: 'Toe — turn-in vs stability' },
      { diagram: 'toe' },
      { p: '<b>What it is:</b> whether the fronts point slightly toward each other (toe-in) or away (toe-out) viewed from above.' },
      { p: '<b>What it does:</b> <b>toe-out sharpens turn-in and initial response</b>; <b>toe-in adds straight-line stability</b> and settles a nervous kart. Zero toe has the least scrub and the best straight-line speed. Any toe trades a little top speed and tire life for response or stability, so use the minimum that gives the feel you want.' },
      { table: { head: ['Goal', 'Toe move'], rows: [
        ['Sharper, more aggressive turn-in', 'Add toe-out'],
        ['Calm a darty/nervous kart, more stability', 'Add toe-in'],
        ['Max straight-line speed / lowest tire scrub', 'Toward zero'],
        ['VLR Emerald spec', '.020" / .50 mm toe-OUT per side (≈ half of the 1 mm dot on the V2 scale)']
      ]}},
      { warn: 'Toe changes every time you adjust caster or camber (and when you set steering-arm length). Always set toe last, and re-check it after any caster/camber change.' },

      /* ---------- BASELINE ---------- */
      { h: 'VLR Emerald factory baseline (RLV setup sheet)' },
      { table: { head: ['Setting', 'VLR Emerald spec', 'Then tune by'], rows: [
        ['Camber', 'Top plate set to "0" camber', 'Tire temps / edge wear'],
        ['Caster', '≈ 1/16" (minimal) — keep it low on a 206', 'Add 1° at a time if it pushes / high-grip / wet'],
        ['Toe', '.020" (.50 mm) toe-OUT each side', 'More toe-out for turn-in; toe-in to calm it down'],
        ['Ackermann', 'Stock = widest of the three spindle holes', 'Inner holes add steering/Ackermann into the corner'],
        ['Front track', '44" outside-to-outside', 'Widen to add front grip / fix a push'],
        ['Rear track', '49" outside-to-outside', 'Adjust for rear grip & stability balance'],
        ['Front axle', 'Standard Medium (Green)', 'Softer/stiffer axle to trim rear grip'],
        ['Weight', '≈ 44% front / 56% rear', 'Front ballast 5–15 lb; seat ballast 10–20 lb, high'],
        ['Tire pressure', '12–16 psi (tire & compound)', 'Hot readings off the track']
      ]}},

      /* ---------- SNIPER V2 PROCEDURE ---------- */
      { h: 'Measuring with the Sniper V2' },
      { p: 'Each Sniper V2 unit slides onto a front spindle with its <b>forward arrow pointing to the front</b> of the kart (fits shafts up to ~35 mm). It projects onto a grid where <b>every line = 2 mm per side</b> — vertical lines read toe, horizontal lines read camber, and the dot in the middle of each line marks 1 mm. Work on a flat, level floor with the tires you race and the driver\'s weight represented.' },
      { steps: [
        'Mount both V2 units on the spindles, forward arrows to the front.',
        'Center the steering first — use a template/straightedge, or turn full-lock each way and even up the left/right distances with steering-arm length. Then level the two units to each other by centering the spirit-level vials.',
        'Read camber on the horizontal (camber) plane: count lines/dots from center — 1 line = 2 mm, the mid-line dot = 1 mm. Match left and right. VLR target = "0".',
        'Read toe on the vertical (toe) plane the same way — beams converging = toe-in, diverging = toe-out. VLR target = .020"/.50 mm out per side.',
        'Get caster by steering: turn the wheels ~20° each way and watch how the camber reading changes — more change = more caster. Use the ruler/magnet in the Sniper kit to confirm both sides carry the same caster (or drop an angle finder on the kingpin for a degree reading).',
        'Adjust with the top plate + tie rods (below), then re-read and confirm left/right are symmetric.'
      ]},
      { img: 'images/sniper-v2-spindle.jpg', caption: 'Sniper V2 on the Emerald spindle — forward arrow to the front, units leveled to each other.' },

      /* ---------- HOW TO ADJUST — SNIPER TOP PLATE ---------- */
      { h: 'Changing it — Sniper top plate on the Emerald' },
      { p: 'Our Sniper Linear Caster/Camber top plate sets caster and camber <b>independently</b> — so you can move one without chasing the other back.' },
      { list: [
        '<b>Camber:</b> slide the top plate\'s camber adjustment (infinitely adjustable) until the V2 reads your target, then lock it. VLR baseline = 0.',
        '<b>Caster:</b> index the caster adjustment in <b>1° increments</b> to add or remove caster (VLR baseline ≈ 1/16" — minimal). Set both sides to match.',
        '<b>Toe:</b> set last with the tie rods — equal turns each side — to .020"/.50 mm out per side, then lock the jam nuts. Re-check on the V2.',
        '<b>Ackermann:</b> the tie-rod end sits in the widest of the three spindle holes as stock; move to an inner hole for more Ackermann/steering into the corner.',
        'Move in small, tracked steps and keep left/right symmetric — the Emerald front end is sensitive and small moves show up on track.'
      ]},
      { img: 'images/sniper-topplate.jpg', caption: 'Our Sniper Linear top plate — caster in 1° steps, camber infinitely adjustable, independent of each other.' },
      { tip: 'Log each session in the Track Log tab: caster (°), camber, toe, tire pressures and how it felt. A written baseline you can return to is worth more than chasing a perfect number every weekend.' }
    ]
  },

  /* ====================== TRACK WIDTH ====================== */
  {
    id: 'track-width',
    title: 'Track Width — Front & Rear',
    tag: 'Chassis · Grip balance',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/></svg>',
    summary: 'What front & rear width do to grip, when to change them, and how to set them on the VLR Emerald.',
    sections: [
      { p: 'Track width is how far apart the wheels sit, measured <b>outside-to-outside (O/O)</b>. Front and rear are two separate knobs: front width trims how much the nose bites, rear width trims how much the rear hooks up and how hard the inside rear jacks. They\'re some of the biggest handling changes you can make in the paddock.' },
      { diagram: 'trackwidth' },
      { note: 'VLR Emerald factory baseline: <b>front 44" O/O, rear 49" O/O</b> (RLV setup sheet). Always check your class\'s maximum overall width before going wider, and change one end at a time.' },

      /* ---------- FRONT ---------- */
      { h: 'Front track — how much the nose bites' },
      { p: '<b>What it does:</b> widening the front adds front grip, especially through fast, wide-radius corners; narrowing it takes front grip away but lets the kart change direction quicker in tight, technical sections.' },
      { table: { head: ['Situation / goal', 'Front width move'], rows: [
        ['Kart pushes / understeers in fast sweepers', 'Widen the front (more front grip)'],
        ['Want quicker flick through tight esses', 'Narrow the front (faster direction change)'],
        ['Front feels too darty / grabby', 'Narrow the front slightly'],
        ['Need more turn-in on a high-speed track', 'Widen the front']
      ]}},

      /* ---------- REAR ---------- */
      { h: 'Rear track — how the rear hooks up' },
      { p: '<b>What it does:</b> this one is a little counter-intuitive. <b>Narrowing</b> the rear <b>adds rear grip / side bite</b> (stiffer axle, more traction) — but go too narrow and the rear over-grips and the kart hops. <b>Widening</b> the rear <b>reduces steady rear grip and frees the kart</b>, while actually <b>increasing the jacking effect</b> (the inside rear lifts more, rotating the kart) for a smoother, more progressive slide.' },
      { table: { head: ['Situation / goal', 'Rear width move'], rows: [
        ['Low-grip / slick track, need drive & traction', 'Narrow the rear (more bite)'],
        ['High-grip / soft tires, rear hopping or bouncing', 'Widen the rear (calms the bite, smoother slide)'],
        ['Kart feels stuck / won\'t rotate on exit', 'Widen the rear (frees it, more jacking)'],
        ['Kart is loose / steps out on exit', 'Narrow the rear (more rear grip)']
      ]}},
      { warn: 'Widening the rear makes the axle effectively longer and more flexible and lifts the inside rear higher — it frees the kart but too much causes lazy, sliding exits. Narrowing stiffens the axle and adds bite, but too narrow makes the chassis hop in medium-speed corners. Move in small steps.' },

      /* ---------- HOW ON EMERALD ---------- */
      { h: 'Changing it on the VLR Emerald' },
      { list: [
        '<b>Front (spindle spacers):</b> the front wheels move in/out with spacers/washers on the spindle stub between the hub and the spindle. Add spacers to go wider, remove to go narrower. Keep the <b>same on both sides</b> so the kart stays centered, and re-check toe on the Sniper afterward — moving the front wheels can shift your toe reading.',
        '<b>Rear (hubs on the axle):</b> loosen the rear hub clamp bolts (and any set screw), slide each hub in or out along the axle, then re-torque. Move <b>both hubs equally</b> to keep the axle centered in the chassis, and make sure the wheels still clear the bodywork and the axle end isn\'t proud of the hub.',
        'Measure O/O with a tape or the chassis gauge after each change and write the number down.',
        'Front wheel offset and rear wheel offset (different rim offsets) are another way to shift width if you\'re out of spacer/hub travel.'
      ]},
      { img: 'images/emerald-rear-hub.jpg', caption: 'Emerald rear hub on the axle — loosen the clamp bolts, slide both hubs equally, re-torque.' },
      { img: 'images/emerald-front-spacers.jpg', caption: 'Front spindle spacers — add/remove equally each side to widen or narrow the front track.' },
      { warn: 'Check your class rulebook\'s maximum overall width before widening the rear — it\'s an easy tech failure. The Emerald\'s 49" O/O rear baseline usually leaves room, but confirm for your series.' },
      { tip: 'Change front OR rear, not both at once, and log the O/O numbers with tire pressures and how it felt in the Track Log tab. Width changes are big — a small move goes a long way.' }
    ]
  },

  /* ====================== HANDLING CURE CHART ====================== */
  {
    id: 'handling',
    title: 'Handling Cure Chart',
    tag: 'Chassis · Diagnose',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
    summary: 'The kart does X → change Y. Diagnose push, loose, and hop, then fix it in order.',
    sections: [
      { p: 'A kart turns by lifting the inside rear and rotating. When it won\'t, you either <b>push</b> (understeer — the nose won\'t turn) or go <b>loose</b> (oversteer — the rear steps out), and sometimes it <b>hops</b> (the rear over-grips and chatters). Figure out <i>where</i> in the corner it happens — entry, mid, or exit — then work the fixes top-down.' },
      { warn: 'Change ONE thing at a time and log it. Front/rear track-width and torsion-bar responses genuinely vary by chassis and grip level — the directions below are the common ones (and match this app\'s Alignment and Track Width guides); confirm on track.' },

      { h: 'Push / understeer — the nose won\'t bite' },
      { table: { head: ['Where in the corner', 'Try in order'], rows: [
        ['Entry (turn-in)', 'Add caster · move seat forward · widen front track · lower front tire pressure to build front heat · soften/remove the front bar'],
        ['Mid-corner', 'More caster · widen front · free the rear so it rotates (widen rear / softer axle) · confirm a little front toe-out'],
        ['Exit', 'Free the rear (remove the rear torsion bar, widen rear, softer axle) · raise rear ride height · seat forward']
      ]}},

      { h: 'Loose / oversteer — the rear steps out' },
      { table: { head: ['Where in the corner', 'Try in order'], rows: [
        ['Entry', 'Reduce caster · narrow front track · engage/stiffen the rear torsion bar · smoother inputs, less trail brake'],
        ['Mid-corner', 'Less caster · narrow front · more rear grip (softer axle; narrow rear on low grip) · seat lower'],
        ['Exit', 'More rear grip: softer/medium axle · lower ride height · seat back &amp; down · gentler throttle pickup']
      ]}},

      { h: 'Hopping / chatter — the rear won\'t release' },
      { list: [
        'Widen the rear track to free it up.',
        'Go to a softer rear axle.',
        'Remove or soften the rear torsion bar.',
        'Adjust tire pressure — too high OR too low can both hop.',
        'Check you\'re not simply over-gripped for the day (green/cold track) and smooth out your inputs.'
      ]},

      { h: 'Fast reference' },
      { table: { head: ['Symptom', 'First move'], rows: [
        ['Won\'t turn in', '+caster · seat forward · widen front'],
        ['Pushes mid-corner', 'free the rear · +caster'],
        ['Won\'t rotate on exit', 'remove rear bar · widen rear'],
        ['Loose on entry', '−caster · narrow front'],
        ['Loose on exit', 'softer axle · seat back &amp; down'],
        ['Hops / chatters', 'widen rear · softer axle · remove rear bar']
      ]}},
      { tip: 'Log every change with the lap time and feel in the Log tab — a cure that works at one track or temperature may not at the next. Cross-refs: Alignment, Track Width, Chassis Setup, Tire Prep.' }
    ]
  },

  /* ====================== WEATHER & TRACK TUNING ====================== */
  {
    id: 'weather-tuning',
    title: 'Weather & Track Tuning',
    tag: 'Setup · Conditions',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v2M5 12H3M6.3 6.3L5 5M18 12h2M12 18a5 5 0 000-10 5 5 0 000 10z"/><path d="M6 20h10a3 3 0 000-6"/></svg>',
    summary: 'Move the whole kart for hot vs cold, green vs rubbered-in, and wet.',
    sections: [
      { p: 'Grip changes with temperature and track condition, and a fast setup follows it. Two separate things move: <b>air density</b> (temp/humidity/altitude) drives jetting, and <b>track grip</b> drives handling and tires. Log a baseline for each condition so you\'re not re-learning it every weekend.' },
      { note: 'Air rule of thumb: <b>dense air</b> (cold, dry, low altitude) needs MORE fuel — richen. <b>Thin air</b> (hot, humid, high altitude) needs LESS — lean. On the 206 your only legal fuel lever is the needle-clip position (see Carb Tuning).' },

      { h: 'Hot day / high-grip (rubbered-in)' },
      { list: [
        'Air is thin → if it blubbers or sputters up top, <b>lean</b> the needle a clip.',
        'Grippy track makes the kart tighten, push, and hop → <b>free the rear</b>: widen the rear, softer axle, remove the rear bar; add front only as needed.',
        'Tires build a lot of heat → drop cold pressure to hold your ~2 psi rise (see Tire Prep).'
      ]},
      { h: 'Cold day / low-grip / green (new or freshly swept)' },
      { list: [
        'Air is dense → if it bogs, <b>richen</b> the needle a clip.',
        'Slick track goes loose → add <b>rear grip</b>: narrow the rear, softer axle; be smooth. Grip comes up as rubber lays down, so re-check as it rubbers in.',
        'Get heat into the tires before the session and run enough pressure to reach their window.'
      ]},
      { h: 'Wet' },
      { list: [
        'Run the rain tire at much lower pressure than dry (you need heat), and fit the legal wet-weather filter shield (no ram-air).',
        'Add front grip: more caster, and often widen the front and narrow the rear for a pointier, planted kart.',
        'Gear down (shorter) — you won\'t reach dry speeds; protect the drive off the corner.',
        'Drive smooth and early, off the dry line (it\'s slick when wet), and brake in a straight line.'
      ]},
      { warn: 'Weather tuning stacks with the Handling Cure Chart — if it\'s loose because it\'s green, fix it with rear grip, not by permanently undoing your dry setup. Log the condition with every change so you can recall it next time.' }
    ]
  },

  /* ====================== CHASSIS SETUP ====================== */
  {
    id: 'chassis-setup',
    title: 'Chassis Setup — Seat, Axle & Bars',
    tag: 'Chassis · Core skill',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18l3-9h6l4 9M7 9V6a2 2 0 012-2h2M4 18h16"/></svg>',
    summary: 'The big chassis knobs beyond alignment: seat position, rear axle, torsion bars, ride height.',
    sections: [
      { p: 'A kart has no springs — the frame itself is the suspension. Alignment and track width are the front-end knobs; the rest of the grip lives in <b>where the driver sits, which rear axle you run, the torsion bars, and ride height</b>. These set how the whole kart flexes and how the rear hooks up.' },

      { h: 'Seat position — the biggest rear-grip lever' },
      { list: [
        'The seat carries most of the weight, so where it sits hugely changes rear grip and how the frame flexes.',
        'Forward / up = more front grip and rotation (helps a push). Back / down = more rear grip and stability (helps a loose kart).',
        'Seat stiffness: more struts / tighter mounting = more direct and more grip; fewer/looser = more flex and forgiveness.',
        'Set it for the driver first (reach, comfort, control), then fine-tune grip with struts and small moves. VLR Emerald baseline is about 6 3/8" from the driver\'s back to the rear axle for a ~155 lb driver.'
      ]},
      { h: 'Rear axle — hardness, diameter, length' },
      { list: [
        'Axle hardness (soft / medium / hard) tunes rear grip: a <b>softer</b> axle flexes more = more grip (good on low-grip/green); a <b>harder</b> axle flexes less = frees the kart (good on high-grip).',
        'Longer / larger-diameter axles are stiffer; shorter / thinner ones flex more.',
        'VLR Emerald baseline is the standard <b>Medium (green)</b> axle. Change the axle for a big grip shift when width and pressure aren\'t enough.'
      ]},
      { h: 'Torsion bars (front & rear)' },
      { list: [
        'A bar stiffens a section of frame. A stiffer <b>front</b> bar reduces front grip; removing it adds front grip (helps push).',
        'A stiffer / engaged <b>rear</b> bar reduces rear grip and frees the kart; removing or softening it adds rear grip (helps loose / hop). Many bars rotate flat ↔ vertical to change stiffness.'
      ]},
      { h: 'Ride height & floor' },
      { list: [
        'Higher ride height raises the CG → more weight transfer and jacking → generally more grip/rotation; lower = more stable, less transfer.',
        'Raise the rear to help a push on exit; lower it to calm a loose kart.',
        'A stiffer floor tray adds rigidity (more grip, more direct); a flexier one is more forgiving.'
      ]},
      { warn: 'These all interact with alignment, width, tires and ballast — change one at a time and use the Handling Cure Chart to pick the right knob for the symptom.' },
      { tip: 'Seat position is the highest-impact change but the hardest to undo — get it right early, then tune with the quicker knobs (width, pressure, caster).' }
    ]
  },

  /* ====================== WEIGHT & BALLAST PLACEMENT ====================== */
  {
    id: 'ballast-placement',
    title: 'Weight & Ballast Placement',
    tag: 'Chassis · Setup',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="9" width="14" height="11" rx="1"/><path d="M8 9V6a4 4 0 018 0v3"/></svg>',
    summary: 'Where to bolt the lead to hit weight and tune balance — not just how much.',
    sections: [
      { p: 'The Weight &amp; Ballast calculator (Tools tab) tells you <b>how much</b> lead to add to make minimum; this is <b>where</b> to put it. On a kart, placement shifts the balance almost as much as the amount.' },
      { h: 'Front / rear' },
      { list: [
        'Weight forward → more front grip and rotation (can cure a push, but too much makes the rear light and loose).',
        'Weight rearward → more rear grip and drive off the corner (calms a loose kart; too much dulls turn-in).',
        'VLR Emerald baseline is roughly 44% front / 56% rear — start there and adjust off feel and tire temps.'
      ]},
      { h: 'Low vs high' },
      { list: [
        'Low ballast (floor pan, seat bottom) lowers the CG → more stable, less weight transfer/jacking → less grip but predictable.',
        'Higher ballast (up the seat back) raises the CG → more transfer/jacking → more grip and rotation.',
        'Start low for stability; move some up when you need more grip — but rules cap how much can go high on the seat.'
      ]},
      { h: 'Left / right' },
      { list: [
        'Most sprint setups aim near 50/50 side-to-side; corner-weight it on scales.',
        'Small left/right bias can suit a very left- or right-dominant track — test and log.'
      ]},
      { warn: 'Ballast MUST be through-bolted to the frame or seat — never zip-tied or wedged. Loose lead is a black-flag and a real hazard. Tech weighs you at/over minimum with the driver, so account for fuel burn and a lighter driver, and mind the rules\' limit on how much weight can go high on the seat.' },
      { tip: 'Add ballast in small chunks and log where it went and what it did — placement is a real tuning tool, not just dead weight.' }
    ]
  },

  /* ====================== BRAKES — VLR EMERALD ====================== */
  {
    id: 'brakes',
    title: 'Brakes — VLR Emerald',
    tag: 'Chassis · Safety',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',
    summary: 'Bleed, change, clean, and know when to shim vs replace pads on the Easy-Brake system.',
    sections: [
      { p: 'The Emerald runs a hydraulic <b>rear</b> brake — the "Easy-Brake" system. Your pedal pushes the master cylinder, fluid runs down the line to the rear caliper, and the pads clamp the disc on the axle. Simple and reliable — but it\'s the one system where "good enough" isn\'t.' },
      { diagram: 'brakes' },
      { warn: 'Brakes are safety-critical. After ANY brake work, pump the pedal until it\'s firm and confirm the kart actually stops at walking pace before you go on track. Never mix brake-fluid types.' },

      { h: '1 · Bleeding' },
      { p: 'Bleed at season start, any time the pedal feels spongy or long, and whenever you change pads or the disc (pushing the pistons back lets air in). Use the DOT fluid your system specifies — commonly <b>DOT 4</b> — from a fresh sealed bottle. Never reuse old fluid, and never mix fluid types — don\'t switch to a different type (e.g. DOT 5 silicone) unless your system is rated for it.' },
      { p: '<b>Reverse (push-up) bleed — the reliable kart method.</b> Air rises toward the master cylinder, so pushing fresh fluid UP from the caliper clears it best:' },
      { steps: [
        'Clean around the caliper bleed screw and the reservoir so no grit gets in.',
        'Fill a syringe/bleeder with fresh fluid and connect it to the caliper bleed nipple with a snug hose.',
        'Crack the bleed screw and gently push fluid up through the caliper and line into the reservoir — watch for bubbles and don\'t let the reservoir overflow.',
        'When fluid runs clean with no air, close the bleed screw and set the reservoir to its level line.',
        'Check the pedal: firm and high = done. Spongy = repeat.'
      ]},
      { p: '<b>Traditional pump bleed (alternative):</b>' },
      { steps: [
        'Top the reservoir with fresh fluid; clear hose on the bleed nipple into a catch bottle.',
        'Press and hold the pedal, crack the bleed screw to let fluid + air out, then close it BEFORE releasing the pedal.',
        'Keep the reservoir topped so you never suck air back in. Repeat until the fluid runs clear and the pedal is firm.'
      ]},
      { tip: 'Kart brakes trap air easily — go slow, keep the reservoir full, and never let the master cylinder run dry.' },

      { h: '2 · Changing pads' },
      { steps: [
        'Get to the caliper (pull the rear wheel/bodywork as needed) and remove the pad retainer pin or bolt.',
        'Gently push the caliper pistons back to make room — crack the bleed screw while you push so old fluid goes OUT the nipple instead of pushing dirt back up to the reservoir.',
        'Slide the old pads out; note and remove any accumulated shims. Clean the caliper and piston faces.',
        'Fit the new pads (start with no or minimal shims) and set a light, even pad-to-disc gap.',
        'Re-bleed — the pistons moving back will have let air in.',
        'Pump the pedal to bring the pads to the disc, confirm it\'s firm, then bed the pads in with several medium stops before hard use.'
      ]},

      { h: '3 · Cleaning' },
      { list: [
        'Keep oil, grease, and chain lube OFF the disc and pads — a contaminated disc is the fastest way to lose braking.',
        'Wipe the disc with brake cleaner to cut oil film and glaze; clean the caliper body and around the bleed screw.',
        'If pads or disc look glazed (shiny, not matte), lightly scuff them with fine sandpaper to bring the bite back.',
        'Check the bleed screw and fittings for weeping fluid — a wet caliper is a leak to fix before running.'
      ]},

      { h: '4 · Pads: when to shim, when to change' },
      { p: 'The Emerald uses brake-pad <b>shims (spacers)</b> behind the pads to take up wear and keep the pad-to-disc gap tight so the pedal stays high — typically about 2 per caliper, adding more as the pads wear.' },
      { table: { head: ['Situation', 'Do this'], rows: [
        ['Pedal getting long/low from normal wear, but good friction material left', 'SHIM — add a shim behind the pad(s) to close the gap, recheck pedal'],
        ['Friction material worn thin / near the backing plate', 'CHANGE pads'],
        ['Pads glazed/shiny, or uneven wear side-to-side', 'CHANGE pads (and deglaze/clean the disc)'],
        ['Grinding noise (metal backing on disc)', 'STOP now — CHANGE pads immediately, inspect the disc'],
        ['Out of shim adjustment', 'CHANGE pads, remove the stacked shims, re-bleed']
      ]}},
      { warn: 'Grinding = metal on the disc = little braking left and you\'re ruining the disc. Come in immediately.' },
      { tip: 'Log brake feel and pad/shim changes in the Track Log — a pedal that keeps going long over a weekend is telling you it\'s shim-or-change time.' }
    ]
  },

  /* ====================== DATA — MYCHRON 6 ====================== */
  {
    id: 'mychron-data',
    title: 'Data — MyChron 6',
    tag: 'Data · Core skill',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
    summary: 'Install, set up, and actually use the MyChron 6 (1T) — RPM, temp, GPS lap times, and analysis.',
    sections: [
      { p: 'The MyChron 6 is our dash logger and GPS lap timer. On the <b>1T</b> it records engine <b>RPM</b>, one <b>temperature</b> (cylinder-head temp), and <b>25 Hz GPS</b> speed/position, plus lap and split times. In the moment it shows your shift lights, temp, and a predictive lap; afterward you download it and find where the lap time is actually hiding.' },
      { diagram: 'mychron' },
      { note: 'Quick specs: 320×136 color display, internal rechargeable battery + USB-C, 25 Hz GPS, Wi-Fi + Bluetooth, 4 GB memory, 5 RGB shift LEDs, 2 alarm LEDs, IP67. Configure and download with the AiM RS3 app (iOS/Android) or RaceStudio 3 on a PC.' },

      /* ---------- INSTALL ---------- */
      { h: 'Installing it' },
      { steps: [
        'Mount the display centered above the steering-wheel hub — use the wheel\'s pre-drilled holes or an add-on MyChron mount. Keep it square so it\'s readable at speed.',
        'RPM lead (4-stroke): loop the RPM lead through the two clip holes on the back of the unit and WRAP it a few turns around the spark-plug wire. The MyChron reads RPM inductively off that wire — on a 4-stroke, skipping the wrap gives wrong/erratic RPM.',
        'Temperature (1T = CHT): pull the spark plug (13/16" socket), slip the copper-ring temp sensor over the plug, reinstall and torque the plug, then reconnect the sensor lead and the plug cap. That gives you cylinder-head temp.',
        'Route cleanly: run the RPM and sensor leads along the frame, not bundled with other wires, so you don\'t pick up noise.',
        'Power: the battery is internal — just charge it over USB-C between sessions. GPS is built in, so there\'s nothing to wire for lap timing.'
      ]},

      /* ---------- SETUP ---------- */
      { h: 'Setting it up' },
      { steps: [
        'Power on and set your basics: temperature units (°F), time/date, and rider/kart profile.',
        'Confirm RPM reads sanely — a few thousand at idle-ish, climbing to ~6,000+ at speed. If it\'s wild or reads double, re-do the plug-wire wrap.',
        'Set the shift LEDs to your useful RPM band and set a CHT over-temp alarm so a hot engine flags on the dash.',
        'Track & lap timing: the GPS auto-recognizes the circuit and times laps automatically — no beacon needed (you can still add an optical/magnetic beacon if a track needs it). Just make sure it has GPS lock before the session.',
        'Pair the RS3 app over Wi-Fi to tweak pages, alarms, and shift points from your phone.'
      ]},

      /* ---------- USING THE DATA ---------- */
      { h: 'Using the data' },
      { p: '<b>On track</b>, glance at three things: the shift LEDs (upshift point), the CHT (engine health), and the lap/predictive <b>delta bar</b> — it shows in real time whether you\'re up or down on your best lap.' },
      { p: '<b>After the session</b>, download over Wi-Fi to the RS3 app or RaceStudio 3, then work through it:' },
      { list: [
        '<b>GPS track map + speed trace:</b> find your minimum corner speed and where you get back to throttle. Slow min-speed or late throttle = time lost right there.',
        '<b>Overlay laps:</b> lay your best lap over a faster one (yours or a teammate\'s) and watch where the gap grows — that corner is the priority.',
        '<b>RPM at the end of the straight:</b> if you\'re banging the top of the useful band well before the braking zone you\'re geared too short; bogging out of slow corners means too tall. Feed those numbers into the Gear tools in this app.',
        '<b>CHT trend:</b> track head temp session to session — a sudden change flags an engine or jetting issue before it costs you.'
      ]},
      { warn: 'CHT is your engine\'s vital sign. Learn its normal range for your setup and weather; if it climbs abnormally, check it before you keep running — heat is what kills these engines.' },
      { tip: 'Log the key numbers (best lap, end-of-straight RPM, CHT) in the Track Log tab next to your gear and pressures, so the data ties back to the setup that produced it.' }
    ]
  },

  /* ================== RACE STUDIO 3 — DESKTOP ================== */
  {
    id: 'race-studio-3',
    title: 'Race Studio 3 — Desktop',
    tag: 'Data · Software',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 11l3-3 3 3 4-5"/></svg>',
    summary: 'Connect the MyChron, download sessions, manage tracks, and analyze in the Analysis section.',
    sections: [
      { p: 'Race Studio 3 (RS3) is AiM\'s free <b>Windows</b> software (on a Mac it runs only via a workaround like CrossOver): it manages the MyChron, downloads your sessions and video, configures the device, handles track maps, and opens its deep <b>Analysis</b> section. This is where you actually pull the lap time apart after a session.' },
      { diagram: 'rs3flow' },
      { note: 'Download RS3 free from aim-sportline.com / aimtechnologies.com. Sessions save as <b>.xrk</b> files and land in the analysis database automatically after download.' },

      { h: '1 · Connect the MyChron' },
      { p: 'Two ways in: <b>Wi-Fi</b> (wireless, best trackside) or <b>USB</b>. First time, set up Wi-Fi over USB:' },
      { steps: [
        'USB-connect the MyChron to the computer and open RS3.',
        'Click the device in the left "Connected Devices" column, open its Wi-Fi configuration page.',
        'Set Wi-Fi Mode = "Access Point", create a WPA2 password (and an optional friendly name, max 8 characters), then Transmit and Refresh.',
        'Unplug USB. On the computer\'s Wi-Fi list, pick the MyChron network (e.g. "AiM-MyChron6-01286") and enter that password.',
        'It shows up under Connected Devices — you\'re wireless now. (Team option: "Existing Network" mode joins both the MyChron and the computer to a shared router, each device with its own password.)'
      ]},
      { tip: 'Keep that Wi-Fi network off the internet — a dedicated router with nothing else on it gives the fastest, most reliable downloads.' },

      { h: '2 · Download your data' },
      { steps: [
        'Open the Devices section (left sidebar) and select the MyChron.',
        'Choose Data Download to see the sessions on the logger.',
        'Download them — with "Use RaceStudio 3 Analysis" enabled they drop straight into the Analysis database, sorted by date, track, and driver.'
      ]},

      { h: '3 · Tracks & lap timing' },
      { p: 'The MyChron auto-selects the nearest track by GPS and times laps automatically; if a track isn\'t in the database it uses the closest one. To add or fix a track in RS3:' },
      { list: [
        'Tracks → New → set the finish-line location, track name, and country → Save.',
        'Move the start/finish by dragging the flag on the map (or type coordinates, then "Cursor Pos"); add split points with "+", remove with "−".',
        'Send tracks to the MyChron: select them and Transmit (automatic over USB/Wi-Fi), or drag-and-drop into the logger.'
      ]},

      { h: '4 · Configure the MyChron (optional)' },
      { p: 'Configurations → New (or Clone an existing one) → set channels, display pages, shift-light RPM, and alarms → Transmit to the device. Clone your known-good config so every kart on the team runs the same setup.' },

      { h: '5 · Analyze it (the Analysis section)' },
      { steps: [
        'Click the Analysis icon (top-left) to open it; the database lists your sessions — double-click one to open it.',
        'Pick laps: the best lap is flagged by default. Use the Laps dropdown to choose which laps to show; right-click a lap to "Generate predictive reference lap from this lap".',
        'Use the views from the toolbar: Time/Distance graph (speed, RPM, temp traces), Track Map (colored by speed/split), Split Times report (sector times vs best), plus Channels report, Histogram, and Scatter.'
      ]},
      { h: 'Finding where you lose time' },
      { list: [
        'Overlay your best lap with a faster lap (yours or a teammate\'s) and watch the <b>Time Compare / delta</b> trace — wherever the line climbs, you\'re losing time; that corner is the priority.',
        'Open the <b>Split Times report</b>: red sectors are slower than your best. Double-click a split to zoom the graph and map to that corner.',
        'On the <b>speed trace</b>, check minimum corner speed and where you get back to throttle — slow apex or late throttle is time on the table.',
        'Read <b>end-of-straight RPM</b> to judge gearing, then feed it into the Gear tools in this app; watch the <b>CHT</b> trace for engine health.'
      ]},
      { tip: 'Create a predictive reference lap from your best lap and upload it to the MyChron (device config → Predictive Reference Lap) so the dash shows a live delta to that target on track. Handy analysis toggles: Snap ON = one lap / OFF = whole session; "Color per split" map to spot weak areas; compare only similar-condition laps; export a report to PDF/Excel to share; save a profile of your channel layout.' }
    ]
  },

  /* ================== RACE STUDIO 3 — iPHONE APP ================== */
  {
    id: 'race-studio-3-app',
    title: 'Race Studio 3 App (iPhone)',
    tag: 'Data · Mobile',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2M9 6l2 2 4-4"/></svg>',
    summary: 'Download, analyze, and manage the MyChron right from your phone at the track — no laptop.',
    sections: [
      { p: 'The <b>RaceStudio 3</b> app (free, App Store, iOS 18+, the new 3.0 release) puts the core of RS3 on your iPhone, so you can download and check data right at the grid without dragging out a laptop. It\'s the fast trackside companion to the desktop software.' },
      { note: 'It\'s a companion, not a full replacement — for deep multi-lap analysis and video sync you\'ll still want desktop Race Studio 3. But for a quick between-sessions read, the app covers it.' },

      { h: 'Get set up' },
      { steps: [
        'Install "RaceStudio 3" from the App Store, open it, and log in / create your AiM account (this enables AiM Cloud sharing).',
        'Set your profile and preferences.'
      ]},

      { h: 'Connect to the MyChron' },
      { steps: [
        'Power on the MyChron and make sure its Wi-Fi (Access Point) is on.',
        'On the iPhone: Settings → Wi-Fi → join the MyChron network ("AiM-MyChron6-…") and enter the password you set in desktop RS3.',
        'Back in the app, the MyChron appears as a connected device. (The MyChron 6 also has Bluetooth; Wi-Fi carries the session downloads.)'
      ]},

      { h: 'What you can do' },
      { list: [
        'Download sessions from the MyChron straight to your phone.',
        'Analyze trackside: lap times, data charts, and the GPS track trajectory — compare laps on the spot.',
        'Manage the device: set parameters, calibrate sensors, manage track maps, and update firmware.',
        'Share sessions via AiM Cloud — push them to your laptop or a coach for deeper analysis.'
      ]},

      { h: 'Trackside workflow' },
      { steps: [
        'Come off track → join the MyChron Wi-Fi → open the app → download the session.',
        'Check best lap and the trajectory/charts; compare to your previous best to spot the corner that\'s costing you.',
        'Note gear, end-of-straight RPM, and CHT; log them in the Track Log tab and make your change.',
        'Push the session to AiM Cloud for full analysis on the laptop later.'
      ]},
      { warn: 'The app is new (3.0) and the usual snag is the wireless link. If it won\'t connect, re-join the MyChron\'s Wi-Fi network in iPhone Settings and confirm the password, then reopen the app.' }
    ]
  },

  /* ========================= CARB TUNING ========================= */
  {
    id: 'carb-tuning',
    title: 'Carb Tuning & Jetting',
    tag: 'Fuel · Tuning',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 9h6M9 13h6"/></svg>',
    summary: 'Baseline mixture screw, float height, and fixes for surging, popping, and bog.',
    sections: [
      { p: 'The 206 carburetor is a controlled, largely fixed unit — most of your tuning is the idle mixture screw, idle speed, float height, and (where legal) the needle clip position. Most "tuning" problems are actually mechanical: a dirty pilot jet, an air leak, or a wrong float height. Fix the mechanical stuff first; do not try to tune around a dirty carb.' },
      { h: 'Baseline settings' },
      { list: [
        'Idle mixture screw: gently seat it (all the way in), then back out 1.5–2 turns as a starting point. Out = richer, in = leaner.',
        'Float height: the Briggs spec is .860" (22.0 mm); adjust it only by bending the float tab, and always confirm against your class rulebook.',
        'Idle speed: set so the engine idles without loading the clutch, after the mixture is close.'
      ]},
      { h: 'Symptom → fix' },
      { table: { head: ['Symptom', 'Try'], rows: [
        ['Popping on deceleration', 'Check header/exhaust gasket for a leak; if lean, richen part-throttle (C-clip DOWN one notch = needle up); verify float height'],
        ['Surging / hunting idle', 'Clean the pilot jet, back the mixture screw out slightly, inspect the intake boot for cracks'],
        ['Bogs coming off the corner (lean bog)', 'Richen part-throttle: move the C-clip DOWN one notch (needle up = richer); check for an intake air leak and a clean pilot jet'],
        ['Fuel weeping at rest', 'Worn needle/seat — rebuild with a fresh kit']
      ]}},
      { warn: 'Every class polices the carb differently and parts are often sealed or spec. Confirm any change is legal for your class before you touch it — an illegal carb mod is an easy DQ.' },
      { note: 'This is a starter module — send me your class rules and typical weather and we\'ll build out a proper jetting/weather chart for your program.' }
    ]
  },

  /* ===================== CHAIN & SPROCKET ===================== */
  {
    id: 'chain-sprocket',
    title: 'Chain & Sprocket Setup',
    tag: 'Driveline',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="12" r="4"/><circle cx="18" cy="12" r="2"/><path d="M7 8v8M18 10v4"/></svg>',
    summary: 'Tension, alignment, lube, and quick-change gearing basics.',
    sections: [
      { p: 'Gearing (the driver/driven sprocket combo) is your biggest lap-time lever race to race. The LO206 runs a <b>#35</b> chain. Getting the chain itself right keeps that power getting to the ground and keeps you from throwing a chain mid-race.' },
      { h: 'The essentials' },
      { list: [
        'Tension: aim for a small amount of free play — roughly 1/4" of up-and-down movement at the middle of the top run. Too tight robs power and wears bearings; too loose throws chains.',
        'Alignment: the engine (driver) sprocket and axle (driven) sprocket must be in the same plane. Sight down them or use a straightedge; a misaligned chain wears fast and derails.',
        'Lube: clean and lube the chain every time out with a chain-specific lube; wipe off the excess so it doesn\'t sling grit.',
        'Wear: replace hooked or worn sprocket teeth and a stretched chain together — a new chain on worn sprockets wears out immediately.'
      ]},
      { h: 'Gearing direction' },
      { table: { head: ['Change', 'Effect'], rows: [
        ['More teeth on axle (driven) OR fewer on driver', 'More torque / acceleration, lower top speed — tighter tracks'],
        ['Fewer teeth on axle (driven) OR more on driver', 'More top speed, softer acceleration — fast, flowing tracks']
      ]}},
      { tip: 'Use the Gear Ratio and Speed/RPM calculators in this app to predict a change before you cut the track time to test it.' }
    ]
  },

  /* ===================== CLUTCH — HILLIARD FLAME ===================== */
  {
    id: 'clutch',
    title: 'Clutch — Hilliard Flame',
    tag: 'Driveline · Core skill',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3a4 4 0 010 6M12 21a4 4 0 010-6M3 12a4 4 0 016 0M21 12a4 4 0 01-6 0"/></svg>',
    summary: 'Install, maintain, and tune the Flame — spring/weight tuning and the engagement chart.',
    sections: [
      { p: 'Our clutch is the <b>Hilliard Flame</b> — a centrifugal clutch. It spins with the crankshaft; as revs climb, the shoes fling outward against the drum and drive the sprocket and chain. <b>Springs</b> hold the shoes in and set the engagement RPM; <b>shoe weights</b> fine-tune it. Keeping it clean and consistent is most of the battle.' },
      { diagram: 'clutch' },
      { note: 'Engagement RPM = the point the shoes first touch the drum (not lock-up). Clean the clutch before first use — some parts ship dipped in oil to prevent rust.' },

      { h: '1 · Install' },
      { steps: [
        'Use the Briggs LO206 mounting kit (Hilliard #8444-9u-030): install the chamfered spacer first, chamfer facing the engine, then the bushing/sprocket/drum, then the hub/shoe/spring assembly with the key in the keyway.',
        'Set roughly 0.020"–0.030" clutch overhang past the crank end; the recommended washer is not substitutable. Torque the crank bolt to the manufacturer\'s spec.',
        'Do NOT clamp the clutch tight to the shaft outside these instructions — you\'ll wreck the bushing. There should be a hair of end-play (~1/32", a business-card thickness).',
        'Sprocket in the drum uses a bowed snap ring: side "A" faces away from the drum, side "B" toward it. NEVER reuse snap rings — replace with new every time.',
        'Line the clutch sprocket up with the axle sprocket (straightedge) and set chain tension — see the Chain & Sprocket guide.'
      ]},

      { h: '2 · Maintenance (weekly)' },
      { list: [
        '<b>Drum & shoes:</b> wipe the inside of the drum and the shoe faces with WD-40 on a rag; scrape the shoe grooves clean. WD-40 keeps engagement consistent — harsh solvents (acetone, brake/carb cleaner, starting fluid) strip all oil and make engagement grabby.',
        '<b>Galled drum:</b> knock it down with fine sandpaper, then wipe with WD-40 — a smooth, clean surface gives race-to-race consistency.',
        '<b>Bushing (critical):</b> wipe the outside with WD-40, then <b>one small drop of light-weight oil</b> on it. Never grease, never-seize, or Teflon lube, and never over-oil (excess ends up inside the drum and glazes it).',
        '<b>Storage:</b> keep the bronze bushing wrapped in plastic / in a bag — never on a rag, paper, or cardboard (they wick the oil out).',
        'Inspect shoes, drum, and bushing for wear/glazing each week; replace worn parts and always fit new snap rings.'
      ]},

      { h: '3 · Tuning' },
      { p: 'Two knobs: <b>springs</b> (engagement RPM) and <b>shoe weights</b> (engagement + torque). On the LO206 you want the clutch to engage near the bottom of the engine\'s useful power so it drives hard off the corner without bogging or slipping.' },
      { list: [
        '<b>Springs:</b> stiffer/more springs = higher engagement RPM; softer/fewer = lower. Long straights & fast tracks like a higher engagement to launch harder off slow corners; tight tracks like a bit lower for smoother pickup.',
        '<b>Weights:</b> more weight per shoe = lower engagement (a modest drop per weight — tens of rpm, not hundreds) AND more torque capacity/less slip; less weight = higher engagement, more slip on slick tracks.',
        '<b>Balance:</b> if you change one shoe\'s weight, the shoe 180° opposite MUST match — keep it balanced.',
        '<b>Shoe orientation:</b> leading (mass ahead of the lug) self-energizes — more aggressive, less slip; trailing (mass behind) slips more, softer pickup; an X-pattern (2 leading + 2 trailing) splits the difference.',
        '<b>Verify on data:</b> watch engagement RPM on the MyChron — it should engage at the same RPM every lap.'
      ]},
      { tip: 'A common US LO206 starting point is 2 black + 2 white springs, which lands roughly in the mid-3000s rpm (an estimate — it sits between the single-spring black 3800 and white 2800). Orientation is a tuning choice: leading launches more aggressively, trailing is smoother — Hilliard\'s own testing has favored trailing. Tune from there.' },
      { warn: 'Check your class rules before tuning — many LO206 classes limit clutch springs/weights or require the spec setup. Don\'t tune yourself into a tech DQ.' },

      { h: '4 · Engagement chart' },
      { p: 'Spring stiffness by color (higher = stiffer = higher engagement). These are single-spring reference points at the point the shoes first touch the drum, no added weight — your actual engagement depends on the full spring set and shoe weights:' },
      { table: { head: ['Spring color', 'Part #', 'Engagement RPM'], rows: [
        ['Black (stiffest)', '8443-35-006-A', '3800'],
        ['White', '8443-35-005-A', '2800'],
        ['Yellow', '8443-35-004-A', '2300'],
        ['Orange', '8443-35-003-A', '1900'],
        ['Red', '8443-35-002-A', '1400'],
        ['Green (softest)', '8443-35-009-A', '1200']
      ]}},
      { p: 'Mixing colors lands you between values (e.g. 2 black + 2 white ≈ mid-3000s), and adding heavy weights per shoe drops it further by a modest amount per weight. Hilliard\'s full chart plots engagement speed vs. heavy weights per shoe for every spring combo — drop it in below for the exact numbers.' },
      { img: 'images/clutch-engagement-chart.png', caption: 'Official Hilliard Inferno-Flame engagement chart (springs × heavy weights per shoe).' },
      { note: 'The Hilliard tuning kit (fits Flame/Fury/Blaze/Inferno) carries 4 springs of each color plus 8 heavy and 8 light shoe weights and snap rings — a full tuning range in one box.' }
    ]
  },

  /* ===================== TIRE PREP ===================== */
  {
    id: 'tire-prep',
    title: 'Tire Prep & Pressures',
    tag: 'Chassis · Evinco Blue',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',
    summary: 'Evinco Blue cold pressures, the 2-psi rule, and reading heat & wear.',
    sections: [
      { p: 'We run the <b>Evinco Blue</b> — MG Tires\' hard <b>SK-H2</b> spec compound. It\'s built for consistency and durability more than outright peak grip (it\'s effectively the MG Red\'s equal), so the game is getting it into its working window with a repeatable process and keeping it there — not chasing a magic number.' },
      { h: 'Cold pressure — start here' },
      { table: { head: ['Position', 'Cold start', 'Usable range'], rows: [
        ['Front', '8–9 psi', '~8–16 psi'],
        ['Rear', '10–11 psi', '~8–16 psi']
      ]}},
      { p: 'Set them <b>cold</b>, always at the same reference (before the tires soak up ambient or track heat), with the same gauge every time.' },

      { h: 'The 2-psi rule — how to dial it' },
      { p: 'The Blue tells you what it wants by how much it grows. Read pressures hot right off the track and aim for about a <b>2 psi rise</b> from cold:' },
      { table: { head: ['Hot pressure gain', 'What it means', 'Do this'], rows: [
        ['≈ 2 psi', 'In the window', 'Leave it'],
        ['3 psi or more', 'Too much heat', 'Drop cold pressure'],
        ['≈ 1 psi', 'Not enough heat', 'Add cold pressure']
      ]}},
      { tip: 'This rise-based method is the fastest, most reliable way to tune a spec tire — it works across weather and tracks because you\'re tuning the tire\'s heat, not guessing a number.' },

      { h: 'Know the limits' },
      { list: [
        'Above ~16 psi cold the tire <b>domes</b> (crowns up) and loses contact patch — grip falls off.',
        'Watch the low end: the 8–9 psi cold front start is fine, but if <b>hot/running</b> pressure drops much below ~10 psi you\'ll hear it <b>squeal</b> in the corners and it can get greasy/overheat on a hot day.',
        'Keep all four building evenly — a corner that reads much hotter than the others is working too hard (a chassis or pressure imbalance, not the tire).'
      ]},

      { h: 'Prep, reading & care' },
      { list: [
        'Heat-cycle new Blues with a gentle first run, then let them fully cool before you race them — spec tires reward a clean cycle.',
        'Keep them out of direct sun before a session and store them cool; a sun-baked tire reads high and greasy.',
        'Even graining across the tread = happy. Heavy graining or a blue/glazed look = too hot / too low.',
        'If you have a pyrometer, read inside/middle/outside — that tells you camber and pressure, not just overall grip.'
      ]},
      { warn: 'Your own hot readings beat any chart. Log cold and hot pressures (and the weather) every session in the Track Log — with a durable spec tire like the Blue, a consistent process is worth more than chasing tenths of a psi.' }
    ]
  },

  /* ================= MOUNTING TIRES — EVINCO BLUE ================= */
  {
    id: 'tire-mount',
    title: 'Mounting Tires — Evinco Blue',
    tag: 'Chassis · Shop',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v4M12 17v4"/></svg>',
    summary: 'Dismount & mount the Blues by hand or with tools, mount them the right way, and seat the bead safely.',
    sections: [
      { p: 'Our Evinco Blues are tubeless on non-beadlock wheels, so it\'s all about the <b>bead</b> — the air pressure is what holds the tire on. The MG compound is soft, so work clean, use soap, and mind the rotation direction. You can do it by hand with irons or on a kart tire machine; both are below.' },
      { diagram: 'tiremount' },
      { note: 'No bead screws on our wheels, so there\'s nothing to remove or reinstall. (If a wheel ever does have bead screws — common on mag wheels — back them all the way out before dismounting and refit them after.)' },

      { h: 'Tools & supplies' },
      { list: [
        'A kart tire machine, OR a pair of tire irons/spoons + a bead breaker.',
        'Valve-core tool (to fully deflate) and spare TR412 valves if any are cracked.',
        'Dish soap + water in a spray bottle for bead lube — MG says damp soap only; no petroleum grease or tire goo on the Blue.',
        'Air compressor with a clip-on chuck (hands-free) for seating.',
        'A mud flap or carpet square to work on, and a heat gun or sunny spot to warm a stubborn tire.'
      ]},

      { h: 'Dismount' },
      { steps: [
        'Deflate fully — pull the valve core with a core tool so there\'s zero air.',
        'Break both beads — with the bead breaker (or the machine) push each bead off its seat all the way around, both sides. Work steadily on the soft Blue; don\'t gouge the sidewall.',
        'Get slack — push one section of the far bead down into the drop-center well (the low channel in the middle of the rim); that\'s what gives you room to work.',
        'Lever it off — with tools: pry the near bead up over the rim flange a little at a time with the irons (or run it around on the machine), keeping the opposite side in the well. By hand: knee/press the bead into the well and roll/twist the tire off, a little bounce helps. Repeat for the second bead.',
        'Clean the rim — wipe the bead seats and flanges and inspect the rim and beads for cracks or damage.'
      ]},

      { h: 'Mount' },
      { steps: [
        'Check rotation first — the Blues are <b>directional</b>. Find the arrow on the sidewall and orient the tire to spin the right way for that side of the kart before you start.',
        'Lube the beads — spray dish soap + water on both tire beads and the rim bead seats; slippery helps it slide on and pop out to the seat.',
        'Optional: warm it — a cold, stiff tire fights you. A few minutes in the sun or a pass with a heat gun softens it right up (some shops use a low oven, but sun or a heat gun is safer and plenty).',
        'First bead on — start over the smaller/inner rim lip, dropping the opposite side into the drop-center well for slack; work it on by hand or with the irons/machine.',
        'Second bead the same way — keep the mounted section down in the well and lever/roll the rest over the flange.',
        'Reinstall the valve core.'
      ]},

      { h: 'Seat the beads — do this carefully' },
      { p: 'With both beads on, a burst of air pops them out onto their seats (you\'ll hear them). This is the step to respect.' },
      { warn: 'Secure the wheel, STAND CLEAR, use a clip-on chuck (not a hand-held nozzle), and wear eye protection. Over-inflating a tire to seat a bead is the #1 shop injury — a burst assembly can seriously hurt you. Never exceed your wheel\'s rated pressure.' },
      { steps: [
        'Add air in short bursts and listen for both beads to pop onto their seats.',
        'MG allows a temporary elevated pressure (~45–55 psi) to seat — but stop the instant both beads are seated, and never go past the wheel\'s max.',
        'Check the bead-seat line is even all the way around on both sides. Spray soap on the beads and look for bubbles (leaks) at the valve and around the bead.',
        'Drop to running pressure — Evinco cold baseline ~9 front / 11 rear (see Tire Prep).'
      ]},
      { tip: 'After a session, deflate the Blues so they don\'t take a set from the heat, and store them cool and out of the sun.' }
    ]
  },

  /* ===================== BREAK-IN & MAINT ===================== */
  {
    id: 'break-in',
    title: 'Break-In & Maintenance',
    tag: 'Engine · Care',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M6 6l2 2M18 6l-2 2"/><circle cx="12" cy="12" r="4"/></svg>',
    summary: 'New-engine break-in, oil choice, and a pre/post-race checklist.',
    sections: [
      { h: 'Break-in' },
      { list: [
        'Many builders break in on the same racing oil they\'ll run — switching from a separate break-in oil to race oil can leave residue, so pick one oil and stay with it.',
        'Load the engine rather than free-revving it — the rings seal under load. A few heat cycles / a short loaded run is enough for these engines; some builders consider them ready after just a couple of minutes under load.',
        'Re-check valve lash after the first few heat cycles — lash tends to grow over the first ~30–60 minutes of run time on a fresh engine, so what you set cold can open up.',
        'If you ever switch oil brands, flush the crankcase thoroughly first.'
      ]},
      { h: 'Oil' },
      { list: [
        'Common choices are a quality 4-stroke racing oil (Briggs recommends its 4T synthetic, ~10W-20) or a straight SAE 30 — consistency matters more than brand-swapping. Capacity is roughly <b>13 oz</b> — fill to the mark, don\'t overfill.',
        'Check level before every session; change on a regular schedule and any time the oil looks dark or gets contaminated.'
      ]},
      { h: 'Pre-race checklist' },
      { list: [
        'Oil level and condition',
        'Valve lash (see the valve lash module) at your baseline',
        'Air filter clean and sealed, intake boot uncracked',
        'Chain tension, alignment, and lube',
        'All fasteners — head bolts, engine mount, exhaust — safe and torqued',
        'Fresh, correct fuel'
      ]},
      { note: 'Starter module — confirm your sanctioning body\'s exact oil rules and service intervals; send them over and we\'ll lock this into your program\'s spec.' }
    ]
  },

  /* ====================== ENGINE HEALTH & IGNITION ====================== */
  {
    id: 'engine-health',
    title: 'Engine Health & Ignition',
    tag: 'Engine · Care',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v4M7 8h10l2 3-2 8H7l-2-8z"/><path d="M10 12h4"/></svg>',
    summary: 'Read the plug, test leak-down, and keep the ignition & exhaust in spec.',
    sections: [
      { p: 'Beyond lash and carb, a healthy 206 comes down to a few checks — reading the spark plug, testing how well the engine seals, and keeping the ignition and exhaust right. Catch a problem here before it costs you a race.' },
      { h: 'Spark plug' },
      { list: [
        'The legal plug is the <b>AutoLite AR3910X</b> only (tech checks it) — keep the sealing washer, gap per your builder.',
        'Read it: light tan/gray insulator = good mixture; chalky white = lean or too hot; dry black/sooty = rich; wet/oily = oil getting by, investigate.',
        'Replace a fouled or worn plug — a marginal one shows up as a soft top-end or a misfire.'
      ]},
      { h: 'Compression & leak-down' },
      { list: [
        'The 206 has a <b>compression release</b> on the cam, so a cranking compression gauge reads low and isn\'t a good health check.',
        'A <b>leak-down test</b> is the real tell: pressurize the cylinder at TDC and listen — air out the exhaust = exhaust valve; out the carb/intake = intake valve; out the breather = rings.',
        'Rising leak-down over the season flags a tired engine — often a burnt exhaust valve from lash run too tight (see Valve Lash).'
      ]},
      { h: 'Ignition & timing' },
      { list: [
        'Stock green coil; timing is fixed by the flywheel key and must not exceed <b>26°</b> (tech) — don\'t modify the coil mounting.',
        'Coil air gap ~<b>.016"</b> (a business card works) for a clean spark.',
        'Inspect the flywheel key for shear after any sudden stop — a partially sheared key retards timing and kills power. Torque the flywheel nut to 105–115 ft-lb.'
      ]},
      { h: 'Exhaust & intake' },
      { list: [
        'Keep the RLV header safety-wired and wrapped and the B91XL baffles unaltered (tech). A blown header gasket shows up as decel popping (see Carb Tuning).',
        'Service the green air filter — clean and sealed to the carb horn; a dirty or loose filter costs power and lets grit in.'
      ]},
      { tip: 'Normal LO206 head temp runs roughly <b>375–400°F</b> (up toward ~415°F when the kart binds on exit). Treat CHT as a trend/warning tool, not a primary tuning number — log CHT and your leak-down across the season so a slow change warns you early.' }
    ]
  },

  /* ====================== DRIVING & RACECRAFT ====================== */
  {
    id: 'racecraft',
    title: 'Driving & Racecraft',
    tag: 'Driver · Skill',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17c3-1 4-6 8-6s5 5 8 6"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>',
    summary: 'The line, braking, throttle, passing, starts & flags — the driver is half the lap.',
    sections: [
      { p: 'A perfect kart is only as fast as the driver. The LO206 is a <b>momentum</b> engine — modest power, so the whole game is <b>carrying speed</b>: brake later and less, keep it rolling, and get back to full throttle as early as you can.' },
      { h: 'The line' },
      { list: [
        'Out-in-out — use the full track: wide on entry, clip the apex, let it run wide on exit.',
        'A slightly late apex lets you get on the power earlier and drive off straight.',
        'A slow corner onto a long straight matters far more than a fast corner onto a short one — prioritize exit speed onto the straights.'
      ]},
      { h: 'Braking & throttle' },
      { list: [
        'Brake in a straight line where you can, then trail off the brake as you turn in — easing brake pressure helps the kart rotate.',
        'Don\'t over-slow the entry — a 206 hates scrubbing speed. Minimum corner speed IS lap time.',
        'Roll back to full throttle smoothly and early; be at 100% by the apex where the corner allows.'
      ]},
      { h: 'Passing & defending' },
      { list: [
        'The bread-and-butter pass is under braking into a slow corner — get alongside before turn-in and take the inside.',
        'The cross-over: give up the tight inside, get the better exit, and drive past on the next straight.',
        'Defending: take the inside into the braking zone (don\'t weave), be predictable, and leave racing room.'
      ]},
      { h: 'Starts & flags' },
      { list: [
        'Rolling starts: hold position and pace to the line, watch the starter, and time the green for a clean run without jumping.',
        'Flags: green = go; yellow = caution, no passing; blue = faster kart behind, let it by; white = last lap (or slow kart, series-dependent); checkered = finish; black = come in.'
      ]},
      { tip: 'Consistency beats one hot lap — string clean laps within a couple tenths. Use the MyChron predictive delta and overlay laps in Race Studio to find exactly where you\'re losing time.' }
    ]
  },

  /* ====================== BEARINGS, HUBS & STEERING ====================== */
  {
    id: 'bearings-steering',
    title: 'Bearings, Hubs & Steering',
    tag: 'Chassis · Care',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/></svg>',
    summary: 'Keep the running gear tight: axle & front bearings, kingpins, and the steering.',
    sections: [
      { p: 'The parts that spin and steer wear quietly until they bite you. Keep them clean, greased, and free of play.' },
      { h: 'Rear axle bearings' },
      { list: [
        'Spin the axle and feel for grit, roughness, or notchiness; check for up/down play.',
        'Keep the bearing-cassette set screws tight; clean and re-grease per your bearing type.',
        'Replace a rough or loose bearing before it seizes and locks the axle.'
      ]},
      { h: 'Front hubs & spindles' },
      { list: [
        'Front wheel bearings should spin smooth with no play; re-grease or replace when notchy.',
        'Torque the spindle/hub nut and fit the retaining clip/cotter.',
        'Check the spindle for bending after any contact.'
      ]},
      { h: 'Kingpins' },
      { list: [
        'The kingpin bolt sets the steering pivot — snug it so the spindle turns freely with no play, not clamped tight.',
        'A drop of oil/anti-seize on the pivot; inspect for wear or slop; confirm the caster/camber pills or Sniper top plate are tight.'
      ]},
      { h: 'Steering' },
      { list: [
        'Steering-shaft bearing/bushing free with no play; steering-wheel bolts tight.',
        'Tie-rod ends / heim joints: no slop, jam nuts tight, and safety-clipped.',
        'Re-check TOE after any steering work (see Alignment).'
      ]},
      { warn: 'Steering and wheel fasteners are safety-critical — anything with play or a loose jam nut gets fixed before you roll out, and wheel nuts get torqued every session.' },
      { tip: 'Wash the kart first, then do the bearing/steering feel-check while it\'s clean — you\'ll catch grit and play you\'d otherwise miss.' }
    ]
  },

  /* ====================== DRIVER GEAR & SAFETY ====================== */
  {
    id: 'driver-gear',
    title: 'Driver Gear & Safety',
    tag: 'Driver · Safety',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 13a8 8 0 0116 0v2a2 2 0 01-2 2h-1l-1-3H4z"/><path d="M4 13h9"/></svg>',
    summary: 'Helmet, rib protector, suit, gloves — what\'s required and how to pick it.',
    sections: [
      { p: 'Required gear varies a bit by sanctioning body, so confirm your series\' rules — but here\'s the current landscape and how to choose.' },
      { h: 'Helmet' },
      { list: [
        'Full-face with a visor. Accepted: <b>Snell SA2020/SA2025</b> or <b>K2020/K2025</b> (karting), or an <b>FIA</b>-rated helmet. Each series sets how long an older Snell cycle stays legal — confirm the accepted ratings and the cutoff date for your class.',
        'Youth often use Snell CMR/CMS helmets — check your series.',
        'Replace after any hard impact and by the rating\'s expiry; fit snug with no movement.'
      ]},
      { h: 'Rib / chest protector' },
      { list: [
        'Protects your ribs against the seat — <b>mandatory for younger drivers</b> (roughly 12–13 and under) and strongly recommended for everyone.',
        'Look for <b>SFI 20.1</b> or FIA-homologated (Bengio, OMP) with a visible tag where required.'
      ]},
      { h: 'Suit, gloves & shoes' },
      { list: [
        'Suit: an abrasion-resistant kart jacket + full-length pants at minimum; some series (e.g., SKUSA) require a full <b>CIK Level 2</b> kart suit covering legs and ankles.',
        'Gloves: full-fingered and abrasion-resistant (mandatory; no cert needed).',
        'Shoes: closed-toe, laced/buckled, with socks; high-top or racing shoes for ankle coverage.'
      ]},
      { warn: 'Gear standards and age rules differ by league (SKUSA / USPKS / WKA / AKRA and your local track) and change over time — always confirm the current requirement for your class before an event. A neck brace is required in some classes.' },
      { tip: 'Buy to the highest standard your series accepts so the gear stays legal across leagues and seasons.' }
    ]
  },

  /* ====================== PRE-RACE CHECKLIST ====================== */
  {
    id: 'pre-race-checklist',
    title: 'Pre-Race Checklist',
    tag: 'Race Day · Ops',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
    summary: 'Run this before every session so nothing dumb ends your day.',
    sections: [
      { p: 'A quick, repeatable check before every session catches the loose bolt or low tire that ends a weekend. Run it every time — it takes 60 seconds.' },
      { h: 'Engine & driveline' },
      { list: [
        'Oil level & condition; valve lash at baseline.',
        'Both engine seals intact & wrapped; air filter clean & sealed; carb untouched & cap tight.',
        'RLV header wrapped & safety-wired, silencer wired; catch can plumbed.',
        'Chain tension, alignment & lube; clutch gap/engagement; fresh legal fuel.'
      ]},
      { h: 'Chassis & wheels' },
      { list: [
        'All wheel nuts torqued; tire pressures set cold (Evinco baseline).',
        'Kingpin & steering fasteners safe; tie-rod jam nuts tight; brake pedal firm and the kart actually stops.',
        'Seat bolts & struts tight; ballast through-bolted; bodywork & nassau panel secure; nothing dragging.'
      ]},
      { h: 'Driver & admin' },
      { list: [
        'Helmet, rib protector, gloves, suit, shoes on & fastened.',
        'Transponder mounted & charged; MyChron on with GPS lock & charged.',
        'At/over class minimum weight with driver; number panels legible; know your grid & session.'
      ]},
      { warn: 'Do the fastener walk-around every single time — vibration backs bolts out. A 30-second check beats a DNF.' },
      { tip: 'Want this as a tap-to-check list saved per event in the Log? Say the word and I\'ll make it interactive.' }
    ]
  },

  /* ====================== TRAILER, PACK & STORAGE ====================== */
  {
    id: 'trailer-storage',
    title: 'Trailer, Pack List & Storage',
    tag: 'Race Day · Ops',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="14" height="9"/><path d="M17 10h3l1 3v3h-4"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>',
    summary: 'What to bring to the track and how to put the kart away right.',
    sections: [
      { p: 'Half of a smooth weekend is showing up with everything and putting the kart away so it\'s ready next time.' },
      { h: 'Pack list — bring it every time' },
      { list: [
        'Kart, kart stand, and body panels; fuel jug + legal fuel and oil; funnel.',
        'Tools: metric sockets/wrenches, torque wrench, feeler gauges, tire gauge, chain tool & lube, safety wire & pliers, zip ties, tape.',
        'Spares: chain, sprockets (gear range), spark plug, clutch springs/shims, axle key, snap rings, fasteners, a spare tire set.',
        'Tire gear: pressure gauge, tire machine/irons, prep, pyrometer.',
        'Data: MyChron + charger + laptop/RS3; transponder + charger.',
        'Driver: helmet, rib protector, suit, gloves, shoes, water & shade.',
        'Admin: license/registration, cash, pit sign-in, the rulebook, and this app.',
        'Comfort: canopy/EZ-up, chairs, cooler, sunscreen, rain gear.'
      ]},
      { h: 'Between sessions' },
      { list: [
        'Refuel; read pressures hot, then reset cold.',
        'Fastener walk-around; wipe and re-lube the chain.',
        'Log the session in the Log tab.'
      ]},
      { h: 'Off-season / long storage' },
      { list: [
        'Fresh oil (run it in), or fog the cylinder for long storage; drain old fuel from the carb so it doesn\'t gum up.',
        'Deflate the tires slightly and get them off the concrete and out of sun/heat.',
        'Clean the kart, wipe a light oil film on bare metal to stop rust, and store the clutch bushing bagged (see Clutch).',
        'Loosen the chain and store the kart on a stand, off its tires.'
      ]},
      { tip: 'Keep this pack list in the app and tick through it while loading — the thing you forget is always the thing you need.' }
    ]
  },

  /* ====================== INSTALL THE APP ====================== */
  {
    id: 'install-app',
    title: 'Install the App on Your Device',
    tag: 'Setup · The App',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 7v6M9.5 10.5L12 13l2.5-2.5"/></svg>',
    summary: 'Put the hub on your phone, tablet, or Surface — Android, iPhone/iPad, and Windows.',
    sections: [
      { p: 'This hub is a <b>PWA</b> — a web app that installs to your device and runs offline (perfect for the pits with no signal). Once it\'s hosted at a link, everyone on the team installs it in about 30 seconds. It\'s the same URL on every device; the install step just differs a little by platform.' },

      { h: 'Android phone or tablet (Chrome)' },
      { steps: [
        'Open the app\'s link in Chrome.',
        'Tap the ⤓ Install button in the app header — or Chrome\'s menu (⋮) → "Install app" / "Add to Home screen".',
        'Confirm. It lands on your home screen with the 605 icon and opens full-screen, no browser bars.'
      ]},

      { h: 'iPhone or iPad (Safari)' },
      { steps: [
        'Open the link in <b>Safari</b> — Apple only allows installing from Safari, not Chrome.',
        'Tap the Share button (the square with the up-arrow).',
        'Scroll down and tap <b>"Add to Home Screen"</b>, then Add.',
        'It installs with the 605 icon and runs full-screen and offline.'
      ]},
      { note: 'On Apple there\'s no automatic install prompt, so the in-app ⤓ button won\'t appear — use Share → Add to Home Screen. If the app sits unused for a few weeks iOS may clear its offline cache; just open it once with signal to refresh.' },

      { h: 'Windows Surface / laptop (Edge or Chrome)' },
      { steps: [
        'Open the link in Edge or Chrome.',
        'Click the Install icon in the address bar (a small monitor/⊕ icon), or menu → Apps → "Install this site as an app".',
        'It opens in its own window and can be pinned to the taskbar or Start — and works offline like a desktop app.'
      ]},

      { h: 'Updates' },
      { p: 'When we push a new version, installed apps refresh automatically the next time you open them online. If something looks stale, close and reopen the app with signal and it\'ll pull the latest.' },
      { tip: 'Drop the link in the team chat so everyone installs from one place. Same URL, every device.' }
    ]
  }
];

/* =====================================================================
   CATEGORIES  ·  the guide org tree (home-screen filter tabs).
   Each guide id lives in one category. Add a new guide? Put its id in the
   right list here. Any guide not listed falls into "More" automatically.
   ===================================================================== */
const CATEGORIES = [
  { key: 'rules', label: 'Rules & Tech', ids: ['rules-206', 'tech-inspection'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6l1 2h3v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5h3z"/><path d="M9 12l2 2 4-4"/></svg>' },
  { key: 'engine', label: 'Engine', ids: ['valve-lash', 'carb-tuning', 'engine-health', 'break-in'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h3l2-2h4l2 2h3l1 3v3a2 2 0 01-2 2h-1v2H8v-2H5a1 1 0 01-1-1z"/><path d="M9 5h6"/></svg>' },
  { key: 'driveline', label: 'Driveline', ids: ['clutch', 'chain-sprocket'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="12" r="4"/><circle cx="18" cy="12" r="2"/><path d="M8 8v8M18 10v4"/></svg>' },
  { key: 'chassis', label: 'Chassis', ids: ['alignment', 'track-width', 'chassis-setup', 'ballast-placement', 'brakes', 'bearings-steering'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18l3-9h6l4 9M7 9V6a2 2 0 012-2h2M4 18h16"/></svg>' },
  { key: 'tuning', label: 'Setup & Tuning', ids: ['handling', 'weather-tuning'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h8M17 7h3M4 12h3M12 12h8M4 17h11M20 17h0"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="18" cy="17" r="2"/></svg>' },
  { key: 'tires', label: 'Tires', ids: ['tire-prep', 'tire-mount'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/></svg>' },
  { key: 'data', label: 'Data', ids: ['mychron-data', 'race-studio-3', 'race-studio-3-app'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>' },
  { key: 'driver', label: 'Driver', ids: ['racecraft', 'driver-gear'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 13a8 8 0 0116 0v2a2 2 0 01-2 2h-1l-1-3H4z"/><path d="M4 13h9"/></svg>' },
  { key: 'raceday', label: 'Race Day', ids: ['pre-race-checklist', 'trailer-storage'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18"/><path d="M6 4h13l-3 4 3 4H6"/></svg>' },
  { key: 'app', label: 'The App', ids: ['install-app'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>' }
];

/* =====================================================================
   GROUPS  ·  the top level of the tree — categories roll up into a few
   logical areas on the landing. Logic:
     • The Kart       = the machine & its systems/maintenance
     • Tuning & Data  = making it fast and measuring it
     • Race Program   = rules, the driver, and running the weekend
     • Utility        = the app itself
   Any category not placed here falls into "More".
   ===================================================================== */
const GROUPS = [
  { key: 'kart', label: 'The Kart', cats: ['engine', 'driveline', 'chassis', 'tires'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15l3-5h7l4 5"/><path d="M7 10V8h6l2 2"/><path d="M3 15h15"/><circle cx="6.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/></svg>' },
  { key: 'tuningdata', label: 'Tuning & Data', cats: ['tuning', 'data'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15a8 8 0 0116 0"/><path d="M12 15l4-3"/><circle cx="12" cy="15" r="1.4"/></svg>' },
  { key: 'raceprogram', label: 'Race Program', cats: ['rules', 'driver', 'raceday'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18"/><path d="M6 4h13l-3 4 3 4H6"/></svg>' },
  { key: 'utility', label: 'Utility', cats: ['app'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>' }
];

/* =====================================================================
   TRACKS  ·  our home tracks — layouts + info, and the Log dropdown.
   Add a track: append an object here. Drop its layout image in
   images/tracks/<id>.png and it shows on the track's page (until then a
   "TRACK MAP — add drawing" placeholder appears). Stats are approximate /
   config-dependent — confirm locally.
   ===================================================================== */
const TRACKS = [
  {
    id: 'speedsportz',
    name: 'SpeedSportz Racing Park',
    city: 'New Caney (Houston), TX',
    address: '23050 Speed St, New Caney, TX 77357',
    url: 'https://speedsportzracingpark.com',
    map: 'images/tracks/speedsportz.png',
    surface: 'Asphalt',
    path: '232,126 296,188 324,199 389,198 408,206 415,212 440,265 452,278 479,278 536,258 550,262 562,295 563,316 551,328 373,333 115,336 99,330 92,319 91,310 97,295 112,286 142,289 173,291 184,283 187,268 177,254 79,215 76,203 81,192 123,151 136,153 225,239 242,259 250,275 271,289 368,288 381,275 378,257 359,250 298,249 283,241 142,100 127,95 112,100 57,128 43,125 36,112 42,96 54,80 111,48 137,44 161,58 232,126',
    closed: true,
    layouts: [
      { name: 'Main Circuit', length: '—', turns: null, features: 'Fast, flowing, technical — designed by Alan Rudolph' },
      { name: 'Beginner Track', length: '—', turns: null, features: 'Smoother, shorter learner layout' }
    ],
    configs: ['Main competition circuit', 'Separate beginner track', 'Multiple configurations'],
    notes: 'Premier 27-acre outdoor facility north of Houston at Grand Texas. Turn counts vary by configuration — add the official map for the exact layout.'
  },
  {
    id: 'nola',
    name: 'NOLA Motorsports Park',
    city: 'Avondale (New Orleans), LA',
    address: '11075 Nicolle Blvd, Avondale, LA 70094',
    url: 'https://nolamotor.com',
    map: 'images/tracks/nola.png',
    surface: 'Asphalt',
    path: '202,128 229,170 254,208 302,280 340,338 345,343 351,344 359,343 363,338 376,319 377,313 377,302 380,297 384,295 393,294 397,292 398,288 399,218 400,126 400,65 400,45 399,40 394,37 389,36 358,36 352,37 348,42 345,46 345,53 341,55 281,55 273,46 267,46 220,76 217,81 218,85 220,92 219,96 215,100 202,110 201,115 200,121 201,125 202,128',
    closed: true,
    layouts: [
      { name: 'Full Circuit', length: '—', turns: 20, features: 'Long straight (big slipstream) · fast chicanes · hard braking zones' }
    ],
    configs: ['Full circuit (~20 corners)', 'Shorter club configurations'],
    notes: 'Big multi-config circuit that has hosted a Rotax Grand Finals. Use the inside curbs through the chicanes. The ~20 turns are approximate — add the official map for the exact sequence.'
  },
  {
    id: 'dkc',
    name: 'Dallas Karting Complex',
    city: 'Caddo Mills (Dallas), TX',
    address: '5025 FM 1565 N, Caddo Mills, TX 75135',
    url: 'https://dallaskartingcomplex.com',
    map: 'images/tracks/dkc.png',
    surface: 'Asphalt',
    path: '340,183 338,171 333,162 325,157 314,155 233,149 227,146 223,141 221,134 220,127 223,119 228,113 235,110 250,105 256,100 257,92 257,85 254,79 248,74 179,36 173,36 168,39 165,44 163,51 161,121 162,140 165,147 171,153 400,342 406,344 417,344 426,340 434,332 439,322 439,312 435,302 430,295 422,289 325,233 322,229 320,225 319,220 320,214 324,207 340,183',
    closed: true,
    layouts: [
      { name: 'North Track', length: '≈0.7 mi', turns: null, features: 'Public / rental side · lit for night racing' },
      { name: 'South Track', length: '≈0.7 mi', turns: null, features: 'Members & driving school' }
    ],
    configs: ['North track (public)', 'South track (members/school)', 'Multiple configurations each'],
    notes: 'Two ~0.7-mile asphalt tracks (the official site lists ~0.7 mi; some directories say 0.75), each reconfigurable, with full lighting. Turn counts vary by config — add the official maps for exact layouts.'
  },
  {
    id: 'ntk',
    name: 'North Texas Karters (NTK)',
    city: 'Denton, TX',
    address: '3728 Memory Lane, Denton, TX 76207',
    url: 'https://www.ntkarters.com',
    map: 'images/tracks/ntk.png',
    surface: 'Asphalt',
    layouts: [
      { name: 'Club Circuit', length: '0.5 mi', turns: 9, features: 'Tight, technical — rewards a tidy line' }
    ],
    configs: ['0.5-mile, 9-turn club circuit'],
    notes: 'A well-maintained 0.5-mile, nine-turn asphalt club track ~5 miles north of Denton off I-35, open to members year-round.'
  },
  {
    id: 'amarillo',
    name: 'Amarillo Motorsports Park',
    city: 'Panhandle (Amarillo), TX',
    address: '275 FM-2373, Panhandle, TX 79068',
    url: 'https://www.raceamarillo.com',
    map: 'images/tracks/amarillo.png',
    surface: 'Asphalt',
    layouts: [
      { name: 'Kart Circuit', length: '—', turns: null, features: 'Outdoor asphalt sprint circuit (Amarillo Kart Complex)' }
    ],
    configs: ['Outdoor kart circuit'],
    notes: 'Outdoor asphalt kart circuit in the Panhandle. Confirm the current configuration and direction with the club — add the official map for the exact layout.'
  },
  {
    id: 'kartmoto',
    name: 'KartMoto',
    city: 'Cresson, TX',
    address: '9012 Performance Court, Cresson, TX 76035',
    url: 'https://kartmoto.com',
    map: 'images/tracks/kartmoto.png',
    surface: 'Asphalt',
    path: '204,40 391,178 409,195 415,210 413,221 407,225 399,226 389,222 294,149 287,150 282,155 279,166 281,174 289,183 384,266 395,268 420,263 432,266 437,269 441,277 440,287 417,319 411,323 403,323 391,321 384,325 358,344 348,344 339,339 331,330 325,319 323,306 322,267 319,257 312,249 233,182 225,172 220,159 219,149 224,136 234,123 238,115 234,107 210,91 184,82 168,78 161,69 159,60 163,50 173,42 189,36 199,37 204,40',
    closed: true,
    layouts: [
      { name: 'Kart Circuit', length: '0.76 mi', turns: 14, features: '800′ front straight · one banked turn · covered pit lane · lit' }
    ],
    configs: ['Kart circuit (0.76 mi, 14 turns)', 'Paved SuperMoto section (jumps)', 'Dirt Moto section'],
    notes: 'Member facility SW of Fort Worth: a 0.76-mile, 14-turn paved kart circuit with an 800-foot straight and a banked turn, plus SuperMoto and dirt Moto sections.'
  }
];

/* Scene pack j2611221424511: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SC39, MS39, SB40, SP40, RN40.
   Layout prefix j2611221424511_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots    [{at|cue, env, envOpt, toons, cam, props, cards, things, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold     [{on, kind, at|cue, outCue, s, dx, dy, rot}]  object in a toon's hands:
              letter, phone, bowl, book, planner, ticket, suitcase, report, notebook, cup, laptop
     things   [{kind, x, y, s, at|cue, outCue, coldCue, rot}]  world objects standing somewhere (tea cup with steam that goes cold, paper stack...)
     flyers   [{cue|at, kind, from:[x,y], to:[x,y], n, gap, arc, s}]  small objects flying along arcs (world)
     chips    [{at|cue, outCue, text, x, y, bg, fg, size, rot}]  screen chips that pop in
     badges   [{on, at|cue, outCue, text, col}]  chip over a toon's head          pops [{at|cue, text, x, y, size, rot, col}]
     counter  {at|cue, from, to, dur, label, x, y, col}  screen counter that counts up
     trio     {items:[{cue|at, title, sub}], done:n}  three-step strip KEJADIAN / DAMPAK / HARAPAN (screen, top)
     jam      {x, y, s, at|cue, outCue, keys:[{at|cue, hour}], shrugCue, saluteCue}  living alarm-clock creature = the habit
     confetti {at|cue}
   Set pieces (layout suffix):
     _adegan    generic story shot with the extras above
     _gundukan  a bill slipped under a rug becomes a lump: grows, gets DENDA tags, follows the toon under the office carpet,
                someone trips over it, the rug is lifted and the papers fly into a neat stack       f.lump
     _martabak  street martabak cart: the giant CICILAN martabak gets re-sliced into thinner slices while the toon phones   f.cart
     _tumpah    a kid on a kick scooter bumps the grocery bag, oranges burst out and roll across the street   f.spill
     _kabin     imagination airplane cabin: windows with clouds, seat belt sign, oxygen masks drop, put on own mask first   f.cabin
     _takhta    the boss's empty chair under a spotlight with a CUTI tag; complaint envelopes pile up on it; colleagues wait   f.throne
     _bebek     park pond: a mother duck and ducklings waddle ahead while colleagues fall in line behind the hero   f.ducks
     _taksi     mode "putar": a taxi circles a roundabout monument at night, fuel gauge drops, it sputters and stops;
                mode "gps": inside the taxi, the dashboard GPS gets a destination with a number and a date, the road starts moving   f.taxi
     _miniatur  Friday meeting: a wind-up toy taxi rolls along the table to number flags 12 / 28 / 41, then the chequered 50 flag   f.table
     _label     office: a giant label maker prints the tape TUKANG TELAT                                  f.labeler
     _zirah     imagination: the label slaps onto the colleague; armour pieces drop on him, words bounce off the shield,
                the habit (alarm-clock creature) stands untouched                                          f.armor */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, drawToon, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424511_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const pop = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .35), 0, 1));
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size, 880); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.moveTo(x + Math.cos(a) * r * .6 + r * .55, y + Math.sin(a) * r * .45); ctx.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .45, r * .55, 0, TAU); } ctx.fillStyle = col; ctx.fill(); }
  function checkMark(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }
  function steam(ctx, x, y, t, a, n, h){ n = n || 3; h = h || 120; if (a <= 0) return; ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .85 * a); ctx.lineWidth = 7; ctx.lineCap = "round";
    for (let i = 0; i < n; i++){ const q = (t * .7 + i / n) % 1, xx = x + (i - (n - 1) / 2) * 22; ctx.globalAlpha = Math.sin(q * Math.PI); ctx.beginPath();
      for (let j = 0; j <= 8; j++){ const yy = y - q * 40 - j * h / 8, ox = Math.sin(j * .9 + t * 3 + i) * 10; j ? ctx.lineTo(xx + ox, yy) : ctx.moveTo(xx + ox, yy); } ctx.stroke(); } ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function envelope(ctx, w, h, col, mark){ rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = col || PAPER; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, h * .1); ctx.lineTo(w / 2, -h / 2); ol(ctx, 4);
    if (mark){ ctx.beginPath(); ctx.arc(w * .3, h * .18, h * .2, 0, TAU); ctx.fillStyle = mark; ctx.fill(); textC(ctx, "!", w * .3, h * .3, h * .3, "#FFFFFF", 900); } }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "letter"){ ctx.rotate(-.12); rr(ctx, -70, -95, 140, 180, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); rr(ctx, -70, -95, 140, 40, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
      textC(ctx, "TAGIHAN", 0, -66, 24, "#FFFFFF", 900, 126); ctx.fillStyle = "#B9B4AA"; for (let i = 0; i < 4; i++) ctx.fillRect(-52, -36 + i * 24, 70 + rnd(i) * 30, 9);
      ctx.fillStyle = RED; ctx.fillRect(-52, 64, 104, 12); }
    else if (kind === "phone"){ rr(ctx, -32, -62, 64, 124, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); rr(ctx, -25, -52, 50, 100, 6); ctx.fillStyle = o.screen || "#8FD3C7"; ctx.fill();
      if (o.ring){ for (let i = 0; i < 2; i++){ const q = (t * 1.6 + i / 2) % 1; ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 70 + q * 60, -1, .2); ctx.stroke(); ctx.restore(); } } }
    else if (kind === "bowl"){ ctx.beginPath(); ctx.ellipse(0, -10, 74, 20, 0, 0, TAU); ctx.fillStyle = "#F3E6C9"; ctx.fill(); ctx.beginPath(); ctx.moveTo(-74, -10); ctx.quadraticCurveTo(-60, 54, 0, 56); ctx.quadraticCurveTo(60, 54, 74, -10); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = TEAL; ctx.fillRect(-56, 14, 112, 10); ctx.save(); ctx.rotate(-.5); rr(ctx, 10, -70, 14, 80, 7); ctx.fillStyle = "#C9C2B4"; ctx.fill(); ol(ctx, 3); ctx.restore(); steam(ctx, 0, -24, t, 1, 3, 70); }
    else if (kind === "book"){ ctx.rotate(-.08); ctx.beginPath(); ctx.moveTo(-100, -60); ctx.quadraticCurveTo(-50, -76, 0, -60); ctx.quadraticCurveTo(50, -76, 100, -60); ctx.lineTo(100, 50); ctx.quadraticCurveTo(50, 34, 0, 50); ctx.quadraticCurveTo(-50, 34, -100, 50); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 50); ol(ctx, 4); ctx.fillStyle = "#B9B4AA"; for (let i = 0; i < 4; i++){ ctx.fillRect(-84, -40 + i * 20, 66, 6); ctx.fillRect(16, -40 + i * 20, 66, 6); } rr(ctx, -106, 46, 212, 14, 6); ctx.fillStyle = "#7A5BA6"; ctx.fill(); }
    else if (kind === "planner" || kind === "notebook"){ ctx.rotate(-.1); rr(ctx, -74, -96, 148, 192, 10); ctx.fillStyle = kind === "planner" ? "#E07A9B" : GOLD; ctx.fill(); ol(ctx, 5); rr(ctx, -60, -82, 120, 164, 6); ctx.fillStyle = PAPER; ctx.fill();
      const n = o.n ?? 3; for (let i = 0; i < n; i++){ ctx.fillStyle = i % 2 ? ORANGE : TEAL; rr(ctx, -46, -64 + i * 34, 64 + rnd(i) * 22, 12, 6); ctx.fill(); }
      if (kind === "planner"){ ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(18, 54, 22, 0, TAU); ctx.stroke(); } }
    else if (kind === "ticket"){ ctx.rotate(.1); envelope(ctx, 130, 90, PAPER, RED); if (o.ok){ ctx.beginPath(); ctx.arc(46, -36, 26, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); checkMark(ctx, 46, -36, 1.1, "#FFFFFF"); } }
    else if (kind === "suitcase"){ rr(ctx, -30, -40, 60, 30, 10); ol(ctx, 8); rr(ctx, -110, -14, 220, 170, 18); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-60, -14, 18, 170); ctx.fillRect(42, -14, 18, 170); ctx.save(); ctx.rotate(.2); rr(ctx, 40, 40, 60, 40, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    else if (kind === "report"){ ctx.rotate(-.06); rr(ctx, -66, -88, 132, 176, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, "LAPORAN", 0, -50, 24, BROWN, 900, 110);
      ctx.fillStyle = "#B9B4AA"; for (let i = 0; i < 4; i++) ctx.fillRect(-48, -26 + i * 24, 80 + rnd(i) * 16, 9); ctx.fillStyle = ORANGE; ctx.fillRect(-48, 66, 50, 10); }
    else if (kind === "cup"){ rr(ctx, -46, -84, 92, 84, 12); ctx.fillStyle = o.cold ? "#DCE9F2" : "#FFFDF8"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(52, -46, 22, -1.3, 1.3); ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke();
      ctx.fillStyle = o.cold ? "#B98A5A" : "#9A5A2A"; ctx.beginPath(); ctx.ellipse(0, -80, 40, 9, 0, 0, TAU); ctx.fill(); ctx.fillStyle = TEAL; ctx.fillRect(-46, -50, 92, 10);
      ctx.beginPath(); ctx.ellipse(0, 2, 78, 14, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); steam(ctx, 0, -96, t, o.hot ?? 1, 3, 110); }
    else if (kind === "laptop"){ ctx.fillStyle = "#544E42"; ctx.beginPath(); ctx.moveTo(-90, -130); ctx.lineTo(90, -130); ctx.lineTo(98, 0); ctx.lineTo(-98, 0); ctx.closePath(); ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fillRect(-78, -118, 156, 104); ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-64, -104 + k * 26, 50 + ((k * 37 + Math.floor(t * 3)) % 60), 10);
      rr(ctx, -112, 0, 224, 16, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); }
    else if (kind === "stack"){ const n = o.n ?? 6; for (let i = 0; i < n; i++){ ctx.save(); ctx.translate((rnd(i) - .5) * 10, -i * 12); rr(ctx, -90, -10, 180, 14, 3); ctx.fillStyle = i % 3 === 0 ? "#FFE9E6" : PAPER; ctx.fill(); ol(ctx, 3); ctx.restore(); }
      if (o.calc){ ctx.save(); ctx.translate(130, -20); rr(ctx, -40, -60, 80, 110, 10); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 4); rr(ctx, -30, -50, 60, 26, 4); ctx.fillStyle = "#BFE2EA"; ctx.fill();
        for (let i = 0; i < 6; i++){ ctx.fillStyle = i === 5 ? ORANGE : "#E9E2D6"; rr(ctx, -28 + (i % 3) * 20, -14 + Math.floor(i / 3) * 24, 16, 18, 4); ctx.fill(); } ctx.restore(); } }
    else if (kind === "check"){ ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); checkMark(ctx, 0, 0, 1.6, "#FFFFFF"); }
    else if (kind === "chat"){ rr(ctx, -50, -36, 100, 66, 18); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-20, 30); ctx.lineTo(-34, 52); ctx.lineTo(0, 30); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = TEAL; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(-24 + i * 24, -2, 7, 0, TAU); ctx.fill(); } }
    ctx.restore(); }

  /* ---------- living alarm clock = the habit (world, origin = feet) ---------- */
  function clockGuy(ctx, x, y, s, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
    const bob = Math.abs(Math.sin(t * 4)) * 8, sh = o.shrug || 0, sal = o.salute || 0;
    [-1, 1].forEach(d => { ctx.strokeStyle = BROWN; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(d * 40, -80); ctx.lineTo(d * 50, -8); ctx.stroke(); ctx.beginPath(); ctx.ellipse(d * 50 + 10 * d, -6, 24, 11, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.translate(0, -bob);
    // arms
    const armL = [-150, -230 - sh * 70], armR = sal > 0 ? [lerp(150, 60, sal), lerp(-200, -330, sal)] : [150, -230 - sh * 70];
    [[-100, -200, armL], [100, -200, armR]].forEach(([sx, sy, e]) => { ctx.strokeStyle = BROWN; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + e[0]) / 2, sy - 20, e[0], e[1]); ctx.stroke(); ctx.beginPath(); ctx.arc(e[0], e[1], 13, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); });
    // bells
    [-1, 1].forEach(d => { const rg = o.ring ? Math.sin(t * 60) * .15 : 0; ctx.save(); ctx.translate(d * 78, -322); ctx.rotate(d * .5 + rg); ctx.beginPath(); ctx.arc(0, 0, 42, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 5); ctx.restore(); });
    ctx.beginPath(); ctx.arc(0, -200, 120, 0, TAU); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 7);
    ctx.beginPath(); ctx.arc(0, -200, 96, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
    for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = BROWN; ctx.beginPath(); ctx.arc(Math.sin(a) * 82, -200 - Math.cos(a) * 82, i % 3 ? 3 : 6, 0, TAU); ctx.fill(); }
    // eyes + mouth on the face
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 34, -228, 13, 16, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(d * 34 + 3, -226, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.beginPath(); if (o.smirk) { ctx.moveTo(-30, -160); ctx.quadraticCurveTo(0, -150, 34, -172); } else { ctx.arc(0, -166, 20, .15 * Math.PI, .85 * Math.PI); } ol(ctx, 5);
    // hands of the clock
    const hr = o.hour ?? 10, ha = hr / 12 * TAU, ma = (o.min ?? 0) / 60 * TAU;
    ctx.strokeStyle = BROWN; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(Math.sin(ha) * 50, -200 - Math.cos(ha) * 50); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(Math.sin(ma) * 74, -200 - Math.cos(ma) * 74); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -200, 9, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill();
    ctx.restore(); return { top: y - (370 + bob) * s, x }; }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.mod) H.mod(sts, f);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    env(ctx, E, t, c, eo);
    const R = { c, f, piece, shotT, sts };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const drawThings = front => (f.things || []).filter(p => !!p.front === front).forEach((p, n) => { const T0 = p.cue || p.at != null ? tOf(s, p, .3, idx) : -1, O = p.outCue ? T(s, p.outCue, .5, idx) : 1e9; if (t < T0 || t > O + .3) return;
      const q = T0 < 0 ? 1 : eBack(clamp((t - T0) / .35, 0, 1)), oq = 1 - clamp((t - O) / .3, 0, 1), cold = p.coldCue ? ramp(t, T(s, p.coldCue, .3, idx), T(s, p.coldCue, .3, idx) + 1.2) : 0;
      layer(ctx, c, p.depth ?? 1, () => { ctx.save(); ctx.globalAlpha *= oq; drawItem(ctx, p.kind, p.x ?? 540, p.y ?? GY, t, Object.assign({}, p, { s: (p.s || 1) * q, hot: 1 - cold, cold: cold > .6, rot: p.rot || 0 })); ctx.restore(); });
      if (p.coldCue && cold > 0){ const sc = c.toScreen(p.x ?? 540, (p.y ?? GY) - 150 * (p.s || 1)); TT.CS.ov.push(() => popChip(ctx, p.coldText || "DINGIN", sc[0], sc[1] - 40, t - T(s, p.coldCue, .3, idx), "#DCE9F2", "#3B4A6B", 34, -.05)); } });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false); drawThings(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      const r = R[j];
      if (r) layer(ctx, c, 1, () => {
        holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
          drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0) - (st.y - r.y), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); });
      });
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (f.jam){ const J = f.jam, T0 = J.cue || J.at != null ? tOf(s, J, .3, idx) : -1, O = J.outCue ? T(s, J.outCue, .5, idx) : 1e9;
      items.push({ z: J.z ?? .3, j: 60, draw: () => { if (t < T0 || t > O + .4) return; const q = T0 < 0 ? 1 : eBack(clamp((t - T0) / .4, 0, 1)), oq = 1 - clamp((t - O) / .4, 0, 1);
        let hour = J.hour ?? 10, hT = -9, h0 = hour; (J.keys || []).forEach((k, n) => { const tk = tOf(s, k, .3 + n * .1, idx); if (t >= tk){ h0 = hour; hour = k.hour; hT = tk; } });
        const hq = hT > 0 ? easeIO(clamp((t - hT) / 1.2, 0, 1)) : 1, hh = lerp(h0 > hour ? h0 - 12 : h0, hour, hq);
        const shT = J.shrugCue ? T(s, J.shrugCue, .3, idx) : 1e9, saT = J.saluteCue ? T(s, J.saluteCue, .3, idx) : 1e9;
        const shrug = t >= shT ? Math.abs(Math.sin((t - shT) * 5)) * (t - shT < 2 ? 1 : 0) : 0, sal = ramp(t, saT, saT + .4);
        layer(ctx, c, 1, () => { ctx.save(); ctx.globalAlpha *= oq; const r = clockGuy(ctx, J.x ?? 900, J.y ?? GY, (J.s || .8) * q, t, { hour: hh, min: hq < 1 ? (hq * 720) % 60 : 0, shrug, salute: sal, smirk: J.smirk && t < saT, ring: J.ring && t < (J.ringOut ? T(s, J.ringOut, .5, idx) : 1e9), col: sal > 0 ? GREEN : J.col });
          R.jam = r; ctx.restore(); });
        if (J.label){ const p = c.toScreen(J.x ?? 900, (J.y ?? GY) - 400 * (J.s || .8)); TT.CS.ov.push(() => popChip(ctx, sal > 0 && J.label2 ? J.label2 : J.label, clamp(p[0], 200, 880), Math.max(240, p[1] - 30), t - T0 - .3, sal > 0 ? GREEN : PAPER, sal > 0 ? "#FFFFFF" : BROWN, 30, -.04)); } } }); }
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true); drawThings(true);
    (f.flyers || []).forEach((fl, n) => { const T0 = tOf(s, fl, .3 + n * .1, idx), cnt = fl.n || 1, gap = fl.gap ?? .25, dur = fl.dur || .8; if (t < T0) return;
      layer(ctx, c, 1, () => { for (let i = 0; i < cnt; i++){ const k = t - T0 - i * gap; if (k < 0 || k > dur + (fl.stay ? 99 : .15)) continue; const u = eOut(clamp(k / dur, 0, 1));
        const x = lerp(fl.from[0], fl.to[0] + (i - (cnt - 1) / 2) * (fl.spread || 0), u), y = lerp(fl.from[1], fl.to[1], u) - Math.sin(u * Math.PI) * (fl.arc ?? 220);
        ctx.save(); ctx.globalAlpha *= fl.stay ? 1 : 1 - clamp((k - dur) / .15, 0, 1); drawItem(ctx, fl.kind, x, y, t, { s: (fl.s || .8) * (fl.shrink ? lerp(1, .5, u) : 1), rot: (1 - u) * (i % 2 ? .6 : -.6), ok: fl.ok }); ctx.restore(); } }); });
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, clamp(p[0] + (b.dx || 0), 200, 880), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180)); });
    (f.chips || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx), O = p.outCue ? T(s, p.outCue, .6, idx) : 1e9; if (t < T0 || t > O + .3) return;
      ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1); popChip(ctx, p.text, p.x ?? 540, (p.y ?? 330) + Math.sin(t * 2 + n) * 4, t - T0, p.bg || PAPER, p.fg || BROWN, p.size || 44, (p.rot ?? -2) * Math.PI / 180); ctx.restore(); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.counter){ const C = f.counter, T0 = tOf(s, C, .1, idx); if (t >= T0) ovs.push(() => { const q = clamp((t - T0) / (C.dur || 3), 0, 1), v = Math.round(lerp(C.from ?? 0, C.to, easeIO(q)));
      const x = C.x ?? 540, y = C.y ?? 330, k = t - T0, sc = eBack(clamp(k / .35, 0, 1)) * (1 + (q < 1 ? .04 * Math.sin(t * 30) : 0)); ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.03);
      font(ctx, 900, 44, FAM); const lab = C.label || "", wl = ctx.measureText(lab).width; const w = wl + 190, h = 100;
      rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); ctx.fillStyle = BROWN; ctx.textAlign = "left"; ctx.fillText(lab, -w / 2 + 30, 16);
      rr(ctx, w / 2 - 140, -38, 120, 76, 20); ctx.fillStyle = C.col || RED; ctx.fill(); ol(ctx, 4); textC(ctx, String(v), w / 2 - 80, 20, 54, "#FFFFFF", 900); ctx.restore(); }); }
    if (f.trio){ const Q = f.trio, its = Q.items || []; const ts = its.map((it, n) => tOf(s, it, .2 + n * .2, idx)); ovs.push(() => {
      const names = ["KEJADIAN", "DAMPAK", "HARAPAN"], cols = [TEAL, ORANGE, GREEN]; let act = -1; ts.forEach((tt, n) => { if (t >= tt) act = n; }); const done = Q.done ?? 0;
      const k0 = Math.min(...ts.concat([1e9])), tA = (Q.cue || Q.at != null) ? tOf(s, Q, .2, idx) : k0, qIn = done > 0 ? 1 : (t < Math.min(k0, tA) ? 0 : eBack(clamp((t - Math.min(k0, tA)) / .4, 0, 1))); if (qIn <= 0) return;
      ctx.save(); ctx.translate(540, 270); ctx.scale(qIn, qIn);
      for (let n = 0; n < 3; n++){ const x = (n - 1) * 300, on = n === (its[act] ? its[act].n ?? act + done : -1) || n < (act >= 0 ? (its[act].n ?? act + done) : done), cur = its[act] && n === (its[act].n ?? act + done);
        const sc = cur ? 1 + .06 * Math.sin(t * 4) : 1; ctx.save(); ctx.translate(x, 0); ctx.scale(sc, sc); rr(ctx, -135, -42, 270, 84, 42); ctx.fillStyle = on ? cols[n] : "rgba(255,253,246,.85)"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.arc(-95, 0, 28, 0, TAU); ctx.fillStyle = on ? "#FFFFFF" : cols[n]; ctx.fill(); textC(ctx, String(n + 1), -95, 12, 34, on ? cols[n] : "#FFFFFF", 900);
        textC(ctx, names[n], 22, 12, 34, on ? "#FFFFFF" : BROWN, 900, 170); ctx.restore(); }
      ctx.restore();
      if (act >= 0 && its[act].sub){ const it = its[act], k = t - ts[act], n = it.n ?? act + done, q = eBack(clamp(k / .4, 0, 1)), O = it.outCue ? T(s, it.outCue, .5, idx) : 1e9; if (t < O + .3){
        ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1); ctx.translate(540, 400); ctx.scale(q, q); ctx.rotate(-.015);
        const lines = String(it.sub).split("\n"); let size = 46; lines.forEach(l => { size = Math.min(size, fit(ctx, l, 780, 46, 800)); }); font(ctx, 800, size, FAM);
        const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 80, h = lines.length * size * 1.25 + 40; rr(ctx, -w / 2, -24, w, h, 22); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = [TEAL, ORANGE, GREEN][n]; ctx.lineWidth = 7; ctx.stroke();
        ctx.beginPath(); ctx.moveTo((n - 1) * 300 - 16, -24); ctx.lineTo((n - 1) * 300, -60); ctx.lineTo((n - 1) * 300 + 16, -24); ctx.fillStyle = [TEAL, ORANGE, GREEN][n]; ctx.fill();
        lines.forEach((l, m) => textC(ctx, l, 0, 22 + size * .5 + m * size * 1.25, size, BROWN, 800)); ctx.restore(); } } }); }
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
  function sfxBase(s, f0, i, add){
    const all = [f0].concat(f0.shots || []);
    all.forEach((f, n) => {
      const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
      if (n > 0) add(tOf(s, f, .2, i), "whoosh");
      (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
      (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
      if (n === 0 || f.cards !== f0.cards) (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
      (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
      (f.things || []).forEach(p => { if (p.cue) add(tOf(s, p, .3, i), "pop"); if (p.coldCue) add(cueT(s, p.coldCue, .3, i), "ping"); });
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); });
      (f.flyers || []).forEach((fl, n2) => add(tOf(s, fl, .3 + n2 * .1, i), "whoosh"));
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      (f.chips || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i), "pop"));
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.counter) add(tOf(s, f0.counter, .1, i), "pop");
    if (f0.trio) (f0.trio.items || []).forEach((it, n) => add(tOf(s, it, .2 + n * .2, i), "chime"));
    if (f0.jam){ if (f0.jam.cue) add(tOf(s, f0.jam, .3, i), "pop"); (f0.jam.keys || []).forEach((k, n) => add(tOf(s, k, .3 + n * .1, i), "whoosh")); if (f0.jam.saluteCue) add(cueT(s, f0.jam.saluteCue, .3, i), "chime"); }
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const sfxWith = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); fn(s, f, i, add); };

  /* ================= _adegan ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, benda dunia, terbang, chip, penghitung, tiga langkah, jam kebiasaan)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= _gundukan: bill under the rug ================= */
  function rugDraw(ctx, x, w, mode, t, lift){
    const y0 = GY - 26, y1 = GY + 70, office = mode === "office";
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x - w / 2 + 40, y0); ctx.lineTo(x + w / 2 - 40, y0); ctx.lineTo(x + w / 2, y1); ctx.lineTo(x - w / 2, y1); ctx.closePath();
    ctx.fillStyle = office ? "#2F5F63" : "#A8452E"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.clip();
    if (office){ ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 3; for (let xx = x - w; xx < x + w; xx += 26){ ctx.beginPath(); ctx.moveTo(xx, y0); ctx.lineTo(xx + 20, y1); ctx.stroke(); } }
    else { ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - w / 2 + 70, y0 + 16); ctx.lineTo(x + w / 2 - 70, y0 + 16); ctx.lineTo(x + w / 2 - 40, y1 - 16); ctx.lineTo(x - w / 2 + 40, y1 - 16); ctx.closePath(); ctx.stroke();
      for (let i = -3; i <= 3; i++){ ctx.save(); ctx.translate(x + i * w / 8, (y0 + y1) / 2); ctx.scale(1, .35); ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(40, 0); ctx.lineTo(0, 40); ctx.lineTo(-40, 0); ctx.closePath(); ctx.fillStyle = i % 2 ? CREAM : ORANGE; ctx.fill(); ctx.restore(); } }
    ctx.restore();
    if (!office){ ctx.strokeStyle = CREAM; ctx.lineWidth = 3; for (let xx = x - w / 2; xx <= x + w / 2; xx += 16){ ctx.beginPath(); ctx.moveTo(xx, y1); ctx.lineTo(xx + Math.sin(t * 2 + xx) * 2, y1 + 14); ctx.stroke(); } }
    if (false){ // (flap removed)
      ctx.save(); ctx.translate(x + w / 2 - 20, y1); ctx.rotate(-lift * 1.1); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-w * .45, 0); ctx.lineTo(-w * .45 + 30, -96); ctx.lineTo(0, -96); ctx.closePath();
      ctx.fillStyle = office ? "#56657A" : "#7E2F1F"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
    ctx.restore(); }
  function lumpDraw(ctx, x, h, w, mode, t, o){
    if (h <= 2) return; const office = mode === "office", top = GY + 20 - h, wob = o.wob || 0, sq = o.sq || 0;
    const hw = (w * .5 + h * .9) * (1 + sq * .25), hh = h * (1 - sq * .35);
    ctx.save(); ctx.translate(x, GY + 20); ctx.scale(1 + Math.sin(t * 3) * .015 * (h / 200) + wob * Math.sin(t * 30) * .03, 1 + Math.cos(t * 3) * .02 * (h / 200));
    ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.ellipse(0, 34, hw * 1.05, 26, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-hw, 20); ctx.bezierCurveTo(-hw * .55, 20, -hw * .5, -hh, 0, -hh); ctx.bezierCurveTo(hw * .5, -hh, hw * .55, 20, hw, 20); ctx.closePath();
    const g = ctx.createLinearGradient(0, -hh, 0, 20); g.addColorStop(0, office ? "#4F8F93" : "#C45A3C"); g.addColorStop(1, office ? "#2F5F63" : "#8E3A26"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.clip();
    if (office){ ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 3; for (let xx = -hw; xx < hw; xx += 26){ ctx.beginPath(); ctx.moveTo(xx, -hh); ctx.lineTo(xx + 20, 20); ctx.stroke(); } }
    else { for (let i = -3; i <= 3; i++){ ctx.save(); ctx.translate(i * hw / 3.2, -hh * .45 + Math.abs(i) * hh * .12); ctx.scale(1, .6); ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(34, 0); ctx.lineTo(0, 34); ctx.lineTo(-34, 0); ctx.closePath(); ctx.fillStyle = i % 2 ? CREAM : GOLD; ctx.fill(); ctx.restore(); }
      ctx.strokeStyle = hexA(GOLD, .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-hw * .85, 6); ctx.bezierCurveTo(-hw * .4, 0, -hw * .4, -hh * .78, 0, -hh * .8); ctx.bezierCurveTo(hw * .4, -hh * .78, hw * .4, 0, hw * .85, 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.beginPath(); ctx.ellipse(-hw * .2, -hh * .7, hw * .25, hh * .12, -.3, 0, TAU); ctx.fill();
    ctx.restore();
    // paper corners peeking out at the base
    const n = Math.min(5, 1 + Math.floor(h / 70)); for (let i = 0; i < n; i++){ const px = (-.6 + i * .3) * hw * .9, rot = -.5 + rnd(i + 3); ctx.save(); ctx.translate(px, 18); ctx.rotate(rot); rr(ctx, -22, -14, 44, 28, 3); ctx.fillStyle = i % 2 ? "#FFE9E6" : PAPER; ctx.fill(); ol(ctx, 3); ctx.fillStyle = RED; ctx.fillRect(-18, -10, 36, 6); ctx.restore(); }
    // tremble lines
    if (o.rumble){ ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ const a = Math.sin(t * 20 + i) * 6; ctx.beginPath(); ctx.moveTo(-hw - 30 - i * 16, -10 - i * 18 + a); ctx.lineTo(-hw - 50 - i * 16, -20 - i * 18 + a); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hw + 30 + i * 16, -10 - i * 18 - a); ctx.lineTo(hw + 50 + i * 16, -20 - i * 18 - a); ctx.stroke(); } }
    ctx.restore(); return { top, hw }; }
  TT.scene(PX + "gundukan", "Cerita: tagihan di bawah karpet jadi gundukan (tumbuh, label denda, membuntuti, tersandung, karpet dibuka)", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, L = Object.assign({ x: 620, w: 900, mode: "rug", h0: 0, lag: .55, dx: 0 }, f0.lump || {});
    let h = L.h0; let hT = -9, hFrom = h; (L.grow || []).forEach((g, n) => { const tg = tOf(s, g, .3 + n * .1, idx); if (t >= tg){ hFrom = h; h = g.h; hT = tg; } });
    const gq = hT > 0 ? eBack(clamp((t - hT) / .6, 0, 1)) : 1; let H = lerp(hFrom, h, gq);
    const slipT = L.slip ? T(s, L.slip.cue, .3, idx) : 1e9, tripT = L.trip ? T(s, L.trip.cue, .3, idx) : 1e9, liftT = L.lift ? T(s, L.lift.cue, .3, idx) : 1e9;
    const liftQ = ramp(t, liftT, liftT + .5); if (liftQ > 0) H = H * (1 - eOut(liftQ));
    const sq = t >= tripT && t < tripT + .5 ? Math.sin((t - tripT) / .5 * Math.PI) : 0;
    const tags = (L.tags || []).map((g, n) => ({ g, T: tOf(s, g, .3 + n * .12, idx) }));
    let lumpX = L.x;
    base(ctx, s, t, { env: L.mode === "office" ? "office" : "home", envOpt: L.mode === "office" ? { rug: false, desk: false } : { time: "day" },
      spots: { lump: () => [lumpX, GY - Math.max(H, 60) * .6 - 120, 1.15] },
      mod: (sts) => { if (L.follow != null && sts[L.follow]){ const a = (f0.toons || [])[L.follow], st2 = toonState(a, s, Math.max(0, t - L.lag)); lumpX = st2.x + L.dx; } },
      back: (ctx2, c, sts) => {
        rugDraw(ctx, L.rugX ?? L.x, L.w, L.mode, t, L.mode === "office" ? 0 : liftQ * (1 - ramp(t, liftT + 2.5, liftT + 3)));
        const r = lumpDraw(ctx, lumpX, H, 120, L.mode, t, { sq, wob: H > 150 ? 1 : 0, rumble: L.follow != null && sts[L.follow] && Math.abs(sts[L.follow].vx) > 30 });
        R0.r = r; },
      front: (ctx2, c, sts) => {
        // slipped letter flying from the hand under the rug
        if (L.slip && t >= slipT && t < slipT + .9){ const st = sts[L.slip.from ?? 0], p = handOf(st), u = eOut(clamp((t - slipT) / .8, 0, 1));
          const x = lerp(p[0], lumpX, u), y = lerp(p[1], GY + 10, u) - Math.sin(u * Math.PI) * 120; ctx.save(); ctx.globalAlpha = 1 - clamp((u - .85) / .15, 0, 1); drawItem(ctx, "letter", x, y, t, { s: .9 * (1 - u * .4), rot: u * 1.4 }); ctx.restore(); }
        if (L.lift && t >= liftT){ const n = 8, sx = L.lift.toX ?? 300, sy = L.lift.toY ?? 1380;
          for (let i = 0; i < n; i++){ const k = t - liftT - .15 - i * .1; if (k < 0) continue; const u = eOut(clamp(k / .9, 0, 1));
            if (u < 1){ const x = lerp(lumpX, sx, u), y = lerp(GY, sy - i * 10, u) - Math.sin(u * Math.PI) * (360 + i * 30); ctx.save(); ctx.translate(x, y); ctx.rotate((1 - u) * (i % 2 ? 4 : -4)); rr(ctx, -60, -40, 120, 80, 5); ctx.fillStyle = i % 2 ? PAPER : "#FFE9E6"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(-46, -28, 92, 10); ctx.restore(); } }
          const k2 = t - liftT - 1.0; if (k2 > 0) drawItem(ctx, "stack", sx, sy, t, { n: Math.min(8, 1 + Math.floor(k2 / .1)), s: 1, calc: k2 > 1.2 }); }
      },
      over: (ctx2, c) => {
        const r = R0.r; if (!r) return;
        tags.forEach(({ g, T: tg }, n) => { if (t < tg || H < 30) return; const ang = (n - (tags.length - 1) / 2) * .9, px = lumpX + Math.sin(ang) * r.hw * .62, py = GY + 20 - H * (.35 + .45 * Math.cos(ang)) - (n % 2) * 40;
          const p = c.toScreen(px, py); popChip(ctx, g.text, clamp(p[0], 160, 920), p[1] + Math.sin(t * 3 + n) * 4, t - tg, g.col || RED, "#FFFFFF", g.size || 38, (n % 2 ? .08 : -.08)); burstFx(ctx, p[0], p[1], t - tg - .05, RED, 10, 110); });
      } });
  }, sfxWith((s, f, i, add) => { const L = f.lump || {}; (L.grow || []).forEach((g, n) => add(tOf(s, g, .3 + n * .1, i), "whoosh")); (L.tags || []).forEach((g, n) => add(tOf(s, g, .3 + n * .12, i), "pop"));
    if (L.slip) add(cueT(s, L.slip.cue, .3, i), "whoosh"); if (L.trip) add(cueT(s, L.trip.cue, .3, i), "pop"); if (L.lift){ add(cueT(s, L.lift.cue, .3, i), "whoosh"); add(cueT(s, L.lift.cue, .3, i) + 1.1, "chime"); } }));
  const R0 = {};

  /* ================= _martabak: re-slicing the instalment ================= */
  function cartDraw(ctx, x, t, o){
    const top = GY - 330; ctx.save();
    // roof + sign
    ctx.fillStyle = "#6B4426"; ctx.fillRect(x - 270, top - 470, 14, 470); ctx.fillRect(x + 256, top - 470, 14, 470);
    ctx.beginPath(); ctx.moveTo(x - 330, top - 470); ctx.lineTo(x + 330, top - 470); ctx.lineTo(x + 300, top - 540); ctx.lineTo(x - 300, top - 540); ctx.closePath(); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 5);
    for (let i = 0; i < 8; i++){ ctx.beginPath(); ctx.moveTo(x - 330 + i * 82.5, top - 470); ctx.quadraticCurveTo(x - 330 + i * 82.5 + 41, top - 425, x - 330 + (i + 1) * 82.5, top - 470); ctx.fillStyle = i % 2 ? CREAM : "#3E9B5A"; ctx.fill(); ol(ctx, 3); }
    rr(ctx, x - 240, top - 640, 480, 96, 18); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "MARTABAK MANIS", x, top - 578, 46, "#FFFFFF", 900, 440);
    // bulb
    ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, top - 470); ctx.lineTo(x, top - 400); ctx.stroke(); glowAt(ctx, x, top - 380, 160, "#FFE7A8", .5 + .1 * Math.sin(t * 9)); ctx.beginPath(); ctx.arc(x, top - 380, 18, 0, TAU); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 3);
    ctx.restore(); }
  function cartFront(ctx, x, t){
    const top = GY - 330; ctx.save();
    // wheels
    [-170, 170].forEach(d => { ctx.save(); ctx.translate(x + d, GY - 50); ctx.rotate(t * .3); ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 5; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * Math.PI / 2) * 40, Math.sin(k * Math.PI / 2) * 40); ctx.stroke(); } ctx.restore(); });
    rr(ctx, x - 300, top, 600, 250, 14); ctx.fillStyle = "#F3E2C8"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - 300, top, 600, 40, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5);
    rr(ctx, x - 270, top + 60, 330, 160, 10); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(x - 250, top + 70, 30, 140);
    for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(x - 200 + i * 90, top + 170, 34, Math.PI, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 3); }
    textC(ctx, "Rasa coklat · keju", x + 170, top + 150, 28, BROWN, 800, 200);
    // griddle
    ctx.beginPath(); ctx.ellipse(x + 190, top - 4, 90, 22, 0, 0, TAU); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 4); steam(ctx, x + 190, top - 20, t, .7, 3, 90);
    ctx.restore(); }
  function martabak(ctx, x, y, R, slices, cutQ, sep, t, label){
    ctx.save(); ctx.translate(x, y); const ry = .38;
    // board
    ctx.beginPath(); ctx.ellipse(0, 26, R * 1.18, R * ry * 1.18, 0, 0, TAU); ctx.fillStyle = "#A0643C"; ctx.fill(); ol(ctx, 5);
    // side thickness
    ctx.beginPath(); ctx.ellipse(0, 12, R, R * ry, 0, 0, Math.PI); ctx.lineTo(-R, -8); ctx.ellipse(0, -8, R, R * ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fillStyle = "#D98A3A"; ctx.fill(); ol(ctx, 5);
    // top
    const n = slices; for (let i = 0; i < n; i++){ const a0 = i / n * TAU, a1 = (i + 1) / n * TAU, am = (a0 + a1) / 2, dx = Math.cos(am) * sep, dy = Math.sin(am) * sep * ry;
      ctx.beginPath(); ctx.moveTo(dx, -8 + dy); for (let k = 0; k <= 10; k++){ const a = lerp(a0, a1, k / 10); ctx.lineTo(dx + Math.cos(a) * R, -8 + dy + Math.sin(a) * R * ry); } ctx.closePath();
      ctx.fillStyle = "#E9A24B"; ctx.fill(); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.stroke();
      ctx.save(); ctx.clip(); ctx.strokeStyle = "#5A2E16"; ctx.lineWidth = 7; for (let k = -3; k <= 3; k++){ ctx.beginPath(); ctx.moveTo(-R, -8 + k * 26); for (let xx = -R; xx <= R; xx += 30) ctx.lineTo(xx, -8 + k * 26 + Math.sin(xx * .05 + k) * 8); ctx.stroke(); }
      ctx.fillStyle = "#FFF1C9"; for (let k = 0; k < 6; k++){ ctx.fillRect(Math.cos(am) * R * .55 + (rnd(i * 7 + k) - .5) * 60, -8 + Math.sin(am) * R * ry * .55 + (rnd(i * 5 + k) - .5) * 20, 10, 5); } ctx.restore(); }
    // new cut lines being drawn
    if (cutQ > 0 && cutQ < 1){ const m = n; void m; }
    // flag label
    if (label){ const fx = -R * .62; ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx, -8); ctx.lineTo(fx, -130); ctx.stroke(); const sw = Math.sin(t * 3) * .06; ctx.save(); ctx.translate(fx, -130); ctx.rotate(sw); rr(ctx, -190, -6, 190, 60, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, label, -95, 34, 32, RED, 900, 170); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "martabak", "Cerita: gerobak martabak, martabak CICILAN dipotong ulang jadi potongan lebih tipis", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, C = Object.assign({ x: 760, n0: 4, n1: 8, label: "CICILAN" }, f0.cart || {});
    const tCut = C.cutCue ? T(s, C.cutCue, .3, idx) : 1e9, nCut = C.n1 - C.n0, cutDur = .28;
    const done = t < tCut ? 0 : Math.min(nCut, Math.floor((t - tCut) / cutDur)), slices = t < tCut ? C.n0 : (done >= nCut ? C.n1 : C.n0);
    const MX = C.x - 60, MY = GY - 340, RAD = 170;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { cake: [MX, MY - 60, 1.45] },
      back: () => cartDraw(ctx, C.x, t, {}),
      front: () => { cartFront(ctx, C.x, t);
        const sep = done >= nCut ? 10 * eBack(clamp((t - tCut - nCut * cutDur) / .4, 0, 1)) : 0;
        martabak(ctx, MX, MY, RAD, slices, 0, sep, t, C.label);
        // the knife sweeping new cuts
        if (t >= tCut && t < tCut + nCut * cutDur + .3){ const kk = Math.min(nCut - 1, Math.floor((t - tCut) / cutDur)), u = clamp(((t - tCut) - kk * cutDur) / cutDur, 0, 1);
          const a = (kk + .5) / C.n0 * TAU; const ex = Math.cos(a) * RAD, ey = Math.sin(a) * RAD * .38;
          ctx.save(); ctx.strokeStyle = "#5A2E16"; ctx.lineWidth = 4; for (let j = 0; j < kk; j++){ const aa = (j + .5) / C.n0 * TAU; ctx.beginPath(); ctx.moveTo(MX, MY - 8); ctx.lineTo(MX + Math.cos(aa) * RAD, MY - 8 + Math.sin(aa) * RAD * .38); ctx.stroke(); }
          ctx.beginPath(); ctx.moveTo(MX, MY - 8); ctx.lineTo(MX + ex * u, MY - 8 + ey * u); ctx.stroke();
          ctx.translate(MX + ex * u, MY - 8 + ey * u - 60); ctx.rotate(-.3 + Math.sin(u * Math.PI) * .2); rr(ctx, -16, -120, 32, 90, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.moveTo(-14, -30); ctx.lineTo(14, -30); ctx.lineTo(22, 60); ctx.lineTo(-6, 70); ctx.closePath(); ctx.fillStyle = "#DCE3EA"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
      },
      over: (ctx2, c) => { if (C.lightCue){ const tl = T(s, C.lightCue, .3, idx), tO = C.lightOut ? T(s, C.lightOut, .3, idx) : 1e9; if (t >= tl && t < tO){ const p = c.toScreen(MX, MY - 220); popChip(ctx, C.lightText || "LEBIH RINGAN / BULAN", clamp(p[0], 300, 780), Math.max(250, p[1] - 60), t - tl, GREEN, "#FFFFFF", 40, -.04); burstFx(ctx, p[0], p[1] + 60, t - tl, GOLD, 12, 220); } } } });
  }, sfxWith((s, f, i, add) => { const C = f.cart || {}; if (C.cutCue){ const t0 = cueT(s, C.cutCue, .3, i); for (let k = 0; k < (C.n1 || 8) - (C.n0 || 4); k++) add(t0 + k * .28, "pop"); } if (C.lightCue) add(cueT(s, C.lightCue, .3, i), "chime"); }));

  /* ================= _tumpah: groceries burst ================= */
  function scooter(ctx, x, y, s, face, t, moving){ ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s);
    [-110, 110].forEach(d => { ctx.save(); ctx.translate(d, -26); ctx.rotate(moving ? t * 14 : 0); ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-4, -20, 8, 40); ctx.restore(); });
    rr(ctx, -130, -62, 240, 22, 10); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(110, -30); ctx.lineTo(96, -300); ctx.stroke(); ctx.strokeStyle = "#3E9B5A"; ctx.lineWidth = 7; ctx.stroke();
    ctx.lineWidth = 12; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.moveTo(60, -300); ctx.lineTo(130, -300); ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "tumpah", "Cerita: anak dengan skuter menyenggol belanjaan, jeruk berhamburan di jalan", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Sp = Object.assign({ n: 9, kid: 1, mom: 0 }, f0.spill || {}), tB = Sp.cue ? T(s, Sp.cue, .3, idx) : 1e9;
    let bag0 = null;
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      spots: { spill: [Sp.x ?? 560, 1250, 1.05] },
      under: (ctx2, c, sts, j) => { if (j !== Sp.kid) return; const st = sts[j]; scooter(ctx, st.x, GY, st.size / 560, st.face || 1, t, st.moving); },
      mod: (sts) => { if (sts[Sp.kid]) sts[Sp.kid].y = GY - 40 * sts[Sp.kid].size / 560; if (sts[Sp.mom]) bag0 = handOf(sts[Sp.mom]); },
      front: (ctx2, c, sts) => {
        if (!bag0) return; const k = t - tB;
        if (k < 0){ drawBag(ctx, bag0[0] + 30, bag0[1] + 40, 1, 0, t); return; }
        // bag falls and tips over
        const u = clamp(k / .45, 0, 1), bx = bag0[0] + 30 + u * 60, by = lerp(bag0[1] + 40, GY - 70, u * u); drawBag(ctx, bx, by, 1, eOut(u) * 1.4, t);
        for (let i = 0; i < Sp.n; i++){ const vx = (rnd(i) - .4) * 1300, vy = -600 - rnd(i + 4) * 500, kk = Math.max(0, k - .05 - i * .02);
          let x = bx + vx * kk, y = by - 60 + vy * kk + 1600 * kk * kk; let rot = kk * vx * .02;
          const tl = (-vy + Math.sqrt(vy * vy + 4 * 1600 * (GY - 30 - (by - 60)))) / (2 * 1600); if (kk > tl){ const kk2 = kk - tl, b = Math.max(0, 1 - kk2 * 1.2); x = bx + vx * tl + vx * .6 * (1 - Math.exp(-kk2 * 2)) / 2; y = GY - 40 - Math.abs(Math.sin(kk2 * 9)) * 90 * b * b; rot = kk * vx * .02; }
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1.35, 1.35); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#F28C28"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.arc(-9, -9, 8, 0, TAU); ctx.fill();
          ctx.fillStyle = GREEN; ctx.beginPath(); ctx.ellipse(6, -30, 12, 6, -.5, 0, TAU); ctx.fill(); ctx.restore(); }
        burstFx(ctx, bx, by - 40, k, HL, 10, 160);
      } });
  }, sfxWith((s, f, i, add) => { const Sp = f.spill || {}; if (Sp.cue){ const t0 = cueT(s, Sp.cue, .3, i); add(t0, "pop"); add(t0 + .5, "pop"); add(t0 + .8, "ping"); } }));
  function drawBag(ctx, x, y, s, tip, t){ ctx.save(); ctx.translate(x, y); ctx.rotate(tip); ctx.scale(s, s);
    for (let i = 0; i < 3; i++){ if (tip > .3) break; ctx.beginPath(); ctx.arc(-30 + i * 30, -70 - (i % 2) * 14, 26, 0, TAU); ctx.fillStyle = "#F28C28"; ctx.fill(); ol(ctx, 4); }
    ctx.beginPath(); ctx.moveTo(-70, -64); ctx.lineTo(70, -64); ctx.lineTo(60, 60); ctx.lineTo(-60, 60); ctx.closePath(); ctx.fillStyle = "#EAD7B5"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#B9935E"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -64, 34, Math.PI, 0); ctx.stroke(); ctx.fillStyle = "#3E9B5A"; ctx.beginPath(); ctx.ellipse(40, -80, 10, 34, .3, 0, TAU); ctx.fill(); ctx.restore(); }

  /* ================= _kabin: airplane cabin ================= */
  TT.scene(PX + "kabin", "Cerita: kabin pesawat (jendela awan, tanda sabuk, masker oksigen jatuh, pasang masker sendiri dulu)", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, K = Object.assign({ seats: [400, 700], panelY: 640 }, f0.cabin || {});
    const tDrop = K.dropCue ? T(s, K.dropCue, .3, idx) : 1e9, ons = (K.maskOn || []).map((m, n) => ({ on: m.on, T: tOf(s, m, .3 + n * .1, idx) }));
    const masksAt = (K.masks || K.seats);
    base(ctx, s, t, { env: "sky", envOpt: { time: "day" }, envFront: false,
      spots: { panel: [560, 900, 1.05] },
      back: () => {
        // cabin walls with window holes
        ctx.save(); ctx.beginPath(); ctx.rect(-600, -400, 2300, 2600);
        const wins = []; for (let i = -2; i < 7; i++) wins.push(i * 300 + 40);
        wins.forEach(wx => { rr(ctx, wx + 230, 700, -150, 230, 70); });
        ctx.fillStyle = "#EFE6D6"; ctx.fill("evenodd"); ctx.restore();
        ctx.fillStyle = "rgba(0,0,0,.06)"; ctx.fillRect(-600, 1000, 2300, 480);
        wins.forEach(wx => { rr(ctx, wx + 80, 700, 150, 230, 70); ol(ctx, 10, "#CFC4B0"); rr(ctx, wx + 70, 690, 170, 250, 80); ol(ctx, 4, "#B9AE98");
          // shade half pulled
          rr(ctx, wx + 80, 700, 150, 40, 20); ctx.fillStyle = "#D8CDB9"; ctx.fill(); });
        // overhead bins
        ctx.fillStyle = "#F7F1E6"; rr(ctx, -600, 300, 2300, 280, 40); ctx.fill(); ol(ctx, 5, "#CFC4B0");
        for (let x = -540; x < 1700; x += 420){ ctx.strokeStyle = "#CFC4B0"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, 310); ctx.lineTo(x, 570); ctx.stroke(); rr(ctx, x + 160, 520, 100, 18, 9); ctx.fillStyle = "#B9AE98"; ctx.fill(); }
        // passenger service panel strip
        ctx.fillStyle = "#E3D9C6"; ctx.fillRect(-600, 580, 2300, 80); ctx.strokeStyle = "#B9AE98"; ctx.lineWidth = 4; ctx.strokeRect(-600, 580, 2300, 80);
        // seat belt sign
        const blink = (t > tDrop && Math.floor(t * 3) % 2 === 0) || t <= tDrop; rr(ctx, 470, 594, 140, 52, 10); ctx.fillStyle = blink ? "#FFE39A" : "#9A8F7A"; ctx.fill(); ol(ctx, 3);
        ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(520, 612, 7, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(512, 640); ctx.lineTo(528, 640); ctx.lineTo(530, 622); ctx.lineTo(510, 622); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(548, 610); ctx.lineTo(590, 630); ctx.moveTo(548, 630); ctx.lineTo(590, 610); ctx.stroke();
        // aisle floor
        ctx.fillStyle = "#5B6B86"; ctx.fillRect(-600, GY - 40, 2300, 500); ctx.fillStyle = "#4A5870"; for (let x = -600; x < 1700; x += 60) ctx.fillRect(x, GY - 40, 30, 500);
        // seat backs behind the toons
        K.seats.forEach(sx => { ctx.save(); ctx.translate(sx - 120, 0); rr(ctx, -40, 1010, 120, 520, 40); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 5); rr(ctx, -50, 1000, 140, 120, 40); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
        // panel flaps open + masks dangling
        if (t >= tDrop){ masksAt.forEach((mx, n) => { const k = t - tDrop - n * .08; if (k < 0) return; const fl = eOut(clamp(k / .25, 0, 1));
          ctx.save(); ctx.translate(mx - 70, 660); ctx.rotate(fl * 1.2); ctx.fillStyle = "#E3D9C6"; ctx.fillRect(0, 0, 140, 14); ol(ctx, 3); ctx.restore(); }); }
      },
      front: (ctx2, c, sts, R) => {
        // armrests in front of seated toons
        K.seats.forEach(sx => { rr(ctx, sx + 60, 1430, 160, 34, 14); ctx.fillStyle = "#24575A"; ctx.fill(); ol(ctx, 4); });
        if (t < tDrop) return;
        masksAt.forEach((mx, n) => { const k = t - tDrop - n * .08; if (k < 0) return; const on = ons.find(o => o.on === n && t >= o.T);
          let px = mx, py = 660 + 360 * eBack(clamp(k / .5, 0, 1)) + Math.sin(k * 6 + n) * 18 * Math.exp(-k * .8);
          if (on && R[n]){ const u = easeIO(clamp((t - on.T) / .5, 0, 1)), st = sts[n], mxw = R[n].headX + 15 * R[n].k * (st.face || 1), myw = R[n].mouthY ?? (R[n].headY + 10 * R[n].k); px = lerp(px, mxw, u); py = lerp(py, myw, u); }
          ctx.strokeStyle = "#D9D2C2"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(mx, 660); ctx.quadraticCurveTo((mx + px) / 2 + 20, (660 + py) / 2, px, py - 30); ctx.stroke();
          const sc = on && R[n] ? R[n].k / 4.6 : 1.3; ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc);
          if (on && R[n]){ ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(-20, -20, 70, 34, -.2, 0, TAU); ctx.stroke(); }
          ctx.beginPath(); ctx.moveTo(-34, -30); ctx.lineTo(34, -30); ctx.lineTo(26, 20); ctx.quadraticCurveTo(0, 34, -26, 20); ctx.closePath(); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
      },
      over: (ctx2, c) => { if (t >= tDrop && t < tDrop + .6){ ctx.save(); ctx.globalAlpha = .25 * (1 - (t - tDrop) / .6) * (Math.floor(t * 12) % 2); ctx.fillStyle = RED; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const K = f.cabin || {}; if (K.dropCue){ add(cueT(s, K.dropCue, .3, i), "ping"); add(cueT(s, K.dropCue, .3, i) + .2, "whoosh"); } (K.maskOn || []).forEach((m, n) => add(tOf(s, m, .3 + n * .1, i), "pop")); }));

  /* ================= _takhta: empty boss chair ================= */
  function bossChair(ctx, x, t, o){
    ctx.save(); ctx.translate(x, 0); const sw = Math.sin(t * .8) * .03 + (o.spin || 0);
    // base + wheels
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, GY - 230); ctx.lineTo(0, GY - 50); ctx.stroke();
    [-120, -40, 40, 120].forEach(d => { ctx.beginPath(); ctx.moveTo(0, GY - 50); ctx.lineTo(d, GY - 24); ctx.lineWidth = 12; ctx.stroke(); ctx.beginPath(); ctx.arc(d, GY - 14, 14, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); });
    ctx.rotate(sw);
    // back
    rr(ctx, -170, GY - 880, 340, 620, 90); ctx.fillStyle = "#5A2E1E"; ctx.fill(); ol(ctx, 7);
    rr(ctx, -130, GY - 840, 260, 540, 70); ctx.fillStyle = "#7A3E28"; ctx.fill();
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++){ ctx.beginPath(); ctx.arc(-70 + i * 70, GY - 760 + j * 120, 8, 0, TAU); ctx.fillStyle = "#4A2416"; ctx.fill(); }
    // seat
    rr(ctx, -210, GY - 300, 420, 90, 36); ctx.fillStyle = "#6B3624"; ctx.fill(); ol(ctx, 6);
    // arms
    [-1, 1].forEach(d => { rr(ctx, d * 200 - 30, GY - 430, 60, 150, 20); ctx.fillStyle = "#4A2416"; ctx.fill(); ol(ctx, 5); rr(ctx, d * 200 - 50, GY - 450, 100, 40, 18); ctx.fillStyle = "#6B3624"; ctx.fill(); ol(ctx, 5); });
    // nameplate
    rr(ctx, -150, GY - 940, 300, 76, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, o.name || "KETUA TIM", 0, GY - 890, 40, BROWN, 900, 270);
    ctx.restore();
    // swinging CUTI tag
    ctx.save(); ctx.translate(x + 150, GY - 820); ctx.rotate(Math.sin(t * 2.2) * .18); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
    rr(ctx, -70, 60, 140, 70, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, o.tag || "CUTI", 0, 108, 38, "#FFFFFF", 900, 120); ctx.restore(); }
  TT.scene(PX + "takhta", "Cerita: kursi kosong ketua tim di bawah sorot lampu, amplop keluhan menumpuk di kursi", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, B = Object.assign({ x: 540, n: 14 }, f0.throne || {});
    const tP = B.pileCue ? T(s, B.pileCue, .2, idx) : (B.pileAt ?? .3), tE = B.endCue ? T(s, B.endCue, .5, idx) : tP + 4;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plantX: 980 },
      spots: { chair: [B.x, GY - 560, 1.12] },
      back: () => {
        // spotlight
        ctx.save(); const a = .28 + .05 * Math.sin(t * 5); ctx.fillStyle = `rgba(255,240,200,${a})`; ctx.beginPath(); ctx.moveTo(B.x - 60, -300); ctx.lineTo(B.x + 60, -300); ctx.lineTo(B.x + 330, GY + 40); ctx.lineTo(B.x - 330, GY + 40); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,240,200,.35)"; ctx.beginPath(); ctx.ellipse(B.x, GY + 20, 330, 50, 0, 0, TAU); ctx.fill(); ctx.restore();
        bossChair(ctx, B.x, t, B);
        // complaint envelopes landing on the seat
        const dur = Math.max(.6, tE - tP);
        for (let i = 0; i < B.n; i++){ const ti = tP + i / B.n * dur, k = t - ti; if (k < 0) continue; const u = eOut(clamp(k / .45, 0, 1));
          const lx = B.x + (rnd(i) - .5) * 300, ly = GY - 320 - i * 22 - Math.floor(i / 5) * 6, sx = B.x + (rnd(i + 7) > .5 ? 900 : -900), sy = 200 + rnd(i + 3) * 300;
          ctx.save(); ctx.translate(lerp(sx, lx, u), lerp(sy, ly, u) - Math.sin(u * Math.PI) * 160); ctx.rotate((1 - u) * 3 + (rnd(i + 11) - .5) * .5); envelope(ctx, 120, 80, PAPER, RED); ctx.restore(); }
      } });
  }, sfxWith((s, f, i, add) => { const B = f.throne || {}; const tP = B.pileCue ? cueT(s, B.pileCue, .2, i) : (B.pileAt ?? .3), tE = B.endCue ? cueT(s, B.endCue, .5, i) : tP + 4; for (let k = 0; k < 6; k++) add(tP + k / 6 * (tE - tP), "pop"); }));

  /* ================= _bebek: ducks + colleagues in a line ================= */
  function duck(ctx, x, y, s, t, ph, face){ ctx.save(); ctx.translate(x, y); ctx.scale(s * (face || 1), s); const w = Math.sin(t * 10 + ph);
    ctx.rotate(w * .08); [-1, 1].forEach(d => { ctx.fillStyle = "#F28C28"; ctx.beginPath(); ctx.ellipse(d * 18 + w * d * 8, -4, 20, 8, 0, 0, TAU); ctx.fill(); ol(ctx, 3); });
    ctx.beginPath(); ctx.ellipse(0, -60, 70, 50, 0, 0, TAU); ctx.fillStyle = s > .6 ? "#FFFFFF" : "#F6D34B"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(-100, -110 + w * 6); ctx.lineTo(-70, -60); ctx.closePath(); ctx.fillStyle = s > .6 ? "#FFFFFF" : "#F6D34B"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(-10, -60, 34, 22, .3, 0, TAU); ctx.fillStyle = s > .6 ? "#EFEAE0" : "#EFC233"; ctx.fill();
    ctx.beginPath(); ctx.arc(50, -120, 38, 0, TAU); ctx.fillStyle = s > .6 ? "#FFFFFF" : "#F6D34B"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(80, -122); ctx.quadraticCurveTo(118, -118, 112, -104); ctx.quadraticCurveTo(96, -100, 80, -108); ctx.closePath(); ctx.fillStyle = "#F28C28"; ctx.fill(); ol(ctx, 3);
    ctx.beginPath(); ctx.arc(60, -130, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); }
  TT.scene(PX + "bebek", "Cerita: taman kolam, induk bebek dan anak-anaknya, rekan ikut berbaris di belakang", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, D = Object.assign({ x0: -200, speed: 120, n: 4, y: GY + 10, s: 1 }, f0.ducks || {});
    const tD = D.cue ? T(s, D.cue, .2, idx) : (D.at ?? 0), quack = (D.quack || []).map((q, n) => tOf(s, q, .3 + n * .1, idx));
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: 120 },
      back: () => {
        // pond behind
        ctx.save(); ctx.beginPath(); ctx.ellipse(D.pondX ?? 640, GY - 120, 620, 90, 0, 0, TAU); ctx.fillStyle = "#6FB3D9"; ctx.fill(); ol(ctx, 6, "#5A8F5A");
        ctx.clip(); for (let i = 0; i < 6; i++){ const q = (t * .3 + i / 6) % 1; ctx.strokeStyle = `rgba(255,255,255,${.5 * (1 - q)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse((D.pondX ?? 640) - 300 + i * 120, GY - 120 + (i % 2) * 30, 30 + q * 60, 8 + q * 12, 0, 0, TAU); ctx.stroke(); }
        [[-380, -10], [-200, 30], [260, -20], [420, 20]].forEach(([dx, dy], i) => { ctx.save(); ctx.translate((D.pondX ?? 640) + dx, GY - 120 + dy); ctx.rotate(i); ctx.beginPath(); ctx.ellipse(0, 0, 40, 16, 0, .3, TAU - .3); ctx.lineTo(0, 0); ctx.closePath(); ctx.fillStyle = "#5FA05A"; ctx.fill(); ctx.restore(); });
        ctx.restore();
        for (let i = 0; i < 9; i++){ const rx = (D.pondX ?? 640) - 640 + i * 150 + (i % 2) * 40, sw = Math.sin(t * 2 + i) * 6; ctx.strokeStyle = "#5A8F5A"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(rx, GY - 60); ctx.quadraticCurveTo(rx + sw, GY - 140, rx + sw * 2, GY - 200); ctx.stroke(); ctx.fillStyle = "#8E5A34"; rr(ctx, rx + sw * 2 - 7, GY - 240, 14, 50, 7); ctx.fill(); }
      },
      front: () => { if (t < tD) return; const k = t - tD;
        for (let i = 0; i < D.n; i++){ const x = D.x0 + k * D.speed - i * (i === 0 ? 0 : 110) - (i > 0 ? 60 : 0), sc = i === 0 ? D.s : D.s * .45; duck(ctx, x, D.y, sc, t, i * 1.3, 1); }
      },
      over: (ctx2, c) => { quack.forEach((tq, n) => { if (t < tq) return; const k = t - tD, x = D.x0 + k * D.speed; const p = c.toScreen(x + 60, D.y - 170 * D.s); popWord(ctx, "KWEK!", clamp(p[0], 200, 880), Math.max(300, p[1] - 30), t - tq, { size: 60, rot: 8, hold: .9, col: GOLD }); }); } });
  }, sfxWith((s, f, i, add) => { const D = f.ducks || {}; (D.quack || []).forEach((q, n) => add(tOf(s, q, .3 + n * .1, i), "pop")); }));

  /* ================= _taksi: roundabout (putar) / dashboard GPS (gps) ================= */
  function taxiSide(ctx, x, y, s, face, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); const bob = o.moving ? Math.sin(t * 22) * 2 : 0; ctx.translate(0, bob);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 180, 16, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-180, -40); ctx.lineTo(-170, -100); ctx.lineTo(-90, -110); ctx.lineTo(-50, -175); ctx.lineTo(70, -175); ctx.lineTo(120, -110); ctx.lineTo(175, -96); ctx.lineTo(185, -40); ctx.closePath();
    ctx.fillStyle = o.col || "#2F8F8A"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(-80, -108); ctx.lineTo(-44, -162); ctx.lineTo(6, -162); ctx.lineTo(6, -108); ctx.closePath(); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(20, -108); ctx.lineTo(20, -162); ctx.lineTo(64, -162); ctx.lineTo(104, -108); ctx.closePath(); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
    if (o.heads) o.heads(ctx);
    rr(ctx, -40, -206, 90, 32, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.translate(5, 0); ctx.scale(face, 1); textC(ctx, "TAKSI", 0, -182, 22, BROWN, 900, 80); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(-170, -70, 350, 8);
    ctx.beginPath(); ctx.arc(176, -66, 12, 0, TAU); ctx.fillStyle = "#FFF1A8"; ctx.fill(); ol(ctx, 3);
    if (o.lights){ ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = "#FFF1A8"; ctx.beginPath(); ctx.moveTo(186, -66); ctx.lineTo(520, -140); ctx.lineTo(520, 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
    [-110, 110].forEach(d => { ctx.save(); ctx.translate(d, -36); ctx.rotate(o.moving ? t * 16 : 0); ctx.beginPath(); ctx.arc(0, 0, 38, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fillStyle = "#C9C2B4"; ctx.fill(); ctx.fillStyle = "#2C2433"; ctx.fillRect(-3, -16, 6, 32); ctx.restore(); });
    ctx.restore(); }
  function miniHead(ctx, x, y, r, skin, o){ o = o || {}; ctx.save(); ctx.translate(x, y);
    if (o.hijab){ ctx.beginPath(); ctx.arc(0, 2, r * 1.18, 0, TAU); ctx.fillStyle = o.hijab; ctx.fill(); ol(ctx, 3); }
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = skin || "#E8B48A"; ctx.fill(); ol(ctx, 3);
    if (o.cap){ ctx.beginPath(); ctx.arc(0, -r * .2, r * 1.02, Math.PI, TAU); ctx.fillStyle = o.cap; ctx.fill(); ol(ctx, 3); ctx.fillRect(0, -r * .3, r * 1.4 * (o.face || 1), r * .22); }
    else if (o.hair){ ctx.beginPath(); ctx.arc(0, -r * .15, r * 1.02, Math.PI * 1.05, Math.PI * 1.95); ctx.fillStyle = o.hair; ctx.fill(); }
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .35 + r * .15 * (o.face || 1), -r * .05, r * .12, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.beginPath(); if (o.worried){ ctx.arc(r * .1 * (o.face || 1), r * .55, r * .2, Math.PI * 1.15, Math.PI * 1.85); } else ctx.arc(r * .1 * (o.face || 1), r * .3, r * .25, .2, Math.PI - .2); ol(ctx, 3);
    ctx.restore(); }
  function gauge(ctx, x, y, v, k){ if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    rr(ctx, -130, -100, 260, 150, 30); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6, CREAM);
    ctx.lineWidth = 16; ctx.lineCap = "butt"; [[RED, Math.PI, Math.PI * 1.25], ["#E8A55B", Math.PI * 1.25, Math.PI * 1.6], [GREEN, Math.PI * 1.6, TAU]].forEach(([c, a0, a1]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(0, 20, 90, a0, a1); ctx.stroke(); });
    textC(ctx, "E", -100, 40, 28, "#FFFFFF", 900); textC(ctx, "F", 100, 40, 28, "#FFFFFF", 900); textC(ctx, "BENSIN", 0, -60, 24, "#FFFFFF", 900);
    const a = Math.PI + (1 - v) * 0 + v * Math.PI; const ang = Math.PI + v * Math.PI; void a; ctx.strokeStyle = HL; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(Math.cos(ang) * 78, 20 + Math.sin(ang) * 78); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 20, 12, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); if (v < .15 && Math.floor(k * 4) % 2){ ctx.beginPath(); ctx.arc(-80, -50, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); } ctx.restore(); }
  TT.scene(PX + "taksi", "Cerita: taksi (putar: berputar di bundaran malam, bensin habis / gps: dasbor, tujuan diketik, jalan melaju)", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, X = Object.assign({ mode: "putar" }, f0.taxi || {});
    if (X.mode === "gps") return taxiGps(ctx, s, t, X, idx);
    const tStop = X.stopCue ? T(s, X.stopCue, .3, idx) : 1e9, tGas = X.gasCue ? T(s, X.gasCue, .3, idx) : 0;
    const w0 = X.speed || 2.1, th0 = (tt) => { const ts = Math.min(tt, tStop); let a = w0 * ts; if (tt > tStop){ const d = Math.min(tt - tStop, 1.2); a += w0 * (d - d * d / 2.4); } return a + (X.phase ?? .6); };
    const ang = th0(t), CX = 540, CY = X.cy ?? 1430, RX = X.rx ?? 400, RY = X.ry ?? 80;
    const loops = Math.floor((ang - (X.phase ?? .6)) / TAU) + 1;
    let carS = null;
    base(ctx, s, t, { env: "night", envOpt: {},
      spots: { car: () => carS ? [carS[0], carS[1] - 140, 1.25] : [540, 1200, 1.1] },
      back: () => {
        // road ring + island
        ctx.save(); ctx.beginPath(); ctx.ellipse(CX, CY, RX + 140, RY + 70, 0, 0, TAU); ctx.fillStyle = "#3A3640"; ctx.fill(); ol(ctx, 5);
        ctx.setLineDash([30, 26]); ctx.strokeStyle = "rgba(255,241,168,.75)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(CX, CY, RX + 30, RY + 14, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.ellipse(CX, CY, RX - 120, RY - 40, 0, 0, TAU); ctx.fillStyle = "#4E7A4A"; ctx.fill(); ol(ctx, 5); ctx.restore();
        // arrow signs around
        [[130, 1300, "?"], [950, 1290, "?"]].forEach(([x, y, txt], i) => { ctx.fillStyle = "#6B6470"; ctx.fillRect(x - 6, y, 12, 160); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + i) * .04); rr(ctx, -80, -60, 160, 70, 10); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 4);
          textC(ctx, (i ? "→ " : "← ") + txt, 0, -10, 40, "#FFFFFF", 900); ctx.restore(); });
        if (Math.sin(ang) < 0) drawCar(false);
        // monument
        ctx.save(); ctx.translate(CX, CY - 10); rr(ctx, -90, -60, 180, 60, 8); ctx.fillStyle = "#B9A58E"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(-18, -520); ctx.lineTo(18, -520); ctx.lineTo(40, -60); ctx.closePath(); ctx.fillStyle = "#D8CDB9"; ctx.fill(); ol(ctx, 5);
        sparkle(ctx, 0, -560, 38 + 4 * Math.sin(t * 3), GOLD); glowAt(ctx, 0, -560, 120, "#FFE7A8", .4); ctx.restore();
        if (Math.sin(ang) >= 0) drawCar(true);
      },
      over: (ctx2, c) => {
        const gv = clamp(1 - (t - tGas) / Math.max(.5, tStop - tGas), 0, 1); gauge(ctx, 860, 330, X.gasCue ? (t < tGas ? 1 : gv) : 1, t - (X.gaugeAt ?? .4));
        popChip(ctx, "PUTARAN KE-" + Math.max(1, loops), 300, 300, t - .5, PAPER, BROWN, 38, -.03);
        (X.says || []).forEach((sy, n) => { const ts = tOf(s, sy, .3 + n * .1, idx), k = t - ts; if (k < 0 || k > (sy.dur || 2) || !carS) return; const p = c.toScreen(carS[0] + (sy.dx || 0), carS[1] - 200); TT.bubble(ctx, sy.text, p[0], p[1], k, { kind: sy.kind || "say", t }); });
        if (t > tStop + .6 && carS){ const p = c.toScreen(carS[0], carS[1] - 260); popWord(ctx, "???", clamp(p[0], 200, 880), Math.max(320, p[1]), (t - tStop - .6) % 1.6, { size: 80, rot: -4, hold: 1.4, col: GOLD }); }
      } });
    function drawCar(frontHalf){
      const sn = Math.sin(ang), cs = Math.cos(ang), x = CX + Math.cos(ang) * RX, y = CY + sn * RY, sc = (X.carS ?? 1) * (.62 + .25 * (sn + 1) / 2), face = -Math.sign(sn) || 1;
      carS = [x, y]; const stopped = t > tStop + 1.2;
      if (t > tStop){ for (let i = 0; i < 4; i++){ const q = ((t - tStop) * .8 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .6 * (1 - q); puffC(ctx, x + face * 150 * sc, y - 120 * sc - q * 160, 30 + q * 30, "#8A8580"); ctx.restore(); } }
      if (!stopped){ for (let i = 0; i < 3; i++){ const q = (t * 2 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .5 * (1 - q); puffC(ctx, x - face * 200 * sc - face * q * 60, y - 30 * sc, 14 + q * 14, "#B9B4AA"); ctx.restore(); } }
      void cs; void frontHalf;
      taxiSide(ctx, x, y, sc, face, t, { moving: !stopped, lights: !stopped, heads: (c2) => { miniHead(c2, 70, -128, 26, "#C98E62", { cap: "#D9483B", face: 1, worried: t > (X.confusedAt ?? 0) }); miniHead(c2, -30, -128, 26, "#E8B48A", { hair: "#2B1A12", face: 1 }); } }); }
  }, sfxWith((s, f, i, add) => { const X = f.taxi || {}; if (X.mode === "gps"){ (X.lines || []).forEach((l, n) => add(tOf(s, l, .3 + n * .1, i), "pop")); if (X.goCue) add(cueT(s, X.goCue, .3, i) + (X.goDelay ?? .4), "whoosh"); if (X.qCue) add(cueT(s, X.qCue, .3, i), "ping"); }
    else { if (X.stopCue) add(cueT(s, X.stopCue, .3, i), "ping"); add(.5, "whoosh"); (X.says || []).forEach((sy, n) => add(tOf(s, sy, .3 + n * .1, i), "pop")); } }));
  function taxiGps(ctx, s, t, X, idx){
    const lines = (X.lines || []).map((l, n) => ({ l, T: tOf(s, l, .3 + n * .1, idx) })), tGo = X.goCue ? T(s, X.goCue, .3, idx) + (X.goDelay ?? .4) : 1e9, go = ramp(t, tGo, tGo + 1.2);
    const speed = go * 2.2;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" }, envFront: false,
      spots: { gps: [540, 1030, 1.4] },
      back: () => {
        // forward road view through the windshield
        ctx.save(); ctx.fillStyle = ctx.createLinearGradient(0, 200, 0, 900); ctx.fillStyle = "#9DCFDC"; ctx.fillRect(-400, 100, 1900, 700);
        const hz = 780; ctx.fillStyle = "#C9D9C2"; ctx.fillRect(-400, hz - 20, 1900, 40);
        for (let i = -6; i < 12; i++){ const bx = i * 170 + ((t * 30 * (1 + speed * 3)) % 170) * 0, bh = 120 + rnd(i + 40) * 220; ctx.fillStyle = i % 2 ? "#D8CDB9" : "#C9C2B4"; ctx.fillRect(bx, hz - bh, 150, bh); ctx.fillStyle = "rgba(255,255,255,.5)"; for (let wy = hz - bh + 20; wy < hz - 20; wy += 40) ctx.fillRect(bx + 20, wy, 110, 14); }
        ctx.fillStyle = "#4A4650"; ctx.beginPath(); ctx.moveTo(510, hz); ctx.lineTo(570, hz); ctx.lineTo(1500, 1500); ctx.lineTo(-420, 1500); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#7FA563"; ctx.beginPath(); ctx.moveTo(-400, hz); ctx.lineTo(510, hz); ctx.lineTo(-420, 1500); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(570, hz); ctx.lineTo(1500, hz); ctx.lineTo(1500, 1500); ctx.closePath(); ctx.fill();
        const off = (t * (0.15 + speed)) % 1; ctx.fillStyle = "#FFF1A8"; for (let i = 0; i < 8; i++){ const q = Math.pow((i + off) / 8, 2.2), y = hz + q * 720, w = 4 + q * 40, h = 10 + q * 90; ctx.fillRect(540 - w / 2, y, w, h); }
        // trees streaming on the sides
        for (let i = 0; i < 6; i++){ const q = Math.pow(((i / 6) + t * (.05 + speed * .25)) % 1, 2), y = hz + q * 600, sc = .2 + q * 1.4; [-1, 1].forEach(d => { const x = 540 + d * (60 + q * 1100); ctx.fillStyle = "#5A8F5A"; ctx.beginPath(); ctx.arc(x, y - 120 * sc, 80 * sc, 0, TAU); ctx.fill(); ctx.fillStyle = "#6B4426"; ctx.fillRect(x - 8 * sc, y - 60 * sc, 16 * sc, 60 * sc); }); }
        if (speed > .3){ ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 5; for (let i = 0; i < 10; i++){ const a = rnd(i) * TAU, q = (t * 2 + rnd(i + 5)) % 1; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * (100 + q * 500), hz + Math.sin(a) * (60 + q * 300)); ctx.lineTo(540 + Math.cos(a) * (160 + q * 650), hz + Math.sin(a) * (90 + q * 380)); ctx.stroke(); } }
        ctx.restore();
        // interior frame: roof + pillars (drawn as a mask with a windshield hole)
        ctx.save(); ctx.beginPath(); ctx.rect(-600, -400, 2300, 2400); ctx.moveTo(40, 300); ctx.quadraticCurveTo(540, 230, 1040, 300); ctx.lineTo(1120, 1180); ctx.lineTo(-40, 1180); ctx.closePath();
        ctx.fillStyle = "#3B3A3F"; ctx.fill("evenodd"); ctx.restore();
        ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(40, 300); ctx.quadraticCurveTo(540, 230, 1040, 300); ctx.lineTo(1120, 1180); ctx.moveTo(40, 300); ctx.lineTo(-40, 1180); ctx.stroke();
        // rear-view mirror with hanging charm
        rr(ctx, 450, 300, 180, 60, 18); ctx.fillStyle = "#2C2433"; ctx.fill(); rr(ctx, 462, 310, 156, 40, 12); ctx.fillStyle = "#8FB3C9"; ctx.fill();
        const sw = Math.sin(t * 3) * .3 + go * Math.sin(t * 9) * .2; ctx.save(); ctx.translate(540, 360); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.stroke(); sparkle(ctx, 0, 110, 26, GOLD); ctx.restore();
      },
      front: (ctx2, c, sts) => {
        // dashboard
        ctx.save(); ctx.beginPath(); ctx.moveTo(-200, 1240); ctx.quadraticCurveTo(540, 1160, 1280, 1240); ctx.lineTo(1280, 2000); ctx.lineTo(-200, 2000); ctx.closePath(); ctx.fillStyle = "#4A4650"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#3B3740"; ctx.fillRect(-200, 1300, 1480, 30); ctx.restore();
        // steering wheel in front of the driver
        const dx = (sts[0] ? sts[0].x : 200); ctx.save(); ctx.translate(dx + 20, 1270); ctx.rotate(Math.sin(t * 1.5) * .08 * (1 + go)); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(0, 0, 150, 60, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-140, 0); ctx.lineTo(140, 0); ctx.stroke(); ctx.restore();
        // GPS screen on a stalk
        const gx = 540, gy = 1030, W = 340, Hh = 250; ctx.fillStyle = "#2C2433"; ctx.fillRect(gx - 12, gy + Hh / 2, 24, 90);
        ctx.save(); ctx.translate(gx, gy); rr(ctx, -W / 2 - 12, -Hh / 2 - 12, W + 24, Hh + 24, 22); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5);
        rr(ctx, -W / 2, -Hh / 2, W, Hh, 12); ctx.fillStyle = "#EAF3F6"; ctx.fill(); ctx.save(); rr(ctx, -W / 2, -Hh / 2, W, Hh, 12); ctx.clip();
        // header
        ctx.fillStyle = TEAL; ctx.fillRect(-W / 2, -Hh / 2, W, 44); textC(ctx, "TUJUAN", -W / 2 + 70, -Hh / 2 + 31, 24, "#FFFFFF", 900);
        if (!lines.length || t < lines[0].T){ const bl = Math.floor(t * 3) % 2; textC(ctx, "???", 0, 30, 90, bl ? RED : "#B9B4AA", 900); }
        lines.forEach(({ l, T: tl }, n) => { if (t < tl) return; const typed = Math.floor(clamp((t - tl) / .7, 0, 1) * l.text.length); const txt = l.text.slice(0, typed);
          const yy = -Hh / 2 + 92 + n * 58; rr(ctx, -W / 2 + 14, yy - 36, W - 28, 50, 10); ctx.fillStyle = n ? "#FFF1C9" : "#DFF2E4"; ctx.fill(); font(ctx, 800, 30, FAM); fit(ctx, l.text, W - 60, 30, 800); ctx.fillStyle = BROWN; ctx.textAlign = "left"; ctx.fillText(txt + (typed < l.text.length && Math.floor(t * 6) % 2 ? "|" : ""), -W / 2 + 28, yy); });
        if (go > 0){ ctx.fillStyle = hexA(GREEN, .95 * Math.min(1, go * 2)); rr(ctx, -W / 2 + 14, Hh / 2 - 60, W - 28, 48, 12); ctx.fill(); textC(ctx, "▶ MULAI", 0, Hh / 2 - 26, 30, "#FFFFFF", 900); }
        ctx.restore(); ctx.restore();
      } });
  }

  /* ================= _miniatur: toy taxi on the Friday meeting table ================= */
  function flagStick(ctx, x, y, txt, top, lit, k){ ctx.save(); ctx.translate(x, y); const q = lit ? 1 + (k >= 0 && k < .35 ? .25 * Math.sin(k / .35 * Math.PI) : 0) : 1; ctx.scale(q, q);
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-4, -170, 8, 170); rr(ctx, -16, -8, 32, 12, 4); ctx.fillStyle = "#5A3A2A"; ctx.fill();
    ctx.beginPath(); ctx.moveTo(4, -170); ctx.lineTo(120, -140); ctx.lineTo(4, -104); ctx.closePath(); ctx.fillStyle = lit ? GREEN : PAPER; ctx.fill(); ol(ctx, 4);
    textC(ctx, String(txt), 50, -126, 34, lit ? "#FFFFFF" : BROWN, 900, 80); textC(ctx, top, 0, -184, 22, BROWN, 900, 110);
    if (lit) checkMark(ctx, 0, -214, .9, GREEN); ctx.restore(); }
  TT.scene(PX + "miniatur", "Cerita: rapat Jumat, taksi mainan maju di meja ke bendera angka (12, 28, 41) lalu finis 50", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Rd = Object.assign({ x0: 170, finX: 930, top: 1330, goal: 50 }, f0.table || {});
    const posts = (Rd.posts || []).map((p, n) => ({ p, T: tOf(s, p, .3 + n * .1, idx) })), tGoal = Rd.goalCue ? T(s, Rd.goalCue, .3, idx) : 1e9;
    const stops = [{ x: Rd.x0, T: -9 }].concat(posts.map(o => ({ x: o.p.x, T: o.T }))).concat([{ x: Rd.finX - 40, T: tGoal }]);
    let cx = Rd.x0, moving = false; stops.forEach((st, n) => { if (n === 0 || t < st.T) return; const u = clamp((t - st.T) / .9, 0, 1); cx = lerp(stops[n - 1].x, st.x, easeIO(u)); if (u > 0 && u < 1) moving = true; });
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plantX: 1010 },
      spots: { car: () => [cx + 80, Rd.top - 170, 1.3] },
      front: () => {
        const top = Rd.top; ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(540, GY + 6, 560, 26, 0, 0, TAU); ctx.fill();
        [90, 990].forEach(lx => { rr(ctx, lx - 22, top, 44, GY - top, 8); ctx.fillStyle = "#6B4426"; ctx.fill(); ol(ctx, 5); });
        rr(ctx, 30, top - 10, 1020, 46, 12); ctx.fillStyle = "#A0643C"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(50, top - 4, 980, 8);
        rr(ctx, 50, top + 36, 980, 70, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
        // track tape on the table
        ctx.strokeStyle = hexA(CREAM, .9); ctx.lineWidth = 5; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(Rd.x0 - 60, top - 12); ctx.lineTo(Rd.finX, top - 12); ctx.stroke(); ctx.setLineDash([]);
        posts.forEach(({ p, T: tp }) => flagStick(ctx, p.x + 70, top - 10, p.num, p.top || "", t >= tp + .8, t - tp - .8));
        // finish flag
        ctx.save(); ctx.translate(Rd.finX + 40, top - 10); ctx.fillStyle = "#3B3A3F"; ctx.fillRect(-5, -260, 10, 260); for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++){ ctx.fillStyle = (r + q) % 2 ? OUT : "#FFFFFF"; ctx.fillRect(5 + q * 26 + Math.sin(t * 6 + q) * 3, -258 + r * 26, 26, 26); }
        rr(ctx, -60, -330, 140, 60, 12); ctx.fillStyle = t >= tGoal + .9 ? GREEN : ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(Rd.goal), 10, -286, 40, "#FFFFFF", 900); ctx.restore();
        // toy taxi + wind-up key
        const bob = moving ? Math.sin(t * 30) * 2 : 0; taxiSide(ctx, cx, top - 12 + bob, .62, 1, t, { moving, col: "#2F8F8A" });
        ctx.save(); ctx.translate(cx - 122, top - 84 + bob); ctx.rotate(moving ? t * 12 : Math.sin(t * 2) * .2); ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, -18, 10, 18, 0, 0, TAU); ctx.ellipse(0, 18, 10, 18, 0, 0, TAU); ctx.stroke(); ctx.restore();
        if (moving){ ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ const q = (t * 3 + i / 3) % 1; ctx.beginPath(); ctx.moveTo(cx - 120 - q * 120, top - 50 - i * 22); ctx.lineTo(cx - 170 - q * 120, top - 50 - i * 22); ctx.stroke(); } }
      },
      over: () => {
        let v = 0, tv = -9; posts.forEach(({ p, T: tp }) => { if (t >= tp + .8){ v = p.num; tv = tp + .8; } }); if (t >= tGoal + .9){ v = Rd.goal; tv = tGoal + .9; }
        const goal = Rd.goal, q = v / goal; ctx.save(); ctx.translate(540, 300); const k = t - tv, pq = 1 + (k >= 0 && k < .3 ? .08 * Math.sin(k / .3 * Math.PI) : 0); ctx.scale(pq, pq);
        rr(ctx, -380, -60, 760, 120, 30); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -350, 4, 700, 34, 17); ctx.fillStyle = "#E9E2D6"; ctx.fill(); if (q > 0){ rr(ctx, -350, 4, 700 * q, 34, 17); ctx.fillStyle = q >= 1 ? GREEN : ORANGE; ctx.fill(); ol(ctx, 3); }
        textC(ctx, `${v} / ${goal} pelanggan`, -40, -14, 40, BROWN, 900, 540); rr(ctx, 230, -48, 130, 44, 12); ctx.fillStyle = TEAL; ctx.fill(); textC(ctx, Rd.date || "tgl 30", 295, -16, 28, "#FFFFFF", 900, 120); ctx.restore();
      } });
  }, sfxWith((s, f, i, add) => { const Rd = f.table || {}; (Rd.posts || []).forEach((p, n) => { const t0 = tOf(s, p, .3 + n * .1, i); add(t0, "whoosh"); add(t0 + .8, "pop"); }); if (Rd.goalCue){ add(cueT(s, Rd.goalCue, .3, i), "whoosh"); add(cueT(s, Rd.goalCue, .3, i) + .9, "chime"); } }));

  /* ================= _label: giant label maker ================= */
  function labelMaker(ctx, x, y, s, t, o){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || -.08);
    rr(ctx, -120, -70, 240, 140, 30); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 6); rr(ctx, -96, -50, 120, 60, 10); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 3);
    textC(ctx, o.screen || "ABC", -36, -10, 26, BROWN, 900, 110); for (let i = 0; i < 6; i++){ rr(ctx, -96 + (i % 3) * 42, 22 + Math.floor(i / 3) * 22, 34, 16, 4); ctx.fillStyle = "#F3E2C8"; ctx.fill(); }
    rr(ctx, 50, -40, 50, 80, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ctx.restore(); }
  TT.scene(PX + "label", "Cerita: mesin label raksasa mencetak pita TUKANG TELAT", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Lb = Object.assign({ on: 0, text: "TUKANG TELAT" }, f0.labeler || {});
    const tIn = Lb.cue ? T(s, Lb.cue, .3, idx) : 1e9, tPr = Lb.printCue ? T(s, Lb.printCue, .3, idx) : 1e9, tSnap = Lb.snapCue ? T(s, Lb.snapCue, .3, idx) : 1e9;
    let lm = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false },
      spots: { maker: () => lm ? [lm[0] + 160, lm[1] - 40, 1.25] : [540, 1000, 1.1] },
      over1: (ctx2, c, sts, j) => { if (j !== Lb.on || t < tIn) return; const st = sts[j], p = handOf(st), q = eBack(clamp((t - tIn) / .35, 0, 1)); const x = p[0] + 70 * (st.face || 1), y = p[1] - 30;
        lm = [x, y]; const shake = t > tPr && t < tSnap ? Math.sin(t * 50) * 4 : 0; labelMaker(ctx, x + shake, y, 1.35 * q * st.size / 720, t, { screen: t > tPr ? Lb.text.slice(0, 6) : "ABC" });
        // tape grows out
        if (t > tPr){ const n = Lb.text.length, shown = Math.min(n, Math.floor((t - tPr) / .12) + 1), txt = Lb.text.slice(0, shown); font(ctx, 900, 64, FAM); const full = ctx.measureText(Lb.text).width + 60, w = ctx.measureText(txt).width + 60;
          const sx = x + 110 * (st.face || 1), sy = y - 10;
          if (t <= tSnap){ ctx.save(); ctx.translate(sx, sy); ctx.rotate(-.06); rr(ctx, 0, -40, w, 80, 8); ctx.fillStyle = "#FFF1A8"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.textAlign = "left"; ctx.fillText(txt, 30, 22); ctx.restore(); }
          else { const p0 = c.toScreen(sx + full / 2, sy), sc0 = c.scale(1); TT.CS.ov.push(() => { const u = eOut(clamp((t - tSnap) / .5, 0, 1)), px = lerp(p0[0], 540, u), py = lerp(p0[1], 470, u), sc = lerp(sc0, 1.25, u);
            ctx.save(); ctx.translate(px, py); ctx.rotate(-.08 + Math.sin(t * 3) * .03 * u); ctx.scale(sc, sc); font(ctx, 900, 64, FAM); rr(ctx, -full / 2, -40, full, 80, 8); ctx.fillStyle = "#FFF1A8"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.textAlign = "center"; ctx.fillText(Lb.text, 0, 22); ctx.textAlign = "left"; ctx.restore();
            burstFx(ctx, 540, 470, t - tSnap - .4, RED, 12, 260); }); } }
      } });
  }, sfxWith((s, f, i, add) => { const L = f.labeler || {}; if (L.cue) add(cueT(s, L.cue, .3, i), "pop"); if (L.printCue){ const t0 = cueT(s, L.printCue, .3, i); for (let k = 0; k < 4; k++) add(t0 + k * .3, "pop"); } if (L.snapCue) add(cueT(s, L.snapCue, .3, i), "ping"); }));

  /* ================= _zirah: the label sticks, armour drops ================= */
  TT.scene(PX + "zirah", "Cerita: label menempel di dada, baju zirah jatuh, kata-kata memantul di perisai, kebiasaan tak tersentuh", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, A = Object.assign({ on: 0, text: "TUKANG TELAT", shield: "BUKAN SALAH SAYA!" }, f0.armor || {});
    const tStick = A.stickCue ? T(s, A.stickCue, .3, idx) : .3, pieces = (A.pieces || []).map((p, n) => ({ p, T: tOf(s, p, .3 + n * .1, idx) })), words = (A.words || []).map((w, n) => ({ w, T: tOf(s, w, .3 + n * .1, idx) }));
    const pT = k => { const f = pieces.find(o => o.p.kind === k); return f ? f.T : 1e9; };
    base(ctx, s, t, { env: "info", envOpt: { spotX: A.spotX ?? 460 },
      over1: (ctx2, c, sts, j, R) => { if (j !== A.on || !R[j]) return; const st = sts[j], r = R[j], k = r.k, fc = st.face || 1;
        const chestY = st.y - st.size * .36 + (st.y - r.y) * 0, chestX = st.x;
        // breastplate
        const tb = pT("plate"); if (t >= tb){ const u = eBack(clamp((t - tb) / .4, 0, 1)), dy = (1 - clamp((t - tb) / .3, 0, 1)) * -900; ctx.save(); ctx.translate(chestX, chestY + dy); ctx.scale(k / 8 * u, k / 8);
          ctx.beginPath(); ctx.moveTo(-150, -150); ctx.quadraticCurveTo(0, -190, 150, -150); ctx.lineTo(140, 120); ctx.quadraticCurveTo(0, 190, -140, 120); ctx.closePath(); const g = ctx.createLinearGradient(-150, 0, 150, 0); g.addColorStop(0, "#9AA6B2"); g.addColorStop(.5, "#E3E8EE"); g.addColorStop(1, "#8A96A2"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(0, 160); ol(ctx, 3, "#6B7682"); ctx.restore(); }
        // label sticker on the chest (stays on top of the plate)
        if (t >= tStick){ const u = clamp((t - tStick) / .35, 0, 1), fx = lerp(-700, 0, eOut(u)), fy = lerp(-700, 0, eOut(u)); ctx.save(); ctx.translate(chestX + fx * fc, chestY - 20 + fy); ctx.rotate(-.12 + (1 - u) * 1.5); const sq = u >= 1 && t - tStick < .6 ? 1 + .15 * Math.sin((t - tStick - .35) * 20) * Math.exp(-(t - tStick) * 4) : 1; ctx.scale(k / 7.5 * sq, k / 7.5 / sq);
          font(ctx, 900, 44, FAM); const w = ctx.measureText(A.text).width + 50; rr(ctx, -w / 2, -36, w, 72, 8); ctx.fillStyle = "#FFF1A8"; ctx.fill(); ol(ctx, 5); textC(ctx, A.text, 0, 16, 44, OUT, 900); ctx.restore();
          if (u >= 1) burstFx(ctx, chestX, chestY - 20, t - tStick - .35, RED, 10, 160); }
        // helmet
        const th2 = pT("helm"); if (t >= th2){ const u = clamp((t - th2) / .35, 0, 1), dy = (1 - eOut(u)) * -900; ctx.save(); ctx.translate(r.headX, r.headY - 8 * k + dy); ctx.scale(k / 8, k / 8);
          ctx.beginPath(); ctx.arc(0, -10, 175, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(170, 40); ctx.lineTo(-170, 40); ctx.closePath(); const g = ctx.createLinearGradient(0, -190, 0, 40); g.addColorStop(0, "#E3E8EE"); g.addColorStop(1, "#8A96A2"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.moveTo(0, -190); ctx.lineTo(0, -230); ctx.quadraticCurveTo(70, -300, 40, -200); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.restore(); }
        // shield in the front hand
        const ts = pT("shield"); if (t >= ts){ const u = eBack(clamp((t - ts) / .4, 0, 1)), p = handOf(st); ctx.save(); ctx.translate(p[0] + 8 * k * fc, p[1] - 10 * k); ctx.scale(k / 8 * u, k / 8 * u); ctx.rotate(-.05 * fc + Math.sin(t * 3) * .03);
          ctx.beginPath(); ctx.moveTo(-170, -200); ctx.lineTo(170, -200); ctx.lineTo(160, 60); ctx.quadraticCurveTo(0, 260, -160, 60); ctx.closePath(); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 7);
          ctx.strokeStyle = GOLD; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-140, -175); ctx.lineTo(140, -175); ctx.lineTo(132, 52); ctx.quadraticCurveTo(0, 220, -132, 52); ctx.closePath(); ctx.stroke();
          const parts = A.shield.split(" "); const l1 = parts.slice(0, Math.ceil(parts.length / 2)).join(" "), l2 = parts.slice(Math.ceil(parts.length / 2)).join(" ");
          textC(ctx, l1, 0, -60, 52, "#FFFFFF", 900, 280); textC(ctx, l2, 0, 10, 52, GOLD, 900, 280); ctx.restore(); R.shield = [p[0] + 8 * k * fc, p[1] - 10 * k]; }
      },
      over: (ctx2, c, sts, R) => { const sh = R.shield; if (!sh) return; const ps = c.toScreen(sh[0], sh[1]);
        words.forEach(({ w, T: tw }, n) => { const k = t - tw; if (k < 0 || k > 1.4) return; const fromX = -100, fromY = 300 + n * 120, hitT = .45;
          let x, y, rot; if (k < hitT){ const u = k / hitT; x = lerp(fromX, ps[0] - 60, u); y = lerp(fromY, ps[1] - 40, u); rot = 0; } else { const u = (k - hitT); x = ps[0] - 60 - u * 500; y = ps[1] - 40 - u * 600 + u * u * 900; rot = -u * 6; }
          ctx.save(); ctx.globalAlpha *= 1 - clamp((k - 1.1) / .3, 0, 1); ctx.translate(x, y); ctx.rotate(rot); chip(ctx, w.text, 0, 0, "#FFE9E6", RED, 40); ctx.restore();
          if (k >= hitT) burstFx(ctx, ps[0] - 60, ps[1] - 40, k - hitT, GOLD, 10, 120); });
      } });
  }, sfxWith((s, f, i, add) => { const A = f.armor || {}; if (A.stickCue) add(cueT(s, A.stickCue, .3, i) + .35, "pop"); (A.pieces || []).forEach((p, n) => add(tOf(s, p, .3 + n * .1, i) + .3, "ping")); (A.words || []).forEach((w, n) => add(tOf(s, w, .3 + n * .1, i) + .45, "pop")); }));
})();

/* Scene pack j2611221631524: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SB49, SP49, RN49, KD49, JS49.
   Layout prefix j2611221631524_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, bg, bgOpt, piece:false, ...}]  hard cut (cream flash) inside one scene
     hold   [{on, kind, at|cue, outCue, s, dx, dy, rot}]  object in a toon's hand
     pops / stamps / tags / steps / confetti   screen overlays
     bg     "aula" (launch hall, rows of chairs, balloon arch; full|n) | "bandara" (runway + control tower) | "cuci" (car wash bay)
            | "gudang" (water-carton warehouse) | "sidang" (imaginary courtroom)
   Set pieces (layout suffix):
     SB49 _aula     launch hall with 100 folding chairs, 9 guests, balloon arch sags, one balloon deflates and whizzes away     f.aula
          _kura     office: Yoga hides in a giant turtle shell; excuse chip shoots out, meeting invite bounces off, shell shuts    f.kura
          _tumbler  park table: boss pushes a roly-poly toy, it wobbles and stands up again, gets Yoga's glasses; CARA BANGKIT    f.tumbler
          _kotak    navy lab: orange "black box" of the event opened, nine guest calls ticked, three causes fly out; cut to full hall  f.kotak
          _tulis    home at night: two cards (lesson + next step) taped onto the roly-poly toy, flick, it stands                 f.tulis
     SP49 _satpam   dark office at night: guard's flashlight finds the last worker, wall clock 21.00, five moon tally             f.satpam
          _dasbor   car dashboard close-up: trophy morphs into an engine-warning lamp LEMBUR TIAP HARI, CEK stamp                  f.dasbor
          _antre    airport: meeting table blocks the runway in the morning, at 16.00 task planes circle the tower together      f.antre
          _spanduk  airport: banner-towing planes carry the three planning rules, task planes land one by one                     f.spanduk
     RN49 _derit    office door squeaks NGIIIK at every passer-by, office boy oils the hinge, colleagues walk past on phones      f.derit
          _kunang   night office tower: every thank-you releases a firefly, dark windows light up warm one by one, cold-to-warm    f.kunang
          _estafet  office: a glowing thank-you baton is passed desk to desk (printer, cake tray), the room warms                  f.estafet
     KD49 _asap     warehouse: definition text pours out of a thick binder as jargon letters orbiting the head, head smokes      f.asap
          _morf     navy: abstract concept shapes (cube, sphere, formula) morph into the warehouse's own cartons, truck, calendar f.morf
          _stok     warehouse: carton stack drops 20 per day, truck crawls a 3-day road, reorder line at 60, truck arrives in time f.stok
     JS49 _cuci     car wash: hose reel and vacuum slide to new spots, foam, crew says faster                                    f.cuci
          _beku     car wash: owner asks "how many minutes?", everyone freezes, soap bubbles pop, empty BEFORE column             f.beku
          _sidang   imaginary courtroom: feeling-cloud "RASANYA LEBIH CEPAT" pops under the gavel; cut to punch clock tickets 25 min f.sidang
          _balap    split screen race BEFORE 25 min vs AFTER 18 min through four wash stations, TERBUKTI stamp                  f.balap
     _adegan  generic story shot with the extras above (used for action scenes) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631524_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const BG = {}, ITEMS = {};
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function textL(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(txt, x, y); }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); fit(ctx, txt, 820, size, 900, 30); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function chipW(ctx, txt, x, y, bg, fg, size){ // world chip, no clamping
    size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot, world){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1));
    if (!world){ size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1; if (w > 896){ size = Math.floor(size * 896 / w); } font(ctx, 800, size, FAM); const w2 = ctx.measureText(txt).width + size * 1.1; x = clamp(x, 92 + w2 / 2, 988 - w2 / 2); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); (world ? chipW : chip)(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function smoke(ctx, x, y, t, k, o){ o = o || {}; const n = o.n || 7, h = o.h || 260, col = o.col || "#8C8C94", sz = o.s || 1;
    for (let i = 0; i < n; i++){ const q = ((t * (o.speed || .55)) + i / n) % 1, a = (1 - q) * .55 * k; if (a <= 0) continue;
      ctx.fillStyle = hexA(col, a); ctx.beginPath(); ctx.arc(x + Math.sin(q * 6 + i) * 26 * sz + (o.drift || 0) * q, y - q * h, (18 + q * 46) * sz, 0, TAU); ctx.fill(); } }
  function arrowLine(ctx, x0, y0, x1, y1, col, w, p){ p = p ?? 1; if (p <= 0) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p), a = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = w + 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(w * 1.6, 0); ctx.lineTo(-w * 1.6, -w * 1.8); ctx.lineTo(-w * 1.6, w * 1.8); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function mug(ctx, col){ rr(ctx, -26, -60, 52, 60, 9); ctx.fillStyle = col || CREAM; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(28, -32, 14, -1.3, 1.3); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(-22, -42, 44, 10); }
  function note(ctx, x, y, w, h, col, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.restore(); }
  function bill(ctx, x, y, rot, col, val){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -80, -40, 160, 80, 8); ctx.fillStyle = col || "#E58BA0"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 3; rr(ctx, -68, -28, 136, 56, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill();
    if (val) textC(ctx, val, 0, 9, 24, OUT, 900, 120); ctx.restore(); }
  function coin(ctx, x, y, r, spin){ const sx = Math.max(.15, Math.abs(Math.cos(spin || 0))); ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, Math.max(3, r * .16)); ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, TAU); ctx.strokeStyle = "#C98A1B"; ctx.lineWidth = Math.max(2, r * .1); ctx.stroke();
    if (r > 14){ font(ctx, 900, r * .9, FAM); ctx.fillStyle = "#C98A1B"; ctx.textAlign = "center"; ctx.fillText("Rp", 0, r * .32); ctx.textAlign = "left"; } ctx.restore(); }
  function sodaBottle(ctx, h, o){ // origin = bottom centre; h = height
    o = o || {}; const w = h * .36, neck = h * .3, cap = o.cap ?? 1, lvl = o.level ?? .78, fizz = o.fizz || 0, t = o.t || 0;
    ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h + neck + w * .2); ctx.quadraticCurveTo(-w / 2, -h + neck * .7, -w * .2, -h + neck * .25); ctx.lineTo(-w * .2, -h);
    ctx.lineTo(w * .2, -h); ctx.lineTo(w * .2, -h + neck * .25); ctx.quadraticCurveTo(w / 2, -h + neck * .7, w / 2, -h + neck + w * .2); ctx.lineTo(w / 2, 0); ctx.closePath();
    ctx.fillStyle = hexA("#BFE8D6", .55); ctx.fill(); ctx.save(); ctx.clip();
    const ly = -h * lvl; ctx.fillStyle = o.col || "#8B3A1E"; ctx.fillRect(-w, ly + Math.sin(t * 9) * 4 * (1 + fizz * 3), w * 2, h); // liquid
    for (let i = 0; i < 6 + fizz * 26; i++){ const q = ((t * (0.5 + fizz * 2.5) + rnd(i) ) % 1), bx = (rnd(i + 7) - .5) * w * .8, by = -q * h * lvl; ctx.fillStyle = hexA("#FFE9C9", .75); ctx.beginPath(); ctx.arc(bx, by, 3 + rnd(i + 3) * 6, 0, TAU); ctx.fill(); }
    if (fizz > .2){ ctx.fillStyle = hexA("#FFF4E6", .9); ctx.fillRect(-w, ly - 10 * fizz, w * 2, 18 * fizz); }
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fillRect(-w * .36, -h * .9, w * .12, h * .8); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(4, h * .022); ctx.lineJoin = "round"; ctx.stroke();
    // label
    rr(ctx, -w / 2, -h * .52, w, h * .2, 4); ctx.fillStyle = o.label || RED; ctx.fill(); ol(ctx, Math.max(3, h * .016)); if (o.text) textC(ctx, o.text, 0, -h * .52 + h * .14, h * .085, "#FFFFFF", 900, w * .9);
    if (cap > 0){ ctx.save(); ctx.translate(0, -h - (o.capLift || 0)); ctx.rotate(o.capRot || 0); rr(ctx, -w * .26, -h * .07, w * .52, h * .075, 4); ctx.fillStyle = o.capCol || "#D9483B"; ctx.fill(); ol(ctx, Math.max(3, h * .016));
      ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 2; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(k * w * .09, -h * .065); ctx.lineTo(k * w * .09, -h * .005); ctx.stroke(); } ctx.restore(); }
    ctx.restore(); }
  function sprout(ctx, g, t){ if (g <= 0) return; ctx.save(); ctx.scale(g, g); ctx.strokeStyle = "#3E8B4A"; ctx.lineWidth = 8; ctx.lineCap = "round"; const sw = Math.sin(t * 2) * .08; ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(6, -40, 0, -80); ctx.stroke(); ctx.fillStyle = "#5DB36A";
    ctx.save(); ctx.translate(0, -70); ctx.rotate(-.7); ctx.beginPath(); ctx.ellipse(-26, 0, 30, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.save(); ctx.translate(0, -80); ctx.rotate(.6); ctx.beginPath(); ctx.ellipse(26, 0, 30, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); ctx.restore(); }
  function potPlant(ctx, g, t, label){ ctx.beginPath(); ctx.moveTo(-60, -90); ctx.lineTo(60, -90); ctx.lineTo(46, 0); ctx.lineTo(-46, 0); ctx.closePath(); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -68, -104, 136, 22, 6); ctx.fillStyle = "#A9561A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#5A3A2A"; ctx.beginPath(); ctx.ellipse(0, -100, 56, 10, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(0, -100); sprout(ctx, g, t); ctx.restore(); if (label) textC(ctx, label, 0, -34, 22, "#FFFFFF", 900, 90); }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "cash"){ const n = o.n ?? 3; for (let i = 0; i < n; i++) bill(ctx, -10 + i * 14, -30 - i * 6, -.5 + i * .32 + Math.sin((t || 0) * 3 + i) * .03, i % 2 ? "#E58BA0" : "#7FB7A0", ""); }
    else if (kind === "coin"){ coin(ctx, 0, -30, 34, (t || 0) * 3); }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA", notif: o.notif }, t); }
    else if (kind === "form"){ ctx.rotate(-.06); rr(ctx, -95, -130, 190, 250, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, o.text || "FORMULIR", 0, -92, 24, ORANGE, 900, 160);
      for (let i = 0; i < 3; i++){ ctx.fillStyle = "#B9A58E"; rr(ctx, -70, -66 + i * 32, 140 - i * 20, 11, 5); ctx.fill(); }
      ctx.setLineDash([8, 6]); ctx.strokeStyle = o.signed ? GREEN : RED; ctx.lineWidth = 4; ctx.strokeRect(-70, 36, 140, 60); ctx.setLineDash([]);
      textC(ctx, "TTD", 0, 30, 18, o.signed ? GREEN : RED, 900);
      if (o.signed){ ctx.strokeStyle = "#13223D"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-56, 76); ctx.bezierCurveTo(-30, 30, -10, 100, 10, 60); ctx.bezierCurveTo(24, 40, 40, 90, 60, 58); ctx.stroke(); } }
    else if (kind === "soda"){ ctx.rotate(Math.sin((t || 0) * (o.shake ? 22 : 2)) * (o.shake ? .35 : .04)); sodaBottle(ctx, 190, { t, text: "", fizz: o.fizz || 0, cap: o.cap ?? 1 }); }
    else if (kind === "bag"){ ctx.beginPath(); ctx.moveTo(-34, -120); ctx.quadraticCurveTo(0, -190, 34, -120); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 6; ctx.stroke();
      rr(ctx, -80, -124, 160, 150, 18); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, -50, -80, 100, 40, 8); ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fill(); }
    else if (kind === "key"){ ctx.rotate(-.6 + Math.sin((t || 0) * 2) * .06); ctx.beginPath(); ctx.arc(0, -150, 46, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -150, 18, 0, TAU); ctx.fillStyle = "#8E5A1E"; ctx.fill();
      rr(ctx, -12, -108, 24, 150, 6); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); rr(ctx, 10, 0, 34, 16, 4); ctx.fill(); ol(ctx, 4); rr(ctx, 10, 26, 24, 14, 4); ctx.fill(); ol(ctx, 4); }
    else if (kind === "pot"){ ctx.translate(0, 40); potPlant(ctx, o.g ?? 1, t || 0, o.text); }
    else if (kind === "sticker"){ ctx.rotate(-.1); ctx.beginPath(); ctx.arc(0, -40, 56, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -40, 46, 0, TAU); ctx.fillStyle = o.col || "#5B7DB1"; ctx.fill();
      ctx.fillStyle = "#E2A77C"; ctx.beginPath(); ctx.arc(0, -46, 20, 0, TAU); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-7, -48, 3, 0, TAU); ctx.arc(7, -48, 3, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -42, 8, .3, Math.PI - .3); ctx.stroke(); }
    else if (kind === "marker"){ ctx.rotate(-.5); rr(ctx, -22, -150, 44, 190, 14); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 5); rr(ctx, -22, -150, 44, 60, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-14, 40); ctx.lineTo(14, 40); ctx.lineTo(4, 74); ctx.lineTo(-4, 74); ctx.closePath(); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 4); }
    else if (kind === "mug"){ mug(ctx, o.col || "#FFFFFF"); for (let k = 0; k < 2; k++){ const q = ((t || 0) * .6 + k / 2) % 1; ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6 + k * 12, -70 - q * 50); ctx.quadraticCurveTo(-16 + k * 12, -86 - q * 50, -4 + k * 12, -104 - q * 50); ctx.stroke(); } ctx.globalAlpha = 1; }
    else if (kind === "paper"){ ctx.rotate(-.08); rr(ctx, -90, -120, 180, 240, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      const n = o.lines ?? 5; for (let i = 0; i < n; i++){ ctx.fillStyle = i === 0 ? ORANGE : "#B9A58E"; rr(ctx, -66, -92 + i * 40, i === 0 ? 132 : 70 + rnd(i) * 60, 14, 6); ctx.fill(); } }
    else if (kind === "book"){ ctx.rotate(-.1); rr(ctx, -100, -70, 200, 130, 8); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 5); ctx.fillStyle = PAPER; rr(ctx, -90, -62, 86, 114, 4); ctx.fill(); rr(ctx, 4, -62, 86, 114, 4); ctx.fill();
      ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++){ ctx.fillRect(-80, -44 + i * 24, 64, 7); ctx.fillRect(14, -44 + i * 24, 64, 7); } }
    else if (ITEMS[kind]){ ITEMS[kind](ctx, t || 0, o); }
    else if (kind === "ball"){ ctx.rotate((t || 0) * 6); ctx.beginPath(); ctx.arc(0, -40, 40, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -40, 40, -.6, .6); ctx.lineTo(0, -40); ctx.fill(); ctx.beginPath(); ctx.arc(0, -40, 40, Math.PI - .6, Math.PI + .6); ctx.lineTo(0, -40); ctx.fill(); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function keycap(ctx, txt, x, y, k, hl){ if (k < 0) return 0; const q = eBack(clamp(k / .3, 0, 1)), press = k > .35 && k < .55 ? 8 : 0; fit(ctx, txt, 260, 50, 900); const w = Math.max(110, ctx.measureText(txt).width + 60);
    ctx.save(); ctx.translate(x, y + press); ctx.scale(q, q); rr(ctx, -w / 2, -50, w, 112, 18); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 8, -48 - (8 - press), w - 16, 94, 14); ctx.fillStyle = hl ? ORANGE : "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = hl ? "#FFFFFF" : OUT; ctx.textAlign = "center"; ctx.fillText(txt, 0, 12 - (8 - press)); ctx.textAlign = "left"; ctx.restore(); return w; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
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
    if (f.bg && BG[f.bg]) layer(ctx, c, 1, () => BG[f.bg](ctx, t, f.bgOpt || {}, s, shotT));
    const R = { c, f, piece, shotT };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    (f.stamps || []).forEach((p, j) => ovs.push(() => { const k = t - tOf(s, p, .4, idx); if (k >= 0 && k < (p.hold || 99)) stampBox(ctx, p.text, p.x ?? 540, p.y ?? 600, k, p.col || GREEN, p.size || 70, (p.rot ?? -8) * Math.PI / 180); if (k >= 0 && k < .9) burstFx(ctx, p.x ?? 540, p.y ?? 600, k, p.col || GREEN, 12, 220); }));
    (f.tags || []).forEach((g, j) => ovs.push(() => { const st = sts[g.on ?? 0]; if (!st) return; const k = t - tOf(s, g, .2 + j * .1, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : 1e9; if (k < 0 || t > O) return;
      const hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, p = c.toScreen(hp[0], hp[1] + sitD - st.size * .36); popChip(ctx, g.text, p[0], Math.max(230, p[1]), k, g.bg || NAVY, g.fg || "#FFFFFF", g.size || 34, g.rot ?? -.04); }));
    if (f.keys){ const K = f.keys, T0 = tOf(s, K, .3, idx), O = K.outCue ? T(s, K.outCue, .9, idx) : (K.out ?? 1e9);
      if (t >= T0 && t < O + .3) ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1);
        (K.caps || []).forEach((row, r) => { const y = (K.y || 300) + r * 170, gap = 70; font(ctx, 900, 50, FAM); const ws = row.map(x => Math.max(110, ctx.measureText(x).width + 60)), tot = ws.reduce((a, b) => a + b, 0) + gap * (row.length - 1);
          let x = 540 - tot / 2; if (K.label && K.label[r]){ popChip(ctx, K.label[r], 540, y - 92, t - T0 - r * .6, NAVY, "#FFFFFF", 28); }
          row.forEach((cap, i) => { const kk = t - T0 - r * .6 - i * .18; keycap(ctx, cap, x + ws[i] / 2, y, kk, i === row.length - 1); if (i < row.length - 1 && kk > .1){ ctx.save(); ctx.globalAlpha *= clamp(kk * 3, 0, 1); outlineWords(ctx, [{ w: "+" }], x + ws[i] + gap / 2, y + 24, 60, { sw: 12 }); ctx.restore(); } x += ws[i] + gap; }); });
        ctx.restore(); }); }
    if (f.steps){ const y0 = f.stepsY || 250; f.steps.forEach((st, j) => { const T0 = tOf(s, st, .3, idx); if (t < T0) return; ovs.push(() => { const q = eBack(clamp((t - T0) / .4, 0, 1)), y = y0 + j * 104;
        ctx.save(); ctx.translate(540 + (1 - q) * -700, y); ctx.rotate(-.015 + j * .012); fit(ctx, st.text, 640, 46, 900); const w = Math.min(860, ctx.measureText(st.text).width + 170);
        rr(ctx, -w / 2, -42, w, 84, 42); ctx.fillStyle = j === f.steps.length - 1 ? ORANGE : CREAM; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(-w / 2 + 44, 0, 30, 0, TAU); ctx.fillStyle = j === f.steps.length - 1 ? CREAM : ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(j + 1), -w / 2 + 44, 15, 38, j === f.steps.length - 1 ? ORANGE : "#FFFFFF", 900);
        fit(ctx, st.text, 640, 46, 900); ctx.fillStyle = j === f.steps.length - 1 ? "#FFFFFF" : BROWN; ctx.textAlign = "center"; ctx.fillText(st.text, 40, 16); ctx.textAlign = "left"; ctx.restore(); }); }); }
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
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); });
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    (f0.stamps || []).forEach(p => add(tOf(s, p, .4, i), "ping"));
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, tombol, langkah, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= shared small figures ================= */
  const SKINS = ["#F1C9A5", "#E2A77C", "#C68A5E", "#9C6644"];
  // seated audience member (simple), origin = seat level centre; kind 0 = man (short hair), 1 = woman (hijab)
  function guest(ctx, x, y, s, i, t, o){ o = o || {}; const woman = o.woman ?? (i % 2 === 1), skin = SKINS[i % 4], shirt = ["#5B7DB1", "#C2691F", "#3E9B5A", "#8E5BB5", "#D9483B", "#2F6F73"][i % 6];
    const hij = ["#2F6F73", "#8E3B5A", "#D9A441", "#5B7DB1", "#3E9B5A", "#C2691F"][(i * 7) % 6], bob = Math.sin(t * 2.2 + i * 1.7) * 3 + (o.cheer ? Math.abs(Math.sin(t * 7 + i)) * -14 : 0);
    ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
    rr(ctx, -38, -78, 76, 86, 26); ctx.fillStyle = shirt; ctx.fill(); ol(ctx, 5);
    if (o.cheer){ ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-30, -60); ctx.lineTo(-52, -132); ctx.moveTo(30, -60); ctx.lineTo(52, -132); ctx.stroke(); ctx.strokeStyle = skin; ctx.lineWidth = 8; ctx.stroke(); }
    if (woman){ ctx.beginPath(); ctx.moveTo(-44, -60); ctx.quadraticCurveTo(-50, -150, 0, -156); ctx.quadraticCurveTo(50, -150, 44, -60); ctx.closePath(); ctx.fillStyle = hij; ctx.fill(); ol(ctx, 5); }
    ctx.beginPath(); ctx.arc(0, -112, 30, 0, TAU); ctx.fillStyle = skin; ctx.fill(); if (!woman) ol(ctx, 5);
    if (woman){ ctx.beginPath(); ctx.arc(0, -112, 30, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(0, -150); ctx.closePath(); ctx.fillStyle = hij; ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, -116, 31, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fillStyle = "#2B1A12"; ctx.fill(); }
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-10, -112, 4, 0, TAU); ctx.arc(10, -112, 4, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 3.5; ctx.beginPath(); if (o.sad) ctx.arc(0, -88, 9, Math.PI + .5, -.5); else ctx.arc(0, -102, 10, .35, Math.PI - .35); ctx.stroke();
    ctx.restore(); }
  function foldChair(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(30, 90); ctx.moveTo(34, 0); ctx.lineTo(-30, 90); ctx.stroke(); ctx.strokeStyle = "#8C969C"; ctx.lineWidth = 4; ctx.stroke();
    rr(ctx, -44, -96, 88, 70, 12); ctx.fillStyle = col || "#B23A48"; ctx.fill(); ol(ctx, 5); rr(ctx, -46, -8, 92, 18, 6); ctx.fill(); ol(ctx, 5); ctx.restore(); }
  function balloon(ctx, x, y, r, col, t, i, sag){ const sw = Math.sin(t * 1.6 + i) * 6; r *= 1 - sag * .45; ctx.save(); ctx.translate(x + sw, y + sag * 40);
    ctx.beginPath(); ctx.ellipse(0, 0, r * .86, r * (1 - sag * .25), sag * .4 * (i % 2 ? 1 : -1), 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.ellipse(-r * .3, -r * .35, r * .18, r * .28, -.5, 0, TAU); ctx.fill(); ctx.restore(); }
  /* ---------- BG: launch hall ---------- */
  BG.aula = (ctx, t, o) => {
    const full = o.full ? 1 : 0, sag = o.sag || 0;
    ctx.fillStyle = "#6E2A35"; ctx.fillRect(-2600, -1200, 6400, GY + 1200);
    for (let x = -2600; x < 3800; x += 70){ ctx.fillStyle = (x / 70) % 2 ? "#7D3240" : "#652532"; ctx.fillRect(x, -1200, 36, GY + 1200); }
    // stage
    rr(ctx, -260, 980, 1600, 170, 10); ctx.fillStyle = "#4A2A1E"; ctx.fill(); ol(ctx, 8); ctx.fillStyle = "#7A4A2E"; ctx.fillRect(-256, 984, 1592, 30);
    // banner
    rr(ctx, 120, 560, 840, 170, 18); ctx.fillStyle = full ? ORANGE : "#B9774A"; ctx.fill(); ol(ctx, 8); textC(ctx, o.banner || "PELUNCURAN PRODUK", 540, 640, 64, "#FFFFFF", 900, 760); textC(ctx, o.sub || "Sabtu, 09.00", 540, 700, 34, CREAM, 800);
    // balloon arches
    [[60, 1], [1020, -1]].forEach(([bx, d], a) => { for (let i = 0; i < 9; i++){ const q = i / 8, x = bx + d * Math.sin(q * Math.PI) * 120 - d * 30, y = 1000 - q * 520; if (o.gone && a === 1 && i === 8) continue;
      balloon(ctx, x, y, 46, [ORANGE, GOLD, "#FFFFFF", RED][(i + a) % 4], t, i + a * 9, sag * (0.5 + q * .5)); } });
    // floor
    ctx.fillStyle = "#3A2E2A"; ctx.fillRect(-2600, 1150, 6400, 2000); ctx.fillStyle = "#4E3D36"; for (let y = 1180; y < GY + 400; y += 70) ctx.fillRect(-2600, y, 6400, 6);
    // chair rows (back to front)
    const rows = [[1240, .62, 12, 96], [1330, .72, 11, 108], [1430, .84, 10, 122], [1540, .96, 9, 138]]; let n = 0; const seat = o.seat || [3, 7, 14, 18, 22, 27, 30, 33, 38];
    rows.forEach(([y, s, cnt, gap], r) => { for (let i = 0; i < cnt; i++){ const x = 540 + (i - (cnt - 1) / 2) * gap; foldChair(ctx, x, y - 70 * s, s, "#B23A48");
      const idx = n++; if (full || seat.indexOf(idx) >= 0) guest(ctx, x, y - 92 * s, s * .95, idx, t, { cheer: o.cheer && full, sad: !full && sag > .5 }); } });
  };
  function tumbler(ctx, x, y, h, ang, o){ o = o || {}; const R = h * .34, hr = h * .23; ctx.save(); ctx.translate(x + R * ang, y - R); ctx.rotate(ang);
    ctx.fillStyle = hexA(OUT, .25); ctx.save(); ctx.rotate(-ang); ctx.beginPath(); ctx.ellipse(0, R - 2, R * .9, 12, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, -h + R + hr * .9, hr, 0, TAU); ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, 0, R - 3, -Math.PI * .95, -Math.PI * .05); ctx.lineTo(0, -h + R + hr * .9); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -h + R + hr * .95, hr * .78, 0, TAU); ctx.fillStyle = "#FCE3C8"; ctx.fill(); ol(ctx, 4);
    const fy = -h + R + hr; ctx.fillStyle = OUT; const dz = Math.abs(ang) > .6;
    if (dz){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; [-1, 1].forEach(d => { ctx.beginPath(); for (let k = 0; k < 14; k++){ const a = k * .7, rr2 = k * .7; ctx.lineTo(d * hr * .32 + Math.cos(a) * rr2, fy - 6 + Math.sin(a) * rr2); } ctx.stroke(); }); }
    else { ctx.beginPath(); ctx.arc(-hr * .32, fy - 6, hr * .1, 0, TAU); ctx.arc(hr * .32, fy - 6, hr * .1, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); if (o.mood === "sad") ctx.arc(0, fy + hr * .42, hr * .2, Math.PI + .5, -.5); else ctx.arc(0, fy + hr * .12, hr * .26, .3, Math.PI - .3); ctx.stroke();
    ctx.fillStyle = hexA("#F28DB2", .7); ctx.beginPath(); ctx.arc(-hr * .52, fy + hr * .12, hr * .12, 0, TAU); ctx.arc(hr * .52, fy + hr * .12, hr * .12, 0, TAU); ctx.fill();
    if (o.glasses > 0){ ctx.save(); ctx.globalAlpha *= o.glasses; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-hr * .32, fy - 6, hr * .22, 0, TAU); ctx.moveTo(hr * .54, fy - 6); ctx.arc(hr * .32, fy - 6, hr * .22, 0, TAU); ctx.moveTo(-hr * .1, fy - 6); ctx.lineTo(hr * .1, fy - 6); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.ellipse(-R * .45, -R * .35, R * .16, R * .3, -.5, 0, TAU); ctx.fill();
    if (o.label){ ctx.save(); ctx.rotate(-.04); rr(ctx, -R * .7, -R * .28, R * 1.4, R * .5, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, o.label, 0, R * .1, R * .2, OUT, 900, R * 1.25); ctx.restore(); }
    (o.cards || []).forEach((cd, k) => { if (cd.q <= 0) return; ctx.save(); ctx.translate((k ? 1 : -1) * R * .5, -R * .05 + k * R * .25); ctx.rotate((k ? .18 : -.18)); ctx.scale(cd.q, cd.q);
      rr(ctx, -R * .55, -R * .3, R * 1.1, R * .6, 6); ctx.fillStyle = cd.col || GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, cd.text, 0, R * .08, R * .17, OUT, 900, R); ctx.restore(); });
    ctx.restore(); }
  function wobble(t, T0, A, d){ if (t < T0) return 0; const k = t - T0; if (k < .25) return A * eOut(k / .25); return A * Math.exp(-(d || 2.2) * (k - .25)) * Math.cos(7.5 * (k - .25)); }
  function shell(ctx, cx, baseY, w, h, t, peek, open){ // dome shell; open 0..1 lowers it
    ctx.save(); ctx.translate(cx, baseY); const H = h * (1 - open * .45);
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.bezierCurveTo(-w / 2, -H * 1.05, w / 2, -H * 1.05, w / 2, 0); ctx.closePath();
    ctx.fillStyle = "#4E8A3E"; ctx.fill(); ol(ctx, 8); ctx.save(); ctx.clip();
    ctx.strokeStyle = "#2F5E27"; ctx.lineWidth = 7; const hs = w * .16;
    for (let r = 0; r < 7; r++) for (let c = -4; c <= 4; c++){ const hx = c * hs * 1.5 + (r % 2 ? hs * .75 : 0), hy = -r * hs * .87 - hs * .3; ctx.beginPath(); for (let k = 0; k < 6; k++){ const a = k * Math.PI / 3; ctx.lineTo(hx + Math.cos(a) * hs * .72, hy + Math.sin(a) * hs * .72); } ctx.closePath(); ctx.fillStyle = (r + c) % 2 ? "#5E9C4A" : "#6FAE55"; ctx.fill(); ctx.stroke(); }
    ctx.restore(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.bezierCurveTo(-w / 2, -H * 1.05, w / 2, -H * 1.05, w / 2, 0); ctx.closePath(); ol(ctx, 8);
    rr(ctx, -w / 2 - 14, -24, w + 28, 36, 18); ctx.fillStyle = "#C9A15A"; ctx.fill(); ol(ctx, 6);
    if (peek > 0){ const sy = -H * .62, blink = (t % 3.1) < .12 ? .15 : 1; ctx.save(); ctx.globalAlpha *= peek; rr(ctx, -w * .26, sy - 34, w * .52, 68, 34); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 5);
      [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * w * .09 + Math.sin(t * 1.3) * 8, sy, 18, 18 * blink, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(d * w * .09 + Math.sin(t * 1.3) * 8 + 4, sy + 2, 7 * blink, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }); ctx.restore(); }
    ctx.restore(); }

  /* ================= SB49: _aula ================= */
  TT.scene(PX + "aula", "Cerita: aula peluncuran 100 kursi lipat, 9 tamu, lengkung balon melorot, satu balon kempis terbang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.aula || {});
    const tNine = T(s, K.nineCue, .3, idx), tWait = T(s, K.waitCue, .7, idx), tSag = T(s, K.sagCue, .4, idx);
    const sag = t < tSag ? 0 : clamp((t - tSag) / 2.5, 0, 1);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false }, envFront: false,
      back: () => { BG.aula(ctx, t, { sag, gone: t > tWait }); },
      front: () => { if (t > tWait && t < tWait + 2.6){ const k = t - tWait, x = 960 - k * 260 + Math.sin(k * 14) * 70, y = 540 - k * 120 + Math.cos(k * 11) * 60;
          ctx.save(); ctx.translate(x, y); ctx.rotate(k * 9); balloon(ctx, 0, 0, 46 * (1 - k * .25), RED, t, 3, 0); ctx.restore();
          for (let i = 0; i < 6; i++){ const kk = k - i * .07; if (kk < 0) continue; ctx.fillStyle = hexA("#FFFFFF", .5 - i * .07); ctx.beginPath(); ctx.arc(960 - kk * 260 + Math.sin(kk * 14) * 70, 540 - kk * 120 + Math.cos(kk * 11) * 60, 10 - i, 0, TAU); ctx.fill(); } } },
      over: (c) => {
        if (t >= tNine){ const k = t - tNine; ctx.save(); const q = eBack(clamp(k / .4, 0, 1)); ctx.translate(540, 250); ctx.scale(q, q); rr(ctx, -260, -70, 520, 140, 24); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6);
          const n = Math.min(9, Math.floor(1 + k * 6)); textC(ctx, n + " / 100", 540 - 540, 22, 78, n >= 9 ? GOLD : "#FFFFFF", 900); textC(ctx, "TAMU DATANG", 0, 58, 24, hexA("#FFFFFF", .8), 800); ctx.restore(); }
        if (t > tWait) popWord(ctx, "PFFFT...", 700, 800, t - tWait, { size: 74, hold: 1.4, rot: 8 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.aula || {}; if (K.nineCue) add(cueT(s, K.nineCue, .3, i), "pop"); if (K.waitCue) add(cueT(s, K.waitCue, .7, i), "whoosh"); });

  /* ================= SB49: _kura ================= */
  TT.scene(PX + "kura", "Cerita: kantor, Yoga bersembunyi di tempurung kura-kura raksasa; dalih HUJAN menyembur keluar, undangan rapat memantul, tempurung menutup", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.kura || {});
    const tOn = T(s, K.shellCue, .3, idx), tRain = T(s, K.rainCue, .3, idx), tMeet = T(s, K.meetCue, .3, idx), tShut = T(s, K.shutCue, .3, idx), tAsk = T(s, K.askCue, .3, idx);
    const open = t > tRain && t < tShut ? clamp((t - tRain) / .2, 0, 1) * clamp((tRain + 1.7 - t) / .25, 0, 1) : 0;
    base(ctx, s, t, { env: "office", envOpt: { desk: true, deskX: 1250, plant: true, plantX: -120 },
      spots: { shell: [K.x ?? 540, 1150, 1.1] },
      front: (c2, c, sts) => { const st = sts[0]; if (!st || t < tOn) return; const q = eBack(clamp((t - tOn) / .45, 0, 1)), wob = t > tAsk && t < tAsk + .6 ? Math.sin((t - tAsk) * 40) * .04 : 0;
        ctx.save(); ctx.translate(st.x, GY); ctx.rotate(wob); ctx.scale(q, q); shell(ctx, 0, 0, 580, 1000, t, 1 - open, open); ctx.restore();
        // meeting invite bouncing off
        if (t > tMeet && t < tMeet + 2.2){ const k = t - tMeet, x = st.x + 520 - k * 900 + (k > .5 ? (k - .5) * 1400 : 0), y = 760 + (k < .5 ? k * 300 : 150 - (k - .5) * 500 + (k - .5) * (k - .5) * 700);
          ctx.save(); ctx.translate(x, y); ctx.rotate(k * (k > .5 ? 8 : 0) - .1); rr(ctx, -110, -70, 220, 140, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); rr(ctx, -110, -70, 220, 42, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5);
          textC(ctx, "RAPAT", 0, -38, 28, "#FFFFFF", 900); textC(ctx, "10.00", 0, 30, 46, OUT, 900); ctx.restore();
          if (k > .45 && k < .9) burstFx(ctx, st.x + 70, 900, (k - .45) * 2, GOLD, 10, 140); }
      },
      over: (c2, c, sts) => { const st = sts[0]; if (!st) return; const p = c.toScreen(st.x, 900);
        if (t > tRain) popChip(ctx, "GARA-GARA HUJAN!", clamp(p[0] + 60, 300, 780), 420 - Math.min(1, (t - tRain) * 2) * 60, t - tRain, "#5B7DB1", "#FFFFFF", 46, -.06);
        if (t > tRain && t < tRain + 2.2){ for (let i = 0; i < 14; i++){ const k = ((t * 1.4) + rnd(i)) % 1; ctx.strokeStyle = hexA("#9CC8FF", .8); ctx.lineWidth = 5; ctx.beginPath(); const x = 200 + rnd(i + 4) * 680, y = 470 + k * 120; ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 26); ctx.stroke(); } }
        if (t > tShut) popWord(ctx, "...", clamp(p[0] + 230, 200, 880), 780, t - tShut, { size: 120, hold: 2.2, rot: 0 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kura || {}; if (K.shellCue) add(cueT(s, K.shellCue, .3, i), "whoosh"); if (K.rainCue) add(cueT(s, K.rainCue, .3, i), "pop"); if (K.meetCue) add(cueT(s, K.meetCue, .3, i) + .5, "pop"); if (K.shutCue) add(cueT(s, K.shutCue, .3, i), "whoosh"); });

  /* ================= SB49: _tumbler ================= */
  function gardenTable(ctx, x, top, w){ rr(ctx, x - w / 2, top, w, 30, 10); ctx.fillStyle = "#F3F0EA"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 26, top + 30, 52, GY - top - 40, 8); ctx.fillStyle = "#D8D2C8"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 120, GY - 22, 240, 22, 10); ctx.fill(); ol(ctx, 5); }
  TT.scene(PX + "tumbler", "Cerita: meja taman, atasan mendorong boneka mainan yang oleng lalu tegak lagi, boneka memakai kacamata Yoga, CARA BANGKIT", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 600, top: 1330, h: 330 }, f.tumbler || {});
    const tP1 = T(s, K.pushCue, .6, idx), tGlass = T(s, K.glassCue, .3, idx), tP2 = T(s, K.push2Cue, .3, idx), tDone = T(s, K.doneCue, .4, idx), tUp = T(s, K.upCue, .3, idx);
    const ang = wobble(t, tP1, 1.05, 1.9) + wobble(t, tP2, -1.2, 2.4);
    base(ctx, s, t, { env: "park", envOpt: { bench: false, treeX: 1250 }, envFront: false,
      spots: { toy: [K.x, K.top - K.h * .55, 1.35] },
      mid: () => { gardenTable(ctx, K.x, K.top, 560); tumbler(ctx, K.x, K.top, K.h, ang, { col: RED, glasses: t < tGlass ? 0 : clamp((t - tGlass) / .3, 0, 1), mood: Math.abs(ang) > .5 ? "sad" : "happy", label: t > tGlass ? "YOGA" : "" });
        if (t > tGlass && t < tGlass + .9) burstFx(ctx, K.x, K.top - K.h * .7, t - tGlass, GOLD, 10, 160);
        if (t > tUp && t < tUp + .9) burstFx(ctx, K.x, K.top - K.h * .5, t - tUp, ORANGE, 14, 240); },
      midZ: 1,
      over: () => {
        if (t > tP1 + .25 && t < tP1 + 1.4) popWord(ctx, "OLENG!", 540, 420, t - tP1 - .25, { size: 96, rot: -10, hold: 1.1 });
        if (t > tDone) popChip(ctx, "SUDAH TERJADI", 300, 330, t - tDone, "#8C8C94", "#FFFFFF", 40, -.05);
        if (t > tUp) stampBox(ctx, "CARA BANGKIT", 600, 470, t - tUp, ORANGE, 84, -.08);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tumbler || {}; if (K.pushCue) add(cueT(s, K.pushCue, .6, i), "whoosh"); if (K.push2Cue) add(cueT(s, K.push2Cue, .3, i), "whoosh"); if (K.glassCue) add(cueT(s, K.glassCue, .3, i), "chime"); if (K.doneCue) add(cueT(s, K.doneCue, .4, i), "pop"); if (K.upCue) add(cueT(s, K.upCue, .3, i), "chime"); });

  /* ================= SB49: _kotak (black box) ================= */
  function blackBox(ctx, x, y, w, lid, t){ const h = w * .62; ctx.save(); ctx.translate(x, y);
    // glow from inside
    if (lid > 0) glowAt(ctx, 0, -h, w * 1.1 * lid, GOLD, .55 * lid);
    rr(ctx, -w / 2, -h, w, h, 22); ctx.fillStyle = "#E8731C"; ctx.fill(); ol(ctx, 8);
    ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 5; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(-w / 2 + 20, -h + 40 + k * 22); ctx.lineTo(-w / 2 + 60, -h + 40 + k * 22); ctx.stroke(); }
    rr(ctx, -w * .32, -h * .62, w * .64, h * .36, 10); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 4); textC(ctx, "KOTAK HITAM", 0, -h * .4, w * .07, "#FFFFFF", 900, w * .56);
    ctx.save(); ctx.translate(w / 2, -h); ctx.rotate(lid * 1.15); rr(ctx, -w, -60, w, 66, 16); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 7); ctx.restore();
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * (w / 2 - 26), -26, 12, 0, TAU); ctx.fillStyle = "#B9B9C2"; ctx.fill(); ol(ctx, 4); });
    ctx.restore(); }
  TT.scene(PX + "kotak", "Cerita: lab navy, kotak hitam acara dibuka, sembilan telepon tamu dicentang, tiga sebab terbang keluar; potong ke aula penuh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 640 }, f.kotak || {});
    const tOpen = T(s, K.openCue, .3, idx), tCall = T(s, K.callCue, .3, idx), tC = (K.causes || []).map((c, j) => T(s, c.cue, .3 + j * .1, idx));
    base(ctx, s, t, { env: "info", envOpt: { spotX: K.x },
      spots: { box: [K.x - 90, 1180, 1.04] },
      mid: () => { const lid = t < tOpen ? 0 : eBack(clamp((t - tOpen) / .5, 0, 1)), bob = Math.sin(t * 2) * 6;
        rr(ctx, K.x - 230, 1400, 460, 240, 12); ctx.fillStyle = "#2A3A5C"; ctx.fill(); ol(ctx, 6); blackBox(ctx, K.x, 1400, 520, lid, t);
        if (t > tOpen && t < tOpen + .9) burstFx(ctx, K.x, 1180, t - tOpen, GOLD, 12, 220);
        (K.causes || []).forEach((c, j) => { const k = t - tC[j]; if (k < 0) return; const q = eOut(clamp(k / .6, 0, 1)), tx = [300, 600, 860][j], ty = [700, 590, 720][j];
          const x = lerp(K.x, tx, q), y = lerp(1180, ty, q) - Math.sin(q * Math.PI) * 120 + Math.sin(t * 2 + j) * 8;
          ctx.save(); ctx.translate(x, y); ctx.rotate((j - 1) * .08 + Math.sin(t * 1.5 + j) * .03); const sc = .4 + .6 * q; ctx.scale(sc, sc); fit(ctx, c.text, 340, 54, 900); const w = ctx.measureText(c.text).width + 60;
          rr(ctx, -w / 2, -52, w, 104, 14); ctx.fillStyle = [RED, GOLD, "#5B8FD9"][j]; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(-w / 2 + 6, -40, 12, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
          ctx.fillStyle = j === 1 ? OUT : "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(c.text, 0, 18); ctx.textAlign = "left"; ctx.restore(); }); },
      midZ: 1,
      over: () => {
        if (t > tCall){ for (let i = 0; i < 9; i++){ const k = t - tCall - i * .22; if (k < 0) continue; const q = eBack(clamp(k / .3, 0, 1)), x = 150 + i * 97.5, y = 300 + (i % 2) * 34;
          ctx.save(); ctx.translate(x, y); ctx.scale(q * .78, q * .78); ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); guest(ctx, 0, 64, .62, i, t, {});
          if (k > .5){ const q2 = eBack(clamp((k - .5) / .3, 0, 1)); ctx.save(); ctx.translate(36, -36); ctx.scale(q2, q2); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-2, 8); ctx.lineTo(11, -8); ctx.stroke(); ctx.restore(); }
          ctx.restore(); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kotak || {}; if (K.openCue) add(cueT(s, K.openCue, .3, i), "chime"); if (K.callCue) for (let k = 0; k < 9; k++) add(cueT(s, K.callCue, .3, i) + .5 + k * .22, "ping");
    (K.causes || []).forEach((c, j) => add(cueT(s, c.cue, .3 + j * .1, i), "whoosh")); });

  /* ================= SB49: _tulis (home, cards onto the toy) ================= */
  TT.scene(PX + "tulis", "Cerita: rumah malam, dua kartu (pelajaran + langkah kecil) ditempel ke boneka mainan, disentil, boneka tegak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 740, top: 1360, h: 390 }, f.tulis || {});
    const tA = T(s, K.aCue, .3, idx), tB = T(s, K.bCue, .3, idx), tFlick = T(s, K.flickCue, .6, idx);
    const ang = wobble(t, tFlick, .9, 2.2) + Math.sin(t * 1.4) * .03;
    const cq = (T0) => t < T0 + .6 ? 0 : eBack(clamp((t - T0 - .6) / .35, 0, 1));
    base(ctx, s, t, { env: "home", envOpt: { lampX: 120 },
      spots: { toy: [K.x - 180, K.top - 230, 1.05] },
      mid: () => { rr(ctx, K.x - 330, K.top, 660, 34, 8); ctx.fillStyle = "#8A5A3B"; ctx.fill(); ol(ctx, 6); [-1, 1].forEach(d => { rr(ctx, K.x + d * 290 - 14, K.top + 34, 28, GY - K.top - 34, 6); ctx.fill(); ol(ctx, 5); });
        tumbler(ctx, K.x, K.top, K.h, ang, { col: "#3E6FB5", glasses: 1, cards: [{ q: cq(tA), text: K.a || "PELAJARAN", col: GOLD }, { q: cq(tB), text: K.b || "LANGKAH KECIL", col: "#9BE0B0" }] });
        if (t > tFlick + .3 && t < tFlick + 1.2) burstFx(ctx, K.x, K.top - 160, t - tFlick - .3, ORANGE, 12, 200); },
      midZ: 1,
      over: (c2, c) => {
        [[tA, K.a || "PELAJARAN", GOLD, OUT, 0], [tB, K.b || "LANGKAH KECIL", "#9BE0B0", OUT, 1]].forEach(([T0, txt, bg, fg, j]) => { const k = t - T0; if (k < 0 || k > .75) return; const p = c.toScreen(K.x + (j ? 60 : -60), K.top - 150);
          const q = clamp(k / .6, 0, 1), x = lerp(j ? 820 : 260, p[0], eOut(q)), y = lerp(330, p[1], eOut(q)); ctx.save(); ctx.globalAlpha *= 1 - clamp((k - .6) / .15, 0, 1); popChip(ctx, txt, x, y, k + .3, bg, fg, 44, -.05); ctx.restore(); });
        if (t > tFlick + .4) popWord(ctx, "BANGKIT!", 540, 420, t - tFlick - .4, { size: 104, rot: -6, hold: 1.6 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tulis || {}; ["aCue", "bCue"].forEach(k => { if (K[k]) add(cueT(s, K[k], .3, i) + .6, "pop"); }); if (K.flickCue) add(cueT(s, K.flickCue, .6, i), "whoosh"); });

  /* ================= SP49 shared ================= */
  function wallClock(ctx, x, y, r, hr, mn, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = o.face || "#FFFDF6"; ctx.fill(); ol(ctx, 7);
    for (let k = 0; k < 12; k++){ const a = k / 12 * TAU; ctx.strokeStyle = OUT; ctx.lineWidth = k % 3 ? 3 : 6; ctx.beginPath(); ctx.moveTo(Math.sin(a) * r * .78, -Math.cos(a) * r * .78); ctx.lineTo(Math.sin(a) * r * .9, -Math.cos(a) * r * .9); ctx.stroke(); }
    const ah = (hr % 12 + mn / 60) / 12 * TAU, am = mn / 60 * TAU; ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ah) * r * .5, -Math.cos(ah) * r * .5); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(am) * r * .74, -Math.cos(am) * r * .74); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 3; const as = t * TAU / 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(as) * r * .8, -Math.cos(as) * r * .8); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); }
  function moon(ctx, x, y, r, col){ ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GOLD; ctx.fill(); ol(ctx, 4); ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(x + r * .45, y - r * .3, r * .82, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x + r * .45, y - r * .3, r * .82, 0, TAU, true); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
  ITEMS.torch = (ctx, t) => { ctx.rotate(-.25); rr(ctx, -16, -20, 92, 34, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); rr(ctx, 70, -28, 30, 50, 8); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFF6B0"; ctx.fillRect(96, -22, 6, 38); };
  ITEMS.trophy = (ctx, t, o) => { ctx.translate(0, -40); ctx.rotate(Math.sin(t * 3) * .05); ctx.beginPath(); ctx.moveTo(-60, -120); ctx.lineTo(60, -120); ctx.quadraticCurveTo(60, -30, 0, -20); ctx.quadraticCurveTo(-60, -30, -60, -120); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5);
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 66, -92, 22, d > 0 ? -1.6 : 1.6 - Math.PI * 0, d > 0 ? 1.6 : Math.PI + 1.6 - Math.PI * 0, d < 0); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.stroke(); });
    rr(ctx, -12, -22, 24, 34, 4); ctx.fillStyle = "#C98A1B"; ctx.fill(); ol(ctx, 4); rr(ctx, -50, 10, 100, 30, 6); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4); sparkle(ctx, 30 + Math.sin(t * 4) * 6, -100, 14, "#FFFFFF"); };
  /* ---------- SP49: _satpam ---------- */
  TT.scene(PX + "satpam", "Cerita: kantor gelap malam, senter satpam menemukan karyawan terakhir, jam dinding 21.00, lima bulan sabit", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ deskX: 470, top: 1400 }, f.satpam || {});
    const tClock = T(s, K.clockCue, .2, idx), tBeam = T(s, K.beamCue, .3, idx), tFive = T(s, K.fiveCue, .4, idx);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plant: false, rug: false }, envFront: false,
      spots: { clock: [900, 760, 1.25] },
      back: () => { const ck = t < tClock ? 0 : eBack(clamp((t - tClock) / .4, 0, 1)); ctx.save(); ctx.translate(900, 640); ctx.scale(Math.max(.01, ck), Math.max(.01, ck)); wallClock(ctx, 0, 0, 120, 9, 0, t, {}); ctx.restore(); },
      front: (c2, c, sts) => {
        const dx = K.deskX, top = K.top;
        // desk + lamp + paper piles + laptop
        rr(ctx, dx - 330, top, 700, 34, 8); ctx.fillStyle = "#6B4A33"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 310, top + 34, 660, GY - top - 34, 6); ctx.fillStyle = "#57392A"; ctx.fill(); ol(ctx, 6);
        for (let p = 0; p < 2; p++) for (let i = 0; i < 9; i++){ rr(ctx, dx + 230 + p * 90 - 40 + Math.sin(i * 1.7) * 6, top - 12 - i * 14, 80, 14, 3); ctx.fillStyle = i % 3 ? PAPER : "#F3D9B5"; ctx.fill(); ol(ctx, 3); }
        ctx.save(); ctx.translate(dx + 110, top); rr(ctx, -90, -12, 180, 14, 4); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-80, -12); ctx.lineTo(-56, -100); ctx.lineTo(64, -100); ctx.lineTo(80, -12); ctx.closePath(); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5); ctx.restore();
        ctx.save(); ctx.translate(dx - 230, top); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -150); ctx.lineTo(50, -230); ctx.stroke(); ctx.beginPath(); ctx.moveTo(20, -250); ctx.lineTo(100, -200); ctx.lineTo(60, -170); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore();
        // darkness with holes: lamp pool + flashlight cone
        const g = sts[1], hp = g ? handOf(g) : [2000, 1000], st0 = sts[0], h0 = st0 ? toonHead(st0) : [dx, 1100];
        const beam = t < tBeam ? 0 : clamp((t - tBeam) / .3, 0, 1), tx = h0[0] + Math.sin(t * 2.4) * 30 * (1 - beam * .7), ty = h0[1] + 60;
        ctx.save(); ctx.beginPath(); ctx.rect(-2600, -1200, 6400, 4000);
        ctx.moveTo(dx - 180 + 260, top - 120); ctx.ellipse(dx - 180, top - 60, 260, 230, 0, 0, TAU, true);
        if (beam > 0 && g){ ctx.moveTo(hp[0] - 40, hp[1]); ctx.lineTo(tx + 200 * beam, ty + 220); ctx.lineTo(tx - 200 * beam, ty - 220); ctx.closePath(); }
        ctx.fillStyle = hexA("#050816", .55); ctx.fill("evenodd"); ctx.restore();
        glowAt(ctx, dx - 180, top - 140, 280, "#FFE9A8", .35);
        if (beam > 0 && g){ ctx.save(); ctx.globalAlpha = .28 * beam; ctx.fillStyle = "#FFF6B0"; ctx.beginPath(); ctx.moveTo(hp[0] - 40, hp[1]); ctx.lineTo(tx + 200 * beam, ty + 220); ctx.lineTo(tx - 200 * beam, ty - 220); ctx.closePath(); ctx.fill(); ctx.restore(); glowAt(ctx, tx, ty, 220, "#FFF6B0", .35 * beam); }
        for (let i = 0; i < 10; i++){ const q = (t * .15 + rnd(i)) % 1; ctx.fillStyle = hexA("#FFE9A8", .5 * Math.sin(q * Math.PI)); ctx.beginPath(); ctx.arc(dx - 300 + rnd(i + 2) * 300, top - 40 - q * 300, 4, 0, TAU); ctx.fill(); }
      },
      over: () => {
        if (t > tClock) popChip(ctx, "21.00", 860, 300, t - tClock, NAVY, GOLD, 54, .05);
        if (t > tFive){ const k = t - tFive; for (let i = 0; i < 5; i++){ const q = eBack(clamp((k - i * .18) / .3, 0, 1)); if (q <= 0) continue; ctx.save(); ctx.translate(250 + i * 145, 470); ctx.scale(q, q); moon(ctx, 0, 0, 44, i === 4 ? ORANGE : GOLD); ctx.restore(); }
          popChip(ctx, "MALAM KE-5 MINGGU INI", 540, 590, k - .9, RED, "#FFFFFF", 44); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.satpam || {}; if (K.clockCue) add(cueT(s, K.clockCue, .2, i), "ping"); if (K.beamCue) add(cueT(s, K.beamCue, .3, i), "whoosh"); if (K.fiveCue) for (let k = 0; k < 5; k++) add(cueT(s, K.fiveCue, .4, i) + k * .18, "pop"); });

  /* ---------- SP49: _dasbor ---------- */
  function engineIcon(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-60, -20); ctx.lineTo(-40, -20); ctx.lineTo(-40, -40); ctx.lineTo(10, -40); ctx.lineTo(25, -25); ctx.lineTo(45, -25); ctx.lineTo(45, -40); ctx.lineTo(62, -40); ctx.lineTo(62, 30); ctx.lineTo(45, 30); ctx.lineTo(45, 15); ctx.lineTo(25, 15); ctx.lineTo(10, 40); ctx.lineTo(-40, 40); ctx.lineTo(-40, 20); ctx.lineTo(-60, 20); ctx.closePath(); ctx.fill();
    ctx.fillRect(-20, -56, 30, 14); ctx.fillRect(-78, -22, 16, 44); ctx.restore(); }
  function dashboard(ctx, t, tWarn, tCheck){ // world coords; covers the frame around cam (540, 960)
    ctx.save(); ctx.translate(0, -190);
    ctx.fillStyle = "#0E1630"; ctx.fillRect(-800, -400, 2700, 1100);
    for (let i = 0; i < 40; i++){ ctx.fillStyle = hexA("#FFFFFF", .5 + .5 * Math.sin(t * 2 + i)); ctx.fillRect(-600 + rnd(i) * 2300, -300 + rnd(i + 7) * 500, 3, 3); }
    ctx.fillStyle = "#2C2F3A"; ctx.beginPath(); ctx.moveTo(-800, 900); ctx.lineTo(420, 500); ctx.lineTo(660, 500); ctx.lineTo(1900, 900); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; for (let k = 0; k < 6; k++){ const q = ((t * 1.3) + k / 6) % 1, y0 = 500 + q * q * 400, y1 = 500 + Math.min(1, q + .07) ** 2 * 400; ctx.beginPath(); ctx.moveTo(540, y0); ctx.lineTo(540, y1); ctx.lineWidth = 4 + q * 16; ctx.stroke(); }
    // dashboard body
    ctx.fillStyle = "#1E1A22"; ctx.beginPath(); ctx.moveTo(-800, 860); ctx.quadraticCurveTo(540, 700, 1900, 860); ctx.lineTo(1900, 2400); ctx.lineTo(-800, 2400); ctx.closePath(); ctx.fill(); ol(ctx, 8);
    rr(ctx, 40, 860, 1000, 520, 60); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 8);
    // gauges
    [[260, "km/j", .45 + Math.sin(t * 1.7) * .08], [820, "BENSIN", .3]].forEach(([gx, lab, v]) => { ctx.beginPath(); ctx.arc(gx, 1110, 170, 0, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 7);
      for (let k = 0; k <= 10; k++){ const a = Math.PI * .75 + k / 10 * Math.PI * 1.5; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * 140, 1110 + Math.sin(a) * 140); ctx.lineTo(gx + Math.cos(a) * 158, 1110 + Math.sin(a) * 158); ctx.stroke(); }
      const a = Math.PI * .75 + v * Math.PI * 1.5; ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gx, 1110); ctx.lineTo(gx + Math.cos(a) * 130, 1110 + Math.sin(a) * 130); ctx.stroke(); ctx.beginPath(); ctx.arc(gx, 1110, 14, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      textC(ctx, lab, gx, 1210, 30, hexA("#FFFFFF", .8), 800); });
    // warning lamp
    const on = t > tWarn ? (Math.sin((t - tWarn) * 9) > -.2 ? 1 : .25) : .12, col = on > .5 ? "#FFB020" : "#5A4A2A";
    if (on > .5) glowAt(ctx, 540, 1080, 260, "#FFB020", .55);
    ctx.beginPath(); ctx.arc(540, 1080, 92, 0, TAU); ctx.fillStyle = "#0B0B10"; ctx.fill(); ol(ctx, 6); engineIcon(ctx, 540, 1080, 1, col);
    if (t > tWarn){ const q = eBack(clamp((t - tWarn) / .35, 0, 1)); ctx.save(); ctx.translate(540, 1240); ctx.scale(q, q); rr(ctx, -200, -36, 400, 72, 14); ctx.fillStyle = "#FFB020"; ctx.fill(); ol(ctx, 5); textC(ctx, "LEMBUR TIAP HARI", 0, 13, 36, OUT, 900, 370); ctx.restore(); }
    // steering wheel
    ctx.save(); ctx.translate(540, 1620); ctx.rotate(Math.sin(t * 1.2) * .06); ctx.beginPath(); ctx.arc(0, 0, 420, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = OUT; ctx.lineWidth = 70; ctx.stroke(); ctx.strokeStyle = "#3A3440"; ctx.lineWidth = 56; ctx.stroke(); ctx.restore();
    ctx.restore();
  }
  TT.scene(PX + "dasbor", "Cerita: kantor pagi, atasan bangga memberi piala lembur; potong ke dasbor mobil malam, lampu peringatan mesin LEMBUR TIAP HARI berkedip, cap CEK", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.dasbor || {});
    const tWarn = T(s, K.warnCue, .5, idx), tCheck = T(s, K.checkCue, .8, idx);
    base(ctx, s, t, { env: "office", envOpt: {},
      back: (c2, c, sts, R) => { if (R.f.dash) dashboard(ctx, t, tWarn, tCheck); },
      over: (c2, c, sts, R) => { if (R.f.dash && t > tCheck) stampBox(ctx, "CEK!", 540, 380, t - tCheck, RED, 110, -.1); if (R.f.dash && t > tCheck && t < tCheck + .9) burstFx(ctx, 540, 380, t - tCheck, RED, 12, 240); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.dasbor || {}; if (K.warnCue) { const a = cueT(s, K.warnCue, .5, i); for (let k = 0; k < 4; k++) add(a + k * .7, "ping"); } if (K.checkCue) add(cueT(s, K.checkCue, .8, i), "pop"); });

  /* ---------- SP49: airport (_antre, _spanduk) ---------- */
  function plane(ctx, x, y, s, ang, label, col, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(ang || 0); ctx.scale(s * (o.flip ? -1 : 1), s);
    ctx.beginPath(); ctx.moveTo(-70, -6); ctx.lineTo(-110, -60); ctx.lineTo(-86, -60); ctx.lineTo(-40, -14); ctx.closePath(); ctx.fillStyle = col || "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -120, -26, 240, 52, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(100, -14); ctx.quadraticCurveTo(138, 0, 100, 14); ctx.fill();
    ctx.fillStyle = col || "#5B7DB1"; ctx.fillRect(-110, 2, 220, 10); for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.arc(-60 + k * 26, -8, 6, 0, TAU); ctx.fillStyle = "#9CC8FF"; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-20, 6); ctx.lineTo(30, 6); ctx.lineTo(-10, 62); ctx.lineTo(-40, 62); ctx.closePath(); ctx.fillStyle = col || "#5B7DB1"; ctx.fill(); ol(ctx, 5);
    if (o.wheels){ ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-50, 34, 9, 0, TAU); ctx.arc(60, 34, 9, 0, TAU); ctx.fill(); }
    ctx.restore();
    if (label){ ctx.save(); ctx.translate(x, y - 64 * s); const sz = 30 * Math.max(.8, s); fit(ctx, label, 240, sz, 900); const w = ctx.measureText(label).width + 30; rr(ctx, -w / 2, -24, w, 44, 10); ctx.fillStyle = col || NAVY; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(label, 0, 10); ctx.textAlign = "left"; ctx.restore(); } }
  BG.bandara = (ctx, t, o) => {
    // tower
    ctx.save(); ctx.translate(o.towerX ?? -60, 0); rr(ctx, -50, 900, 100, 600, 6); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(-120, 900); ctx.lineTo(120, 900); ctx.lineTo(90, 760); ctx.lineTo(-90, 760); ctx.closePath(); ctx.fillStyle = "#9CC8FF"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -130, 740, 260, 30, 8); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); ctx.fillStyle = Math.sin(t * 6) > 0 ? RED : "#7A2A2A"; ctx.beginPath(); ctx.arc(0, 720, 14, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore();
    // terminal
    rr(ctx, 1150, 1200, 900, 300, 12); ctx.fillStyle = "#D8D2C8"; ctx.fill(); ol(ctx, 6); for (let i = 0; i < 8; i++){ rr(ctx, 1180 + i * 105, 1250, 80, 90, 6); ctx.fillStyle = "#9CC8FF"; ctx.fill(); ol(ctx, 3); }
    // runway
    ctx.fillStyle = "#7FA563"; ctx.fillRect(-2600, 1500, 6400, 1200); ctx.fillStyle = "#4A4A55"; ctx.fillRect(-2600, 1540, 6400, 110); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-2600, 1540, 6400, 110);
    ctx.fillStyle = "#FFFFFF"; for (let x = -2600; x < 3800; x += 160) ctx.fillRect(x, 1590, 90, 10);
    for (let x = -2600; x < 3800; x += 120){ ctx.fillStyle = (o.lights && Math.sin(t * 8 - x * .01) > .3) ? GOLD : "#B9B9C2"; ctx.beginPath(); ctx.arc(x, 1536, 6, 0, TAU); ctx.fill(); }
    (o.marks || []).forEach((m, k) => { const x = m[0]; rr(ctx, x - 42, 1440, 84, 46, 8); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 4); textC(ctx, m[1], x, 1474, 28, OUT, 900); ctx.fillStyle = OUT; ctx.fillRect(x - 3, 1486, 6, 54); });
  };
  ITEMS.wands = (ctx, t, o) => { ctx.rotate(Math.sin(t * (o.fast ? 16 : 4)) * (o.fast ? .8 : .3) - .3); rr(ctx, -10, -120, 20, 120, 8); ctx.fillStyle = "#FF7A1A"; ctx.fill(); ol(ctx, 4); glowAt(ctx, 0, -80, 60, "#FF9A3A", .4); rr(ctx, -12, -6, 24, 30, 6); ctx.fillStyle = OUT; ctx.fill(); };
  TT.scene(PX + "antre", "Cerita: bandara, meja RAPAT menghalangi landasan pagi, jam 16.00 pesawat-pesawat tugas berputar antre di atas menara", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.antre || {});
    const tMeet = T(s, K.meetCue, .3, idx), tFour = T(s, K.fourCue, .4, idx), tLand = T(s, K.landCue, .6, idx);
    const labels = K.planes || ["LAPORAN", "REVISI", "DATA", "SURAT", "SLIDE"];
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true }, envFront: false,
      spots: { sky: [560, 860, .95] },
      back: () => { BG.bandara(ctx, t, { marks: [[260, "08"], [460, "10"], [660, "12"], [860, "14"], [1060, "16"]] });
        if (t > tMeet){ const q = eBack(clamp((t - tMeet) / .5, 0, 1)); ctx.save(); ctx.translate(lerp(-500, 460, q), 1560); rr(ctx, -230, -90, 460, 40, 10); ctx.fillStyle = "#8A5A3B"; ctx.fill(); ol(ctx, 6);
          [-1, 1].forEach(d => { rr(ctx, d * 190 - 12, -50, 24, 70, 5); ctx.fill(); ol(ctx, 4); }); for (let i = 0; i < 4; i++){ ctx.fillStyle = PAPER; rr(ctx, -170 + i * 90, -108, 70, 18, 4); ctx.fill(); ol(ctx, 3); }
          rr(ctx, -110, -190, 220, 70, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "RAPAT", 0, -142, 40, "#FFFFFF", 900); ctx.restore(); }
        if (t > tFour){ labels.forEach((lb, i) => { const k = t - tFour - i * .25; if (k < 0) return; const R0 = 300 + i * 34, spd = t > tLand ? 1.1 : .7, a = k * spd + i * TAU / labels.length, cx = 600, cy = 640 + (t > tLand ? Math.min(1, (t - tLand) * .6) * 120 : 0);
          const x = cx + Math.cos(a) * R0 * 1.15, y = cy + Math.sin(a) * R0 * .42, ent = clamp(k / .6, 0, 1); plane(ctx, lerp(1800, x, eOut(ent)), lerp(300, y, eOut(ent)), .78, Math.sin(a) > 0 ? .08 : -.08, lb, [ORANGE, "#5B7DB1", GREEN, "#8E5BB5", RED][i % 5], t); }); }
      },
      over: () => {
        if (t > tFour) popChip(ctx, "16.00", 820, 300, t - tFour, NAVY, GOLD, 60, .06);
        if (t > tMeet && t < tFour) popChip(ctx, "08.00 – 12.00", 300, 300, t - tMeet, RED, "#FFFFFF", 46, -.05);
        if (t > tLand) popWord(ctx, "ANTRE!", 540, 470, t - tLand, { size: 104, hold: 1.6, rot: -7 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.antre || {}; if (K.meetCue) add(cueT(s, K.meetCue, .3, i), "whoosh"); if (K.fourCue){ const a = cueT(s, K.fourCue, .4, i); for (let k = 0; k < 5; k++) add(a + k * .25, "whoosh"); } if (K.landCue) add(cueT(s, K.landCue, .6, i), "pop"); });

  BG.depan = (ctx, t, o) => { // office front at dusk
    rr(ctx, -300, 560, 1700, 1100, 0); ctx.fillStyle = "#C9B79C"; ctx.fill(); ol(ctx, 8);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++){ rr(ctx, -240 + c * 210, 620 + r * 190, 150, 130, 8); ctx.fillStyle = (r + c) % 3 ? "#F6D58A" : "#7FA2C9"; ctx.fill(); ol(ctx, 4); }
    rr(ctx, 380, 1220, 320, 420, 10); ctx.fillStyle = "#9CC8FF"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = OUT; ctx.fillRect(536, 1220, 8, 420);
    rr(ctx, 360, 1150, 360, 60, 10); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); textC(ctx, "KANTOR", 540, 1193, 38, "#FFFFFF", 900);
    wallClock(ctx, 860, 1090, 70, 5, 0, t, {});
    ctx.fillStyle = "#8C969C"; ctx.fillRect(-2600, 1640, 6400, 1000);
  };
  TT.scene(PX + "spanduk", "Cerita: bandara, pesawat penarik spanduk membawa tiga aturan rencana, pesawat tugas mendarat satu per satu; potong ke depan kantor pukul 17.00", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.spanduk || {});
    const rules = (K.rules || []).map((r, j) => Object.assign({ T: T(s, r.cue, .3 + j * .1, idx) }, r));
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true }, envFront: false,
      back: (c2, c, sts, R) => { if (R.f.depan) { BG.depan(ctx, t, {}); return; }
        BG.bandara(ctx, t, { lights: true, marks: [[260, "SEN"], [460, "SEL"], [660, "RAB"], [860, "KAM"], [1060, "JUM"]] });
        // task planes landing one after another
        for (let i = 0; i < 5; i++){ const T0 = rules.length ? rules[0].T + .8 + i * 1.4 : 1e9, k = t - T0; if (k < 0 || k > 2.4) continue; const q = clamp(k / 1.6, 0, 1), x = lerp(1500, 260 + i * 200, eOut(q)), y = lerp(1250, 1505, eOut(q));
          plane(ctx, x, y, .6, q < 1 ? -.12 * (1 - q) : 0, null, ["#5B7DB1", GREEN, ORANGE, "#8E5BB5", RED][i], t, { wheels: true }); if (q >= 1 && k < 2.1) burstFx(ctx, x, 1530, (k - 1.6) * 1.6, CREAM, 8, 90); }
      },
      over: (c2, c, sts, R) => { if (R.f.depan){ if (R.f.depan.cue && t > T(s, R.f.depan.cue, .5, idx)) popChip(ctx, "17.00  PULANG", 540, 300, t - T(s, R.f.depan.cue, .5, idx), GREEN, "#FFFFFF", 56, -.04); return; }
        rules.forEach((r, j) => { const k = t - r.T; if (k < 0) return; const q = eOut(clamp(k / 1.1, 0, 1)), y = 280 + j * 150 + Math.sin(t * 2 + j) * 8, x = lerp(1400, 170, q) + Math.sin(t * 1.3 + j) * 10;
          ctx.save(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 70, y); ctx.stroke();
          fit(ctx, r.text, 600, 46, 900); const w = Math.min(680, ctx.measureText(r.text).width + 70); ctx.beginPath(); ctx.moveTo(x + 70, y - 46);
          for (let i = 0; i <= 10; i++) ctx.lineTo(x + 70 + w * i / 10, y - 46 + Math.sin(t * 6 + i * .8) * 6); for (let i = 10; i >= 0; i--) ctx.lineTo(x + 70 + w * i / 10, y + 46 + Math.sin(t * 6 + i * .8) * 6); ctx.closePath();
          ctx.fillStyle = [CREAM, GOLD, "#9BE0B0"][j]; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.textAlign = "center"; ctx.fillText(r.text, x + 70 + w / 2, y + 16); ctx.textAlign = "left"; ctx.restore();
          plane(ctx, x - 80, y, .55, 0, null, [ORANGE, "#5B7DB1", GREEN][j], t, { flip: true }); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.spanduk || {}; (K.rules || []).forEach((r, j) => add(cueT(s, r.cue, .3 + j * .1, i), "whoosh")); });

  /* ================= RN49 shared ================= */
  ITEMS.oilcan = (ctx, t, o) => { ctx.rotate(-.5 + Math.sin(t * 3) * .05); rr(ctx, -40, -50, 80, 70, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(30, -40); ctx.lineTo(120, -86); ctx.lineTo(126, -76); ctx.lineTo(36, -24); ctx.closePath(); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(-40, -16, 22, Math.PI * .5, Math.PI * 1.5); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); const q = (t * 1.6) % 1; ctx.fillStyle = "#D9A441"; ctx.beginPath(); ctx.ellipse(124, -70 + q * 90, 7, 10, 0, 0, TAU); ctx.fill(); };
  ITEMS.broom = (ctx, t, o) => { ctx.rotate(.5 + Math.sin(t * 5) * .35); rr(ctx, -7, -200, 14, 230, 6); ctx.fillStyle = "#A9744A"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-14, 26); ctx.lineTo(14, 26); ctx.lineTo(50, 120); ctx.lineTo(-50, 120); ctx.closePath(); ctx.fillStyle = "#E3C27A"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 3; for (let k = -3; k <= 3; k++){ ctx.beginPath(); ctx.moveTo(k * 4, 30); ctx.lineTo(k * 14, 116); ctx.stroke(); } };
  ITEMS.cake = (ctx, t, o) => { rr(ctx, -110, -24, 220, 20, 8); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 4; i++){ ctx.save(); ctx.translate(-75 + i * 50, -24); rr(ctx, -20, -36, 40, 36, 6); ctx.fillStyle = i % 2 ? "#F2C1CF" : "#E8A55B"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-20, -36, 40, 8); ctx.restore(); } };
  BG.pintu = (ctx, t, o) => { // office corridor wall + wooden door; o.open = 0..1
    ctx.fillStyle = "#E7DCC8"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#D2C3AA"; ctx.fillRect(-2600, 1380, 6400, 260); ctx.fillStyle = "#B99F7E"; ctx.fillRect(-2600, 1370, 6400, 14);
    [[-200, "#9CC8FF"], [1260, "#9CC8FF"]].forEach(([x, c]) => { rr(ctx, x - 150, 620, 300, 380, 12); ctx.fillStyle = c; ctx.fill(); ol(ctx, 7); ctx.fillStyle = OUT; ctx.fillRect(x - 4, 620, 8, 380); ctx.fillRect(x - 150, 806, 300, 8); });
    rr(ctx, 860, 640, 200, 150, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 6); textC(ctx, "RUANG", 960, 702, 30, OUT, 900); textC(ctx, "KERJA", 960, 744, 30, ORANGE, 900);
    const dx = o.x ?? 540, w = 340, top = 900, op = o.open || 0;
    rr(ctx, dx - w / 2 - 24, top - 24, w + 48, GY - top + 24, 8); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#2B1A12"; ctx.fillRect(dx - w / 2, top, w, GY - top);
    const ww = w * Math.max(.08, Math.cos(op * 1.25)); rr(ctx, dx - w / 2, top, ww, GY - top, 4); ctx.fillStyle = "#B87A4B"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.beginPath(); ctx.rect(dx - w / 2, top, ww, GY - top); ctx.clip(); ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 5; for (let k = 0; k < 2; k++){ rr(ctx, dx - w / 2 + ww * .15, top + 60 + k * 340, ww * .7, 280, 8); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.arc(dx - w / 2 + ww * .86, top + 400, 16, 0, TAU); ctx.fillStyle = o.shiny ? "#FFE08A" : GOLD; ctx.fill(); ol(ctx, 4); if (o.shiny) sparkle(ctx, dx - w / 2 + ww * .86 + 14, top + 386, 14 + Math.sin(t * 8) * 4, "#FFFFFF");
    [top + 80, GY - 120].forEach(y => { rr(ctx, dx - w / 2 - 14, y - 26, 26, 52, 5); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4); });
    ctx.fillStyle = "#C9B79C"; ctx.fillRect(-2600, GY, 6400, 1200);
  };
  function doorOpen(t, times){ let v = 0; times.forEach(T0 => { const k = t - T0; if (k > 0 && k < 1.6) v = Math.max(v, Math.sin(clamp(k / 1.6, 0, 1) * Math.PI)); }); return v; }
  /* ---------- RN49: _derit ---------- */
  TT.scene(PX + "derit", "Cerita: pintu ruang kerja berbunyi NGIIIK tiap dibuka, office boy meminyaki engsel, rekan lewat sambil menatap ponsel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 560 }, f.derit || {});
    const sq = (K.squeak || []).map(c => T(s, c, .3, idx)), qu = (K.quiet || []).map(c => T(s, c, .5, idx)), tFix = T(s, K.fixCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false }, envFront: false,
      spots: { hinge: [K.x - 170, 1000, 1.25] },
      back: () => { BG.pintu(ctx, t, { x: K.x, open: doorOpen(t, sq.concat(qu)) }); },
      front: () => { if (t > tFix && t < tFix + 2.5) for (let i = 0; i < 3; i++){ const q = ((t - tFix) * 1.2 + i / 3) % 1; ctx.fillStyle = hexA("#D9A441", 1 - q); ctx.beginPath(); ctx.ellipse(K.x - 184, 990 + q * 120, 8, 12, 0, 0, TAU); ctx.fill(); } },
      over: (c2, c) => { sq.forEach((T0, j) => { if (t > T0 && t < T0 + 1.5){ const p = c.toScreen(K.x - 170, 760); popWord(ctx, "NGIIIK!", clamp(p[0] + 60, 260, 820), clamp(p[1], 300, 620), t - T0, { size: 104, hold: 1.4, rot: j % 2 ? 8 : -8, col: RED }); } });
        if (t > tFix && t < tFix + 1.4){ const p = c.toScreen(K.x - 180, 900); popChip(ctx, "ENGSEL DIMINYAKI", clamp(p[0] + 120, 300, 780), 330, t - tFix, NAVY, "#FFFFFF", 40); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.derit || {}; (K.squeak || []).forEach(c => add(cueT(s, c, .3, i), "ping")); if (K.fixCue) add(cueT(s, K.fixCue, .5, i), "chime"); });

  /* ---------- RN49: _kunang (night tower lights up with fireflies) ---------- */
  function firefly(ctx, x, y, t, i, a){ if (a <= 0) return; glowAt(ctx, x, y, 46, "#FFE27A", .55 * a); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#FFF6B0"; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
    ctx.fillStyle = hexA("#FFFFFF", .6); const fl = Math.sin(t * 30 + i) * 4; ctx.beginPath(); ctx.ellipse(x - 8, y - 8, 9, 4 + fl * .5, -.6, 0, TAU); ctx.ellipse(x + 8, y - 8, 9, 4 - fl * .5, .6, 0, TAU); ctx.fill(); ctx.restore(); }
  TT.scene(PX + "kunang", "Cerita: gedung kantor malam, tiap ucapan terima kasih melepas kunang-kunang, jendela gelap menyala hangat satu per satu", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ cols: 5, rows: 6 }, f.kunang || {});
    const tA = T(s, K.startCue, .1, idx), tB = T(s, K.warmCue, .8, idx), chips = (K.chips || []).map((c, j) => Object.assign({ T: T(s, c.cue, .2 + j * .2, idx) }, c));
    const N = K.cols * K.rows, warm = t < tA ? 0 : clamp((t - tA) / Math.max(1, tB - tA), 0, 1), lit = Math.floor(warm * N + .001);
    const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => rnd(a + 3) - rnd(b + 3));
    const win = i => { const r = Math.floor(i / K.cols), c = i % K.cols; return [300 + c * 120, 470 + r * 150]; };
    base(ctx, s, t, { env: "night", envOpt: {}, envFront: false,
      back: () => {
        ctx.fillStyle = hexA("#F08C2E", .35 * warm); ctx.fillRect(-2600, -1200, 6400, 3000);
        rr(ctx, 220, 360, 640, 1080, 10); ctx.fillStyle = "#2A3150"; ctx.fill(); ol(ctx, 8); rr(ctx, 200, 330, 680, 50, 8); ctx.fillStyle = "#1E2440"; ctx.fill(); ol(ctx, 6);
        textC(ctx, "KANTOR", 540, 368, 30, hexA("#FFFFFF", .7), 900);
        for (let i = 0; i < N; i++){ const [x, y] = win(i), on = order.indexOf(i) < lit, k = on ? clamp((t - tA - order.indexOf(i) / N * (tB - tA)) / .4, 0, 1) : 0;
          rr(ctx, x - 44, y - 50, 88, 100, 6); ctx.fillStyle = on ? (k < 1 ? "#FFF6B0" : "#F6C343") : "#141A30"; ctx.fill(); ol(ctx, 4); if (on) glowAt(ctx, x, y, 90, "#FFB84A", .35 * k); }
        rr(ctx, 470, 1300, 140, 140, 6); ctx.fillStyle = warm > .5 ? "#F6C343" : "#141A30"; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#1E1A22"; ctx.fillRect(-2600, 1440, 6400, 1000);
      },
      front: (c2, c, sts) => { const st = sts[0], h = st ? toonHead(st) : [250, 1100];
        for (let i = 0; i < lit + 3; i++){ const T0 = tA + (i / N) * (tB - tA) - .9, k = t - T0; const target = win(order[Math.min(i, N - 1)]);
          const x0 = h[0] + 40, y0 = h[1] + 40, q = clamp(k / .9, 0, 1), x = lerp(x0, target[0], eOut(q)) + Math.sin(t * 3 + i) * 30 * (1 - q), y = lerp(y0, target[1], q) - Math.sin(q * Math.PI) * 120;
          if (k > 0) firefly(ctx, k < .9 ? x : target[0] + Math.sin(t * 2 + i) * 50, k < .9 ? y : target[1] + Math.cos(t * 1.7 + i) * 50, t, i, clamp(k * 3, 0, 1)); } },
      over: () => { chips.forEach((cp, j) => { if (t > cp.T) popChip(ctx, cp.text, cp.x ?? 540, cp.y ?? 260, t - cp.T, cp.bg || ORANGE, cp.fg || "#FFFFFF", cp.size || 46, cp.rot ?? -.04); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kunang || {}; (K.chips || []).forEach((c, j) => add(cueT(s, c.cue, .2 + j * .2, i), "chime")); });

  /* ---------- RN49: _estafet (glowing thank-you orb passed between desks) ---------- */
  TT.scene(PX + "estafet", "Cerita: kantor, bola cahaya terima kasih dioper dari meja ke meja (berkas cetak, nampan kue), hati muncul, ruangan menghangat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.estafet || {});
    const passes = (K.passes || []).map((p, j) => Object.assign({ T: T(s, p.cue, .2 + j * .15, idx) }, p));
    const warm = passes.length ? clamp((t - passes[0].T) / 6, 0, 1) : 0;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plantX: 1300 },
      back: () => { ctx.fillStyle = hexA("#FFB84A", .22 * warm); ctx.fillRect(-2600, -1200, 6400, 3000);
        [[170, 0], [540, 1], [910, 2]].forEach(([x, k]) => { rr(ctx, x - 150, 1420, 300, 26, 6); ctx.fillStyle = "#C9A27A"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 140, 1446, 280, 194, 6); ctx.fillStyle = "#A98463"; ctx.fill(); ol(ctx, 5); }); },
      front: (c2, c, sts) => { passes.forEach((p, j) => { const a = sts[p.from], b = sts[p.to]; if (!a || !b) return; const k = t - p.T; if (k < 0 || k > 2.2) return;
          const ha = handOf(a), hb = toonHead(b), q = clamp(k / .8, 0, 1), x = lerp(ha[0], hb[0], eOut(q)), y = lerp(ha[1] - 40, hb[1] + 30, eOut(q)) - Math.sin(q * Math.PI) * 260;
          for (let i = 1; i < 8; i++){ const qq = clamp(q - i * .04, 0, 1); firefly(ctx, lerp(ha[0], hb[0], eOut(qq)), lerp(ha[1] - 40, hb[1] + 30, eOut(qq)) - Math.sin(qq * Math.PI) * 260, t, i, (1 - i / 8) * .5 * (q < 1 ? 1 : 0)); }
          if (q < 1){ glowAt(ctx, x, y, 120, "#FFD35A", .7); ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fillStyle = "#FFF6B0"; ctx.fill(); ol(ctx, 4); }
          else { const kk = k - .8; glowAt(ctx, hb[0], hb[1], 260 * Math.min(1, kk * 2), "#FFD35A", .5 * (1 - kk / 1.4)); burstFx(ctx, hb[0], hb[1] - 40, kk, GOLD, 10, 180); } }); },
      over: (c2, c) => { passes.forEach((p, j) => { const k = t - p.T - .8; if (k < 0 || !p.text) return; popChip(ctx, p.text, p.x ?? 540, p.y ?? 300, k, p.bg || ORANGE, "#FFFFFF", 42, (j % 2 ? .05 : -.05)); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.estafet || {}; (K.passes || []).forEach((p, j) => { const a = cueT(s, p.cue, .2 + j * .15, i); add(a, "whoosh"); add(a + .8, "chime"); }); });

  /* ================= KD49 shared: water-carton warehouse ================= */
  function carton(ctx, x, y, w, h, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = o.col || "#D9A86A"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fillRect(-w / 2 + 4, -h + 4, w - 8, h * .16); ctx.fillStyle = "#5BA9E0"; ctx.beginPath(); ctx.moveTo(0, -h * .72); ctx.quadraticCurveTo(h * .2, -h * .42, 0, -h * .3); ctx.quadraticCurveTo(-h * .2, -h * .42, 0, -h * .72); ctx.fill(); ol(ctx, 3);
    if (o.label) textC(ctx, o.label, 0, -h * .08, h * .17, OUT, 900, w * .9); ctx.restore(); }
  BG.gudang = (ctx, t, o) => {
    ctx.fillStyle = "#CFC6B8"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#BDB3A3"; for (let x = -2600; x < 3800; x += 120) ctx.fillRect(x, -1200, 8, GY + 1200);
    ctx.fillStyle = "#3B4A6B"; ctx.fillRect(-2600, 380, 6400, 40);
    (o.shelves || [[-120, 0], [1220, 1]]).forEach(([sx, k]) => { for (let r = 0; r < 4; r++){ const y = 760 + r * 220; ctx.fillStyle = "#E8731C"; ctx.fillRect(sx - 260, y, 520, 18); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(sx - 260, y, 520, 18);
        for (let i = 0; i < 4; i++) carton(ctx, sx - 190 + i * 126, y, 112, 150, { col: (i + r + k) % 3 ? "#D9A86A" : "#C99858" }); }
      [-1, 1].forEach(d => { rr(ctx, sx + d * 262 - 12, 560, 24, GY - 560, 4); ctx.fillStyle = "#3B6FB5"; ctx.fill(); ol(ctx, 4); }); });
    ctx.fillStyle = "#9C9488"; ctx.fillRect(-2600, GY - 60, 6400, 1000); ctx.fillStyle = "#F6C343"; for (let x = -2600; x < 3800; x += 160) ctx.fillRect(x, GY - 40, 90, 14);
  };
  /* ---------- KD49: _asap ---------- */
  TT.scene(PX + "asap", "Cerita: gudang air kemasan, kata-kata definisi dari map tebal mengorbit kepala, hitungan baca 3x, kepala berasap", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.asap || {});
    const tTerm = T(s, K.termCue, .3, idx), tRead = T(s, K.readCue, .5, idx), tThree = T(s, K.countCue, .6, idx), tSmoke = T(s, K.smokeCue, .8, idx);
    const words = K.words || ["LEAD TIME", "STOK PENGAMAN", "PERMINTAAN RATA-RATA", "ROP = d × L", "SIKLUS"];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false }, envFront: false,
      back: () => { BG.gudang(ctx, t, {}); },
      front: (c2, c, sts) => { const st = sts[0]; if (!st) return; const h = toonHead(st);
        if (t > tRead){ const n = Math.min(words.length, 1 + Math.floor((t - tRead) / .35)); for (let i = 0; i < n; i++){ const a = (t - tRead) * (1.6 + (t > tThree ? 1.4 : 0)) + i * TAU / words.length, rx = 340, ry = 60;
          const x = h[0] + Math.cos(a) * rx, y = h[1] - 330 + Math.sin(a) * ry, back = Math.sin(a) < 0; ctx.save(); ctx.globalAlpha *= back ? .55 : 1; const sz = back ? 30 : 38; fit(ctx, words[i], 300, sz, 900); const w = ctx.measureText(words[i]).width + 34;
          ctx.translate(x, y); ctx.rotate(Math.sin(a * 2) * .12); rr(ctx, -w / 2, -26, w, 52, 10); ctx.fillStyle = [PAPER, "#BFE2EA", "#F2C1CF", GOLD, "#D8E8C0"][i % 5]; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.textAlign = "center"; ctx.fillText(words[i], 0, 12); ctx.textAlign = "left"; ctx.restore(); } }
        if (t > tSmoke){ const k = clamp((t - tSmoke) / .5, 0, 1); smoke(ctx, h[0] - 40, h[1] - 150, t, k, { n: 8, h: 320, col: "#7C7C86", s: 1.1 }); smoke(ctx, h[0] + 60, h[1] - 150, t + .4, k, { n: 6, h: 260, col: "#9A9AA4", s: .9 }); } },
      over: () => {
        if (t > tTerm) popChip(ctx, K.term || "TITIK PEMESANAN ULANG?", 540, 260, t - tTerm, NAVY, "#FFFFFF", 46, -.03);
        if (t > tThree){ const n = Math.min(3, 1 + Math.floor((t - tThree) / .45)); for (let i = 0; i < n; i++) popChip(ctx, "BACA " + (i + 1) + "x", 250 + i * 290, 370, t - tThree - i * .45, i === 2 ? RED : "#5B7DB1", "#FFFFFF", 40, (i - 1) * .06); }
        if (t > tSmoke) popWord(ctx, "PUSING!", 540, 500, t - tSmoke, { size: 96, hold: 1.6, rot: 6 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.asap || {}; if (K.termCue) add(cueT(s, K.termCue, .3, i), "pop"); if (K.readCue) add(cueT(s, K.readCue, .5, i), "whoosh"); if (K.countCue) for (let k = 0; k < 3; k++) add(cueT(s, K.countCue, .6, i) + k * .45, "pop"); if (K.smokeCue) add(cueT(s, K.smokeCue, .8, i), "whoosh"); });

  /* ---------- KD49: _morf ---------- */
  function truckIcon(ctx, x, y, s, t, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -120, -110, 160, 100, 8); ctx.fillStyle = col || "#F3F0EA"; ctx.fill(); ol(ctx, 5); textC(ctx, "AIR", -40, -50, 30, "#3B6FB5", 900);
    ctx.beginPath(); ctx.moveTo(40, -80); ctx.lineTo(90, -80); ctx.lineTo(118, -45); ctx.lineTo(118, -10); ctx.lineTo(40, -10); ctx.closePath(); ctx.fillStyle = "#3B6FB5"; ctx.fill(); ol(ctx, 5); rr(ctx, 56, -72, 34, 26, 4); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 3);
    [-80, 70].forEach(wx => { ctx.save(); ctx.translate(wx, -6); ctx.rotate(t * 8); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#9AA3A8"; ctx.fillRect(-4, -14, 8, 28); ctx.restore(); }); ctx.restore(); }
  function calPage(ctx, x, y, s, txt){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -80, -90, 160, 170, 12); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); rr(ctx, -80, -90, 160, 46, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, txt, 0, 40, 50, OUT, 900, 140); textC(ctx, "HARI", 0, -56, 24, "#FFFFFF", 900); ctx.restore(); }
  TT.scene(PX + "morf", "Cerita: panel navy, perintah ke AI diketik, bentuk abstrak (kubus, bola, segitiga) berubah jadi dus air, truk, kalender gudang sendiri", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.morf || {});
    const tType = T(s, K.typeCue, .3, idx), tEnd = T(s, K.endCue, .9, idx), tM = (K.morph || ["gudang", "air", "kemasan"]).map((c, j) => T(s, c, .6 + j * .1, idx));
    base(ctx, s, t, { env: "info", envOpt: { spotX: 700 },
      mid: () => { const P3 = [[620, 820], [880, 1040], [640, 1260]];
        P3.forEach(([x, y], j) => { const k = t - tM[j], fl = Math.sin(t * 1.6 + j) * 16; let sx = 1, after = k > .2;
          if (k > 0 && k < .4) sx = Math.abs(Math.cos(k / .4 * Math.PI)); ctx.save(); ctx.translate(x, y + fl); ctx.scale(Math.max(.05, sx) * 1.35, 1.35); ctx.rotate(after ? 0 : Math.sin(t + j) * .2);
          if (!after){ ctx.globalAlpha *= .9; if (j === 0){ ctx.beginPath(); ctx.moveTo(-80, -40); ctx.lineTo(0, -90); ctx.lineTo(80, -40); ctx.lineTo(80, 60); ctx.lineTo(0, 110); ctx.lineTo(-80, 60); ctx.closePath(); ctx.fillStyle = "#8E5BB5"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-80, -40); ctx.lineTo(0, 10); ctx.lineTo(80, -40); ctx.moveTo(0, 10); ctx.lineTo(0, 110); ol(ctx, 4); }
            else if (j === 1){ ctx.beginPath(); ctx.arc(0, 0, 90, 0, TAU); ctx.fillStyle = "#3E9B9B"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(0, 0, 90, 30, 0, 0, TAU); ol(ctx, 3); }
            else { ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(95, 70); ctx.lineTo(-95, 70); ctx.closePath(); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 5); }
            textC(ctx, ["d", "L", "ROP"][j], 0, j === 2 ? 50 : 14, 40, "#FFFFFF", 900); }
          else { if (j === 0){ carton(ctx, -60, 90, 120, 150, {}); carton(ctx, 60, 90, 120, 150, {}); carton(ctx, 0, -60, 120, 150, { label: "DUS" }); } else if (j === 1) truckIcon(ctx, 0, 60, 1.05, t); else calPage(ctx, 0, 0, 1, "3"); }
          ctx.restore(); if (k > .2 && k < 1.1) burstFx(ctx, x, y, k - .2, GOLD, 10, 150); }); },
      over: () => { if (t < tType) return; const full = K.prompt || "Jelaskan istilah itu dengan contoh dari gudang air kemasan tempatku bekerja.", n = Math.floor(full.length * clamp((t - tType) / Math.max(.5, tEnd - tType), 0, 1));
        const q = eBack(clamp((t - tType) / .4, 0, 1)); ctx.save(); ctx.translate(540, 360); ctx.scale(q, q); rr(ctx, -430, -150, 860, 300, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
        rr(ctx, -430, -150, 860, 60, 26); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ctx.fillRect(-430, -110, 860, 20); textL(ctx, "TANYA AI", -390, -108, 30, "#FFFFFF", 900);
        const ws = full.slice(0, n).split(" "); let line = "", L = []; font(ctx, 700, 38, FAM); ws.forEach(w => { const tt = line ? line + " " + w : w; if (ctx.measureText(tt).width > 780){ L.push(line); line = w; } else line = tt; }); L.push(line);
        L.slice(0, 4).forEach((l, i) => textL(ctx, l + (i === L.length - 1 && Math.sin(t * 10) > 0 ? "|" : ""), -390, -30 + i * 50, 38, OUT, 700)); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.morf || {}; if (K.typeCue) add(cueT(s, K.typeCue, .3, i), "pop"); (K.morph || []).forEach((c, j) => add(cueT(s, c, .6 + j * .1, i) + .2, "chime")); });

  /* ---------- KD49: _stok ---------- */
  TT.scene(PX + "stok", "Cerita: gudang, tumpukan dus turun 20 per hari, garis pesan ulang di 60, truk pemasok menempuh 3 hari dan tiba saat stok hampir habis", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 700, dayDur: 1.0 }, f.stok || {});
    const tDay = T(s, K.dayCue, .3, idx), D = K.dayDur, tOrder = tDay + 2 * D, tLine = Math.min(T(s, K.lineCue, .7, idx), tOrder), tTrip = tOrder;
    const days = t < tDay ? 0 : Math.floor((t - tDay) / D) + 1, arrive = tOrder + 3 * D, refill = t > arrive;
    const stock = refill ? 120 : Math.max(0, 120 - 20 * days);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false }, envFront: false,
      spots: { stack: [K.x - 60, 1150, 1.0] },
      back: () => { BG.gudang(ctx, t, { shelves: [[-420, 0], [1500, 1]] });
        // road strip for the supplier truck
        rr(ctx, 120, 640, 1000, 110, 12); ctx.fillStyle = "#5A5A66"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#FFFFFF"; for (let x = 150; x < 1100; x += 90) ctx.fillRect(x, 690, 50, 8);
        ["HARI 3", "HARI 2", "HARI 1"].forEach((lb, k) => { const x = 330 + k * 250; rr(ctx, x - 70, 600, 140, 40, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, lb, x, 630, 24, OUT, 900); });
        rr(ctx, 40, 600, 120, 170, 10); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5); textC(ctx, "GUDANG", 100, 700, 22, "#FFFFFF", 900, 110);
        const tq = t < tTrip ? 0 : clamp((t - tTrip) / (3 * D), 0, 1); if (t > Math.min(tTrip, tOrder) - 1) truckIcon(ctx, lerp(1040, 260, tq), 742, 1.0, t * (tq > 0 && tq < 1 ? 1 : 0), "#F3F0EA");
        if (t > tOrder && t < tOrder + 1.2) burstFx(ctx, 1060, 650, t - tOrder, GOLD, 10, 130); },
      mid: () => { const bw = 170, bh = 110, base0 = GY - 60; const levels = stock / 20;
        for (let L = 0; L < 7; L++) for (let c = 0; c < 2; c++){ const present = L < levels, leaving = !present && L < levels + 1 && days > 0 && !refill;
          const x = K.x - bw / 2 - 4 + c * (bw + 8), y = base0 - L * (bh + 4);
          if (present) carton(ctx, x, y, bw, bh, { label: c === 0 && L === Math.ceil(levels) - 1 ? "" : "" });
          else if (leaving){ const k = ((t - tDay) % D) / D; if (k < .5){ ctx.save(); ctx.globalAlpha *= 1 - k * 2; carton(ctx, x + k * 900, y - Math.sin(k * 2 * Math.PI) * 120, bw, bh, { rot: k * 2 }); ctx.restore(); } } }
        if (t > tLine){ const y = base0 - 3 * (bh + 4) + 2, q = clamp((t - tLine) / .5, 0, 1); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.setLineDash([30, 18]); ctx.beginPath(); ctx.moveTo(K.x - 260, y); ctx.lineTo(K.x - 260 + 520 * q, y); ctx.stroke(); ctx.setLineDash([]);
          if (q >= 1){ rr(ctx, K.x + 200, y - 44, 200, 88, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "PESAN!", K.x + 300, y + 4, 40, "#FFFFFF", 900); textC(ctx, "di 60 dus", K.x + 300, y + 34, 22, CREAM, 800); } ctx.restore(); }
        if (refill && t < arrive + 1) burstFx(ctx, K.x, base0 - 300, t - arrive, GREEN, 14, 260); },
      midZ: -1,
      over: () => { if (t > tOrder && t < tOrder + 1.6) popWord(ctx, "PESAN SEKARANG!", 540, 520, t - tOrder, { size: 78, hold: 1.5, rot: -6, col: RED });
        if (t > tDay){ const q = eBack(clamp((t - tDay) / .4, 0, 1)); ctx.save(); ctx.translate(540, 300); ctx.scale(q, q); rr(ctx, -300, -70, 600, 140, 24); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6);
          textC(ctx, "STOK: " + stock + " DUS", 0, 14, 60, stock <= 60 ? GOLD : "#FFFFFF", 900, 540); textC(ctx, "keluar 20 dus / hari", 0, 54, 24, hexA("#FFFFFF", .8), 800); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.stok || {}; if (K.dayCue){ const a = cueT(s, K.dayCue, .3, i); for (let k = 0; k < 7; k++) add(a + k * (K.dayDur || 1), "whoosh"); } if (K.dayCue) add(cueT(s, K.dayCue, .3, i) + 2 * (K.dayDur || 1), "ping"); if (K.lineCue) add(cueT(s, K.lineCue, .7, i), "pop"); });

  /* ================= JS49 shared: car wash ================= */
  function carSide(ctx, x, y, w, col, t, o){ o = o || {}; const h = w * .36; ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1);
    ctx.beginPath(); ctx.moveTo(-w / 2, -h * .3); ctx.lineTo(-w / 2, -h * .62); ctx.quadraticCurveTo(-w * .46, -h * .72, -w * .3, -h * .74); ctx.lineTo(-w * .18, -h * 1.08); ctx.lineTo(w * .2, -h * 1.08); ctx.lineTo(w * .34, -h * .72); ctx.quadraticCurveTo(w * .5, -h * .68, w / 2, -h * .5); ctx.lineTo(w / 2, -h * .3); ctx.closePath();
    ctx.fillStyle = col || "#D9483B"; ctx.fill(); ol(ctx, Math.max(4, w * .012));
    ctx.beginPath(); ctx.moveTo(-w * .26, -h * .76); ctx.lineTo(-w * .16, -h * 1.0); ctx.lineTo(-w * .02, -h * 1.0); ctx.lineTo(-w * .02, -h * .76); ctx.closePath(); ctx.moveTo(w * .02, -h * .76); ctx.lineTo(w * .02, -h * 1.0); ctx.lineTo(w * .17, -h * 1.0); ctx.lineTo(w * .28, -h * .76); ctx.closePath(); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, Math.max(3, w * .008));
    [-w * .3, w * .3].forEach(wx => { ctx.save(); ctx.translate(wx, -h * .3); ctx.rotate((o.roll || 0)); ctx.beginPath(); ctx.arc(0, 0, h * .3, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, h * .15, 0, TAU); ctx.fillStyle = "#B9B9C2"; ctx.fill(); ctx.fillStyle = OUT; ctx.fillRect(-2, -h * .15, 4, h * .3); ctx.restore(); });
    if (o.foam > 0){ ctx.save(); ctx.globalAlpha *= o.foam; for (let i = 0; i < 18; i++){ const fx = -w * .45 + rnd(i) * w * .9, fy = -h * .4 - rnd(i + 5) * h * .6 + Math.sin(t * 3 + i) * 4; ctx.beginPath(); ctx.arc(fx, fy, w * .045 + rnd(i + 2) * w * .03, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA("#9CC8FF", .8); ctx.lineWidth = 2; ctx.stroke(); } ctx.restore(); }
    if (o.shine) sparkle(ctx, w * .1, -h * .9, 18 + Math.sin(t * 9) * 6, "#FFFFFF");
    ctx.restore(); }
  function hoseReel(ctx, x, y, t){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, 90, 0, TAU); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 6); ctx.save(); ctx.rotate(t * .5); for (let k = 0; k < 4; k++){ ctx.rotate(Math.PI / 2); ctx.fillStyle = "#2F7A45"; ctx.fillRect(-6, 20, 12, 60); } ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, 66, 0, TAU); ctx.strokeStyle = "#F6C343"; ctx.lineWidth = 16; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = "#F6C343"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(60, 30); ctx.bezierCurveTo(120, 200, 40, 300, 110, 420); ctx.stroke(); ctx.restore(); }
  function vacuum(ctx, x, y, t){ ctx.save(); ctx.translate(x, y); rr(ctx, -70, -200, 140, 190, 30); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 6); rr(ctx, -80, -220, 160, 40, 14); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5);
    textC(ctx, "VAKUM", 0, -110, 26, "#FFFFFF", 900); [-45, 45].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -6, 16, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-60, -180); ctx.bezierCurveTo(-200, -260, -220, -60, -160, -10); ctx.stroke(); ctx.strokeStyle = "#7F8E9A"; ctx.lineWidth = 8; ctx.stroke(); ctx.restore(); }
  BG.cuci = (ctx, t, o) => {
    ctx.fillStyle = "#DCEBEF"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.strokeStyle = "#C2D6DC"; ctx.lineWidth = 4; for (let x = -2600; x < 3800; x += 80){ ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, GY); ctx.stroke(); } for (let y = 300; y < GY; y += 80){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
    rr(ctx, 280, 640, 520, 110, 20); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 7); textC(ctx, "CUCI MOBIL", 540, 715, 56, "#FFFFFF", 900);
    for (let i = 0; i < 6; i++){ ctx.fillStyle = i % 2 ? "#5BA9E0" : "#FFFFFF"; ctx.fillRect(-300 + i * 280, 770, 140, 22); }
    ctx.fillStyle = "#8C969C"; ctx.fillRect(-2600, GY - 40, 6400, 1000); ctx.fillStyle = "#6E7A80"; for (let x = -2600; x < 3800; x += 60) ctx.fillRect(x, GY - 10, 30, 8);
    for (let i = 0; i < 5; i++){ ctx.fillStyle = hexA("#5BA9E0", .35); ctx.beginPath(); ctx.ellipse(-100 + i * 300, GY - 10, 110, 18, 0, 0, TAU); ctx.fill(); }
  };
  function bubbles(ctx, t, n, frozen, popT){ for (let i = 0; i < n; i++){ const q = frozen ? ((popT * .25 + rnd(i)) % 1) : ((t * .25 + rnd(i)) % 1), x = 80 + rnd(i + 3) * 920 + Math.sin((frozen ? popT : t) * 1.5 + i) * 30, y = 1500 - q * 1100, r = 14 + rnd(i + 8) * 22;
      if (frozen && t - popT > .15 + i * .06){ const k = t - popT - .15 - i * .06; if (k < .25){ ctx.strokeStyle = hexA("#FFFFFF", 1 - k * 4); ctx.lineWidth = 3; for (let a = 0; a < 6; a++){ const aa = a * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x + Math.cos(aa) * r, y + Math.sin(aa) * r); ctx.lineTo(x + Math.cos(aa) * (r + 16), y + Math.sin(aa) * (r + 16)); ctx.stroke(); } } continue; }
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fill(); ctx.strokeStyle = hexA("#7FB7E0", .9); ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .35, r * .2, 0, TAU); ctx.fill(); } }
  /* ---------- JS49: _cuci ---------- */
  TT.scene(PX + "cuci", "Cerita: tempat cuci mobil, gulungan selang dan alat vakum digeser ke posisi baru dekat mobil, busa, kru bilang lebih cepat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ carX: 560 }, f.cuci || {});
    const tHose = T(s, K.hoseCue, .3, idx), tVac = T(s, K.vacCue, .4, idx), tFast = T(s, K.fastCue, .8, idx);
    const qh = t < tHose ? 0 : eBack(clamp((t - tHose) / .7, 0, 1)), qv = t < tVac ? 0 : eBack(clamp((t - tVac) / .7, 0, 1));
    const hx = lerp(-420, 120, qh), vx = lerp(1500, 960, qv);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" }, envFront: false,
      back: () => { BG.cuci(ctx, t, {}); hoseReel(ctx, hx, 900, t);
        if (qh > 0 && qh < 1) for (let k = 0; k < 4; k++){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hx - 120 - k * 40, 860 + k * 30); ctx.lineTo(hx - 220 - k * 40, 860 + k * 30); ctx.stroke(); }
        carSide(ctx, K.carX, GY - 10, 620, "#D9483B", t, { foam: clamp((t - .5) / 1, 0, 1), shine: t > tFast });
        vacuum(ctx, vx, GY, t); if (qv > 0 && qv < 1) for (let k = 0; k < 4; k++){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(vx + 110 + k * 40, 1450 + k * 30); ctx.lineTo(vx + 210 + k * 40, 1450 + k * 30); ctx.stroke(); } },
      front: () => { bubbles(ctx, t, 16, false, 0); },
      over: () => { if (t > tHose && t < tVac) popChip(ctx, "SELANG: LEBIH DEKAT", 540, 300, t - tHose, "#3E9B5A", "#FFFFFF", 44); if (t > tVac) popChip(ctx, "VAKUM: LEBIH DEKAT", 540, 300, t - tVac, "#5B7DB1", "#FFFFFF", 44);
        if (t > tFast) popWord(ctx, "WUSH!", 540, 470, t - tFast, { size: 104, hold: 1.4, rot: -8 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.cuci || {}; if (K.hoseCue) add(cueT(s, K.hoseCue, .3, i), "whoosh"); if (K.vacCue) add(cueT(s, K.vacCue, .4, i), "whoosh"); if (K.fastCue) add(cueT(s, K.fastCue, .8, i), "chime"); });

  /* ---------- JS49: _beku ---------- */
  TT.scene(PX + "beku", "Cerita: tempat cuci mobil, pemilik bertanya berapa menit, semua membeku abu-abu, gelembung sabun pecah satu per satu, kolom SEBELUM kosong", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ carX: 600 }, f.beku || {});
    const tFreeze = T(s, K.freezeCue, .3, idx), tEnd = T(s, K.thawCue, .7, idx), fr = t > tFreeze && t < tEnd;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" }, envFront: false,
      back: () => { BG.cuci(ctx, t, {}); hoseReel(ctx, 120, 900, fr ? tFreeze : t); carSide(ctx, K.carX, GY - 10, 620, "#D9483B", fr ? tFreeze : t, { foam: 1 }); vacuum(ctx, 960, GY, t); },
      front: () => { bubbles(ctx, t, 16, t > tFreeze, tFreeze); },
      post: () => { if (!fr) return; const k = clamp((t - tFreeze) / .25, 0, 1) * clamp((tEnd - t) / .25, 0, 1); ctx.save(); ctx.globalAlpha = .85 * k; ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
        ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 14; ctx.strokeRect(40, 180, 1000, 1560); ctx.restore(); },
      over: () => { if (fr) popChip(ctx, "SEBELUMNYA: ?? MENIT", 540, 300, t - tFreeze - .4, RED, "#FFFFFF", 48, -.03); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.beku || {}; if (K.freezeCue){ const a = cueT(s, K.freezeCue, .3, i); add(a, "whoosh"); for (let k = 0; k < 5; k++) add(a + .2 + k * .25, "pop"); } });

  /* ---------- JS49: _sidang ---------- */
  BG.sidang = (ctx, t, o) => {
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); for (let x = -2600; x < 3800; x += 150){ ctx.fillStyle = "#6A3E25"; ctx.fillRect(x, -1200, 10, GY + 1200); }
    rr(ctx, 360, 420, 360, 140, 16); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 6); textC(ctx, "SIDANG", 540, 486, 50, OUT, 900); textC(ctx, "PERBAIKAN", 540, 534, 34, ORANGE, 900);
    // judge bench
    rr(ctx, 520, 1180, 640, 460, 10); ctx.fillStyle = "#5A3420"; ctx.fill(); ol(ctx, 8); rr(ctx, 500, 1160, 680, 40, 8); ctx.fillStyle = "#8A5A3B"; ctx.fill(); ol(ctx, 6);
    // witness box
    rr(ctx, -40, 1330, 420, 310, 10); ctx.fillStyle = "#6A3E25"; ctx.fill(); ol(ctx, 7); rr(ctx, -60, 1310, 460, 34, 8); ctx.fillStyle = "#8A5A3B"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#4A2A1E"; ctx.fillRect(-2600, GY, 6400, 1000);
  };
  function punchClock(ctx, x, y, t, k){ ctx.save(); ctx.translate(x, y); rr(ctx, -110, -150, 220, 300, 20); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); wallClockMini(ctx, 0, -70, 60, t); rr(ctx, -60, 40, 120, 26, 6); ctx.fillStyle = OUT; ctx.fill();
    textC(ctx, "MESIN CATAT", 0, 120, 22, OUT, 900); if (k > 0 && k < .25){ ctx.fillStyle = hexA(GOLD, .7); ctx.beginPath(); ctx.arc(0, 52, 60, 0, TAU); ctx.fill(); } ctx.restore(); }
  function wallClockMini(ctx, x, y, r, t){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round"; const a = t * 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(a) * r * .7, y - Math.cos(a) * r * .7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(a / 12) * r * .45, y - Math.cos(a / 12) * r * .45); ctx.stroke(); }
  ITEMS.gavel = (ctx, t, o) => { ctx.rotate(-.6); rr(ctx, -8, -10, 16, 150, 6); ctx.fillStyle = "#8A5A3B"; ctx.fill(); ol(ctx, 4); rr(ctx, -50, -50, 100, 50, 12); ctx.fillStyle = "#5A3420"; ctx.fill(); ol(ctx, 5); };
  TT.scene(PX + "sidang", "Cerita: khayalan ruang sidang, awan RASANYA LEBIH CEPAT diketuk palu hakim lalu meletus; potong ke cuci mobil, mesin catat tiket masuk-keluar, rata-rata 25 menit", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.sidang || {});
    const tCloud = T(s, K.cloudCue, .2, idx), tBang = T(s, K.bangCue, .6, idx), tAvg = T(s, K.avgCue, .7, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false }, envFront: false,
      back: (c2, c, sts, R) => { if (R.f.cuci){ BG.cuci(ctx, t, {}); const t0 = R.shotT, per = 1.05, n = Math.max(0, Math.floor((t - t0 - .3) / per));
          punchClock(ctx, 940, 1000, t, ((t - t0 - .3) % per)); const k = ((t - t0 - .3) % per) / per; if (t > t0 + .3) carSide(ctx, lerp(-500, 1700, k), GY - 10, 560, ["#D9483B", "#3E6FB5", "#F6C343", "#3E9B5A", "#8E5BB5"][n % 5], t, { roll: t * 6, foam: Math.sin(k * Math.PI) });
          return; }
        BG.sidang(ctx, t, {}); },
      front: (c2, c, sts, R) => { if (R.f.cuci) return; const st = sts[0]; if (!st) return; const h = toonHead(st);
        if (t > tCloud && t < tBang + .1){ const q = eBack(clamp((t - tCloud) / .5, 0, 1)), cx = h[0] + 250, cy = h[1] - 300 + Math.sin(t * 2) * 10; ctx.save(); ctx.translate(cx, cy); ctx.scale(q, q);
          ctx.fillStyle = "#F7C8DA"; [[-150, 10, 80], [-60, -50, 100], [60, -40, 100], [150, 10, 80], [0, 40, 110]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ol(ctx, 6); });
          [[-150, 10, 80], [-60, -50, 100], [60, -40, 100], [150, 10, 80], [0, 40, 110]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r - 5, 0, TAU); ctx.fill(); });
          textC(ctx, "RASANYA", 0, -10, 44, "#8E3B5A", 900); textC(ctx, "LEBIH CEPAT", 0, 46, 50, "#8E3B5A", 900, 330); ctx.restore(); }
        if (t > tBang && t < tBang + 1){ const k = t - tBang; burstFx(ctx, h[0] + 250, h[1] - 300, k, "#F28DB2", 14, 260); popWordW(ctx, k, h[0] + 250, h[1] - 300); } },
      over: (c2, c, sts, R) => { if (R.f.cuci){ const t0 = R.shotT; popChip(ctx, "SUSUNAN LAMA · 1 MINGGU", 540, 260, t - t0 - .2, NAVY, "#FFFFFF", 42);
          const per = 1.05, n = Math.min(4, Math.floor((t - t0 - .3) / per)); for (let i = 0; i < n; i++){ const k = t - t0 - .3 - (i + 1) * per; popChip(ctx, ["24", "27", "25", "26"][i] + " mnt", 200 + i * 225, 380, k, PAPER, OUT, 40, (i % 2 ? .06 : -.06)); }
          if (t > tAvg){ const q = eBack(clamp((t - tAvg) / .4, 0, 1)); ctx.save(); ctx.translate(540, 560); ctx.scale(q, q); rr(ctx, -330, -80, 660, 160, 26); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7); textC(ctx, "RATA-RATA 25 MENIT", 0, 22, 58, "#FFFFFF", 900, 600); ctx.restore(); if (t - tAvg < .9) burstFx(ctx, 540, 560, t - tAvg, GOLD, 12, 300); }
          return; }
        if (t > tBang) popChip(ctx, "BUKTINYA MANA?", 540, 300, t - tBang, RED, "#FFFFFF", 52, -.04); } });
    function popWordW(ctx, k, x, y){ if (k > .6) return; ctx.save(); ctx.globalAlpha *= 1 - k / .6; ctx.translate(x, y); const s2 = 1 + k; ctx.scale(s2, s2); textC(ctx, "POOF!", 0, 20, 70, "#FFFFFF", 900); ctx.restore(); }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.sidang || {}; if (K.cloudCue) add(cueT(s, K.cloudCue, .2, i), "pop"); if (K.bangCue){ add(cueT(s, K.bangCue, .6, i), "pop"); add(cueT(s, K.bangCue, .6, i) + .05, "whoosh"); } if (K.avgCue) add(cueT(s, K.avgCue, .7, i), "chime"); });

  /* ---------- JS49: _balap (split race) ---------- */
  TT.scene(PX + "balap", "Cerita: layar terbelah dua jalur cuci (BUSA, BILAS, VAKUM, LAP), mobil SEBELUM 25 menit vs SESUDAH 18 menit, cap TERBUKTI", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.balap || {});
    const t0 = T(s, K.startCue, .05, idx) + .3, tB = T(s, K.finishCue, .5, idx), unit = Math.max(.12, (tB - t0) / 18), tProof = T(s, K.proofCue, .7, idx), tOk = T(s, K.okCue, .9, idx);
    const lanes = [{ y: 800, lab: "SEBELUM", mins: 25, col: "#8C8C94", car: "#3E6FB5" }, { y: 1130, lab: "SESUDAH", mins: 18, col: GREEN, car: "#D9483B" }];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => { lanes.forEach((L, j) => { const top = L.y - 250; rr(ctx, 30, top, 760, 300, 24); ctx.fillStyle = hexA("#FFFFFF", .1); ctx.fill(); ctx.strokeStyle = L.col; ctx.lineWidth = 6; ctx.stroke();
          ["BUSA", "BILAS", "VAKUM", "LAP"].forEach((st, k) => { const x = 125 + k * 180; rr(ctx, x - 80, top + 20, 160, 52, 10); ctx.fillStyle = hexA(L.col, .85); ctx.fill(); ol(ctx, 4); textC(ctx, st, x, top + 56, 26, "#FFFFFF", 900, 140); ctx.fillStyle = hexA("#FFFFFF", .15); ctx.fillRect(x - 2, top + 80, 4, 200); });
          ctx.fillStyle = "#3A4560"; ctx.fillRect(45, L.y - 20, 730, 30);
          const el = t < t0 ? 0 : (t - t0) / unit, p = clamp(el / L.mins, 0, 1), x = lerp(130, 650, p), foam = Math.sin(p * Math.PI * 4) > 0 && p < 1 ? .8 : 0;
          carSide(ctx, x, L.y + 10, 250, L.car, t, { roll: p * 30, foam, shine: p >= 1 });
          if (p >= 1){ ctx.save(); ctx.translate(735, L.y - 200); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 170); ctx.stroke(); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++){ ctx.fillStyle = (r + c) % 2 ? "#FFFFFF" : OUT; ctx.fillRect(c * 18, r * 18 + Math.sin(t * 8 + c) * 3, 18, 18); } ctx.restore(); } }); } ,
      over: (c2, c) => { lanes.forEach((L, j) => { const el = t < t0 ? 0 : Math.min(L.mins, (t - t0) / unit), p = c.toScreen(540, L.y - 250);
          popChip(ctx, L.lab + "  " + Math.floor(el) + " MENIT", 410, p[1] - 30, t - t0 + .3, el >= L.mins ? (j ? GREEN : NAVY) : NAVY, el >= L.mins ? GOLD : "#FFFFFF", 44, 0); });
        if (t > tProof && t < tOk) stampBox(ctx, "TERBUKTI", 540, 290, t - tProof, GREEN, 80, -.06); if (t > tProof && t < tProof + .9) burstFx(ctx, 540, 290, t - tProof, GREEN, 14, 280);
        if (t > tOk) popChip(ctx, "SUSUNAN BARU RESMI DIPAKAI", 540, 290, t - tOk, ORANGE, "#FFFFFF", 40); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.balap || {}; if (K.startCue) add(cueT(s, K.startCue, .05, i) + .3, "whoosh"); if (K.finishCue) add(cueT(s, K.finishCue, .5, i), "chime"); if (K.proofCue) add(cueT(s, K.proofCue, .7, i), "ping"); });
})();

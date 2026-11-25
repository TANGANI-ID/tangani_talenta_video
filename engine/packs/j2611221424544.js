/* Scene pack j2611221424544: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SC44, MS44, SB45, SP45, RN45.
   Layout prefix j2611221424544_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, piece:false, ...}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, outCue, s, dx, dy, rot, ...}]  object in a toon's hand:
            cash, coin, phone, form (signed), soda (shake, cap, fizz), bag, key, pot, sticker, marker, mug, paper, book, ball
     pops   [{at|cue, text, x, y, size, rot, col, hold}]   big outlined pop words (screen)
     stamps [{at|cue, text, x, y, col, size, rot}]          framed stamp + burst (screen)
     tags   [{on, at|cue, outCue, text, bg}]                chip above a toon's head
     steps  [{at|cue, text}] + stepsY                       numbered step chips;  keys {caps}; confetti {at|cue}
     bg     "lobi" | "keuangan" | "rapat" (+ bgOpt)         custom backdrop drawn over the env
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     SC44 _klub     counting the leftover salary at home -> imagined velvet-rope club INVESTASI with a bouncer, KHUSUS ORANG KAYA sign   f.klub
          _kebun    community garden (reksa dana): coins tossed by a crowd of small investors into one basket, a manager in a caping plants  f.kebun
          _lumbung  sunset: the manager's turned-out empty pockets, coin barrow locked in the BANK KUSTODIAN barn, OJK watchtower searchlight  f.lumbung
          _petak    four plots (pasar uang, pendapatan tetap, campuran, saham) swaying harder in the wind, all droop once, TIDAK DIJAMIN LPS  f.petak
          _pot      balcony at night: one coin drops into a small pot and a sprout grows   f.pot
     MS44 _depan    car seen head-on driving at dusk, phone on the dash buzzes with family-group chats, dashed sight line to it   f.depan
          _pov      driver's-eye view: the phone screen swallows the windshield (road shrinks to a tiny inset, 2 s / 33 m counter), kid + ball, brake  f.pov
          _meter    top-down road ruler: car drives 33 m with a closed-eye badge, speedometer 60 km/h, stopwatch 2 s   f.meter
          _menepi   car seen from behind: phone bag tossed onto the back seat; pulls over to a TEMPAT AMAN bay with hazards, then the reply   shots[].car
     SB45 _pantul   outside the finance room's glass wall: knocks, greeting bubbles splat on the glass and slide down, nobody looks up, clock spins  f.pantul
          _album    relationship sticker album: face stickers from other divisions fly into slots, "ask him" ring, hearts   f.album (+ shot albumOn)
     SP45 _robek    cork board: plan-A poster rips in half after the phone call while the target card stays pinned   f.robek
          _putar    round TARGET dial on the meeting-room wall turned down from 30 to 15   f.putar
          _tebing   hand stops the dial; imagination: bridge to the target flag collapses, a flying-fox line (RENCANA B) carries the team across  f.tebing
          _keliling demo cart touring office fronts (+8 customers) / plan sheet with three written lines / cloth banner 32 of 30   shots[].mode
     RN45 _soda     anger puffs sucked into the chest, then a giant KESAL soda bottle shaken each day, pressure gauge into the red   f.soda
          _ledak    director's meeting: the small bottle in front of Fikri pops, soda geyser, papers fly, foam drips on everyone   f.ledak
          _ngobrol  afternoon bench: the bottle is opened slowly (small hiss), topic chips, deal stamp   shots[].bottle, shots[].chips */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424544_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const BG = {};
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
    if (f.bg && BG[f.bg]) layer(ctx, c, 1, () => BG[f.bg](ctx, t, f.bgOpt || {}));
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

  /* ================= SC44: _klub (counting the salary at home -> imagined velvet-rope club "INVESTASI") ================= */
  function clubBack(ctx, t, K, tSign){
    ctx.fillStyle = (() => { const g = ctx.createLinearGradient(0, 200, 0, GY); g.addColorStop(0, "#2A1838"); g.addColorStop(1, "#4B2A52"); return g; })(); ctx.fillRect(-2600, -1200, 6400, GY + 1400);
    // art-deco fans on the wall
    for (let i = -3; i < 8; i++){ const x = i * 260 + 30, y = GY - 560; ctx.save(); ctx.translate(x, y); ctx.strokeStyle = hexA(GOLD, .35); ctx.lineWidth = 4; for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.arc(0, 0, 40 + k * 24, Math.PI, TAU); ctx.stroke(); } ctx.restore(); }
    // spotlights sweeping
    for (let k = 0; k < 2; k++){ const a = Math.sin(t * .9 + k * 2) * .5, x0 = k ? 1260 : -180; ctx.save(); ctx.translate(x0, 120); ctx.rotate(a + (k ? .45 : -.45)); ctx.fillStyle = hexA("#FFF1C4", .14); ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(260, 1700); ctx.lineTo(-260, 1700); ctx.closePath(); ctx.fill(); ctx.restore(); }
    // golden door
    const dx = K.doorX, top = GY - 900; glowAt(ctx, dx, top + 400, 560, GOLD, .25 + .08 * Math.sin(t * 3));
    rr(ctx, dx - 230, top - 30, 460, 930, [200, 200, 0, 0]); ctx.fillStyle = "#8E5A1E"; ctx.fill(); ol(ctx, 8);
    rr(ctx, dx - 200, top, 400, 900, [180, 180, 0, 0]); ctx.fillStyle = (() => { const g = ctx.createLinearGradient(dx - 200, 0, dx + 200, 0); g.addColorStop(0, "#E0A933"); g.addColorStop(.5, "#FFE08A"); g.addColorStop(1, "#C98A1B"); return g; })(); ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = hexA(OUT, .45); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(dx, top + 20); ctx.lineTo(dx, GY); ctx.stroke(); [-1, 1].forEach(d => { rr(ctx, dx + d * 100 - 60, top + 200, 120, 260, 14); ctx.stroke(); rr(ctx, dx + d * 100 - 60, top + 500, 120, 300, 14); ctx.stroke(); ctx.beginPath(); ctx.arc(dx + d * 30, top + 520, 12, 0, TAU); ctx.fillStyle = "#8E5A1E"; ctx.fill(); });
    // marquee sign with bulbs
    const sy = top - 190; rr(ctx, dx - 330, sy, 660, 150, 24); ctx.fillStyle = "#3A1F2E"; ctx.fill(); ol(ctx, 7); rr(ctx, dx - 312, sy + 18, 624, 114, 16); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.stroke();
    for (let i = 0; i < 22; i++){ const p = i / 22, on = Math.floor(t * 8 + i) % 3 !== 0; const bx = p < .5 ? dx - 312 + p * 2 * 624 : dx + 312 - (p - .5) * 2 * 624, by = p < .5 ? sy + 10 : sy + 140; ctx.beginPath(); ctx.arc(bx, by, 7, 0, TAU); ctx.fillStyle = on ? "#FFF3B0" : "#8E6A3A"; ctx.fill(); }
    textC(ctx, K.title || "INVESTASI", dx, sy + 100, 76, GOLD, 900, 580);
    // red carpet strip on the floor in front of the door
    ctx.fillStyle = "#9E1F2C"; ctx.beginPath(); ctx.moveTo(dx - 170, GY - 10); ctx.lineTo(dx + 170, GY - 10); ctx.lineTo(dx + 260, GY + 400); ctx.lineTo(dx - 260, GY + 400); ctx.closePath(); ctx.fill();
  }
  function ropeFront(ctx, t, K, tSign){
    const y = GY - 250, x0 = K.ropeX0, x1 = K.ropeX1;
    [x0, x1].forEach(x => { ctx.fillStyle = "#C98A1B"; rr(ctx, x - 14, y - 10, 28, GY - y + 10, 8); ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(x, y - 18, 24, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(x, GY, 60, 16, 0, 0, TAU); ctx.fillStyle = "#C98A1B"; ctx.fill(); ol(ctx, 4); });
    const sag = 70 + Math.sin(t * 2) * 6; ctx.strokeStyle = OUT; ctx.lineWidth = 30; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y + sag * 2, x1, y); ctx.stroke(); ctx.strokeStyle = "#B3202F"; ctx.lineWidth = 22; ctx.stroke();
    if (t >= tSign){ const q = eBack(clamp((t - tSign) / .45, 0, 1)), sw = Math.sin((t - tSign) * 6) * .12 * Math.exp(-(t - tSign) * 1.5); const mx = K.doorX, my = GY - 900 - 70;
      ctx.save(); ctx.translate(mx, my); ctx.rotate(sw); ctx.scale(q, q); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-120, -10); ctx.lineTo(-150, 40); ctx.moveTo(120, -10); ctx.lineTo(150, 40); ctx.stroke();
      rr(ctx, -200, 40, 400, 150, 14); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6); textC(ctx, "KHUSUS", 0, 100, 46, RED, 900, 360); textC(ctx, "ORANG KAYA", 0, 162, 52, RED, 900, 360); ctx.restore(); }
  }
  TT.scene(PX + "klub", "Cerita: hitung sisa gaji di rumah -> khayalan klub INVESTASI bertali beludru + penjaga", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ doorX: 760, ropeX0: 540, ropeX1: 1000 }, f.klub || {});
    const tSign = T(s, K.signCue, .4, idx), bills = (K.bills || []).map((b, j) => Object.assign({ T: T(s, b.cue, .2 + j * .1, idx) }, b)), tSum = T(s, K.sumCue, .5, idx);
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 760 },
      spots: { door: [K.doorX, GY - 620, 1] },
      back: (ctx2, c, sts, R) => { if (R.f.club) clubBack(ctx, t, K, tSign); },
      front: (ctx2, c, sts, R) => {
        if (R.f.club) ropeFront(ctx, t, K, tSign);
        if (!R.f.club && sts[0]){ const h = handOf(sts[0]);
          bills.forEach((b, j) => { if (t < b.T) return; const q = eOut(clamp((t - b.T) / .5, 0, 1)), x = lerp(h[0], 640 + j * 120, q), y = lerp(h[1], 900 - j * 30, q) - Math.sin(q * Math.PI) * 120;
            bill(ctx, x, y + Math.sin(t * 3 + j) * 6, -.15 + j * .15 + (1 - q) * 2, j % 2 ? "#E58BA0" : "#7FB7A0", b.text || "100rb"); burstFx(ctx, x, y, t - b.T - .45, GOLD, 8, 90); });
        }
      },
      over: (ctx2, c, sts, R) => { if (!R.f.club){ if (t >= tSum) popChip(ctx, K.sum || "Rp300 RIBU", 700, 520, t - tSum, ORANGE, "#FFFFFF", 60, -.05); return; } const k = t - R.shotT, w = 26 + 6 * Math.sin(t * 4);
        // dreamy cloud frame
        ctx.save(); ctx.fillStyle = hexA("#FFF4E6", .92); for (let i = 0; i < 26; i++){ const p = i / 26, a = p * TAU; const x = 540 + Math.cos(a) * 640, y = 960 + Math.sin(a) * 1060; ctx.beginPath(); ctx.arc(x, y, 150 + w * Math.sin(i * 1.7 + t * 2), 0, TAU); ctx.fill(); } ctx.restore();
        popChip(ctx, K.tag || "BAYANGAN YOGA", 540, 300, k - .2, "#7A3B8F", "#FFFFFF", 38, -.03); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.klub || {}; (K.bills || []).forEach((b, j) => add(cueT(s, b.cue, .2 + j * .1, i), "pop")); if (K.sumCue) add(cueT(s, K.sumCue, .5, i), "chime"); if (K.signCue) add(cueT(s, K.signCue, .4, i), "ping"); });

  /* ================= SC44: _kebun (community garden = reksa dana; coins from many people, a manager plants) ================= */
  function caping(ctx, st){ const hp = toonHead(st), k = st.size / 92, r = 21 * k; ctx.save(); ctx.translate(hp[0], hp[1] - r * .78); ctx.beginPath(); ctx.moveTo(-r * 1.7, r * .25); ctx.lineTo(0, -r * .75); ctx.lineTo(r * 1.7, r * .25); ctx.quadraticCurveTo(0, r * .5, -r * 1.7, r * .25); ctx.closePath();
    ctx.fillStyle = "#E9C27A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#8E5A1E", .5); ctx.lineWidth = 3; for (let i = -3; i <= 3; i++){ ctx.beginPath(); ctx.moveTo(0, -r * .7); ctx.lineTo(i * r * .5, r * .3); ctx.stroke(); } ctx.restore(); }
  function raisedBed(ctx, x0, x1, top, t, label){
    rr(ctx, x0, top, x1 - x0, GY - top, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; for (let y = top + 50; y < GY; y += 50){ ctx.beginPath(); ctx.moveTo(x0 + 6, y); ctx.lineTo(x1 - 6, y); ctx.stroke(); }
    ctx.fillStyle = "#5A3A22"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, top + 4, (x1 - x0) / 2 - 8, 22, 0, 0, TAU); ctx.fill();
    if (label){ rr(ctx, x0 + 30, top + 40, x1 - x0 - 60, 64, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, label, (x0 + x1) / 2, top + 86, 36, BROWN, 900, x1 - x0 - 90); } }
  TT.scene(PX + "kebun", "Cerita: kebun patungan (koin dari banyak orang masuk satu wadah, petani pengelola menanam)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x0: 520, x1: 1180, farmer: 2 }, f.kebun || {});
    const tSign = T(s, K.signCue, .3, idx), tCoins = T(s, K.coinCue, .3, idx), tGrow = T(s, K.growCue, .4, idx), tAhli = T(s, K.ahliCue, .5, idx), top = GY - 200, bx = (K.x0 + K.x1) / 2;
    base(ctx, s, t, { env: "park", envOpt: { bench: false, treeX: -300 },
      spots: { bed: [bx, top - 200, .95] },
      back: () => {
        // little crowd of investors on the far hill, tossing coins
        for (let i = 0; i < 9; i++){ const x = K.x0 - 380 + i * 150, y = top - 120 - (i % 2) * 40, hop = t > tCoins ? Math.abs(Math.sin(t * 5 + i)) * 14 : 0;
          ctx.save(); ctx.translate(x, y - hop); ctx.fillStyle = ["#2F6F73", "#C2691F", "#5B7DB1", "#7A3B8F", "#3E9B5A"][i % 5]; rr(ctx, -26, -60, 52, 70, 18); ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.arc(0, -86, 26, 0, TAU); ctx.fillStyle = ["#E2A77C", "#C98B62", "#F0C29A", "#B5774F"][i % 4]; ctx.fill(); ol(ctx, 4);
          if (i % 2){ ctx.beginPath(); ctx.arc(0, -90, 29, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(24, -66); ctx.lineTo(-24, -66); ctx.closePath(); ctx.fillStyle = ["#E8A55B", "#2F6F73", "#D9483B", "#5B7DB1"][i % 4]; ctx.fill(); ol(ctx, 3); } // hijab
          ctx.restore(); }
        raisedBed(ctx, K.x0, K.x1, top, t, t >= tSign ? null : null);
        // big basket (wadah) in the middle of the bed
        const fill = t < tCoins ? 0 : clamp((t - tCoins) / 3, 0, 1); ctx.save(); ctx.translate(bx, top - 10);
        ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(150, -150); ctx.lineTo(115, 0); ctx.lineTo(-115, 0); ctx.closePath(); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; for (let i = -4; i <= 4; i++){ ctx.beginPath(); ctx.moveTo(i * 34, -150); ctx.lineTo(i * 26, 0); ctx.stroke(); } for (let y = -120; y < 0; y += 32){ ctx.beginPath(); ctx.moveTo(-140 - y * .2, y); ctx.lineTo(140 + y * .2, y); ctx.stroke(); }
        if (fill > 0){ for (let i = 0; i < Math.floor(fill * 14); i++) coin(ctx, -110 + (i % 7) * 37, -150 - Math.floor(i / 7) * 22 - rnd(i) * 6, 20, i); }
        textC(ctx, "WADAH", 0, -60, 40, "#FFFFFF", 900, 220); ctx.restore();
        // seedlings growing in the bed
        if (t >= tGrow) for (let i = 0; i < 6; i++){ const x = K.x0 + 50 + i * ((K.x1 - K.x0 - 100) / 5); if (Math.abs(x - bx) < 170) continue; const g = eBack(clamp((t - tGrow - i * .18) / .5, 0, 1)) * (1 + .5 * clamp((t - tAhli) / .6, 0, 1));
          ctx.save(); ctx.translate(x, top + 2); sprout(ctx, g * 1.3, t + i); ctx.restore(); if (t - tGrow - i * .18 > 0 && t - tGrow - i * .18 < .9) burstFx(ctx, x, top - 60, t - tGrow - i * .18, GREEN, 6, 70); }
      },
      over1: (ctx2, c, sts, j) => { if (j === K.farmer && sts[j]) caping(ctx, sts[j]); },
      front: () => {
        // coins flying from the crowd into the basket
        if (t >= tCoins) for (let i = 0; i < 12; i++){ const p = ((t - tCoins) * .9 + i / 12) % 1, sx = K.x0 - 380 + (i % 9) * 150, sy = top - 220, ex = bx + (rnd(i) - .5) * 160, ey = top - 170;
          if ((t - tCoins) * .9 + i / 12 < 1 && i / 12 > (t - tCoins) * .9) continue; const x = lerp(sx, ex, p), y = lerp(sy, ey, p) - Math.sin(p * Math.PI) * 300; coin(ctx, x, y, 22, t * 8 + i); }
        if (t >= tSign){ const q = eBack(clamp((t - tSign) / .45, 0, 1)); ctx.save(); ctx.translate(bx, top - 470); ctx.rotate(Math.sin(t * 1.6) * .03); ctx.scale(q, q);
          ctx.fillStyle = "#7A4A2E"; rr(ctx, -12, 40, 24, 240, 6); ctx.fill(); ol(ctx, 4); rr(ctx, -300, -70, 600, 130, 16); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 7);
          textC(ctx, K.sign || "KEBUN PATUNGAN", 0, 18, 64, BROWN, 900, 540); ctx.restore(); }
      },
      over: (ctx2, c, sts) => { const st = sts[K.farmer]; if (st && t >= tGrow){ const hp = toonHead(st), p = c.toScreen(hp[0], hp[1] - st.size * .36); popChip(ctx, K.mLabel || "MANAJER INVESTASI", clamp(p[0], 300, 780), Math.max(250, p[1]), t - tGrow, NAVY, "#FFFFFF", 36, -.04); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kebun || {}; if (K.signCue) add(cueT(s, K.signCue, .3, i), "chime"); if (K.coinCue){ const a = cueT(s, K.coinCue, .3, i); for (let k = 0; k < 5; k++) add(a + k * .45, "pop"); } if (K.growCue) add(cueT(s, K.growCue, .4, i), "whoosh"); if (K.ahliCue) add(cueT(s, K.ahliCue, .5, i), "chime"); });

  /* ================= SC44: _lumbung (manager's empty pockets, harvest locked in the custodian barn, watchtower supervisor) ================= */
  TT.scene(PX + "lumbung", "Cerita: kantong pengelola kosong, hasil dikunci di lumbung kustodian, menara pengawas menyorot", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ barnX: 720, towerX: 1220, cartX0: 260, farmer: 0 }, f.lumbung || {});
    const tPock = T(s, K.pocketCue, .3, idx), tCart = T(s, K.cartCue, .3, idx), tLock = T(s, K.lockCue, .6, idx), tTower = T(s, K.towerCue, .3, idx);
    const bx = K.barnX, bTop = GY - 620;
    base(ctx, s, t, { env: "sunset", envOpt: {},
      spots: { barn: [bx, GY - 420, 1], wide: [bx + 110, GY - 560, .8] },
      back: () => {
        // watchtower
        const tx = K.towerX, ty = GY - 1050; ctx.fillStyle = "#6B4426"; [[-90, 0], [90, 0]].forEach(([d]) => { ctx.save(); ctx.translate(tx + d, GY); ctx.rotate(d > 0 ? -.08 : .08); rr(ctx, -12, -1000, 24, 1000, 6); ctx.fill(); ol(ctx, 4); ctx.restore(); });
        ctx.strokeStyle = "#6B4426"; ctx.lineWidth = 10; for (let y = GY - 900; y < GY; y += 220){ ctx.beginPath(); ctx.moveTo(tx - 80, y); ctx.lineTo(tx + 80, y + 180); ctx.moveTo(tx + 80, y); ctx.lineTo(tx - 80, y + 180); ctx.stroke(); }
        rr(ctx, tx - 150, ty - 40, 300, 150, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(tx - 190, ty - 40); ctx.lineTo(tx, ty - 170); ctx.lineTo(tx + 190, ty - 40); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
        if (t >= tTower){ const a = Math.sin((t - tTower) * 1.4) * .75 - .25; ctx.save(); ctx.translate(tx - 60, ty + 30); ctx.rotate(a + Math.PI * .62); const g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, hexA("#FFF3B0", .55)); g.addColorStop(1, hexA("#FFF3B0", 0)); ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(260, 1300); ctx.lineTo(-260, 1300); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.beginPath(); ctx.arc(tx - 60, ty + 30, 30, 0, TAU); ctx.fillStyle = t >= tTower ? "#FFF3B0" : "#9A8F7A"; ctx.fill(); ol(ctx, 5);
        if (t >= tTower){ const q = eBack(clamp((t - tTower) / .45, 0, 1)); ctx.save(); ctx.translate(tx, ty + 210); ctx.scale(q, q); rr(ctx, -150, -46, 300, 92, 14); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6); textC(ctx, K.tower || "PENGAWAS", 0, -6, 30, "#FFFFFF", 900, 270); textC(ctx, K.tower2 || "OJK", 0, 32, 34, GOLD, 900, 270); ctx.restore(); }
        // barn
        ctx.fillStyle = "#A8432E"; rr(ctx, bx - 240, bTop, 480, GY - bTop, 6); ctx.fill(); ol(ctx, 7); ctx.beginPath(); ctx.moveTo(bx - 290, bTop + 10); ctx.lineTo(bx, bTop - 210); ctx.lineTo(bx + 290, bTop + 10); ctx.closePath(); ctx.fillStyle = "#6B2A1E"; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = hexA("#FFFFFF", .25); ctx.lineWidth = 4; for (let x = bx - 220; x < bx + 240; x += 40){ ctx.beginPath(); ctx.moveTo(x, bTop + 10); ctx.lineTo(x, GY); ctx.stroke(); }
        rr(ctx, bx - 170, bTop - 120, 340, 84, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, K.barn || "BANK KUSTODIAN", bx, bTop - 64, 36, BROWN, 900, 310);
        const shut = clamp((t - tLock + .5) / .5, 0, 1), dw = 150; ctx.fillStyle = "#2B1A12"; ctx.fillRect(bx - dw, GY - 360, dw * 2, 360);
        if (t < tLock) { ctx.save(); ctx.translate(bx, GY - 120); for (let i = 0; i < 10; i++) coin(ctx, -90 + (i % 5) * 45, -Math.floor(i / 5) * 26, 22, i); ctx.restore(); }
        [-1, 1].forEach(d => { const w = dw * (.15 + .85 * shut); ctx.fillStyle = "#C9603F"; ctx.fillRect(d < 0 ? bx - w : bx, GY - 360, w, 360); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(d < 0 ? bx - w : bx, GY - 360, w, 360);
          ctx.strokeStyle = CREAM; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(d < 0 ? bx - w : bx, GY - 360); ctx.lineTo(d < 0 ? bx : bx + w, GY); ctx.moveTo(d < 0 ? bx : bx + w, GY - 360); ctx.lineTo(d < 0 ? bx - w : bx, GY); ctx.stroke(); });
        if (t >= tLock){ const q = eBack(clamp((t - tLock) / .35, 0, 1)); ctx.save(); ctx.translate(bx, GY - 190); ctx.scale(q, q); ctx.strokeStyle = "#8C8C94"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, -40, 34, Math.PI, 0); ctx.stroke(); rr(ctx, -50, -40, 100, 84, 12); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -6, 10, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); burstFx(ctx, bx, GY - 230, t - tLock, GOLD, 10, 160); }
      },
      front: (ctx2, c, sts) => {
        // wheelbarrow of coins rolling to the barn
        const q = t < tCart ? 0 : easeIO(clamp((t - tCart) / 1.6, 0, 1)); if (t < tLock){ const x = lerp(K.cartX0, bx - 60, q), bob = Math.abs(Math.sin(q * 20)) * 6 * (q > 0 && q < 1 ? 1 : 0);
          ctx.save(); ctx.translate(x, GY - 60 - bob); ctx.beginPath(); ctx.arc(70, 30, 30, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(70, 30, 12, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill();
          ctx.beginPath(); ctx.moveTo(-90, -70); ctx.lineTo(110, -70); ctx.lineTo(80, 10); ctx.lineTo(-60, 10); ctx.closePath(); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-90, -60); ctx.lineTo(-170, -20); ctx.stroke();
          for (let i = 0; i < 7; i++) coin(ctx, -60 + i * 26, -80 - (i % 2) * 18, 18, t * 2 + i); ctx.restore(); }
        // the manager's turned-out pockets
        const st = sts[K.farmer]; if (st && t >= tPock){ const q = eBack(clamp((t - tPock) / .4, 0, 1)), k = st.size / 92; [-1, 1].forEach(d => { const [px, py] = [st.x + d * 15 * k, st.y - 32 * k];
          ctx.save(); ctx.translate(px, py); ctx.scale(q, q); ctx.rotate(Math.sin(t * 7 + d) * .12); ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(12, 46); ctx.quadraticCurveTo(0, 58, -12, 46); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
          for (let i = 0; i < 3; i++){ const kk = ((t - tPock) * 1.2 + i / 3) % 1; ctx.fillStyle = hexA("#B8AE9D", 1 - kk); ctx.beginPath(); ctx.arc(st.x + (i - 1) * 30, st.y - 20 * k + kk * 80, 5, 0, TAU); ctx.fill(); } }
      },
      over1: (ctx2, c, sts, j) => { if (j === K.farmer && sts[j]) caping(ctx, sts[j]); if (K.guard != null && j === K.guard && sts[j]){ const st = sts[j]; const h = handOf(st); drawItem(ctx, "key", h[0], h[1] + 10, t, { s: .8 * st.size / 760 }); } },
      over: (ctx2, c, sts) => { const st = sts[K.farmer]; if (st && t >= tPock && t < tCart + .3){ const hp = toonHead(st), p = c.toScreen(hp[0], hp[1] - st.size * .38); popChip(ctx, K.pocket || "TIDAK PEGANG UANG", clamp(p[0], 320, 760), Math.max(250, p[1]), t - tPock, RED, "#FFFFFF", 36, .04); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.lumbung || {}; if (K.pocketCue) add(cueT(s, K.pocketCue, .3, i), "pop"); if (K.cartCue) add(cueT(s, K.cartCue, .3, i), "whoosh"); if (K.lockCue) add(cueT(s, K.lockCue, .6, i), "ping"); if (K.towerCue) add(cueT(s, K.towerCue, .3, i), "chime"); });

  /* ================= SC44: _petak (four garden plots = four fund types; the wind sways them more and more; all droop once) ================= */
  function plantKind(ctx, kind, x, y, h, sway, t, i){
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway); ctx.lineCap = "round";
    if (kind === 0){ for (let k = -2; k <= 2; k++){ ctx.save(); ctx.translate(k * 34, 0); ctx.fillStyle = k % 2 ? "#7CC36B" : "#5DB36A"; ctx.beginPath(); ctx.ellipse(0, -h * .5, 26, h * .5, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); } }
    else if (kind === 1){ ctx.strokeStyle = "#3E8B4A"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h); ctx.stroke(); for (let k = 0; k < 5; k++){ const yy = -h * (.2 + k * .16); ctx.fillStyle = "#5DB36A"; ctx.beginPath(); ctx.ellipse((k % 2 ? 1 : -1) * 34, yy, 34, 15, (k % 2 ? -.4 : .4), 0, TAU); ctx.fill(); ol(ctx, 3);
        ctx.fillStyle = "#A6D36A"; rr(ctx, (k % 2 ? -1 : 1) * 30 - 6, yy - 6, 12, 40, 6); ctx.fill(); ol(ctx, 3); } }
    else if (kind === 2){ ctx.strokeStyle = "#4E9A5E"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h); ctx.stroke(); for (let k = 0; k < 4; k++){ const yy = -h * (.15 + k * .2); ctx.save(); ctx.translate(0, yy); ctx.rotate(k % 2 ? -.7 : .7); ctx.fillStyle = "#6DBB5E"; ctx.beginPath(); ctx.ellipse(0, -46, 14, 52, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); }
      ctx.fillStyle = "#F2C14E"; rr(ctx, 8, -h * .62, 30, 80, 14); ctx.fill(); ol(ctx, 4); }
    else { ctx.strokeStyle = "#3E8B4A"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -h * .5, 0, -h); ctx.stroke(); for (let k = 0; k < 3; k++){ ctx.fillStyle = "#5DB36A"; ctx.beginPath(); ctx.ellipse((k % 2 ? 1 : -1) * 40, -h * (.3 + k * .2), 44, 20, (k % 2 ? -.4 : .4), 0, TAU); ctx.fill(); ol(ctx, 3); }
      ctx.save(); ctx.translate(0, -h); for (let k = 0; k < 14; k++){ ctx.save(); ctx.rotate(k / 14 * TAU + t * .3); ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.ellipse(0, -62, 18, 36, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = "#6B4426"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "petak", "Cerita: empat petak tanaman (jenis reksa dana) bergoyang makin kencang, lalu layu sesaat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x0: 260, gap: 360, gy: GY - 70 }, f.petak || {});
    const plots = (K.plots || []).map((p, j) => Object.assign({ T: T(s, p.cue, .2, idx), j }, p)), tWind = T(s, K.windCue, .3, idx), tDroop = T(s, K.droopCue, .3, idx), tStamp = T(s, K.stampCue, .5, idx);
    const droop = t < tDroop ? 0 : Math.sin(clamp((t - tDroop) / 1.6, 0, 1) * Math.PI);
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true },
      spots: Object.fromEntries(plots.map((p, j) => ["p" + j, [K.x0 + j * K.gap, K.gy - 420, 1.02]])),
      back: () => {
        plots.forEach((p, j) => { const x = K.x0 + j * K.gap, q = t < p.T ? 0 : eBack(clamp((t - p.T) / .5, 0, 1));
          ctx.fillStyle = "#6B4426"; rr(ctx, x - 160, K.gy - 30, 320, 90, 14); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#4A2D1B"; ctx.beginPath(); ctx.ellipse(x, K.gy - 26, 140, 16, 0, 0, TAU); ctx.fill();
          if (q <= 0) return; const amp = [.03, .07, .13, .28][j] * (t > tWind ? 1 : .3), w = Math.sin(t * (1.5 + j * .7) + j) * amp;
          let h = [120, 300, 380, 520][j] * q; if (j === 3 && t > tWind){ h *= 1 + .35 * Math.sin(t * 2.2); }
          const dr = droop * [.15, .35, .5, .95][j];
          ctx.save(); ctx.translate(x, K.gy - 30); ctx.scale(K.ps || 1.45, K.ps || 1.45); plantKind(ctx, j, 0, 0, h * (1 - dr * .35), w + dr * (j % 2 ? -.6 : .6), t, j); ctx.restore();
          // label stake
          ctx.save(); ctx.translate(x, K.gy + 20); ctx.scale(q * 1.2, q * 1.2); ctx.rotate(-.04 + j * .03); rr(ctx, -130, -10, 260, 66, 10); ctx.fillStyle = [GREEN, TEAL, ORANGE, RED][j]; ctx.fill(); ol(ctx, 5);
          textC(ctx, p.label, 0, 34, 30, "#FFFFFF", 900, 230); ctx.restore(); });
        // wind streaks, stronger to the right
        if (t > tWind) for (let i = 0; i < 14; i++){ const q = ((t * .8 + i / 14) % 1), y = K.gy - 200 - (i % 7) * 80, x = K.x0 - 300 + q * (K.gap * 4 + 400); ctx.strokeStyle = hexA("#FFFFFF", .7 * Math.sin(q * Math.PI)); ctx.lineWidth = 3 + (x - K.x0) / K.gap * 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 60, y - 20, x + 140, y); ctx.stroke(); }
      },
      over: () => { if (t >= tStamp) stampBox(ctx, K.stamp || "TIDAK DIJAMIN LPS", 540, 330, t - tStamp, RED, 60, -.06);
        if (t >= tDroop && t < tDroop + 1.4){ popWord(ctx, K.droopWord || "BISA TURUN", 540, 520, t - tDroop, { size: 90, hold: 1.4, col: RED }); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.petak || {}; (K.plots || []).forEach((p, j) => add(cueT(s, p.cue, .2, i), "pop")); if (K.windCue) add(cueT(s, K.windCue, .3, i), "whoosh"); if (K.droopCue) add(cueT(s, K.droopCue, .3, i), "whoosh"); if (K.stampCue) add(cueT(s, K.stampCue, .5, i), "ping"); });

  /* ================= SC44: _pot (balcony at night: checks, then one coin into a small pot, a sprout grows) ================= */
  TT.scene(PX + "pot", "Cerita: balkon malam, cek izin, satu koin ke pot kecil, tunas tumbuh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 760 }, f.pot || {});
    const tCoin = T(s, K.coinCue, .4, idx), tGrow = tCoin + .55, top = GY - 300;
    base(ctx, s, t, { env: "night", envOpt: {},
      spots: { pot: [K.x, top - 160, 1.25] },
      back: () => { // balcony railing
        ctx.fillStyle = "#3A2C3E"; ctx.fillRect(-2600, GY - 380, 6400, 18); for (let x = -2600; x < 3800; x += 60){ ctx.fillRect(x, GY - 380, 10, 380); } ctx.fillStyle = "#5B4A5E"; ctx.fillRect(-2600, GY - 392, 6400, 22); },
      mid: () => { // small table + pot + tag
        ctx.fillStyle = "#6B4426"; rr(ctx, K.x - 170, top, 340, 26, 8); ctx.fill(); ol(ctx, 5); ctx.fillRect(K.x - 10, top + 26, 20, GY - top - 26); rr(ctx, K.x - 90, GY - 16, 180, 16, 6); ctx.fill();
        const g = t < tGrow ? .05 : eBack(clamp((t - tGrow) / .8, 0, 1)) * (1 + .25 * clamp((t - tGrow - 1) / 2, 0, 1));
        ctx.save(); ctx.translate(K.x, top); ctx.scale(1.6, 1.6); potPlant(ctx, Math.max(.05, g), t, ""); ctx.restore();
        if (t >= tGrow){ glowAt(ctx, K.x, top - 260, 300, "#FFE9A8", .35 * clamp((t - tGrow) / .5, 0, 1)); burstFx(ctx, K.x, top - 260, t - tGrow, GREEN, 10, 180); }
        if (t >= tCoin && t < tGrow + .1){ const q = clamp((t - tCoin) / .55, 0, 1); coin(ctx, K.x, top - 520 + q * q * 360, 34, t * 10); }
      }, midZ: .5,
      over: () => { if (t >= tGrow) popChip(ctx, K.tag || "MULAI KECIL", 760, 760, t - tGrow - .3, GREEN, "#FFFFFF", 40, -.05); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pot || {}; if (K.coinCue){ add(cueT(s, K.coinCue, .4, i), "whoosh"); add(cueT(s, K.coinCue, .4, i) + .55, "chime"); } });

  /* ================= MS44 helpers: road in perspective, car front / rear ================= */
  function perspRoad(ctx, t, o){ // screen-ish world coords; o: {hy (horizon), speed (lane scroll), w0, w1, yb}
    const hy = o.hy, yb = o.yb || 2000, vx = o.vx ?? 540, sp = o.pos || 0;
    ctx.fillStyle = "#7FA563"; ctx.fillRect(-2600, hy, 6400, 3000);
    ctx.fillStyle = "#6E655E"; ctx.beginPath(); ctx.moveTo(vx - 30, hy); ctx.lineTo(vx + 30, hy); ctx.lineTo(vx + (o.w1 || 1500), yb); ctx.lineTo(vx - (o.w1 || 1500), yb); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F2E6D0"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(vx + d * 26, hy); ctx.lineTo(vx + d * 30, hy); ctx.lineTo(vx + d * ((o.w1 || 1500) - 40), yb); ctx.lineTo(vx + d * ((o.w1 || 1500) - 90), yb); ctx.closePath(); ctx.fill(); });
    // centre dashes: z in (0,1], screen y = hy + (yb-hy) * (z^2)
    for (let i = 0; i < 12; i++){ let z = ((i / 12) + sp) % 1; const z2 = Math.min(1, z + .035); const ya = hy + (yb - hy) * z * z, yc = hy + (yb - hy) * z2 * z2, wa = 3 + 30 * z, wc = 3 + 30 * z2;
      ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.moveTo(vx - wa / 2, ya); ctx.lineTo(vx + wa / 2, ya); ctx.lineTo(vx + wc / 2, yc); ctx.lineTo(vx - wc / 2, yc); ctx.closePath(); ctx.fill(); }
    // roadside trees / posts streaming outward
    for (let i = 0; i < 10; i++){ const z = ((i / 10) + sp * .8) % 1, zz = .06 + z * .94, y = hy + (yb - hy) * zz * zz, side = i % 2 ? 1 : -1, x = vx + side * (60 + (o.w1 || 1500) * 1.15 * zz * zz), s = .12 + zz * 1.6;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (i % 4 < 2){ ctx.fillStyle = "#6B4426"; rr(ctx, -14, -220, 28, 220, 6); ctx.fill(); ctx.fillStyle = i % 3 ? "#3E8B4A" : "#4E9A5E"; ctx.beginPath(); ctx.arc(0, -260, 110, 0, TAU); ctx.arc(-70, -210, 70, 0, TAU); ctx.arc(70, -210, 70, 0, TAU); ctx.fill(); }
      else { ctx.fillStyle = "#3B2418"; rr(ctx, -8, -420, 16, 420, 4); ctx.fill(); ctx.fillRect(-8 * side, -420, -70 * side, 12); ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.ellipse(-70 * side, -404, 20, 10, 0, 0, TAU); ctx.fill(); }
      ctx.restore(); } }
  function carFront(ctx, x, y, w, col, t, o){ // y = bottom of wheels; returns nothing. Draws body with windshield hole.
    o = o || {}; const h = w * .62, top = y - h * 1.18, wsT = top + w * .04, wsB = y - h * .48, bob = o.bob || 0;
    ctx.save(); ctx.translate(x, bob);
    // wheels
    ctx.fillStyle = "#2B1A12"; rr(ctx, -w * .46, y - 90, w * .17, 90, 18); ctx.fill(); rr(ctx, w * .29, y - 90, w * .17, 90, 18); ctx.fill();
    // body path with windshield hole
    ctx.beginPath(); ctx.moveTo(-w * .5, y - 70); ctx.lineTo(-w * .5, wsB + 30); ctx.quadraticCurveTo(-w * .5, wsB - 10, -w * .44, wsB - 20); ctx.lineTo(-w * .36, top + 40); ctx.quadraticCurveTo(-w * .33, top, -w * .27, top); ctx.lineTo(w * .27, top); ctx.quadraticCurveTo(w * .33, top, w * .36, top + 40); ctx.lineTo(w * .44, wsB - 20); ctx.quadraticCurveTo(w * .5, wsB - 10, w * .5, wsB + 30); ctx.lineTo(w * .5, y - 70); ctx.quadraticCurveTo(w * .5, y - 40, w * .45, y - 40); ctx.lineTo(-w * .45, y - 40); ctx.quadraticCurveTo(-w * .5, y - 40, -w * .5, y - 70); ctx.closePath();
    ctx.moveTo(-w * .4, wsB); ctx.lineTo(-w * .31, wsT + 30); ctx.lineTo(w * .31, wsT + 30); ctx.lineTo(w * .4, wsB); ctx.closePath();
    ctx.fillStyle = col; ctx.fill("evenodd"); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.lineJoin = "round"; ctx.stroke();
    // glass sheen
    ctx.save(); ctx.beginPath(); ctx.moveTo(-w * .4, wsB); ctx.lineTo(-w * .31, wsT + 30); ctx.lineTo(w * .31, wsT + 30); ctx.lineTo(w * .4, wsB); ctx.closePath(); ctx.clip();
    const sh = ((t * .25) % 1.6) - .3; ctx.fillStyle = hexA("#FFFFFF", .16); ctx.beginPath(); ctx.moveTo(-w * .5 + sh * w, wsT); ctx.lineTo(-w * .38 + sh * w, wsT); ctx.lineTo(-w * .58 + sh * w, wsB); ctx.lineTo(-w * .7 + sh * w, wsB); ctx.fill(); ctx.restore();
    // hood details, grille, lights, bumper
    ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w * .2, wsB + 40); ctx.quadraticCurveTo(0, wsB + 70, w * .2, wsB + 40); ctx.stroke();
    rr(ctx, -w * .2, y - h * .34, w * .4, h * .16, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 4; for (let i = 1; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-w * .2 + 8, y - h * .34 + i * h * .04); ctx.lineTo(w * .2 - 8, y - h * .34 + i * h * .04); ctx.stroke(); }
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * w * .36, y - h * .27, w * .085, h * .07, 0, 0, TAU); ctx.fillStyle = o.lights ? "#FFF3B0" : "#FFF4E6"; ctx.fill(); ol(ctx, 5);
      if (o.hazard){ const on = Math.floor(t * 3) % 2 === 0; ctx.beginPath(); ctx.ellipse(d * w * .44, y - h * .2, w * .03, h * .035, 0, 0, TAU); ctx.fillStyle = on ? "#FFB020" : "#8E5A1E"; ctx.fill(); ol(ctx, 3); if (on) glowAt(ctx, d * w * .44, y - h * .2, 80, "#FFB020", .6); } });
    rr(ctx, -w * .5, y - 80, w, 46, 18); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5); rr(ctx, -w * .1, y - 76, w * .2, 38, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); textC(ctx, o.plate || "B 44 MS", 0, y - 47, 24, OUT, 900, w * .18);
    // mirrors
    [-1, 1].forEach(d => { rr(ctx, d * w * .5 - (d > 0 ? 0 : w * .08), wsB - 70, w * .08, 50, 12); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); });
    ctx.restore(); return { wsT, wsB, top }; }
  function carRear(ctx, x, y, w, col, t, o){ o = o || {}; const h = w * .62, top = y - h * 1.15, wT = top + 30, wB = y - h * .5;
    ctx.save(); ctx.translate(x, 0);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, y + 6, w * .55, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2B1A12"; rr(ctx, -w * .46, y - 80, w * .16, 80, 16); ctx.fill(); rr(ctx, w * .3, y - 80, w * .16, 80, 16); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-w * .5, y - 60); ctx.lineTo(-w * .5, wB); ctx.lineTo(-w * .36, top + 30); ctx.quadraticCurveTo(-w * .33, top, -w * .26, top); ctx.lineTo(w * .26, top); ctx.quadraticCurveTo(w * .33, top, w * .36, top + 30); ctx.lineTo(w * .5, wB); ctx.lineTo(w * .5, y - 60); ctx.quadraticCurveTo(w * .5, y - 36, w * .45, y - 36); ctx.lineTo(-w * .45, y - 36); ctx.quadraticCurveTo(-w * .5, y - 36, -w * .5, y - 60); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ol(ctx, 8);
    // rear window with silhouettes
    ctx.beginPath(); ctx.moveTo(-w * .4, wB - 10); ctx.lineTo(-w * .3, wT + 20); ctx.lineTo(w * .3, wT + 20); ctx.lineTo(w * .4, wB - 10); ctx.closePath(); ctx.fillStyle = "#3E5468"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.clip(); ctx.fillStyle = "#1E2A36"; ctx.beginPath(); ctx.arc(w * .12, wB - 10, 70, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(w * .12, wB - 110, 46, 0, TAU); ctx.fill();
    if (o.glow){ glowAt(ctx, w * .12, wB - 60, 120, "#9FE8FF", .5 * o.glow); } ctx.fillStyle = hexA("#FFFFFF", .15); ctx.fillRect(-w * .3, wT + 30, w * .1, wB - wT - 50); ctx.restore();
    // tail lights + hazards
    const on = o.hazard && Math.floor(t * 3) % 2 === 0;
    [-1, 1].forEach(d => { rr(ctx, d * w * .44 - w * .05, wB + 30, w * .1, h * .16, 10); ctx.fillStyle = o.brake ? "#FF4A3A" : "#B3202F"; ctx.fill(); ol(ctx, 4);
      rr(ctx, d * w * .44 - w * .05, wB + 30 + h * .17, w * .1, h * .07, 8); ctx.fillStyle = on ? "#FFB020" : "#8E5A1E"; ctx.fill(); ol(ctx, 3); if (on) glowAt(ctx, d * w * .44, wB + 50 + h * .17, 120, "#FFB020", .55); });
    rr(ctx, -w * .5, y - 70, w, 40, 16); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5); rr(ctx, -w * .1, y - 130, w * .2, 46, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); textC(ctx, o.plate || "B 44 MS", 0, y - 96, 26, OUT, 900, w * .18);
    if (o.exhaust){ smoke(ctx, -w * .35, y - 50, t, o.exhaust, { n: 5, h: 160, s: .7, drift: -60, col: "#B8AE9D" }); }
    ctx.restore(); }
  function phoneMount(ctx, x, y, s, t, k, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const buzz = o.buzz ? Math.sin(t * 60) * 4 : 0; ctx.translate(buzz, 0);
    ctx.fillStyle = "#2C2433"; rr(ctx, -12, 0, 24, 70, 6); ctx.fill(); rr(ctx, -90, -170, 180, 300, 26); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 6); rr(ctx, -76, -152, 152, 264, 16); ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fill();
    for (let i = 0; i < (o.lines ?? 4); i++){ const r = i % 2; rr(ctx, r ? -10 : -66, -136 + i * 56, 76, 38, 12); ctx.fillStyle = r ? "#D7F5C9" : "#FFFFFF"; ctx.fill(); }
    if (o.badge){ ctx.beginPath(); ctx.arc(80, -164, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, o.badge, 80, -152, 30, "#FFFFFF", 900); }
    if (o.buzz){ ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 5; [-1, 1].forEach(d => { for (let j = 0; j < 2; j++){ ctx.beginPath(); ctx.arc(0, -20, 130 + j * 26, d > 0 ? -.4 : Math.PI - .4, d > 0 ? .4 : Math.PI + .4); ctx.stroke(); } }); }
    if (o.glow) glowAt(ctx, 0, -20, 260, "#BFE2EA", .35 * o.glow);
    ctx.restore(); }

  /* ================= MS44: _depan (car seen head-on driving at dusk; phone on the dash buzzes; the driver glances) ================= */
  TT.scene(PX + "depan", "Cerita: mobil tampak depan melaju sore, ponsel di dasbor bergetar, pengemudi melirik", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, y: 1790, w: 980, col: "#2F6F73" }, f.depan || {});
    const tBuzz = T(s, K.buzzCue, .3, idx), tGroup = T(s, K.groupCue, .3, idx), tLook = T(s, K.lookCue, .3, idx), bob = Math.sin(t * 9) * 4;
    const px = K.x + K.w * .17, py = K.y - K.w * .62 * .48 - 20;
    base(ctx, s, t, { env: "sunset", envOpt: {},
      spots: { phone: [px - 60, py - 140, 1.25], car: [K.x, 1180, .86] },
      back: (ctx2, c, sts) => {
        perspRoad(ctx, t, { hy: 1060, yb: 2300, w1: 1300, pos: t * .55 });
        sts.forEach(st => { st.y += bob; });
        // car interior behind the windshield
        const h = K.w * .62, top = K.y - h * 1.18; ctx.fillStyle = "#3A2C2A"; rr(ctx, K.x - K.w * .42, top + 20, K.w * .84, h * .9, 30); ctx.fill();
        ctx.fillStyle = "#5A3A2A"; rr(ctx, K.x - K.w * .36, top + 120, K.w * .26, 360, 40); ctx.fill(); rr(ctx, K.x + K.w * .1, top + 120, K.w * .26, 360, 40); ctx.fill();
      },
      front: (ctx2, c, sts) => {
        ctx.save(); ctx.beginPath(); ctx.rect(-2600, K.y - 75, 6400, 3000); ctx.clip(); perspRoad(ctx, t, { hy: 1060, yb: 2300, w1: 1300, pos: t * .55 }); ctx.restore();
        ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(K.x, K.y - 4, K.w * .55, 30, 0, 0, TAU); ctx.fill();
        const r = carFront(ctx, K.x, K.y, K.w, K.col, t, { bob, lights: true });
        // steering wheel in front of the driver
        const d = sts[0]; if (d){ ctx.save(); ctx.translate(d.x, r.wsB + 10 + bob); ctx.rotate(Math.sin(t * 1.3) * .08); ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.ellipse(0, 0, 150, 60, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke(); ctx.strokeStyle = "#4A3A3A"; ctx.lineWidth = 22; ctx.stroke(); ctx.restore(); }
        phoneMount(ctx, px, py + bob, .62, t, 0, { buzz: t >= tBuzz && t < tBuzz + 2.2 || (t >= tGroup && t < tGroup + 1.2), badge: t >= tGroup ? String(Math.min(27, 3 + Math.floor((t - tGroup) * 9))) : (t >= tBuzz ? "3" : ""), glow: t >= tBuzz ? 1 : 0, screen: "#C9E4B8" });
        // notification bubbles flying out of the phone
        if (t >= tGroup) for (let i = 0; i < 6; i++){ const q = ((t - tGroup) * .7 + i / 6) % 1, k0 = (t - tGroup) * .7 + i / 6; if (k0 < i / 6 + .0001 && i > 0 && (t - tGroup) * .7 < i / 6) continue;
          const bx = px + (i % 2 ? 1 : -1) * (40 + q * 160), by = py - 160 - q * 520; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(bx, by); ctx.rotate((i % 2 ? .1 : -.1)); rr(ctx, -70, -30, 140, 60, 20); ctx.fillStyle = i % 2 ? "#D7F5C9" : "#FFFFFF"; ctx.fill(); ol(ctx, 4);
            for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(-30 + k * 30, 0, 7, 0, TAU); ctx.fillStyle = "#6B6470"; ctx.fill(); } ctx.restore(); }
        // sight line from the driver's eyes to the phone
        if (t >= tLook && d){ const hp = toonHead(d), q = clamp((t - tLook) / .4, 0, 1); ctx.save(); ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(hp[0] + 40, hp[1] + 10); ctx.lineTo(lerp(hp[0] + 40, px, q), lerp(hp[1] + 10, py - 40, q)); ctx.stroke(); ctx.restore(); }
      },
      over: () => { if (t >= tGroup) popChip(ctx, K.group || "GRUP KELUARGA", 700, 330, t - tGroup, GREEN, "#FFFFFF", 44, -.04); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.depan || {}; if (K.buzzCue){ const a = cueT(s, K.buzzCue, .3, i); add(a, "ping"); add(a + .4, "ping"); } if (K.groupCue){ const a = cueT(s, K.groupCue, .3, i); for (let k = 0; k < 4; k++) add(a + k * .3, "pop"); } if (K.lookCue) add(cueT(s, K.lookCue, .3, i), "whoosh"); });

  /* ================= MS44: _pov (driver's-eye view: eyes drop -> windshield goes dark while the metre count runs; a kid with a ball; brakes) ================= */
  TT.scene(PX + "pov", "Cerita: sudut pandang pengemudi, layar ponsel menelan pandangan (jalan jadi jendela mungil), anak mengejar bola, rem", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.pov || {});
    const tDark = T(s, K.darkCue, .2, idx), tUp = T(s, K.upCue, .3, idx), tKid = T(s, K.kidCue, .2, idx), tBrake = T(s, K.brakeCue, .2, idx);
    // road position: integrate speed (1 until brake, then decays to 0 in .7s)
    const v0 = .55, pos = t < tBrake ? t * v0 : tBrake * v0 + v0 * (Math.min(t - tBrake, .7) - Math.pow(Math.min(t - tBrake, .7), 2) / 1.4);
    const dark = t < tDark ? 0 : t < tUp ? clamp((t - tDark) / .35, 0, 1) : 1 - clamp((t - tUp) / .25, 0, 1);
    base(ctx, s, t, { env: "sunset", envOpt: {},
      back: () => { perspRoad(ctx, t, { hy: 820, yb: 1900, w1: 1150, pos }); },
      mid: () => {
        // the kid and the ball crossing ahead (appear when the eyes come back)
        if (t >= tUp - .05){ const k = t - tUp, approach = t < tBrake ? clamp(k / 2.2, 0, 1) * .25 + .55 : .8 + .04 * clamp((t - tBrake) / .7, 0, 1);
          const zz = approach, y = 820 + (1900 - 820) * zz * zz, sc = .3 + zz * 1.1, run = t < tBrake ? k * 120 : (tBrake - tUp) * 120;
          const kx = 900 - run, bx = kx - 230 - (t < tBrake ? 0 : Math.min(t - tBrake, 1) * 60);
          ctx.save(); ctx.translate(bx, y - (110 + Math.abs(Math.sin(t * 5)) * 200) * sc); ctx.scale(sc, sc); drawItem(ctx, "ball", 0, 0, t, { s: 1.5 }); ctx.restore();
          const actor = Object.assign({}, K.kid || {}, { x: kx, y, size: (K.kid && K.kid.size || 520) * sc, face: -1 }); const st = toonState(actor, s, t); TT.drawToon(ctx, actor, st, t);
          if (t >= tBrake && t < tBrake + 1.2){ ctx.save(); ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 10; ctx.lineCap = "round"; for (let i = 0; i < 2; i++){ ctx.beginPath(); ctx.moveTo(380 + i * 320, 1900); ctx.lineTo(420 + i * 240, 1500); ctx.stroke(); } ctx.restore(); }
        }
      }, midZ: 5,
      front: () => {
        // car interior frame: roof, A-pillars, dashboard, steering wheel, phone mount
        ctx.fillStyle = "#2C2026"; ctx.beginPath(); ctx.moveTo(-600, -800); ctx.lineTo(1680, -800); ctx.lineTo(1680, 2600); ctx.lineTo(-600, 2600); ctx.closePath();
        ctx.moveTo(40, 300); ctx.quadraticCurveTo(540, 250, 1040, 300); ctx.lineTo(1120, 1230); ctx.quadraticCurveTo(540, 1180, -40, 1230); ctx.closePath(); ctx.fill("evenodd");
        ctx.fillStyle = "#4A3A3A"; ctx.beginPath(); ctx.moveTo(-600, 1250); ctx.quadraticCurveTo(540, 1180, 1680, 1250); ctx.lineTo(1680, 2600); ctx.lineTo(-600, 2600); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        // mirror
        ctx.fillStyle = "#1E1A22"; rr(ctx, 440, 290, 200, 70, 20); ctx.fill(); ol(ctx, 4); rr(ctx, 452, 300, 176, 50, 14); ctx.fillStyle = "#9FB7C9"; ctx.fill();
        const tilt = t >= tBrake && t < tBrake + .8 ? Math.sin((t - tBrake) * 30) * .06 : Math.sin(t * 1.1) * .04;
        ctx.save(); ctx.translate(250, 1560); ctx.rotate(tilt); ctx.strokeStyle = OUT; ctx.lineWidth = 64; ctx.beginPath(); ctx.arc(0, 0, 330, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.strokeStyle = "#5A4A4A"; ctx.lineWidth = 46; ctx.stroke(); ctx.restore();
        phoneMount(ctx, 800, 1360, .8, t, 0, { glow: dark > .3 ? 1.6 : .6, screen: "#C9E4B8", badge: "27" });
        // the phone takes over the whole view; the road shrinks to a tiny inset
        if (dark > 0){ const q = eOut(dark), cx = lerp(800, 600, q), cy = lerp(1340, 900, q), w = lerp(150, 840, q), h = lerp(260, 1160, q);
          ctx.save(); ctx.fillStyle = hexA("#0B0A0E", .55 * q); ctx.fillRect(-600, -800, 2280, 3600); ctx.translate(cx, cy);
          rr(ctx, -w / 2 - 18, -h / 2 - 18, w + 36, h + 36, 40 * q + 10); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 8);
          ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 30 * q + 6); ctx.clip(); ctx.fillStyle = "#E7F4E4"; ctx.fillRect(-w / 2, -h / 2, w, h);
          const sc = w / 840; ctx.scale(sc, sc); const H2 = h / sc;
          ctx.fillStyle = GREEN; ctx.fillRect(-420, -H2 / 2, 840, 120); textL(ctx, "GRUP KELUARGA", -200, -H2 / 2 + 76, 42, "#FFFFFF", 900, 460); textL(ctx, "27", 300, -H2 / 2 + 76, 44, GOLD, 900);
          const scroll = (t * 140) % 170; for (let i = 0; i < 9; i++){ const y = -H2 / 2 + 170 + i * 170 - scroll, r = i % 3 === 1, bw = 360 + rnd(i) * 200; if (y > H2 / 2 + 40) continue;
            rr(ctx, r ? 400 - bw : -400, y, bw, 120, 30); ctx.fillStyle = r ? "#C9F0B8" : "#FFFFFF"; ctx.fill(); ol(ctx, 4);
            if (i % 3 === 2){ ctx.beginPath(); ctx.arc(-400 + bw / 2, y + 60, 44, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-416 + bw / 2, y + 50, 6, 0, TAU); ctx.arc(-384 + bw / 2, y + 50, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-400 + bw / 2, y + 62, 22, .3, Math.PI - .3); ctx.stroke(); }
            else for (let k = 0; k < 2; k++){ ctx.fillStyle = "#9AA6B2"; rr(ctx, (r ? 400 - bw : -400) + 30, y + 30 + k * 40, bw * (k ? .5 : .8), 18, 9); ctx.fill(); } }
          ctx.restore(); ctx.restore();
          // tiny road inset (what the eyes are missing)
          const ix = 70, iy = 170, iw = 330, ih = 230; ctx.save(); ctx.globalAlpha = q; rr(ctx, ix, iy, iw, ih, 16); ctx.save(); ctx.clip(); ctx.fillStyle = "#F4B98A"; ctx.fillRect(ix, iy, iw, ih); ctx.fillStyle = "#7FA563"; ctx.fillRect(ix, iy + ih * .45, iw, ih);
          ctx.fillStyle = "#6E655E"; ctx.beginPath(); ctx.moveTo(ix + iw / 2 - 8, iy + ih * .45); ctx.lineTo(ix + iw / 2 + 8, iy + ih * .45); ctx.lineTo(ix + iw, iy + ih); ctx.lineTo(ix, iy + ih); ctx.closePath(); ctx.fill();
          const sec = clamp((t - tDark) / Math.max(.6, tUp - tDark), 0, 1), kr = 14 + sec * 46; ctx.fillStyle = RED; rr(ctx, ix + iw * .62 - kr * .4, iy + ih * .62 + sec * 40 - kr, kr * .8, kr * 1.3, 8); ctx.fill(); ctx.beginPath(); ctx.arc(ix + iw * .62, iy + ih * .62 + sec * 40 - kr * 1.2, kr * .4, 0, TAU); ctx.fillStyle = "#C98B62"; ctx.fill();
          ctx.restore(); ctx.strokeStyle = Math.floor(t * 4) % 2 ? RED : "#FFFFFF"; ctx.lineWidth = 10; rr(ctx, ix, iy, iw, ih, 16); ctx.stroke(); chipW(ctx, "JALAN", ix + iw / 2, iy + ih + 34, RED, "#FFFFFF", 30); ctx.restore(); }
      },
      over: () => {
        if (dark > .2){ const k = t - tDark, sec = clamp((t - tDark) / Math.max(.6, (tUp - tDark)), 0, 1); ctx.save(); ctx.globalAlpha = clamp(dark * 1.4 - .3, 0, 1);
          popChip(ctx, K.eyes || "MATA DI LAYAR", 740, 250, k, RED, "#FFFFFF", 44, .03);
          outlineWords(ctx, [{ w: (sec * 2).toFixed(1).replace(".", ",") + " DETIK", hl: true }], 600, 1060, 110, { sw: 26, hl: "#FFFFFF" });
          outlineWords(ctx, [{ w: Math.round(sec * 33) + " METER", hl: true }], 600, 1190, 96, { sw: 22, hl: HL }); ctx.restore(); }
        if (t >= tBrake) popWord(ctx, K.brake || "CIIIT!", 540, 560, t - tBrake, { size: 150, hold: 1.6, rot: -8, col: RED });
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pov || {}; if (K.darkCue) add(cueT(s, K.darkCue, .2, i), "whoosh"); if (K.upCue) add(cueT(s, K.upCue, .3, i), "ping"); if (K.brakeCue){ const a = cueT(s, K.brakeCue, .2, i); add(a, "whoosh"); add(a + .1, "ping"); add(a + .3, "pop"); } });

  /* ================= MS44: _meter (top-down road ruler: 2 seconds at 60 km/h = about 33 metres blind) ================= */
  TT.scene(PX + "meter", "Cerita: jalan tampak atas seperti penggaris, mobil melaju 33 meter dengan mata tertutup", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ rx: 740, y0: 1240, y1: 330 }, f.meter || {});
    const tSpeed = T(s, K.speedCue, .3, idx), tTimer = T(s, K.timerCue, .3, idx), tDrive = T(s, K.driveCue, .2, idx), tFin = T(s, K.finCue, .6, idx), tBlind = T(s, K.blindCue, .3, idx);
    const prog = t < tDrive ? 0 : easeIO(clamp((t - tDrive) / Math.max(1.2, tFin - tDrive), 0, 1));
    base(ctx, s, t, { env: "info", envOpt: { spotX: 300 },
      mid: () => {
        const x = K.rx, w = 300; ctx.fillStyle = "#4A4A52"; rr(ctx, x - w / 2, K.y1 - 120, w, K.y0 - K.y1 + 260, 20); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#F2E6D0"; for (let y = K.y1 - 100; y < K.y0 + 120; y += 90) ctx.fillRect(x - 6, y, 12, 50); ctx.fillRect(x - w / 2 + 10, K.y1 - 110, 8, K.y0 - K.y1 + 240); ctx.fillRect(x + w / 2 - 18, K.y1 - 110, 8, K.y0 - K.y1 + 240);
        // ruler ticks on the right
        for (let m = 0; m <= 33; m++){ const y = lerp(K.y0, K.y1, m / 33), big = m % 10 === 0; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + w / 2 + 12, y - 2, big ? 50 : 24, 4); if (big) textL(ctx, m + " m", x + w / 2 + 70, y + 12, 34, "#FFFFFF", 800); }
        // finish line at 33 m
        ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2 + 4, K.y1 - 14, w - 8, 28); ctx.clip(); for (let i = 0; i < 20; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : RED; ctx.fillRect(x - w / 2 + i * 22, K.y1 - 14, 22, 14); ctx.fillStyle = i % 2 ? RED : "#FFFFFF"; ctx.fillRect(x - w / 2 + i * 22, K.y1, 22, 14); } ctx.restore();
        // trail + car (top view)
        const cy = lerp(K.y0, K.y1, prog); if (prog > 0){ ctx.fillStyle = hexA(RED, .35); ctx.fillRect(x - 70, cy, 140, K.y0 - cy); }
        ctx.save(); ctx.translate(x, cy + 80); rr(ctx, -80, -150, 160, 300, 50); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 6); rr(ctx, -62, -96, 124, 70, 18); ctx.fillStyle = "#9FB7C9"; ctx.fill(); ol(ctx, 4); rr(ctx, -58, 40, 116, 60, 16); ctx.fill(); ol(ctx, 4);
        rr(ctx, -50, -20, 100, 52, 10); ctx.fillStyle = "#24575A"; ctx.fill(); [-1, 1].forEach(d => { ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.ellipse(d * 48, -146, 18, 8, 0, 0, TAU); ctx.fill(); }); ctx.restore();
        if (prog > 0 && prog < 1) for (let i = 0; i < 6; i++){ ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 6; ctx.beginPath(); const yy = cy + 260 + i * 34; ctx.moveTo(x - 60 + i * 24, yy); ctx.lineTo(x - 60 + i * 24, yy + 70); ctx.stroke(); }
        // closed-eye badge riding on the car
        if (t >= tTimer){ const q = eBack(clamp((t - tTimer) / .4, 0, 1)); ctx.save(); ctx.translate(x - 220, cy + 60); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, -8, 40, .25, Math.PI - .25); ctx.stroke(); for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(k * 16, 28); ctx.lineTo(k * 20, 46); ctx.stroke(); }
          ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(50, 50); ctx.stroke(); ctx.restore(); }
      }, midZ: -1,
      over: (ctx2, c) => {
        // speedometer + stopwatch (screen)
        if (t >= tSpeed){ const q = eBack(clamp((t - tSpeed) / .4, 0, 1)), needle = clamp((t - tSpeed) / 1, 0, 1); ctx.save(); ctx.translate(270, 430); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 8);
          for (let k = 0; k <= 8; k++){ const a = Math.PI * .8 + k / 8 * Math.PI * 1.4; ctx.strokeStyle = k > 5 ? RED : OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 118, Math.sin(a) * 118); ctx.lineTo(Math.cos(a) * 138, Math.sin(a) * 138); ctx.stroke(); }
          const a = Math.PI * .8 + (needle * 60 / 120) * Math.PI * 1.4 + Math.sin(t * 20) * .01; ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 110, Math.sin(a) * 110); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
          textC(ctx, String(Math.round(needle * 60)), 0, 80, 64, BROWN, 900); textC(ctx, "km/jam", 0, 118, 28, ORANGE, 900); ctx.restore(); }
        if (t >= tTimer){ const q = eBack(clamp((t - tTimer) / .4, 0, 1)), sec = Math.min(2, Math.max(0, (t - tDrive) * 2 / Math.max(1.2, tFin - tDrive))); ctx.save(); ctx.translate(270, 700); ctx.scale(q, q); rr(ctx, -150, -60, 300, 120, 24); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6);
          textC(ctx, sec.toFixed(1).replace(".", ",") + " dtk", 0, 22, 60, GOLD, 900, 260); ctx.restore(); }
        if (t >= tFin) stampBox(ctx, K.stamp || "± 33 METER", 560, 900, t - tFin, RED, 80, -.05);
        if (t >= tBlind) popChip(ctx, K.blind || "TANPA MELIHAT JALAN", 540, 228, t - tBlind, RED, "#FFFFFF", 44, .03);
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.meter || {}; if (K.speedCue) add(cueT(s, K.speedCue, .3, i), "whoosh"); if (K.timerCue) add(cueT(s, K.timerCue, .3, i), "pop"); if (K.driveCue) add(cueT(s, K.driveCue, .2, i), "whoosh"); if (K.finCue) add(cueT(s, K.finCue, .6, i), "ping"); if (K.blindCue) add(cueT(s, K.blindCue, .3, i), "pop"); });

  /* ================= MS44: _menepi (car seen from behind: phone bag on the back seat; pulls over to a safe spot with hazards, then replies) ================= */
  TT.scene(PX + "menepi", "Cerita: mobil tampak belakang, tas ponsel di jok belakang, menepi ke tempat aman dengan lampu hazard, baru membalas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x0: 540, x1: 820, w: 760, col: "#2F6F73" }, f.menepi || {});
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      back: (ctx2, c, sts, R) => { const M = R.f.car; if (!M) return;
        const tPull = T(s, M.pullCue, .3, idx), tReply = T(s, M.replyCue, .3, idx), q = t < tPull ? 0 : easeIO(clamp((t - tPull) / 1.4, 0, 1));
        // asphalt + safe bay
        ctx.fillStyle = "#6E655E"; ctx.fillRect(-2600, GY - 150, 6400, 2000); ctx.fillStyle = "#F2E6D0"; for (let x = -2600; x < 3800; x += 240) ctx.fillRect(x - ((M.drive && t < tPull + 1.4) ? (t * 600) % 240 : 0), GY + 40, 130, 16);
        ctx.fillStyle = "#8C9A86"; ctx.fillRect(900, GY - 150, 1400, 200); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(900, GY - 150, 10, 200);
        // sign TEMPAT AMAN
        const sq = t < tPull ? .0 : eBack(clamp((t - tPull) / .5, 0, 1)); if (sq > 0){ ctx.save(); ctx.translate(1080, GY - 150); ctx.scale(sq, sq); ctx.fillStyle = "#6B6470"; rr(ctx, -10, -560, 20, 560, 6); ctx.fill(); ol(ctx, 4);
          rr(ctx, -150, -720, 300, 180, 18); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6); textC(ctx, "P", 0, -608, 96, "#FFFFFF", 900); textC(ctx, M.sign || "TEMPAT AMAN", 0, -560 + 0, 30, "#FFFFFF", 900, 260); ctx.restore(); }
        const carX = M.drive ? lerp(K.x0, K.x1, q) : (M.x ?? 780), cw = K.w * (1 - q * .12);
        carRear(ctx, carX, GY - 20 + (q > 0 && q < 1 ? Math.sin(q * 20) * 3 : 0), cw, K.col, t, { hazard: t >= tPull + .8, brake: q > .6 && q < 1, exhaust: M.drive ? .8 : .3, glow: t >= tReply ? 1 : 0 });
        R._reply = t >= tReply ? t - tReply : -1; R._carX = carX;
        if (M.bagCue){ const tBag = T(s, M.bagCue, .3, idx), h = cw * .62, wB = GY - 20 - h * .5, tx = carX - cw * .15, ty = wB - 70;
          if (t >= tBag){ const k = clamp((t - tBag) / .6, 0, 1), st = sts[0], hp = st ? handOf(st) : [300, 1300], x = lerp(hp[0], tx, k), y = lerp(hp[1], ty, k) - Math.sin(k * Math.PI) * 260;
            drawItem(ctx, "bag", x, y + 60, t, { s: lerp(1, .55, k), col: "#C2691F", rot: k * 6.28 * (k < 1 ? 1 : 0) }); if (k >= 1) burstFx(ctx, tx, ty, t - tBag - .6, ORANGE, 8, 110); } }
      },
      over: (ctx2, c, sts, R) => { if (R._reply >= 0){ const p = c.toScreen(R._carX + 60, GY - K.w * .62 * 1.2 - 80); TT.bubble(ctx, (R.f.car && R.f.car.reply) || "OTW, 15 menit lagi", p[0], p[1], R._reply, { kind: "say", size: 46 }); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.shots || []).forEach(sh => { const M = sh.car; if (!M) return; if (M.pullCue) add(cueT(s, M.pullCue, .3, i), "whoosh"); if (M.replyCue) add(cueT(s, M.replyCue, .3, i), "pop"); }); });

  /* ================= SB45 backdrops (f.bg) ================= */
  BG.lobi = (ctx, t, o) => { // office lobby by the stairs: marble wall, floor directory board, stair rail, plants
    ctx.fillStyle = "#E9DDCB"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.strokeStyle = hexA("#B9A58E", .5); ctx.lineWidth = 3; for (let x = -2600; x < 3800; x += 240){ ctx.beginPath(); ctx.moveTo(x, -1200); ctx.lineTo(x, GY - 190); ctx.stroke(); }
    // stairs going up on the left
    for (let i = 0; i < 9; i++){ ctx.fillStyle = i % 2 ? "#C9B79C" : "#D6C5AA"; ctx.fillRect(-700 + i * 70, GY - 190 - (i + 1) * 70, 900, 70); } ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-700, GY - 330); ctx.lineTo(-70, GY - 960); ctx.stroke();
    // directory board
    const dx = o.boardX ?? 720, dy = 430; rr(ctx, dx - 250, dy, 500, 470, 16); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 8); textC(ctx, "PETUNJUK LANTAI", dx, dy + 66, 40, GOLD, 900, 440);
    const rows = o.rows || [["LT 3", "KEUANGAN"], ["LT 2", "PEMASARAN"], ["LT 1", "GUDANG"]], hi = o.hi ?? 0, here = o.here ?? 2;
    rows.forEach((r, i) => { const y = dy + 130 + i * 105, lit = i === hi && Math.floor(t * 3) % 2 === 0; rr(ctx, dx - 220, y, 440, 84, 10); ctx.fillStyle = lit ? ORANGE : hexA("#FFFFFF", .12); ctx.fill();
      textL(ctx, r[0], dx - 200, y + 56, 36, GOLD, 900); textL(ctx, r[1], dx - 80, y + 56, 40, "#FFFFFF", 900, 280);
      if (i === here){ ctx.beginPath(); ctx.arc(dx + 260, y + 42, 26, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textL(ctx, "KAMU DI SINI", dx + 296, y + 54, 26, RED, 900, 200); } });
    // plants + floor
    [dx + 420, -220].forEach(px => { ctx.fillStyle = "#C2691F"; rr(ctx, px - 50, GY - 300, 100, 110, 10); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#4E9A5E"; for (let k = 0; k < 5; k++){ ctx.save(); ctx.translate(px, GY - 300); ctx.rotate(-1 + k * .5 + Math.sin(t + k) * .05); ctx.beginPath(); ctx.ellipse(0, -90, 22, 90, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); } });
    ctx.fillStyle = "#CDBFA8"; ctx.fillRect(-2600, GY - 190, 6400, 2000); ctx.strokeStyle = hexA(OUT, .1); for (let x = -2600; x < 3800; x += 160){ ctx.beginPath(); ctx.moveTo(x, GY - 190); ctx.lineTo(x - 80, GY + 300); ctx.stroke(); }
  };
  BG.keuangan = (ctx, t, o) => { // finance room: pale green wall, filing cabinets, window, wall clock, desk row
    ctx.fillStyle = "#DCE8DF"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#C3D6C8"; ctx.fillRect(-2600, GY - 560, 6400, 370);
    rr(ctx, 120, 420, 420, 380, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 8); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(330, 420); ctx.lineTo(330, 800); ctx.stroke();
    rr(ctx, 620, 450, 380, 110, 12); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, o.sign || "KEUANGAN", 810, 525, 54, "#FFFFFF", 900, 340);
    for (let i = 0; i < 3; i++){ const cx = 1100 + i * 150; rr(ctx, cx, GY - 600, 130, 600, 8); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5); for (let d = 0; d < 4; d++){ rr(ctx, cx + 14, GY - 580 + d * 145, 102, 120, 6); ctx.fillStyle = "#B8C2CC"; ctx.fill(); ol(ctx, 3); rr(ctx, cx + 45, GY - 530 + d * 145, 40, 12, 6); ctx.fillStyle = OUT; ctx.fill(); } }
    ctx.fillStyle = "#B7A58E"; ctx.fillRect(-2600, GY - 190, 6400, 2000); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let x = -2600; x < 3800; x += 120){ ctx.beginPath(); ctx.moveTo(x, GY - 190); ctx.lineTo(x - 60, GY + 300); ctx.stroke(); }
  };

  /* ================= SB45: _pantul (outside the finance room's glass wall: knocks, greetings bounce off the glass, nobody looks) ================= */
  function deskSide(ctx, x, top, w, col){ rr(ctx, x - w / 2, top, w, 30, 8); ctx.fillStyle = col || "#E8A55B"; ctx.fill(); ol(ctx, 5); rr(ctx, x - w / 2 + 16, top + 30, w - 32, GY - top - 30, 6); ctx.fillStyle = hexA("#8E5A34", 1); ctx.fill(); ol(ctx, 5); }
  function binders(ctx, x, top, n, t, i0){ for (let i = 0; i < n; i++){ const h = 110 + rnd(i + i0) * 50; rr(ctx, x + i * 34, top - h, 30, h, 4); ctx.fillStyle = ["#D9483B", "#3E7DB5", "#F6C343", "#3E9B5A"][(i + i0) % 4]; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + i * 34 + 6, top - h + 16, 18, 26); } }
  TT.scene(PX + "pantul", "Cerita: di luar dinding kaca ruang keuangan, sapaan menempel di kaca lalu melorot ke bawah, tak ada yang menoleh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ gx0: 360, gx1: 1500, desks: [560, 900, 1240] }, f.pantul || {});
    const tKnock = T(s, K.knockCue, .2, idx), tQ = T(s, K.qCue, .3, idx), tClock = T(s, K.clockCue, .3, idx);
    const bubs = (K.bubbles || []).map((b, j) => Object.assign({ T: T(s, b.cue, .3 + j * .1, idx), j }, b));
    const top = GY - 260;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { glass: [(K.gx0 + K.gx1) / 2 - 100, GY - 560, .82] },
      back: () => { // inside room (behind glass)
        ctx.fillStyle = "#DCE8DF"; ctx.fillRect(K.gx0, GY - 980, K.gx1 - K.gx0, 980); ctx.fillStyle = "#C3D6C8"; ctx.fillRect(K.gx0, GY - 520, K.gx1 - K.gx0, 330);
        // wall clock inside
        const cx = (K.gx0 + K.gx1) / 2 + 60, cy = GY - 780, sp = t > tClock ? 9 : .4; ctx.beginPath(); ctx.arc(cx, cy, 70, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ol(ctx, 8); ctx.strokeStyle = BROWN; ctx.lineCap = "round"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * sp) * 52, cy - Math.cos(t * sp) * 52); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * sp / 12 + 1) * 32, cy - Math.cos(t * sp / 12 + 1) * 32); ctx.stroke();
        textC(ctx, K.sign || "KEUANGAN", (K.gx0 + K.gx1) / 2 - 280, GY - 840, 56, TEAL, 900, 420);
        ctx.fillStyle = "#B7A58E"; ctx.fillRect(K.gx0, GY - 190, K.gx1 - K.gx0, 190); },
      mid: () => {
        K.desks.forEach((x, i) => { deskSide(ctx, x, top, 300, "#E8A55B"); binders(ctx, x - 130, top, 4, t, i * 3); rr(ctx, x + 20, top - 120, 120, 90, 8); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#9FE8FF"; rr(ctx, x + 30, top - 110, 100, 64, 4); ctx.fill();
          // typing dots
          for (let k = 0; k < 3; k++){ const q = (t * 2 + k / 3 + i * .3) % 1; ctx.fillStyle = hexA(OUT, Math.sin(q * Math.PI)); ctx.beginPath(); ctx.arc(x + 50 + k * 30, top - 170 - q * 20, 7, 0, TAU); ctx.fill(); } });
        // glass wall with frame + door
        ctx.fillStyle = hexA("#CDEBF5", .38); ctx.fillRect(K.gx0, GY - 980, K.gx1 - K.gx0, 980); ctx.strokeStyle = "#5B6B78"; ctx.lineWidth = 16; ctx.strokeRect(K.gx0, GY - 980, K.gx1 - K.gx0, 980);
        ctx.lineWidth = 10; [K.gx0 + 330, K.gx1 - 420].forEach(x => { ctx.beginPath(); ctx.moveTo(x, GY - 980); ctx.lineTo(x, GY); ctx.stroke(); });
        ctx.fillStyle = "#5B6B78"; rr(ctx, K.gx0 + 290, GY - 560, 22, 160, 8); ctx.fill();
        ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = "#FFFFFF"; for (let k = 0; k < 3; k++){ const sx = K.gx0 + 80 + k * 380 + ((t * 30) % 60); ctx.beginPath(); ctx.moveTo(sx, GY - 960); ctx.lineTo(sx + 60, GY - 960); ctx.lineTo(sx - 140, GY - 40); ctx.lineTo(sx - 200, GY - 40); ctx.closePath(); ctx.fill(); } ctx.restore();
        // knock ripples
        if (t >= tKnock && t < tKnock + 1.4){ for (let k = 0; k < 2; k++){ const kk = (t - tKnock - k * .35); if (kk < 0 || kk > .8) continue; ctx.strokeStyle = hexA("#FFFFFF", 1 - kk / .8); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(K.gx0 + 160, GY - 600, 30 + kk * 160, 0, TAU); ctx.stroke(); } }
      }, midZ: 0,
      front: (ctx2, c, sts) => {
        const d = sts[K.hero ?? 0]; if (!d) return; const hp = toonHead(d), mouth = [hp[0] + 120, hp[1] + 60];
        // bubbles: fly to the glass (shrink), splat flat on it and slowly slide down the pane to a heap at its foot
        bubs.forEach((b, j) => { const k = t - b.T; if (k < 0) return; const gx = K.gx0 + 230 + j * 150, gy = hp[1] - 60 - j * 30, footY = GY - 70 - j * 40;
          let x, y, sx, sy, rot = (j % 2 ? .08 : -.08); if (k < .5){ const q = eOut(k / .5); x = lerp(mouth[0], gx, q); y = lerp(mouth[1], gy, q); sx = sy = lerp(.9, .62, q); }
          else { const sq = Math.min(1, (k - .5) / .15), slide = Math.max(0, k - .65); x = gx + Math.sin(slide * 2 + j) * 6; y = Math.min(footY, gy + slide * slide * 60 + slide * 40); sx = .62 * (1 + .35 * sq); sy = .62 * (1 - .3 * sq); }
          ctx.save(); ctx.globalAlpha *= k > .5 ? .92 : 1; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, sy); font(ctx, 800, 58, FAM); const w = ctx.measureText(b.text).width + 70;
          rr(ctx, -w / 2, -52, w, 104, 46); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(-w / 2 + 40, 40); ctx.lineTo(-w / 2 + 20, 76); ctx.lineTo(-w / 2 + 80, 42); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
          textC(ctx, b.text, 0, 20, 58, BROWN, 800); ctx.restore();
          if (k > .5){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(gx - 40, gy); ctx.lineTo(gx - 40, Math.min(footY, y)); ctx.stroke(); ctx.restore(); }
          if (k > .45 && k < 1.1) { ctx.save(); ctx.globalAlpha = 1 - (k - .45) / .65; textC(ctx, "PLOK!", gx, gy - 110, 48, ORANGE, 900); ctx.restore(); } });
      },
      over: (ctx2, c, sts) => {
        if (t >= tKnock && t < tKnock + 1.6) popWord(ctx, K.knock || "TOK TOK", 380, 560, t - tKnock, { size: 96, hold: 1.4, rot: -6 });
        if (t >= tQ) (K.qOn || []).forEach((j, n) => { const st = sts[j]; if (!st) return; const hp = toonHead(st), p = c.toScreen(hp[0], hp[1] - st.size * .42); const q = eBack(clamp((t - tQ - n * .15) / .4, 0, 1)); if (q <= 0) return;
          ctx.save(); ctx.translate(p[0], p[1] + Math.sin(t * 3 + n) * 8); ctx.scale(q, q); outlineWords(ctx, [{ w: "?", hl: true }], 0, 0, 110, { sw: 22 }); ctx.restore(); });
        if (t >= tClock) popChip(ctx, K.clockText || "SETENGAH HARI", 540, 300, t - tClock, NAVY, "#FFFFFF", 48, -.04);
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pantul || {}; if (K.knockCue){ const a = cueT(s, K.knockCue, .2, i); add(a, "pop"); add(a + .3, "pop"); } (K.bubbles || []).forEach((b, j) => { const a = cueT(s, b.cue, .3 + j * .1, i); add(a, "whoosh"); add(a + .55, "pop"); }); if (K.qCue) add(cueT(s, K.qCue, .3, i), "ping"); if (K.clockCue) add(cueT(s, K.clockCue, .3, i), "whoosh"); });

  /* ================= SB45: _album (relationship sticker album: faces from other divisions fly in, lines to the asker, hearts) ================= */
  function faceSticker(ctx, x, y, r, a, k, t){ // a = toon-like look {skin, hijab, hair, glasses, shirt}
    ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.fillStyle = a.bg || "#BFE2EA"; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.clip();
    ctx.fillStyle = a.shirt || TEAL; ctx.beginPath(); ctx.ellipse(0, r * .95, r * .7, r * .45, 0, 0, TAU); ctx.fill();
    const sk = { a: "#D99A6E", b: "#C98B62", c: "#B5774F", d: "#E2A77C", e: "#F0C29A" }[a.skin || "d"] || "#E2A77C";
    if (a.hair === "hijab"){ ctx.fillStyle = a.hijab || ORANGE; ctx.beginPath(); ctx.arc(0, -r * .05, r * .5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-r * .5, 0); ctx.quadraticCurveTo(0, r * .9, r * .5, 0); ctx.fill(); }
    ctx.fillStyle = sk; ctx.beginPath(); ctx.arc(0, 0, r * .36, 0, TAU); ctx.fill();
    if (a.hair !== "hijab"){ ctx.fillStyle = a.hair === "bald" ? sk : "#2B1A12"; ctx.beginPath(); ctx.arc(0, -r * .12, r * .38, Math.PI, 0); ctx.fill(); if (a.hat){ ctx.fillStyle = a.hatColor || NAVY; ctx.beginPath(); ctx.arc(0, -r * .18, r * .4, Math.PI, 0); ctx.fill(); ctx.fillRect(0, -r * .2, r * .55, r * .08); } }
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-r * .13, -r * .02, r * .045, 0, TAU); ctx.arc(r * .13, -r * .02, r * .045, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(2, r * .04); ctx.beginPath(); ctx.arc(0, r * .1, r * .12, .3, Math.PI - .3); ctx.stroke();
    if (a.glasses){ ctx.beginPath(); ctx.arc(-r * .13, -r * .02, r * .1, 0, TAU); ctx.arc(r * .13, -r * .02, r * .1, 0, TAU); ctx.stroke(); } if (a.mustache){ ctx.fillStyle = OUT; ctx.fillRect(-r * .12, r * .06, r * .24, r * .04); }
    ctx.restore(); ctx.restore(); }
  TT.scene(PX + "album", "Cerita: album stiker relasi lintas divisi (stiker wajah terbang masuk, garis ke penanya, hati)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, y: 720, w: 900, h: 600 }, f.album || {});
    const stk = (K.stickers || []).map((a, j) => Object.assign({ T: T(s, a.cue, .3 + j * .08, idx), j }, a)), tAsk = T(s, K.askCue, .3, idx), tHeart = T(s, K.heartCue, .3, idx), tOpen = T(s, K.openCue, .2, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      post: (ctx2, c, sts, R) => { if (!R.f.albumOn) return;
        const open = t < tOpen ? 0 : eBack(clamp((t - tOpen) / .6, 0, 1)); if (open <= 0) return; const x = K.x, y = K.y + Math.sin(t * 1.3) * 8, w = K.w, h = K.h;
        ctx.save(); ctx.translate(x, y); ctx.scale(1, open);
        rr(ctx, -w / 2 - 20, -h / 2 - 20, w + 40, h + 40, 26); ctx.fillStyle = "#7A3B8F"; ctx.fill(); ol(ctx, 8);
        [-1, 1].forEach(d => { rr(ctx, d < 0 ? -w / 2 : 6, -h / 2, w / 2 - 6, h, 14); ctx.fillStyle = "#FFF8EC"; ctx.fill(); ol(ctx, 5); });
        ctx.fillStyle = hexA(OUT, .25); ctx.fillRect(-4, -h / 2, 8, h);
        textC(ctx, K.title || "RELASI RANI", 0, -h / 2 - 34, 40, "#FFFFFF", 900, 600);
        const slots = K.slots || 6, cols = 3, sw = w / cols, sh = (h - 30) / 2;
        for (let i = 0; i < slots; i++){ const cx = -w / 2 + sw * (i % cols) + sw / 2, cy = -h / 2 + 30 + sh * Math.floor(i / cols) + sh / 2 - 20;
          ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 86, 0, TAU); ctx.stroke(); ctx.restore();
          const a = stk[i]; if (a){ textC(ctx, a.label, cx, cy + 128, 26, a.col || ORANGE, 900, sw - 24); } }
        ctx.restore();
        // stickers flying in and slapping onto slots
        stk.forEach((a, i) => { const k = t - a.T; if (k < 0 || i >= slots) return; const cx = x - w / 2 + sw * (i % cols) + sw / 2, cy = y - h / 2 + 30 + sh * Math.floor(i / cols) + sh / 2 - 20;
          const q = clamp(k / .45, 0, 1), sx = i % 2 ? 1300 : -220, sy = -100 + i * 60, px = lerp(sx, cx, eOut(q)), py = lerp(sy, cy, eOut(q)) - Math.sin(q * Math.PI) * 120, sc = q < 1 ? 1.4 - .4 * q : 1 + .12 * Math.exp(-(k - .45) * 8) * Math.sin((k - .45) * 30);
          ctx.save(); ctx.translate(px, py); ctx.rotate((1 - q) * 3 * (i % 2 ? -1 : 1) + (i % 2 ? .06 : -.06)); ctx.scale(sc, sc); faceSticker(ctx, 0, 0, 82, a, k, t); ctx.restore();
          if (k > .45) burstFx(ctx, cx, cy, k - .45, a.col || HL, 8, 120);
          if (t >= tHeart){ const hk = (t - tHeart + i * .2) % 1.6; ctx.save(); ctx.globalAlpha = Math.sin(hk / 1.6 * Math.PI); ctx.fillStyle = RED; ctx.translate(cx + 60, cy - 70 - hk * 60); ctx.scale(.9, .9); ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-30, -14, -12, -36, 0, -18); ctx.bezierCurveTo(12, -36, 30, -14, 0, 12); ctx.fill(); ctx.restore(); } });
        // the "who to ask" pointer
        if (t >= tAsk && stk[K.askIdx ?? 0]){ const i = K.askIdx ?? 0, cx = x - w / 2 + sw * (i % cols) + sw / 2, cy = y - h / 2 + 30 + sh * Math.floor(i / cols) + sh / 2 - 20, q = eBack(clamp((t - tAsk) / .4, 0, 1));
          ctx.save(); ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.globalAlpha = q; ctx.beginPath(); ctx.arc(cx, cy, 100 + Math.sin(t * 6) * 6, 0, TAU); ctx.stroke(); ctx.restore(); popChip(ctx, K.ask || "TANYA DIA", cx + 40, cy - 122, t - tAsk, NAVY, "#FFFFFF", 30, -.05); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.album || {}; if (K.openCue) add(cueT(s, K.openCue, .2, i), "whoosh"); (K.stickers || []).forEach((a, j) => add(cueT(s, a.cue, .3 + j * .08, i) + .42, "pop")); if (K.askCue) add(cueT(s, K.askCue, .3, i), "ping"); if (K.heartCue) add(cueT(s, K.heartCue, .3, i), "chime"); });

  /* ================= SP45 backdrop: meeting room ================= */
  BG.rapat = (ctx, t, o) => {
    ctx.fillStyle = "#EFE3D0"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#E2D2BA"; ctx.fillRect(-2600, GY - 520, 6400, 330);
    // whiteboard with scribbles
    const wx = o.boardX ?? 1120; rr(ctx, wx - 260, 420, 520, 360, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8); ctx.strokeStyle = "#3E7DB5"; ctx.lineWidth = 6; ctx.lineCap = "round";
    for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(wx - 210, 480 + i * 70); for (let k = 0; k < 8; k++) ctx.lineTo(wx - 210 + k * 50, 480 + i * 70 + Math.sin(k * 2 + i) * 10); ctx.stroke(); }
    ctx.strokeStyle = RED; ctx.beginPath(); ctx.arc(wx + 150, 700, 46, 0, TAU); ctx.stroke();
    // window strip
    rr(ctx, -560, 420, 520, 380, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 8); ctx.fillStyle = hexA("#FFFFFF", .6); ctx.beginPath(); ctx.moveTo(-500, 760); ctx.lineTo(-380, 460); ctx.lineTo(-330, 460); ctx.lineTo(-450, 760); ctx.fill();
    ctx.fillStyle = "#B98152"; ctx.fillRect(-2600, GY - 190, 6400, 2000); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let y = GY - 140; y < GY + 600; y += 50){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  };

  /* ================= SP45: _robek (plan poster on the board rips in half after the phone call; the target card stays pinned) ================= */
  TT.scene(PX + "robek", "Cerita: poster rencana pameran robek jadi dua setelah telepon, kartu target tetap tertempel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 730, y: 640, w: 500, h: 540 }, f.robek || {});
    const tTarget = K.targetCue ? T(s, K.targetCue, .3, idx) : .25, tPlan = K.planCue ? T(s, K.planCue, .3, idx) : .45, tRing = T(s, K.ringCue, .3, idx), tRip = T(s, K.ripCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { board: [K.x, K.y + 180, 1.05], target: [K.x, K.y - 40, 1.3] },
      back: () => {
        // cork board
        rr(ctx, K.x - K.w / 2 - 60, K.y - 220, K.w + 120, K.h + 300, 16); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 8); ctx.fillStyle = hexA("#8E5A34", .25); for (let i = 0; i < 40; i++){ ctx.beginPath(); ctx.arc(K.x - K.w / 2 - 40 + rnd(i) * (K.w + 80), K.y - 200 + rnd(i + 9) * (K.h + 260), 4, 0, TAU); ctx.fill(); }
        // target card (stays)
        const tq = t < tTarget ? 0 : eBack(clamp((t - tTarget) / .45, 0, 1)), glow = t > tRip ? .5 + .5 * Math.sin(t * 5) : 0;
        if (tq > 0){ ctx.save(); ctx.translate(K.x, K.y - 120); ctx.scale(tq, tq); ctx.rotate(-.03); if (glow) glowAt(ctx, 0, 0, 260, GOLD, .45 * glow); rr(ctx, -230, -70, 460, 140, 14); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
          textC(ctx, "TARGET", 0, -18, 34, CREAM, 900); textC(ctx, K.target || "30 PELANGGAN", 0, 40, 52, "#FFFFFF", 900, 420); ctx.beginPath(); ctx.arc(0, -64, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); }
        // plan poster (two halves)
        const pq = t < tPlan ? 0 : eBack(clamp((t - tPlan) / .45, 0, 1)); if (pq <= 0) return; const k = t - tRip, fall = k < 0 ? 0 : k;
        [-1, 1].forEach(d => { ctx.save(); const ox = K.x + d * fall * 160, oy = K.y + 30 + (fall > 0 ? 900 * fall * fall : 0), rot = d * Math.min(1.2, fall * 1.6); ctx.translate(ox, oy); ctx.rotate(rot); ctx.scale(pq, pq);
          ctx.beginPath(); if (d < 0){ ctx.moveTo(-K.w / 2, 0); ctx.lineTo(0, 0); for (let i = 0; i <= 10; i++) ctx.lineTo(i % 2 ? 14 : -10, i * K.h / 10); ctx.lineTo(-K.w / 2, K.h); }
          else { ctx.moveTo(K.w / 2, 0); ctx.lineTo(0, 0); for (let i = 0; i <= 10; i++) ctx.lineTo(i % 2 ? 14 : -10, i * K.h / 10); ctx.lineTo(K.w / 2, K.h); } ctx.closePath();
          ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.save(); ctx.clip();
          textC(ctx, "RENCANA A", 0, 60, 46, ORANGE, 900); // building drawing
          ctx.fillStyle = "#D9E2F1"; rr(ctx, -150, 110, 300, 220, 8); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-180, 112); ctx.lineTo(0, 40 + 50); ctx.lineTo(180, 112); ctx.closePath(); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 4);
          for (let i = 0; i < 3; i++){ rr(ctx, -120 + i * 90, 160, 60, 60, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); } rr(ctx, -40, 250, 80, 80, 6); ctx.fillStyle = "#8E5A34"; ctx.fill();
          textC(ctx, "PAMERAN", 0, 400, 50, BROWN, 900); textC(ctx, "GEDUNG SERBAGUNA", 0, 450, 30, "#6B6470", 800); ctx.restore(); ctx.restore(); });
        if (t >= tRip && t < tRip + .6){ ctx.save(); ctx.globalAlpha = 1 - (t - tRip) / .6; for (let i = 0; i < 10; i++){ const a = i / 10 * TAU, r = 80 + (t - tRip) * 500; ctx.fillStyle = PAPER; ctx.fillRect(K.x + Math.cos(a) * r, K.y + 300 + Math.sin(a) * r, 18, 12); } ctx.restore(); }
      },
      over: () => { if (t >= tRip) popWord(ctx, K.rip || "BATAL!", 540, 520, t - tRip, { size: 130, hold: 1.5, col: RED }); if (t >= tRing && t < tRip) popWord(ctx, "KRIIING", 330, 470, t - tRing, { size: 80, hold: 1.2, rot: 8 }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.robek || {}; if (K.targetCue) add(cueT(s, K.targetCue, .3, i), "pop"); if (K.planCue) add(cueT(s, K.planCue, .3, i), "pop"); if (K.ringCue){ const a = cueT(s, K.ringCue, .3, i); for (let k = 0; k < 4; k++) add(a + k * .22, "ping"); } if (K.ripCue){ add(cueT(s, K.ripCue, .5, i), "whoosh"); add(cueT(s, K.ripCue, .5, i) + .05, "pop"); } });

  /* ================= SP45: _putar (round target dial on the meeting-room wall turned down 30 -> 15; reused as opener of _tebing) ================= */
  const DIAL = [30, 25, 20, 15, 10, 5, 0, 40, 35];
  function dialDraw(ctx, x, y, r, val, t){ const step = TAU / DIAL.length, idx = DIAL.indexOf(30) + (30 - val) / 5, ang = -idx * step;
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.arc(14, 18, r, 0, TAU); ctx.fill();
    ctx.save(); ctx.rotate(ang); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 10);
    for (let i = 0; i < DIAL.length; i++){ ctx.save(); ctx.rotate(i * step); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 6, -Math.PI / 2 - step / 2, -Math.PI / 2 + step / 2); ctx.closePath(); ctx.fillStyle = i % 2 ? hexA(ORANGE, .18) : hexA("#FFFFFF", .5); ctx.fill();
      textC(ctx, String(DIAL[i]), 0, -r * .66, r * .24, DIAL[i] >= 30 ? GREEN : DIAL[i] >= 20 ? ORANGE : RED, 900); ctx.restore(); }
    ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, TAU); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-r * .26, 0); ctx.lineTo(r * .26, 0); ctx.stroke(); ctx.restore();
    // pointer + title
    ctx.beginPath(); ctx.moveTo(0, -r + 40); ctx.lineTo(-40, -r - 40); ctx.lineTo(40, -r - 40); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
    rr(ctx, -150, -r - 140, 300, 90, 14); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6); textC(ctx, "TARGET", 0, -r - 80, 52, "#FFFFFF", 900); ctx.restore(); }
  function putarVal(s, K, t, idx){ const tA = T(s, K.turnCue, .3, idx), tB = T(s, K.doneCue, .6, idx); if (t < tA) return 30; const q = easeIO(clamp((t - tA) / Math.max(.6, tB - tA), 0, 1)); return 30 - 15 * q + (q < 1 ? Math.sin(t * 16) * .5 : 0); }
  TT.scene(PX + "putar", "Cerita: roda target di dinding ruang rapat diputar turun dari 30 ke 15", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 560, y: 860, r: 280 }, f.putar || {}), val = putarVal(s, K, t, idx), tDone = T(s, K.doneCue, .6, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { dial: [K.x, K.y + 120, 1.0] },
      back: () => { dialDraw(ctx, K.x, K.y, K.r, val, t); },
      over: () => { if (t >= tDone) stampBox(ctx, K.stamp || "TARGET 15?", 540, 330, t - tDone, RED, 72, -.06); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.putar || {}; if (K.turnCue){ const a = cueT(s, K.turnCue, .3, i); for (let k = 0; k < 4; k++) add(a + k * .35, "pop"); } if (K.doneCue) add(cueT(s, K.doneCue, .6, i), "ping"); });

  /* ================= SP45: _tebing (hand stops the dial; then imagination: the bridge to the target flag collapses, a flying-fox line is shot across) ================= */
  TT.scene(PX + "tebing", "Cerita: tangan menahan roda target, lalu khayalan jembatan ke bendera target runtuh dan diganti jalur flying fox", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ cx0: 400, cx1: 860, top: 1240, flagX: 1080 }, f.tebing || {});
    const tBreak = T(s, K.breakCue, .3, idx), tKeep = T(s, K.keepCue, .3, idx), tLine = T(s, K.lineCue, .2, idx), tZip = T(s, K.zipCue, .2, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { gap: [(K.cx0 + K.cx1) / 2, K.top - 260, .82] },
      back: (ctx2, c, sts, R) => {
        if (R.f.wheel){ dialDraw(ctx, 560, 860, 280, 15 + Math.sin(t * 20) * .3 * (t < 1 ? 1 : 0), t); return; }
        // cliffs
        ctx.fillStyle = "#8E5A34"; ctx.beginPath(); ctx.moveTo(-1400, K.top); ctx.lineTo(K.cx0, K.top); ctx.lineTo(K.cx0 - 60, K.top + 900); ctx.lineTo(-1400, K.top + 900); ctx.closePath(); ctx.fill(); ol(ctx, 7);
        ctx.beginPath(); ctx.moveTo(K.cx1, K.top); ctx.lineTo(2400, K.top); ctx.lineTo(2400, K.top + 900); ctx.lineTo(K.cx1 + 60, K.top + 900); ctx.closePath(); ctx.fill(); ol(ctx, 7);
        ctx.fillStyle = "#6DBB5E"; ctx.fillRect(-1400, K.top - 16, K.cx0 + 1400, 24); ctx.fillRect(K.cx1, K.top - 16, 1600, 24);
        // flag (target) on the far cliff
        const fx = K.flagX, wv = Math.sin(t * 5) * 14, kg = t > tKeep ? .5 + .5 * Math.sin(t * 4) : 0; if (kg) glowAt(ctx, fx + 110, K.top - 560, 300, GOLD, .5 * kg);
        ctx.fillStyle = "#6B4426"; rr(ctx, fx - 8, K.top - 700, 16, 700, 6); ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.moveTo(fx + 8, K.top - 700); ctx.quadraticCurveTo(fx + 120, K.top - 730 + wv, fx + 250, K.top - 690); ctx.lineTo(fx + 250, K.top - 520); ctx.quadraticCurveTo(fx + 120, K.top - 550 - wv, fx + 8, K.top - 520); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
        textC(ctx, "TARGET", fx + 128, K.top - 640, 34, "#FFFFFF", 900); textC(ctx, K.target || "30", fx + 128, K.top - 562, 70, "#FFFFFF", 900);
        // bridge planks (rencana A) falling
        const n = 9, pw = (K.cx1 - K.cx0) / n; for (let i = 0; i < n; i++){ const k = t - tBreak - (Math.abs(i - n / 2) / n) * .4, fall = k > 0 ? k : 0, x = K.cx0 + i * pw, y = K.top - 10 + 700 * fall * fall, rot = fall * (i % 2 ? 2 : -2);
          if (y > K.top + 1200) continue; ctx.save(); ctx.translate(x + pw / 2, y); ctx.rotate(rot); rr(ctx, -pw / 2 + 4, -12, pw - 8, 26, 4); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
        if (t < tBreak + .3){ ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(K.cx0, K.top - 90); ctx.quadraticCurveTo((K.cx0 + K.cx1) / 2, K.top - 20, K.cx1, K.top - 90); ctx.stroke(); }
        if (t < tBreak + 1.2){ const a = t < tBreak ? 1 : 1 - (t - tBreak) / 1.2; ctx.save(); ctx.globalAlpha = a; chipW(ctx, "RENCANA A", (K.cx0 + K.cx1) / 2, K.top - 150 + (t > tBreak ? (t - tBreak) * 300 : 0), CREAM, BROWN, 34); ctx.restore(); }
        // flying fox line (rencana B)
        if (t >= tLine){ const q = clamp((t - tLine) / .45, 0, 1), x0 = K.cx0 - 160, y0 = K.top - 760, x1 = fx - 20, y1 = K.top - 520;
          ctx.fillStyle = "#6B4426"; rr(ctx, x0 - 10, y0, 20, K.top - y0, 6); ctx.fill(); ol(ctx, 4);
          ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); ctx.stroke(); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 4; ctx.stroke();
          if (q >= 1) chipW(ctx, K.lineLabel || "RENCANA B", lerp(x0, x1, .5) - 40, lerp(y0, y1, .5) - 70, GREEN, "#FFFFFF", 36);
          R._line = [x0, y0, x1, y1];
          if (t >= tZip) (K.riders || []).forEach((j, n) => { const st = sts[j]; if (!st) return; const qq = easeIO(clamp((t - tZip - n * .35) / 1.6, 0, 1)), hx = lerp(x0 + 60 + n * 40, x1 - 120 + n * 90, qq), hy = lerp(y0, y1, (hx - x0) / (x1 - x0));
            if (qq <= 0) return; st.x = hx; st.y = qq >= 1 ? K.top : hy + st.size * .95 + 30; st.moving = false; st.run = false; }); }
      },
      over1: (ctx2, c, sts, j, R) => { // pulley above zipping toons
        if (!R._line || t < tZip || !(K.riders || []).includes(j)) return; const st = sts[j], hp = toonHead(st), k = st.size / 92;
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hp[0], hp[1] - 30 * k); ctx.lineTo(hp[0], hp[1] - 12 * k); ctx.stroke(); ctx.beginPath(); ctx.arc(hp[0], hp[1] - 32 * k, 16, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); },
      over: (ctx2, c, sts, R) => { if (R.f.wheel) return; if (t >= tBreak && t < tBreak + 1.4) popWord(ctx, K.breakWord || "KEADAAN BERUBAH", 540, 460, t - tBreak, { size: 76, hold: 1.4, col: RED });
        if (t >= tKeep && t < tKeep + 1.6) popWord(ctx, K.keepWord || "TARGET TETAP", 540, 460, t - tKeep, { size: 88, hold: 1.6 }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tebing || {}; if (K.breakCue){ add(cueT(s, K.breakCue, .3, i), "whoosh"); add(cueT(s, K.breakCue, .3, i) + .3, "pop"); } if (K.keepCue) add(cueT(s, K.keepCue, .3, i), "chime"); if (K.lineCue) add(cueT(s, K.lineCue, .2, i), "whoosh"); if (K.zipCue) add(cueT(s, K.zipCue, .2, i), "whoosh"); });

  /* ================= SP45: _keliling (demo cart around office buildings / the plan sheet gets three written lines / scoreboard 32 of 30) ================= */
  function cart(ctx, x, t, label){ const y = GY; ctx.save(); ctx.translate(x, y);
    [-110, 110].forEach(dx => { ctx.save(); ctx.translate(dx, -46); ctx.rotate(t * 5); ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.strokeStyle = "#B8AE9D"; ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(-34 * Math.cos(k), -34 * Math.sin(k)); ctx.lineTo(34 * Math.cos(k), 34 * Math.sin(k)); ctx.stroke(); } ctx.restore(); });
    rr(ctx, -190, -330, 380, 260, 14); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 7); rr(ctx, -190, -330, 380, 70, 14); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); textC(ctx, label || "DEMO PRODUK", 0, -282, 38, "#FFFFFF", 900, 340);
    for (let i = 0; i < 3; i++){ rr(ctx, -150 + i * 110, -230, 80, 100, 10); ctx.fillStyle = ["#3E7DB5", "#3E9B5A", "#D9483B"][i]; ctx.fill(); ol(ctx, 4); }
    ctx.fillStyle = "#6B4426"; rr(ctx, -8, -720, 16, 400, 6); ctx.fill(); const sw = Math.sin(t * 2) * .03; ctx.save(); ctx.translate(0, -720); ctx.rotate(sw);
    for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 110, 260, Math.PI + i * Math.PI / 6, Math.PI + (i + 1) * Math.PI / 6); ctx.closePath(); ctx.fillStyle = i % 2 ? "#FFFFFF" : RED; ctx.fill(); ol(ctx, 4); } ctx.restore(); ctx.restore(); }
  TT.scene(PX + "keliling", "Cerita: gerobak demo keliling kantor / lembar rencana ditulis tiga baris / spanduk kain terbentang 32 dari 30", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      back: (ctx2, c, sts, R) => { if (R.f.mode !== "score") return; const S = R.f.score || {}, tC = T(s, S.cue, .3, idx), n = t < tC ? 0 : Math.min(S.to || 32, Math.floor((t - tC) / 1.4 * (S.to || 32)));
        // a cloth banner unrolls from a rope strung between two lamp posts; the count climbs past the target flag
        const x = 540, top = 380, un = clamp((t - (R.shotT > 0 ? R.shotT : 0)) / .9, 0, 1), bh = 470 * eOut(un), wv = Math.sin(t * 2.5) * 8;
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-300, top - 40); ctx.quadraticCurveTo(x, top + 10, 1380, top - 40); ctx.stroke();
        [-300, 1380].forEach(px => { ctx.fillStyle = "#3B2418"; rr(ctx, px - 10, top - 60, 20, GY - top + 60, 6); ctx.fill(); });
        for (let i = 0; i < 14; i++){ const fx = -260 + i * 120, fy = top - 30 + Math.sin(i) * 6; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + 50, fy); ctx.lineTo(fx + 25, fy + 56 + wv * .5); ctx.closePath(); ctx.fillStyle = [ORANGE, GOLD, GREEN, RED][i % 4]; ctx.fill(); ol(ctx, 3); }
        ctx.save(); ctx.beginPath(); ctx.moveTo(x - 400, top); ctx.lineTo(x + 400, top); ctx.lineTo(x + 400 + wv, top + bh); for (let i = 8; i >= 0; i--) ctx.lineTo(x - 400 + i * 100 + wv, top + bh + (i % 2 ? 22 : 0)); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 7); ctx.clip();
        textC(ctx, S.title || "PELANGGAN BARU", x, top + 90, 54, ORANGE, 900, 700); textC(ctx, String(n), x - 80, top + 320, 220, n >= (S.target || 30) ? GREEN : BROWN, 900); textC(ctx, "/ " + (S.target || 30), x + 200, top + 300, 86, hexA(BROWN, .6), 900);
        ctx.restore(); if (n >= (S.target || 30)){ glowAt(ctx, x, top + 250, 520, GOLD, .22 + .1 * Math.sin(t * 6)); burstFx(ctx, x, top + 250, t - tC - 1.3, GOLD, 14, 320); } },
      front: (ctx2, c, sts, R) => { if (R.f.mode !== "cart") return; const st = sts[R.f.pusher ?? 0]; if (st) cart(ctx, st.x + 330, t, R.f.cartLabel); },
      over: (ctx2, c, sts, R) => {
        if (R.f.mode === "cart"){ const ups = (R.f.ups || []).map((u, j) => T(s, u.cue, .3 + j * .1, idx)).filter(x => t >= x); const n = ups.length * (R.f.per || 8); popChip(ctx, "PELANGGAN: " + n, 540, 300, t - (R.shotT > 0 ? R.shotT : 0) - .3, GREEN, "#FFFFFF", 46, -.03);
          ups.forEach((u, j) => { if (t - u < 1) popWord(ctx, "+" + (R.f.per || 8), 760, 420, t - u, { size: 90, hold: 1 }); }); }
        if (R.f.mode === "sheet"){ const SH = R.f.sheet || {}, k0 = t - R.shotT, q = eBack(clamp(k0 / .5, 0, 1)); ctx.save(); ctx.translate(540, 520); ctx.rotate(-.025); ctx.scale(q, q);
          rr(ctx, -400, -290, 800, 570, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8); ctx.strokeStyle = hexA("#7FB7E6", .5); ctx.lineWidth = 3; for (let y = -170; y < 300; y += 60){ ctx.beginPath(); ctx.moveTo(-370, y); ctx.lineTo(370, y); ctx.stroke(); }
          ctx.strokeStyle = hexA(RED, .5); ctx.beginPath(); ctx.moveTo(-220, -290); ctx.lineTo(-220, 280); ctx.stroke(); textC(ctx, SH.title || "LEMBAR RENCANA", 0, -220, 52, ORANGE, 900, 700);
          (SH.rows || []).forEach((r, j) => { const tr = T(s, r.cue, .3, idx), p = clamp((t - tr) / .9, 0, 1); if (p <= 0) return; const y = -120 + j * 150;
            textL(ctx, r.k, -375, y + 4, 26, NAVY, 900, 150); ctx.save(); ctx.beginPath(); ctx.rect(-210, y - 60, 600 * p, 120); ctx.clip(); textL(ctx, r.v, -200, y + 10, 44, BROWN, 800, 570); ctx.restore();
            if (p > 0 && p < 1){ ctx.save(); ctx.translate(-200 + 570 * p, y - 10); drawItem(ctx, "marker", 0, 0, t, { s: .7, col: NAVY }); ctx.restore(); } });
          ctx.restore(); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.shots || []).forEach(sh => { (sh.ups || []).forEach((u, j) => add(cueT(s, u.cue, .3 + j * .1, i), "chime")); ((sh.sheet || {}).rows || []).forEach(r => add(cueT(s, r.cue, .3, i), "whoosh")); if (sh.score) add(cueT(s, sh.score.cue, .3, i) + 1.4, "chime"); }); });

  /* ================= RN45: _soda (anger puffs sucked into the chest, then a giant soda bottle shaken day after day, pressure gauge into the red) ================= */
  function gauge(ctx, x, y, r, p, t){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6);
    for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(0, 0, r * .78, Math.PI * (.8 + k * .466), Math.PI * (.8 + (k + 1) * .466)); ctx.strokeStyle = [GREEN, GOLD, RED][k]; ctx.lineWidth = r * .2; ctx.stroke(); }
    const a = Math.PI * (.8 + 1.4 * clamp(p, 0, 1)) + (p > .8 ? Math.sin(t * 40) * .05 : 0); ctx.strokeStyle = OUT; ctx.lineWidth = r * .1; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * .72, Math.sin(a) * r * .72); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * .12, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); }
  TT.scene(PX + "soda", "Cerita: kesal disimpan di dada lalu jadi botol soda raksasa yang dikocok tiap hari, jarum tekanan ke merah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 690, h: 980 }, f.soda || {});
    const tPuff = T(s, K.puffCue, .2, idx), tBottle = T(s, K.bottleCue, .3, idx), tPress = T(s, K.pressCue, .3, idx);
    const days = (K.days || []).map((d, j) => Object.assign({ T: T(s, d.cue, .3 + j * .1, idx), j }, d)), dOn = days.filter(d => t >= d.T);
    const press = clamp(dOn.length * .22 + (t > tPress ? (t - tPress) * .25 : 0), 0, 1);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      spots: { bottle: [K.x, GY - K.h * .55, .9] },
      mid: (ctx2, c, sts) => {
        if (t < tBottle) return; const q = eBack(clamp((t - tBottle) / .5, 0, 1)), last = dOn.length ? dOn[dOn.length - 1] : null, sk = last && t - last.T < .9 ? Math.sin((t - last.T) * 34) * .14 * (1 - (t - last.T) / .9) : 0;
        const jit = press > .5 ? Math.sin(t * 50) * press * .02 : 0, bulge = press > .7 ? Math.sin(t * 30) * 6 * press : 0;
        ctx.save(); ctx.translate(K.x, GY - 40); ctx.rotate(sk + jit); ctx.scale(q, q);
        sodaBottle(ctx, K.h, { t, text: K.label || "KESAL", fizz: press, level: .7 + press * .12, capLift: bulge, label: RED });
        // gauge on the shoulder
        gauge(ctx, 0, -K.h * .78, 86, press, t); ctx.restore();
        if (press > .75){ for (let i = 0; i < 4; i++){ const k = (t * 1.7 + i / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - k) * .8; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(K.x + (i % 2 ? 1 : -1) * (30 + k * 60), GY - 40 - K.h - 30 - k * 90, 10 + k * 16, 0, TAU); ctx.fill(); ctx.restore(); } }
      }, midZ: 2,
      front: (ctx2, c, sts) => { // anger puffs flying into the chest
        const st = sts[0]; if (!st || t < tPuff) return; const k = st.size / 92, cx = st.x + 6 * k * (st.face || 1), cy = st.y - 46 * k, hq = clamp((t - tPuff) / .4, 0, 1) * (t < tBottle ? 1 : clamp(1 - (t - tBottle) / .4, 0, 1));
        if (hq <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(hq * (1 + .08 * Math.sin(t * 8)), hq * (1 + .08 * Math.sin(t * 8))); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -20, -26, -66, 0, -32); ctx.bezierCurveTo(26, -66, 60, -20, 0, 30); ctx.fill(); ol(ctx, 5); ctx.restore();
        for (let i = 0; i < 6; i++){ const p = ((t - tPuff) * .8 + i / 6) % 1, a = i * 1.1, r = 360 * (1 - p); ctx.save(); ctx.globalAlpha = Math.min(1, (1 - p) * 2) * hq; ctx.translate(cx + Math.cos(a) * r, cy - 120 + Math.sin(a) * r * .6);
          ctx.fillStyle = "#5A4A4A"; ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.arc(20, -10, 18, 0, TAU); ctx.arc(-20, -8, 16, 0, TAU); ctx.fill(); textC(ctx, ["#@!", "grr", "huh"][i % 3], 0, 8, 22, "#FFFFFF", 900); ctx.restore(); } },
      over: () => { dOn.forEach((d, j) => popChip(ctx, d.label, 260 + j * 280, 300, t - d.T, j === dOn.length - 1 ? ORANGE : NAVY, "#FFFFFF", 40, (j - 1) * .05));
        if (t >= tPress) popChip(ctx, K.pressLabel || "TEKANAN NAIK", 540, 410, t - tPress, RED, "#FFFFFF", 44, -.03); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.soda || {}; if (K.puffCue) add(cueT(s, K.puffCue, .2, i), "whoosh"); if (K.bottleCue) add(cueT(s, K.bottleCue, .3, i), "pop"); (K.days || []).forEach((d, j) => { const a = cueT(s, d.cue, .3 + j * .1, i); add(a, "whoosh"); add(a + .3, "pop"); }); if (K.pressCue) add(cueT(s, K.pressCue, .3, i), "ping"); });

  /* ================= RN45: _ledak (director's meeting: the small bottle in front of Fikri pops, soda geyser, papers fly, then grey silence) ================= */
  TT.scene(PX + "ledak", "Cerita: rapat direktur, botol di depan Fikri meledak jadi semburan soda, kertas beterbangan, busa menetes di semua kepala", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ bx: 820, tableTop: GY - 330 }, f.ledak || {});
    const tAsk = T(s, K.askCue, .3, idx), tPop = T(s, K.popCue, .2, idx), tQuiet = T(s, K.quietCue, .3, idx);
    const preShake = t > tAsk && t < tPop ? (t - tAsk) / Math.max(.3, tPop - tAsk) : 0;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { bottle: [K.bx, K.tableTop - 200, 1.3] },
      back: () => { // boardroom wall: wood panels + projector screen
        ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); for (let x = -2600; x < 3800; x += 160){ ctx.fillStyle = (x / 160) % 2 ? "#63412E" : "#5A3A2A"; ctx.fillRect(x, -1200, 156, GY + 1200); }
        rr(ctx, 240, 380, 600, 380, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 8); textC(ctx, K.screen || "LAPORAN PENJUALAN", 540, 450, 34, NAVY, 900, 540);
        [180, 260, 210, 300].forEach((h, i) => { rr(ctx, 320 + i * 120, 720 - h, 80, h, 6); ctx.fillStyle = i === 3 ? ORANGE : "#7FB7E6"; ctx.fill(); ol(ctx, 3); });
        ctx.fillStyle = "#3B2418"; ctx.fillRect(-2600, GY - 190, 6400, 2000); },
      front: () => { // long table + bottle
        const tt = K.tableTop; rr(ctx, -300, tt, 1700, 60, 14); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#6B4426"; ctx.fillRect(-280, tt + 60, 1660, 400); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-280, tt + 60, 1660, 400);
        // papers on table (fly after pop)
        for (let i = 0; i < 6; i++){ const k = t - tPop, fly = k > 0 ? k : 0, x = 60 + i * 200 + fly * (i % 2 ? 300 : -260), y = tt + 10 - fly * 700 + fly * fly * 600, rot = fly * (i % 2 ? 3 : -3); if (y > GY + 200) continue;
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot - .1); rr(ctx, -60, -12, 120, 24, 4); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.restore(); }
        const sh = preShake > 0 ? Math.sin(t * (20 + preShake * 40)) * .12 * preShake : 0;
        ctx.save(); ctx.translate(K.bx, tt + 6); ctx.rotate(sh); sodaBottle(ctx, 230, { t, text: "", fizz: Math.max(preShake, t > tPop ? 1 : 0), cap: t < tPop ? 1 : 0, capLift: preShake * 10, label: RED }); ctx.restore();
        if (t >= tPop){ const k = t - tPop, cx = K.bx, cy = tt - 230; // cap flying + geyser
          ctx.save(); ctx.translate(cx + k * 300, cy - k * 1600 + k * k * 900); ctx.rotate(k * 14); rr(ctx, -30, -12, 60, 24, 5); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 4); ctx.restore();
          const g = clamp(1 - (k - 1.6) / 1.2, 0, 1); if (g > 0){ for (let i = 0; i < 46; i++){ const p = ((k * 1.4 + rnd(i)) % 1), vx = (rnd(i + 3) - .5) * 900, x = cx + vx * p, y = cy - 1100 * p + 1300 * p * p, r = 14 + rnd(i + 7) * 22;
              ctx.fillStyle = hexA(i % 3 ? "#FFF4E6" : "#C98B62", .9 * g); ctx.beginPath(); ctx.arc(x, y, r * (1 - p * .4), 0, TAU); ctx.fill(); }
            ctx.fillStyle = hexA("#FFF4E6", .9 * g); ctx.beginPath(); ctx.moveTo(cx - 30, cy); ctx.quadraticCurveTo(cx, cy - 700 * Math.min(1, k * 3), cx + 30, cy); ctx.fill(); }
          burstFx(ctx, cx, cy, k, ORANGE, 14, 260); }
      },
      post: (ctx2, c) => { if (t < tPop + .6) return; // soda foam dripping down the screen and splats on everyone, then still silence
        const k = t - tPop - .6, q = clamp(k / .5, 0, 1); ctx.save(); ctx.globalAlpha = .92 * q;
        for (let i = 0; i < 14; i++){ const x = 30 + i * 80 + rnd(i) * 30, len = 60 + rnd(i + 4) * 160 + k * (30 + rnd(i + 8) * 60), w = 26 + rnd(i + 2) * 30; ctx.fillStyle = i % 3 ? "#FFF4E6" : "#F1D9BE";
          ctx.beginPath(); ctx.moveTo(x - w, 0); ctx.lineTo(x + w, 0); ctx.lineTo(x + w * .5, len); ctx.arc(x, len, w * .5, 0, Math.PI); ctx.closePath(); ctx.fill(); }
        ctx.fillStyle = "#FFF4E6"; ctx.fillRect(0, 0, 1080, 40); ctx.restore();
        if (t >= tQuiet){ ctx.save(); ctx.globalAlpha = .18 * clamp((t - tQuiet) / .5, 0, 1); ctx.fillStyle = "#1E2A36"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } },
      over1: (ctx2, c, sts, j) => { if (t < tPop + .3) return; const st = sts[j], hp = toonHead(st), r = st.size * .12, q = eBack(clamp((t - tPop - .3 - j * .12) / .4, 0, 1));
        ctx.save(); ctx.translate(hp[0], hp[1] - r * .9); ctx.scale(q, q); ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.arc(-r * .5, 0, r * .45, 0, TAU); ctx.arc(0, -r * .15, r * .55, 0, TAU); ctx.arc(r * .5, 0, r * .42, 0, TAU); ctx.fill(); ol(ctx, 4);
        const d = ((t - tPop) * .5 + j * .3) % 1; ctx.beginPath(); ctx.arc(r * .2, r * .3 + d * r * 1.2, r * .12, 0, TAU); ctx.fill(); ctx.restore(); },
      over: () => { if (t >= tPop) popWord(ctx, K.boom || "DUAAR!", 540, 470, t - tPop, { size: 150, hold: 1.3, col: RED });
        if (t >= tQuiet){ const k = t - tQuiet, q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.globalAlpha *= clamp(k / .3, 0, 1); ctx.translate(540, 560); ctx.scale(q, q); outlineWords(ctx, [{ w: K.quiet || "HENING...", hl: true }], 0, 0, 110, { sw: 24, hl: "#C9D3DD" }); ctx.restore(); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ledak || {}; if (K.askCue) add(cueT(s, K.askCue, .3, i), "pop"); if (K.popCue){ const a = cueT(s, K.popCue, .2, i); add(a, "pop"); add(a + .05, "whoosh"); add(a + .2, "ping"); } if (K.quietCue) add(cueT(s, K.quietCue, .3, i), "whoosh"); });

  /* ================= RN45: _ngobrol (afternoon bench: the bottle is opened slowly, a small hiss; topic chips; deal stamp) ================= */
  TT.scene(PX + "ngobrol", "Cerita: sore di bangku taman, botol dibuka pelan (cuma desis kecil), bicara berdua soal jadwal, sepakat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene;
    base(ctx, s, t, { env: "park", envOpt: { bench: true, benchX: 540, time: "dusk" },
      mid: (ctx2, c, sts, R) => { const B = R.f.bottle; if (!B) return; const tOpen = T(s, B.openCue, .3, idx), k = t - tOpen, twist = k > 0 ? Math.min(1, k / 1.2) : 0;
        ctx.save(); ctx.translate(B.x ?? 540, B.y ?? GY - 250); sodaBottle(ctx, 300, { t, text: "", fizz: twist > .6 ? .25 : 0, cap: twist < 1 ? 1 : 0, capRot: twist * 3, capLift: twist * 20, label: GREEN, level: .6 }); ctx.restore();
        if (twist >= 1 && k < 3.2){ for (let i = 0; i < 4; i++){ const p = ((k - 1.2) * .6 + i / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - p) * .7; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc((B.x ?? 540) + Math.sin(p * 6 + i) * 20, (B.y ?? GY - 250) - 320 - p * 160, 8 + p * 10, 0, TAU); ctx.fill(); ctx.restore(); }
          if (k < 2.4) popChip(ctx, "psst...", (B.x ?? 540) + 120, (B.y ?? GY - 250) - 380, k - 1.2, CREAM, BROWN, 34, .08, true); } }, midZ: .5,
      over: (ctx2, c, sts, R) => { (R.f.chips || []).forEach((g, j) => { const tc = T(s, g.cue, .3, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : 1e9; if (t >= tc && t < O) popChip(ctx, g.text, g.x ?? 540, g.y ?? (290 + j * 86), t - tc, g.bg || [TEAL, NAVY, GREEN, RED][j % 4], "#FFFFFF", 40, (j % 2 ? .03 : -.03)); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(sh => { (sh.chips || []).forEach(g => add(cueT(s, g.cue, .3, i), "pop")); if (sh.bottle && sh.bottle.openCue){ const a = cueT(s, sh.bottle.openCue, .3, i); add(a, "whoosh"); add(a + 1.2, "pop"); } }); });
})();

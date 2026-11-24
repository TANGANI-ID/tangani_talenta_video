/* Scene pack j2611221508202: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SP46, RN46, KD46, JS46, SC46.
   Layout prefix j2611221508202_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, bg, bgOpt, ...}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, outCue, s, dx, dy, rot, ...}]  object in a toon's hand
     pops / stamps / tags / steps / confetti   screen overlays (see base)
     bg     "layar" (office wall sales screen: val, rollTo, offDelay) | "dapur" (catering kitchen) | "sablon" (screen-print workshop)
   Set pieces (layout suffix):
     SP46 _angka    office: Bima slaps a giant REFRESH buzzer, the wall sales screen spins and lands on 2 every time      f.angka
          _pancing  imagination: wooden pier, Bima shouts at the fish to bite, fish pop up, blow bubbles and dive         f.pancing
          _kendali  navy stage: glowing rope ring "AREA KENDALIMU", uncontrollables pushed out, three effort objects drop in   f.kendali
          _gelang   POV close-up of two forearms: three labelled rubber bands snap onto the left wrist and move to the right   f.gelang
     RN46 _dapur    catering kitchen: wall phone rings, 100 rice boxes stacked, two cooks point at each other               f.dapur
          _ring     imagination boxing ring: blame bubbles score points on a "SIAPA BENAR?" board while rice boxes go cold      f.ring
          _kertas   kitchen: head chef lays a sheet in the middle, it rises into a problem banner; trophy goes in the NANTI box  f.kertas
          _sisi     long kitchen table: both cooks walk to the same side; cut to courier motorbike; shared schedule pinned       f.sisi
     KD46 _kosong   office at dusk: blank paper on the wall, tumbleweed rolls past, crickets, one sad idea                      f.kosong
          _berondong  laptop turns into a popcorn machine, idea kernels pop into labelled popcorn cards                          f.berondong
          _aneh     three popcorn ideas come alive (funny, weird, too long), the laptop shrugs at "BUDAYA KANTOR?"             f.aneh
          _tampi    winnowing tray: weak ideas fly off like husk, two merge, three stay; team vote, LANGKAH PERTAMA banner      f.tampi
     JS46 _sablon   screen-print workshop: smeared shirt lifted, rejected shirts fly into the bin, counter 8/100             f.sablon
          _dugaan   blame the ink -> PDCA wheel (P lit) + cross-section of a folded shirt where wet ink sticks             f.dugaan
          _jemur    drying rack with three-minute countdown rings (D), tally clicker rolls 8 -> 1 (C)                        f.jemur
          _roda     PDCA wheel rolls up a hill, STANDAR chock stops it rolling back, second lap LIPATAN MIRING (A + ulangi)   f.roda
     SC46 _tuang    home: every envelope and wallet poured into one big basket "INVESTASI RAMAI"                            f.tuang
          _tali     tightrope over the city with one huge basket, the rope sags like a falling chart, coins rain down          f.tali
          _pasar    morning market: egg seller's bicycle with several baskets, one falls, the others stay safe                  f.pasar
          _pikul    shoulder pole: emergency fund first, then the rest spread over four baskets that balance, 2L tags          f.pikul
     _adegan  generic story shot with the extras above (used for the action scenes) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221508202_";
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

  /* ================= SP46 shared: wall sales screen ================= */
  function salesScreen(ctx, x, y, w, h, o, t){
    o = o || {}; const off = clamp(o.off || 0, 0, 1), target = o.target || 10;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(43,26,18,.2)"; rr(ctx, -w / 2 + 18, -h / 2 + 22, w, h, 22); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 22); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 8);
    const iw = w - 44, ih = h - 44;
    ctx.save(); rr(ctx, -iw / 2, -ih / 2, iw, ih, 12); ctx.clip(); ctx.fillStyle = "#0E0C10"; ctx.fillRect(-iw / 2, -ih / 2, iw, ih);
    if (off < 1){
      ctx.save(); ctx.scale(1, Math.max(.02, 1 - off * off)); ctx.globalAlpha *= 1 - off * .6;
      const flash = o.flash || 0; ctx.fillStyle = flash > 0 ? hexA(RED, .35 + .4 * flash) : "#13223D"; ctx.fillRect(-iw / 2, -ih / 2, iw, ih);
      if (o.win) glowAt(ctx, 0, 0, iw * .7, GREEN, .35 + .15 * Math.sin(t * 6));
      textC(ctx, o.label || "PELANGGAN BULAN INI", 0, -ih / 2 + 50, 30, "#BFD3EA", 800, iw - 60);
      const big = ih * .46;
      if (o.spin > 0){ ctx.save(); ctx.beginPath(); ctx.rect(-iw / 2, -ih / 2 + 70, iw, ih - 130); ctx.clip();
        const step = big * 1.1, off2 = (t * 2600) % step; for (let k = -1; k < 3; k++){ const d = Math.floor(rnd(Math.floor(t * 18) + k) * 10);
          ctx.globalAlpha = .75; textC(ctx, String(d), -50, big * .35 + off2 - k * step + 10, big, "#FFFFFF", 900); } ctx.restore(); ctx.globalAlpha = 1; }
      else textC(ctx, String(Math.round(o.val)), -50 + (String(Math.round(o.val)).length > 1 ? -30 : 0), big * .35 + 10, big, o.win ? "#9BF0A8" : flash > 0 ? "#FFD2CC" : "#FFFFFF", 900);
      textC(ctx, "/" + target, iw * .26, big * .35 + 10, big * .42, "#7F93B5", 900);
      const bw = iw - 90, p = clamp((o.spin > 0 ? .2 : o.val / target), 0, 1); rr(ctx, -bw / 2, ih / 2 - 52, bw, 24, 12); ctx.fillStyle = "#2C3A5A"; ctx.fill();
      if (p > 0){ rr(ctx, -bw / 2, ih / 2 - 52, bw * p, 24, 12); ctx.fillStyle = p >= 1 ? GREEN : ORANGE; ctx.fill(); }
      ctx.restore();
      if (off > 0){ ctx.fillStyle = hexA("#FFFFFF", (1 - off) * .9); ctx.fillRect(-iw / 2, -4, iw, 8); }
    }
    ctx.fillStyle = hexA("#FFFFFF", .07); ctx.beginPath(); ctx.moveTo(-iw / 2, -ih / 2); ctx.lineTo(-iw / 2 + iw * .35, -ih / 2); ctx.lineTo(-iw / 2 + iw * .12, ih / 2); ctx.lineTo(-iw / 2 - iw * .2, ih / 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = off < 1 ? "#7BE08F" : "#5A5560"; ctx.beginPath(); ctx.arc(w / 2 - 34, h / 2 - 12, 7, 0, TAU); ctx.fill();
    ctx.restore(); }
  BG.layar = (ctx, t, o, s, T0) => {
    T0 = T0 > 0 ? T0 : 0; const lt = t - T0; let val = o.val ?? 2, off = 0, win = false, spin = 0;
    if (o.rollTo != null){ const a = o.rollDelay ?? .5, d = o.rollDur || 1.6, q = clamp((lt - a) / d, 0, 1); val = lerp(o.val ?? 2, o.rollTo, easeIO(q)); spin = q > 0 && q < 1 ? 0 : 0; win = q >= 1 && o.rollTo >= (o.target || 10); }
    if (o.offDelay != null) off = clamp((lt - o.offDelay) / .35, 0, 1);
    salesScreen(ctx, o.x ?? 720, o.y ?? 760, o.w || 560, o.h || 380, { val, off, win, spin, target: o.target || 10 }, t);
  };
  function buzzer(ctx, x, y, press, t){
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 0, 120, 20, 0, 0, TAU); ctx.fill();
    rr(ctx, -72, -350, 144, 350, 16); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .12); ctx.fillRect(-60, -340, 26, 330);
    // refresh icon on the pedestal
    ctx.save(); ctx.translate(0, -210); ctx.rotate(-t * .8); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, 40, .3, TAU - .6); ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(40 * Math.cos(-.6) + 18, 40 * Math.sin(-.6) + 4); ctx.lineTo(40 * Math.cos(-.6) - 16, 40 * Math.sin(-.6) - 16); ctx.lineTo(40 * Math.cos(-.6) - 14, 40 * Math.sin(-.6) + 22); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, -352, 112, 30, 0, 0, TAU); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 6);
    const dy = press * 26; ctx.beginPath(); ctx.ellipse(0, -362 + dy, 88, 78 * (1 - press * .35), 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = hexA("#FFFFFF", .45); ctx.beginPath(); ctx.ellipse(-30, -400 + dy * .7, 22, 12, -.5, 0, TAU); ctx.fill();
    ctx.restore(); }

  /* ================= SP46: _angka (refresh buzzer, wall screen stuck at 2) ================= */
  TT.scene(PX + "angka", "Cerita: tombol SEGARKAN raksasa ditepuk berkali-kali, layar penjualan di dinding berputar lalu tetap 2", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 730, y: 760, w: 560, h: 380, btnX: 610, n: 5, gap: .7 }, f.angka || {});
    const tP = T(s, K.pressCue, .4, idx), tStuck = T(s, K.stuckCue, .8, idx), presses = [];
    for (let i = 0; i < K.n; i++){ const p = tP + i * K.gap; if (p < tStuck + .2) presses.push(p); }
    let press = 0, spin = 0, flash = 0, lastP = -9;
    presses.forEach(p => { const k = t - p; if (k >= -.1 && k < .3) press = Math.max(press, 1 - Math.abs(k - .06) / .2); if (k >= 0 && k < .5) spin = 1; if (k >= .5 && k < .85) flash = 1 - (k - .5) / .35; if (k >= 0) lastP = p; });
    press = clamp(press, 0, 1);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1010, rug: false },
      spots: { screen: [K.x, K.y + 120, 1.1], btn: [K.btnX - 60, 1180, 1.12] },
      back: (c2, c, sts) => {
        salesScreen(ctx, K.x, K.y, K.w, K.h, { val: 2, spin, flash: Math.max(flash, t > tStuck ? .5 + .5 * Math.sin(t * 8) : 0) }, t);
        // hand slaps: switch Bima's pose around every press
        const st = sts[K.on ?? 0]; if (st && t >= tP - .15 && t < tStuck + .3){ const near = presses.find(p => t >= p - .14 && t < p + .22); st.pose = near != null ? "point" : "hold"; st.poseT = near != null ? near - .14 : (presses.find(p => t >= p + .22 && t < p + K.gap - .14) ?? t) + .22; }
      },
      front: () => { buzzer(ctx, K.btnX, GY, press, t); },
      over: (c2, c) => {
        presses.forEach((p, i) => { const sp = c.toScreen(K.btnX, GY - 470); popWord(ctx, i % 2 ? "KLIK!" : "SEGARKAN!", clamp(sp[0] + 60, 260, 820), sp[1] - 40, t - p, { size: 64, hold: .55, rot: i % 2 ? 8 : -8 }); });
        if (t >= tStuck) stampBox(ctx, K.stamp || "TETAP 2", 540, 330, t - tStuck, RED, 84, -.08);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = Object.assign({ n: 5, gap: .7 }, f.angka || {}); if (K.pressCue){ const a = cueT(s, K.pressCue, .4, i), b = K.stuckCue ? cueT(s, K.stuckCue, .8, i) : 1e9; for (let k = 0; k < K.n; k++) if (a + k * K.gap < b + .2) add(a + k * K.gap, "pop"); } if (K.stuckCue) add(cueT(s, K.stuckCue, .8, i), "ping"); });

  /* ================= SP46: _pancing (pier, shouting at the fish) ================= */
  function fishBody(ctx, x, y, s, rot, col, mood, t){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const wag = Math.sin(t * 14) * .25;
    ctx.save(); ctx.translate(-78, 0); ctx.rotate(wag); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-56, -46); ctx.quadraticCurveTo(-36, 0, -56, 46); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); ctx.restore();
    ctx.beginPath(); ctx.moveTo(-10, -50); ctx.quadraticCurveTo(10, -92, 40, -54); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(0, 0, 92, 60, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 92, 60, 0, 0, TAU); ctx.clip(); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.ellipse(10, 40, 90, 34, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 4; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(-30 + k * 26, 0, 26, -1, 1); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.arc(48, -14, 17, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(52 + (mood === "smug" ? 4 : 0), -12, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    if (mood === "smug"){ ctx.fillStyle = col; ctx.fillRect(30, -34, 38, 16); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(30, -18); ctx.lineTo(68, -18); ctx.stroke(); }
    if (mood === "tongue"){ ctx.beginPath(); ctx.arc(80, 14, 14, -.2, Math.PI + .2); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.ellipse(86, 26, 12, 16, -.3, 0, TAU); ctx.fillStyle = "#F28DB2"; ctx.fill(); ol(ctx, 3); }
    else if (mood === "o"){ ctx.beginPath(); ctx.ellipse(86, 12, 9, 11, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
    else { ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(76, 6, 12, .2, 1.6); ctx.stroke(); }
    ctx.restore(); }
  function splash(ctx, x, y, k, s){ if (k < 0 || k > .6) return; const q = k / .6; ctx.save(); ctx.globalAlpha *= 1 - q;
    for (let i = 0; i < 9; i++){ const a = -Math.PI * (.12 + .76 * i / 8), r = 30 + q * 140 * (s || 1); ctx.fillStyle = i % 2 ? "#FFFFFF" : "#BFE8F0"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 1.1 + q * q * 90, 12 * (1 - q * .5), 0, TAU); ctx.fill(); }
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, 40 + q * 120, 10 + q * 22, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "pancing", "Cerita: khayalan di dermaga, tokoh membentak ikan supaya menggigit, ikan melompat, mengejek, lalu menyelam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ deck: 1420, pierEnd: 690, water: 1480, bobX: 890, on: 1 }, f.pancing || {});
    const tRod = T(s, K.rodCue, .2, idx), tShout = T(s, K.shoutCue, .4, idx), tFish = T(s, K.fishCue, .5, idx), tLab = T(s, K.labelCue, .5, idx), tOut = T(s, K.outCue, .5, idx);
    const fishes = [{ x0: 700, x1: 1000, h: 330, col: "#F2A65A", mood: "tongue", d: 0 }, { x0: 1040, x1: 780, h: 380, col: "#6FB6D9", mood: "smug", d: .55 }, { x0: 760, x1: 1060, h: 300, col: "#E86F6F", mood: "o", d: 1.1 }];
    base(ctx, s, t, { env: "beach", envOpt: { palmX: -3000 },
      spots: { water: [880, K.water - 260, 1.12], pier: [520, K.deck - 520, 1.0] },
      back: () => {
        const wy = K.water; ctx.fillStyle = "#6CB8C0"; ctx.fillRect(-3000, 1080, 7000, 3000); const g = ctx.createLinearGradient(0, 1080, 0, 2200); g.addColorStop(0, "#7CC1C4"); g.addColorStop(1, "#2F7F96"); ctx.fillStyle = g; ctx.fillRect(-3000, 1080, 7000, 3000);
        ctx.strokeStyle = hexA("#FFFFFF", .45); ctx.lineWidth = 5; ctx.lineCap = "round"; for (let r = 0; r < 9; r++){ const y = 1110 + r * r * 14 + r * 20; for (let x = -1200 + ((t * (24 + r * 8) + r * 113) % 300); x < 2400; x += 300){ ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y - 10, x + 90 + r * 8, y); ctx.stroke(); } }
        // pier deck + posts
        for (let px = -600; px <= K.pierEnd - 30; px += 210){ rr(ctx, px - 22, K.deck + 30, 44, 700, 8); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(px, wy + 40, 40 + Math.sin(t * 3 + px) * 5, 8, 0, 0, TAU); ctx.stroke(); }
        ctx.fillStyle = "#B98152"; ctx.fillRect(-900, K.deck - 50, K.pierEnd + 900, 50); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 3; for (let x = -880; x < K.pierEnd; x += 70){ ctx.beginPath(); ctx.moveTo(x, K.deck - 50); ctx.lineTo(x - 14, K.deck); ctx.stroke(); }
        ctx.fillStyle = "#8E5A34"; ctx.fillRect(-900, K.deck, K.pierEnd + 900, 46); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-900, K.deck - 50, K.pierEnd + 900, 96);
        rr(ctx, K.pierEnd - 60, K.deck - 120, 46, 80, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 5);
      },
      over1: (c2, c, sts, j) => {
        if (j !== K.on || t < tRod) return; const st = sts[j], h = handOf(st), q = t < tRod ? 0 : eBack(clamp((t - tRod) / .4, 0, 1)), fc = st.face || 1;
        const shake = t > tShout && t < tShout + 2 ? Math.sin(t * 40) * .05 : Math.sin(t * 2) * .02, L = 330 * q, ang = -1.0 + shake;
        const tx = h[0] + Math.cos(ang) * L * fc, ty = h[1] + Math.sin(ang) * L;
        ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(h[0] - 30 * fc, h[1] + 40); ctx.lineTo(tx, ty); ctx.stroke(); ctx.strokeStyle = "#C98B52"; ctx.lineWidth = 9; ctx.stroke();
        ctx.beginPath(); ctx.arc(h[0] - 6 * fc, h[1] + 14, 16, 0, TAU); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 4);
        if (q > .9){ const bob = Math.sin(t * 3) * 8 + (t > tShout && t < tShout + 2 ? Math.sin(t * 30) * 10 : 0), bx = K.bobX, by = K.water - 6 + bob;
          ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo((tx + bx) / 2, Math.max(ty, by) + 40, bx, by - 26); ctx.stroke();
          ctx.beginPath(); ctx.arc(bx, by - 14, 18, Math.PI, 0); ctx.fillStyle = RED; ctx.fill(); ctx.beginPath(); ctx.arc(bx, by - 14, 18, 0, Math.PI); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(bx, by - 14, 18, 0, TAU); ol(ctx, 4);
          ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(bx, by + 4, 34 + Math.sin(t * 3) * 6, 8, 0, 0, TAU); ctx.stroke(); }
      },
      front: () => {
        fishes.forEach((F, i) => { const T0 = tFish + F.d; if (t < T0) return; const period = 2.0, n = Math.floor((t - T0) / period), st0 = T0 + n * period, k = t - st0;
          if (st0 >= tOut) return; const dur = 1.0, a = n % 2 ? F.x1 : F.x0, b = n % 2 ? F.x0 : F.x1;
          if (k > dur){ splash(ctx, b, K.water, k - dur, .8); return; }
          const q = k / dur, x = lerp(a, b, q), y = K.water + 40 - Math.sin(q * Math.PI) * F.h, rot = Math.atan2(-Math.cos(q * Math.PI) * F.h * Math.PI, Math.abs(b - a)) * .8;
          if (q < .3) splash(ctx, a, K.water, k, .8);
          ctx.save(); ctx.beginPath(); ctx.rect(-3000, -3000, 7000, 3000 + K.water + 10); ctx.clip(); ctx.translate(x, y); if (b < a) ctx.scale(-1, 1); fishBody(ctx, 0, 0, .9, rot, F.col, F.mood, t); ctx.restore();
          if (F.mood === "o" && q > .3 && q < .9){ ctx.beginPath(); ctx.arc(x + (b > a ? 90 : -90), y - 40 - (q - .3) * 120, 14 + (q - .3) * 40, 0, TAU); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke(); } });
      },
      over: (c2, c) => {
        if (t >= tFish && t < tOut){ const p = c.toScreen(900, K.water - 380); popWord(ctx, "WEEEK!", clamp(p[0], 300, 800), Math.max(300, p[1]), t - tFish - .35, { size: 74, hold: 1.0, rot: 8 }); }
        if (t >= tLab && t < tOut + .3){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tOut) / .3, 0, 1); popChip(ctx, K.label || "KEPUTUSAN PELANGGAN", 540, 330, t - tLab, NAVY, "#FFFFFF", 52); ctx.restore(); }
        if (t >= tOut) stampBox(ctx, K.out || "DI LUAR KENDALI", 540, 340, t - tOut, RED, 76, -.07);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pancing || {}; if (K.rodCue) add(cueT(s, K.rodCue, .2, i), "whoosh"); if (K.fishCue){ const a = cueT(s, K.fishCue, .5, i); [0, .55, 1.1, 2, 2.55, 3.1].forEach(d => add(a + d, "pop")); } if (K.labelCue) add(cueT(s, K.labelCue, .5, i), "pop"); if (K.outCue) add(cueT(s, K.outCue, .5, i), "ping"); });

  /* ================= SP46: _kendali (glowing rope ring, effort objects drop in) ================= */
  function effortItem(ctx, kind, t){
    if (kind === "phone"){ ctx.save(); ctx.rotate(Math.sin(t * 18) * .05); rr(ctx, -62, -200, 124, 200, 20); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); rr(ctx, -50, -186, 100, 162, 10); ctx.fillStyle = "#7FD1C0"; ctx.fill(); icon(ctx, "phone", 0, -105, 64, OUT, 6);
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let k = 1; k <= 2; k++){ const a = (t * 3 + k * .5) % 1; ctx.globalAlpha = 1 - a; ctx.beginPath(); ctx.arc(0, -105, 70 + k * 18 + a * 20, -.7, .7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -105, 70 + k * 18 + a * 20, Math.PI - .7, Math.PI + .7); ctx.stroke(); } ctx.globalAlpha = 1; ctx.restore(); }
    else if (kind === "case"){ ctx.beginPath(); ctx.moveTo(-40, -150); ctx.lineTo(-40, -180); ctx.lineTo(40, -180); ctx.lineTo(40, -150); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 6; ctx.stroke();
      rr(ctx, -120, -150, 240, 150, 16); ctx.fillStyle = "#A9622E"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#8E4F22"; ctx.fillRect(-120, -95, 240, 14); rr(ctx, -20, -104, 40, 32, 6); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.translate(30, -150); ctx.rotate(.15); rr(ctx, -40, -70, 90, 80, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = ORANGE; ctx.fillRect(-28, -56, 60, 9); ctx.fillStyle = "#B9A58E"; ctx.fillRect(-28, -40, 48, 7); ctx.fillRect(-28, -28, 56, 7); ctx.restore(); }
    else { ctx.save(); ctx.translate(0, -95); ctx.rotate(t * 1.6); ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(0, 0, 70, .5, TAU - .3); ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 22; ctx.stroke();
      const a = TAU - .3; ctx.save(); ctx.translate(Math.cos(a) * 70, Math.sin(a) * 70); ctx.rotate(a + Math.PI / 2); ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-22, -32); ctx.lineTo(-22, 32); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.restore(); ctx.restore();
      ctx.beginPath(); ctx.arc(0, -95, 40, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = GREEN; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-18, -95); ctx.lineTo(-4, -80); ctx.lineTo(20, -110); ctx.stroke(); }
  }
  function grayItem(ctx, kind){
    if (kind === "fish") fishBody(ctx, 0, 0, .8, 0, "#9C98A3", "smug", 0);
    else { rr(ctx, -90, -60, 180, 120, 18); ctx.fillStyle = "#8C8794"; ctx.fill(); ol(ctx, 6); rr(ctx, 30, -26, 70, 52, 12); ctx.fillStyle = "#77727F"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(60, 0, 9, 0, TAU); ctx.fillStyle = "#C9C4CF"; ctx.fill(); }
  }
  TT.scene(PX + "kendali", "Cerita: lingkar tali bercahaya AREA KENDALIMU, hal di luar kendali terdorong keluar, tiga benda usaha jatuh ke dalam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ cx: 540, cy: 1640, rx: 470, ry: 100 }, f.kendali || {});
    const tRing = T(s, K.ringCue, .3, idx), items = (K.items || []).map((it, j) => Object.assign({ T: T(s, it.cue, .35, idx) }, it)), grays = K.grays || [];
    const lit = t < tRing ? 0 : clamp((t - tRing) / .4, 0, 1);
    const ring = (half) => { ctx.save(); ctx.lineCap = "round";
      const a0 = half ? 0 : Math.PI, a1 = half ? Math.PI : TAU;
      if (lit > 0){ ctx.strokeStyle = hexA(HL, .35 * lit); ctx.lineWidth = 46; ctx.beginPath(); ctx.ellipse(K.cx, K.cy, K.rx, K.ry, 0, a0, a1); ctx.stroke(); }
      ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(K.cx, K.cy, K.rx, K.ry, 0, a0, a1); ctx.stroke();
      ctx.strokeStyle = lit > 0 ? (Math.sin(t * 6) > 0 ? "#FFB45C" : ORANGE) : "#8C7A6A"; ctx.lineWidth = 16; ctx.setLineDash([26, 14]); ctx.lineDashOffset = -t * 60; ctx.stroke(); ctx.setLineDash([]); ctx.restore(); };
    base(ctx, s, t, { env: "info", envOpt: { spotX: K.cx },
      spots: { ring: [K.cx, K.cy - 300, .95] },
      back: () => { ring(false);
        if (t >= tRing && t < tRing + .8){ const q = (t - tRing) / .8; ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(K.cx, K.cy, K.rx * (1 + q * .9), K.ry * (1 + q * .9), 0, 0, TAU); ctx.stroke(); ctx.restore(); } },
      front: () => {
        ring(true);
        grays.forEach((g, j) => { const q = t < tRing ? 0 : easeIO(clamp((t - tRing - j * .1) / 1.1, 0, 1)), x = lerp(g.x, g.x1, q), y = lerp(g.y, g.y1, q) + Math.sin(t * 2 + j) * 12, sc = 1 - q * .35;
          ctx.save(); ctx.globalAlpha *= 1 - q * .55; ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.5 + j) * .1 + q * (j ? .3 : -.3)); ctx.scale(sc, sc); grayItem(ctx, g.kind); ctx.restore();
          ctx.save(); ctx.globalAlpha *= 1 - q * .55; chipW(ctx, g.text, x, y - 110 * sc, "#6B6470", "#FFFFFF", 34); ctx.restore(); });
        items.forEach((it, j) => { if (t < it.T) return; const k = t - it.T, fall = clamp(k / .35, 0, 1), y = lerp(it.y0 ?? 700, it.y ?? 1720, fall * fall), sq = k > .35 && k < .6 ? Math.sin((k - .35) / .25 * Math.PI) * .22 : 0;
          if (k > .35 && k < .9){ const q = (k - .35) / .55; ctx.save(); ctx.globalAlpha = 1 - q; ctx.fillStyle = "#D9C9B4"; for (let d = 0; d < 6; d++){ ctx.beginPath(); ctx.arc(it.x + (d - 2.5) * 40 * (1 + q), (it.y ?? 1720) - q * 30, 14 * (1 - q * .5), 0, TAU); ctx.fill(); } ctx.restore(); }
          ctx.save(); ctx.translate(it.x, y); ctx.scale(1 + sq, 1 - sq); effortItem(ctx, it.kind, t); ctx.restore(); });
      },
      over: (c2, c) => {
        if (t >= tRing) popChip(ctx, K.title || "AREA KENDALIMU", 540, 300, t - tRing, ORANGE, "#FFFFFF", 50);
        items.forEach((it, j) => { if (t < it.T + .3) return; const p = c.toScreen(it.x, (it.y ?? 1720) - 250 - (j === 1 ? 40 : 0)); popChip(ctx, it.text, clamp(p[0], 215, 865), p[1], t - it.T - .3, j === 1 ? ORANGE : NAVY, "#FFFFFF", 34); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kendali || {}; if (K.ringCue) add(cueT(s, K.ringCue, .3, i), "chime"); (K.items || []).forEach(it => { const a = cueT(s, it.cue, .35, i); add(a + .3, "pop"); }); });

  /* ================= SP46: _gelang (POV forearms, rubber bands move left -> right) ================= */
  function forearm(ctx, x, y, side, skin, sleeve, sq, t){ // x,y = wrist (screen); side -1 left / 1 right
    const bx = x - side * 120, by = 2000;
    ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 206; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = skin; ctx.lineWidth = 190; ctx.stroke();
    ctx.strokeStyle = sleeve; ctx.lineWidth = 236; ctx.beginPath(); ctx.moveTo(bx, by + 40); ctx.lineTo(lerp(bx, x, .28), lerp(by, y, .28)); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; const cx = lerp(bx, x, .28), cy = lerp(by, y, .28); ctx.beginPath(); ctx.moveTo(cx - 100, cy + 4); ctx.lineTo(cx + 100, cy - 4); ctx.stroke();
    // fist
    ctx.save(); ctx.translate(x, y - 90); ctx.scale(1 + sq * .08, 1 - sq * .08); rr(ctx, -112, -96, 224, 184, 60); ctx.fillStyle = skin; ctx.fill(); ol(ctx, 7);
    ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 5; for (let k = -1; k <= 1; k++){ ctx.beginPath(); ctx.moveTo(k * 54, -92); ctx.lineTo(k * 54, -44); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-90, -40); ctx.quadraticCurveTo(0, -26, 90, -40); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(side * -78, 6, 46, 70, side * .3, 0, TAU); ctx.fillStyle = skin; ctx.fill(); ol(ctx, 6); ctx.restore();
    ctx.restore(); }
  function band(ctx, x, y, col, txt, side, q, rot){ // ring around a forearm at (x, y); tag points to the inner side
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.ellipse(0, 0, 104, 26, 0, 0, Math.PI); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.stroke();
    if (txt){ const dir = -side; ctx.save(); ctx.translate(dir * 88, 14); fit(ctx, txt, 250, 36, 900, 18); const w = ctx.measureText(txt).width + 30;
      ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(dir * 26, -30); ctx.lineTo(dir * (26 + w), -30); ctx.lineTo(dir * (26 + w), 30); ctx.lineTo(dir * 26, 30); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(txt, dir * (26 + w / 2), 12); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "gelang", "Cerita: sudut pandang dua lengan, tiga gelang karet berlabel dipasang di kiri lalu dipindah ke kanan satu per satu", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ skin: "#C98B62", sleeve: "#5B7DB1" }, f.gelang || {});
    const tPov = T(s, K.povCue, .3, idx), bands = (K.bands || []).map((b, j) => Object.assign({ Ton: tPov + .45 + j * .38, Tmv: T(s, b.cue, .35, idx) }, b));
    if (t < tPov){ base(ctx, s, t, {}); return; }
    const c = cam(s, t, [{ at: 0, x: 540, y: 820, zoom: 1.5 }], { push: .01 }); env(ctx, "home", t, c, Object.assign({ time: "day" }, f.envOpt || {}));
    ctx.save(); ctx.fillStyle = "rgba(30,20,14,.32)"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
    const sway = Math.sin(t * 1.4) * 8, LX = 270, RX = 810, WY = 820 + sway, slots = [940, 1015, 1090];
    const done = bands.filter(b => t >= b.Tmv + .7).length, lastLand = bands.reduce((m, b) => t >= b.Tmv + .7 ? Math.max(m, b.Tmv + .7) : m, -9);
    const sqR = t - lastLand < .25 ? Math.sin((t - lastLand) / .25 * Math.PI) : 0, tAll = bands.length && done === bands.length ? Math.max(...bands.map(b => b.Tmv)) + .75 : 1e9, pump = t > tAll ? Math.abs(Math.sin((t - tAll) * 7)) * 40 * Math.max(0, 1 - (t - tAll) / 2) : 0;
    forearm(ctx, LX, WY - pump, -1, K.skin, K.sleeve, 0, t); forearm(ctx, RX, WY - pump, 1, K.skin, K.sleeve, sqR, t);
    bands.forEach((b, j) => {
      if (t < b.Ton) return; const kOn = t - b.Ton;
      if (t < b.Tmv){ const q = eBack(clamp(kOn / .3, 0, 1)); ctx.save(); ctx.translate(LX + 120 * (slots[j] - WY) / 1180, slots[j] - pump); ctx.scale(1.4 - .4 * q, 1.4 - .4 * q); band(ctx, 0, 0, b.col, b.text, -1, 1, -.1); ctx.restore(); return; }
      const k = t - b.Tmv, q = clamp(k / .7, 0, 1), e = easeIO(q), x = lerp(LX + 120 * (slots[j] - WY) / 1180, RX - 120 * (slots[j] - WY) / 1180, e), y = lerp(slots[j], slots[j], e) - Math.sin(q * Math.PI) * 420 - pump;
      if (q < 1){ ctx.save(); ctx.translate(x, y); ctx.rotate(q * TAU); ctx.scale(1 + Math.sin(q * Math.PI) * .3, 1); band(ctx, 0, 0, b.col, "", 0, 1, 0); ctx.restore(); }
      else { band(ctx, x, y, b.col, b.text, 1, 1, .1); if (k < 1.3) burstFx(ctx, x, y - 20, k - .7, GREEN, 10, 150); }
    });
    TT.CS.ov.push(() => {
      const hq = eBack(clamp((t - tPov - .2) / .35, 0, 1)); if (hq > 0){ ctx.save(); ctx.translate(LX, 560); ctx.scale(hq, hq); chip(ctx, (K.left || "BELUM") + " " + (bands.length - done), 0, 0, "#6B6470", "#FFFFFF", 54); ctx.restore();
        ctx.save(); ctx.translate(RX, 560); ctx.scale(hq * (1 + sqR * .15), hq * (1 + sqR * .15)); chip(ctx, (K.right || "SELESAI") + " " + done, 0, 0, done ? GREEN : NAVY, "#FFFFFF", 54); ctx.restore(); }
      bands.forEach((b, j) => { if (t >= b.Tmv + .7) popWord(ctx, "SNAP!", RX + 40, slots[j] - 230, t - b.Tmv - .7, { size: 62, hold: .6, rot: 10 }); });
      if (t >= tAll){ confetti(ctx, t - tAll); stampBox(ctx, K.stamp || "3 USAHA BERES", 540, 330, t - tAll, GREEN, 70, -.06); }
      if (t - tPov < .3){ ctx.save(); ctx.globalAlpha = 1 - (t - tPov) / .3; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.gelang || {}; if (K.povCue){ const a = cueT(s, K.povCue, .3, i); add(a, "whoosh"); (K.bands || []).forEach((b, j) => { add(a + .45 + j * .38, "pop"); const m = cueT(s, b.cue, .35, i); add(m, "whoosh"); add(m + .7, "pop"); }); const last = Math.max(...(K.bands || []).map(b => cueT(s, b.cue, .35, i))); add(last + .75, "chime"); } });

  /* ================= RN46 shared: catering kitchen ================= */
  BG.dapur = (ctx, t, o) => {
    ctx.fillStyle = "#EAF1EE"; ctx.fillRect(-2600, -1200, 6400, GY + 1200);
    ctx.strokeStyle = "#C9DAD3"; ctx.lineWidth = 4; for (let x = -2600; x < 3800; x += 90){ ctx.beginPath(); ctx.moveTo(x, 380); ctx.lineTo(x, GY - 160); ctx.stroke(); } for (let y = 380; y < GY - 160; y += 90){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
    ctx.fillStyle = "#2F6F73"; ctx.fillRect(-2600, GY - 420, 6400, 26);
    // window with steam
    rr(ctx, -560, 470, 380, 300, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 8); ctx.fillStyle = OUT; ctx.fillRect(-376, 470, 8, 300); ctx.fillRect(-560, 616, 380, 8);
    // shelf with pots
    const sx = o.shelfX ?? 1250; ctx.fillStyle = "#9AA3A8"; ctx.fillRect(sx - 300, 700, 600, 22); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(sx - 300, 700, 600, 22);
    [[-200, "#B9B9C2", 90], [-40, "#C2691F", 110], [140, "#B9B9C2", 80]].forEach(([dx, col, w]) => { rr(ctx, sx + dx - w / 2, 700 - w * .8, w, w * .8, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); rr(ctx, sx + dx - w / 2 - 10, 700 - w * .8 - 12, w + 20, 16, 6); ctx.fill(); ol(ctx, 4); });
    smoke(ctx, -370, 470, t, .6, { n: 5, h: 200, col: "#FFFFFF", s: .7 });
    // wall phone
    if (o.phoneX != null){ const px = o.phoneX, py = o.phoneY ?? 820, ring = o.ringT != null && t > o.ringT && t < (o.ringEnd ?? 1e9), sh = ring ? Math.sin(t * 50) * 6 : 0;
      ctx.save(); ctx.translate(px + sh, py); rr(ctx, -70, -110, 140, 220, 18); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 6); rr(ctx, -50, -96, 100, 50, 10); ctx.fillStyle = ring ? "#9BF0A8" : "#7F8E8A"; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.translate(0, ring ? -10 - Math.abs(Math.sin(t * 25)) * 16 : 0); rr(ctx, -84, -30, 40, 150, 18); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.restore();
      for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.arc(-6 + (i % 3) * 28, 0 + Math.floor(i / 3) * 28, 8, 0, TAU); ctx.fillStyle = "#6B6470"; ctx.fill(); }
      if (ring){ ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const a = ((t * 2.5) + k / 3) % 1; ctx.globalAlpha = 1 - a; ctx.beginPath(); ctx.arc(0, -20, 110 + a * 80, -.8, .8); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -20, 110 + a * 80, Math.PI - .8, Math.PI + .8); ctx.stroke(); } ctx.globalAlpha = 1; }
      ctx.restore(); }
    // floor
    ctx.fillStyle = "#B7C2C6"; ctx.fillRect(-2600, GY - 160, 6400, 2000); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let y = GY - 110; y < GY + 600; y += 60){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  };
  function riceBox(ctx, x, y, w, k, cold){ // y = bottom
    const h = w * .58; ctx.save(); ctx.translate(x, y);
    rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = cold ? "#E3EAF2" : "#FFFDF6"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = ORANGE; ctx.fillRect(-w / 2 + 3, -h * .55, w - 6, h * .2); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .78); ctx.lineTo(w / 2, -h * .78); ctx.stroke();
    ctx.restore(); }
  function boxStack(ctx, cx, top, n, w, t, o){ o = o || {}; const cols = o.cols || 4, h = w * .58;
    for (let i = 0; i < n; i++){ const r = Math.floor(i / cols), cI = i % cols, x = cx + (cI - (cols - 1) / 2) * (w + 4) + (r % 2 ? 10 : 0), y = top - r * (h + 2), born = o.born ? o.born(i) : -1;
      if (born > t) continue; const k = t - born, dy = born < 0 ? 0 : (1 - eOut(clamp(k / .25, 0, 1))) * -200; ctx.save(); ctx.globalAlpha *= born < 0 ? 1 : clamp(k / .1, 0, 1); riceBox(ctx, x, y + dy, w, k, o.cold); ctx.restore(); }
    if (o.steam > 0){ for (let i = 0; i < cols; i++) smoke(ctx, cx + (i - (cols - 1) / 2) * (w + 4), top - Math.ceil(n / cols) * (h + 2), t + i * .3, o.steam, { n: 4, h: 140, col: "#FFFFFF", s: .45 }); } }
  function steelTable(ctx, x, top, w){ rr(ctx, x - w / 2, top, w, 34, 6); ctx.fillStyle = "#C9D1D6"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(x - w / 2 + 10, top + 6, w - 20, 6);
    [-1, 1].forEach(d => { rr(ctx, x + d * (w / 2 - 30) - 10, top + 34, 20, GY - top - 34, 4); ctx.fillStyle = "#8C969C"; ctx.fill(); ol(ctx, 4); }); ctx.fillStyle = "#8C969C"; ctx.fillRect(x - w / 2 + 20, GY - 120, w - 40, 12); }

  /* ================= RN46: _dapur (phone rings, boxes stacked, finger pointing) ================= */
  TT.scene(PX + "dapur", "Cerita: dapur katering, telepon dinding berdering, seratus kotak nasi menumpuk, dua juru masak saling tunjuk", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ tableX: 540, top: 1400, w: 400 }, f.dapur || {});
    const tRing = T(s, K.ringCue, .3, idx), tBox = T(s, K.boxCue, .3, idx), tPoint = T(s, K.pointCue, .4, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { phone: [540, 900, 1.15] },
      back: () => { BG.dapur(ctx, t, { phoneX: K.phoneX ?? 540, phoneY: 800, ringT: tRing, ringEnd: tPoint }); },
      mid: () => { steelTable(ctx, K.tableX, K.top, K.w); boxStack(ctx, K.tableX, K.top, 16, 86, t, { cols: 4, born: i => tBox + i * .07, steam: .7 }); },
      midZ: -.5,
      front: () => {
        if (t >= tPoint){ const q = clamp((t - tPoint) / .3, 0, 1); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.globalAlpha = .5 + .5 * Math.sin(t * 20);
          ctx.beginPath(); for (let i = 0; i <= 10; i++){ const x = lerp(K.tableX - 170, K.tableX + 170, i / 10), y = 1080 + (i % 2 ? -30 : 30) * q; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
      },
      over: (c2, c) => {
        if (t >= tRing && t < tPoint){ const p = c.toScreen(540, 640); popWord(ctx, "KRIIING!", clamp(p[0], 300, 780), Math.max(300, p[1]), (t - tRing) % 1.2, { size: 70, hold: 1.0, rot: (Math.floor((t - tRing) / 1.2) % 2 ? 8 : -8) }); }
        if (t >= tBox + .3) popChip(ctx, K.chip || "100 KOTAK BELUM TIBA", 540, 330, t - tBox - .3, RED, "#FFFFFF", 46);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.dapur || {}; if (K.ringCue){ const a = cueT(s, K.ringCue, .3, i); for (let k = 0; k < 3; k++) add(a + k * 1.2, "ping"); } if (K.boxCue) add(cueT(s, K.boxCue, .3, i) + .3, "pop"); if (K.pointCue) add(cueT(s, K.pointCue, .4, i), "whoosh"); });

  /* ================= RN46: _ring (boxing ring of blame, scoreboard, rice boxes going cold) ================= */
  function glove(ctx, x, y, col, face, t){ ctx.save(); ctx.translate(x, y); ctx.scale(face, 1); ctx.beginPath(); ctx.ellipse(8, -4, 46, 40, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(-12, 16, 20, 16, .4, 0, TAU); ctx.fill(); ol(ctx, 4); rr(ctx, -40, 18, 44, 28, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .4); ctx.beginPath(); ctx.ellipse(20, -20, 14, 8, -.5, 0, TAU); ctx.fill(); ctx.restore(); }
  TT.scene(PX + "ring", "Cerita: khayalan ring tinju adu siapa benar, papan skor bertambah tiap teriakan, kotak nasi di sudut makin dingin", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ boxX: 1380 }, f.ring || {});
    const tA = T(s, K.aCue, .3, idx), tB = T(s, K.bCue, .3, idx), tLoud = T(s, K.loudCue, .3, idx), tCold = T(s, K.coldCue, .3, idx), tPile = T(s, K.pileCue, .3, idx);
    let sa = 0, sb = 0; if (t > tA) sa++; if (t > tB) sb++; if (t > tLoud){ const n = Math.floor(Math.min(t, tCold) - tLoud) * 2 + 1 + (((Math.min(t, tCold) - tLoud) % 1) > .5 ? 1 : 0); sa += Math.ceil(n / 2); sb += Math.floor(n / 2); }
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      spots: { boxes: [K.boxX, 1180, 1.05] },
      back: () => {
        // crowd silhouettes
        for (let i = 0; i < 26; i++){ const x = -700 + i * 110, y = 1180 + (i % 2) * 30 + Math.sin(t * 6 + i) * 6; ctx.fillStyle = i % 3 ? "#1B2A45" : "#22355A"; ctx.beginPath(); ctx.arc(x, y - 60, 40, 0, TAU); ctx.fill(); rr(ctx, x - 55, y - 20, 110, 140, 30); ctx.fill(); }
        // ring floor
        ctx.fillStyle = "#3E7DB5"; ctx.beginPath(); ctx.moveTo(-60, GY - 140); ctx.lineTo(1140, GY - 140); ctx.lineTo(1260, GY + 200); ctx.lineTo(-180, GY + 200); ctx.closePath(); ctx.fill(); ol(ctx, 8);
        ctx.fillStyle = "#2A5F8E"; ctx.fillRect(-180, GY + 200, 1440, 120); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.strokeRect(-180, GY + 200, 1440, 120);
        // back ropes + posts
        [-60, 1140].forEach((x, k) => { rr(ctx, x - 18, GY - 560, 36, 430, 8); ctx.fillStyle = k ? "#3E6FB5" : RED; ctx.fill(); ol(ctx, 5); });
        ["#FFFFFF", RED, "#FFFFFF"].forEach((col, r) => { const y = GY - 520 + r * 120; ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-60, y); ctx.lineTo(1140, y + Math.sin(t * 3 + r) * 4); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); });
        // scoreboard
        const bx = 540, by = 560; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx - 220, 200); ctx.lineTo(bx - 220, by - 120); ctx.moveTo(bx + 220, 200); ctx.lineTo(bx + 220, by - 120); ctx.stroke();
        rr(ctx, bx - 330, by - 130, 660, 260, 18); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 8); textC(ctx, K.title || "SIAPA BENAR?", bx, by - 72, 46, GOLD, 900);
        [[-1, K.a || "SARI", sa, RED], [1, K.b || "DODI", sb, "#5B8FD9"]].forEach(([d, nm, v, col]) => { const x = bx + d * 160; rr(ctx, x - 130, by - 40, 260, 150, 12); ctx.fillStyle = hexA(col, .25); ctx.fill(); textC(ctx, nm, x, by - 2, 34, "#FFFFFF", 900); textC(ctx, String(v), x, by + 90, 80, col, 900); });
        // corner: rice boxes going cold
        const cold = t > tCold ? clamp((t - tCold) / 1.2, 0, 1) : 0; steelTable(ctx, K.boxX, 1440, 360);
        boxStack(ctx, K.boxX, 1440, t > tPile ? 20 : 12, 80, t, { cols: 4, cold: cold > .5, steam: 1 - cold, born: i => i < 12 ? -1 : tPile + (i - 12) * .12 });
        if (cold > 0){ ctx.save(); ctx.globalAlpha = cold; ctx.fillStyle = "#BFE3FF"; for (let i = 0; i < 12; i++){ ctx.beginPath(); ctx.arc(K.boxX - 180 + rnd(i) * 360, 1000 + ((t * 60 + rnd(i + 3) * 400) % 420), 6, 0, TAU); ctx.fill(); } ctx.restore(); }
      },
      over1: (c2, c, sts, j) => { const st = sts[j]; if (j > 1 || !st) return; const k = st.size / 92, f2 = st.face || 1, cols = [RED, "#3E6FB5"], h = handOf(st), jab = t > tLoud && t < tCold ? Math.max(0, Math.sin(t * 9 + j * 1.6)) * 40 : 0;
        glove(ctx, h[0] + jab * f2, h[1], cols[j], f2, t); glove(ctx, st.x + 8 * k * f2, st.y - 44 * k, cols[j], f2, t); },
      front: () => { ["#FFFFFF", RED].forEach((col, r) => { const y = GY - 140 + r * 90; ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-200, y + 120); ctx.lineTo(1280, y + 120); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); }); },
      over: (c2, c) => {
        if (t >= tLoud && t < tCold){ const k = t - tLoud; [["BENAR!", 260, 520], ["SALAH!", 820, 560], ["AKU!", 300, 640], ["KAMU!", 790, 480]].forEach(([w, x, y], i) => popWord(ctx, w, x, y, (k - i * .45 + 4) % 1.8 - .0, { size: 66 + i * 4, hold: .8, rot: i % 2 ? 9 : -9, col: i % 2 ? "#7FB2FF" : HL })); }
        if (t >= tCold){ popChip(ctx, K.chip || "NASI MULAI DINGIN", 540, 330, t - tCold, "#5B8FD9", "#FFFFFF", 46); }
        if (t >= tPile + .3){ popChip(ctx, K.chip2 || "KLIEN MENUNGGU", 540, 430, t - tPile - .3, RED, "#FFFFFF", 40); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ring || {}; if (K.loudCue){ const a = cueT(s, K.loudCue, .3, i), b = K.coldCue ? cueT(s, K.coldCue, .3, i) : a + 3; for (let x = a; x < b; x += .5) add(x, "pop"); } if (K.coldCue) add(cueT(s, K.coldCue, .3, i), "whoosh"); if (K.pileCue) add(cueT(s, K.pileCue, .3, i) + .3, "ping"); });

  /* ================= RN46: _kertas (problem sheet in the middle, trophy into NANTI box) ================= */
  function trophy(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * .05);
    ctx.beginPath(); ctx.moveTo(-70, -150); ctx.lineTo(70, -150); ctx.quadraticCurveTo(70, -40, 0, -30); ctx.quadraticCurveTo(-70, -40, -70, -150); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6);
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 78, -110, 26, d > 0 ? -1.6 : 1.6 - Math.PI, d > 0 ? 1.4 : Math.PI - 1.4 + Math.PI * 0, d < 0); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.stroke(); });
    rr(ctx, -16, -34, 32, 40, 4); ctx.fillStyle = "#C98A1B"; ctx.fill(); ol(ctx, 5); rr(ctx, -56, 4, 112, 34, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); textC(ctx, "?", 0, -70, 60, "#8E5A34", 900); ctx.restore(); }
  TT.scene(PX + "kertas", "Cerita: kepala dapur menaruh kertas masalah di tengah meja, kertas naik jadi spanduk, piala SIAPA BENAR masuk kotak NANTI", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ tableX: 540, top: 1400, w: 400, boxX: 880, boxY: 820 }, f.kertas || {});
    const tPut = T(s, K.putCue, .3, idx), tRise = T(s, K.riseCue, .3, idx), tTro = T(s, K.trophyCue, .3, idx), tLater = T(s, K.laterCue, .3, idx), tNow = T(s, K.nowCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      back: () => { BG.dapur(ctx, t, { phoneX: -400 });
        // NANTI box on the wall shelf
        const bq = t < tTro ? 0 : eBack(clamp((t - tTro - .3) / .4, 0, 1)); if (bq > 0){ ctx.save(); ctx.translate(K.boxX, K.boxY); ctx.scale(bq, bq); ctx.fillStyle = "#9AA3A8"; ctx.fillRect(-150, 0, 300, 18); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-150, 0, 300, 18);
          rr(ctx, -110, -130, 220, 130, 10); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 6); textC(ctx, "NANTI", 0, -50, 50, "#FFFFFF", 900); const lid = t > tLater + .6 ? 0 : t > tLater ? -.9 : -.9 * bq; ctx.save(); ctx.translate(-110, -130); ctx.rotate(lid); rr(ctx, 0, -18, 220, 22, 6); ctx.fillStyle = "#A9622E"; ctx.fill(); ol(ctx, 5); ctx.restore(); ctx.restore(); } },
      mid: () => { steelTable(ctx, K.tableX, K.top, K.w); boxStack(ctx, K.tableX - 120, K.top, 6, 70, t, { cols: 2, steam: .5 });
        if (t >= tPut){ const q = clamp((t - tPut) / .35, 0, 1), y = lerp(K.top - 400, K.top - 6, eOut(q)); ctx.save(); ctx.translate(K.tableX + 70, y); ctx.rotate(-.1 + (1 - q) * .6); rr(ctx, -80, -12, 160, 14, 3); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.restore();
          if (q >= 1 && t - tPut < .9) burstFx(ctx, K.tableX + 70, K.top - 10, t - tPut - .35, ORANGE, 10, 120); } },
      midZ: -.5,
      front: () => {
        if (t >= tTro){ const k = t - tTro, inQ = eBack(clamp(k / .4, 0, 1)), mv = t > tLater ? easeIO(clamp((t - tLater) / .6, 0, 1)) : 0, x = lerp(540, K.boxX, mv), y = lerp(760, K.boxY - 120, mv) - Math.sin(mv * Math.PI) * 140;
          if (mv < 1){ trophy(ctx, x, y, inQ * (1 - mv * .5), t); if (mv === 0) chipW(ctx, K.trophy || "SIAPA BENAR?", 540, 560, "#8E5A34", "#FFFFFF", 34); } }
      },
      over: (c2, c) => {
        if (t >= tRise && t < tNow + .3){ const k = t - tRise, q = eBack(clamp(k / .5, 0, 1)), a = 1 - clamp((t - tNow) / .3, 0, 1); ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 330 + (1 - q) * 500); ctx.scale(.3 + .7 * q, .3 + .7 * q); ctx.rotate(-.03 + Math.sin(t * 2) * .01);
          rr(ctx, -400, -110, 800, 220, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8); ctx.fillStyle = RED; rr(ctx, -400, -110, 800, 60, 14); ctx.fill(); ol(ctx, 8);
          textC(ctx, K.tag || "MASALAH KITA", 0, -66, 36, "#FFFFFF", 900); textC(ctx, K.problem || "KLIEN MENUNGGU", 0, 30, 76, BROWN, 900, 740); textC(ctx, K.sub || "100 kotak nasi belum tiba", 0, 82, 34, "#6B6470", 800, 700); ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kertas || {}; if (K.putCue) add(cueT(s, K.putCue, .3, i) + .3, "pop"); if (K.riseCue) add(cueT(s, K.riseCue, .3, i), "whoosh"); if (K.trophyCue) add(cueT(s, K.trophyCue, .3, i), "pop"); if (K.laterCue){ add(cueT(s, K.laterCue, .3, i), "whoosh"); add(cueT(s, K.laterCue, .3, i) + .6, "pop"); } });

  /* ================= RN46: _sisi (same side of the table / courier motorbike / shared schedule) ================= */
  function scooterR(ctx, x, y, t, o){ o = o || {}; const f = o.face || 1, s = o.s || 1, run = o.run; ctx.save(); ctx.translate(x, y + (run ? Math.sin(t * 22) * 3 : 0)); ctx.scale(f * s, s); ctx.lineJoin = "round";
    const body = o.col || "#3E9B5A";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(10, 4, 260, 18, 0, 0, TAU); ctx.fill();
    const wheel = cx => { ctx.save(); ctx.translate(cx, -60); ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#B9B9C2"; ctx.fill(); ol(ctx, 4);
      ctx.rotate((o.roll || 0) / 60); ctx.strokeStyle = OUT; ctx.lineWidth = 5; for (let k = 0; k < 3; k++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, 0); ctx.stroke(); } ctx.restore(); };
    wheel(-160); wheel(175);
    if (o.boxes){ for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 2; c2++) riceBox(ctx, -230 + c2 * 74, -300 - r * 44, 70, 0); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-275, -340); ctx.lineTo(-120, -380); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-250, -110); ctx.quadraticCurveTo(-260, -250, -120, -265); ctx.lineTo(10, -255); ctx.quadraticCurveTo(40, -170, 20, -110); ctx.closePath(); ctx.fillStyle = body; ctx.fill(); ol(ctx, 6);
    rr(ctx, -215, -300, 210, 46, 22); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -10, -120, 140, 26, 10); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 4);
    ctx.restore(); }
  function scooterFront(ctx, x, y, t, o){ o = o || {}; const f = o.face || 1, s = o.s || 1, run = o.run; ctx.save(); ctx.translate(x, y + (run ? Math.sin(t * 22) * 3 : 0)); ctx.scale(f * s, s); ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(110, -100); ctx.lineTo(130, -330); ctx.quadraticCurveTo(180, -350, 210, -300); ctx.lineTo(200, -120); ctx.closePath(); ctx.fillStyle = o.col || "#3E9B5A"; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(140, -330); ctx.lineTo(90, -420); ctx.stroke(); rr(ctx, 60, -440, 80, 24, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(205, -280, 18, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (run){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const yy = y - 80 - i * 60, xx = x - f * (330 + ((t * 900 + i * 140) % 300)); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - f * 140, yy); ctx.stroke(); } ctx.restore(); } }
  function scheduleSheet(ctx, x, y, q, t, rows){ ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.rotate(-.02);
    rr(ctx, -300, -220, 600, 440, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8); rr(ctx, -300, -220, 600, 80, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 8);
    textC(ctx, "JADWAL BERSAMA", 0, -166, 44, "#FFFFFF", 900); ctx.beginPath(); ctx.arc(0, -232, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4);
    (rows || []).forEach((r, i) => { const yy = -90 + i * 92; textL(ctx, r[0], -260, yy + 14, 40, ORANGE, 900); textL(ctx, r[1], -120, yy + 14, 40, BROWN, 800, 280);
      if (t > (r[2] ?? 0)){ const k = eBack(clamp((t - r[2]) / .3, 0, 1)); ctx.save(); ctx.translate(230, yy); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-3, 10); ctx.lineTo(14, -10); ctx.stroke(); ctx.restore(); }
      ctx.strokeStyle = hexA(OUT, .15); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-270, yy + 46); ctx.lineTo(270, yy + 46); ctx.stroke(); });
    ctx.restore(); }
  TT.scene(PX + "sisi", "Cerita: dua juru masak pindah ke sisi meja yang sama, kurir motor melaju membawa kotak nasi, jadwal bersama ditempel", (ctx, th, s, t) => {
    const idx = G.scene, { F } = shotOf(s, t), K = Object.assign({ tableX: 540, top: 1440, w: 520 }, F.sisi || {});
    const part = K.part || "meja", tSide = T(s, K.sideCue, .3, idx), tSheet = T(s, K.sheetCue, .3, idx);
    const kur = K.kurir != null ? K.kurir : -1;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      back: (c2, c, sts) => {
        if (part === "meja" || part === "jadwal") BG.dapur(ctx, t, { phoneX: -400 });
        if (part === "jadwal"){ const q = t < tSheet ? 0 : eBack(clamp((t - tSheet) / .45, 0, 1)); if (q > 0) scheduleSheet(ctx, 540, 720, q, t, (K.rows || []).map((r, i) => [r[0], r[1], tSheet + .5 + i * .35])); }
        if (kur >= 0 && sts[kur]){ const st = sts[kur]; st.y = GY - 20 * st.size / 92; st.pose = "sit"; }
      },
      mid: () => { if (part === "meja"){ steelTable(ctx, K.tableX, K.top, K.w); const tPack = T(s, K.packCue, .3, idx); boxStack(ctx, K.tableX + 160, K.top, t > tPack ? 10 : 4, 64, t, { cols: 2, steam: .6, born: i => i < 4 ? -1 : tPack + (i - 4) * .18 }); if (t >= tSide){ const q = eBack(clamp((t - tSide) / .4, 0, 1)); ctx.save(); ctx.translate(K.tableX, K.top - 4); ctx.scale(q, q); rr(ctx, -90, -14, 180, 16, 3); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.restore(); } } },
      midZ: .5,
      under: (c2, c, sts, j) => { if (j !== kur) return; const st = sts[j]; scooterR(ctx, st.x - 30 * (st.face || 1), GY, t, { face: st.face || 1, run: st.moving, boxes: true, roll: st.x, s: 1 }); },
      over1: (c2, c, sts, j) => { if (j !== kur) return; const st = sts[j]; scooterFront(ctx, st.x - 30 * (st.face || 1), GY, t, { face: st.face || 1, run: st.moving, s: 1 }); },
      over: () => {
        if (part === "meja" && t >= tSide + .6) popChip(ctx, K.chip || "SATU SISI", 540, 330, t - tSide - .6, ORANGE, "#FFFFFF", 54);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const K = F.sisi || {}; if (K.sideCue) add(cueT(s, K.sideCue, .3, i) + .6, "chime"); if (K.sheetCue) add(cueT(s, K.sheetCue, .3, i), "pop"); }); });

  /* ================= KD46 shared: popcorn ideas ================= */
  function popcorn(ctx, x, y, r, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); const sc = r / 60; ctx.scale(sc, sc);
    const puffs = [[-34, 6, 30], [30, 8, 30], [0, -22, 34], [-22, -30, 24], [26, -28, 24], [0, 20, 30]];
    ctx.fillStyle = o.col || "#FFF4D6"; puffs.forEach(([px, py, pr]) => { ctx.beginPath(); ctx.arc(px, py, pr, 0, TAU); ctx.fill(); }); ctx.strokeStyle = OUT; ctx.lineWidth = 5 / Math.max(.4, sc) * .9;
    puffs.forEach(([px, py, pr]) => { ctx.beginPath(); ctx.arc(px, py, pr, 0, TAU); ctx.stroke(); }); ctx.fillStyle = o.col || "#FFF4D6"; puffs.forEach(([px, py, pr]) => { ctx.beginPath(); ctx.arc(px, py, pr - 3, 0, TAU); ctx.fill(); });
    ctx.fillStyle = hexA("#F6C343", .55); ctx.beginPath(); ctx.arc(-8, 14, 16, 0, TAU); ctx.fill();
    if (o.face){ const m = o.face; ctx.fillStyle = OUT;
      if (m === "laugh"){ ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.arc(-16, -8, 8, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(16, -8, 8, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 8, 16, 0, Math.PI); ctx.fillStyle = "#8B2E2E"; ctx.fill(); ctx.stroke(); }
      else if (m === "dizzy"){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; [-16, 16].forEach(ex => { ctx.beginPath(); for (let a = 0; a < 12; a += .3){ const rr2 = a * .9; ctx.lineTo(ex + Math.cos(a + t * 8) * rr2, -8 + Math.sin(a + t * 8) * rr2); } ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(-10, 16); ctx.quadraticCurveTo(0, 6, 10, 18); ctx.stroke(); }
      else if (m === "sweat"){ ctx.beginPath(); ctx.arc(-14, -8, 6, 0, TAU); ctx.arc(14, -8, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-10, 14); ctx.lineTo(10, 14); ctx.stroke(); ctx.fillStyle = "#7FC8F8"; ctx.beginPath(); ctx.ellipse(34, -30, 7, 11, 0, 0, TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(-14, -6, 6, 0, TAU); ctx.arc(14, -6, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 6, 10, .2, Math.PI - .2); ctx.stroke(); } }
    ctx.restore(); }
  function ideaChip(ctx, txt, x, y, k, o){ o = o || {}; if (k < 0) return; const q = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.rotate(o.rot || 0);
    popcorn(ctx, -0, -8, 44, 0, { col: o.pc }); fit(ctx, txt, o.maxW || 280, o.size || 30, 900, 16); const w = ctx.measureText(txt).width + 34, sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    rr(ctx, -w / 2, 8, w, sz * 1.5, sz * .75); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = o.fg || BROWN; ctx.textAlign = "center"; ctx.fillText(txt, 0, 8 + sz * 1.06); ctx.textAlign = "left";
    if (o.cross){ ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = "round"; const c = clamp(o.cross, 0, 1); ctx.beginPath(); ctx.moveTo(-w / 2 - 6, 8 + sz * .75); ctx.lineTo(-w / 2 - 6 + (w + 12) * c, 8 + sz * .75); ctx.stroke(); }
    ctx.restore(); }
  function laptopBig(ctx, x, y, w, t, o){ o = o || {}; const h = w * .64; ctx.save(); ctx.translate(x, y);
    rr(ctx, -w / 2 - 30, -16, w + 60, 26, 10); ctx.fillStyle = "#B9B9C2"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -w / 2, -16 - h, w, h, 16); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 16, -h, w - 32, h - 32, 8); ctx.fillStyle = o.screen || "#1C3550"; ctx.fill();
    if (o.draw) { ctx.save(); ctx.beginPath(); rr(ctx, -w / 2 + 16, -h, w - 32, h - 32, 8); ctx.clip(); ctx.translate(0, -16 - h / 2); o.draw(ctx, w - 32, h - 32); ctx.restore(); }
    ctx.restore(); }

  /* ================= KD46: _kosong (blank naming sheet, tumbleweed, clock spins) ================= */
  function tumbleweed(ctx, x, y, r, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 5; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.ellipse(0, 0, r, r * (.35 + rnd(i) * .5), i * .7, 0, TAU); ctx.stroke(); } ctx.strokeStyle = "#B98152"; ctx.lineWidth = 3; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.ellipse(0, 0, r * .8, r * .3, i * 1.1 + .3, 0, TAU); ctx.stroke(); } ctx.restore(); }
  TT.scene(PX + "kosong", "Cerita: kertas nama program kosong di dinding, semak gurun bergulir melintas, jam berputar, ide satu-satunya ditulis lesu", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 720, y: 760, w: 460, h: 560 }, f.kosong || {});
    const tBlank = T(s, K.blankCue, .3, idx), tHour = T(s, K.hourCue, .3, idx), tWrite = T(s, K.writeCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plant: true, plantX: 1020, rug: false },
      spots: { paper: [K.x, K.y + 80, 1.12] },
      back: () => {
        // cork board + paper
        rr(ctx, K.x - K.w / 2 - 40, K.y - K.h / 2 - 40, K.w + 80, K.h + 80, 14); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 7);
        ctx.save(); ctx.translate(K.x, K.y); ctx.rotate(-.015); rr(ctx, -K.w / 2, -K.h / 2, K.w, K.h, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, K.head || "NAMA PROGRAM:", 0, -K.h / 2 + 60, 36, ORANGE, 900, K.w - 40);
        ctx.strokeStyle = "#D7C7B2"; ctx.lineWidth = 3; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(-K.w / 2 + 30, -K.h / 2 + 120 + i * 70); ctx.lineTo(K.w / 2 - 30, -K.h / 2 + 120 + i * 70); ctx.stroke(); }
        if (t >= tWrite){ const txt = K.idea || "Pelatihan Baru", n = Math.floor(clamp((t - tWrite) / 1.0, 0, 1) * txt.length); font(ctx, 700, 44, FAM); ctx.fillStyle = "#3E5A8C"; ctx.textAlign = "center"; ctx.save(); ctx.rotate(-.04); ctx.fillText(txt.slice(0, n), 0, -K.h / 2 + 170); ctx.restore(); ctx.textAlign = "left"; }
        ctx.beginPath(); ctx.arc(0, -K.h / 2 + 10, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3);
        if (t >= tBlank){ const k = (t - tBlank) % 3.2, x = lerp(K.w / 2 + 120, -K.w / 2 - 120, k / 2.4), y = 150 - Math.abs(Math.sin(k * 5)) * 60; if (k < 2.4){ ctx.save(); ctx.beginPath(); ctx.rect(-K.w / 2, -K.h / 2, K.w, K.h); ctx.clip(); tumbleweed(ctx, x, y, 56, -k * 6); ctx.strokeStyle = hexA("#B98152", .6); ctx.lineWidth = 4; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(x + 80 + i * 30, y - 20 + i * 22); ctx.lineTo(x + 170 + i * 30, y - 20 + i * 22); ctx.stroke(); } ctx.restore(); } }
        ctx.restore();
        // wall clock
        const cx = K.clockX ?? 230, cy = K.clockY ?? 560, sp = t > tHour ? clamp(t - tHour, 0, 1.6) : 0; ctx.beginPath(); ctx.arc(cx, cy, 80, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7);
        for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = OUT; ctx.fillRect(cx + Math.cos(a) * 62 - 3, cy + Math.sin(a) * 62 - 3, 6, 6); }
        const am = -Math.PI / 2 + sp * TAU * 2.5 + (sp >= 1.6 ? 0 : 0), ah = -Math.PI / 2 + 1.1 + sp * TAU * 2.5 / 12; ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ah) * 36, cy + Math.sin(ah) * 36); ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = RED; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(am) * 58, cy + Math.sin(am) * 58); ctx.stroke();
        if (sp > 0 && sp < 1.6){ ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 100, t * 9, t * 9 + 1.6); ctx.stroke(); }
      },
      over: (c2, c) => {
        if (t >= tBlank){ const k = t - tBlank; popWord(ctx, "krik... krik...", 540, 330, k % 2.2, { size: 64, hold: 1.6, rot: -4, col: "#9BD3A8" }); }
        if (t >= tHour) popChip(ctx, K.hourChip || "+1 JAM", 260, 470, t - tHour, NAVY, "#FFFFFF", 40);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kosong || {}; if (K.blankCue) add(cueT(s, K.blankCue, .3, i), "whoosh"); if (K.hourCue) add(cueT(s, K.hourCue, .3, i), "whoosh"); if (K.writeCue) add(cueT(s, K.writeCue, .5, i), "pop"); });

  /* ================= KD46: _berondong (laptop popcorn machine, idea kernels pop into labelled popcorn) ================= */
  TT.scene(PX + "berondong", "Cerita: laptop berubah jadi mesin berondong, biji ide meletup jadi berondong berlabel nama yang memenuhi layar", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ lx: 650, ly: 1400, lw: 420 }, f.berondong || {});
    const tType = T(s, K.typeCue, .3, idx), tPop = T(s, K.popCue, .3, idx), names = K.names || [];
    const slots = names.map((n, i) => [[230, 540, 850][i % 3] + (Math.floor(i / 3) % 2 ? 40 : -20), 430 + Math.floor(i / 3) * 112]);
    base(ctx, s, t, { env: "info", envOpt: { spotX: K.lx },
      spots: { laptop: [K.lx, K.ly - 220, 1.15] },
      back: () => {
        rr(ctx, K.lx - 330, K.ly, 660, 30, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); [-1, 1].forEach(d => { rr(ctx, K.lx + d * 290 - 14, K.ly + 30, 28, GY - K.ly - 30, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); });
        const machine = t >= tPop; const shake = machine ? Math.sin(t * 40) * 4 : 0;
        laptopBig(ctx, K.lx + shake, K.ly, K.lw, t, { screen: machine ? "#FFE7A8" : "#1C3550", draw: (c, w, h) => {
          if (!machine){ rr(c, -w / 2 + 20, -h / 2 + 24, w - 40, 70, 14); c.fillStyle = "#FFFFFF"; c.fill(); const txt = K.prompt || "20 nama hangat & singkat", n = t < tType ? 0 : Math.floor(clamp((t - tType) / 1.4, 0, 1) * txt.length);
            fit(c, txt, w - 70, 26, 800); c.fillStyle = BROWN; c.textAlign = "left"; c.fillText(txt.slice(0, n) + (Math.sin(t * 8) > 0 ? "|" : ""), -w / 2 + 36, -h / 2 + 68);
            rr(c, w / 2 - 110, h / 2 - 70, 90, 46, 12); c.fillStyle = ORANGE; c.fill(); textC(c, "AI", w / 2 - 65, h / 2 - 36, 28, "#FFFFFF", 900); }
          else { for (let i = 0; i < 14; i++){ const q = ((t * 1.4 + rnd(i)) % 1); popcorn(c, (rnd(i + 4) - .5) * w * .8, h / 2 - q * h * 1.1, 18, t, {}); } } } });
        if (machine){ ctx.save(); ctx.globalAlpha = .5 + .3 * Math.sin(t * 10); glowAt(ctx, K.lx, K.ly - 160, 360, GOLD, .5); ctx.restore(); }
        // pile of plain popcorn on the table
        if (machine){ const n = Math.min(26, Math.floor((t - tPop) * 10)); for (let i = 0; i < n; i++) popcorn(ctx, K.lx - 290 + rnd(i + 30) * 580, K.ly - 14 - rnd(i + 60) * 30, 22, t, { rot: rnd(i) * 3 }); }
      },
      front: () => {
        if (t < tPop) return;
        names.forEach((nm, i) => { const T0 = tPop + i * .16, k = t - T0; if (k < 0) return; const fly = clamp(k / .45, 0, 1), e = eOut(fly), sl = slots[i], sx = K.lx + (rnd(i) - .5) * 200, sy = K.ly - 300;
          const x = lerp(sx, sl[0], e), y = lerp(sy, sl[1], e) - Math.sin(fly * Math.PI) * 220 + (fly >= 1 ? Math.sin(t * 2.5 + i) * 6 : 0);
          if (fly < 1){ popcorn(ctx, x, y, 26 + 20 * e, t, { rot: k * 8 }); if (k < .2) burstFx(ctx, sx, sy, k, GOLD, 8, 80); }
          else ideaChip(ctx, nm, x, y, k - .45, { size: 28, maxW: 270, rot: (rnd(i + 9) - .5) * .12 }); });
      },
      over: () => {
        if (t >= tPop) popWord(ctx, "POP! POP!", 540, 1180, (t - tPop) % 1.4, { size: 70, hold: 1.1, rot: -6 });
        const tEnd = tPop + names.length * .16 + .5; if (t >= tEnd) popChip(ctx, K.count || "20 IDE", 870, 1060, t - tEnd, ORANGE, "#FFFFFF", 50, -.06);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.berondong || {}; if (K.typeCue) add(cueT(s, K.typeCue, .3, i), "pop"); if (K.popCue){ const a = cueT(s, K.popCue, .3, i); add(a, "whoosh"); (K.names || []).forEach((n, j) => { if (j % 2 === 0) add(a + j * .16 + .45, "pop"); }); add(a + (K.names || []).length * .16 + .5, "chime"); } });

  /* ================= KD46: _aneh (funny / weird / too long popcorn ideas come alive; laptop shrugs) ================= */
  TT.scene(PX + "aneh", "Cerita: tiga berondong ide hidup (lucu tertawa, aneh pusing, kepanjangan jadi spanduk), laptop mengangkat bahu soal budaya kantor", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ deskX: 790, top: 1380 }, f.aneh || {});
    const tA = T(s, K.funnyCue, .3, idx), tB = T(s, K.weirdCue, .3, idx), tC = T(s, K.longCue, .3, idx), tMany = T(s, K.manyCue, .3, idx), tCult = T(s, K.cultCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plant: false, rug: false },
      spots: { laptop: [K.deskX, K.top - 200, 1.15] },
      back: () => {
        rr(ctx, K.deskX - 240, K.top, 480, 30, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); [-1, 1].forEach(d => { rr(ctx, K.deskX + d * 200 - 14, K.top + 30, 28, GY - K.top - 30, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); });
        const shrug = t >= tCult ? Math.abs(Math.sin((t - tCult) * 5)) * 12 : 0;
        laptopBig(ctx, K.deskX, K.top, 300, t, { screen: "#1C3550", draw: (c, w, h) => {
          if (t < tCult){ for (let i = 0; i < 6; i++){ c.fillStyle = hexA("#7FD1C0", .5); c.fillRect(-w / 2 + 20, -h / 2 + 20 + i * 24, (w - 60) * (.4 + rnd(i) * .6), 10); } }
          else { c.save(); c.translate(0, -shrug * .5); textC(c, "¯\\_(ツ)_/¯", 0, 18, 46, "#FFFFFF", 800, w - 20); c.restore(); } } });
        if (t >= tMany){ for (let i = 0; i < 18; i++){ const k = t - tMany - i * .08; if (k < 0) continue; const y = Math.min(K.top - 10 - rnd(i + 2) * 30, 300 + k * 900); popcorn(ctx, K.deskX - 220 + rnd(i + 40) * 440, y, 22, t, { rot: k * 4 }); } }
      },
      front: () => {
        const hop = (T0, ph) => t < T0 ? null : { q: eBack(clamp((t - T0) / .4, 0, 1)), y: -Math.abs(Math.sin((t - T0) * 5 + ph)) * 40 };
        const a = hop(tA, 0); if (a){ ctx.save(); ctx.translate(470, 860 + a.y); ctx.rotate(Math.sin(t * 9) * .12); ctx.scale(a.q, a.q); popcorn(ctx, 0, 0, 110, t, { face: "laugh" }); ctx.restore(); ideaChip(ctx, K.funny || "Pelatihan Cihuy", 470, 960, t - tA - .2, { size: 34, maxW: 330, bg: "#FFE08A" }); }
        const b = hop(tB, 1); if (b){ ctx.save(); ctx.translate(820, 760 + b.y * .5); ctx.rotate(Math.sin(t * 3) * .4); ctx.scale(b.q, b.q); popcorn(ctx, 0, 0, 110, t, { face: "dizzy", col: "#E6D8FF" }); ctx.restore(); ideaChip(ctx, K.weird || "Kursus Kuantum Galaksi", 820, 870, t - tB - .2, { size: 30, maxW: 330, bg: "#E6D8FF" }); }
        if (t >= tC && t < tCult + .4){ const k = t - tC, L = Math.min(1500, k * 1400), fadeL = 1 - clamp((t - tCult) / .4, 0, 1); ctx.globalAlpha *= fadeL; const _u = 0, txt = K.long || "Program Pengenalan Lingkungan Kerja Terpadu bagi Karyawan yang Baru Bergabung"; ctx.save(); ctx.translate(90, 560); ctx.rotate(-.03);
          rr(ctx, 0, -50, L, 100, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.save(); ctx.beginPath(); ctx.rect(0, -50, L, 100); ctx.clip(); textL(ctx, txt, 26, 16, 44, BROWN, 900); ctx.restore();
          ctx.beginPath(); ctx.ellipse(L, 0, 22, 54, 0, 0, TAU); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 5); popcorn(ctx, -10, -10, 50, t, { face: "sweat" }); ctx.restore(); ctx.globalAlpha = 1; }
      },
      over: () => {
        [[tA, "LUCU", 470, 600, "#FFD166"], [tB, "ANEH", 820, 520, "#C9A6FF"], [tC, "KEPANJANGAN", 600, 430, HL]].forEach(([T0, w, x, y, col], i) => { if (t >= T0 && t < tMany) popWord(ctx, w, x, Math.max(300, y - 80), t - T0, { size: i === 2 ? 70 : 76, hold: 1.2, col }); });
        if (t >= tCult) popChip(ctx, K.cult || "BUDAYA KANTORMU?", 540, 330, t - tCult, RED, "#FFFFFF", 48);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.aneh || {}; ["funnyCue", "weirdCue", "longCue"].forEach(k => { if (K[k]) add(cueT(s, K[k], .3, i), "pop"); }); if (K.manyCue) add(cueT(s, K.manyCue, .3, i), "whoosh"); if (K.cultCue) add(cueT(s, K.cultCue, .3, i), "ping"); });

  /* ================= KD46: _tampi (winnowing tray of ideas) ================= */
  function tampah(ctx, x, y, rx, tilt){ ctx.save(); ctx.translate(x, y); ctx.rotate(tilt || 0); ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * .3, 0, 0, TAU); ctx.fillStyle = "#D9B37A"; ctx.fill(); ol(ctx, 8);
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, rx - 14, rx * .3 - 10, 0, 0, TAU); ctx.clip(); ctx.strokeStyle = hexA("#8E5A34", .45); ctx.lineWidth = 4; for (let i = -rx; i < rx; i += 22){ ctx.beginPath(); ctx.moveTo(i, -rx); ctx.lineTo(i + rx * .4, rx); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i, rx); ctx.lineTo(i + rx * .4, -rx); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, rx - 12, rx * .3 - 9, 0, 0, TAU); ctx.strokeStyle = "#A9622E"; ctx.lineWidth = 8; ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "tampi", "Cerita: menampi ide di tampah, ide lemah terbang seperti sekam, dua ide digabung, tiga tersisa; lalu rapat tim memilih", (ctx, th, s, t) => {
    const idx = G.scene, { F } = shotOf(s, t), K = Object.assign({ on: 0 }, F.tampi || {});
    if (K.part === "rapat"){ const tB = T(s, K.bannerCue, .3, idx);
      base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1020, rug: false },
        back: () => { rr(ctx, 120, 470, 840, 380, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8); textC(ctx, "TIGA CALON NAMA", 540, 540, 38, ORANGE, 900);
          (K.final || []).forEach((n, i) => { const k = t - (shotOf(s, t).T0 + .3 + i * .25); ideaChip(ctx, n, 260 + i * 280, 640, k, { size: 28, maxW: 250, bg: i === 0 ? "#FFE08A" : "#FFFFFF" }); const votes = i === 0 ? clamp(Math.floor((t - tB + 1.2) * 4), 0, 4) : i === 1 ? 1 : 0; for (let v = 0; v < votes; v++){ ctx.beginPath(); ctx.arc(260 + i * 280 - 45 + v * 30, 790, 12, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 3); } }); },
        over: () => { if (t >= tB){ const q = eBack(clamp((t - tB) / .5, 0, 1)); ctx.save(); ctx.translate(540, 330); ctx.scale(q, 1); rr(ctx, -420, -80, 840, 160, 20); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 8); textC(ctx, K.banner || "LANGKAH PERTAMA", 0, 26, 76, "#FFFFFF", 900, 780); ctx.restore(); } } });
      return; }
    const tToss = T(s, K.tossCue, .3, idx), tCross = T(s, K.crossCue, .3, idx), tMerge = T(s, K.mergeCue, .3, idx), tThree = T(s, K.threeCue, .3, idx);
    const ideas = K.ideas || [];
    base(ctx, s, t, { env: "park", envOpt: { treeX: 980, time: "day" }, envFront: false,
      over1: (c2, c, sts, j) => {
        if (j !== K.on) return; const st = sts[j], fc = st.face || 1, toss = t >= tToss ? Math.abs(Math.sin((t - tToss) * 6)) * 50 : 0, tx = st.x + 360 * fc, ty = st.y - st.size * .43 - toss;
        tampah(ctx, tx, ty, 390, Math.sin(t * 6) * .04);
        ideas.forEach((id, i) => { const bad = id.bad, mg = id.merge, keep = !bad && !mg; let x = tx - 255 + (i % 3) * 255 + (Math.floor(i / 3) ? 30 : -20), y = ty - 50 - Math.floor(i / 3) * 150, a = 1, cross = 0, s2 = 1;
          const hop = t >= tToss ? -Math.abs(Math.sin((t - tToss) * 6 + i)) * 40 : 0; y += hop;
          if (bad && t >= tCross){ cross = clamp((t - tCross - i * .08) / .25, 0, 1); const k = t - tCross - .3 - i * .08; if (k > 0){ x += k * 700 + Math.sin(k * 6 + i) * 30; y -= k * 420; a = 1 - clamp(k / 1.3, 0, 1); } }
          if (mg && t >= tMerge){ const q = easeIO(clamp((t - tMerge) / .6, 0, 1)); x = lerp(x, tx, q); y = lerp(y, ty - 360, q); if (q >= 1) a = 0; }
          if (keep && t >= tThree){ s2 = 1 + .08 * Math.sin(t * 6 + i); glowAt(ctx, x, y - 10, 90, GOLD, .5); }
          if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s2, s2); ideaChip(ctx, id.text, 0, 0, 1, { size: 40, maxW: 240, cross, bg: keep && t >= tThree ? "#FFE08A" : "#FFFFFF" }); ctx.restore(); });
        if (t >= tMerge + .6){ const k = t - tMerge - .6; burstFx(ctx, tx, ty - 360, k, GOLD, 12, 160); ctx.save(); ctx.translate(tx, ty - 360 + Math.sin(t * 3) * 8); ctx.scale(1.15, 1.15); ideaChip(ctx, K.merged || "Langkah Pertama", 0, 0, k, { size: 36, maxW: 360, bg: "#FFE08A" }); ctx.restore(); }
      },
      over: () => { if (t >= tCross && t < tMerge) popChip(ctx, K.crossChip || "TIDAK COCOK", 540, 330, t - tCross, RED, "#FFFFFF", 46); if (t >= tMerge && t < tThree) popChip(ctx, K.mergeChip || "GABUNGKAN", 540, 330, t - tMerge, ORANGE, "#FFFFFF", 46); if (t >= tThree) popChip(ctx, K.threeChip || "3 TERBAIK", 540, 330, t - tThree, GREEN, "#FFFFFF", 46); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const K = F.tampi || {}; ["tossCue", "crossCue", "mergeCue", "threeCue", "bannerCue"].forEach((k, j) => { if (K[k]) add(cueT(s, K[k], .3, i), ["whoosh", "whoosh", "pop", "chime", "chime"][j]); }); }); });

  /* ================= KD46: _mangkuk (bowl of ten ideas, pick one, rate it) ================= */
  TT.scene(PX + "mangkuk", "Cerita: semangkuk sepuluh berondong ide di meja rumah, satu diambil, diberi bintang nilai", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ bx: 680, top: 1450 }, f.mangkuk || {});
    const tBowl = T(s, K.bowlCue, .3, idx), tPick = T(s, K.pickCue, .3, idx), tRate = T(s, K.rateCue, .3, idx);
    base(ctx, s, t, { env: "home", envOpt: { lampX: 980 },
      back: () => {
        rr(ctx, K.bx - 260, K.top, 520, 26, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); [-1, 1].forEach(d => { rr(ctx, K.bx + d * 220 - 12, K.top + 26, 24, GY - K.top - 26, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); });
        const bq = t < tBowl ? 0 : eBack(clamp((t - tBowl) / .4, 0, 1)); if (bq <= 0) return; ctx.save(); ctx.translate(K.bx, K.top); ctx.scale(bq, bq);
        for (let i = 0; i < 10; i++){ if (i === 3 && t >= tPick) continue; popcorn(ctx, -110 + (i % 5) * 55, -120 - Math.floor(i / 5) * 40 + Math.sin(t * 3 + i) * 3, 34, t, { rot: i }); }
        ctx.beginPath(); ctx.moveTo(-170, -110); ctx.quadraticCurveTo(-160, 0, 0, 0); ctx.quadraticCurveTo(160, 0, 170, -110); ctx.closePath(); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#FFFFFF"; for (let k = -3; k <= 3; k++){ ctx.fillRect(k * 44 - 8, -96, 16, 80); }
        ctx.beginPath(); ctx.ellipse(0, -110, 170, 26, 0, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, "10", 0, -30, 40, "#FFFFFF", 900); ctx.restore();
      },
      front: () => {
        if (t < tPick) return; const q = easeIO(clamp((t - tPick) / .7, 0, 1)), x = lerp(K.bx - 55, K.bx - 40, q), y = lerp(K.top - 140, 930, q) - Math.sin(q * Math.PI) * 80, r = lerp(34, 110, q);
        if (t >= tRate) glowAt(ctx, x, y, 220, GOLD, .45 + .15 * Math.sin(t * 6));
        popcorn(ctx, x, y + Math.sin(t * 2.5) * 8, r, t, { face: q >= 1 ? "smile" : null }); if (q >= 1) ideaChip(ctx, K.idea || "IDE TERPILIH", x, y + 120, t - tPick - .7, { size: 34, maxW: 360, bg: "#FFE08A" });
        if (t >= tRate){ for (let i = 0; i < 3; i++){ const k = t - tRate - i * .3; if (k < 0) continue; const qq = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x - 130 + i * 130, y - 170 - (i === 1 ? 30 : 0)); ctx.scale(qq, qq); ctx.rotate(Math.sin(t * 4 + i) * .1); sparkle(ctx, 0, 0, 56, GOLD); ctx.restore(); } }
      },
      over: () => { if (t >= tBowl + .4 && t < tPick) popChip(ctx, K.bowlChip || "10 IDE DARI AI", 540, 330, t - tBowl - .4, NAVY, "#FFFFFF", 46); if (t >= tPick + .5 && t < tRate) popChip(ctx, K.pickChip || "KAMU YANG PILIH", 540, 330, t - tPick - .5, ORANGE, "#FFFFFF", 46); if (t >= tRate + 1) popChip(ctx, K.rateChip || "PALING PAS!", 540, 330, t - tRate - 1, GREEN, "#FFFFFF", 50); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.mangkuk || {}; if (K.bowlCue) add(cueT(s, K.bowlCue, .3, i), "pop"); if (K.pickCue) add(cueT(s, K.pickCue, .3, i), "whoosh"); if (K.rateCue){ const a = cueT(s, K.rateCue, .3, i); [0, .3, .6].forEach(d => add(a + d, "pop")); add(a + 1, "chime"); } });

  /* ================= JS46 shared: screen-print workshop, t-shirts, PDCA wheel ================= */
  BG.sablon = (ctx, t, o) => {
    ctx.fillStyle = "#E9DCC6"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#DCCBB0"; ctx.fillRect(-2600, GY - 520, 6400, 360);
    // window
    rr(ctx, -560, 430, 420, 330, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 8); ctx.fillStyle = OUT; ctx.fillRect(-354, 430, 8, 330);
    // ink shelf
    const sx = o.shelfX ?? 1300; [600, 820].forEach((y, r) => { ctx.fillStyle = "#8E5A34"; ctx.fillRect(sx - 280, y, 560, 20); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(sx - 280, y, 560, 20);
      ["#D9483B", "#3E7DB5", "#F6C343", "#3E9B5A", "#2C2433"].forEach((col, i) => { const x = sx - 220 + i * 110; rr(ctx, x - 40, y - 110, 80, 110, 8); ctx.fillStyle = "#C9CED3"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = col; ctx.fillRect(x - 40 + 3, y - 80, 74, 40); rr(ctx, x - 44, y - 122, 88, 18, 5); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 3); }); });
    // poster of a shirt design
    rr(ctx, 120, 420, 300, 260, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); tshirt(ctx, 270, 560, 170, "#2F6F73", {}, t);
    ctx.fillStyle = "#A47A55"; ctx.fillRect(-2600, GY - 160, 6400, 2000); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let y = GY - 110; y < GY + 600; y += 55){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  };
  function tshirt(ctx, x, y, w, col, o, t){ o = o || {}; const k = w / 300; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(k, k);
    ctx.beginPath(); ctx.moveTo(-60, -170); ctx.quadraticCurveTo(0, -130, 60, -170); ctx.lineTo(150, -130); ctx.lineTo(190, -40); ctx.lineTo(120, -10); ctx.lineTo(110, -50); ctx.lineTo(110, 170); ctx.lineTo(-110, 170); ctx.lineTo(-110, -50); ctx.lineTo(-120, -10); ctx.lineTo(-190, -40); ctx.lineTo(-150, -130); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, -170); ctx.quadraticCurveTo(0, -120, 60, -170); ctx.stroke();
    // print: sun logo
    const sm = o.smear || 0; const logo = (dx, dy, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.translate(dx, dy); ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fill(); ctx.strokeStyle = "#F6C343"; ctx.lineWidth = 10; ctx.lineCap = "round"; for (let i = 0; i < 8; i++){ const a2 = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a2) * 60, Math.sin(a2) * 60); ctx.lineTo(Math.cos(a2) * 80, Math.sin(a2) * 80); ctx.stroke(); } ctx.fillStyle = "#FFFFFF"; font(ctx, 900, 30, FAM); ctx.textAlign = "center"; ctx.fillText(o.word || "JUARA", 0, 130); ctx.textAlign = "left"; ctx.restore(); };
    logo(0, 10, 1); if (sm > 0){ logo(26, 52, .55 * sm); ctx.fillStyle = hexA("#F6C343", .8 * sm); for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.ellipse(-40 + i * 28, 70 + i * 6, 8, 18 + i * 6, 0, 0, TAU); ctx.fill(); } ctx.strokeStyle = hexA("#F6C343", .6 * sm); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-50, 20); ctx.lineTo(60, 80); ctx.stroke(); }
    if (o.ok){ ctx.save(); ctx.translate(80, -90); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  const PDCA = [["P", "PLAN", "#3E7DB5"], ["D", "DO", "#3E9B5A"], ["C", "CHECK", "#F2A03D"], ["A", "ACT", "#D9483B"]];
  function pdcaWheel(ctx, x, y, r, rot, lit, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.arc(10, 14, r, 0, TAU); ctx.fill();
    PDCA.forEach(([L, W, col], i) => { const a0 = -Math.PI / 2 + i * Math.PI / 2 - Math.PI / 4, on = lit == null || lit[i] > 0; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a0, a0 + Math.PI / 2); ctx.closePath(); ctx.fillStyle = on ? col : hexA(col, .3); ctx.fill(); ol(ctx, Math.max(4, r * .03));
      const am = a0 + Math.PI / 4, glow = lit ? lit[i] : 0; if (glow > 0 && o.pulse !== false){ ctx.save(); ctx.globalAlpha = .35 * glow * (.6 + .4 * Math.sin(t * 8)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 1.08, a0, a0 + Math.PI / 2); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore(); }
      ctx.save(); ctx.translate(Math.cos(am) * r * .58, Math.sin(am) * r * .58); ctx.rotate(-rot); textC(ctx, L, 0, r * .1, r * .36, "#FFFFFF", 900); if (r > 150) textC(ctx, W, 0, r * .26, r * .11, "#FFFFFF", 900); ctx.restore(); });
    ctx.beginPath(); ctx.arc(0, 0, r * .2, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, Math.max(4, r * .03)); ctx.restore();
    if (o.hub){ chipW(ctx, o.hub, x, y + r + 60, NAVY, "#FFFFFF", 34); } }
  function miniPDCA(ctx, s, t, M, idx){ if (!M) return; const lit = PDCA.map((p, i) => { const c = M[p[0]]; if (!c) return 0; if (c === true) return 1; const T0 = cueT(s, c, .3, idx); return t >= T0 ? 1 : 0; }); if (M.all && t >= cueT(s, M.all, .3, idx)) lit.fill(1);
    const cur = lit.lastIndexOf(1); ctx.save(); pdcaWheel(ctx, 920, 300, 86, Math.sin(t * 2) * .03, lit.map((v, i) => i === cur ? 1 : v * .55), t, {}); ctx.restore(); }

  /* ================= JS46: _sablon (smeared shirt lifted, rejects fly into the bin) ================= */
  TT.scene(PX + "sablon", "Cerita: bengkel sablon, kaos dengan gambar luntur diangkat, kaos gagal beterbangan ke tong BUANG, hitungan 8/100", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ binX: 870, on: 0 }, f.sablon || {});
    const tLift = T(s, K.liftCue, .3, idx), tSmear = T(s, K.smearCue, .3, idx), tBin = T(s, K.binCue, .3, idx);
    let shirtPos = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { shirt: K.shirtSpot || [600, 1280, 1.3], bin: [K.binX - 120, 1250, 1.0] },
      back: (c2, c, sts) => { BG.sablon(ctx, t, {});
        // print table
        rr(ctx, 380, 1360, 520, 30, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 6); [420, 860].forEach(x => { rr(ctx, x - 12, 1390, 24, GY - 1390, 5); ctx.fill(); ol(ctx, 4); });
        ctx.save(); ctx.translate(640, 1360); ctx.rotate(-.35); rr(ctx, -10, -24, 300, 24, 4); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4); ctx.restore();
        const st = sts[K.on]; if (st){ const h = handOf(st); shirtPos = [h[0] + 30 * (st.face || 1), h[1] + 150]; } },
      over1: (c2, c, sts, j) => { if (j !== K.on || t < tLift) return; const q = eBack(clamp((t - tLift) / .4, 0, 1)), sw = Math.sin(t * 3) * .05; const sm = t < tSmear ? .6 : 1;
        tshirt(ctx, shirtPos[0], shirtPos[1], 300 * q, "#2F4A6B", { smear: sm, rot: sw, word: "JUARA" }, t);
        if (t >= tSmear){ ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.globalAlpha = .6 + .4 * Math.sin(t * 10); ctx.beginPath(); ctx.ellipse(shirtPos[0] + 10, shirtPos[1] + 30, 120, 110, 0, 0, TAU); ctx.stroke(); ctx.restore(); } },
      front: () => {
        const bx = K.binX; rr(ctx, bx - 120, GY - 260, 240, 260, 16); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 7); rr(ctx, bx - 135, GY - 280, 270, 34, 10); ctx.fillStyle = "#4A4550"; ctx.fill(); ol(ctx, 6); textC(ctx, K.binLabel || "BUANG", bx, GY - 150, 42, "#FFFFFF", 900);
        if (t >= tBin){ for (let i = 0; i < 8; i++){ const k = t - tBin - i * .22; if (k < 0) continue; const q = clamp(k / .55, 0, 1); if (q >= 1) continue; const x0 = 520, y0 = 1250, x = lerp(x0, bx, q), y = lerp(y0, GY - 300, q) - Math.sin(q * Math.PI) * 380;
          tshirt(ctx, x, y, 120, ["#2F4A6B", "#D9483B", "#3E9B5A", "#5B7DB1"][i % 4], { smear: 1, rot: q * 7 }, t); } }
      },
      over: (c2, c) => {
        if (t >= tSmear) popWord(ctx, K.smearWord || "LUNTUR!", 540, 330, t - tSmear, { size: 110, hold: 1.4, col: RED });
        if (t >= tBin){ const n = clamp(Math.ceil((t - tBin) / .22), 0, 8), p = c.toScreen(K.binX, GY - 420); ctx.save(); ctx.translate(clamp(p[0], 220, 860), Math.max(300, p[1])); const q = eBack(clamp((t - tBin) / .3, 0, 1)); ctx.scale(q, q);
          rr(ctx, -170, -70, 340, 140, 20); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7); textC(ctx, n + "/100", 0, 30, 76, "#FFFFFF", 900); ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.sablon || {}; if (K.liftCue) add(cueT(s, K.liftCue, .3, i), "whoosh"); if (K.smearCue) add(cueT(s, K.smearCue, .3, i), "ping"); if (K.binCue){ const a = cueT(s, K.binCue, .3, i); for (let k = 0; k < 8; k += 2) add(a + k * .22 + .5, "pop"); } });

  /* ================= JS46: _dugaan (blame the ink -> PDCA wheel, cross-section of a folded wet shirt) ================= */
  TT.scene(PX + "dugaan", "Cerita: tim menyalahkan kaleng tinta, roda PDCA muncul (P, D, C, A menyala), potongan kaos terlipat saat tinta masih basah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ wx: 540, wy: 700, r: 240 }, f.dugaan || {});
    const tCan = T(s, K.canCue, .3, idx), tWheel = T(s, K.wheelCue, .3, idx), tPlan = T(s, K.planCue, .3, idx), tFold = T(s, K.foldCue, .3, idx), tDry = T(s, K.dryCue, .3, idx);
    const lc = ["P", "D", "C", "A"].map(L => T(s, (K.letters || {})[L], .3, idx));
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => {
        // giant ink can
        const cq = t < tCan ? 0 : eBack(clamp((t - tCan) / .4, 0, 1)); if (cq > 0){ ctx.save(); ctx.translate(K.canX ?? 520, GY); ctx.scale(cq, cq); ctx.rotate(t > tCan && t < tWheel ? Math.sin(t * 20) * .03 : 0);
          rr(ctx, -150, -330, 300, 330, 18); ctx.fillStyle = "#C9CED3"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#F6C343"; ctx.fillRect(-147, -250, 294, 130); textC(ctx, "TINTA", 0, -168, 58, BROWN, 900);
          ctx.beginPath(); ctx.ellipse(0, -330, 150, 30, 0, 0, TAU); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.moveTo(110, -320); ctx.quadraticCurveTo(140, -200, 120, -120); ctx.lineTo(100, -300); ctx.fill(); ctx.restore(); }
      },
      over: (c2, c) => {
        if (t < tWheel) return; const q = eBack(clamp((t - tWheel) / .5, 0, 1)), small = t >= tFold ? easeIO(clamp((t - tFold) / .5, 0, 1)) : 0;
        const lit = lc.map((T0, i) => t >= T0 ? (i === 0 && t >= tPlan ? 1 : .8) : 0); if (t >= tPlan){ lit[1] = lit[2] = lit[3] = .35; lit[0] = 1; }
        const x = lerp(540, 900, small), y = lerp(560, 300, small), r = lerp(230, 90, small) * q;
        ctx.save(); if (q > 0) pdcaWheel(ctx, x, y, r, (1 - q) * 2 + (t < tPlan ? (t - tWheel) * .6 : 0) * (small ? 0 : 1), lit, t, {}); ctx.restore();
        lc.forEach((T0, i) => { if (t >= T0 && t < T0 + 1 && small === 0) popWord(ctx, PDCA[i][1], 540, 880, t - T0, { size: 84, hold: .7, col: PDCA[i][2] }); });
        if (t >= tFold){ const pq = eBack(clamp((t - tFold - .2) / .45, 0, 1)); ctx.save(); ctx.translate(500, 600); ctx.scale(pq * .95, pq * .95); rr(ctx, -360, -230, 720, 460, 22); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8);
          rr(ctx, -340, -210, 220, 54, 12); ctx.fillStyle = PDCA[0][2]; ctx.fill(); ol(ctx, 4); textC(ctx, t < tDry ? "DUGAAN" : "RENCANA", -230, -170, 32, "#FFFFFF", 900);
          if (t < tDry){ // cross-section: folded shirt, wet ink transfers
            const fold = clamp((t - tFold - .5) / .6, 0, 1), lift = clamp((t - tFold - 1.4) / .5, 0, 1), yTop = lerp(-150, 0, eOut(fold)) - 70 * easeIO(lift);
            ctx.fillStyle = "#2F4A6B"; rr(ctx, -300, 40, 600, 50, 10); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#F6C343"; rr(ctx, -130, 22, 260, 22, 6); ctx.fill(); ol(ctx, 3);
            textL(ctx, "kaos bawah", -290, 125, 26, "#6B6470", 800);
            ctx.save(); ctx.translate(0, yTop); ctx.fillStyle = "#3E5F8A"; rr(ctx, -300, -30, 600, 50, 10); ctx.fill(); ol(ctx, 5); if (fold >= 1){ ctx.fillStyle = hexA("#F6C343", .65 + .3 * Math.sin(t * 6)); rr(ctx, -130, 20, 260, 14, 5); ctx.fill(); } textL(ctx, "lipatan atas", -290, -44, 26, "#6B6470", 800); ctx.restore();
            if (fold > 0 && fold < 1){ for (let i = 0; i < 4; i++){ ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.arc(-90 + i * 60, 10 + Math.sin(t * 20 + i) * 6, 7, 0, TAU); ctx.fill(); } }
            if (lift > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, yTop + 27, 150, 0, TAU); ctx.globalAlpha = lift; ctx.stroke(); ctx.globalAlpha = 1; }
            textC(ctx, "Tinta basah + dilipat", 0, 168, 40, BROWN, 900, 560); textC(ctx, "= gambar luntur", 0, 212, 40, RED, 900, 560); }
          else { // plan: hang 3 minutes
            tshirt(ctx, -150, 40, 230, "#2F4A6B", { ok: true }, t); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-150, -120); ctx.lineTo(-150, -150); ctx.stroke();
            const sp = (t - tDry) * 1.6; ctx.beginPath(); ctx.arc(170, 10, 110, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7); ctx.beginPath(); ctx.moveTo(170, 10); ctx.arc(170, 10, 100, -Math.PI / 2, -Math.PI / 2 + Math.min(TAU, sp)); ctx.closePath(); ctx.fillStyle = hexA(GREEN, .5); ctx.fill();
            textC(ctx, "3 MENIT", 170, 30, 50, BROWN, 900); textC(ctx, "Jemur dulu, baru lipat", 0, 205, 40, GREEN, 900, 560); }
          ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.dugaan || {}; ["canCue", "wheelCue", "foldCue", "dryCue"].forEach(k => { if (K[k]) add(cueT(s, K[k], .3, i), k === "wheelCue" ? "chime" : "pop"); }); Object.values(K.letters || {}).forEach(c => add(cueT(s, c, .3, i), "pop")); });

  /* ================= JS46: _jemur (drying rack with 3-minute rings, check counter 8 -> 1) ================= */
  TT.scene(PX + "jemur", "Cerita: rak jemur kaos dengan cincin hitung mundur tiga menit, hari berganti, lalu penghitung luntur turun dari 8 ke 1", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ rx: 400 }, f.jemur || {});
    const tRun = T(s, K.runCue, .3, idx), tWeek = T(s, K.weekCue, .3, idx), tCheck = T(s, K.checkCue, .3, idx), tDown = T(s, K.downCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      back: () => { BG.sablon(ctx, t, { shelfX: 1350 });
        const x0 = K.rx - 280, x1 = K.rx + 280; ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; [x0, x1].forEach(x => { ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, 820); ctx.stroke(); }); ctx.strokeStyle = "#9AA3A8"; ctx.lineWidth = 9; [x0, x1].forEach(x => { ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, 820); ctx.stroke(); });
        [860, 1180].forEach((ry, r) => { ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x0 - 20, ry); ctx.lineTo(x1 + 20, ry); ctx.stroke(); ctx.strokeStyle = "#C9CED3"; ctx.lineWidth = 7; ctx.stroke();
          for (let i = 0; i < 3; i++){ const x = x0 + 95 + i * 185, born = tRun + (r * 3 + i) * .15; if (t < born) continue; const q = eBack(clamp((t - born) / .3, 0, 1)), sw = Math.sin(t * 2 + i + r) * .06;
            ctx.save(); ctx.translate(x, ry); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 8, 12, Math.PI, 0); ctx.stroke(); tshirt(ctx, 0, 150 * q, 170 * q, ["#2F4A6B", "#D9483B", "#3E9B5A"][(i + r) % 3], { ok: t > tDown, word: "JUARA" }, t);
            // countdown ring
            const per = 1.6, k = ((t - born) % per) / per; ctx.beginPath(); ctx.arc(70, 40, 30, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(70, 40); ctx.arc(70, 40, 26, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - k)); ctx.closePath(); ctx.fillStyle = k > .85 ? GREEN : ORANGE; ctx.fill(); textC(ctx, "3'", 70, 50, 26, BROWN, 900); ctx.restore(); } });
      },
      over: (c2, c) => {
        miniPDCA(ctx, s, t, K.mini, idx);
        if (t >= tWeek && t < tCheck){ const d = clamp(Math.floor((t - tWeek) / .32) + 1, 1, 7); popChip(ctx, "HARI KE-" + d, 540, 330, t - tWeek, NAVY, "#FFFFFF", 50); }
        if (t >= tCheck){ const q = eBack(clamp((t - tCheck) / .4, 0, 1)), roll = t < tDown ? 0 : easeIO(clamp((t - tDown) / 1.2, 0, 1)), val = 8 - 7 * roll; ctx.save(); ctx.translate(480, 380); ctx.scale(q, q); rr(ctx, -300, -110, 600, 220, 24); ctx.fillStyle = "#1E1A22"; ctx.fill(); ol(ctx, 8);
          textC(ctx, K.label || "KAOS LUNTUR", -110, -40, 36, "#BFD3EA", 900); ctx.save(); rr(ctx, 90, -90, 180, 180, 14); ctx.clip(); ctx.fillStyle = roll >= 1 ? GREEN : "#2C3A5A"; ctx.fillRect(90, -90, 180, 180); const v0 = Math.floor(val), fr = val - v0;
          textC(ctx, String(Math.ceil(val)), 180, 50 - (Math.ceil(val) - val) * 160, 140, "#FFFFFF", 900); if (fr > 0) textC(ctx, String(Math.ceil(val) - 1), 180, 210 - (Math.ceil(val) - val) * 160, 140, "#FFFFFF", 900); ctx.restore();
          textC(ctx, "dari 100", -110, 40, 44, "#FFFFFF", 900); ctx.restore(); if (roll >= 1) burstFx(ctx, 660, 380, t - tDown - 1.2, GREEN, 12, 200); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.jemur || {}; if (K.runCue){ const a = cueT(s, K.runCue, .3, i); for (let k = 0; k < 6; k += 2) add(a + k * .15, "pop"); } if (K.weekCue){ const a = cueT(s, K.weekCue, .3, i); for (let k = 0; k < 7; k += 2) add(a + k * .32, "pop"); } if (K.checkCue) add(cueT(s, K.checkCue, .3, i), "whoosh"); if (K.downCue){ add(cueT(s, K.downCue, .3, i), "whoosh"); add(cueT(s, K.downCue, .3, i) + 1.2, "chime"); } });

  /* ================= JS46: _roda (SOP pinned / PDCA wheel rolls up the hill with STANDAR chocks) ================= */
  const slopeY = x => 1700 - (x + 200) * .42;
  TT.scene(PX + "roda", "Cerita: standar ditempel di meja sablon, lalu roda PDCA didorong naik bukit, ganjal STANDAR menahan roda, putaran kedua LIPATAN MIRING", (ctx, th, s, t) => {
    const idx = G.scene, { F, T0: shotT } = shotOf(s, t), K = Object.assign({}, F.roda || {});
    if (K.part === "sop"){ const tPin = T(s, K.pinCue, .3, idx);
      base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
        back: () => { BG.sablon(ctx, t, {}); rr(ctx, 380, 1360, 520, 30, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 6); [420, 860].forEach(x => { rr(ctx, x - 12, 1390, 24, GY - 1390, 5); ctx.fill(); ol(ctx, 4); });
          if (t >= tPin){ const q = clamp((t - tPin) / .3, 0, 1), sc = 1.6 - .6 * eOut(q); ctx.save(); ctx.translate(650, 860); ctx.scale(sc, sc); ctx.rotate(-.03); ctx.globalAlpha *= q; rr(ctx, -220, -190, 440, 380, 12); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
            rr(ctx, -220, -190, 440, 74, 12); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 7); textC(ctx, "STANDAR", 0, -138, 46, "#FFFFFF", 900); textC(ctx, "1. Sablon", -40, -50, 36, BROWN, 800); textC(ctx, "2. Jemur 3 menit", 0, 10, 36, ORANGE, 900); textC(ctx, "3. Baru dilipat", -10, 70, 36, BROWN, 800);
            ctx.fillStyle = hexA("#F6E3A1", .9); ctx.save(); ctx.translate(-180, -190); ctx.rotate(-.5); ctx.fillRect(-40, -14, 80, 28); ctx.restore(); ctx.save(); ctx.translate(180, -190); ctx.rotate(.5); ctx.fillRect(-40, -14, 80, 28); ctx.restore(); ctx.restore();
            if (q >= 1) burstFx(ctx, 650, 860, t - tPin - .3, GREEN, 12, 260); } },
        over: () => miniPDCA(ctx, s, t, K.mini, idx) });
      return; }
    const tLap = T(s, K.lapCue, .3, idx), tUp = T(s, K.upCue, .3, idx), lt = t - shotT, R = 210;
    const st0 = { x: 0 }; let wheelX = (F.toons && F.toons[0] ? toonState(F.toons[0], s, t).x : 0) + R + 110;
    base(ctx, s, t, { env: "sky", envOpt: { hills: true }, envFront: false,
      spots: { wheel: () => [wheelX, slopeY(wheelX) - R - 80, .95] },
      back: (c2, c, sts) => {
        ctx.beginPath(); ctx.moveTo(-1200, slopeY(-1200)); ctx.lineTo(2600, slopeY(2600)); ctx.lineTo(2600, 3000); ctx.lineTo(-1200, 3000); ctx.closePath(); ctx.fillStyle = "#7FB069"; ctx.fill(); ol(ctx, 8);
        ctx.fillStyle = "#6A9A57"; ctx.beginPath(); ctx.moveTo(-1200, slopeY(-1200) + 40); ctx.lineTo(2600, slopeY(2600) + 40); ctx.lineTo(2600, 3000); ctx.lineTo(-1200, 3000); ctx.fill();
        const st = sts[0]; if (st){ st.y = slopeY(st.x); wheelX = st.x + R + 110; st0.x = st.x; }
        // flag at the top
        ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(1700, slopeY(1700)); ctx.lineTo(1700, slopeY(1700) - 300); ctx.stroke(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(1700, slopeY(1700) - 300); ctx.lineTo(1880, slopeY(1700) - 250 + Math.sin(t * 4) * 10); ctx.lineTo(1700, slopeY(1700) - 200); ctx.fill(); ol(ctx, 5);
        // chocks left behind
        (K.chocks || []).forEach((ch, i) => { const T1 = T(s, ch.cue, .3, idx); if (t < T1) return; const cx = ch.x ?? (120 + i * 360), q = eBack(clamp((t - T1) / .35, 0, 1)), y = slopeY(cx); ctx.save(); ctx.translate(cx, y); ctx.rotate(Math.atan(-.42)); ctx.scale(q, q);
          ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(70, 0); ctx.lineTo(70, -90); ctx.closePath(); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 6); ctx.restore(); chipW(ctx, ch.text || "STANDAR", cx - 10, y - 140, GREEN, "#FFFFFF", 30); });
      },
      front: () => { const rot = wheelX / R; pdcaWheel(ctx, wheelX, slopeY(wheelX) - R, R, rot, [1, 1, 1, 1], t, { pulse: false });
        if (t >= tLap){ const q = eBack(clamp((t - tLap) / .4, 0, 1)); ctx.save(); ctx.translate(wheelX, slopeY(wheelX) - R * 2 - 70); ctx.scale(q, q); chipW(ctx, K.lap || "PUTARAN 2: LIPATAN MIRING", 0, 0, NAVY, "#FFFFFF", 34); ctx.restore(); } },
      over: () => { if (t >= tUp) popWord(ctx, K.up || "TERUS NAIK!", 540, 330, t - tUp, { size: 96, hold: 1.6, col: GREEN }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const K = F.roda || {}; if (K.pinCue) add(cueT(s, K.pinCue, .3, i) + .3, "pop"); if (K.lapCue) add(cueT(s, K.lapCue, .3, i), "pop"); if (K.upCue) add(cueT(s, K.upCue, .3, i), "chime"); (K.chocks || []).forEach(ch => add(cueT(s, ch.cue, .3, i), "pop")); }); });

  /* ================= SC46 shared: woven baskets, eggs, coins ================= */
  function basket(ctx, x, y, w, h, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); // y = bottom centre
    if (o.handle !== false){ ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.ellipse(0, -h, w * .36, h * .7, 0, Math.PI, 0); ctx.stroke(); ctx.strokeStyle = "#B97B3E"; ctx.lineWidth = 9; ctx.stroke(); }
    if (o.fill) o.fill(ctx, w, h);
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w * .4, 0); ctx.lineTo(-w * .4, 0); ctx.closePath(); ctx.fillStyle = o.col || "#D9A25E"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#8E5A34", .5); ctx.lineWidth = 4; for (let yy = -h + 18; yy < 0; yy += 20){ ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(w, yy); ctx.stroke(); } for (let xx = -w; xx < w; xx += 26){ ctx.beginPath(); ctx.moveTo(xx, -h); ctx.lineTo(xx * .8, 0); ctx.stroke(); } ctx.restore();
    rr(ctx, -w / 2 - 8, -h - 12, w + 16, 22, 10); ctx.fillStyle = o.rim || "#B97B3E"; ctx.fill(); ol(ctx, 5);
    if (o.label){ fit(ctx, o.label, w * .9, o.size || 30, 900, 14); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10), tw = ctx.measureText(o.label).width + 20; rr(ctx, -tw / 2, -h * .62, tw, sz * 1.4, 8); ctx.fillStyle = o.labelBg || CREAM; ctx.fill(); ol(ctx, 4); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(o.label, 0, -h * .62 + sz * 1.02); ctx.textAlign = "left"; }
    ctx.restore(); }
  function egg(ctx, x, y, r, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath(); ctx.ellipse(0, 0, r * .78, r, 0, 0, TAU); ctx.fillStyle = "#F7E3C8"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .6); ctx.beginPath(); ctx.ellipse(-r * .25, -r * .35, r * .18, r * .28, -.3, 0, TAU); ctx.fill(); ctx.restore(); }
  function eggPile(ctx, w, h, n){ for (let i = 0; i < n; i++){ const c = i % 5, r = Math.floor(i / 5); egg(ctx, -w * .36 + c * w * .18 + (r % 2) * w * .09, -h - 6 - r * 24, 22, (rnd(i) - .5) * .6); } }
  function splat(ctx, x, y, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s * .45); ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); for (let i = 0; i < 12; i++){ const a = i / 12 * TAU, r = i % 2 ? 46 : 64; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = "#F6B93B"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
  function envelope(ctx, x, y, w, col, txt, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); const h = w * .62; rr(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, 6); ctx.lineTo(w / 2, -h / 2); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); if (txt) textC(ctx, txt, 0, h / 2 - 12, w * .13, BROWN, 900, w * .9); ctx.restore(); }

  /* ================= SC46: _tuang (all savings poured into one big basket) ================= */
  TT.scene(PX + "tuang", "Cerita: rumah, semua amplop tabungan dan dompet dituang ke satu keranjang besar INVESTASI RAMAI, rak jadi kosong", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ bx: 770 }, f.tuang || {});
    const tPour = T(s, K.pourCue, .3, idx), tBuzz = T(s, K.buzzCue, .3, idx), tAll = T(s, K.allCue, .3, idx), items = K.items || [];
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 1100 },
      spots: { basket: [K.bx, 1250, 1.1] },
      back: () => {
        // shelf with envelopes (empties as they fly)
        ctx.fillStyle = "#8E5A34"; ctx.fillRect(60, 760, 560, 22); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(60, 760, 560, 22);
        items.forEach((it, i) => { const T0 = tPour + i * .45; if (t >= T0) return; envelope(ctx, 120 + i * 100, 720, 110, it.col || "#F3D9B5", "", -.1 + i * .05); });
      },
      front: () => {
        const glow = t >= tAll ? .5 + .3 * Math.sin(t * 6) : 0; if (glow) glowAt(ctx, K.bx, GY - 200, 320, GOLD, glow * .6);
        const fill = items.filter((it, i) => t >= tPour + i * .45 + .6).length;
        basket(ctx, K.bx, GY, 380, 290, { label: K.label || "INVESTASI RAMAI", size: 32, labelBg: "#FFE08A", rot: Math.sin(t * 2) * .01, fill: (c, w, h) => { for (let i = 0; i < fill * 4; i++) coin(c, -w * .38 + (i % 6) * w * .15, -h + 10 - Math.floor(i / 6) * 24, 26, t * 2 + i); } });
        items.forEach((it, i) => { const T0 = tPour + i * .45, k = t - T0; if (k < 0 || k > .6) return; const q = k / .6, x = lerp(120 + i * 100, K.bx, q), y = lerp(720, GY - 300, q) - Math.sin(q * Math.PI) * 300; envelope(ctx, x, y, 110, it.col || "#F3D9B5", "", q * 6); });
      },
      over: (c2, c) => {
        if (t >= tBuzz && t < tAll){ [["Lagi ramai!", 280, 300], ["Ikut, yuk!", 780, 360], ["Semua ikut!", 330, 470]].forEach(([w, x, y], i) => { const k = t - tBuzz - i * .4; if (k < 0) return; ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + i) * 8); const q = eBack(clamp(k / .3, 0, 1)); ctx.scale(q, q); chip(ctx, w, 0, 0, i % 2 ? "#3E9B5A" : "#5B7DB1", "#FFFFFF", 38); ctx.restore(); }); }
        if (t >= tAll) stampBox(ctx, K.stamp || "SEMUA DI 1 TEMPAT", 540, 340, t - tAll, RED, 66, -.06);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tuang || {}; if (K.pourCue){ const a = cueT(s, K.pourCue, .3, i); (K.items || []).forEach((it, j) => add(a + j * .45 + .6, "pop")); } if (K.buzzCue) add(cueT(s, K.buzzCue, .3, i), "pop"); if (K.allCue) add(cueT(s, K.allCue, .3, i), "ping"); });

  /* ================= SC46: _tali (tightrope with one huge basket, rope sags like a falling chart) ================= */
  TT.scene(PX + "tali", "Cerita: meniti tali di atas kota membawa satu keranjang raksasa, tali melorot seperti grafik anjlok, koin berjatuhan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ base: 1180, peak: 640, sag: 330 }, f.tali || {});
    const tDrop = T(s, K.dropCue, .3, idx), tPanic = T(s, K.panicCue, .3, idx), tNeed = T(s, K.needCue, .3, idx);
    const sg = t < tDrop ? 0 : K.sag * eBack(clamp((t - tDrop) / .6, 0, 1));
    const ropeY = x => K.base + sg * Math.exp(-Math.pow((x - K.peak) / 260, 2)) * (x > K.peak - 400 ? 1 : 0) + Math.sin(t * 3 + x * .01) * 4;
    base(ctx, s, t, { env: "sky", envOpt: { hills: true }, envFront: false,
      back: (c2, c, sts) => {
        // city far below
        for (let i = 0; i < 14; i++){ const x = -600 + i * 180, h = 260 + rnd(i) * 300; ctx.fillStyle = i % 2 ? "#7F93B5" : "#9AABC7"; ctx.fillRect(x, 1900 - h, 150, h + 400); ctx.fillStyle = hexA("#FFFFFF", .4); for (let w = 0; w < 6; w++) ctx.fillRect(x + 20 + (w % 2) * 60, 1930 - h + Math.floor(w / 2) * 60, 36, 30); }
        // poles
        [-260, 1340].forEach(x => { rr(ctx, x - 20, K.base - 40, 40, 1400, 8); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); });
        // rope (a falling chart)
        ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); for (let x = -260; x <= 1340; x += 20){ const y = ropeY(x); x === -260 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.strokeStyle = sg > 0 ? RED : "#E9DCC6"; ctx.lineWidth = 8; ctx.stroke();
        if (sg > 40){ const x = K.peak - 140, y = ropeY(x) - 160; arrowLine(ctx, x - 160, K.base - 260, K.peak + 40, K.base + sg * .9 - 120, RED, 20, clamp((t - tDrop) / .5, 0, 1)); }
        const st = sts[0]; if (st){ st.y = ropeY(st.x); }
      },
      over1: (c2, c, sts, j) => { if (j !== 0) return; const st = sts[0], hp = toonHead(st), r = st.size * .21, tilt = t < tDrop ? Math.sin(t * 2.4) * .08 : Math.sin(t * 7) * .25 + .2;
        ctx.save(); ctx.translate(hp[0], hp[1] - r * .9); ctx.rotate(tilt); basket(ctx, 0, 0, 300, 210, { label: K.label || "INVESTASI RAMAI", size: 26, labelBg: "#FFE08A", fill: (c, w, h) => { for (let i = 0; i < 12; i++) coin(c, -w * .38 + (i % 6) * w * .15, -h + 6 - Math.floor(i / 6) * 22, 22, t * 2 + i); } }); ctx.restore();
        // balance pole
        ctx.save(); ctx.translate(st.x, st.y - st.size * .4); ctx.rotate(tilt * .6); ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-320, 0); ctx.lineTo(320, 0); ctx.stroke(); ctx.strokeStyle = "#3E7DB5"; ctx.lineWidth = 7; ctx.stroke(); [-320, 320].forEach(e => { ctx.beginPath(); ctx.arc(e, 0, 14, 0, TAU); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 4); }); ctx.restore();
        if (t >= tDrop){ for (let i = 0; i < 14; i++){ const k = ((t - tDrop) * .9 + i / 14) % 1.2; ctx.save(); ctx.globalAlpha = clamp(1.2 - k, 0, 1); coin(ctx, hp[0] + 150 + (rnd(i) - .3) * 200 + k * 60, hp[1] - 120 + k * k * 900, 26, t * 6 + i); ctx.restore(); } }
      },
      over: () => {
        if (t >= tDrop) popWord(ctx, K.dropWord || "ANJLOK!", 540, 330, t - tDrop, { size: 110, hold: 1.6, col: RED });
        if (t >= tNeed){ const q = eBack(clamp((t - tNeed) / .4, 0, 1)); ctx.save(); ctx.translate(540, 360); ctx.scale(q, q); rr(ctx, -370, -90, 740, 180, 20); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 7); icon(ctx, "alert", -290, 0, 70, RED, 7);
          textC(ctx, K.need || "Keperluan mendadak?", 50, -12, 42, BROWN, 900, 520); textC(ctx, K.need2 || "Simpanan lain: 0", 50, 50, 40, RED, 900, 520); ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tali || {}; if (K.dropCue){ const a = cueT(s, K.dropCue, .3, i); add(a, "whoosh"); add(a + .2, "ping"); } if (K.needCue) add(cueT(s, K.needCue, .3, i), "pop"); });

  /* ================= SC46: _pasar (egg seller's bicycle with several baskets, one falls) ================= */
  function bicycle(ctx, x, y, t){ ctx.save(); ctx.translate(x, y); const wheel = cx => { ctx.beginPath(); ctx.arc(cx, -100, 100, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = "#4A4A52"; ctx.lineWidth = 9; ctx.stroke(); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; for (let k = 0; k < 8; k++){ const a = k / 8 * Math.PI; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 92, -100 + Math.sin(a) * 92); ctx.lineTo(cx - Math.cos(a) * 92, -100 - Math.sin(a) * 92); ctx.stroke(); } };
    wheel(-200); wheel(220); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-200, -100); ctx.lineTo(-60, -110); ctx.lineTo(-100, -300); ctx.lineTo(160, -290); ctx.lineTo(220, -100); ctx.moveTo(-60, -110); ctx.lineTo(160, -290); ctx.moveTo(160, -290); ctx.lineTo(170, -400); ctx.stroke();
    ctx.strokeStyle = "#2F6F73"; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -150, -330, 110, 26, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(120, -410); ctx.lineTo(220, -410); ctx.stroke();
    ctx.fillStyle = "#6B6470"; ctx.fillRect(-300, -320, 200, 14); ctx.restore(); }
  BG.lapak = (ctx, t, o) => { const x = o.x ?? 270; // market stall: awning + egg trays
    ctx.fillStyle = "#8E5A34"; [x - 260, x + 260].forEach(px => ctx.fillRect(px - 12, 700, 24, GY - 700));
    for (let i = 0; i < 8; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : "#D9483B"; ctx.beginPath(); ctx.moveTo(x - 300 + i * 75, 640); ctx.lineTo(x - 225 + i * 75, 640); ctx.lineTo(x - 225 + i * 75, 760 + Math.sin(t * 2 + i) * 4); ctx.quadraticCurveTo(x - 262 + i * 75, 800, x - 300 + i * 75, 760 + Math.sin(t * 2 + i) * 4); ctx.closePath(); ctx.fill(); ol(ctx, 4); }
    rr(ctx, x - 290, 1280, 580, 30, 6); ctx.fillStyle = "#A9622E"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 270, 1310, 540, GY - 1310, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
    for (let tr = 0; tr < 3; tr++){ const tx = x - 180 + tr * 180; rr(ctx, tx - 80, 1260, 160, 24, 6); ctx.fillStyle = "#C9B79C"; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 6; i++) egg(ctx, tx - 55 + (i % 3) * 55, 1240 - Math.floor(i / 3) * 26, 20, 0); }
    rr(ctx, x - 140, 560, 280, 70, 12); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, o.sign || "TELUR BU SITI", x, 608, 32, BROWN, 900, 260); };
  TT.scene(PX + "pasar", "Cerita: lapak telur di pasar, sepeda penjual dengan beberapa keranjang telur, satu keranjang jatuh dan pecah, yang lain selamat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ bx: 760 }, f.pasar || {});
    const tSplit = T(s, K.splitCue, .3, idx), tFall = T(s, K.fallCue, .3, idx), tSafe = T(s, K.safeCue, .3, idx);
    const spots = [[K.bx + 230, GY - 420, 150, 110], [K.bx - 230, GY - 330, 150, 110], [K.bx - 230, GY - 470, 140, 100]]; // front basket, rear low, rear high
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { bike: [K.bx, 1250, 1.05] },
      back: () => { BG.lapak(ctx, t, { x: K.stallX ?? 230 }); },
      midZ: -.5,
      mid: () => {
        bicycle(ctx, K.bx, GY, t);
        spots.forEach(([x, y, w, h], i) => { let rot = 0, dx = 0, dy = 0;
          if (i === 2 && t >= tFall){ const k = t - tFall; if (k < .35){ rot = -k * 2.2; dx = -k * 120; } else { const q = clamp((k - .35) / .4, 0, 1); rot = -.8 - q * .8; dx = -42 - q * 90; dy = q * q * (GY - y); if (q >= 1) return; } }
          const glow = t >= tSplit && t < tFall ? .5 + .4 * Math.sin(t * 8 + i) : 0; if (glow) glowAt(ctx, x, y - h * .6, 140, GOLD, glow * .6);
          basket(ctx, x + dx, y + dy, w, h, { rot, handle: false, fill: (c, ww, hh) => eggPile(c, ww, hh, 9) });
          if (t >= tSafe && i < 2){ const q = eBack(clamp((t - tSafe - i * .2) / .35, 0, 1)); ctx.save(); ctx.translate(x, y - h - 90); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore(); } });
        if (t >= tFall + .75){ const k = t - tFall - .75; basket(ctx, spots[2][0] - 140, GY + 10, 140, 90, { rot: -1.4, handle: false }); [[-260, 0], [-200, 20], [-320, 14], [-150, -6]].forEach(([dx, dy], i) => splat(ctx, spots[2][0] + dx, GY + 4 + dy, clamp(k * 4 - i * .3, 0, 1) * .8)); }
      },
      over: () => {
        if (t >= tSplit && t < tFall){ ["1", "2", "3"].forEach((n, i) => popWord(ctx, n, [920, 600, 560][i], [520, 560, 420][i], t - tSplit - i * .25, { size: 90, hold: 1.6, rot: 0, col: HL })); }
        if (t >= tFall + .75) popWord(ctx, "PRAK!", 300, 520, t - tFall - .75, { size: 100, hold: 1.0, col: "#F6B93B" });
        if (t >= tSafe) popChip(ctx, K.safeChip || "YANG LAIN SELAMAT", 540, 330, t - tSafe, GREEN, "#FFFFFF", 48);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pasar || {}; if (K.splitCue){ const a = cueT(s, K.splitCue, .3, i); [0, .25, .5].forEach(d => add(a + d, "pop")); } if (K.fallCue){ const a = cueT(s, K.fallCue, .3, i); add(a, "whoosh"); add(a + .75, "ping"); } if (K.safeCue) add(cueT(s, K.safeCue, .3, i), "chime"); });

  /* ================= SC46: _sebar (emergency chest first, then coins spread over four baskets, 2L checks) ================= */
  TT.scene(PX + "sebar", "Cerita: meja panjang, peti DANA DARURAT diisi dulu dan dikunci, lalu koin disebar ke empat keranjang berlabel, cek legal & logis", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ top: 1400 }, f.sebar || {});
    const tChest = T(s, K.chestCue, .3, idx), tSpread = T(s, K.spreadCue, .3, idx), tLegal = T(s, K.legalCue, .3, idx), checks = (K.checks || []).map(c => Object.assign({ T: T(s, c.cue, .3, idx) }, c));
    const bx = [260, 400, 540, 680], labels = K.labels || ["TABUNGAN", "DEPOSITO", "REKSA DANA", "EMAS"], cols = ["#D9A25E", "#C98B52", "#E0B070", "#BF8F4F"];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 500 },
      back: () => {
        rr(ctx, 30, K.top, 740, 30, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); [70, 730].forEach(x => { rr(ctx, x - 14, K.top + 30, 28, GY - K.top - 30, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); });
        // the money pile (shrinks as coins are sent out)
        { const left = t < tChest ? 1 : 1 - clamp((t - tChest) / Math.max(.5, tSpread + 1.6 - tChest), 0, 1), n = Math.round(18 * left);
          for (let i = 0; i < n; i++){ const r = Math.floor(i / 6), c2 = i % 6; coin(ctx, 330 + c2 * 30 + (r % 2) * 15, K.top - 22 - r * 26 - Math.abs(Math.sin(t * 4 + i)) * (t < tChest ? 8 : 0), 30, t * 2 + i); }
          if (n > 0 && t < tChest) chipW(ctx, "UANG HENDRA", 420, K.top - 150, ORANGE, "#FFFFFF", 34); }
        // chest
        const cq = t < tChest ? 0 : eBack(clamp((t - tChest) / .4, 0, 1)); if (cq > 0){ ctx.save(); ctx.translate(120, K.top); ctx.scale(cq, cq); rr(ctx, -90, -150, 180, 150, 14); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 6);
          const lock = t > tChest + 1.4; ctx.save(); ctx.translate(-90, -150); ctx.rotate(lock ? 0 : -.7); rr(ctx, 0, -40, 180, 44, 12); ctx.fillStyle = "#2F5F8A"; ctx.fill(); ol(ctx, 6); ctx.restore();
          rr(ctx, -22, -100, 44, 50, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); if (lock){ ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -100, 16, Math.PI, 0); ctx.stroke(); }
          textC(ctx, "DANA", 0, -26, 26, "#FFFFFF", 900); ctx.restore(); }
        // coins into the chest
        if (t >= tChest + .3) for (let i = 0; i < 5; i++){ const k = t - tChest - .3 - i * .2; if (k < 0 || k > .5) continue; const q = k / .5; coin(ctx, lerp(900, 120, q), lerp(900, K.top - 160, q) - Math.sin(q * Math.PI) * 260, 26, t * 8); }
        // baskets
        bx.forEach((x, i) => { const T0 = tSpread + i * .35, q = t < T0 ? 0 : eBack(clamp((t - T0) / .35, 0, 1)); if (q <= 0) return; const n = clamp(Math.floor((t - T0 - .3) * 6), 0, 6);
          ctx.save(); ctx.translate(x, K.top); ctx.scale(q, q); basket(ctx, 0, 0, 130, 120, { col: cols[i], handle: false, fill: (c, w, h) => { for (let k = 0; k < n; k++) coin(c, -w * .3 + (k % 3) * w * .3, -h + 4 - Math.floor(k / 3) * 20, 20, t * 2 + k); } }); ctx.restore();
          if (t >= tLegal){ const kk = eBack(clamp((t - tLegal - i * .15) / .3, 0, 1)); ctx.save(); ctx.translate(x + 44, K.top - 150); ctx.scale(kk, kk); ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-2, 9); ctx.lineTo(12, -9); ctx.stroke(); ctx.restore(); } });
        // coins spread
        if (t >= tSpread) bx.forEach((x, i) => { for (let j = 0; j < 3; j++){ const k = t - tSpread - i * .35 - j * .18 - .1; if (k < 0 || k > .5) continue; const q = k / .5; coin(ctx, lerp(900, x, q), lerp(900, K.top - 130, q) - Math.sin(q * Math.PI) * 300, 24, t * 8 + j); } });
      },
      over: (c2, c) => {
        if (t >= tChest && t < tSpread) popChip(ctx, K.chestChip || "1. DANA DARURAT DULU", 540, 330, t - tChest, "#3E7DB5", "#FFFFFF", 46);
        if (t >= tSpread && t < tLegal) popChip(ctx, K.spreadChip || "2. SEBAR SISANYA", 540, 330, t - tSpread, ORANGE, "#FFFFFF", 46);
        // basket labels (screen, staggered, clamped before translate)
        bx.forEach((x, i) => { const T0 = tSpread + i * .35 + .3; if (t < T0) return; const p = c.toScreen(x, K.top - 170 - (i % 2) * 70); popChip(ctx, labels[i], clamp(p[0], 160, 920), p[1], t - T0, NAVY, "#FFFFFF", 34); });
        if (t >= tChest + .4){ const p = c.toScreen(120, K.top - 240); popChip(ctx, "DARURAT", clamp(p[0], 150, 900), p[1], t - tChest - .4, "#3E7DB5", "#FFFFFF", 34); }
        checks.forEach((ck, j) => { if (t < ck.T) return; popChip(ctx, "✓ " + ck.text, 540, 470 + j * 100, t - ck.T, GREEN, "#FFFFFF", 50); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.sebar || {}; if (K.chestCue){ const a = cueT(s, K.chestCue, .3, i); add(a, "pop"); add(a + 1.4, "ping"); } if (K.spreadCue){ const a = cueT(s, K.spreadCue, .3, i); [0, .35, .7, 1.05].forEach(d => add(a + d + .3, "pop")); } if (K.legalCue) add(cueT(s, K.legalCue, .3, i), "chime"); (K.checks || []).forEach(c => add(cueT(s, c.cue, .3, i), "pop")); });

  /* ================= SC46: _rencana (where is my money? list -> one place? -> split plan with mini baskets) ================= */
  TT.scene(PX + "rencana", "Cerita: rumah malam, kertas UANGKU DI MANA terisi daftar tempat, cap 1 TEMPAT?, lalu dibalik jadi rencana bagi dengan keranjang kecil", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.rencana || {});
    const tCheck = T(s, K.checkCue, .3, idx), tOne = T(s, K.oneCue, .3, idx), tPlan = T(s, K.planCue, .3, idx), rows = K.rows || [];
    base(ctx, s, t, { env: "home", envOpt: { lampX: 900 },
      over: () => {
        if (t < tCheck) return; const q = eBack(clamp((t - tCheck) / .45, 0, 1)), flip = t < tPlan ? 1 : Math.abs(Math.cos(clamp((t - tPlan) / .5, 0, 1) * Math.PI)), back = t >= tPlan + .25;
        ctx.save(); ctx.translate(540, 390); ctx.scale(q * flip, q); ctx.rotate(-.02); rr(ctx, -380, -200, 760, 400, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8);
        if (!back){ textC(ctx, K.title || "UANGKU DI MANA?", 0, -134, 46, ORANGE, 900, 700);
          rows.forEach((r, i) => { const k = t - tCheck - .4 - i * .35; if (k < 0) return; const qq = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(-300, -60 + i * 76); ctx.scale(qq, qq); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = i === 0 ? RED : "#B9A58E"; ctx.fill(); ol(ctx, 4); textL(ctx, r[0], 44, 14, 40, BROWN, 800, 420); textL(ctx, r[1], 470, 14, 40, i === 0 ? RED : "#6B6470", 900, 160); ctx.restore(); });
          if (t >= tOne) stampBox(ctx, K.one || "1 TEMPAT?", 170, 80, t - tOne, RED, 64, -.12); }
        else { textC(ctx, K.planTitle || "RENCANA BAGI", 0, -134, 46, GREEN, 900, 700); const labs = K.parts || ["DARURAT", "TABUNGAN", "INVESTASI", "INVESTASI"];
          labs.forEach((l, i) => { const k = t - tPlan - .4 - i * .25; if (k < 0) return; const qq = eBack(clamp(k / .3, 0, 1)), x = -270 + i * 180; ctx.save(); ctx.translate(x, 90); ctx.scale(qq, qq); if (i === 0){ rr(ctx, -60, -100, 120, 100, 10); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 5); rr(ctx, -16, -66, 32, 34, 6); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); } else basket(ctx, 0, 0, 120, 100, { handle: false, col: ["#D9A25E", "#C98B52", "#E0B070"][i - 1] }); ctx.restore(); textC(ctx, l, x, 140, 26, BROWN, 900, 170); }); }
        ctx.restore();
        if (t >= tPlan + 1.6) stampBox(ctx, K.safe || "LEBIH AMAN", 800, 230, t - tPlan - 1.6, GREEN, 54, .08);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.rencana || {}; if (K.checkCue) add(cueT(s, K.checkCue, .3, i), "pop"); if (K.oneCue) add(cueT(s, K.oneCue, .3, i), "ping"); if (K.planCue){ const a = cueT(s, K.planCue, .3, i); add(a, "whoosh"); add(a + 1.6, "chime"); } });
})();

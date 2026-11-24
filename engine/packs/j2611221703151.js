/* Scene pack j2611221703151: MODE CERITA story scenes for JS52, SC52, MS52, SB53 (the last four days of the 365-day series).
   Layout prefix j2611221703151_. Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[],
   camOpt, props[], cards[], stamp, front) plus shared extras handled by base(): shots (hard cut), hold (object in hand),
   pops / stamps / tags / steps / confetti / chips (screen overlays), bg (custom backdrop from BG{}).
   Set pieces:
     JS52 _bengkel  shoe workshop at dusk: workbench, shoe lasts, a gecko on the wall, silent team, "?" over heads      f.bengkel
          _buaya    shop counter: returned shoes hop out of boxes, soles flap open like crocodile mouths, counter 30   f.buaya
          _tekan    hand-lever sole press, 10-second countdown, hook pull test LULUS, return counter 30 -> 3            f.tekan
          _bangga   terrace at dusk: the story told as a floating ribbon, chests puff with gold glow, next idea box     f.bangga
     SC52 _tabungan home morning: passbook flips page after page with the same balance, old resolution note on the fridge f.tabungan
          _pinang   imagined greased-pole climb (panjat pinang): vague prizes swing; slip down / one clear prize / 12 steps f.pinang
          _tanya    porch: brother's three question bubbles APA? BERAPA? KAPAN?, the target card written letter by letter f.tanya
     MS52 _pahlawan living room: superhero costume (cape, mask, emblem SEHAT), three giant intentions boom in          f.kostum
          _kebesaran costume too big: helmet slips over the eyes, cape trips him; cut to day 3 / day 5 / week 2         f.kostum
          _pas      dining table: mother laughs, the giant costume shrinks POF into a comfortable walking jacket        f.kostum
          _jalan    evening walk in the housing lane, mother joins, step counter + tiny moon, neighbours wave          f.jalan
     SB53 _catatan  office: a giant year notebook, pages fan through 365 insight tabs, the same routine loops        f.catatan
          _setapak  park in front of the office: a desire path in the grass, time-lapse walkers flatten it           f.setapak
          _rumput   imagined lawn: insight cards sink into grass, one card walked daily turns into a golden path     f.rumput
          _prioritas office desk: 3 priorities card before messages (bubbles wait), team copies it, path line on carpet f.prior
     _adegan  generic story shot with the extras above */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221703151_";
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
    else if (kind === "card"){ ctx.rotate(-.06); const w = o.w || 240, h = o.h || 160; rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = o.col || PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; ctx.fillRect(-w / 2 + 14, -h + 14, 40, 8);
      if (o.text){ const ls = String(o.text).split("\n"); ls.forEach((l, k) => textC(ctx, l, 0, -h + 50 + k * 36 + (3 - ls.length) * 16, 28, BROWN, 900, w - 30)); } }
    else if (kind === "envelope"){ ctx.rotate(-.08); rr(ctx, -110, -150, 220, 140, 8); ctx.fillStyle = o.col || "#F3D9B5"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-110, -150); ctx.lineTo(0, -70); ctx.lineTo(110, -150); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(0, -78, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); }
    else if (kind === "pen"){ ctx.rotate(-.7 + Math.sin((t || 0) * 14) * .08); rr(ctx, -12, -150, 24, 150, 8); ctx.fillStyle = o.col || "#2F6F73"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.lineTo(0, 30); ctx.closePath(); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 3); }
    else if (kind === "clip"){ ctx.rotate(-.05); rr(ctx, -100, -150, 200, 260, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5); rr(ctx, -84, -128, 168, 224, 6); ctx.fillStyle = PAPER; ctx.fill(); rr(ctx, -40, -164, 80, 36, 8); ctx.fillStyle = "#B9B4BF"; ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 5; k++){ ctx.fillStyle = k < (o.done ?? 0) ? GREEN : "#B9A58E"; rr(ctx, -64, -104 + k * 40, 24, 24, 5); ctx.fill(); ctx.fillStyle = "#B9A58E"; rr(ctx, -30, -98 + k * 40, 90, 10, 5); ctx.fill(); } }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function fxDraw(ctx, fx, t, c){
    if (fx === "rain"){ ctx.save(); ctx.fillStyle = "rgba(40,60,90,.18)"; ctx.fillRect(0, 0, 1080, 1920); ctx.strokeStyle = "rgba(220,235,255,.55)"; ctx.lineWidth = 4; ctx.lineCap = "round";
      for (let i = 0; i < 90; i++){ const x = (rnd(i) * 1300 + t * 260) % 1300 - 110, y = (rnd(i + 50) * 2000 + t * (1500 + rnd(i + 9) * 600)) % 2000 - 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 46); ctx.stroke(); } ctx.restore(); }
    else if (fx === "heat"){ ctx.save(); const g = ctx.createRadialGradient(900, 160, 0, 900, 160, 900); g.addColorStop(0, "rgba(255,214,120,.55)"); g.addColorStop(1, "rgba(255,214,120,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      ctx.strokeStyle = "rgba(255,240,200,.35)"; ctx.lineWidth = 3; for (let i = 0; i < 7; i++){ const y = 700 + i * 110 + Math.sin(t * 2 + i) * 10; ctx.beginPath(); for (let x = 0; x <= 1080; x += 30) ctx.lineTo(x, y + Math.sin(x * .02 + t * 5 + i) * 8); ctx.stroke(); } ctx.restore(); }
    else if (fx === "leaves"){ ctx.save(); for (let i = 0; i < 26; i++){ const x = (rnd(i) * 1200 + t * 90 + Math.sin(t * 2 + i) * 40) % 1200 - 60, y = (rnd(i + 20) * 2000 + t * (160 + rnd(i) * 120)) % 2000 - 40;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); ctx.fillStyle = ["#C2691F", "#E8A55B", "#A0522D"][i % 3]; ctx.beginPath(); ctx.ellipse(0, 0, 18, 9, 0, 0, TAU); ctx.fill(); ctx.restore(); } ctx.restore(); }
  }
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
    if (f.fx) fxDraw(ctx, f.fx, t, c);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    (f.chips || []).forEach((g, j) => ovs.push(() => { const k = t - tOf(s, g, .3 + j * .1, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : (g.out ?? 1e9); if (k < 0 || t > O + .25) return;
      ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .25, 0, 1); popChip(ctx, g.text, g.x ?? 540, (g.y ?? 330) + Math.sin(t * 2 + j) * 4, k, g.bg || NAVY, g.fg || "#FFFFFF", g.size || 44, (g.rot ?? -2) * Math.PI / 180); ctx.restore(); }));
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
    (f0.chips || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    (f0.stamps || []).forEach(p => add(tOf(s, p, .4, i), "ping"));
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, tombol, langkah, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ======================= JS52 shared: shoes, workshop, gecko, press ======================= */
  const LEATHER = ["#8E4E2E", "#2F6F73", "#B5643C", "#5B4A8A", "#3B2418", "#C2691F"];
  // side-view shoe; origin = sole centre on the ground; open 0..1 = toe gap (crocodile jaw)
  function shoe(ctx, x, y, s, o){
    o = o || {}; const open = o.open || 0, col = o.col || LEATHER[0], face = o.face || 1, t = o.t || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); ctx.lineJoin = "round";
    // bottom jaw = sole
    rr(ctx, -100, -20, 204, 20, 8); ctx.fillStyle = "#2B1A12"; ctx.fill(); ol(ctx, 4);
    if (open > .02){ ctx.save(); ctx.beginPath(); ctx.moveTo(-50, -20); ctx.lineTo(100, -20); ctx.lineTo(100, -20 - open * 95); ctx.closePath(); ctx.fillStyle = "#7A1F1F"; ctx.fill(); ctx.restore();
      ctx.fillStyle = "#FFFFFF"; for (let k = 0; k < 6; k++){ const tx = -20 + k * 20; ctx.beginPath(); ctx.moveTo(tx, -20); ctx.lineTo(tx + 8, -34); ctx.lineTo(tx + 16, -20); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke(); } }
    // top jaw = upper, hinged at the heel
    ctx.save(); ctx.translate(-50, -20); ctx.rotate(-open * .62); ctx.translate(50, 20);
    ctx.beginPath(); ctx.moveTo(-100, -20); ctx.lineTo(-104, -112); ctx.quadraticCurveTo(-70, -122, -40, -108); ctx.lineTo(-10, -116); ctx.quadraticCurveTo(30, -84, 70, -62);
    ctx.quadraticCurveTo(108, -50, 104, -20); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#FFFFFF", .18); ctx.beginPath(); ctx.ellipse(-60, -70, 22, 30, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 4; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const lx = -28 + k * 22, ly = -98 + k * 12; ctx.beginPath(); ctx.moveTo(lx - 9, ly - 6); ctx.lineTo(lx + 9, ly + 6); ctx.moveTo(lx - 9, ly + 6); ctx.lineTo(lx + 9, ly - 6); ctx.stroke(); }
    if (open > .02){ ctx.fillStyle = "#FFFFFF"; for (let k = 0; k < 6; k++){ const tx = -16 + k * 20; ctx.beginPath(); ctx.moveTo(tx, -22); ctx.lineTo(tx + 8, -8); ctx.lineTo(tx + 16, -22); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke(); } }
    if (o.eyes){ [[40, -74], [66, -64]].forEach(([ex, ey], k) => { ctx.beginPath(); ctx.arc(ex, ey - 10, 15 - k * 2, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(ex + 4, ey - 9, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex - 14, ey - 28); ctx.lineTo(ex + 12, ey - 22); ctx.stroke(); }); }
    ctx.restore(); ctx.restore(); }
  function gecko(ctx, x, y, s, t, talk){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.3 + Math.sin(t * 1.3) * .05); const w = Math.sin(t * 9) * .3;
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.quadraticCurveTo(-90, 10 + w * 30, -120, -20); ctx.stroke();
    ctx.strokeStyle = "#8FBF5A"; ctx.lineWidth = 7; ctx.stroke();
    [[-20, 1], [20, -1]].forEach(([lx, d]) => { [-1, 1].forEach(sd => { ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx + d * 10, sd * 26); ctx.stroke(); ctx.strokeStyle = "#8FBF5A"; ctx.lineWidth = 5; ctx.stroke(); }); });
    ctx.beginPath(); ctx.ellipse(0, 0, 44, 16, 0, 0, TAU); ctx.fillStyle = "#8FBF5A"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(52, 0, 20, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(58, -8, 6, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 2); ctx.beginPath(); ctx.arc(60, -8, 3, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    if (talk){ ctx.beginPath(); ctx.arc(66, 4, 5 + Math.abs(Math.sin(t * 20)) * 4, 0, Math.PI); ctx.fillStyle = "#7A1F1F"; ctx.fill(); }
    ctx.restore(); }
  BG.bengkel = (ctx, t, o, s) => { // workshop back wall (world), floor stays from env
    const night = o.dusk; ctx.save();
    ctx.fillStyle = night ? "#7A5236" : "#B9845A"; ctx.fillRect(-500, 140, 2080, GY - 140);
    ctx.strokeStyle = hexA(OUT, .18); ctx.lineWidth = 4; for (let x = -480; x < 1600; x += 120){ ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x, GY); ctx.stroke(); }
    // window
    const wx = o.winX ?? 820; rr(ctx, wx - 170, 420, 340, 300, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6);
    const g = ctx.createLinearGradient(0, 432, 0, 708); g.addColorStop(0, night ? "#F4A261" : "#BFE2EA"); g.addColorStop(1, night ? "#E76F51" : "#E8F4F0"); ctx.fillStyle = g; ctx.fillRect(wx - 156, 434, 312, 272);
    ctx.fillStyle = night ? "#FFD48A" : "#FFFFFF"; ctx.beginPath(); ctx.arc(wx + 60, 520, night ? 40 : 30, 0, TAU); ctx.fill(); ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(wx, 434); ctx.lineTo(wx, 706); ctx.moveTo(wx - 156, 570); ctx.lineTo(wx + 156, 570); ctx.stroke();
    // pegboard with tools
    const px = o.pegX ?? 200; rr(ctx, px - 210, 400, 420, 330, 10); ctx.fillStyle = "#D9B48A"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA(OUT, .25);
    for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++){ ctx.beginPath(); ctx.arc(px - 180 + i * 45, 430 + j * 45, 4, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.translate(px - 120, 470); ctx.rotate(.15 + Math.sin(t * 1.1) * .03); rr(ctx, -10, 0, 20, 150, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4); rr(ctx, -40, -10, 80, 34, 8); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 4); ctx.restore(); // hammer
    ctx.save(); ctx.translate(px, 480); ctx.rotate(-.1 + Math.sin(t * 1.4 + 1) * .03); [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 18, 110, 18, 26, 0, 0, TAU); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.stroke(); }); ctx.strokeStyle = "#B9B4BF"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-14, 90); ctx.lineTo(16, -10); ctx.moveTo(14, 90); ctx.lineTo(-16, -10); ctx.stroke(); ctx.restore(); // scissors
    ctx.save(); ctx.translate(px + 120, 460); ctx.rotate(Math.sin(t * 1.2 + 2) * .04); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 60, 54, 0, TAU); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 60, 20, 0, TAU); ctx.fillStyle = "#D9B48A"; ctx.fill(); ol(ctx, 3); ctx.restore(); // thread roll
    // shelf of shoes
    const sx = o.shelfX ?? 1250; [880, 1060].forEach((sy, r) => { ctx.fillStyle = "#6B3E22"; rr(ctx, sx - 330, sy, 660, 24, 6); ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 4; k++) shoe(ctx, sx - 250 + k * 165, sy, .55, { col: LEATHER[(k + r * 2) % 6], face: k % 2 ? -1 : 1 }); });
    // hanging lamp
    const lx = o.lampX ?? 540; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, 140); ctx.lineTo(lx + Math.sin(t * 1.5) * 6, 330); ctx.stroke();
    ctx.save(); ctx.translate(lx + Math.sin(t * 1.5) * 6, 330); ctx.beginPath(); ctx.moveTo(-60, 50); ctx.lineTo(60, 50); ctx.lineTo(26, 0); ctx.lineTo(-26, 0); ctx.closePath(); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 4); ctx.restore();
    glowAt(ctx, lx, 420, 380, "#FFD9A0", night ? .45 : .25);
    ctx.restore(); };
  function bench(ctx, x0, x1, top, t, o){ o = o || {};
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, GY + 6, (x1 - x0) / 2 + 30, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#6B3E22"; [x0 + 30, x1 - 60].forEach(x => { rr(ctx, x, top + 40, 30, GY - top - 40, 6); ctx.fill(); ol(ctx, 5); });
    rr(ctx, x0 + 20, GY - 120, x1 - x0 - 40, 20, 6); ctx.fill(); ol(ctx, 4);
    rr(ctx, x0, top, x1 - x0, 50, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 10, top + 25); ctx.lineTo(x1 - 10, top + 25); ctx.stroke();
    (o.items || []).forEach(it => { if (it.k === "shoe") shoe(ctx, it.x, top + 2, it.s || .6, { col: it.col || LEATHER[2], face: it.face || 1, open: it.open ? Math.abs(Math.sin(t * 7)) * .8 : 0 });
      else if (it.k === "last"){ ctx.save(); ctx.translate(it.x, top); ctx.beginPath(); ctx.ellipse(0, -36, 70, 36, 0, Math.PI, 0); ctx.lineTo(70, 0); ctx.lineTo(-70, 0); ctx.closePath(); ctx.fillStyle = "#D9B48A"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
      else if (it.k === "glue"){ ctx.save(); ctx.translate(it.x, top); rr(ctx, -36, -70, 72, 70, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, "LEM", 0, -26, 22, BROWN, 900); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(10, -70); ctx.lineTo(30, -130); ctx.stroke(); ctx.restore(); }
      else if (it.k === "tea"){ ctx.save(); ctx.translate(it.x, top); drawItem(ctx, "mug", 0, 0, t, { col: "#FFFFFF" }); ctx.restore(); } }); }

  /* ================= JS52: _bengkel (workshop at dusk, the question, silence, gecko) ================= */
  TT.scene(PX + "bengkel", "Cerita: bengkel sepatu senja, bos bertanya perbaikan terbaik, tim diam, cicak di dinding berbunyi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ top: GY - 330, gx: 900, gy: 300 }, f.bengkel || {});
    const tQ = T(s, K.askCue, .3, idx), tSil = T(s, K.silentCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      back: () => { BG.bengkel(ctx, t, { dusk: true }, s);
        const crawl = t < tSil ? 0 : clamp((t - tSil) / 1.2, 0, 1); gecko(ctx, K.gx - 120 * (1 - crawl), K.gy + 40 * Math.sin(crawl * 3), 1.3, t, t >= tSil && t < tSil + 2.4); },
      front: () => { bench(ctx, 40, 1040, K.top, t, { items: [{ k: "shoe", x: 200, s: .75, col: LEATHER[1] }, { k: "last", x: 420 }, { k: "glue", x: 640 }, { k: "shoe", x: 860, s: .75, col: LEATHER[3], face: -1 }] }); },
      over: (c2, c) => {
        if (t >= tSil){ const p = c.toScreen(K.gx, K.gy, 1); const k = t - tSil; popWord(ctx, "CK CK CK", clamp(p[0], 260, 820), Math.max(250, p[1] - 140), k - .8, { size: 70, hold: 1.8, rot: 8, col: "#8FBF5A" });
          if (k < 2.6){ ctx.save(); ctx.globalAlpha *= clamp(k / .3, 0, 1) * (1 - clamp((k - 2.3) / .3, 0, 1)); popChip(ctx, "HENING...", 540, 330, k, NAVY, "#FFFFFF", 46); ctx.restore(); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.bengkel || {}; if (K.silentCue){ const a = cueT(s, K.silentCue, .3, i); add(a, "whoosh"); [0.8, 1.0, 1.2].forEach(d => add(a + d, "pop")); } });

  /* ================= JS52: _buaya (returned shoes jump out of boxes and snap like crocodiles) ================= */
  BG.toko = (ctx, t, o) => { ctx.save(); ctx.fillStyle = "#2F6F73"; ctx.fillRect(-500, 140, 2080, GY - 140); ctx.fillStyle = hexA("#FFFFFF", .06); for (let x = -480; x < 1600; x += 90) ctx.fillRect(x, 140, 40, GY - 140);
    [560, 760, 960].forEach((sy, r) => { ctx.fillStyle = "#E9D7BC"; rr(ctx, -80, sy, 1240, 22, 6); ctx.fill(); ol(ctx, 4); for (let k = 0; k < 7; k++) shoe(ctx, 0 + k * 170, sy, .5, { col: LEATHER[(k + r) % 6], face: (k + r) % 2 ? -1 : 1 }); });
    rr(ctx, 300, 200, 480, 110, 14); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6); textC(ctx, "TOKO SEPATU", 540, 274, 52, ORANGE, 900); ctx.restore(); };
  function hopPath(t, T0, from, pts, dur){ // returns [x, yLift, phase]
    if (t < T0) return null; let k = t - T0; const seg = dur || .55; let a = from;
    for (let i = 0; i < pts.length; i++){ const b = pts[i]; if (k < seg) { const q = k / seg; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * (b[2] ?? 160), q, i]; } k -= seg; a = b; }
    return [a[0], a[1], 1, pts.length]; }
  TT.scene(PX + "buaya", "Cerita: konter toko, sepatu retur melompat keluar kardus, sol mangap seperti mulut buaya, penghitung 30 pasang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ top: GY - 300, boxX: 760, n: 5 }, f.buaya || {});
    const tOut = T(s, K.outCue, .2, idx), tNum = T(s, K.numCue, .2, idx), tSnap = T(s, K.snapCue, .2, idx);
    const shoes = []; for (let i = 0; i < K.n; i++){ const T0 = tOut + i * .32, x0 = K.boxX - 80 + (i % 3) * 80, y0 = K.top - 40;
      const pts = [[300 + i * 150, GY - 10, 260], [240 + ((i * 210) % 640), GY - 10, 120], [300 + ((i * 330 + 100) % 620), GY - 10, 140], [260 + ((i * 170 + 300) % 620), GY - 10, 120]];
      const P = hopPath(t, T0, [x0, y0], pts, .6 + i * .04); shoes.push({ P, col: LEATHER[i % 6], i }); }
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      back: () => { BG.toko(ctx, t, {}); },
      front: () => {
        // counter
        ctx.fillStyle = "#8E4E2E"; rr(ctx, 520, K.top, 560, GY - K.top, 10); ctx.fill(); ol(ctx, 6); rr(ctx, 500, K.top - 30, 600, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
        textC(ctx, "KASIR", 800, K.top + 120, 44, hexA(CREAM, .8), 900);
        // return boxes
        [[-90, 0], [90, 0], [0, -1]].forEach(([dx, r], j) => { const bx = K.boxX + dx, by = K.top - 30 + r * 150; const wob = t >= tOut && t < tOut + 2 ? Math.sin(t * 30 + j) * .06 : 0;
          ctx.save(); ctx.translate(bx, by); ctx.rotate(wob); rr(ctx, -85, -140, 170, 140, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5); textC(ctx, "RETUR", 0, -56, 32, RED, 900); ctx.restore(); });
        shoes.forEach(o => { if (!o.P) return; const open = t >= tSnap ? .25 + .75 * Math.abs(Math.sin(t * 8 + o.i)) : .3 + .4 * Math.abs(Math.sin(t * 6 + o.i)); shoe(ctx, o.P[0], o.P[1], 1.05, { col: o.col, open, eyes: true, face: o.i % 2 ? -1 : 1, t }); });
      },
      over: () => {
        if (t >= tNum){ const k = t - tNum, n = Math.round(30 * clamp(k / 1.2, 0, 1)); ctx.save(); ctx.translate(540, 330); const q = eBack(clamp(k / .35, 0, 1)); ctx.scale(q, q); ctx.rotate(-.04);
          rr(ctx, -300, -90, 600, 180, 22); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7); textC(ctx, "SEPATU KEMBALI", 0, -34, 34, "#FFFFFF", 900); textC(ctx, n + " PASANG / BULAN", 0, 46, 62, "#FFFFFF", 900, 540); ctx.restore(); }
        if (t >= tSnap) popWord(ctx, "KRAP! KRAP!", 540, 560, t - tSnap, { size: 84, hold: 1.6, rot: -6 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.buaya || {}; if (K.outCue){ const a = cueT(s, K.outCue, .2, i); for (let k = 0; k < (K.n || 5); k++) add(a + k * .32, "whoosh"); }
    if (K.numCue) add(cueT(s, K.numCue, .2, i), "ping"); if (K.snapCue){ const a = cueT(s, K.snapCue, .2, i); [0, .25, .5, .75].forEach(d => add(a + d, "pop")); } });

  /* ================= JS52: _tekan (sole press 10 s, pull test, counter 30 -> 3) ================= */
  function pressMachine(ctx, x, top, q, t, o){ // top = table top (world y); q 0..1 press depth
    o = o || {}; ctx.save(); ctx.translate(x, top);
    // table
    ctx.fillStyle = "#6B3E22"; [-200, 170].forEach(dx => { rr(ctx, dx, 0, 30, GY - top, 6); ctx.fill(); ol(ctx, 5); }); rr(ctx, -230, -30, 460, 40, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6);
    // frame
    ctx.fillStyle = "#4E6E8E"; rr(ctx, -170, -60, 340, 34, 6); ctx.fill(); ol(ctx, 5); [-150, 120].forEach(dx => { rr(ctx, dx, -560, 30, 510, 6); ctx.fill(); ol(ctx, 5); }); rr(ctx, -180, -590, 360, 50, 10); ctx.fill(); ol(ctx, 5);
    // screw + pad
    const padY = -440 + q * 250; ctx.fillStyle = "#B9B4BF"; rr(ctx, -14, -560, 28, padY + 560, 4); ctx.fill(); ol(ctx, 4); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 3; for (let y = -540; y < padY; y += 18){ ctx.beginPath(); ctx.moveTo(-14, y); ctx.lineTo(14, y + 8); ctx.stroke(); }
    rr(ctx, -120, padY, 240, 40, 8); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5);
    // lever (rotates with q)
    ctx.save(); ctx.translate(0, -600); ctx.rotate(-.5 + q * 1.4); rr(ctx, -10, -10, 260, 20, 10); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(260, 0, 24, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.beginPath(); ctx.arc(0, -600, 22, 0, TAU); ctx.fillStyle = "#4E6E8E"; ctx.fill(); ol(ctx, 4);
    // shoe on the base
    shoe(ctx, -10 + (o.pull || 0) * 0, -60, .95 - q * .03, { col: LEATHER[0], open: o.open || 0, t });
    ctx.restore(); }
  TT.scene(PX + "tekan", "Cerita: mesin press sol tuas tangan, hitung mundur 10 detik, uji tarik kait dan neraca pegas LULUS, retur 30 jadi 3", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 700, top: GY - 420 }, f.tekan || {});
    const tP = T(s, K.pressCue, .2, idx), tPull = T(s, K.pullCue, .2, idx), tRes = T(s, K.resultCue, .2, idx), tStep = T(s, K.stepCue, .3, idx);
    const pressQ = t < tP ? 0 : t < tPull - .3 ? eOut(clamp((t - tP) / .4, 0, 1)) : 1 - eOut(clamp((t - tPull + .3) / .3, 0, 1));
    const cdK = t - tP, cdDur = Math.max(1.2, tPull - tP - .4);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { mesin: [K.x, K.top - 300, 1.15] },
      back: () => { BG.bengkel(ctx, t, { dusk: false, pegX: 140, shelfX: 1300, winX: 960, lampX: 640 }, s); },
      front: () => {
        const pk = t - tPull, pulling = pk >= 0 ? clamp(pk / .6, 0, 1) : 0, tug = pk >= 0 && pk < 2.2 ? Math.sin(pk * 14) * 8 * (1 - clamp(pk / 2.2, 0, 1)) : 0;
        pressMachine(ctx, K.x, K.top, pressQ, t, { open: 0 });
        if (pulling > 0){ // hook + spring scale pulling the toe up
          const hx = K.x + 95, hy = K.top - 90, sy = hy - 160 - 70 * pulling + tug; ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 20, sy + 60); ctx.stroke();
          ctx.save(); ctx.translate(hx + 20, sy); rr(ctx, -34, -150, 68, 150, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.fillStyle = PAPER; rr(ctx, -20, -132, 40, 110, 6); ctx.fill();
          ctx.fillStyle = RED; ctx.fillRect(-16, -128 + 90 * pulling, 32, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(0, -260); ctx.stroke(); ctx.restore();
          ctx.beginPath(); ctx.arc(hx, hy, 12, 0, Math.PI); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); }
      },
      over: (c2, c) => {
        if (t >= tP && t < tPull + .2){ const n = Math.max(0, 10 - Math.floor(clamp(cdK / cdDur, 0, 1) * 10)), x = K.cdX ?? 200, y = K.cdY ?? 400;
          ctx.save(); ctx.translate(x, y); const q = eBack(clamp(cdK / .3, 0, 1)); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 7);
          ctx.beginPath(); ctx.arc(0, 0, 92, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - clamp(cdK / cdDur, 0, 1))); ctx.strokeStyle = GOLD; ctx.lineWidth = 14; ctx.stroke();
          textC(ctx, String(n), 0, 30, 92, "#FFFFFF", 900); textC(ctx, "DETIK", 0, 160, 34, CREAM, 900); ctx.restore(); }
        if (t >= tPull + .9) stampBox(ctx, "LULUS UJI TARIK", 540, 330, t - tPull - .9, GREEN, 60, -.06);
        if (t >= tRes){ const k = t - tRes, n = Math.round(30 - 27 * eOut(clamp((k - .3) / 1.4, 0, 1))); ctx.save(); ctx.translate(540, 560); const q = eBack(clamp(k / .35, 0, 1)); ctx.scale(q, q); ctx.rotate(.03);
          rr(ctx, -330, -100, 660, 200, 24); ctx.fillStyle = n <= 3 ? GREEN : RED; ctx.fill(); ol(ctx, 7); textC(ctx, "RETUR / BULAN", 0, -40, 34, "#FFFFFF", 900); textC(ctx, n + " PASANG", 0, 52, 78, "#FFFFFF", 900);
          if (n <= 3) burstFx(ctx, 0, 0, k - 1.7, GOLD, 12, 300); ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tekan || {}; if (K.pressCue){ const a = cueT(s, K.pressCue, .2, i); add(a, "whoosh"); for (let k = 1; k < 5; k++) add(a + k * .45, "pop"); }
    if (K.pullCue){ const a = cueT(s, K.pullCue, .2, i); add(a, "whoosh"); add(a + .9, "ping"); } if (K.resultCue){ const a = cueT(s, K.resultCue, .2, i); add(a, "pop"); add(a + 1.7, "chime"); } });

  /* ================= JS52: _bangga (terrace at dusk: story ribbon, chests puff, next idea) ================= */
  BG.teras = (ctx, t, o) => { ctx.save(); const x0 = -300, x1 = 1380;
    ctx.fillStyle = "#E8D2B0"; ctx.fillRect(x0, 300, x1 - x0, GY - 300); ctx.fillStyle = "#C98B52"; ctx.fillRect(x0, 300, x1 - x0, 60); ol(ctx, 0);
    rr(ctx, 260, 380, 560, 120, 14); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 6); textC(ctx, "BENGKEL SEPATU", 540, 462, 58, GOLD, 900);
    // half-open rolling door
    ctx.fillStyle = "#9C98A3"; rr(ctx, 300, 560, 480, 360, 6); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 3; for (let y = 580; y < 920; y += 22){ ctx.beginPath(); ctx.moveTo(304, y); ctx.lineTo(776, y); ctx.stroke(); }
    ctx.fillStyle = "#3B2418"; ctx.fillRect(300, 920, 480, GY - 920); glowAt(ctx, 540, 1200, 360, "#FFD9A0", .35);
    [120, 960].forEach(px => { ctx.save(); ctx.translate(px, 700); ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); ol(ctx, 4); glowAt(ctx, 0, 0, 160, "#FFD9A0", .5 + .1 * Math.sin(t * 3 + px)); ctx.restore(); });
    ctx.restore(); };
  TT.scene(PX + "bangga", "Cerita: teras bengkel senja, cerita perbaikan jadi pita gambar melayang, dada tim membusung berkilau emas, kotak sepatu penyok jadi perbaikan berikutnya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ who: [0, 1, 2], idea: 2 }, f.bangga || {});
    const tR = T(s, K.ribbonCue, .1, idx), tPuff = T(s, K.puffCue, .3, idx), tIdea = T(s, K.ideaCue, .3, idx), tBox = T(s, K.boxCue, .3, idx), tNext = T(s, K.nextCue, .3, idx);
    const puff = t < tPuff ? 0 : eBack(clamp((t - tPuff) / .5, 0, 1));
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      back: (c2, c, sts) => { BG.teras(ctx, t, {}); K.who.forEach(j => { const st = sts[j]; if (!st) return; st.size *= 1 + .07 * puff; }); },
      under: (c2, c, sts, j) => { if (puff > 0 && K.who.includes(j)){ const st = sts[j], k2 = st.size / 92; glowAt(ctx, st.x, st.y - 50 * k2, 260 * puff, GOLD, .55); } },
      front: (c2, c, sts) => {
        if (t >= tBox){ const st = sts[K.idea]; if (!st) return; const k = t - tBox, q = eBack(clamp(k / .5, 0, 1)), hp = toonHead(st), bx = st.x + 20, by = hp[1] - 360 + Math.sin(t * 2.4) * 10;
          ctx.save(); ctx.translate(lerp(1300, bx, clamp(k / .5, 0, 1)), by - Math.sin(clamp(k / .5, 0, 1) * Math.PI) * 120); ctx.rotate(-.12 + Math.sin(t * 2) * .05); ctx.scale(q, q);
          ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(110, -70); ctx.lineTo(110, 70); ctx.lineTo(10, 70); ctx.quadraticCurveTo(-20, 30, -50, 70); ctx.lineTo(-110, 70); ctx.closePath(); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5);
          ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-110, -40); ctx.lineTo(110, -40); ctx.stroke(); textC(ctx, "PENYOK", 30, 20, 26, RED, 900); ctx.restore(); }
      },
      over: (c2, c, sts) => {
        if (t >= tR && t < tPuff + .6){ const k = t - tR, out = clamp((t - tPuff - .2) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(540, 360 - out * 60);
          for (let i = 0; i < 3; i++){ const kk = k - i * .5; if (kk < 0) continue; const q = eBack(clamp(kk / .35, 0, 1)), x = -300 + i * 300; ctx.save(); ctx.translate(x, Math.sin(t * 2 + i) * 6); ctx.rotate((i - 1) * .05); ctx.scale(q, q);
            rr(ctx, -130, -100, 260, 200, 14); ctx.fillStyle = i === 2 ? GREEN : PAPER; ctx.fill(); ol(ctx, 6); ctx.fillStyle = OUT; for (let h = -90; h <= 90; h += 36){ ctx.fillRect(-126, h - 6, 12, 10); ctx.fillRect(114, h - 6, 12, 10); }
            if (i === 0) shoe(ctx, 0, 60, .8, { col: LEATHER[0], open: .4 + .4 * Math.abs(Math.sin(t * 8)), eyes: true, t });
            else if (i === 1){ ctx.save(); ctx.scale(.28, .28); pressMachine(ctx, 0, 300, .6 + .4 * Math.abs(Math.sin(t * 3)), t, {}); ctx.restore(); }
            else textC(ctx, "30 → 3", 0, 22, 62, "#FFFFFF", 900); ctx.restore(); }
          ctx.restore(); }
        if (t >= tPuff) popWord(ctx, "BANGGA!", 540, 330, t - tPuff - .2, { size: 110, hold: 1.6, rot: -6, col: GOLD });
        if (t >= tNext) stampBox(ctx, "PERBAIKAN BERIKUTNYA!", 540, 330, t - tNext, ORANGE, 54, -.05);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.bangga || {}; if (K.ribbonCue){ const a = cueT(s, K.ribbonCue, .1, i); [0, .5, 1].forEach(d => add(a + d, "pop")); }
    if (K.puffCue) add(cueT(s, K.puffCue, .3, i), "chime"); if (K.boxCue) add(cueT(s, K.boxCue, .3, i), "whoosh"); if (K.nextCue) add(cueT(s, K.nextCue, .3, i), "ping"); });

  /* ================= JS52 BG: workshop meeting board SEBELUM / SESUDAH ================= */
  BG.papan = (ctx, t, o, s) => { const idx = G.scene; BG.bengkel(ctx, t, { dusk: false, pegX: -200, shelfX: 1380, winX: 1180, lampX: 300 }, s);
    const x = o.x ?? 600, y = o.y ?? 360, w = 640, h = 470; ctx.save(); ctx.translate(x, y); ctx.rotate(-.01);
    rr(ctx, -w / 2, 0, w, h, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8); textC(ctx, o.title || "CERITA PERBAIKAN", 0, 60, 40, ORANGE, 900, w - 60);
    ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 90); ctx.lineTo(0, h - 30); ctx.stroke();
    const cols = [["SEBELUM", o.before || "30", RED, o.beforeCue], ["SESUDAH", o.after || "3", GREEN, o.afterCue]];
    cols.forEach(([lab, val, col, cue], j) => { const cx = (j ? 1 : -1) * w / 4; textC(ctx, lab, cx, 140, 32, BROWN, 900); const T0 = cue ? cueT(s, cue, .3, idx) : 0; if (t < T0) return;
      const q = eBack(clamp((t - T0) / .4, 0, 1)); ctx.save(); ctx.translate(cx, 270); ctx.scale(q, q); textC(ctx, val, 0, 40, 150, col, 900); ctx.restore(); textC(ctx, "retur/bulan", cx, 400, 26, "#8C7A6A", 800); });
    ctx.restore(); };

  /* ======================= SC52: passbook, greased pole, target card ======================= */
  /* _tabungan: home morning, vague resolution notes wobble, passbook flips: every month the same balance */
  function passbook(ctx, x, y, s, t, flipK, o){ // open book, origin = centre
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.04 + Math.sin(t * 1.4) * .015);
    rr(ctx, -330, -210, 660, 420, 18); ctx.fillStyle = o.cover || "#2F6F73"; ctx.fill(); ol(ctx, 7);
    const months = ["JAN", "MAR", "MEI", "JUL", "SEP", "NOV", "DES"], n = flipK < 0 ? 0 : Math.floor(flipK / .45), ph = flipK < 0 ? 1 : (flipK % .45) / .45;
    const page = (px, m, sc) => { ctx.save(); ctx.translate(px, 0); ctx.scale(sc, 1); rr(ctx, -150, -185, 300, 370, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
      if (Math.abs(sc) > .2){ ctx.scale(Math.sign(sc), 1); textC(ctx, m, 0, -120, 34, ORANGE, 900); ctx.fillStyle = "#D9C9B4"; for (let k = 0; k < 3; k++) ctx.fillRect(-110, -80 + k * 30, 220, 6);
        textC(ctx, "SALDO", 0, 40, 28, "#8C7A6A", 800); textC(ctx, o.bal || "Rp 2.100.000", 0, 100, 40, BROWN, 900, 270); } ctx.restore(); };
    page(-162, months[Math.min(n, months.length - 1)], 1); page(162, months[Math.min(n + 1, months.length - 1)], 1);
    if (flipK >= 0 && n < months.length - 2){ const sc = Math.cos(ph * Math.PI); ctx.save(); ctx.translate(0, 0); page(162 * sc, months[n + 1], sc); ctx.restore(); }
    ctx.fillStyle = OUT; ctx.fillRect(-4, -200, 8, 400); ctx.restore(); }
  BG.ruang = (ctx, t, o) => { // home morning: wall with a fridge
    ctx.save(); const fx = o.fridgeX ?? 960; rr(ctx, fx - 140, GY - 760, 280, 760, 24); ctx.fillStyle = "#E9EEF0"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx - 140, GY - 470); ctx.lineTo(fx + 140, GY - 470); ctx.stroke();
    rr(ctx, fx - 120, GY - 620, 14, 110, 7); ctx.fillStyle = "#9C98A3"; ctx.fill(); rr(ctx, fx - 120, GY - 430, 14, 130, 7); ctx.fill();
    ctx.save(); ctx.translate(fx + 10, GY - 640); ctx.rotate(.06); rr(ctx, -80, -70, 160, 140, 6); ctx.fillStyle = "#F6E27A"; ctx.fill(); ol(ctx, 4); textC(ctx, "RESOLUSI", 0, -36, 22, RED, 900); ctx.fillStyle = "#8C7A6A"; for (let k = 0; k < 3; k++) ctx.fillRect(-56, -14 + k * 26, 112 - k * 20, 8); ctx.restore();
    ctx.restore(); };
  TT.scene(PX + "tabungan", "Cerita: rumah pagi, resolusi kabur bergoyang, buku tabungan dibalik halaman demi halaman dengan saldo yang sama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 700, y: 820 }, f.tabungan || {});
    const tIn = T(s, K.inCue, .2, idx), tFlip = T(s, K.flipCue, .1, idx), tSt = T(s, K.stampCue, .3, idx);
    base(ctx, s, t, { env: "home", envOpt: { time: "day" },
      back: () => { BG.ruang(ctx, t, { fridgeX: 960 }); },
      front: () => { ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(560, GY + 4, 360, 20, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#8E4E2E"; [260, 820].forEach(x => { rr(ctx, x, GY - 300, 26, 300, 6); ctx.fill(); ol(ctx, 5); });
        rr(ctx, 220, GY - 320, 660, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); drawItem(ctx, "mug", 300, GY - 320, t, { col: "#FFFFFF" });
        if (t >= tIn){ const q = eBack(clamp((t - tIn) / .45, 0, 1)); passbook(ctx, K.x, K.y, q * (K.s || .95), t, t - tFlip, {}); } },
      over: () => { if (t < tFlip + .4) (K.notes || []).forEach((n, j) => { const k = t - cueT(s, n.cue, .3, idx); if (k < 0) return; const out = clamp((t - tFlip) / .4, 0, 1);
          ctx.save(); ctx.globalAlpha *= 1 - out; ctx.filter = `blur(${1.5 + Math.sin(t * 4 + j) * 1}px)`; popChip(ctx, n.text, n.x ?? 540, (n.y ?? 300 + j * 100) + Math.sin(t * 3 + j * 2) * 10, k, "#FFFFFF", "#8C7A6A", 46, Math.sin(t * 2.5 + j) * .08); ctx.filter = "none"; ctx.restore(); });
        if (t >= tSt) stampBox(ctx, "SEGITU-SEGITU SAJA", 540, 340, t - tSt, RED, 62, -.06); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tabungan || {}; (K.notes || []).forEach(n => add(cueT(s, n.cue, .3, i), "pop")); if (K.inCue) add(cueT(s, K.inCue, .2, i), "whoosh");
    if (K.flipCue){ const a = cueT(s, K.flipCue, .1, i); for (let k = 0; k < 5; k++) add(a + k * .45, "whoosh"); } if (K.stampCue) add(cueT(s, K.stampCue, .3, i), "ping"); });

  /* _pinang: imagined greased-pole climb. mode vague: three ? prizes swing, climber slips; mode clear: one prize + 12 footholds */
  function prizeBox(ctx, x, y, w, h, col, label, t, clear){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.2 + x) * (clear ? .04 : .14));
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 0); ctx.stroke();
    rr(ctx, -w / 2, 0, w, h, 12); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.fillStyle = clear ? RED : "#FFFFFF"; ctx.fillRect(-10, 0, 20, h); ctx.fillRect(-w / 2, h / 2 - 10, w, 20);
    ctx.beginPath(); ctx.ellipse(-22, -6, 24, 14, -.5, 0, TAU); ctx.ellipse(22, -6, 24, 14, .5, 0, TAU); ctx.fill(); ol(ctx, 4);
    if (!clear) textC(ctx, "?", 0, h / 2 + 30, h * .7, OUT, 900);
    if (label){ fit(ctx, label, 560, clear ? 44 : 36, 900); const w2 = Math.max(w, ctx.measureText(label).width + 40); rr(ctx, -w2 / 2, h + 14, w2, clear ? 70 : 60, 10); ctx.fillStyle = clear ? GREEN : "#9C98A3"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(label, 0, h + 14 + (clear ? 48 : 43)); ctx.textAlign = "left"; }
    ctx.restore(); }
  BG.lapangan = (ctx, t, o) => { ctx.save(); // red-white bunting between two poles
    for (let r = 0; r < 2; r++){ const y0 = 520 + r * 140; ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300, y0); ctx.quadraticCurveTo(540, y0 + 120, 1380, y0); ctx.stroke();
      for (let k = 0; k < 18; k++){ const q = k / 17, x = lerp(-300, 1380, q), y = y0 + 4 * 120 * q * (1 - q) * .5 * 2 * .5 + Math.sin(t * 3 + k) * 3; ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.lineTo(x + 26, y); ctx.lineTo(x, y + 50); ctx.closePath(); ctx.fillStyle = k % 2 ? "#FFFFFF" : RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke(); } }
    ctx.restore(); };
  TT.scene(PX + "pinang", "Cerita: khayalan panjat pinang; hadiah kabur bergoyang dan tokoh merosot, atau satu hadiah jelas + dua belas pijakan dan tokoh naik", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, top: 470, mode: "vague", on: 0 }, f.pinang || {});
    const tSwap = K.swapAt ?? T(s, K.swapCue, .2, idx), tSteps = T(s, K.stepsCue, .2, idx), tWin = T(s, K.winCue, .3, idx);
    // climber feet y from keys [{at|cue, y, dur, slide}]
    const climbY = () => { let y = GY, from = GY, T0 = -1, d = .1, slide = false; (K.climb || []).forEach((k, j) => { const tk = tOf(s, k, .2, idx); if (t >= tk){ from = y; y = k.y; T0 = tk; d = k.dur || .6; slide = !!k.slide; } });
      if (T0 < 0) return [GY, false]; const q = clamp((t - T0) / d, 0, 1); return [lerp(from, y, slide ? q * q : TT.easeIO(q)), slide && q < 1]; };
    const [cy, sliding] = climbY();
    base(ctx, s, t, { env: K.env || "park", envOpt: Object.assign({ time: "day" }, K.envOpt || {}), envFront: false,
      spots: { puncak: [K.x, K.top + 120, 1.0], tiang: () => [K.x, cy - 600, null] },
      back: (c2, c, sts) => { { const st = sts[K.on]; if (st && K.climb){ st.y = cy; st.x = K.x - 70; st.face = 1; if (sliding) st.pose = "shock"; } }
        BG.lapangan(ctx, t, {});
        // pole
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(K.x, GY + 6, 110, 18, 0, 0, TAU); ctx.fill();
        const pg = ctx.createLinearGradient(K.x - 30, 0, K.x + 30, 0); pg.addColorStop(0, "#7A4A2E"); pg.addColorStop(.4, "#C98B52"); pg.addColorStop(1, "#6B3E22"); ctx.fillStyle = pg;
        rr(ctx, K.x - 36, K.top, 72, GY - K.top, 16); ctx.fill(); ol(ctx, 6);
        if (K.mode === "vague"){ ctx.strokeStyle = hexA("#FFFFFF", .55); ctx.lineWidth = 5; for (let y = K.top + 60; y < GY; y += 90){ ctx.beginPath(); ctx.moveTo(K.x - 14, y + Math.sin(t * 2 + y) * 6); ctx.lineTo(K.x - 8, y + 40); ctx.stroke(); }
          for (let k = 0; k < 6; k++){ const yy = (K.top + ((t * 260 + k * 160) % (GY - K.top))); ctx.fillStyle = hexA("#3B2418", .5); ctx.beginPath(); ctx.ellipse(K.x + 32, yy, 6, 10, 0, 0, TAU); ctx.fill(); } }
        // footholds
        if (K.steps && t >= tSteps){ for (let i = 0; i < 12; i++){ const k = t - tSteps - i * .12; if (k < 0) continue; const q = eBack(clamp(k / .3, 0, 1)), y = GY - 150 - i * ((GY - K.top - 260) / 11), d = i % 2 ? 1 : -1;
          const lit = sts[K.on] && sts[K.on].y <= y + 40; ctx.save(); ctx.translate(K.x + 30, y); ctx.scale(q, q); rr(ctx, 0, -18, 130, 36, 10); ctx.fillStyle = lit ? GOLD : "#E8D2B0"; ctx.fill(); ol(ctx, 5);
          font(ctx, 900, 22, FAM); ctx.fillStyle = BROWN; ctx.fillText("500RB", 22, 8); ctx.restore();
          if (lit) glowAt(ctx, K.x + 100, y, 80, GOLD, .5); } }
        // top ring with prizes
        ctx.save(); ctx.translate(K.x, K.top); ctx.rotate(Math.sin(t * 1.1) * .02); ctx.beginPath(); ctx.ellipse(0, 0, 260, 40, 0, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = GOLD; ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
        const swapK = t - tSwap;
        if (K.mode === "vague" || swapK < 1.2){ const fall = K.mode === "clear" && swapK > 0 ? clamp(swapK / 1, 0, 1) : 0;
          (K.vague || ["HEMAT?", "NABUNG?", "BERES?"]).forEach((lb, j) => { const px = K.x + (j - 1) * 250; ctx.save(); ctx.globalAlpha *= 1 - fall; prizeBox(ctx, px + fall * (j - 1) * 200, K.top + 60 + fall * fall * 900, 170, 140, ["#5B7DB1", "#E58BA0", "#8FBF5A"][j], lb, t, false); ctx.restore(); }); }
        if (K.mode === "clear" && t >= tSwap){ const q = clamp(swapK / .6, 0, 1); const glow = t >= tWin ? .6 + .2 * Math.sin(t * 6) : .3; glowAt(ctx, K.x, K.top + 140, 300, GOLD, glow);
          prizeBox(ctx, K.x, K.top + 60 - (1 - eBack(q)) * 500, 250, 190, GOLD, K.label || "DANA DARURAT Rp 6 JT · 31 DES", t, true); }
      },
      over: () => { if (sliding) popWord(ctx, K.slideWord || "SROOOT!", 540, 560, .2, { size: 96, hold: 9, rot: -8 });
        if (t >= tWin) stampBox(ctx, K.winText || "TERCAPAI!", 540, 330, t - tWin, GREEN, 80, -.07); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pinang || {}; (K.climb || []).forEach((k, j) => add(tOf(s, k, .2, i), k.slide ? "whoosh" : "pop"));
    if (K.swapCue || K.swapAt != null) { const a = K.swapAt ?? cueT(s, K.swapCue, .2, i); add(a, "whoosh"); add(a + .6, "pop"); } if (K.stepsCue){ const a = cueT(s, K.stepsCue, .2, i); for (let k = 0; k < 12; k += 3) add(a + k * .12, "pop"); } if (K.winCue) add(cueT(s, K.winCue, .3, i), "chime"); });

  /* _tanya: porch, three question bubbles from the brother, the target card written line by line */
  BG.terasRumah = (ctx, t, o) => { ctx.save(); ctx.fillStyle = "#F3E2C8"; ctx.fillRect(-400, 260, 1880, GY - 260); ctx.fillStyle = "#C98B52"; for (let x = -400; x < 1480; x += 60) ctx.fillRect(x, GY - 140, 26, 140);
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-400, GY - 150, 1880, 16);
    rr(ctx, 620, 380, 380, 300, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(636, 396, 348, 268); ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(810, 396); ctx.lineTo(810, 664); ctx.stroke();
    ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.moveTo(660, 640); ctx.lineTo(760, 410); ctx.lineTo(790, 410); ctx.lineTo(690, 640); ctx.fill();
    ctx.save(); ctx.translate(80, GY - 150); ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.lineTo(46, 120); ctx.lineTo(-46, 120); ctx.closePath(); ctx.restore();
    ctx.restore(); prop(ctx, "plant", 70, GY, { s: .9 }, t); };
  TT.scene(PX + "tanya", "Cerita: teras rumah, kakak melontarkan tiga gelembung tanya APA? BERAPA? KAPAN?, kartu target ditulis baris demi baris", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ asker: 1 }, f.tanya || {});
    base(ctx, s, t, { env: "home", envOpt: { time: "day" },
      back: () => { BG.terasRumah(ctx, t, {}); },
      front: () => { ctx.fillStyle = "#8E4E2E"; [460, 600].forEach(x => { rr(ctx, x, GY - 230, 20, 230, 5); ctx.fill(); ol(ctx, 4); }); ctx.beginPath(); ctx.ellipse(540, GY - 236, 130, 24, 0, 0, TAU); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
        drawItem(ctx, "mug", 500, GY - 240, t, { col: "#FFFFFF" }); drawItem(ctx, "mug", 590, GY - 240, t + 1, { col: GOLD }); },
      over: (c2, c, sts) => {
        const st = sts[K.asker]; (K.qs || []).forEach((q, j) => { const k = t - cueT(s, q.cue, .3, idx); const O = K.cardCue ? cueT(s, K.cardCue, .2, idx) : 1e9; if (k < 0 || t > O + .3) return;
          ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1); const x = 250 + j * 290, y = 330 + (j % 2) * 70 + Math.sin(t * 3 + j) * 8, qq = eBack(clamp(k / .35, 0, 1));
          ctx.translate(x, y); ctx.scale(qq, qq); ctx.beginPath(); ctx.arc(0, 0, 112, 0, TAU); ctx.fillStyle = [ORANGE, TEAL, NAVY][j]; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.moveTo(-30, 96); ctx.lineTo(10, 170); ctx.lineTo(30, 96); ctx.closePath(); ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 0, 108, 0, TAU); ctx.fill();
          textC(ctx, q.text, 0, 16, 50, "#FFFFFF", 900, 190); ctx.restore(); });
        if (K.lines && K.cardCue){ const T0 = cueT(s, K.cardCue, .2, idx); if (t < T0) return; const q = eBack(clamp((t - T0) / .4, 0, 1));
          ctx.save(); ctx.translate(540, 470); ctx.rotate(-.03); ctx.scale(q, q); rr(ctx, -360, -190, 720, 380, 20); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
          ctx.fillStyle = hexA("#F6E27A", .9); ctx.save(); ctx.rotate(-.4); ctx.fillRect(-380, -120, 120, 34); ctx.restore();
          textC(ctx, "TARGET TAHUN DEPAN", 0, -128, 30, "#8C7A6A", 900);
          K.lines.forEach((l, j) => { const a = cueT(s, l.cue, .2, idx), n = Math.floor(clamp((t - a) / .6, 0, 1) * l.text.length); if (n <= 0) return;
            const y = -50 + j * 92, sz = j === 0 ? 58 : 64; textC(ctx, l.text.slice(0, n), 0, y + 20, sz, l.col || BROWN, 900, 640);
            if (l.circle && t - a > .7){ const p = clamp((t - a - .7) / .4, 0, 1); ctx.beginPath(); ctx.ellipse(0, y, 300, 50, -.02, -1.6, -1.6 + p * TAU); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.stroke(); } });
          ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tanya || {}; (K.qs || []).forEach(q => add(cueT(s, q.cue, .3, i), "pop")); if (K.cardCue) add(cueT(s, K.cardCue, .2, i), "whoosh");
    (K.lines || []).forEach(l => { const a = cueT(s, l.cue, .2, i); add(a, "pop"); if (l.circle) add(a + .7, "ping"); }); });

  /* ======================= MS52: superhero costume (cape, mask, emblem, oversized helmet) ======================= */
  const CAPE = "#D9483B";
  function capeDraw(ctx, st, t, big, trip){ const k = st.size / 92, f = st.face || 1, sx = st.x, shy = st.y - 55 * k;
    const len = (big ? 70 : 46) * k, flut = Math.sin(t * 7) * 6 * k * (st.moving ? 1.6 : .6), back = -f * (st.moving ? 26 : 10) * k;
    ctx.save(); ctx.beginPath(); ctx.moveTo(sx - 12 * k, shy); ctx.quadraticCurveTo(sx + back - 22 * k + flut, shy + len * .5, sx + back * 1.6 - 18 * k + flut * 1.4, shy + len);
    if (big){ ctx.quadraticCurveTo(sx + back * 2 + flut, shy + len + 8 * k, sx + back * 2.6 + 30 * k * -f + flut, shy + len + (trip ? -4 : 2) * k); }
    ctx.lineTo(sx + back * 1.6 + 18 * k + flut * 1.4, shy + len); ctx.quadraticCurveTo(sx + back + 22 * k + flut, shy + len * .5, sx + 12 * k, shy); ctx.closePath();
    ctx.fillStyle = CAPE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }
  function costumeFront(ctx, st, A, t, o){ if (!A) return; const k = st.size / 92, f = st.face || 1, big = o.big;
    // emblem on the chest
    const ex = st.x + 2 * k * f, ey = st.y - 44 * k; ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.sin(t * 2) * .03);
    const r = (big ? 13 : 9.5) * k; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r, -r * .2); ctx.lineTo(0, r); ctx.lineTo(-r, -r * .2); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5);
    textC(ctx, o.letter || "S", 0, r * .38, r * 1.05, RED, 900); ctx.restore();
    // mask over the eyes
    const hx = A.headX, hy = A.headY - 2 * k; if (o.mask !== false){ ctx.save(); ctx.translate(hx + 2.6 * k * f, hy); ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.ellipse(-7.3 * k, 0, 7.6 * k, 6.4 * k, 0, 0, TAU); ctx.ellipse(7.3 * k, 0, 7.6 * k, 6.4 * k, 0, 0, TAU); ctx.fill();
      ctx.fillRect(-14 * k, -2.2 * k, 28 * k, 4.4 * k); ctx.globalCompositeOperation = "destination-out"; ctx.restore();
      ctx.save(); ctx.fillStyle = "#FFFFFF"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(hx + 2.6 * k * f + d * 7.3 * k, hy, 4 * k, 4.6 * k, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(hx + 2.6 * k * f + d * 7.3 * k + 1.2 * k * f, hy, 2.3 * k, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#FFFFFF"; }); ctx.restore(); }
    // oversized helmet slipping over the eyes
    if (o.helmet){ const slip = o.slip || 0, wob = Math.sin(t * 9) * .08 * (1 + slip); ctx.save(); ctx.translate(hx, A.headY - 14 * k + slip * 10 * k); ctx.rotate(wob);
      ctx.beginPath(); ctx.arc(0, 0, 28 * k, Math.PI, 0); ctx.lineTo(28 * k, 5 * k); ctx.lineTo(-28 * k, 5 * k); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = GOLD; ctx.fillRect(-28 * k, -1 * k, 56 * k, 6 * k); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-28 * k, -1 * k, 56 * k, 6 * k);
      [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 26 * k, -18 * k); ctx.rotate(d * .5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(d * 4 * k, -22 * k); ctx.lineTo(d * 10 * k, 2 * k); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
      ctx.restore(); }
  }
  function hanger(ctx, x, top, t, o){ o = o || {}; // standing costume rack with the hero suit; o.dust 0..1, o.shrink 0..1 -> walking jacket
    ctx.save(); ctx.fillStyle = "#5A3A2A"; rr(ctx, x - 10, top, 20, GY - top, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x - 90, GY - 16, 180, 16, 6); ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, top + 10); ctx.lineTo(x, top + 50); ctx.stroke();
    const sh = o.shrink || 0, sc = 1 - .45 * sh, sw = Math.sin(t * 1.6) * .03; ctx.translate(x, top + 50); ctx.rotate(sw); ctx.scale(sc, sc);
    if (sh < .55){ ctx.globalAlpha *= 1 - clamp((sh - .35) / .2, 0, 1);
      ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(150, 0); ctx.lineTo(210, 700); ctx.lineTo(-210, 700); ctx.closePath(); ctx.fillStyle = CAPE; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(110, 0); ctx.lineTo(130, 330); ctx.lineTo(-130, 330); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(70, 120); ctx.lineTo(0, 200); ctx.lineTo(-70, 120); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "S", 0, 152, 80, RED, 900); ctx.globalAlpha = 1; }
    if (sh > .35){ ctx.save(); ctx.globalAlpha *= clamp((sh - .35) / .2, 0, 1); const s2 = 1 / sc * .9; ctx.scale(s2, s2);
      ctx.beginPath(); ctx.moveTo(-120, 10); ctx.lineTo(120, 10); ctx.lineTo(150, 120); ctx.lineTo(110, 130); ctx.lineTo(100, 330); ctx.lineTo(-100, 330); ctx.lineTo(-110, 130); ctx.lineTo(-150, 120); ctx.closePath(); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6);
      ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, 330); ctx.stroke(); textC(ctx, "10'", 50, 230, 50, GOLD, 900); ctx.restore(); }
    if (o.dust > 0){ ctx.save(); ctx.globalAlpha *= o.dust; ctx.fillStyle = hexA("#D9C9B4", .55); ctx.fillRect(-160, -10, 320, 20); ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 3;
      for (let r = 40; r < 160; r += 40){ ctx.beginPath(); ctx.arc(150, 0, r, Math.PI / 2, Math.PI); ctx.stroke(); } for (let a = 0; a < 5; a++){ ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(150 - Math.cos(a * .35) * 160, Math.sin(a * .35) * 160); ctx.stroke(); }
      for (let i = 0; i < 10; i++){ const q = ((t * .3 + i / 10) % 1); ctx.fillStyle = hexA("#E9E2D6", .7 * (1 - q)); ctx.beginPath(); ctx.arc(-120 + rnd(i) * 240, -20 - q * 120, 5, 0, TAU); ctx.fill(); } ctx.restore(); }
    ctx.restore(); }
  function costumeHooks(K, s, t, idx, extra){
    const kOf = () => { const { F } = shotOf(s, t); return Object.assign({}, K, F.kostum || {}); };
    return Object.assign({
      under: (c2, c, sts, j) => { const C = kOf(); if (C.on !== j || C.off) return; const st = sts[j]; capeDraw(ctx2(), st, t, C.big, false); },
      over1: (c2, c, sts, j, R) => { const C = kOf(); if (C.on !== j || C.off) return; const slip = C.slipCue ? clamp((t - cueT(s, C.slipCue, .3, idx)) / .5, 0, 1) : (C.slip || 0);
        costumeFront(ctx2(), sts[j], R[j], t, { big: C.big, helmet: C.helmet, slip, letter: C.letter }); } }, extra || {}); }
  let CTX2 = null; const ctx2 = () => CTX2;

  /* _pahlawan: living room at night, the hero pose, three giant intentions slam down as heavy planks above his head */
  TT.scene(PX + "pahlawan", "Cerita: ruang tamu malam, tokoh berkostum pahlawan super berpose, tiga papan niat raksasa berat jatuh bertumpuk di atas kepala", (ctx, th, s, t) => {
    CTX2 = ctx; const f = s.f || {}, idx = G.scene, K = Object.assign({ on: 0 }, f.kostum || {}), P2 = f.papan || [];
    base(ctx, s, t, costumeHooks(K, s, t, idx, { env: "home", envOpt: { time: "night", lampX: 940 },
      back: () => { prop(ctx, "sofa", 760, GY, { s: .8, color: "#5B4A8A" }, t); },
      front: (c2, c, sts) => { const st = sts[K.on]; if (!st) return; const hp = toonHead(st);
        P2.forEach((p, j) => { const T0 = cueT(s, p.cue, .2, idx); if (t < T0) return; const k = t - T0, q = clamp(k / .35, 0, 1), y = (p.y ?? (hp[1] - 300 - j * 150)) - (1 - q * q) * 900, bounce = k > .35 && k < .7 ? Math.sin((k - .35) / .35 * Math.PI) * 18 : 0;
          ctx.save(); ctx.translate(st.x + (p.dx ?? 0) + Math.sin(t * 2 + j) * 6, y + bounce); ctx.rotate((p.rot ?? (j % 2 ? .05 : -.05)) + Math.sin(t * 1.7 + j) * .02);
          rr(ctx, -370, -75, 740, 150, 20); ctx.fillStyle = ["#8C8C94", "#7A6E66", "#9C8F84"][j % 3]; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-300, -30); ctx.lineTo(-240, -10); ctx.moveTo(250, 40); ctx.lineTo(300, 20); ctx.stroke();
          textC(ctx, p.text, 0, 25, 72, "#FFFFFF", 900, 680); ctx.restore();
          if (k > .3 && k < 1){ ctx.save(); ctx.globalAlpha *= 1 - (k - .3) / .7; for (let i = 0; i < 8; i++){ ctx.fillStyle = "#D9C9B4"; ctx.beginPath(); ctx.arc(st.x - 340 + i * 97, y + 70 + (k - .3) * 60 * (1 + (i % 3)), 14 + (k - .3) * 30, 0, TAU); ctx.fill(); } ctx.restore(); } }); },
      over: () => { P2.forEach((p, j) => { const T0 = cueT(s, p.cue, .2, idx); if (t >= T0 && t < T0 + .6) popWord(ctx, "BRUK!", 860 - j * 80, 330 + j * 40, t - T0 - .3, { size: 70, hold: .5, rot: 8 }); }); } }));
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.papan || []).forEach(p => { const a = cueT(s, p.cue, .2, i); add(a, "whoosh"); add(a + .35, "pop"); }); });

  /* _kebesaran: the costume is too big; street at dawn (helmet slips, cape trips) + shots day 3 / day 5 / week 2 */
  BG.kamarTidur = (ctx, t, o) => { ctx.save(); const bx = o.bedX ?? 700; rr(ctx, bx - 280, GY - 300, 560, 300, 20); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
    rr(ctx, bx - 300, GY - 520, 70, 520, 14); ctx.fill(); ol(ctx, 6); rr(ctx, bx - 250, GY - 360, 520, 90, 30); ctx.fillStyle = "#F3F0EA"; ctx.fill(); ol(ctx, 5); rr(ctx, bx - 240, GY - 420, 150, 70, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    ctx.restore(); };
  BG.piring = (ctx, t, o) => { const x = o.x ?? 760, top = o.top ?? GY - 330; ctx.save(); ctx.translate(x, top); ctx.beginPath(); ctx.ellipse(0, 0, 130, 30, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(0, -16, 80, 46, 0, Math.PI, 0); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 3; i++){ const q = ((t * .5 + i / 3) % 1); ctx.strokeStyle = hexA("#FFFFFF", .7 * Math.sin(q * Math.PI)); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30 + i * 30, -70 - q * 80); ctx.quadraticCurveTo(-40 + i * 30, -100 - q * 80, -26 + i * 30, -130 - q * 80); ctx.stroke(); }
    ctx.restore(); };
  TT.scene(PX + "kebesaran", "Cerita: kostum kebesaran; subuh di jalan helm melorot dan jubah tersangkut, lalu potongan hari 3 kesiangan, hari 5 kelaparan, minggu 2 kostum berdebu", (ctx, th, s, t) => {
    CTX2 = ctx; const f0 = s.f || {}, idx = G.scene, { F } = shotOf(s, t), K = Object.assign({ on: 0 }, f0.kostum || {});
    const H = Object.assign({}, f0.kebesaran || {}, F.kebesaran || {});
    base(ctx, s, t, costumeHooks(K, s, t, idx, {
      back: () => { if (H.bed) BG.kamarTidur(ctx, t, H.bed); if (H.rack) hanger(ctx, H.rack.x, GY - 900, t, { dust: H.rack.dust ? clamp((t - cueT(s, H.rack.dust, .3, idx)) / 1, 0, 1) : 0 }); if (H.clock) prop(ctx, "clock", H.clock.x, H.clock.y, { fast: true }, t); },
      front: () => { if (H.desk){ prop(ctx, "desk", H.desk.x, GY, { laptop: true }, t); BG.piring(ctx, t, { x: H.desk.x + 140, top: GY - 290 }); }
        if (H.trip){ const tt = cueT(s, H.trip, .3, idx), k = t - tt; if (k >= 0 && k < 1){ ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 7; i++){ ctx.fillStyle = "#E9D7BC"; ctx.beginPath(); ctx.arc(H.tripX + (i - 3) * 50 * (1 + k), GY - 10 - k * 60 * (i % 3), 20 + k * 30, 0, TAU); ctx.fill(); } ctx.restore(); } } },
      over: () => { if (H.label){ const T0 = H.labelCue ? cueT(s, H.labelCue, .2, idx) : (F.cue ? cueT(s, F.cue, .2, idx) : .2); popChip(ctx, H.label, 540, 330, t - T0, H.labelBg || NAVY, "#FFFFFF", 50, -.03); }
        if (H.word){ const T0 = cueT(s, H.wordCue, .3, idx); popWord(ctx, H.word, 540, 520, t - T0, { size: 96, hold: 1.4, rot: -7 }); } } }));
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f.kebesaran || {}].concat((f.shots || []).map(x => x.kebesaran || {})).forEach(H => { if (H.wordCue) add(cueT(s, H.wordCue, .3, i), "pop"); if (H.trip) add(cueT(s, H.trip, .3, i), "pop"); }); });

  /* _pas: dining table, mother laughs, the giant costume shrinks POF into a walking jacket that fits */
  TT.scene(PX + "pas", "Cerita: meja makan malam, ibu tertawa, kostum raksasa di gantungan menyusut POF jadi jaket jalan kaki yang pas badan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 560 }, f.pas || {});
    const tS = T(s, K.shrinkCue, .3, idx), sh = t < tS ? 0 : clamp((t - tS) / .8, 0, 1), tTag = T(s, K.tagCue, .3, idx);
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 560 },
      back: () => { hanger(ctx, K.x, GY - 1000, t, { shrink: sh }); },
      front: () => { ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(540, GY + 6, 420, 20, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#6B3E22"; [180, 880].forEach(x => { rr(ctx, x, GY - 250, 24, 250, 6); ctx.fill(); ol(ctx, 5); });
        rr(ctx, 120, GY - 270, 840, 36, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); BG.piring(ctx, t, { x: 330, top: GY - 272 }); drawItem(ctx, "mug", 760, GY - 270, t, { col: GOLD });
        if (t >= tS && t < tS + 1.1){ const k = t - tS; ctx.save(); ctx.globalAlpha *= 1 - k / 1.1; for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.arc(K.x + Math.cos(a) * (80 + k * 260), GY - 700 + Math.sin(a) * (80 + k * 200), 40 + k * 30, 0, TAU); ctx.fill(); } ctx.restore(); } },
      over: () => { if (t >= tS) popWord(ctx, "POF!", 540, 520, t - tS, { size: 120, hold: 1.0, rot: -8 });
        if (t >= tTag) stampBox(ctx, K.tag || "PAS BADAN", 540, 330, t - tTag, GREEN, 72, -.06); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pas || {}; if (K.shrinkCue){ const a = cueT(s, K.shrinkCue, .3, i); add(a, "whoosh"); add(a + .3, "pop"); } if (K.tagCue) add(cueT(s, K.tagCue, .3, i), "ping"); });

  /* _jalan: evening walk in the housing lane; 10-minute ring, mother joins, 30-day streak of tiny moons */
  BG.gang = (ctx, t, o) => { ctx.save(); for (let i = 0; i < 6; i++){ const x = -400 + i * 420; rr(ctx, x, GY - 620, 340, 620, 10); ctx.fillStyle = ["#7A5236", "#5B4A8A", "#2F6F73"][i % 3]; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.moveTo(x - 30, GY - 610); ctx.lineTo(x + 170, GY - 780); ctx.lineTo(x + 370, GY - 610); ctx.closePath(); ctx.fillStyle = "#8E3B2E"; ctx.fill(); ol(ctx, 5);
      rr(ctx, x + 60, GY - 500, 110, 110, 8); ctx.fillStyle = "#FFD48A"; ctx.fill(); ol(ctx, 4); glowAt(ctx, x + 115, GY - 445, 130, "#FFD48A", .35 + .05 * Math.sin(t * 2 + i));
      rr(ctx, x + 200, GY - 300, 100, 300, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 4); }
    ctx.fillStyle = "#6B6470"; ctx.fillRect(-400, GY - 160, 2600, 160); ctx.strokeStyle = "#8C8C94"; ctx.lineWidth = 5; for (let x = -400; x < 2200; x += 60){ ctx.beginPath(); ctx.moveTo(x, GY - 160); ctx.lineTo(x, GY - 40); ctx.stroke(); }
    ctx.fillStyle = "#8C8C94"; ctx.fillRect(-400, GY - 170, 2600, 14); ctx.restore(); };
  TT.scene(PX + "jalan", "Cerita: jalan malam di gang perumahan, cincin 10 menit, ibu ikut menemani, deret 30 bulan sabit kecil terisi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.jalan || {});
    const tR = T(s, K.ringCue, .2, idx), tS = T(s, K.streakCue, .2, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "night" },
      back: () => { BG.gang(ctx, t, {}); },
      over: () => {
        if (t >= tR && t < tS){ const k = t - tR, q = eBack(clamp(k / .35, 0, 1)), p = clamp(k / Math.max(1, tS - tR - .3), 0, 1); ctx.save(); ctx.translate(860, 330); ctx.scale(q, q);
          ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 0, 82, -Math.PI / 2, -Math.PI / 2 + TAU * p); ctx.strokeStyle = GREEN; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.stroke();
          textC(ctx, "10", 0, 16, 64, "#FFFFFF", 900); textC(ctx, "MENIT", 0, 50, 22, CREAM, 900); ctx.restore(); }
        if (t >= tS){ const k = t - tS; popChip(ctx, K.streakText || "SEBULAN KEMUDIAN", 540, 290, k, NAVY, "#FFFFFF", 44, -.02);
          const n = Math.floor(clamp((k - .3) / 1.6, 0, 1) * 30); ctx.save(); ctx.translate(540, 410); const q = eBack(clamp(k / .4, 0, 1)); ctx.scale(q, q); rr(ctx, -420, -60, 840, 120, 26); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ol(ctx, 5);
          for (let i = 0; i < 30; i++){ const x = -390 + (i % 15) * 55.5, y = -24 + Math.floor(i / 15) * 48; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fillStyle = i < n ? GREEN : "#E0D3C2"; ctx.fill(); if (i < n){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x - 2, y + 6); ctx.lineTo(x + 8, y - 6); ctx.stroke(); } }
          ctx.restore(); if (n >= 30) popWord(ctx, "30 HARI!", 540, 560, k - 2, { size: 84, hold: 2, rot: -5 }); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.jalan || {}; if (K.ringCue) add(cueT(s, K.ringCue, .2, i), "pop"); if (K.streakCue){ const a = cueT(s, K.streakCue, .2, i); add(a, "whoosh"); add(a + 2, "chime"); } });

  /* MS52 BG: bedroom nightstand with a glass that fills with water */
  BG.nakas = (ctx, t, o, s) => { const idx = G.scene, x = o.x ?? 820, top = GY - 330, T0 = o.fillCue ? cueT(s, o.fillCue, .3, idx) : 1e9, q = clamp((t - T0) / 1, 0, 1);
    BG.kamarTidur(ctx, t, { bedX: 360 }); ctx.save(); rr(ctx, x - 120, top, 240, 330, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 90, top + 60, 180, 90, 8); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(x, top + 105, 9, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
    // glass
    ctx.translate(x, top); const gw = 90, gh = 150; ctx.beginPath(); ctx.moveTo(-gw / 2, -gh); ctx.lineTo(gw / 2, -gh); ctx.lineTo(gw * .4, 0); ctx.lineTo(-gw * .4, 0); ctx.closePath(); ctx.fillStyle = hexA("#DDF1F5", .6); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = hexA("#5BB3D9", .85); const lv = -gh * .85 * q; ctx.fillRect(-gw, lv + Math.sin(t * 6) * 3 * q, gw * 2, gh); ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    if (q > 0 && q < 1){ ctx.strokeStyle = hexA("#5BB3D9", .9); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, -gh - 220); ctx.lineTo(0, lv); ctx.stroke(); }
    if (q >= 1) glowAt(ctx, 0, -gh / 2, 150, "#BFE8F5", .4 + .1 * Math.sin(t * 4));
    ctx.restore(); };

  /* ======================= SB53 (series finale): year notebook, desire path, insight lawn, 3 priorities ======================= */
  const TABS = [["FOKUS", "#5B7DB1"], ["UANG", "#3E9B5A"], ["SEHAT", "#D9483B"], ["TIM", "#C2691F"], ["AI", "#5B4A8A"], ["KARIER", "#2F6F73"]];
  function yearBook(ctx, x, y, s, t, flipK, thick){ // open thick book on a desk, origin = bottom centre
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const th = 40 + 80 * (thick || 0); ctx.fillStyle = "#8E4E2E"; rr(ctx, -300, -th, 600, th, 10); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = PAPER; for (let k = 0; k < th / 8; k++){ ctx.fillRect(-290, -th + 4 + k * 8, 580, 4); }
    TABS.forEach(([lb, col], j) => { const tx = -260 + j * 96; rr(ctx, tx, -th - 30 - (j % 2) * 10, 70, 44, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); });
    // open pages
    ctx.translate(0, -th); ctx.beginPath(); ctx.moveTo(-300, 0); ctx.quadraticCurveTo(-150, -30, 0, -6); ctx.quadraticCurveTo(150, -30, 300, 0); ctx.lineTo(290, -230); ctx.quadraticCurveTo(150, -260, 0, -236); ctx.quadraticCurveTo(-150, -260, -290, -230); ctx.closePath();
    ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, -236); ctx.stroke();
    const n = flipK < 0 ? 0 : Math.floor(flipK / .18), ph = flipK < 0 ? 0 : (flipK % .18) / .18;
    [-1, 1].forEach(d => { const [lb, col] = TABS[(n + (d > 0 ? 1 : 0)) % TABS.length]; textC(ctx, lb, d * 140, -180, 34, col, 900, 220); ctx.fillStyle = "#D9C9B4"; for (let k = 0; k < 4; k++) ctx.fillRect(d * 140 - 100, -150 + k * 30, 200 - (k % 2) * 50, 7); });
    if (flipK >= 0 && flipK < 3.2){ const a = ph * Math.PI, w = Math.cos(a) * 290; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(w, -12 - Math.sin(a) * 40); ctx.lineTo(w, -242 - Math.sin(a) * 40); ctx.lineTo(0, -236); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); }
    ctx.restore(); }
  TT.scene(PX + "catatan", "Cerita: kantor pagi, buku catatan setahun yang sangat tebal, halaman berkibar penuh tab topik, topik terbang keluar, panah rutinitas berputar tetap sama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 700, on: 0 }, f.catatan || {});
    const tOpen = T(s, K.openCue, .2, idx), tThick = T(s, K.thickCue, .3, idx), tSame = T(s, K.sameCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1010, rug: false },
      front: () => { prop(ctx, "desk", K.x, GY, { s: 1.0, mug: false, papers: false }, t); const creak = t >= tThick && t < tThick + .6 ? Math.sin((t - tThick) * 40) * 4 : 0;
        yearBook(ctx, K.x, GY - 290 + creak, .95, t, t - tOpen, t < tThick ? 0 : eBack(clamp((t - tThick) / .5, 0, 1)));
        if (t >= tSame){ const st = { x: 0 }; } },
      over: (c2, c, sts) => {
        (K.topics || []).forEach((tp, j) => { const k = t - cueT(s, tp.cue, .2, idx); if (k < 0) return; const q = clamp(k / .6, 0, 1), p0 = c.toScreen(K.x, GY - 450, 1), tx = 150 + (j % 4) * 260, ty = 300 + (j > 3 ? 120 : 0) + (j % 2) * 60;
          const x = lerp(p0[0], tx, eOut(q)), y = lerp(p0[1], ty, eOut(q)) - Math.sin(q * Math.PI) * 120 + Math.sin(t * 3 + j) * 6; const out = t >= tSame ? clamp((t - tSame) / .4, 0, 1) : 0;
          ctx.save(); ctx.globalAlpha *= 1 - out * .6; popChip(ctx, tp.text, x, y, k, tp.bg || TABS[j % TABS.length][1], "#FFFFFF", 40, Math.sin(t * 2 + j) * .06); ctx.restore(); });
        if (t >= tSame){ const st = sts[K.on]; if (st){ const hp = toonHead(st), p = c.toScreen(st.x, hp[1] + st.size * .42, 1), k = t - tSame, q = eBack(clamp(k / .4, 0, 1)), r = st.size * .4 * c.scale(1);
          ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(q, q * .35); ctx.rotate(t * 3); ctx.setLineDash([40, 26]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU * .85); ctx.strokeStyle = hexA(ORANGE, .9); ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.stroke();
          ctx.translate(r, 0); ctx.rotate(Math.PI / 2 + TAU * .8 - Math.PI / 2); ctx.restore(); }
          stampBox(ctx, K.sameText || "CARA KERJA: MASIH SAMA", 540, 620, t - tSame - .2, RED, 54, -.05); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.catatan || {}; if (K.openCue){ const a = cueT(s, K.openCue, .2, i); for (let k = 0; k < 6; k++) add(a + k * .3, "whoosh"); }
    (K.topics || []).forEach(tp => add(cueT(s, tp.cue, .2, i), "pop")); if (K.thickCue) add(cueT(s, K.thickCue, .3, i), "pop"); if (K.sameCue) add(cueT(s, K.sameCue, .3, i) + .2, "ping"); });

  /* lawn + path drawing shared by _setapak, _rumput and the finale */
  function lawn(ctx, t, o){ o = o || {}; ctx.save(); const top = o.top ?? 760;
    const g = ctx.createLinearGradient(0, top, 0, 2100); g.addColorStop(0, o.far || "#9CCB6B"); g.addColorStop(1, o.near || "#5FA046"); ctx.fillStyle = g; ctx.fillRect(-600, top, 2280, 2100 - top);
    for (let i = 0; i < 140; i++){ const x = -500 + rnd(i) * 2080, y = top + 20 + rnd(i + 40) * (2000 - top), sz = .4 + (y - top) / (2000 - top) * 1.2, sw = Math.sin(t * 2 + i) * 3 * sz;
      ctx.strokeStyle = hexA("#3E7D3A", .7); ctx.lineWidth = 3 * sz; ctx.beginPath(); ctx.moveTo(x - 8 * sz, y); ctx.lineTo(x - 10 * sz + sw, y - 22 * sz); ctx.moveTo(x, y); ctx.lineTo(x + sw, y - 30 * sz); ctx.moveTo(x + 8 * sz, y); ctx.lineTo(x + 10 * sz + sw, y - 20 * sz); ctx.stroke(); }
    ctx.restore(); }
  const PATH = [[560, 900], [700, 1060], [380, 1300], [560, 1580], [420, 2000]];
  function pathPt(q){ const n = PATH.length - 1, i = Math.min(n - 1, Math.floor(q * n)), u = q * n - i, a = PATH[i], b = PATH[i + 1]; const s2 = u * u * (3 - 2 * u); return [lerp(a[0], b[0], s2), lerp(a[1], b[1], u)]; }
  function drawPath(ctx, amt, col, upto, t, glow){ if (amt <= 0) return; ctx.save(); const N = 60;
    for (let i = 0; i < N * (upto ?? 1); i++){ const q0 = i / N, q1 = (i + 1) / N, a = pathPt(q0), b = pathPt(q1), w = 26 + q0 * 170;
      ctx.strokeStyle = hexA(col, amt); ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    if (glow) for (let i = 0; i < 14; i++){ const q = ((t * .25 + i / 14) % 1) * (upto ?? 1), p = pathPt(q); sparkle(ctx, p[0] + Math.sin(i * 7) * 30 * q, p[1] - 10, 10 + q * 14, GOLD); }
    ctx.restore(); }
  function officeFar(ctx, t){ ctx.save(); ctx.translate(0, 120); rr(ctx, 360, 380, 400, 400, 8); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#9CC9D6"; for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 4; c2++){ ctx.fillRect(390 + c2 * 92, 410 + r * 90, 60, 56); }
    rr(ctx, 510, 680, 100, 100, 6); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 4); rr(ctx, 430, 340, 260, 50, 10); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, "KANTOR", 560, 376, 30, "#FFFFFF", 900); ctx.restore(); }
  function walker(ctx, q, sz, col, t, i, hij){ const p = pathPt(q), s2 = .35 + q * 1.1; ctx.save(); ctx.translate(p[0] + Math.sin(i * 3) * 20 * q, p[1]); ctx.scale(s2 * sz, s2 * sz); const b = Math.abs(Math.sin(t * 12 + i)) * 4;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 0, 30, 8, 0, 0, TAU); ctx.fill(); rr(ctx, -20, -100 - b, 40, 70, 14); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#3B2418"; ctx.fillRect(-14, -34 - b, 10, 34 + b); ctx.fillRect(4, -34 - b, 10, 34 + b); ctx.beginPath(); ctx.arc(0, -125 - b, 26, 0, TAU); ctx.fillStyle = hij || "#E2A77C"; ctx.fill(); ol(ctx, 4);
    if (hij){ ctx.beginPath(); ctx.arc(2, -122 - b, 17, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); } ctx.restore(); }

  /* _setapak: park in front of the office, a desire path; time-lapse walkers flatten the grass */
  TT.scene(PX + "setapak", "Cerita: taman depan kantor, jalan setapak di tengah rumput, percepatan waktu: orang lalu-lalang tiap hari, rumput terinjak jadi jalan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.setapak || {});
    const tSee = T(s, K.seeCue, .2, idx), tNo = T(s, K.noCue, .2, idx), tLapse = T(s, K.lapseCue, .2, idx);
    const lapseK = t - tLapse, amt = t < tLapse ? .45 : clamp(.45 + lapseK * .25, 0, 1);
    base(ctx, s, t, { env: "park", envOpt: { time: "day", bench: false }, envFront: false,
      spots: { jalan: [560, 1150, 1.0] },
      back: () => { lawn(ctx, t, { top: 880 }); officeFar(ctx, t); drawPath(ctx, amt, "#C9A46E", 1, t, false);
        if (t >= tLapse){ const n = 9; for (let i = 0; i < n; i++){ const q = ((lapseK * .55 + i / n) % 1); walker(ctx, q, 1, ["#5B7DB1", "#C2691F", "#2F6F73", "#8E3B5A", "#7FA563"][i % 5], t, i, i % 2 ? ["#E8A55B", "#5B4A8A", "#13223D"][i % 3] : null); } }
        else { const q = ((t * .12) % 1); walker(ctx, q, 1, "#5B7DB1", t, 1, null); } },
      over: () => { if (t >= tNo && t < tLapse + .2){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tLapse) / .2, 0, 1); popChip(ctx, "TAK ADA YANG MEMBANGUN", 540, 320, t - tNo, NAVY, "#FFFFFF", 42); ctx.restore(); }
        if (t >= tLapse){ const days = Math.min(365, Math.floor(lapseK * 120) + 1); popChip(ctx, "HARI KE-" + days, 540, 320, lapseK, ORANGE, "#FFFFFF", 50, -.02);
          ctx.save(); ctx.globalAlpha *= .25 + .1 * Math.sin(t * 20); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; for (let i = 0; i < 10; i++){ const y = 500 + i * 120 + (t * 900 % 120); ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(140, y); ctx.moveTo(940, y); ctx.lineTo(1020, y); ctx.stroke(); } ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.setapak || {}; if (K.noCue) add(cueT(s, K.noCue, .2, i), "pop"); if (K.lapseCue){ const a = cueT(s, K.lapseCue, .2, i); add(a, "whoosh"); add(a + 2, "chime"); } });

  /* _rumput: imagined lawn at sunset; insight cards rain down and sink into grass; one card walked daily becomes a golden path */
  TT.scene(PX + "rumput", "Cerita: khayalan padang senja, ratusan kartu insight jatuh lalu tenggelam jadi rumput, satu kartu yang dijalani tiap hari membentang jadi jalan emas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.rumput || {});
    const tRain = T(s, K.rainCue, .1, idx), tGrass = T(s, K.grassCue, .3, idx), tOne = T(s, K.oneCue, .2, idx), tPath = T(s, K.pathCue, .2, idx);
    base(ctx, s, t, { env: "sunset", envOpt: {}, envFront: false,
      spots: { kartu: [560, 1120, 1.12] },
      back: () => { lawn(ctx, t, { top: 900, far: "#B7C96B", near: "#6FA04A" });
        if (t >= tPath) drawPath(ctx, 1, GOLD, eOut(clamp((t - tPath) / 1.4, 0, 1)), t, true);
        for (let i = 0; i < 44; i++){ if (t < tRain) break; const T0 = tRain + rnd(i) * 1.6, k = t - T0; if (k < 0) continue; const x = 60 + rnd(i + 3) * 960, y = 960 + rnd(i + 7) * 640, fall = clamp(k / .6, 0, 1);
          if (Math.abs(x - 560) < 90 && Math.abs(y - 1260) < 90) continue; const sink = t >= tGrass ? clamp((t - tGrass) / .8, 0, 1) : 0, sc = .5 + (y - 900) / 700 * .6;
          ctx.save(); ctx.translate(x, lerp(y - 900, y, eOut(fall)) + sink * 30); ctx.rotate((rnd(i + 9) - .5) * .6 + (1 - fall) * 3); ctx.scale(sc * (1 - sink * .8), sc * (1 - sink));
          rr(ctx, -40, -54, 80, 108, 8); ctx.fillStyle = TABS[i % TABS.length][1]; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fillRect(-26, -34, 52, 8); ctx.fillRect(-26, -16, 36, 8); ctx.restore(); }
        // the one card
        if (t >= tOne){ const k = t - tOne, q = eBack(clamp(k / .4, 0, 1)), y = 1260 - 60 * q + Math.sin(t * 3) * 6; glowAt(ctx, 560, y, 220, GOLD, .55);
          ctx.save(); ctx.translate(560, y); ctx.scale(.8 + .5 * q, .8 + .5 * q); rr(ctx, -60, -80, 120, 160, 12); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "1", 0, 24, 80, OUT, 900); ctx.restore(); }
      },
      over: () => { if (t >= tRain && t < tGrass + .8){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tGrass - .4) / .4, 0, 1); popChip(ctx, "RATUSAN DIBACA", 540, 320, t - tRain, NAVY, "#FFFFFF", 46); ctx.restore(); }
        if (t >= tGrass) popWord(ctx, "...JADI RUMPUT", 540, 470, t - tGrass, { size: 76, hold: 1.4, rot: -4, col: "#8FBF5A" });
        if (t >= tPath) stampBox(ctx, "1 DIJALANI = JALAN", 540, 330, t - tPath, ORANGE, 66, -.05); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.rumput || {}; if (K.rainCue){ const a = cueT(s, K.rainCue, .1, i); for (let k = 0; k < 5; k++) add(a + k * .3, "pop"); }
    if (K.grassCue) add(cueT(s, K.grassCue, .3, i), "whoosh"); if (K.oneCue) add(cueT(s, K.oneCue, .2, i), "chime"); if (K.pathCue) add(cueT(s, K.pathCue, .2, i), "ping"); });

  /* _prioritas: office desk, 3 priorities written before opening messages; message bubbles wait impatiently; then the team copies it */
  function msgBubble(ctx, x, y, s, t, i, mood){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const hop = Math.abs(Math.sin(t * (mood ? 9 : 4) + i)) * (mood ? 16 : 6);
    ctx.translate(0, -hop); rr(ctx, -60, -46, 120, 80, 22); ctx.fillStyle = ["#5BB3D9", "#7FA563", "#E58BA0"][i % 3]; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-30, 30); ctx.lineTo(-44, 56); ctx.lineTo(-6, 32); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 18, -10, 9, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(d * 18 + 2, -8, 4, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); if (mood) { ctx.moveTo(-12, 16); ctx.lineTo(12, 12); } else { ctx.arc(0, 8, 10, .2, Math.PI - .2); } ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "prioritas", "Cerita: meja kantor pagi, tiga prioritas ditulis sebelum membuka pesan, gelembung pesan menunggu tak sabar; lalu satu tim ikut", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, { F } = shotOf(s, t), K = Object.assign({ x: 720 }, f0.prior || {}, F.prior || {});
    const tW = T(s, K.writeCue, .2, idx), tMsg = T(s, K.msgCue, .3, idx), tAwk = T(s, K.awkCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 80 },
      front: () => { if (K.off) return; prop(ctx, "desk", K.x, GY, { laptop: true, lx: 120 }, t);
        if (t >= tMsg){ for (let i = 0; i < 5; i++){ const k = t - tMsg - i * .15; if (k < 0) continue; const q = eBack(clamp(k / .35, 0, 1)); msgBubble(ctx, K.x - 60 + i * 70, GY - 470 - (i % 2) * 70, .7 * q, t, i, true); }
          ctx.save(); ctx.translate(K.x + 80, GY - 330); rr(ctx, -110, -26, 220, 52, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, "NANTI DULU", 0, 12, 30, "#FFFFFF", 900); ctx.restore(); } },
      over: () => { if (K.off || !K.lines) return; if (t < tW) return; const q = eBack(clamp((t - tW) / .4, 0, 1)), wob = t >= tAwk && t < tAwk + 2 ? Math.sin(t * 18) * .03 : 0;
        ctx.save(); ctx.translate(360, 440); ctx.rotate(-.05 + wob); ctx.scale(q, q); rr(ctx, -250, -170, 500, 340, 16); ctx.fillStyle = "#F6E27A"; ctx.fill(); ol(ctx, 6);
        textC(ctx, "3 PRIORITAS HARI INI", 0, -116, 32, RED, 900, 440);
        K.lines.forEach((l, j) => { const a = tW + .4 + j * .55, n = Math.floor(clamp((t - a) / .45, 0, 1) * l.length); if (n <= 0) return; textL(ctx, (j + 1) + ". " + l.slice(0, n), -200, -40 + j * 70, 40, BROWN, 900, 400); });
        ctx.restore(); if (t >= tAwk && t < tAwk + 2.2){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tAwk - 1.9) / .3, 0, 1); popChip(ctx, "CANGGUNG...", 760, 300, t - tAwk, NAVY, "#FFFFFF", 42, .05); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.prior || {}; if (K.writeCue){ const a = cueT(s, K.writeCue, .2, i); add(a, "pop"); [0, 1, 2].forEach(j => add(a + .4 + j * .55, "pop")); }
    if (K.msgCue){ const a = cueT(s, K.msgCue, .3, i); for (let k = 0; k < 5; k++) add(a + k * .15, "pop"); } if (K.awkCue) add(cueT(s, K.awkCue, .3, i), "whoosh"); });

  /* SB53 BG: golden path on the lawn for the finale (thank-you banner) */
  BG.finale = (ctx, t, o, s) => { const idx = G.scene; lawn(ctx, t, { top: 900, far: "#B7C96B", near: "#6FA04A" }); drawPath(ctx, 1, GOLD, 1, t, true);
    const T0 = o.bannerCue ? cueT(s, o.bannerCue, .3, idx) : (o.bannerAt ?? 0); if (t < T0) return; const q = eBack(clamp((t - T0) / .5, 0, 1));
    ctx.save(); ctx.translate(540, o.y ?? 760); ctx.scale(q, q); ctx.strokeStyle = OUT; ctx.lineWidth = 6; [-420, 420].forEach(x => { ctx.beginPath(); ctx.moveTo(x, -80); ctx.lineTo(x, 900); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(-430, -120); for (let x = -430; x <= 430; x += 20) ctx.lineTo(x, -120 + Math.sin(t * 3 + x * .02) * 6); for (let x = 430; x >= -430; x -= 20) ctx.lineTo(x, 60 + Math.sin(t * 3 + x * .02) * 6); ctx.closePath();
    ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); textC(ctx, o.text || "TERIMA KASIH · 365 HARI", 0, -6, 58, "#FFFFFF", 900, 800); ctx.restore(); };
})();

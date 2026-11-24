/* Scene pack j2611221631523: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for RN48, KD48, JS48, SC48, MS48.
   Layout prefix j2611221631523_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front, shots[]) plus shared extras (base()):
     hold [{on, kind, at|cue, outCue, s, dx, dy, text, col}] object in a toon's hand · pops [{text, cue}] · stamps [{text, cue, col}]
     chips [{text, cue, outCue, x, y}] screen chips · steps [{text, cue}] · confetti {cue} · bg <name> custom world background · shots [] cut
   Scenes (each one born from its own story) are listed at TT.scene(...) below. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631523_";
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
        drawItem2(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
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
    (f.chips || []).forEach((g, j) => { const T0 = tOf(s, g, .3 + j * .1, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : (g.out ?? 1e9); if (t >= T0 && t < O + .25) ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .25, 0, 1); popChip(ctx, g.text, g.x ?? 540, g.y ?? 330, t - T0, g.bg || NAVY, g.fg || "#FFFFFF", g.size || 40, (g.rot ?? -2) * Math.PI / 180); ctx.restore(); }); });
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
    all.forEach(f => (f.chips || []).forEach((g, j) => add(tOf(s, g, .3 + j * .1, i), "pop")));
    (f0.stamps || []).forEach(p => add(tOf(s, p, .4, i), "ping"));
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }


  /* ================= shared helpers of this pack ================= */
  function puff(ctx, x, y, s, col){ ctx.fillStyle = col || "rgba(255,255,255,.9)"; [[0, 0, 40], [36, -10, 46], [74, 4, 36], [36, 14, 34]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); }); }
  function lerpCol(a, b, q){ const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return "rgb(" + pa.map((v, i) => Math.round(lerp(v, pb[i], q))).join(",") + ")"; }
  const eIn = x => x * x * x;
  const tq = (t, T0, d) => t < T0 ? 0 : clamp((t - T0) / (d || .5), 0, 1);       // linear 0..1 after T0
  const eq = (t, T0, d) => t < T0 ? 0 : easeIO(clamp((t - T0) / (d || .5), 0, 1)); // eased
  const headOf = st => { const h = toonHead(st), sd = st.pose === "sit" ? 13 * st.size / 92 : 0; return [h[0], h[1] + sd]; };
  function zzz(ctx, x, y, t, k, s){ if (k <= 0) return; s = s || 1; for (let i = 0; i < 3; i++){ const q = ((t * .6) + i / 3) % 1; ctx.save(); ctx.globalAlpha *= k * (1 - q);
      outlineWords(ctx, [{ w: "Z", hl: true }], x + q * 90 * s + i * 10, y - q * 160 * s, (34 + i * 12) * s, { sw: 8 * s, hl: "#9FB9E8" }); ctx.restore(); } }
  function speedLines(ctx, x, y, dir, k, n, len){ if (k <= 0) return; n = n || 5; len = len || 140; ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = "#FFFFFF"; ctx.lineCap = "round";
    for (let i = 0; i < n; i++){ const yy = y + (i - (n - 1) / 2) * 22, l = len * (.6 + rnd(i) * .6); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - dir * 30, yy); ctx.lineTo(x - dir * (30 + l), yy); ctx.stroke(); } ctx.restore(); }

  /* ---------- plants (RN48) ---------- */
  // potted plant, origin = bottom of the pot. o: g growth, wilt 0..1, bloom 0..1, col flower colour, pot colour
  function plant(ctx, x, y, t, o){
    o = o || {}; const g = o.g ?? 1, wilt = clamp(o.wilt || 0, 0, 1), bloom = clamp(o.bloom || 0, 0, 1), s = o.s || 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // pot
    ctx.beginPath(); ctx.moveTo(-46, -78); ctx.lineTo(46, -78); ctx.lineTo(36, 0); ctx.lineTo(-36, 0); ctx.closePath(); ctx.fillStyle = o.pot || "#C2691F"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -54, -92, 108, 20, 6); ctx.fillStyle = o.rim || "#A9561A"; ctx.fill(); ol(ctx, 4);
    if (o.label) textC(ctx, o.label, 0, -30, 20, "#FFFFFF", 900, 80);
    ctx.translate(0, -88);
    const sway = Math.sin(t * 2 + x * .01) * .05 * (1 - wilt), H = 120 * g, bend = wilt * 1.1;
    const leafC = lerpCol("#5DB36A", "#A39A5A", wilt), stemC = lerpCol("#3E8B4A", "#7F7A45", wilt);
    // stem as a curve that bends over when wilting
    const tip = [Math.sin(bend) * H * .75 + sway * H, -Math.cos(bend) * H];
    ctx.strokeStyle = stemC; ctx.lineWidth = 9 * Math.min(1.4, .6 + g * .4); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sway * H * .3, -H * .6, tip[0], tip[1]); ctx.stroke();
    const leaves = Math.max(2, Math.round(2 + g * 2));
    for (let i = 0; i < leaves; i++){ const q = (i + 1) / (leaves + 1), lx = lerp(0, tip[0], q * q), ly = lerp(0, tip[1], q), side = i % 2 ? 1 : -1;
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(side * (.9 + wilt * 1.2) + Math.sin(t * 2.4 + i) * .06); ctx.beginPath(); ctx.ellipse(side * 26 * g * .8, 0, 30 * Math.min(1.5, g * .9), 13 * Math.min(1.5, g * .9), 0, 0, TAU); ctx.fillStyle = leafC; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    // bud / flower
    ctx.save(); ctx.translate(tip[0], tip[1]);
    if (bloom > 0){ const R = 36 * bloom * Math.min(1.5, g * .9); for (let k = 0; k < 7; k++){ const a = k / 7 * TAU + t * .4; ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(R * .9, 0, R * .75, R * .42, 0, 0, TAU); ctx.fillStyle = o.col || "#F08C9E"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, 0, R * .5, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); }
    else { ctx.beginPath(); ctx.ellipse(0, -6, 12, 18, 0, 0, TAU); ctx.fillStyle = lerpCol("#7FC07A", "#9A8E5A", wilt); ctx.fill(); ol(ctx, 4); }
    ctx.restore(); ctx.restore();
    return [x + (tip[0]) * s, y - (88 - tip[1]) * s]; }
  function sprayBottle(ctx, pump){ // origin = grip
    rr(ctx, -34, -40, 68, 120, 16); ctx.fillStyle = "#7EC8F0"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .5); rr(ctx, -24, -28, 14, 90, 6); ctx.fill();
    rr(ctx, -22, -76, 44, 40, 8); ctx.fillStyle = "#F0F0EA"; ctx.fill(); ol(ctx, 4);
    ctx.save(); ctx.translate(0, -70); ctx.rotate(-.2 * (pump || 0)); rr(ctx, 6, -18, 70, 22, 6); ctx.fillStyle = "#F0F0EA"; ctx.fill(); ol(ctx, 4); ctx.restore();
    rr(ctx, -40, -66, 20, 60, 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4);
    textC(ctx, "MANTAP", 0, 28, 17, "#FFFFFF", 900, 60); }
  function wateringCan(ctx, tilt){ ctx.rotate(tilt || 0); // origin = handle
    ctx.beginPath(); ctx.moveTo(-40, 10); ctx.lineTo(70, 10); ctx.lineTo(80, 130); ctx.lineTo(-50, 130); ctx.closePath(); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(70, 60); ctx.lineTo(170, -10); ctx.lineTo(178, 4); ctx.lineTo(80, 92); ctx.closePath(); ctx.fillStyle = "#2F7F48"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(178, -4, 14, 22, -.8, 0, TAU); ctx.fillStyle = "#2F7F48"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(10, 10, 46, Math.PI, 0); ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.stroke(); ctx.strokeStyle = "#2F7F48"; ctx.lineWidth = 8; ctx.stroke();
    ctx.fillStyle = hexA("#FFFFFF", .3); rr(ctx, -30, 24, 16, 90, 6); ctx.fill(); }
  // drops along a parabola from (x0,y0) to (x1,y1); p = how far the front has travelled
  function stream(ctx, x0, y0, x1, y1, p, t, a){ if (p <= 0) return; ctx.save(); ctx.globalAlpha *= a ?? 1; const N = 22;
    for (let i = 0; i < N; i++){ const q = ((i / N) + t * 2.2) % 1; if (q > p) continue; const x = lerp(x0, x1, q), y = lerp(y0, y1, q) - Math.sin(q * Math.PI) * 60 + q * q * 40;
      ctx.fillStyle = i % 3 ? "#7EC8F0" : "#BFE9FF"; ctx.beginPath(); ctx.ellipse(x, y, 9, 13, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA("#2F6F9A", .7); ctx.lineWidth = 2.5; ctx.stroke(); }
    ctx.restore(); }

  /* ---------- hand-held objects of this pack ---------- */
  function rulerShape(ctx, L){ rr(ctx, -22, -L / 2, 44, L, 6); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; for (let k = 0; k <= 30; k++){ const y = -L / 2 + 10 + k * (L - 20) / 30; ctx.beginPath(); ctx.moveTo(-22, y); ctx.lineTo(-22 + (k % 5 ? 10 : 20), y); ctx.stroke(); }
    font(ctx, 900, 16, FAM); ctx.fillStyle = OUT; ctx.textAlign = "center"; [0, 10, 20, 30].forEach((n, i) => ctx.fillText(String(n), 8, -L / 2 + 16 + i * (L - 20) / 3)); ctx.textAlign = "left"; }
  function keyFob(ctx, t){ ctx.rotate(Math.sin(t * 6) * .4); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.strokeStyle = "#BFC6CC"; ctx.lineWidth = 6; ctx.stroke();
    rr(ctx, -20, 14, 40, 56, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, 32, 7, 0, TAU); ctx.fill();
    rr(ctx, -6, 70, 12, 50, 3); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 3); }
  function pawShape(ctx, x, y, r, col){ ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y + r * .25, r * .62, r * .5, 0, 0, TAU); ctx.fill();
    [[-.62, -.38], [-.22, -.72], [.22, -.72], [.62, -.38]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.ellipse(x + dx * r, y + dy * r, r * .2, r * .26, dx * .5, 0, TAU); ctx.fill(); }); }
  function teaCup(ctx, t){ rr(ctx, -34, -60, 68, 60, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(36, -32, 14, -1.3, 1.3); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "#B5651D"; ctx.fillRect(-28, -54, 56, 10); for (let k = 0; k < 2; k++){ const q = (t * .6 + k / 2) % 1; ctx.globalAlpha = .7 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-8 + k * 16, -70 - q * 50); ctx.quadraticCurveTo(-18 + k * 16, -88 - q * 50, -6 + k * 16, -106 - q * 50); ctx.stroke(); } ctx.globalAlpha = 1; }
  function wrench(ctx, t){ ctx.rotate(-.6 + Math.sin(t * 10) * .15); rr(ctx, -12, -120, 24, 150, 8); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(0, -134, 34, 0, TAU); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFF4E6"; rr(ctx, -12, -176, 24, 44, 4); ctx.fill(); }
  function drawItem2(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1;
    const K = { spray: 1, can: 1, ruler: 1, keys: 1, stamp: 1, tea: 1, wrench: 1, envelope2: 1, bunny: 1, phone2: 1, bloom: 1, ticket: 1, leash: 1, carrier: 1 };
    if (!K[kind]) return drawItem(ctx, kind, x, y, t, o);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1) * (o.mirror ? -1 : 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "spray") sprayBottle(ctx, o.pump || 0);
    else if (kind === "can") wateringCan(ctx, o.tilt || 0);
    else if (kind === "ruler"){ ctx.translate(0, -150); rulerShape(ctx, 300); }
    else if (kind === "keys") keyFob(ctx, t);
    else if (kind === "stamp"){ ctx.rotate(-.15); rr(ctx, -16, -120, 32, 80, 10); ctx.fillStyle = "#A0522D"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -126, 24, 0, TAU); ctx.fill(); ol(ctx, 4);
      rr(ctx, -46, -44, 92, 34, 8); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 4); rr(ctx, -42, -12, 84, 16, 4); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 3); }
    else if (kind === "tea") teaCup(ctx, t);
    else if (kind === "wrench") wrench(ctx, t);
    else if (kind === "envelope2"){ ctx.rotate(-.12); const w = 200, h = 124; rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = "#F3E3C3"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(0, -h * .45); ctx.lineTo(w / 2, -h); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, o.text || "", 0, -24, 30, GREEN, 900, w * .86); }
    else if (kind === "bunny"){ bunny(ctx, 0, 10, .8, t, { label: o.text, hop: 0 }); }
    else if (kind === "phone2"){ ctx.rotate(-.15); rr(ctx, -46, -150, 92, 170, 16); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); rr(ctx, -36, -138, 72, 140, 8); ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fill();
      ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-26, -122 + k * 30, 40 + k * 8, 10); }
    else if (kind === "bloom"){ ctx.translate(0, 96); const g = o.grow || 0; plant(ctx, 0, 0, t, { g: .7 + g * .6, bloom: g, s: .8, col: o.col || "#F6C343", pot: "#5B7DB1", rim: "#46659A" }); }
    else if (kind === "ticket"){ ctx.rotate(-.2); rr(ctx, -50, -70, 100, 70, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, o.text || "08", 0, -22, 36, ORANGE, 900, 86); }
    else if (kind === "carrier"){ carrierBox(ctx, 0, 110, .8, t, { cat: true }); }
    ctx.restore(); }

  /* ================= RN48: apresiasi yang spesifik ================= */
  function deskFront(ctx, x, top, w, t, k, o){ o = o || {};
    // monitor seen from behind, at the side
    if (o.monitor !== false){ const mx = x + w * .3; rr(ctx, mx - 8, top - 70, 16, 70, 4); ctx.fillStyle = "#5C5650"; ctx.fill(); ol(ctx, 4); rr(ctx, mx - 70, top - 190, 140, 120, 10); ctx.fillStyle = "#5C5650"; ctx.fill(); ol(ctx, 5);
      glowAt(ctx, mx, top - 130, 90, "#BFE9FF", .12 + .05 * Math.sin(t * 3 + k)); }
    rr(ctx, x - w / 2, top - 6, w, 28, 8); ctx.fillStyle = "#B7774A"; ctx.fill(); ol(ctx, 5);
    rr(ctx, x - w / 2 + 14, top + 20, w - 28, 460, 6); ctx.fillStyle = o.col || "#E9D3B4"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA(OUT, .12); ctx.fillRect(x - w / 2 + 14, top + 20, w - 28, 18);
    if (o.label) { rr(ctx, x - 90, top + 60, 180, 46, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); textC(ctx, o.label, x, top + 93, 26, BROWN, 900, 160); } }
  // a floating outlined word (world), alpha a, scale sc
  function floatWord(ctx, txt, x, y, size, a, sc, col, rot){ if (a <= 0 || sc <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(sc, sc);
    outlineWords(ctx, [{ w: txt, hl: true }], 0, 0, size, { sw: size * .22, hl: col || HL }); ctx.restore(); }
  // nozzle / spout positions of hand-held things
  const handTip = (st, lx, ly, sc, rot) => { const h = handOf(st), k = st.size / 760 * (sc || 1), c = Math.cos(rot || 0), s2 = Math.sin(rot || 0);
    const rx = lx * c - ly * s2, ry = lx * s2 + ly * c; return [h[0] + (st.face || 1) * rx * k, h[1] + ry * k]; };

  // _semprot: office Friday; Dimas sprays a mist of "MANTAP!" over every desk, the mist evaporates, desk plants stay the same
  TT.scene(PX + "semprot", "Cerita: semprotan MANTAP! ke semua meja, kabutnya menguap, tanaman meja tak berubah", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.semprot || {}, DT = S.top ?? 1340, by = S.by ?? 2;
    const desks = S.desks || [{ x: 230, px: 120 }, { x: 600, px: 490 }];
    const tS = T(s, S.sprayCue, .3, idx), tE = T(s, S.fadeCue, .6, idx), tEnd = tE + 1.4;
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => {
        desks.forEach((d, i) => deskFront(ctx, d.x, DT, d.w || 330, t, i, { label: d.label }));
        desks.forEach((d, i) => { const arrive = tS + .7 + i * .35, sp = t > arrive && t < arrive + .5 ? 1 - (t - arrive) / .5 : 0;
          const tip = plant(ctx, d.px, DT, t, { g: .85, wilt: .35 + .1 * Math.sin(t * .8 + i), bloom: 0 }); if (sp > 0) sparkle(ctx, tip[0] + 30, tip[1] - 20, 18 * sp, "#FFFFFF"); });
        const st = sts[by]; if (!st || t < tS) return;
        const nz = handTip(st, 70, -88, 1, 0), live = t < tE ? 1 : clamp(1 - (t - tE) / 1.2, 0, 1);
        // mist particles toward the desks, rising & fading after tE
        for (let i = 0; i < 46; i++){ const d = desks[i % desks.length], tx = d.px + 40 - (i % 5) * 18, ty = DT - 250 - (i % 7) * 26;
          const born = tS + rnd(i) * Math.max(.4, tE - tS); if (t < born) continue; const q = clamp((t - born) / 1.1, 0, 1), up = t > tE ? (t - tE) * 160 : 0;
          const x = lerp(nz[0], tx, eOut(q)) + Math.sin(t * 3 + i) * 12, y = lerp(nz[1], ty, eOut(q)) - Math.sin(q * Math.PI) * 60 - up;
          ctx.fillStyle = hexA("#E9F6FF", .55 * live); ctx.beginPath(); ctx.arc(x, y, 10 + q * 26, 0, TAU); ctx.fill(); }
        // words
        desks.forEach((d, i) => { const b = tS + .25 + i * .35; if (t < b) return; const q = eOut(clamp((t - b) / .9, 0, 1)), up = t > tE ? (t - tE) * 120 : 0, a = t > tE ? clamp(1 - (t - tE) / 1.1, 0, 1) : 1;
          floatWord(ctx, "MANTAP!", lerp(nz[0], d.px + 30, q), lerp(nz[1], DT - 330, q) - up - Math.sin(t * 3 + i) * 10, 58, a, (t > tE ? 1 - (t - tE) * .5 : 1) * (.4 + .6 * q), i % 2 ? HL : "#7EC8F0", -.08 + i * .1); });
        if (t > tE && t < tEnd) desks.forEach((d, i) => smoke(ctx, d.px + 30, DT - 300, t, clamp(1 - (t - tE) / 1.4, 0, 1), { n: 5, h: 220, col: "#FFFFFF", s: .7 }));
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.semprot || {}; if (S.sprayCue){ const t0 = cueT(s, S.sprayCue, .3, i); add(t0, "whoosh"); add(t0 + .6, "pop"); } if (S.fadeCue) add(cueT(s, S.fadeCue, .6, i), "whoosh"); });

  // _curhat: home at night; Sari at the dining table tells her mother about three late nights tidying 300 customer records
  TT.scene(PX + "curhat", "Cerita: rumah malam, curhat di meja makan, tiga bulan sabit, baris data naik dari laptop, tanaman layu", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.curhat || {}, DT = S.top ?? 1390, lx = S.lx ?? 560, px = S.px ?? 760;
    const tMoon = T(s, S.moonCue, .2, idx), tRows = T(s, S.rowsCue, .4, idx), tSad = T(s, S.sadCue, .7, idx);
    base(ctx, s, t, {
      under: (ctx2, c, sts, j) => { if (j !== 0) return; const st = sts[0]; // chair
        ctx.fillStyle = "#6B3B20"; rr(ctx, st.x - 130 * st.face, DT - 330, 26, 340, 8); ctx.fill(); ol(ctx, 4); },
      front: (ctx2, c, sts, R) => {
        // table
        rr(ctx, 130, DT - 8, 860, 30, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#F3E3C3"; ctx.beginPath(); ctx.moveTo(150, DT + 22); ctx.lineTo(970, DT + 22); ctx.lineTo(990, DT + 160); ctx.lineTo(130, DT + 160); ctx.closePath(); ctx.fill(); ol(ctx, 4);
        ctx.strokeStyle = hexA(ORANGE, .5); ctx.lineWidth = 4; for (let x = 170; x < 980; x += 60){ ctx.beginPath(); ctx.moveTo(x, DT + 30); ctx.lineTo(x - 6, DT + 150); ctx.stroke(); }
        // mug
        ctx.save(); ctx.translate(250, DT - 4); drawItem(ctx, "mug", 0, 0, t, { s: 1.1 }); ctx.restore();
        // laptop facing us
        ctx.save(); ctx.translate(lx, DT - 6); rr(ctx, -150, -200, 300, 196, 12); ctx.fillStyle = "#4A4440"; ctx.fill(); ol(ctx, 5); rr(ctx, -134, -186, 268, 166, 8); ctx.fillStyle = "#DDF1F7"; ctx.fill();
        for (let r = 0; r < 6; r++){ const y = -170 + r * 26 - ((t * 40) % 26); if (y < -184 || y > -40) continue; ctx.fillStyle = r % 2 ? hexA(TEAL, .5) : hexA(ORANGE, .45); ctx.fillRect(-118, y, 236, 16); }
        rr(ctx, -170, -8, 340, 16, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); glowAt(ctx, 0, -100, 260, "#BFE9FF", .25); ctx.restore();
        // data rows rising and stacking
        if (t > tRows){ const n = Math.min(10, Math.floor((t - tRows) * 9)); for (let i = 0; i < n; i++){ const q = eOut(clamp((t - tRows - i / 9) / .5, 0, 1)), y = lerp(DT - 120, DT - 300 - i * 30, q);
            rr(ctx, lx - 120 + Math.sin(i) * 6, y, 240, 24, 6); ctx.fillStyle = i % 2 ? "#FFFFFF" : "#FFE9C9"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(lx - 100, y + 12, 7, 0, TAU); ctx.fill(); }
          popChip(ctx, "300 pelanggan", lx, DT - 640, t - tRows - .4, NAVY, "#FFFFFF", 36, -.05, true); }
        // plant on the table wilts while she talks
        const wl = .25 + .65 * eq(t, tSad, 1.2); plant(ctx, px, DT, t, { g: .9, wilt: wl, s: .9 });
      },
      over: (ctx2, c, sts, R) => { // three crescent moons = three late nights
        if (t < tMoon) return; for (let i = 0; i < 3; i++){ const k = t - tMoon - i * .35; if (k < 0) continue; const q = eBack(clamp(k / .35, 0, 1)), x = 330 + i * 210, y = 300 + Math.sin(t * 2 + i) * 6;
          ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fillStyle = "#1E2546"; ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.arc(-8, 0, 38, 0, TAU); ctx.fillStyle = "#FFE7A8"; ctx.fill(); ctx.beginPath(); ctx.arc(6, -10, 34, 0, TAU); ctx.fillStyle = "#1E2546"; ctx.fill();
          textC(ctx, "Malam " + (i + 1), 0, 98, 30, "#FFFFFF", 900); ctx.restore(); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.curhat || {}; if (S.moonCue) [0, .35, .7].forEach(d => add(cueT(s, S.moonCue, .2, i) + d, "pop")); if (S.rowsCue) add(cueT(s, S.rowsCue, .4, i), "whoosh"); });

  // _tanya: park at lunch; Bu Hana asks "mantap karena apa?", Dimas' spray only puffs, then she waters one exact plant with a can
  TT.scene(PX + "tanya", "Cerita: taman, semprotan cuma mendesis & menguap, gembor menyiram tepat ke akar, bunga mekar", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.tanya || {}, bx = S.bx ?? 545, BT = S.top ?? 1360;
    const tPuff = T(s, S.puffCue, .4, idx), tPour = T(s, S.pourCue, .6, idx), tBloom = tPour + 1.0;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => {
        // brick planter
        ctx.fillStyle = "#B5654A"; rr(ctx, bx - 130, BT, 260, GY - BT + 40, 8); ctx.fill(); ol(ctx, 5);
        ctx.strokeStyle = hexA("#FFF4E6", .35); ctx.lineWidth = 3; for (let r = 0; r < 6; r++){ const y = BT + 20 + r * 44; ctx.beginPath(); ctx.moveTo(bx - 130, y); ctx.lineTo(bx + 130, y); ctx.stroke();
          for (let k = 0; k < 4; k++){ const x = bx - 130 + 30 + k * 70 + (r % 2) * 35; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 44); ctx.stroke(); } }
        rr(ctx, bx - 146, BT - 18, 292, 28, 8); ctx.fillStyle = "#9C4F38"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#5A3A2A"; ctx.fillRect(bx - 126, BT - 26, 252, 12);
      },
      mid: (ctx2, c, sts, R) => {
        const g = .7 + .8 * eq(t, tPour + .3, 1.4), bl = eBack(clamp((t - tBloom) / .6, 0, 1)) * (t > tBloom ? 1 : 0);
        const tip = plant(ctx, bx, BT - 14, t, { g, wilt: .4 * (1 - eq(t, tPour, 1)), bloom: bl, col: "#F6C343", pot: "transparent", rim: "transparent" });
        if (t > tBloom && t < tBloom + .9) burstFx(ctx, tip[0], tip[1], t - tBloom, GOLD, 10, 150);
      },
      front: (ctx2, c, sts, R) => {
        const d = sts[0], h = sts[1];
        if (d && t > tPuff && t < tPuff + 2.6){ const nz = handTip(d, 70, -88, 1, 0), k = t - tPuff;
          smoke(ctx, nz[0] + 30 + k * 40, nz[1] - 10, t, clamp(1 - k / 2.4, 0, 1), { n: 6, h: 260, col: "#FFFFFF", s: .9 });
          "MANTAP".split("").forEach((ch, i) => { const q = clamp((k - .2 - i * .08) / 1.6, 0, 1); if (q <= 0) return;
            floatWord(ctx, ch, nz[0] + 60 + i * 40 + Math.sin(t * 4 + i) * 20 * q, nz[1] - 60 - q * (200 + i * 30), 50, 1 - q, 1 - q * .5, "#7EC8F0", (i - 3) * .2 * q); }); }
        if (h && t > tPour - .2){ const tilt = .75 * eq(t, tPour - .2, .4), sp = handTip(h, 178, -4, 1, tilt);
          const tgt = [bx + 6, BT - 60]; stream(ctx, sp[0], sp[1], tgt[0], tgt[1], tq(t, tPour, .5), t, 1); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.tanya || {}; if (S.puffCue) add(cueT(s, S.puffCue, .4, i), "whoosh"); if (S.pourCue){ add(cueT(s, S.pourCue, .6, i), "whoosh"); add(cueT(s, S.pourCue, .6, i) + 1.0, "chime"); } });

  // _siram: office Monday morning; Dimas waters Sari's own desk plant with specific words; it grows & blooms, Sari lights up
  TT.scene(PX + "siram", "Cerita: kantor Senin pagi, gembor pujian spesifik menyiram tanaman meja Sari, tumbuh & mekar besar", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.siram || {}, DT = S.top ?? 1350, px = S.px ?? 560, by = S.by ?? 1;
    const tPour = T(s, S.pourCue, .3, idx), tBloom = T(s, S.bloomCue, .7, idx), tStop = T(s, S.stopCue, .85, idx);
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => {
        deskFront(ctx, S.dx ?? 380, DT, S.dw ?? 520, t, 0, { label: "SARI", col: "#F3E3C3", monitor: S.monitor });
        const g = .8 + 1.0 * eq(t, tPour + .4, Math.max(.6, tBloom - tPour)), bl = t > tBloom ? eBack(clamp((t - tBloom) / .6, 0, 1)) : 0;
        const tip = plant(ctx, px, DT, t, { g, wilt: .35 * (1 - eq(t, tPour, 1)), bloom: bl, col: "#F08C9E", s: 1.15 });
        if (t > tBloom && t < tBloom + .9) burstFx(ctx, tip[0], tip[1], t - tBloom, HL, 12, 200);
        if (t > tBloom) for (let k = 0; k < 5; k++){ const a = t * 1.5 + k * 1.26; sparkle(ctx, tip[0] + Math.cos(a) * 110, tip[1] + Math.sin(a) * 60, 10 + 6 * Math.sin(t * 5 + k), GOLD); }
        const st = sts[by]; if (st && t > tPour - .2 && t < tStop + .4){ const tilt = .8 * eq(t, tPour - .2, .4) * (1 - eq(t, tStop, .4)), sp = handTip(st, 178, -4, 1, tilt);
          stream(ctx, sp[0], sp[1], px + 10, DT - 160, tq(t, tPour, .5) * (1 - tq(t, tStop, .3)), t, 1); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.siram || {}; if (S.pourCue) add(cueT(s, S.pourCue, .3, i), "whoosh"); if (S.bloomCue) add(cueT(s, S.bloomCue, .7, i), "chime"); });

  // _tular: street at dusk after work; Sari passes it on: specific praise to Yoga, his little pot sprouts and blooms
  TT.scene(PX + "tular", "Cerita: jalan senja pulang kantor, Sari memuji Yoga dengan spesifik, pot kecil di tangan Yoga mekar", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.tular || {}, on = S.on ?? 1, tG = T(s, S.growCue, .5, idx);
    base(ctx, s, t, {
      over1: (ctx2, c, sts, j) => { if (j !== on) return; const st = sts[j], h = handOf(st), k = st.size / 760, g = eq(t, tG, 1.2);
        ctx.save(); ctx.translate(h[0], h[1] + 70 * k); ctx.scale(k * 1.05, k * 1.05); const tip = plant(ctx, 0, 0, t, { g: .6 + g * .7, bloom: g, col: "#F6C343", pot: "#5B7DB1", rim: "#46659A" });
        ctx.restore(); if (t > tG + 1 && t < tG + 1.9) burstFx(ctx, h[0] + (tip[0]) * k * 1.05, h[1] + 70 * k + (tip[1]) * k * 1.05, t - tG - 1, GOLD, 10, 140); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.tular || {}; if (S.growCue) add(cueT(s, S.growCue, .5, i) + 1, "chime"); });

  /* ================= KD48: perbaiki bertahap (AI answer = "Si Jawaban", a paper character with a haircut) ================= */
  // origin = feet. o: w, h, lines, hair (0..1), hairLen, comb 0..1, tie 0..1, mood -1..1, warm 0..1, tag, wave, seated, cape
  function paperGuy(ctx, x, y, t, o){
    o = o || {}; const w = o.w || 230, h = o.h || 380, leg = o.seated ? 0 : 46, top = y - leg - h, sq = o.squash || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(1 + sq * .15, 1 - sq * .15); ctx.translate(-x, -y);
    // legs
    if (!o.seated){ ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round"; const st = Math.sin(t * (o.walk ? 14 : 3)) * (o.walk ? 12 : 2);
      ctx.beginPath(); ctx.moveTo(x - 40, y - leg); ctx.lineTo(x - 44 + st, y - 6); ctx.moveTo(x + 40, y - leg); ctx.lineTo(x + 44 - st, y - 6); ctx.stroke();
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(x - 52 + st, y - 6, 22, 10, 0, 0, TAU); ctx.ellipse(x + 52 - st, y - 6, 22, 10, 0, 0, TAU); ctx.fill(); }
    // hair = long strands of tiny text: behind the sheet, falling past both sides
    const hair = clamp(o.hair ?? 0, 0, 1), HL2 = (o.hairLen ?? 300) * hair, comb = clamp(o.comb || 0, 0, 1);
    const strand = (x0, y0, cx1, cy1, x1, y1, wd) => { ctx.strokeStyle = OUT; ctx.lineWidth = wd + 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx1, cy1, x1, y1); ctx.stroke();
      ctx.strokeStyle = comb > .5 ? "#6B3F22" : "#4A4F56"; ctx.lineWidth = wd; ctx.stroke(); ctx.setLineDash([6, 8]); ctx.strokeStyle = hexA("#FFFFFF", .45); ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]); };
    if (hair > 0 && HL2 > 70){ const N = 12; for (let i = 0; i < N; i++){ const u = i / (N - 1), side = u < .5 ? -1 : 1, e = Math.abs(u - .5) * 2, len = HL2 * (.75 + .25 * rnd(i + 11));
        const sw = Math.sin(t * 2 + i) * 10 * (1 - comb), sx = x - w / 2 + 10 + u * (w - 20), spread = (1 - comb) * 40 * (1 - e);
        strand(sx, top - 4, x + side * (w / 2 + 50 + spread), top - 30, x + side * (w / 2 + 14 + spread * .6 + 30 * (1 - e)) + sw, top + len, 12); } }
    // arms
    const wv = o.wave ? Math.sin(t * 9) * .5 : 0; ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - w / 2, top + h * .55); ctx.lineTo(x - w / 2 - 50, top + h * .55 + 50 - (o.armsUp ? 120 : 0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w / 2, top + h * .55); ctx.lineTo(x + w / 2 + 50 + wv * 30, top + h * .55 + 50 - (o.armsUp || o.wave ? 130 : 0)); ctx.stroke();
    // sheet
    const warm = clamp(o.warm || 0, 0, 1);
    ctx.beginPath(); ctx.moveTo(x - w / 2, top); ctx.lineTo(x + w / 2 - 40, top); ctx.lineTo(x + w / 2, top + 40); ctx.lineTo(x + w / 2, top + h); ctx.lineTo(x - w / 2, top + h); ctx.closePath();
    ctx.fillStyle = lerpCol("#E9ECEF", "#FFF2D9", warm); ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(x + w / 2 - 40, top); ctx.lineTo(x + w / 2 - 40, top + 40); ctx.lineTo(x + w / 2, top + 40); ctx.fillStyle = lerpCol("#C9CED3", "#F3D9B5", warm); ctx.fill(); ol(ctx, 4);
    // text lines (below the face)
    const n = Math.round(o.lines ?? 8), ly0 = top + 150, room = top + h - 20 - ly0, gap = Math.min(28, room / Math.max(1, n));
    for (let i = 0; i < n; i++){ const yy = ly0 + i * gap; if (yy > top + h - 18) break; ctx.fillStyle = i === 0 && warm > .5 ? ORANGE : lerpCol("#9AA3AB", "#C9A27E", warm); rr(ctx, x - w / 2 + 22, yy, (w - 44) * (.55 + .45 * rnd(i + 3)), 10, 5); ctx.fill(); }
    // face
    const fy = top + 78, m = o.mood || 0;
    ctx.fillStyle = OUT; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(x + d * 38, fy - 6, 10, (Math.sin(t * 2.3) > .97 ? 2 : 13), 0, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x + d * 22, fy - 34 - (m < 0 ? -6 * d * 0 + 4 : 0)); ctx.lineTo(x + d * 56, fy - 30 - (m < 0 ? -8 : 4)); ctx.stroke(); });
    ctx.beginPath(); if (m >= 0){ ctx.arc(x, fy + 12, 18 + m * 8, .15 * Math.PI, .85 * Math.PI); } else { ctx.moveTo(x - 22, fy + 26); ctx.lineTo(x + 22, fy + 26); } ctx.stroke();
    if (m > .5){ ctx.fillStyle = hexA("#F08C9E", .55); ctx.beginPath(); ctx.ellipse(x - 62, fy + 16, 14, 8, 0, 0, TAU); ctx.ellipse(x + 62, fy + 16, 14, 8, 0, 0, TAU); ctx.fill(); }
    if (o.monocle){ ctx.beginPath(); ctx.arc(x + 38, fy - 6, 22, 0, TAU); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.stroke(); }
    // fringe on top (eyes stay visible)
    if (hair > 0){ const N = 9; for (let i = 0; i < N; i++){ const u = i / (N - 1), sx = x - w / 2 + 14 + u * (w - 28), L = Math.min(36, 14 + HL2 * .05);
        if (comb > .5) strand(x - w / 2 + 10, top + 6, x, top - 50 - i * 2, x + w / 2 - 6, top + 10 + i * 2, 11);
        else strand(sx, top - 26, sx + (u - .5) * 30, top - 50, sx + (u - .5) * 26 + Math.sin(t * 3 + i) * 4, top + L, 13); } }
    // bow tie
    const tie = clamp(o.tie ?? 0, 0, 1); if (tie > 0){ ctx.save(); ctx.translate(x, fy + 62); ctx.scale(tie, tie); ctx.fillStyle = "#22252B";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -20); ctx.lineTo(-40, 20); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(40, -20); ctx.lineTo(40, 20); ctx.closePath(); ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill(); ctx.restore(); }
    // cape (barber)
    if (o.cape){ ctx.beginPath(); ctx.moveTo(x - 40, fy + 50); ctx.lineTo(x + 40, fy + 50); ctx.lineTo(x + w / 2 + 70, top + h + 10); ctx.lineTo(x - w / 2 - 70, top + h + 10); ctx.closePath();
      ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = hexA(RED, .8); for (let k = -6; k < 8; k++) ctx.fillRect(x + k * 40, fy + 40, 18, h + 40); ctx.restore(); ctx.beginPath(); ctx.moveTo(x - 40, fy + 50); ctx.lineTo(x + 40, fy + 50); ctx.lineTo(x + w / 2 + 70, top + h + 10); ctx.lineTo(x - w / 2 - 70, top + h + 10); ctx.closePath(); ol(ctx, 5); }
    // date tag
    if (o.tag && (o.tagK ?? 1) > 0){ const q = o.tagK ?? 1; ctx.save(); ctx.translate(x + w / 2 - 10, top + h * .45); ctx.rotate(.12); ctx.scale(q, q); fit(ctx, o.tag, 300, 34, 900); const tw = ctx.measureText(o.tag).width + 40;
      rr(ctx, -tw / 2, -30, tw, 60, 14); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(o.tag, 0, 12); ctx.textAlign = "left";
      ctx.beginPath(); ctx.arc(-tw / 2 + 4, -26, 11, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    ctx.restore();
    return { top, x, fy }; }
  function scissorsGuy(ctx, x, y, s, open, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot ?? -.5);
    [-1, 1].forEach(d => { ctx.save(); ctx.rotate(d * open * .45); ctx.beginPath(); ctx.moveTo(0, -12 * d); ctx.lineTo(190, -4 * d); ctx.lineTo(0, 12 * d); ctx.closePath(); ctx.fillStyle = "#D7DDE2"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.ellipse(-70, 30 * d, 44, 32, 0, 0, TAU); ctx.lineWidth = 16; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = ORANGE; ctx.stroke(); ctx.restore(); });
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    ctx.rotate(-(o.rot ?? -.5)); // eyes upright
    [-1, 1].forEach(d => { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(-26 + d * 26, -50, 17, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-22 + d * 26, -48, 8, 0, TAU); ctx.fill(); });
    ctx.restore(); }
  function combGuy(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 8) * .2);
    rr(ctx, -110, -30, 220, 44, 14); ctx.fillStyle = "#E05A6A"; ctx.fill(); ol(ctx, 5); for (let k = 0; k < 14; k++){ rr(ctx, -100 + k * 15, 10, 8, 50, 3); ctx.fill(); ol(ctx, 2); }
    [-1, 1].forEach(d => { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(d * 26, -8, 13, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(d * 26 + 3, -6, 6, 0, TAU); ctx.fill(); }); ctx.restore(); }
  // laptop facing us, origin bottom centre; lid 0..1
  function laptopFront(ctx, x, y, w, lid, t, scr){ const h = w * .64 * lid; ctx.save(); ctx.translate(x, y);
    rr(ctx, -w / 2, -h - 6, w, h, 12); ctx.fillStyle = "#4A4440"; ctx.fill(); ol(ctx, 5); if (lid > .2){ rr(ctx, -w / 2 + 14, -h + 8, w - 28, h - 26, 8); ctx.fillStyle = scr || "#DDF1F7"; ctx.fill();
      ctx.fillStyle = hexA(TEAL, .4); for (let r = 0; r < 4; r++) if (-h + 30 + r * 30 < -30) ctx.fillRect(-w / 2 + 34, -h + 30 + r * 30, (w - 80) * (.5 + .5 * rnd(r)), 12); glowAt(ctx, 0, -h / 2, w, "#BFE9FF", .22); }
    rr(ctx, -w / 2 - 22, -8, w + 44, 18, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function homeTable(ctx, x, top, w){ rr(ctx, x - w / 2, top - 8, w, 30, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = "#6B3B20"; [x - w / 2 + 30, x + w / 2 - 54].forEach(lx => { rr(ctx, lx, top + 20, 24, GY - top - 10, 6); ctx.fill(); ol(ctx, 4); }); }
  function barberBG(ctx, t, o){
    ctx.fillStyle = "#CFE8E0"; ctx.fillRect(-2600, -1400, 6400, GY + 1400);
    for (let r = 0; r < 30; r++) for (let k = -20; k < 40; k++){ ctx.strokeStyle = hexA("#7FB3A6", .35); ctx.lineWidth = 3; ctx.strokeRect(k * 90, r * 90 - 400, 90, 90); }
    ctx.fillStyle = "#2F6F73"; ctx.fillRect(-2600, GY - 520, 6400, 40);
    // mirror
    rr(ctx, 300, 330, 480, 560, 30); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); rr(ctx, 326, 356, 428, 508, 20); ctx.fillStyle = "#BFE3EA"; ctx.fill();
    ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.moveTo(360, 400); ctx.lineTo(430, 400); ctx.lineTo(380, 520); ctx.lineTo(340, 520); ctx.closePath(); ctx.fill();
    if (o.check > 0){ ctx.save(); ctx.translate(540, 610); ctx.scale(o.check, o.check); ctx.strokeStyle = GREEN; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-20, 50); ctx.lineTo(80, -60); ctx.stroke(); ctx.restore(); }
    // barber pole
    const px = o.poleX ?? 980; rr(ctx, px - 40, 300, 80, 520, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.save(); rr(ctx, px - 40, 300, 80, 520, 30); ctx.clip();
    for (let k = -10; k < 20; k++){ const yy = 300 + k * 60 + (t * 90) % 60; ctx.fillStyle = k % 2 ? RED : "#2F6FB0"; ctx.beginPath(); ctx.moveTo(px - 50, yy); ctx.lineTo(px + 50, yy - 50); ctx.lineTo(px + 50, yy - 25); ctx.lineTo(px - 50, yy + 25); ctx.closePath(); ctx.fill(); }
    ctx.restore(); rr(ctx, px - 40, 300, 80, 520, 30); ol(ctx, 6); rr(ctx, px - 52, 270, 104, 40, 12); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 5); rr(ctx, px - 52, 810, 104, 40, 12); ctx.fill(); ol(ctx, 5);
    // shelf
    rr(ctx, -360, 700, 520, 22, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4); ["#7EC8F0", "#F6C343", "#E05A6A", "#7FA563"].forEach((col, i) => { rr(ctx, -330 + i * 110, 600, 60, 100, 14); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); });
    // floor tiles
    const fy = GY - 190; for (let r = 0; r < 12; r++) for (let k = -30; k < 40; k++){ ctx.fillStyle = (r + k) % 2 ? "#F4F1EA" : "#3B3530"; ctx.fillRect(k * 70, fy + r * 70, 70, 70); }
    ctx.fillStyle = hexA(OUT, .25); ctx.fillRect(-2600, fy, 6400, 10); }
  BG.barber = barberBG;
  function barberChair(ctx, x, seat){ ctx.fillStyle = "#8C989E"; rr(ctx, x - 20, seat + 40, 40, GY - seat - 60, 8); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(x, GY - 20, 120, 26, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
    rr(ctx, x - 170, seat - 10, 340, 60, 20); ctx.fillStyle = "#9E2A2A"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 190, seat - 70, 40, 90, 14); ctx.fill(); ol(ctx, 4); rr(ctx, x + 150, seat - 70, 40, 90, 14); ctx.fill(); ol(ctx, 4); }
  function chairBack(ctx, x, seat){ rr(ctx, x - 150, seat - 420, 300, 420, 30); ctx.fillStyle = "#9E2A2A"; ctx.fill(); ol(ctx, 5); }
  // falling clumps of text-hair
  function clumps(ctx, x, y0, floor, t, T0, n, seed){ if (t < T0) return; for (let i = 0; i < n; i++){ const k = t - T0 - i * .05; if (k < 0) continue; const dx = (rnd(i + seed) - .5) * 260, vy = 900;
      const y = Math.min(floor - 8 - rnd(i + seed + 3) * 20, y0 + 120 * k + vy * k * k * .5), xx = x + dx + Math.sin(k * 5 + i) * 30 * (y < floor - 30 ? 1 : 0);
      ctx.save(); ctx.translate(xx, y); ctx.rotate(rnd(i + seed) * 3 + (y < floor - 30 ? k * 4 : 0)); ctx.strokeStyle = "#4A4F56"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(0, -18, 26, 0); ctx.stroke(); ctx.restore(); } }

  // keyframes of Si Jawaban: P0 shaggy & stiff -> after r1 short -> after r2 relaxed -> after r3 tag
  function siState(t, R1, R2, R3, base0){ const b = Object.assign({ h: 460, lines: 12, hair: 1, hairLen: 520, comb: 0, tie: 1, mood: -1, warm: 0 }, base0 || {});
    const a = eq(t, R1 + .3, .8), c2 = eq(t, R2 + .2, .9);
    return Object.assign({}, b, { h: lerp(b.h, b.h * .66, a), lines: lerp(b.lines, 5, a), hairLen: lerp(b.hairLen, 130, a), comb: c2, tie: b.tie * (1 - c2), mood: lerp(b.mood, 1, c2), warm: c2,
      tag: R3 < 1e8 ? "31 DES · 07.00" : null, tagK: t < R3 + .2 ? 0 : eBack(clamp((t - R3 - .2) / .4, 0, 1)) }); }

  // _kusut: home at night, the stiff, shaggy answer pops out of the laptop, Rizal almost closes it
  TT.scene(PX + "kusut", "Cerita: rumah malam, Si Jawaban berambut teks gondrong & berdasi kupu meloncat dari laptop, laptop hampir ditutup", (ctx, th, s, t) => {
    const idx = G.scene; let A = null;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const S = R.f.kusut || {}; homeTable(ctx, S.tx ?? 760, S.top ?? 1380, S.tw ?? 560); },
      mid: (ctx2, c, sts, R) => { const S = R.f.kusut || {}, top = S.top ?? 1380, lx = S.lx ?? 640, tPop = T(s, S.popCue, .3, idx), tLong = T(s, S.longCue, .5, idx), tStiff = T(s, S.stiffCue, .5, idx), tClose = T(s, S.closeCue, .7, idx);
        const lid = 1 - .62 * eq(t, tClose, .6); laptopFront(ctx, lx, top, 280, lid, t);
        if (S.peek){ const q = eBack(clamp(t / .5, 0, 1)); ctx.save(); ctx.beginPath(); ctx.rect(lx - 200, top - 600, 400, 600 - 190 * lid); ctx.clip(); A = paperGuy(ctx, lx, top - 160 * lid + 230 * (1 - q) + 30, t, { h: 240, lines: 4, hair: 1, hairLen: 260, tie: 1, mood: -1, seated: true }); ctx.restore(); return; }
        if (t < tPop) return; const q = eBack(clamp((t - tPop) / .55, 0, 1)), px = lerp(lx, S.px ?? 830, eOut(clamp((t - tPop) / .55, 0, 1))), lift = (1 - q) * 300;
        const hl = 320 + 380 * eq(t, tLong, 1.0), stiff = eq(t, tStiff, .4), shrink = eq(t, tClose, .6);
        A = paperGuy(ctx, px, top + lift - 4, t, { h: (380 + 80 * eq(t, tLong, 1)) * (1 - .18 * shrink), lines: 10 + 4 * eq(t, tLong, 1), hair: 1, hairLen: hl, tie: stiff, mood: -1, monocle: stiff > .5, squash: t - tPop < .8 ? Math.sin((t - tPop) * 14) * Math.exp(-(t - tPop) * 5) : 0 });
        if (t - tPop < .5) burstFx(ctx, lx, top - 120, t - tPop, "#BFE9FF", 10, 200); },
      over: (ctx2, c, sts, R) => { const S = R.f.kusut || {}; if (!A || !S.sayText) return; const T0 = T(s, S.sayCue, .4, idx), O = T(s, S.sayOutCue, .8, idx); if (t < T0 || t > O) return;
        const p = c.toScreen(A.x + 60, A.top - 10); TT.bubble(ctx, S.sayText, p[0], p[1], t - T0, { kind: "say", size: 44, maxW: 560 }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.kusut || {}; if (S.popCue){ add(cueT(s, S.popCue, .3, i), "pop"); add(cueT(s, S.popCue, .3, i) + .1, "whoosh"); } if (S.stiffCue) add(cueT(s, S.stiffCue, .5, i), "ping"); if (S.closeCue) add(cueT(s, S.closeCue, .7, i), "whoosh"); });

  function guitar(ctx, x, y, s, t, o){ o = o || {}; const vib = o.vib || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    // neck + headstock
    rr(ctx, -26, -880, 52, 400, 8); ctx.fillStyle = "#6B3B20"; ctx.fill(); ol(ctx, 5); for (let k = 0; k < 8; k++){ ctx.fillStyle = "#D7DDE2"; ctx.fillRect(-26, -860 + k * 46, 52, 4); }
    rr(ctx, -44, -1000, 88, 130, 18); ctx.fillStyle = "#8E4A22"; ctx.fill(); ol(ctx, 5);
    for (let k = 0; k < 3; k++) [-1, 1].forEach(d => { const py = -975 + k * 40, big = o.pegI === k && d === 1; ctx.save(); ctx.translate(d * 60, py); ctx.rotate(big ? (o.peg || 0) : 0); ctx.scale(big ? 1.5 : 1, 1);
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, TAU); ctx.fillStyle = big ? GOLD : "#F0E6C8"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
    // body
    ctx.beginPath(); ctx.ellipse(0, -170, 175, 165, 0, 0, TAU); ctx.ellipse(0, -430, 130, 125, 0, 0, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -170, 175, 165, 0, 0, TAU); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(0, -430, 130, 125, 0, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -170, 168, 158, 0, 0, TAU); ctx.ellipse(0, -430, 123, 118, 0, 0, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill();
    // face on the upper bout (the answer)
    const m = o.mood ?? -1; ctx.fillStyle = OUT; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 46, -450, 12, Math.sin(t * 2.3) > .97 ? 2 : 16, 0, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 24, -488 + (m < 0 ? d * -6 : 0)); ctx.lineTo(d * 66, -484 - (m < 0 ? 8 : 0)); ctx.stroke(); });
    if (m > .5){ ctx.fillStyle = hexA("#F08C9E", .6); ctx.beginPath(); ctx.ellipse(-80, -420, 18, 10, 0, 0, TAU); ctx.ellipse(80, -420, 18, 10, 0, 0, TAU); ctx.fill(); }
    // sound hole = mouth
    ctx.beginPath(); if (m > .5) ctx.ellipse(0, -230, 64, 50 + 6 * Math.sin(t * 8), 0, 0, Math.PI); else ctx.ellipse(0, -230, 48, 48 + vib * 20 * Math.sin(t * 30), 0, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -70, -110, 140, 26, 6); ctx.fillStyle = "#6B3B20"; ctx.fill(); ol(ctx, 4);
    // strings
    ctx.strokeStyle = "#F4F1EA"; ctx.lineWidth = 3; for (let k = 0; k < 6; k++){ const sx = -18 + k * 7.2, w = vib * 10 * Math.sin(t * 50 + k); ctx.beginPath(); ctx.moveTo(sx, -980); ctx.quadraticCurveTo(sx + w, -560, sx, -100); ctx.stroke(); }
    ctx.restore(); }
  // tuner gauge; v -1..1, 0 = in tune
  function tuner(ctx, x, y, w, v, t, k){ if (k <= 0) return; const ok = Math.abs(v) < .12; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    rr(ctx, -w / 2, -w * .42, w, w * .56, 24); ctx.fillStyle = "#22252B"; ctx.fill(); ol(ctx, 6);
    for (let i = -10; i <= 10; i++){ const a = -Math.PI / 2 + i * .12; ctx.strokeStyle = Math.abs(i) <= 1 ? "#7CFF9A" : (Math.abs(i) > 6 ? RED : "#F6C343"); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * w * .34, w * .06 + Math.sin(a) * w * .34); ctx.lineTo(Math.cos(a) * w * .4, w * .06 + Math.sin(a) * w * .4); ctx.stroke(); }
    const jit = ok ? 0 : Math.sin(t * 23) * .04, a = -Math.PI / 2 + clamp(v + jit, -1.2, 1.2) * 1.2; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, w * .06); ctx.lineTo(Math.cos(a) * w * .36, w * .06 + Math.sin(a) * w * .36); ctx.stroke();
    textC(ctx, ok ? "PAS" : "SUMBANG", 0, w * .02 - w * .12, w * .1, ok ? "#7CFF9A" : RED, 900, w * .6); ctx.restore(); if (ok) glowAt(ctx, x, y, w * .7, "#7CFF9A", .18); }
  function pegDial(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot); ctx.beginPath(); ctx.ellipse(0, 0, 70, 40, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6);
    rr(ctx, -12, 30, 24, 70, 6); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.save(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x, y, 100 * s, -2.4 + rot * .3, -1 + rot * .3); ctx.stroke(); ctx.restore(); }
  function studioMusikBG(ctx, t, o){ ctx.fillStyle = "#3A2C4A"; ctx.fillRect(-2600, -1400, 6400, GY + 1400);
    for (let r = 0; r < 16; r++) for (let k = -20; k < 30; k++){ const x = k * 110 + (r % 2) * 55, y = r * 110 - 200; ctx.fillStyle = (r + k) % 2 ? "#47365A" : "#332641"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 55, y + 55); ctx.lineTo(x, y + 110); ctx.lineTo(x - 55, y + 55); ctx.closePath(); ctx.fill(); }
    [[180, "#F08C2E"], [900, "#7EC8F0"]].forEach(([sx, col], i) => { const sw = Math.sin(t * .8 + i) * 120; ctx.fillStyle = hexA(col, .16); ctx.beginPath(); ctx.moveTo(sx - 30, 0); ctx.lineTo(sx + 30, 0); ctx.lineTo(sx + 260 + sw, GY); ctx.lineTo(sx - 260 + sw, GY); ctx.closePath(); ctx.fill(); });
    // speaker boxes
    [-40, 1120].forEach(x => { rr(ctx, x - 110, GY - 520, 220, 340, 14); ctx.fillStyle = "#22252B"; ctx.fill(); ol(ctx, 5); [GY - 430, GY - 280].forEach((yy, i) => { const pul = 1 + .05 * Math.sin(t * 12 + i); ctx.beginPath(); ctx.arc(x, yy, (i ? 66 : 44) * pul, 0, TAU); ctx.fillStyle = "#4A4F56"; ctx.fill(); ol(ctx, 4); }); });
    const fy = GY - 190; ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-2600, fy, 6400, 1200); ctx.strokeStyle = hexA("#000000", .2); ctx.lineWidth = 3; for (let y = fy + 40; y < fy + 900; y += 50){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
    ctx.fillStyle = hexA(ORANGE, .45); ctx.beginPath(); ctx.ellipse(560, GY + 10, 420, 70, 0, 0, TAU); ctx.fill(); }
  BG.studioMusik = studioMusikBG;
  function soundWave(ctx, x, y, k, col, jag){ if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.lineJoin = "round";
    [-1, 1].forEach(d => { for (let r = 0; r < 3; r++){ ctx.beginPath(); const R = 90 + r * 60; for (let a = -.7; a <= .7; a += .1){ const rr2 = R + (jag ? ((Math.round(a * 10) % 2) ? 16 : -16) : 0); const px = x + d * Math.cos(a) * rr2, py = y + Math.sin(a) * rr2; a === -.7 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.stroke(); } }); ctx.restore(); }

  // _setem: Wulan stops him, cut to an imagined music studio: the answer is a stiff guitar, first strum is out of tune, Rizal turns a peg until the tuner says PAS
  TT.scene(PX + "setem", "Cerita: imajinasi studio musik, jawaban AI = gitar berwajah kaku, petikan pertama sumbang, pasak diputar sampai tuner PAS", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const S = R.f.setem || {}; if (S.mode !== "studio") homeTable(ctx, S.tx ?? 860, S.top ?? 1380, S.tw ?? 420); },
      mid: (ctx2, c, sts, R) => { const S = R.f.setem || {};
        if (S.mode !== "studio"){ const lx = S.lx ?? 820, top = S.top ?? 1380, q = eBack(clamp(t / .5, 0, 1)); laptopFront(ctx, lx, top, 260, .75, t);
          ctx.save(); ctx.beginPath(); ctx.rect(lx - 200, top - 700, 400, 700 - 125); ctx.clip(); paperGuy(ctx, lx, top - 40 + 200 * (1 - q) + Math.sin(t * 5) * 6, t, { h: 300, lines: 6, hair: 1, hairLen: 320, tie: 1, mood: -1, seated: true }); ctx.restore(); return; }
        const gx = S.gx ?? 560, tP = T(s, S.pluckCue, .2, idx), tB = T(s, S.badCue, .5, idx), tT = T(s, S.turnCue, .7, idx), tOk = T(s, S.okCue, .9, idx);
        const vib = t > tP ? Math.exp(-(t - tP) * 1.5) + (t > tT ? Math.exp(-(t - tT) * 2) * .6 : 0) : 0, peg = eq(t, tT, .9) * 4.2;
        const mood = t > tOk ? 1 : (t > tT ? 0 : -1);
        guitar(ctx, gx, GY - 20, S.gs ?? .95, t, { vib, peg, pegI: 0, mood, rot: Math.sin(t * 1.5) * .02 });
        if (t > tP) soundWave(ctx, gx, GY - 20 - 210 * (S.gs ?? .95), clamp(1 - (t - tB - 1.2), 0, 1) * (t < tT ? 1 : 0), RED, true);
        if (t > tOk) soundWave(ctx, gx, GY - 20 - 210 * (S.gs ?? .95), .6 + .4 * Math.sin(t * 6), "#7CFF9A", false);
        if (t > tT && t < tT + 1.2) { for (let k = 0; k < 5; k++){ const a = t * 6 + k * 1.26; sparkle(ctx, gx + 57 + Math.cos(a) * 60, GY - 20 - 975 * (S.gs ?? .95) + Math.sin(a) * 40, 12, GOLD); } }
        const v = t < tT ? -.85 : (t < tOk ? lerp(-.85, -.35, eq(t, tT, .8)) : lerp(-.35, 0, eq(t, tOk, .4)));
        tuner(ctx, S.tx2 ?? 870, S.ty2 ?? 520, 260, v, t, eBack(clamp((t - tP) / .4, 0, 1)) * (t > tP ? 1 : 0));
        if (t > tOk && t < tOk + .9) burstFx(ctx, S.tx2 ?? 870, S.ty2 ?? 520, t - tOk, "#7CFF9A", 12, 200); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.shots || []).forEach(sh => { const S = sh.setem || {}; if (S.pluckCue) add(cueT(s, S.pluckCue, .2, i), "ping"); if (S.turnCue) add(cueT(s, S.turnCue, .7, i), "whoosh"); if (S.okCue) add(cueT(s, S.okCue, .9, i), "chime"); }); });

  // _putaran: home desk in daylight, three rounds of feedback: scissors snip, comb + bow tie flies off, date tag pinned, PAS!
  TT.scene(PX + "putaran", "Cerita: meja rumah siang, tiga putaran perbaikan: gunting memendekkan, sisir & dasi copot, label tanggal disematkan", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.putaran || {}, top = S.top ?? 1400, lx = S.lx ?? 470, px = S.px ?? 780;
    const R1 = T(s, S.r1Cue, .3, idx), R2 = T(s, S.r2Cue, .55, idx), R3 = T(s, S.r3Cue, .75, idx), RP = T(s, S.passCue, .9, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => homeTable(ctx, S.tx ?? 650, top, S.tw ?? 760),
      mid: (ctx2, c, sts, R) => {
        laptopFront(ctx, lx, top, 300, 1, t);
        const st = siState(t, R1, R2, R3, { h: 420, hairLen: 440 }), jump = t > RP ? Math.abs(Math.sin((t - RP) * 6)) * 80 * Math.exp(-(t - RP) * .8) : 0;
        const A = paperGuy(ctx, px, top - 4 - jump, t, Object.assign(st, { wave: t > RP, armsUp: t > RP }));
        // a tuning peg twists beside the answer for each round; tuner above shows how close it is
        [R1, R2, R3].forEach((T0, i) => { if (t < T0 || t > T0 + 1.5) return; const q = clamp((t - T0) / 1.5, 0, 1), k = eBack(clamp((t - T0) / .3, 0, 1)) * clamp((1 - q) * 4, 0, 1);
          pegDial(ctx, px - 190, A.top + 60, .9 * k, eq(t, T0 + .2, .8) * 3.5); if (q < .6) for (let j = 0; j < 4; j++){ const a = t * 7 + j * 1.6; sparkle(ctx, px - 190 + Math.cos(a) * 90, A.top + 60 + Math.sin(a) * 60, 11, GOLD); } });
        const tv = t < R1 ? -.9 : t < R2 ? lerp(-.9, -.55, eq(t, R1 + .3, .8)) : t < R3 ? lerp(-.55, -.25, eq(t, R2 + .3, .8)) : t < RP ? lerp(-.25, -.12, eq(t, R3 + .3, .6)) : lerp(-.12, 0, eq(t, RP, .3));
        tuner(ctx, px, A.top - 170, 230, tv, t, 1);
        if (t > R2 + .2 && t < R2 + 1.4){ const k = t - R2 - .2; ctx.save(); ctx.translate(px + 200 * k, A.top + 140 - 500 * k + 600 * k * k); ctx.rotate(k * 9); ctx.fillStyle = "#22252B"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30, -15); ctx.lineTo(-30, 15); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(30, -15); ctx.lineTo(30, 15); ctx.closePath(); ctx.fill(); ctx.restore(); }
        if (t > R3 + .2 && t < R3 + .9) burstFx(ctx, px + 110, A.top + 180, t - R3 - .2, ORANGE, 10, 140);
        if (t > RP && t < RP + .9) burstFx(ctx, px, A.top + 100, t - RP, GOLD, 14, 260);
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.putaran || {}; if (S.r1Cue){ const t0 = cueT(s, S.r1Cue, .3, i); [.4, .6, .8].forEach(d => add(t0 + d, "pop")); } if (S.r2Cue) add(cueT(s, S.r2Cue, .55, i) + .2, "whoosh"); if (S.r3Cue) add(cueT(s, S.r3Cue, .75, i) + .2, "pop"); if (S.passCue) add(cueT(s, S.passCue, .9, i), "chime"); });

  // _grup: office Friday morning; the neat answer leaps from Rizal's phone and lands as copies above each colleague, question marks popped
  TT.scene(PX + "grup", "Cerita: kantor Jumat pagi, Si Jawaban rapi melompat dari ponsel Rizal ke atas kepala tiap rekan, tanda tanya pecah", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.grup || {}, from = S.from ?? 2, to = S.to || [0, 1];
    const tSend = T(s, S.sendCue, .2, idx), tOk = T(s, S.okCue, .5, idx), tQ = T(s, S.askCue, .75, idx);
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => {
        const fr = sts[from]; if (!fr) return; const h0 = handOf(fr);
        to.forEach((j, n) => { const st = sts[j]; if (!st) return; const hp = headOf(st), tx = hp[0] + (n ? 30 : -30), ty = hp[1] - st.size * .3; const T0 = tSend + n * .25;
          if (t < T0) return; const q = clamp((t - T0) / .9, 0, 1), x = lerp(h0[0], tx, eOut(q)), y = lerp(h0[1] - 60, ty, q) - Math.sin(q * Math.PI) * 280;
          paperGuy(ctx, x, y + Math.sin(t * 3 + n) * 8, t, { w: 150, h: 200, lines: 4, hair: 1, hairLen: 80, comb: 1, tie: 0, mood: 1, warm: 1, tag: "31 DES · 07.00", tagK: .8, wave: t > tOk, squash: q < 1 ? 0 : Math.sin((t - T0 - .9) * 14) * Math.exp(-(t - T0 - .9) * 5) });
          if (q >= 1 && t - T0 - .9 < .8) burstFx(ctx, tx, ty - 120, t - T0 - .9, GOLD, 8, 120);
          // a question mark rises and gets popped
          if (t > tQ - .1 && t < tQ + 1.4){ const k = t - tQ + .1, px = hp[0] + (n ? 150 : -150), py = hp[1] - 40 - k * 40;
            if (k < .7) floatWord(ctx, "?", px, py, 96, 1, eBack(clamp(k / .3, 0, 1)), RED, .1); else burstFx(ctx, px, py, k - .7, RED, 8, 90); } });
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.grup || {}; if (S.sendCue){ add(cueT(s, S.sendCue, .2, i), "whoosh"); add(cueT(s, S.sendCue, .2, i) + .9, "pop"); } if (S.askCue) add(cueT(s, S.askCue, .75, i) + .6, "pop"); });

  // _balas: navy info stage; loop of reply rounds around Si Jawaban, a star fills at each command; "start over" is crossed out
  TT.scene(PX + "balas", "Cerita: panggung info, cincin putaran balasan mengitari Si Jawaban, bintang kecocokan terisi tiap perintah", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.balas || {}, cx = S.x ?? 740, cy = S.y ?? 1180, Rr = S.r ?? 250;
    const cues = (S.cmds || []).map(k => T(s, k.cue, .6, idx));
    base(ctx, s, t, {
      mid: (ctx2, c, sts, R) => {
        const done = cues.filter(T0 => t > T0 + .5).length;
        // ring (back half)
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .32); ctx.beginPath(); ctx.arc(0, 0, Rr, Math.PI, TAU); ctx.strokeStyle = hexA(ORANGE, .55); ctx.lineWidth = 26; ctx.stroke(); ctx.restore();
        const st = { h: 360 - 30 * Math.min(1, done), lines: Math.max(4, 9 - done * 2), hair: 1, hairLen: lerp(300, 110, Math.min(1, done)), comb: done >= 2 ? 1 : 0, tie: done >= 2 ? 0 : 1, mood: done >= 2 ? 1 : (done ? 0 : -1), warm: done >= 2 ? 1 : 0, tag: done >= 3 ? "+ contoh" : null, tagK: done >= 3 ? 1 : 0 };
        const A = paperGuy(ctx, cx, cy + 60, t, Object.assign(st, { wave: done >= 3 }));
        // stars of fit
        for (let i = 0; i < 3; i++){ const on = i < done, x = cx - 110 + i * 110, y = A.top - 90 - (on ? Math.sin(t * 4 + i) * 6 : 0);
          ctx.save(); ctx.translate(x, y); ctx.scale(on ? 1 + .25 * Math.exp(-(t - cues[i] - .5) * 4) : .85, on ? 1 + .25 * Math.exp(-(t - cues[i] - .5) * 4) : .85); ctx.beginPath();
          for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 18 : 42; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = on ? GOLD : hexA("#FFFFFF", .25); ctx.fill(); ol(ctx, 5); ctx.restore(); }
        // ring (front half) + travelling token + station chips
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .32); ctx.beginPath(); ctx.arc(0, 0, Rr, 0, Math.PI); ctx.strokeStyle = ORANGE; ctx.lineWidth = 26; ctx.stroke(); ctx.restore();
        const ang = t * 2.2; const tk = [cx + Math.cos(ang) * Rr, cy + Math.sin(ang) * Rr * .32]; glowAt(ctx, tk[0], tk[1], 70, GOLD, .7); ctx.beginPath(); ctx.arc(tk[0], tk[1], 18, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
        (S.cmds || []).forEach((k, i) => { const T0 = cues[i]; if (t < T0) return; const a = [Math.PI * .85, Math.PI * .5, Math.PI * .15][i] ?? 0, x = cx + [-210, 0, 175][i], y = cy + Math.sin(a) * Rr * .32 - 10 + [0, 30, 0][i];
          popChip(ctx, k.text, x, y, t - T0, i === done - 1 ? ORANGE : NAVY, "#FFFFFF", 30, -.03, true); });
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.balas || {}).cmds || []).forEach(k => { add(cueT(s, k.cue, .6, i), "pop"); add(cueT(s, k.cue, .6, i) + .5, "chime"); }); });

  /* ================= JS48: satu perbaikan per minggu (klinik hewan, papan 52 jejak kaki) ================= */
  function dog(ctx, x, y, s, t, o){ o = o || {}; const f = o.face || 1, run = o.run || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
    const bob = run ? Math.abs(Math.sin(t * 12)) * 12 : Math.sin(t * 2) * 2, col = o.col || "#C98A4E", dk = "#8E5A2E";
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(0, 0, 110, 16, 0, 0, TAU); ctx.fill();
    // tail
    ctx.save(); ctx.translate(-80, -90 - bob); ctx.rotate(-.8 + Math.sin(t * (o.wag ? 16 : 3)) * (o.wag ? .5 : .15)); rr(ctx, -10, -80, 20, 80, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (run){ ctx.beginPath(); ctx.ellipse(0, -80 - bob, 110, 50, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
      [[-70, 1], [-40, -1], [50, 1], [80, -1]].forEach(([lx, d]) => { ctx.save(); ctx.translate(lx, -50 - bob); ctx.rotate(Math.sin(t * 12) * .7 * d); rr(ctx, -10, 0, 20, 60, 8); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }); }
    else { ctx.beginPath(); ctx.ellipse(-10, -70, 80, 70, -.3, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); rr(ctx, 30, -100, 34, 100, 14); ctx.fill(); ol(ctx, 4); rr(ctx, -70, -20, 70, 24, 12); ctx.fill(); ol(ctx, 4); }
    // head
    const hx = run ? 110 : 50, hy = run ? -130 - bob : -170 + bob; ctx.beginPath(); ctx.arc(hx, hy, 58, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(hx + 52, hy + 18, 34, 24, 0, 0, TAU); ctx.fillStyle = "#E8C49A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(hx + 80, hy + 10, 10, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 18, hy - 12, 8, 0, TAU); ctx.fill(); ctx.save(); ctx.translate(hx - 30, hy - 30); ctx.rotate(.4 + Math.sin(t * 5) * .1); ctx.beginPath(); ctx.ellipse(0, 30, 22, 46, 0, 0, TAU); ctx.fillStyle = dk; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (o.tongue){ ctx.fillStyle = "#E05A6A"; ctx.beginPath(); ctx.ellipse(hx + 56, hy + 46, 10, 16, 0, 0, TAU); ctx.fill(); ol(ctx, 3); }
    rr(ctx, hx - 50, hy + 40, 60, 16, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); }
  function cat(ctx, x, y, s, t, o){ o = o || {}; const f = o.face || 1, run = o.run || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s); const col = o.col || "#F0A23C";
    ctx.fillStyle = col; ctx.strokeStyle = OUT;
    ctx.save(); ctx.translate(-60, -60); ctx.rotate(run ? -.2 : -1.2 + Math.sin(t * 3) * .2); rr(ctx, -8, -90, 16, 90, 8); ctx.fill(); ol(ctx, 4); ctx.restore();
    if (run){ ctx.beginPath(); ctx.ellipse(0, -60, 80, 34, 0, 0, TAU); ctx.fill(); ol(ctx, 5); [[-50, 1], [40, -1]].forEach(([lx, d]) => { ctx.save(); ctx.translate(lx, -40); ctx.rotate(Math.sin(t * 16) * .9 * d); rr(ctx, -8, 0, 16, 46, 7); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }); }
    else { ctx.beginPath(); ctx.ellipse(0, -60, 55, 62, 0, 0, TAU); ctx.fill(); ol(ctx, 5); }
    const hx = run ? 80 : 10, hy = run ? -90 : -140; ctx.beginPath(); ctx.arc(hx, hy, 44, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(hx + d * 16, hy - 34); ctx.lineTo(hx + d * 38, hy - 70); ctx.lineTo(hx + d * 42, hy - 22); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); });
    ctx.fillStyle = OUT; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(hx + d * 16 + 6, hy - 4, 6, o.scared ? 11 : 8, 0, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(hx + 6 + d * 12, hy + 14); ctx.lineTo(hx + 6 + d * 52, hy + 10); ctx.stroke(); });
    ctx.restore(); }
  function carrierBox(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(ctx, -110, -150, 220, 150, 24); ctx.fillStyle = "#7EC8F0"; ctx.fill(); ol(ctx, 5); rr(ctx, -40, -186, 80, 40, 16); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = "#5B7DB1"; ctx.lineWidth = 7; ctx.stroke();
    ctx.save(); ctx.translate(110, -130); ctx.scale(Math.cos(o.open || 0), 1); rr(ctx, -14, 0, 28, 110, 6); ctx.fillStyle = "#DDE3E8"; ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.fillStyle = "#2C2433"; rr(ctx, 40, -130, 66, 110, 10); ctx.fill(); if (o.cat){ ctx.fillStyle = "#F0A23C"; ctx.beginPath(); ctx.arc(72, -80, 26, 0, TAU); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(64, -84, 4, 0, TAU); ctx.arc(80, -84, 4, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = "#BFC6CC"; ctx.lineWidth = 5; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(48 + k * 16, -126); ctx.lineTo(48 + k * 16, -24); ctx.stroke(); } ctx.restore(); }
  // board of 52 paw slots (13 x 4) in screen or world coords; n stamped, gold > 0 makes them shine
  function pawBoard(ctx, x, y, w, n, t, o){ o = o || {}; const cols = 13, rows = 4, cw = w / cols, h = cw * rows + 70, sc = o.k ?? 1; if (sc <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); rr(ctx, -w / 2 - 20, -50, w + 40, h + 20, 18); ctx.fillStyle = o.bg || PAPER; ctx.fill(); ol(ctx, 6);
    textC(ctx, o.title || "52 MINGGU · 52 PERBAIKAN", 0, -8, 32, ORANGE, 900, w - 20);
    for (let i = 0; i < cols * rows; i++){ const c = i % cols, r = Math.floor(i / cols), px = -w / 2 + cw * (c + .5), py = 34 + cw * (r + .5);
      if (i < n){ const pop = o.popAt && o.popAt[i] != null ? eBack(clamp((t - o.popAt[i]) / .3, 0, 1)) : 1; if (pop <= 0) continue; ctx.save(); ctx.translate(px, py); ctx.scale(pop, pop);
        if (o.gold){ glowAt(ctx, 0, 0, cw * .8, GOLD, .35 * o.gold * (.6 + .4 * Math.sin(t * 5 + i))); } pawShape(ctx, 0, 0, cw * .36, o.gold ? lerpCol("#C2691F", "#E9A21E", o.gold) : ORANGE); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(px, py, cw * .3, 0, TAU); ctx.strokeStyle = hexA(BROWN, .25); ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]); } }
    ctx.restore(); }
  function clinicBG(ctx, t, o){
    ctx.fillStyle = "#F3E6D3"; ctx.fillRect(-2600, -1400, 6400, GY + 1400); ctx.fillStyle = "#BFE0D6"; ctx.fillRect(-2600, GY - 700, 6400, 520);
    for (let i = 0; i < 40; i++){ const x = -600 + (i % 10) * 240 + (Math.floor(i / 10) % 2) * 120, y = 150 + Math.floor(i / 10) * 180; ctx.save(); ctx.globalAlpha = .12; pawShape(ctx, x, y, 34, ORANGE); ctx.restore(); }
    ctx.fillStyle = "#2F6F73"; ctx.fillRect(-2600, GY - 710, 6400, 22);
    if (o.door !== false){ const dx = o.doorX ?? -40; rr(ctx, dx - 150, GY - 800, 300, 620, 12); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 110, GY - 760, 220, 280, 10); ctx.fillStyle = "#BFE3EA"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(dx + 110, GY - 470, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); }
    if (o.counter){ const cx = o.counter; rr(ctx, cx - 220, GY - 520, 440, 340, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); rr(ctx, cx - 240, GY - 540, 480, 36, 10); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 5);
      pawShape(ctx, cx, GY - 360, 50, hexA(ORANGE, .7)); }
    // floor
    const fy = GY - 190; ctx.fillStyle = "#DCCBB2"; ctx.fillRect(-2600, fy, 6400, 1200); ctx.strokeStyle = hexA(OUT, .1); ctx.lineWidth = 3; for (let x = -2600; x < 3800; x += 120){ ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x - 60, fy + 900); ctx.stroke(); }
    ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-2600, fy, 6400, 10); }
  BG.klinik = clinicBG;
  function sticky(ctx, x, y, w, txt, col, rot, k){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); rr(ctx, -w / 2, -w / 2, w, w, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = hexA("#FFFFFF", .4); ctx.fillRect(-w / 2, -w / 2, w, 14); textC(ctx, txt, 0, 10, 26, BROWN, 900, w - 16); ctx.restore(); }
  function gremlin(ctx, x, y, s, t, col, txt, o){ o = o || {}; if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const b = Math.abs(Math.sin(t * 7 + x)) * 16;
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 0, 70, 12, 0, 0, TAU); ctx.fill(); ctx.translate(0, -b);
    ctx.beginPath(); for (let k = 0; k <= 24; k++){ const a = k / 24 * TAU, r = 70 + (k % 2 ? 8 : 0); ctx.lineTo(Math.cos(a) * r, -70 + Math.sin(a) * r * .9); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    [-1, 1].forEach(d => { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(d * 24, -82, 17, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(d * 24 + 3, -78, 8, 0, TAU); ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(d * 8, -108); ctx.lineTo(d * 40, -116 + (o.angry ? 12 : 0)); ctx.stroke(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-18, -44); ctx.lineTo(-6, -52); ctx.lineTo(6, -44); ctx.lineTo(18, -52); ctx.stroke();
    if (o.bang) floatWord(ctx, o.bang, 0, -180 - Math.sin(t * 8) * 6, 60, 1, 1, RED, .1);
    ctx.restore(); if (txt) popChip(ctx, txt, x, y + 44 + (o.ly || 0), 1, CREAM, BROWN, 28, 0, true); }

  // _klinik: Friday at the vet clinic, leash tangles Bima's legs, cat bolts, queue tickets clash, sticky notes pile up, RENOVASI poster gathers cobwebs
  TT.scene(PX + "klinik", "Cerita: ruang tunggu klinik hewan kacau (tali anjing melilit, kucing kabur, karcis antre bentrok, catatan menumpuk, poster RENOVASI berdebu)", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.klinik || {}, on = S.on ?? 0;
    const tTangle = T(s, S.tangleCue, .3, idx), tCat = T(s, S.catCue, .4, idx), tQ = T(s, S.queueCue, .5, idx), tList = T(s, S.listCue, .65, idx), tReno = T(s, S.renoCue, .85, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => {
        // sticky notes of wishes
        const notes = ["Tali", "Antrean", "Label", "Lampu", "Timbangan", "Kursi", "Jadwal", "Rak"];
        notes.forEach((n, i) => { const k = eBack(clamp((t - tList - i * .14) / .3, 0, 1)) * (t > tList + i * .14 ? 1 : 0); sticky(ctx, 110 + (i % 4) * 140 + rnd(i) * 20, 640 + Math.floor(i / 4) * 150 + rnd(i + 4) * 20, 128, n, ["#F6D36B", "#F4A85C", "#9ED9B8", "#F7B2C0"][i % 4], (rnd(i + 2) - .5) * .3, k); });
        // RENOVASI poster with cobweb & dust
        const px = S.posterX ?? 830, py = 700; rr(ctx, px - 150, py - 110, 300, 230, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
        textC(ctx, "RENOVASI", px, py - 50, 44, RED, 900, 270); textC(ctx, "BESAR", px, py + 2, 44, RED, 900, 270); textC(ctx, "segera...", px, py + 60, 30, BROWN, 800, 260);
        const cw = eq(t, tReno, 1.2); if (cw > 0){ ctx.save(); ctx.globalAlpha = cw; ctx.strokeStyle = "#9A9A9A"; ctx.lineWidth = 2.5; const ox = px + 150, oy = py - 110;
          for (let k = 0; k < 6; k++){ const a = Math.PI / 2 + k * (Math.PI / 2) / 5; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(a) * 130, oy + Math.sin(a) * 130); ctx.stroke(); }
          for (let r = 30; r <= 120; r += 30){ ctx.beginPath(); for (let k = 0; k < 6; k++){ const a = Math.PI / 2 + k * (Math.PI / 2) / 5; ctx.lineTo(ox + Math.cos(a) * r, oy + Math.sin(a) * r); } ctx.stroke(); }
          ctx.fillStyle = hexA("#8C7A66", .35); ctx.fillRect(px - 150, py - 110, 300, 230); ctx.restore(); }
        carrierBox(ctx, S.carX ?? 180, GY - 20, 1.35, t, { cat: t < tCat, open: t > tCat ? 1.2 : 0 });
      },
      mid: (ctx2, c, sts, R) => { dog(ctx, S.dogX ?? 800, GY - 10, 1.35, t, { face: -1, wag: t > tTangle, tongue: true }); },
      front: (ctx2, c, sts, R) => { const st = sts[on];
        if (st && t > tTangle){ const k = st.size / 92, q = eq(t, tTangle, .8), legY = st.y - 14 * k, lx0 = st.x;
          ctx.strokeStyle = OUT; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo((S.dogX ?? 800) - 60, GY - 150);
          ctx.quadraticCurveTo(lx0 + 200, legY + 40, lx0 + 60, legY - 10); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.stroke();
          for (let i = 0; i < 3; i++){ const yy = legY - 6 - i * 42 * k / 9; ctx.save(); ctx.globalAlpha *= clamp(q * 3 - i, 0, 1); ctx.beginPath(); ctx.ellipse(lx0, yy, 70, 18, .1 * Math.sin(t * 3 + i), 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 11; ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); } }
        if (t > tCat && t < tCat + 1.6){ const q = (t - tCat) / 1.6, x = lerp(S.carX ?? 180, 1300, q), y = GY - 200 - Math.sin(q * Math.PI) * 560;
          cat(ctx, x, y, 1.1, t, { run: 1, scared: true }); speedLines(ctx, x - 60, y - 60, 1, 1, 5, 160); }
        if (t > tQ && t < tQ + 2.4){ [[-1, 520], [1, 760]].forEach(([d, x0], i) => { const q = eBack(clamp((t - tQ) / .4, 0, 1)), x = x0 + d * -40 * Math.sin(clamp((t - tQ - .4) * 6, 0, Math.PI)), y = 860 + Math.sin(t * 9 + i) * 8;
            ctx.save(); ctx.translate(x, y); ctx.rotate(d * .15); ctx.scale(q, q); rr(ctx, -70, -50, 140, 100, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, "07", 0, 20, 56, ORANGE, 900); ctx.restore(); });
          if (t > tQ + .5 && t < tQ + 1.4) burstFx(ctx, 640, 860, t - tQ - .5, RED, 10, 130); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.klinik || {}; if (S.catCue) add(cueT(s, S.catCue, .4, i), "whoosh"); if (S.queueCue) add(cueT(s, S.queueCue, .5, i) + .5, "pop"); if (S.listCue) for (let k = 0; k < 8; k += 2) add(cueT(s, S.listCue, .65, i) + k * .14, "pop"); });

  // _janji: dusk walk in the park with a recovering dog; Dr Rina proposes one small fix a week, a 52-paw board fills
  TT.scene(PX + "janji", "Cerita: taman senja, dokter hewan & anjing pasien, satu jejak kaki lalu papan 52 jejak terisi", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.janji || {};
    const tOne = T(s, S.oneCue, .3, idx), tBoard = T(s, S.boardCue, .55, idx), tFill = T(s, S.fillCue, .8, idx);
    base(ctx, s, t, {
      mid: (ctx2, c, sts, R) => { const st = sts[S.walker ?? 1]; const dx = S.dogX ?? 980; dog(ctx, dx, GY - 6, .95, t, { face: -1, wag: true, tongue: true });
        if (st){ const h = handOf(st); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.quadraticCurveTo((h[0] + dx) / 2, h[1] + 160, dx - 50, GY - 160); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.stroke(); } },
      over: (ctx2, c, sts, R) => {
        if (t > tOne && t < tBoard + .2){ const q = eBack(clamp((t - tOne) / .35, 0, 1)), a = 1 - clamp((t - tBoard) / .2, 0, 1); ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 400); ctx.scale(q, q);
          glowAt(ctx, 0, 0, 200, GOLD, .5); pawShape(ctx, 0, 0, 110, ORANGE); textC(ctx, "1 perbaikan", 0, 150, 44, "#FFFFFF", 900); ctx.restore(); }
        if (t > tBoard){ const k = eBack(clamp((t - tBoard) / .4, 0, 1)), n = t < tFill ? 1 : Math.min(52, 1 + Math.floor((t - tFill) * 30)), popAt = {};
          for (let i = 1; i < 52; i++) popAt[i] = tFill + i / 30; pawBoard(ctx, 540, 240, 880, n, t, { k, popAt, gold: n >= 52 ? eq(t, tFill + 1.8, .5) : 0 });
          if (n >= 52 && t - tFill - 1.75 < .9) burstFx(ctx, 540, 380, t - tFill - 1.75, GOLD, 14, 300); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.janji || {}; if (S.oneCue) add(cueT(s, S.oneCue, .3, i), "pop"); if (S.boardCue) add(cueT(s, S.boardCue, .55, i), "whoosh"); if (S.fillCue){ const t0 = cueT(s, S.fillCue, .8, i); [0, .4, .8, 1.2].forEach(d => add(t0 + d, "pop")); add(t0 + 1.8, "chime"); } });

  // _cap: clinic corner, week 1 leash hooks by the door, week 2 queue-number machine, week 3 labelled cage shelf; a paw stamp each week
  TT.scene(PX + "cap", "Cerita: klinik, minggu 1 gantungan tali, minggu 2 mesin nomor antre, minggu 3 rak kandang berlabel, tiap minggu satu cap jejak", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.cap || {};
    const W1 = T(s, S.w1Cue, .1, idx), W2 = T(s, S.w2Cue, .4, idx), W3 = T(s, S.w3Cue, .6, idx), WA = T(s, S.allCue, .85, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => {
        // station 1: hooks by the door
        const hx = S.hookX ?? 250, q1 = eq(t, W1 + .6, .5);
        if (q1 < 1){ ctx.save(); ctx.globalAlpha = 1 - q1; for (let i = 0; i < 3; i++){ ctx.strokeStyle = ["#D9483B", "#5B7DB1", "#3E9B5A"][i]; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(hx - 40 + i * 30, GY - 40, 60, 18, i * .5, 0, TAU); ctx.stroke(); } ctx.restore(); }
        if (q1 > 0){ ctx.save(); ctx.translate(hx, 640); ctx.scale(q1, q1); rr(ctx, -130, -20, 260, 40, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
          for (let i = 0; i < 3; i++){ const x = -80 + i * 80, sw = Math.sin(t * 2 + i) * .06; ctx.beginPath(); ctx.arc(x, 30, 12, 0, Math.PI); ctx.strokeStyle = "#BFC6CC"; ctx.lineWidth = 7; ctx.stroke();
            ctx.save(); ctx.translate(x, 40); ctx.rotate(sw); ctx.strokeStyle = ["#D9483B", "#5B7DB1", "#3E9B5A"][i]; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, 180); ctx.moveTo(0, 0); ctx.lineTo(8, 180); ctx.stroke(); ctx.restore(); }
          textC(ctx, "TALI", 0, 12, 26, "#FFFFFF", 900); ctx.restore(); }
        // station 2: queue number machine on a pole
        const qx = S.queueX ?? 580, q2 = eq(t, W2 + .3, .5); if (q2 > 0){ ctx.save(); ctx.translate(qx, GY); ctx.scale(1, q2); rr(ctx, -12, -620, 24, 620, 8); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 4);
          rr(ctx, -110, -860, 220, 250, 20); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); rr(ctx, -80, -830, 160, 80, 10); ctx.fillStyle = "#22252B"; ctx.fill(); ol(ctx, 4);
          const num = 8 + Math.max(0, Math.floor((t - W2 - 1) / 1.2)); textC(ctx, String(num).padStart(2, "0"), 0, -770, 60, "#7CFF9A", 900);
          const tk = Math.sin(t * 2) * 6; rr(ctx, -50, -730 + tk, 100, 90, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "ANTRE", 0, -690 + tk, 22, ORANGE, 900); ctx.restore(); }
        // station 3: cage shelf with labels
        const cx = S.cageX ?? 930, q3 = eq(t, W3 + .5, .5); ctx.save(); ctx.translate(cx, GY);
        for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++){ const x = -190 + k * 190, y = -560 + r * 270; rr(ctx, x, y, 180, 250, 12); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 5);
          ctx.strokeStyle = "#9AA3AB"; ctx.lineWidth = 5; for (let b = 1; b < 6; b++){ ctx.beginPath(); ctx.moveTo(x + b * 30, y + 10); ctx.lineTo(x + b * 30, y + 200); ctx.stroke(); }
          if (q3 > 0){ const lb = ["KUCING", "ANJING", "BURUNG", "RAWAT"][r * 2 + k]; ctx.save(); ctx.translate(x + 90, y + 228); ctx.scale(q3, q3); rr(ctx, -80, -20, 160, 40, 8); ctx.fillStyle = [ORANGE, TEAL, "#5B7DB1", GREEN][r * 2 + k]; ctx.fill(); ol(ctx, 3); textC(ctx, lb, 0, 10, 24, "#FFFFFF", 900, 150); ctx.restore(); } }
        ctx.restore();
      },
      front: (ctx2, c, sts, R) => { [W1 + .6, W2 + .3, W3 + .5].forEach((T0, i) => { if (t > T0 && t < T0 + .9) burstFx(ctx, [S.hookX ?? 250, S.queueX ?? 580, S.cageX ?? 930][i], [700, GY - 760, GY - 420][i], t - T0, GOLD, 10, 160); }); },
      over: (ctx2, c, sts, R) => { const popAt = { 0: W1 + .9, 1: W2 + .6, 2: W3 + .8 }, n = (t > W1 + .9) + (t > W2 + .6) + (t > W3 + .8);
        pawBoard(ctx, 540, 250, 760, n, t, { popAt, gold: eq(t, WA, .5), title: "Minggu " + Math.max(1, n) + " dari 52" }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.cap || {}; [[S.w1Cue, .1, .9], [S.w2Cue, .4, .6], [S.w3Cue, .6, .8]].forEach(([c2, fr, d]) => { if (c2){ add(cueT(s, c2, fr, i) + d, "pop"); add(cueT(s, c2, fr, i) + d - .3, "chime"); } }); });

  // _setahun: a year later at sunset, the clinic front with the full golden 52-paw board, calm owners leave with their pets
  TT.scene(PX + "setahun", "Cerita: setahun kemudian, depan klinik senja, papan 52 jejak emas penuh, pemilik hewan pulang tersenyum", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.setahun || {};
    const tFull = T(s, S.fullCue, .3, idx), tCalm = T(s, S.calmCue, .6, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => {
        // facade
        ctx.fillStyle = "#F3E6D3"; rr(ctx, 40, 360, 1000, GY - 360, 10); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#2F6F73"; ctx.beginPath(); ctx.moveTo(0, 380); ctx.lineTo(1080, 380); ctx.lineTo(1040, 300); ctx.lineTo(40, 300); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        for (let k = 0; k < 12; k++){ ctx.fillStyle = k % 2 ? "#FFFFFF" : ORANGE; ctx.beginPath(); ctx.moveTo(40 + k * 83, 380); ctx.lineTo(123 + k * 83, 380); ctx.lineTo(123 + k * 83, 420); ctx.quadraticCurveTo(82 + k * 83, 460, 40 + k * 83, 420); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
        rr(ctx, 300, 200, 480, 90, 16); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); pawShape(ctx, 350, 248, 30, ORANGE); textC(ctx, "KLINIK HEWAN", 560, 262, 46, BROWN, 900, 380);
        rr(ctx, 410, GY - 760, 260, 580, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); rr(ctx, 440, GY - 730, 200, 520, 8); ctx.fillStyle = "#BFE3EA"; ctx.fill(); ol(ctx, 4);
        glowAt(ctx, 540, GY - 480, 260, "#FFE7B0", .5);
        const n = Math.min(52, 4 + Math.floor(Math.max(0, t - .1) * 30)); pawBoard(ctx, 540, 500, 640, n, t, { gold: eq(t, tFull, .6), bg: "#FFFDF6" });
        if (t > tFull && t < tFull + .9) burstFx(ctx, 540, 600, t - tFull, GOLD, 16, 340);
      },
      over1: (ctx2, c, sts, j, R) => { const a = (s.f.toons || [])[j] || {}; if (!a.pet) return; const st = sts[j], h = handOf(st);
        if (a.pet === "dog"){ const dx = st.x + (st.face || 1) * 190; dog(ctx, dx, GY - 4, .8, t, { face: st.face || 1, wag: true, tongue: true });
          ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.quadraticCurveTo((h[0] + dx) / 2, h[1] + 120, dx + (st.face || 1) * 40, GY - 140); ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.stroke(); }
        if (a.pet === "cat"){ carrierBox(ctx, h[0] - 60 * (st.face || 1), h[1] + 150, .75, t, { cat: true }); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.setahun || {}; [0, .5, 1, 1.5].forEach(d => add(.1 + d, "pop")); if (S.fullCue) add(cueT(s, S.fullCue, .3, i), "chime"); });

  // _ganggu: navy stage, three annoyance gremlins with "!" counters; the most frequent grows, Bima fixes it with a wrench, Friday checked
  TT.scene(PX + "ganggu", "Cerita: panggung info, tiga gremlin gangguan kecil, yang paling sering membesar, dibereskan kunci pas, Jumat dicentang", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.ganggu || {}, G3 = S.items || [];
    const tPick = T(s, S.pickCue, .45, idx), tFix = T(s, S.fixCue, .7, idx), tEnd = T(s, S.endCue, .9, idx);
    base(ctx, s, t, {
      mid: (ctx2, c, sts, R) => { G3.forEach((g, i) => { const big = i === (S.pick ?? 1), app = eBack(clamp((t - .3 - i * .25) / .4, 0, 1)) * (t > .3 + i * .25 ? 1 : 0);
          let sc = app * (big ? 1 + .45 * eq(t, tPick, .5) : 1 - .25 * eq(t, tPick, .5)); const gone = big && t > tFix + .4; if (gone){ if (t - tFix - .4 < .9) burstFx(ctx, g.x, (S.y ?? 1500) - 90, t - tFix - .4, GOLD, 14, 200); sc = 0; }
          gremlin(ctx, g.x, S.y ?? 1500, sc * (g.s || .9), t, g.col, sc > .3 ? g.text : null, { ly: i === 1 ? 62 : 0, angry: big, bang: big && t > tPick ? "!!!" : (t > tPick ? null : "!") }); });
        const st = sts[0]; if (st && t > tFix - .2 && t < tFix + .8){ const h = handOf(st); speedLines(ctx, h[0] + 40, h[1], -1, 1 - Math.abs(t - tFix - .3) * 2, 4, 120); } },
      over: (ctx2, c, sts, R) => { if (t < tEnd) return; const k = t - tEnd, days = ["Sen", "Sel", "Rab", "Kam", "Jum"]; days.forEach((d, i) => { const q = eBack(clamp((k - i * .08) / .3, 0, 1)); if (q <= 0) return;
          ctx.save(); ctx.translate(220 + i * 160, 430); ctx.scale(q, q); rr(ctx, -66, -56, 132, 112, 16); ctx.fillStyle = i === 4 ? ORANGE : CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, d, 0, -8, 36, i === 4 ? "#FFFFFF" : BROWN, 900);
          if (i === 4){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-24, 24); ctx.lineTo(-6, 40); ctx.lineTo(28, 10); ctx.stroke(); } ctx.restore(); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.ganggu || {}; [0, 1, 2].forEach(k => add(.3 + k * .25, "pop")); if (S.pickCue) add(cueT(s, S.pickCue, .45, i), "ping"); if (S.fixCue) add(cueT(s, S.fixCue, .7, i) + .4, "chime"); if (S.endCue) add(cueT(s, S.endCue, .9, i) + .4, "pop"); });

  /* ================= SC48: mulai lebih awal (kelinci koin beranak-pinak = bunga berbunga) ================= */
  // golden coin bunny, origin = feet. o: hop (0..1 amplitude), label, face
  function bunny(ctx, x, y, s, t, o){ o = o || {}; if (s <= 0) return; const f = o.face || 1, ph = (o.ph ?? x * .013), hop = (o.hop ?? 1) * Math.max(0, Math.sin(t * 5 + ph)) * 26;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(0, 0, 60 - hop * .6, 12, 0, 0, TAU); ctx.fill(); ctx.translate(0, -hop);
    const body = "#F7E1A8", dk = "#E2B65A";
    // ears
    [[-14, -.15], [14, .2]].forEach(([ex, r], i) => { ctx.save(); ctx.translate(ex + 22, -118); ctx.rotate(r + Math.sin(t * 3 + ph + i) * .08); ctx.beginPath(); ctx.ellipse(0, -46, 16, 50, 0, 0, TAU); ctx.fillStyle = body; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.ellipse(0, -44, 7, 34, 0, 0, TAU); ctx.fillStyle = "#F4A3A8"; ctx.fill(); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(-6, -50, 58, 50, 0, 0, TAU); ctx.fillStyle = body; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(-60, -56, 16, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(30, -104, 40, 0, TAU); ctx.fillStyle = body; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(44, -110, 6, 0, TAU); ctx.fill(); ctx.fillStyle = "#F08C9E"; ctx.beginPath(); ctx.arc(68, -98, 6, 0, TAU); ctx.fill();
    ctx.fillStyle = hexA("#F08C9E", .5); ctx.beginPath(); ctx.ellipse(42, -88, 10, 6, 0, 0, TAU); ctx.fill();
    // coin belly
    ctx.save(); ctx.scale(f, 1); coin(ctx, -6 * f, -42, 26, 0); ctx.restore();
    ctx.restore();
    if (o.label) popChip(ctx, o.label, x, y + 40, 1, NAVY, "#FFFFFF", 24, 0, true); }
  function hutch(ctx, x, base, w, h, label, t){ const top = base - h;
    ctx.fillStyle = "#A9673A"; rr(ctx, x - w / 2, top, w, h, 10); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#5A3A2A"; rr(ctx, x - w / 2 + 20, top + 20, w - 40, h - 60, 8); ctx.fill();
    ctx.fillStyle = "#8E5A34"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 30, top + 6); ctx.lineTo(x, top - 90); ctx.lineTo(x + w / 2 + 30, top + 6); ctx.closePath(); ctx.fill(); ol(ctx, 6);
    rr(ctx, x - 90, top - 70, 180, 50, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, label, x, top - 33, 32, BROWN, 900, 160);
    ctx.fillStyle = "#6B3B20"; rr(ctx, x - w / 2 + 10, base - 6, 24, 30, 4); ctx.fill(); rr(ctx, x + w / 2 - 34, base - 6, 24, 30, 4); ctx.fill();
    return { x0: x - w / 2 + 20, y0: top + 20, x1: x + w / 2 - 20, y1: base - 40 }; }
  function hutchMesh(ctx, r){ ctx.strokeStyle = hexA("#D7DDE2", .75); ctx.lineWidth = 3; for (let x = r.x0; x <= r.x1; x += 26){ ctx.beginPath(); ctx.moveTo(x, r.y0); ctx.lineTo(x, r.y1); ctx.stroke(); }
    for (let y = r.y0; y <= r.y1; y += 26){ ctx.beginPath(); ctx.moveTo(r.x0, y); ctx.lineTo(r.x1, y); ctx.stroke(); } ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); }
  function cake(ctx, x, y, t, txt){ rr(ctx, x - 150, y - 120, 300, 120, 16); ctx.fillStyle = "#F7B2C0"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 150, y - 130, 300, 34, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.arc(x - 120 + k * 48, y - 100, 12, 0, Math.PI); ctx.fillStyle = "#FFFFFF"; ctx.fill(); }
    textC(ctx, txt, x, y - 40, 50, "#9E2A2A", 900); [-40, 40].forEach((dx, i) => { rr(ctx, x + dx - 8, y - 200, 16, 70, 4); ctx.fillStyle = i ? "#7EC8F0" : GOLD; ctx.fill(); ol(ctx, 3);
      const fl = 1 + .2 * Math.sin(t * 18 + i * 2); ctx.save(); ctx.translate(x + dx, y - 214); ctx.scale(fl, 1 / fl); ctx.beginPath(); ctx.ellipse(0, 0, 10, 18, 0, 0, TAU); ctx.fillStyle = "#FFB347"; ctx.fill(); ctx.restore(); glowAt(ctx, x + dx, y - 214, 60, "#FFD08A", .5); }); }

  // _ultah: office birthday, both turn 25; Dina slips her 500k envelope into a box, Raka laughs "later, at 35"
  TT.scene(PX + "ultah", "Cerita: kantor, kue ulang tahun 25, Dina memasukkan amplop ke kotak INVESTASI, Raka tertawa", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.ultah || {}, top = S.top ?? 1420, bx = S.boxX ?? 690, tDrop = T(s, S.dropCue, .6, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => homeTable(ctx, S.tx ?? 540, top, S.tw ?? 560),
      mid: (ctx2, c, sts, R) => { cake(ctx, S.cakeX ?? 470, top - 6, t, "25");
        // investment box
        ctx.save(); ctx.translate(bx, top - 6); rr(ctx, -80, -110, 160, 110, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); rr(ctx, -40, -116, 80, 14, 6); ctx.fillStyle = OUT; ctx.fill();
        rr(ctx, -70, -70, 140, 36, 6); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 3); textC(ctx, "INVESTASI", 0, -44, 22, GREEN, 900, 130); ctx.restore();
        const st = sts[S.by ?? 0]; if (st && t > tDrop - .1 && t < tDrop + .8){ const h = handOf(st), q = eIn(clamp((t - tDrop) / .6, 0, 1)), x = lerp(h[0], bx, eOut(Math.min(1, q * 1.6))), y = lerp(h[1], top - 120, q) - Math.sin(q * Math.PI) * 120;
          ctx.save(); ctx.translate(x, y); ctx.rotate(q * 1.4); drawItem2(ctx, "envelope2", 0, 0, t, { s: .7 * (1 - q * .5), text: "500 rb" }); ctx.restore(); }
        if (t > tDrop + .55 && t < tDrop + 1.4) burstFx(ctx, bx, top - 130, t - tDrop - .55, GREEN, 10, 120); },
      over1: (ctx2, c, sts, j, R) => { const st = sts[j], hp = headOf(st), k = st.size / 760; // party hat
        ctx.save(); ctx.translate(hp[0] + 20 * (st.face || 1) * k, hp[1] - 175 * k); ctx.rotate(.18 * (st.face || 1)); ctx.beginPath(); ctx.moveTo(-50 * k, 0); ctx.lineTo(50 * k, 0); ctx.lineTo(0, -120 * k); ctx.closePath();
        ctx.fillStyle = j ? "#7EC8F0" : "#F6C343"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -120 * k, 14 * k, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.ultah || {}; if (S.dropCue){ add(cueT(s, S.dropCue, .6, i), "whoosh"); add(cueT(s, S.dropCue, .6, i) + .6, "chime"); } });

  // _kelinci: meadow; one coin bunny = deposit, babies = returns, their babies = returns on returns
  TT.scene(PX + "kelinci", "Cerita: padang rumput, kelinci koin SETORAN beranak (HASIL), anak-anaknya ikut beranak (HASIL DARI HASIL)", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.kelinci || {};
    const t1 = T(s, S.g1Cue, .3, idx), t2 = T(s, S.g2Cue, .55, idx), t3 = T(s, S.g3Cue, .8, idx);
    const g0 = [[620, 1600]], g1 = [[400, 1490], [850, 1500]], g2 = [[300, 1400], [540, 1380], [760, 1390], [980, 1410]];
    base(ctx, s, t, {
      mid: (ctx2, c, sts, R) => {
        const pop = (T0, i) => t < T0 + i * .12 ? 0 : eBack(clamp((t - T0 - i * .12) / .35, 0, 1));
        const g3 = []; for (let i = 0; i < 16; i++) g3.push([260 + rnd(i + 40) * 780, 1330 + rnd(i + 70) * 260]);
        g3.forEach((p, i) => bunny(ctx, p[0], p[1], .62 * pop(t3, i * .4), t, { face: rnd(i) > .5 ? 1 : -1 }));
        g2.forEach((p, i) => { const g = pop(t2, i); bunny(ctx, p[0], p[1], g * (.7 + .25 * eq(t, t3, 1)), t, { face: i % 2 ? -1 : 1 }); if (g > 0 && t - t2 - i * .12 < .8) burstFx(ctx, p[0], p[1] - 60, t - t2 - i * .12, GOLD, 8, 90); });
        g1.forEach((p, i) => { const g = pop(t1, i); bunny(ctx, p[0], p[1], g * (.85 + .35 * eq(t, t2 - .3, 1)), t, { face: i ? -1 : 1 }); if (g > 0 && t - t1 - i * .12 < .8) burstFx(ctx, p[0], p[1] - 80, t - t1 - i * .12, GOLD, 10, 120); });
        g0.forEach(p => bunny(ctx, p[0], p[1], 1.6, t, { hop: .6 }));
        // family lines from parents to children
        const line = (a, b, q) => { if (q <= 0) return; ctx.save(); ctx.globalAlpha *= .6 * q; ctx.setLineDash([10, 10]); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(a[0], a[1] - 90); ctx.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 220, b[0], b[1] - 80); ctx.stroke(); ctx.restore(); };
        g1.forEach((p, i) => line(g0[0], p, pop(t1, i))); g2.forEach((p, i) => line(g1[i < 2 ? 0 : 1], p, pop(t2, i)));
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.kelinci || {}; [[S.g1Cue, .3, 2], [S.g2Cue, .55, 4], [S.g3Cue, .8, 5]].forEach(([c2, fr, n]) => { if (c2) for (let k = 0; k < n; k++) add(cueT(s, c2, fr, i) + k * .12, "pop"); }); });

  // _kandang: ten years later on the hills; Dina's hutch is crowded with coin bunnies, Raka puts in his very first one
  TT.scene(PX + "kandang", "Cerita: bukit, sepuluh tahun kemudian, kandang Dina penuh kelinci koin, kandang Raka baru berisi satu", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.kandang || {}, base0 = GY - 20, hw = 380, hh = 360;
    const tIn = T(s, S.inCue, .3, idx), tFull = T(s, S.fullCue, .65, idx), tOne = T(s, S.oneCue, .9, idx);
    let rA = null, rB = null;
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => {
        rA = hutch(ctx, S.ax ?? 290, base0, hw, hh, "DINA", t); rB = hutch(ctx, S.bx ?? 790, base0, hw, hh, "RAKA", t);
        const n = Math.round(7 + 7 * eq(t, tFull, 1.2));
        for (let i = 0; i < n; i++){ const x = rA.x0 + 40 + rnd(i + 3) * (rA.x1 - rA.x0 - 80), y = rA.y1 - rnd(i + 9) * 140; ctx.save(); ctx.beginPath(); ctx.rect(rA.x0, rA.y0, rA.x1 - rA.x0, rA.y1 - rA.y0); ctx.clip(); bunny(ctx, x, y, .6, t, { face: rnd(i) > .5 ? 1 : -1 }); ctx.restore(); }
        hutchMesh(ctx, rA); hutchMesh(ctx, rB);
        // overflow: bunnies on the roof and peeking out
        const ov = eq(t, tFull, .8); if (ov > 0){ [[-120, -40], [-20, -95], [90, -50]].forEach(([dx, dy], i) => bunny(ctx, (S.ax ?? 290) + dx, base0 - hh + dy + 30, .6 * eBack(clamp((t - tFull - i * .15) / .35, 0, 1)), t, { face: i % 2 ? -1 : 1 }));
          if (t - tFull < .9) burstFx(ctx, S.ax ?? 290, base0 - hh - 60, t - tFull, GOLD, 12, 200); }
        // Raka's single bunny dropped in
        if (t > tIn){ const q = clamp((t - tIn) / .6, 0, 1), x = rB.x0 + 150, y = lerp(rB.y0 - 220, rB.y1, eIn(q)); ctx.save(); ctx.beginPath(); ctx.rect(rB.x0, rB.y0 - 300, rB.x1 - rB.x0, rB.y1 - rB.y0 + 300); ctx.clip();
          bunny(ctx, x + Math.sin(t * .8) * 40 * (q >= 1 ? 1 : 0), y, .62, t, { hop: q >= 1 ? 1 : 0, face: Math.cos(t * .8) > 0 ? 1 : -1 }); ctx.restore(); hutchMesh(ctx, rB); }
        if (t > tOne){ const p = [(S.bx ?? 790) + 40, rB.y0 + 30]; floatWord(ctx, "1", p[0] + 120, p[1] - 10, 90, 1, eBack(clamp((t - tOne) / .35, 0, 1)), RED, .1); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.kandang || {}; if (S.inCue) add(cueT(s, S.inCue, .3, i) + .6, "pop"); if (S.fullCue){ const t0 = cueT(s, S.fullCue, .65, i); [0, .15, .3].forEach(d => add(t0 + d, "pop")); } if (S.oneCue) add(cueT(s, S.oneCue, .9, i), "ping"); });

  // _hitung: navy stage, Dina and Raka at 55; two bars grow (≈500 jt vs ≈230 jt), coin bunnies pile on top
  TT.scene(PX + "hitung", "Cerita: panggung info, umur 55, dua batang naik (±500 jt vs ±230 jt) dengan tumpukan kelinci koin di puncaknya", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.hitung || {}, by = S.base ?? 1560, bars = S.bars || [];
    base(ctx, s, t, {
      mid: (ctx2, c, sts, R) => { bars.forEach((b, i) => { const T0 = T(s, b.cue, .3 + i * .2, idx), q = eq(t, T0, 1.6), h = b.h * q, x = b.x, w = 160;
          rr(ctx, x - w / 2, by - h, w, h + 4, 14); ctx.fillStyle = b.col; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .25); rr(ctx, x - w / 2 + 14, by - h + 12, 26, Math.max(0, h - 24), 10); ctx.fill();
          if (q > 0){ const n = Math.round(b.n * q); for (let k = 0; k < n; k++) bunny(ctx, x - 50 + (k % 3) * 50 + (Math.floor(k / 3) % 2) * 25, by - h - Math.floor(k / 3) * 34, .34, t, { hop: .3, face: k % 2 ? 1 : -1 });
            const val = Math.round(b.v * q); popChip(ctx, "± Rp" + val + " jt", x, by - h - Math.ceil(b.n / 3) * 34 - 110, t - T0, b.tag || NAVY, "#FFFFFF", 46, -.03, true);
            textC(ctx, b.name, x, by - 26, 34, "#FFFFFF", 900, w - 10); } }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.hitung || {}).bars || []).forEach((b, j) => { add(cueT(s, b.cue, .3 + j * .2, i), "whoosh"); add(cueT(s, b.cue, .3 + j * .2, i) + 1.6, "pop"); }); });

  // _putar: rewind (VHS) back to 25; young Raka at home puts a small coin bunny into a mini hutch, monthly tiles
  TT.scene(PX + "putar", "Cerita: putar balik ke umur 25 (efek mundur), rumah malam, kelinci kecil 100 rb masuk kandang mini tiap gajian", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.putar || {}, hx = S.hx ?? 790, top = S.top ?? 1330, tIn = T(s, S.inCue, .3, idx), tMon = T(s, S.monCue, .5, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { // cabinet + mini hutch
        rr(ctx, hx - 200, top, 400, GY - top, 10); ctx.fillStyle = "#5A321C"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#3E2213"; ctx.lineWidth = 5; ctx.strokeRect(hx - 180, top + 30, 170, GY - top - 60); ctx.strokeRect(hx + 10, top + 30, 170, GY - top - 60); },
      mid: (ctx2, c, sts, R) => { const r = hutch(ctx, hx, top, 300, 230, "MULAI", t); const n = 1 + (t > tMon ? Math.min(5, Math.floor((t - tMon) / .45)) : 0);
        if (t > tIn) for (let i = 0; i < n; i++){ const q = i === 0 ? clamp((t - tIn - .3) / .5, 0, 1) : 1; ctx.save(); ctx.beginPath(); ctx.rect(r.x0, r.y0 - 300, r.x1 - r.x0, r.y1 - r.y0 + 300); ctx.clip();
          bunny(ctx, r.x0 + 50 + i * 40, lerp(r.y0 - 160, r.y1, eIn(q)), .34, t, { face: i % 2 ? -1 : 1, hop: q >= 1 ? 1 : 0 }); ctx.restore(); }
        hutchMesh(ctx, r); },
      over: (ctx2, c, sts, R) => {
        if (t < 1.3){ const a = 1 - clamp((t - .9) / .4, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = hexA("#13223D", .35); ctx.fillRect(0, 0, 1080, 1920);
          for (let i = 0; i < 14; i++){ const y = ((i * 140 + t * 1600) % 1920); ctx.fillStyle = hexA("#FFFFFF", .18); ctx.fillRect(0, y, 1080, 10 + (i % 3) * 6); }
          ctx.translate(540, 760); [0, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(-10 - k * 90, 0); ctx.lineTo(70 - k * 90, -60); ctx.lineTo(70 - k * 90, 60); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); });
          textC(ctx, "KEMBALI KE UMUR 25", 0, 140, 56, "#FFFFFF", 900); ctx.restore(); }
        if (t > tMon){ const M = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]; M.forEach((m, i) => { const q = eBack(clamp((t - tMon - i * .45) / .3, 0, 1)); if (q <= 0) return; ctx.save(); ctx.translate(170 + i * 148, 470); ctx.scale(q, q);
            rr(ctx, -62, -62, 124, 124, 16); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, m, 0, -18, 30, BROWN, 900); bunny(ctx, 0, 52, .3, t, { hop: 0 }); ctx.restore(); }); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); add(.1, "whoosh"); const S = f.putar || {}; if (S.inCue) add(cueT(s, S.inCue, .3, i) + .7, "pop"); if (S.monCue) for (let k = 0; k < 6; k++) add(cueT(s, S.monCue, .5, i) + k * .45, "pop"); });

  /* ================= MS48: lelah itu berbahaya (pelabuhan, tes penggaris, bantal di kursi sopir) ================= */
  function container(ctx, x, y, w, h, col, label){ rr(ctx, x, y, w, h, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4;
    for (let k = x + 24; k < x + w - 10; k += 26){ ctx.beginPath(); ctx.moveTo(k, y + 10); ctx.lineTo(k, y + h - 10); ctx.stroke(); } if (label) textC(ctx, label, x + w / 2, y + h / 2 + 12, 34, hexA("#FFFFFF", .8), 900, w - 30); }
  function portBG(ctx, t, o){
    const fy = GY - 190;
    // sea strip with reflections
    ctx.fillStyle = "#1B2A4A"; ctx.fillRect(-2600, fy - 120, 6400, 130); for (let i = 0; i < 30; i++){ const x = ((i * 157 + t * 30) % 2400) - 700; ctx.fillStyle = hexA("#F4C27A", .35); ctx.fillRect(x, fy - 100 + (i % 5) * 20, 60, 4); }
    // ship far
    ctx.fillStyle = "#2C3550"; ctx.beginPath(); ctx.moveTo(620, fy - 120); ctx.lineTo(1300, fy - 120); ctx.lineTo(1250, fy - 60); ctx.lineTo(660, fy - 60); ctx.closePath(); ctx.fill();
    // gantry crane
    const cx = o.craneX ?? 760; ctx.strokeStyle = "#E0A030"; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(cx - 160, fy); ctx.lineTo(cx - 160, 260); ctx.moveTo(cx + 160, fy); ctx.lineTo(cx + 160, 260); ctx.stroke();
    ctx.lineWidth = 10; for (let y = 320; y < fy; y += 120){ ctx.beginPath(); ctx.moveTo(cx - 160, y); ctx.lineTo(cx + 160, y + 120); ctx.moveTo(cx + 160, y); ctx.lineTo(cx - 160, y + 120); ctx.stroke(); }
    rr(ctx, cx - 520, 220, 900, 50, 8); ctx.fillStyle = "#E0A030"; ctx.fill(); ol(ctx, 5);
    const tr = cx - 360 + (Math.sin(t * .5) * .5 + .5) * 500; rr(ctx, tr - 40, 270, 80, 50, 8); ctx.fillStyle = "#C98A1B"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = "#BFC6CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tr, 320); ctx.lineTo(tr, 600); ctx.stroke(); container(ctx, tr - 110, 600, 220, 110, "#5B7DB1");
    ctx.fillStyle = Math.sin(t * 4) > 0 ? "#FF4A3A" : "#5A2A22"; ctx.beginPath(); ctx.arc(cx + 370, 210, 14, 0, TAU); ctx.fill(); if (Math.sin(t * 4) > 0) glowAt(ctx, cx + 370, 210, 80, "#FF4A3A", .6);
    // container stacks
    const cols = ["#D9483B", "#2F6F73", "#E8A55B", "#5B7DB1", "#7FA563", "#9E2A2A"]; [[-420, 4], [-180, 3], [600, 2], [860, 3], [1300, 4]].forEach(([x, n], k) => { for (let r = 0; r < n; r++) container(ctx, x, fy - 140 * (r + 1), 230, 136, cols[(k * 2 + r) % 6]); });
    // lamp posts
    [80, 1000].forEach((x, i) => { ctx.fillStyle = "#3B3530"; ctx.fillRect(x - 8, fy - 620, 16, 620); rr(ctx, x - 40, fy - 640, 80, 26, 8); ctx.fill(); glowAt(ctx, x, fy - 600, 340, "#FFD08A", .35 + .05 * Math.sin(t * 7 + i)); });
    // concrete quay
    ctx.fillStyle = "#4B4650"; ctx.fillRect(-2600, fy, 6400, 1200); ctx.fillStyle = "#F6C343"; for (let x = -2600; x < 3800; x += 200) ctx.fillRect(x, fy + 40, 110, 12);
    ctx.fillStyle = hexA("#000000", .25); ctx.fillRect(-2600, fy, 6400, 10); }
  BG.pelabuhan = portBG;
  // side-view car, facing right; origin = road level under the wheels; split into back (interior) and front (body)
  function carBack(ctx, x, gy, s){ ctx.save(); ctx.translate(x, gy); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-250, -250); ctx.lineTo(-180, -440); ctx.lineTo(120, -440); ctx.lineTo(240, -250); ctx.closePath(); ctx.fillStyle = "#2C2433"; ctx.fill();
    rr(ctx, -140, -420, 70, 200, 20); ctx.fillStyle = "#6B4329"; ctx.fill(); ctx.restore(); }
  function carFront(ctx, x, gy, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, gy); ctx.scale(s, s); const col = o.col || "#2F6F73", spin = (o.spin || 0);
    // cabin frame
    ctx.beginPath(); ctx.moveTo(-250, -250); ctx.lineTo(-180, -440); ctx.lineTo(120, -440); ctx.lineTo(240, -250); ctx.lineTo(214, -250); ctx.lineTo(106, -416); ctx.lineTo(-166, -416); ctx.lineTo(-222, -250); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    rr(ctx, -10, -430, 22, 180, 4); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = hexA("#BFE9FF", .12); ctx.beginPath(); ctx.moveTo(14, -416); ctx.lineTo(106, -416); ctx.lineTo(214, -250); ctx.lineTo(14, -250); ctx.closePath(); ctx.fill();
    // steering wheel
    ctx.save(); ctx.translate(150, -300); ctx.rotate(-.5 + (o.steer || 0)); ctx.beginPath(); ctx.ellipse(0, 0, 18, 52, 0, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.stroke(); ctx.strokeStyle = "#3B3530"; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
    // lower body
    rr(ctx, -340, -260, 690, 190, 46); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-10, -250); ctx.lineTo(-10, -90); ctx.stroke();
    rr(ctx, 60, -210, 50, 14, 6); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ctx.fillStyle = "#FFE9B8"; rr(ctx, 318, -220, 30, 40, 10); ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#D9483B"; rr(ctx, -344, -220, 22, 40, 8); ctx.fill(); ol(ctx, 3);
    if (o.lights) { ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = lg(ctx, 340, 0, 900, 0, [[0, "rgba(255,240,190,.8)"], [1, "rgba(255,240,190,0)"]]); ctx.beginPath(); ctx.moveTo(340, -210); ctx.lineTo(900, -320); ctx.lineTo(900, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    [-210, 210].forEach(dx => { ctx.save(); ctx.translate(dx, -62); ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); ctx.fillStyle = "#22252B"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4);
      ctx.rotate(spin); ctx.strokeStyle = OUT; ctx.lineWidth = 5; for (let k = 0; k < 3; k++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, 0); ctx.stroke(); } ctx.restore(); });
    ctx.restore(); }
  function lg(ctx, x0, y0, x1, y1, stops){ const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c2]) => g.addColorStop(o, c2)); return g; }
  // scrolling road + roadside posts; speed px/s, lane offset dy (drift)
  function roadScroll(ctx, t, o){ const y0 = o.y ?? 1460, sp = o.speed ?? 700, dist = o.dist != null ? o.dist : t * sp, night = o.night;
    ctx.fillStyle = night ? "#2E2A30" : "#6E655E"; ctx.fillRect(-2600, y0, 6400, 900); ctx.fillStyle = night ? "#4A3A48" : "#B99F82"; ctx.fillRect(-2600, y0 - 24, 6400, 24);
    ctx.fillStyle = "#F2E6D0"; for (let x = -1200 - (dist % 300); x < 2400; x += 300) ctx.fillRect(x, y0 + 150 + (o.drift || 0), 160, 14);
    ctx.fillStyle = hexA("#F2E6D0", .8); ctx.fillRect(-2600, y0 + 20, 6400, 8);
    for (let x = -1200 - ((dist * .9) % 520); x < 2400; x += 520){ ctx.fillStyle = "#3B3530"; ctx.fillRect(x, y0 - 520, 14, 500); rr(ctx, x - 6, y0 - 540, 70, 20, 6); ctx.fill(); if (night) glowAt(ctx, x + 50, y0 - 520, 200, "#FFD08A", .45); } }

  // _pelabuhan: 2 AM at the port; Fajar ends a double shift, spins the car keys, then a giant yawn
  TT.scene(PX + "pelabuhan", "Cerita: pelabuhan jam 2 pagi (peti kemas, derek, laut), Fajar selesai dua shift, putar kunci mobil, menguap raksasa", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.pelabuhan || {}, tY = T(s, S.yawnCue, .8, idx);
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => { const st = sts[0]; if (!st || t < tY) return; const hp = headOf(st), k = t - tY, a = clamp(1 - (k - 1.8) / .5, 0, 1);
        ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 10; i++){ const ang = -Math.PI / 2 + (i - 4.5) * .3, r0 = st.size * .3 + Math.sin(k * 10 + i) * 8; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(hp[0] + Math.cos(ang) * r0, hp[1] + Math.sin(ang) * r0); ctx.lineTo(hp[0] + Math.cos(ang) * (r0 + 50), hp[1] + Math.sin(ang) * (r0 + 50)); ctx.stroke(); } ctx.restore(); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.pelabuhan || {}; if (S.yawnCue) add(cueT(s, S.yawnCue, .8, i), "whoosh"); });

  // _penggaris: safety post; Bu Sri drops a ruler between Fajar's fingers, he grabs too late, it clatters on the floor
  TT.scene(PX + "penggaris", "Cerita: pos K3, tes tangkap penggaris, Fajar terlambat menutup tangan, penggaris jatuh berdenting", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.penggaris || {}, tDrop = T(s, S.dropCue, .3, idx), rx = S.x ?? 610, top0 = S.top ?? 1010, L = 300;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { // safety poster on the wall
        rr(ctx, 760, 360, 260, 320, 12); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(890, 400); ctx.lineTo(960, 520); ctx.lineTo(820, 520); ctx.closePath(); ctx.fillStyle = "#22252B"; ctx.fill();
        textC(ctx, "!", 890, 508, 80, "#F6C343", 900); textC(ctx, "UTAMAKAN", 890, 590, 34, "#22252B", 900, 230); textC(ctx, "KESELAMATAN", 890, 636, 30, "#22252B", 900, 230); },
      front: (ctx2, c, sts, R) => {
        let y = top0 + L / 2, rot = 0; if (t > tDrop){ const k = t - tDrop, fall = 1900 * k * k * .5, floorY = GY - 24;
          if (top0 + L / 2 + fall < floorY - L / 2){ y = top0 + L / 2 + fall; } else { const k2 = Math.max(0, k - Math.sqrt(2 * (floorY - L / 2 - top0 - L / 2) / 1900)); rot = Math.min(Math.PI / 2, k2 * 9); y = floorY - lerp(L / 2, 22, rot / (Math.PI / 2)) - Math.abs(Math.sin(k2 * 14)) * 40 * Math.exp(-k2 * 5); } }
        ctx.save(); ctx.translate(rx, y); ctx.rotate(rot); rulerShape(ctx, L); ctx.restore();
        if (t > tDrop) { const k = t - tDrop; if (k < .45) speedLines(ctx, rx, y - L / 2 - 40, 0, 1, 0); for (let i = 0; i < 3; i++){ ctx.save(); ctx.globalAlpha = clamp(1 - k * 3, 0, 1) * .7; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(rx - 30 + i * 30, y - L / 2 - 20 - i * 10); ctx.lineTo(rx - 30 + i * 30, y - L / 2 - 90 - i * 10); ctx.stroke(); ctx.restore(); } }
        const tHit = tDrop + Math.sqrt(2 * (GY - 24 - L - top0) / 1900); if (t > tHit && t < tHit + .9) burstFx(ctx, rx, GY - 30, t - tHit, "#FFFFFF", 10, 140);
        // fingers of the late grab: a "late" mark
        if (t > tDrop + .5 && t < tDrop + 2.2){ const st = sts[0]; if (st){ const h = handOf(st); floatWord(ctx, "TELAT!", h[0] + 150, h[1] - 60, 64, clamp((tDrop + 2.2 - t) * 2, 0, 1), eBack(clamp((t - tDrop - .5) / .3, 0, 1)), RED, -.1); } }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.penggaris || {}; if (S.dropCue){ const t0 = cueT(s, S.dropCue, .3, i); add(t0, "whoosh"); add(t0 + .55, "pop"); add(t0 + .7, "ping"); } });

  // car set used by _bantal (night) and _tidur (morning shot)
  function carSet(ctx, t, sts, o, phase){ const s2 = o.s ?? 1.35, cx = o.cx ?? 540, gy = o.gy ?? 1590, bob = Math.sin(t * 9) * 3 * (o.moving === false ? 0 : 1);
    if (phase === "back"){ roadScroll(ctx, t, { y: gy - 70, speed: o.speed ?? 700, night: o.night, drift: o.drift || 0, dist: o.dist }); ctx.save(); ctx.translate(0, bob); ctx.translate(cx, gy); ctx.rotate(o.tilt || 0); ctx.translate(-cx, -gy); carBack(ctx, cx, gy, s2); ctx.restore(); }
    else { ctx.save(); ctx.translate(0, bob); ctx.translate(cx, gy); ctx.rotate(o.tilt || 0); ctx.translate(-cx, -gy); carFront(ctx, cx, gy, s2, t, { col: o.col, spin: (o.dist != null ? o.dist : t * (o.speed ?? 700)) / 60, steer: o.steer || 0, lights: o.night }); ctx.restore(); } }

  // _bantal: night drive; Fajar nods off, a pillow takes his place at the wheel, seconds count, the car drifts, horn, he jolts awake
  TT.scene(PX + "bantal", "Cerita: mobil malam tampak samping, Fajar tertidur sesaat, bantal di kemudi, hitungan detik, mobil melenceng, klakson", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.bantal || {}, tS = T(s, S.sleepCue, .3, idx), tW = T(s, S.wakeCue, .85, idx);
    const drift = t > tS ? Math.min(1, (t - tS) / Math.max(1, tW - tS)) * (t < tW + .3 ? 1 : clamp(1 - (t - tW - .3) / .8, 0, 1)) : 0;
    const o = { night: true, drift: drift * 140, tilt: drift * .03, steer: Math.sin(t * 2) * .3 * drift, col: "#C2691F" };
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => carSet(ctx, t, sts, Object.assign({}, S, o), "back"),
      front: (ctx2, c, sts, R) => { carSet(ctx, t, sts, Object.assign({}, S, o), "front");
        const st = sts[0]; if (!st) return; const hp = headOf(st);
        if (t > tS + .3 && t < tW){ const q = eBack(clamp((t - tS - .3) / .4, 0, 1)); ctx.save(); ctx.translate(hp[0] + 120, hp[1] + 60); ctx.rotate(-.2); ctx.scale(q, q);
          rr(ctx, -90, -55, 180, 110, 50); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#9FB9E8", .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(0, -20, 60, 0); ctx.stroke(); ctx.restore();
          zzz(ctx, hp[0] + 40, hp[1] - 120, t, 1, 1.2); }
        if (t > tW && t < tW + .8){ const k = t - tW; ctx.save(); ctx.translate(hp[0] + 120 + k * 600, hp[1] + 60 - k * 500 + k * k * 900); ctx.rotate(k * 8); rr(ctx, -90, -55, 180, 110, 50); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
      },
      over: (ctx2, c, sts, R) => {
        if (t > tS + .3 && t < tW){ const n = Math.min(4, 1 + Math.floor((t - tS - .3) / .9)); popChip(ctx, n + " detik tanpa sadar", 540, 420, Math.min(.5, (t - tS - .3) % .9), NAVY, "#FFFFFF", 48, -.03); }
        if (t > tW - .1 && t < tW + .9){ const k = t - tW + .1; ctx.save(); ctx.globalAlpha = .45 * (1 - k / 1); ctx.fillStyle = RED; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          const g = ctx.createRadialGradient(1080, 900, 0, 1080, 900, 700); g.addColorStop(0, "rgba(255,250,220,.9)"); g.addColorStop(1, "rgba(255,250,220,0)"); ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.bantal || {}; if (S.sleepCue) add(cueT(s, S.sleepCue, .3, i) + .3, "pop"); if (S.wakeCue){ add(cueT(s, S.wakeCue, .85, i) - .1, "ping"); add(cueT(s, S.wakeCue, .85, i), "pop"); } });

  // _tidur: rest room at the port; key handed to Bu Sri, Fajar sleeps on the bench, clock races 02.00 -> 07.00; cut to a fresh morning drive
  TT.scene(PX + "tidur", "Cerita: ruang istirahat, kunci diserahkan, tidur di bangku, jam berputar 02.00→07.00, lalu menyetir segar di pagi hari", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const S = R.f.tidur || {};
        if (S.mode === "drive"){ carSet(ctx, t, sts, Object.assign({ night: false, col: "#2F6F73" }, S, { dist: S.stopCue ? (t < T(s, S.stopCue, .6, idx) ? t * 700 : T(s, S.stopCue, .6, idx) * 700 + 700 * .6 * (1 - Math.exp(-(t - T(s, S.stopCue, .6, idx)) / .6))) : null }), "back"); return; }
        const tS = T(s, S.sleepCue, .4, idx), tM = T(s, S.morningCue, .9, idx);
        // clock on the wall racing
        const cx = S.clockX ?? 860, cy = 560, prog = clamp((t - tS) / Math.max(.5, tM - tS), 0, 1), hrs = 2 + 5 * prog;
        ctx.beginPath(); ctx.arc(cx, cy, 110, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ctx.strokeStyle = BROWN; ctx.lineWidth = 12; ctx.stroke();
        for (let k = 0; k < 12; k++){ const a = k / 12 * TAU; ctx.fillStyle = BROWN; ctx.beginPath(); ctx.arc(cx + Math.sin(a) * 88, cy - Math.cos(a) * 88, 6, 0, TAU); ctx.fill(); }
        const ah = hrs / 12 * TAU, am = (hrs % 1) * TAU; ctx.lineCap = "round"; ctx.strokeStyle = BROWN; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ah) * 55, cy - Math.cos(ah) * 55); ctx.stroke();
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(am) * 80, cy - Math.cos(am) * 80); ctx.stroke();
        const hh = Math.floor(hrs), mm = Math.floor((hrs % 1) * 60); popChip(ctx, String(hh).padStart(2, "0") + "." + String(mm).padStart(2, "0"), cx, cy + 170, 1, NAVY, "#FFFFFF", 40, 0, true);
        // bench
        const bx = S.benchX ?? 330; rr(ctx, bx - 230, GY - 300, 460, 50, 14); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); rr(ctx, bx - 230, GY - 500, 460, 200, 20); ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#3B3530"; rr(ctx, bx - 210, GY - 250, 24, 250, 6); ctx.fill(); rr(ctx, bx + 186, GY - 250, 24, 250, 6); ctx.fill(); },
      front: (ctx2, c, sts, R) => { const S = R.f.tidur || {};
        if (S.mode === "drive"){ carSet(ctx, t, sts, Object.assign({ night: false, col: "#2F6F73" }, S, { dist: S.stopCue ? (t < T(s, S.stopCue, .6, idx) ? t * 700 : T(s, S.stopCue, .6, idx) * 700 + 700 * .6 * (1 - Math.exp(-(t - T(s, S.stopCue, .6, idx)) / .6))) : null }), "front"); return; }
        const tS = T(s, S.sleepCue, .4, idx); const st = sts[S.sleeper ?? 0]; if (st && t > tS + .3){ const hp = headOf(st); zzz(ctx, hp[0] + 80, hp[1] - 100, t, 1, 1.1);
          // blanket
          ctx.save(); ctx.globalAlpha *= clamp((t - tS - .3) * 3, 0, 1); ctx.beginPath(); ctx.moveTo(st.x - 190, GY - 330); ctx.quadraticCurveTo(st.x, GY - 470, st.x + 190, GY - 330); ctx.lineTo(st.x + 200, GY - 210); ctx.lineTo(st.x - 200, GY - 210); ctx.closePath();
          ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 6; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(st.x + k * 70, GY - 400); ctx.lineTo(st.x + k * 70, GY - 220); ctx.stroke(); } ctx.restore(); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.tidur || {}; if (S.sleepCue) add(cueT(s, S.sleepCue, .4, i) + .3, "whoosh"); (f.shots || []).forEach(sh => { const D2 = sh.tidur || {}; if (D2.stopCue) add(cueT(s, D2.stopCue, .6, i), "pop"); }); });

  // _rehat: rest area by the highway in the morning; car parked, Fajar stretches with tea, a two-hour sign
  TT.scene(PX + "rehat", "Cerita: rest area pagi, mobil diparkir, Fajar meregang sambil minum teh, papan ISTIRAHAT tiap 2 jam", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.rehat || {}, tTwo = T(s, S.twoCue, .8, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const sx = S.signX ?? 640; ctx.fillStyle = "#5A5A5A"; rr(ctx, sx - 12, GY - 760, 24, 760, 6); ctx.fill(); ol(ctx, 4);
        rr(ctx, sx - 170, GY - 980, 340, 240, 22); ctx.fillStyle = "#2F7F48"; ctx.fill(); ol(ctx, 6); rr(ctx, sx - 154, GY - 964, 308, 208, 16); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.stroke();
        ctx.save(); ctx.translate(sx - 70, GY - 830); teaCup(ctx, t); ctx.restore(); textC(ctx, "ISTIRAHAT", sx + 40, GY - 900, 36, "#FFFFFF", 900, 180);
        const q = eBack(clamp((t - tTwo) / .4, 0, 1)) * (t > tTwo ? 1 : 0); ctx.save(); ctx.translate(sx + 50, GY - 830); ctx.scale(.6 + .4 * q, .6 + .4 * q); textC(ctx, "± 2 JAM", 0, 0, 46, t > tTwo ? GOLD : "#FFFFFF", 900, 180); ctx.restore();
        if (t > tTwo && t < tTwo + .9) burstFx(ctx, sx + 50, GY - 840, t - tTwo, GOLD, 10, 160);
        ctx.save(); ctx.translate(S.carX ?? 930, GY + 10); ctx.scale(-1, 1); carBack(ctx, 0, 0, .9); carFront(ctx, 0, 0, .9, t, { col: "#2F6F73" }); ctx.restore(); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.rehat || {}; if (S.twoCue) add(cueT(s, S.twoCue, .8, i), "chime"); });
})();

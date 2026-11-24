/* Scene pack j2611221631521: MODE CERITA story scenes for MS46, SB47, SP47, RN47, KD47 (layout prefix j2611221631521_).
   Shared base() from pack j2611221508201 (env, envOpt, toons[], cam[], props[], cards[], stamp, shots[], hold[], pops[], stamps[], chips[], steps[], confetti, bg).
   Scenes (each born from its own story):
     MS46 _gudang warehouse, cutter slips opening a carton · _lemari climb a stool for the dusty empty first-aid box on a locker (moth flies out)
          _dinding corridor, white box with green cross at eye level by the door, first-aider poster · _isi giant open box, 7 items fly to slots, monthly check & refill
          _pita home night, son ties a red reminder ribbon on the plastered finger
     SB47 _gelembung new-year balcony, career promise blown as soap bubbles that pop each year · _buku mentor opens her old notebook of checked goals
          _pena thoughts evaporate, giant pen writes the goal + 3 badges · _lembar one-sentence goal note at night / on the laptop lid at the office (colleagues help)
          _tempel bedroom, bubble wand to the bin, goal note on the wardrobe door
     SP47 _mural lobby mural half-painted, painter on A-ladder, TARGET 3 HARI · _pita2 two tapes unroll (plan 3 / reality 5 days), +2 gap glows
          _sebab wall crack patched (not in the plan) / waiting at the gate for paint delivery · _kantin canteen mural time-lapse with the honest new plan
          _papan sunset terrace, three columns painted on a wooden board
     RN47 _bisik pantry whisper chain, balloon mutates bigger/redder (camera follows) · _huruf worst version bursts into falling letters, heart cracks / lunch alone
          _buah basket of orange faces TIM, rotten GOSIP spreads · _meja walk to the desk, warehouse inset, new schedule · _arah group draft crossed out, arrows to person / boss
     KD47 _printer AI schedule printed in 2 s, long fan-fold, all wrong · _rapat glass meeting room, wrong lines circled
          _eskrim AI ice-cream vendor scoops odd flavours without asking / asks first · _tanya extra prompt line typed, question cards flip to answers
          _robotan home, daughter in a cardboard AI robot costume asks back before making tea
     _adegan generic shot with extras */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631521_";
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
        drawItemX(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
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


  /* ================= pack j2611221631521: shared little helpers ================= */
  const tc = (s, cue, fr) => cue ? cueT(s, cue, fr ?? .5, G.scene) : 1e9;
  const q01 = (t, a, d) => clamp((t - a) / (d || .4), 0, 1);
  function lerpCol(a, b, q){ q = clamp(q, 0, 1); const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return "rgb(" + pa.map((v, i) => Math.round(lerp(v, pb[i], q))).join(",") + ")"; }
  function wallFill(ctx, col){ ctx.fillStyle = col; ctx.fillRect(-2600, -1400, 6400, GY + 1400); }
  function floorFill(ctx, y, col, step){ ctx.fillStyle = col; ctx.fillRect(-2600, y, 6400, 2200); ctx.fillStyle = hexA(OUT, .18); ctx.fillRect(-2600, y, 6400, 8);
    ctx.strokeStyle = hexA(OUT, .08); ctx.lineWidth = 3; for (let yy = y + (step || 60); yy < y + 1400; yy += (step || 60)){ ctx.beginPath(); ctx.moveTo(-2600, yy); ctx.lineTo(3800, yy); ctx.stroke(); }
    for (let x = -2600; x < 3800; x += 180){ ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x - 540) * .35, y + 1400); ctx.stroke(); } }
  function motes(ctx, t, x0, x1, y0, y1, n, col){ for (let i = 0; i < n; i++){ const H = y1 - y0, x = x0 + rnd(i) * (x1 - x0) + Math.sin(t * .6 + i) * 24, y = y0 + (((rnd(i + 3) * H - t * 14 * (.5 + rnd(i + 5))) % H) + H) % H;
    ctx.fillStyle = hexA(col || "#FFF6D8", .25 + .35 * Math.abs(Math.sin(t * 1.3 + i))); ctx.beginPath(); ctx.arc(x, y, 3 + rnd(i + 7) * 4, 0, TAU); ctx.fill(); } }
  function textO(ctx, txt, x, y, size, col, maxW, weight){ if (maxW) size = fit(ctx, txt, maxW, size, weight || 900); else font(ctx, weight || 900, size, FAM);
    ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = size * .22; ctx.strokeText(txt, x, y); ctx.fillStyle = col; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function checkMark(ctx, x, y, r, k){ if (k <= 0) return; const q = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * .28; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-r * .45, 0); ctx.lineTo(-r * .1, r * .38); ctx.lineTo(r * .5, -r * .35); ctx.stroke(); ctx.restore(); }
  function crossMark(ctx, x, y, r, k){ if (k <= 0) return; const q = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * .26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-r * .4, -r * .4); ctx.lineTo(r * .4, r * .4); ctx.moveTo(r * .4, -r * .4); ctx.lineTo(-r * .4, r * .4); ctx.stroke(); ctx.restore(); }
  function heartPath(ctx, r){ ctx.beginPath(); ctx.moveTo(0, r * .9); ctx.bezierCurveTo(-r * 1.4, -r * .1, -r * .7, -r * 1.2, 0, -r * .45); ctx.bezierCurveTo(r * .7, -r * 1.2, r * 1.4, -r * .1, 0, r * .9); ctx.closePath(); }
  function paperSheet(ctx, x, y, w, h, rot, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.fillStyle = hexA(OUT, .18); rr(ctx, -w / 2 + 10, -h / 2 + 12, w, h, 12); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.fillStyle = col || PAPER; ctx.fill(); ol(ctx, 6); ctx.restore(); }
  function tapePiece(ctx, x, y, w, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.fillStyle = hexA("#F3E3B0", .85); ctx.fillRect(-w / 2, -14, w, 28); ctx.restore(); }
  function deskTop(ctx, x, top, w, col){ ctx.fillStyle = "#7A4A2A"; [-1, 1].forEach(d => { rr(ctx, x + d * (w / 2 - 44) - 15, top, 30, GY - top, 6); ctx.fill(); ol(ctx, 5); });
    rr(ctx, x - w / 2 + 24, top + 130, w - 48, 20, 6); ctx.fillStyle = "#6B3F22"; ctx.fill(); ol(ctx, 4);
    rr(ctx, x - w / 2, top - 12, w, 40, 10); ctx.fillStyle = col || "#C08552"; ctx.fill(); ol(ctx, 6); }

  /* ================= MS46: first-aid box ================= */
  function greenCross(ctx, s, col){ ctx.fillStyle = col || "#1E9E55"; rr(ctx, -s * .17, -s / 2, s * .34, s, s * .05); ctx.fill(); rr(ctx, -s / 2, -s * .17, s, s * .34, s * .05); ctx.fill(); }
  function p3kBox(ctx, w, t, o){ // origin = bottom centre
    o = o || {}; const h = w * .72, dust = o.dust || 0, lw = Math.max(4, w * .022), body = lerpCol("#FFFFFF", "#B5AE9F", dust), crossC = lerpCol("#1E9E55", "#7F8C7A", dust);
    ctx.save(); ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-w * .16, -h); ctx.lineTo(-w * .16, -h - w * .09); ctx.lineTo(w * .16, -h - w * .09); ctx.lineTo(w * .16, -h); ctx.strokeStyle = OUT; ctx.lineWidth = w * .065; ctx.stroke(); ctx.strokeStyle = lerpCol("#D9D9D4", "#8F897C", dust); ctx.lineWidth = w * .035; ctx.stroke();
    const op = clamp(o.open || 0, 0, 1), fct = Math.cos(op * Math.PI * .63);
    rr(ctx, -w / 2, -h, w, h, w * .06); ctx.fillStyle = body; ctx.fill();
    if (op > 0){ ctx.save(); rr(ctx, -w / 2 + lw, -h + lw, w - 2 * lw, h - 2 * lw, w * .04); ctx.clip(); ctx.fillStyle = lerpCol("#EFE9DC", "#8C8578", dust); ctx.fillRect(-w / 2, -h, w, h);
      ctx.fillStyle = hexA(OUT, .12); ctx.fillRect(-w / 2, -h, w, h * .12); ctx.fillStyle = lerpCol("#D8CFBE", "#7A7366", dust); [.4, .72].forEach(f => ctx.fillRect(-w / 2, -h + h * f, w, h * .035));
      if (o.inner) o.inner(ctx, w, h); ctx.restore(); }
    rr(ctx, -w / 2, -h, w, h, w * .06); ol(ctx, lw);
    // front door, hinged at the bottom edge
    const dh = h * fct; ctx.save();
    if (dh > 0) rr(ctx, -w / 2, -dh, w, dh, w * .06); else rr(ctx, -w / 2, 0, w, -dh, w * .05);
    ctx.fillStyle = dh > 0 ? body : lerpCol("#E9E6DE", "#9C9585", dust); ctx.fill(); ol(ctx, lw);
    if (fct > .25){ ctx.translate(0, -dh * .55); ctx.scale(1, fct); greenCross(ctx, h * .5, crossC); ctx.scale(1, 1 / fct); } else if (fct < -.2){ ctx.translate(0, -dh * .5); ctx.scale(1, -fct); greenCross(ctx, h * .42, hexA(crossC, .45)); }
    ctx.restore();
    if (fct > .5) textC(ctx, "P3K", 0, -h * .08, w * .1, crossC, 900, w * .4);
    if (dust > 0){ ctx.save(); ctx.globalAlpha *= dust; ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 2; const cx = -w / 2, cy = -h;
      for (let k = 0; k < 5; k++){ ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(k * .38) * w * .3, cy + Math.sin(k * .38) * w * .3); ctx.stroke(); }
      for (let r = 1; r < 4; r++){ ctx.beginPath(); for (let k = 0; k < 5; k++){ const a = k * .38, R = r * w * .08; k ? ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R) : ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); } ctx.stroke(); }
      ctx.fillStyle = hexA("#7A7366", .5); for (let k = 0; k < 14; k++) { ctx.beginPath(); ctx.arc(-w / 2 + rnd(k) * w, -h + rnd(k + 9) * h, 3 + rnd(k + 4) * 5, 0, TAU); ctx.fill(); } ctx.restore(); }
    ctx.restore(); }
  function aidItem(ctx, kind, t, o){ o = o || {}; ctx.save(); ctx.lineJoin = "round"; ctx.globalAlpha *= o.alpha ?? 1;
    if (kind === "glove"){ ctx.rotate(-.12); ctx.fillStyle = "#7EC8F0";
      for (let i = 0; i < 4; i++){ rr(ctx, -40 + i * 21, -76 + (i === 0 || i === 3 ? 14 : 0), 19, 80, 9); ctx.fill(); ol(ctx, 4); }
      ctx.save(); ctx.translate(-46, 18); ctx.rotate(-.6); rr(ctx, -12, -36, 24, 56, 12); ctx.fill(); ol(ctx, 4); ctx.restore();
      rr(ctx, -44, -14, 86, 84, 20); ctx.fill(); ol(ctx, 4); rr(ctx, -36, 62, 70, 34, 8); ctx.fillStyle = "#5AAFDD"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "antiseptik"){ rr(ctx, -16, -76, 32, 34, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); rr(ctx, -13, -50, 26, 24, 5); ctx.fillStyle = "#6B3A22"; ctx.fill(); ol(ctx, 4);
      rr(ctx, -40, -34, 80, 118, 16); ctx.fillStyle = "#8B4A2B"; ctx.fill(); ol(ctx, 5); rr(ctx, -30, -4, 60, 56, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
      ctx.save(); ctx.translate(0, 24); greenCross(ctx, 34, RED); ctx.restore(); ctx.fillStyle = hexA("#FFFFFF", .3); ctx.fillRect(-32, -26, 8, 100); }
    else if (kind === "kapas"){ [[-34, 18, 30], [0, 26, 34], [34, 16, 30], [-18, -12, 30], [20, -14, 32], [0, -40, 26]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 4; ctx.stroke(); });
      [[-34, 18, 30], [0, 26, 34], [34, 16, 30], [-18, -12, 30], [20, -14, 32], [0, -40, 26]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r - 3, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); }); }
    else if (kind === "kasa"){ ctx.rotate(.08); rr(ctx, -60, -60, 120, 120, 10); ctx.fillStyle = "#D9EEF6"; ctx.fill(); ol(ctx, 4); rr(ctx, -48, -48, 96, 96, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
      ctx.strokeStyle = hexA("#8FB8C8", .6); ctx.lineWidth = 2; for (let k = -40; k <= 40; k += 10){ ctx.beginPath(); ctx.moveTo(k, -46); ctx.lineTo(k, 46); ctx.moveTo(-46, k); ctx.lineTo(46, k); ctx.stroke(); }
      rr(ctx, -42, 46, 84, 22, 6); ctx.fillStyle = "#2F8FBF"; ctx.fill(); textC(ctx, "STERIL", 0, 63, 16, "#FFFFFF", 900, 76); }
    else if (kind === "perban"){ ctx.beginPath(); ctx.moveTo(-10, 30); ctx.quadraticCurveTo(-60, 60, -92, 40); ctx.lineTo(-92, 14); ctx.quadraticCurveTo(-60, 30, -10, 4); ctx.closePath(); ctx.fillStyle = "#F4EFE6"; ctx.fill(); ol(ctx, 4);
      rr(ctx, -30, -46, 70, 92, 10); ctx.fillStyle = "#F4EFE6"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(40, 0, 22, 46, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; for (let r = 6; r < 40; r += 8){ ctx.beginPath(); ctx.ellipse(40, 0, r * .48, r, 0, 0, TAU); ctx.stroke(); } }
    else if (kind === "plester"){ ctx.rotate(-.35); rr(ctx, -84, -24, 168, 48, 24); ctx.fillStyle = "#E8B98A"; ctx.fill(); ol(ctx, 4); rr(ctx, -26, -17, 52, 34, 7); ctx.fillStyle = "#F7DCC0"; ctx.fill(); ol(ctx, 3);
      ctx.fillStyle = hexA(OUT, .3); [-60, -46, 46, 60].forEach(x => [-8, 8].forEach(y => { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); })); }
    else if (kind === "gunting"){ const op = o.snip ? Math.abs(Math.sin(t * 14)) * .3 : .18; ctx.rotate(-.5);
      [[1], [-1]].forEach(([d]) => { ctx.save(); ctx.rotate(d * op); ctx.beginPath(); ctx.moveTo(0, -4 * d); ctx.lineTo(96, -2 * d); ctx.lineTo(0, 10 * d); ctx.closePath(); ctx.fillStyle = "#D9DEE2"; ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.ellipse(-36, 18 * d, 26, 18, 0, 0, TAU); ctx.lineWidth = 12; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = ORANGE; ctx.stroke(); ctx.restore(); });
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 3); }
    else if (kind === "tisu"){ ctx.beginPath(); ctx.moveTo(-40, 20); ctx.quadraticCurveTo(-46, -30, -10, -40); ctx.quadraticCurveTo(20, -50, 40, -20); ctx.quadraticCurveTo(50, 20, 20, 34); ctx.quadraticCurveTo(-10, 44, -40, 20); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = hexA(RED, .7); ctx.beginPath(); ctx.arc(6, -4, 9, 0, TAU); ctx.fill(); }
    ctx.restore(); }
  function cutterDraw(ctx){ rr(ctx, -64, -15, 96, 30, 9); ctx.fillStyle = "#F2C230"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA(OUT, .35); for (let k = 0; k < 4; k++) ctx.fillRect(-52 + k * 14, -8, 6, 16);
    ctx.beginPath(); ctx.moveTo(32, -11); ctx.lineTo(84, -11); ctx.lineTo(96, 2); ctx.lineTo(32, 9); ctx.closePath(); ctx.fillStyle = "#D9DEE2"; ctx.fill(); ol(ctx, 3);
    ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 2; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(48 + k * 14, -11); ctx.lineTo(42 + k * 14, 9); ctx.stroke(); } }
  function cartonDraw(ctx, x, y, w, h, cut){ ctx.save(); ctx.translate(x, y);
    [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(0, -h); ctx.lineTo(d * w / 2, -h); ctx.lineTo(d * (w / 2 + 46), -h - 64); ctx.lineTo(d * 30, -h - 58); ctx.closePath(); ctx.fillStyle = "#D8AC72"; ctx.fill(); ol(ctx, 5); });
    rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = "#C99A62"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#E8D9B0"; ctx.fillRect(-w * .08, -h, w * .16, h * .42); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 3; ctx.strokeRect(-w * .08, -h, w * .16, h * .42);
    if (cut > 0){ ctx.strokeStyle = "#7A4A2A"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * .08, -h + 6); ctx.lineTo(-w * .08 + w * .16 * clamp(cut, 0, 1), -h + 30); ctx.stroke(); }
    ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 5; ctx.lineCap = "round"; [[-w * .3, -h * .35], [w * .3, -h * .35]].forEach(([ax, ay]) => { ctx.beginPath(); ctx.moveTo(ax, ay + 30); ctx.lineTo(ax, ay - 20); ctx.moveTo(ax - 14, ay - 6); ctx.lineTo(ax, ay - 20); ctx.lineTo(ax + 14, ay - 6); ctx.stroke(); });
    ctx.restore(); }
  function rackDraw(ctx, x0, x1, top, t, seed){ ctx.fillStyle = "#E07B2E"; [x0, x1].forEach(x => { rr(ctx, x - 14, top, 28, GY - 190 - top + 40, 4); ctx.fill(); ol(ctx, 4); });
    for (let L = 0; L < 4; L++){ const y = top + 60 + L * 270; rr(ctx, x0 - 20, y, x1 - x0 + 40, 22, 4); ctx.fillStyle = "#3E6F8E"; ctx.fill(); ol(ctx, 4);
      let x = x0 + 16; let n = 0; while (x < x1 - 60 && n < 8){ const bw = 110 + rnd(seed + L * 9 + n) * 120, bh = 120 + rnd(seed + L * 7 + n + 3) * 110; if (x + bw > x1 - 10) break;
        rr(ctx, x, y - bh, bw, bh, 5); ctx.fillStyle = n % 3 === 1 ? "#B98A55" : "#C99A62"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#E8D9B0"; ctx.fillRect(x + bw / 2 - 10, y - bh, 20, bh * .35); x += bw + 10; n++; } } }
  function gudangBG(ctx, t, o){ wallFill(ctx, "#D3CABB"); ctx.strokeStyle = hexA(OUT, .07); ctx.lineWidth = 8; for (let x = -2600; x < 3800; x += 64){ ctx.beginPath(); ctx.moveTo(x, -1400); ctx.lineTo(x, GY - 190); ctx.stroke(); }
    for (let k = -3; k < 6; k++){ const x = k * 600 + 60; rr(ctx, x, 160, 320, 130, 8); ctx.fillStyle = "#BFE3EA"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(x + 20, 172, 40, 106); }
    rackDraw(ctx, -700, 280, 420, t, 1); rackDraw(ctx, 1130, 2000, 420, t, 5);
    floorFill(ctx, GY - 190, "#A9A092", 90);
    // light cone from the hanging lamp
    const sw = Math.sin(t * 1.5) * .05, lx = o.lampX ?? 640; ctx.save(); ctx.translate(lx, -200); ctx.rotate(sw);
    ctx.fillStyle = hexA("#FFF1C4", .22); ctx.beginPath(); ctx.moveTo(-60, 640); ctx.lineTo(60, 640); ctx.lineTo(520, 1900); ctx.lineTo(-520, 1900); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 580); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-90, 650); ctx.lineTo(90, 650); ctx.lineTo(40, 580); ctx.lineTo(-40, 580); ctx.closePath(); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 652, 22, 0, Math.PI); ctx.fillStyle = "#FFF1C4"; ctx.fill(); ctx.restore();
    motes(ctx, t, lx - 400, lx + 400, 500, 1500, 22); }
  BG.gudang = gudangBG;
  function bloodDrops(ctx, hx, hy, landY, t, T0, n){ if (t < T0) return; for (let i = 0; i < n; i++){ const t0 = T0 + i * .45; if (t < t0) continue; const k = t - t0, y = hy + 380 * k * k + 40 * k, x = hx + (rnd(i) - .5) * 10;
      if (y < landY){ ctx.fillStyle = "#C8302A"; ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.quadraticCurveTo(x + 8, y, x, y + 6); ctx.quadraticCurveTo(x - 8, y, x, y - 14); ctx.fill(); }
      else { ctx.fillStyle = "#B52A24"; ctx.beginPath(); ctx.ellipse(hx + (rnd(i + 4) - .5) * 30, landY, 10 + Math.min(1, (y - landY) / 200) * 6, 4, 0, 0, TAU); ctx.fill(); } } }
  // _gudang: warehouse, the cutter slips while opening a carton
  TT.scene(PX + "gudang", "Cerita: gudang, cutter meleset saat membuka kardus, jari teriris", (ctx, th, s, t) => {
    const D = s.f.gudang || {}, bx = D.tableX ?? 720, top = D.tableTop ?? 1395, tCut = tc(s, D.cutCue, .4), tBlood = tc(s, D.bloodCue, .3);
    base(ctx, s, t, {
      front: (c2, c, sts, R) => { const st = sts[0]; deskTop(ctx, bx, top, 640, "#B97C4B"); cartonDraw(ctx, bx + 120, top - 10, 300, 210, q01(t, tCut - .5, .5));
        const h = handOf(st);
        if (t < tCut + .05){ ctx.save(); ctx.translate(h[0] + 10, h[1] + 6); ctx.rotate(.35 + Math.sin(t * 9) * .12); ctx.scale(.9, .9); cutterDraw(ctx); ctx.restore(); }
        else { const k = clamp((t - tCut) / .6, 0, 1), x = lerp(h[0] + 10, bx - 140, k), y = lerp(h[1], top - 20, k) - Math.sin(k * Math.PI) * 260; ctx.save(); ctx.translate(x, y); ctx.rotate(.35 + k * 7.6); ctx.scale(.9, .9); cutterDraw(ctx); ctx.restore(); }
        if (t > tCut && t < tCut + .5) burstFx(ctx, h[0] + 30, h[1], (t - tCut), "#FFFFFF", 10, 120);
        bloodDrops(ctx, h[0] + 4, h[1] + 10, top - 14, t, tBlood, 4); },
      over: (c2, c, sts, R) => { const h = c.toScreen(...handOf(sts[0]));
        if (t > tCut && t < tCut + 1.3) popWord(ctx, "SREET!", clamp(h[0] + 80, 280, 800), clamp(h[1] - 300, 330, 700), t - tCut, { size: 104, rot: -8, hold: 1.2 });
        if (t > tBlood && t < tBlood + 1.4) popWord(ctx, "AWW!", clamp(h[0] - 40, 280, 800), clamp(h[1] - 330, 330, 700), t - tBlood, { size: 110, rot: 6, hold: 1.3, col: RED }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const D = f.gudang || {}; add(cueT(s, D.cutCue, .4, i), "whoosh"); add(cueT(s, D.cutCue, .4, i) + .1, "pop"); add(cueT(s, D.bloodCue, .3, i), "ping"); });

  // _lemari: climbing a stool for the dusty box on top of the locker, it is empty
  function lockerDraw(ctx, x, top, w){ const h = GY - top; ctx.fillStyle = hexA(OUT, .2); ctx.beginPath(); ctx.ellipse(x, GY, w * .6, 22, 0, 0, TAU); ctx.fill();
    rr(ctx, x - w / 2, top, w, h, 8); ctx.fillStyle = "#7F97A8"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, top + 12); ctx.lineTo(x, GY - 40); ctx.stroke();
    [-1, 1].forEach(d => { const cx = x + d * w / 4; for (let k = 0; k < 4; k++){ rr(ctx, cx - w * .14, top + 50 + k * 22, w * .28, 9, 4); ctx.fillStyle = "#5F7686"; ctx.fill(); }
      rr(ctx, x + d * 22 - 6, top + h * .45, 12, 60, 5); ctx.fillStyle = "#C9D1D5"; ctx.fill(); ol(ctx, 3); });
    rr(ctx, x - w / 2 - 10, top - 16, w + 20, 24, 6); ctx.fillStyle = "#6A8090"; ctx.fill(); ol(ctx, 5); }
  function stoolDraw(ctx, x, top, q){ if (q <= 0) return; ctx.save(); ctx.translate(x, GY); ctx.scale(1, q); ctx.translate(-x, -GY);
    ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; [[-70, -40], [70, 40]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(x + b, top + 20); ctx.lineTo(x + a, GY); ctx.stroke(); });
    ctx.strokeStyle = "#C2691F"; ctx.lineWidth = 9; [[-70, -40], [70, 40]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(x + b, top + 20); ctx.lineTo(x + a, GY); ctx.stroke(); });
    rr(ctx, x - 80, top - 6, 160, 30, 10); ctx.fillStyle = "#E07B2E"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
  function mothDraw(ctx, x, y, t, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const f = Math.abs(Math.sin(t * 26));
    [[-1], [1]].forEach(([d]) => { ctx.save(); ctx.scale(d, .35 + f * .65); ctx.beginPath(); ctx.ellipse(30, -4, 32, 24, -.3, 0, TAU); ctx.fillStyle = "#A69C8C"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(30, -6, 7, 0, TAU); ctx.fillStyle = "#7A7366"; ctx.fill(); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, 0, 9, 22, 0, 0, TAU); ctx.fillStyle = "#6E655A"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, -20); ctx.quadraticCurveTo(-14, -36, -20, -34); ctx.moveTo(3, -20); ctx.quadraticCurveTo(14, -36, 20, -34); ctx.stroke(); ctx.restore(); }
  function wrapperDraw(ctx, x, y, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.moveTo(-40, -14); ctx.lineTo(36, -18); ctx.lineTo(30, -4); ctx.lineTo(40, 6); ctx.lineTo(34, 16); ctx.lineTo(-38, 14); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
    ctx.fillStyle = RED; ctx.fillRect(-30, -5, 50, 8); ctx.restore(); }
  TT.scene(PX + "lemari", "Cerita: naik kursi mengambil kotak P3K berdebu di atas lemari, isinya kosong", (ctx, th, s, t) => {
    const L = s.f.lemari || {}, lx = L.x ?? 900, top = L.top ?? 830, lw = L.w ?? 240, j = L.on ?? 1, sx = L.stoolX ?? 700, stTop = GY - 150;
    const tClimb = tc(s, L.climbCue, .3), tDown = tc(s, L.downCue, .5), tOpen = tc(s, L.openCue, .5), tEmpty = tc(s, L.emptyCue, .5);
    let boxP = null;
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { lockerDraw(ctx, lx, top, lw); stoolDraw(ctx, sx, stTop, t < tClimb ? 0 : eBack(q01(t, tClimb, .35)));
        const st = sts[j]; if (st && t > tClimb + .35){ const q = q01(t, tClimb + .35, .4); st.y = lerp(GY, stTop, eOut(q)) - Math.sin(q * Math.PI) * 70; } },
      over1: (c2, c, sts, jj, R) => { if (jj === 0 && L.tissue !== false){ const h = handOf(sts[0]); ctx.save(); ctx.translate(h[0], h[1]); ctx.scale(.8, .8); aidItem(ctx, "tisu", t); ctx.restore(); } },
      front: (c2, c, sts, R) => { const st = sts[j], h = st ? handOf(st) : [lx, top]; const kd = q01(t, tDown, .7);
        let x = lerp(lx + 10, h[0], eOut(kd)), y = lerp(top - 8, h[1] + 40, eOut(kd)) - Math.sin(kd * Math.PI) * 60; boxP = [x, y];
        const op = q01(t, tOpen, .5); ctx.save(); ctx.translate(x, y); ctx.rotate(t < tDown ? 0 : Math.sin(t * 7) * .03);
        p3kBox(ctx, 210, t, { dust: 1, open: op, inner: (cx, w, h2) => { if (t > tOpen + .2){ wrapperDraw(cx, -w * .2, -h2 * .3, .4); wrapperDraw(cx, w * .18, -h2 * .62, -.5); } } }); ctx.restore();
        if (kd > 0 && kd < 1 || (t > tDown && t < tDown + 1.2)) smoke(ctx, x, y - 120, t, 1 - q01(t, tDown, 1.2), { n: 7, h: 200, col: "#B9B2A4", s: .9 });
        if (t > tOpen){ const k = t - tOpen; if (k < 3){ mothDraw(ctx, x + k * 160 + Math.sin(k * 6) * 40, y - 140 - k * 170, t, 1.1); }
          for (let i = 0; i < 3; i++){ const kk = k - .15 - i * .2; if (kk > 0 && kk < 2.5){ const fx = x + (i - 1) * 90 + Math.sin(kk * 4 + i) * 50, fy = y - 160 + kk * 260; if (fy < GY - 20) wrapperDraw(ctx, fx, fy, Math.sin(kk * 5 + i) * .8); } } } },
      over: (c2, c, sts, R) => { if (boxP && t > tEmpty){ const p = c.toScreen(boxP[0], boxP[1] - 300); stampBox(ctx, "KOSONG!", clamp(p[0], 300, 780), clamp(p[1], 330, 640), t - tEmpty, RED, 80, -.1); if (t - tEmpty < .9) burstFx(ctx, clamp(p[0], 300, 780), clamp(p[1], 330, 640), t - tEmpty, RED, 12, 220); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.lemari || {}; add(cueT(s, L.climbCue, .3, i), "pop"); add(cueT(s, L.downCue, .5, i), "whoosh"); add(cueT(s, L.openCue, .5, i), "pop"); add(cueT(s, L.emptyCue, .5, i), "ping"); });

  // _dinding: corridor, the proper white box with the green cross hangs at eye level next to the door
  function lorongBG(ctx, t, o){ wallFill(ctx, "#DDE8DF"); ctx.fillStyle = "#B8CDBF"; ctx.fillRect(-2600, 1190, 6400, 270); ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-2600, 1186, 6400, 8);
    for (let x = -1300; x < 3000; x += 520){ rr(ctx, x, 190, 300, 36, 10); ctx.fillStyle = "#FFF6D0"; ctx.fill(); glowAt(ctx, x + 150, 230, 220, "#FFF6D0", .25); }
    const dx = o.doorX ?? 200; rr(ctx, dx - 150, 760, 300, GY - 190 - 760, 8); ctx.fillStyle = "#EFE9DD"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 126, 784, 252, GY - 190 - 784, 6); ctx.fillStyle = "#9C6B43"; ctx.fill(); ol(ctx, 5);
    rr(ctx, dx - 70, 830, 140, 110, 6); ctx.fillStyle = "#BFE3EA"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(dx + 90, 1130, 14, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3);
    rr(ctx, dx - 110, 690, 220, 50, 8); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 4); textC(ctx, "RUANG KERJA", dx, 726, 26, "#FFFFFF", 900, 200);
    floorFill(ctx, GY - 190, "#CFC2AA", 80); }
  BG.lorong = lorongBG;
  function posterWati(ctx, x, y, glow, t){ if (glow > 0) glowAt(ctx, x, y + 120, 260, GOLD, .4 * glow * (.7 + .3 * Math.sin(t * 6)));
    tapePiece(ctx, x - 90, y - 4, 70, -.3); tapePiece(ctx, x + 90, y - 4, 70, .3);
    rr(ctx, x - 125, y, 250, 260, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 125, y, 250, 60, [10, 10, 0, 0]); ctx.fillStyle = "#1E9E55"; ctx.fill(); ol(ctx, 4);
    textC(ctx, "PETUGAS P3K", x, y + 41, 28, "#FFFFFF", 900, 220);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y + 140, 56, 0, TAU); ctx.fillStyle = "#F1E4CF"; ctx.fill(); ctx.clip(); ctx.beginPath(); ctx.arc(x, y + 150, 46, 0, TAU); ctx.fillStyle = "#7A2E3A"; ctx.fill(); ctx.beginPath(); ctx.arc(x, y + 146, 28, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill();
    ctx.fillStyle = "#7A2E3A"; ctx.fillRect(x - 60, y + 180, 120, 40); ctx.restore(); ctx.beginPath(); ctx.arc(x, y + 140, 56, 0, TAU); ol(ctx, 4);
    textC(ctx, "Bu Endang", x, y + 238, 30, BROWN, 900, 220); }
  TT.scene(PX + "dinding", "Cerita: lorong, kotak putih palang hijau di dinding setinggi mata dekat pintu, petugas P3K mengambilnya", (ctx, th, s, t) => {
    const B = s.f.dinding || {}, bx = B.x ?? 470, by = B.y ?? 1100, j = B.on ?? 0, tGrab = tc(s, B.grabCue, .6), tPet = tc(s, B.petugasCue, .2), tEye = tc(s, B.eyeCue, .6), tReach = tc(s, B.reachCue, .5);
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { posterWati(ctx, B.posterX ?? 800, B.posterY ?? 470, t < tPet ? 0 : clamp(1 - (t - tPet - 2) / .5, 0, 1), t);
        if (t < tGrab + .3){ rr(ctx, bx - 90, by + 2, 180, 16, 5); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 4); }
        else { ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; rr(ctx, bx - 110, by - 160, 220, 160, 14); ctx.stroke(); ctx.restore(); rr(ctx, bx - 90, by + 2, 180, 16, 5); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 4); } },
      front: (c2, c, sts, R) => { const st = sts[j], h = handOf(st), k = q01(t, tGrab, .5); let x = bx, y = by;
        if (t > tGrab){ x = lerp(bx, h[0] - 10 * (st.face || 1), eOut(k)); y = lerp(by, h[1] + 60, eOut(k)) - Math.sin(k * Math.PI) * 40; }
        if (t < tGrab) glowAt(ctx, bx, by - 80, 220, "#9BF2B8", .18 + .1 * Math.sin(t * 4));
        ctx.save(); ctx.translate(x, y); ctx.rotate(t > tGrab ? Math.sin(t * 5) * .03 : 0); p3kBox(ctx, 220, t, {}); ctx.restore();
        if (t > tEye && t < tReach + .3){ const hp = toonHead(st), ex = hp[0] - 30 * (st.face || 1), ey = hp[1] - 8, a = clamp((t - tEye) / .5, 0, 1); ctx.save(); ctx.globalAlpha *= a * clamp((tReach + .3 - t) / .3, 0, 1);
          ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = "#1E9E55"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lerp(ex, bx + 100, a), lerp(ey, by - 80, a)); ctx.stroke(); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.dinding || {}; add(cueT(s, B.grabCue, .6, i), "whoosh"); add(cueT(s, B.petugasCue, .2, i), "chime"); add(cueT(s, B.eyeCue, .6, i), "pop"); });

  // _isi: giant open box, each item flies out to its slot, monthly check + refill
  const AID = [["glove", "SARUNG TANGAN"], ["antiseptik", "ANTISEPTIK"], ["kapas", "KAPAS"], ["kasa", "KASA STERIL"], ["perban", "PERBAN"], ["plester", "PLESTER"], ["gunting", "GUNTING"]];
  TT.scene(PX + "isi", "Cerita: kotak P3K raksasa terbuka, isinya terbang ke rak satu per satu, lalu dicek & diisi ulang", (ctx, th, s, t) => {
    const I = s.f.isi || {}, bx = I.x ?? 540, by = I.y ?? 1260, bw = I.w ?? 540, cues = I.cues || [], tOpen = I.openCue ? tc(s, I.openCue, .1) : .3, tChk = tc(s, I.checkCue, .5), tFill = tc(s, I.refillCue, .5);
    const slots = I.slots || [[220, 470], [540, 470], [860, 470], [175, 720], [415, 720], [665, 720], [905, 720]];
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const op = q01(t, tOpen, .6);
        glowAt(ctx, bx, by - 200, 520, "#FFF1C4", .2 + .08 * Math.sin(t * 3));
        ctx.save(); ctx.translate(bx, by); ctx.scale(1 + Math.sin(t * 2) * .006, 1); p3kBox(ctx, bw, t, { open: eOut(op), inner: (cx, w, h) => { AID.forEach(([k], i) => { const T0 = tc(s, cues[i], .3 + i * .05); if (t < T0){ cx.save(); cx.translate(-w * .36 + (i % 4) * w * .24, -h * (i < 4 ? .48 : .2)); cx.scale(.42, .42); aidItem(cx, k, t); cx.restore(); } }); } }); ctx.restore();
        AID.forEach(([k, lab], i) => { const T0 = tc(s, cues[i], .3 + i * .05); if (t < T0) return; const q = clamp((t - T0) / .55, 0, 1), sl = slots[i];
          const x = lerp(bx + (i % 4 - 1.5) * 120, sl[0], eOut(q)), y = lerp(by - 300, sl[1], eOut(q)) - Math.sin(q * Math.PI) * 220, sc = lerp(.4, .95, eOut(q));
          let alpha = 1, yy = y; const empty = k === "plester" && t > tFill && t < tFill + .9; if (empty) alpha = .25;
          if (k === "plester" && t > tFill + .9){ const kk = clamp((t - tFill - .9) / .45, 0, 1); yy = lerp(sl[1] - 500, sl[1], eOut(kk)); if (kk < 1) alpha = kk; }
          ctx.save(); ctx.translate(x, yy + Math.sin(t * 2.4 + i) * 6); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 1.7 + i) * .05 + (1 - q) * 3); aidItem(ctx, k, t, { alpha }); ctx.restore();
          if (q >= 1) popChip(ctx, lab, sl[0], sl[1] + 96, t - T0 - .5, NAVY, "#FFFFFF", 24, 0, true);
          if (t > tChk) checkMark(ctx, sl[0] + 62, sl[1] - 58, 22, t - tChk - i * .16);
          if (k === "plester" && empty) popChip(ctx, "HABIS", sl[0], sl[1] - 10, t - tFill, RED, "#FFFFFF", 26, -.08, true);
          if (k === "plester" && t > tFill + 1.35 && t < tFill + 2.3) burstFx(ctx, sl[0], sl[1], t - tFill - 1.35, GREEN, 10, 140); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const I = f.isi || {}; (I.cues || []).forEach((c, j) => add(cueT(s, c, .3 + j * .05, i), "whoosh")); add(cueT(s, I.checkCue, .5, i), "chime"); add(cueT(s, I.refillCue, .5, i) + 1.3, "pop"); });

  // _pita: home at night, the son ties a red reminder ribbon on the bandaged finger
  function bowDraw(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * .08); ctx.fillStyle = RED;
    [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(d * 60, -60, d * 90, 10, 0, 0); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(0, 4); ctx.quadraticCurveTo(d * 18, 40 + Math.sin(t * 4 + d) * 6, d * 34, 70); ctx.lineWidth = 12; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = RED; ctx.stroke(); });
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fillStyle = "#E85A4F"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  TT.scene(PX + "pita", "Cerita: rumah malam, anak mengikat pita merah pengingat di jari yang diplester", (ctx, th, s, t) => {
    const P0 = s.f.pita || {}, tTie = tc(s, P0.tieCue, .3);
    base(ctx, s, t, {
      over1: (c2, c, sts, j, R) => { if (j !== 0) return; const h = handOf(sts[0]); ctx.save(); ctx.translate(h[0] + 6 * (sts[0].face || 1), h[1] - 6); ctx.scale(.55, .55); aidItem(ctx, "plester", t); ctx.restore();
        if (t > tTie){ const q = eBack(q01(t, tTie, .5)); bowDraw(ctx, h[0] + 6 * (sts[0].face || 1), h[1] - 20, .9 * q, t); } },
      over: (c2, c, sts, R) => { if (t > tTie && t < tTie + 1.6){ const h = c.toScreen(...handOf(sts[0])); popWord(ctx, "JANGAN LUPA!", clamp(h[0], 330, 750), clamp(h[1] - 280, 520, 760), t - tTie - .3, { size: 84, rot: -5, hold: 1.4 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P0 = f.pita || {}; add(cueT(s, P0.tieCue, .3, i), "pop"); add(cueT(s, P0.tieCue, .3, i) + .3, "chime"); });

  /* ================= SB47: soap-bubble promises vs a written goal ================= */
  function soapBubble(ctx, x, y, r, t, o){ o = o || {}; if (r <= 2) return; ctx.save(); ctx.translate(x, y); const w = 1 + Math.sin(t * 5 + (o.seed || 0)) * .045; ctx.scale(w, 2 - w);
    const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, hexA("#FFFFFF", .06)); g.addColorStop(.72, hexA("#BFE9FF", .16)); g.addColorStop(.93, hexA("#F7B6E3", .42)); g.addColorStop(1, hexA("#FFFFFF", .8));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ["#7FD3F7", "#F6A6D8", "#FFE27A"].forEach((cl, i) => { ctx.strokeStyle = hexA(cl, .75); ctx.lineWidth = Math.max(2, r * .05); ctx.beginPath(); ctx.arc(0, 0, r * (.95 - i * .045), t * .9 + i * 2, t * .9 + i * 2 + 2.3); ctx.stroke(); });
    ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = Math.max(2, r * .025); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    ctx.fillStyle = hexA("#FFFFFF", .85); ctx.beginPath(); ctx.ellipse(-r * .42, -r * .46, r * .2, r * .09, -.7, 0, TAU); ctx.fill(); ctx.restore();
    if (o.label) textO(ctx, o.label, x, y + r * .1, r * .23, "#FFFFFF", r * 1.6);
    if (o.tag) { font(ctx, 800, r * .15, FAM); chipW(ctx, o.tag, x, y + r * .42, ORANGE, "#FFFFFF", Math.max(16, r * .13)); } }
  function bubblePop(ctx, x, y, r, k){ if (k < 0 || k > .6) return; const q = k / .6; ctx.save(); ctx.globalAlpha *= 1 - q;
    for (let i = 0; i < 16; i++){ const a = i / 16 * TAU + rnd(i) * .3, d = r * (.8 + q * .9); ctx.fillStyle = i % 2 ? "#BFE9FF" : "#FFFFFF"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d + q * q * 120, 7 * (1 - q * .5), 0, TAU); ctx.fill(); }
    ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r * (1 + q * .4), 0, TAU); ctx.stroke(); ctx.restore(); }
  function wandDraw(ctx, x, y, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -6, -10, 12, 120, 6); ctx.fillStyle = "#E85A9F"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, -44, 34, 0, TAU); ctx.lineWidth = 14; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = "#E85A9F"; ctx.stroke(); ctx.fillStyle = hexA("#BFE9FF", .35); ctx.fill(); ctx.restore(); }
  function fwork(ctx, x, y, k, col){ if (k < 0 || k > 1.4) return; const q = eOut(clamp(k / 1.1, 0, 1)); ctx.save(); ctx.globalAlpha *= clamp((1.4 - k) / .5, 0, 1);
    for (let i = 0; i < 18; i++){ const a = i / 18 * TAU, d = 160 * q; ctx.fillStyle = i % 2 ? col : "#FFFFFF"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d + k * k * 50, 6 * (1 - q * .4), 0, TAU); ctx.fill(); } ctx.restore(); }
  function railingFront(ctx, y, x0, x1){ ctx.fillStyle = hexA("#BFE3EA", .28); ctx.fillRect(x0, y + 30, x1 - x0, GY + 300 - y); for (let x = x0; x < x1; x += 170){ rr(ctx, x - 9, y, 18, GY + 300 - y, 4); ctx.fillStyle = "#4B5A62"; ctx.fill(); ol(ctx, 3); }
    rr(ctx, x0, y - 14, x1 - x0, 32, 10); ctx.fillStyle = "#5C6B74"; ctx.fill(); ol(ctx, 5); }
  TT.scene(PX + "gelembung", "Cerita: balkon malam tahun baru, janji karier ditiup jadi gelembung sabun yang pecah tiap tahun", (ctx, th, s, t) => {
    const B = s.f.gel || {}, bl = B.bubbles || [], tFinal = tc(s, B.finalCue, .5);
    const born = bl.map((b, i) => tc(s, b.cue, .2 + i * .1)), pops = bl.map((b, i) => b.popCue ? tc(s, b.popCue, .5) : (i === bl.length - 1 ? tFinal : born[i] + (b.life || 2.2)));
    let bub = [];
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { [[180, 330, ORANGE, 0], [880, 260, GOLD, .7], [560, 180, "#F6A6D8", 1.4], [320, 520, "#7FD3F7", 2.1]].forEach(([x, y, col, o]) => fwork(ctx, x, y, (t + o) % 2.8, col)); },
      over1: (c2, c, sts, j, R) => { if (j !== 0) return; const st = sts[0], h = handOf(st), f = st.face || 1; if (t < (B.wandOut ?? 1e9)) wandDraw(ctx, h[0] + 6 * f, h[1] + 10, -.5 * f);
        const hp0 = toonHead(st), tip = [hp0[0] + 110 * f, hp0[1] + 40];
        bub = bl.map((b, i) => { const T0 = born[i], P1 = pops[i]; if (t < T0) return null; const k = t - T0; const gr = clamp(k / .7, 0, 1), r = (b.r || 150) * eOut(gr);
          const drift = Math.max(0, k - .7); const x = tip[0] + f * (40 + drift * (b.vx ?? 90)) + Math.sin(k * 1.8 + i) * 30, y = tip[1] - 40 - r - drift * (b.vy ?? 150);
          return { x, y, r, T0, P1, i, b }; });
        bub.forEach(o => { if (!o) return; if (t < o.P1) soapBubble(ctx, o.x, o.y, o.r, t, { label: o.b.label, tag: o.b.tag, seed: o.i }); else bubblePop(ctx, o.x, o.y, o.r, t - o.P1); }); },
      over: (c2, c, sts, R) => { bub.forEach(o => { if (!o || t < o.P1 || t > o.P1 + 1.1) return; const p = c.toScreen(o.x, o.y); popWord(ctx, "POP!", clamp(p[0], 260, 820), clamp(p[1], 330, 900), t - o.P1, { size: 96, rot: -6, hold: 1 }); }); },
      front: (c2, c, sts, R) => { railingFront(ctx, B.railY ?? 1330, -800, 2000); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.gel || {}; (B.bubbles || []).forEach((b, j) => { const T0 = cueT(s, b.cue, .2 + j * .1, i); add(T0, "whoosh"); const P1 = b.popCue ? cueT(s, b.popCue, .5, i) : (j === B.bubbles.length - 1 ? cueT(s, B.finalCue, .5, i) : T0 + (b.life || 2.2)); add(P1, "pop"); }); });

  // _buku: the mentor opens her small old notebook full of checked goals
  function oldBook(ctx, x, y, w, h, open, t, o){ ctx.save(); ctx.translate(x, y); ctx.rotate(-.03 + Math.sin(t * 1.4) * .01);
    const hw = w / 2, cosA = Math.cos(open * Math.PI);
    ctx.fillStyle = hexA(OUT, .2); rr(ctx, -hw * (open > .5 ? 1 : 0) + 12, -h / 2 + 16, hw * (open > .5 ? 2 : 1), h, 14); ctx.fill();
    // right page
    rr(ctx, 0, -h / 2, hw, h, [0, 14, 14, 0]); ctx.fillStyle = "#FBF3E0"; ctx.fill(); ol(ctx, 5);
    const L = o.lines || [], lh = (h - 90) / Math.max(1, L.length);
    L.forEach((l, i) => { const yy = -h / 2 + 70 + lh * i + lh / 2; ctx.strokeStyle = hexA("#7FA3C8", .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(18, yy + 22); ctx.lineTo(hw - 18, yy + 22); ctx.stroke();
      rr(ctx, 22, yy - 18, 34, 34, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); fit(ctx, l, hw - 100, 30, 700); ctx.fillStyle = "#33415C"; ctx.fillText(l, 68, yy + 10);
      const kc = (o.checks || [])[i]; if (kc != null && t > kc){ const q = eBack(clamp((t - kc) / .3, 0, 1)); ctx.save(); ctx.translate(39, yy - 2); ctx.scale(q, q); ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, -2); ctx.lineTo(-2, 12); ctx.lineTo(22, -22); ctx.stroke(); ctx.restore(); if (t - kc < .7) burstFx(ctx, 39, yy, t - kc, GREEN, 8, 70); } });
    textC(ctx, o.title2 || "", hw / 2, -h / 2 + 46, 30, ORANGE, 900, hw - 40);
    // cover
    const cw = hw * cosA; rr(ctx, Math.min(0, cw), -h / 2 - 6, Math.abs(cw) + 6, h + 12, 12); ctx.fillStyle = open > .5 ? "#7A3E22" : "#8E4A2A"; ctx.fill(); ol(ctx, 6);
    if (open < .45){ ctx.save(); ctx.translate(cw / 2, 0); ctx.scale(Math.max(.05, cosA), 1); rr(ctx, -hw * .36, -h * .18, hw * .72, h * .2, 8); ctx.fillStyle = "#E8D9B0"; ctx.fill(); ol(ctx, 3); textC(ctx, "CATATAN", 0, -h * .05, 30, BROWN, 900, hw * .6); ctx.restore(); }
    if (open > .5){ rr(ctx, -hw, -h / 2, hw, h, [14, 0, 0, 14]); ctx.fillStyle = "#F6ECD6"; ctx.fill(); ol(ctx, 5); textC(ctx, o.title || "TUJUANKU", -hw / 2, -h / 2 + 80, 44, BROWN, 900, hw - 50);
      textC(ctx, o.sub || "", -hw / 2, -h / 2 + 126, 28, "#8E5A35", 700, hw - 60); sparkle(ctx, -hw / 2, h * .12, 40 + 6 * Math.sin(t * 4), GOLD); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-hw + 40, h * .32); ctx.lineTo(-40, h * .32); ctx.stroke(); }
    rr(ctx, -8, -h / 2 - 6, 16, h + 12, 6); ctx.fillStyle = "#5A2E18"; ctx.fill(); ctx.restore(); }
  TT.scene(PX + "buku", "Cerita: pantri Senin pagi, mentor membuka buku kecil lamanya penuh tujuan yang dicentang", (ctx, th, s, t) => {
    const B = s.f.buku || {}, tOpen = tc(s, B.openCue, .3), tChk = tc(s, B.checkCue, .5), tHead = tc(s, B.headCue, .4), j = B.head ?? 0;
    let hb = null;
    base(ctx, s, t, {
      front: (c2, c, sts, R) => { const st = sts[j]; if (st && t > tHead && t < tHead + 2.2){ const hp = toonHead(st), k = t - tHead, r = 70 * eOut(clamp(k / .5, 0, 1)), y = hp[1] - st.size * .3 - k * 90; hb = [hp[0] + 40, y];
          if (k < 1.5) soapBubble(ctx, hp[0] + 40, y, r, t, { label: "", seed: 3 }); else bubblePop(ctx, hp[0] + 40, y, r, k - 1.5); }
        if (t > tOpen - .4){ const q = eBack(q01(t, tOpen - .4, .4)); ctx.save(); ctx.translate(B.x ?? 560, B.y ?? 560); ctx.scale(q, q);
          oldBook(ctx, 0, 0, B.w ?? 700, B.h ?? 420, clamp((t - tOpen) / .7, 0, 1), t, { lines: B.lines || [], checks: (B.lines || []).map((l, i) => tChk + i * .4), title: B.title, sub: B.sub, title2: B.title2 }); ctx.restore(); } },
      over: (c2, c, sts, R) => { if (hb && t > tHead + 1.5 && t < tHead + 2.5){ const p = c.toScreen(hb[0], hb[1]); popWord(ctx, "POP!", clamp(p[0], 260, 820), clamp(p[1], 330, 800), t - tHead - 1.5, { size: 70, rot: 8, hold: .9 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.buku || {}; add(cueT(s, B.openCue, .3, i), "whoosh"); (B.lines || []).forEach((l, j) => add(cueT(s, B.checkCue, .5, i) + j * .4, "pop")); add(cueT(s, B.headCue, .4, i) + 1.5, "pop"); });

  // _pena: thoughts evaporate as bubbles, a giant pen pins one onto paper as a written goal
  function bigPen(ctx, x, y, rot, s){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-26, -70); ctx.lineTo(26, -70); ctx.lineTo(0, 0); ctx.closePath(); ctx.fillStyle = "#F1D9B4"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-8, -22); ctx.lineTo(8, -22); ctx.lineTo(0, 0); ctx.closePath(); ctx.fillStyle = "#1F2A44"; ctx.fill();
    rr(ctx, -30, -150, 60, 84, 10); ctx.fillStyle = "#1F2A44"; ctx.fill(); ol(ctx, 5); rr(ctx, -28, -470, 56, 330, 14); ctx.fillStyle = "#2E4A86"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#FFFFFF", .3); ctx.fillRect(-18, -460, 10, 300); rr(ctx, 22, -450, 16, 170, 6); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore(); }
  TT.scene(PX + "pena", "Cerita: pikiran menguap jadi gelembung, pena raksasa menuliskan tujuan di kertas + tiga lencana", (ctx, th, s, t) => {
    const P0 = s.f.pena || {}, px = P0.x ?? 730, py = P0.y ?? 600, pw = P0.w ?? 480, ph = P0.h ?? 520, tW = tc(s, P0.writeCue, .4), tEv = tc(s, P0.evapCue, .5), tWin = tc(s, P0.winCue, .5);
    const L = P0.lines || [], dur = P0.writeDur || 2.2;
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const st = sts[0], hp = toonHead(st);
        for (let i = 0; i < 5; i++){ const T0 = .2 + i * .55; if (t < T0) continue; const k = t - T0, x = hp[0] + 60 + Math.sin(k * 1.6 + i) * 60 + k * 40, y = hp[1] - st.size * .3 - k * 120, r = 58 + i * 8;
          const ev = t > tEv + i * .15 ? clamp((t - tEv - i * .15) / .6, 0, 1) : 0; if (y < 150 || ev >= 1) { if (ev > 0 && ev < 1) smoke(ctx, x, y, t, 1 - ev, { n: 4, h: 80, col: "#FFFFFF", s: .5 }); continue; }
          ctx.save(); ctx.globalAlpha *= 1 - ev; soapBubble(ctx, x, y, r * (1 + ev * .5), t, { seed: i }); ctx.restore(); if (ev > 0) smoke(ctx, x, y, t, ev, { n: 4, h: 90, col: "#FFFFFF", s: .45 }); }
        // paper
        const sw = Math.sin(t * 1.5) * .02; paperSheet(ctx, px, py, pw, ph, sw); if (t > tWin) glowAt(ctx, px, py, 420, GOLD, .25 + .1 * Math.sin(t * 5));
        ctx.save(); ctx.translate(px, py); ctx.rotate(sw); textC(ctx, P0.title || "TUJUANKU", 0, -ph / 2 + 70, 46, ORANGE, 900, pw - 60);
        L.forEach((l, i) => { const a = clamp((t - tW - .3 - i * dur / L.length) / (dur / L.length), 0, 1); if (a <= 0) return; const yy = -ph / 2 + 150 + i * 64; fit(ctx, l, pw - 70, 40, 800); const w = ctx.measureText(l).width;
          ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 - 4, yy - 50, (w + 8) * a, 70); ctx.clip(); ctx.fillStyle = "#1F2A44"; ctx.textAlign = "center"; ctx.fillText(l, 0, yy); ctx.textAlign = "left"; ctx.restore(); });
        ctx.restore(); },
      front: (c2, c, sts, R) => { if (t > tW - .6 && t < tW + dur + 1){ const q = q01(t, tW - .6, .5), wr = clamp((t - tW - .3) / dur, 0, 1), li = Math.min(L.length - 1, Math.floor(wr * L.length)), fr = (wr * L.length) % 1;
          const tx = px - pw * .32 + fr * pw * .64, ty = py - ph / 2 + 150 + li * 64 - 6 + Math.sin(t * 30) * 4; const x = lerp(px + 520, tx, eOut(q)), y = lerp(py - 700, ty, eOut(q));
          ctx.save(); ctx.globalAlpha *= clamp((tW + dur + 1 - t) / .4, 0, 1); bigPen(ctx, x, y, .5, 1); ctx.restore();
          if (t > tW - .1 && t < tW + .6) bubblePop(ctx, px, py - 80, 90, t - tW + .1); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P0 = f.pena || {}; add(cueT(s, P0.writeCue, .4, i), "pop"); add(cueT(s, P0.evapCue, .5, i), "whoosh"); add(cueT(s, P0.winCue, .5, i), "chime"); });

  // _lembar: shots — writing the one-sentence goal at night / the note on the laptop lid at the office
  function lidBack(ctx, x, yb, w, h, t, note){ ctx.save(); ctx.translate(x, yb); rr(ctx, -w / 2, -h, w, h, 14); ctx.fillStyle = "#5C5650"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, -h * .5, w * .06, 0, TAU); ctx.fillStyle = hexA(ORANGE, .9); ctx.fill(); rr(ctx, -w * .58, -4, w * 1.16, 18, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4);
    if (note) note(ctx, w, h); ctx.restore(); }
  function stickyNote(ctx, w, h, lines, col, t, o){ o = o || {}; ctx.save(); ctx.rotate(o.rot ?? -.05); ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2 - 26); ctx.lineTo(w / 2 - 26, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fillStyle = col || "#FFE27A"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA(OUT, .12); ctx.fillRect(-w / 2, -h / 2, w, h * .14);
    const n = lines.length, sz = o.size || Math.min(44, (h * .72) / Math.max(1, n) * .8), rev = o.reveal ?? 1;
    lines.forEach((l, i) => { const a = clamp(rev * n - i, 0, 1); if (a <= 0) return; const yy = -h / 2 + h * .2 + (h * .74) * (i + .5) / n + sz * .35; fit(ctx, l, w - 36, sz, 800); const ww = ctx.measureText(l).width;
      ctx.save(); ctx.beginPath(); ctx.rect(-ww / 2 - 4, yy - sz, (ww + 8) * a, sz * 1.4); ctx.clip(); ctx.fillStyle = i === (o.hl ?? -1) ? RED : "#1F2A44"; ctx.textAlign = "center"; ctx.fillText(l, 0, yy); ctx.textAlign = "left"; ctx.restore(); });
    ctx.restore(); }
  TT.scene(PX + "lembar", "Cerita: menulis satu kalimat tujuan di kertas tempel malam hari, lalu kertas di tutup laptop kantor dibaca rekan", (ctx, th, s, t) => {
    base(ctx, s, t, {
      front: (c2, c, sts, R) => { const f = R.f, N = f.note; if (!N) return; const lines = N.lines || [];
        if (N.mode === "write"){ deskTop(ctx, N.deskX ?? 650, N.deskTop ?? 1400, 560, "#9C6B43"); const T0 = tc(s, N.cue, .3), T1 = N.endCue ? tc(s, N.endCue, .9) : T0 + 2.5, rev = clamp((t - T0) / Math.max(.6, T1 - T0), 0, 1);
          const q = eBack(q01(t, T0 - .3, .4)); if (q > 0){ ctx.save(); ctx.translate(N.x ?? 680, N.y ?? 640); ctx.scale(q, q); ctx.rotate(Math.sin(t * 1.3) * .02); stickyNote(ctx, N.w ?? 520, N.h ?? 360, lines, "#FFE27A", t, { reveal: rev, size: 42 }); ctx.restore(); }
          const h = handOf(sts[0]); if (rev > 0 && rev < 1){ ctx.save(); ctx.translate(h[0] + 10, h[1] - 10); ctx.rotate(-.6 + Math.sin(t * 22) * .08); bigPen(ctx, 0, 0, 0, .32); ctx.restore(); } }
        else if (N.mode === "lid"){ deskTop(ctx, N.deskX ?? 560, N.deskTop ?? 1420, 700, "#B97C4B"); const T0 = tc(s, N.cue, .1);
          lidBack(ctx, N.x ?? 520, (N.deskTop ?? 1420) - 12, 380, 250, t, (cx, w, h) => { const q = t < T0 ? 1 : eBack(q01(t, T0, .35)); cx.save(); cx.translate(0, -h * .52); cx.scale(q * 1.6 - .6 * Math.min(1, q), q * 1.6 - .6 * Math.min(1, q)); stickyNote(cx, 250, 170, lines, "#FFE27A", t, { size: 26, rot: .04 }); cx.restore(); });
          (N.gifts || []).forEach((g, i) => { const T1 = tc(s, g.cue, .5 + i * .1); if (t < T1) return; const k = clamp((t - T1) / .6, 0, 1), x = lerp(g.fx, g.x, eOut(k)), y = lerp(g.fy, (N.deskTop ?? 1420) - 20, eOut(k)) - Math.sin(k * Math.PI) * 200;
            ctx.save(); ctx.translate(x, y); ctx.scale(.75, .75); drawItemX(ctx, g.kind, 0, 0, t, { text: g.text, col: g.col }); ctx.restore(); if (k >= 1 && t - T1 < 1.4) popChip(ctx, g.label, g.x, (N.deskTop ?? 1420) - 260, t - T1 - .6, g.bg || GREEN, "#FFFFFF", 30, -.04, true); }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(sh => { const N = sh.note; if (!N) return; add(cueT(s, N.cue, .3, i), N.mode === "lid" ? "pop" : "whoosh"); (N.gifts || []).forEach((g, j) => add(cueT(s, g.cue, .5 + j * .1, i) + .6, "pop")); }); });

  // _lemari2: bedroom wardrobe, the bubble wand goes to the bin, the goal note is stuck where it is seen every day
  function wardrobe(ctx, x, top, w){ rr(ctx, x - w / 2, top, w, GY - top, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, top + 14); ctx.lineTo(x, GY - 20); ctx.stroke();
    [-1, 1].forEach(d => { rr(ctx, x + d * 20 - 7, top + (GY - top) * .45, 14, 70, 6); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); rr(ctx, x + d * w / 4 - w * .18, top + 40, w * .36, (GY - top) * .36, 8); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; ctx.stroke(); });
    rr(ctx, x - w / 2 - 14, top - 20, w + 28, 26, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); }
  function binDraw(ctx, x, w){ const h = w * 1.15; ctx.beginPath(); ctx.moveTo(x - w / 2, GY - h); ctx.lineTo(x + w / 2, GY - h); ctx.lineTo(x + w * .4, GY); ctx.lineTo(x - w * .4, GY); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(x + k * w * .15, GY - h + 20); ctx.lineTo(x + k * w * .12, GY - 14); ctx.stroke(); } rr(ctx, x - w / 2 - 8, GY - h - 12, w + 16, 22, 8); ctx.fillStyle = "#3E5F92"; ctx.fill(); ol(ctx, 4); }
  TT.scene(PX + "tempel", "Cerita: kamar pagi, tongkat gelembung dibuang ke tempat sampah, tujuan tertulis ditempel di pintu lemari", (ctx, th, s, t) => {
    const P0 = s.f.tempel || {}, wx = P0.wardX ?? 800, wTop = P0.wardTop ?? 700, bx = P0.binX ?? 1010, tThrow = tc(s, P0.throwCue, .3), tStick = tc(s, P0.stickCue, .5);
    let wandP = null;
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { wardrobe(ctx, wx, wTop, 360); const q = t < tStick ? 0 : eBack(q01(t, tStick, .35));
        if (t > tStick){ if (t - tStick < .9) burstFx(ctx, wx + 80, wTop + 260, t - tStick, GOLD, 10, 160); ctx.save(); ctx.translate(wx + 80, wTop + 250); ctx.scale(3 - 1.6 * q, 3 - 1.6 * q); tapePiece(ctx, 0, -98, 90, -.1); stickyNote(ctx, 240, 190, P0.lines || [], "#FFE27A", t, { size: 26, rot: .04 }); ctx.restore(); glowAt(ctx, wx + 80, wTop + 250, 220, GOLD, .15 + .08 * Math.sin(t * 4)); } },
      over1: (c2, c, sts, j, R) => { if (j !== 0) return; const st = sts[0], h = handOf(st), f = st.face || 1;
        if (t < tThrow) wandDraw(ctx, h[0] + 6 * f, h[1] + 10, -.5 * f);
        else { const k = clamp((t - tThrow) / .8, 0, 1); if (k < 1){ const x = lerp(h[0], bx, k), y = lerp(h[1], GY - 200, k) - Math.sin(k * Math.PI) * 380; wandDraw(ctx, x, y, k * 9); } wandP = [bx, GY - 220];
          if (t > tThrow + .3){ ctx.save(); ctx.translate(h[0] + 8 * f, h[1]); ctx.rotate(-.5 * f); bigPen(ctx, 0, 0, 0, .3); ctx.restore(); } } },
      front: (c2, c, sts, R) => { binDraw(ctx, bx, 150); },
      over: (c2, c, sts, R) => { if (t > tThrow + .8 && t < tThrow + 2){ const p = c.toScreen(bx, GY - 330); popWord(ctx, "TRANG!", clamp(p[0], 260, 820), clamp(p[1], 330, 1000), t - tThrow - .8, { size: 84, rot: 6, hold: 1 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P0 = f.tempel || {}; add(cueT(s, P0.throwCue, .3, i), "whoosh"); add(cueT(s, P0.throwCue, .3, i) + .8, "pop"); add(cueT(s, P0.stickCue, .5, i), "chime"); });

  /* ================= SP47: lobby mural, plan vs reality ================= */
  function muralShapes(ctx, x0, y0, w, h, t, sk){
    const S = (fill) => { if (sk){ ctx.strokeStyle = hexA("#8E8A80", .6); ctx.lineWidth = 3; ctx.stroke(); } else { ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = hexA(OUT, .45); ctx.lineWidth = 4; ctx.stroke(); } };
    if (!sk){ const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, "#9ED6E0"); g.addColorStop(.6, "#FCE3BE"); g.addColorStop(1, "#F6C98E"); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h); }
    const sx = x0 + w * .74, sy = y0 + h * .24, sr = h * .11;
    if (!sk){ ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * .4); ctx.fillStyle = hexA(GOLD, .55); for (let k = 0; k < 10; k++){ ctx.rotate(TAU / 10); ctx.fillRect(sr * 1.15, -7, sr * .5, 14); } ctx.restore(); }
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); S(GOLD);
    ctx.beginPath(); ctx.moveTo(x0, y0 + h * .62); ctx.quadraticCurveTo(x0 + w * .22, y0 + h * .4, x0 + w * .45, y0 + h * .58); ctx.quadraticCurveTo(x0 + w * .7, y0 + h * .38, x0 + w, y0 + h * .55); ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0, y0 + h); ctx.closePath(); S("#8CC084");
    ctx.beginPath(); ctx.moveTo(x0, y0 + h * .78); ctx.quadraticCurveTo(x0 + w * .35, y0 + h * .6, x0 + w * .62, y0 + h * .76); ctx.quadraticCurveTo(x0 + w * .85, y0 + h * .68, x0 + w, y0 + h * .74); ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0, y0 + h); ctx.closePath(); S("#4E9A57");
    ctx.beginPath(); ctx.moveTo(x0 + w * .3, y0 + h); ctx.quadraticCurveTo(x0 + w * .42, y0 + h * .82, x0 + w * .52, y0 + h * .74); ctx.lineTo(x0 + w * .6, y0 + h * .74); ctx.quadraticCurveTo(x0 + w * .55, y0 + h * .86, x0 + w * .5, y0 + h); ctx.closePath(); S("#5DADE2");
    [[.12, "#E85A4F"], [.2, "#2F6F73"], [.72, "#C2691F"], [.82, "#7A4FA0"], [.9, "#E8A55B"]].forEach(([fx, col], i) => { const px = x0 + w * fx, py = y0 + h * .86;
      ctx.beginPath(); ctx.arc(px, py - 70, 22, 0, TAU); S("#E2A77C"); rr(ctx, px - 22, py - 46, 44, 70, 12); S(col); });
    ctx.beginPath(); ctx.moveTo(x0 + w * .06, y0 + h * .9); ctx.lineTo(x0 + w * .06, y0 + h * .55); S("#7A4A2A"); ctx.beginPath(); ctx.arc(x0 + w * .06, y0 + h * .5, h * .09, 0, TAU); S("#3E8B4A");
    if (!sk) { ctx.strokeStyle = OUT; ctx.lineWidth = 4; for (let k = 0; k < 3; k++){ const bx = x0 + w * (.4 + k * .07) + Math.sin(t + k) * 10, by = y0 + h * (.2 + k * .04); ctx.beginPath(); ctx.moveTo(bx - 18, by - 6 + Math.sin(t * 6 + k) * 5); ctx.quadraticCurveTo(bx - 8, by - 14, bx, by); ctx.quadraticCurveTo(bx + 8, by - 14, bx + 18, by - 6 + Math.sin(t * 6 + k) * 5); ctx.stroke(); } } }
  function muralDraw(ctx, x0, y0, w, h, t, p){ rr(ctx, x0, y0, w, h, 8); ctx.fillStyle = "#FBF8F2"; ctx.fill(); muralShapes(ctx, x0, y0, w, h, t, true);
    if (p > 0){ const ex = x0 + w * clamp(p, 0, 1); ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, y0); for (let y = y0; y <= y0 + h; y += 30) ctx.lineTo(ex + Math.sin(y * .05 + 1) * 12, y); ctx.lineTo(x0, y0 + h); ctx.closePath(); ctx.clip(); muralShapes(ctx, x0, y0, w, h, t, false); ctx.restore();
      if (p < 1) for (let k = 0; k < 5; k++){ const dy = y0 + 120 + k * h / 5, L = 20 + ((t * 30 + k * 17) % 50); ctx.fillStyle = hexA("#8CC084", .8); rr(ctx, ex + Math.sin(dy * .05 + 1) * 12 - 5, dy, 10, L, 5); ctx.fill(); } }
    rr(ctx, x0, y0, w, h, 8); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 5; ctx.stroke(); }
  function lobiMuralBG(ctx, t, o){ wallFill(ctx, "#EDE3D2"); for (let x = -1300; x < 3000; x += 520){ rr(ctx, x, 150, 300, 34, 10); ctx.fillStyle = "#FFF6D0"; ctx.fill(); }
    ctx.fillStyle = "#C9B79C"; ctx.fillRect(-2600, GY - 260, 6400, 70); floorFill(ctx, GY - 190, "#D9CBB4", 80); }
  BG.lobimural = lobiMuralBG;
  function ladderA(ctx, x, top){ ctx.strokeStyle = OUT; ctx.lineCap = "round"; [[-1], [1]].forEach(([d]) => { ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(x + d * 50, top); ctx.lineTo(x + d * 140, GY); ctx.stroke(); ctx.lineWidth = 13; ctx.strokeStyle = "#BFC6CC"; ctx.stroke(); ctx.strokeStyle = OUT; });
    for (let k = 1; k < 4; k++){ const y = top + (GY - top) * k / 4, hw = 50 + 90 * k / 4; ctx.lineWidth = 14; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(x + hw, y); ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = "#BFC6CC"; ctx.stroke(); }
    rr(ctx, x - 80, top - 14, 160, 26, 6); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 5); }
  function signPaper(ctx, x, y, w, h, lines, rot, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = col || PAPER; ctx.fill(); ol(ctx, 5); tapePiece(ctx, 0, -h / 2, 80, .05);
    lines.forEach((l, i) => textC(ctx, l.t, 0, -h / 2 + 30 + (i + .6) * (h - 30) / lines.length, l.s || 34, l.c || BROWN, 900, w - 30)); ctx.restore(); }
  TT.scene(PX + "mural", "Cerita: lobi, mural setengah jadi, pengecat di atas tangga lipat, kertas TARGET 3 HARI", (ctx, th, s, t) => {
    const M = s.f.mural || {}, tDay = tc(s, M.dayCue, .5);
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const p = (M.p ?? .5) + Math.sin(t * 1.2) * .015 + t * .002; muralDraw(ctx, M.x0 ?? -60, M.y0 ?? 320, M.w ?? 1200, M.h ?? 980, t, p);
        signPaper(ctx, M.signX ?? 880, M.signY ?? 560, 260, 200, [{ t: "TARGET", s: 30, c: ORANGE }, { t: "3 HARI", s: 56 }], .05);
        if (t > tDay){ const q = eBack(q01(t, tDay, .35)); ctx.save(); ctx.translate(M.signX ?? 880, (M.signY ?? 560) + 160); ctx.scale(q, q); ctx.rotate(-.06); chipW(ctx, "SUDAH HARI KE-5", 0, 0, RED, "#FFFFFF", 34); ctx.restore(); }
        ladderA(ctx, M.ladderX ?? 330, M.ladderTop ?? 1370); paintCan(ctx, (M.ladderX ?? 330) + 260, GY, .9, "#8CC084", t); paintCan(ctx, (M.ladderX ?? 330) + 400, GY, .8, "#5DADE2", t); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mural || {}; add(cueT(s, M.dayCue, .5, i), "ping"); });

  // _pita2: office wall, two tapes unroll — plan 3 days, reality 5 days, the gap glows
  function tapeRow(ctx, x0, y, len, col, label, t, roll){ if (len <= 0) return; ctx.save(); ctx.fillStyle = hexA(OUT, .18); ctx.fillRect(x0 + 6, y - 30, len, 70);
    ctx.fillStyle = col; ctx.fillRect(x0, y - 36, len, 70); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x0, y - 36, len, 70);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y - 40, len, 80); ctx.clip(); font(ctx, 900, 36, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(label, x0 + 22, y + 12); ctx.restore();
    if (roll){ ctx.save(); ctx.translate(x0 + len, y); ctx.rotate(len / 40); ctx.beginPath(); ctx.arc(0, 0, 52, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = "#F5EBDD"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 38, 0, 1.2); ctx.stroke(); ctx.restore(); } ctx.restore(); }
  TT.scene(PX + "pita2", "Cerita: dinding kantor, dua pita dibentangkan: rencana 3 hari vs kenyataan 5 hari, selisih menyala", (ctx, th, s, t) => {
    const P0 = s.f.pita2 || {}, x0 = P0.x0 ?? 110, d = P0.day ?? 176, y1 = P0.y1 ?? 560, y2 = P0.y2 ?? 740, tP = tc(s, P0.planCue, .3), tR = tc(s, P0.realCue, .5), tG = tc(s, P0.gapCue, .8);
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { for (let k = 0; k <= 5; k++){ ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(x0 + k * d, y1 - 80); ctx.lineTo(x0 + k * d, y2 + 60); ctx.stroke(); ctx.setLineDash([]);
          if (k < 5) textC(ctx, "H" + (k + 1), x0 + k * d + d / 2, y1 - 72, 30, hexA(BROWN, .8), 900); }
        const lp = t < tP ? 0 : 3 * d * eOut(q01(t, tP, 1.0)), lr = t < tR ? 0 : 5 * d * eOut(q01(t, tR, 1.4));
        if (t > tG){ const a = .35 + .25 * Math.sin(t * 6); ctx.fillStyle = hexA(RED, a * .5); rr(ctx, x0 + 3 * d + 6, y1 - 44, 2 * d - 12, 86, 10); ctx.fill(); ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = RED; ctx.lineWidth = 6; rr(ctx, x0 + 3 * d + 6, y1 - 44, 2 * d - 12, 86, 10); ctx.stroke(); ctx.restore();
          const q = eBack(q01(t, tG, .4)); ctx.save(); ctx.translate(x0 + 4 * d, y1); ctx.scale(q, q); chipW(ctx, "+2 HARI", 0, 0, RED, "#FFFFFF", 38); ctx.restore(); if (t - tG < .9) burstFx(ctx, x0 + 4 * d, y1, t - tG, RED, 10, 170); }
        tapeRow(ctx, x0, y1, lp, ORANGE, "RENCANA: 3 HARI", t, lp > 0 && lp < 3 * d - 1);
        tapeRow(ctx, x0, y2, lr, "#2F8F83", "KENYATAAN: 5 HARI", t, lr > 0 && lr < 5 * d - 1); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P0 = f.pita2 || {}; add(cueT(s, P0.planCue, .3, i), "whoosh"); add(cueT(s, P0.realCue, .5, i), "whoosh"); add(cueT(s, P0.gapCue, .8, i), "ping"); });

  // _sebab: shots — crack in the wall patched with putty / waiting at the gate for the paint delivery
  function crackPts(x, y){ const P = [[x, y]]; let cx = x, cy = y; for (let i = 0; i < 9; i++){ cx += 50 + rnd(i) * 30; cy += (i % 2 ? -1 : 1) * (30 + rnd(i + 5) * 40) + 18; P.push([cx, cy]); } return P; }
  TT.scene(PX + "sebab", "Cerita: retak dinding ditambal dempul (tidak ada di rencana), lalu menunggu kiriman cat di gerbang", (ctx, th, s, t) => {
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const f = R.f;
        if (f.crack){ const C = f.crack, tS = tc(s, C.cue, .1), tPatch = tc(s, C.patchCue, .5); muralDraw(ctx, -400, 260, 1900, 1100, t, 0);
          const P = crackPts(C.x ?? 330, C.y ?? 700), n = P.length - 1, g = clamp((t - tS) / .9, 0, 1) * n;
          ctx.strokeStyle = "#5A4A3A"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
          for (let i = 1; i <= Math.floor(g); i++) ctx.lineTo(P[i][0], P[i][1]); const fi = Math.floor(g); if (fi < n){ const fr = g - fi; ctx.lineTo(lerp(P[fi][0], P[fi + 1][0], fr), lerp(P[fi][1], P[fi + 1][1], fr)); } ctx.stroke();
          [2, 5, 7].forEach(i => { if (g > i){ ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[i][0] + 30, P[i][1] + (i % 2 ? 50 : -50)); ctx.stroke(); } });
          if (t > tPatch){ const pg = clamp((t - tPatch) / 2.2, 0, 1) * n; ctx.strokeStyle = "#F4EFE6"; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i <= Math.floor(pg); i++) ctx.lineTo(P[i][0], P[i][1]);
            const fj = Math.floor(pg); if (fj < n){ const fr = pg - fj; ctx.lineTo(lerp(P[fj][0], P[fj + 1][0], fr), lerp(P[fj][1], P[fj + 1][1], fr)); } ctx.stroke(); }
          signPaper(ctx, C.planX ?? 880, C.planY ?? 470, 260, 240, [{ t: "RENCANA", s: 30, c: ORANGE }, { t: "1. Cat dasar", s: 26 }, { t: "2. Sketsa", s: 26 }, { t: "3. Warnai", s: 26 }], .04); }
        if (f.cans){ const tMoon = f.cans.moonCue ? tc(s, f.cans.moonCue, .2) : 0, mq = clamp((t - tMoon) / 3, 0, 1); ctx.beginPath(); ctx.arc(f.cans.moonX ?? 860, lerp(700, 300, mq), 60, 0, TAU); ctx.fillStyle = hexA("#FFF4D6", .5 + .5 * mq); ctx.fill();
          const gx = f.cans.gateX ?? 760; ctx.fillStyle = "#4B5A62"; for (let k = 0; k < 7; k++){ rr(ctx, gx + k * 60, GY - 520, 14, 520, 4); ctx.fill(); } rr(ctx, gx - 20, GY - 540, 440, 26, 6); ctx.fill(); ol(ctx, 4); rr(ctx, gx - 60, GY - 640, 70, 640, 8); ctx.fillStyle = "#BFB3A0"; ctx.fill(); ol(ctx, 5);
          paintCan(ctx, f.cans.x ?? 620, GY, .9, "#8CC084", t, { empty: true }); paintCan(ctx, (f.cans.x ?? 620) + 120, GY, .8, "#5DADE2", t, { empty: true, rot: .1 }); paintCan(ctx, (f.cans.x ?? 620) + 60, GY - 116, .7, "#E8A55B", t, { empty: true }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.crack){ add(cueT(s, f.crack.cue, .1, i), "ping"); add(cueT(s, f.crack.patchCue, .5, i), "whoosh"); } });

  // _kantin: canteen mural painted in time-lapse following the new honest plan
  function kantinBG(ctx, t, o){ wallFill(ctx, "#F3D9C0"); ctx.fillStyle = "#E7C3A0"; ctx.fillRect(-2600, 1180, 6400, 270); ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-2600, 1176, 6400, 8);
    rr(ctx, -380, 330, 300, 300, 10); ctx.fillStyle = "#2B3A32"; ctx.fill(); ol(ctx, 6); textC(ctx, "KANTIN", -230, 395, 40, GOLD, 900, 260); for (let i = 0; i < 4; i++){ ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fillRect(-350, 430 + i * 44, 150, 10); ctx.fillRect(-170, 430 + i * 44, 60, 10); }
    for (let x = -1300; x < 3000; x += 560){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 150, -200); ctx.lineTo(x + 150, 200); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 150, 230, 50, Math.PI, TAU); ctx.fillStyle = "#E07B2E"; ctx.fill(); ol(ctx, 4); glowAt(ctx, x + 150, 260, 200, "#FFF1C4", .3); }
    floorFill(ctx, GY - 190, "#C9A27E", 70); }
  BG.kantin = kantinBG;
  TT.scene(PX + "kantin", "Cerita: kantin, rencana jujur di kertas tempel (cek dinding, cat lebih, +1 hari), mural dicat cepat, TEPAT WAKTU", (ctx, th, s, t) => {
    const K = s.f.kantin || {}, tB = tc(s, K.startCue, .2), tE = tc(s, K.endCue, .9), mx = K.x0 ?? 470, my = K.y0 ?? 340, mw = K.w ?? 680, mh = K.h ?? 660;
    const chk = (K.items || []).map((it, i) => tc(s, it.cue, .5 + i * .1));
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const p = t < tB ? 0 : clamp((t - tB) / Math.max(1, tE - tB), 0, 1); muralDraw(ctx, mx, my, mw, mh, t, p);
        if (t > tB){ const day = Math.min(4, 1 + Math.floor(p * 4)); ctx.save(); ctx.translate(mx + mw - 120, my - 10); ctx.rotate(.05); chipW(ctx, "HARI " + day + "/4", 0, 0, p >= 1 ? GREEN : NAVY, "#FFFFFF", 32); ctx.restore(); }
        const sx = K.sheetX ?? 230, sy = K.sheetY ?? 660; ctx.save(); ctx.translate(sx, sy); ctx.rotate(-.03); rr(ctx, -170, -190, 340, 380, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); tapePiece(ctx, 0, -190, 90, .05);
        textC(ctx, "RENCANA BARU", 0, -128, 34, ORANGE, 900, 300); (K.items || []).forEach((it, i) => { const y = -50 + i * 96; rr(ctx, -146, y - 30, 44, 44, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); fit(ctx, it.text, 230, 30, 800); ctx.fillStyle = BROWN; ctx.fillText(it.text, -88, y + 4);
          if (t > chk[i]){ const q = eBack(q01(t, chk[i], .3)); ctx.save(); ctx.translate(-124, y - 8); ctx.scale(q, q); ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-2, 14); ctx.lineTo(22, -22); ctx.stroke(); ctx.restore(); } }); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kantin || {}; (K.items || []).forEach((it, j) => add(cueT(s, it.cue, .5 + j * .1, i), "pop")); add(cueT(s, K.startCue, .2, i), "whoosh"); });

  // _papan: terrace at sunset, painting three columns on a wooden board
  TT.scene(PX + "papan", "Cerita: teras senja, mengecat papan kayu tiga kolom RENCANA / KENYATAAN / SEBAB", (ctx, th, s, t) => {
    const B = s.f.papan || {}, bx = B.x ?? 740, by = B.y ?? 780, bw = B.w ?? 600, bh = B.h ?? 440, cols = B.cols || [], tPhoto = tc(s, B.photoCue, .3), tFix = tc(s, B.fixCue, .6);
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(bx + d * bw * .36, by); ctx.lineTo(bx + d * bw * .42, GY); ctx.stroke(); }); ctx.strokeStyle = "#7A4A2A"; ctx.lineWidth = 13; [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(bx + d * bw * .36, by); ctx.lineTo(bx + d * bw * .42, GY); ctx.stroke(); });
        ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.sin(t * 1.1) * .008); rr(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.fillStyle = "#C9935F"; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = hexA("#8E5A35", .5); ctx.lineWidth = 4; for (let k = 1; k < 5; k++){ ctx.beginPath(); ctx.moveTo(-bw / 2, -bh / 2 + k * bh / 5); ctx.lineTo(bw / 2, -bh / 2 + k * bh / 5); ctx.stroke(); }
        const cw = bw / Math.max(1, cols.length);
        cols.forEach((cl, i) => { const T0 = tc(s, cl.cue, .4 + i * .1); const cx = -bw / 2 + cw * (i + .5); if (i > 0){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-bw / 2 + cw * i, -bh / 2 + 20); ctx.lineTo(-bw / 2 + cw * i, bh / 2 - 20); ctx.stroke(); }
          if (t < T0) return; const a = clamp((t - T0) / .6, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(cx - cw / 2, -bh / 2, cw * a, bh); ctx.clip();
          textC(ctx, cl.head, cx, -bh / 2 + 70, 42, cl.col || "#FFFFFF", 900, cw - 20); (cl.rows || []).forEach((r, k) => textC(ctx, r, cx, -bh / 2 + 170 + k * 70, 42, BROWN, 800, cw - 20)); ctx.restore();
          if (t - T0 < .7) burstFx(ctx, cx, -bh / 2 + 70, t - T0, ORANGE, 8, 90); });
        if (t > tFix && cols.length){ const cx = -bw / 2 + cw * (cols.length - .5); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(cx, 40, cw * .46 * eOut(q01(t, tFix, .4)), bh * .38, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
        if (t > tPhoto){ const q = eBack(q01(t, tPhoto, .4)); ctx.save(); ctx.translate(0, -bh / 2 - 90); ctx.rotate(-.08); ctx.scale(q, q); rr(ctx, -80, -70, 160, 150, 4); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.beginPath(); ctx.rect(-66, -58, 132, 104); ctx.clip(); muralShapes(ctx, -66, -58, 132, 104, t, false); ctx.restore(); ctx.restore(); }
        ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.papan || {}; (B.cols || []).forEach((cl, j) => add(cueT(s, cl.cue, .4 + j * .1, i), "whoosh")); add(cueT(s, B.photoCue, .3, i), "pop"); add(cueT(s, B.fixCue, .6, i), "ping"); });

  /* ================= RN47: gossip chain, rotten fruit basket, talk directly ================= */
  function gossipBalloon(ctx, x, y, w, txt, bad, t){ const h = w * .38; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * .03 * (1 + bad * 2));
    const col = lerpCol("#FFF4E6", "#E8574A", bad), N = 48; ctx.beginPath();
    for (let i = 0; i <= N; i++){ const a = i / N * TAU, sp = bad > 0 ? (i % 2 ? 1 : 1 + .16 * bad) : 1, wob = 1 + Math.sin(a * 3 + t * 4) * .015; ctx.lineTo(Math.cos(a) * w / 2 * sp * wob, Math.sin(a) * h / 2 * sp * wob); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(-w * .18, h * .4); ctx.lineTo(-w * .3, h * .82); ctx.lineTo(-w * .02, h * .46); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.fillStyle = col; ctx.fillRect(-w * .2, h * .3, w * .2, h * .14);
    const L = lines2(ctx, txt, w * .8, 44 + bad * 8, 900); font(ctx, 900, L.size, FAM); ctx.fillStyle = bad > .5 ? "#FFFFFF" : BROWN; ctx.textAlign = "center"; L.L.forEach((l, i) => ctx.fillText(l, 0, (i - (L.L.length - 1) / 2) * L.size * 1.08 + L.size * .36)); ctx.textAlign = "left";
    if (bad > .3){ ctx.strokeStyle = hexA(RED, .8); ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ const a = -.9 + k * .9; ctx.beginPath(); ctx.moveTo(Math.cos(a) * w * .6, Math.sin(a) * h * .7 - 20); ctx.lineTo(Math.cos(a) * w * .72, Math.sin(a) * h * .86 - 30); ctx.stroke(); } }
    ctx.restore(); }
  function pantryBG(ctx, t, o){ wallFill(ctx, "#D7E5DC"); for (let x = -1400; x < 3000; x += 240){ rr(ctx, x, 360, 220, 250, 8); ctx.fillStyle = "#F3EBDD"; ctx.fill(); ol(ctx, 5); rr(ctx, x + 96, 560, 28, 10, 4); ctx.fillStyle = "#8C989E"; ctx.fill(); }
    ctx.fillStyle = "#BFD3C6"; for (let y = 700; y < 1200; y += 50) for (let x = -2600; x < 3800; x += 50){ ctx.fillRect(x + 2, y + 2, 46, 46); }
    rr(ctx, -2600, 1180, 6400, 40, 6); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#A9643B"; ctx.fillRect(-2600, 1220, 6400, 240);
    rr(ctx, 1420, 1000, 200, 180, 12); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 5); rr(ctx, 1440, 1020, 120, 120, 8); ctx.fillStyle = "#2B3A32"; ctx.fill();
    rr(ctx, -380, 940, 150, 240, 14); ctx.fillStyle = "#BFE3EA"; ctx.fill(); ol(ctx, 5); rr(ctx, -360, 880, 110, 70, 10); ctx.fillStyle = "#7FC4E0"; ctx.fill(); ol(ctx, 4);
    floorFill(ctx, GY - 190, "#CBBFA8", 80); }
  BG.pantry = pantryBG;
  const GOSSIP = (s, G0, t, sts) => { const arr = (G0.arrive || []).map((c, i) => tc(s, c, .3 + i * .2)), texts = G0.texts || [];
    let n = -1; for (let i = 0; i < arr.length; i++) if (t >= arr[i] - .75) n = i; if (n < 0) return null;
    const from = sts[n], to = sts[n + 1]; if (!from || !to) return null; const hp0 = toonHead(from), hp1 = toonHead(to), k = clamp((t - (arr[n] - .75)) / .75, 0, 1), y0 = hp0[1] - from.size * .42, y1 = hp1[1] - to.size * .42;
    const x = lerp(hp0[0], hp1[0], eOut(k)), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 110, bad = clamp((n + (k >= 1 ? 1 : 0)) / (texts.length - 1), 0, 1);
    return { x, y, txt: k >= 1 ? texts[n + 1] : texts[n], bad, n, k, T: arr[n] }; };
  TT.scene(PX + "bisik", "Cerita: pantri, keluhan berpindah dari mulut ke mulut, balon kalimat makin besar, merah, dan berubah isi", (ctx, th, s, t) => {
    const G0 = s.f.bisik || {}; let g = null;
    base(ctx, s, t, {
      spots: { msg: () => { const gg = GOSSIP(s, G0, t, (s.f.toons || []).map(a => toonState(a, s, t))); return [gg ? clamp(gg.x + 140, 400, 1150) : 400, 980, .88]; } },
      front: (c2, c, sts, R) => { g = GOSSIP(s, G0, t, sts); if (!g) return; gossipBalloon(ctx, g.x, g.y, (G0.w ?? 380) + g.bad * 150, g.txt, g.bad, t);
        if (g.k < 1){ for (let i = 0; i < 4; i++){ ctx.fillStyle = hexA("#FFFFFF", .6 - i * .12); ctx.beginPath(); ctx.arc(g.x - (i + 1) * 40, g.y + 20 + Math.sin(i + t * 8) * 6, 10 - i * 2, 0, TAU); ctx.fill(); } } },
      over: (c2, c, sts, R) => { if (g && g.k >= 1 && t - g.T < .9){ const p = c.toScreen(g.x, g.y); burstFx(ctx, p[0], p[1], t - g.T, g.bad > .5 ? RED : ORANGE, 10, 200); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const G0 = f.bisik || {}; (G0.arrive || []).forEach((c, j) => { const T0 = cueT(s, c, .3 + j * .2, i); add(T0 - .75, "whoosh"); add(T0, "pop"); }); });

  // _huruf: shots — the worst version arrives and bursts into falling letters, heart cracks / eating alone in the park
  TT.scene(PX + "huruf", "Cerita: balon gosip versi terparah tiba di meja, pecah jadi hujan huruf, hati retak; lalu makan siang sendirian", (ctx, th, s, t) => {
    base(ctx, s, t, {
      front: (c2, c, sts, R) => { const f = R.f;
        if (f.arrive){ const A = f.arrive, tIn = tc(s, A.cue, .2), tB = tc(s, A.burstCue, .6), tH = tc(s, A.heartCue, .7), st = sts[A.on ?? 0], hp = toonHead(st), tx = hp[0], ty = hp[1] - st.size * .55;
          if (t > tIn && t < tB){ const k = eOut(q01(t, tIn, .9)); gossipBalloon(ctx, lerp(tx + 900, tx + 60, k), lerp(ty - 300, ty, k) + Math.sin(t * 4) * 10, 600, A.text, 1, t); }
          if (t >= tB){ const k = t - tB, chars = A.text.replace(/[^A-Z]/g, "").split(""), deskY = A.deskY ?? 1330;
            chars.forEach((ch, i) => { const sx = tx + 60 + (rnd(i) - .5) * 520, vy = 200 + rnd(i + 3) * 300, y0 = ty + (rnd(i + 6) - .5) * 120, fall = y0 + vy * k + 900 * k * k, land = deskY - 20 - (i % 4) * 30;
              const y = Math.min(fall, land), x = sx + (rnd(i + 9) - .5) * 200 * Math.min(1, k * 2); ctx.save(); ctx.translate(x, y); ctx.rotate((rnd(i + 2) - .5) * 1.6 + (y < land ? k * 4 : 0)); textO(ctx, ch, 0, 0, 64, RED); ctx.restore(); });
            if (k < .8) burstFx(ctx, tx + 60, ty, k, RED, 14, 300); }
          if (t > tH){ const k = t - tH, q = eBack(clamp(k / .35, 0, 1)), sp = clamp((k - .5) / .5, 0, 1) * 26; ctx.save(); ctx.translate(tx + 150, ty - 40); ctx.scale(q, q);
            [[-1], [1]].forEach(([d]) => { ctx.save(); ctx.translate(d * sp, sp * .3); ctx.rotate(d * sp * .01); ctx.beginPath(); ctx.rect(d < 0 ? -200 : 0, -200, 200, 400); ctx.clip(); heartPath(ctx, 80); ctx.fillStyle = "#E8574A"; ctx.fill(); ol(ctx, 6); ctx.restore(); });
            if (sp > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(-14, -10); ctx.lineTo(12, 20); ctx.lineTo(-6, 70); ctx.stroke(); } ctx.restore(); } }
        if (f.leaves){ for (let i = 0; i < 9; i++){ const q = ((t * .25 + rnd(i)) % 1), x = -100 + rnd(i + 4) * 1400 + Math.sin(t * 2 + i) * 60, y = 200 + q * 1300; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); ctx.fillStyle = i % 2 ? "#E8A55B" : "#C2691F"; ctx.beginPath(); ctx.ellipse(0, 0, 18, 9, 0, 0, TAU); ctx.fill(); ctx.restore(); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.arrive; if (A){ add(cueT(s, A.cue, .2, i), "whoosh"); add(cueT(s, A.burstCue, .6, i), "pop"); add(cueT(s, A.heartCue, .7, i) + .5, "ping"); } });

  // _buah: imagination, a basket of smiling oranges labelled TIM, one rotten "GOSIP" spoils its neighbours
  function fruitDraw(ctx, x, y, r, t, rot, i){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + i) * .04);
    const body = lerpCol("#F39A2B", "#7A5A2E", rot); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = body; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#FFFFFF", .25 * (1 - rot)); ctx.beginPath(); ctx.ellipse(-r * .4, -r * .4, r * .25, r * .14, -.6, 0, TAU); ctx.fill();
    if (rot > .1){ ctx.fillStyle = hexA("#4A3A1E", rot * .8); [[.3, .2, .22], [-.35, .35, .16], [.05, -.3, .14]].forEach(([a, b, c2]) => { ctx.beginPath(); ctx.ellipse(r * a, r * b, r * c2, r * c2 * .8, 0, 0, TAU); ctx.fill(); }); }
    ctx.fillStyle = "#3E8B4A"; ctx.beginPath(); ctx.ellipse(r * .2, -r * 1.02, r * .3, r * .12, -.4, 0, TAU); ctx.fill(); ol(ctx, 3);
    const sad = rot > .5; ctx.fillStyle = OUT; [[-.32], [.32]].forEach(([a]) => { ctx.beginPath(); if (sad) ctx.ellipse(r * a, -r * .1, r * .09, r * .05, 0, 0, TAU); else ctx.arc(r * a, -r * .12, r * .09, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(3, r * .06); ctx.lineCap = "round"; ctx.beginPath(); if (sad) ctx.arc(0, r * .45, r * .25, Math.PI + .4, TAU - .4); else ctx.arc(0, r * .1, r * .28, .3, Math.PI - .3); ctx.stroke();
    if (!sad){ ctx.fillStyle = hexA("#E85A4F", .35); [[-.55], [.55]].forEach(([a]) => { ctx.beginPath(); ctx.arc(r * a, r * .15, r * .12, 0, TAU); ctx.fill(); }); }
    ctx.restore(); }
  function flyDraw(ctx, x, y, t){ ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); ctx.fillStyle = hexA("#FFFFFF", .7); const f = Math.abs(Math.sin(t * 40)); ctx.beginPath(); ctx.ellipse(x - 6, y - 6, 7, 3 + f * 3, -.5, 0, TAU); ctx.ellipse(x + 6, y - 6, 7, 3 + f * 3, .5, 0, TAU); ctx.fill(); }
  function basketDraw(ctx, x, y, w, h, back){ if (back){ ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(x, y - h, w * .42, h * 1.5, 0, Math.PI, TAU); ctx.stroke(); ctx.strokeStyle = "#B07A45"; ctx.lineWidth = 16; ctx.stroke(); return; }
    ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w * .4, y); ctx.lineTo(x - w * .4, y); ctx.closePath(); ctx.fillStyle = "#C08552"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#7A4A2A", .55); ctx.lineWidth = 6; for (let k = -12; k < 12; k++){ ctx.beginPath(); ctx.moveTo(x + k * 40, y - h); ctx.lineTo(x + k * 40 + 120, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + k * 40, y - h); ctx.lineTo(x + k * 40 - 120, y); ctx.stroke(); } ctx.restore();
    rr(ctx, x - w / 2 - 14, y - h - 18, w + 28, 36, 14); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.translate(x, y - h * .45); ctx.rotate(-.05); rr(ctx, -70, -32, 140, 64, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, "TIM", 0, 18, 46, BROWN, 900); ctx.restore(); }
  TT.scene(PX + "buah", "Cerita: imajinasi keranjang jeruk TIM, satu jeruk busuk GOSIP menular ke tetangganya", (ctx, th, s, t) => {
    const F = s.f.buah || {}, bx = F.x ?? 600, by = F.y ?? 1240, bw = F.w ?? 620, bh = F.h ?? 220, r = F.r ?? 78, tRot = tc(s, F.rotCue, .2), tSpread = tc(s, F.spreadCue, .5);
    const pos = [[-200, -bh - 40], [-68, -bh - 60], [68, -bh - 60], [200, -bh - 40], [-134, -bh - 170], [0, -bh - 190], [134, -bh - 170]], order = [5, 4, 6, 1, 2, 0, 3];
    let rotten = [];
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { basketDraw(ctx, bx, by, bw, bh, true); },
      front: (c2, c, sts, R) => { rotten = pos.map((p, i) => { const oi = order.indexOf(i), T0 = oi === 0 ? tRot : tSpread + (oi - 1) * .35; return clamp((t - T0) / .8, 0, 1); });
        [4, 5, 6, 0, 1, 2, 3].forEach(i => { const p = pos[i], sh = rotten[i] > .5 ? Math.sin(t * 20 + i) * 2 : 0; fruitDraw(ctx, bx + p[0] + sh, by + p[1] + Math.sin(t * 2.2 + i) * 4, r, t, rotten[i], i); });
        basketDraw(ctx, bx, by, bw, bh, false);
        pos.forEach((p, i) => { if (rotten[i] < .6) return; for (let k = 0; k < 2; k++){ const a = t * (3 + k) + i * 2 + k * 3; flyDraw(ctx, bx + p[0] + Math.cos(a) * (r + 30), by + p[1] - 20 + Math.sin(a * 1.3) * (r * .7), t); } });
        if (t > tRot){ const q = eBack(q01(t, tRot, .35)); ctx.save(); ctx.translate(bx + pos[5][0], by + pos[5][1] - r - 40); ctx.scale(q, q); chipW(ctx, "GOSIP", 0, 0, "#5A4A2E", "#FFFFFF", 32); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const F = f.buah || {}; add(cueT(s, F.rotCue, .2, i), "ping"); for (let j = 0; j < 6; j++) add(cueT(s, F.spreadCue, .5, i) + j * .35, "pop"); });

  // _meja: Tono walks to Wawan's desk, the real cause pops up (waiting for warehouse data), new schedule
  function insetGudang(ctx, x, y, w, h, t, q){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = "#D3CABB"; ctx.fill(); ol(ctx, 6);
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.clip(); ctx.translate(-w / 2, -h / 2); ctx.scale(w / 1200, h / 640); ctx.translate(500, -780); rackDraw(ctx, -400, 300, 800, t, 3); ctx.restore();
    rr(ctx, -w / 2, -h / 2, w, 54, [16, 16, 0, 0]); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 4); textC(ctx, "GUDANG", 0, -h / 2 + 38, 30, "#FFFFFF", 900, w - 40);
    ctx.save(); ctx.translate(w * .26, h * .08); ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(t * 3) * 44, Math.sin(t * 3) * 44); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(t * .4) * 28, Math.sin(t * .4) * 28); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(-w * .2, h * .18); ctx.rotate(-.05); rr(ctx, -110, -60, 220, 120, 10); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, "DATA", 0, -8, 34, "#FFFFFF", 900); textC(ctx, "belum masuk...", 0, 34, 24, "#FFFFFF", 800, 200); ctx.restore(); ctx.restore(); }
  TT.scene(PX + "meja", "Cerita: datang ke meja rekan, bertanya kendala, kilas gudang (data belum masuk), sepakat jadwal baru", (ctx, th, s, t) => {
    const M = s.f.meja || {}, tIn = tc(s, M.insetCue, .6), tOut = tc(s, M.outCue, .8), tDeal = tc(s, M.dealCue, .8);
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const q = t < tIn ? 0 : eBack(q01(t, tIn, .4)) * (t > tOut ? 1 - clamp((t - tOut) / .3, 0, 1) : 1); insetGudang(ctx, M.x ?? 560, M.y ?? 520, 560, 330, t, q); },
      over: (c2, c, sts, R) => { if (t > tDeal && t < tDeal + 1){ const a = toonHead(sts[0]), b = toonHead(sts[1]), p = c.toScreen((a[0] + b[0]) / 2, a[1] + 150); burstFx(ctx, p[0], p[1], t - tDeal, GOLD, 12, 200); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.meja || {}; add(cueT(s, M.insetCue, .6, i), "whoosh"); add(cueT(s, M.dealCue, .8, i), "chime"); });

  // _arah: street, the drafted group complaint is crossed out, Tono turns to talk to the person / the boss
  TT.scene(PX + "arah", "Cerita: jalan depan kantor, draf keluhan ke grup dicoret, arah panah ke orangnya atau ke atasan", (ctx, th, s, t) => {
    const A = s.f.arah || {}, tD = tc(s, A.draftCue, .1), tX = tc(s, A.xCue, .5), tP = tc(s, A.personCue, .6), tB = tc(s, A.bossCue, .8);
    base(ctx, s, t, {
      front: (c2, c, sts, R) => { const st = sts[0], hp = toonHead(st);
        if (t > tD){ const q = eBack(q01(t, tD, .4)), gone = t > tX + .8 ? clamp((t - tX - .8) / .5, 0, 1) : 0; if (gone < 1){ ctx.save(); ctx.globalAlpha *= 1 - gone; ctx.translate(A.bx ?? 300, A.by ?? 640); ctx.scale(q * (1 - gone * .5), q * (1 - gone * .5)); ctx.rotate(gone * 2);
            gossipBalloon(ctx, 0, 0, 440, A.draft || "", .2, t); [[-150, -150], [0, -190], [150, -150]].forEach(([dx, dy], k) => { ctx.beginPath(); ctx.arc(dx, dy, 34, 0, TAU); ctx.fillStyle = ["#E8A55B", "#7FA563", "#5B7DB1"][k]; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(dx, dy + 10 + Math.abs(Math.sin(t * 9 + k)) * 6, 12, 4 + Math.abs(Math.sin(t * 9 + k)) * 8, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
            if (t > tX){ const k2 = eBack(q01(t, tX, .3)); ctx.save(); ctx.scale(k2, k2); ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 52; ctx.beginPath(); ctx.moveTo(-170, -170); ctx.lineTo(170, 120); ctx.moveTo(170, -170); ctx.lineTo(-170, 120); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 34; ctx.stroke(); ctx.restore(); }
            ctx.restore(); } }
        [[tP, 1], [tB, 2]].forEach(([T0, j]) => { if (t < T0 + .3 || !sts[j]) return; const b = toonHead(sts[j]), p = clamp((t - T0 - .3) / .5, 0, 1); arrowLine(ctx, hp[0] + 110, hp[1] + (j === 1 ? 250 : -190), b[0] - 120, b[1] + (j === 1 ? 250 : -190), j === 1 ? GREEN : TEAL, 16, p); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.arah || {}; add(cueT(s, A.draftCue, .1, i), "pop"); add(cueT(s, A.xCue, .5, i), "ping"); add(cueT(s, A.personCue, .6, i) + .3, "whoosh"); add(cueT(s, A.bossCue, .8, i) + .3, "whoosh"); });

  /* ================= KD47: AI that answers without asking ================= */
  function printerDraw(ctx, x, top, t, busy){ ctx.save(); ctx.translate(x, top); const jig = busy ? Math.sin(t * 50) * 2 : 0; ctx.translate(jig, 0);
    rr(ctx, -150, 0, 300, 150, 16); ctx.fillStyle = "#E9E6DE"; ctx.fill(); ol(ctx, 6); rr(ctx, -130, -26, 260, 36, 10); ctx.fillStyle = "#CFCAC0"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -110, 40, 220, 16, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); rr(ctx, 70, 90, 56, 30, 8); ctx.fillStyle = "#3B3530"; ctx.fill(); ctx.beginPath(); ctx.arc(98, 105, 7, 0, TAU); ctx.fillStyle = busy && Math.sin(t * 16) > 0 ? "#3BE07E" : "#1E9E55"; ctx.fill();
    rr(ctx, -120, 150, 240, 20, 6); ctx.fillStyle = "#CFCAC0"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function cabinetLow(ctx, x, top, w){ rr(ctx, x - w / 2, top, w, GY - top, 8); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 6); [0, 1].forEach(k => { rr(ctx, x - w / 2 + 20, top + 30 + k * (GY - top - 40) / 2, w - 40, (GY - top - 80) / 2, 6); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; ctx.stroke(); rr(ctx, x - 30, top + 60 + k * (GY - top - 40) / 2, 60, 12, 5); ctx.fillStyle = GOLD; ctx.fill(); }); }
  TT.scene(PX + "printer", "Cerita: printer memuntahkan jadwal AI yang panjang dalam dua detik, lalu dicap salah semua", (ctx, th, s, t) => {
    const P0 = s.f.printer || {}, px = P0.x ?? 880, ptop = P0.top ?? 1150, tP = tc(s, P0.printCue, .3), tX = tc(s, P0.wrongCue, .8), dkx = P0.deskX ?? 400;
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { cabinetLow(ctx, px, ptop + 170, 320); },
      front: (c2, c, sts, R) => { deskTop(ctx, dkx, 1400, 520, "#B97C4B"); lidBack(ctx, dkx + 90, 1388, 300, 200, t);
        printerDraw(ctx, px, ptop, t, t > tP && t < tX);
        if (t > tP){ const L = Math.min(2600, (t - tP) * 900), up = Math.min(L, 260); const sx = px, sy = ptop + 40;
          // rising strip, then cascading over the front of the cabinet into a zig-zag pile
          ctx.save(); ctx.fillStyle = PAPER; ctx.strokeStyle = OUT; ctx.lineWidth = 4; rr(ctx, sx - 100, sy - up, 200, up, 4); ctx.fill(); ctx.stroke();
          for (let y = sy - up + 20; y < sy - 10; y += 36){ ctx.fillStyle = hexA("#8E7B66", .6); ctx.fillRect(sx - 80, y, 110 + rnd(y) * 40, 8); }
          if (L > 260){ const over = Math.min(L - 260, 640); ctx.fillStyle = PAPER; rr(ctx, sx + 40, sy - up - 20, 200, over * .2 + 40, 6); ctx.fill(); ctx.stroke();
            const fall = Math.min(over, GY - (sy - up)); rr(ctx, sx + 160, sy - up + 10, 180, fall, 4); ctx.fill(); ctx.stroke(); for (let y = sy - up + 40; y < sy - up + fall - 20; y += 40){ ctx.fillStyle = hexA("#8E7B66", .6); ctx.fillRect(sx + 180, y, 100 + rnd(y + 2) * 40, 8); }
            const pile = Math.max(0, L - 900), n = Math.min(14, Math.floor(pile / 120)); for (let k = 0; k < n; k++){ ctx.save(); ctx.translate(sx + 250 - (k % 2) * 30, GY - 10 - k * 14); ctx.rotate((rnd(k) - .5) * .1); ctx.fillStyle = k % 2 ? "#F3E6D2" : PAPER; rr(ctx, -130, -12, 260, 18, 4); ctx.fill(); ctx.stroke(); ctx.restore(); } }
          ctx.restore();
          if (t > tX) [[sx, sy - 160], [sx + 250, sy + 40], [sx + 250, sy + 260]].forEach(([x, y], i) => crossMark(ctx, x, y, 36, t - tX - i * .18)); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P0 = f.printer || {}; const T0 = cueT(s, P0.printCue, .3, i); for (let k = 0; k < 6; k++) add(T0 + k * .25, "pop"); add(cueT(s, P0.wrongCue, .8, i), "ping"); });

  // _rapat: meeting room, the boss frowns at the printout: Saturday? fifty people? hotel?
  function rapatBG(ctx, t, o){ wallFill(ctx, "#E4E8EA"); const gx0 = o.glassX ?? 420;
    ctx.fillStyle = "#BFDCE6"; ctx.fillRect(gx0, 260, 1600, 1190); ctx.fillStyle = hexA("#7C9CAD", .6); for (let k = 0; k < 9; k++){ const bx = gx0 + 40 + k * 170, bh = 300 + rnd(k) * 400; ctx.fillRect(bx, 1450 - bh, 130, bh); }
    ctx.fillStyle = hexA("#FFFFFF", .25); for (let k = 0; k < 6; k++){ ctx.save(); ctx.translate(gx0 + 200 + k * 320 + (t * 10) % 40, 300); ctx.rotate(.5); ctx.fillRect(0, 0, 40, 1400); ctx.restore(); }
    ctx.strokeStyle = "#8C989E"; ctx.lineWidth = 14; for (let x = gx0; x <= gx0 + 1600; x += 400){ ctx.beginPath(); ctx.moveTo(x, 260); ctx.lineTo(x, 1450); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(gx0, 260); ctx.lineTo(gx0 + 1600, 260); ctx.stroke();
    rr(ctx, -520, 420, 820, 520, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA("#2F6F73", .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-460, 520); ctx.lineTo(-200, 520); ctx.moveTo(-460, 600); ctx.lineTo(-120, 600); ctx.stroke();
    floorFill(ctx, GY - 190, "#9AA7A0", 90); }
  BG.rapat = rapatBG;
  TT.scene(PX + "rapat", "Cerita: ruang rapat kaca, atasan mengernyit membaca cetakan jadwal AI, baris salah dilingkari merah", (ctx, th, s, t) => {
    const P0 = s.f.cetak || {}, x = P0.x ?? 560, y = P0.y ?? 620, w = P0.w ?? 560, h = P0.h ?? 500, rows = P0.rows || [];
    base(ctx, s, t, {
      back: (c2, c, sts, R) => { const sw = Math.sin(t * 1.6) * .015; paperSheet(ctx, x, y, w, h, sw); ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
        textC(ctx, P0.title || "JADWAL PELATIHAN", 0, -h / 2 + 64, 38, ORANGE, 900, w - 60); const lh = (h - 120) / Math.max(1, rows.length);
        rows.forEach((r, i) => { const yy = -h / 2 + 120 + lh * (i + .5); fit(ctx, r.text, w - 120, 38, 800); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(r.text, 0, yy + 12); ctx.textAlign = "left";
          if (r.cue){ const T0 = tc(s, r.cue, .4 + i * .1); if (t > T0){ const k = clamp((t - T0) / .45, 0, 1), tw = ctx.measureText(r.text).width; ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, yy, tw / 2 + 30, 40, -.03, -1.4, -1.4 + TAU * k); ctx.stroke();
            if (k >= 1) textO(ctx, "?", tw / 2 + 60, yy + 24, 64, RED); } } }); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.cetak || {}).rows || []).forEach((r, j) => { if (r.cue) add(cueT(s, r.cue, .4 + j * .1, i), "ping"); }); });

  // _eskrim: imagination park, the AI ice-cream vendor scoops at once without asking (wobbly tower of odd flavours) / the good vendor asks first
  function iceCart(ctx, x, t){ const top = 1250; ctx.save();
    [[-1], [1]].forEach(([d]) => { rr(ctx, x + d * 190 - 8, top - 420, 16, 420, 6); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 3); });
    ctx.beginPath(); ctx.moveTo(x - 260, top - 400); ctx.lineTo(x + 260, top - 400); ctx.lineTo(x + 230, top - 500); ctx.lineTo(x - 230, top - 500); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.clip(); for (let k = -6; k < 6; k++){ ctx.fillStyle = "#E85A9F"; ctx.fillRect(x + k * 80, top - 520, 40, 140); } ctx.restore(); ctx.beginPath(); ctx.moveTo(x - 260, top - 400); ctx.lineTo(x + 260, top - 400); ctx.lineTo(x + 230, top - 500); ctx.lineTo(x - 230, top - 500); ctx.closePath(); ol(ctx, 5);
    for (let k = 0; k < 7; k++){ ctx.beginPath(); ctx.arc(x - 240 + k * 80, top - 400, 40, 0, Math.PI); ctx.fillStyle = k % 2 ? "#FFFFFF" : "#E85A9F"; ctx.fill(); ol(ctx, 3); }
    rr(ctx, x - 230, top, 460, 260, 18); ctx.fillStyle = "#7FD3F7"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 250, top - 20, 500, 40, 12); ctx.fillStyle = "#5AAFDD"; ctx.fill(); ol(ctx, 5);
    [["#F6D6A0", -140], ["#8A5A3B", 0], ["#E85A9F", 140]].forEach(([c, dx]) => { ctx.beginPath(); ctx.ellipse(x + dx, top - 22, 54, 16, 0, 0, TAU); ctx.fillStyle = "#D9DEE2"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(x + dx, top - 26, 40, 10, 0, 0, TAU); ctx.fillStyle = c; ctx.fill(); });
    textO(ctx, "ES KRIM", x, top + 120, 64, "#FFFFFF", 400); [-1, 1].forEach(d => { ctx.save(); ctx.translate(x + d * 170, GY - 40); ctx.rotate(t * 2 * d); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#BFC6CC"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.moveTo(0, -30); ctx.lineTo(0, 30); ctx.stroke(); ctx.restore(); });
    ctx.restore(); }
  function coneDraw(ctx, x, y, scoops, t, lean){ ctx.save(); ctx.translate(x, y); ctx.scale(1.25, 1.25); ctx.beginPath(); ctx.moveTo(-44, -10); ctx.lineTo(44, -10); ctx.lineTo(0, 110); ctx.closePath(); ctx.fillStyle = "#E3B26B"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#A0702E", .6); ctx.lineWidth = 3; for (let k = -6; k < 6; k++){ ctx.beginPath(); ctx.moveTo(k * 20, -10); ctx.lineTo(k * 20 + 80, 110); ctx.moveTo(k * 20, -10); ctx.lineTo(k * 20 - 80, 110); ctx.stroke(); } ctx.restore();
    scoops.forEach((sc, i) => { const sway = Math.sin(t * 5 + i * .6) * (lean || 0) * i * 6; ctx.beginPath(); ctx.arc(sway, -40 - i * 62, 52, 0, TAU); ctx.fillStyle = sc.c; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.ellipse(sway - 18, -58 - i * 62, 16, 8, -.5, 0, TAU); ctx.fill(); if (sc.l) textO(ctx, sc.l, sway, -32 - i * 62, 22, "#FFFFFF", 96); });
    ctx.restore(); }
  TT.scene(PX + "eskrim", "Cerita: imajinasi taman, penjual es krim AI langsung menyendok tanpa bertanya (menara rasa aneh), lalu penjual yang bertanya dulu", (ctx, th, s, t) => {
    base(ctx, s, t, {
      over1: (c2, c, sts, j, R) => { const f = R.f; if (j === 1 && f.badge !== false){ const st = sts[1], p = lp(st, -2, -44); ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 4); textC(ctx, "AI", p[0], p[1] + 11, 30, "#7FD3F7", 900); } },
      front: (c2, c, sts, R) => { const f = R.f, E = f.ice || {}; iceCart(ctx, E.cartX ?? 800, t);
        const st = sts[0], h = handOf(st), tS = tc(s, E.startCue, .2), tD = tc(s, E.doneCue, .5), list = E.scoops || [], n = list.length;
        const shown = []; list.forEach((sc, i) => { const T0 = E.instant ? -1 : tS + (tD - tS) * i / Math.max(1, n); if (t < T0) return; const k = E.instant ? 1 : clamp((t - T0) / .45, 0, 1);
          if (k >= 1) shown.push(sc); else { const sx = (E.cartX ?? 800) + (i % 3 - 1) * 140, sy = 1220, ex = h[0], ey = h[1] - 50 - shown.length * 78, x = lerp(sx, ex, k), y = lerp(sy, ey, k) - Math.sin(k * Math.PI) * 260; ctx.beginPath(); ctx.arc(x, y, 50, 0, TAU); ctx.fillStyle = sc.c; ctx.fill(); ol(ctx, 5); } });
        coneDraw(ctx, h[0], h[1], shown, t, E.instant ? 0 : 1); },
      over: (c2, c, sts, R) => { const E = R.f.ice || {}; if (!E.startCue) return; const tS = tc(s, E.startCue, .2), tD = tc(s, E.doneCue, .5);
        if (t > tS && t < tD){ const p = c.toScreen(E.cartX ?? 800, 1100); popWord(ctx, "SLOP! SLOP!", clamp(p[0], 330, 760), clamp(p[1] - 380, 330, 700), (t - tS) % 1.1, { size: 80, rot: -8, hold: 1.05 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const E = f.ice || {}; if (E.startCue){ const T0 = cueT(s, E.startCue, .2, i), T1 = cueT(s, E.doneCue, .5, i), n = (E.scoops || []).length; for (let k = 0; k < n; k++) add(T0 + (T1 - T0) * k / Math.max(1, n) + .45, "pop"); add(T1, "ping"); } });

  // _tanya: the prompt gets one extra line, three question cards pop out of the laptop and flip to answers
  function qCard(ctx, x, y, w, h, q, a, flip, t, i){ const sx = Math.cos(flip * Math.PI); ctx.save(); ctx.translate(x, y + Math.sin(t * 2.4 + i) * 8); ctx.scale(Math.max(.04, Math.abs(sx)), 1); ctx.rotate((i - 1) * .04);
    const back = sx < 0; rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = back ? GREEN : CREAM; ctx.fill(); ol(ctx, 6);
    if (!back){ ctx.beginPath(); ctx.arc(-w / 2 + 6, -h / 2 + 6, 32, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, "?", -w / 2 + 6, -h / 2 + 20, 40, "#FFFFFF", 900);
      const L = lines2(ctx, q, w - 40, 36, 800); font(ctx, 800, L.size, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; L.L.forEach((l, k) => ctx.fillText(l, 0, (k - (L.L.length - 1) / 2) * L.size * 1.1 + L.size * .36)); ctx.textAlign = "left"; }
    else { textC(ctx, a, 0, 16, 44, "#FFFFFF", 900, w - 40); }
    ctx.restore(); }
  TT.scene(PX + "tanya", "Cerita: kalimat 'tanyakan dulu' diketik, tiga kartu pertanyaan keluar dari laptop lalu dibalik jadi jawaban, jadwal pas", (ctx, th, s, t) => {
    const Q = s.f.tanya || {}, cards = Q.cards || [], tFlip = tc(s, Q.flipCue, .7), tOk = tc(s, Q.okCue, .9), tType = tc(s, Q.typeCue, .2), tTypeOut = tc(s, Q.typeOutCue, .7), dkx = Q.deskX ?? 600;
    const lx = dkx - 10, ly = 1240;
    base(ctx, s, t, {
      front: (c2, c, sts, R) => { deskTop(ctx, dkx, 1400, 560, "#B97C4B"); lidBack(ctx, lx, 1388, 320, 210, t);
        cards.forEach((cd, i) => { const T0 = tc(s, cd.cue, .4 + i * .1); if (t < T0) return; const k = eOut(clamp((t - T0) / .6, 0, 1)), x = lerp(lx, cd.x, k), y = lerp(ly, cd.y, k) - Math.sin(k * Math.PI) * 160, sc = lerp(.3, 1, k);
          ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); qCard(ctx, 0, 0, 280, 170, cd.q, cd.a, clamp((t - tFlip - i * .35) / .4, 0, 1), t, i); ctx.restore(); if (t - T0 < .6) glowAt(ctx, lx, ly - 60, 200, "#BFE9FF", .5 * (1 - (t - T0) / .6)); });
        if (t > tOk){ const q = eBack(q01(t, tOk, .4)); ctx.save(); ctx.translate(lx + 230, 1250); ctx.scale(q, q); ctx.rotate(.08); drawItemX(ctx, "printout", 0, 0, t, {}); checkMark(ctx, 50, -60, 40, t - tOk - .2); ctx.restore(); } },
      over: (c2, c, sts, R) => { if (t > tType && t < tTypeOut + .3){ const a = clamp((tTypeOut + .3 - t) / .3, 0, 1); ctx.save(); ctx.globalAlpha *= a; const txt = Q.typeText || "", n = Math.floor(clamp((t - tType) / 1.6, 0, 1) * txt.length);
          const q = eBack(q01(t, tType, .3)); ctx.translate(540, Q.typeY ?? 330); ctx.scale(q, q); rr(ctx, -440, -80, 880, 160, 24); ctx.fillStyle = "#1F2A44"; ctx.fill(); ol(ctx, 6); textC(ctx, "+ PERINTAH TAMBAHAN", 0, -36, 24, GOLD, 900, 800);
          const shown = txt.slice(0, n) + (Math.sin(t * 10) > 0 ? "|" : " "); const L = lines2(ctx, txt, 800, 36, 800); font(ctx, 800, L.size, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "left";
          let rem = n; L.L.forEach((l, k) => { const part = l.slice(0, Math.max(0, rem)); rem -= l.length + 1; const w = ctx.measureText(l).width; ctx.fillText(part + (rem < 0 && rem > -l.length - 2 && Math.sin(t * 10) > 0 ? "|" : ""), -w / 2, 14 + k * L.size * 1.15); }); ctx.textAlign = "left"; ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Q = f.tanya || {}; (Q.cards || []).forEach((cd, j) => add(cueT(s, cd.cue, .4 + j * .1, i), "pop")); (Q.cards || []).forEach((cd, j) => add(cueT(s, Q.flipCue, .7, i) + j * .35, "whoosh")); add(cueT(s, Q.okCue, .9, i), "chime"); add(cueT(s, Q.typeCue, .2, i), "pop"); });

  // _robotan: home at night, the daughter plays a cardboard-box robot assistant that asks back before making tea
  TT.scene(PX + "robotan", "Cerita: rumah malam, putri berkostum robot kardus AI bertanya balik sebelum membuatkan teh", (ctx, th, s, t) => {
    const K = s.f.robotan || {}, tTea = tc(s, K.teaCue, .9);
    base(ctx, s, t, {
      over1: (c2, c, sts, j, R) => { if (j !== (K.on ?? 1)) return; const st = sts[j], k = st.size / 92, f = st.face || 1, c0 = lp(st, 0, -33);
        ctx.save(); ctx.translate(c0[0], c0[1]); ctx.rotate(Math.sin(t * 3) * .02); const w = 58 * k, h = 50 * k;
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(d * w * .3, -h / 2); ctx.lineTo(d * w * .36, -h / 2 - 50); ctx.stroke(); ctx.beginPath(); ctx.arc(d * w * .36, -h / 2 - 58, 10, 0, TAU); ctx.fillStyle = Math.sin(t * 8 + d) > 0 ? RED : GOLD; ctx.fill(); ol(ctx, 3); });
        rr(ctx, -w / 2, -h / 2, w, h, 10); ctx.fillStyle = "#C99A62"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#E8D9B0"; ctx.fillRect(-w * .1, -h / 2, w * .2, h * .22);
        rr(ctx, -w * .34, -h * .2, w * .68, h * .34, 8); ctx.fillStyle = "#1F2A44"; ctx.fill(); ol(ctx, 3); textC(ctx, "AI", 0, -h * .2 + h * .27, h * .22, "#7FD3F7", 900);
        [-1, 0, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * w * .22, h * .32, 9, 0, TAU); ctx.fillStyle = [GREEN, GOLD, RED][d + 1]; ctx.globalAlpha = .6 + .4 * Math.sin(t * 6 + d * 2); ctx.fill(); ctx.globalAlpha = 1; ol(ctx, 2); });
        ctx.restore(); },
      front: (c2, c, sts, R) => { deskTop(ctx, K.tableX ?? 560, 1440, 360, "#9C6B43");
        if (t > tTea){ const q = eBack(q01(t, tTea, .4)); ctx.save(); ctx.translate(K.tableX ?? 560, 1428); ctx.scale(q, q); drawItem(ctx, "mug", 0, 0, t, { col: "#FFFFFF" }); ctx.restore(); if (t - tTea < .9) burstFx(ctx, K.tableX ?? 560, 1330, t - tTea, GOLD, 10, 150); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.robotan || {}; add(cueT(s, K.teaCue, .9, i), "chime"); });

  // _adegan: generic shot with the shared extras
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, chip, langkah, konfeti, potong shot, latar khusus)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= hand-held objects of this pack ================= */
  function drawItemX(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1;
    const K = { kit: 1, clip: 1, folder: 1, roller: 1, brush: 1, putty: 1, lunch: 1, scissors: 1, comb: 1, tapes: 1, paintcan: 1, printout: 1 };
    if (!K[kind]) return drawItem(ctx, kind, x, y, t, o);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "kit"){ ctx.translate(0, 70); p3kBox(ctx, 200, t, {}); }
    else if (kind === "clip"){ ctx.rotate(-.1); rr(ctx, -80, -120, 160, 210, 12); ctx.fillStyle = "#A0522D"; ctx.fill(); ol(ctx, 5); rr(ctx, -66, -100, 132, 180, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3);
      rr(ctx, -34, -132, 68, 30, 8); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 4; i++){ ctx.fillStyle = "#B9A58E"; ctx.fillRect(-30, -76 + i * 38, 80, 9); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-54, -72 + i * 38); ctx.lineTo(-46, -64 + i * 38); ctx.lineTo(-36, -82 + i * 38); ctx.stroke(); } }
    else if (kind === "folder"){ ctx.rotate(-.08); rr(ctx, -110, -160, 220, 170, 12); ctx.fillStyle = o.col || ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -110, -180, 84, 28, 8); ctx.fill(); ol(ctx, 4); textC(ctx, o.text || "PROYEK", 0, -64, 32, "#FFFFFF", 900, 190); }
    else if (kind === "lunch"){ rr(ctx, -80, -70, 160, 90, 14); ctx.fillStyle = "#7FB7A0"; ctx.fill(); ol(ctx, 5); rr(ctx, -84, -86, 168, 30, 10); ctx.fillStyle = "#5E9C83"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(-30, -30, 18, 0, TAU); ctx.fill(); }
    else if (kind === "roller"){ ctx.rotate(-.2 + Math.sin(t * 6) * .12); rr(ctx, -7, -40, 14, 150, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(0, -110); ctx.lineTo(60, -110); ctx.stroke();
      rr(ctx, 20, -150, 90, 52, 18); ctx.fillStyle = o.col || "#2F8F83"; ctx.fill(); ol(ctx, 5); }
    else if (kind === "brush"){ ctx.rotate(-.5 + Math.sin(t * 7) * .15); rr(ctx, -9, -40, 18, 130, 7); ctx.fillStyle = "#B07A45"; ctx.fill(); ol(ctx, 4); rr(ctx, -16, -64, 32, 28, 4); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 3);
      ctx.beginPath(); ctx.moveTo(-16, -64); ctx.lineTo(16, -64); ctx.lineTo(10, -110); ctx.lineTo(-10, -110); ctx.closePath(); ctx.fillStyle = o.col || ORANGE; ctx.fill(); ol(ctx, 4); }
    else if (kind === "putty"){ ctx.rotate(-.9 + Math.sin(t * 8) * .25); rr(ctx, -10, -10, 20, 110, 8); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-40, -10); ctx.lineTo(40, -10); ctx.lineTo(30, -80); ctx.lineTo(-30, -80); ctx.closePath(); ctx.fillStyle = "#D9DEE2"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#F4EFE6"; rr(ctx, -30, -86, 50, 14, 6); ctx.fill(); }
    else if (kind === "scissors"){ ctx.rotate(-.3); aidItem(ctx, "gunting", t, { snip: true }); }
    else if (kind === "comb"){ ctx.rotate(-.4); rr(ctx, -70, -14, 140, 26, 6); ctx.fillStyle = "#2B2B33"; ctx.fill(); ol(ctx, 4); for (let k = -6; k <= 6; k++){ ctx.fillRect(k * 10 - 2, 10, 4, 22); } }
    else if (kind === "tapes"){ [[-40, ORANGE], [40, "#2F8F83"]].forEach(([dx, col]) => { ctx.beginPath(); ctx.arc(dx, -40, 38, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(dx, -40, 16, 0, TAU); ctx.fillStyle = "#F5EBDD"; ctx.fill(); ol(ctx, 3); }); }
    else if (kind === "paintcan"){ paintCan(ctx, 0, 30, 1, o.col || "#2F8F83", t); }
    else if (kind === "printout"){ ctx.rotate(-.06); rr(ctx, -80, -120, 160, 220, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 6; i++){ ctx.fillStyle = i ? "#B9A58E" : ORANGE; ctx.fillRect(-60, -96 + i * 32, i ? 100 - (i % 3) * 18 : 120, 9); } }
    ctx.restore(); }
  function paintCan(ctx, x, y, s, col, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    rr(ctx, -60, -130, 120, 130, 8); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 5); rr(ctx, -60, -100, 120, 70, 0); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-60, -100, 120, 70);
    ctx.beginPath(); ctx.ellipse(0, -130, 60, 14, 0, 0, TAU); ctx.fillStyle = o.empty ? "#7A7366" : "#D9DEE2"; ctx.fill(); ol(ctx, 4);
    if (!o.empty){ ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-40, -130); ctx.quadraticCurveTo(-46, -112, -38, -100); ctx.lineTo(-32, -128); ctx.fill(); }
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -130, 56, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.restore(); }
})();

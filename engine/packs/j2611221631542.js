/* Scene pack j2611221631542: MODE CERITA story scenes for KD50, JS50, SC50, MS50, SB51 (layout prefix j2611221631542_).
   Base fields like the generic "cerita" layout (env, envOpt, toons[], cam[], props[], cards[], stamp, front, shots[], bg) + extras
   (hold, pops, stamps, tags, steps, confetti). Story pieces:
     KD50 _pesan    street at night: voice message rises from the phone as Pak Hadi's face made of sound-wave bars + demands   f.pesan
          _wayang   shadow-puppet screen: the director is a puppet; FOTO/SUARA/VIDEO puppets; a hooded hand (AI) holds the rods  f.wayang
          _serigala fake message = wolf in sheep's clothing; tail/ears/claw (urgent, secret, money) pop out; fleece flies off   f.serigala
     JS50 _bongkar  courier digs through the whole topbox at the customer's gate, parcels pile up                          f.bongkar
          _urut     cross-section of the topbox, parcels stacked 5..1 in route order, numbered houses + mini scooter         f.urut
          _bonceng  branch head rides pillion on the courier's scooter all day taking notes, then asks her to train his team f.bonceng
          _latih    branch front: parcels hop into the topbox in route order, background couriers copy the move           f.latih
     SC50 _koin     payslip deductions as walking coins leaving for HARI TUA / arriving monthly with pension envelopes       f.koin
          _toren    JHT water tank filled by two scoops (company 3,7% + worker 2%), gauge to 5,7%, tap opens at 56          f.karung
          _sumur    JP well cross-section: one ring per contribution year up to 15, then a monthly bucket of coins         f.sumur
     MS50 _tarik    new mum split into four ghosts pulled by ropes to work / baby / sport / course (25% each)              f.tarik
          _gantung  nursery crib mobile: toys of different weight tilt, then balance by WHERE they hang                     f.gantung
          _sulam    grandma's life stages stitched into embroidery hoops above the park bench                              f.sulam
          _kereta   morning walk pushing the stroller (sport + baby), course book tucked into the basket: NANTI           f.kereta
     SB51 _panggung office stage, award certificate, audience PLOK                                                         f.panggung
          _kenang   applause, then night at home: blank name lines with "?" appear on the certificate                      f.kenang
          _topang   stage cross-section: the front panel drops, the helpers are holding the stage up                       f.topang
     _adegan  generic story shot with the extras above (action scenes, multi-shot flashbacks) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631542_";
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
  const ITEMS = {};
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (ITEMS[kind]) ITEMS[kind](ctx, t || 0, o);
    else if (kind === "cash"){ const n = o.n ?? 3; for (let i = 0; i < n; i++) bill(ctx, -10 + i * 14, -30 - i * 6, -.5 + i * .32 + Math.sin((t || 0) * 3 + i) * .03, i % 2 ? "#E58BA0" : "#7FB7A0", ""); }
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

  /* ======================= shared small drawings ======================= */
  const BLUE = "#5B7DB1", PURPLE = "#8E5BB5", PINK = "#F28DB2", SKY = "#7FE3EE";
  function tag(ctx, txt, x, y, k, bg, fg, size, rot){ popChip(ctx, txt, x, y, k, bg || NAVY, fg || "#FFFFFF", size || 36, rot || 0); }
  function scr(c, x, y){ return c.toScreen(x, y); }
  ITEMS.phone2 = (ctx, t, o) => { ctx.rotate(-.15); rr(ctx, -40, -150, 80, 150, 14); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); rr(ctx, -32, -140, 64, 124, 8); ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fill();
    if (o.ring){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ const q = (t * 2 + i / 3) % 1; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(0, -75, 70 + q * 70, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -75, 70 + q * 70, Math.PI - .6, Math.PI + .6); ctx.stroke(); } ctx.globalAlpha = 1; } };
  ITEMS.card = (ctx, t, o) => { ctx.rotate(-.12 + Math.sin(t * 2) * .03); rr(ctx, -80, -110, 160, 110, 8); ctx.fillStyle = o.col || PAPER; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = ORANGE; rr(ctx, -64, -94, 128, 12, 6); ctx.fill(); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 3; i++){ rr(ctx, -64, -70 + i * 20, 100 - i * 14, 9, 4); ctx.fill(); }
    if (o.heart){ ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(46, -26, 9, Math.PI, 0); ctx.arc(62, -26, 9, Math.PI, 0); ctx.lineTo(54, -8); ctx.closePath(); ctx.fill(); } };
  ITEMS.stop = (ctx, t, o) => { ctx.rotate(.08); ctx.fillStyle = "#6B6470"; ctx.fillRect(-7, -40, 14, 120);
    ctx.beginPath(); for (let i = 0; i < 8; i++){ const a = Math.PI / 8 + i * Math.PI / 4; ctx.lineTo(Math.cos(a) * 95, -130 + Math.sin(a) * 95); } ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7);
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i < 8; i++){ const a = Math.PI / 8 + i * Math.PI / 4; ctx.lineTo(Math.cos(a) * 80, -130 + Math.sin(a) * 80); } ctx.closePath(); ctx.stroke(); textC(ctx, "STOP", 0, -114, 44, "#FFFFFF", 900); };

  /* ======================= KD50 Kenali konten palsu ======================= */
  // face made of sound-wave bars (Pak Hadi: bald, glasses, mustache)
  function waveFace(ctx, x, y, R, t, q, talk){
    if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    glowAt(ctx, 0, 0, R * 1.7, "#4FD1E0", .45);
    const n = 19, bw = R * 2 / n;
    for (let i = 0; i < n; i++){ const dx = -R + bw * (i + .5), base0 = Math.sqrt(Math.max(0, R * R - dx * dx)) * 1.18, wob = .8 + .2 * Math.sin(t * 10 + i * 1.3) * (talk ? 1 : .3), h = base0 * wob;
      rr(ctx, dx - bw * .34, -h, bw * .68, h * 2, bw * .34); ctx.fillStyle = i % 2 ? "#9DEBF3" : "#4FC3D9"; ctx.fill(); }
    ctx.strokeStyle = NAVY; ctx.lineWidth = R * .07; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(-R * .38, -R * .16, R * .22, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(R * .38, -R * .16, R * .22, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-R * .16, -R * .18); ctx.lineTo(R * .16, -R * .18); ctx.stroke();
    ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(-R * .36, -R * .14, R * .07, 0, TAU); ctx.arc(R * .4, -R * .14, R * .07, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-R * .4, R * .3); ctx.quadraticCurveTo(-R * .2, R * .12, 0, R * .26); ctx.quadraticCurveTo(R * .2, R * .12, R * .4, R * .3); ctx.quadraticCurveTo(R * .2, R * .24, 0, R * .34); ctx.quadraticCurveTo(-R * .2, R * .24, -R * .4, R * .3); ctx.fill();
    const m = talk ? R * (.04 + .12 * Math.abs(Math.sin(t * 11))) : R * .04; ctx.beginPath(); ctx.ellipse(0, R * .5, R * .2, m, 0, 0, TAU); ctx.fill();
    ctx.restore(); }

  TT.scene(PX + "pesan", "Cerita: malam di jalan, pesan suara keluar dari ponsel jadi wajah direktur dari batang gelombang suara + tuntutan", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      mid: (ctx, c, sts, R) => { const P = R.f.pesan; if (!P) return; const st = sts[P.on ?? 0], hp = handOf(st), T0 = T(s, P.riseCue, .3, idx), k = t - T0;
        const tr = T(s, P.ringCue, .1, idx);
        if (t >= tr && t < T0 + .2){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ const q = (t * 2.2 + i / 3) % 1; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(hp[0], hp[1] - 60, 60 + q * 90, -.7, .7); ctx.stroke(); ctx.beginPath(); ctx.arc(hp[0], hp[1] - 60, 60 + q * 90, Math.PI - .7, Math.PI + .7); ctx.stroke(); } ctx.globalAlpha = 1; }
        if (k < 0) return; const fx = P.x ?? 720, fy = P.y ?? 640, R0 = P.r ?? 200;
        for (let i = 0; i < 5; i++){ const q = (k * 1.1 + i / 5) % 1, x = lerp(hp[0], fx, q), y = lerp(hp[1] - 70, fy + R0 * .9, q) - Math.sin(q * Math.PI) * 80; ctx.globalAlpha = Math.min(1, k * 2) * (1 - q) * .9; ctx.strokeStyle = SKY; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x, y, 26 + q * 40, -2.4, -.7); ctx.stroke(); }
        ctx.globalAlpha = 1; const q = eBack(clamp(k / .55, 0, 1)), sx = lerp(hp[0], fx, eOut(clamp(k / .55, 0, 1))), sy = lerp(hp[1] - 80, fy, eOut(clamp(k / .55, 0, 1)));
        waveFace(ctx, sx, sy + Math.sin(t * 2) * 10, R0, t, q, true);
        if (k > .4){ ctx.save(); ctx.globalAlpha = clamp((k - .4) / .3, 0, 1); chipW(ctx, P.name || "PAK HADI", fx, fy + R0 * 1.32, NAVY, "#FFFFFF", 34); ctx.restore(); } },
      over: (ctx, c, sts, R) => { const P = R.f.pesan; if (!P) return; (P.chips || []).forEach((ch, j) => { const k = t - T(s, ch.cue, .4, idx); if (k < 0) return; const sh = Math.sin(t * 30) * Math.max(0, 1 - k * 3) * 6;
        tag(ctx, ch.text, (ch.x ?? 540) + sh, ch.y ?? 320, k, ch.bg || RED, "#FFFFFF", ch.size || 44, ch.rot ?? (j % 2 ? .06 : -.06)); if (k < .9) burstFx(ctx, ch.x ?? 540, ch.y ?? 320, k, ch.bg || RED, 10, 150); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P = f.pesan; if (P){ add(cueT(s, P.ringCue, .1, i), "ping"); add(cueT(s, P.riseCue, .3, i), "whoosh"); (P.chips || []).forEach(ch => add(cueT(s, ch.cue, .4, i), "pop")); } });

  /* ---- wayang: shadow-puppet screen; the puppets are made by a hooded hand ---- */
  function silHead(ctx, kind, x, y, r){ // silhouette heads for the puppet screen
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    if (kind === "hijab"){ ctx.beginPath(); ctx.moveTo(x - r * 1.05, y - r * .1); ctx.quadraticCurveTo(x - r * 1.25, y + r * 1.4, x - r * .2, y + r * 1.55); ctx.lineTo(x + r * .9, y + r * 1.5); ctx.quadraticCurveTo(x + r * 1.3, y + r * .4, x + r * 1.02, y - r * .1); ctx.fill(); }
    if (kind === "kid"){ ctx.beginPath(); ctx.ellipse(x - r * .2, y - r * .85, r * .9, r * .45, -.2, 0, TAU); ctx.fill(); }
    if (kind === "cap"){ ctx.beginPath(); ctx.ellipse(x + r * .3, y - r * .7, r * 1.2, r * .32, 0, 0, TAU); ctx.fill(); }
    if (kind === "hadi"){ ctx.beginPath(); ctx.moveTo(x + r * .9, y - r * .1); ctx.lineTo(x + r * 1.25, y + r * .25); ctx.lineTo(x + r * .85, y + r * .35); ctx.fill(); }
  }
  function puppet(ctx, kind, x, y, s, t, col){ // body + head on rods, origin = neck
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-120, 330); ctx.quadraticCurveTo(-130, 60, -40, 20); ctx.lineTo(40, 20); ctx.quadraticCurveTo(130, 60, 120, 330); ctx.closePath(); ctx.fill();
    // carved ornaments (holes)
    ctx.save(); ctx.fillStyle = ctx.strokeStyle = "#F0CC92"; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.arc(-60 + i * 30, 160 + (i % 2) * 40, 9, 0, TAU); ctx.fill(); } ctx.restore();
    silHead(ctx, kind, 0, -70, 92);
    if (kind === "hadi"){ ctx.save(); ctx.fillStyle = ctx.strokeStyle = "#F0CC92"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(-30, -80, 24, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(34, -80, 24, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-28, -20); ctx.quadraticCurveTo(4, -36, 36, -20); ctx.stroke(); ctx.restore(); }
    ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 330); ctx.lineTo(0, 560); ctx.moveTo(-110, 200); ctx.lineTo(-160, 520); ctx.stroke();
    ctx.restore(); }
  function propPuppet(ctx, kind, x, y, s, col){ // FOTO / SUARA / VIDEO puppets
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 8;
    if (kind === "foto"){ rr(ctx, -110, -110, 220, 180, 12); ctx.fill(); ctx.save(); ctx.fillStyle = ctx.strokeStyle = "#F0CC92"; rr(ctx, -86, -86, 172, 132, 6); ctx.fill(); ctx.restore(); silHead(ctx, "hadi", 0, -30, 46); ctx.fillRect(-60, 20, 120, 26); }
    else if (kind === "suara"){ rr(ctx, -40, -130, 80, 130, 40); ctx.fill(); ctx.fillRect(-6, 0, 12, 60); ctx.lineWidth = 12; ctx.lineCap = "round"; for (let i = 0; i < 2; i++){ ctx.beginPath(); ctx.arc(0, -70, 80 + i * 40, -.7, .7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -70, 80 + i * 40, Math.PI - .7, Math.PI + .7); ctx.stroke(); } }
    else { rr(ctx, -130, -110, 260, 170, 16); ctx.fill(); ctx.save(); ctx.fillStyle = ctx.strokeStyle = "#F0CC92"; ctx.beginPath(); ctx.moveTo(-30, -70); ctx.lineTo(50, -25); ctx.lineTo(-30, 20); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(0, 360); ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "wayang", "Cerita: layar wayang kulit; bayangan direktur ternyata wayang (foto/suara/video) yang dimainkan tangan berkerudung AI", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const W = R.f.wayang; if (!W) return;
        const tF = T(s, W.trioCue, .4, idx), tH = T(s, W.handCue, .5, idx), tA = T(s, W.anyCue, .6, idx);
        let g = ctx.createLinearGradient(0, 0, 0, 1900); g.addColorStop(0, "#2A0E0E"); g.addColorStop(1, "#4A1A12"); ctx.fillStyle = g; ctx.fillRect(-600, -200, 2300, 2400);
        // kelir (screen) with lamp glow
        const L = 110, Rr = 970, Tp = 360, B = 1210, fl = .9 + .1 * Math.sin(t * 13) * Math.sin(t * 7.3);
        ctx.fillStyle = "#5A3A22"; ctx.fillRect(L - 40, Tp - 50, 30, B - Tp + 120); ctx.fillRect(Rr + 10, Tp - 50, 30, B - Tp + 120); rr(ctx, L - 60, Tp - 70, Rr - L + 120, 34, 10); ctx.fill(); ol(ctx, 5);
        g = ctx.createRadialGradient(540, 420, 40, 540, 700, 700); g.addColorStop(0, "#FFF1C9"); g.addColorStop(.6, "#F5D49A"); g.addColorStop(1, "#C98B4E"); ctx.fillStyle = g; ctx.fillRect(L, Tp, Rr - L, B - Tp);
        ctx.fillStyle = hexA("#FFFFFF", .15 * fl); ctx.fillRect(L, Tp, Rr - L, B - Tp); ctx.strokeStyle = "#B02A1E"; ctx.lineWidth = 16; ctx.strokeRect(L, Tp, Rr - L, B - Tp);
        ctx.save(); ctx.beginPath(); ctx.rect(L, Tp, Rr - L, B - Tp); ctx.clip();
        const sh = "rgba(43,20,14,.88)", wob = Math.sin(t * 2.2) * 8;
        // hooded faker (appears at handCue): big shadow behind
        const qh = t < tH ? 0 : eOut(clamp((t - tH) / .7, 0, 1));
        if (qh > 0){ ctx.save(); ctx.globalAlpha = .55 * qh; ctx.fillStyle = "#1A0A08"; ctx.translate(540, 1300 - 200 * qh); ctx.scale(1 + .25 * qh, 1 + .25 * qh);
          ctx.beginPath(); ctx.moveTo(-360, 0); ctx.quadraticCurveTo(-330, -300, -150, -340); ctx.quadraticCurveTo(-230, -560, -60, -740); ctx.quadraticCurveTo(0, -800, 60, -740); ctx.quadraticCurveTo(230, -560, 150, -340); ctx.quadraticCurveTo(330, -300, 360, 0); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.ellipse(0, -500, 110, 140, 0, 0, TAU); ctx.fill();
          ctx.globalAlpha = qh; ctx.fillStyle = "#FF8A3D"; ctx.beginPath(); ctx.ellipse(-45, -520, 24, 11 + 4 * Math.sin(t * 3), .15, 0, TAU); ctx.ellipse(45, -520, 24, 11 + 4 * Math.sin(t * 3), -.15, 0, TAU); ctx.fill(); ctx.restore(); }
        // main Pak Hadi puppet (moves left when the trio arrives, morphs at anyCue)
        const qT = t < tF ? 0 : eOut(clamp((t - tF) / .6, 0, 1)), qA = t < tA ? 0 : 1;
        const kinds = ["hadi", "hijab", "kid", "cap"], kind = qA ? kinds[Math.floor((t - tA) / .38) % 4] : "hadi";
        const px = lerp(540, 540, qT), py = lerp(640, 600, qT) + wob, ps = lerp(1, .75, qT);
        if (!qT || qA) puppet(ctx, kind, qA ? 540 : px, qA ? 640 + wob : py, qA ? 1 : ps, t, sh);
        // three puppets FOTO / SUARA / VIDEO slide up (staggered)
        if (qT > 0 && !qA) ["foto", "suara", "video"].forEach((k2, j) => { const qq = t - tF - j * .55 < 0 ? 0 : eBack(clamp((t - tF - j * .55) / .45, 0, 1)); if (qq <= 0) return;
          propPuppet(ctx, k2, 250 + j * 290, 760 + (1 - qq) * 600 + Math.sin(t * 3 + j) * 10, 1, sh); });
        // hand holding the rods
        if (qh > 0){ ctx.save(); ctx.fillStyle = "#1A0A08"; ctx.globalAlpha = .9 * qh; ctx.translate(540 + Math.sin(t * 2.2) * 8, 1250 - 120 * qh); ctx.beginPath(); ctx.ellipse(0, 0, 120, 70, 0, 0, TAU); ctx.fill();
          for (let i = 0; i < 4; i++){ rr(ctx, -100 + i * 52, -110, 40, 90, 20); ctx.fill(); } ctx.restore(); }
        ctx.restore();
        // blencong lamp
        ctx.save(); ctx.translate(540, 300 + Math.sin(t * 1.5) * 3); ctx.fillStyle = "#C9A227"; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(0, 50, 60, 0); ctx.lineTo(30, -30); ctx.lineTo(-30, -30); ctx.closePath(); ctx.fill(); ol(ctx, 5);
        glowAt(ctx, 0, -20, 120 * fl, "#FFD27A", .8); ctx.fillStyle = "#FFB238"; ctx.beginPath(); ctx.ellipse(0, -40 - 6 * fl, 12, 24 * fl, 0, 0, TAU); ctx.fill(); ctx.restore();
        // banana trunk + floor
        ctx.fillStyle = "#6E7F3A"; rr(ctx, 40, B - 10, 1000, 90, 40); ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#4E5E26"; ctx.lineWidth = 4; for (let i = 0; i < 8; i++){ ctx.beginPath(); ctx.moveTo(90 + i * 120, B + 5); ctx.lineTo(120 + i * 120, B + 65); ctx.stroke(); }
        ctx.fillStyle = "#2A140C"; ctx.fillRect(-600, B + 80, 2300, 900); },
      over: (ctx, c, sts, R) => { const W = R.f.wayang; if (!W) return; const tF = T(s, W.trioCue, .4, idx), tH = T(s, W.handCue, .5, idx), tA = T(s, W.anyCue, .6, idx);
        if (t < tA) ["FOTO", "SUARA", "VIDEO"].forEach((x, j) => { const p = scr(R.c, 250 + j * 290, 1000); tag(ctx, x, p[0], Math.min(p[1], 1220), t - tF - j * .55 - .2, ORANGE, "#FFFFFF", 38, j % 2 ? .05 : -.05); });
        tag(ctx, "DIBUAT AI", 540, 300, t - tH - .2, RED, "#FFFFFF", 54, -.05);
        if (t > tA) tag(ctx, "SIAPA PUN BISA DITIRU", 540, 420, t - tA, NAVY, "#FFFFFF", 40, .03); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const W = f.wayang; if (W){ [0, .55, 1.1].forEach(d => add(cueT(s, W.trioCue, .4, i) + d, "pop")); add(cueT(s, W.handCue, .5, i), "whoosh"); add(cueT(s, W.anyCue, .6, i), "ping"); } });

  /* ---- serigala berbulu domba: the fake message as a sheep costume, three tells pop out ---- */
  function wolfSheep(ctx, t, o){ // origin = ground centre, facing left (towards Ratna)
    const tail = o.tail || 0, ears = o.ears || 0, claw = o.claw || 0, off = o.off || 0, run = o.run || 0;
    ctx.save(); const bob = run ? Math.abs(Math.sin(t * 16)) * 14 : Math.sin(t * 2.4) * 4; ctx.translate(0, -bob);
    // legs
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; [-90, -40, 50, 100].forEach((lx, i) => { const sw = run ? Math.sin(t * 16 + i * 1.6) * 30 : 0; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(lx, -160); ctx.lineTo(lx + sw, bob - 6); ctx.stroke(); ctx.strokeStyle = "#7D7A80"; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = OUT; });
    // tail (wolf, bushy)
    if (tail > 0){ ctx.save(); ctx.translate(170, -250); ctx.rotate(-.6 + Math.sin(t * 9) * .35); ctx.scale(tail, tail); ctx.beginPath(); ctx.ellipse(70, 0, 90, 34, 0, 0, TAU); ctx.fillStyle = "#7D7A80"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(130, 0, 30, 22, 0, 0, TAU); ctx.fillStyle = "#E9E4DC"; ctx.fill(); ctx.restore(); }
    // wolf body (visible when fleece off)
    ctx.beginPath(); ctx.ellipse(0, -260, 190, 120, 0, 0, TAU); ctx.fillStyle = "#7D7A80"; ctx.fill(); ol(ctx, 6);
    // fleece
    if (off < 1){ ctx.save(); ctx.translate(off * 260, -off * 520); ctx.rotate(off * .8); ctx.globalAlpha *= 1 - off * .6;
      ctx.fillStyle = "#FFFDF6"; for (let i = 0; i < 14; i++){ const a = i / 14 * TAU, rx = 200, ry = 130; ctx.beginPath(); ctx.arc(Math.cos(a) * rx * .85, -260 + Math.sin(a) * ry * .85, 62 + rnd(i) * 18, 0, TAU); ctx.fill(); ol(ctx, 5); }
      ctx.beginPath(); ctx.ellipse(0, -260, 200, 128, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    // ears (wolf, pointy) behind the head
    const hx = -200, hy = -390;
    if (ears > 0){ [[-60, -1], [30, 1]].forEach(([ex, d]) => { ctx.save(); ctx.translate(hx + ex, hy - 80); ctx.scale(1, ears); ctx.beginPath(); ctx.moveTo(-34, 30); ctx.lineTo(d * 10, -90 - Math.sin(t * 8 + ex) * 6); ctx.lineTo(34, 30); ctx.closePath(); ctx.fillStyle = "#7D7A80"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = PINK; ctx.beginPath(); ctx.moveTo(-14, 20); ctx.lineTo(d * 6, -50); ctx.lineTo(14, 20); ctx.fill(); ctx.restore(); }); }
    // wolf head
    ctx.save(); ctx.translate(hx, hy); ctx.beginPath(); ctx.ellipse(0, 0, 110, 96, 0, 0, TAU); ctx.fillStyle = "#7D7A80"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(-60, 10); ctx.lineTo(-190, 40); ctx.quadraticCurveTo(-200, 70, -170, 80); ctx.lineTo(-50, 70); ctx.closePath(); ctx.fillStyle = "#9A979C"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-188, 50, 14, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-160 + i * 24, 74); ctx.lineTo(-150 + i * 24, 96); ctx.lineTo(-140 + i * 24, 74); ctx.fill(); }
    ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.ellipse(-40, -20, 22, 16, -.2, 0, TAU); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(-44, -20, 6, 13, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // sheep mask over the head (drops off)
    if (off < 1){ ctx.save(); ctx.translate(hx - 40 - off * 200, hy + 10 + off * 500); ctx.rotate(-off * 1.4); ctx.globalAlpha *= 1 - off;
      ctx.fillStyle = "#FFFDF6"; for (let i = 0; i < 7; i++){ ctx.beginPath(); ctx.arc(-70 + i * 24, -86 + Math.sin(i * 2) * 8, 34, 0, TAU); ctx.fill(); ol(ctx, 4); }
      ctx.beginPath(); ctx.ellipse(0, 0, 112, 100, 0, 0, TAU); ctx.fillStyle = "#F6E7D6"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-40, -10, 13, 0, TAU); ctx.arc(30, -10, 13, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(-36, -14, 5, 0, TAU); ctx.arc(34, -14, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = PINK; ctx.beginPath(); ctx.ellipse(-60, 24, 18, 10, 0, 0, TAU); ctx.ellipse(50, 24, 18, 10, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-6, 30, 22, .3, Math.PI - .3); ctx.stroke(); ctx.restore(); }
    // claw holding a money bag
    if (claw > 0){ ctx.save(); ctx.translate(-150, -200); ctx.scale(claw, claw); ctx.rotate(Math.sin(t * 5) * .1);
      ctx.beginPath(); ctx.ellipse(-60, 0, 70, 38, 0, 0, TAU); ctx.fillStyle = "#7D7A80"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-120, -20 + i * 20); ctx.lineTo(-150, -14 + i * 20); ctx.lineTo(-120, -6 + i * 20); ctx.fill(); }
      ctx.translate(-150, -40); ctx.beginPath(); ctx.moveTo(-40, -40); ctx.quadraticCurveTo(-90, 60, 0, 70); ctx.quadraticCurveTo(90, 60, 40, -40); ctx.closePath(); ctx.fillStyle = "#C9A227"; ctx.fill(); ol(ctx, 6); textC(ctx, "Rp", 0, 34, 40, OUT, 900); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "serigala", "Cerita: pesan palsu = serigala berbulu domba; ekor/telinga/cakar (mendesak, rahasia, minta uang) menyembul, STOP, bulu domba lepas", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      mid: (ctx, c, sts, R) => { const S = R.f.serigala; if (!S) return; const q = (cue, d) => { const T0 = T(s, cue, .4, idx); return t < T0 ? 0 : eBack(clamp((t - T0) / (d || .45), 0, 1)); };
        const tOff = T(s, S.offCue, .5, idx), off = t < tOff ? 0 : eOut(clamp((t - tOff) / .9, 0, 1)), tRun = tOff + .9, run = t > tRun ? 1 : 0;
        const x = (S.x ?? 740) + (run ? eOut(clamp((t - tRun) / 1.4, 0, 1)) * 900 : 0), sc = S.s ?? 1.25;
        ctx.save(); ctx.translate(x, GY); ctx.scale(sc * (run ? -1 : 1), sc); wolfSheep(ctx, t, { tail: q(S.tailCue), ears: q(S.earCue), claw: q(S.clawCue), off, run }); ctx.restore();
        if (off > 0 && off < 1) for (let i = 0; i < 10; i++){ const a = rnd(i) * TAU, r = 120 + off * 260; ctx.fillStyle = hexA("#FFFDF6", 1 - off); ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, GY - 330 * sc + Math.sin(a) * r - off * 200, 22, 0, TAU); ctx.fill(); } },
      over: (ctx, c, sts, R) => { const S = R.f.serigala; if (!S) return; const sc = S.s ?? 1.25, x = S.x ?? 740, tOff = T(s, S.offCue, .5, idx);
        const L = [[S.tailCue, "MENDESAK", x + 230 * sc, GY - 420 * sc], [S.earCue, "MINTA DIRAHASIAKAN", x - 190 * sc, GY - 620 * sc], [S.clawCue, "MINTA UANG / DATA", x - 260 * sc, GY - 130 * sc]];
        L.forEach(([cue, txt, wx, wy], j) => { const k = t - T(s, cue, .4, idx); if (k < 0 || t > tOff + .3) return; const p = scr(R.c, wx, wy); tag(ctx, txt, clamp(p[0], 620, 860), clamp(p[1], 250, 1230), k, RED, "#FFFFFF", 38, j % 2 ? .05 : -.05); });
        const kc = t - T(s, S.checkCue, .5, idx); if (kc >= 0){ tag(ctx, "CEK KE SUMBER RESMI", 540, 330, kc, GREEN, "#FFFFFF", 50, -.04); if (kc < .9) burstFx(ctx, 540, 330, kc, GREEN, 12, 240); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.serigala; if (S){ [S.tailCue, S.earCue, S.clawCue].forEach(c => add(cueT(s, c, .4, i), "pop")); add(cueT(s, S.offCue, .5, i), "whoosh"); add(cueT(s, S.checkCue, .5, i), "chime"); } });

  /* ---- BG: lesehan dinner at home (Pak Hadi) ---- */
  BG.lesehan = (ctx, t, o) => { const x = o.x ?? 560;
    ctx.fillStyle = "#B5643C"; rr(ctx, x - 470, GY - 18, 940, 30, 12); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#FFFFFF", .3); ctx.lineWidth = 4; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.moveTo(x - 440 + i * 105, GY - 14); ctx.lineTo(x - 440 + i * 105, GY + 8); ctx.stroke(); }
    (o.cush || []).forEach(cx => { rr(ctx, cx - 110, GY - 70, 220, 60, 26); ctx.fillStyle = "#8E3B5A"; ctx.fill(); ol(ctx, 5); });
    // low table
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(x - 150, GY - 140, 24, 130); ctx.fillRect(x + 126, GY - 140, 24, 130); rr(ctx, x - 190, GY - 170, 380, 38, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
    [[-110, "#FFFFFF"], [0, "#FFF4E6"], [110, "#FFFFFF"]].forEach(([dx, col], i) => { ctx.beginPath(); ctx.ellipse(x + dx, GY - 176, 46, 14, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); });
    ctx.beginPath(); ctx.arc(x, GY - 196, 30, Math.PI, 0); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); smoke(ctx, x, GY - 230, t, 1, { n: 4, h: 140, col: "#FFFFFF", s: .5 }); };

  /* ======================= JS50 Tularkan praktik baik (kurir) ======================= */
  const BOXC = ["#D9A066", "#C98B4E", "#E2B57A", "#B97A44", "#D49A5C", "#E0AE70"];
  function parcel(ctx, x, y, w, h, num, o){ // origin = bottom centre
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    if (o.glow) glowAt(ctx, 0, -h / 2, w * 1.1, GOLD, .7 * o.glow);
    rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = o.col || BOXC[(num || 0) % BOXC.length]; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#8E4E2E", .55); ctx.fillRect(-w * .09, -h, w * .18, h);
    if (num != null){ ctx.beginPath(); ctx.arc(0, -h / 2, Math.min(w, h) * .3, 0, TAU); ctx.fillStyle = o.numBg || "#FFFDF6"; ctx.fill(); ol(ctx, 4); textC(ctx, String(num), 0, -h / 2 + Math.min(w, h) * .13, Math.min(w, h) * .36, o.numCol || OUT, 900); }
    ctx.restore(); }
  function motor(ctx, x, y, o, t){ // side-view scooter, origin = ground centre; o: {face, s, col, box (false|{x,col,open}), spin, pillion}
    o = o || {}; const f = o.face || 1, s = o.s || 1, col = o.col || "#D9483B", spin = o.spin || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 260, 18, 0, 0, TAU); ctx.fill();
    const wheel = (wx) => { ctx.save(); ctx.translate(wx, -60); ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fillStyle = "#2B2730"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#B8B4BC"; ctx.fill(); ol(ctx, 4);
      ctx.rotate(spin); ctx.strokeStyle = "#5A5560"; ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(28, 0); ctx.stroke(); } ctx.restore(); };
    wheel(-150); wheel(150);
    // rear body
    ctx.beginPath(); ctx.moveTo(-230, -120); ctx.quadraticCurveTo(-240, -215, -150, -222); ctx.lineTo(-20, -222); ctx.quadraticCurveTo(10, -150, -10, -100); ctx.lineTo(-200, -100); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    // floor + front shield
    rr(ctx, -40, -112, 150, 26, 8); ctx.fillStyle = "#3B3540"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(90, -100); ctx.quadraticCurveTo(170, -150, 150, -300); ctx.lineTo(110, -320); ctx.quadraticCurveTo(120, -180, 60, -110); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(150, -60); ctx.lineTo(130, -320); ctx.stroke(); // fork
    ctx.beginPath(); ctx.moveTo(110, -330); ctx.lineTo(70, -345); ctx.stroke(); ctx.fillStyle = OUT; rr(ctx, 40, -356, 46, 20, 8); ctx.fill(); // handlebar + grip
    ctx.beginPath(); ctx.ellipse(160, -270, 20, 26, 0, 0, TAU); ctx.fillStyle = "#FFF4C2"; ctx.fill(); ol(ctx, 4); // headlamp
    rr(ctx, -190, -242, 175, 26, 12); ctx.fillStyle = "#2B2730"; ctx.fill(); ol(ctx, 4); // seat
    if (o.box){ const b = o.box, bx = b.x ?? -205; ctx.save(); ctx.translate(bx, -232); ctx.fillStyle = "#3B3540"; ctx.fillRect(-60, -6, 120, 12);
      rr(ctx, -78, -150, 156, 146, 14); ctx.fillStyle = b.col || "#F6C343"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .3); rr(ctx, -66, -138, 30, 120, 8); ctx.fill();
      ctx.save(); ctx.translate(-78, -150); ctx.rotate(-(b.open || 0) * 1.1); rr(ctx, 0, -18, 156, 22, 8); ctx.fillStyle = b.col || "#F6C343"; ctx.fill(); ol(ctx, 5); ctx.restore();
      if (b.label){ ctx.save(); ctx.scale(f, 1); textC(ctx, b.label, 0, -66, 24, OUT, 900, 130); ctx.restore(); }
      ctx.restore(); }
    ctx.restore(); }
  const boxTop = (o) => { const f = o.face || 1, s = o.s || 1, bx = (o.box && o.box.x) ?? -205; return [o.x + bx * s * f, o.y - (232 + 150) * s]; };

  /* BG: house gate with number (customer's house) */
  BG.gerbang = (ctx, t, o) => { const x0 = o.x ?? 700;
    ctx.fillStyle = "#F3E6D2"; ctx.fillRect(x0 - 40, GY - 760, 900, 760); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x0 - 40, GY - 760, 900, 760);
    ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(x0 - 100, GY - 750); ctx.lineTo(x0 + 410, GY - 960); ctx.lineTo(x0 + 920, GY - 750); ctx.closePath(); ctx.fill(); ol(ctx, 6);
    rr(ctx, x0 + 80, GY - 600, 180, 150, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
    // fence + gate
    ctx.fillStyle = "#3B4A6B"; for (let i = 0; i < 14; i++){ rr(ctx, x0 - 60 + i * 62, GY - 330, 16, 330, 6); ctx.fill(); } rr(ctx, x0 - 70, GY - 300, 880, 18, 6); ctx.fill(); rr(ctx, x0 - 70, GY - 120, 880, 18, 6); ctx.fill();
    rr(ctx, x0 + 40, GY - 470, 130, 64, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); textC(ctx, o.num || "No. 12", x0 + 105, GY - 425, 34, OUT, 900); };
  /* BG: courier branch front */
  BG.cabang = (ctx, t, o) => { const x0 = o.x ?? 540;
    ctx.fillStyle = "#F3E6D2"; ctx.fillRect(x0 - 700, GY - 880, 1400, 880); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x0 - 700, GY - 880, 1400, 880);
    ctx.fillStyle = "#2E4A7A"; ctx.fillRect(x0 - 720, GY - 940, 1440, 90); ol(ctx, 6);
    rr(ctx, x0 - 260, GY - 1000, 520, 110, 16); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 6); textC(ctx, o.name || "CABANG BARAT", x0, GY - 928, 56, OUT, 900, 480);
    // rolling door
    rr(ctx, x0 - 300, GY - 640, 600, 640, 6); ctx.fillStyle = "#B8B4BC"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#8C8890"; ctx.lineWidth = 4; for (let i = 0; i < 14; i++){ ctx.beginPath(); ctx.moveTo(x0 - 296, GY - 610 + i * 44); ctx.lineTo(x0 + 296, GY - 610 + i * 44); ctx.stroke(); }
    ctx.fillStyle = "#BFE2EA"; [-520, 420].forEach(dx => { rr(ctx, x0 + dx, GY - 620, 100, 200, 8); ctx.fill(); ol(ctx, 5); }); };

  /* ---- _bongkar: courier digs through his whole topbox at the customer's gate ---- */
  TT.scene(PX + "bongkar", "Cerita: kurir membongkar seluruh isi boks motor di depan gerbang pelanggan, paket beterbangan menumpuk", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const B = R.f.bongkar; if (!B) return; const T0 = T(s, B.digCue, .3, idx), n = B.n || 8, M = Object.assign({ y: GY, face: 1, s: 1 }, B.motor);
        const op = t < T0 ? 0 : clamp((t - T0) / .3, 0, 1); const bt = boxTop(M);
        motor(ctx, M.x, GY, Object.assign({}, M, { box: Object.assign({}, M.box || {}, { open: op }) }), t);
        for (let i = 0; i < n; i++){ const ti = T0 + .2 + i * (B.gap || .55), k = t - ti; if (k < 0) continue; const land = B.land[i % B.land.length];
          const q = clamp(k / .7, 0, 1); if (q < 1) continue; const sq = k < .85 ? 1 - Math.sin((k - .7) / .15 * Math.PI) * .15 : 1; ctx.save(); ctx.translate(land[0], GY - (land[1] || 0)); ctx.scale(1 / sq, sq); parcel(ctx, 0, 0, 120, 96, (B.nums || [])[i], { rot: (rnd(i) - .5) * .4 }); ctx.restore(); }
        // flying parcels
        for (let i = 0; i < n; i++){ const ti = T0 + .2 + i * (B.gap || .55), k = t - ti; if (k < 0) continue; const land = B.land[i % B.land.length], q = clamp(k / .7, 0, 1); if (q >= 1) continue;
          const x = lerp(bt[0], land[0], q), y = lerp(bt[1], GY - (land[1] || 0), q) - Math.sin(q * Math.PI) * 380; parcel(ctx, x, y, 120, 96, (B.nums || [])[i], { rot: q * 6 * (i % 2 ? 1 : -1) });
          ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 70, y - 40); ctx.lineTo(x - 130, y - 20); ctx.stroke(); }
        // dust puffs
        if (op > 0) smoke(ctx, bt[0], bt[1] + 40, t, .6, { n: 5, h: 160, col: "#C9B8A0", s: .7 }); },
      over: (ctx, c, sts, R) => { const B = R.f.bongkar; if (!B) return; const k = t - T(s, B.lateCue, .4, idx); if (k >= 0){ tag(ctx, B.late || "TELAT 40 MENIT", 540, 300, k, RED, "#FFFFFF", 52, -.05); if (k < .9) burstFx(ctx, 540, 300, k, RED, 10, 220); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bongkar; if (B){ const T0 = cueT(s, B.digCue, .3, i); for (let j = 0; j < (B.n || 8); j++) add(T0 + .2 + j * (B.gap || .55), j % 2 ? "whoosh" : "pop"); add(cueT(s, B.lateCue, .4, i), "ping"); } });

  /* ---- _urut: cross-section of the topbox, parcels stacked by route order, mini route above ---- */
  TT.scene(PX + "urut", "Cerita: penampang boks motor, paket disusun 5..1 sesuai urutan rute; rute rumah bernomor di atas, motor kecil mengantar", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const U = R.f.urut; if (!U) return; const n = U.n || 5, bx = U.x ?? 330, by = U.y ?? 1330, bw = 400, bh = 640;
        const tS = T(s, U.stackCue, .3, idx), t1 = T(s, U.firstCue, .4, idx), tL = T(s, U.lastCue, .4, idx), tR = T(s, U.routeCue, .3, idx);
        // route (houses 1..n) along the top
        const rq = t < tR ? 0 : eOut(clamp((t - tR) / .6, 0, 1));
        if (rq > 0){ ctx.save(); ctx.globalAlpha = rq; const hx = i => 150 + i * (780 / (n - 1)), hy = i => 470 + (i % 2) * 60;
          ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.setLineDash([2, 34]); ctx.beginPath(); for (let i = 0; i < n; i++) ctx.lineTo(hx(i), hy(i) + 70); ctx.stroke(); ctx.setLineDash([]);
          for (let i = 0; i < n; i++){ const lit = (i === 0 && t > t1) || (i === n - 1 && t > tL), x = hx(i), y = hy(i);
            if (lit) glowAt(ctx, x, y, 110, GOLD, .7);
            ctx.beginPath(); ctx.moveTo(x - 55, y); ctx.lineTo(x, y - 55); ctx.lineTo(x + 55, y); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5);
            rr(ctx, x - 44, y, 88, 66, 6); ctx.fillStyle = lit ? GOLD : "#FFF4E6"; ctx.fill(); ol(ctx, 5); textC(ctx, String(i + 1), x, y + 52, 40, OUT, 900); }
          // mini scooter travelling the route
          const u = ((t - tR) * .18) % 1, seg = u * (n - 1), i0 = Math.floor(seg), fr = seg - i0, mx = lerp(hx(i0), hx(Math.min(n - 1, i0 + 1)), fr), my = lerp(hy(i0), hy(Math.min(n - 1, i0 + 1)), fr) + 70;
          motor(ctx, mx, my + 28, { s: .2, col: "#2E4A7A", spin: t * 20, box: { col: "#F6C343" } }, t); ctx.restore(); }
        // topbox cross-section
        const q0 = t < tS ? 0 : 1;
        ctx.save(); ctx.translate(bx, by); glowAt(ctx, 0, -bh / 2, 420, "#4FD1E0", .2);
        rr(ctx, -bw / 2 - 22, -bh - 22, bw + 44, bh + 44, 30); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 7);
        rr(ctx, -bw / 2, -bh, bw, bh, 18); ctx.fillStyle = "#2B2730"; ctx.fill(); ol(ctx, 5);
        textC(ctx, "BOKS WATI", 0, -bh - 40, 38, OUT, 900);
        const ph = (bh - 30) / n;
        for (let j = n - 1; j >= 0; j--){ const order = n - 1 - j, td = tS + order * .38, k = t - td; if (!q0 || k < 0) continue; // bottom (n) first
          const yy = -10 - (n - 1 - j) * ph, drop = (1 - eOut(clamp(k / .35, 0, 1))) * -700, bounce = k > .35 && k < .6 ? Math.sin((k - .35) / .25 * Math.PI) * -12 : 0;
          const glow = (j === 0 && t > t1) ? .5 + .5 * Math.sin(t * 8) : (j === n - 1 && t > tL) ? .5 + .5 * Math.sin(t * 8) : 0;
          const lift = (j === 0 && t > t1 && t < tL) ? -Math.min(1, (t - t1) * 3) * 40 : 0;
          parcel(ctx, 0, yy + drop + bounce + lift, bw - 40, ph - 12, j + 1, { glow, numBg: glow ? GOLD : "#FFFDF6" }); }
        const lidUp = t < tS ? 0 : eOut(clamp((t - tS) / .5, 0, 1)); if (lidUp < 1){ ctx.save(); ctx.translate(0, -lidUp * (bh + 40) + Math.sin(t * 3) * 6 * (1 - lidUp)); ctx.globalAlpha *= 1 - lidUp * .7;
          rr(ctx, -bw / 2 - 22, -bh - 22, bw + 44, bh + 44, 30); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = hexA("#FFFFFF", .35); rr(ctx, -bw / 2, -bh, 50, bh - 40, 16); ctx.fill();
          rr(ctx, -120, -bh / 2 - 60, 240, 120, 20); ctx.fillStyle = "#2E4A7A"; ctx.fill(); ol(ctx, 5); textC(ctx, "KURIR", 0, -bh / 2 + 16, 48, "#FFFFFF", 900); ctx.restore(); }
        ctx.restore(); },
      over: (ctx, c, sts, R) => { const U = R.f.urut; if (!U) return; const bx = U.x ?? 330, by = U.y ?? 1330, bh = 640, n = U.n || 5, ph = (bh - 30) / n;
        const p1 = scr(R.c, bx + 250, by - 10 - (n - 1) * ph - ph / 2), pL = scr(R.c, bx + 250, by - 10 - ph / 2);
        tag(ctx, "1 = ALAMAT PERTAMA", Math.max(p1[0], 640), p1[1], t - T(s, U.firstCue, .5, idx), ORANGE, "#FFFFFF", 40, -.04);
        tag(ctx, "TERAKHIR = BAWAH", Math.max(pL[0], 640), pL[1] - 60, t - T(s, U.lastCue, .5, idx), NAVY, "#FFFFFF", 40, .04); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const U = f.urut; if (U){ const tS = cueT(s, U.stackCue, .3, i); for (let j = 0; j < (U.n || 5); j++) add(tS + j * .38 + .3, "pop"); add(cueT(s, U.firstCue, .4, i), "chime"); add(cueT(s, U.lastCue, .4, i), "chime"); add(cueT(s, U.routeCue, .3, i), "whoosh"); } });

  /* ---- _bonceng: coordinator rides pillion on the courier's scooter, scribbling notes; then they stop and agree ---- */
  TT.scene(PX + "bonceng", "Cerita: kepala cabang membonceng kurir seharian di jalan desa, mencatat di buku kecil; lalu berhenti dan mengajaknya melatih tim", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const B = R.f.bonceng; if (!B) return; const mv = B.moving !== false, sp = mv ? (B.speed || 900) : 0;
        // roadside posts + trees scrolling
        const off = (t * sp) % 520; for (let i = -1; i < 5; i++){ const x = i * 520 - off + 200, tree = (i + Math.floor(t * sp / 520)) % 2 === 0;
          if (tree){ ctx.fillStyle = "#6B4A2E"; ctx.fillRect(x - 14, GY - 360, 28, 300); ctx.beginPath(); ctx.arc(x, GY - 400, 120, 0, TAU); ctx.fillStyle = "#4E8B4A"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(x - 60, GY - 350, 70, 0, TAU); ctx.fill(); ol(ctx, 5); }
          else { ctx.fillStyle = "#FFFDF6"; rr(ctx, x - 12, GY - 200, 24, 150, 6); ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(x - 12, GY - 200, 24, 30); } }
        // road
        ctx.fillStyle = "#5A5560"; ctx.fillRect(-500, GY - 50, 2100, 260); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-500, GY - 50); ctx.lineTo(1600, GY - 50); ctx.stroke();
        ctx.fillStyle = "#FFFDF6"; const o2 = (t * sp * 1.0) % 240; for (let i = -1; i < 10; i++) rr(ctx, i * 240 - o2 - 200, GY + 50, 120, 16, 8), ctx.fill(); },
      under: (ctx, c, sts, j, R) => { const B = R.f.bonceng; if (!B || j !== (B.under ?? 0)) return; const mv = B.moving !== false;
        const M = Object.assign({ x: 540, face: 1, s: 1.05, col: "#2E4A7A", box: false }, B.motor); const vib = mv ? Math.sin(t * 40) * 2 : 0;
        if (mv) for (let i = 0; i < 4; i++){ const q = (t * 1.6 + i / 4) % 1; ctx.fillStyle = hexA("#C9C4BC", .5 * (1 - q)); ctx.beginPath(); ctx.arc(M.x - 300 * M.s - q * 300, GY - 60 - q * 80, 24 + q * 40, 0, TAU); ctx.fill(); }
        motor(ctx, M.x, GY + vib, Object.assign({}, M, { spin: mv ? t * 18 : 0 }), t); },
      over: (ctx, c, sts, R) => { const B = R.f.bonceng; if (!B) return; (B.notes || []).forEach((n, j) => { const k = t - T(s, n.cue, .4, idx); tag(ctx, n.text, n.x ?? 540, n.y ?? 330 + j * 90, k, j === (B.notes.length - 1) ? ORANGE : NAVY, "#FFFFFF", 38, j % 2 ? .04 : -.04); });
        if (B.moving !== false){ ctx.save(); ctx.globalAlpha = .55; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 7; i++){ const y = 560 + i * 110 + Math.sin(i * 3) * 30, x = 1100 - ((t * 1500 + i * 230) % 1300); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 140, y); ctx.stroke(); } ctx.restore(); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bonceng; if (B) (B.notes || []).forEach(n => add(cueT(s, n.cue, .4, i), "pop")); });
  ITEMS.notebook = (ctx, t, o) => { ctx.rotate(-.25); rr(ctx, -70, -100, 140, 100, 8); ctx.fillStyle = o.col || "#2F6F73"; ctx.fill(); ol(ctx, 5); rr(ctx, -62, -94, 124, 88, 4); ctx.fillStyle = PAPER; ctx.fill();
    ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++) ctx.fillRect(-50, -84 + i * 20, 60 + Math.sin(t * 6 + i) * 20, 6);
    const pg = (t * 1.5) % 1; ctx.save(); ctx.translate(62, -50); ctx.scale(Math.cos(pg * Math.PI), 1); rr(ctx, -124, -44, 124, 88, 4); ctx.fillStyle = hexA(PAPER, .9); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(30 + Math.sin(t * 9) * 12, -60); ctx.rotate(.6); rr(ctx, -6, -70, 12, 80, 4); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore(); };

  /* ---- _latih: at the branch, the courier loads parcels in route order; background couriers copy the move ---- */
  TT.scene(PX + "latih", "Cerita: depan kantor cabang, kurir memuat paket 5..1 ke boks sesuai rute; kurir lain di belakang ikut meniru serentak", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const L = R.f.latih; if (!L) return; const tC = T(s, L.copyCue, .3, idx), tS = T(s, L.loadCue, .3, idx), n = L.n || 5;
        // background couriers (smaller, further back) copying
        (L.copies || []).forEach((cp, j) => { const M = { x: cp.x, y: GY - 270, face: 1, s: .45, col: cp.col || "#2E4A7A", box: { col: "#F6C343", open: t > tC ? 1 : 0 } }; ctx.save(); ctx.globalAlpha = .92;
          motor(ctx, M.x, M.y, M, t); const bt = boxTop(M);
          for (let i = 0; i < n; i++){ const k = t - tC - i * .4 - j * .15; if (k < 0) continue; const q = clamp(k / .5, 0, 1); if (q >= 1) continue; const sx = cp.x + 150, sy = M.y;
            parcel(ctx, lerp(sx, bt[0], q), lerp(sy, bt[1] + 40, q) - Math.sin(q * Math.PI) * 160, 50, 40, n - i, { rot: q * 3 }); }
          if (t < tC + n * .4 + .5){ for (let i = 0; i < n; i++){ const k = t - tC - i * .4 - j * .15; if (k >= 0) continue; parcel(ctx, cp.x + 150, M.y, 46, 36, null); } }
          ctx.restore(); });
        // main motor + cart
        const M = Object.assign({ x: 380, y: GY, face: 1, s: 1, col: "#2E4A7A" }, L.motor); const bt = boxTop(M), open = t > tS ? 1 : 0;
        motor(ctx, M.x, GY, Object.assign({}, M, { box: { col: "#F6C343", open, label: "" } }), t);
        const cx = L.cartX ?? 980; rr(ctx, cx - 110, GY - 70, 220, 24, 8); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 4); [cx - 80, cx + 80].forEach(wx => { ctx.beginPath(); ctx.arc(wx, GY - 22, 22, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
        for (let i = 0; i < n; i++){ const ti = tS + .2 + i * (L.gap || .5), k = t - ti, num = n - i; // load 5 first (bottom)
          if (k < 0){ parcel(ctx, cx, GY - 70 - (n - 1 - i) * 74, 130, 70, num); continue; }
          const q = clamp(k / .6, 0, 1); if (q < 1){ parcel(ctx, lerp(cx, bt[0], q), lerp(GY - 70 - (n - 1 - i) * 74, bt[1] + 60, q) - Math.sin(q * Math.PI) * 420, 130, 70, num, { rot: q * TAU * (i % 2 ? 1 : -1) }); } } },
      over: (ctx, c, sts, R) => { const L = R.f.latih; if (!L) return; const n = L.n || 5, tS = T(s, L.loadCue, .3, idx);
        for (let i = 0; i < n; i++){ const k = t - tS - .2 - i * (L.gap || .5) - .6; if (k < 0 || k > .8) continue; const M = Object.assign({ x: 380, face: 1, s: 1 }, L.motor), bt = boxTop(Object.assign({ y: GY }, M)), p = scr(R.c, bt[0], bt[1] - 40); popWord(ctx, String(n - i), p[0], p[1], k, { size: 90, hold: .8 }); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.latih; if (L){ const tS = cueT(s, L.loadCue, .3, i); for (let j = 0; j < (L.n || 5); j++) add(tS + .2 + j * (L.gap || .5) + .55, "pop"); add(cueT(s, L.copyCue, .3, i), "whoosh"); } });

  /* ======================= SC50 Siapkan hari tua (JHT & JP) ======================= */
  function coinWalker(ctx, x, y, r, t, o){ // y = feet; o: {label, phase, carry (envelope), face}
    o = o || {}; const ph = t * 10 + (o.phase || 0), f = o.face || 1, bob = Math.abs(Math.sin(ph)) * r * .12;
    ctx.save(); ctx.translate(x, y - bob); ctx.scale(f, 1); ctx.lineCap = "round";
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .14; [0, Math.PI].forEach((d, i) => { const sw = Math.sin(ph + d) * r * .35; ctx.beginPath(); ctx.moveTo(i ? -r * .22 : r * .22, -r * .9); ctx.lineTo(sw + (i ? -r * .2 : r * .2), 0); ctx.stroke(); ctx.beginPath(); ctx.ellipse(sw + (i ? -r * .2 : r * .2) + r * .1, 0, r * .2, r * .09, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    if (o.pack){ rr(ctx, -r * 1.25, -r * 2.1, r * .6, r * .9, r * .15); ctx.fillStyle = o.pack; ctx.fill(); ol(ctx, 3); }
    coin(ctx, 0, -r * 1.75, r, Math.sin(t * 2 + (o.phase || 0)) * .3);
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(r * .3, -r * 1.85, r * .1, 0, TAU); ctx.arc(r * .62, -r * 1.85, r * .1, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(r * .46, -r * 1.62, r * .16, .2, Math.PI - .2); ctx.stroke();
    const aw = Math.sin(ph) * .5; ctx.lineWidth = r * .12; ctx.beginPath(); ctx.moveTo(r * .9, -r * 1.6); ctx.lineTo(r * 1.35, -r * 1.25 + aw * r * .3); ctx.stroke();
    if (o.carry){ ctx.save(); ctx.translate(r * 1.2, -r * 2.9); ctx.rotate(-.08); rr(ctx, -r * .9, -r * .55, r * 1.8, r * 1.1, 8); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-r * .9, -r * .55); ctx.lineTo(0, r * .1); ctx.lineTo(r * .9, -r * .55); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
    if (o.label){ ctx.scale(f, 1); chipW(ctx, o.label, 0, -r * 3.05, o.labelBg || NAVY, "#FFFFFF", Math.max(20, r * .55)); }
    ctx.restore(); }
  ITEMS.envelope = (ctx, t, o) => { ctx.rotate(-.12); rr(ctx, -90, -120, 180, 120, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(0, -55); ctx.lineTo(90, -120); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    rr(ctx, -60, -40, 120, 28, 8); ctx.fillStyle = GREEN; ctx.fill(); textC(ctx, o.text || "PENSIUN", 0, -19, 20, "#FFFFFF", 900, 110); };
  ITEMS.slip = (ctx, t, o) => { ctx.rotate(-.1); rr(ctx, -80, -150, 160, 160, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; rr(ctx, -60, -130, 120, 16, 6); ctx.fill(); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++){ rr(ctx, -60, -100 + i * 24, 80 + (i % 2) * 30, 10, 5); ctx.fill(); } ctx.fillStyle = RED; rr(ctx, -60, -28, 70, 12, 6); ctx.fill(); };
  ITEMS.scoop = (ctx, t, o) => { const big = o.big ? 1.35 : .9; ctx.rotate((o.tilt || 0) - .2); ctx.scale(big, big); rr(ctx, -8, -20, 90, 16, 8); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(80, -60); ctx.lineTo(180, -60); ctx.quadraticCurveTo(190, 20, 130, 20); ctx.quadraticCurveTo(80, 20, 80, -60); ctx.fillStyle = "#B8B4BC"; ctx.fill(); ol(ctx, 5);
    for (let i = 0; i < 4; i++) coin(ctx, 104 + i * 18, -62 - (i % 2) * 10, 14, t * 3 + i); };
  ITEMS.phone3 = (ctx, t, o) => { ctx.rotate(-.1); rr(ctx, -46, -170, 92, 170, 14); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); rr(ctx, -38, -160, 76, 148, 8); ctx.fillStyle = "#E8F5EA"; ctx.fill();
    ctx.fillStyle = GREEN; rr(ctx, -30, -150, 60, 18, 5); ctx.fill(); textC(ctx, "SALDO", 0, -112, 15, OUT, 900); textC(ctx, "JHT", 0, -90, 20, GREEN, 900); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 3; i++) rr(ctx, -28, -70 + i * 16, 56 - i * 10, 7, 3), ctx.fill(); };

  /* ---- _koin: payroll deductions as walking coins (pergi: leave for HARI TUA; tiba: arrive monthly as pension envelopes) ---- */
  TT.scene(PX + "koin", "Cerita: potongan JHT/JP jadi koin berkaki yang berjalan pergi ke papan HARI TUA, atau tiba tiap bulan membawa amplop pensiun", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const K = R.f.koin; if (!K) return;
        if (K.mode === "pergi"){ // signpost to the far right
          const sx = K.signX ?? 940, q = popQ(t, T(s, K.walkCue, .2, idx), .5); if (q > 0){ ctx.save(); ctx.translate(sx, GY); ctx.scale(q, q); ctx.fillStyle = "#7A4A2E"; ctx.fillRect(-12, -520, 24, 520); ol(ctx, 4);
            ctx.beginPath(); ctx.moveTo(-150, -520); ctx.lineTo(120, -520); ctx.lineTo(170, -460); ctx.lineTo(120, -400); ctx.lineTo(-150, -400); ctx.closePath(); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5);
            textC(ctx, "HARI TUA", 0, -448, 40, OUT, 900, 260); rr(ctx, -110, -380, 220, 60, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); textC(ctx, K.far || "30 THN LAGI", 0, -340, 28, RED, 900, 200); ctx.restore(); } } },
      mid: (ctx, c, sts, R) => { const K = R.f.koin; if (!K) return;
        if (K.mode === "pergi"){ const sl = K.slip || {}, x = sl.x ?? 720, y = sl.y ?? 620, w = 540, h = 470, tA = T(s, sl.cue, .2, idx), q = popQ(t, tA, .5); if (q <= 0) return;
          const tW = T(s, K.walkCue, .2, idx);
          ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 8); ctx.rotate(-.03 + Math.sin(t * 1.3) * .02); ctx.scale(q, q);
          rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7); rr(ctx, -w / 2, -h / 2, w, 80, 16); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7);
          textC(ctx, "SLIP GAJI · DIMAS", 0, -h / 2 + 54, 36, "#FFFFFF", 900, w - 40);
          (sl.rows || []).forEach((r, j) => { const yy = -h / 2 + 130 + j * 82, hl = r.cue && t >= T(s, r.cue, .3, idx), gone = r.coin && t > tW + .2;
            if (hl){ rr(ctx, -w / 2 + 14, yy - 46, w - 28, 66, 12); ctx.fillStyle = hexA(RED, .16 + .1 * Math.sin(t * 8)); ctx.fill(); }
            textL(ctx, r.k, -w / 2 + 34, yy, 32, hl ? RED : BROWN, 800, 200); ctx.textAlign = "right"; font(ctx, 900, 30, FAM); ctx.fillStyle = hl ? RED : BROWN; ctx.fillText(r.v, w / 2 - 34, yy); ctx.textAlign = "left";
            if (r.coin && !gone && hl) coin(ctx, w / 2 - 70, yy - 64, 22, t * 4); });
          ctx.restore();
          // coins jump out and walk to the sign
          (sl.rows || []).filter(r => r.coin).forEach((r, j) => { const k = t - tW - j * .35; if (k < 0) return; const sx = (K.signX ?? 940) + 20, fx = x + w / 2 - 70, fy = y - h / 2 + 130 + (sl.rows.indexOf(r)) * 82 - 64;
            let px, py; if (k < .5){ const qq = k / .5; px = lerp(fx, fx + 40, qq); py = lerp(fy, GY - 60, qq) - Math.sin(qq * Math.PI) * 120; } else { px = fx + 40 + (k - .5) * 330; py = GY - 60; }
            if (px > sx + 260) return; coinWalker(ctx, px, py + 60, 46, t, { label: r.coin, phase: j * 2, pack: j ? TEAL : ORANGE, labelBg: j ? TEAL : ORANGE }); }); }
        else if (K.mode === "tiba"){ const tA = T(s, K.arriveCue, .3, idx), n = K.n || 3, gap = K.gap || 1.3, st = sts[K.on ?? 0], hp = handOf(st);
          const rt = K.from === "right", dir = rt ? -1 : 1;
          for (let i = 0; i < n; i++){ const k = t - tA - i * gap; if (k < 0) continue; const walk = 1.0, xs = rt ? 1250 : -150, xe = hp[0] - dir * 120;
            if (k < walk){ const px = lerp(xs, xe, k / walk); coinWalker(ctx, px, GY, 40, t, { carry: true, phase: i, face: dir, label: (K.months || [])[i], labelBg: GREEN }); }
            else if (k < walk + .5){ const qq = (k - walk) / .5; coinWalker(ctx, xe - dir * qq * 160, GY, 40, t, { phase: i, face: -dir }); } }
        } },
      over: (ctx, c, sts, R) => { const K = R.f.koin; if (!K || K.mode !== "tiba") return; const tA = T(s, K.arriveCue, .3, idx), n = K.n || 3, gap = K.gap || 1.3, st = sts[K.on ?? 0], hh = toonHead(st), p = scr(R.c, hh[0] + 60, hh[1] - st.size * .2);
        for (let i = 0; i < n; i++){ const k = t - tA - i * gap - 1.0; if (k < 0 || k > 1) continue; popWord(ctx, "+1 BULAN", p[0], p[1] - 40, k, { size: 70, hold: .95, col: GREEN }); } }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const K = F.koin; if (!K) return;
      if (K.mode === "pergi"){ if (K.slip) add(cueT(s, K.slip.cue, .2, i), "whoosh"); add(cueT(s, K.walkCue, .2, i), "pop"); (K.slip.rows || []).forEach(r => { if (r.cue) add(cueT(s, r.cue, .3, i), "ping"); }); }
      if (K.mode === "tiba"){ const tA = cueT(s, K.arriveCue, .3, i); for (let j = 0; j < (K.n || 3); j++) add(tA + j * (K.gap || 1.3) + 1.0, "chime"); } }); });

  /* ---- _karung: JHT sack filled by two scoops (company bigger), then opened at 56 / stop working ---- */
  TT.scene(PX + "toren", "Cerita: toren air JHT diisi dua sekop koin (perusahaan besar, pekerja kecil), pengukur naik ke 5,7%, keran dibuka saat usia 56 / berhenti kerja", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      mid: (ctx, c, sts, R) => { const K = R.f.karung; if (!K) return; const x = K.x ?? 540, y = K.y ?? 1330, tA = T(s, K.sackCue, .2, idx), tP = T(s, K.pourCue, .3, idx), tO = T(s, K.openCue, .3, idx);
        const q = popQ(t, tA, .5); if (q <= 0) return; const fill = clamp((t - tP) / 4, 0, 1), open = t < tO ? 0 : eOut(clamp((t - tO) / .5, 0, 1));
        const w = 380, h = 470, st0 = 90, topY = y - st0 - h - 40;
        if (t > tP && t < tO) sts.forEach((st, j) => { const hp = handOf(st), sx = hp[0] + (st.face || 1) * (j ? 150 : 230), sy = hp[1] - 70, n = j ? 3 : 6;
          for (let i = 0; i < n; i++){ const qq = (t * 1.4 + i / n) % 1; coin(ctx, lerp(sx, x, qq), lerp(sy, topY, qq) - Math.sin(qq * Math.PI) * 140, j ? 16 : 22, t * 5 + i); } });
        ctx.save(); ctx.translate(x, y); ctx.scale(q, q); const wob = t > tP && t < tO ? Math.sin(t * 7) * 2 : 0;
        // stand
        ctx.fillStyle = "#6B6470"; [-150, 130].forEach(dx => { ctx.fillRect(dx, -st0, 20, st0); }); rr(ctx, -180, -st0 - 16, 360, 22, 6); ctx.fill(); ol(ctx, 4);
        ctx.translate(wob, -st0 - 10);
        // tank body (toren)
        rr(ctx, -w / 2, -h, w, h, 40); ctx.fillStyle = "#3A7CC2"; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = hexA("#13223D", .35); ctx.lineWidth = 6; for (let i = 1; i < 6; i++){ ctx.beginPath(); ctx.moveTo(-w / 2 + 8, -h * i / 6); ctx.lineTo(w / 2 - 8, -h * i / 6); ctx.stroke(); }
        ctx.fillStyle = hexA("#FFFFFF", .22); rr(ctx, -w / 2 + 22, -h + 30, 36, h - 60, 16); ctx.fill();
        // dome lid
        ctx.beginPath(); ctx.ellipse(0, -h, w * .5, 60, 0, Math.PI, 0); ctx.fillStyle = "#2E6AA8"; ctx.fill(); ol(ctx, 6); rr(ctx, -50, -h - 76, 100, 30, 10); ctx.fillStyle = "#2E6AA8"; ctx.fill(); ol(ctx, 5);
        // level gauge with coins
        const gx = w / 2 - 80, gh = h - 90; rr(ctx, gx - 26, -h + 40, 52, gh, 20); ctx.fillStyle = hexA("#FFFFFF", .85); ctx.fill(); ol(ctx, 4);
        const lv = fill * (1 - open * .95); ctx.save(); rr(ctx, gx - 26, -h + 40, 52, gh, 20); ctx.clip(); ctx.fillStyle = GOLD; ctx.fillRect(gx - 26, -h + 40 + gh * (1 - lv), 52, gh * lv); for (let i = 0; i < 8; i++) coin(ctx, gx, -h + 40 + gh - 20 - i * 38, 16, t * 3 + i); ctx.restore();
        // label
        rr(ctx, -150, -h * .72, 190, 120, 18); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); textC(ctx, "JHT", -55, -h * .72 + 84, 74, TEAL, 900);
        textC(ctx, (fill * 5.7).toFixed(1).replace(".", ",") + "%", -55, -h * .26, 58, "#FFFFFF", 900);
        // faucet
        ctx.save(); ctx.translate(-w / 2, -60); rr(ctx, -70, -18, 74, 36, 10); ctx.fillStyle = "#B8B4BC"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.translate(-40, -30); ctx.rotate(-open * 1.4); rr(ctx, -30, -8, 60, 16, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); ctx.restore();
        ctx.restore();
        if (open > 0){ const k = t - tO, fx = x - w / 2 - 70, fy = y - st0 - 10 - 60; for (let i = 0; i < 16; i++){ const ph = (k * 1.1 + rnd(i)) % 1, vx = -(260 + rnd(i + 4) * 260), vy = -(380 + rnd(i + 8) * 300);
          coin(ctx, fx + vx * ph, fy + vy * ph + 1100 * ph * ph, 24, t * 6 + i); } glowAt(ctx, fx - 150, fy - 120, 280, GOLD, .4 * (.6 + .4 * Math.sin(t * 6))); } },
      over: (ctx, c, sts, R) => { const K = R.f.karung; if (!K) return;
        (K.chips || []).forEach((ch, j) => { const k = t - T(s, ch.cue, .3, idx), O = ch.outCue ? T(s, ch.outCue, .5, idx) : 1e9; if (k < 0 || t > O) return; tag(ctx, ch.text, ch.x ?? 540, ch.y ?? 300, k, ch.bg || NAVY, "#FFFFFF", ch.size || 40, ch.rot ?? (j % 2 ? .05 : -.05)); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.karung; if (K){ add(cueT(s, K.sackCue, .2, i), "whoosh"); add(cueT(s, K.pourCue, .3, i), "pop"); add(cueT(s, K.openCue, .3, i), "chime"); (K.chips || []).forEach(ch => add(cueT(s, ch.cue, .3, i), "pop")); } });

  /* ---- _sumur: JP as a well dug ring by ring (15 years of contributions), then a monthly bucket of coins ---- */
  TT.scene(PX + "sumur", "Cerita: sumur Jaminan Pensiun (penampang tanah), tiap cincin = 1 tahun iuran sampai 15, lalu timba koin naik tiap bulan", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const S = R.f.sumur; if (!S) return; const gy = S.gy ?? 1180, x = S.x ?? 420, n = 15, rh = 44, tD = T(s, S.digCue, .2, idx), tE = T(s, S.doneCue, .5, idx);
        const rings = Math.floor(clamp((t - tD) / Math.max(.5, tE - tD), 0, 1) * n);
        // soil cross-section
        let g = ctx.createLinearGradient(0, gy, 0, gy + 900); g.addColorStop(0, "#8E5A33"); g.addColorStop(1, "#5A3520"); ctx.fillStyle = g; ctx.fillRect(-600, gy, 2300, 1100);
        ctx.fillStyle = hexA("#3B2418", .25); for (let i = 0; i < 30; i++){ ctx.beginPath(); ctx.ellipse(-200 + rnd(i) * 1500, gy + 60 + rnd(i + 3) * 800, 18 + rnd(i + 5) * 20, 10, 0, 0, TAU); ctx.fill(); }
        ctx.fillStyle = "#5DA34E"; ctx.fillRect(-600, gy - 20, 2300, 40); ol(ctx, 0);
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-600, gy - 20); ctx.lineTo(1700, gy - 20); ctx.stroke();
        // shaft
        ctx.fillStyle = "#2B1A12"; ctx.fillRect(x - 110, gy, 220, rings * rh + 10);
        for (let i = 0; i < rings; i++){ const yy = gy + 6 + i * rh, fresh = i === rings - 1 && t < tE + .2; ctx.fillStyle = fresh ? "#E2C28E" : "#B8A58A"; rr(ctx, x - 130, yy, 34, rh - 6, 6); ctx.fill(); ol(ctx, 3); rr(ctx, x + 96, yy, 34, rh - 6, 6); ctx.fill(); ol(ctx, 3);
          if ((i + 1) % 5 === 0){ textC(ctx, String(i + 1), x + 190, yy + 32, 30, "#FFF4E6", 900); } }
        if (t > tE){ const wq = clamp((t - tE) / .6, 0, 1); ctx.fillStyle = hexA("#4FC3D9", .85); ctx.fillRect(x - 108, gy + n * rh - 40 * wq, 216, 40 * wq + 10); glowAt(ctx, x, gy + n * rh - 20, 200, "#7FE3EE", .5 * wq); }
        // well head (roof + winch)
        ctx.fillStyle = "#B8A58A"; rr(ctx, x - 150, gy - 120, 300, 120, 12); ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(x - 150 + i * 75 + 37, gy - 120); ctx.lineTo(x - 150 + i * 75 + 37, gy); ctx.stroke(); }
        ctx.fillStyle = "#7A4A2E"; ctx.fillRect(x - 150, gy - 470, 22, 360); ctx.fillRect(x + 128, gy - 470, 22, 360);
        ctx.beginPath(); ctx.moveTo(x - 220, gy - 440); ctx.lineTo(x, gy - 560); ctx.lineTo(x + 220, gy - 440); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
        rr(ctx, x - 60, gy - 420, 120, 90, 12); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); textC(ctx, "JP", x, gy - 356, 54, "#FFFFFF", 900);
        ctx.save(); ctx.translate(x, gy - 300); ctx.rotate(t * (t > T(s, S.bucketCue, .3, idx) ? 3 : 0)); ctx.fillStyle = "#6B4A2E"; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillRect(-4, -46, 8, 92); ctx.restore();
        ctx.fillStyle = "#6B4A2E"; ctx.fillRect(x - 128, gy - 306, 256, 12);
        // bucket rising each "month"
        const tB = T(s, S.bucketCue, .3, idx); if (t > tB){ const per = 1.6, k = (t - tB) % per, cyc = Math.floor((t - tB) / per), up = clamp(k / 1.0, 0, 1), by = lerp(gy + n * rh - 40, gy - 210, eOut(up));
          ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, gy - 300); ctx.lineTo(x, by - 70); ctx.stroke();
          ctx.save(); ctx.translate(x, by); ctx.beginPath(); ctx.moveTo(-60, -70); ctx.lineTo(60, -70); ctx.lineTo(46, 20); ctx.lineTo(-46, 20); ctx.closePath(); ctx.fillStyle = "#8C8890"; ctx.fill(); ol(ctx, 5);
          for (let i = 0; i < 5; i++) coin(ctx, -36 + i * 18, -78 - (i % 2) * 12, 18, t * 4 + i); ctx.restore();
          if (k > 1.0){ const pq = (k - 1.0) / (per - 1.0); for (let i = 0; i < 4; i++) coin(ctx, x + 60 + pq * (260 + i * 30), by - 90 - Math.sin(pq * Math.PI) * 160 + i * 6, 18, t * 6 + i); } } },
      over: (ctx, c, sts, R) => { const S = R.f.sumur; if (!S) return; const tD = T(s, S.digCue, .2, idx), tE = T(s, S.doneCue, .5, idx), rings = Math.floor(clamp((t - tD) / Math.max(.5, tE - tD), 0, 1) * 15);
        if (t > tD){ const p = scr(R.c, (S.x ?? 420) + 330, (S.gy ?? 1180) + 300); ctx.save(); ctx.translate(Math.min(p[0], 860), Math.min(p[1], 1170)); rr(ctx, -150, -70, 300, 140, 20); ctx.fillStyle = hexA(NAVY, .92); ctx.fill(); ol(ctx, 5);
          textC(ctx, "IURAN", 0, -26, 30, "#FFFFFF", 800); textC(ctx, rings + " TAHUN", 0, 40, 56, rings >= 15 ? GOLD : "#FFFFFF", 900); ctx.restore(); if (t > tE && t < tE + .9) burstFx(ctx, Math.min(p[0], 860), Math.min(p[1], 1170), t - tE, GOLD, 12, 200); }
        (S.chips || []).forEach((ch, j) => { const k = t - T(s, ch.cue, .3, idx), O = ch.outCue ? T(s, ch.outCue, .5, idx) : 1e9; if (k < 0 || t > O) return; tag(ctx, ch.text, ch.x ?? 540, ch.y ?? 300, k, ch.bg || NAVY, "#FFFFFF", ch.size || 40, ch.rot ?? (j % 2 ? .05 : -.05)); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.sumur; if (S){ const tD = cueT(s, S.digCue, .2, i), tE = cueT(s, S.doneCue, .5, i); for (let j = 1; j < 15; j += 2) add(tD + (tE - tD) * j / 15, "pop"); add(tE, "chime"); add(cueT(s, S.bucketCue, .3, i), "whoosh"); (S.chips || []).forEach(ch => add(cueT(s, ch.cue, .3, i), "pop")); } });

  /* ---- BG: roadside coffee stall (warung) ---- */
  BG.warung = (ctx, t, o) => { const x = o.x ?? 760;
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(x - 330, GY - 620, 22, 620); ctx.fillRect(x + 308, GY - 620, 22, 620);
    for (let i = 0; i < 7; i++){ ctx.fillStyle = i % 2 ? "#FFFDF6" : RED; ctx.beginPath(); ctx.moveTo(x - 360 + i * 103, GY - 700); ctx.lineTo(x - 360 + (i + 1) * 103, GY - 700); ctx.lineTo(x - 360 + (i + 1) * 103, GY - 600); ctx.quadraticCurveTo(x - 360 + i * 103 + 51, GY - 560, x - 360 + i * 103, GY - 600); ctx.closePath(); ctx.fill(); ol(ctx, 4); }
    rr(ctx, x - 340, GY - 330, 680, 40, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - 320, GY - 290, 640, 290); ol(ctx, 5);
    rr(ctx, x - 200, GY - 560, 400, 80, 12); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5); textC(ctx, o.name || "WARUNG KOPI", x, GY - 506, 40, OUT, 900, 380);
    for (let i = 0; i < 4; i++){ const gx = x - 230 + i * 150; rr(ctx, gx - 24, GY - 400, 48, 70, 8); ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#6B3A1E"; ctx.fillRect(gx - 20, GY - 370, 40, 36); }
    smoke(ctx, x - 80, GY - 420, t, 1, { n: 4, h: 140, col: "#FFFFFF", s: .5 }); };

  /* ======================= MS50 Seimbang bukan sama rata ======================= */
  function icoThing(ctx, kind, x, y, s, t){ // world icons for the four demands
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3 + x) * .06);
    if (kind === "kerja"){ rr(ctx, -90, -70, 180, 120, 10); ctx.fillStyle = "#544E42"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-76, -58, 152, 96); ctx.fillStyle = ORANGE; for (let i = 0; i < 3; i++) ctx.fillRect(-60, -46 + i * 26, 60 + ((i * 37 + Math.floor(t * 3)) % 60), 10); rr(ctx, -110, 50, 220, 16, 6); ctx.fillStyle = OUT; ctx.fill(); }
    else if (kind === "anak"){ ctx.beginPath(); ctx.arc(0, -10, 62, 0, TAU); ctx.fillStyle = "#F0C29A"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-20, -16, 6, 0, TAU); ctx.arc(20, -16, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 8, 14, .2, Math.PI - .2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 70, 80, 40, 0, Math.PI, 0); ctx.fillStyle = PINK; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#F28DB2"; ctx.beginPath(); ctx.arc(0, -70, 14, 0, TAU); ctx.fill(); }
    else if (kind === "olahraga"){ ctx.beginPath(); ctx.moveTo(-90, 30); ctx.lineTo(-80, -30); ctx.quadraticCurveTo(-30, -40, -10, -10); ctx.lineTo(80, 0); ctx.quadraticCurveTo(100, 30, 80, 40); ctx.lineTo(-90, 40); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-90, 30, 180, 12); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-50 + i * 16, -24); ctx.lineTo(-40 + i * 16, -6); ctx.stroke(); } }
    else { rr(ctx, -80, -60, 160, 120, 8); ctx.fillStyle = PURPLE; ctx.fill(); ol(ctx, 5); rr(ctx, -66, -50, 66, 100, 4); ctx.fillStyle = PAPER; ctx.fill(); rr(ctx, 2, -50, 66, 100, 4); ctx.fill(); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++){ ctx.fillRect(-56, -36 + i * 20, 46, 6); ctx.fillRect(12, -36 + i * 20, 46, 6); } }
    ctx.restore(); }

  /* ---- _tarik: one mum, four ghost copies pulled by ropes to work / baby / sport / course ---- */
  TT.scene(PX + "tarik", "Cerita: ibu baru terbelah jadi empat bayangan yang ditarik tali ke kerja, anak, olahraga, kursus (jatah sama rata), lalu lunglai", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      mid: (ctx, c, sts, R) => { const A = R.f.tarik; if (!A) return; const st = sts[0], toonA = R.f.toons[0], tS = T(s, A.splitCue, .3, idx), tX = T(s, A.endCue, .3, idx);
        (A.items || []).forEach((it, j) => { const q = popQ(t, T(s, it.cue, .3, idx), .45); if (q <= 0) return;
          const tension = t > tS && t < tX ? 1 : 0, gq = tension ? eOut(clamp((t - tS - j * .1) / .6, 0, 1)) : 0, pull = gq * (.75 + .08 * Math.sin(t * 7 + j * 2));
          const hp = toonHead(st), gx = lerp(st.x, it.x, pull * .8), gy = lerp(st.y, it.y + st.size * .5, pull * .6);
          if (gq > 0){ const hx = lerp(st.x, it.x, pull * .8), hy = lerp(hp[1] + 120, it.y, pull * .6); ctx.strokeStyle = "#8E6A3A"; ctx.lineWidth = 9; ctx.setLineDash([18, 8]); ctx.lineDashOffset = -t * 60; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + it.x) / 2, (hy + it.y) / 2 + 40 * Math.sin(t * 6 + j), it.x, it.y); ctx.stroke(); ctx.setLineDash([]);
            ctx.save(); ctx.globalAlpha *= .42 * gq; const gs = Object.assign({}, st, { x: gx, y: gy, pose: j % 2 ? "scared" : "shock", expr: "scared", say: null, emote: null }); TT.drawToon(ctx, toonA, gs, t); ctx.restore(); }
          icoThing(ctx, it.kind, it.x, it.y, q * (it.s || 1), t); });
        if (t > tX && t < tX + 1.2){ for (let i = 0; i < 6; i++){ const k = (t - tX) / 1.2, a = i / 6 * TAU; ctx.fillStyle = hexA("#FFFFFF", .6 * (1 - k)); ctx.beginPath(); ctx.arc(st.x + Math.cos(a) * 200 * k, st.y - st.size * .5 + Math.sin(a) * 200 * k, 30 * (1 - k) + 6, 0, TAU); ctx.fill(); } } },
      over: (ctx, c, sts, R) => { const A = R.f.tarik; if (!A) return; const tE = T(s, A.equalCue, .4, idx), tX = T(s, A.endCue, .3, idx);
        (A.items || []).forEach((it, j) => { const k = t - T(s, it.cue, .35, idx); if (k < 0) return; const p = scr(R.c, it.x, it.y + 110 * (it.s || 1)); tag(ctx, it.label, p[0], p[1], k, it.bg || NAVY, "#FFFFFF", 36, j % 2 ? .05 : -.05);
          const k2 = t - tE - j * .15; if (k2 >= 0 && t < tX + .3) tag(ctx, "25%", p[0], p[1] - 230 * (it.s || 1), k2, ORANGE, "#FFFFFF", 40, 0); });
        const kx = t - T(s, A.halfCue, .4, idx); if (kx >= 0) tag(ctx, "SEMUA SETENGAH-SETENGAH", 540, 300, kx, RED, "#FFFFFF", 40, -.04); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.tarik; if (A){ (A.items || []).forEach(it => add(cueT(s, it.cue, .3, i), "pop")); add(cueT(s, A.splitCue, .3, i), "whoosh"); add(cueT(s, A.equalCue, .4, i), "ping"); add(cueT(s, A.halfCue, .4, i), "pop"); add(cueT(s, A.endCue, .3, i), "whoosh"); } });

  /* ---- crib mobile: torque-balanced hanging toys ---- */
  function mobileToy(ctx, kind, r, label, t){
    if (kind === "moon"){ ctx.beginPath(); ctx.arc(0, 0, r, .9, -.9 + TAU, false); ctx.arc(r * .45, -r * .05, r * .78, -1.05 + TAU, 1.05, true); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); }
    else if (kind === "cloud"){ ctx.fillStyle = "#BFE2EA"; [[-r * .5, 0, r * .55], [0, -r * .25, r * .65], [r * .5, 0, r * .55]].forEach(([a, b, rr2]) => { ctx.beginPath(); ctx.arc(a, b, rr2, 0, TAU); ctx.fill(); ol(ctx, 5); }); ctx.beginPath(); ctx.ellipse(0, r * .1, r, r * .45, 0, 0, TAU); ctx.fill(); }
    else if (kind === "star"){ ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .45 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 5); }
    else { ctx.beginPath(); ctx.moveTo(0, r * .9); ctx.bezierCurveTo(-r * 1.3, -r * .1, -r * .6, -r * 1.1, 0, -r * .4); ctx.bezierCurveTo(r * .6, -r * 1.1, r * 1.3, -r * .1, 0, r * .9); ctx.fillStyle = PINK; ctx.fill(); ol(ctx, 5); }
    if (label) chipW(ctx, label, 0, r + 36, NAVY, "#FFFFFF", Math.max(28, Math.min(36, r * .45))); }
  function drawMobile(ctx, M, t, mix, extra){ // M: {x, y, L, toys:[{kind, w, label, a, b}]}, mix 0 = positions a, 1 = positions b
    const toys = M.toys, pos = toys.map(o => lerp(o.a, o.b, mix)), torque = toys.reduce((sum, o, i) => sum + o.w * pos[i], 0);
    const ang = clamp(torque / 1600, -.42, .42) + Math.sin(t * 1.7) * .025 + (extra || 0);
    ctx.save(); ctx.translate(M.x, M.y); ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -260); ctx.lineTo(0, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    ctx.rotate(ang); rr(ctx, -(M.L || 300), -8, 2 * (M.L || 300), 16, 8); ctx.fillStyle = "#C98B4E"; ctx.fill(); ol(ctx, 5);
    toys.forEach((o, i) => { const px = pos[i], len = o.len || 170, r = (M.r0 ?? 50) + o.w * (M.rk ?? 24); ctx.save(); ctx.translate(px, 0); ctx.rotate(-ang + Math.sin(t * 2 + i) * .06);
      ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len - r); ctx.stroke(); ctx.translate(0, len); ctx.rotate(Math.sin(t * 1.5 + i * 2) * .1); mobileToy(ctx, o.kind, r, o.label, t); ctx.restore(); });
    ctx.restore(); return ang; }
  BG.kamarbayi = (ctx, t, o) => { // pastel nursery wall + crib (+ optional mobile)
    const x = o.x ?? 560; ctx.fillStyle = o.night ? "#3D4A6B" : "#CFE3F0"; ctx.fillRect(-600, -200, 2300, GY + 200); ctx.fillStyle = hexA("#FFFFFF", o.night ? .12 : .5);
    for (let i = 0; i < 26; i++){ const sx = -200 + (i % 7) * 230 + (Math.floor(i / 7) % 2) * 115, sy = 300 + Math.floor(i / 7) * 280; ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, r2 = k % 2 ? 9 : 22; ctx.lineTo(sx + Math.cos(a) * r2, sy + Math.sin(a) * r2); } ctx.fill(); }
    ctx.fillStyle = o.night ? "#5A4A3A" : "#E8D2B0"; ctx.fillRect(-600, GY - 40, 2300, 300); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-600, GY - 40); ctx.lineTo(1700, GY - 40); ctx.stroke();
    const cs = o.cribS || 1; ctx.save(); ctx.translate(o.cribX ?? x, GY); ctx.scale(cs, cs);
    rr(ctx, -200, -380, 400, 30, 12); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); rr(ctx, -200, -120, 400, 30, 12); ctx.fill(); ol(ctx, 5);
    for (let i = 0; i < 9; i++){ rr(ctx, -186 + i * 46, -360, 14, 250, 6); ctx.fill(); ol(ctx, 3); } ctx.fillRect(-206, -400, 22, 400); ctx.fillRect(184, -400, 22, 400);
    if (o.baby){ ctx.beginPath(); ctx.arc(-40, -300 - Math.abs(Math.sin(t * 1.2)) * 6, 46, 0, TAU); ctx.fillStyle = "#F0C29A"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = OUT; ctx.lineWidth = 4;
      if (o.sleep){ ctx.beginPath(); ctx.arc(-56, -306, 8, 0, Math.PI); ctx.moveTo(-16, -306); ctx.arc(-24, -306, 8, 0, Math.PI); ctx.stroke(); } else { ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-56, -306, 5, 0, TAU); ctx.arc(-24, -306, 5, 0, TAU); ctx.fill(); }
      ctx.fillStyle = PINK; ctx.beginPath(); ctx.ellipse(40, -326, 90, 34, 0, Math.PI, 0); ctx.fill(); }
    ctx.restore();
    if (o.mobile) drawMobile(ctx, Object.assign({}, o.mobile), t, 1); };

  /* ---- _gantung: grandma points at the crib mobile; toys of different weight balance by WHERE they hang ---- */
  TT.scene(PX + "gantung", "Cerita: kamar bayi, nenek menunjuk mainan gantung; boneka beda berat, miring lalu seimbang karena posisi gantungnya digeser", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const G2 = R.f.gantung; if (!G2) return; BG.kamarbayi(ctx, t, Object.assign({ x: 560, baby: true }, G2.room || {})); },
      mid: (ctx, c, sts, R) => { const G2 = R.f.gantung; if (!G2) return; const tB = T(s, G2.balanceCue, .3, idx), mix = t < tB ? 0 : eOut(clamp((t - tB) / 1.2, 0, 1));
        const wob = t < tB ? Math.sin(t * 3.1) * .12 : Math.sin(t * 6) * .1 * Math.max(0, 1 - (t - tB) / 1.6);
        const ang = drawMobile(ctx, G2.mobile, t, mix, wob);
        const tK = T(s, G2.keyCue, .3, idx); if (t > tK){ const M = G2.mobile; M.toys.forEach((o, i) => { const px = M.x + o.b * Math.cos(ang), py = M.y + o.b * Math.sin(ang); ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 8 + i); ctx.beginPath(); ctx.arc(px, py, 20, 0, TAU); ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.stroke(); ctx.restore(); }); }
        if (mix > .95 && t - tB < 2.2) for (let i = 0; i < 5; i++) sparkle(ctx, G2.mobile.x - 260 + i * 130, G2.mobile.y - 60 + Math.sin(t * 5 + i) * 30, 16, GOLD); },
      over: (ctx, c, sts, R) => { const G2 = R.f.gantung; if (!G2) return; (G2.chips || []).forEach((ch, j) => { const k = t - T(s, ch.cue, .35, idx), O = ch.outCue ? T(s, ch.outCue, .5, idx) : 1e9; if (k < 0 || t > O) return; tag(ctx, ch.text, ch.x ?? 540, ch.y ?? 300, k, ch.bg || NAVY, "#FFFFFF", ch.size || 42, ch.rot ?? (j % 2 ? .04 : -.04)); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const G2 = f.gantung; if (G2){ add(cueT(s, G2.balanceCue, .3, i), "whoosh"); add(cueT(s, G2.balanceCue, .3, i) + 1.1, "chime"); add(cueT(s, G2.keyCue, .3, i), "ping"); (G2.chips || []).forEach(ch => add(cueT(s, ch.cue, .35, i), "pop")); } });

  /* ---- _sulam: grandma's life stages appear as embroidery hoops being stitched ---- */
  function stitchPaths(kind){ // polylines in a 200x200 box centred at 0
    const circ = (cx, cy, r, n) => { const a = []; for (let i = 0; i <= (n || 18); i++){ const q = i / (n || 18) * TAU; a.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); } return a; };
    if (kind === "bayi") return [circ(-20, -40, 30), [[-60, -40], [-62, 10], [-70, 70], [40, 70], [30, 10], [20, -40]], circ(30, 20, 22, 14), [[10, 34], [60, 50]]];
    if (kind === "besar") return [circ(-40, -50, 22), [[-40, -28], [-40, 40], [-60, 80]], [[-40, 40], [-20, 80]], [[-70, 0], [-10, 0]], circ(40, -60, 22), [[40, -38], [40, 40], [20, 80]], [[40, 40], [60, 80]], [[10, -10], [70, -10]], [[0, -88], [-70, -70], [-20, -110], [20, -110], [60, -80]]];
    return [[[-70, 70], [70, -70]], circ(-56, 56, 10, 10), [[60, -60], [30, -20], [-10, -40], [-30, 0], [10, 20], [40, 0], [50, 40], [0, 60], [-20, 40]]];
  }
  function hoop(ctx, x, y, r, kind, prog, col, t){
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.4 + x) * .04);
    ctx.beginPath(); ctx.arc(0, 0, r + 14, 0, TAU); ctx.fillStyle = "#C98B4E"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#FFF8EC"; ctx.fill(); ol(ctx, 4);
    rr(ctx, -14, -r - 40, 28, 30, 6); ctx.fillStyle = "#8C8890"; ctx.fill(); ol(ctx, 3);
    const P = stitchPaths(kind), sc = r / 120; let total = 0; P.forEach(p => { for (let i = 1; i < p.length; i++) total += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); });
    let left = total * prog; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.setLineDash([12, 8]); ctx.beginPath(); let last = null;
    for (const p of P){ ctx.moveTo(p[0][0] * sc, p[0][1] * sc); for (let i = 1; i < p.length && left > 0; i++){ const L = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]), q = Math.min(1, left / L); const nx = p[i - 1][0] + (p[i][0] - p[i - 1][0]) * q, ny = p[i - 1][1] + (p[i][1] - p[i - 1][1]) * q; ctx.lineTo(nx * sc, ny * sc); last = [nx * sc, ny * sc]; left -= L; } if (left <= 0) break; }
    ctx.stroke(); ctx.setLineDash([]);
    if (last && prog < 1){ ctx.save(); ctx.translate(last[0], last[1]); ctx.rotate(-.8); ctx.fillStyle = "#B8B4BC"; rr(ctx, -4, -46, 8, 50, 4); ctx.fill(); ol(ctx, 2); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "sulam", "Cerita: nenek & ibu di bangku taman; tiap masa hidup nenek muncul sebagai bingkai sulam yang dijahit (anak kecil, anak besar, kursus menjahit)", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      mid: (ctx, c, sts, R) => { const H = R.f.sulam; if (!H) return; const tM = T(s, H.glowCue, .3, idx);
        (H.hoops || []).forEach((h, j) => { const T0 = T(s, h.cue, .3, idx), q = popQ(t, T0, .45); if (q <= 0) return; const prog = clamp((t - T0) / 1.8, 0, 1);
          if (t > tM) glowAt(ctx, h.x, h.y, 220, GOLD, .35 + .15 * Math.sin(t * 5 + j));
          ctx.save(); ctx.translate(h.x, h.y); ctx.scale(q, q); hoop(ctx, 0, 0, h.r || 120, h.kind, prog, h.col || ORANGE, t); ctx.restore(); });
        // threads joining the hoops at the end
        if (t > tM){ const hs = H.hoops || [], k = clamp((t - tM) / .8, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.beginPath(); for (let i = 0; i < hs.length - 1; i++){ ctx.moveTo(hs[i].x + 130, hs[i].y); ctx.lineTo(lerp(hs[i].x + 130, hs[i + 1].x - 130, k), lerp(hs[i].y, hs[i + 1].y, k)); } ctx.stroke(); ctx.setLineDash([]); } },
      over: (ctx, c, sts, R) => { const H = R.f.sulam; if (!H) return; (H.hoops || []).forEach((h, j) => { const k = t - T(s, h.cue, .3, idx) - .5; if (k < 0) return; const p = scr(R.c, h.x, h.y + (h.r || 120) + 50); tag(ctx, h.label, clamp(p[0], 200, 880), p[1], k, j === 2 ? ORANGE : NAVY, "#FFFFFF", 34, j % 2 ? .04 : -.04); });
        const km = t - T(s, H.glowCue, .4, idx); if (km >= 0) tag(ctx, "TIAP MASA BEDA PRIORITAS", 540, 790, km, GREEN, "#FFFFFF", 42, -.03); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const H = f.sulam; if (H){ (H.hoops || []).forEach(h => add(cueT(s, h.cue, .3, i), "pop")); add(cueT(s, H.glowCue, .3, i), "chime"); } });

  /* ---- stroller pushed by the walking toon (used in _adegan via hook) ---- */
  function stroller(ctx, x, y, t, o){ o = o || {}; const f = o.face || 1, sp = o.spin || 0; ctx.save(); ctx.translate(x, y); ctx.scale(f * (o.s || 1), o.s || 1);
    [[-110, 0], [110, 0]].forEach(([wx]) => { ctx.save(); ctx.translate(wx, -44); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = "#2B2730"; ctx.fill(); ol(ctx, 5); ctx.rotate(sp); ctx.strokeStyle = "#B8B4BC"; ctx.lineWidth = 5; for (let i = 0; i < 4; i++){ ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.stroke(); } ctx.restore(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-110, -44); ctx.lineTo(0, -150); ctx.lineTo(110, -44); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-150, -230); ctx.lineTo(-260, -380); ctx.stroke(); // handle
    // basket
    rr(ctx, -120, -140, 240, 50, 10); ctx.fillStyle = "#8E6A3A"; ctx.fill(); ol(ctx, 4); if (o.book){ ctx.save(); ctx.translate(30, -150); ctx.rotate(-.1); rr(ctx, -50, -36, 100, 46, 6); ctx.fillStyle = PURPLE; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    // bassinet
    ctx.beginPath(); ctx.moveTo(-170, -320); ctx.quadraticCurveTo(-170, -170, 0, -170); ctx.quadraticCurveTo(170, -170, 170, -320); ctx.closePath(); ctx.fillStyle = "#7FA563"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(40, -320, 36, 0, TAU); ctx.fillStyle = "#F0C29A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(28, -324, 4, 0, TAU); ctx.arc(52, -324, 4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-170, -320); ctx.quadraticCurveTo(-180, -470, -20, -470); ctx.lineTo(0, -320); ctx.closePath(); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5); // canopy
    ctx.restore(); }
  BG.lampu = (ctx, t, o) => { (o.posts || []).forEach(px => { ctx.fillStyle = "#3B4A6B"; ctx.fillRect(px - 9, GY - 640, 18, 640); rr(ctx, px - 40, GY - 680, 80, 50, 10); ctx.fill(); }); };
  TT.scene(PX + "kereta", "Cerita: jalan pagi mendorong kereta bayi (olahraga + anak sekaligus), buku kursus diselipkan ke keranjang NANTI", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      over1: (ctx, c, sts, j, R) => { const K = R.f.kereta; if (!K || j !== 0) return; const st = sts[0], f = st.face || 1, x = st.x + f * (K.dx ?? 420), tB = T(s, K.bookCue, .3, idx);
        stroller(ctx, x, GY, t, { face: f, spin: st.x / 44, book: t > tB + .6, s: K.s || 1 });
        if (t > tB && t < tB + .6){ const q = (t - tB) / .6, hp = handOf(st), bx = lerp(hp[0], x + f * 30, q), by = lerp(hp[1] - 60, GY - 150, q) - Math.sin(q * Math.PI) * 200; ctx.save(); ctx.translate(bx, by); ctx.rotate(q * 6); rr(ctx, -50, -36, 100, 46, 6); ctx.fillStyle = PURPLE; ctx.fill(); ol(ctx, 4); ctx.restore(); } },
      over: (ctx, c, sts, R) => { const K = R.f.kereta; if (!K) return; const k = t - T(s, K.bookCue, .3, idx) - .6; if (k < 0) return; const st = sts[0], f = st.face || 1, p = scr(R.c, st.x + f * (K.dx ?? 420), GY - 330);
        tag(ctx, "KURSUS: NANTI DULU", clamp(p[0], 300, 780), Math.min(p[1], 760), k, PURPLE, "#FFFFFF", 38, -.04); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kereta; if (K) add(cueT(s, K.bookCue, .3, i), "whoosh"); });

  /* ======================= SB51 Terima kasih untuk setahun ======================= */
  function piagam(ctx, w, t, o){ // origin = bottom centre of frame
    o = o || {}; const h = w * .74; if (o.glow) glowAt(ctx, 0, -h / 2, w, GOLD, .45 * o.glow);
    rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = "#C9A227"; ctx.fill(); ol(ctx, Math.max(4, w * .02)); rr(ctx, -w / 2 + w * .06, -h + w * .06, w * .88, h - w * .12, 6); ctx.fillStyle = "#FFFDF6"; ctx.fill();
    textC(ctx, "PIAGAM", 0, -h + w * .19, w * .1, ORANGE, 900, w * .7); textC(ctx, "ANDI", 0, -h + w * .36, w * .14, BROWN, 900, w * .7);
    ctx.fillStyle = "#B9A58E"; rr(ctx, -w * .3, -h + w * .42, w * .6, w * .025, 3); ctx.fill();
    ctx.beginPath(); ctx.arc(w * .3, -w * .14, w * .07, 0, TAU); ctx.fillStyle = RED; ctx.fill(); sparkle(ctx, -w * .32, -h + w * .12, w * .05 * (1 + .3 * Math.sin(t * 6)), GOLD);
    (o.blanks || []).forEach((b, i) => { if (b <= 0) return; const yy = -h + w * .52 + i * w * .085; ctx.save(); ctx.globalAlpha *= b; ctx.setLineDash([w * .03, w * .02]); ctx.strokeStyle = TEAL; ctx.lineWidth = Math.max(2, w * .012); ctx.beginPath(); ctx.moveTo(-w * .32, yy); ctx.lineTo(w * .14, yy); ctx.stroke(); ctx.setLineDash([]);
      textC(ctx, "?", w * .22, yy + w * .02, w * .07 * (1 + .15 * Math.sin(t * 7 + i)), RED, 900); ctx.restore(); }); }
  ITEMS.piagam = (ctx, t, o) => { ctx.rotate(-.06); piagam(ctx, 210, t, { glow: o.glow ?? .8 }); };

  /* BG: small office stage with banner */
  BG.panggung = (ctx, t, o) => { const x = o.x ?? 540, top = o.top ?? 1460;
    ctx.fillStyle = "#8E3B5A"; ctx.fillRect(x - 520, (o.bannerY ?? 380) - 80, 1040, top - (o.bannerY ?? 380) + 80); for (let i = 0; i < 12; i++){ ctx.fillStyle = hexA("#000000", i % 2 ? .12 : 0); ctx.fillRect(x - 520 + i * 87, 300, 87, top - 300); } ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x - 520, 300, 1040, top - 300);
    const by = o.bannerY ?? 380; rr(ctx, x - 360, by, 720, 130, 18); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 6); textC(ctx, o.banner || "PROYEK TERBAIK TAHUN INI", x, by + 86, 50, OUT, 900, 660);
    for (let i = 0; i < 3; i++){ const bx = x - 300 + i * 300, a = .18 + .08 * Math.sin(t * 2 + i); ctx.fillStyle = hexA("#FFF4C2", a); ctx.beginPath(); ctx.moveTo(bx - 30, 300); ctx.lineTo(bx + 30, 300); ctx.lineTo(bx + 180 - i * 90, top); ctx.lineTo(bx - 60 - i * 90, top); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "#7A4A2E"; rr(ctx, x - 480, top, 960, GY - top + 40, 10); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#A9643B"; ctx.fillRect(x - 480, top, 960, 26); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 480, top + 26); ctx.lineTo(x + 480, top + 26); ctx.stroke(); };
  /* BG: office gate at dawn with security post and rain */
  BG.gerbangkantor = (ctx, t, o, s) => { const x = o.x ?? 760; o = Object.assign({}, o); if (o.slideCue) o.slide = eOut(clamp((t - cueT(s, o.slideCue, .3, G.scene)) / 1.4, 0, 1)) * 560;
    rr(ctx, x - 40, GY - 560, 300, 560, 8); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 60, GY - 620, 340, 70, 10); ctx.fillStyle = "#2C3E66"; ctx.fill(); ol(ctx, 5); textC(ctx, "POS SATPAM", x + 110, GY - 572, 32, "#FFFFFF", 900, 300);
    rr(ctx, x + 10, GY - 450, 200, 140, 8); ctx.fillStyle = "#FFE9A8"; ctx.fill(); ol(ctx, 5); glowAt(ctx, x + 110, GY - 380, 160, "#FFE9A8", .4);
    ctx.fillStyle = "#6B6470"; for (let i = 0; i < 10; i++) rr(ctx, x - 760 + i * 70 - (o.slide || 0), GY - 320, 14, 320, 5), ctx.fill(); rr(ctx, x - 770 - (o.slide || 0), GY - 300, 720, 16, 6); ctx.fill(); rr(ctx, x - 770 - (o.slide || 0), GY - 110, 720, 16, 6); ctx.fill();
    if (o.rain){ ctx.strokeStyle = hexA("#DDE8F5", .6); ctx.lineWidth = 3; for (let i = 0; i < 70; i++){ const rx = -300 + (rnd(i) * 1700 + t * 120) % 1700, ry = (rnd(i + 9) * 1900 + t * 1400) % 1900; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 14, ry + 46); ctx.stroke(); } } };
  ITEMS.umbrella = (ctx, t, o) => { ctx.rotate(-.15 + Math.sin(t * 2) * .04); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -300); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-200, -300); ctx.quadraticCurveTo(0, -470, 200, -300); for (let i = 3; i >= 0; i--) ctx.quadraticCurveTo(-200 + (i + .5) * 100, -330, -200 + i * 100, -300); ctx.closePath(); ctx.fillStyle = "#2C3E66"; ctx.fill(); ol(ctx, 5); };

  /* ---- _panggung: Andi on the office stage with the trophy, audience clapping (PLOK) ---- */
  TT.scene(PX + "panggung", "Cerita: panggung kecil kantor, penghargaan proyek terbaik, piala diangkat, penonton bertepuk PLOK", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const P2 = R.f.panggung; if (P2) BG.panggung(ctx, t, P2); },
      over: (ctx, c, sts, R) => { const P2 = R.f.panggung; if (!P2) return; const tC = T(s, P2.clapCue, .3, idx); if (t < tC) return;
        sts.forEach((st, j) => { if (j === 0) return; const hp = toonHead(st), p = scr(R.c, hp[0], hp[1] - st.size * .3); const k = (t - tC + j * .37) % 1.1; popWord(ctx, "PLOK", p[0] + (j % 2 ? 40 : -40), p[1], k, { size: 48, hold: .9, rot: j % 2 ? 8 : -8 }); }); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P2 = f.panggung; if (P2) add(cueT(s, P2.clapCue, .3, i), "pop"); });

  /* ---- _kenang: applause cut to night at home; Andi tidies his desk, three glowing memories float up from the trophy ---- */
  BG.meja = (ctx, t, o, s, shotT) => { const x = o.x ?? 760; prop(ctx, "desk", x, GY, { s: 1, papers: 3, lx: 150, laptop: true, back: true }, t); };
  TT.scene(PX + "kenang", "Cerita: tepuk tangan lalu malam di rumah, Andi membereskan meja; di piagamnya muncul tiga baris nama kosong bertanda tanya", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const K = R.f.kenang; if (K && K.stage) BG.panggung(ctx, t, K.stage); },
      mid: (ctx, c, sts, R) => { const K = R.f.kenang; if (!K || !K.blankCue) return; const tB = T(s, K.blankCue, .3, idx);
        const bl = [0, 1, 2].map(i => t < tB + i * .45 ? 0 : eBack(clamp((t - tB - i * .45) / .4, 0, 1)));
        ctx.save(); ctx.translate(K.x ?? 640, K.y ?? 1350); ctx.rotate(-.04 + Math.sin(t * 1.5) * .01); ctx.fillStyle = "#6B4A2E"; ctx.fillRect(-10, -60, 20, 60); piagam(ctx, K.w ?? 420, t, { glow: .5 + .3 * Math.sin(t * 3), blanks: bl }); ctx.restore(); },
      over: (ctx, c, sts, R) => { const K = R.f.kenang; if (!K || !K.blankCue) return; const k = t - T(s, K.blankCue, .3, idx) - 1.3; if (k >= 0) tag(ctx, "HAMPIR TERLUPA: SIAPA SAJA?", 540, 330, k, RED, "#FFFFFF", 42, -.04); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const K = F.kenang; if (K && K.blankCue) [0, 1, 2].forEach(j => add(cueT(s, K.blankCue, .3, i) + j * .45, "pop")); }); });

  /* ---- _topang: the stage Andi stands on is cut open: the people who helped are holding it up from below ---- */
  TT.scene(PX + "topang", "Cerita: panggung potong-lintang, papan depan panggung terbuka: satpam, staf keuangan, mentor menopang panggung tempat Andi berdiri", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx, c, sts, R) => { const P2 = R.f.topang; if (!P2) return; const x = P2.x ?? 540, top = P2.top ?? 970;
        BG.panggung(ctx, t, { x, top, bannerY: 220, banner: P2.banner });
        ctx.fillStyle = "#2B1A12"; ctx.fillRect(x - 480, top + 50, 960, GY - top - 10); // inside of the stage
        rr(ctx, x - 500, top, 1000, 50, 8); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); },
      front: (ctx, c, sts, R) => { const P2 = R.f.topang; if (!P2) return; const x = P2.x ?? 540, top = P2.top ?? 970, tR = T(s, P2.revealCue, .3, idx), rv = t < tR ? 0 : eOut(clamp((t - tR) / .7, 0, 1));
        if (rv > .3) sts.forEach((st, j) => { if (j === 0) return; const hp = handOf(st), bx = hp[0] - (st.face || 1) * 10; ctx.save(); ctx.globalAlpha *= clamp((rv - .3) / .4, 0, 1); rr(ctx, bx - 14, top + 50, 28, hp[1] - top - 40, 6); ctx.fillStyle = "#C98B4E"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
        if (rv < 1){ ctx.save(); ctx.translate(0, rv * 700); ctx.globalAlpha *= 1 - rv * .6; rr(ctx, x - 480, top + 50, 960, GY - top - 10, 10); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 5; for (let i = 1; i < 8; i++){ ctx.beginPath(); ctx.moveTo(x - 480 + i * 120, top + 54); ctx.lineTo(x - 480 + i * 120, GY + 30); ctx.stroke(); } ctx.restore(); }
        if (rv > 0 && rv < 1) for (let i = 0; i < 8; i++) smoke(ctx, x - 420 + i * 120, GY - 20, t, 1 - rv, { n: 2, h: 120, col: "#C9B8A0", s: .7 }); },
      over: (ctx, c, sts, R) => { const P2 = R.f.topang; if (!P2) return; const k = t - T(s, P2.revealCue, .3, idx) - .9; if (k >= 0 && k < 3) tag(ctx, "DITOPANG BANYAK ORANG", 540, 300, k, GREEN, "#FFFFFF", 48, -.04); }
    });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P2 = f.topang; if (P2){ add(cueT(s, P2.revealCue, .3, i), "whoosh"); add(cueT(s, P2.revealCue, .3, i) + .9, "chime"); } });
})();

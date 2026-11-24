/* Scene pack j2611221631522: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for JS47, SC47, MS47, SB48, SP48.
   Layout prefix j2611221631522_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, bg, bgOpt, ...}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, outCue, s, dx, dy, rot, ...}]  object in a toon's hand
     pops / stamps / tags / steps / confetti   screen overlays (see base)
     bg     "sortir" (tea factory sorting room) | "kafe" (cafe wall) | "atap" (office rooftop railing) | "batik" (batik workshop)
   Set pieces (layout suffix):
     JS47 _setoran  plantation office: board of late afternoon deliveries gets TELAT stamps, hologram of a pricey digital scale   f.setoran
          _bukit    tea hill: picker with back basket + caping, manager climbs up, pull back to the long zigzag walk to the warehouse  f.bukit
          _sketsa   hilltop: picker scratches a map in the soil with a stick, the sketch rises as a soil board, weighing post flag in the middle  f.sketsa
          _pos      dusk: new bamboo weighing post mid-hill, hanging scale swings, 7 day ticks, 20 -> 5 MENIT, scale brochure stamped BATAL  f.pos
     SC47 _kafe     cafe: salesman friend plops a wriggling sack "UNTUNG BESAR & CEPAT" on the table, savings envelope slides toward it  f.kafe
          _karung   imagination night market: sack seller, the bought sack wriggles, mystery silhouettes (cat? goat? boot?)       f.karung
          _empat    navy stage: giant sack with four question tags (untung, risiko, biaya, cairkan) that open a peek window + LEGAL & LOGIS  f.empat
          _tolak    cafe: four tags over the sack, the CAIRKAN tag stays red, polite no, cut to a see-through savings box at home  f.tolak
     MS47 _jatuh    park: an old man collapses, jogger panics, search bar types "nomor ambulans..." with a spinner           f.jatuh
          _sambung  street by the park: park ranger runs in shouting 1-1-2, signal rings to a tower, ambulance passes behind   f.sambung
          _kunci    navy stage: giant key ring, keys 112 (master, gold), 110, 113, 119 slide on with icons                    f.kunci
          _ambulans dusk: ambulance with flashing lights, paramedic opens the lock-screen emergency info, light streak to the daughter  f.ambulans
     SB48 _mimpi    office: colleague leaves for training with a suitcase, IMPIANKU poster on the cubicle wall yellows and gathers dust while the calendar flips 2 years  f.mimpi
          _bioskop  dark cinema: Andi alone with popcorn, the film of his boss asking him, reel runs out (TIDAK TAYANG)       f.bioskop
          _antena   imagination: boss wearing a silly mind-reading helmet, the dial shows static, papers whirl around her       f.antena
          _ruang    boss room: 15-minute ring, three cards dealt (INGIN, ALASAN, BANTUAN), notebook, calendar KELAS circled   f.ruang
     SP48 _tumpuk   batik workshop: folded cloth stack counts to 300, manager slaps TARGET 400 on the post and leaves          f.tumpuk
          _finis    imagination race track: team crosses the 300 tape, empty stands + cricket, starter pistol for 400; cut to a slow canting  f.finis
          _grafik   night office: daily log chart sinking, the manager realises, flat rhythm line starts beating again          f.grafik
          _tumpeng  workshop morning: small tumpeng, each named person gets a spotlight + praise chip; canting dances again      f.tumpeng
     _adegan  generic story shot with the extras above (used for the action scenes) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631522_";
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
    else if (kind === "phonekey"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA" }, t); const sw = Math.sin((t || 0) * 3) * .25; ctx.save(); ctx.translate(30, -10); ctx.rotate(sw);
      ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 50); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 66, 16, 0, TAU); ctx.stroke();
      [GOLD, "#3E7DB5", RED, "#FFFFFF"].forEach((cl, i) => { ctx.save(); ctx.translate(0, 66); ctx.rotate(-.6 + i * .4); rr(ctx, -5, 14, 10, 44, 3); ctx.fillStyle = cl; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(0, 66, 10, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); }); ctx.restore(); }
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

  /* ================= shared helpers for this pack ================= */
  const easeOut = eOut;
  const q01 = (t, T0, d) => t < T0 ? 0 : clamp((t - T0) / (d || .4), 0, 1);
  function clockFace(ctx, x, y, r, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); ol(ctx, Math.max(4, r * .1));
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = Math.max(3, r * .1); const a1 = (o.speed ?? 6) * t, a2 = a1 / 12;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a1) * r * .75, -Math.cos(a1) * r * .75); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a2) * r * .5, -Math.cos(a2) * r * .5); ctx.stroke(); ctx.restore(); }
  function caping(ctx, R, col){ if (!R) return; const r = R.r || 60, x = R.headX, y = R.top; ctx.save(); ctx.translate(x, y + r * .28);
    ctx.beginPath(); ctx.moveTo(-r * 1.55, r * .18); ctx.quadraticCurveTo(0, -r * 1.05, r * 1.55, r * .18); ctx.quadraticCurveTo(0, r * .42, -r * 1.55, r * .18); ctx.closePath(); ctx.fillStyle = col || "#E3C27A"; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = hexA("#8E6A2E", .7); ctx.lineWidth = 3; for (let i = -3; i <= 3; i++){ ctx.beginPath(); ctx.moveTo(0, -r * .62); ctx.lineTo(i * r * .45, r * .2); ctx.stroke(); } ctx.restore(); }
  function wicker(ctx, x, y, w, h, col, fill, t){ // basket, origin bottom centre
    ctx.save(); ctx.translate(x, y); if (fill > 0){ ctx.fillStyle = "#4E9A4A"; for (let i = 0; i < 9; i++){ const lx = (-w / 2 + 18) + (i % 5) * (w - 36) / 4, ly = -h - 6 - (i > 4 ? 22 : 0) * fill + Math.sin((t || 0) * 3 + i) * 2; ctx.beginPath(); ctx.ellipse(lx, ly, 22 * fill, 12 * fill, i * .7, 0, TAU); ctx.fill(); ol(ctx, 3); } }
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w * .4, 0); ctx.lineTo(-w * .4, 0); ctx.closePath(); ctx.fillStyle = col || "#B98A4E"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#6B4A22", .55); ctx.lineWidth = 3; for (let yy = -h + 12; yy < 0; yy += 14){ ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(w, yy); ctx.stroke(); } for (let xx = -w; xx < w; xx += 18){ ctx.beginPath(); ctx.moveTo(xx, -h); ctx.lineTo(xx * .8, 0); ctx.stroke(); } ctx.restore();
    rr(ctx, -w / 2 - 6, -h - 8, w + 12, 14, 7); ctx.fillStyle = "#8E6A3A"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function teaRows(ctx, x0, x1, y, rows, t, o){ o = o || {}; for (let r = 0; r < rows; r++){ const yy = y + r * (o.gap || 70), sc = 1 + r * .18; ctx.fillStyle = r % 2 ? "#3F8A45" : "#4C9B4E";
      ctx.beginPath(); ctx.moveTo(x0, yy + 40 * sc); for (let x = x0; x <= x1; x += 60 * sc){ const b = Math.sin(x * .05 + r) * 6 + Math.sin(t * 1.4 + x * .01 + r) * 3; ctx.quadraticCurveTo(x + 30 * sc, yy - 34 * sc - b, x + 60 * sc, yy + 2); } ctx.lineTo(x1, yy + 60 * sc); ctx.lineTo(x0, yy + 60 * sc); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = hexA("#20502A", .5); ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = hexA("#A8D88A", .55); for (let x = x0 + 20; x < x1; x += 90 * sc){ ctx.beginPath(); ctx.ellipse(x + (r * 37) % 50, yy - 14 * sc, 10 * sc, 5 * sc, -.4, 0, TAU); ctx.fill(); } } }
  function brochure(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot ?? -.05);
    glowAt(ctx, 0, 0, 300, "#9FE8FF", .35 + .1 * Math.sin(t * 5));
    rr(ctx, -190, -150, 380, 300, 22); ctx.fillStyle = hexA("#DFF6FF", .92); ctx.fill(); ctx.strokeStyle = "#3EA6D6"; ctx.lineWidth = 7; ctx.stroke();
    // digital scale
    rr(ctx, -120, 10, 240, 70, 14); ctx.fillStyle = "#C9CED3"; ctx.fill(); ol(ctx, 5); rr(ctx, -150, -6, 300, 26, 10); ctx.fillStyle = "#9AA3A8"; ctx.fill(); ol(ctx, 4);
    rr(ctx, -70, 24, 140, 40, 8); ctx.fillStyle = "#13223D"; ctx.fill(); textC(ctx, (8.88 + Math.sin(t * 9) * .3).toFixed(2), 0, 54, 30, "#7CFFB2", 900);
    textC(ctx, "TIMBANGAN DIGITAL", 0, -96, 30, "#13223D", 900, 330);
    if (o.price !== false){ ctx.save(); ctx.translate(120, -40); ctx.rotate(.18 + Math.sin(t * 4) * .05); rr(ctx, -80, -30, 160, 60, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, "MAHAL", 0, 13, 34, "#FFFFFF", 900); ctx.restore(); }
    for (let i = 0; i < 5; i++){ const a = t * 2 + i * 1.3; sparkle(ctx, Math.cos(a) * 220, Math.sin(a * 1.3) * 160, 12 + 6 * Math.sin(t * 6 + i), i % 2 ? "#FFFFFF" : GOLD); }
    ctx.restore(); }

  /* ================= JS47 backgrounds ================= */
  BG.kebun = (ctx, t, o) => { // tea hill ground in world coords (drawn on top of env sky)
    const gy = GY; ctx.fillStyle = "#8FB86A"; ctx.beginPath(); ctx.moveTo(-3000, gy - 520); for (let x = -3000; x <= 4200; x += 100) ctx.lineTo(x, gy - 520 - Math.sin(x * .0022 + 1) * 120); ctx.lineTo(4200, 5000); ctx.lineTo(-3000, 5000); ctx.fill();
    ctx.fillStyle = "#79A65A"; ctx.beginPath(); ctx.moveTo(-3000, gy - 330); for (let x = -3000; x <= 4200; x += 100) ctx.lineTo(x, gy - 330 - Math.sin(x * .003) * 60); ctx.lineTo(4200, 5000); ctx.lineTo(-3000, 5000); ctx.fill();
    teaRows(ctx, -1400, 2600, gy - 300, 3, t, { gap: 80 });
    ctx.fillStyle = "#B88B5A"; ctx.fillRect(-3000, gy - 70, 7200, 4000); ctx.fillStyle = "#A07648"; for (let i = 0; i < 40; i++){ ctx.beginPath(); ctx.ellipse(-1400 + rnd(i) * 3600, gy - 20 + rnd(i + 5) * 300, 14, 6, 0, 0, TAU); ctx.fill(); }
    if (o.slope){ ctx.fillStyle = "#6E9C4E"; ctx.fillRect(-3000, gy + 160, 4200, 5000); for (let r = 0; r < 8; r++) teaRows(ctx, -1400, 1300 - r * 40, gy + 240 + r * 120, 1, t, { gap: 0 }); }
    if (o.slope){ // long descent to the warehouse (right side)
      ctx.fillStyle = "#6E9C4E"; ctx.beginPath(); ctx.moveTo(1000, gy - 70); ctx.quadraticCurveTo(1700, gy + 200, 2300, gy + 1000); ctx.lineTo(3400, gy + 1000); ctx.lineTo(3400, 5000); ctx.lineTo(1000, 5000); ctx.closePath(); ctx.fill();
      for (let r = 0; r < 9; r++){ const yy = gy + 30 + r * 110, x0 = 1050 + r * 120; teaRows(ctx, x0, x0 + 1500, yy, 1, t, { gap: 0 }); }
      ctx.fillStyle = "#B88B5A"; ctx.fillRect(1900, gy + 1000, 1500, 600); // flat yard at the bottom
      // warehouse
      const wx = 2300, wy = gy + 1010; rr(ctx, wx - 240, wy - 300, 480, 300, 8); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 7);
      ctx.beginPath(); ctx.moveTo(wx - 290, wy - 290); ctx.lineTo(wx, wy - 470); ctx.lineTo(wx + 290, wy - 290); ctx.closePath(); ctx.fillStyle = "#B5524A"; ctx.fill(); ol(ctx, 7);
      rr(ctx, wx - 70, wy - 170, 140, 170, 6); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 5); textC(ctx, "GUDANG", wx, wy - 220, 58, BROWN, 900); }
  };
  BG.sortir = (ctx, t, o) => { // tea factory sorting room
    ctx.fillStyle = "#E6D3B3"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#D2BC96"; ctx.fillRect(-2600, GY - 520, 6400, 360);
    for (let k = 0; k < 2; k++){ const x = 80 + k * 640; rr(ctx, x, 420, 360, 300, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = "#7FB46A"; ctx.beginPath(); ctx.moveTo(x, 660); for (let i = 0; i <= 8; i++) ctx.lineTo(x + i * 45, 600 - Math.sin(i + k) * 40); ctx.lineTo(x + 360, 720); ctx.lineTo(x, 720); ctx.fill(); ctx.restore(); rr(ctx, x, 420, 360, 300, 14); ol(ctx, 8); }
    // racks of withering trays
    [-420, 1250].forEach(rx => { for (let r = 0; r < 5; r++){ const y = 560 + r * 150; rr(ctx, rx, y, 300, 26, 6); ctx.fillStyle = "#9C6B3F"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#4E9A4A"; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.ellipse(rx + 30 + i * 46, y - 8 + Math.sin(t * 2 + i + r) * 2, 20, 9, .3, 0, TAU); ctx.fill(); } } });
    // sacks of tea
    [[1060, "TEH"], [1180, "TEH"]].forEach(([x, l], i) => { ctx.beginPath(); ctx.moveTo(x - 70, GY - 30); ctx.quadraticCurveTo(x - 90, GY - 200, x - 40, GY - 240); ctx.lineTo(x + 40, GY - 240); ctx.quadraticCurveTo(x + 90, GY - 200, x + 70, GY - 30); ctx.closePath(); ctx.fillStyle = "#D8C08E"; ctx.fill(); ol(ctx, 5); textC(ctx, l, x, GY - 110, 34, "#3E7A3E", 900); });
    ctx.fillStyle = "#A47A55"; ctx.fillRect(-2600, GY - 160, 6400, 2000);
  };

  /* ================= JS47: _setoran (late deliveries board, pricey scale hologram) ================= */
  TT.scene(PX + "setoran", "Cerita: kantor kebun teh, papan SETORAN SORE dicap TELAT tiap hari, hologram timbangan digital mahal", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ bx: 770, by: 560 }, f.setoran || {});
    const tBoard = T(s, K.boardCue, .3, idx), tLate = T(s, K.lateCue, .3, idx), tScale = T(s, K.scaleCue, .3, idx);
    const rows = K.rows || [["SEN", "17.40"], ["SEL", "17.55"], ["RAB", "18.10"], ["KAM", "17.50"]];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plant: false },
      back: () => {
        // window to the tea hills (left wall)
        rr(ctx, -60, 430, 400, 340, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = "#8FB86A"; ctx.beginPath(); ctx.moveTo(-60, 700); for (let i = 0; i <= 10; i++) ctx.lineTo(-60 + i * 40, 640 - Math.sin(i * .8) * 50); ctx.lineTo(340, 780); ctx.lineTo(-60, 780); ctx.fill();
        ctx.save(); ctx.translate(0, 70); teaRows(ctx, -60, 340, 640, 2, t, { gap: 40 }); ctx.restore(); ctx.restore(); rr(ctx, -60, 430, 400, 340, 14); ctx.strokeStyle = "#FFF6EA"; ctx.lineWidth = 18; ctx.stroke();
        // board
        const q = t < tBoard ? .92 : 1 + .04 * Math.max(0, 1 - (t - tBoard) * 3); ctx.save(); ctx.translate(K.bx, K.by + 250); ctx.scale(q, q); ctx.translate(-K.bx, -(K.by + 250));
        rr(ctx, K.bx - 250, K.by, 500, 500, 18); ctx.fillStyle = "#2F4A3A"; ctx.fill(); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 16; ctx.stroke();
        textC(ctx, "SETORAN SORE", K.bx, K.by + 66, 44, "#FFFFFF", 900, 440); textC(ctx, "TARGET 16.00", K.bx, K.by + 108, 28, GOLD, 800, 400);
        rows.forEach(([d, h], i) => { const y = K.by + 170 + i * 82; textL(ctx, d, K.bx - 200, y + 12, 36, "#E8F0E0", 800); textL(ctx, h, K.bx - 80, y + 12, 36, "#FFFFFF", 900);
          const k = t - tLate - i * .32; if (k >= 0) stampBox(ctx, "TELAT", K.bx + 140, y, k, RED, 30, -.18); });
        ctx.restore();
      },
      over: (c2, c) => {
        if (t >= tScale){ const q = eBack(clamp((t - tScale) / .5, 0, 1)), p = c.toScreen(K.sx ?? 760, K.sy ?? 760); brochure(ctx, clamp(p[0], 300, 780), Math.max(360, p[1]), .95 * q, t, {}); }
        if (t >= tLate && t < tLate + 1.6) popWord(ctx, "TELAT LAGI!", 540, 300, t - tLate - .9, { size: 96, hold: 1.2, col: RED });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.setoran || {}; if (K.lateCue){ const a = cueT(s, K.lateCue, .3, i); for (let k = 0; k < 4; k++) add(a + k * .32 + .05, "pop"); } if (K.scaleCue) add(cueT(s, K.scaleCue, .3, i), "chime"); });

  /* ================= JS47: _bukit (tea hill, long walk down to the warehouse) ================= */
  TT.scene(PX + "bukit", "Cerita: bukit teh, pemetik bercaping dengan keranjang di punggung, manajer naik berkeringat, tarik mundur ke jalan zig-zag panjang ke gudang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ picker: 1 }, f.bukit || {});
    const tPick = K.pickCue ? T(s, K.pickCue, .2, idx) : 0, tWalk = T(s, K.walkCue, .3, idx), tMin = T(s, K.minCue, .3, idx), tGud = T(s, K.gudCue, .3, idx);
    const path = [[900, 1600], [1300, 1700], [1150, 1840], [1650, 1960], [1500, 2120], [2050, 2260], [1950, 2450], [2250, 2600]];
    const segL = []; let L = 0; for (let i = 1; i < path.length; i++){ const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segL.push(d); L += d; }
    const ptAt = q => { let d = q * L; for (let i = 0; i < segL.length; i++){ if (d <= segL[i]){ const u = d / segL[i]; return [lerp(path[i][0], path[i + 1][0], u), lerp(path[i][1], path[i + 1][1], u)]; } d -= segL[i]; } return path[path.length - 1]; };
    base(ctx, s, t, { env: "sky", envOpt: { time: "day" }, envFront: false,
      back: () => { BG.kebun(ctx, t, { slope: true });
        if (t >= tWalk){ const q = clamp((t - tWalk) / 3.2, 0, 1); ctx.save(); ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = hexA("#FFFFFF", .95); ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath();
          const n = 80; for (let i = 0; i <= n * q; i++){ const p = ptAt(i / n); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
          const p = ptAt(q), bob = Math.abs(Math.sin(t * 9)) * 10; ctx.save(); ctx.translate(p[0], p[1] - bob); // tiny walker with basket
          ctx.fillStyle = "#3E9B5A"; rr(ctx, -26, -110, 52, 80, 14); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#C98E6A"; ctx.beginPath(); ctx.arc(0, -138, 26, 0, TAU); ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#B5524A"; ctx.beginPath(); ctx.arc(0, -142, 28, Math.PI, 0); ctx.fill(); wicker(ctx, -40, -50, 58, 60, null, 1, t); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-12, -30); ctx.lineTo(-18 + Math.sin(t * 9) * 10, 0); ctx.moveTo(12, -30); ctx.lineTo(18 - Math.sin(t * 9) * 10, 0); ctx.stroke(); ctx.restore(); }
      },
      under: (c2, c, sts, j) => { if (j !== K.picker) return; const st = sts[j], k = st.size / 760, fc = st.face || 1; wicker(ctx, st.x - fc * 120 * k, st.y - 330 * k, 200 * k, 190 * k, null, 1, t); },
      over1: (c2, c, sts, j, R) => { if (j !== K.picker) return; caping(ctx, R[j]);
        if (t >= tPick && t < tWalk){ const st = sts[j], h = handOf(st); for (let i = 0; i < 3; i++){ const q = ((t - tPick) * .9 + i / 3) % 1; const x = lerp(h[0], st.x - (st.face || 1) * 120 * st.size / 760, q), y = lerp(h[1], st.y - 520 * st.size / 760, q) - Math.sin(q * Math.PI) * 120;
          ctx.fillStyle = "#4E9A4A"; ctx.beginPath(); ctx.ellipse(x, y, 16, 8, q * 6, 0, TAU); ctx.fill(); ol(ctx, 3); } } },
      over: (c2, c) => {
        if (t >= tMin){ const q = eBack(clamp((t - tMin) / .4, 0, 1)); ctx.save(); ctx.translate(K.minX ?? 760, K.minY ?? 330); ctx.scale(q, q); rr(ctx, -230, -70, 460, 140, 70); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7); clockFace(ctx, -150, 0, 48, t, { speed: 9 }); textC(ctx, K.minText || "20 MENIT", 40, 26, 66, "#FFFFFF", 900, 300); ctx.restore(); }
        if (t >= tGud){ const p = c.toScreen(2300, GY + 600); popChip(ctx, "TURUN KE GUDANG", clamp(p[0], 250, 830), Math.max(480, p[1]), t - tGud, NAVY, "#FFFFFF", 34); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.bukit || {}; if (K.walkCue) add(cueT(s, K.walkCue, .3, i), "whoosh"); if (K.minCue) add(cueT(s, K.minCue, .3, i), "ping"); if (K.gudCue) add(cueT(s, K.gudCue, .3, i), "pop"); });

  /* ================= JS47: _sketsa (map scratched in the soil rises as a board, weighing post mid-hill) ================= */
  TT.scene(PX + "sketsa", "Cerita: puncak bukit teh, pemetik menggores peta di tanah dengan ranting, sketsa naik jadi papan tanah, bendera POS TIMBANG di tengah kebun", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ picker: 1, bx: 540, by: 640, w: 820, h: 500 }, f.sketsa || {});
    const tFreeze = T(s, K.freezeCue, .3, idx), tKnow = T(s, K.knowCue, .3, idx), tDraw = T(s, K.drawCue, .3, idx), tPos = T(s, K.posCue, .3, idx), tMid = T(s, K.midCue, .3, idx);
    base(ctx, s, t, { env: "sky", envOpt: { time: "day" }, envFront: false,
      back: (c2, c, sts) => { BG.kebun(ctx, t, {});
        // aura behind the picker when the insight lands
        if (t >= tKnow){ const st = sts[K.picker], hp = toonHead(st), a = clamp((t - tKnow) / .5, 0, 1); ctx.save(); ctx.globalAlpha = a * .85; ctx.translate(hp[0], hp[1]); ctx.rotate(t * .4);
          for (let i = 0; i < 14; i++){ ctx.rotate(TAU / 14); ctx.fillStyle = i % 2 ? hexA(GOLD, .55) : hexA("#FFFFFF", .5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, -70); ctx.lineTo(900, 70); ctx.closePath(); ctx.fill(); } ctx.restore(); }
        // soil board (sketch)
        if (t >= tDraw){ const q = eBack(clamp((t - tDraw - .3) / .6, 0, 1)), d = clamp((t - tDraw - .5) / 2.2, 0, 1); ctx.save(); ctx.translate(K.bx, K.by + (1 - q) * 500); ctx.scale(q, q); ctx.rotate(-.02);
          rr(ctx, -K.w / 2, -K.h / 2, K.w, K.h, 26); ctx.fillStyle = "#9C6B3F"; ctx.fill(); ol(ctx, 8); ctx.fillStyle = hexA("#7A4A22", .5); for (let i = 0; i < 30; i++){ ctx.beginPath(); ctx.arc(-K.w / 2 + 30 + rnd(i) * (K.w - 60), -K.h / 2 + 30 + rnd(i + 4) * (K.h - 60), 4 + rnd(i + 8) * 5, 0, TAU); ctx.fill(); }
          ctx.strokeStyle = "#F3E2C4"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round";
          const hill = [[-360, 200], [-240, 20], [-100, -160], [0, -200], [120, -150], [260, 40], [360, 200]]; ctx.beginPath(); const nh = Math.max(1, Math.floor(hill.length * Math.min(1, d * 2.2))); hill.slice(0, nh).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
          if (d > .3){ ctx.save(); ctx.globalAlpha = clamp((d - .3) * 4, 0, 1); textC(ctx, "KEBUN", -10, -110, 30, "#F3E2C4", 900); rr(ctx, 230, 120, 110, 70, 6); ctx.stroke(); textC(ctx, "GUDANG", 285, 225, 26, "#F3E2C4", 900); ctx.restore(); }
          // long path (old) dashed
          if (d > .5){ ctx.save(); ctx.setLineDash([16, 14]); ctx.globalAlpha = clamp((d - .5) * 4, 0, 1); ctx.strokeStyle = t >= tPos ? hexA("#F3E2C4", .4) : "#F3E2C4"; ctx.beginPath(); ctx.moveTo(-10, -170); ctx.lineTo(150, -60); ctx.lineTo(60, 20); ctx.lineTo(220, 90); ctx.lineTo(280, 140); ctx.stroke(); ctx.restore(); }
          if (t >= tPos){ const pq = eBack(clamp((t - tPos) / .4, 0, 1)); ctx.save(); ctx.translate(40, -40); ctx.scale(pq, pq); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, -110); ctx.stroke();
            ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(90 + Math.sin(t * 8) * 8, -85); ctx.lineTo(0, -60); ctx.closePath(); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 30, 22, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore(); }
          if (t >= tMid){ const g = clamp((t - tMid) / .6, 0, 1); ctx.strokeStyle = "#7CFFB2"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-10, -170); ctx.lineTo(lerp(-10, 40, g), lerp(-170, -10, g)); ctx.stroke(); }
          ctx.restore(); }
      },
      under: (c2, c, sts, j) => { if (j !== K.picker) return; const st = sts[j], k = st.size / 760, fc = st.face || 1; wicker(ctx, st.x - fc * 120 * k, st.y - 330 * k, 200 * k, 190 * k, null, 1, t); },
      over1: (c2, c, sts, j, R) => { if (j !== K.picker) return; caping(ctx, R[j]);
        if (t >= tDraw - .2){ const st = sts[j], h = handOf(st), sw = Math.sin(t * 14) * .25; ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(.9 * (st.face || 1) + sw); ctx.strokeStyle = "#6B4429"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 240); ctx.stroke(); ctx.restore();
          if (t < tDraw + 2.5){ for (let i = 0; i < 6; i++){ const q = ((t * 1.6) + i / 6) % 1; ctx.fillStyle = hexA("#B88B5A", .8 * (1 - q)); ctx.beginPath(); ctx.arc(st.x + (st.face || 1) * (180 + i * 14), GY - 30 - q * 90, 10 + q * 14, 0, TAU); ctx.fill(); } } } },
      over: () => {
        if (t >= tFreeze && t < tFreeze + .7){ ctx.save(); ctx.globalAlpha = .35 * (1 - (t - tFreeze) / .7); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
        if (t >= tKnow) { const k = t - tKnow - .5; if (k >= 0 && t < tDraw) stampBox(ctx, K.knowText || "PALING TAHU", 540, 330, k, ORANGE, 72, -.06); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.sketsa || {}; if (K.freezeCue) add(cueT(s, K.freezeCue, .3, i), "ping"); if (K.knowCue) add(cueT(s, K.knowCue, .3, i) + .5, "chime"); if (K.drawCue) add(cueT(s, K.drawCue, .3, i) + .3, "whoosh"); if (K.posCue) add(cueT(s, K.posCue, .3, i), "pop"); if (K.midCue) add(cueT(s, K.midCue, .3, i), "chime"); });

  /* ================= JS47: _pos (bamboo weighing post mid-hill at dusk) ================= */
  TT.scene(PX + "pos", "Cerita: senja, pos timbang bambu di tengah kebun, dacin bergoyang, 7 hari dicentang, 20 jadi 5 MENIT, brosur timbangan dicap BATAL", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ px: 760 }, f.pos || {});
    const tWeek = T(s, K.weekCue, .2, idx), tMin = T(s, K.minCue, .3, idx), tOn = T(s, K.onCue, .3, idx), tBatal = T(s, K.batalCue, .3, idx), tHang = T(s, K.hangCue, .3, idx);
    base(ctx, s, t, { env: "sunset", envOpt: { hills: false }, envFront: false,
      back: () => { BG.kebun(ctx, t, {});
        const x = K.px, gy = GY; // bamboo hut
        ctx.fillStyle = "#C9A36A"; [x - 230, x + 230].forEach(px => { rr(ctx, px - 14, gy - 640, 28, 640, 8); ctx.fill(); ol(ctx, 5); });
        ctx.beginPath(); ctx.moveTo(x - 330, gy - 600); ctx.lineTo(x, gy - 790); ctx.lineTo(x + 330, gy - 600); ctx.closePath(); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = hexA("#5A3A1A", .6); ctx.lineWidth = 4; for (let i = -5; i <= 5; i++){ ctx.beginPath(); ctx.moveTo(x, gy - 790); ctx.lineTo(x + i * 64, gy - 600); ctx.stroke(); }
        rr(ctx, x - 240, gy - 620, 480, 26, 8); ctx.fillStyle = "#C9A36A"; ctx.fill(); ol(ctx, 5);
        // sign
        rr(ctx, x - 150, gy - 760, 300, 64, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, "POS TIMBANG", x, gy - 716, 34, BROWN, 900, 280);
        // hanging scale (dacin) with basket
        const sw = Math.sin(t * 2.2) * .06 + (t >= tHang ? Math.sin((t - tHang) * 9) * .25 * Math.exp(-(t - tHang) * 1.5) : 0);
        ctx.save(); ctx.translate(x + 40, gy - 600); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 120); ctx.stroke();
        rr(ctx, -190, 112, 380, 16, 8); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(150 - (t >= tHang ? 60 * clamp((t - tHang) / 1, 0, 1) : 0), 128, 20, 0, TAU); ctx.fillStyle = "#4A4550"; ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.moveTo(-170, 128); ctx.lineTo(-170, 230); ctx.stroke(); if (t >= tHang) wicker(ctx, -170, 360, 150, 130, null, 1, t); else { ctx.beginPath(); ctx.arc(-170, 236, 12, 0, Math.PI); ctx.stroke(); } ctx.restore();
      },
      under: (c2, c, sts, j) => { if (!(K.baskets || []).includes(j)) return; const st = sts[j], k = st.size / 760, fc = st.face || 1; if (j === K.hangBy && t >= tHang) return; wicker(ctx, st.x - fc * 120 * k, st.y - 330 * k, 200 * k, 190 * k, null, 1, t); },
      over1: (c2, c, sts, j, R) => { if ((K.capings || []).includes(j)) caping(ctx, R[j]); },
      over: (c2, c) => {
        if (t >= tWeek && t < tMin + .25){ ctx.save(); ctx.globalAlpha *= 1 - q01(t, tMin, .25); const days = ["S", "S", "R", "K", "J", "S", "M"]; days.forEach((d, i) => { const k = t - tWeek - i * .16; if (k < 0) return; const q = eBack(clamp(k / .3, 0, 1)), x = 540 + (i - 3) * 122; ctx.save(); ctx.translate(x, 300); ctx.scale(q, q);
          ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); textC(ctx, d, 0, -2, 34, "#FFFFFF", 900); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 16); ctx.lineTo(-4, 26); ctx.lineTo(16, 8); ctx.stroke(); ctx.restore(); }); ctx.restore(); }
        if (t >= tMin && t < tOn + .25){ const q = eBack(clamp((t - tMin) / .4, 0, 1)) * (1 - q01(t, tOn, .25)), cr = clamp((t - tMin - .5) / .3, 0, 1); ctx.save(); ctx.translate(540, 330); ctx.scale(q, q);
          rr(ctx, -330, -60, 300, 120, 60); ctx.fillStyle = hexA(RED, .85); ctx.fill(); ol(ctx, 6); textC(ctx, "20 MENIT", -180, 22, 52, "#FFFFFF", 900, 260);
          if (cr > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-320, 0); ctx.lineTo(lerp(-320, -40, cr), 0); ctx.stroke(); }
          arrowLine(ctx, -10, 0, 60, 0, CREAM, 14, cr); const g = q01(t, tMin + .7, .35); if (g > 0){ ctx.save(); ctx.translate(210, 0); ctx.scale(eBack(g), eBack(g)); rr(ctx, -130, -70, 260, 140, 70); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 7); textC(ctx, "5 MENIT", 0, 24, 60, "#FFFFFF", 900, 230); ctx.restore(); }
          ctx.restore(); }
        if (t >= tOn && t < tBatal + .25){ const k = t - tOn; ctx.save(); ctx.globalAlpha *= 1 - q01(t, tBatal, .25); const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(200, 330); ctx.scale(q, q); clockFace(ctx, 0, 0, 66, 4 + Math.min(k, 1) * .2, { speed: 0 }); ctx.restore(); stampBox(ctx, "TEPAT WAKTU", 590, 330, k - .2, GREEN, 64, -.08); ctx.restore(); }
        if (t >= tBatal){ const k = t - tBatal, fly = clamp((k - 1.1) / .6, 0, 1); brochure(ctx, 540 + fly * 900, 420 - fly * 200, .8, t, { rot: -.05 + fly * 1.2, price: false }); stampBox(ctx, "BATAL", 540 + fly * 900, 420 - fly * 200, k - .25, RED, 90, -.2); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pos || {}; if (K.weekCue){ const a = cueT(s, K.weekCue, .2, i); for (let k = 0; k < 7; k += 2) add(a + k * .16, "pop"); } if (K.minCue){ add(cueT(s, K.minCue, .3, i) + .5, "whoosh"); add(cueT(s, K.minCue, .3, i) + .75, "chime"); }
    if (K.onCue) add(cueT(s, K.onCue, .3, i) + .2, "ping"); if (K.batalCue){ add(cueT(s, K.batalCue, .3, i) + .25, "pop"); add(cueT(s, K.batalCue, .3, i) + 1.1, "whoosh"); } if (K.hangCue) add(cueT(s, K.hangCue, .3, i), "pop"); });

  /* ================= SC47 shared: cafe wall, sack (karung), see-through savings box ================= */
  BG.kafe = (ctx, t, o) => {
    ctx.fillStyle = "#F0DDC0"; ctx.fillRect(-2600, -1200, 6400, GY + 1200);
    // brick lower wall
    ctx.fillStyle = "#C97B5A"; ctx.fillRect(-2600, GY - 560, 6400, 420); ctx.strokeStyle = hexA("#F0DDC0", .7); ctx.lineWidth = 5;
    for (let r = 0, y = GY - 560; y < GY - 140; y += 52, r++){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); for (let x = -2600 + (r % 2) * 60; x < 3800; x += 120){ ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 52); ctx.stroke(); } }
    // chalkboard menu
    const mx = o.menuX ?? 760; rr(ctx, mx - 210, 380, 420, 330, 14); ctx.fillStyle = "#2B3A33"; ctx.fill(); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 14; ctx.stroke();
    textC(ctx, "MENU KOPI", mx, 440, 40, "#FFFFFF", 900); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 4; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(mx - 160, 500 + i * 50); ctx.lineTo(mx + 40 - (i % 2) * 40, 500 + i * 50); ctx.stroke(); ctx.beginPath(); ctx.moveTo(mx + 100, 500 + i * 50); ctx.lineTo(mx + 160, 500 + i * 50); ctx.stroke(); }
    // window with street
    const wx = o.winX ?? 140; rr(ctx, wx - 200, 400, 400, 360, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.save(); ctx.clip(); for (let b = 0; b < 6; b++){ ctx.fillStyle = b % 2 ? "#D8CDB9" : "#C9C2B4"; ctx.fillRect(wx - 200 + b * 70, 560 - rnd(b + 3) * 120, 62, 400); } ctx.restore(); rr(ctx, wx - 200, 400, 400, 360, 14); ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 14; ctx.stroke();
    // pendant lamps
    [300, 780].forEach((lx, i) => { const sw = Math.sin(t * 1.1 + i) * .05; ctx.save(); ctx.translate(lx, -200); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 470); ctx.stroke();
      glowAt(ctx, 0, 520, 220, "#FFD9A0", .35); ctx.beginPath(); ctx.moveTo(-50, 520); ctx.quadraticCurveTo(0, 430, 50, 520); ctx.closePath(); ctx.fillStyle = i ? "#2F6F73" : ORANGE; ctx.fill(); ol(ctx, 4); ctx.restore(); });
    ctx.fillStyle = "#8E5A34"; ctx.fillRect(-2600, GY - 160, 6400, 2000); ctx.strokeStyle = hexA(OUT, .15); ctx.lineWidth = 3; for (let x = -2600; x < 3800; x += 90){ ctx.beginPath(); ctx.moveTo(x, GY - 160); ctx.lineTo(x - 120, GY + 600); ctx.stroke(); }
  };
  function cafeTable(ctx, x0, x1, top, t, o){ o = o || {}; ctx.fillStyle = "#6B4429"; [x0 + 50, x1 - 50].forEach(x => { rr(ctx, x - 14, top + 30, 28, 400, 6); ctx.fill(); ol(ctx, 4); });
    rr(ctx, x0, top, x1 - x0, 40, 12); ctx.fillStyle = "#A0673E"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .18); ctx.fillRect(x0 + 20, top + 6, x1 - x0 - 40, 8);
    (o.cups || []).forEach(cx => { ctx.save(); ctx.translate(cx, top + 2); mug(ctx, "#FFFFFF"); for (let k = 0; k < 2; k++){ const q = (t * .6 + k / 2) % 1; ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6 + k * 12, -70 - q * 50); ctx.quadraticCurveTo(-16 + k * 12, -86 - q * 50, -4 + k * 12, -104 - q * 50); ctx.stroke(); } ctx.restore(); }); }
  function karung(ctx, x, y, h, t, o){ // origin = bottom centre
    o = o || {}; const w = h * .78, wg = o.wiggle || 0, op = o.open || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 7) * .05 * wg);
    const b1 = Math.sin(t * 9) * 26 * wg, b2 = Math.cos(t * 7.3) * 22 * wg;
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 0, w * .55, h * .07, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-w * .45, 0); ctx.bezierCurveTo(-w * .62 - b1, -h * .35, -w * .5 + b2, -h * .7, -w * .16, -h * .8); ctx.lineTo(w * .16, -h * .8); ctx.bezierCurveTo(w * .5 + b1, -h * .7, w * .62 - b2, -h * .35, w * .45, 0); ctx.closePath();
    ctx.fillStyle = o.col || "#C9A66B"; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#8E6A3A", .35); ctx.lineWidth = 3; for (let yy = -h; yy < 0; yy += 12){ ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(w, yy); ctx.stroke(); } for (let xx = -w; xx < w; xx += 12){ ctx.beginPath(); ctx.moveTo(xx, -h); ctx.lineTo(xx, 0); ctx.stroke(); } ctx.restore(); ol(ctx, 6);
    if (o.mark){ textC(ctx, o.mark, 0, -h * .3, h * .3, hexA("#6B4A22", .75), 900); }
    // neck + ruffle
    const nw = w * (.16 + op * .22); ctx.beginPath(); ctx.moveTo(-nw, -h * .8); ctx.quadraticCurveTo(-nw - 20 - op * 30, -h * .98, -nw - 6, -h); ctx.lineTo(nw + 6, -h); ctx.quadraticCurveTo(nw + 20 + op * 30, -h * .98, nw, -h * .8); ctx.closePath(); ctx.fillStyle = o.col || "#C9A66B"; ctx.fill(); ol(ctx, 5);
    if (op > 0){ ctx.beginPath(); ctx.ellipse(0, -h, nw + 6, 14 + op * 20, 0, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); ol(ctx, 4); if (o.glow) glowAt(ctx, 0, -h - 10, 160 * op, "#FFE9A8", .6 * op); }
    else { ctx.strokeStyle = "#7A4A22"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-w * .17, -h * .82); ctx.lineTo(w * .17, -h * .82); ctx.stroke(); }
    if (o.ears){ const e = o.ears; ctx.fillStyle = "#C9A66B"; [-1, 1].forEach(sg => { ctx.beginPath(); ctx.moveTo(sg * w * .12 + b2 * .3, -h * .62); ctx.lineTo(sg * w * .22 + b2 * .3, -h * .62 - 70 * e); ctx.lineTo(sg * w * .32 + b2 * .3, -h * .58); ctx.closePath(); ctx.fill(); ol(ctx, 5); }); }
    if (o.tag){ ctx.save(); ctx.translate(w * .28, -h * .82); ctx.rotate(.25 + Math.sin(t * 3) * .08); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, 40); ctx.stroke(); ctx.translate(40, 40);
      const lw = Math.max(200, h * .9); rr(ctx, 0, -10, lw, lw * .34, 10); ctx.fillStyle = o.tagCol || GOLD; ctx.fill(); ol(ctx, 4); const L = lines2(ctx, o.tag, lw - 24, lw * .12, 900); L.L.forEach((l, i) => textC(ctx, l, lw / 2, -10 + lw * .17 + (i - (L.L.length - 1) / 2) * L.size * 1.05 + L.size * .35, L.size, BROWN, 900)); ctx.restore(); }
    ctx.restore(); }
  function clearBox(ctx, x, y, w, h, fill, t, label){ // origin bottom centre
    ctx.save(); ctx.translate(x, y); rr(ctx, -w / 2, -h, w, h, 14); ctx.fillStyle = hexA("#DFF3F7", .45); ctx.fill();
    // contents
    const n = Math.round(fill * 14); for (let i = 0; i < n; i++){ const cx = -w / 2 + 40 + (i % 5) * (w - 80) / 4, cy = -24 - Math.floor(i / 5) * 40; coin(ctx, cx + (Math.floor(i / 5) % 2) * 18, cy, 22, t * 2 + i); }
    rr(ctx, -w / 2, -h, w, h, 14); ctx.strokeStyle = "#5BA8C0"; ctx.lineWidth = 8; ctx.stroke(); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(-w / 2 + 16, -h + 16, 14, h - 40);
    if (label){ rr(ctx, -w * .38, -h - 60, w * .76, 56, 12); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 4); textC(ctx, label, 0, -h - 20, 30, "#FFFFFF", 900, w * .7); }
    ctx.restore(); }
  function envelope(ctx, x, y, s, rot, label){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); rr(ctx, -110, -70, 220, 140, 10); ctx.fillStyle = "#F7E7C6"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(0, 10); ctx.lineTo(110, -70); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); bill(ctx, 20, -78, -.15, "#7FB7A0", ""); textC(ctx, label || "TABUNGAN", 0, 52, 26, BROWN, 900, 200); ctx.restore(); }
  function silh(ctx, kind, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath();
    if (kind === "cat"){ ctx.arc(0, 10, 50, 0, TAU); ctx.moveTo(-46, -10); ctx.lineTo(-40, -70); ctx.lineTo(-10, -36); ctx.moveTo(46, -10); ctx.lineTo(40, -70); ctx.lineTo(10, -36); }
    else if (kind === "goat"){ ctx.ellipse(0, 14, 38, 54, 0, 0, TAU); ctx.moveTo(-20, -30); ctx.quadraticCurveTo(-70, -80, -40, -96); ctx.quadraticCurveTo(-36, -60, -6, -36); ctx.moveTo(20, -30); ctx.quadraticCurveTo(70, -80, 40, -96); ctx.quadraticCurveTo(36, -60, 6, -36); ctx.moveTo(-10, 60); ctx.lineTo(0, 92); ctx.lineTo(10, 60); }
    else { ctx.moveTo(-30, -70); ctx.lineTo(20, -70); ctx.lineTo(20, 10); ctx.lineTo(70, 30); ctx.lineTo(70, 64); ctx.lineTo(-30, 64); ctx.closePath(); }
    ctx.fill(); ctx.restore(); }

  /* ================= SC47: _kafe (sack of "big quick profit" plopped on the cafe table) ================= */
  TT.scene(PX + "kafe", "Cerita: kafe, teman menaruh karung bergoyang berlabel UNTUNG BESAR & CEPAT di meja, amplop tabungan meluncur ke arahnya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ top: 1330, sackX: 520, envX: 800, envTo: 640 }, f.kafe || {});
    const tSack = T(s, K.sackCue, .2, idx), tTag = T(s, K.tagCue, .3, idx), tPush = T(s, K.pushCue, .3, idx), tQ = T(s, K.qCue, .3, idx);
    let sackScr = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plant: false }, envFront: false,
      back: () => BG.kafe(ctx, t, {}),
      front: (c2, c) => { cafeTable(ctx, 120, 960, K.top, t, { cups: [250, 900] });
        const ex = t < tPush ? K.envX : lerp(K.envX, K.envTo, easeIO(clamp((t - tPush) / .9, 0, 1))) + (t > tQ ? Math.sin(t * 30) * 4 * Math.max(0, 1 - (t - tQ)) : 0);
        envelope(ctx, ex, K.top - 40, .8, -.06, "TABUNGAN");
        if (t >= tSack){ const k = t - tSack, drop = k < .35 ? (1 - k / .35) * 700 : 0, sq = k >= .35 && k < .6 ? Math.sin((k - .35) / .25 * Math.PI) * .12 : 0;
          ctx.save(); ctx.translate(K.sackX, K.top - drop); ctx.scale(1 + sq, 1 - sq); karung(ctx, 0, 0, 320, t, { wiggle: .8, tag: t >= tTag ? "UNTUNG BESAR & CEPAT!" : null, mark: "?" }); ctx.restore();
          if (k >= .35 && k < 1) burstFx(ctx, K.sackX, K.top - 40, k - .35, GOLD, 10, 200); sackScr = c.toScreen(K.sackX, K.top - 360); }
        if (t >= tTag){ for (let i = 0; i < 6; i++){ const a = t * 1.5 + i; sparkle(ctx, K.sackX + Math.cos(a) * 230, K.top - 200 + Math.sin(a * 1.3) * 140, 12 + 6 * Math.sin(t * 7 + i), i % 2 ? GOLD : "#FFFFFF"); } } },
      over: () => { if (t >= tQ && sackScr) popWord(ctx, "???", sackScr[0], Math.max(320, sackScr[1] - 60), t - tQ, { size: 150, hold: 2.2, col: RED, rot: -3 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kafe || {}; if (K.sackCue){ add(cueT(s, K.sackCue, .2, i) + .33, "pop"); } if (K.tagCue) add(cueT(s, K.tagCue, .3, i), "chime"); if (K.pushCue) add(cueT(s, K.pushCue, .3, i), "whoosh"); if (K.qCue) add(cueT(s, K.qCue, .3, i), "ping"); });

  /* ================= SC47: _karung (imagination night market: buying a cat in a sack) ================= */
  TT.scene(PX + "karung", "Cerita: kakak menyela di kafe, lalu khayalan pasar malam: lapak karung, karung yang dibeli bergoyang, siluet isi misterius (kucing? kambing? sepatu?)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ buyer: 0 }, f.karung || {});
    const tCut = T(s, K.cutCue, .2, idx), tWho = T(s, K.whoCue, .3, idx), tMeow = T(s, K.meowCue, .3, idx);
    base(ctx, s, t, { envFront: false,
      back: () => { if (t < tCut){ BG.kafe(ctx, t, { menuX: 300, winX: 900 }); return; }
        // night market stall
        ctx.fillStyle = "#3B2A3A"; ctx.fillRect(-2600, GY - 160, 6400, 2000);
        const sx = 860; ctx.fillStyle = "#6B4429"; [sx - 300, sx + 300].forEach(px => { rr(ctx, px - 12, GY - 760, 24, 760, 6); ctx.fill(); ol(ctx, 4); });
        for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(sx - 340 + i * 113, GY - 760); ctx.lineTo(sx - 340 + (i + 1) * 113, GY - 760); ctx.lineTo(sx - 340 + (i + .5) * 113, GY - 690); ctx.closePath(); ctx.fillStyle = i % 2 ? "#D9483B" : "#FFF4E6"; ctx.fill(); ol(ctx, 4); }
        for (let i = 0; i < 12; i++){ const bx = -400 + i * 140, by = GY - 860 + Math.sin(i) * 20; ctx.strokeStyle = OUT; ctx.lineWidth = 3; if (i) { ctx.beginPath(); ctx.moveTo(bx - 140, GY - 860 + Math.sin(i - 1) * 20); ctx.quadraticCurveTo(bx - 70, by + 30, bx, by); ctx.stroke(); } glowAt(ctx, bx, by + 14, 60, "#FFD27A", .5 + .3 * Math.sin(t * 4 + i)); ctx.fillStyle = ["#FFD27A", "#FF9C7A", "#9FE8C9"][i % 3]; ctx.beginPath(); ctx.arc(bx, by + 14, 13, 0, TAU); ctx.fill(); }
        rr(ctx, sx - 320, GY - 420, 640, 40, 8); ctx.fillStyle = "#A0673E"; ctx.fill(); ol(ctx, 5); rr(ctx, sx - 300, GY - 380, 600, 380, 6); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 5);
        [[-200, 220], [-40, 260], [130, 230]].forEach(([dx, hh], i) => karung(ctx, sx + dx, GY - 420, hh, t + i, { wiggle: .25 + .2 * i, mark: "?" }));
        rr(ctx, sx - 170, GY - 830, 340, 70, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "KARUNG MISTERI", sx, GY - 783, 34, BROWN, 900, 310); },
      front: (c2, c, sts) => { if (t < tCut) return; const st = sts[K.buyer]; if (!st) return; const h = handOf(st), wg = t >= tMeow ? 1.6 : .9;
        karung(ctx, h[0] + 90 * (st.face || 1), h[1] + 230, 300, t, { wiggle: wg, ears: t >= tMeow ? clamp((t - tMeow) / .3, 0, 1) * (.6 + .4 * Math.abs(Math.sin(t * 5))) : 0, mark: "?" }); },
      over: (c2, c) => {
        if (t >= tWho){ const kinds = [["cat", "KUCING?"], ["goat", "KAMBING?"], ["boot", "SEPATU?"]]; kinds.forEach(([kd, lb], i) => { const k = t - tWho - i * .45; if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)), x = 220 + i * 320;
          ctx.save(); ctx.translate(x, 360); ctx.scale(q, q); ctx.rotate(Math.sin(t * 3 + i) * .05); ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.fillStyle = hexA("#13223D", .85); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.stroke();
          silh(ctx, kd, 0, -10, .95, hexA("#000000", .85)); textC(ctx, "?", 60, 40, 70, GOLD, 900); ctx.restore(); popChip(ctx, lb, x, 510, k - .1, CREAM, BROWN, 30); }); }
        if (t >= tMeow) popWord(ctx, "MEONG?", 540, 640, t - tMeow, { size: 100, hold: 1.4, col: GOLD });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.karung || {}; if (K.whoCue){ const a = cueT(s, K.whoCue, .3, i); [0, .45, .9].forEach(d => add(a + d, "pop")); } if (K.meowCue) add(cueT(s, K.meowCue, .3, i), "ping"); });

  /* ================= SC47: _empat (four question tags on the sack + LEGAL & LOGIS) ================= */
  TT.scene(PX + "empat", "Cerita: panggung navy, karung raksasa dengan empat label pertanyaan (untung, risiko, biaya, cairkan) yang membuka intipan, lalu cek LEGAL & LOGIS", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ sx: 640, h: 560 }, f.empat || {});
    const Q = K.tags || [], tq = Q.map(q => T(s, q.cue, .3, idx)), tLegal = T(s, K.legalCue, .3, idx), chk = (K.checks || []).map(c => T(s, c.cue, .3, idx));
    const nOpen = tq.filter(x => t >= x).length;
    let mouth = null;
    base(ctx, s, t, { env: "info", envOpt: { spotX: K.sx },
      back: (c2, c) => { const jolt = tq.reduce((a, x) => a + (t >= x && t < x + .4 ? Math.sin((t - x) * 30) * 10 * (1 - (t - x) / .4) : 0), 0);
        ctx.save(); ctx.translate(jolt, 0); karung(ctx, K.sx, GY, K.h, t, { wiggle: .3, open: Math.min(1, nOpen / 4), glow: true, mark: "?", col: "#C9A66B" }); ctx.restore(); mouth = c.toScreen(K.sx, GY - K.h); },
      over: () => {
        const fade = 1 - q01(t, tLegal, .4);
        if (fade > 0 && mouth) Q.forEach((q, i) => { const k = t - tq[i]; if (k < 0) return; const pq = eBack(clamp(k / .4, 0, 1)), x = i % 2 ? 790 : 290, y = 300 + Math.floor(i / 2) * 200;
          ctx.save(); ctx.globalAlpha *= fade; ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(mouth[0], mouth[1]); ctx.lineTo(lerp(mouth[0], x, pq), lerp(mouth[1], y + 60, pq)); ctx.stroke(); ctx.setLineDash([]);
          ctx.translate(x, y); ctx.scale(pq, pq); ctx.rotate((i % 2 ? 1 : -1) * .04 + Math.sin(t * 2 + i) * .02); rr(ctx, -215, -70, 430, 140, 18); ctx.fillStyle = i === tq.length - 1 && k < 1.2 ? GOLD : CREAM; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(-160, 0, 44, 0, TAU); ctx.fillStyle = q.col || ORANGE; ctx.fill(); ol(ctx, 4); icon(ctx, q.icon || "help", -160, 0, 50, "#FFFFFF", 5);
          const L = lines2(ctx, q.text, 270, 40, 900); L.L.forEach((l, j) => textC(ctx, l, 50, (j - (L.L.length - 1) / 2) * L.size * 1.1 + L.size * .36, L.size, BROWN, 900)); ctx.restore(); });
        if (t >= tLegal){ stampBox(ctx, K.legalText || "LEGAL & LOGIS", 540, 330, t - tLegal, GREEN, 76, -.05); if (t - tLegal < .9) burstFx(ctx, 540, 330, t - tLegal, GREEN, 12, 260);
          (K.checks || []).forEach((cc, i) => { if (t >= chk[i]) popChip(ctx, "✓ " + cc.text, 540, 470 + i * 84, t - chk[i], GREEN, "#FFFFFF", 40); }); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.empat || {}; (K.tags || []).forEach(q => add(cueT(s, q.cue, .3, i), "pop")); if (K.legalCue) add(cueT(s, K.legalCue, .3, i), "chime"); (K.checks || []).forEach(c => add(cueT(s, c.cue, .3, i), "pop")); });

  /* ================= SC47: _tolak (four checks over the sack, CAIRKAN stays red, cut to see-through savings) ================= */
  TT.scene(PX + "tolak", "Cerita: kafe, empat pertanyaan di atas karung (tiga dijawab, CAIRKAN? merah), menolak sopan, lalu rumah: uang masuk kotak simpanan bening yang dipahami", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ top: 1330, sackX: 540 }, f.tolak || {});
    const tAsk = T(s, K.askCue, .3, idx), tFail = T(s, K.failCue, .3, idx), tNo = T(s, K.noCue, .3, idx), tCut = T(s, K.cutCue, .2, idx), tDrop = T(s, K.dropCue, .3, idx);
    const labels = K.labels || ["UNTUNG?", "RISIKO?", "BIAYA?", "CAIRKAN?"];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plant: false }, envFront: false,
      back: () => { if (t < tCut) BG.kafe(ctx, t, { menuX: 560, winX: -80 }); else { BG.rumah(ctx, t); } },
      front: (c2, c, sts) => {
        if (t < tCut){ cafeTable(ctx, 140, 940, K.top, t, { cups: [260] }); const away = t >= tNo ? easeIO(clamp((t - tNo - .4) / .8, 0, 1)) : 0;
          karung(ctx, K.sackX - away * 900, K.top, 300, t, { wiggle: .6, mark: "?" }); const ex = t >= tNo ? lerp(640, 860, easeIO(clamp((t - tNo) / .7, 0, 1))) : 640; envelope(ctx, ex, K.top - 40, .75, -.05, "TABUNGAN"); return; }
        // home: see-through savings box on a cabinet
        rr(ctx, 520, 1330, 420, 320, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); rr(ctx, 540, 1360, 180, 120, 6); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 4; ctx.stroke(); rr(ctx, 740, 1360, 180, 120, 6); ctx.stroke();
        const k = t - tDrop, fill = k < 0 ? .45 : .45 + .55 * clamp((k - .5) / .6, 0, 1); clearBox(ctx, 730, 1330, 300, 280, fill, t, K.boxLabel || "SIMPANAN");
        if (k >= 0 && k < .7){ const q = k / .7; envelope(ctx, lerp(500, 730, q), lerp(1100, 1180, q) - Math.sin(q * Math.PI) * 160, .6 * (1 - q * .4), q * 2, "TABUNGAN"); }
        else if (k < 0){ const st = sts[0], h = handOf(st); envelope(ctx, h[0] + 40, h[1] + 20, .6, -.1, "TABUNGAN"); }
        if (k >= .7) stampBox(ctx, "PAHAM ✓", 730, 960, k - .7, GREEN, 54, -.1);
      },
      over: () => {
        if (t >= tAsk && t < tCut){ labels.forEach((lb, i) => { const k = t - tAsk - i * .35; if (k < 0) return; const ok = i < 3, red = !ok && t >= tFail, x = 180 + i * 240, y = 320;
          ctx.save(); const q = eBack(clamp(k / .3, 0, 1)); ctx.translate(x + (red ? Math.sin(t * 40) * 6 : 0), y); ctx.scale(q, q); rr(ctx, -112, -46, 224, 92, 20); ctx.fillStyle = ok ? (k > .4 ? GREEN : CREAM) : (red ? RED : CREAM); ctx.fill(); ol(ctx, 5);
          textC(ctx, (ok && k > .4 ? "✓ " : (red ? "✗ " : "")) + lb, 0, 12, 30, (ok && k > .4) || red ? "#FFFFFF" : BROWN, 900, 200); ctx.restore(); }); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tolak || {}; if (K.askCue){ const a = cueT(s, K.askCue, .3, i); [0, .35, .7, 1.05].forEach((d, j) => add(a + d + (j < 3 ? .4 : 0), "pop")); } if (K.failCue) add(cueT(s, K.failCue, .3, i), "ping"); if (K.noCue) add(cueT(s, K.noCue, .3, i) + .4, "whoosh"); if (K.dropCue){ add(cueT(s, K.dropCue, .3, i) + .6, "pop"); add(cueT(s, K.dropCue, .3, i) + 1, "chime"); } });

  BG.rumah = (ctx, t) => { // bright living room wall for SC47 home shot
    ctx.fillStyle = "#EAD9C3"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#D7BFA0"; ctx.fillRect(-2600, GY - 420, 6400, 260);
    rr(ctx, 60, 420, 360, 300, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = "#9DBB7A"; ctx.fillRect(60, 620, 360, 120); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(160 + Math.sin(t * .3) * 30, 500, 34, 0, TAU); ctx.arc(200 + Math.sin(t * .3) * 30, 490, 40, 0, TAU); ctx.fill(); ctx.restore(); rr(ctx, 60, 420, 360, 300, 14); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 16; ctx.stroke();
    rr(ctx, 640, 470, 220, 170, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 10; ctx.stroke(); ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.arc(750, 560, 40, 0, TAU); ctx.fill();
    ctx.fillStyle = "#B98152"; ctx.fillRect(-2600, GY - 160, 6400, 2000); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let y = GY - 110; y < GY + 600; y += 55){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  };

  /* ================= MS47 shared: ambulance, emergency keys, lock-screen card ================= */
  function ambulance(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.face || 1), s); const bob = Math.sin(t * 14) * (o.moving ? 3 : 0);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 0, 400, 30, 0, 0, TAU); ctx.fill(); ctx.translate(0, bob);
    ctx.beginPath(); ctx.moveTo(-380, -60); ctx.lineTo(-380, -380); ctx.lineTo(160, -380); ctx.lineTo(300, -250); ctx.lineTo(390, -220); ctx.lineTo(390, -60); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8);
    ctx.fillStyle = "#E8742C"; ctx.fillRect(-376, -200, 762, 46); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-376, -200, 762, 46);
    rr(ctx, 170, -360, 120, 110, 10); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5); rr(ctx, -330, -350, 130, 100, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = RED; ctx.fillRect(-90, -350, 40, 120); ctx.fillRect(-130, -310, 120, 40); ctx.save(); ctx.scale(o.face || 1, 1); textC(ctx, "AMBULANS", -40 * (o.face || 1), -100, 46, RED, 900); ctx.restore();
    const on = Math.floor(t * 6) % 2; [[-40, RED], [40, "#3E7DB5"]].forEach(([dx, col], i) => { rr(ctx, dx - 34, -414, 68, 34, 8); ctx.fillStyle = (i === on) ? col : hexA(col, .4); ctx.fill(); ol(ctx, 4); if (i === on) glowAt(ctx, dx, -400, 200, col, .45); });
    [-230, 250].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -50, 62, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(wx, -50, 26, 0, TAU); ctx.fillStyle = "#C9CED3"; ctx.fill(); ctx.save(); ctx.translate(wx, -50); ctx.rotate(o.moving ? -t * 12 : 0); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke(); ctx.restore(); });
    ctx.restore(); }
  function eKey(ctx, x, y, s, num, col, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
    if (o.glow) glowAt(ctx, 0, 0, 220, col, .45 + .15 * Math.sin(t * 5));
    rr(ctx, -22, 70, 44, 300, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); // blade
    ctx.beginPath(); ctx.moveTo(22, 250); ctx.lineTo(62, 250); ctx.lineTo(62, 286); ctx.lineTo(40, 300); ctx.lineTo(62, 316); ctx.lineTo(62, 350); ctx.lineTo(22, 350); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 7); ctx.beginPath(); ctx.arc(0, -66, 14, 0, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 3);
    ctx.beginPath(); ctx.arc(0, 8, 70, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .9); ctx.fill(); textC(ctx, num, 0, 30, 62, "#13223D", 900, 130); ctx.restore(); }
  function flame(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + Math.sin(t * 12) * .06)); ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(46, -10, 30, 30); ctx.quadraticCurveTo(0, 54, -30, 30); ctx.quadraticCurveTo(-46, -10, 0, -60); ctx.fillStyle = "#F2A03D"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.quadraticCurveTo(20, 10, 12, 28); ctx.quadraticCurveTo(0, 38, -12, 28); ctx.quadraticCurveTo(-20, 10, 0, -14); ctx.fillStyle = "#FFE08A"; ctx.fill(); ctx.restore(); }
  function lockCard(ctx, x, y, k, t, o){ o = o || {}; if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.rotate(-.03);
    rr(ctx, -200, -250, 400, 500, 40); ctx.fillStyle = "#1E2A48"; ctx.fill(); ctx.strokeStyle = "#13223D"; ctx.lineWidth = 12; ctx.stroke(); ol(ctx, 4);
    textC(ctx, "17.45", 0, -150, 70, "#FFFFFF", 800); textC(ctx, "Minggu", 0, -104, 26, hexA("#FFFFFF", .7), 700);
    const r = o.reveal || 0; if (r > 0){ ctx.save(); ctx.globalAlpha *= clamp(r * 2, 0, 1); rr(ctx, -170, -70, 340, 70, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, "✱ INFO DARURAT", 0, -24, 32, "#FFFFFF", 900, 310);
      rr(ctx, -170, 14, 340, 180, 16); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textL(ctx, o.name || "Pak Harun", -150, 60, 28, BROWN, 800, 300);
      if (r > .5){ const g = o.hl ? .5 + .5 * Math.sin(t * 8) : 0; rr(ctx, -156, 90, 312, 86, 14); ctx.fillStyle = o.hl ? hexA(GREEN, .7 + .3 * g) : hexA(GREEN, .85); ctx.fill(); ol(ctx, 3);
        icon(ctx, "phone", -116, 133, 40, "#FFFFFF", 5); textL(ctx, o.contact || "Anak: Dina", -82, 146, 32, "#FFFFFF", 900, 230); } ctx.restore(); }
    ctx.restore(); }
  function signal(ctx, x0, y0, x1, y1, t, k){ if (k <= 0) return; for (let i = 0; i < 4; i++){ const q = ((t * 1.2) + i / 4) % 1; const x = lerp(x0, x1, q), y = lerp(y0, y1, q) - Math.sin(q * Math.PI) * 120; ctx.save(); ctx.globalAlpha = k * Math.sin(q * Math.PI);
      ctx.strokeStyle = "#7CFFB2"; ctx.lineWidth = 8; ctx.lineCap = "round"; const a = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.arc(x, y, 34, a - .9, a + .9); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 58, a - .7, a + .7); ctx.stroke(); ctx.restore(); } }

  /* ================= MS47: _jatuh (old man collapses in the park, search bar typing) ================= */
  TT.scene(PX + "jatuh", "Cerita: taman sore, seorang bapak bertongkat tiba-tiba jatuh, pelari panik meraih ponsel, kolom pencarian mengetik 'nomor ambulans...' dengan putaran memuat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.jatuh || {});
    const tFall = T(s, K.fallCue, .3, idx), tType = T(s, K.typeCue, .3, idx), tQ = T(s, K.qCue, .3, idx);
    const man = Object.assign({ x: 960, size: 640, face: -1 }, K.man || {});
    base(ctx, s, t, { env: "park", envOpt: { time: "day", bench: true, benchX: 1250, treeX: -200 }, envFront: false,
      back: () => { const st = toonState(man, s, t), fq = t < tFall ? 0 : easeOut(clamp((t - tFall) / .4, 0, 1)); const ang = -.32 * fq + (t > tFall + .4 ? Math.sin((t - tFall - .4) * 18) * .05 * Math.exp(-(t - tFall - .4) * 4) : 0);
        if (t >= tFall){ st.expr = "scared"; st.pose = fq > .5 ? "sit" : "shock"; st.y = st.y + fq * 16 * st.size / 92; }
        ctx.save(); ctx.translate(st.x, GY); ctx.rotate(ang); ctx.translate(-st.x, -GY); TT.drawToon(ctx, man, st, t); ctx.restore();
        // cane
        const cq = t < tFall ? 0 : clamp((t - tFall) / .6, 0, 1); ctx.save(); ctx.translate(st.x - 120 - cq * 160, GY - 150 + cq * 120 - Math.sin(cq * Math.PI) * 220); ctx.rotate(-.2 + cq * 5); ctx.strokeStyle = "#6B4429"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -140); ctx.lineTo(0, 150); ctx.arc(-24, -140, 24, 0, Math.PI, true); ctx.stroke(); ctx.restore();
        if (t >= tFall && t < tFall + 1) burstFx(ctx, st.x - 60, GY - 80, t - tFall - .3, RED, 10, 200);
        if (t >= tFall + .5){ const hx = st.x + 170, a = .6 + .4 * Math.sin(t * 9); ctx.save(); ctx.translate(hx, GY - 330); ctx.scale(a * .3 + .8, a * .3 + .8); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -30, -60, 0, -30); ctx.bezierCurveTo(30, -60, 60, -10, 0, 30); ctx.fill(); ol(ctx, 4); ctx.restore(); }
      },
      over: () => {
        if (t >= tType){ const k = t - tType, q = eBack(clamp(k / .35, 0, 1)), full = K.typeText || "nomor ambulans berapa ya", n = Math.min(full.length, Math.floor(k * 14)), typo = k > 1 && k < 1.4 ? "nomr" : null;
          ctx.save(); ctx.translate(540 + Math.sin(t * 50) * 3, 330); ctx.scale(q, q); rr(ctx, -400, -56, 800, 112, 56); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-346, -6, 18, 0, TAU); ctx.moveTo(-333, 7); ctx.lineTo(-318, 22); ctx.stroke();
          const txt = (typo || full.slice(0, n)) + (Math.floor(t * 3) % 2 ? "|" : ""); textL(ctx, txt, -300, 14, 38, BROWN, 700, 560);
          ctx.save(); ctx.translate(340, 0); ctx.rotate(t * 8); ctx.strokeStyle = ORANGE; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 4.4); ctx.stroke(); ctx.restore(); ctx.restore(); }
        if (t >= tQ && t < tType) popWord(ctx, K.qText || "NOMOR BERAPA?!", 540, 340, t - tQ, { size: 92, hold: 2.2, col: RED });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.jatuh || {}; if (K.fallCue){ add(cueT(s, K.fallCue, .3, i) + .4, "pop"); } if (K.typeCue) add(cueT(s, K.typeCue, .3, i), "pop"); if (K.qCue) add(cueT(s, K.qCue, .3, i), "ping"); });

  /* ================= MS47: _sambung (park ranger shouts 1-1-2, call connects, ambulance dispatched) ================= */
  TT.scene(PX + "sambung", "Cerita: jalan di tepi taman, penjaga taman berlari berteriak 1-1-2, sinyal panggilan ke menara, ambulans melaju di belakang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ caller: 0, towerX: 960 }, f.sambung || {});
    const tBig = T(s, K.bigCue, .3, idx), tConn = T(s, K.connCue, .3, idx), tAmb = T(s, K.ambCue, .3, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      back: () => { const x = K.towerX; ctx.save(); ctx.strokeStyle = "#8C8C94"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x - 90, GY - 260); ctx.lineTo(x, GY - 1060); ctx.lineTo(x + 90, GY - 260); ctx.stroke();
        for (let y = GY - 1000; y < GY - 260; y += 90){ const w = (y - (GY - 1060)) / 800 * 90; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x + w, y + 90); ctx.moveTo(x + w, y); ctx.lineTo(x - w, y + 90); ctx.lineWidth = 4; ctx.stroke(); }
        ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, GY - 1070, 14, 0, TAU); ctx.fill(); if (t >= tConn){ glowAt(ctx, x, GY - 1070, 90, "#7CFFB2", .5 + .3 * Math.sin(t * 8)); } ctx.restore();
        if (t >= tAmb){ const q = clamp((t - tAmb) / 3, 0, 1); ambulance(ctx, lerp(1700, -700, q), GY - 210, .42, t, { face: -1, moving: true }); } },
      over: (c2, c, sts) => {
        if (t >= tBig && t < tConn + .3){ ["1", "1", "2"].forEach((d, i) => popWord(ctx, d, 330 + i * 210, 360, t - tBig - i * .22, { size: 200, hold: 2.4 - i * .22, col: i === 2 ? HL : GOLD, rot: -4 + i * 4 })); }
        if (t >= tConn){ const st = sts[K.caller]; if (st){ const hp = c.toScreen(...toonHead(st)), tw = c.toScreen(K.towerX, GY - 1070); signal(ctx, hp[0] + 60, hp[1] - 40, tw[0], tw[1], t, clamp((t - tConn) / .3, 0, 1)); }
          popChip(ctx, "✓ TERSAMBUNG 112", 540, 330, t - tConn, GREEN, "#FFFFFF", 46); }
        if (t >= tAmb) popChip(ctx, "AMBULANS DIKIRIM", 540, 440, t - tAmb, RED, "#FFFFFF", 40);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.sambung || {}; if (K.bigCue){ const a = cueT(s, K.bigCue, .3, i); [0, .22, .44].forEach(d => add(a + d, "pop")); } if (K.connCue) add(cueT(s, K.connCue, .3, i), "chime"); if (K.ambCue) add(cueT(s, K.ambCue, .3, i), "whoosh"); });

  /* ================= MS47: _kunci (key ring: 112 master + 110, 113, 119) ================= */
  TT.scene(PX + "kunci", "Cerita: panggung navy, gantungan kunci raksasa, kunci 112 emas (darurat terpadu, bebas pulsa) lalu 110 polisi, 113 pemadam, 119 ambulans meluncur masuk", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ rx: 540, ry: 400 }, f.kunci || {});
    const keys = K.keys || [], tk = keys.map(k => T(s, k.cue, .3, idx)), tInfo = (K.info || []).map(x => T(s, x.cue, .3, idx));
    const xs = [220, 470, 690, 900];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => { // ring + chains
        ctx.save(); ctx.strokeStyle = GOLD; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(K.rx, K.ry, 90, 0, TAU); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(K.rx, K.ry, 101, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(K.rx, K.ry, 79, 0, TAU); ctx.stroke(); ctx.restore();
        glowAt(ctx, K.rx, K.ry, 160, GOLD, .25);
        keys.forEach((k, i) => { const T0 = tk[i]; if (t < T0) return; const q = eOut(clamp((t - T0) / .45, 0, 1)), sw = Math.sin((t - T0) * 6) * .25 * Math.exp(-(t - T0) * 1.6) + Math.sin(t * 1.5 + i) * .03;
          const bx = lerp(K.rx, xs[i], q), by = lerp(K.ry + 60, k.big ? 700 : 660, q);
          ctx.strokeStyle = "#C9CED3"; ctx.lineWidth = 6; ctx.setLineDash([14, 8]); ctx.beginPath(); ctx.moveTo(K.rx + (xs[i] - K.rx) * .15, K.ry + 80); ctx.lineTo(bx, by - (k.big ? 120 : 100)); ctx.stroke(); ctx.setLineDash([]);
          ctx.save(); ctx.translate(bx, by - (k.big ? 120 : 100)); ctx.rotate(sw); ctx.translate(-bx, -(by - (k.big ? 120 : 100))); eKey(ctx, bx, by, k.big ? 1.15 : .9, k.num, k.col, t, { glow: k.big && t - T0 < 3 }); ctx.restore(); });
      },
      over: (c2, c) => {
        keys.forEach((k, i) => { if (t < tk[i] || k.big) return; const p = c.toScreen(xs[i], 1080), kk = t - tk[i] - .3; popChip(ctx, k.label, p[0], Math.min(1210, p[1]), kk, k.col === "#FFFFFF" ? NAVY : k.col, "#FFFFFF", 28);
          if (kk > 0){ const ip = c.toScreen(xs[i], 470), q = eBack(clamp(kk / .35, 0, 1)); ctx.save(); ctx.translate(ip[0], ip[1]); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5);
            if (k.ic === "fire") flame(ctx, 0, 6, .7, t); else if (k.ic === "cross"){ ctx.fillStyle = RED; ctx.fillRect(-10, -30, 20, 60); ctx.fillRect(-30, -10, 60, 20); } else icon(ctx, k.ic || "shield", 0, 0, 52, "#3E7DB5", 5); ctx.restore(); } });
        const end = tk.length > 1 ? tk[1] : 1e9; (K.info || []).forEach((x, i) => { if (t >= tInfo[i] && t < end + .3){ ctx.save(); ctx.globalAlpha *= 1 - q01(t, end, .3); popChip(ctx, x.text, 720, 620 + i * 100, t - tInfo[i], i ? GREEN : GOLD, i ? "#FFFFFF" : BROWN, 38); ctx.restore(); } });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kunci || {}; (K.keys || []).forEach((k, j) => { add(cueT(s, k.cue, .3, i), j ? "whoosh" : "chime"); add(cueT(s, k.cue, .3, i) + .45, "pop"); }); (K.info || []).forEach(x => add(cueT(s, x.cue, .3, i), "pop")); });

  /* ================= MS47: _ambulans (paramedic opens the lock-screen emergency info, light streak to the daughter) ================= */
  TT.scene(PX + "ambulans", "Cerita: senja, ambulans dengan lampu berkedip, petugas membuka info darurat di layar kunci ponsel si bapak, cahaya melesat ke anaknya; potong ke anak yang menerima telepon", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ medic: 0 }, f.ambulans || {});
    const tOpen = T(s, K.openCue, .3, idx), tInfo = T(s, K.infoCue, .3, idx), tNum = T(s, K.numCue, .3, idx), tCut = T(s, K.cutCue, .2, idx);
    base(ctx, s, t, { envFront: false,
      back: () => { if (t < tCut) ambulance(ctx, 760, GY - 30, .95, t, { face: -1 }); },
      over: (c2, c, sts) => {
        if (t < tCut){ const k = t - tOpen; lockCard(ctx, 760, 470, k, t, { reveal: t < tInfo ? 0 : clamp((t - tInfo) / .5, 0, 1), hl: t >= tNum, name: K.name, contact: K.contact });
          if (t >= tNum){ const q = clamp((t - tNum - .4) / .8, 0, 1); if (q > 0 && q < 1){ const x = lerp(860, 1180, q), y = lerp(600, 120, q); ctx.save(); ctx.strokeStyle = "#7CFFB2"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.globalAlpha = 1 - q * .3; ctx.beginPath(); ctx.moveTo(lerp(860, 1180, Math.max(0, q - .25)), lerp(600, 120, Math.max(0, q - .25))); ctx.lineTo(x, y); ctx.stroke(); sparkle(ctx, x, y, 30, "#FFFFFF"); ctx.restore(); } } }
        else { const k = t - tCut; if (k > .2){ const st = sts[0]; if (st){ const hp = c.toScreen(...toonHead(st)); for (let i = 0; i < 3; i++){ const q = ((t * 1.4) + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = GREEN; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(hp[0] + 150, hp[1] - 40, 30 + q * 90, -.9, .9); ctx.stroke(); ctx.restore(); } } }
          popChip(ctx, K.callText || "KELUARGA DIKABARI", 540, 330, k - .3, GREEN, "#FFFFFF", 44); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ambulans || {}; if (K.openCue) add(cueT(s, K.openCue, .3, i), "pop"); if (K.infoCue) add(cueT(s, K.infoCue, .3, i), "ping"); if (K.numCue) add(cueT(s, K.numCue, .3, i) + .4, "whoosh"); if (K.cutCue) add(cueT(s, K.cutCue, .2, i) + .4, "chime"); });

  /* ================= SB48 shared: suitcase, dream bubble, wall calendar, cinema, mind-reading helmet ================= */
  function suitcase(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-30, -250); ctx.lineTo(-30, -400); ctx.lineTo(30, -400); ctx.lineTo(30, -250); ctx.stroke();
    rr(ctx, -110, -260, 220, 240, 22); ctx.fillStyle = col || "#2F6F73"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA("#FFFFFF", .35); ctx.lineWidth = 6; [-50, 0, 50].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx, -240); ctx.lineTo(dx, -40); ctx.stroke(); });
    rr(ctx, -60, -170, 120, 40, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); [-70, 70].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -10, 14, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }); ctx.restore(); }
  function dreamBubble(ctx, x, y, r, t, o){ o = o || {}; if (r <= 0) return; ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 10); const wob = 1 + Math.sin(t * 5) * .03;
    ctx.scale(wob, 2 - wob); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, "rgba(255,255,255,.55)"); g.addColorStop(.7, "rgba(190,230,255,.22)"); g.addColorStop(1, "rgba(255,190,240,.5)");
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = 6; ctx.stroke();
    // mini chart inside
    const bars = [.35, .55, .45, .8]; bars.forEach((b, i) => { const h = r * .9 * b * (.85 + .15 * Math.sin(t * 3 + i)); rr(ctx, -r * .55 + i * r * .3, r * .45 - h, r * .2, h, 6); ctx.fillStyle = [TEAL, ORANGE, "#5B7DB1", GREEN][i]; ctx.fill(); ol(ctx, 3); });
    textC(ctx, o.text || "ANALISIS DATA", 0, -r * .58, r * .16, NAVY, 900, r * 1.5); ctx.beginPath(); ctx.ellipse(-r * .45, -r * .45, r * .18, r * .08, -.7, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .8); ctx.fill(); ctx.restore(); }
  function dreamPoster(ctx, x, y, q, age, fall, t){ if (q <= 0) return; ctx.save(); ctx.translate(x, y - 160); ctx.rotate(fall * .5 + Math.sin(t * 2) * .01 * (1 - fall)); ctx.translate(0, 160); ctx.scale(q, q);
    rr(ctx, -150, -190, 300, 380, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); rr(ctx, -150, -190, 300, 80, 10); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, "IMPIANKU", 0, -138, 36, "#FFFFFF", 900);
    textC(ctx, "ANALISIS DATA", 0, -72, 32, NAVY, 900, 270); const bars = [.35, .55, .45, .85]; bars.forEach((b, i) => { const h = 200 * b * (.9 + .1 * Math.sin(t * 3 + i)); rr(ctx, -110 + i * 60, 160 - h, 40, h, 6); ctx.fillStyle = [TEAL, ORANGE, "#5B7DB1", GREEN][i]; ctx.fill(); ol(ctx, 3); });
    if (age > 0){ ctx.fillStyle = hexA("#B08A4A", .55 * age); rr(ctx, -150, -190, 300, 380, 10); ctx.fill(); ctx.fillStyle = hexA("#7A6A55", .5 * age); for (let i = 0; i < 40 * age; i++){ ctx.beginPath(); ctx.arc(-140 + rnd(i) * 280, -180 + rnd(i + 9) * 360, 3 + rnd(i + 4) * 4, 0, TAU); ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(150, 190); ctx.lineTo(150 - 70 * age, 190); ctx.lineTo(150, 190 - 70 * age); ctx.closePath(); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 4); }
    [[-130, -170], [130, -170]].forEach(([px, py], i) => { if (fall > 0 && i === 1) return; ctx.beginPath(); ctx.arc(px, py, 10, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); });
    ctx.restore(); }
  function dustFall(ctx, x, y, t, k){ if (k <= 0) return; for (let i = 0; i < 14; i++){ const q = ((t * .5) + rnd(i)) % 1; ctx.fillStyle = hexA("#E9DCC6", .8 * k * (1 - q)); ctx.beginPath(); ctx.arc(x - 160 + rnd(i + 3) * 320 + Math.sin(t + i) * 10, y - 200 + q * 420, 4, 0, TAU); ctx.fill(); } }
  function popDrops(ctx, x, y, k, r){ if (k < 0 || k > .6) return; const q = k / .6; ctx.save(); ctx.globalAlpha = 1 - q; for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = i % 2 ? "#BFE6FF" : "#FFFFFF"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * (.6 + q), y + Math.sin(a) * r * (.6 + q), 10 * (1 - q) + 3, 0, TAU); ctx.fill(); } ctx.restore(); }
  function wallCal(ctx, x, y, t, flipT, o){ o = o || {}; ctx.save(); ctx.translate(x, y); rr(ctx, -110, -20, 220, 250, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); rr(ctx, -110, -20, 220, 64, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
    const k = t - flipT, n = k < 0 ? 0 : Math.min(24, Math.floor(k * 14)), months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
    textC(ctx, months[(n + 10) % 12], 0, 26, 34, "#FFFFFF", 900); textC(ctx, String(2024 + Math.floor((n + 10) / 12)), 0, 150, 56, BROWN, 900);
    if (k >= 0 && n < 24){ const ph = (k * 14) % 1; ctx.save(); ctx.translate(0, 44); ctx.scale(1, 1 - ph); rr(ctx, -106, 0, 212, 180, 6); ctx.fillStyle = "#F3EDE4"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.arc(i * 40, -20, 8, 0, TAU); ctx.fillStyle = "#6B6470"; ctx.fill(); } ctx.restore(); }
  BG.bioskop = (ctx, t, o) => {
    ctx.fillStyle = "#2A1420"; ctx.fillRect(-2600, -1200, 6400, GY + 1600);
    for (let i = -6; i < 14; i++){ ctx.fillStyle = i % 2 ? "#3A1A28" : "#321624"; ctx.fillRect(i * 110, -1200, 110, GY + 1200); }
    [[-120, 560], [1200, 560]].forEach(([x, y]) => { glowAt(ctx, x, y, 200, "#FFB86B", .35); ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.moveTo(x - 30, y - 30); ctx.lineTo(x + 30, y - 30); ctx.lineTo(x + 18, y + 30); ctx.lineTo(x - 18, y + 30); ctx.closePath(); ctx.fill(); ol(ctx, 4); });
    // back rows of empty seats
    for (let r = 0; r < 2; r++) for (let i = -4; i < 14; i++){ const x = -200 + i * 150 + r * 75, y = GY - 560 + r * 120; rr(ctx, x - 62, y - 120, 124, 150, 30); ctx.fillStyle = r ? "#8E2A35" : "#7A2230"; ctx.fill(); ol(ctx, 5); }
    if (o.flicker){ const a = o.flicker * (.18 + .12 * Math.sin(t * 23) * Math.sin(t * 7)); ctx.fillStyle = hexA("#BFE2FF", Math.max(0, a)); ctx.fillRect(-2600, -1200, 6400, GY + 1600); }
  };
  function seatRow(ctx, y, t){ for (let i = -4; i < 14; i++){ const x = -150 + i * 170; rr(ctx, x - 75, y, 150, 220, 34); ctx.fillStyle = "#A33440"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 60, y + 16, 120, 30, 12); ctx.fillStyle = hexA("#FFFFFF", .15); ctx.fill(); } }
  function popcorn(ctx, x, y, s, t, spill){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(spill ? -.7 * spill : 0);
    for (let i = 0; i < 10; i++){ const px = -50 + (i % 5) * 25, py = -150 - (i > 4 ? 22 : 0) + Math.sin(t * 4 + i) * 2; ctx.fillStyle = i % 3 ? "#FFF4D6" : "#F6D77A"; ctx.beginPath(); ctx.arc(px, py, 18, 0, TAU); ctx.fill(); ol(ctx, 3); }
    ctx.beginPath(); ctx.moveTo(-70, -150); ctx.lineTo(70, -150); ctx.lineTo(50, 0); ctx.lineTo(-50, 0); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = RED; for (let i = -3; i <= 3; i += 2) ctx.fillRect(i * 22 - 11, -160, 22, 170); ctx.restore(); ol(ctx, 5); ctx.restore();
    if (spill){ for (let i = 0; i < 8; i++){ const q = clamp(spill * 1.4 - i * .05, 0, 1); ctx.fillStyle = "#FFF4D6"; ctx.beginPath(); ctx.arc(x - 60 - i * 26 * q, y - 120 * s + q * 260 + (i % 3) * 20, 14 * s, 0, TAU); ctx.fill(); ol(ctx, 3); } } }
  function helmet(ctx, R, t, o){ if (!R) return; o = o || {}; const r = R.r || 60, x = R.headX, y = R.top; ctx.save(); ctx.translate(x, y + r * .15);
    [-1, 1].forEach(sg => { ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sg * r * .5, -r * .3); ctx.quadraticCurveTo(sg * r * (.8 + Math.sin(t * 6) * .1), -r * 1.1, sg * r * .7, -r * 1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(sg * r * .7, -r * 1.55, r * .16, 0, TAU); ctx.fillStyle = Math.floor(t * 5 + sg) % 2 ? RED : GOLD; ctx.fill(); ol(ctx, 4); });
    ctx.beginPath(); ctx.ellipse(0, r * .1, r * 1.12, r * .7, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = "#C9CED3"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#9AA3A8"; ctx.fillRect(-r * 1.12, r * .02, r * 2.24, r * .16); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-r * 1.12, r * .02, r * 2.24, r * .16);
    // dial screen with static
    rr(ctx, -r * .5, -r * .5, r, r * .42, 8); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.beginPath(); ctx.rect(-r * .5, -r * .5, r, r * .42); ctx.clip();
    for (let i = 0; i < 40; i++){ ctx.fillStyle = hexA("#FFFFFF", rnd(i + Math.floor(t * 20) * 7) * .8); ctx.fillRect(-r * .5 + rnd(i * 3 + Math.floor(t * 20)) * r, -r * .5 + rnd(i * 5 + Math.floor(t * 20)) * r * .42, 6, 4); } ctx.restore();
    if (o.smoke) smoke(ctx, r * .7, -r * .6, t, o.smoke, { n: 5, h: 160, s: .6 });
    if (o.spark && Math.floor(t * 8) % 3 === 0) sparkle(ctx, -r * .9, -r * .6, 22, GOLD);
    ctx.restore(); }

  /* ================= SB48: _mimpi (colleague leaves for training, dream soap bubble, calendar flips 2 years) ================= */
  TT.scene(PX + "mimpi", "Cerita: kantor pagi, rekan berangkat pelatihan menarik koper sambil tersenyum, poster IMPIANKU di dinding kubikel menguning & berdebu saat kalender membalik dua tahun, paku lepas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ dreamer: 0, leaver: 1, calX: 600, calY: 420 }, f.mimpi || {});
    const tDream = T(s, K.dreamCue, .3, idx), tCal = T(s, K.calCue, .3, idx), tPop = T(s, K.popCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: "front", deskX: 300, rug: false, plant: true, plantX: 1050 },
      back: () => { wallCal(ctx, K.calX, K.calY, t, tCal, {}); const q = t < tDream ? 0 : eBack(clamp((t - tDream) / .5, 0, 1)), age = clamp((t - tCal) / 1.8, 0, 1), fall = t < tPop ? 0 : eBack(clamp((t - tPop) / .5, 0, 1));
        dreamPoster(ctx, K.px ?? 300, K.py ?? 640, q, age, fall, t); if (t >= tCal) dustFall(ctx, K.px ?? 300, K.py ?? 640, t, age); if (q > 0 && t - tDream < .9) burstFx(ctx, K.px ?? 300, K.py ?? 640, t - tDream, GOLD, 10, 220); },
      under: (c2, c, sts, j) => { if (j !== K.leaver) return; const st = sts[j], k = st.size / 760, fc = st.face || 1; suitcase(ctx, st.x - fc * 170 * k, GY, k * 1.05, "#2F6F73"); },
      front: () => {},
      over: (c2, c) => { if (t >= tCal){ const p = c.toScreen(K.calX, K.calY + 300); popChip(ctx, "2 TAHUN", clamp(p[0], 200, 880), Math.min(1180, p[1]), t - tCal - .3, RED, "#FFFFFF", 44); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.mimpi || {}; if (K.dreamCue) add(cueT(s, K.dreamCue, .3, i), "chime"); if (K.calCue) add(cueT(s, K.calCue, .3, i), "whoosh"); if (K.popCue) add(cueT(s, K.popCue, .5, i), "pop"); });

  /* ================= SB48: _bioskop (imagined film of the boss asking, reel runs out) ================= */
  TT.scene(PX + "bioskop", "Cerita: bioskop gelap, Andi sendirian dengan berondong, film khayalan atasan bertanya 'mau belajar apa?', lalu film habis: TIDAK TAYANG", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ viewer: 0 }, f.bioskop || {});
    const tFilm = T(s, K.filmCue, .2, idx), tAsk = T(s, K.askCue, .3, idx), tEnd = T(s, K.endCue, .2, idx), tStamp = T(s, K.stampCue, .3, idx);
    const boss = K.boss || {}, inFilm = t >= tFilm && t < tEnd;
    base(ctx, s, t, { env: "info", envFront: false,
      back: () => {
        if (inFilm){ // screen view
          ctx.fillStyle = "#1A0C14"; ctx.fillRect(-2600, -1200, 6400, GY + 1600); const sx = 540, sy = 860, W = 900, H = 1000;
          ctx.fillStyle = "#7A2230"; [[-1, 1]].forEach(() => {}); for (let sg of [-1, 1]){ ctx.beginPath(); ctx.moveTo(sx + sg * (W / 2 + 160), 200); ctx.quadraticCurveTo(sx + sg * (W / 2 - 10), 900, sx + sg * (W / 2 + 160), 1600); ctx.lineTo(sx + sg * 2000, 1600); ctx.lineTo(sx + sg * 2000, 200); ctx.closePath(); ctx.fill(); ol(ctx, 6); }
          rr(ctx, sx - W / 2, sy - H / 2, W, H, 10); ctx.fillStyle = "#F4EAD8"; ctx.fill(); ctx.save(); ctx.clip();
          ctx.fillStyle = "#E9D3B4"; ctx.fillRect(sx - W / 2, sy - H / 2, W, H); ctx.fillStyle = "#CF9C6C"; ctx.fillRect(sx - W / 2, sy + 260, W, 300); rr(ctx, sx - 380, sy - 420, 300, 260, 12); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 6);
          const a = Object.assign({ x: sx + 120, y: sy + 470, size: 760, face: -1 }, boss); const st = toonState(a, s, t); if (t >= tAsk){ st.talk = true; st.pose = "talk"; st.expr = "happy"; } TT.drawToon(ctx, a, st, t);
          // film grain + vignette
          for (let i = 0; i < 30; i++){ ctx.fillStyle = hexA("#2B1A12", .25 * rnd(i + Math.floor(t * 18) * 3)); ctx.fillRect(sx - W / 2 + rnd(i * 7 + Math.floor(t * 18)) * W, sy - H / 2 + rnd(i * 11 + Math.floor(t * 18)) * H, 4, 4 + rnd(i) * 30); }
          ctx.fillStyle = hexA("#000000", .06 + .05 * Math.sin(t * 31)); ctx.fillRect(sx - W / 2, sy - H / 2, W, H); ctx.restore(); rr(ctx, sx - W / 2, sy - H / 2, W, H, 10); ctx.strokeStyle = "#13090E"; ctx.lineWidth = 14; ctx.stroke();
          // projector beam dust
          ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.moveTo(sx - 60, 2400); ctx.lineTo(sx + 60, 2400); ctx.lineTo(sx + W / 2, sy + H / 2); ctx.lineTo(sx - W / 2, sy + H / 2); ctx.closePath(); ctx.fill(); ctx.restore();
          return; }
        BG.bioskop(ctx, t, { flicker: t < tEnd ? 1 : Math.max(0, 1 - (t - tEnd) * 3) });
      },
      front: (c2, c, sts) => { if (inFilm){ ctx.fillStyle = "#13090E"; for (let i = -2; i < 8; i++){ ctx.beginPath(); ctx.arc(i * 170 + 40, GY + 150, 110, Math.PI, 0); ctx.fill(); } const k = 1; ctx.beginPath(); ctx.arc(540, GY + 20, 110, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(540, GY + 60, 170, Math.PI, 0); ctx.fill(); return; }
        const st = sts[K.viewer]; if (!st) return; const spill = t >= tEnd ? clamp((t - tEnd - .4) / .8, 0, 1) : 0; const h = handOf(st); popcorn(ctx, h[0] + 40, h[1] + 60, .9, t, spill);
        seatRow(ctx, K.rowY || 1400, t); },
      over: (c2, c) => {
        if (inFilm && t >= tAsk){ TT.bubble(ctx, K.askText || "Andi, mau belajar apa?", 640, 560, t - tAsk, { kind: "say", size: 50, t }); }
        if (t >= tEnd && t < tEnd + .5){ ctx.save(); ctx.globalAlpha = 1 - (t - tEnd) / .5; ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
        if (t >= tStamp) stampBox(ctx, K.stampText || "TIDAK TAYANG", 540, 360, t - tStamp, RED, 80, -.08);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.bioskop || {}; if (K.filmCue) add(cueT(s, K.filmCue, .2, i), "whoosh"); if (K.askCue) add(cueT(s, K.askCue, .3, i), "pop"); if (K.endCue) add(cueT(s, K.endCue, .2, i), "whoosh"); if (K.stampCue) add(cueT(s, K.stampCue, .3, i), "ping"); });

  /* ================= SB48: _antena (boss is no mind reader: silly helmet with static, busy papers whirl) ================= */
  TT.scene(PX + "antena", "Cerita: trotoar depan kantor, rekan tertawa di samping koper; khayalan atasan memakai helm pembaca pikiran berantena yang cuma menangkap semut, kertas & telepon berputar karena sibuk", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ boss: 1, thinker: 0, leaver: 0 }, f.antena || {});
    const tImg = T(s, K.imgCue, .2, idx), tBusy = T(s, K.busyCue, .3, idx), tBack = T(s, K.backCue, .2, idx), img = t >= tImg && t < tBack;
    base(ctx, s, t, {
      back: (c2, c, sts) => { if (!img) return; const st = sts[K.thinker], b = sts[K.boss]; if (!st || !b) return; const hp = toonHead(st), bp = toonHead(b);
        for (let i = 0; i < 5; i++){ const q = ((t * .9) + i / 5) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .8; ctx.strokeStyle = "#8E5BB5"; ctx.lineWidth = 7; ctx.beginPath(); const x = lerp(hp[0] + 120, bp[0] - 60, q), y = lerp(hp[1] - 200, bp[1] - 260, q) - Math.sin(q * Math.PI) * 120; ctx.arc(x, y, 30, -1, 1); ctx.stroke(); ctx.restore(); } },
      under: (c2, c, sts, j) => { if (img || j !== K.leaver) return; const st = sts[j], k = st.size / 760, fc = st.face || 1; suitcase(ctx, st.x - fc * 170 * k, GY, k * 1.05, "#2F6F73"); },
      over1: (c2, c, sts, j, R) => { if (img && j === K.boss) helmet(ctx, R[j], t, { smoke: t >= tBusy ? 0 : .8, spark: true }); },
      front: (c2, c, sts) => { if (!img || t < tBusy) return; const b = sts[K.boss], bp = toonHead(b), k = t - tBusy;
        for (let i = 0; i < 8; i++){ const a = k * 3 + i / 8 * TAU, r = 300 + Math.sin(k * 2 + i) * 30, q = clamp(k * 2 - i * .08, 0, 1); if (q <= 0) continue; ctx.save(); ctx.translate(bp[0] + Math.cos(a) * r * q, bp[1] - 60 + Math.sin(a) * r * .6 * q); ctx.rotate(a * 2); if (i % 3 === 2) drawItem(ctx, "phone", 0, 60, t, { s: .8 }); else { rr(ctx, -50, -64, 100, 128, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#B9A58E"; for (let l = 0; l < 3; l++) ctx.fillRect(-34, -40 + l * 26, 68, 8); } ctx.restore(); } },
      over: (c2, c, sts) => { if (img){ const b = sts[K.boss]; if (b){ const p = c.toScreen(...toonHead(b)); popChip(ctx, "???", clamp(p[0], 200, 880), Math.max(300, p[1] - 300), t - tImg - .4, NAVY, GOLD, 44); } popChip(ctx, K.imgText || "PEMBACA PIKIRAN?", 540, 300, t - tImg - .1, "#8E5BB5", "#FFFFFF", 40);
          if (t >= tBusy) popWord(ctx, "SIBUK!", 540, 460, t - tBusy, { size: 110, hold: 1.4, col: RED }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.antena || {}; if (K.imgCue) add(cueT(s, K.imgCue, .2, i) + .4, "ping"); if (K.busyCue) add(cueT(s, K.busyCue, .3, i), "whoosh"); });

  /* ================= SB48: _ruang (boss room: 15-minute ring, three cards dealt, calendar KELAS circled) ================= */
  TT.scene(PX + "ruang", "Cerita: ruang atasan, cincin waktu 15 MENIT, tiga kartu dibagikan (INGIN, ALASAN, BANTUAN), atasan mencatat, kalender KELAS dilingkari", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({}, f.ruang || {});
    const tMin = T(s, K.minCue, .3, idx), cards = K.cards || [], tc = cards.map(c => T(s, c.cue, .3, idx)), tNote = T(s, K.noteCue, .3, idx), tCal = T(s, K.calCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: "front", deskX: 790, rug: true, rugX: 540, plant: true, plantX: 1060 },
      over: () => {
        if (t >= tMin){ const k = t - tMin, q = eBack(clamp(k / .4, 0, 1)), p = clamp(k / 6, 0, 1), fade = 1 - q01(t, tc[0] ?? 1e9, .3) * 0; ctx.save(); ctx.translate(150, 300); ctx.scale(q * .9, q * .9);
          ctx.beginPath(); ctx.arc(0, 0, 80, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 66, -Math.PI / 2, -Math.PI / 2 + TAU * p); ctx.closePath(); ctx.fillStyle = hexA(ORANGE, .8); ctx.fill(); textC(ctx, "15'", 0, 18, 50, BROWN, 900); ctx.restore(); }
        const cardsOut = q01(t, tCal, .35); if (cardsOut < 1) cards.forEach((cd, i) => { const k = t - tc[i]; if (k < 0) return; const fl = clamp(k / .45, 0, 1), sx = Math.abs(Math.cos((1 - fl) * Math.PI / 2 + (fl < 1 ? 0 : 0))) * 1, x = 250 + i * 290, y = 470 - cardsOut * 400;
          ctx.save(); ctx.globalAlpha *= 1 - cardsOut; ctx.translate(lerp(150, x, eOut(fl)), y + (1 - eOut(fl)) * 500); ctx.rotate((i - 1) * .07 + (1 - fl) * -1.2); ctx.scale(Math.max(.05, Math.sin(fl * Math.PI / 2)), 1);
          rr(ctx, -125, -150, 250, 300, 20); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -125, -150, 250, 64, 20); ctx.fillStyle = cd.col || ORANGE; ctx.fill(); ol(ctx, 6); textC(ctx, cd.tag, 0, -104, 34, "#FFFFFF", 900, 220);
          icon(ctx, cd.icon || "star", 0, -20, 70, cd.col || ORANGE, 6); const L = lines2(ctx, cd.text, 210, 32, 900); L.L.forEach((l, j) => textC(ctx, l, 0, 70 + j * L.size * 1.1, L.size, BROWN, 900)); ctx.restore(); });
        if (t >= tCal){ const k = t - tCal, q = eBack(clamp(k / .45, 0, 1)); ctx.save(); ctx.translate(540, 450); ctx.scale(q, q); ctx.rotate(-.03); rr(ctx, -260, -190, 520, 380, 20); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7); rr(ctx, -260, -190, 520, 80, 20); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7);
          textC(ctx, K.month || "BULAN DEPAN", 0, -136, 40, "#FFFFFF", 900, 460); for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 7; c2++){ const x = -210 + c2 * 70, y = -60 + r * 80; rr(ctx, x - 26, y - 26, 52, 52, 8); ctx.fillStyle = "#F3EDE4"; ctx.fill(); }
          const cx = -210 + 4 * 70, cy = 20; rr(ctx, cx - 120, cy - 30, 240, 60, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 4); textC(ctx, K.classText || "KELAS DATA", cx, cy + 12, 30, "#FFFFFF", 900, 220);
          const dq = clamp((k - .5) / .6, 0, 1); if (dq > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(cx, cy, 150, 58, -.05, -1.6, -1.6 + TAU * dq); ctx.stroke(); } ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ruang || {}; if (K.minCue) add(cueT(s, K.minCue, .3, i), "pop"); (K.cards || []).forEach(c => add(cueT(s, c.cue, .3, i), "whoosh")); if (K.calCue){ add(cueT(s, K.calCue, .3, i), "pop"); add(cueT(s, K.calCue, .3, i) + .6, "chime"); } });

  BG.atap = (ctx, t) => { // office rooftop: concrete floor, railing, water tank, potted plant
    ctx.fillStyle = "#B9B3A8"; ctx.fillRect(-2600, GY - 260, 6400, 2400); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let x = -2600; x < 3800; x += 160){ ctx.beginPath(); ctx.moveTo(x, GY - 260); ctx.lineTo(x - 200, GY + 800); ctx.stroke(); }
    ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-2600, GY - 470); ctx.lineTo(3800, GY - 470); ctx.moveTo(-2600, GY - 370); ctx.lineTo(3800, GY - 370); ctx.stroke(); for (let x = -2600; x < 3800; x += 150){ ctx.beginPath(); ctx.moveTo(x, GY - 480); ctx.lineTo(x, GY - 260); ctx.stroke(); }
    const wx = 1010; rr(ctx, wx - 110, GY - 860, 220, 300, 20); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#6B6470"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(wx - 90, GY - 560); ctx.lineTo(wx - 90, GY - 300); ctx.moveTo(wx + 90, GY - 560); ctx.lineTo(wx + 90, GY - 300); ctx.stroke();
    ctx.save(); ctx.translate(60, GY - 300); potPlant(ctx, 1.6, t, ""); ctx.restore();
  };

  /* ================= SP48 shared: batik workshop, cloth, canting, track, tumpeng ================= */
  function batikCloth(ctx, x, y, w, h, col, motif, ink){ ctx.save(); rr(ctx, x, y, w, h, 6); ctx.fillStyle = col; ctx.fill(); ctx.save(); ctx.clip(); ink = ink || "#3B2418"; ctx.strokeStyle = hexA(ink, .75); ctx.fillStyle = hexA(ink, .6); ctx.lineWidth = 4;
    if (motif === "parang"){ for (let k = -h; k < w + h; k += 46){ ctx.beginPath(); for (let i = 0; i <= 20; i++){ const q = i / 20, px = x + k + q * h, py = y + h - q * h + Math.sin(q * 20) * 8; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } }
    else { for (let yy = y + 30; yy < y + h; yy += 60) for (let xx = x + 30 + ((yy - y) / 60 % 2) * 30; xx < x + w; xx += 60){ for (let a = 0; a < 4; a++){ ctx.beginPath(); ctx.ellipse(xx + Math.cos(a * Math.PI / 2) * 12, yy + Math.sin(a * Math.PI / 2) * 12, 12, 6, a * Math.PI / 2, 0, TAU); ctx.fill(); } } }
    ctx.restore(); rr(ctx, x, y, w, h, 6); ol(ctx, 4); ctx.restore(); }
  BG.batik = (ctx, t, o) => {
    ctx.fillStyle = "#EAD6B4"; ctx.fillRect(-2600, -1200, 6400, GY + 1200); ctx.fillStyle = "#D9BF94"; ctx.fillRect(-2600, GY - 480, 6400, 320);
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(-2600, 300, 6400, 34); for (let x = -600; x < 2000; x += 520){ rr(ctx, x - 20, 300, 40, GY - 300, 6); ctx.fill(); ol(ctx, 4); }
    // drying lines with batik cloths
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-1200, 400); ctx.lineTo(2400, 400); ctx.stroke();
    const cols = ["#8E3B2E", "#2F4A6B", "#C9A04E", "#5A3A6B", "#3E6B4A", "#A0522D"]; for (let i = 0; i < 8; i++){ const x = -560 + i * 240, sw = Math.sin(t * 1.3 + i) * 4; ctx.save(); ctx.translate(x, 400); ctx.rotate(sw * .004); batikCloth(ctx, 0, 0, 200, 300 + (i % 3) * 40, cols[i % cols.length], i % 2 ? "parang" : "kawung", i % 3 === 2 ? "#FFF4E6" : "#2B1A12"); ctx.restore();
      ctx.fillStyle = "#C9A36A"; ctx.fillRect(x + 20, 392, 14, 20); ctx.fillRect(x + 166, 392, 14, 20); }
    // wax stove
    if (o.stove !== false){ const sx = o.stoveX ?? -60; rr(ctx, sx - 90, GY - 300, 180, 300, 14); ctx.fillStyle = "#B5524A"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(sx, GY - 310, 120, 34, 0, 0, Math.PI); ctx.fillStyle = "#4A4550"; ctx.fill(); ol(ctx, 5); smoke(ctx, sx, GY - 340, t, 1, { n: 6, h: 260, col: "#FFFFFF", s: .8 }); glowAt(ctx, sx, GY - 120, 90, "#FF8A3D", .5 + .2 * Math.sin(t * 9)); }
    ctx.fillStyle = "#A47A55"; ctx.fillRect(-2600, GY - 160, 6400, 2000); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let y = GY - 110; y < GY + 600; y += 55){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  };
  function foldStack(ctx, x, y, n, t){ const cols = ["#8E3B2E", "#2F4A6B", "#C9A04E", "#5A3A6B", "#3E6B4A"]; for (let i = 0; i < n; i++){ const yy = y - i * 26, wob = Math.sin(t * 2 + i) * (i > n - 3 ? 2 : 0); rr(ctx, x - 150 + wob, yy - 26, 300, 26, 6); ctx.fillStyle = cols[i % 5]; ctx.fill(); ol(ctx, 3); ctx.fillStyle = hexA("#FFF4E6", .35); ctx.fillRect(x - 140 + wob, yy - 18, 280, 4); } }
  function canting(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.5); ctx.strokeStyle = "#C9A36A"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(40, -40); ctx.lineTo(220, -200); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(20, -24, 36, 24, -.5, 0, TAU); ctx.fillStyle = "#C27A3A"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#C27A3A"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(-24, 14); ctx.stroke(); ctx.restore(); }
  function waxTrace(ctx, x0, y0, w, h, p, t){ // draws a flowing batik flower line, p = 0..1 progress; returns pen point
    const N = 160, pts = []; for (let i = 0; i <= N; i++){ const q = i / N; pts.push([x0 + q * w, y0 + h / 2 + Math.sin(q * TAU * 2) * h * .3 + Math.sin(q * TAU * 6) * h * .08]); }
    const n = Math.floor(clamp(p, 0, 1) * N); ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); for (let i = 0; i <= n; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.stroke();
    for (let i = 10; i <= n; i += 20){ const [px, py] = pts[i]; ctx.fillStyle = "#FFF4E6"; for (let a = 0; a < 5; a++){ ctx.beginPath(); ctx.ellipse(px + Math.cos(a * 1.256) * 18, py - 30 + Math.sin(a * 1.256) * 18, 12, 6, a * 1.256, 0, TAU); ctx.fill(); } }
    return pts[n]; }
  function cantingShot(ctx, t, T0, speed, o){ o = o || {}; const fx = o.fx ?? 380, fy = o.fy ?? 900, fw = o.fw ?? 620, fh = o.fh ?? 400;
    ctx.fillStyle = "#8E5A34"; rr(ctx, fx - 30, fy - 30, fw + 60, 26, 6); ctx.fill(); ol(ctx, 4); [fx - 20, fx + fw + 4].forEach(px => { rr(ctx, px, fy - 30, 16, GY - fy + 30, 4); ctx.fill(); ol(ctx, 3); });
    batikCloth(ctx, fx, fy, fw, fh, "#D9B27A", "none"); ctx.save(); ctx.fillStyle = "#D9B27A"; rr(ctx, fx + 2, fy + 2, fw - 4, fh - 4, 6); ctx.fill(); ctx.restore();
    const p = clamp((t - T0) * speed, 0, 1), pen = waxTrace(ctx, fx + 40, fy + 60, fw - 80, fh - 120, p, t), jit = o.fast ? Math.sin(t * 30) * 6 : 0;
    canting(ctx, pen[0] + jit, pen[1], 1.1, t); if (o.fast){ for (let i = 0; i < 4; i++){ const q = ((t * 1.3) + i / 4) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(pen[0] + 60 + i * 30, pen[1] - 120 - q * 220); ctx.fillStyle = i % 2 ? ORANGE : TEAL; ctx.font = "900 70px Poppins"; ctx.fillText(i % 2 ? "♪" : "♫", 0, 0); ctx.restore(); } } }

  /* ================= SP48: _tumpuk (300 folded cloths, TARGET 400 slapped on the post) ================= */
  TT.scene(PX + "tumpuk", "Cerita: bengkel batik sore, tumpukan kain terlipat naik sampai 300, manajer melirik lalu menempel kertas TARGET 400 di tiang dan pergi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ sx: 650, from: 262, to: 300 }, f.tumpuk || {});
    const tCount = T(s, K.countCue, .3, idx), tDone = T(s, K.doneCue, .3, idx), tSlap = T(s, K.slapCue, .3, idx);
    const n = t < tCount ? K.from : Math.round(lerp(K.from, K.to, clamp((t - tCount) / 1.6, 0, 1)));
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plant: false }, envFront: false,
      back: () => { BG.batik(ctx, t, { stoveX: -80 });
        rr(ctx, K.sx - 22, 300, 44, GY - 300, 6); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4);
        if (t >= tSlap){ const k = t - tSlap, q = k < .2 ? 2.2 - 1.2 * (k / .2) : 1; ctx.save(); ctx.translate(K.sx, 700); ctx.scale(q, q); ctx.rotate(-.05); rr(ctx, -150, -110, 300, 220, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
          textC(ctx, "TARGET", 0, -40, 44, BROWN, 900); textC(ctx, "400", 0, 70, 110, RED, 900); ctx.fillStyle = "#C9CED3"; ctx.beginPath(); ctx.arc(0, -96, 10, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); if (k < .9) burstFx(ctx, K.sx, 700, k - .15, RED, 10, 240); } },
      front: () => { foldStack(ctx, K.sx, GY - 20, Math.round(4 + (n - K.from) / (K.to - K.from) * 9), t); },
      over: () => { const t0 = Math.min(tCount - .3, 2.0), q = t < t0 ? 0 : eBack(clamp((t - t0) / .4, 0, 1)), done = t >= tDone; if (q > 0 && t < tSlap + .2){ ctx.save(); ctx.globalAlpha *= 1 - q01(t, tSlap, .2); ctx.translate(540, 330); ctx.scale(q, q); rr(ctx, -260, -70, 520, 140, 70); ctx.fillStyle = done ? GREEN : CREAM; ctx.fill(); ol(ctx, 7);
          textC(ctx, n + " / " + K.to + " KAIN", 0, 26, 62, done ? "#FFFFFF" : BROWN, 900, 460); ctx.restore(); if (done && t - tDone < .9) burstFx(ctx, 540, 330, t - tDone, GREEN, 12, 280); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tumpuk || {}; if (K.countCue){ const a = cueT(s, K.countCue, .3, i); for (let k = 0; k < 6; k++) add(a + k * .27, "pop"); } if (K.doneCue) add(cueT(s, K.doneCue, .3, i), "chime"); if (K.slapCue) add(cueT(s, K.slapCue, .3, i) + .15, "pop"); });

  /* ================= SP48: _finis (empty finish line, starter pistol for 400; cut to a slow canting) ================= */
  TT.scene(PX + "finis", "Cerita: khayalan lintasan lari, tim memutus pita 300 tapi tribun kosong (krik krik), manajer menembakkan pistol start ke 400; potong ke canting yang bergerak pelan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ fx: 820 }, f.finis || {});
    const tTape = T(s, K.tapeCue, .3, idx), tEmpty = T(s, K.emptyCue, .3, idx), tGun = T(s, K.gunCue, .3, idx), tCut = T(s, K.cutCue, .2, idx), tTalk = T(s, K.talkCue, .3, idx), tSlow = T(s, K.slowCue, .3, idx);
    const img = t < tCut;
    base(ctx, s, t, { envFront: false,
      back: () => {
        if (img){ // grandstand + track
          for (let r = 0; r < 4; r++){ const y = GY - 760 + r * 110; ctx.fillStyle = r % 2 ? "#9AA3A8" : "#B5BCC0"; ctx.fillRect(-1600, y, 4400, 110); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 3; for (let x = -1600; x < 2800; x += 90){ ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x, y + 100); ctx.stroke(); } }
          ctx.fillStyle = "#6B8E4A"; ctx.fillRect(-1600, GY - 320, 4400, 160); ctx.fillStyle = "#C4553D"; ctx.fillRect(-1600, GY - 160, 4400, 2000); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 6; for (let y = GY - 100; y < GY + 500; y += 90){ ctx.beginPath(); ctx.moveTo(-1600, y); ctx.lineTo(2800, y); ctx.stroke(); }
          const fx = K.fx; ctx.save(); ctx.beginPath(); ctx.rect(fx - 30, GY - 160, 60, 800); ctx.clip(); for (let yy = GY - 160; yy < GY + 640; yy += 30) for (let xx = fx - 30; xx < fx + 30; xx += 30){ ctx.fillStyle = ((xx + yy) / 30) % 2 ? "#FFFFFF" : OUT; ctx.fillRect(xx, yy, 30, 30); } ctx.restore();
          [fx - 330, fx + 330].forEach(px => { rr(ctx, px - 12, GY - 640, 24, 640, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); }); rr(ctx, fx - 200, GY - 720, 400, 90, 12); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "FINIS 300", fx, GY - 660, 50, BROWN, 900);
          if (t < tTape){ ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(fx - 330, GY - 400); ctx.quadraticCurveTo(fx, GY - 390 + Math.sin(t * 3) * 6, fx + 330, GY - 400); ctx.stroke(); }
          else { const k = clamp((t - tTape) / .6, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 10; [-1, 1].forEach(sg => { ctx.beginPath(); ctx.moveTo(fx + sg * 330, GY - 400); ctx.quadraticCurveTo(fx + sg * (330 - 150 * k), GY - 360 + k * 200, fx + sg * (330 - 140 * k) + Math.sin(t * 8) * 10, GY - 330 + k * 300); ctx.stroke(); }); }
          if (t >= tGun){ const k = t - tGun; ctx.save(); ctx.translate(K.gunX ?? 1240, GY - 1000); const q = eBack(clamp(k / .4, 0, 1)); ctx.scale(q, q); rr(ctx, -200, -80, 400, 160, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); textC(ctx, "START 400 →", 0, 22, 58, "#FFFFFF", 900, 370); ctx.restore(); }
          return; }
        BG.batik(ctx, t, { stoveX: 1150 }); cantingShot(ctx, t, tCut, .05, { fx: 380, fy: 880, fw: 640, fh: 420 });
      },
      over: (c2, c, sts) => {
        if (img && t >= tEmpty && t < tGun){ const k = t - tEmpty; ["krik...", "krik..."].forEach((w, i) => { const kk = k - i * .5; if (kk < 0) return; ctx.save(); ctx.globalAlpha = clamp(kk * 3, 0, 1) * clamp((2.2 - kk) * 2, 0, 1); textC(ctx, w, 300 + i * 420, 360 + i * 60 - kk * 20, 60, "#FFFFFF", 900); ctx.restore(); });
          popChip(ctx, K.emptyText || "TAK ADA YANG MENYAMBUT", 540, 470, k - .2, NAVY, "#FFFFFF", 36); }
        if (img && t >= tGun) popWord(ctx, "DOR!", 760, 420, t - tGun, { size: 140, hold: 1.0, col: RED });
        if (!img){ if (t >= tTalk){ const st = sts[0]; if (st){ const p = c.toScreen(...toonHead(st)); popChip(ctx, "· · ·", clamp(p[0] + 60, 200, 880), Math.max(300, p[1] - 260), t - tTalk, "#B9B3A8", "#FFFFFF", 50); } }
          if (t >= tSlow) popChip(ctx, K.slowText || "PELAN...", 540, 330, t - tSlow, "#6B6470", "#FFFFFF", 52); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.finis || {}; if (K.tapeCue) add(cueT(s, K.tapeCue, .3, i), "pop"); if (K.emptyCue) add(cueT(s, K.emptyCue, .3, i), "ping"); if (K.gunCue) add(cueT(s, K.gunCue, .3, i), "pop"); if (K.slowCue) add(cueT(s, K.slowCue, .3, i), "ping"); });

  /* ================= SP48: _grafik (night office: daily log sinking, realisation, rhythm line starts beating) ================= */
  TT.scene(PX + "grafik", "Cerita: kantor malam, catatan harian di dinding melambat (batang turun), manajer sadar, garis ritme datar mulai berdenyut saat pencapaian diakui", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ bx: 770, by: 520 }, f.grafik || {});
    const tChart = T(s, K.chartCue, .3, idx), tSlow = T(s, K.slowCue, .3, idx), tAck = T(s, K.ackCue, .3, idx), tBeat = T(s, K.beatCue, .3, idx);
    const vals = K.vals || [15, 12, 9, 6], days = ["SEN", "SEL", "RAB", "KAM"];
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: "front", deskX: 300, rug: false, plant: false },
      back: () => { const q = eBack(clamp((t - tChart) / .5, 0, 1)); if (t < tChart) return; ctx.save(); ctx.translate(K.bx, K.by + 250); ctx.scale(q, q); ctx.translate(-K.bx, -(K.by + 250));
        rr(ctx, K.bx - 270, K.by, 540, 500, 18); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 7); textC(ctx, "KAIN SELESAI / HARI", K.bx, K.by + 56, 34, BROWN, 900, 480);
        vals.forEach((v, i) => { const g = clamp((t - tChart - .3 - i * .25) / .4, 0, 1), h = v * 18 * g, x = K.bx - 190 + i * 125; rr(ctx, x - 40, K.by + 440 - h, 80, h, 8); ctx.fillStyle = i < 2 ? TEAL : RED; ctx.fill(); ol(ctx, 4); textC(ctx, days[i], x, K.by + 480, 26, BROWN, 800); if (g >= 1) textC(ctx, String(v), x, K.by + 428 - h, 30, BROWN, 900); });
        if (t >= tSlow){ const p = clamp((t - tSlow) / .6, 0, 1); arrowLine(ctx, K.bx - 200, K.by + 120, lerp(K.bx - 200, K.bx + 200, p), lerp(K.by + 120, K.by + 300, p), RED, 12, 1); }
        ctx.restore(); },
      over: () => { // rhythm line
        if (t >= tAck){ const k = t - tAck, beat = t >= tBeat, y0 = 300; ctx.save(); ctx.globalAlpha *= clamp(k * 3, 0, 1); rr(ctx, 100, y0 - 90, 880, 180, 30); ctx.fillStyle = hexA("#13223D", .85); ctx.fill(); ol(ctx, 5);
          ctx.strokeStyle = beat ? "#7CFFB2" : "#9AA3A8"; ctx.lineWidth = 8; ctx.lineJoin = "round"; ctx.beginPath(); for (let x = 130; x <= 950; x += 6){ let y = y0; if (beat){ const ph = ((x - 130) / 205 - (t - tBeat) * 1.6) % 1, u = ph < 0 ? ph + 1 : ph; y = y0 - (u > .4 && u < .48 ? 70 * Math.sin((u - .4) / .08 * Math.PI) : 0) + (u > .48 && u < .54 ? 40 * Math.sin((u - .48) / .06 * Math.PI) : 0); } x === 130 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
          popChip(ctx, beat ? "RITME TIM KEMBALI" : "DIAKUI?", 540, y0 + 128, k - .2, beat ? GREEN : ORANGE, "#FFFFFF", 36); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.grafik || {}; if (K.chartCue) add(cueT(s, K.chartCue, .3, i), "pop"); if (K.slowCue) add(cueT(s, K.slowCue, .3, i), "whoosh"); if (K.ackCue) add(cueT(s, K.ackCue, .3, i), "ping"); if (K.beatCue) add(cueT(s, K.beatCue, .3, i), "chime"); });

  /* ================= SP48: _tumpeng (small tumpeng, each named person gets a spotlight; canting dances again) ================= */
  function tumpeng(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 230, 46, 0, 0, TAU); ctx.fillStyle = "#C9A36A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#8E6A3A", .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 200, 36, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = "#3E9B5A"; ctx.beginPath(); ctx.ellipse(0, -8, 200, 34, 0, 0, TAU); ctx.fill();
    [[-150, "#D9483B"], [-90, "#F6C343"], [100, "#8E5A34"], [160, "#F28DB2"]].forEach(([dx, col]) => { ctx.beginPath(); ctx.ellipse(dx, -22, 34, 18, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); });
    ctx.beginPath(); ctx.moveTo(-110, -20); ctx.quadraticCurveTo(-30, -250, 0, -290); ctx.quadraticCurveTo(30, -250, 110, -20); ctx.closePath(); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.ellipse(-30, -150, 12, 60, .2, 0, TAU); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -296, 14, 0, TAU); ctx.fill(); ol(ctx, 3); smoke(ctx, 0, -300, t, .7, { n: 4, h: 140, col: "#FFFFFF", s: .5 }); ctx.restore(); }
  TT.scene(PX + "tumpeng", "Cerita: bengkel batik pagi, tumpeng kecil di meja, tiap nama disebut mendapat sorot lampu + pujian spesifik; potong ke canting yang menari cepat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ tx: 560, top: 1380 }, f.tumpeng || {});
    const spots = (K.spots || []).map(sp => Object.assign({ T: T(s, sp.cue, .2, idx), O: sp.outCue ? T(s, sp.outCue, .2, idx) : 1e9 }, sp)), tCut = T(s, K.cutCue, .2, idx), tIn = T(s, K.inCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plant: false }, envFront: false,
      back: () => { BG.batik(ctx, t, { stoveX: t < tCut ? -300 : 1150 }); if (t >= tCut) cantingShot(ctx, t, tCut, .6, { fx: 380, fy: 880, fw: 640, fh: 420, fast: true }); },
      under: (c2, c, sts, j) => { if (t >= tCut) return; spots.forEach(sp => { if (sp.on !== j || t < sp.T || t > sp.O + .3) return; const st = sts[j], a = clamp((t - sp.T) / .3, 0, 1) * (1 - clamp((t - sp.O) / .3, 0, 1)); ctx.save(); ctx.globalAlpha = a * .55; ctx.fillStyle = "#FFF1B8"; ctx.beginPath(); ctx.moveTo(st.x - 60, -400); ctx.lineTo(st.x + 60, -400); ctx.lineTo(st.x + 260, GY + 40); ctx.lineTo(st.x - 260, GY + 40); ctx.closePath(); ctx.fill(); ctx.restore();
        ctx.save(); ctx.globalAlpha = a * .6; ctx.fillStyle = "#FFF1B8"; ctx.beginPath(); ctx.ellipse(st.x, GY + 10, 250, 46, 0, 0, TAU); ctx.fill(); ctx.restore(); }); },
      front: () => { if (t >= tCut) return; rr(ctx, K.tx - 300, K.top, 600, 36, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); [K.tx - 250, K.tx + 250].forEach(x => { rr(ctx, x - 12, K.top + 30, 24, GY - K.top, 5); ctx.fill(); ol(ctx, 4); });
        const q = t < tIn ? 0 : eBack(clamp((t - tIn) / .5, 0, 1)); if (q > 0) tumpeng(ctx, K.tx, K.top, .72 * q, t); },
      over: (c2, c, sts) => { if (t >= tCut){ popWord(ctx, K.danceText || "MENARI LAGI!", 540, 360, t - tCut - .3, { size: 100, hold: 2.5, col: GREEN }); return; }
        spots.forEach(sp => { if (t < sp.T || t > sp.O) return; const st = sts[sp.on]; if (!st) return; const p = c.toScreen(...toonHead(st)); popChip(ctx, sp.text, clamp(p[0], 220, 860), Math.max(280, p[1] - 300), t - sp.T, sp.bg || ORANGE, "#FFFFFF", 40); for (let i = 0; i < 4; i++){ const a = t * 2 + i * 1.6; sparkle(ctx, p[0] + Math.cos(a) * 170, p[1] - 60 + Math.sin(a) * 110, 14, GOLD); } }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.tumpeng || {}; (K.spots || []).forEach(sp => add(cueT(s, sp.cue, .2, i), "chime")); if (K.inCue) add(cueT(s, K.inCue, .3, i), "pop"); });
})();
